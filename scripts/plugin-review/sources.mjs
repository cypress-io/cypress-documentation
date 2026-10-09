// @ts-check
/**
 * Network lookups for the plugin review: the npm registry and the GitHub API.
 * Every function is best-effort and never throws. A failed lookup comes back
 * as null, so the matching check reports "not checked" instead of failing.
 */

import {
  GITHUB_API,
  fetchJson,
  fetchText,
  githubHeaders,
  npmManifest,
  parseGitHubLocation,
} from '../plugin-signals.mjs'

/** Latest major version of Cypress on npm, or null. */
export async function latestCypressMajor() {
  const { data } = await npmManifest('cypress')
  const major = Number(String(data?.['dist-tags']?.latest).split('.')[0])
  return Number.isFinite(major) ? major : null
}

/**
 * The repository's metadata and file list from GitHub. `info` is null (with
 * `infoStatus` set on an HTTP error) when the repo can't be read, and `paths`
 * is null when the file list can't. For a monorepo link, `paths` covers the
 * linked directory plus the repo's CI config, which lives at the root.
 */
export async function loadRepo(link) {
  const loc = parseGitHubLocation(link)
  if (!loc) return { host: 'other' }

  const base = `${GITHUB_API}/repos/${loc.owner}/${loc.repo}`
  const info = await fetchJson(base, githubHeaders())
  if (!info || info.__status) {
    return { host: 'github', loc, info: null, infoStatus: info?.__status }
  }

  const ref = loc.ref || info.default_branch
  const tree = await fetchJson(
    `${base}/git/trees/${encodeURIComponent(ref)}?recursive=1`,
    githubHeaders()
  )
  const prefix = loc.path ? `${loc.path}/` : ''
  const paths = Array.isArray(tree?.tree)
    ? tree.tree
        .filter(
          (t) =>
            t.type === 'blob' &&
            (t.path.startsWith(prefix) ||
              /^\.(github\/workflows|circleci)\//.test(t.path))
        )
        .map((t) => t.path)
    : null
  return {
    host: 'github',
    loc,
    info,
    ref,
    paths,
    truncated: tree?.truncated === true,
  }
}

/**
 * The README a user would read first: the one in the linked directory, then
 * the repository root, then the one published to npm. Returns
 * `{ text, source }` or null.
 */
export async function loadReadme(repo, manifest) {
  if (repo.info) {
    const base = `${GITHUB_API}/repos/${repo.loc.owner}/${repo.loc.repo}/readme`
    for (const dir of repo.loc.path ? [`/${repo.loc.path}`, ''] : ['']) {
      const body = await fetchText(
        `${base}${dir}?ref=${encodeURIComponent(repo.ref)}`,
        githubHeaders({ accept: 'application/vnd.github.raw' })
      )
      if (typeof body === 'string' && body.trim()) {
        return {
          text: body,
          source: dir ? `${repo.loc.path}/README` : 'README',
        }
      }
    }
  }
  const readme = manifest?.readme
  return typeof readme === 'string' && readme.trim()
    ? { text: readme, source: 'npm README' }
    : null
}
