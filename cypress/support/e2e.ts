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

// The docs follow the operating system's light or dark setting, and specs
// written for light mode fail on a machine set to dark. Pin the setting to
// light for every spec except color_mode.cy.ts, which sets it per test.
beforeEach(() => {
  if (
    Cypress.spec.name === 'color_mode.cy.ts' ||
    !Cypress.isBrowser({ family: 'chromium' })
  ) {
    return
  }

  cy.then(() =>
    Cypress.automation('remote:debugger:protocol', {
      command: 'Emulation.setEmulatedMedia',
      params: {
        features: [{ name: 'prefers-color-scheme', value: 'light' }],
      },
    })
  )
})
