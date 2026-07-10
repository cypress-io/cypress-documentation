// Stub the Osano consent script so its banner can't overlay the page and cause
// flake — for every spec except osano.cy.ts, which tests the real banner.
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
