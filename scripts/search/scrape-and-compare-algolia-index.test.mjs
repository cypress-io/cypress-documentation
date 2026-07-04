import { describe, expect, test } from 'vitest'
import {
  evaluateScrape,
  parseScraperHits,
} from './scrape-and-compare-algolia-index.mjs'

describe('parseScraperHits', () => {
  test('parses the "Nb hits: N" line', () => {
    expect(parseScraperHits('Nb hits: 4321')).toBe(4321)
  })

  test('finds the line within surrounding scraper output', () => {
    const stdout = [
      '> DocSearch: https://docs.cypress.io/',
      'Nb hits: 4200',
      'Crawling finished.',
    ].join('\n')
    expect(parseScraperHits(stdout)).toBe(4200)
  })

  test('is case-insensitive and tolerates extra whitespace', () => {
    expect(parseScraperHits('nb hits:   7')).toBe(7)
  })

  test('returns the first occurrence when several are present', () => {
    expect(parseScraperHits('Nb hits: 1\nNb hits: 2')).toBe(1)
  })

  test('returns null when there is no hit line', () => {
    expect(parseScraperHits('Crawling finished with errors.')).toBeNull()
  })

  test('returns null for empty / nullish input', () => {
    expect(parseScraperHits('')).toBeNull()
    expect(parseScraperHits(undefined)).toBeNull()
    expect(parseScraperHits(null)).toBeNull()
  })
})

const DEFAULTS = { acceptableDelta: 1000, acceptableDeltaRatio: 0.05 }

describe('evaluateScrape', () => {
  test('passes when counts and scraper hits all agree', () => {
    const result = evaluateScrape({
      countBefore: 4200,
      countAfter: 4200,
      scraperHits: 4200,
      ...DEFAULTS,
    })
    expect(result).toMatchObject({
      ok: true,
      exitCode: 0,
      reason: 'ok',
      uploadDelta: 0,
      indexDelta: 0,
      acceptableIndexDelta: 1000,
    })
  })

  test('fails on an upload mismatch (index vs scraper hits)', () => {
    const result = evaluateScrape({
      countBefore: 4200,
      countAfter: 4200,
      scraperHits: 6000,
      ...DEFAULTS,
    })
    expect(result).toMatchObject({
      ok: false,
      exitCode: 1,
      reason: 'upload-mismatch',
      uploadDelta: 1800,
    })
    expect(result.message).toContain('does not match scraper hits')
  })

  test('fails when the index dropped more than the acceptable delta', () => {
    const result = evaluateScrape({
      countBefore: 10000,
      countAfter: 4200,
      scraperHits: 4200,
      ...DEFAULTS,
    })
    expect(result).toMatchObject({
      ok: false,
      exitCode: 1,
      reason: 'index-drop',
      indexDelta: -5800,
    })
    expect(result.message).toContain('dropped by 5800')
  })

  test('warns (but passes) on a large increase', () => {
    const result = evaluateScrape({
      countBefore: 4200,
      countAfter: 8000,
      scraperHits: 8000,
      ...DEFAULTS,
    })
    expect(result).toMatchObject({
      ok: true,
      exitCode: 0,
      reason: 'large-increase',
      indexDelta: 3800,
    })
    expect(result.message).toContain('Large index increase')
  })

  test('upload mismatch takes precedence over an index drop', () => {
    const result = evaluateScrape({
      countBefore: 10000,
      countAfter: 4200,
      scraperHits: 8000, // uploadDelta 3800 > 1000
      ...DEFAULTS,
    })
    expect(result.reason).toBe('upload-mismatch')
  })

  test('skips the upload check when scraper hits could not be parsed', () => {
    const result = evaluateScrape({
      countBefore: 4200,
      countAfter: 4200,
      scraperHits: null,
      ...DEFAULTS,
    })
    expect(result).toMatchObject({ ok: true, reason: 'ok', uploadDelta: null })
    expect(result.message).not.toContain('scraper hits')
  })

  test('still catches an index drop when scraper hits are unavailable', () => {
    const result = evaluateScrape({
      countBefore: 10000,
      countAfter: 4200,
      scraperHits: null,
      ...DEFAULTS,
    })
    expect(result).toMatchObject({ ok: false, reason: 'index-drop' })
  })

  test('uses the ratio-scaled tolerance when it exceeds the absolute delta', () => {
    // floor(countAfter * 0.05) = floor(96000 * 0.05) = 4800 > 1000, so the
    // 4000 drop is tolerated where the flat 1000 delta alone would have failed.
    const result = evaluateScrape({
      countBefore: 100000,
      countAfter: 96000,
      scraperHits: 96000,
      ...DEFAULTS,
    })
    expect(result.acceptableIndexDelta).toBe(4800)
    expect(result).toMatchObject({ ok: true, reason: 'ok' })
  })

  describe('boundary conditions', () => {
    test('a drop exactly equal to the tolerance is allowed', () => {
      const result = evaluateScrape({
        countBefore: 5200,
        countAfter: 4200,
        scraperHits: 4200,
        ...DEFAULTS,
      })
      // indexDelta === -1000, not < -1000
      expect(result).toMatchObject({ ok: true, reason: 'ok' })
    })

    test('an increase exactly equal to the tolerance does not warn', () => {
      const result = evaluateScrape({
        countBefore: 3200,
        countAfter: 4200,
        scraperHits: 4200,
        ...DEFAULTS,
      })
      // indexDelta === 1000, not > 1000
      expect(result).toMatchObject({ ok: true, reason: 'ok' })
    })

    test('an upload delta exactly equal to the tolerance is allowed', () => {
      const result = evaluateScrape({
        countBefore: 4200,
        countAfter: 4200,
        scraperHits: 5200,
        ...DEFAULTS,
      })
      // uploadDelta === 1000, not > 1000
      expect(result).toMatchObject({
        ok: true,
        reason: 'ok',
        uploadDelta: 1000,
      })
    })
  })
})
