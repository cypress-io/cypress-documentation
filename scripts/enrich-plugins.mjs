#!/usr/bin/env node
// @ts-check
/**
 * Enriches the curated plugin list (src/data/plugins.json) with live signals
 * pulled from the npm registry and GitHub, writing the result to
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
import pMap from 'p-map'
import {
  cypressCompat,
  githubArchived,
  isSecurityPlaceholder,
  resolveNpm,
} from './plugin-signals.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const SOURCE = resolve(ROOT, 'src/data/plugins.json')
const OUTPUT = resolve(ROOT, 'src/data/plugins-generated.json')

const CONCURRENCY = 6

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
    }
  } else if (pkg && notFound) {
    // Definitively removed from npm -> deprecated. Deliberately drop any prior
    // version/date/compat so a card never shows a deprecation notice alongside
    // stale "freshness" signals.
    markDeprecated('Package not found on the npm registry.')
  } else if (pkg) {
    // Transient registry failure for a known package -> keep prior npm signals.
    for (const k of ['version', 'lastPublished', 'cypressVersion']) {
      if (prior[k] !== undefined) meta[k] = prior[k]
    }
    if (prior.deprecated) markDeprecated(prior.deprecatedReason)
  }

  // --- GitHub: archived repos are treated as deprecated ---
  const gh = await githubArchived(plugin.link)
  if (gh.ok) {
    if (gh.archived) {
      meta.archived = true
      markDeprecated('Source repository is archived.')
    }
  } else if (gh.applicable && prior.archived) {
    // Transient GitHub failure -> keep a prior archived flag so an archived repo
    // isn't silently un-deprecated just because GitHub failed.
    meta.archived = true
    markDeprecated('Source repository is archived.')
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
