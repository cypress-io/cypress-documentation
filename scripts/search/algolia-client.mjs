import defaultFetch from 'node-fetch'

/**
 * Finds the entry count for a named index within the list Algolia returns from
 * its `/1/indexes` endpoint. Kept as a standalone pure function so the
 * selection/validation logic can be unit tested without a network call.
 *
 * @param {Array<{ name: string, entries: number }>} indices
 * @param {string} indexName
 * @returns {number} number of entries for the given index name
 */
export const selectIndexEntries = (indices, indexName) => {
  if (!Array.isArray(indices)) {
    throw new Error('Expected an array of indices from Algolia')
  }
  const index = indices.find((entry) => entry.name === indexName)
  if (!index) {
    throw new Error(`Algolia index not found with name: ${indexName}`)
  }
  return index.entries
}

export class AlgoliaClient {
  /**
   * @param {string} algoliaIndex
   * @param {string} apiKey
   * @param {string} applicationId
   * @param {typeof defaultFetch} [fetchImpl] - injectable fetch, defaults to
   *   node-fetch. Overridden in tests to avoid real network calls.
   */
  constructor(algoliaIndex, apiKey, applicationId, fetchImpl = defaultFetch) {
    if (!algoliaIndex) {
      throw new Error('Missing Algolia index name!')
    }
    if (!apiKey) {
      throw new Error('Missing Algolia API Key!')
    }
    if (!applicationId) {
      throw new Error('Missing Algolia Application ID!')
    }
    this._ALGOLIA_INDEX = algoliaIndex
    this._API_KEY = apiKey
    this._APPLICATION_ID = applicationId
    this._fetch = fetchImpl
  }

  /**
   * Requests information about the indices for a given application ID
   */
  _getIndices = async () => {
    // Fetches all indexes from Algolia for a given APPLICATION_ID.
    const INDEXES_URL = `https://${this._APPLICATION_ID}-dsn.algolia.net/1/indexes`
    const response = await this._fetch(INDEXES_URL, {
      headers: {
        'Content-Type': 'application/json',
        'X-Algolia-API-Key': this._API_KEY,
        'X-Algolia-Application-Id': this._APPLICATION_ID,
      },
    })
    const data = await response.json()
    return data.items
  }

  /**
   * @param {string} indexName - Name of index to query for entries count
   * @returns number of entries for given index name
   */
  getEntriesForIndex = async (indexName) => {
    if (!indexName) {
      throw new Error('indexName is required when calling getEntriesForIndex')
    }
    const indices = await this._getIndices()
    return selectIndexEntries(indices, indexName)
  }
}
