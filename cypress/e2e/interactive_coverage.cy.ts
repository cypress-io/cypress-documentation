const URLs: Array<string> = Cypress.expose('URLs')

const REPRESENTATIVE_PAGES = [
  ...new Set(URLs.map((url) => url.split('/')[0])),
]
  .sort()
  .map((section) => URLs.filter((url) => url.split('/')[0] === section).sort()[0])
  .filter(Boolean)

function exerciseSidebar() {
  cy.get('nav[aria-label="Docs sidebar"]').then(($nav) => {
    const collapsed = $nav
      .find('button:visible')
      .toArray()
      .filter((el) => el.querySelector('[class*="-rotate-90"]'))
    if (collapsed.length === 0) {
      return
    }
    cy.wrap(collapsed[0]).scrollIntoView().click()
    exerciseSidebar()
  })
}

function exerciseContentTabs() {
  cy.get('body').then(($body) => {
    $body.find('[role="tab"]:visible').toArray().forEach((el) => {
      cy.wrap(el).click()
    })
  })
}

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
