import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { pluginEntryErrors, pluginsFileErrors } from './plugins-schema.mjs'

const entry = (overrides = {}) => ({
  name: 'cypress-example',
  description: 'Does a thing.',
  link: 'https://github.com/someone/cypress-example',
  ...overrides,
})

const file = (...plugins) => ({
  plugins: [{ name: 'Utilities', description: 'Helpers.', plugins }],
})

describe('pluginsFileErrors', () => {
  it('accepts the committed plugins.json', () => {
    const data = JSON.parse(readFileSync('src/data/plugins.json', 'utf8'))
    expect(pluginsFileErrors(data)).toEqual([])
  })

  it('names the category and plugin for each problem', () => {
    expect(pluginsFileErrors(file(entry({ badge: 'gold' })))).toEqual([
      'Utilities › cypress-example: `badge` must be `official` or `community`',
    ])
  })

  it('flags a plugin listed twice, even with a trailing slash', () => {
    const errors = pluginsFileErrors(
      file(
        entry(),
        entry({
          name: 'Other',
          link: 'https://github.com/someone/cypress-example/',
        })
      )
    )
    expect(errors).toEqual([
      'Utilities › Other: same link `https://github.com/someone/cypress-example/` as an entry in Utilities',
    ])
  })

  it('rejects unknown top-level and category fields', () => {
    const data = { ...file(entry()), extra: true }
    data.plugins[0].icon = 'x'
    expect(pluginsFileErrors(data)).toEqual([
      'plugins.json: unknown field `extra`',
      'Utilities: unknown field `icon`',
    ])
  })
})

describe('pluginEntryErrors', () => {
  it('accepts a complete entry and a site path link', () => {
    expect(
      pluginEntryErrors(
        entry({ keywords: ['a'], badge: 'community', npm: 'x' })
      )
    ).toEqual([])
    expect(
      pluginEntryErrors(entry({ link: '/cloud/integrations/cloud-mcp' }))
    ).toEqual([])
  })

  it('phrases each rule for a contributor', () => {
    expect(
      pluginEntryErrors({
        name: 'x',
        description: '',
        link: 'http://example.com',
        keywords: 'a, b',
        extra: 1,
      })
    ).toEqual([
      'unknown field `extra`',
      '`description` is empty',
      '`link` must be an https URL or a path on this site',
      '`keywords` must be a list',
    ])
  })

  it('reports missing fields and bad list items', () => {
    expect(pluginEntryErrors({ name: 'x', keywords: [1] })).toEqual([
      '`description` is missing',
      '`link` is missing',
      '`keywords` must contain only strings',
    ])
  })

  it('rejects a protocol-relative link', () => {
    expect(pluginEntryErrors(entry({ link: '//evil.example' }))).toEqual([
      '`link` must be an https URL or a path on this site',
    ])
  })
})
