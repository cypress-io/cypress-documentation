#!/usr/bin/env node
//
// Locate the Cypress source that an API reference page documents.
//
// The behavior an API page describes is implemented in cypress-io/cypress, a
// different repository. This script keeps a small, pinned checkout of the parts
// of that repository the reference pages describe, and resolves a command name
// to the files that define it. A command's file is often not named after the
// command (`.blur()` lives in `actions/focus.ts`), so the lookup is the point:
// it replaces a guess with a path you can open.
//
// The checkout is a shallow, blobless, sparse clone of a release tag — a few
// seconds and a few megabytes — so it holds the source as it shipped, not as
// `develop` currently has it. Use `--ref` to read a branch instead when you are
// documenting behavior that has not been released yet.
//
// Usage:
//   node scripts/api-source.mjs                 # sync the checkout, print its state
//   node scripts/api-source.mjs blur            # resolve `.blur()`
//   node scripts/api-source.mjs cy.intercept    # `cy.` and `()` are optional
//   node scripts/api-source.mjs blur --ref develop
//   node scripts/api-source.mjs blur --json
//
// Environment:
//   CYPRESS_SOURCE_DIR  where the checkout lives (default: .cypress-source)
//   CYPRESS_SOURCE_REF  default ref, same as --ref (default: latest `v*` tag)

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const REPO = 'https://github.com/cypress-io/cypress.git'
const SOURCE_DIR = process.env.CYPRESS_SOURCE_DIR || '.cypress-source'

// Only the directories the API reference pages describe. Everything else in the
// monorepo is build tooling, the app UI, and the server — none of which a
// reference page documents. Keeping this list tight is what makes the checkout
// small enough to re-clone on a whim.
const SPARSE_PATHS = [
  'packages/driver/src/cy/**',
  'packages/driver/src/cypress/**',
  'packages/driver/src/dom/**',
  'packages/driver/cypress/e2e/commands/**',
  'packages/driver/cypress/e2e/cypress/**',
  'packages/config/src/**',
  // Not every command declares its public types in `cli/types`. `cy.intercept()`
  // augments `Cypress.Chainable` from the package that implements it.
  'packages/network-interception/lib/types/**',
  'cli/types/**',
  'cli/CHANGELOG.md',
]

const args = process.argv.slice(2)
const json = args.includes('--json')
const refIndex = args.indexOf('--ref')
const refArg = refIndex === -1 ? undefined : args[refIndex + 1]
const query = args.filter((a, i) => !a.startsWith('--') && (refIndex === -1 || i !== refIndex + 1))[0]

const git = (cwd, ...gitArgs) =>
  execFileSync('git', gitArgs, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()

function latestReleaseTag() {
  const output = execFileSync(
    'git',
    ['ls-remote', '--tags', '--sort=-v:refname', REPO, 'v*'],
    { encoding: 'utf8' }
  )

  for (const line of output.split('\n')) {
    const match = line.match(/refs\/tags\/(v\d+\.\d+\.\d+)$/)

    if (match) return match[1]
  }

  throw new Error('could not resolve the latest Cypress release tag')
}

function sync(ref) {
  const exists = fs.existsSync(path.join(SOURCE_DIR, '.git'))
  const marker = path.join(SOURCE_DIR, '.synced-ref')

  // Re-fetching costs far more than every lookup that follows it, so a checkout
  // already sitting on this ref is left alone. A branch moves under us, so only
  // an immutable tag is trusted to still be what the marker says.
  if (exists && fs.existsSync(marker) && fs.readFileSync(marker, 'utf8') === ref && /^v\d/.test(ref)) {
    return
  }

  if (!exists) {
    fs.rmSync(SOURCE_DIR, { recursive: true, force: true })
    execFileSync(
      'git',
      ['clone', '--filter=blob:none', '--no-checkout', '--depth', '1', '--branch', ref, REPO, SOURCE_DIR],
      { stdio: 'inherit' }
    )
    git(SOURCE_DIR, 'sparse-checkout', 'set', '--no-cone', ...SPARSE_PATHS)
    git(SOURCE_DIR, 'checkout', ref)
    fs.writeFileSync(marker, ref)

    return
  }

  // A blobless clone fetches file contents on demand, so switching refs costs
  // only the blobs that actually changed.
  git(SOURCE_DIR, 'fetch', '--depth', '1', '--tags', REPO, ref)
  git(SOURCE_DIR, 'sparse-checkout', 'set', '--no-cone', ...SPARSE_PATHS)
  git(SOURCE_DIR, 'checkout', '--force', 'FETCH_HEAD')
  fs.writeFileSync(marker, ref)
}

function walk(dir) {
  const entries = fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }) : []

  return entries.flatMap((entry) => {
    const full = path.join(dir, entry.name)

    return entry.isDirectory() ? walk(full) : [full]
  })
}

