describe('Migration guide copy prompts', () => {
  const cards = () => cy.get('section[class*="copyPrompt"]')

  beforeEach(() => {
    cy.visit('/app/references/migration-guide')
  })

  it('renders a prompt card for each migration section', () => {
    cards().should('have.length', 7)
  })

  it('expands and collapses the full prompt', () => {
    cards()
      .first()
      .within(() => {
        cy.contains('Read https://docs.cypress.io/llm/markdown/').should(
          'not.be.visible'
        )
        cy.contains('button', 'Show prompt')
          .should('have.attr', 'aria-expanded', 'false')
          .click()
        cy.contains('button', 'Hide prompt').should(
          'have.attr',
          'aria-expanded',
          'true'
        )
        cy.contains('Read https://docs.cypress.io/llm/markdown/').should(
          'be.visible'
        )
        cy.contains('button', 'Hide prompt').click()
        cy.contains('Read https://docs.cypress.io/llm/markdown/').should(
          'not.be.visible'
        )
      })
  })

  it('copies the full prompt to the clipboard', () => {
    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, 'writeText').as('writeText').resolves()
    })
    cards()
      .first()
      .within(() => {
        cy.get('button[aria-label="Copy prompt to clipboard"]').click()
        cy.contains('button', 'Copied').should('be.visible')
      })
    cy.get('@writeText').should('have.been.calledOnce')
    cy.get('@writeText')
      .its('firstCall.args.0')
      .should(
        'match',
        /^Read https:\/\/docs\.cypress\.io\/llm\/markdown\/app\/references\/migration-guide\//
      )
      .and('include', 'summarize what changed')
  })

  it('resets the copied state after the timeout', () => {
    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, 'writeText').resolves()
    })
    cards()
      .first()
      .within(() => {
        cy.get('button[aria-label="Copy prompt to clipboard"]').click()
        cy.contains('button', 'Copied').should('be.visible')
        cy.contains('button', 'Copy prompt', { timeout: 6000 }).should(
          'be.visible'
        )
      })
  })
})
