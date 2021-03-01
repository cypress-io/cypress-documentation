describe('Old Docs Compatibility', () => {
  beforeEach(() => {
    cy.viewport('macbook-15')
  })

  it('replaces capitalized URL hashes with lower case hashes', () => {
    cy.visit('guides/overview/why-cypress#Features')
    cy.location().its('hash').should('equal', '#features')
    cy.get('#features')
  })
})
