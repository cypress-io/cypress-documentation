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

  it('names where each problem is', () => {
    const data = { ...file(entry({ extra: 1 })), other: true }
    expect(pluginsFileErrors(data)).toEqual([
      'plugins.json: must NOT have additional properties: other',
      'Utilities › cypress-example: must NOT have additional properties: extra',
    ])
  })

  it('flags a plugin listed twice, even with a trailing slash', () => {
    const data = file(
      entry(),
      entry({
        name: 'Other',
        link: 'https://github.com/someone/cypress-example/',
      })
    )
    expect(pluginsFileErrors(data)).toEqual([
      'Utilities › Other: same link "https://github.com/someone/cypress-example/" as an entry in Utilities',
    ])
  })
})

describe('pluginEntryErrors', () => {
  it('accepts an https link or a site path, but not a protocol-relative one', () => {
    expect(pluginEntryErrors(entry())).toEqual([])
    expect(
      pluginEntryErrors(entry({ link: '/cloud/integrations/cloud-mcp' }))
    ).toEqual([])
    expect(pluginEntryErrors(entry({ link: '//evil.example' }))).toHaveLength(1)
  })

  it('reports missing fields and wrong types', () => {
    expect(pluginEntryErrors({ name: 'x', keywords: 'a' })).toEqual([
      "must have required property 'description'",
      "must have required property 'link'",
      'keywords must be array',
    ])
  })
})
