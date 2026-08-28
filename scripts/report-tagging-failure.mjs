#!/usr/bin/env node
//
// Surface a failed release-tagging run as a GitHub issue.
//
// The tagging workflow cannot block anything — it runs after the merge, docs
// deploy via Netlify/Vercel and CI runs on CircleCI — so a red run on its own
// is easy to miss. This turns it into something assigned to a person.
//
// Reuses an existing open issue rather than filing a new one per failure, so a
// persistent problem (an expired token, say) does not produce an issue per
// release.
//
// Environment: GH_TOKEN, REPO, RUN_URL, SHA

const API = process.env.GITHUB_API_URL || 'https://api.github.com'
const LABEL = 'release-tagging'
const ASSIGNEE = 'jennifer-shehane'

const token = process.env.GH_TOKEN
const repo = process.env.REPO
const runUrl = process.env.RUN_URL
const sha = (process.env.SHA || '').slice(0, 9)

async function api(path, { method = 'GET', body } = {}) {
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
    throw new Error(`${method} ${path} -> ${response.status}: ${text}`)
  }
  return text ? JSON.parse(text) : null
}

// Returns whether LABEL can be used, creating it if the repository does not
// have it yet. Label writes fall under the issues: write permission the job
// already holds.
async function ensureLabel() {
  try {
    await api(`/repos/${repo}/labels/${encodeURIComponent(LABEL)}`)
    return true
  } catch (error) {
    if (!/-> 404:/.test(error.message)) {
      console.log(`could not read the ${LABEL} label: ${error.message}`)
      return false
    }
  }

  try {
    await api(`/repos/${repo}/labels`, {
      method: 'POST',
      body: {
        name: LABEL,
        color: 'B60205',
        description: 'A Cypress release may be missing its documentation tag',
      },
    })
    console.log(`created the ${LABEL} label`)
    return true
  } catch (error) {
    // A concurrent run may have created it in between; that is a success.
    if (/-> 422:/.test(error.message)) return true
    console.log(`could not create the ${LABEL} label: ${error.message}`)
    return false
  }
}

async function main() {
  if (!token || !repo) {
    throw new Error('GH_TOKEN and REPO are required')
  }

  const body = [
    `The [\`Tag docs release\`](${runUrl}) workflow failed for commit \`${sha}\`.`,
    '',
    'A Cypress release may now be missing its `vX.Y.Z` tag. Nothing else is',
    'affected — this workflow runs after the merge and does not gate the docs',
    'deploy or CI.',
    '',
    '**To recover**, once the cause is fixed, re-run the workflow from the',
    'Actions tab with `dry-run` unchecked, setting `after` to the commit that',
    'introduced the changelog entry. It only tags versions that have no tag yet,',
    'so re-running is safe.',
    '',
    `[Failed run](${runUrl})`,
  ].join('\n')

  // The label has to exist before it can be filtered on or attached. Whether
  // POST /issues would create it implicitly is not worth depending on, so
  // create it explicitly and carry on unlabelled if that fails — an issue
  // nobody labelled still beats no issue at all.
  const labelled = await ensureLabel()

  // List by label rather than the search API, which lags behind by design.
  const open = labelled
    ? await api(
        `/repos/${repo}/issues?state=open&labels=${encodeURIComponent(LABEL)}&per_page=1`
      )
    : []

  if (Array.isArray(open) && open.length > 0) {
    const number = open[0].number
    await api(`/repos/${repo}/issues/${number}/comments`, {
      method: 'POST',
      body: { body },
    })
    console.log(`commented on existing issue #${number}`)
    return
  }

  const issue = await api(`/repos/${repo}/issues`, {
    method: 'POST',
    body: {
      title: 'Release tagging failed',
      body,
      ...(labelled ? { labels: [LABEL] } : {}),
    },
  })
  console.log(`opened issue #${issue.number}`)

  // Assignment is a courtesy; a non-assignable user should not lose the issue.
  try {
    await api(`/repos/${repo}/issues/${issue.number}/assignees`, {
      method: 'POST',
      body: { assignees: [ASSIGNEE] },
    })
  } catch (error) {
    console.log(`could not assign ${ASSIGNEE}: ${error.message}`)
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
