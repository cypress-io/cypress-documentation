// The one spec exempt from the Osano stub (see cypress/support/e2e.ts): it
// loads the real script and checks the consent manager initializes. Whether the
// banner auto-shows is geo/consent-gated, so we assert its dialog is injected
// rather than that it is visible.
describe('Cookie consent (Osano)', () => {
  it('loads the consent manager', () => {
    cy.visit('/')
    cy.get('.osano-cm-dialog', { timeout: 20000 }).should('exist')
  })

  // plugins/osano.js labels the close button and its inner <svg>, where the
  // click actually lands, so FullStory reports dismissals by name.
  it('labels the dismiss button for FullStory', () => {
    cy.visit('/')
    cy.get('.osano-cm-dialog .osano-cm-close', { timeout: 20000 })
      .should('have.attr', 'data-fs-element', 'Cookie Consent - Dismiss')
      .find('svg')
      .should('have.attr', 'data-fs-element', 'Cookie Consent - Dismiss')
  })
})
