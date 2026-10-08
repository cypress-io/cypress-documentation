#!/usr/bin/env node
// @ts-check
/**
 * Review the plugins a pull request adds to src/data/plugins.json against the
 * requirements in CONTRIBUTING.md, and write the result as a Markdown comment.
 *
 *   node scripts/plugin-review/index.mjs --base base.json --head head.json --out comment.md
 *
 * Checks with a clear answer (fields, npm metadata, Cypress compatibility,
 * tests, CI) run as code. The documentation criteria need judgment, so they go
 * to Claude when ANTHROPIC_API_KEY is set and are reported as not checked when
 * it isn't. Set GITHUB_TOKEN for a higher GitHub API rate limit.
 *
 * The plugin's own code is never downloaded or run: everything comes from the
 * npm registry and the GitHub API.
 */

import { readFile, writeFile } from 'node:fs/promises'
import { parseArgs } from 'node:util'
import { checkDocs, checkEntry, checkNpm, checkRepo } from './checks.mjs'
import { renderComment } from './comment.mjs'
import { findNewPlugins, flattenPlugins } from './diff.mjs'
import { reviewDocs } from './docs-review.mjs'
import {
  latestCypressMajor,
  loadNpm,
  loadReadme,
  loadRepo,
} from './sources.mjs'

// A single pull request adding more than this many plugins gets the first
// ones reviewed and a note, so one run can't fan out without bound.
const MAX_PLUGINS = 10

async function main() {
  const { values } = parseArgs({
    options: {
      base: { type: 'string' },
      head: { type: 'string' },
      out: { type: 'string' },
      footer: { type: 'string' },
    },
  })
  if (!values.base || !values.head || !values.out) {
    console.error(
      'Usage: index.mjs --base <file> --head <file> --out <file> [--footer <text>]'
    )
    process.exit(2)
  }

  const base = JSON.parse(await readFile(values.base, 'utf8'))
  let head
  try {
    head = JSON.parse(await readFile(values.head, 'utf8'))
  } catch (error) {
    await writeFile(
      values.out,
      renderInvalid(error instanceof Error ? error.message : String(error))
    )
    console.log('plugins.json on the pull request is not valid JSON.')
    return
  }

  const existing = flattenPlugins(base)
  const added = findNewPlugins(base, head)
  console.log(
    `Found ${added.length} new ${added.length === 1 ? 'plugin' : 'plugins'}.`
  )

  const cypressMajor = added.length ? await latestCypressMajor() : null
  const results = []
  for (const { plugin, category } of added.slice(0, MAX_PLUGINS)) {
    console.log(`Reviewing ${plugin.name}…`)
    const npm = await loadNpm(plugin)
    const repo = await loadRepo(plugin.link)
    const readme = await loadReadme(repo, npm)
    const docs = await reviewDocs(readme, plugin)

    results.push({
      plugin,
      category,
      docsSource: docs.source,
      rows: [
        ...checkEntry(plugin, existing),
        ...checkNpm(npm, cypressMajor),
        ...checkRepo(repo),
        ...checkDocs(docs),
      ],
    })
  }

  let footer = values.footer || ''
  if (added.length > MAX_PLUGINS) {
    footer =
      `Reviewed the first ${MAX_PLUGINS} of ${added.length} new plugins. ${footer}`.trim()
  }
  await writeFile(values.out, renderComment(results, { footer }))
  console.log(`Wrote ${values.out}`)
}

function renderInvalid(message) {
  return [
    '<!-- plugin-review -->',
    '## Plugin review',
    '',
    '`src/data/plugins.json` isn’t valid JSON on this branch, so no plugins were reviewed.',
    '',
    '```text',
    message.replace(/```/g, ''),
    '```',
    '',
  ].join('\n')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
