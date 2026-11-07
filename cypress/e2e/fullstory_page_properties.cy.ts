// plugins/fullstory-client.js is registered in every production build, but
// without FULLSTORY_ORG_ID there's no snippet, so these tests provide window.FS
// themselves and read the calls the module makes to it.
const visitWithFS = (
  path: string,
  options: Partial<Cypress.VisitOptions> = {}
) =>
  cy.visit(path, {
    ...options,
    onBeforeLoad(win) {
      ;(win as any).FS = cy.stub().as('FS')
    },
  })

describe('Fullstory page properties', () => {
  const pageCall = (properties: Record<string, string>) => [
    'setProperties',
    { type: 'page', properties },
  ]

  // Two frames for the module's wait before it reads the title, plus one.
  const waitFrames = () =>
    cy
      .window()
      .then(
        (win) =>
          new Cypress.Promise<void>((resolve) =>
            win.requestAnimationFrame(() =>
              win.requestAnimationFrame(() =>
                win.requestAnimationFrame(() => resolve())
              )
            )
          )
      )

  beforeEach(() => {
    visitWithFS('/api/commands/blur')
  })

  it('sends the section and title on first load', () => {
    cy.get('@FS').should('have.been.calledOnce')
    cy.get('@FS').should(
      'have.been.calledWithExactly',
      ...pageCall({
        pageName: 'API: cy.blur()',
        section: 'api',
        docTitle: 'cy.blur()',
        pageType: 'docs',
        product: 'app',
      })
    )
  })

  it('sends the new page after a sidebar link, not the previous one', () => {
    cy.get('@FS').should('have.been.calledOnce')
    cy.get(
      'nav[aria-label="Docs sidebar"] a[href="/api/commands/check"]'
    ).click()
    cy.location('pathname').should('eq', '/api/commands/check')

    cy.get('@FS').should('have.been.calledTwice')
    cy.get('@FS')
      .its('secondCall.args')
      .should(
        'deep.equal',
        pageCall({
          pageName: 'API: cy.check()',
          section: 'api',
          docTitle: 'cy.check()',
          pageType: 'docs',
          product: 'app',
        })
      )
  })

  it('sends nothing for a hash-only change', () => {
    cy.get('@FS').should('have.been.calledOnce')
    cy.get('.table-of-contents a[href="#Syntax"]').click()
    cy.location('hash').should('eq', '#Syntax')

    waitFrames()
    cy.get('@FS').should('have.been.calledOnce')
  })
})

describe('Fullstory page names for a title two sections share', () => {
  const docTitle = 'profiles: apply config overrides by run tag'

  ;[
    {
      path: '/accessibility/configuration/profiles',
      section: 'accessibility',
      pageName: `Cypress Accessibility: ${docTitle}`,
      product: 'accessibility',
    },
    {
      path: '/ui-coverage/configuration/profiles',
      section: 'ui-coverage',
      pageName: `UI Coverage: ${docTitle}`,
      product: 'ui-coverage',
    },
  ].forEach(({ path, section, pageName, product }) => {
    it(`names the ${section} page after its section`, () => {
      visitWithFS(path)
      cy.get('@FS').should('have.been.calledOnceWithExactly', 'setProperties', {
        type: 'page',
        properties: { pageName, section, docTitle, pageType: 'docs', product },
      })
    })
  })
})

// www.cypress.io sends pageType and product with the same values, so one
// Fullstory funnel can follow a reader across both sites. The API page case is
// the first describe block's.
describe('Fullstory pageType and product', () => {
  ;[
    {
      path: '/app/ai/overview',
      properties: {
        pageName:
          'Cypress App: AI in Cypress: test generation, agent skills, and agentic debugging',
        section: 'app',
        docTitle:
          'AI in Cypress: test generation, agent skills, and agentic debugging',
        pageType: 'docs',
        product: 'ai',
      },
    },
    // Two docs/app/ai/ pages that publish outside /app/ai, so product follows
    // the source folder rather than the URL.
    {
      path: '/app/guides/cypress-studio',
      properties: {
        pageName: 'Cypress App: Cypress Studio AI',
        section: 'app',
        docTitle: 'Cypress Studio AI',
        pageType: 'docs',
        product: 'ai',
      },
    },
    {
      path: '/app/tooling/cypress-tap',
      properties: {
        pageName: 'Cypress App: Drive Cypress with AI agents using cypress tap',
        section: 'app',
        docTitle: 'Drive Cypress with AI agents using cypress tap',
        pageType: 'docs',
        product: 'ai',
      },
    },
    {
      path: '/cloud/get-started/introduction',
      properties: {
        pageName: 'Cypress Cloud: Introduction to Cypress Cloud',
        section: 'cloud',
        docTitle: 'Introduction to Cypress Cloud',
        pageType: 'docs',
        product: 'cloud',
      },
    },
  ].forEach(({ path, properties }) => {
    it(`sends product ${properties.product} for ${path}`, () => {
      visitWithFS(path)
      cy.get('@FS').should('have.been.calledOnceWithExactly', 'setProperties', {
        type: 'page',
        properties,
      })
    })
  })

  it('sends pageType and no product for a page that is not a doc', () => {
    visitWithFS('/not-a-docs-page', { failOnStatusCode: false })
    cy.get('@FS').should('have.been.calledOnce')
    cy.get('@FS')
      .its('firstCall.args.1.properties')
      .should('include', { pageType: 'docs', section: 'not-a-docs-page' })
      .and('not.have.property', 'product')
  })
})
