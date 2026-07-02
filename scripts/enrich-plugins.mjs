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

/** Does an npm package with this exact name exist? Returns its packument or null.
 *  The registry accepts scoped names (`@scope/name`) unencoded in the path. */
async function npmManifest(pkg) {
  const data = await fetchJson(`${REGISTRY}/${pkg}`)
  if (!data || data.__status) return null
  return data
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

/** Parse "owner/repo" out of a GitHub URL, or null. */
function parseGitHub(link) {
  if (!link) return null
  const m = /github\.com\/([^/]+)\/([^/#?]+)/i.exec(link)
  if (!m) return null
  const owner = m[1]
  const repo = m[2].replace(/\.git$/, '')
  if (owner === 'sponsors' || owner === 'marketplace') return null
  return { owner, repo }
}

/**
 * Resolve the canonical npm package name for a plugin entry.
 * Preference: explicit `npm` field -> the plugin `name` if it's itself a real
 * package. We deliberately do NOT guess from the GitHub repo basename, since
 * monorepo subpaths (e.g. cypress-io/cypress/tree/.../npm/webpack-preprocessor)
 * and generic repo names would resolve to the wrong package. Entries whose
 * display name isn't the package should set an explicit `npm` field.
 * Returns the manifest too so callers don't re-fetch.
 */
async function resolveNpm(plugin) {
  const candidates = []
  if (plugin.npm) candidates.push(plugin.npm)
  // A plugin `name` that looks like a package specifier (lowercase, no spaces).
  if (
    !plugin.npm &&
    plugin.name &&
    !/\s/.test(plugin.name) &&
    /^(@[\w.-]+\/)?[\w.-]+$/.test(plugin.name) &&
    plugin.name === plugin.name.toLowerCase()
  ) {
    candidates.push(plugin.name)
  }

  for (const candidate of [...new Set(candidates)]) {
    const manifest = await npmManifest(candidate)
    if (manifest && manifest.name) return { pkg: manifest.name, manifest }
  }
  return { pkg: plugin.npm || null, manifest: null }
}

/** Best-effort weekly download count. */
async function weeklyDownloads(pkg) {
  const data = await fetchJson(`${DOWNLOADS}/${pkg}`)
  if (!data || data.__status || typeof data.downloads !== 'number')
    return undefined
  return data.downloads
}

/** Best-effort GitHub repo stats. */
async function githubStats(link) {
  const gh = parseGitHub(link)
  if (!gh) return {}
  const headers = process.env.GITHUB_TOKEN
    ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}
  const data = await fetchJson(
    `${GITHUB_API}/repos/${gh.owner}/${gh.repo}`,
    headers
  )
  if (!data || data.__status) return {}
  return {
    stars:
      typeof data.stargazers_count === 'number'
        ? data.stargazers_count
        : undefined,
    archived: data.archived === true ? true : undefined,
    pushedAt: typeof data.pushed_at === 'string' ? data.pushed_at : undefined,
  }
}

/** Enrich a single plugin entry. Returns [name, metadata] or null. */
async function enrichPlugin(plugin, existing) {
  const meta = { ...(existing || {}) }
  const { pkg, manifest } = await resolveNpm(plugin)

  if (pkg) meta.npm = pkg

  if (manifest) {
    const latest = manifest['dist-tags'] && manifest['dist-tags'].latest
    if (latest) {
      meta.version = latest
      if (manifest.time && manifest.time[latest]) {
        meta.lastPublished = manifest.time[latest]
      }
      const versionManifest = manifest.versions && manifest.versions[latest]
      const compat = cypressCompat(versionManifest)
      if (compat) meta.cypressVersion = compat
      // npm-level deprecation on the latest version.
      if (versionManifest && typeof versionManifest.deprecated === 'string') {
        meta.deprecated = true
        meta.deprecatedReason = versionManifest.deprecated
      }
    }
  } else if (pkg && meta.npm) {
    // We had an npm name but the registry returned nothing -> package removed.
    meta.deprecated = true
    meta.deprecatedReason =
      meta.deprecatedReason || 'Package not found on the npm registry.'
  }

  if (pkg) {
    const dl = await weeklyDownloads(pkg)
    if (typeof dl === 'number') meta.weeklyDownloads = dl
  }

  const gh = await githubStats(plugin.link)
  if (typeof gh.stars === 'number') meta.stars = gh.stars
  if (gh.pushedAt) meta.repoPushedAt = gh.pushedAt
  if (gh.archived) {
    meta.archived = true
    meta.deprecated = true
    meta.deprecatedReason =
      meta.deprecatedReason || 'Source repository is archived.'
  }

  return Object.keys(meta).length ? [plugin.name, meta] : null
}

async function main() {
  const source = JSON.parse(await readFile(SOURCE, 'utf8'))
  let existing = {}
  try {
    existing = JSON.parse(await readFile(OUTPUT, 'utf8'))
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
