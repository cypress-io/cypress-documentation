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
// not, so it doesn't depend on how the commit is made. The reminder is keyed
// to a fingerprint of the changed blocks: editing a block brings it back once,
// while prose edits don't.

import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const cwd = process.env.CLAUDE_PROJECT_DIR || process.cwd()
const root = execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd, encoding: 'utf8' }).trim()
const gitDir = execFileSync('git', ['rev-parse', '--absolute-git-dir'], { cwd: root, encoding: 'utf8' }).trim()
const remindedPath = join(gitDir, 'example-check-reminded')

function git(args, stderr = 'inherit') {
  return execFileSync('git', args, {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    stdio: ['ignore', 'pipe', stderr],
  })
}

// A file's content at a revision, or '' when it has none there (a new file).
// Git's "exists on disk, but not in 'HEAD'" message is expected, so it's muted.
function show(spec) {
  try {
    return git(['show', spec], 'ignore')
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

// Blocks added or changed from HEAD: in the index, in the working tree, or in
// a new file git doesn't track yet. A block that exists word for word in a docs
// file that was deleted or renamed counts as moved, not changed, so moving or
// splitting a page doesn't flag its examples, even with a plain `mv` that git
// can't yet see as a rename. Untracked files count because an agent can
// create a page and commit it in one command (`git add page.mdx && git commit`),
// and the hook runs before the `git add`.
function changedBlocks() {
  const docs = ['--', 'docs/**/*.md', 'docs/**/*.mdx']
  const files = new Map() // path -> path at HEAD
  const rows = [
    ...git(['diff', '--cached', '-M', '--name-status', '--diff-filter=AMR', ...docs]).split('\n'),
    ...git(['diff', 'HEAD', '-M', '--name-status', '--diff-filter=AMR', ...docs]).split('\n'),
    ...git(['ls-files', '--others', '--exclude-standard', ...docs])
      .split('\n')
      .map((path) => path && `A\t${path}`),
  ]
  for (const row of rows) {
    if (!row) continue
    const parts = row.split('\t')
    const path = parts[parts.length - 1]
    // The nested agent guides document conventions; they aren't docs pages.
    if (/(^|\/)(AGENTS|CLAUDE)\.md$/.test(path)) continue
    files.set(path, parts[0].startsWith('R') ? parts[1] : path)
  }
  const moved = new Set()
  const gone = [
    ...git(['diff', '--cached', '--no-renames', '--name-only', '--diff-filter=D', ...docs]).split('\n'),
    ...git(['diff', 'HEAD', '--no-renames', '--name-only', '--diff-filter=D', ...docs]).split('\n'),
  ]
  for (const path of new Set(gone.filter(Boolean))) {
    for (const block of codeBlocks(show(`HEAD:${path}`))) moved.add(block.body)
  }
  const seen = new Set()
  const changed = []
  for (const [path, headPath] of [...files].sort()) {
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

function fingerprint(blocks) {
  const keys = blocks.map((b) => `${b.path}\0${b.body}`).sort()
  return createHash('sha256').update(keys.join('\0\0')).digest('hex')
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
  const current = fingerprint(blocks)
  if (existsSync(remindedPath) && readFileSync(remindedPath, 'utf8').trim() === current) process.exit(0)
  writeFileSync(remindedPath, `${current}\n`)
  process.stderr.write(
    `Reminder: these code examples changed since the last commit.

${describe(blocks)}

Before committing, run each one in the .example-check/ harness and report the results in the thread,
following AGENTS_REFERENCE.md#verifying-code-examples. If you judge that one doesn't need a run (for
example, Prettier only rewrapped it), say so and why in your report.

This reminder shows once for these changes. When you've handled them, run the same commit again.
`
  )
  process.exit(2)
} else {
  console.error('Usage: example-check.mjs <list | gate>')
  process.exit(1)
}
