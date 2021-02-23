// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import '@percy/cypress'

// custom command to make taking snapshots with full name
// formed from the test title + suffix easier
// cy.visualSnapshot() // default full test title
// cy.visualSnapshot('clicked') // full test title + ' - clicked'
// also sets the width and height to the current viewport
// from: https://github.com/cypress-io/cypress-realworld-app/blob/8d47eb252fd95126e9ce5fce0379fc8486fba86f/cypress/support/commands.ts#L9-L26
// Enable this command by setting the env var `CYPRESS_VISUAL_SNAPSHOT_TESTING` to `1`
Cypress.Commands.add('visualSnapshot', (maybeName) => {
  if (Number(Cypress.env('VISUAL_SNAPSHOT_TESTING')) !== 1) {
    return
  }

  let snapshotTitle = cy.state('runnable').fullTitle()
  if (maybeName) {
    snapshotTitle = snapshotTitle + ' - ' + maybeName
  }
  cy.percySnapshot(snapshotTitle, {
    widths: [cy.state('viewportWidth')],
    minHeight: cy.state('viewportHeight'),
  })
})
