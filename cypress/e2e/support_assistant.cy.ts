describe('Support Assistant', () => {
  const EMBED_ORIGIN = 'https://www.cypress.io'
  const PAGE = '/app/get-started/why-cypress'
  const NEXT_PAGE = '/api/table-of-contents'

  // Stands in for www.cypress.io/ask/embed: announces itself like the real
  // embed, echoes every message it receives back as `stub:received`, and asks
  // to close when told `stub:close`.
  const EMBED_STUB = `<!doctype html><html><body><script>
    const send = (data) => parent.postMessage(data, '*')
    addEventListener('message', (event) => {
      if (event.data?.type === 'stub:close') send({ type: 'cypressgpt:close' })
      else send({ type: 'stub:received', data: event.data, origin: event.origin })
    })
    send({ type: 'cypressgpt:ready' })
  </script></body></html>`

  const button = () => cy.get('[data-cy="support-assistant-button"]')
  const panel = () => cy.get('[data-cy="support-assistant"]')
  const frame = () => cy.get('[data-cy="support-assistant-frame"]')

  let received: { type?: string; url?: string }[]

  beforeEach(() => {
    received = []
    cy.intercept('GET', `${EMBED_ORIGIN}/ask/embed*`, {
      statusCode: 200,
      headers: { 'content-type': 'text/html' },
      body: EMBED_STUB,
    }).as('embed')
    cy.visit(PAGE, {
      onBeforeLoad(win) {
        win.localStorage.removeItem('supportAssistant.isOpen')
        win.addEventListener('message', (event) => {
          if (event.data?.type === 'stub:received')
            received.push(event.data.data)
        })
      },
    })
  })

  it('sits in the navbar and loads nothing until opened', () => {
    button()
      .should('be.visible')
      .and('contain', 'Ask AI')
      .and('have.attr', 'aria-expanded', 'false')
    panel().should('not.exist')
  })

  it('opens the embed for the page the reader is on', () => {
    button().click()
    button().should('have.attr', 'aria-expanded', 'true')
    panel().should('be.visible')
    frame()
      .should('have.attr', 'src')
      .and(
        'eq',
        `${EMBED_ORIGIN}/ask/embed?page=${encodeURIComponent(
          `https://docs.cypress.io${PAGE}`
        )}`
      )
    cy.wait('@embed')
    cy.wrap(received).should('deep.include', {
      type: 'cypressgpt:page',
      url: `https://docs.cypress.io${PAGE}`,
    })
    cy.wrap(received).should('deep.include', { type: 'cypressgpt:focus' })
  })

  it('follows client-side navigation without reloading the frame', () => {
    button().click()
    cy.wait('@embed')
    frame().then(($frame) => {
      cy.get(`.navbar a[href="${NEXT_PAGE}"]`).first().click()
      cy.location('pathname').should('eq', NEXT_PAGE)
      cy.wrap(received).should('deep.include', {
        type: 'cypressgpt:page',
        url: `https://docs.cypress.io${NEXT_PAGE}`,
      })
      frame().should(($current) => expect($current[0]).to.equal($frame[0]))
    })
    cy.get('@embed.all').should('have.length', 1)
  })

  it('closes on Escape and returns focus to the button', () => {
    button().click()
    panel().should('be.visible')
    button().focus().type('{esc}')
    panel().should('not.be.visible')
    button().should('have.attr', 'aria-expanded', 'false').and('have.focus')
  })

  it('stays open when Escape is meant for something else on the page', () => {
    button().click()
    panel().should('be.visible')
    cy.get('h1')
      .first()
      .then(($h1) => {
        $h1.attr('tabindex', '-1')
        $h1[0].focus()
      })
    cy.focused().type('{esc}')
    panel().should('be.visible')
  })

  it('moves focus into the panel when it is reopened', () => {
    button().click()
    cy.wait('@embed')
    frame().should('have.focus')
    button().click()
    button().should('have.focus')
    button().click()
    frame().should('have.focus')
  })

  it('closes when the embed asks it to', () => {
    button().click()
    cy.wait('@embed')
    // The stub listens once it has announced itself, which the panel answers with focus.
    cy.wrap(received).should('deep.include', { type: 'cypressgpt:focus' })
    frame().then(($frame) => {
      const embed = ($frame[0] as HTMLIFrameElement).contentWindow
      embed?.postMessage({ type: 'stub:close' }, '*')
    })
    panel().should('not.be.visible')
    button().should('have.focus')
  })

  it('ignores close requests from anywhere but the embed', () => {
    button().click()
    cy.wait('@embed')
    cy.window().then((win) =>
      win.postMessage({ type: 'cypressgpt:close' }, '*')
    )
    panel().should('be.visible')
  })

  describe('when the embed cannot load', () => {
    const fallback = () => cy.get('[data-cy="support-assistant-fallback"]')

    it('offers cypress.io once the embed has had time to announce itself', () => {
      // A frame the browser refuses, such as on a host outside the embed's frame-ancestors, never announces itself.
      cy.intercept('GET', `${EMBED_ORIGIN}/ask/embed*`, {
        statusCode: 200,
        headers: { 'content-type': 'text/html' },
        body: '<!doctype html><html><body></body></html>',
      }).as('silentEmbed')
      cy.clock(Date.now(), ['setTimeout', 'clearTimeout'])
      button().click()
      cy.wait('@silentEmbed')
      cy.tick(7999)
      fallback().should('not.exist')
      cy.tick(1)
      fallback()
        .should('be.visible')
        .and('contain', "The Support Assistant couldn't load on this page.")
      fallback()
        .contains('a', 'Open the Support Assistant on cypress.io')
        .should('have.attr', 'target', '_blank')
        .and('have.attr', 'rel', 'noopener noreferrer')
        .and('have.attr', 'href')
        .then((href) => {
          const url = new URL(href as unknown as string)
          expect(url.origin + url.pathname).to.eq(`${EMBED_ORIGIN}/ask`)
          expect(Object.fromEntries(url.searchParams)).to.deep.eq({
            utm_source: 'docs.cypress.io',
            utm_medium: 'support-assistant',
            utm_content: 'embed-fallback',
          })
        })
    })

    it('keeps the fallback in the panel the reader can still close', () => {
      cy.intercept('GET', `${EMBED_ORIGIN}/ask/embed*`, {
        statusCode: 200,
        headers: { 'content-type': 'text/html' },
        body: '<!doctype html><html><body></body></html>',
      })
      cy.clock(Date.now(), ['setTimeout', 'clearTimeout'])
      button().click()
      cy.tick(8000)
      fallback().should('be.visible')
      button().click()
      panel().should('not.be.visible')
      button().click()
      fallback().should('be.visible')
    })

    it('does not show once the embed loads', () => {
      cy.clock(Date.now(), ['setTimeout', 'clearTimeout'])
      button().click()
      cy.wait('@embed')
      cy.wrap(received).should('deep.include', { type: 'cypressgpt:focus' })
      cy.tick(8000)
      fallback().should('not.exist')
    })
  })

  it('stays open across a reload', () => {
    button().click()
    panel().should('be.visible')
    cy.reload()
    panel().should('be.visible')
    button().should('have.attr', 'aria-expanded', 'true')
    cy.wait('@embed')
    // Reopening on load must not pull focus away from the page.
    frame().should('not.have.focus')
  })
})
