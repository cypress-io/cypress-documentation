/**
 * There is a chance that the scraper, for whatever reason, could
 * either over-index or under-index our documentation site. This has
 * happened before, so we want to know when it does happen. Algolia's
 * hosted scraper service has a built-in protection of some sort to detect
 * sudden dips or spikes in entries submitted to a specific index.
 * Since we are using our own scraper, we do not have that luxury.
 *
 * This script validates two things after a scrape:
 * 1. The Algolia index entry count matches the scraper's reported "Nb hits"
 *    (confirms the upload completed).
 * 2. The index did not change unexpectedly compared to the pre-scrape count.
 *    Large doc additions or recovery from a previously under-indexed state
 *    are allowed when the upload itself looks healthy.
 *
 * This script will *NOT* prevent a corrupted index from being uploaded
 * and/or prevent the scraper from over/under indexing the documentation site.
 * This script's purpose is to ALERT us when this does happen.
 */
import util from 'util'
import { exec as execOriginal } from 'child_process'
const exec = util.promisify(execOriginal)
import { AlgoliaClient } from './algolia-client.mjs'
import config from './config.json' with { type: 'json' }

// Required environment variables
const API_KEY = process.env.ALGOLIA_API_KEY
const APPLICATION_ID = process.env.ALGOLIA_APPLICATION_ID
const ACCEPTABLE_DELTA = parseInt(process.env.ALGOLIA_ACCEPTABLE_DELTA) || 1000
const ACCEPTABLE_DELTA_RATIO =
  parseFloat(process.env.ALGOLIA_ACCEPTABLE_DELTA_RATIO) || 0.05
const ALGOLIA_INDEX = config.index_name

const algoliaClient = new AlgoliaClient(ALGOLIA_INDEX, API_KEY, APPLICATION_ID)

/**
 * @param {string} stdout
 * @returns {number | null}
 */
const parseScraperHits = (stdout) => {
  const match = stdout.match(/Nb hits:\s*(\d+)/i)
  return match ? parseInt(match[1], 10) : null
}

/**
 * Executes the run-scraper.sh script and waits for it to finish
 * @returns {Promise<string>} scraper stdout
 */
const scrape = async () => {
  let stdout = ''
  try {
    console.log('About to start scraping...')
    console.log(
      'Scraper will not log any output until it completes. Please wait...'
    )
    console.time('scraper')
    const result = await exec(
      `API_KEY=${API_KEY} APPLICATION_ID=${APPLICATION_ID} sh ./scripts/search/run-scraper.sh`
    )
    stdout = result.stdout ?? ''
    if (stdout) {
      console.log(stdout)
    }
    if (result.stderr) {
      console.log(
        'Output from stderr (this may or may not contain actual errors): '
      )
      console.log(result.stderr)
    }
    return stdout
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
  const scraperStdout = await scrape()
  const countAfterScraper = await algoliaClient.getEntriesForIndex(
    ALGOLIA_INDEX
  )
  console.log(`Entries count after scraper: ${countAfterScraper}`)

  const scraperHits = parseScraperHits(scraperStdout)
  if (scraperHits !== null) {
    console.log(`Scraper reported hits: ${scraperHits}`)
  } else {
    console.warn(
      'Could not parse "Nb hits" from scraper output. Upload validation will be skipped.'
    )
  }

  const uploadDelta =
    scraperHits === null
      ? null
      : Math.abs(countAfterScraper - scraperHits)
  const indexDelta = countAfterScraper - countBeforeScraper
  const acceptableIndexDelta = Math.max(
    ACCEPTABLE_DELTA,
    Math.floor(countAfterScraper * ACCEPTABLE_DELTA_RATIO)
  )

  console.log(`Index delta after scrape: ${indexDelta}`)
  console.log(`Acceptable index delta: ${acceptableIndexDelta}`)
  if (uploadDelta !== null) {
    console.log(`Upload delta (index vs scraper hits): ${uploadDelta}`)
  }

  if (uploadDelta !== null && uploadDelta > ACCEPTABLE_DELTA) {
    console.error(
      `Algolia index count (${countAfterScraper}) does not match scraper hits (${scraperHits}). Upload delta: ${uploadDelta}`
    )
    console.error(
      'Check the config.json file for any changes and check the scraper logs for any errors.'
    )
    process.exit(1)
  }

  if (indexDelta < -acceptableIndexDelta) {
    console.error(
      `Index entry count dropped by ${Math.abs(indexDelta)}, which exceeds the acceptable delta of ${acceptableIndexDelta}.`
    )
    console.error(
      'Check the config.json file for any changes and check the scraper logs for any errors.'
    )
    process.exit(1)
  }

  if (indexDelta > acceptableIndexDelta) {
    console.warn(
      `Large index increase detected (${countBeforeScraper} -> ${countAfterScraper}). This may be expected after significant doc additions or recovering from a previously under-indexed state.`
    )
  }

  console.log(
    `Scrape validation passed. Index entries: ${countAfterScraper}${scraperHits !== null ? ` (scraper hits: ${scraperHits})` : ''}.`
  )
  process.exit(0)
}

main()
