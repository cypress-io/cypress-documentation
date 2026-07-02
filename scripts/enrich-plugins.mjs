#!/usr/bin/env node
// @ts-check
/**
 * Enriches the curated plugin list (src/data/plugins.json) with live trust
 * signals pulled from the npm registry and GitHub, writing the result to
 * src/data/plugins-generated.json.
 *
 * The generated file is consumed by the PluginsList component and is committed
 * to the repo so the site can build without network access. Re-run this script
 * periodically (or in CI on a schedule) to refresh the data:
 *
 *   npm run enrich:plugins
 *
 * Every network lookup is best-effort: if a request fails, the corresponding
 * field is simply omitted and the existing value (if any) is preserved, so a
 * flaky network or a blocked endpoint can never corrupt the committed data.
 */

import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import got from 'got'
import pMap from 'p-map'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const SOURCE = resolve(ROOT, 'src/data/plugins.json')
const OUTPUT = resolve(ROOT, 'src/data/plugins-generated.json')

const REGISTRY = 'https://registry.npmjs.org'
const DOWNLOADS = 'https://api.npmjs.org/downloads/point/last-week'
const GITHUB_API = 'https://api.github.com'
const CONCURRENCY = 6

// A pre-configured got instance handles the timeout, automatic retries, and
// JSON parsing that we'd otherwise wire up by hand.
const http = got.extend({
  timeout: { request: 15000 },
  retry: { limit: 2 },
  responseType: 'json',
  throwHttpErrors: false,
  headers: { accept: 'application/json' },
})

/** Fetch JSON. Returns the body on 2xx, `{ __status }` on an HTTP error, or
 *  null on a network/timeout failure (after retries). Never throws. */
async function fetchJson(url, headers = {}) {
  try {
    const res = await http(url, { headers })
    if (res.statusCode >= 200 && res.statusCode < 300) return res.body
    return { __status: res.statusCode }
  } catch {
    return null
  }
}

/** Look up a package's packument. The registry accepts scoped names
 *  (`@scope/name`) unencoded in the path. Returns:
 *   - { data }      on success,
 *   - { notFound }  on a definitive 404 (package does not exist), or
 *   - {}            on any transient failure (network error, timeout, 5xx),
 *  so callers can tell "genuinely gone" apart from "couldn't reach the registry". */
async function npmManifest(pkg) {
  const data = await fetchJson(`${REGISTRY}/${pkg}`)
  if (data && !data.__status && data.name) return { data }
  if (data && data.__status === 404) return { notFound: true }
  return {}
}

/** Extract a supported Cypress version range from a package manifest, if any. */
function cypressCompat(versionManifest) {
  if (!versionManifest) return undefined
  const buckets = [
    versionManifest.peerDependencies,
    versionManifest.devDependencies,
    versionManifest.dependencies,
  ]
  for (const bucket of buckets) {
    const range = bucket && bucket.cypress
    if (typeof range !== 'string') continue
    const trimmed = range.trim()
    // Skip meaningless placeholders (monorepo dev versions, wildcards, etc.).
    if (!trimmed || trimmed === '*' || trimmed === 'latest') continue
    if (/^workspace:/.test(trimmed) || /^0\.0\.0/.test(trimmed)) continue
    return trimmed
  }
  return undefined
}

/** Parse "owner/repo" out of a GitHub URL, or null. Subpath links
 *  (`…/tree/…`, `…/blob/…`) are skipped: they point into a repo — often a
 *  monorepo like cypress-io/cypress — where repo-level stars would reflect the
 *  whole repo rather than the individual package. */
