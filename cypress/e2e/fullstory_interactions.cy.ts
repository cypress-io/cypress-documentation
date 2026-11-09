// Fullstory events and labels for the controls Docusaurus renders: code block
// copy buttons, tabs, the announcement bar, and the sidebar's What's New, plus
// the Support Assistant. Without FULLSTORY_ORG_ID there's no snippet, so these
// tests provide window.FS themselves and read only its `trackEvent` calls
// (plugins/fullstory-client.js calls it too, with `setProperties`).
export {}

type TrackedEvent = { name: string; properties: Record<string, unknown> }

const trackedEvents = () =>
  cy.get<sinon.SinonStub>('@FS').then((FS) =>
    FS.getCalls()
      .filter((call) => call.args[0] === 'trackEvent')
      .map((call) => call.args[1] as TrackedEvent)
  )

const visitWithFS = (
  path: string,
  onBeforeLoad: (win: Cypress.AUTWindow) => void = () => {}
) =>
  cy.visit(path, {
    onBeforeLoad(win) {
      ;(win as any).FS = cy.stub().as('FS')
      onBeforeLoad(win)
    },
  })

// Long enough for an event that was going to follow a click to have arrived.
const settle = () => cy.wait(300)

describe('Fullstory Code Block Copied', () => {
  const pagePath = '/app/tooling/reporters'
  // The buttons only show on hover; the click is what's under test.
  const copy = (text: string) =>
    cy
      .contains('.theme-code-block', text)
      .find('button[title="Copy"]')
      .click({ force: true })

  it('sends the language, title, and page once the copy succeeds', () => {
    visitWithFS(pagePath, (win) => {
      cy.stub(win.navigator.clipboard, 'writeText').as('writeText').resolves()
    })
    copy('reporterEnabled')

    cy.get('@writeText').should('have.been.calledOnce')
    trackedEvents().should('deep.equal', [
      {
        name: 'Code Block Copied',
        properties: {
          language: 'json',
          codeTitle: 'reporter-config.json',
          pagePath,
        },
      },
    ])
  })

  it('sends an empty codeTitle for a block without a title', () => {
    visitWithFS(pagePath, (win) => {
      cy.stub(win.navigator.clipboard, 'writeText').resolves()
    })
    copy('> my-project')

    trackedEvents().should('deep.equal', [
      {
        name: 'Code Block Copied',
        properties: { language: 'txt', codeTitle: '', pagePath },
      },
    ])
  })

  it('sends nothing when the copy fails', () => {
    // Docusaurus leaves the clipboard error unhandled on purpose.
    cy.on('uncaught:exception', () => false)
    visitWithFS(pagePath, (win) => {
      cy.stub(win.navigator.clipboard, 'writeText')
        .as('writeText')
        .rejects(new DOMException('Denied', 'NotAllowedError'))
    })
    copy('reporterEnabled')

    cy.get('@writeText').should('have.been.calledOnce')
    settle()
    trackedEvents().should('deep.equal', [])
  })

  it('sends nothing for a second copy while the button still shows Copied', () => {
    cy.on('uncaught:exception', () => false)
    visitWithFS(pagePath, (win) => {
      const writeText = cy.stub(win.navigator.clipboard, 'writeText')
      writeText.as('writeText')
      writeText.onFirstCall().resolves()
      writeText
        .onSecondCall()
        .rejects(new DOMException('Denied', 'NotAllowedError'))
    })
    const button = () =>
      cy
        .contains('.theme-code-block', 'reporterEnabled')
        .find('button[title="Copy"]')

    button().click({ force: true })
    button().should('have.attr', 'aria-label', 'Copied')
    button().click({ force: true })
    cy.get('@writeText').should('have.been.calledTwice')

    // The first copy's label reverts after a second; that isn't a copy.
    button().should('not.have.attr', 'aria-label', 'Copied')
    settle()
    trackedEvents().should('deep.equal', [
      {
        name: 'Code Block Copied',
        properties: {
          language: 'json',
          codeTitle: 'reporter-config.json',
          pagePath,
        },
      },
    ])
  })
})

