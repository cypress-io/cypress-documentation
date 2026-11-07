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
      win.FS = cy.stub().as('FS')
      for (const method of ['writeText', 'write'] as const) {
        const stub = cy.stub(win.navigator.clipboard, method).as(method)
        if (clipboardWorks) stub.resolves()
        else stub.rejects(new DOMException('Denied', 'NotAllowedError'))
      }
      if (!clipboardWorks) {
        // The fallback copy fails too.
        cy.stub(win.document, 'execCommand').as('execCommand').returns(false)
      }
    },
  })
}

const card = (title: string) => cy.contains('section', title)
const copyPrompt = (title: string) =>
  card(title).find('button[aria-label="Copy prompt to clipboard"]').click()

describe('Fullstory AI prompt events', () => {
  const pagePath = '/app/tooling/cypress-tap'
  const title = 'Fix a failing test'

  it('sends AI Prompt Copied for a card that is always open', () => {
    visitWithFullStory(pagePath)
    copyPrompt(title)

    cy.get('@writeText').should(
      'have.been.calledOnceWith',
      'The [test name] test in [spec path] is failing. Use cypress tap to run it, read the failure, find the cause, fix it, and rerun it until it passes.'
    )
    card(title).should('contain', 'Copied')
    trackedEvents().should('deep.equal', [
      {
        name: 'AI Prompt Copied',
        properties: { promptTitle: title, pagePath, promptWasVisible: true },
      },
    ])
  })

  it('records whether a collapsed card was open, and expanding it', () => {
    const title = 'Plan tickets from the latest report'
    const pagePath = '/accessibility/work-with-ai-agents'
    const copied = (promptWasVisible: boolean) => ({
      name: 'AI Prompt Copied',
      properties: { promptTitle: title, pagePath, promptWasVisible },
    })
    const expanded = {
      name: 'AI Prompt Expanded',
      properties: { promptTitle: title, pagePath },
    }
    visitWithFullStory(pagePath)

    copyPrompt(title)
    card(title).should('contain', 'Copied')
    trackedEvents().should('deep.equal', [copied(false)])

    card(title).contains('button', 'Show prompt').click()
    card(title).contains('button', 'Hide prompt')
    trackedEvents().should('deep.equal', [copied(false), expanded])

    copyPrompt(title)
    cy.get('@writeText').should('have.been.calledTwice')
    trackedEvents().should('deep.equal', [
      copied(false),
      expanded,
      copied(true),
    ])

    // Collapsing again sends nothing.
    card(title).contains('button', 'Hide prompt').click()
    card(title).contains('button', 'Show prompt')
    trackedEvents().should('deep.equal', [
      copied(false),
      expanded,
      copied(true),
    ])
  })

  it('sends nothing when the clipboard write fails', () => {
    visitWithFullStory(pagePath, { clipboardWorks: false })
    copyPrompt(title)

    // The fallback is the copy's last step, so by the time it has returned
    // false the component has already decided to send nothing.
    cy.get('@writeText').should('have.been.calledOnce')
    cy.get('@execCommand').should('have.been.calledOnceWith', 'copy')
    card(title).should('contain', 'Copy prompt')
    trackedEvents().should('deep.equal', [])
  })
})

describe('Fullstory page markdown events', () => {
  const pagePath = '/api/commands/blur'
  const copyButton = 'button[aria-label="Copy page as Markdown"]'
  const menuButton = 'button[aria-label="More page formats"]'

  it('sends Page Markdown Copied once the copy lands', () => {
    visitWithFullStory(pagePath)
    cy.get(copyButton).click()

    cy.get('@write').should('have.been.calledOnce')
    cy.get(copyButton).should('contain', 'Copied')
    trackedEvents().should('deep.equal', [
      { name: 'Page Markdown Copied', properties: { pagePath } },
    ])
  })

  it('sends Page Markdown Menu Opened when the menu opens', () => {
    visitWithFullStory(pagePath)
    cy.get(menuButton).click()

    cy.get(menuButton).should('have.attr', 'aria-expanded', 'true')
    trackedEvents().should('deep.equal', [
      { name: 'Page Markdown Menu Opened', properties: { pagePath } },
    ])
  })
})
