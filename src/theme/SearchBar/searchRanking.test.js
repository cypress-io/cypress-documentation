import { describe, expect, test } from 'vitest'
import {
  assignDisplayPositions,
  DEMOTED_MIGRATION_GROUP,
  boostCurrentSection,
  demoteUnrequestedMigrationGuides,
  filterDisplayableHits,
  getCurrentSectionLvl0,
  getMigrationGuideTool,
  isDisplayableHit,
  mergeFacetFilters,
  tokenizeQuery,
} from './searchRanking.js'

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

const hit = (id, lvl0) => ({ id, hierarchy: { lvl0 } })

describe('isDisplayableHit', () => {
  test('rejects a section-label-only lvl0 record (nothing to render)', () => {
    // This is exactly the shape the scraper emits for the blank "API" rows.
    expect(
      isDisplayableHit({
        type: 'lvl0',
        hierarchy: {
          lvl0: 'API',
          lvl1: null,
          lvl2: null,
          lvl3: null,
          lvl4: null,
          lvl5: null,
          lvl6: null,
        },
        content: null,
      })
    ).toBe(false)
  })

  test('accepts a hit with a lvl1 title', () => {
    expect(
      isDisplayableHit({
        hierarchy: { lvl0: 'API', lvl1: 'Configuration API' },
      })
    ).toBe(true)
  })

  test.each(['lvl2', 'lvl3', 'lvl4', 'lvl5', 'lvl6'])(
    'accepts a hit whose deepest level is %s',
    (level) => {
      expect(
        isDisplayableHit({ hierarchy: { lvl0: 'API', [level]: 'x' } })
      ).toBe(true)
    }
  )

  test('accepts a content hit even without a deeper hierarchy level', () => {
    expect(
      isDisplayableHit({
        type: 'content',
        hierarchy: { lvl0: 'API' },
        content: 'You can make an API request with cy.request().',
      })
    ).toBe(true)
  })

  test('treats a missing hierarchy as non-displayable', () => {
    expect(isDisplayableHit({})).toBe(false)
    expect(isDisplayableHit(undefined)).toBe(false)
  })
})

describe('filterDisplayableHits', () => {
  test('drops blank lvl0 records but keeps everything renderable', () => {
    const blank = { id: 1, type: 'lvl0', hierarchy: { lvl0: 'API' } }
    const page = {
      id: 2,
      type: 'lvl1',
      hierarchy: { lvl0: 'API', lvl1: 'Configuration API' },
    }
    const content = {
      id: 3,
      type: 'content',
      hierarchy: { lvl0: 'API' },
      content: 'text',
    }
    expect(
      filterDisplayableHits([blank, page, content]).map((h) => h.id)
    ).toEqual([2, 3])
  })

  test('preserves relative order of the kept hits', () => {
    const items = [
      { id: 1, hierarchy: { lvl0: 'API', lvl1: 'A' } },
      { id: 2, hierarchy: { lvl0: 'API' } },
      { id: 3, hierarchy: { lvl0: 'API', lvl1: 'B' } },
    ]
    expect(filterDisplayableHits(items).map((h) => h.id)).toEqual([1, 3])
  })

  test('handles an empty list', () => {
    expect(filterDisplayableHits([])).toEqual([])
  })
})

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

describe('assignDisplayPositions', () => {
  test('stamps a 1-based display position reflecting the final order', () => {
    const items = [hit(1, 'App'), hit(2, 'API'), hit(3, 'Cloud')]
    expect(
      assignDisplayPositions(items).map((h) => h.__displayPosition)
    ).toEqual([1, 2, 3])
  })

  test('reflects the boosted order, not the original Algolia rank', () => {
    // A hit that Algolia ranked 3rd but that gets boosted to the top should
    // report display position 1, so click analytics match what the user saw.
    const items = [hit(1, 'App'), hit(2, 'App'), hit(3, 'API')]
    const boosted = boostCurrentSection(items, 'API')
    const positioned = assignDisplayPositions(boosted)
    expect(positioned[0]).toMatchObject({ id: 3, __displayPosition: 1 })
    expect(positioned.map((h) => h.__displayPosition)).toEqual([1, 2, 3])
  })

  test('does not mutate the input items', () => {
    const items = [hit(1, 'App')]
    assignDisplayPositions(items)
    expect(items[0]).not.toHaveProperty('__displayPosition')
  })

  test('handles an empty list', () => {
    expect(assignDisplayPositions([])).toEqual([])
  })
})

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

