import { describe, expect, test } from 'vitest'
import {
  boostCurrentSection,
  getCurrentSectionLvl0,
  mergeFacetFilters,
} from './searchRanking.js'

// ---------------------------------------------------------------------------
// getCurrentSectionLvl0
// ---------------------------------------------------------------------------

describe('getCurrentSectionLvl0', () => {
  test.each([
    ['/app/get-started/why-cypress', 'App'],
    ['/api/commands/get', 'API'],
    ['/cloud/get-started/introduction', 'Cloud'],
    ['/ui-coverage/get-started/introduction', 'UI Coverage'],
    ['/accessibility/get-started/introduction', 'Accessibility'],
  ])('maps %s to the "%s" section', (pathname, expected) => {
    expect(getCurrentSectionLvl0(pathname)).toBe(expected)
  })

  test('maps a bare section path (no trailing segments)', () => {
    expect(getCurrentSectionLvl0('/api')).toBe('API')
    expect(getCurrentSectionLvl0('/api/')).toBe('API')
  })

  test('returns null for the site root', () => {
    expect(getCurrentSectionLvl0('/')).toBeNull()
    expect(getCurrentSectionLvl0('')).toBeNull()
  })

  test('returns null for paths outside the known product sections', () => {
    expect(getCurrentSectionLvl0('/search')).toBeNull()
    expect(getCurrentSectionLvl0('/404')).toBeNull()
    expect(getCurrentSectionLvl0('/guides/overview')).toBeNull()
  })

  test('does not match on a partial prefix', () => {
    // "application" starts with "app" but is not the "app" section
    expect(getCurrentSectionLvl0('/application/foo')).toBeNull()
  })

  test('is case-sensitive on the path segment', () => {
    expect(getCurrentSectionLvl0('/API/commands')).toBeNull()
  })

  test('returns null for non-string input', () => {
    expect(getCurrentSectionLvl0(undefined)).toBeNull()
    expect(getCurrentSectionLvl0(null)).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// boostCurrentSection
// ---------------------------------------------------------------------------

const hit = (id, lvl0) => ({ id, hierarchy: { lvl0 } })

describe('boostCurrentSection', () => {
  const items = [
    hit(1, 'App'),
    hit(2, 'API'),
    hit(3, 'Cloud'),
    hit(4, 'API'),
    hit(5, 'App'),
  ]

  test('moves current-section hits to the front, preserving relative order', () => {
    expect(boostCurrentSection(items, 'API').map((h) => h.id)).toEqual([
      2, 4, 1, 3, 5,
    ])
  })

  test('preserves relative order of the non-boosted hits too', () => {
    expect(boostCurrentSection(items, 'App').map((h) => h.id)).toEqual([
      1, 5, 2, 3, 4,
    ])
  })

  test('returns the list unchanged when no hit matches the section', () => {
    expect(
      boostCurrentSection(items, 'Accessibility').map((h) => h.id)
    ).toEqual([1, 2, 3, 4, 5])
  })

  test('returns the list unchanged when there is no active section', () => {
    expect(boostCurrentSection(items, null)).toBe(items)
    expect(boostCurrentSection(items, undefined)).toBe(items)
    expect(boostCurrentSection(items, '')).toBe(items)
  })

  test('never drops or duplicates results (same multiset, same length)', () => {
    const boosted = boostCurrentSection(items, 'API')
    expect(boosted).toHaveLength(items.length)
    expect([...boosted].sort((a, b) => a.id - b.id)).toEqual(
      [...items].sort((a, b) => a.id - b.id)
    )
  })

  test('treats hits with a missing hierarchy as non-matching', () => {
    const mixed = [{ id: 1 }, hit(2, 'App'), { id: 3, hierarchy: {} }]
    expect(boostCurrentSection(mixed, 'App').map((h) => h.id)).toEqual([
      2, 1, 3,
    ])
  })

  test('handles an empty list', () => {
    expect(boostCurrentSection([], 'App')).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// mergeFacetFilters
// ---------------------------------------------------------------------------

describe('mergeFacetFilters', () => {
  test('merges two arrays', () => {
    expect(mergeFacetFilters(['a'], ['b', 'c'])).toEqual(['a', 'b', 'c'])
  })

  test('wraps string arguments into the flat array', () => {
    expect(mergeFacetFilters('a', ['b'])).toEqual(['a', 'b'])
    expect(mergeFacetFilters(['a'], 'b')).toEqual(['a', 'b'])
    expect(mergeFacetFilters('a', 'b')).toEqual(['a', 'b'])
  })

  test('handles empty arrays', () => {
    expect(mergeFacetFilters([], ['b'])).toEqual(['b'])
    expect(mergeFacetFilters([], [])).toEqual([])
  })
})
