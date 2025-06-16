const URLs: Array<string> = Cypress.env('URLs')

// Mostly this is to get a UI Coverage and Accessibility report
describe('Visit all Cloud pages', () => {
  URLs.forEach((URL) => {
    if (!URL.startsWith('cloud')) return

    it(`Visit ${URL} `, () => {
      cy.visit(URL)
      cy.get('h1')
        .should('be.visible')
        .and('not.have.text', 'Page Not Found')
        
      cy.get('[aria-label="Switch to dark mode"]').click()
    })
  })
})