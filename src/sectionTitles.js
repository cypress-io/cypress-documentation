/**
 * Per-section SEO title suffix.
 *
 * Docusaurus appends the global site title ("| Cypress Documentation") to every
 * page title. For these doc sections we instead want a section-specific suffix,
 * e.g. "Page name | Cypress Accessibility Documentation".
 *
 * This is applied in the React tree by the swizzled
 * src/theme/DocItem/Metadata component (so it is correct in both the
 * server-rendered HTML and at runtime), and asserted by
 * cypress/e2e/page_titles.cy.ts.
 *
 * The keys are the first URL path segment of the section.
 */
const DEFAULT_TITLE_SUFFIX = 'Cypress Documentation'

const SECTION_TITLE_SUFFIX = {
  accessibility: 'Cypress Accessibility Documentation',
  api: 'Cypress API Documentation',
  cloud: 'Cypress Cloud Documentation',
  'ui-coverage': 'Cypress UI Coverage Documentation',
}

/**
 * Display name for each section, keyed the same way. It starts every page's
 * Fullstory page name ("API: cy.check()"), so renaming one splits the history
 * of that section's pages in Fullstory in two.
 */
const DEFAULT_SECTION_NAME = 'Cypress Documentation'

const SECTION_NAME = {
  accessibility: 'Cypress Accessibility',
  api: 'API',
  app: 'Cypress App',
  cloud: 'Cypress Cloud',
  'ui-coverage': 'UI Coverage',
}

/**
 * The Fullstory `product` property for each section, keyed the same way. The
 * values are www.cypress.io's, since the two sites and Cypress Cloud record into
 * one Fullstory org and a funnel filters on the value they share. A section
 * missing here is about no one product and sends no `product`.
 */
const SECTION_PRODUCT = {
  accessibility: 'accessibility',
  api: 'app',
  app: 'app',
  cloud: 'cloud',
  'ui-coverage': 'ui-coverage',
}

/** Paths under a section that belong to a different product than the section. */
const PATH_PREFIX_PRODUCT = {
  'app/ai': 'ai',
}

/** The expected " | …" suffix for a given route/URL (no leading slash needed). */
function titleSuffixForUrl(url) {
  const segment = String(url).replace(/^\//, '').split('/')[0]
  return SECTION_TITLE_SUFFIX[segment] || DEFAULT_TITLE_SUFFIX
}

/** The Fullstory `product` for a route, or undefined when it has none. */
function productForUrl(url) {
  const path = String(url).replace(/^\//, '')
  const prefix = Object.keys(PATH_PREFIX_PRODUCT).find(
    (p) => path === p || path.startsWith(`${p}/`)
  )
  if (prefix) return PATH_PREFIX_PRODUCT[prefix]
  return SECTION_PRODUCT[path.split('/')[0]]
}

module.exports = {
  DEFAULT_SECTION_NAME,
  DEFAULT_TITLE_SUFFIX,
  PATH_PREFIX_PRODUCT,
  SECTION_NAME,
  SECTION_PRODUCT,
  SECTION_TITLE_SUFFIX,
  productForUrl,
  titleSuffixForUrl,
}
