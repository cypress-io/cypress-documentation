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
import { CRITERIA } from './claude-review.mjs'
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
 * Check the entry itself: the schema, the badge, and that it doesn't duplicate
 * an entry already on the list.
 * @param {Record<string, any>} plugin
 * @param {Array<Record<string, any>>} existing entries already in the base file
 */
export function checkEntry(plugin, existing) {
  const problems = pluginEntryErrors(plugin)
  const rows = [
    problems.length
      ? row('Entry fields', STATUS.notMet, problems.join('; '))
      : row('Entry fields', STATUS.met, 'Matches the plugins.json schema'),
  ]

  if (plugin.badge === 'official') {
    rows.push(
      isCypressOwned(plugin.link)
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
  const dupe = existing.find((other) => {
    if (link && normalizeLink(other.link) === link) return true
    if (name && (other.name || '').toLowerCase() === name) return true
    return Boolean(npm && (other.npm || other.name || '').toLowerCase() === npm)
  })
  rows.push(
    dupe
      ? row(
          'Not already listed',
          STATUS.notMet,
          `Matches the existing entry ${code(dupe.name)}`
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
 * @param {{ pkg: string | null, manifest: any, notFound: boolean }} npm result of `resolveNpm`
 * @param {number | null} cypressMajor latest major version of Cypress, or null if unknown
 */
export function checkNpm(npm, cypressMajor) {
  const compat = cypressMajor
    ? `Supports Cypress ${cypressMajor}`
    : 'Supports the latest Cypress'
  if (!npm.manifest) {
    return [
      npm.pkg && npm.notFound
        ? row(
            'Published to npm',
            STATUS.notMet,
            `${code(npm.pkg)} isn’t on the npm registry`
          )
        : row(
            'Published to npm',
            STATUS.unclear,
            `No npm package found. If it’s published, add an ${code('npm')} field`
          ),
      row('package.json metadata', STATUS.notChecked, 'Needs an npm package'),
      row(compat, STATUS.notChecked, 'Needs an npm package'),
    ]
  }

  const { name } = npm.manifest
  const latest = npm.manifest['dist-tags']?.latest
  const vm = npm.manifest.versions?.[latest]
  const missing = ['homepage', 'repository', 'bugs'].filter((f) => {
    const v = vm?.[f]
    return !(typeof v === 'string' ? v.trim() : v?.url || v?.email)
  })

  return [
    !vm || /-security$/.test(latest)
      ? row(
          'Published to npm',
          STATUS.notMet,
          `${code(name)} has no installable release`
        )
      : typeof vm.deprecated === 'string'
        ? row(
            'Published to npm',
            STATUS.notMet,
            `${code(`${name}@${latest}`)} is deprecated on npm`
          )
        : row('Published to npm', STATUS.met, code(`${name}@${latest}`)),
    missing.length
      ? row(
          'package.json metadata',
          STATUS.notMet,
          `Missing ${missing.map(code).join(', ')}`
        )
      : row(
          'package.json metadata',
          STATUS.met,
          '`homepage`, `repository`, and `bugs` are set'
        ),
    checkCompat(vm, cypressMajor, compat),
  ]
}

function checkCompat(vm, cypressMajor, label) {
  // Only a peer range is a compatibility claim. A dev or runtime dependency is
  // the version the plugin is built against, which is weaker evidence, so it
  // can raise a flag for a maintainer but never fail the check on its own.
  if (vm?.peerDependencies?.cypress?.trim?.() === '*') {
    return row(label, STATUS.met, `Peer range ${code('*')} accepts any version`)
  }
  // cypressCompat skips monorepo placeholders such as `0.0.0-development`.
  const peer = cypressCompat({ peerDependencies: vm?.peerDependencies })
  const range = peer || cypressCompat(vm)
  if (!range)
    return row(
      label,
      STATUS.unclear,
      `No ${code('cypress')} peer dependency declared`
    )
  if (!cypressMajor)
    return row(
      label,
      STATUS.notChecked,
      'Couldn’t look up the latest Cypress version'
    )
  if (!semver.validRange(range))
    return row(label, STATUS.unclear, `Can’t read the range ${code(range)}`)

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
  return row(
    label,
    supports ? STATUS.met : STATUS.unclear,
    `No peer dependency; built against ${code(range)}`
  )
}

/**
 * Check that the source repository exists and isn't archived.
 * @param {Record<string, any>} repo what `loadRepo` returns
 */
export function checkSource(repo) {
  const label = 'Source repository'
  if (repo.host !== 'github') {
    return row(
      label,
      STATUS.notChecked,
      'Only GitHub repositories are inspected automatically'
    )
  }
  if (!repo.info) {
    return repo.infoStatus === 404
      ? row(label, STATUS.notMet, 'Repository not found, or it’s private')
      : row(label, STATUS.notChecked, 'GitHub couldn’t be reached')
  }
  return repo.info.archived
    ? row(label, STATUS.notMet, 'Repository is archived')
    : row(label, STATUS.met, 'Public and not archived')
}

/**
 * Turn Claude's review into rows. `review` is the parsed model output, or an
 * object with `skipped` set to the reason it didn't run.
 * @param {{ skipped?: string, criteria?: Record<string, { status: string, detail: string }> }} review
 */
export function checkClaude(review) {
  return CRITERIA.map(([key, label]) => {
    const result = review.criteria?.[key]
    if (!result)
      return row(
        label,
        STATUS.notChecked,
        review.skipped || 'No assessment returned'
      )
    const known = Object.values(STATUS).includes(
      /** @type {any} */ (result.status)
    )
    return row(label, known ? result.status : STATUS.unclear, result.detail)
  })
}
