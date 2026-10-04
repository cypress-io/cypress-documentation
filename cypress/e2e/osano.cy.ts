// The one spec exempt from the Osano stub (see cypress/support/e2e.ts): it
// loads the real script and checks the consent manager initializes. Whether the
// banner auto-shows is geo/consent-gated, so we assert its dialog is injected
// rather than that it is visible.
describe('Cookie consent (Osano)', () => {
  it('loads the consent manager', () => {
    cy.visit('/')
    cy.get('.osano-cm-dialog', { timeout: 20000 }).should('exist')
  })

  // plugins/osano.js labels the banner's controls for FullStory, including
  // every descendant, since clicks on the close button land on its inner <svg>.
  // Which controls render is geo-gated too: some regions get a close button,
  // others get consent buttons instead, so check whichever this runner gets.
  it('labels the banner controls for FullStory', () => {
    cy.visit('/')
    cy.get(
      [
        '.osano-cm-dialog .osano-cm-close',
        '.osano-cm-dialog .osano-cm-button--type_accept',
        '.osano-cm-dialog .osano-cm-button--type_denyAll',
        '.osano-cm-dialog .osano-cm-button--type_deny',
        '.osano-cm-dialog .osano-cm-button--type_manage',
      ].join(', '),
      { timeout: 20000 }
    ).should(($controls) => {
      $controls.each((_, control) => {
        const label = control.getAttribute('data-fs-element')
        expect(label, control.className).to.match(/^Cookie Consent - /)
        control.querySelectorAll('*').forEach((child) => {
          expect(child.getAttribute('data-fs-element'), child.tagName).to.eq(
            label
          )
        })
      })
    })
  })
})
