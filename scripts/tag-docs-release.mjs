#!/usr/bin/env node
//
// Create a git tag for every Cypress release whose changelog entry was added to
// the app changelog in a given commit range.
//
// A release's tag (`vX.Y.Z`) points at the commit that introduced its changelog
// entry, so the tag marks the state of the documentation when that version
// shipped. This is the same rule the historical tags were backfilled with.
//
// Usage:
//   node scripts/tag-docs-release.mjs --before <sha> --after <sha> [--dry-run]
//
// Environment:
//   GITHUB_TOKEN     required unless --dry-run; needs contents: write
//   GITHUB_REPOSITORY  owner/repo (set automatically by GitHub Actions)

import { execFileSync } from 'node:child_process'

const CHANGELOG = 'docs/app/references/changelog.mdx'
const API = process.env.GITHUB_API_URL || 'https://api.github.com'

function git(...args) {
  return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
}

function gitOrNull(...args) {
  try {
    return execFileSync('git', args, {
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
  } catch {
    return null
  }
}

// Headings are matched at one to three hashes on purpose: the 14.4.0 entry
// shipped as `# 14.4.0` and the typo was only fixed the following day. Being
// strict here would silently skip a release.
function versionsIn(sha) {
  const content = gitOrNull('show', `${sha}:${CHANGELOG}`)
  if (content === null) return new Set()
  const versions = new Set()
  for (const line of content.split('\n')) {
    const match = /^#{1,3}\s+(\d+\.\d+\.\d+)\s*$/.exec(line)
    if (match) versions.add(match[1])
  }
  return versions
}

function releaseDate(sha, version) {
  const content = gitOrNull('show', `${sha}:${CHANGELOG}`) || ''
  const escaped = version.replace(/\./g, '\\.')
  const match = new RegExp(`^#{1,3}\\s+${escaped}\\s*\\n\\n_Released ([^_\\n]+)_`, 'm').exec(content)
  return match ? match[1].trim() : null
}

function parseArgs(argv) {
  const args = { dryRun: false }
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--before') args.before = argv[++i]
    else if (argv[i] === '--after') args.after = argv[++i]
    else if (argv[i] === '--dry-run') args.dryRun = true
    else throw new Error(`unknown argument: ${argv[i]}`)
  }
  if (!args.after) throw new Error('--after is required')
  return args
}

// Attribute each new version to the commit that actually introduced it, rather
// than to the head of the push. For a single squash-merged PR these are the
// same commit; for a push carrying several commits they are not.
function findIntroducingCommit(version, before, after) {
  const range = before ? `${before}..${after}` : after
  const commits = git('log', '--reverse', '--format=%H', range, '--', CHANGELOG)
    .split('\n')
    .filter(Boolean)

  for (const sha of commits) {
    if (!versionsIn(sha).has(version)) continue
    const parent = gitOrNull('rev-parse', '--verify', `${sha}^1`)
    if (!parent || !versionsIn(parent.trim()).has(version)) return sha
  }
  return after
}

async function api(path, { method = 'GET', body, token } = {}) {
  const response = await fetch(`${API}${path}`, {
    method,
    headers: {
      accept: 'application/vnd.github+json',
      authorization: `Bearer ${token}`,
      'x-github-api-version': '2022-11-28',
      ...(body ? { 'content-type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const text = await response.text()
  if (!response.ok) {
    const error = new Error(`${method} ${path} -> ${response.status}: ${text}`)
    error.status = response.status
    error.body = text
    throw error
  }
  return text ? JSON.parse(text) : null
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const zero = /^0{40}$/

  // A branch-creation or force-push event gives no usable base. Tagging every
  // version in the file at the current commit would be wrong, so stop.
  if (args.before && zero.test(args.before)) {
    console.log('no usable base commit for this push — nothing to do')
    return
  }

  const before = args.before ? git('rev-parse', args.before).trim() : null
  const after = git('rev-parse', args.after).trim()

  // This repository has relocated its changelog four times. If it moves again,
  // fail loudly — a silent no-op would stop tagging releases indefinitely.
  if (gitOrNull('cat-file', '-e', `${after}:${CHANGELOG}`) === null) {
    throw new Error(
      `${CHANGELOG} does not exist at ${after.slice(0, 9)}. If the changelog moved, ` +
        'update CHANGELOG in this script and the paths filter in ' +
        '.github/workflows/tag-docs-release.yml.',
    )
  }

  const added = [...versionsIn(after)].filter((v) => !(before ? versionsIn(before) : new Set()).has(v))

  if (added.length === 0) {
    console.log('no new changelog entries in this range — nothing to do')
    return
  }

  console.log(`new changelog entries: ${added.join(', ')}`)

  const existing = new Set(git('tag', '--list').split('\n').filter(Boolean))
  const work = []

  for (const version of added) {
    const tag = `v${version}`
    if (existing.has(tag)) {
      console.log(`${tag}: already exists, skipping`)
      continue
    }
    work.push({ version, tag, commit: findIntroducingCommit(version, before, after) })
  }

  if (work.length === 0) {
    console.log('all versions already tagged — nothing to do')
    return
  }

  const token = process.env.GITHUB_TOKEN
  const repository = process.env.GITHUB_REPOSITORY
  if (!args.dryRun && (!token || !repository)) {
    throw new Error('GITHUB_TOKEN and GITHUB_REPOSITORY are required unless --dry-run')
  }

  let failed = 0

  for (const { version, tag, commit } of work) {
    const released = releaseDate(after, version)
    const subject = git('log', '-1', '--format=%s', commit).trim()
    const message = [
      `Cypress ${version} documentation`,
      '',
      released ? `Cypress ${version} was released ${released}.` : `Cypress ${version}.`,
      '',
      `This tag marks the commit where the ${version} changelog entry landed in this`,
      `repository, i.e. the state of the documentation when ${version} shipped.`,
      '',
      `  commit:  ${commit}`,
      `  subject: ${subject}`,
      '',
    ].join('\n')

    if (args.dryRun) {
      console.log(`\n--- would create ${tag} -> ${commit.slice(0, 9)} (${subject})`)
      console.log(message.replace(/^/gm, '    '))
      continue
    }

    try {
      const object = await api(`/repos/${repository}/git/tags`, {
        method: 'POST',
        token,
        body: { tag, message, object: commit, type: 'commit' },
      })
      await api(`/repos/${repository}/git/refs`, {
        method: 'POST',
        token,
        body: { ref: `refs/tags/${tag}`, sha: object.sha },
      })
      console.log(`created ${tag} -> ${commit.slice(0, 9)}`)
    } catch (error) {
      failed++
      console.error(`FAILED to create ${tag}: ${error.message}`)
      if (/workflow/i.test(error.body || '')) {
        console.error(
          '\nThe token was refused because the tagged commit contains ' +
            '.github/workflows files.\nProvide a PAT with `workflow` scope as the ' +
            'RELEASE_TAG_TOKEN secret and re-run.',
        )
      }
    }
  }

  if (failed > 0) process.exit(1)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
