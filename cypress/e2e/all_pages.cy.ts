const URLs: Array<string> = Cypress.env('URLs')

// Mostly this is to get a UI Coverage and Accessibility report
describe('Visit all pages', () => {
  URLs.forEach((URL) => {
    it(`Visit a11y page ${URL} `, () => {
      cy.visit(URL)
      cy.get('h1').should('be.visible')
      cy.get('[aria-label="Switch to dark mode"]').click()
    })
  })
})