// The support file stubs out the Osano cookie-consent script for every other
// spec so its banner can't overlay the page and cause flake. This spec is the
// single exception (matched by name in cypress/support/e2e.ts): it loads the
// real script and verifies the banner renders and can be dismissed.
describe('Cookie consent banner', () => {
  it('renders the Osano banner and dismisses it', () => {
    cy.visit('/')

    cy.get('.osano-cm-dialog', { timeout: 20000 }).should('be.visible')
    cy.get('.osano-cm-accept-all').click()
    cy.get('.osano-cm-dialog').should('not.be.visible')
  })
})
