import { describe, expect, test, vi } from 'vitest'
import { AlgoliaClient, selectIndexEntries } from './algolia-client.mjs'

describe('selectIndexEntries', () => {
  const indices = [
    { name: 'cypress_docs', entries: 4200 },
    { name: 'cypress_docs_tmp', entries: 10 },
  ]

  test('returns the entry count for the matching index', () => {
    expect(selectIndexEntries(indices, 'cypress_docs')).toBe(4200)
  })

  test('throws a helpful error naming the missing index', () => {
    // Regression guard: the message must interpolate the requested name, not
    // the (undefined) not-found result.
    expect(() => selectIndexEntries(indices, 'nope')).toThrowError(
      'Algolia index not found with name: nope'
    )
  })

  test('throws when the indices payload is not an array', () => {
    expect(() => selectIndexEntries(undefined, 'cypress_docs')).toThrowError(
      /Expected an array of indices/
    )
  })
})

describe('AlgoliaClient constructor', () => {
  test('throws when the index name is missing', () => {
    expect(() => new AlgoliaClient('', 'key', 'app')).toThrowError(
      /Missing Algolia index name/
    )
  })

  test('throws when the API key is missing', () => {
    expect(() => new AlgoliaClient('idx', '', 'app')).toThrowError(
      /Missing Algolia API Key/
    )
  })

  test('throws when the application ID is missing', () => {
    expect(() => new AlgoliaClient('idx', 'key', '')).toThrowError(
      /Missing Algolia Application ID/
    )
  })

  test('constructs successfully with all credentials', () => {
    expect(() => new AlgoliaClient('idx', 'key', 'app')).not.toThrow()
  })
})

describe('getEntriesForIndex', () => {
  const makeFetch = (items) =>
    vi.fn(async () => ({ json: async () => ({ items }) }))

  test('requires an index name', async () => {
    const client = new AlgoliaClient('idx', 'key', 'app', vi.fn())
    await expect(client.getEntriesForIndex()).rejects.toThrowError(
      /indexName is required/
    )
  })

  test('fetches indices and returns the entry count for the named index', async () => {
    const fetchImpl = makeFetch([
      { name: 'cypress_docs', entries: 4321 },
      { name: 'other', entries: 1 },
    ])
    const client = new AlgoliaClient(
      'cypress_docs',
      'search-key',
      'APP123',
      fetchImpl
    )

    await expect(client.getEntriesForIndex('cypress_docs')).resolves.toBe(4321)
  })

  test('calls the correct DSN URL with the auth headers', async () => {
    const fetchImpl = makeFetch([{ name: 'cypress_docs', entries: 1 }])
    const client = new AlgoliaClient(
      'cypress_docs',
      'search-key',
      'APP123',
      fetchImpl
    )

    await client.getEntriesForIndex('cypress_docs')

    expect(fetchImpl).toHaveBeenCalledTimes(1)
    const [url, options] = fetchImpl.mock.calls[0]
    expect(url).toBe('https://APP123-dsn.algolia.net/1/indexes')
    expect(options.headers).toMatchObject({
      'X-Algolia-API-Key': 'search-key',
      'X-Algolia-Application-Id': 'APP123',
    })
  })

  test('propagates the not-found error from selectIndexEntries', async () => {
    const fetchImpl = makeFetch([{ name: 'something_else', entries: 1 }])
    const client = new AlgoliaClient('cypress_docs', 'key', 'app', fetchImpl)

    await expect(
      client.getEntriesForIndex('cypress_docs')
    ).rejects.toThrowError('Algolia index not found with name: cypress_docs')
  })
})
