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
    snapshotTitle = `${snapshotTitle} - ${maybeName}`
  }

  cy.percySnapshot(snapshotTitle, {
    widths: [cy.state('viewportWidth')],
    minHeight: cy.state('viewportHeight'),
  })
})
