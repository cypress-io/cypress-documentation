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

/** The expected " | …" suffix for a given route/URL (no leading slash needed). */
function titleSuffixForUrl(url) {
  const segment = String(url).replace(/^\//, '').split('/')[0]
  return SECTION_TITLE_SUFFIX[segment] || DEFAULT_TITLE_SUFFIX
}

module.exports = {
  DEFAULT_SECTION_NAME,
  DEFAULT_TITLE_SUFFIX,
  SECTION_NAME,
  SECTION_TITLE_SUFFIX,
  titleSuffixForUrl,
}
