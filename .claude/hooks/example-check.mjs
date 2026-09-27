#!/usr/bin/env node
// Commit gate for AGENTS_REFERENCE.md#verifying-code-examples.
//
//   node .claude/hooks/example-check.mjs list
//       Print every code block you've added or changed under docs/.
//   node .claude/hooks/example-check.mjs stamp
//       Record that those blocks were verified and reported in the thread.
//   node .claude/hooks/example-check.mjs stamp --skip "<reason>"
//       Record your judgment that they didn't need a run, and why.
//   node .claude/hooks/example-check.mjs gate
//       PreToolUse hook: blocks a `git commit` while any changed block has no
//       matching stamp.
//
// The judgment about what to test, and how, is the agent's. This hook asks only
// whether a decision was recorded for every changed block. It doesn't try to
// work out which changes a particular commit includes: "changed" means changed
// from HEAD, staged or not, so `list`, `stamp`, and `gate` always see the same
// set. The stamp fingerprints that set, so editing a block after stamping asks
// for a fresh decision, while prose edits leave the stamp valid.

import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const cwd = process.env.CLAUDE_PROJECT_DIR || process.cwd()
const root = execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd, encoding: 'utf8' }).trim()
const gitDir = execFileSync('git', ['rev-parse', '--absolute-git-dir'], { cwd: root, encoding: 'utf8' }).trim()
const stampPath = join(gitDir, 'example-check-verified')

function git(args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
}

function show(spec) {
  try {
    return git(['show', spec])
  } catch {
    return ''
  }
}

function read(path) {
  try {
    return readFileSync(join(root, path), 'utf8')
  } catch {
    return ''
  }
}

// Fenced blocks in a Markdown/MDX source. A fence closes on the same character
// repeated at least as many times, so a ```` block can contain ``` examples.
function codeBlocks(source) {
  const blocks = []
  let open = null
  source.split('\n').forEach((line, i) => {
    const m = line.match(/^\s*(`{3,}|~{3,})(.*)$/)
    if (!open) {
      if (m) open = { fence: m[1], info: m[2].trim(), line: i + 1, body: [] }
    } else if (m && m[1][0] === open.fence[0] && m[1].length >= open.fence.length && !m[2].trim()) {
      blocks.push({ info: open.info, line: open.line, body: open.body.join('\n') })
      open = null
    } else {
      open.body.push(line)
    }
  })
  return blocks
}

// Blocks added or changed from HEAD, in the index or the working tree.
function changedBlocks() {
  const docs = ['--', 'docs/**/*.md', 'docs/**/*.mdx']
  const files = new Map() // path -> path at HEAD
  for (const args of [['diff', '--cached'], ['diff', 'HEAD']]) {
    for (const row of git([...args, '-M', '--name-status', '--diff-filter=AMR', ...docs]).split('\n')) {
      if (!row) continue
      const parts = row.split('\t')
      const path = parts[parts.length - 1]
      // The nested agent guides document conventions; they aren't docs pages.
      if (/(^|\/)(AGENTS|CLAUDE)\.md$/.test(path)) continue
      files.set(path, parts[0].startsWith('R') ? parts[1] : path)
    }
  }
  const seen = new Set()
  const changed = []
  for (const [path, headPath] of [...files].sort()) {
    const before = new Set(codeBlocks(show(`HEAD:${headPath}`)).map((b) => b.body))
    for (const source of [show(`:${path}`), read(path)]) {
      for (const block of codeBlocks(source)) {
        const key = `${path}\0${block.body}`
        if (before.has(block.body) || seen.has(key)) continue
        seen.add(key)
        changed.push({ path, ...block })
      }
    }
  }
  return changed
}

function fingerprint(blocks) {
  const keys = blocks.map((b) => `${b.path}\0${b.body}`).sort()
  return createHash('sha256').update(keys.join('\0\0')).digest('hex')
}

function describe(blocks) {
  return blocks.map((b) => `  ${b.path}:${b.line}  ${b.info || '(no language)'}`).join('\n')
}

const [mode, ...rest] = process.argv.slice(2)

if (mode === 'list') {
  const blocks = changedBlocks()
  console.log(
    blocks.length
      ? `Code blocks added or changed under docs/:\n${describe(blocks)}`
      : 'No code blocks added or changed under docs/.'
  )
} else if (mode === 'stamp') {
  const skip = rest[0] === '--skip'
  const reason = skip ? rest.slice(1).join(' ').trim() : ''
  if (skip && !reason) {
    console.error('--skip needs a reason, such as "Prettier rewrapped the block". Put the same reason in your report.')
    process.exit(1)
  }
  const blocks = changedBlocks()
  if (!blocks.length) {
    console.log('No code blocks added or changed under docs/, so there is nothing to stamp.')
    process.exit(0)
  }
  writeFileSync(
    stampPath,
    JSON.stringify(
      {
        fingerprint: fingerprint(blocks),
        kind: skip ? 'skipped' : 'verified',
        reason,
        blocks: blocks.map((b) => `${b.path}:${b.line}`),
        at: new Date().toISOString(),
      },
      null,
      2
    )
  )
  console.log(`Stamped ${blocks.length} code block(s) as ${skip ? `skipped (${reason})` : 'verified'}:\n${describe(blocks)}`)
} else if (mode === 'gate') {
  let input = {}
  try {
    input = JSON.parse(readFileSync(0, 'utf8') || '{}')
  } catch {
    process.exit(0)
  }
  // `git commit` at the start of a command or after a shell separator, with
  // any of git's global options in between (`--no-pager`, `-P`, `-C <dir>`,
  // `-c <key=value>`). A mention inside a quoted string or message doesn't count.
  const commits =
    /(?:^|[;&|(\n]|\bthen\b|\bdo\b)\s*(?:\w+=\S*\s+)*git(?:\s+(?:-[cC]\s+\S+|-\S+))*\s+commit(?![\w-])/
  if (input.tool_name !== 'Bash' || !commits.test(input.tool_input?.command ?? '')) process.exit(0)
  const blocks = changedBlocks()
  if (!blocks.length) process.exit(0)
  let stamp = null
  try {
    if (existsSync(stampPath)) stamp = JSON.parse(readFileSync(stampPath, 'utf8'))
  } catch {}
  if (stamp?.fingerprint === fingerprint(blocks)) process.exit(0)
  process.stderr.write(
    `Commit blocked: these code examples changed, and no decision about running them is recorded${
      stamp ? ' (a stamp exists, but the examples changed after it)' : ''
    }.

${describe(blocks)}

This counts every changed example, staged or not, whichever way you commit.
Follow AGENTS_REFERENCE.md#verifying-code-examples, report the results in the thread, then record it:

  node .claude/hooks/example-check.mjs stamp

If you judge that none of them needs a run (for example, Prettier only rewrapped them), record why
instead, and give the same reason in your report:

  node .claude/hooks/example-check.mjs stamp --skip "<reason>"
`
  )
  process.exit(2)
} else {
  console.error('Usage: example-check.mjs <list | stamp [--skip "<reason>"] | gate>')
  process.exit(1)
}
