describe('Visit API pages', () => {
  before(() => {
    cy.task('createFileTree', { path: 'api' }).then((urls) => {
      // console.log('urlsLength', urls.length)
      Cypress.env({ urls })
    })
  })

  // Well, this number is hardcoded and should match the length of urls
  Cypress._.range(0, 132).forEach(index => {
    it(`Visit API page ${index} `, () => {
      cy.visit(Cypress.env().urls[index])
      cy.get('h1').should('be.visible')
    })
  })
})