function parseGitHub(link) {
  if (!link) return null
  const m = /github\.com\/([^/]+)\/([^/#?]+)(\/[^#?]*)?/i.exec(link)
  if (!m) return null
  const owner = m[1]
  const repo = m[2].replace(/\.git$/, '')
  const rest = m[3] || ''
  if (owner === 'sponsors' || owner === 'marketplace') return null
  if (/^\/(tree|blob)\//.test(rest)) return null
  return { owner, repo }
}

/** npm reserves removed package names under a `0.0.x-security` placeholder
 *  described as "security holding package". Treat those as not published. */
function isSecurityPlaceholder(latest, versionManifest) {
  if (/-security$/.test(latest || '')) return true
  const desc = versionManifest && versionManifest.description
  return (
    typeof desc === 'string' &&
    desc.toLowerCase() === 'security holding package'
  )
}

/**
 * Resolve the canonical npm package name for a plugin entry.
 * Preference: explicit `npm` field -> the plugin `name` if it's itself a real
 * package. We deliberately do NOT guess from the GitHub repo basename, since
 * monorepo subpaths (e.g. cypress-io/cypress/tree/.../npm/webpack-preprocessor)
 * and generic repo names would resolve to the wrong package. Entries whose
 * display name isn't the package should set an explicit `npm` field.
 * Returns the manifest too so callers don't re-fetch, plus `notFound` which is
 * true only when a candidate got a definitive 404 (not a transient failure).
 */
async function resolveNpm(plugin) {
  const candidates = []
  if (plugin.npm) candidates.push(plugin.npm)
  // Also try the display name when it looks like a package specifier (lowercase,
  // no spaces). This is a fallback: if an explicit `npm` value is wrong or has
  // been removed, a valid display name can still resolve.
  if (
    plugin.name &&
    !/\s/.test(plugin.name) &&
    /^(@[\w.-]+\/)?[\w.-]+$/.test(plugin.name) &&
    plugin.name === plugin.name.toLowerCase()
  ) {
    candidates.push(plugin.name)
  }

  let notFound = false
  for (const candidate of [...new Set(candidates)]) {
    const result = await npmManifest(candidate)
    if (result.data)
      return { pkg: result.data.name, manifest: result.data, notFound: false }
    if (result.notFound) notFound = true
  }
  return { pkg: plugin.npm || null, manifest: null, notFound }
}

/** Best-effort weekly download count. The downloads API needs the `/` in a
 *  scoped name percent-encoded (e.g. `@cypress%2Fgrep`). */
async function weeklyDownloads(pkg) {
  const data = await fetchJson(`${DOWNLOADS}/${pkg.replace(/\//g, '%2F')}`)
  if (!data || data.__status || typeof data.downloads !== 'number')
    return undefined
  return data.downloads
}

/** Best-effort GitHub repo stats. `applicable` is false when there's no usable
 *  repo to query (missing link, or a subpath/monorepo link); `ok` is false on a
 *  transient failure, so callers can preserve prior stats instead of dropping
 *  them. */
async function githubStats(link) {
  const gh = parseGitHub(link)
  if (!gh) return { applicable: false, ok: false }
  const headers = process.env.GITHUB_TOKEN
    ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}
  const data = await fetchJson(
    `${GITHUB_API}/repos/${gh.owner}/${gh.repo}`,
    headers
  )
  if (!data || data.__status) return { applicable: true, ok: false }
  return {
    applicable: true,
    ok: true,
    stars:
      typeof data.stargazers_count === 'number'
        ? data.stargazers_count
        : undefined,
    archived: data.archived === true ? true : undefined,
    pushedAt: typeof data.pushed_at === 'string' ? data.pushed_at : undefined,
  }
}

/**
 * Enrich a single plugin entry. Returns [name, metadata] or null.
 *
 * Metadata is rebuilt from scratch each run (rather than spreading the prior
 * value) so a signal can never go stale. Each source's fields are only carried
 * over from `existing` when that source fails *transiently* — a definitive 404
 * or a healthy fresh fetch always wins.
 */
async function enrichPlugin(plugin, existing) {
  const prior = existing || {}
  const meta = {}
  const markDeprecated = (reason) => {
    meta.deprecated = true
    if (!meta.deprecatedReason && reason) meta.deprecatedReason = reason
  }

  const { pkg, manifest, notFound } = await resolveNpm(plugin)
  if (pkg) meta.npm = pkg

  // --- npm-registry-derived signals ---
  if (manifest) {
    const latest = manifest['dist-tags'] && manifest['dist-tags'].latest
    const vm =
      latest && manifest.versions ? manifest.versions[latest] : undefined
    if (latest && isSecurityPlaceholder(latest, vm)) {
      // npm is holding this name for security; the plugin is effectively gone.
      markDeprecated(
        'This npm package name is a security placeholder; the plugin is no longer published.'
      )
    } else if (latest) {
      meta.version = latest
      if (manifest.time && manifest.time[latest]) {
        meta.lastPublished = manifest.time[latest]
      }
      const compat = cypressCompat(vm)
      if (compat) meta.cypressVersion = compat
      if (vm && typeof vm.deprecated === 'string') markDeprecated(vm.deprecated)
      const dl = await weeklyDownloads(pkg)
      if (typeof dl === 'number') meta.weeklyDownloads = dl
      else if (prior.weeklyDownloads !== undefined)
        meta.weeklyDownloads = prior.weeklyDownloads
    }
  } else if (pkg && notFound) {
    // Definitively removed from npm -> deprecated. Deliberately drop any prior
    // version/date/compat so a card never shows a deprecation notice alongside
    // stale "freshness" signals.
    markDeprecated('Package not found on the npm registry.')
  } else if (pkg) {
    // Transient registry failure for a known package -> keep prior npm signals.
    for (const k of [
      'version',
      'lastPublished',
      'cypressVersion',
      'weeklyDownloads',
    ]) {
      if (prior[k] !== undefined) meta[k] = prior[k]
    }
    if (prior.deprecated) markDeprecated(prior.deprecatedReason)
  }

  // --- GitHub-derived signals ---
  const gh = await githubStats(plugin.link)
  if (gh.ok) {
    if (typeof gh.stars === 'number') meta.stars = gh.stars
    if (gh.pushedAt) meta.repoPushedAt = gh.pushedAt
    if (gh.archived) {
      meta.archived = true
      markDeprecated('Source repository is archived.')
    }
  } else if (gh.applicable) {
    // Transient GitHub failure -> keep prior stats (incl. an archived flag, so
    // an archived repo isn't silently un-deprecated just because GitHub failed).
    if (prior.stars !== undefined) meta.stars = prior.stars
    if (prior.repoPushedAt !== undefined) meta.repoPushedAt = prior.repoPushedAt
    if (prior.archived) {
      meta.archived = true
      markDeprecated('Source repository is archived.')
    }
  }

  return Object.keys(meta).length ? [plugin.name, meta] : null
}

async function main() {
  const source = JSON.parse(await readFile(SOURCE, 'utf8'))
  let existing = {}
  try {
    const prior = JSON.parse(await readFile(OUTPUT, 'utf8'))
    // Prior metadata lives under the `plugins` key of the generated file.
    existing = (prior && prior.plugins) || {}
  } catch {
    existing = {}
  }

  const flat = []
  for (const category of source.plugins) {
    for (const plugin of category.plugins || []) flat.push(plugin)
  }
  console.log(`Enriching ${flat.length} plugins (concurrency ${CONCURRENCY})…`)

  const entries = await pMap(
    flat,
    async (plugin) => {
      const result = await enrichPlugin(plugin, existing[plugin.name])
      process.stdout.write(result ? '.' : 'x')
      return result
    },
    { concurrency: CONCURRENCY }
  )
  process.stdout.write('\n')

  const generated = {}
  for (const entry of entries) {
    if (entry) generated[entry[0]] = entry[1]
  }

  const deprecated = Object.values(generated).filter((m) => m.deprecated).length
  const withVersion = Object.values(generated).filter((m) => m.version).length
  console.log(
    `Resolved metadata for ${Object.keys(generated).length} plugins ` +
      `(${withVersion} with a version, ${deprecated} flagged deprecated).`
  )

  const payload =
    JSON.stringify(
      {
        _comment:
          'Generated by scripts/enrich-plugins.mjs. Do not edit by hand.',
        plugins: generated,
      },
      null,
      2
    ) + '\n'
  await writeFile(OUTPUT, payload)
  console.log(`Wrote ${OUTPUT}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
