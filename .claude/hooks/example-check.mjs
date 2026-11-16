#!/usr/bin/env node
// Commit reminder for AGENTS_REFERENCE.md#verifying-code-examples.
//
//   node .claude/hooks/example-check.mjs list
//       Print every code block you've added or changed under docs/.
//   node .claude/hooks/example-check.mjs gate
//       PreToolUse hook: the first `git commit` after code examples change is
//       stopped once with a reminder to run them. Trying again goes through.
//
// The judgment about what to run, and how, is the agent's; this only makes
// sure the question gets asked. "Changed" means changed from HEAD, staged or
// not, so it doesn't depend on how the commit is made. The reminder remembers
// each block it has mentioned, and fires again only for a block it hasn't: an
// edited block is a new one, while prose edits and committing some of the
// listed blocks don't bring it back.

import { changedDocs, codeBlocks, hash, isCommit, read, reminded, show } from './lib.mjs'

// Blocks added or changed from HEAD. A block that exists word for word in a
// docs file that was deleted or renamed counts as moved, not changed, so moving
// or splitting a page doesn't flag its examples, even with a plain `mv` that
// git can't yet see as a rename.
function changedBlocks() {
  const { files, gone } = changedDocs()
  const moved = new Set()
  for (const path of gone) {
    for (const block of codeBlocks(show(`HEAD:${path}`))) moved.add(block.body)
  }
  const seen = new Set()
  const changed = []
  for (const [path, headPath] of files) {
    const before = new Set(codeBlocks(show(`HEAD:${headPath}`)).map((b) => b.body))
    for (const source of [show(`:${path}`), read(path)]) {
      for (const block of codeBlocks(source)) {
        const key = `${path}\0${block.body}`
        if (before.has(block.body) || moved.has(block.body) || seen.has(key)) continue
        seen.add(key)
        changed.push({ path, ...block })
      }
    }
  }
  return changed
}

function key(block) {
  return hash(block.path, block.body)
}

function describe(blocks) {
  return blocks.map((b) => `  ${b.path}:${b.line}  ${b.info || '(no language)'}`).join('\n')
}

const [mode] = process.argv.slice(2)

if (mode === 'list') {
  const blocks = changedBlocks()
  console.log(
    blocks.length
      ? `Code blocks added or changed under docs/:\n${describe(blocks)}`
      : 'No code blocks added or changed under docs/.'
  )
} else if (mode === 'gate') {
  if (!isCommit()) process.exit(0)
  const blocks = changedBlocks()
  if (!blocks.length) process.exit(0)
  const memory = reminded('example-check-reminded')
  const unmentioned = blocks.filter((b) => !memory.has(key(b)))
  if (!unmentioned.length) process.exit(0)
  memory.save(blocks.map(key))
  process.stderr.write(
    `Reminder: these code examples changed since the last commit.

${describe(unmentioned)}

Before committing, run each one in the .example-check/ harness and report the results in the thread,
following AGENTS_REFERENCE.md#verifying-code-examples. If you judge that one doesn't need a run (for
example, Prettier only rewrapped it), say so and why in your report.

This reminder shows once for each changed example. When you've handled them, run the same commit again.
`
  )
  process.exit(2)
} else {
  console.error('Usage: example-check.mjs <list | gate>')
  process.exit(1)
}
