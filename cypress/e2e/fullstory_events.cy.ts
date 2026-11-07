// Without FULLSTORY_ORG_ID there's no snippet, so these tests provide window.FS
// themselves. plugins/fullstory-client.js calls it too, with `setProperties`,
// so each assertion reads only the `trackEvent` calls.
//
// The clipboard is stubbed rather than granted: the stub resolves (or rejects)
// on demand, so the specs control whether a copy succeeds and can check what
// was written, whether or not the browser window has focus.
type TrackedEvent = { name: string; properties: Record<string, unknown> }

const trackedEvents = () =>
  cy.get<sinon.SinonStub>('@FS').then((FS) =>
    FS.getCalls()
      .filter((call) => call.args[0] === 'trackEvent')
      .map((call) => call.args[1] as TrackedEvent)
  )

const visitWithFullStory = (
  path: string,
  { clipboardWorks = true }: { clipboardWorks?: boolean } = {}
) => {
  cy.visit(path, {
    onBeforeLoad(win) {
      ;(win as any).FS = cy.stub().as('FS')
      const clipboard = win.navigator.clipboard
      if (clipboardWorks) {
        cy.stub(clipboard, 'writeText').as('writeText').resolves()
        cy.stub(clipboard, 'write').as('write').resolves()
      } else {
        cy.stub(clipboard, 'writeText')
          .as('writeText')
          .rejects(new DOMException('Denied', 'NotAllowedError'))
        cy.stub(clipboard, 'write')
          .as('write')
          .rejects(new DOMException('Denied', 'NotAllowedError'))
        // The fallback copy fails too.
        cy.stub(win.document, 'execCommand').as('execCommand').returns(false)
      }
    },
  })
}

const card = (title: string) => cy.contains('section', title)

describe('Fullstory AI prompt events', () => {
  it('sends AI Prompt Copied for a card that is always open', () => {
    visitWithFullStory('/app/tooling/cypress-tap')
    card('Fix a failing test')
      .find('button[aria-label="Copy prompt to clipboard"]')
      .click()

    cy.get('@writeText').should(
      'have.been.calledOnceWith',
      'The [test name] test in [spec path] is failing. Use cypress tap to run it, read the failure, find the cause, fix it, and rerun it until it passes.'
    )
    card('Fix a failing test').should('contain', 'Copied')
    trackedEvents().should('deep.equal', [
      {
        name: 'AI Prompt Copied',
        properties: {
          promptTitle: 'Fix a failing test',
          pagePath: '/app/tooling/cypress-tap',
          promptWasVisible: true,
        },
      },
    ])
  })

  it('records whether a collapsed card was open, and expanding it', () => {
    const title = 'Plan tickets from the latest report'
    const pagePath = '/accessibility/work-with-ai-agents'
    visitWithFullStory(pagePath)

    card(title).find('button[aria-label="Copy prompt to clipboard"]').click()
    card(title).should('contain', 'Copied')
    trackedEvents().should('deep.equal', [
      {
        name: 'AI Prompt Copied',
        properties: { promptTitle: title, pagePath, promptWasVisible: false },
      },
    ])

    card(title).contains('button', 'Show prompt').click()
    card(title).contains('button', 'Hide prompt')
    trackedEvents()
      .its(1)
      .should('deep.equal', {
        name: 'AI Prompt Expanded',
        properties: { promptTitle: title, pagePath },
      })

    card(title).find('button[aria-label="Copy prompt to clipboard"]').click()
    cy.get('@writeText').should('have.been.calledTwice')
    trackedEvents().should('have.length', 3)
    trackedEvents()
      .its(2)
      .should('deep.equal', {
        name: 'AI Prompt Copied',
        properties: { promptTitle: title, pagePath, promptWasVisible: true },
      })

    // Collapsing again sends nothing.
    card(title).contains('button', 'Hide prompt').click()
    card(title).contains('button', 'Show prompt')
    trackedEvents().should('have.length', 3)
  })

  it('sends nothing when the clipboard write fails', () => {
    visitWithFullStory('/app/tooling/cypress-tap', { clipboardWorks: false })
    card('Fix a failing test')
      .find('button[aria-label="Copy prompt to clipboard"]')
      .click()

    // The fallback is the copy's last step, so by the time it has returned
    // false the component has already decided to send nothing.
    cy.get('@writeText').should('have.been.calledOnce')
    cy.get('@execCommand').should('have.been.calledOnceWith', 'copy')
    card('Fix a failing test').should('contain', 'Copy prompt')
    trackedEvents().should('deep.equal', [])
  })
})

describe('Fullstory page markdown events', () => {
  const pagePath = '/api/commands/blur'

  it('sends Page Markdown Copied once the copy lands', () => {
    visitWithFullStory(pagePath)
    cy.get('button[aria-label="Copy page as Markdown"]').click()

    cy.get('@write').should('have.been.calledOnce')
    cy.get('button[aria-label="Copy page as Markdown"]').should(
      'contain',
      'Copied'
    )
    trackedEvents().should('deep.equal', [
      { name: 'Page Markdown Copied', properties: { pagePath } },
    ])
  })

  it('sends Page Markdown Menu Opened when the menu opens', () => {
    visitWithFullStory(pagePath)
    cy.get('button[aria-label="More page formats"]').click()
    cy.get('button[aria-label="More page formats"]').should(
      'have.attr',
      'aria-expanded',
      'true'
    )
    trackedEvents().should('deep.equal', [
      { name: 'Page Markdown Menu Opened', properties: { pagePath } },
    ])
  })
})
