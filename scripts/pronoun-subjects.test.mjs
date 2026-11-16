import { describe, expect, it } from 'vitest'
import { findPronounSubjects } from './pronoun-subjects.mjs'

const lines = (source) => findPronounSubjects(source).map((hit) => hit.line)

describe('findPronounSubjects', () => {
  it('flags a sentence that opens with a pronoun for an earlier noun', () => {
    expect(lines('Run Cypress in the sandbox. It runs your specs.')).toEqual([1])
    expect(lines('Cypress caches the binary. This speeds up later installs.')).toEqual([1])
    expect(lines('The commands retry.\n\nThey re-read cookies.')).toEqual([3])
  })

  it('follows a sentence onto the next wrapped line', () => {
    const [hit] = findPronounSubjects('The plugin merges coverage.\nIt also calls nyc to\nwrite a report.')
    expect(hit).toMatchObject({ line: 2, sentence: 'It also calls nyc to write a report.' })
  })

  it('judges a "This" that ends a wrapped line by the next line', () => {
    expect(lines('Cookies expire. This\nexample checks the expiry.')).toEqual([])
    expect(lines('Cookies expire. This\nis checked on each request.')).toEqual([1])
  })

  it('leaves "this" or "that" leading its noun', () => {
    expect(lines('Use cy.session(). This command caches the session.')).toEqual([])
    expect(lines('Set the timeout. These options override the default.')).toEqual([])
  })

  it('flags "this" before a verb that takes an object', () => {
    expect(lines('The hook runs first. This lets you seed data.')).toEqual([1])
    expect(lines('The hook runs first. This also means fewer requests.')).toEqual([1])
  })

  it('leaves an "it" with no referent and common idioms', () => {
    expect(lines('It is recommended to set a baseUrl.')).toEqual([])
    expect(lines("It's a good idea to pin the version.")).toEqual([])
    expect(lines('It is now possible to set cookies.')).toEqual([])
    expect(lines("Run the spec. That's it!")).toEqual([])
  })

  it('leaves a pronoun inside a sentence', () => {
    expect(lines('Cypress retries the assertion until it passes.')).toEqual([])
  })

  it('checks list items, table cells, and sentences after inline code', () => {
    expect(lines('A test is pending when:\n\n- It has no body')).toEqual([3])
    expect(lines('| Option | Notes |\n| --- | --- |\n| `x` | It defaults to `y`. |')).toEqual([3])
    expect(lines('Call `cy.wait()`. It waits for the alias.')).toEqual([1])
  })

  it('skips code, frontmatter, headings, and JSX', () => {
    const source = [
      '---',
      "title: 'It works'",
      '---',
      '',
      '## It runs fast',
      '',
      '```js',
      '// It retries',
      '```',
      '',
      '<DocsImage alt="It shows the runner" />',
    ].join('\n')
    expect(lines(source)).toEqual([])
  })
})
