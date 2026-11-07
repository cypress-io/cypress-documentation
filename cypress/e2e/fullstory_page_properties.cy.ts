// plugins/fullstory-client.js is registered in every production build, but
// without FULLSTORY_ORG_ID there's no snippet, so these tests provide window.FS
// themselves and read the calls the module makes to it.
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
    cy.visit('/api/commands/blur', {
      onBeforeLoad(win) {
        ;(win as any).FS = cy.stub().as('FS')
      },
    })
  })

  it('sends the section and title on first load', () => {
    cy.get('@FS').should('have.been.calledOnce')
    cy.get('@FS').should(
      'have.been.calledWithExactly',
      ...pageCall({ pageName: 'API', section: 'api', docTitle: 'cy.blur()' })
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
        pageCall({ pageName: 'API', section: 'api', docTitle: 'cy.check()' })
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