function search(files, patterns) {
  const hits = []

  for (const file of files) {
    const lines = fs.readFileSync(file, 'utf8').split('\n')

    lines.forEach((line, index) => {
      if (patterns.some((pattern) => pattern.test(line))) {
        hits.push({
          file: path.relative(SOURCE_DIR, file).split(path.sep).join('/'),
          line: index + 1,
          text: line.trim(),
        })
      }
    })
  }

  return hits
}

const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Anything that declares part of the public `cy.*` surface, wherever it lives.
function typeFiles() {
  return walk(SOURCE_DIR)
    .filter((f) => /\.ts$/.test(f) && !f.includes('/tests/') && !f.includes('/.git/'))
    .filter((f) => /interface Chainable<|namespace Cypress \{/.test(fs.readFileSync(f, 'utf8')))
}

function resolve(name) {
  const n = escape(name)
  const capitalized = name[0].toUpperCase() + name.slice(1)

  const commandFiles = walk(path.join(SOURCE_DIR, 'packages/driver/src/cy'))
    .filter((f) => f.endsWith('.ts'))

  return {
    // Commands reach the registry four ways: `Commands.add('name', fn)`,
    // `Commands.addQuery('name', fn)`, an object literal of methods passed to
    // `Commands.addAll`, and a named function collected into that object.
    implementation: search(commandFiles, [
      new RegExp(`Commands\\.add(?:Query|All|AllSync|Sync)?\\(\\s*(?:\\{[^}]*\\},\\s*)?['"]${n}['"]`),
      new RegExp(`Commands\\.add(?:All|AllSync)?\\(\\s*\\{[^)]*\\b${n}\\b`),
      new RegExp(`^\\s{2,}'?${n}'?(?:<[^>]*>)? ?\\(`),
      new RegExp(`^\\s{2,}'?${n}'?: ?(?:function|async)`),
      new RegExp(`^\\s*(?:export )?(?:async )?function ${n} ?\\(`),
    ]),
    // The published signature and its options interface — what a reader's
    // editor autocompletes, and the authority for the Arguments table.
    types: search(typeFiles(), [
      new RegExp(`^\\s+${n}(?:<[^>]*>)?\\(`),
      new RegExp(`^\\s+${n}: [A-Z]`),
      new RegExp(`interface ${escape(capitalized)}Options\\b`),
    ]),
    // Every message the command can throw, which is what the Requirements
    // bullets are really describing. Some commands nest a level deeper, under
    // the subsystem that owns them (`net_stubbing.intercept`).
    errors: search([path.join(SOURCE_DIR, 'packages/driver/src/cypress/error_messages.ts')], [
      new RegExp(`^\\s{2,6}'?${n}'?: \\{`),
    ]),
    // The executable specification: the driver's own tests for the command.
    // Their describe blocks name the command half a dozen ways.
    tests: search(
      walk(path.join(SOURCE_DIR, 'packages/driver/cypress/e2e')).filter((f) => /\.(ts|js)$/.test(f)),
      [new RegExp(`^\\s*(?:context|describe)\\(\\s*['"](?:#|\\.|cy\\.)?${n}(?:\\(\\))?['"]`)]
    ),
  }
}

function report(name, ref, found) {
  const permalink = ({ file, line }) => `https://github.com/cypress-io/cypress/blob/${ref}/${file}#L${line}`
  const labels = {
    implementation: 'Implementation',
    types: 'Type signature',
    errors: 'Error messages',
    tests: 'Driver tests',
  }

  console.log(`\n${name} — cypress-io/cypress @ ${ref}\n`)

  for (const [key, label] of Object.entries(labels)) {
    const hits = found[key]

    if (!hits.length) {
      console.log(`${label.padEnd(16)}not found — search ${SOURCE_DIR}/ by hand`)
      continue
    }

    hits.forEach((hit, index) => {
      console.log(`${(index === 0 ? label : '').padEnd(16)}${SOURCE_DIR}/${hit.file}:${hit.line}`)
      console.log(`${''.padEnd(16)}  ${hit.text.slice(0, 96)}`)
      console.log(`${''.padEnd(16)}  ${permalink(hit)}`)
    })
  }

  console.log(`\n${'Changelog'.padEnd(16)}${SOURCE_DIR}/cli/CHANGELOG.md`)
  console.log(`${''.padEnd(16)}  the source for the page's ## History table\n`)
}

const ref = refArg || process.env.CYPRESS_SOURCE_REF || latestReleaseTag()

sync(ref)

if (!query) {
  console.log(`${SOURCE_DIR}/ is synced to cypress-io/cypress @ ${ref}`)
  console.log('Pass a command name to resolve it, e.g. `npm run api:source -- blur`')
  process.exit(0)
}

const name = query.replace(/^cy\./, '').replace(/^\./, '').replace(/\(\)$/, '')
const found = resolve(name)

if (json) {
  console.log(JSON.stringify({ command: name, ref, ...found }, null, 2))
} else {
  report(`.${name}()`, ref, found)
}
