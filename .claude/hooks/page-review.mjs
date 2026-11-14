#!/usr/bin/env node
// Commit reminder for AGENTS_REFERENCE.md#reviewing-a-new-or-rewritten-page.
//
//   node .claude/hooks/page-review.mjs list
//       Print every docs page that is new or mostly rewritten since HEAD.
//   node .claude/hooks/page-review.mjs gate
//       PreToolUse hook: the first `git commit` after a page is added or mostly
//       rewritten is stopped once with a reminder to review it. Trying again
//       goes through.
//
// Lint and Bugbot catch the mechanical writing rules. The judgment rules (does
// the page lead with value, do its headings stand alone, does it repeat itself)
// need a reader, and a whole new page is where they slip most, so this asks for
// one. It works like example-check.mjs: "changed" means changed from HEAD,
// staged or not, and the reminder fires once per page per base version. The
// review's own edits, and further edits to the same page, don't bring it back;
// a later commit that rewrites the page again does.

import { basename } from 'node:path'
import { changedDocs, codeBlocks, hash, isCommit, read, reminded, show } from './lib.mjs'

// Share of a page's prose lines that must be added or rewritten to count.
const SHARE = 0.4
// A rewrite this small is an edit, whatever its share of a short page.
const MIN_LINES = 10

// A page's non-blank prose lines, trimmed: no frontmatter and no fenced code,
// since code examples have their own reminder and the review is about prose.
function proseLines(source) {
  const lines = source.split('\n')
  const skip = new Set()
  if (lines[0] === '---') {
    const end = lines.indexOf('---', 1)
    for (let i = 0; i <= end; i++) skip.add(i)
  }
  for (const block of codeBlocks(source)) {
    for (let i = block.line - 1; i < block.end; i++) skip.add(i)
  }
  return lines.map((line, i) => (skip.has(i) ? '' : line.trim())).filter(Boolean)
}

// Lines of `after` that don't appear in `before`, counted as a multiset, so a
// reordered section isn't a rewrite but a duplicated line is.
function rewritten(before, after) {
  const pool = new Map()
  for (const line of before) pool.set(line, (pool.get(line) ?? 0) + 1)
  let count = 0
  for (const line of after) {
    const left = pool.get(line) ?? 0
    if (left) pool.set(line, left - 1)
    else count++
  }
  return count
}

function changedPages() {
  const { files, gone } = changedDocs()
  const goneLines = gone.map((path) => proseLines(show(`HEAD:${path}`)))
  const pages = []
  for (const [path, headPath] of files) {
    // Partials (`_name.mdx`) aren't pages: they render inside other pages.
    if (basename(path).startsWith('_')) continue
    const base = show(`HEAD:${headPath}`)
    // A page with no HEAD version may still have moved with a plain `mv`, so
    // compare it against the deleted pages too and keep the closest match.
    const bases = base ? [proseLines(base)] : goneLines
    let worst = null
    for (const source of new Set([show(`:${path}`), read(path)])) {
      const after = proseLines(source)
      if (!after.length) continue
      const count = Math.min(after.length, ...bases.map((before) => rewritten(before, after)))
      if (!worst || count / after.length > worst.share) worst = { count, share: count / after.length }
    }
    if (!worst || worst.share <= SHARE || worst.count < MIN_LINES) continue
    pages.push({
      path,
      key: hash(path, base),
      why: base ? `${Math.round(worst.share * 100)}% of its prose lines added or rewritten` : 'new page',
    })
  }
  return pages
}

function describe(pages) {
  return pages.map((p) => `  ${p.path}  (${p.why})`).join('\n')
}

const [mode] = process.argv.slice(2)

if (mode === 'list') {
  const pages = changedPages()
  console.log(
    pages.length
      ? `Docs pages new or mostly rewritten since HEAD:\n${describe(pages)}`
      : 'No docs pages new or mostly rewritten since HEAD.'
  )
} else if (mode === 'gate') {
  if (!isCommit()) process.exit(0)
  const pages = changedPages()
  if (!pages.length) process.exit(0)
  const memory = reminded('page-review-reminded')
  const unmentioned = pages.filter((p) => !memory.has(p.key))
  if (!unmentioned.length) process.exit(0)
  memory.save(pages.map((p) => p.key))
  process.stderr.write(
    `Reminder: these docs pages are new or mostly rewritten since the last commit.

${describe(unmentioned)}

Before committing, review each page following AGENTS_REFERENCE.md#reviewing-a-new-or-rewritten-page
and report the results in the thread: each change you made and the rule behind it. If you judge that
a page doesn't need a review (for example, it moved or was reformatted rather than rewritten), say so
and why in your report.

This reminder shows once for each changed page. When you've handled them, run the same commit again.
`
  )
  process.exit(2)
} else {
  console.error('Usage: page-review.mjs <list | gate>')
  process.exit(1)
}
