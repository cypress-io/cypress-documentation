#!/usr/bin/env node
// Commit gate for AGENTS_REFERENCE.md#verifying-code-examples.
//
//   node .claude/hooks/example-check.mjs list
//       Print every code block added or changed in the staged docs changes.
//   node .claude/hooks/example-check.mjs stamp
//       Record that those blocks were verified and reported in the thread.
//   node .claude/hooks/example-check.mjs stamp --formatting-only "<reason>"
//       Record that the blocks changed only in formatting, so none needed a run.
//   node .claude/hooks/example-check.mjs gate
//       PreToolUse hook: reads the tool call on stdin and blocks a `git commit`
//       whose changed code blocks have no matching stamp.
//
// The stamp holds a fingerprint of the changed blocks, so editing a block after
// stamping it invalidates the stamp and the gate asks for another run. Prose
// edits outside code blocks don't change the fingerprint.

import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const root = execFileSync('git', ['rev-parse', '--show-toplevel'], {
  cwd: process.env.CLAUDE_PROJECT_DIR || process.cwd(),
  encoding: 'utf8',
}).trim()
const gitDir = execFileSync('git', ['rev-parse', '--absolute-git-dir'], {
  cwd: root,
  encoding: 'utf8',
}).trim()
const stampPath = join(gitDir, 'example-check-verified')

function git(args) {
  return execFileSync('git', args, {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  })
}

function show(spec) {
  try {
    return git(['show', spec])
  } catch {
    return ''
  }
}

// Fenced blocks in a Markdown/MDX source. A fence closes on the same character
// repeated at least as many times, so a ```` block can contain ``` examples.
function codeBlocks(source) {
  const blocks = []
  const lines = source.split('\n')
  let open = null
  lines.forEach((line, i) => {
    const m = line.match(/^\s*(`{3,}|~{3,})(.*)$/)
    if (!open) {
      if (m) open = { fence: m[1], info: m[2].trim(), start: i + 1, body: [] }
      return
    }
    if (
      m &&
      m[1][0] === open.fence[0] &&
      m[1].length >= open.fence.length &&
      m[2].trim() === ''
    ) {
      blocks.push({
        info: open.info,
        line: open.start,
        body: open.body.join('\n'),
      })
      open = null
      return
    }
    open.body.push(line)
  })
  return blocks
}

// Code blocks added or changed relative to HEAD. With `all`, the working tree
// is compared (what `git commit -a` would commit); otherwise the index is.
function changedBlocks({ all = false } = {}) {
  const diffArgs = all ? ['diff', 'HEAD'] : ['diff', '--cached']
  const status = git([
    ...diffArgs,
    '-M',
    '--name-status',
    '--diff-filter=AMR',
    '--',
    'docs/**/*.md',
    'docs/**/*.mdx',
  ])
  const changed = []
  for (const row of status.split('\n').filter(Boolean)) {
    const parts = row.split('\t')
    const path = parts[parts.length - 1]
    const oldPath = parts[0].startsWith('R') ? parts[1] : path
    // The nested agent guides document conventions; they aren't docs pages.
    if (/(^|\/)(AGENTS|CLAUDE)\.md$/.test(path)) continue
    const now = all
      ? readFileSync(join(root, path), 'utf8')
      : show(`:${path}`)
    const before = new Set(codeBlocks(show(`HEAD:${oldPath}`)).map((b) => b.body))
    for (const block of codeBlocks(now)) {
      if (!before.has(block.body)) changed.push({ path, ...block })
    }
  }
  return changed
}

function fingerprint(blocks) {
  const hash = createHash('sha256')
  for (const b of blocks) hash.update(`${b.path}\0${b.body}\0`)
  return hash.digest('hex')
}

function describe(blocks) {
  return blocks
    .map((b) => `  ${b.path}:${b.line}  ${b.info || '(no language)'}`)
    .join('\n')
}

const [mode, ...rest] = process.argv.slice(2)

if (mode === 'list') {
  const blocks = changedBlocks()
  console.log(
    blocks.length
      ? `Code blocks added or changed in the staged docs changes:\n${describe(blocks)}`
      : 'No code blocks added or changed in the staged docs changes.'
  )
} else if (mode === 'stamp') {
  const blocks = changedBlocks()
  if (!blocks.length) {
    console.log('No changed code blocks are staged, so there is nothing to stamp.')
    process.exit(0)
  }
  const formattingOnly = rest[0] === '--formatting-only'
  const reason = formattingOnly ? rest.slice(1).join(' ').trim() : ''
  if (formattingOnly && !reason) {
    console.error('--formatting-only needs a reason, such as "Prettier rewrapped the block".')
    process.exit(1)
  }
  writeFileSync(
    stampPath,
    JSON.stringify(
      {
        fingerprint: fingerprint(blocks),
        kind: formattingOnly ? 'formatting-only' : 'verified',
        reason,
        blocks: blocks.map((b) => `${b.path}:${b.line}`),
        at: new Date().toISOString(),
      },
      null,
      2
    )
  )
  console.log(
    `Stamped ${blocks.length} code block(s) as ${formattingOnly ? 'formatting only' : 'verified'}:\n${describe(blocks)}`
  )
} else if (mode === 'gate') {
  let input = {}
  try {
    input = JSON.parse(readFileSync(0, 'utf8') || '{}')
  } catch {
    process.exit(0)
  }
  const command = input.tool_input?.command ?? ''
  // `git commit` where it runs as a command: at the start, or after a shell
  // separator or `then`/`do`, optionally behind env assignments. A mention
  // inside a quoted string or a commit message doesn't count.
  const commits =
    /(?:^|[;&|(\n]|\bthen\b|\bdo\b)\s*(?:\w+=\S*\s+)*git\s+(?:-[cC]\s+\S+\s+)*commit(?![\w-])/
  if (input.tool_name !== 'Bash' || !commits.test(command)) {
    process.exit(0)
  }
  // `git commit -a` / `-am` / `--all` commits tracked working-tree changes too.
  const all = /(^|\s)(--all|-[A-Za-z]*a[A-Za-z]*)(?=\s|$)/.test(command)
  const blocks = changedBlocks({ all })
  if (!blocks.length) process.exit(0)
  let stamp = null
  if (existsSync(stampPath)) {
    try {
      stamp = JSON.parse(readFileSync(stampPath, 'utf8'))
    } catch {}
  }
  if (stamp?.fingerprint === fingerprint(blocks)) process.exit(0)
  const stale = stamp ? ' A stamp exists, but the blocks changed after it was written.' : ''
  process.stderr.write(
    `Commit blocked: this commit adds or changes code examples that haven't been verified.${stale}

${describe(blocks)}

Run each one in the .example-check/ harness and report the results in the thread, following
AGENTS_REFERENCE.md#verifying-code-examples. Then record it and commit again:

  node .claude/hooks/example-check.mjs stamp

If the blocks changed only in formatting (for example, Prettier rewrapped them), record that instead,
and say so in your report:

  node .claude/hooks/example-check.mjs stamp --formatting-only "<what changed>"
`
  )
  process.exit(2)
} else {
  console.error('Usage: example-check.mjs <list|stamp [--formatting-only "<reason>"]|gate>')
  process.exit(1)
}
