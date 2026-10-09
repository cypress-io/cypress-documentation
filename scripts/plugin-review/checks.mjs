// @ts-check
/**
 * Pure evaluators for the plugin requirements in CONTRIBUTING.md
 * ("Adding Plugins"). Each takes data the caller already fetched and returns
 * result rows. Nothing here touches the network, so the unit tests call it
 * directly.
 *
 * A row is `{ label, status, detail }`, where status is one of:
 *   - met         the requirement is satisfied
 *   - not_met     the requirement is clearly not satisfied
 *   - unclear     a maintainer should look (ambiguous, or couldn't be decided)
 *   - not_checked the check couldn't run (no repo to inspect, no API key, …)
 */

import semver from 'semver'
import { cypressCompat } from '../plugin-signals.mjs'
import { pluginEntryErrors } from '../plugins-schema.mjs'
import { normalizeLink } from './diff.mjs'

export const STATUS = /** @type {const} */ ({
  met: 'met',
  notMet: 'not_met',
  unclear: 'unclear',
  notChecked: 'not_checked',
})

const row = (label, status, detail = '') => ({ label, status, detail })

/** Format a value as inline code for the comment. A backtick inside the value
 *  would end the span early, so this drops them. */
export const code = (value) => '`' + String(value).replace(/`/g, '') + '`'

/**
 * Check the entry itself: the fields CONTRIBUTING.md documents, the badge, and
 * that it doesn't duplicate an entry already on the list.
 * @param {Record<string, any>} plugin
 * @param {Array<{ plugin: Record<string, any> }>} existing entries already in the base file
 */
export function checkEntry(plugin, existing) {
  const rows = []
  const problems = pluginEntryErrors(plugin)
  rows.push(
    problems.length
      ? row('Entry fields', STATUS.notMet, capitalize(problems.join('; ')))
      : row(
          'Entry fields',
          STATUS.met,
          'Name, description, and link are present'
        )
  )

  if (plugin.badge === 'official') {
    const cypressOwned = isCypressOwned(plugin.link)
    rows.push(
      cypressOwned
        ? row(
            'Badge',
            STATUS.met,
            `${code('official')} on a Cypress-owned link`
          )
        : row(
            'Badge',
            STATUS.notMet,
            `${code('official')} is reserved for Cypress-owned plugins; use ${code('community')}`
          )
    )
  }

  const link = normalizeLink(plugin.link)
  const name = (plugin.name || '').toLowerCase()
  const npm = (plugin.npm || '').toLowerCase()
  const dupe = existing.find(({ plugin: other }) => {
    if (link && normalizeLink(other.link) === link) return true
    if (name && (other.name || '').toLowerCase() === name) return true
    const otherNpm = (other.npm || other.name || '').toLowerCase()
    return Boolean(npm && otherNpm === npm)
  })
  rows.push(
    dupe
      ? row(
          'Not already listed',
          STATUS.notMet,
          `Matches the existing entry ${code(dupe.plugin.name)}`
        )
      : row('Not already listed', STATUS.met)
  )

  return rows
}

/** A cypress-io repository, a cypress.io site, or a path on this docs site
 *  (which is how official plugins documented here link to their page). */
function isCypressOwned(link) {
  if (typeof link !== 'string') return false
  if (/^\/(?!\/)/.test(link)) return true
  return /^https:\/\/(github\.com\/cypress-io\/|([\w-]+\.)?cypress\.io(\/|$))/i.test(
    link
  )
}

/**
 * Check the npm package: published, package.json metadata, Cypress support.
 * @param {{ pkg: string | null, manifest: any, notFound: boolean, failed?: boolean }} npm result of `resolveNpm`
 * @param {number | null} cypressMajor latest major version of Cypress, or null if unknown
 */
export function checkNpm(npm, cypressMajor) {
  const compatLabel = cypressMajor
    ? `Supports Cypress ${cypressMajor}`
    : 'Supports the latest Cypress'

  if (!npm.manifest) {
    let published
    if (npm.failed) {
      published = row(
        'Published to npm',
        STATUS.notChecked,
        'The npm registry couldn’t be reached'
      )
    } else if (npm.pkg && npm.notFound) {
      published = row(
        'Published to npm',
        STATUS.notMet,
        `${code(npm.pkg)} isn’t on the npm registry`
      )
    } else {
      published = row(
        'Published to npm',
        STATUS.unclear,
        `No npm package found under this name. If it’s published, add an ${code('npm')} field`
      )
    }
    const skipped = 'Needs an npm package to check'
    return [
      published,
      row('package.json metadata', STATUS.notChecked, skipped),
      row(compatLabel, STATUS.notChecked, skipped),
    ]
  }

  const manifest = npm.manifest
  const latest = manifest['dist-tags'] && manifest['dist-tags'].latest
  const vm = latest && manifest.versions ? manifest.versions[latest] : undefined
  const rows = []

  if (!vm || /-security$/.test(latest)) {
    rows.push(
      row(
        'Published to npm',
        STATUS.notMet,
        `${code(manifest.name)} has no installable release`
      )
    )
  } else if (typeof vm.deprecated === 'string') {
    rows.push(
      row(
        'Published to npm',
        STATUS.notMet,
        `${code(`${manifest.name}@${latest}`)} is deprecated on npm`
      )
    )
  } else {
    rows.push(
      row('Published to npm', STATUS.met, code(`${manifest.name}@${latest}`))
    )
  }

  const fields = ['homepage', 'repository', 'bugs']
  const missing = fields.filter((f) => !hasValue(vm && vm[f]))
  rows.push(
    missing.length
      ? row(
          'package.json metadata',
          STATUS.notMet,
          `Missing ${listOf(missing.map(code))}`
        )
      : row(
          'package.json metadata',
          STATUS.met,
          `${listOf(fields.map(code))} are set`
        )
  )

  rows.push(checkCompat(vm, cypressMajor, compatLabel))
  return rows
}

function checkCompat(vm, cypressMajor, label) {
  // Only a peer range is a compatibility claim. A dev or runtime dependency is
  // the version the plugin is built against, which is weaker evidence, so it
  // can raise a flag for a maintainer but never fail the check on its own.
  const rawPeer = vm && vm.peerDependencies && vm.peerDependencies.cypress
  if (typeof rawPeer === 'string' && rawPeer.trim() === '*') {
    return row(label, STATUS.met, `Peer range ${code('*')} accepts any version`)
  }
  // cypressCompat skips monorepo placeholders such as `0.0.0-development`.
  const peer = cypressCompat({ peerDependencies: vm && vm.peerDependencies })
  const range = peer || cypressCompat(vm)

  if (!range) {
    return row(
      label,
      STATUS.unclear,
      `No ${code('cypress')} peer dependency declared`
    )
  }
  const source = peer ? 'peer range' : 'dev dependency'
  if (!cypressMajor) {
    return row(
      label,
      STATUS.notChecked,
      `Couldn’t look up the latest Cypress version (${source} ${code(range)})`
    )
  }
  if (!semver.validRange(range)) {
    return row(label, STATUS.unclear, `Can’t read the ${source} ${code(range)}`)
  }
  const supports = semver.intersects(range, `^${cypressMajor}.0.0`)
  if (peer) {
    return supports
      ? row(label, STATUS.met, `Peer range ${code(range)}`)
      : row(
          label,
          STATUS.notMet,
          `Peer range ${code(range)} excludes Cypress ${cypressMajor}`
        )
  }
  return supports
    ? row(
        label,
        STATUS.met,
        `Built against ${code(range)}; no peer dependency declared`
      )
    : row(
        label,
        STATUS.unclear,
        `No peer dependency; built against ${code(range)}, not Cypress ${cypressMajor}`
      )
}

const TEST_PATTERNS = [
  /(^|\/)cypress\.config\.[cm]?[jt]s$/,
  /(^|\/)cypress\.json$/,
  /\.cy\.[cm]?[jt]sx?$/,
  /(^|\/)cypress\/(e2e|integration|component)\/.+\.[cm]?[jt]sx?$/,
]

/** @type {Array<[RegExp, string]>} */
const CI_PATTERNS = [
  [/^\.github\/workflows\/[^/]+\.ya?ml$/, 'GitHub Actions'],
  [/^\.circleci\/config\.ya?ml$/, 'CircleCI'],
  [/^\.gitlab-ci\.ya?ml$/, 'GitLab CI'],
  [/^azure-pipelines\.ya?ml$/, 'Azure Pipelines'],
  [/^bitbucket-pipelines\.ya?ml$/, 'Bitbucket Pipelines'],
  [/^\.travis\.ya?ml$/, 'Travis CI'],
  [/^Jenkinsfile$/, 'Jenkins'],
]

/**
 * Check the source repository: reachable and not archived, Cypress tests, CI.
 * `repo` is what `loadRepo` returns: `host` ('github' or 'other'); for GitHub,
 * `info` (the repo object, or null with `infoStatus` set), `path` (a monorepo
 * subpath, '' for the root), `tree` (`{ paths, truncated }` or null),
 * `workflows` (workflow path -> contents), `runs` (recent completed Actions
 * runs on the default branch, newest first), and `branch`.
 * @param {Record<string, any>} repo
 */
export function checkRepo(repo) {
  if (repo.host !== 'github') {
    const why = 'Only GitHub repositories are inspected automatically'
    return [
      row('Source repository', STATUS.notChecked, why),
      row('Cypress tests', STATUS.notChecked, why),
      row('CI pipeline', STATUS.notChecked, why),
    ]
  }

  if (!repo.info) {
    const why =
      repo.infoStatus === 404
        ? 'Repository not found, or it’s private'
        : 'GitHub couldn’t be reached'
    const status = repo.infoStatus === 404 ? STATUS.notMet : STATUS.notChecked
    return [
      row('Source repository', status, why),
      row('Cypress tests', STATUS.notChecked, 'Needs a readable repository'),
      row('CI pipeline', STATUS.notChecked, 'Needs a readable repository'),
    ]
  }

  const rows = [
    repo.info.archived
      ? row('Source repository', STATUS.notMet, 'Repository is archived')
      : row('Source repository', STATUS.met, 'Public and not archived'),
  ]

  if (!repo.tree) {
    rows.push(
      row(
        'Cypress tests',
        STATUS.notChecked,
        'Couldn’t list the repository files'
      )
    )
    rows.push(
      row(
        'CI pipeline',
        STATUS.notChecked,
        'Couldn’t list the repository files'
      )
    )
    return rows
  }

  rows.push(checkTests(repo.tree, repo.path || ''))
  rows.push(
    checkCi(repo.tree, repo.workflows || {}, repo.runs || [], repo.branch || '')
  )
  return rows
}

function checkTests(tree, path) {
  const prefix = path ? `${path.replace(/\/+$/, '')}/` : ''
  const inScope = tree.paths.filter((p) => p.startsWith(prefix))
  const configs = inScope.filter(
    (p) => TEST_PATTERNS[0].test(p) || TEST_PATTERNS[1].test(p)
  )
  const specs = inScope.filter(
    (p) => TEST_PATTERNS[2].test(p) || TEST_PATTERNS[3].test(p)
  )
  const where = prefix ? ` under ${code(prefix)}` : ''

  if (!configs.length && !specs.length) {
    return row(
      'Cypress tests',
      tree.truncated ? STATUS.unclear : STATUS.notMet,
      tree.truncated
        ? `None found${where}, but the repository is too large to list in full`
        : `No ${code('cypress.config.*')} or ${code('*.cy.*')} files${where}`
    )
  }
  const parts = []
  if (configs.length) parts.push(code(configs[0].split('/').pop()))
  if (specs.length)
    parts.push(`${specs.length} spec ${specs.length === 1 ? 'file' : 'files'}`)
  return row(
    'Cypress tests',
    STATUS.met,
    `Found ${parts.join(' and ')}${where}`
  )
}

// How a workflow runs Cypress: the official action, the CLI, or a package
// script named for it. A bare mention (a repo called cypress-io/…) isn't one.
const RUNS_CYPRESS =
  /cypress-io\/github-action|\bcypress\s+run\b|\bcy(?:press)?:run\b|\bcypress-run\b/i

function checkCi(tree, workflows, runs, branch) {
  const systems = new Set()
  for (const p of tree.paths) {
    for (const [pattern, system] of CI_PATTERNS) {
      if (pattern.test(p)) systems.add(system)
    }
  }
  if (!systems.size) {
    return row('CI pipeline', STATUS.notMet, 'No CI configuration found')
  }

  const cypressWorkflows = Object.keys(workflows).filter((p) =>
    RUNS_CYPRESS.test(workflows[p])
  )
  const parts = [[...systems].join(', ')]

  if (Object.keys(workflows).length && !cypressWorkflows.length) {
    parts.push('no workflow runs Cypress directly')
    return row('CI pipeline', STATUS.unclear, parts.join('; '))
  }
  if (cypressWorkflows.length) {
    const names = cypressWorkflows.map((p) => code(p.split('/').pop()))
    parts.push(
      `${listOf(names)} ${names.length === 1 ? 'runs' : 'run'} Cypress`
    )
  }

  // Judge the latest finished run of a workflow that runs Cypress, not
  // whichever unrelated job happened to finish last.
  const run = runs.find((r) => cypressWorkflows.includes(r.path))
  if (run) {
    const which = `latest ${code(run.path.split('/').pop())} run on ${code(branch)}`
    if (run.conclusion === 'failure') {
      parts.push(`${which} failed`)
      return row('CI pipeline', STATUS.unclear, parts.join('; '))
    }
    if (run.conclusion === 'success') parts.push(`${which} passed`)
  }
  return row('CI pipeline', STATUS.met, parts.join('; '))
}

export const DOCS_CRITERIA = /** @type {const} */ ([
  ['purpose', 'Purpose stated up front'],
  ['installation', 'Installation guide'],
  ['api', 'Options and API documented'],
  ['usability', 'Usable without reading the source'],
])

/**
 * Turn the docs review into rows. `review` is the parsed model output, or an
 * object with `skipped` set to the reason it didn't run.
 * @param {{ skipped?: string, criteria?: Record<string, { status: string, detail: string }> }} review
 */
export function checkDocs(review) {
  return DOCS_CRITERIA.map(([key, label]) => {
    if (review.skipped || !review.criteria || !review.criteria[key]) {
      return row(
        label,
        STATUS.notChecked,
        review.skipped || 'No assessment returned'
      )
    }
    const { status, detail } = review.criteria[key]
    const known = Object.values(STATUS).includes(/** @type {any} */ (status))
    return row(label, known ? status : STATUS.unclear, detail)
  })
}

function hasValue(v) {
  if (!v) return false
  if (typeof v === 'string') return v.trim() !== ''
  if (typeof v === 'object') return Boolean(v.url || v.email)
  return false
}

function listOf(items) {
  if (items.length <= 1) return items.join('')
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`
}

function capitalize(s) {
  return s ? s[0].toUpperCase() + s.slice(1) : s
}
