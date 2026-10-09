#!/usr/bin/env node
// @ts-check
/**
 * Review the plugins a pull request adds to src/data/plugins.json against the
 * requirements in CONTRIBUTING.md, and write the result as a Markdown comment.
 *
 *   node scripts/plugin-review/index.mjs --base base.json --head head.json --out comment.md
 *
 * Checks with a clear answer (the schema, npm metadata, Cypress compatibility,
 * the repository's status) run as code. The rest need judgment, so they go to
 * Claude when ANTHROPIC_API_KEY is set and are reported as not checked when it
 * isn't. Set GITHUB_TOKEN for a higher GitHub API rate limit.
 *
 * This never downloads or runs the plugin's own code: everything comes from
 * the npm registry and the GitHub API. Invalid JSON fails the run;
 * `npm run lint:plugins` reports it on the pull request.
 */

import { readFile, writeFile } from 'node:fs/promises'
import { parseArgs } from 'node:util'
import { resolveNpm } from '../plugin-signals.mjs'
import { reviewWithClaude } from './claude-review.mjs'
import { checkClaude, checkEntry, checkNpm, checkSource } from './checks.mjs'
import { renderComment } from './comment.mjs'
import { findNewPlugins, flattenPlugins } from './diff.mjs'
import { latestCypressMajor, loadReadme, loadRepo } from './sources.mjs'

// When a pull request adds more plugins than this, the review covers the
// first ones and says so, so one run can't fan out without bound.
const MAX_PLUGINS = 10

const { values } = parseArgs({
  options: {
    base: { type: 'string' },
    head: { type: 'string' },
    out: { type: 'string' },
    footer: { type: 'string', default: '' },
  },
})
if (!values.base || !values.head || !values.out) {
  console.error(
    'Usage: index.mjs --base <file> --head <file> --out <file> [--footer <text>]'
  )
  process.exit(2)
}

const base = JSON.parse(await readFile(values.base, 'utf8'))
const head = JSON.parse(await readFile(values.head, 'utf8'))
const added = findNewPlugins(base, head)
console.log(
  `Found ${added.length} new ${added.length === 1 ? 'plugin' : 'plugins'}.`
)

const existing = flattenPlugins(base)
const cypressMajor = added.length ? await latestCypressMajor() : null
const results = []
for (const plugin of added.slice(0, MAX_PLUGINS)) {
  console.log(`Reviewing ${plugin.name}…`)
  const npm = await resolveNpm(plugin)
  const repo = await loadRepo(plugin.link)
  const readme = await loadReadme(repo, npm.manifest)
  const review = await reviewWithClaude(readme, repo, plugin)
  results.push({
    plugin,
    rows: [
      ...checkEntry(plugin, existing),
      ...checkNpm(npm, cypressMajor),
      checkSource(repo),
      ...checkClaude(review),
    ],
  })
}

const capped =
  added.length > MAX_PLUGINS
    ? `Reviewed the first ${MAX_PLUGINS} of ${added.length} new plugins. `
    : ''
await writeFile(
  values.out,
  renderComment(results, `${capped}${values.footer}`.trim())
)
console.log(`Wrote ${values.out}`)
