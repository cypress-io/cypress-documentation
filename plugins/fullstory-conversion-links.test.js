import { describe, expect, test } from 'vitest'
import conversionLinks from './fullstory-conversion-links.js'

const {
  classifyLink,
  linkPlacement,
  conversionLinkAttributes,
  labelLinkDescendants,
} = conversionLinks

describe('classifyLink', () => {
  test.each([
    ['https://www.cypress.io/pricing', 'Pricing'],
    ['https://cypress.io/pricing/', 'Pricing'],
    ['https://www.cypress.io/pricing?utm_medium=cloud-faq#teams', 'Pricing'],
    ['https://cloud.cypress.io/signup', 'Cloud Sign Up'],
    ['https://cloud.cypress.io/signup?utm_source=docs', 'Cloud Sign Up'],
    ['https://cloud.cypress.io/login', 'Cloud Log In'],
    ['https://cloud.cypress.io/', 'Open Cloud'],
    ['https://cloud.cypress.io', 'Open Cloud'],
    ['https://cloud.cypress.io/organizations', 'Open Cloud'],
    ['https://cloud.cypress.io/projects/7s5okt/runs', 'Open Cloud'],
    ['https://on.cypress.io/cloud', 'Open Cloud'],
    ['https://on.cypress.io/dashboard', 'Open Cloud'],
    [
      'https://www.cypress.io/accessibility?utm_medium=intro-cta&utm_content=Request%20trial',
      'Request Trial',
    ],
    [
      'https://www.cypress.io/ui-coverage?utm_content=Request+trial',
      'Request Trial',
    ],
    ['https://www.cypress.io/contact/', 'Contact Sales'],
    ['https://www.cypress.io/savings-calculator', 'Savings Calculator'],
    ['https://www.cypress.io/cloud', 'Product - Cloud'],
    ['https://www.cypress.io/ui-coverage', 'Product - UI Coverage'],
    ['https://www.cypress.io/accessibility', 'Product - Accessibility'],
    [
      'https://www.cypress.io/accessibility?utm_content=Premium%20Solution',
      'Product - Accessibility',
    ],
    ['https://www.cypress.io/app', 'Product - App'],
    ['https://www.cypress.io/features?utm_medium=footer', 'Product - Features'],
    ['/cloud/get-started/free-trial', 'Free Trial Guide'],
    ['/cloud/get-started/free-trial#Trial-limits', 'Free Trial Guide'],
    [
      'https://docs.cypress.io/cloud/get-started/free-trial',
      'Free Trial Guide',
    ],
  ])('%s is %s', (href, action) => {
    expect(classifyLink(href)).toBe(action)
  })

  test.each([
    'https://www.cypress.io',
    'https://www.cypress.io/blog',
    'https://www.cypress.io/pricing-faq',
    'https://www.cypress.io/cloud/roadmap',
    'https://www.cypress.io/blog?utm_content=Request%20demo',
    'https://on.cypress.io/discord',
    'https://on.cypress.io/cloud-overview',
    'https://on.cypress.io/ui-coverage-trial',
    'https://learn.cypress.io',
    'https://example.cypress.io/pricing',
    'https://github.com/cypress-io/cypress/pricing',
    '/cloud/get-started/introduction',
    '/cloud/features/checks?utm_medium=nav-promo',
    '#Request-trial',
    'mailto:sales@cypress.io',
    'javascript:void(0)',
    '',
  ])('%s is not a conversion link', (href) => {
    expect(classifyLink(href)).toBeNull()
  })

  test('resolves a relative href against the page it is on', () => {
    const base = 'https://docs.cypress.io/cloud/get-started/introduction'
    expect(classifyLink('free-trial', base)).toBe('Free Trial Guide')
    expect(classifyLink('free-trial')).toBeNull()
  })

  test('ignores a same-page anchor on the free trial guide', () => {
    const base = 'https://docs.cypress.io/cloud/get-started/free-trial'
    expect(classifyLink('#Trial-limits', base)).toBeNull()
    expect(classifyLink('', base)).toBeNull()
  })
})

describe('linkPlacement', () => {
  test('is the utm_medium', () => {
    expect(
      linkPlacement('https://www.cypress.io/pricing?utm_medium=cloud-faq')
    ).toBe('cloud-faq')
  })

  test('is "none" without one', () => {
    expect(linkPlacement('https://on.cypress.io/cloud')).toBe('none')
    expect(linkPlacement('')).toBe('none')
  })
})

describe('conversionLinkAttributes', () => {
  test('labels a conversion link with its surface, action, and placement', () => {
    expect(
      conversionLinkAttributes(
        'https://www.cypress.io/cloud?utm_medium=footer',
        'Docs Footer'
      )
    ).toEqual({
      'data-fs-element': 'Docs Footer - Product - Cloud',
      'data-link-placement': 'footer',
      'data-fs-properties-schema': '{"data-link-placement":"str"}',
    })
  })

  test('is empty for every other link', () => {
    expect(
      conversionLinkAttributes('/api/table-of-contents', 'Docs Navbar')
    ).toEqual({})
    expect(conversionLinkAttributes(undefined, 'Docs Footer')).toEqual({})
  })
})

describe('labelLinkDescendants', () => {
  // Just enough of Element for the helper. The e2e spec covers the real DOM.
  class FakeElement {
    constructor(attributes = {}, children = []) {
      this.attributes = new Map(Object.entries(attributes))
      this.children = children
    }
    hasAttribute(name) {
      return this.attributes.has(name)
    }
    getAttribute(name) {
      return this.attributes.has(name) ? this.attributes.get(name) : null
    }
    setAttribute(name, value) {
      this.attributes.set(name, value)
    }
    querySelectorAll(selector) {
      expect(selector).toBe('*')
      return this.children.flatMap((child) => [
        child,
        ...child.querySelectorAll('*'),
      ])
    }
  }

  const pricing = conversionLinkAttributes(
    'https://www.cypress.io/pricing',
    'Docs Content'
  )

  test('copies a conversion link’s attributes to every descendant', () => {
    const code = new FakeElement()
    const path = new FakeElement()
    const svg = new FakeElement({}, [path])
    const a = new FakeElement(pricing, [code, svg])
    labelLinkDescendants(a)
    ;[code, svg, path].forEach((child) => {
      expect(Object.fromEntries(child.attributes)).toEqual(pricing)
    })
  })

  test('keeps a descendant’s own label', () => {
    const span = new FakeElement({ 'data-fs-element': 'Own Label' })
    labelLinkDescendants(new FakeElement(pricing, [span]))
    expect(Object.fromEntries(span.attributes)).toEqual({
      'data-fs-element': 'Own Label',
    })
  })

  test('leaves links that are not conversion links alone', () => {
    const code = new FakeElement()
    labelLinkDescendants(
      new FakeElement({ 'data-fs-element': 'Something Else' }, [code])
    )
    expect(code.attributes.size).toBe(0)
  })
})
