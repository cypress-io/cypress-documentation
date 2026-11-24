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
 * A section is the first segment of a page's URL, which is how every map here
 * is keyed except FOLDER_PRODUCT.
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
 * The Fullstory `product` property for each folder under docs/, matched by the
 * folder a page's source file sits in rather than by its URL, because one
 * folder's pages publish under several paths (docs/app/ai/ publishes under
 * /app/ai, /app/guides, and /app/tooling). The deepest listed folder wins.
 *
 * The values are www.cypress.io's, since the two sites and Cypress Cloud record
 * into one Fullstory org and a funnel filters on the value they share. A page
 * in no listed folder sends no `product`.
 */
const FOLDER_PRODUCT = {
  accessibility: 'accessibility',
  api: 'app',
  app: 'app',
  'app/ai': 'ai',
  cloud: 'cloud',
  'ui-coverage': 'ui-coverage',
}

/** The expected " | …" suffix for a given route/URL (no leading slash needed). */
function titleSuffixForUrl(url) {
  const segment = String(url).replace(/^\//, '').split('/')[0]
  return SECTION_TITLE_SUFFIX[segment] || DEFAULT_TITLE_SUFFIX
}

/**
 * The Fullstory `product` for a doc, from its Docusaurus doc id: the source
 * file's path under docs/ without the extension ("app/ai/overview").
 * Undefined when the doc is in no listed folder.
 */
function productForDocId(docId) {
  const folders = String(docId).split('/').slice(0, -1)
  for (let depth = folders.length; depth > 0; depth--) {
    const product = FOLDER_PRODUCT[folders.slice(0, depth).join('/')]
    if (product) return product
  }
  return undefined
}

module.exports = {
  DEFAULT_SECTION_NAME,
  DEFAULT_TITLE_SUFFIX,
  SECTION_NAME,
  SECTION_TITLE_SUFFIX,
  productForDocId,
  titleSuffixForUrl,
}
