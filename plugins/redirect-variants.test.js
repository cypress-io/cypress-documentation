import { describe, expect, test } from 'vitest'
import plugin from './redirect-variants.js'

const { addRedirectVariants } = plugin

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
    const input = ['/a /b 301', '/a.html /c 301'].join('\n')
    expect(addRedirectVariants(input).split('\n')).toEqual([
      '/a /b 301',
      '/a/ /b 301',
      '/a.html /c 301',
    ])
  })

  test('never adds a spelling that would shadow a real page', () => {
    const isPage = (p) => p === '/api'
    expect(addRedirectVariants('/api/ /toc 301', isPage).split('\n')).toEqual([
      '/api/ /toc 301',
      '/api.html /toc 301',
    ])
  })
})
