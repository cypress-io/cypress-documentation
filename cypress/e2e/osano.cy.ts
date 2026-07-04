// The one spec exempt from the Osano stub (see cypress/support/e2e.ts): it
// loads the real script to check the banner renders and can be dismissed.
describe('Cookie consent banner', () => {
  it('renders the Osano banner and dismisses it', () => {
    cy.visit('/')

    cy.get('.osano-cm-dialog', { timeout: 20000 }).should('be.visible')
    cy.get('.osano-cm-accept-all').click()
    cy.get('.osano-cm-dialog').should('not.be.visible')
  })
})