describe('Fullstory Tab Selected', () => {
  // Ten package-manager tab sets that share one groupId.
  const pagePath = '/app/tooling/reporters'
  const tabs = (value: string) =>
    cy.get(
      `[role="tab"][data-tab-group-id="package-manager"][data-tab-value="${value}"]`
    )
  const firstTab = (value: string) => tabs(value).first()

  beforeEach(() => {
    visitWithFS(pagePath, (win) => {
      win.localStorage.removeItem('docusaurus.tab.package-manager')
    })
  })

  it('sends nothing for the default tab', () => {
    tabs('npm').should('have.attr', 'aria-selected', 'true')
    settle()
    trackedEvents().should('deep.equal', [])
  })

  it('sends one event for a pick that switches every tab set in the group', () => {
    tabs('yarn').should('have.length.greaterThan', 1)
    firstTab('yarn').click()

    tabs('yarn').should(($tabs) => {
      expect($tabs.filter('[aria-selected="true"]')).to.have.length(
        $tabs.length
      )
    })
    trackedEvents().should('deep.equal', [
      {
        name: 'Tab Selected',
        properties: { groupId: 'package-manager', value: 'yarn' },
      },
    ])

    // The tab that's already selected isn't a pick.
    firstTab('yarn').click()
    settle()
    trackedEvents().should('have.length', 1)
  })

  it('sends an event for a pick made with Enter', () => {
    firstTab('pnpm').focus().type('{enter}')

    firstTab('pnpm').should('have.attr', 'aria-selected', 'true')
    trackedEvents().should('deep.equal', [
      {
        name: 'Tab Selected',
        properties: { groupId: 'package-manager', value: 'pnpm' },
      },
    ])
  })

  it('sends nothing for a tab restored from a saved choice', () => {
    firstTab('bun').click()
    trackedEvents().should('have.length', 1)

    // A fresh load with the choice saved in localStorage, and a fresh stub.
    visitWithFS(pagePath)
    tabs('bun').should(($tabs) => {
      expect($tabs.filter('[aria-selected="true"]')).to.have.length(
        $tabs.length
      )
    })
    settle()
    trackedEvents().should('deep.equal', [])
  })
})

describe('Fullstory Support Assistant events', () => {
  const EMBED_ORIGIN = 'https://www.cypress.io'
  const PAGE = '/app/get-started/why-cypress'
  const button = () => cy.get('[data-cy="support-assistant-button"]')
  const panel = () => cy.get('[data-cy="support-assistant"]')
  const opened = {
    name: 'Support Assistant Opened',
    properties: { entryPoint: 'Docs Button' },
  }

  const stubEmbed = (body: string) =>
    cy
      .intercept('GET', `${EMBED_ORIGIN}/ask/embed*`, {
        statusCode: 200,
        headers: { 'content-type': 'text/html' },
        body,
      })
      .as('embed')
  const READY_EMBED = `<!doctype html><html><body><script>
    parent.postMessage({ type: 'cypressgpt:ready' }, '*')
  </script></body></html>`
  const SILENT_EMBED = '<!doctype html><html><body></body></html>'

  it('sends Opened each time the reader opens it', () => {
    stubEmbed(READY_EMBED)
    visitWithFS(PAGE, (win) =>
      win.localStorage.removeItem('supportAssistant.isOpen')
    )

    button().click()
    panel().should('be.visible')
    trackedEvents().should('deep.equal', [opened])

    button().click()
    panel().should('not.be.visible')
    settle()
    trackedEvents().should('deep.equal', [opened])

    button().click()
    trackedEvents().should('deep.equal', [opened, opened])
  })

  it('sends nothing when it reopens on page load', () => {
    stubEmbed(READY_EMBED)
    visitWithFS(PAGE, (win) =>
      win.localStorage.setItem('supportAssistant.isOpen', 'true')
    )

    panel().should('be.visible')
    cy.wait('@embed')
    settle()
    trackedEvents().should('deep.equal', [])
  })

  it('sends Load Failed when the fallback link shows', () => {
    stubEmbed(SILENT_EMBED)
    visitWithFS(PAGE, (win) =>
      win.localStorage.removeItem('supportAssistant.isOpen')
    )
    cy.clock(Date.now(), ['setTimeout', 'clearTimeout'])

    button().click()
    cy.wait('@embed')
    cy.tick(8000)
    cy.get('[data-cy="support-assistant-fallback"]').should('be.visible')
    trackedEvents().should('deep.equal', [
      opened,
      { name: 'Support Assistant Load Failed', properties: {} },
    ])
  })
})

