/* eslint-disable no-console */
const { SiteChecker } = require('broken-link-checker')
const chalk = require('chalk')
const { logger } = require('./utils/logger')
const { prettyPrintStatusCode } = require('./utils/prettyPrintStatusCode')

const docsSiteUrl = process.env.DOCS_SITE_URL || 'https://docs.cypress.io/'

const makeSiteChecker = () => {
  return new Promise((resolve, reject) => {
    /**
     * The promise resolves the following:
     * @type Array<{ originUrl: string, brokenUrl: string }>
     */
    let brokenLinkRecords = []
    let numLinksChecked = 0
    const siteChecker = new SiteChecker(
      {
        excludeExternalLinks: true,
        honorRobotExclusions: false,
      },
      {
        error: (error) => {
          logger.error('An error occurred', error)
        },
        html: (tree, robots, response, pageUrl) => {
          const currentUrl = response.url

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
              `Broken link found on page ${currentUrl}: ${chalk.bgRed(pageUrl)}`
            )

            brokenLinkRecords.push({
              originUrl: currentUrl,
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

          numLinksChecked++
        },
        end: () => {
          logger.log(`Finished scanning url ${docsSiteUrl}`)
          logger.log(`Number of links checked: ${numLinksChecked}`)
          resolve(brokenLinkRecords)
        },
      }
    )

    logger.log(`🔗 Starting link checker for url: ${docsSiteUrl}`)
    siteChecker.enqueue(docsSiteUrl)
  })
}

const main = async () => {
  console.time('recursiveBrokenLinkChecker')

  const brokenLinkRecords = await makeSiteChecker()

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

  console.timeEnd('recursiveBrokenLinkChecker')
  if (brokenLinkRecords.length) {
    process.exit(1)
  }
}

main()
