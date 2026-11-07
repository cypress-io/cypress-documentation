// Without FULLSTORY_ORG_ID there's no snippet, so these tests provide window.FS
// themselves. plugins/fullstory-client.js calls FS too (with 'setProperties'),
// so each assertion reads only the 'trackEvent' calls.
describe('Fullstory custom events', () => {
  const visit = (path: string) =>
    cy.visit(path, {
      onBeforeLoad(win) {
        ;(win as any).FS = cy.stub().as('FS')
        // A real clipboard write needs a focused window and a permission
        // grant; the copy's success, not the clipboard, is what's under test.
        cy.stub(win.navigator.clipboard, 'writeText').as('writeText').resolves()
      },
    })

  const trackedEvents = () =>
    cy
      .get<sinon.SinonStub>('@FS')
      .then((fs) =>
        fs.args
          .filter(([method]) => method === 'trackEvent')
          .map(([, event]) => event)
      )

  describe('a card shown on load', () => {
    const path = '/accessibility/guides/detect-changes'
    const title = 'Find what a change introduced'

    it('sends Copied AI Prompt with the title, page, and visibility', () => {
      visit(path)
      cy.contains('section', title).within(() => {
        cy.get('button[aria-expanded]').should('not.exist')
        cy.get('button[aria-label="Copy prompt to clipboard"]').click()
        cy.contains('button', 'Copied')
      })

      cy.get('@writeText')
        .should('have.been.calledOnce')
        .its('firstCall.args.0')
        .should(
          'match',
          /^Using Cypress Cloud MCP, get the Cypress Accessibility/
        )
      trackedEvents().should('deep.equal', [
        {
          name: 'Copied AI Prompt',
          properties: {
            prompt_title: title,
            page_path: path,
            prompt_was_visible: true,
          },
        },
      ])
    })
  })

  describe('a defaultCollapsed card', () => {
    const path = '/accessibility/work-with-ai-agents'
    const title = 'Plan tickets from the latest report'
    const copied = (visible: boolean) => ({
      name: 'Copied AI Prompt',
      properties: {
        prompt_title: title,
        page_path: path,
        prompt_was_visible: visible,
      },
    })
    const expanded = {
      name: 'Expanded AI Prompt',
      properties: { prompt_title: title, page_path: path },
    }

    it('reports whether the prompt was showing, and each expand', () => {
      visit(path)
      cy.contains('section', title).within(() => {
        cy.get('button[aria-label="Copy prompt to clipboard"]').click()
        cy.contains('button', 'Copied')
      })
      trackedEvents().should('deep.equal', [copied(false)])

      cy.contains('section', title).within(() => {
        cy.contains('button', 'Show prompt')
          .should('have.attr', 'aria-expanded', 'false')
          .click()
        cy.contains('button', 'Hide prompt').should(
          'have.attr',
          'aria-expanded',
          'true'
        )
        cy.get('button[aria-label="Copy prompt to clipboard"]').click()
      })
      trackedEvents().should('deep.equal', [
        copied(false),
        expanded,
        copied(true),
      ])
      cy.get('@writeText').should('have.been.calledTwice')
    })

    it('sends nothing on collapse', () => {
      visit(path)
      cy.contains('section', title).within(() => {
        cy.contains('button', 'Show prompt').click()
        cy.contains('button', 'Hide prompt').click()
        cy.contains('button', 'Show prompt')
      })
      trackedEvents().should('deep.equal', [expanded])
    })
  })

  describe('markdown actions', () => {
    it('sends Opened Page Markdown Menu with the markdown URL', () => {
      visit('/api/commands/blur')
      cy.get('button[aria-label="More page formats"]').click()
      trackedEvents().should('deep.equal', [
        {
          name: 'Opened Page Markdown Menu',
          properties: {
            markdown_url: 'https://docs.cypress.io/api/commands/blur.md',
          },
        },
      ])
    })
  })
})