describe("Fullstory labels on What's New", () => {
  const LINK = 'Docs Sidebar - Whats New - Link'
  const links = () =>
    cy.get(`nav[aria-label="Docs sidebar"] a[data-fs-element="${LINK}"]`)

  it('labels the dismiss button', () => {
    visitWithFS('/app/tooling/reporters')
    cy.get('button[aria-label="Dismiss now available section"]')
      .should(
        'have.attr',
        'data-fs-element',
        'Docs Sidebar - Whats New - Dismiss'
      )
      .find('*')
      .each(($child) =>
        expect(getComputedStyle($child[0]).pointerEvents).to.eq('none')
      )
  })

  it('labels each link with its promo campaign', () => {
    visitWithFS('/cloud/get-started/introduction')
    links()
      .should('have.length.greaterThan', 0)
      .each(($link) => {
        const href = $link.attr('href') as string
        const campaign = new URL(
          href,
          'https://docs.cypress.io'
        ).searchParams.get('utm_campaign')
        expect(campaign, href).to.be.a('string').and.not.be.empty
        expect($link).to.have.attr('data-promo-campaign', campaign as string)
        expect(
          JSON.parse($link.attr('data-fs-properties-schema') as string)
        ).to.deep.include({ 'data-promo-campaign': 'str' })
        $link.find('*').each((_, child) => {
          expect(getComputedStyle(child).pointerEvents).to.eq('none')
        })
      })
  })

  it('leaves the campaign off a link without one', () => {
    visitWithFS('/app/tooling/reporters')
    links()
      .should('have.length.greaterThan', 0)
      .each(($link) => {
        expect($link.attr('href')).not.to.include('utm_campaign')
        expect($link).not.to.have.attr('data-promo-campaign')
      })
  })
})

describe('Fullstory labels on the announcement bar', () => {
  const bar = () => cy.get('.theme-announcement-bar')

  const expectLabeled = () =>
    bar()
      .find('a')
      .first()
      .should('have.attr', 'data-fs-element', 'Docs Announcement - Link')
      .invoke('attr', 'data-announcement-id')
      .then((id) => {
        expect(id).to.be.a('string').and.not.be.empty
        bar()
          .find('a')
          .first()
          .should(
            'have.attr',
            'data-fs-properties-schema',
            '{"data-announcement-id":"str"}'
          )
        // The close icon's <svg> and <path> carry the label too.
        bar()
          .find('button.close')
          .then(($close) => $close.find('*').addBack())
          .each(($element) => {
            expect($element).to.have.attr(
              'data-fs-element',
              'Docs Announcement - Close'
            )
            expect($element).to.have.attr('data-announcement-id', id as string)
          })
        return cy.wrap(id as string)
      })

  beforeEach(function () {
    visitWithFS('/api/commands/blur')
    cy.document().then((doc) => {
      if (!doc.querySelector('.theme-announcement-bar')) this.skip()
    })
  })

  it('labels the link and close button with the bar config id', () => {
    expectLabeled().then((id) => {
      bar().find('button.close').click()
      bar().should('not.exist')
      // Docusaurus saves the closed bar's config id.
      cy.window()
        .its('localStorage')
        .invoke('getItem', 'docusaurus.announcement.id')
        .should('eq', id)
    })
  })

  it('labels them again after a client-side navigation', () => {
    cy.get(
      'nav[aria-label="Docs sidebar"] a[href="/api/commands/check"]'
    ).click()
    cy.location('pathname').should('eq', '/api/commands/check')
    expectLabeled()
  })
})
