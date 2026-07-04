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
import { fileURLToPath } from 'url'
import { AlgoliaClient } from './algolia-client.mjs'
import config from './config.json' with { type: 'json' }

const exec = util.promisify(execOriginal)

const ALGOLIA_INDEX = config.index_name

/**
 * Parses the "Nb hits: N" line the docsearch scraper prints when it finishes.
 *
 * @param {string} stdout
 * @returns {number | null} the parsed hit count, or null when absent
 */
export const parseScraperHits = (stdout) => {
  const match = String(stdout ?? '').match(/Nb hits:\s*(\d+)/i)
  return match ? parseInt(match[1], 10) : null
}

/**
 * Pure validation of a scrape's outcome. Given the index counts before/after
 * the scrape and the scraper's own reported hit count, decides whether the run
 * is healthy, and if not, why. Contains no I/O so it can be unit tested.
 *
 * @param {object} params
 * @param {number} params.countBefore - index entry count before the scrape
 * @param {number} params.countAfter - index entry count after the scrape
 * @param {number | null} params.scraperHits - hits the scraper reported, or
 *   null when it could not be parsed (upload check is then skipped)
 * @param {number} params.acceptableDelta - absolute tolerance for the
 *   upload/index checks (e.g. 1000)
 * @param {number} params.acceptableDeltaRatio - fractional tolerance applied to
 *   the post-scrape count (e.g. 0.05)
 * @returns {{
 *   ok: boolean,
 *   exitCode: 0 | 1,
 *   reason: 'ok' | 'large-increase' | 'upload-mismatch' | 'index-drop',
 *   uploadDelta: number | null,
 *   indexDelta: number,
 *   acceptableIndexDelta: number,
 *   message: string,
 * }}
 */
export const evaluateScrape = ({
  countBefore,
  countAfter,
  scraperHits,
  acceptableDelta,
  acceptableDeltaRatio,
}) => {
  const uploadDelta =
    scraperHits === null ? null : Math.abs(countAfter - scraperHits)
  const indexDelta = countAfter - countBefore
  const acceptableIndexDelta = Math.max(
    acceptableDelta,
    Math.floor(countAfter * acceptableDeltaRatio)
  )

  const base = { uploadDelta, indexDelta, acceptableIndexDelta }

  // 1. Upload completeness: the index count should match what the scraper says
  //    it uploaded. Uses the raw absolute tolerance, not the ratio-scaled one.
  if (uploadDelta !== null && uploadDelta > acceptableDelta) {
    return {
      ...base,
      ok: false,
      exitCode: 1,
      reason: 'upload-mismatch',
      message: `Algolia index count (${countAfter}) does not match scraper hits (${scraperHits}). Upload delta: ${uploadDelta}`,
    }
  }

  // 2. Unexpected drop: the index shrank by more than we tolerate.
  if (indexDelta < -acceptableIndexDelta) {
    return {
      ...base,
      ok: false,
      exitCode: 1,
      reason: 'index-drop',
      message: `Index entry count dropped by ${Math.abs(indexDelta)}, which exceeds the acceptable delta of ${acceptableIndexDelta}.`,
    }
  }

  // 3. Large increase: allowed (may be legit new docs / recovery), but warned.
  if (indexDelta > acceptableIndexDelta) {
    return {
      ...base,
      ok: true,
      exitCode: 0,
      reason: 'large-increase',
      message: `Large index increase detected (${countBefore} -> ${countAfter}). This may be expected after significant doc additions or recovering from a previously under-indexed state.`,
    }
  }

  return {
    ...base,
    ok: true,
    exitCode: 0,
    reason: 'ok',
    message: `Scrape validation passed. Index entries: ${countAfter}${scraperHits !== null ? ` (scraper hits: ${scraperHits})` : ''}.`,
  }
}

/**
 * Executes the run-scraper.sh script and waits for it to finish
 * @param {{ apiKey: string, applicationId: string }} credentials
 * @returns {Promise<string>} scraper stdout
 */
const scrape = async ({ apiKey, applicationId }) => {
  let stdout = ''
  try {
    console.log('About to start scraping...')
    console.log(
      'Scraper will not log any output until it completes. Please wait...'
    )
    console.time('scraper')
    const result = await exec(
      `API_KEY=${apiKey} APPLICATION_ID=${applicationId} sh ./scripts/search/run-scraper.sh`
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
  const API_KEY = process.env.ALGOLIA_API_KEY
  const APPLICATION_ID = process.env.ALGOLIA_APPLICATION_ID
  const ACCEPTABLE_DELTA =
    parseInt(process.env.ALGOLIA_ACCEPTABLE_DELTA) || 1000
  const ACCEPTABLE_DELTA_RATIO =
    parseFloat(process.env.ALGOLIA_ACCEPTABLE_DELTA_RATIO) || 0.05

  const algoliaClient = new AlgoliaClient(
    ALGOLIA_INDEX,
    API_KEY,
    APPLICATION_ID
  )

  console.log(`Comparing entries for index: ${ALGOLIA_INDEX}`)
  const countBeforeScraper =
    await algoliaClient.getEntriesForIndex(ALGOLIA_INDEX)
  console.log(`Entries count before scraper: ${countBeforeScraper}`)
  const scraperStdout = await scrape({
    apiKey: API_KEY,
    applicationId: APPLICATION_ID,
  })
  const countAfterScraper =
    await algoliaClient.getEntriesForIndex(ALGOLIA_INDEX)
  console.log(`Entries count after scraper: ${countAfterScraper}`)

  const scraperHits = parseScraperHits(scraperStdout)
  if (scraperHits !== null) {
    console.log(`Scraper reported hits: ${scraperHits}`)
  } else {
    console.warn(
      'Could not parse "Nb hits" from scraper output. Upload validation will be skipped.'
    )
  }

  const result = evaluateScrape({
    countBefore: countBeforeScraper,
    countAfter: countAfterScraper,
    scraperHits,
    acceptableDelta: ACCEPTABLE_DELTA,
    acceptableDeltaRatio: ACCEPTABLE_DELTA_RATIO,
  })

  console.log(`Index delta after scrape: ${result.indexDelta}`)
  console.log(`Acceptable index delta: ${result.acceptableIndexDelta}`)
  if (result.uploadDelta !== null) {
    console.log(`Upload delta (index vs scraper hits): ${result.uploadDelta}`)
  }

  if (!result.ok) {
    console.error(result.message)
    console.error(
      'Check the config.json file for any changes and check the scraper logs for any errors.'
    )
    process.exit(result.exitCode)
  }

  if (result.reason === 'large-increase') {
    console.warn(result.message)
  } else {
    console.log(result.message)
  }

  process.exit(0)
}

// Only run the scraper when invoked directly (e.g. from CI), not when this
// module is imported by tests.
const invokedDirectly =
  process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]
if (invokedDirectly) {
  main()
}
