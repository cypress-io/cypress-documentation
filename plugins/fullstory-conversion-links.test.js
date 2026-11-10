import { describe, expect, test } from 'vitest'
import conversionLinks from './fullstory-conversion-links.js'
import rehypeFullStoryConversionLinks from './fullstory-conversion-links-rehype.js'

const { classifyLink, linkPlacement, conversionLinkAttributes } =
  conversionLinks

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

describe('rehypeFullStoryConversionLinks', () => {
  const run = (tree) => {
    rehypeFullStoryConversionLinks()(tree)
    return tree
  }
  const link = (href, children = [], properties = {}) => ({
    type: 'element',
    tagName: 'a',
    properties: { href, ...properties },
    children,
  })
  const root = (...children) => ({
    type: 'root',
    children: [{ type: 'element', tagName: 'p', properties: {}, children }],
  })

  test('labels a Markdown conversion link, inline code and all', () => {
    const code = {
      type: 'element',
      tagName: 'code',
      properties: {},
      children: [{ type: 'text', value: 'cypress open' }],
    }
    const a = link('https://cloud.cypress.io/login?utm_medium=cli-tip', [code])
    run(root(a))
    expect(a.properties).toEqual({
      href: 'https://cloud.cypress.io/login?utm_medium=cli-tip',
      dataFsElement: 'Docs Content - Cloud Log In',
      dataLinkPlacement: 'cli-tip',
      dataFsPropertiesSchema: '{"data-link-placement":"str"}',
    })
    // pointer-events: none on descendants sends the click to the <a>.
    expect(code.properties).toEqual({})
  })

  test('leaves other links and existing labels alone', () => {
    const other = link('/api/commands/visit')
    const labeled = link('https://www.cypress.io/pricing', [], {
      dataFsElement: 'Own Label',
    })
    run(root(other, labeled))
    expect(other.properties).toEqual({ href: '/api/commands/visit' })
    expect(labeled.properties).toEqual({
      href: 'https://www.cypress.io/pricing',
      dataFsElement: 'Own Label',
    })
  })

  test('labels an <a> written as JSX with a literal href', () => {
    const jsx = {
      type: 'mdxJsxTextElement',
      name: 'a',
      attributes: [
        {
          type: 'mdxJsxAttribute',
          name: 'href',
          value: 'https://on.cypress.io/cloud',
        },
      ],
      children: [],
    }
    run(root(jsx))
    expect(
      Object.fromEntries(jsx.attributes.map((a) => [a.name, a.value]))
    ).toEqual({
      href: 'https://on.cypress.io/cloud',
      'data-fs-element': 'Docs Content - Open Cloud',
      'data-link-placement': 'none',
      'data-fs-properties-schema': '{"data-link-placement":"str"}',
    })
  })
})
