// @ts-check
/**
 * npm registry and GitHub lookups shared by the scripts that read the plugin
 * list: `enrich-plugins.mjs` (the nightly refresh of plugins-generated.json)
 * and `plugin-review/` (the evaluation posted on plugin pull requests).
 *
 * Every lookup is best-effort and never throws. Each one's return value tells
 * a definitive answer ("not found") apart from a transient failure, so a
 * caller can keep its last good data when a request fails.
 */

import got from 'got'

export const REGISTRY = 'https://registry.npmjs.org'
export const GITHUB_API = 'https://api.github.com'

// A pre-configured got instance handles the timeout, automatic retries, and
// JSON parsing for every request.
const http = got.extend({
  timeout: { request: 15000 },
  retry: { limit: 2 },
  responseType: 'json',
  throwHttpErrors: false,
  headers: { accept: 'application/json' },
})

/** Fetch JSON. Returns the body on 2xx, `{ __status }` on an HTTP error, or
 *  null on a network/timeout failure (after retries). Never throws.
 *  @returns {Promise<any>} */
export async function fetchJson(url, headers = {}) {
  try {
    const res = await http(url, { headers })
    if (res.statusCode >= 200 && res.statusCode < 300) return res.body
    return { __status: res.statusCode }
  } catch {
    return null
  }
}

/** Fetch a response body as text, with the same contract as `fetchJson`.
 *  @returns {Promise<any>} */
export async function fetchText(url, headers = {}) {
  try {
    const res = await http(url, { headers, responseType: 'text' })
    if (res.statusCode >= 200 && res.statusCode < 300) return res.body
    return { __status: res.statusCode }
  } catch {
    return null
  }
}

/** Headers for GitHub API calls. Authenticated requests get a higher rate
 *  limit, so pass GITHUB_TOKEN through when the environment has one. */
export function githubHeaders(extra = {}) {
  return process.env.GITHUB_TOKEN
    ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}`, ...extra }
    : { ...extra }
}

/** Look up a package's packument. The registry accepts scoped names
 *  (`@scope/name`) unencoded in the path. Returns:
 *   - { data }      on success,
 *   - { notFound }  on a definitive 404 (package does not exist), or
 *   - {}            on any transient failure (network error, timeout, 5xx),
 *  so callers can tell "genuinely gone" apart from "couldn't reach the registry". */
export async function npmManifest(pkg) {
  const data = await fetchJson(`${REGISTRY}/${pkg}`)
  if (data && !data.__status && data.name) return { data }
  if (data && data.__status === 404) return { notFound: true }
  return {}
}

/** Extract a supported Cypress version range from a package manifest, if any. */
export function cypressCompat(versionManifest) {
  if (!versionManifest) return undefined
  const buckets = [
    versionManifest.peerDependencies,
    versionManifest.devDependencies,
    versionManifest.dependencies,
  ]
  for (const bucket of buckets) {
    const range = bucket && bucket.cypress
    if (typeof range !== 'string') continue
    const trimmed = range.trim()
    // Skip meaningless placeholders (monorepo dev versions, wildcards, etc.).
    if (!trimmed || trimmed === '*' || trimmed === 'latest') continue
    if (/^workspace:/.test(trimmed) || /^0\.0\.0/.test(trimmed)) continue
    return trimmed
  }
  return undefined
}

/** Parse a GitHub URL into its owner, repo, and, for `…/tree/<ref>/<path>` or
 *  `…/blob/<ref>/<path>` links, the ref and path inside the repo. Returns null
 *  for anything that isn't a repository link. */
export function parseGitHubLocation(link) {
  if (!link) return null
  const m = /github\.com\/([^/]+)\/([^/#?]+)(\/[^#?]*)?/i.exec(link)
  if (!m) return null
  const owner = m[1]
  const repo = m[2].replace(/\.git$/, '')
  const rest = (m[3] || '').replace(/\/+$/, '')
  if (owner === 'sponsors' || owner === 'marketplace') return null
  const sub = /^\/(tree|blob)\/([^/]+)(?:\/(.*))?$/.exec(rest)
  return {
    owner,
    repo,
    subpath: Boolean(sub),
    ref: sub ? sub[2] : null,
    path: sub && sub[3] ? sub[3] : '',
  }
}

/** Parse "owner/repo" out of a GitHub URL, or null. This skips subpath links
 *  (`…/tree/…`, `…/blob/…`): they point into a repo (often a monorepo like
 *  cypress-io/cypress) whose archived status wouldn't reflect the individual
 *  package. */
export function parseGitHub(link) {
  const loc = parseGitHubLocation(link)
  if (!loc || loc.subpath) return null
  return { owner: loc.owner, repo: loc.repo }
}

/** npm reserves removed package names under a `0.0.x-security` placeholder
 *  described as "security holding package". Treat those as not published. */
export function isSecurityPlaceholder(latest, versionManifest) {
  if (/-security$/.test(latest || '')) return true
  const desc = versionManifest && versionManifest.description
  return (
    typeof desc === 'string' &&
    desc.toLowerCase() === 'security holding package'
  )
}

/**
 * Resolve the canonical npm package name for a plugin entry.
 * Preference: explicit `npm` field -> the plugin `name` if it's itself a real
 * package. It doesn't guess from the GitHub repo basename, since monorepo
 * subpaths (e.g. cypress-io/cypress/tree/.../npm/webpack-preprocessor) and
 * generic repo names would resolve to the wrong package. Entries whose
 * display name isn't the package should set an explicit `npm` field.
 * Returns the manifest too so callers don't re-fetch, plus `notFound` which is
 * true only when a candidate got a definitive 404 (not a transient failure).
 */
export async function resolveNpm(plugin) {
  const candidates = []
  if (plugin.npm) candidates.push(plugin.npm)
  // Also try the display name when it looks like a package specifier (lowercase,
  // no spaces). This is a fallback: if an explicit `npm` value is wrong or has
  // been removed, a valid display name can still resolve.
  if (
    plugin.name &&
    !/\s/.test(plugin.name) &&
    /^(@[\w.-]+\/)?[\w.-]+$/.test(plugin.name) &&
    plugin.name === plugin.name.toLowerCase()
  ) {
    candidates.push(plugin.name)
  }

  let notFound = false
  for (const candidate of [...new Set(candidates)]) {
    const result = await npmManifest(candidate)
    if (result.data)
      return { pkg: result.data.name, manifest: result.data, notFound: false }
    if (result.notFound) notFound = true
  }
  return { pkg: plugin.npm || null, manifest: null, notFound }
}

/** Check whether a plugin's GitHub repo is archived (used to flag deprecation).
 *  `applicable` is false when there's no usable repo to query (missing link, or
 *  a subpath/monorepo link); `ok` is false on a transient failure, so callers
 *  can preserve a prior archived flag instead of dropping it. */
export async function githubArchived(link) {
  const gh = parseGitHub(link)
  if (!gh) return { applicable: false, ok: false }
  const data = await fetchJson(
    `${GITHUB_API}/repos/${gh.owner}/${gh.repo}`,
    githubHeaders()
  )
  if (!data || data.__status) return { applicable: true, ok: false }
  return { applicable: true, ok: true, archived: data.archived === true }
}
