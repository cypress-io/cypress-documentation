import { describe, expect, test } from 'vitest'
import { decodeHash, matchCanonicalId } from './matchCanonicalId.js'

const HEADING_IDS = [
  'Web-Security',
  'Disabling-Web-Security',
  '14-0-0',
  'Yields',
]

describe('decodeHash', () => {
  test('strips a leading #', () => {
    expect(decodeHash('#Disabling-Web-Security')).toBe('Disabling-Web-Security')
  })

  test('accepts a value with no leading #', () => {
    expect(decodeHash('Disabling-Web-Security')).toBe('Disabling-Web-Security')
  })

  test('decodes percent-encoded characters', () => {
    expect(decodeHash('#Foo%20Bar')).toBe('Foo Bar')
  })

  test('returns the raw value when decodeURIComponent throws', () => {
    expect(decodeHash('#%E0%A4%A')).toBe('%E0%A4%A')
  })

  test('returns an empty string for empty or non-string input', () => {
    expect(decodeHash('')).toBe('')
    expect(decodeHash('#')).toBe('')
    expect(decodeHash(undefined)).toBe('')
    expect(decodeHash(null)).toBe('')
  })
})

describe('matchCanonicalId', () => {
  test('returns rewrite: false for an exact match', () => {
    expect(matchCanonicalId('#Disabling-Web-Security', HEADING_IDS)).toEqual({
      id: 'Disabling-Web-Security',
      rewrite: false,
    })
  })

  test('returns the canonical id when only the case differs', () => {
    expect(matchCanonicalId('#disabling-web-security', HEADING_IDS)).toEqual({
      id: 'Disabling-Web-Security',
      rewrite: true,
    })
    expect(matchCanonicalId('#DISABLING-WEB-SECURITY', HEADING_IDS)).toEqual({
      id: 'Disabling-Web-Security',
      rewrite: true,
    })
  })

  test('accepts a hash without a leading #', () => {
    expect(matchCanonicalId('disabling-web-security', HEADING_IDS)).toEqual({
      id: 'Disabling-Web-Security',
      rewrite: true,
    })
  })

  test('prefers an exact match over a case-insensitive sibling', () => {
    const ids = ['API', 'api']
    expect(matchCanonicalId('#API', ids)).toEqual({
      id: 'API',
      rewrite: false,
    })
    expect(matchCanonicalId('#api', ids)).toEqual({
      id: 'api',
      rewrite: false,
    })
  })

  test('uses the first case-insensitive match in document order', () => {
    expect(matchCanonicalId('#api', ['API', 'Api'])).toEqual({
      id: 'API',
      rewrite: true,
    })
  })

  test('returns null when nothing matches', () => {
    expect(matchCanonicalId('#missing-heading', HEADING_IDS)).toBeNull()
  })

  test('returns null for an empty hash', () => {
    expect(matchCanonicalId('', HEADING_IDS)).toBeNull()
    expect(matchCanonicalId('#', HEADING_IDS)).toBeNull()
  })

  test('returns null when there are no ids', () => {
    expect(matchCanonicalId('#Disabling-Web-Security', [])).toBeNull()
    expect(matchCanonicalId('#Disabling-Web-Security', undefined)).toBeNull()
  })
})
