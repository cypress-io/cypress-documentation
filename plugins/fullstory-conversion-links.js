// Labels for clicks from the docs toward a possible conversion (pricing,
// trials, sign-up, product pages, sales) or toward an existing Cloud account.
// Labels follow www.cypress.io's "Surface - Sub-scope - Action" convention,
// with every surface prefixed "Docs" so they stay apart from that site's own
// labels in the shared Fullstory org.
//
// CommonJS so docusaurus.config.js can require it for the footer as well as
// the client module and components importing it.

const SURFACES = {
  content: 'Docs Content',
  navbar: 'Docs Navbar',
  sidebar: 'Docs Sidebar',
  footer: 'Docs Footer',
  announcement: 'Docs Announcement',
}

const PROPERTIES_SCHEMA = JSON.stringify({ 'data-link-placement': 'str' })

const DOCS_ORIGIN = 'https://docs.cypress.io'

const WWW_PATHS = {
  '/pricing': 'Pricing',
  '/contact': 'Contact Sales',
  '/savings-calculator': 'Savings Calculator',
  '/cloud': 'Product - Cloud',
  '/ui-coverage': 'Product - UI Coverage',
  '/accessibility': 'Product - Accessibility',
  '/app': 'Product - App',
  '/features': 'Product - Features',
}

// on.cypress.io short links that redirect to https://cloud.cypress.io/.
const ON_CLOUD_PATHS = ['/cloud', '/dashboard']

/**
 * @param {string} href
 * @param {string} [base] what a relative href resolves against
 * @returns {URL | null}
 */
function parse(href, base = DOCS_ORIGIN) {
  if (!href) return null
  try {
    const url = new URL(href, base)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url : null
  } catch {
    return null
  }
}

/** @param {URL} url */
function normalizedPath(url) {
  return url.pathname.toLowerCase().replace(/\/+$/, '') || '/'
}

/**
 * The conversion action a link leads to, or null for every other link.
 *
 * @param {string} href the link's href attribute, as written
 * @param {string} [base] what a relative href resolves against
 * @returns {string | null}
 */
function classifyLink(href, base) {
  // A same-page anchor, such as the table of contents on the free trial guide.
  if (href.startsWith('#')) return null
  const url = parse(href, base)
  if (!url) return null
  const host = url.hostname.toLowerCase()
  const path = normalizedPath(url)

  if (host === 'cloud.cypress.io') {
    if (path === '/signup' || path.startsWith('/signup/'))
      return 'Cloud Sign Up'
    if (path === '/login' || path.startsWith('/login/')) return 'Cloud Log In'
    return 'Open Cloud'
  }

  if (host === 'on.cypress.io') {
    return ON_CLOUD_PATHS.includes(path) ? 'Open Cloud' : null
  }

  // cypress.io redirects to www.cypress.io, so both reach the same page.
  if (host === 'www.cypress.io' || host === 'cypress.io') {
    if (url.searchParams.get('utm_content') === 'Request trial') {
      return 'Request Trial'
    }
    return WWW_PATHS[path] || null
  }

  if (host === 'docs.cypress.io' && path === '/cloud/get-started/free-trial') {
    return 'Free Trial Guide'
  }

  return null
}

/**
 * The link's utm_medium, which names where it sits, or "none".
 *
 * @param {string} href
 * @param {string} [base]
 * @returns {string}
 */
function linkPlacement(href, base) {
  const url = parse(href, base)
  return (url && url.searchParams.get('utm_medium')) || 'none'
}

/**
 * The Fullstory attributes for a link on the given surface, or an empty object
 * when the link isn't a conversion link, so the result can always be spread.
 *
 * @param {string | undefined} href
 * @param {string} surface one of SURFACES
 * @param {string} [base]
 * @returns {Record<string, string>}
 */
function conversionLinkAttributes(href, surface, base) {
  const action = href ? classifyLink(href, base) : null
  if (!action) return {}
  return {
    'data-fs-element': `${surface} - ${action}`,
    'data-link-placement': linkPlacement(href || '', base),
    'data-fs-properties-schema': PROPERTIES_SCHEMA,
  }
}

const COPIED_ATTRIBUTES = [
  'data-fs-element',
  'data-link-placement',
  'data-fs-properties-schema',
]

/**
 * Copies a labeled conversion link's attributes onto every descendant without a label of
 * its own. Fullstory reports a click on a nested element that has its own
 * classes (inline code, an icon) under that element rather than the link.
 *
 * @param {Element} link
 */
function labelLinkDescendants(link) {
  // data-link-placement marks a conversion link; other labeled links keep
  // whatever their own code gave their descendants.
  if (!link.hasAttribute('data-fs-element')) return
  if (!link.hasAttribute('data-link-placement')) return
  link.querySelectorAll('*').forEach((child) => {
    if (child.hasAttribute('data-fs-element')) return
    COPIED_ATTRIBUTES.forEach((name) => {
      const value = link.getAttribute(name)
      if (value !== null) child.setAttribute(name, value)
    })
  })
}

module.exports = {
  SURFACES,
  classifyLink,
  linkPlacement,
  conversionLinkAttributes,
  labelLinkDescendants,
}
