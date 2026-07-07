// The one spec exempt from the Osano stub (see cypress/support/e2e.ts): it
// loads the real script and checks the consent manager initializes. Whether the
// banner auto-shows is geo/consent-gated, so we assert its dialog is injected
// rather than that it is visible.
describe('Cookie consent (Osano)', () => {
  it('loads the consent manager', () => {
    cy.visit('/')
    cy.get('.osano-cm-dialog', { timeout: 20000 }).should('exist')
  })
})
