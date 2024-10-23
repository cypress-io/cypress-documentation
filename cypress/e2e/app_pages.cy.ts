describe('Visit App pages', () => {
  before(() => {
    cy.task('createFileTree', { path: 'app' }).then((urls) => {
      console.log('urlsLength', urls.length)
      Cypress.env({ urls })
    })
  })

  // Well, this number is hardcoded and should match the length of urls
  Cypress._.range(0, 81).forEach(index => {
    it(`Visit App page ${index} `, () => {
      cy.visit(Cypress.env().urls[index])
      cy.get('h1').should('be.visible')
    })
  })
})