/* eslint-disable no-console */
const { execSync, fork } = require('child_process')
const { HtmlUrlChecker } = require('broken-link-checker')
const chalk = require('chalk')
const { logger } = require('./utils/logger')
const { prettyPrintStatusCode } = require('./utils/prettyPrintStatusCode')

const GIT_DIFF_NAME_STATUS_LAST_COMMIT = 'git diff --name-status HEAD~1'
const MARKDOWN_EXTENSION = '.md'
const ORIGIN_URL = 'http://localhost:3000/'
const CONTENT_DIRECTORY = 'content/'

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
  // Each line will have a prefix of one of the git status letters
  // followed by a tab character: '\t'
  const STATUS_LENGTH = 2

  return line.slice(STATUS_LENGTH)
}

const removeMarkdownExtension = (line) => {
  const LENGTH_TO_TRIM = MARKDOWN_EXTENSION.length

  return line.slice(0, line.length - LENGTH_TO_TRIM)
}

const isFileInContentDirectory = (line) => {
  return line.startsWith(CONTENT_DIRECTORY)
}

const removeContentDirectoryPrefix = (line) => {
  const LENGTH_TO_TRIM_FROM_START = CONTENT_DIRECTORY.length

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

  return all.paths.concat(file)
}

const convertRelativeUrlToAbsolute = (path) => `${ORIGIN_URL}${path}`

const getGitDiffList = () => {
  // If you need test data,
  // uncomment the following lines:
  //
  //   return `M\tcontent/_changelogs/6.6.0.md
  // M\tcontent/_changelogs/6.7.0.md
  // M\tcontent/_changelogs/6.7.1.md
  // M\tcontent/_changelogs/6.8.0.md
  // D\tcontent/_partial/allowed_test_config.md
  // D\tcontent/_partial/chromium_download.md
  // D\tcontent/_partial/code_runs_in_node.md
  // D\tcontent/_partial/cypress_env_var_warning.md
  // D\tcontent/_partial/errors_anatomy.md
  // D\tcontent/_partial/linux_dependencies.md
  // D\tcontent/_partial/network_stubbing_warning.md
  // D\tcontent/_partial/then_should_difference.md
  // D\tcontent/_partial/vpn_allowed_list.md
  // D\tcontent/_partial/xhr_stubbing_deprecated.md
  // M\tcontent/api/plugins/browser-launch-api.md
  // M\tcontent/api/plugins/configuration-api.md
  // M\tcontent/guides/continuous-integration/aws-codebuild.md
  // M\tcontent/guides/continuous-integration/bitbucket-pipelines.md
  // M\tcontent/guides/cloud/jira-integration.md
  // M\tcontent/guides/cloud/smart-orchestration.md
  // M\tcontent/guides/testing-strategies/google-authentication.md
  // M\tcontent/guides/tooling/plugins-guide.md`.split('\n')

  const diff = execSync(GIT_DIFF_NAME_STATUS_LAST_COMMIT).toString().split('\n')

  if (Array.isArray(diff)) {
    const nonEmptyDiffs = diff.filter(Boolean)

    return nonEmptyDiffs
  }

  if (diff) {
    return [diff]
  }

  return []
}

const makeSiteCheckerForUrl = (url) => {
  return async () => {
    return new Promise((resolve, reject) => {
      /**
       * The promise resolves the following:
       * @type Array<{ originUrl: string, brokenUrl: string }>
       */
      let brokenLinkRecords = []
      const siteChecker = new HtmlUrlChecker(
        {
          excludeExternalLinks: true,
          honorRobotExclusions: false,
        },
        {
          error: (error) => {
            logger.error('An error occurred', error)
          },
          html: (tree, robots, response, pageUrl) => {
            const htmlNode = tree.childNodes.find(
              (node) => node.tagName === 'html'
            )
            const headNode = htmlNode.childNodes.find(
              (node) => node.tagName === 'head'
            )
            const titleNode = headNode.childNodes.find(
              (node) => node.tagName === 'title'
            )
            const titleTextNode = titleNode.childNodes.find(
              (node) => node.nodeName === '#text'
            )
            const is404 = titleTextNode.value.includes(
              '404 | Cypress Documentation'
            )

            if (is404) {
              logger.error(
                `Broken link found on page ${url}: ${chalk.bgRed(pageUrl)}`
              )

              brokenLinkRecords.push({
                originUrl: url,
                brokenUrl: pageUrl,
              })
            }
          },
          link: (link) => {
            logger.log(
              `${prettyPrintStatusCode(link.http.statusCode)} ${
                link.url.resolved
              }`
            )
          },
          end: () => {
            logger.log(`Finished scanning url ${url}`)
            resolve(brokenLinkRecords)
          },
        }
      )

      logger.log(`🔗 Starting link checker for url: ${url}`)
      siteChecker.enqueue(url)
    })
  }
}

const main = async () => {
  console.time('changedFilesBrokenLinkChecker')

  const filePaths = getGitDiffList()
    .filter(isMarkdownFile)
    .filter(isCheckableGitStatus)
    .map(removeGitStatusFromLine)
    .map(removeMarkdownExtension)
    .filter(isFileInContentDirectory)
    .map(removeContentDirectoryPrefix)

  if (!filePaths.length) {
    logger.log(
      'No content files changed. Not checking any urls for broken links.'
    )

    return
  }

  const relativeUrls = filePaths.reduce(reduceChangelogChangesToOne, {
    hasChangelogEdits: undefined,
    paths: [],
  })

  const urls = relativeUrls.map(convertRelativeUrlToAbsolute)

  logger.log('URLs to check: ', urls)

  const siteCheckers = urls.map(makeSiteCheckerForUrl)

  // Spinning up server to serve files in `dist/`.
  const server = fork('scripts/server.js', {
    detached: false,
    stdio: 'ignore',
  })

  await new Promise((res) => {
    logger.log('Waiting for server to be ready...')
    server.on('message', (msg) => {
      logger.log('Server is ready!')
      if (msg === 'ready') {
        res()
      }
    })
  })

  let brokenLinkRecords = []

  for (const siteChecker of siteCheckers) {
    const records = await siteChecker()

    brokenLinkRecords = [...brokenLinkRecords, ...records]
  }

  // Terminate server hosting files in `dist/`
  server.kill('SIGHUP')

  logger.log(
    `Number of broken URLs found: ${
      brokenLinkRecords.length
        ? `${chalk.bgRed(brokenLinkRecords.length)}`
        : `${chalk.green(brokenLinkRecords.length)} ✅`
    }`
  )

  brokenLinkRecords.forEach(({ originUrl, brokenUrl }) => {
    logger.error(`************************`)
    logger.error(`Broken URL on page: ${originUrl}`)
    logger.error(`Broken URL: ${brokenUrl}`)
  })

  console.timeEnd('changedFilesBrokenLinkChecker')
  if (brokenLinkRecords.length) {
    process.exit(1)
  }
}

main()
