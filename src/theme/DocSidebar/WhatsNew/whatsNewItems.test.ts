import { describe, expect, test } from 'vitest'
import { whatsNewLinkAttributes } from './whatsNewItems'

const schemaOf = (attributes: Record<string, string>) =>
  JSON.parse(attributes['data-fs-properties-schema'])

describe('whatsNewLinkAttributes', () => {
  test('labels a docs link with its promo campaign', () => {
    const attributes = whatsNewLinkAttributes(
      '/cloud/features/checks?utm_medium=nav-promo&utm_source=docs.cypress.io&utm_campaign=run-checks'
    )
    expect(attributes).toEqual({
      'data-fs-element': 'Docs Sidebar - Whats New - Link',
      'data-promo-campaign': 'run-checks',
      'data-fs-properties-schema': JSON.stringify({
        'data-promo-campaign': 'str',
      }),
    })
  })

  test('leaves the campaign off a link without one', () => {
    const attributes = whatsNewLinkAttributes('/app/tooling/cypress-tap')
    expect(attributes['data-fs-element']).toBe(
      'Docs Sidebar - Whats New - Link'
    )
    expect(attributes).not.toHaveProperty('data-promo-campaign')
  })

  test('keeps a conversion link in its conversion funnel', () => {
    const attributes = whatsNewLinkAttributes(
      'https://www.cypress.io/pricing?utm_medium=nav-promo&utm_source=docs.cypress.io&utm_campaign=pricing-promo'
    )
    expect(attributes).toMatchObject({
      'data-fs-element': 'Docs Sidebar - Pricing',
      'data-link-placement': 'nav-promo',
      'data-promo-campaign': 'pricing-promo',
    })
    expect(schemaOf(attributes)).toEqual({
      'data-link-placement': 'str',
      'data-promo-campaign': 'str',
    })
  })
})
