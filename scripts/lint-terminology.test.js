import { describe, expect, it } from 'vitest'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { checkContent } = require('./lint-terminology.js')

/** @param {string} text */
const terms = (text) =>
  checkContent(text).findings.map((f) => `${f.matched}→${f.suggestion}`)

describe('terminology rules', () => {
  it('corrects brand casing verbatim, regardless of sentence position', () => {
    expect(terms('We use typescript here.')).toEqual(['typescript→TypeScript'])
    expect(terms('Typescript is supported.')).toEqual(['Typescript→TypeScript'])
  })

  it('preserves the leading capital of ordinary words', () => {
    expect(checkContent('Cancelled runs').fixed).toBe('Canceled runs')
    expect(checkContent('a cancelled run').fixed).toBe('a canceled run')
  })

  it('flags the interior capital in iFrame but leaves a sentence-initial Iframes', () => {
    expect(terms('iFrames are unsupported.')).toEqual(['iFrames→iframes'])
    expect(terms('## Iframes')).toEqual([])
  })

  it('replaces blacklist and whitelist, correcting the article', () => {
    expect(checkContent('Add a blacklist or a whitelist.').fixed).toBe(
      'Add a blocklist or an allowlist.'
    )
    expect(checkContent('Domains are whitelisted.').fixed).toBe(
      'Domains are allowlisted.'
    )
  })

  it('reports whether a finding sits in a heading, since fixing changes the anchor', () => {
    expect(checkContent('#### Fix it end to end').findings[0].inHeading).toBe(true)
    expect(checkContent('Fix it end to end.').findings[0].inHeading).toBe(false)
  })
})

describe('regions that are not prose', () => {
  it('ignores fenced code, including a block that quotes a fence', () => {
    const md = [
      '````md',
      '```javascript',
      'const typescript = 1',
      '```',
      '````',
      '',
      'Now typescript in prose.',
    ].join('\n')
    expect(terms(md)).toEqual(['typescript→TypeScript'])
  })

  it('ignores inline code and link targets', () => {
    expect(terms('Call `cy.getAllLocalStorage()` and `jquery`.')).toEqual([])
    expect(terms('[docs](https://example.com/typescript-guide)')).toEqual([])
  })

  it('ignores attributes of a JSX tag spanning several lines', () => {
    const md = ['<DocsImage', '  src="/img/cloud/github/setup.jpg"', '/>'].join('\n')
    expect(terms(md)).toEqual([])
  })

  it('leaves paths and hostnames alone', () => {
    expect(terms('Edit [.github/workflows/main.yml](https://example.com/a)')).toEqual([])
  })

  it('leaves a quoted UI label or error message verbatim', () => {
    expect(terms('The icon is labeled _"Cancelled,"_ in the run.')).toEqual([])
    expect(terms('An element was labelled "incomplete" by the checker.')).toEqual([
      'labelled→labeled',
    ])
  })

  it('does not touch a possessive that only looks like a plural', () => {
    expect(terms("the API's capabilities")).toEqual([])
  })
})
