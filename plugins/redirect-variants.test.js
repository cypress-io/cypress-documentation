import { describe, expect, test } from 'vitest'
import plugin from './redirect-variants.js'

const { addRedirectVariants, checkRuleLimits } = plugin

describe('addRedirectVariants', () => {
  test('adds .html and trailing-slash spellings right after each exact rule', () => {
    const input = ['/a /b 301', '/c /d 301'].join('\n')
    expect(addRedirectVariants(input).split('\n')).toEqual([
      '/a /b 301',
      '/a.html /b 301',
      '/a/ /b 301',
      '/c /d 301',
      '/c.html /d 301',
      '/c/ /d 301',
    ])
  })

  test('derives the other spellings from a source written with .html or a slash', () => {
    expect(addRedirectVariants('/a.html /b 301').split('\n')).toEqual([
      '/a.html /b 301',
      '/a /b 301',
      '/a/ /b 301',
    ])
    expect(addRedirectVariants('/api/ /toc 301').split('\n')).toEqual([
      '/api/ /toc 301',
      '/api /toc 301',
      '/api.html /toc 301',
    ])
  })

  test('leaves wildcard and placeholder rules, comments, and blank lines alone', () => {
    const input = [
      '# note',
      '',
      '/guides/* /app/:splat 301',
      '/x/:id /y 301',
    ].join('\n')
    expect(addRedirectVariants(input)).toBe(input)
  })

  test('never adds a spelling that is already a source further down', () => {
    const input = ['/a /b 301', '/a.html /b 302'].join('\n')
    expect(addRedirectVariants(input).split('\n')).toEqual([
      '/a /b 301',
      '/a/ /b 301',
      '/a.html /b 302',
    ])
  })

  test('never adds a spelling that would shadow a real page', () => {
    const isPage = (p) => p === '/api'
    expect(addRedirectVariants('/api/ /toc 301', isPage).split('\n')).toEqual([
      '/api/ /toc 301',
      '/api.html /toc 301',
    ])
  })

  test('adds no spellings to a source with another file extension', () => {
    const input = '/install-cypress.md /install 301'
    expect(addRedirectVariants(input)).toBe(input)
  })

  test('reads indented rules and comments the same way as the rest', () => {
    const input = ['  # note', '/a /b 301', '  /a.html /b 301'].join('\n')
    expect(addRedirectVariants(input).split('\n')).toEqual([
      '# note',
      '/a /b 301',
      '/a/ /b 301',
      '/a.html /b 301',
    ])
  })

  test('fails when spellings of one path go to different targets', () => {
    const input = ['/a/ /old 301', '/a /new 301'].join('\n')
    expect(() => addRedirectVariants(input)).toThrow(
      '/a/ goes to /old but /a goes to /new'
    )
  })
})

describe('checkRuleLimits', () => {
  const rules = (count, source) =>
    Array.from({ length: count }, (_, i) => `${source(i)} /to 301`).join('\n')

  test('passes at the limits', () => {
    const text = [
      rules(2000, (i) => `/s${i}`),
      rules(100, (i) => `/d${i}/*`),
    ].join('\n')
    expect(() => checkRuleLimits(text)).not.toThrow()
  })

  test('fails past the static limit', () => {
    expect(() => checkRuleLimits(rules(2001, (i) => `/s${i}`))).toThrow(
      '2001 static'
    )
  })

  test('fails past the dynamic limit', () => {
    expect(() => checkRuleLimits(rules(101, (i) => `/d${i}/:id`))).toThrow(
      '101 dynamic'
    )
  })
})
