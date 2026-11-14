#!/usr/bin/env node
// Commit reminder for AGENTS_REFERENCE.md#reviewing-a-new-or-rewritten-page.
//
//   node .claude/hooks/page-review.mjs gate
//       PreToolUse hook: the first `git commit` after a page is added or mostly
//       rewritten is stopped once with a reminder to review it. Trying again
//       goes through.
//
// It works like example-check.mjs: "changed" means changed from HEAD, staged or
// not, and the reminder fires once per page per base version. The review's own
// edits don't bring it back; a later commit that rewrites the page again does.

import { basename } from 'node:path'
import { changedDocs, codeBlocks, hash, isCommit, read, reminded, show } from './lib.mjs'

// Share of a page's prose lines that must be added or rewritten to count.
const SHARE = 0.4
// A rewrite this small is an edit, whatever its share of a short page.
const MIN_LINES = 10

// A page's non-blank lines outside fenced code, trimmed. Code examples have
// their own reminder, and the review is about prose.
function proseLines(source) {
  const lines = source.split('\n')
  for (const block of codeBlocks(source)) lines.fill('', block.line - 1, block.end)
  return lines.map((line) => line.trim()).filter(Boolean)
}

// Lines of `after` that don't appear in `before`, counted as a multiset, so a
// reordered section isn't a rewrite but a duplicated line is.
function rewritten(before, after) {
  const pool = new Map()
  for (const line of before) pool.set(line, (pool.get(line) ?? 0) + 1)
  return after.filter((line) => {
    const left = pool.get(line) ?? 0
    pool.set(line, left - 1)
    return left <= 0
  }).length
}

function changedPages() {
  const { files, gone } = changedDocs()
  const pages = []
  for (const [path, headPath] of files) {
    // Partials (`_name.mdx`) aren't pages: they render inside other pages.
    if (basename(path).startsWith('_')) continue
    const base = show(`HEAD:${headPath}`)
    const after = proseLines(read(path) || show(`:${path}`))
    // A page with no HEAD version may have moved with a plain `mv`, so compare
    // it with the deleted pages and keep the closest match.
    const bases = base ? [base] : gone.map((p) => show(`HEAD:${p}`))
    const count = Math.min(after.length, ...bases.map((b) => rewritten(proseLines(b), after)))
    if (count < MIN_LINES || count <= after.length * SHARE) continue
    pages.push({
      path,
      key: hash(path, base),
      why: base ? `${Math.round((count / after.length) * 100)}% of its prose lines rewritten` : 'new page',
    })
  }
  return pages
}

if (process.argv[2] !== 'gate') {
  console.error('Usage: page-review.mjs gate')
  process.exit(1)
}
if (!isCommit()) process.exit(0)
const pages = changedPages()
const memory = reminded('page-review-reminded')
const unmentioned = pages.filter((p) => !memory.has(p.key))
if (!unmentioned.length) process.exit(0)
memory.save(pages.map((p) => p.key))
process.stderr.write(
  `Reminder: these docs pages are new or mostly rewritten since the last commit.

${unmentioned.map((p) => `  ${p.path}  (${p.why})`).join('\n')}

Before committing, review each page following AGENTS_REFERENCE.md#reviewing-a-new-or-rewritten-page
and report the results in the thread: each change you made and the rule behind it. If you judge that
a page doesn't need a review (for example, it moved or was reformatted rather than rewritten), say so
and why in your report.

This reminder shows once for each changed page. When you've handled them, run the same commit again.
`
)
process.exit(2)