describe('getMigrationGuideTool', () => {
  const base = 'https://docs.cypress.io/app/guides/migration'

  test.each([
    [`${base}/playwright-to-cypress`, 'playwright'],
    [`${base}/selenium-to-cypress#Locating-elements`, 'selenium'],
    [`${base}/protractor-to-cypress/`, 'protractor'],
    [
      '/app/get-started/migrate-from-another-tool/playwright-to-cypress',
      'playwright',
    ],
  ])('identifies %s as the %s guide', (url, expected) => {
    expect(getMigrationGuideTool({ url })).toBe(expected)
  })

  test('returns null for other pages', () => {
    expect(
      getMigrationGuideTool({
        url: 'https://docs.cypress.io/api/commands/intercept',
      })
    ).toBeNull()
    expect(
      getMigrationGuideTool({ url: `${base}/playwright-to-cypress-extra` })
    ).toBeNull()
    // The Cypress version upgrade guide is not a tool migration guide
    expect(
      getMigrationGuideTool({
        url: 'https://docs.cypress.io/app/references/migration-guide#Test-Isolation',
      })
    ).toBeNull()
    expect(getMigrationGuideTool({})).toBeNull()
    expect(getMigrationGuideTool(undefined)).toBeNull()
  })
})

describe('tokenizeQuery', () => {
  test('lowercases and splits on non-alphanumerics', () => {
    expect(tokenizeQuery("Playwright's  locator")).toEqual([
      'playwright',
      's',
      'locator',
    ])
  })

  test('returns an empty list for a missing query', () => {
    expect(tokenizeQuery(undefined)).toEqual([])
    expect(tokenizeQuery('')).toEqual([])
  })
})

describe('demoteUnrequestedMigrationGuides', () => {
  const base = '/app/guides/migration'
  const items = [
    { id: 1, url: `${base}/playwright-to-cypress#Waiting` },
    { id: 2, url: '/api/commands/wait' },
    { id: 3, url: `${base}/selenium-to-cypress` },
    { id: 4, url: '/app/core-concepts/retry-ability' },
    { id: 5, url: `${base}/protractor-to-cypress` },
  ]
  const ids = (list) => list.map((h) => h.id)

  test('moves every migration guide to the end for an unrelated query', () => {
    expect(ids(demoteUnrequestedMigrationGuides(items, 'wait'))).toEqual([
      2, 4, 1, 3, 5,
    ])
  })

  test("keeps only the named tool's guide in place", () => {
    expect(
      ids(demoteUnrequestedMigrationGuides(items, 'playwright wait'))
    ).toEqual([1, 2, 4, 3, 5])
    expect(ids(demoteUnrequestedMigrationGuides(items, 'Selenium'))).toEqual([
      2, 3, 4, 1, 5,
    ])
    expect(ids(demoteUnrequestedMigrationGuides(items, 'protractor'))).toEqual([
      2, 4, 5, 1, 3,
    ])
  })

  test('requires the whole tool name, not a prefix or synonym', () => {
    expect(ids(demoteUnrequestedMigrationGuides(items, 'playwr'))).toEqual([
      2, 4, 1, 3, 5,
    ])
    expect(ids(demoteUnrequestedMigrationGuides(items, 'webdriver'))).toEqual([
      2, 4, 1, 3, 5,
    ])
    expect(ids(demoteUnrequestedMigrationGuides(items, 'migrate'))).toEqual([
      2, 4, 1, 3, 5,
    ])
  })

  test('demotes guides when the query is missing', () => {
    expect(ids(demoteUnrequestedMigrationGuides(items, undefined))).toEqual([
      2, 4, 1, 3, 5,
    ])
  })

  test('never drops or duplicates results', () => {
    const ranked = demoteUnrequestedMigrationGuides(items, 'wait')
    expect(ids(ranked).sort()).toEqual(ids(items))
  })

  test('moves demoted guides into their own trailing result group', () => {
    const grouped = [
      {
        id: 1,
        url: `${base}/protractor-to-cypress#Using-Page-Objects`,
        hierarchy: { lvl0: 'App', lvl1: 'Protractor' },
        _highlightResult: {
          hierarchy: { lvl0: { value: 'App', matchLevel: 'none' } },
        },
      },
      {
        id: 2,
        url: '/app/faq#Can-I-use-the-Page-Object-pattern',
        hierarchy: { lvl0: 'App', lvl1: 'FAQ' },
        _highlightResult: {
          hierarchy: { lvl0: { value: 'App', matchLevel: 'none' } },
        },
      },
    ]
    const [kept, demoted] = demoteUnrequestedMigrationGuides(
      grouped,
      'page object'
    )

    expect(kept).toBe(grouped[1])
    expect(demoted.hierarchy).toEqual({
      lvl0: DEMOTED_MIGRATION_GROUP,
      lvl1: 'Protractor',
    })
    // DocSearch groups on the highlighted lvl0, so that copy moves too
    expect(demoted._highlightResult.hierarchy.lvl0).toEqual({
      value: DEMOTED_MIGRATION_GROUP,
      matchLevel: 'none',
    })
    // The input hit is not mutated
    expect(grouped[0].hierarchy.lvl0).toBe('App')
  })

  test('leaves a requested guide in its original group', () => {
    const hit = {
      id: 1,
      url: `${base}/playwright-to-cypress`,
      hierarchy: { lvl0: 'App' },
    }
    expect(demoteUnrequestedMigrationGuides([hit], 'playwright')[0]).toBe(hit)
  })

  test('handles an empty list', () => {
    expect(demoteUnrequestedMigrationGuides([], 'wait')).toEqual([])
  })
})
