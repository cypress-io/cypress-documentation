const fetch = require('node-fetch')

class AlgoliaClient {
  constructor(algoliaIndex, apiKey, applicationId) {
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
  }

  /**
   * Requests information about the indices for a given application ID
   */
  _getIndices = async () => {
    // Fetches all indexes from Algolia for a given APPLICATION_ID.
    const INDEXES_URL = `https://${this._APPLICATION_ID}-dsn.algolia.net/1/indexes`
    const response = await fetch(INDEXES_URL, {
      headers: {
        'Content-Type': 'application/json',
        'X-Algolia-API-Key': this._API_KEY,
        'X-Algolia-Application-Id': this._APPLICATION_ID 
      }
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
    const index = indices.find(index => index.name === indexName)
    if (!index) {
      throw new Error(`Algolia index not found with name: ${index}`)
    }
    return index.entries
  }
}

module.exports.AlgoliaClient = AlgoliaClient