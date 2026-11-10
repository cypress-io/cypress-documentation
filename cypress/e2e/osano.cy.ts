// The one spec exempt from the Osano stub (see cypress/support/e2e.ts): it
// loads the real script and checks the consent manager initializes. Whether the
// banner auto-shows is geo/consent-gated, so we assert its dialog is injected
// rather than that it is visible.
describe('Cookie consent (Osano)', () => {
  it('loads the consent manager', () => {
    cy.visit('/')
    cy.get('.osano-cm-dialog', { timeout: 20000 }).should('exist')
  })

  // The footer link is the only way back into Osano once the banner is gone,
  // and US visitors never get a banner at all. Asserting the drawer starts
  // hidden keeps the test from passing on a drawer that was already open.
  it('reopens the consent drawer from the footer', () => {
    cy.visit('/')
    cy.get('.osano-cm-info-dialog', { timeout: 20000 }).should('not.be.visible')
    cy.contains('.footer button', 'Cookie Preferences')
      .should(
        'have.attr',
        'data-fs-element',
        'Cookie Consent - Open Preferences'
      )
      .click()
    cy.get('.osano-cm-info-dialog').should('be.visible')
  })

  // An ad blocker that stops osano.js leaves the link nothing to open, so
  // plugins/osano.js hides it rather than show a button that does nothing.
  // The earlier tests leave osano.js in the browser cache, where the intercept
  // can't reach it, so the test clears the cache first.
  it('hides the footer link when Osano is blocked', () => {
    cy.wrap(
      Cypress.automation('remote:debugger:protocol', {
        command: 'Network.clearBrowserCache',
      })
    )
    cy.intercept('GET', 'https://cmp.osano.com/**', { forceNetworkError: true })
    cy.visit('/')
    cy.contains('.footer button', 'Cookie Preferences').should('not.be.visible')
  })

  // plugins/osano.js labels the banner's controls for FullStory, including
  // every descendant, since clicks on the close button land on its inner <svg>.
  // Which controls render is geo-gated too: some regions get a close button,
  // others get consent buttons instead, so check whichever this runner gets.
  // The labels match www.cypress.io's, so Fullstory funnels cover both sites.
  it('labels the banner controls for FullStory', () => {
    const labels: Record<string, string> = {
      'osano-cm-close': 'Cookie Consent - Dismiss',
      'osano-cm-button--type_accept': 'Cookie Consent - Accept All',
      'osano-cm-button--type_denyAll': 'Cookie Consent - Deny All',
      'osano-cm-button--type_deny': 'Cookie Consent - Deny All',
      'osano-cm-button--type_manage': 'Cookie Consent - Manage Preferences',
    }
    cy.visit('/')
    cy.get(
      Object.keys(labels)
        .map((className) => `.osano-cm-dialog .${className}`)
        .join(', '),
      { timeout: 20000 }
    ).should(($controls) => {
      $controls.each((_, control) => {
        const className = Object.keys(labels).find((name) =>
          control.classList.contains(name)
        )
        const label = control.getAttribute('data-fs-element')
        expect(label, control.className).to.eq(labels[className!])
        control.querySelectorAll('*').forEach((child) => {
          expect(child.getAttribute('data-fs-element'), child.tagName).to.eq(
            label
          )
        })
      })
    })
  })
})
