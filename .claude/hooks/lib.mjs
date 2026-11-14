// Shared by the commit reminders in this directory (example-check.mjs and
// page-review.mjs): the repository's paths, git helpers, the set of changed
// docs files, and the once-per-change memory each reminder keeps in .git/.

import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const cwd = process.env.CLAUDE_PROJECT_DIR || process.cwd()
export const root = execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd, encoding: 'utf8' }).trim()
export const gitDir = execFileSync('git', ['rev-parse', '--absolute-git-dir'], { cwd: root, encoding: 'utf8' }).trim()

export function git(args, stderr = 'inherit') {
  return execFileSync('git', args, {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    stdio: ['ignore', 'pipe', stderr],
  })
}

// A file's content at a revision, or '' when it has none there (a new file).
// Git's "exists on disk, but not in 'HEAD'" message is expected, so it's muted.
export function show(spec) {
  try {
    return git(['show', spec], 'ignore')
  } catch {
    return ''
  }
}

export function read(path) {
  try {
    return readFileSync(join(root, path), 'utf8')
  } catch {
    return ''
  }
}

export function hash(...parts) {
  return createHash('sha256').update(parts.join('\0')).digest('hex')
}

// Fenced blocks in a Markdown/MDX source. A fence closes on the same character
// repeated at least as many times, so a ```` block can contain ``` examples.
export function codeBlocks(source) {
  const blocks = []
  let open = null
  source.split('\n').forEach((line, i) => {
    const m = line.match(/^\s*(`{3,}|~{3,})(.*)$/)
    if (!open) {
      if (m) open = { fence: m[1], info: m[2].trim(), line: i + 1, end: 0, body: [] }
    } else if (m && m[1][0] === open.fence[0] && m[1].length >= open.fence.length && !m[2].trim()) {
      blocks.push({ info: open.info, line: open.line, end: i + 1, body: open.body.join('\n') })
      open = null
    } else {
      open.body.push(line)
    }
  })
  return blocks
}

// Docs files added or changed from HEAD: in the index, in the working tree, or
// new and untracked. Untracked files count because an agent can create a page
// and commit it in one command (`git add page.mdx && git commit`), and the hook
// runs before the `git add`. `files` maps each path to its path at HEAD (they
// differ for a rename git can see); `gone` lists docs files deleted or renamed
// away, so a caller can recognize content that moved with a plain `mv`.
export function changedDocs() {
  const docs = ['--', 'docs/**/*.md', 'docs/**/*.mdx']
  const files = new Map()
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
  const gone = [
    ...git(['diff', '--cached', '--no-renames', '--name-only', '--diff-filter=D', ...docs]).split('\n'),
    ...git(['diff', 'HEAD', '--no-renames', '--name-only', '--diff-filter=D', ...docs]).split('\n'),
  ]
  return { files: new Map([...files].sort()), gone: [...new Set(gone.filter(Boolean))] }
}

// `git commit` at the start of a command or after a shell separator, with any
// of git's global options in between (`--no-pager`, `-P`, `-C <dir>`,
// `-c <key=value>`). It doesn't parse shell quoting, so a quoted string that
// contains a separator and `git commit` (`echo "a; git commit"`) also matches.
// That's accepted: it's a reminder, not a guarantee, and the report in the
// thread is the real check.
const commits =
  /(?:^|[;&|(\n]|\bthen\b|\bdo\b)\s*(?:\w+=\S*\s+)*git(?:\s+(?:-[cC]\s+\S+|-\S+))*\s+commit(?![\w-])/

// True when the PreToolUse input on stdin is a Bash call that runs `git commit`.
export function isCommit() {
  try {
    const input = JSON.parse(readFileSync(0, 'utf8') || '{}')
    return input.tool_name === 'Bash' && commits.test(input.tool_input?.command ?? '')
  } catch {
    return false
  }
}

// The keys a reminder has already mentioned. `save` keeps only the keys still
// pending, so the file doesn't grow forever.
export function reminded(name) {
  const path = join(gitDir, name)
  const keys = new Set(existsSync(path) ? readFileSync(path, 'utf8').split('\n') : [])
  return {
    has: (key) => keys.has(key),
    save: (pending) => writeFileSync(path, `${pending.join('\n')}\n`),
  }
}
