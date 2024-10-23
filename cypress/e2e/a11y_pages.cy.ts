describe('Visit a11y pages', () => {
  before(() => {
    cy.task('createFileTree', { path: 'accessibility' }).then((urls) => {
      Cypress.env({ urls })
    })
  })

  // Well, this number is hardcoded and should match the length of urls
  Cypress._.range(0, 12).forEach(index => {
    it(`Visit a11y page ${index} `, () => {
      cy.visit(Cypress.env().urls[index])
      cy.get('h1').should('be.visible')
    })
  })
})