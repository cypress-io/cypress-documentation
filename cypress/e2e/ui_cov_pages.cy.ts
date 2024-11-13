describe('Visit UI Cov pages', () => {
  before(() => {
    cy.task('createFileTree', { path: 'ui-coverage' }).then((urls) => {
      console.log('urlsLength', urls.length)
      Cypress.env({ urls })
    })
  })

  // Well, this number is hardcoded and should match the length of urls
  Cypress._.range(0, 16).forEach(index => {
    it(`Visit UI Cov page ${index} `, () => {
      cy.visit(Cypress.env().urls[index])
      cy.get('h1').should('be.visible')
    })
  })
})