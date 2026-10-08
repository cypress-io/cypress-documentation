// @ts-check
/**
 * Network lookups for the plugin review: the npm registry and the GitHub API.
 * Every function is best-effort and never throws; a failed lookup comes back
 * as null so the matching check reports "not checked" instead of failing.
 */

import {
  GITHUB_API,
  fetchJson,
  fetchText,
  githubHeaders,
  npmManifest,
  parseGitHubLocation,
  resolveNpm,
} from '../plugin-signals.mjs'

// Enough workflow files to cover any real repo without a runaway fan-out.
const MAX_WORKFLOWS = 10

/** Latest major version of Cypress on npm, or null. */
export async function latestCypressMajor() {
  const { data } = await npmManifest('cypress')
  const latest = data && data['dist-tags'] && data['dist-tags'].latest
  const major = latest ? Number(String(latest).split('.')[0]) : NaN
  return Number.isFinite(major) ? major : null
}

/** Resolve the plugin's npm package, flagging a transient registry failure. */
export async function loadNpm(plugin) {
  const result = await resolveNpm(plugin)
  // resolveNpm can't tell "no candidate name" from "registry unreachable", so
  // probe the registry once when nothing resolved and nothing 404'd.
  let failed = false
  if (!result.manifest && !result.notFound) {
    const probe = await fetchJson('https://registry.npmjs.org/cypress')
    failed = !probe || Boolean(probe.__status)
  }
  return { ...result, failed }
}

/** Gather what the repository checks need from GitHub. */
export async function loadRepo(link) {
  const loc = parseGitHubLocation(link)
  if (!loc) return { host: /** @type {const} */ ('other'), link }

  const base = `${GITHUB_API}/repos/${loc.owner}/${loc.repo}`
  const info = await fetchJson(base, githubHeaders())
  if (!info || info.__status) {
    return {
      host: /** @type {const} */ ('github'),
      link,
      loc,
      info: null,
      infoStatus: info ? info.__status : undefined,
    }
  }

  const ref = loc.ref || info.default_branch
  const treeData = await fetchJson(
    `${base}/git/trees/${encodeURIComponent(ref)}?recursive=1`,
    githubHeaders()
  )
  const tree =
    treeData && !treeData.__status && Array.isArray(treeData.tree)
      ? {
          paths: treeData.tree
            .filter((t) => t.type === 'blob')
            .map((t) => t.path),
          truncated: treeData.truncated === true,
        }
      : null

  const workflows = {}
  if (tree) {
    const files = tree.paths
      .filter((p) => /^\.github\/workflows\/[^/]+\.ya?ml$/.test(p))
      .slice(0, MAX_WORKFLOWS)
    for (const p of files) {
      const body = await fetchText(
        `${base}/contents/${p}?ref=${encodeURIComponent(ref)}`,
        githubHeaders({ accept: 'application/vnd.github.raw' })
      )
      if (typeof body === 'string') workflows[p] = body
    }
  }

  // Recent completed runs on the default branch, newest first. The check
  // picks the latest run of a workflow that runs Cypress from these.
  let runs = []
  if (Object.keys(workflows).length) {
    const data = await fetchJson(
      `${base}/actions/runs?branch=${encodeURIComponent(info.default_branch)}&status=completed&per_page=30`,
      githubHeaders()
    )
    runs = ((data && data.workflow_runs) || []).map((run) => ({
      path: run.path,
      conclusion: run.conclusion,
    }))
  }

  return {
    host: /** @type {const} */ ('github'),
    link,
    loc,
    info,
    path: loc.path,
    tree,
    workflows,
    runs,
    branch: info.default_branch,
  }
}

/**
 * Fetch the README a user would read first: the one in the linked directory,
 * then the repository root, then the one published to npm.
 * Returns `{ text, source }` or null.
 */
export async function loadReadme(repo, npm) {
  if (repo.host === 'github' && repo.info) {
    const base = `${GITHUB_API}/repos/${repo.loc.owner}/${repo.loc.repo}/readme`
    const ref = repo.loc.ref || repo.info.default_branch
    const dirs = repo.loc.path ? [`/${repo.loc.path}`, ''] : ['']
    for (const dir of dirs) {
      const body = await fetchText(
        `${base}${dir}?ref=${encodeURIComponent(ref)}`,
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
  const readme = npm && npm.manifest && npm.manifest.readme
  if (typeof readme === 'string' && readme.trim()) {
    return { text: readme, source: 'npm README' }
  }
  return null
}
