import { afterEach, describe, expect, test, vi } from 'vitest'
import { currentPagePath, trackFullStoryEvent } from './fullstory'

const properties = { pagePath: '/api/commands/blur' }

describe('trackFullStoryEvent', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('sends a v2 trackEvent call', () => {
    const FS = vi.fn()
    vi.stubGlobal('window', { FS })

    trackFullStoryEvent('Page Markdown Viewed', properties)

    expect(FS).toHaveBeenCalledExactlyOnceWith('trackEvent', {
      name: 'Page Markdown Viewed',
      properties,
    })
  })

  test('does nothing without a window', () => {
    expect(() =>
      trackFullStoryEvent('Page Markdown Viewed', properties)
    ).not.toThrow()
  })

  test('does nothing when FS is missing or not a function', () => {
    vi.stubGlobal('window', {})
    expect(() =>
      trackFullStoryEvent('Page Markdown Viewed', properties)
    ).not.toThrow()

    vi.stubGlobal('window', { FS: { event: vi.fn() } })
    expect(() =>
      trackFullStoryEvent('Page Markdown Viewed', properties)
    ).not.toThrow()
  })

  test('swallows an error thrown by FS', () => {
    vi.stubGlobal('window', {
      FS: () => {
        throw new Error('blocked')
      },
    })
    expect(() =>
      trackFullStoryEvent('Page Markdown Viewed', properties)
    ).not.toThrow()
  })
})

describe('currentPagePath', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('returns the pathname without the query string or hash', () => {
    const url = new URL('https://docs.cypress.io/api/commands/blur?q=x#Syntax')
    vi.stubGlobal('window', { location: url })
    expect(currentPagePath()).toBe('/api/commands/blur')
  })

  test('returns an empty string during server rendering', () => {
    expect(currentPagePath()).toBe('')
  })
})
