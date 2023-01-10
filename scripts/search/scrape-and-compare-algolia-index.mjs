/**
 * There is a chance that the scraper, for whatever reason, could
 * either over-index or under-index our documentation site. This has
 * happened before, so we want to know when it does happen. Algolia's
 * hosted scraper service has a built-in protection of some sort to detect
 * sudden dips or spikes in entries submitted to a specific index.
 * Since we are using our own scraper, we do not have that luxury.
 * This script will count the entries for the given index, execute the
 * scraper, then count the entries for the same index. The number of entries
 * should not change much after the scraper has completed. The acceptable
 * delta between the two numbers is purely arbitrary and may require fine tuning.
 * If the delta ever exceeds the acceptable delta, this script will exit with an
 * error code, causing CircleCI to fail the workflow and send a notification
 * to us. If significant changes were to occur to the documentation site
 * (large additions/removals of pages), it is possible that this script
 * will alert with a false negative.
 *
 * This script will *NOT* prevent a corrupted index from being uploaded
 * and/or prevent the scraper from over/under indexing the documentation site.
 * This script's purpose is to ALERT us when this does happen.
 */
import util from 'util'
import { exec as execOriginal } from 'child_process'
const exec = util.promisify(execOriginal)
import { AlgoliaClient } from './algolia-client.mjs'
import config from './config.json' assert { type: 'json' }

// Required environment variables
const API_KEY = process.env.ALGOLIA_API_KEY
const APPLICATION_ID = process.env.ALGOLIA_APPLICATION_ID
const ACCEPTABLE_DELTA = parseInt(process.env.ALGOLIA_ACCEPTABLE_DELTA) || 1000
const ALGOLIA_INDEX = config.index_name

const algoliaClient = new AlgoliaClient(ALGOLIA_INDEX, API_KEY, APPLICATION_ID)

/**
 * Executes the run-scraper.sh script and waits for it to finish
 */
const scrape = async () => {
  try {
    console.log('About to start scraping...')
    console.log(
      'Scraper will not log any output until it completes. Please wait...'
    )
    console.time('scraper')
    const { stdout, stderr } = await exec(
      `API_KEY=${API_KEY} APPLICATION_ID=${APPLICATION_ID} sh run-scraper.sh`
    )
    if (stdout) {
      console.log(stdout)
    }
    if (stderr) {
      console.log(
        'Output from stderr (this may or may not contain actual errors): '
      )
      console.log(stderr)
    }
  } finally {
    console.log('Scraper has completed.')
    console.timeEnd('scraper')
  }
}

const main = async () => {
  console.log(`Comparing entries for index: ${ALGOLIA_INDEX}`)
  const countBeforeScraper = await algoliaClient.getEntriesForIndex(
    ALGOLIA_INDEX
  )
  console.log(`Entries count before scraper: ${countBeforeScraper}`)
  await scrape()
  const countAfterScraper = await algoliaClient.getEntriesForIndex(
    ALGOLIA_INDEX
  )
  console.log(`Entries count after scraper: ${countAfterScraper}`)

  const delta = Math.abs(countAfterScraper - countBeforeScraper)
  console.log(`Delta after scrape: ${delta}`)

  if (delta > ACCEPTABLE_DELTA) {
    console.error(
      `Delta after scrape is higher than the acceptable delta of ${ACCEPTABLE_DELTA}. Delta: ${delta}`
    )
    console.error(
      'Check the config.json file for any changes and check the scraper logs for any errors.'
    )
    process.exit(1)
  }

  console.log(
    `Delta after scrape was found to be within the acceptable delta of ${ACCEPTABLE_DELTA}. Delta: ${delta}`
  )
  process.exit(0)
}

main()
