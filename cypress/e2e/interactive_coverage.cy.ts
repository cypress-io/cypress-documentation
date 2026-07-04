// Dedicated interactive-coverage spec.
//
// The `visitAllPages` specs generate a UI Coverage *view* for every docs page,
// but they only load the page and toggle dark mode. The shared interactive
// chrome that appears on every view — the collapsible sidebar category
// toggles, the search box, and in-content tab groups — is never interacted
// with, so UI Coverage reports it as untested (these buttons were the largest
// untested element group in Cypress Cloud run #1612).
//
// This spec exercises that chrome on one representative page per docs section.
// The chrome is identical on every page, so a single page per section is enough
// to record those elements as tested without putting the (comparatively slow)
// search-modal interaction on the hot path of the full-site walk. Content tabs
// are exercised opportunistically where a page happens to have them.

// The page list is exposed by `setupNodeEvents` in cypress.config.ts, the same
// source the `visitAllPages` and page-title specs use. Deriving the pages from
// it at runtime means this list can't go stale as pages are added, renamed, or
// removed.
const URLs: Array<string> = Cypress.expose('URLs')

// The alphabetically-first page of each top-level section (`app`, `api`,
// `cloud`, `ui-coverage`, `accessibility`, ...). Sorting keeps the selection
// deterministic and independent of filesystem walk order.
const REPRESENTATIVE_PAGES = [
  ...new Set(URLs.map((url) => url.split('/')[0])),
]
  .sort()
  .map((section) => URLs.filter((url) => url.split('/')[0] === section).sort()[0])
  .filter(Boolean)

// Click every currently-visible collapsible category toggle in the docs
// sidebar. React preserves the toggle button nodes across the expand/collapse
// re-render, so iterating a snapshot of the visible buttons is safe; any nested
// toggles revealed by expanding simply aren't part of this pass.
function exerciseSidebar() {
  cy.get('nav[aria-label="Docs sidebar"]').then(($nav) => {
    const buttons = $nav.find('button:visible').toArray()
    buttons.forEach((el) => {
      cy.wrap(el).scrollIntoView().click({ force: true })
    })
  })
}

// Click through any in-content Docusaurus tab groups (OS tabs, e2e/CT tabs,
// package-manager tabs). Guarded so pages without tabs are a no-op.
function exerciseContentTabs() {
  cy.get('body').then(($body) => {
    $body.find('[role="tab"]:visible').toArray().forEach((el) => {
      cy.wrap(el).click({ force: true })
    })
  })
}

// Open and close the search modal.
function exerciseSearch() {
  cy.contains('Search ⌘K').click()
  cy.get('.DocSearch-Modal').should('be.visible')
  cy.get('.DocSearch-Input').type('cypress')
  cy.get('body').type('{esc}')
  cy.get('.DocSearch-Modal').should('not.exist')
}

describe('Interactive UI Coverage', () => {
  REPRESENTATIVE_PAGES.forEach((URL) => {
    it(`exercises interactive chrome on ${URL}`, () => {
      cy.visit(URL)
      cy.get('h1').should('be.visible').and('not.have.text', 'Page Not Found')

      exerciseSidebar()
      exerciseContentTabs()
      exerciseSearch()

      cy.get('[aria-label="Switch to dark mode"]').click()
    })
  })
})
