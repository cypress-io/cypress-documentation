// The Osano cookie-consent script (injected site-wide by plugins/osano.js)
// renders a banner that overlays the page and intercepts clicks, which makes
// interaction tests flaky. Stub the script request so the CMP never
// initializes and the banner never renders — for every spec except the
// dedicated osano.cy.ts, which opts out to exercise the real banner.
beforeEach(() => {
  if (Cypress.spec.name === 'osano.cy.ts') {
    return
  }

  cy.intercept('GET', 'https://cmp.osano.com/**', {
    statusCode: 200,
    body: '',
    headers: { 'content-type': 'application/javascript' },
  })
})
