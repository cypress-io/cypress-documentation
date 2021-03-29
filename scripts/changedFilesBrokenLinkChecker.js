const execSync = require('child_process').execSync
const { SiteChecker } = require('broken-link-checker')

const GIT_DIFF_NAME_STATUS_LAST_COMMIT = 'git diff --name-status HEAD~1'
const MARKDOWN_EXTENSION = '.md'
const ORIGIN_URL = 'http://localhost:3000/'

const isMarkdownFile = (line) => line.endsWith(MARKDOWN_EXTENSION)

const GIT_STATUSES = {
  ADDED: 'A',
  COPY_EDIT: 'C',
  MODIFIED: 'M',
  RENAME_EDIT: 'R',
  DELETED: 'D',
  UNMERGED: 'U',
}
const isCopiedFile = (line) => line.startsWith(GIT_STATUSES.COPY_EDIT)
const isModifiedFile = (line) => line.startsWith(GIT_STATUSES.MODIFIED)
const isAddedFile = (line) => line.startsWith(GIT_STATUSES.ADDED)
const GIT_STATUS_PREDICATES = [isCopiedFile, isModifiedFile, isAddedFile]

const isCheckableGitStatus = (line) => {
  return GIT_STATUS_PREDICATES.some((fn) => fn(line))
}

const removeGitStatusFromLine = (line) => {
  // Each line will have a prefix of one of the following letters:
  // M (modified),
  // C (changed),
  // R (removed),
  // A (added),
  // D (deleted),
  // U (unmerged; file has conflicts after merge)
  // The letter will be followed by a tab: '\t'
  const STATUS_LENGTH = 2
  return line.slice(STATUS_LENGTH)
}

const removeMarkdownExtension = (line) => {
  const LENGTH_TO_TRIM = MARKDOWN_EXTENSION.length
  return line.slice(0, line.length - LENGTH_TO_TRIM)
}

const removeContentDirectoryPrefix = (line) => {
  const LENGTH_TO_TRIM_FROM_START = 'content/'.length
  return line.slice(LENGTH_TO_TRIM_FROM_START)
}

const reduceChangelogChangesToOne = (
  all = { hasChangelogEdits: false, paths: [] },
  file,
  index,
  arr
) => {
  const CHANGELOG_DIRECTORY = '_changelogs/'
  if (file.startsWith(CHANGELOG_DIRECTORY)) {
    if (!all.hasChangelogEdits) {
      const CHANGELOG_ROUTE = 'guides/references/changelog'
      return {
        hasChangelogEdits: true,
        paths: all.paths.concat(CHANGELOG_ROUTE),
      }
    }
    return all
  }
  if (index < arr.length - 1) {
    return {
      ...all,
      paths: all.paths.concat(file),
    }
  }
  return all.paths
}

const convertRelativeUrlToAbsolute = (path) => `${ORIGIN_URL}${path}`

const getGitDiffList = () => {
  return `M\tcontent/_changelogs/6.6.0.md
M\tcontent/_changelogs/6.7.0.md
M\tcontent/_changelogs/6.7.1.md
M\tcontent/_changelogs/6.8.0.md
D\tcontent/_partial/allowed_test_config.md
D\tcontent/_partial/chromium_download.md
D\tcontent/_partial/code_runs_in_node.md
D\tcontent/_partial/cypress_env_var_warning.md
D\tcontent/_partial/errors_anatomy.md
D\tcontent/_partial/linux_dependencies.md
D\tcontent/_partial/network_stubbing_warning.md
D\tcontent/_partial/then_should_difference.md
D\tcontent/_partial/vpn_allowed_list.md
D\tcontent/_partial/xhr_stubbing_deprecated.md
M\tcontent/api/plugins/browser-launch-api.md
M\tcontent/api/plugins/configuration-api.md
M\tcontent/guides/continuous-integration/aws-codebuild.md
M\tcontent/guides/continuous-integration/bitbucket-pipelines.md
M\tcontent/guides/dashboard/jira-integration.md
M\tcontent/guides/dashboard/smart-orchestration.md
M\tcontent/guides/testing-strategies/google-authentication.md
M\tcontent/guides/tooling/plugins-guide.md`.split('\n')

  // return execSync(GIT_DIFF_NAME_STATUS_LAST_COMMIT)
  // .toString()
  // .split('\n')
}

const makeTestUrl = (url) => async () => {
  return new Promise((resolve, reject) => {
    const siteChecker = new SiteChecker({
      excludeExternalLinks: true,
      honorRobotExclusions: false,
    })
      .on('error', (error) => reject(error))
      .on('end', () => {
        resolve()
      })

    siteChecker.enqueue(url)
  })
}

const main = () => {
  const urls = getGitDiffList()
    .filter(isMarkdownFile)
    .filter(isCheckableGitStatus)
    .map(removeGitStatusFromLine)
    .map(removeMarkdownExtension)
    .map(removeContentDirectoryPrefix)
    .reduce(reduceChangelogChangesToOne, {
      hasChangelogEdits: undefined,
      paths: [],
    })
    .map(convertRelativeUrlToAbsolute)

  console.log(urls)
}

main()
