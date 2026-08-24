describe('Page markdown actions', () => {
  const PAGE = '/app/get-started/why-cypress'
  const MARKDOWN_PATH = `${PAGE}.md`
  const MARKDOWN = '# Why Cypress?\n\nCypress is a next generation testing tool.'
  const PROMPT_URL = `https://docs.cypress.io${MARKDOWN_PATH}`

  const control = () => cy.get('div[class*="markdownActions"]')
  const copyButton = () => cy.get('button[aria-label="Copy page as Markdown"]')
  const menuButton = () => cy.get('button[aria-label="More page formats"]')

  beforeEach(() => {
    // The `.md` files are emitted by the LLM export plugin during `npm run
    // build`, so they don't exist on the dev server these specs run against.
    // Serving them here keeps the spec about the control's behavior.
    cy.intercept('GET', MARKDOWN_PATH, {
      statusCode: 200,
      headers: { 'content-type': 'text/markdown' },
      body: MARKDOWN,
    }).as('markdown')
    cy.visit(PAGE)
  })

  it('sits beside the page title', () => {
    control().should('be.visible')
    copyButton().should('contain', 'Copy page')
    // The floated control and the <h1> share the top of the content column.
    control().then(($control) => {
      cy.get('h1').then(($heading) => {
        const controlTop = $control[0].getBoundingClientRect().top
        const headingBottom = $heading[0].getBoundingClientRect().bottom
        expect(controlTop).to.be.lessThan(headingBottom)
      })
    })
  })

  /** Stub the clipboard write the control actually uses, and alias it. */
  const stubClipboard = () =>
    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, 'write').as('write').resolves()
    })

  /** Read the text back out of the ClipboardItem handed to `write`. */
  const written = (callIndex = 0) =>
    cy
      .get('@write')
      .its(`args.${callIndex}.0.0`)
      .then((item: ClipboardItem) => item.getType('text/plain'))
      .then((blob: Blob) => blob.text())

  it('copies the page markdown to the clipboard', () => {
    stubClipboard()
    copyButton().click()
    cy.wait('@markdown')
    cy.contains('button', 'Copied').should('be.visible')
    cy.get('@write').should('have.been.calledOnce')
    written().should('equal', MARKDOWN)
  })

  it('writes within the click rather than after the fetch resolves', () => {
    // Regression guard: awaiting the fetch first would drop the click's
    // transient user activation, which Safari (and the execCommand fallback)
    // reject. The pending text goes to ClipboardItem instead, so the write is
    // issued while the response is still in flight.
    cy.intercept('GET', MARKDOWN_PATH, (req) =>
      req.reply({
        delay: 1500,
        statusCode: 200,
        headers: { 'content-type': 'text/markdown' },
        body: MARKDOWN,
      })
    ).as('slowMarkdown')
    stubClipboard()
    copyButton().click()
    // Well inside the response delay: a version that awaited the fetch would
    // not have called `write` yet.
    cy.get('@write', { timeout: 300 }).should('have.been.calledOnce')
    cy.wait('@slowMarkdown')
    written().should('equal', MARKDOWN)
  })

  it('resets the copied state after the timeout', () => {
    // Installed before the copy: the fetch and the clipboard write are
    // promise-based, so freezing timers here only holds the reset timeout.
    cy.clock()
    stubClipboard()
    copyButton().click()
    cy.wait('@markdown')
    cy.contains('button', 'Copied').should('be.visible')
    cy.tick(3000)
    cy.contains('button', 'Copy page').should('be.visible')
  })

  it('reports a failed copy instead of copying nothing', () => {
    cy.intercept('GET', MARKDOWN_PATH, { statusCode: 404, body: 'Not found' })
    cy.window().then((win) => {
      // A browser rejects the write when the data it was handed never arrives.
      cy.stub(win.navigator.clipboard, 'write')
        .as('write')
        .rejects(new Error('the pending item never resolved'))
      cy.stub(win.navigator.clipboard, 'writeText').as('writeText').resolves()
    })
    copyButton().click()
    cy.contains('button', 'Copy failed').should('be.visible')
    // Neither the ClipboardItem path nor the fallback put anything on the
    // clipboard — a 404 body must never be copied as if it were the page.
    cy.get('@writeText').should('not.have.been.called')
  })

  it('copies from the dropdown as well as the button', () => {
    stubClipboard()
    menuButton().click()
    cy.contains('[role="option"]', 'Copy page as Markdown').click()
    cy.wait('@markdown')
    written().should('equal', MARKDOWN)
    // Picking an action closes the popover.
    cy.get('[role="listbox"]').should('not.exist')
  })

  it('offers the raw markdown and the AI hand-offs', () => {
    cy.window().then((win) => {
      cy.stub(win, 'open').as('open')
    })
    menuButton().should('have.attr', 'aria-expanded', 'false').click()
    menuButton().should('have.attr', 'aria-expanded', 'true')

    cy.contains('[role="option"]', 'View as Markdown').click()
    cy.get('@open').should('have.been.calledWithMatch', MARKDOWN_PATH)

    menuButton().click()
    cy.contains('[role="option"]', 'Open in ChatGPT').click()
    cy.get('@open')
      .its('lastCall.args.0')
      .should('include', 'https://chatgpt.com/')
      .and('include', encodeURIComponent(PROMPT_URL))

    menuButton().click()
    cy.contains('[role="option"]', 'Open in Claude').click()
    cy.get('@open')
      .its('lastCall.args.0')
      .should('include', 'https://claude.ai/new')
      .and('include', encodeURIComponent(PROMPT_URL))
  })

  it('closes the dropdown on Escape', () => {
    menuButton().click()
    cy.get('[role="listbox"]').should('be.visible')
    cy.get('body').type('{esc}')
    cy.get('[role="listbox"]').should('not.exist')
  })
})
