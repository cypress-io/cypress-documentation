describe('Page Header', () => {
  beforeEach(() => {
    cy.server()
  })

  it('should have link to edit doc', function () {
    cy.wrap(this.MAIN_NAV).each((nav) => {
      let path = `${nav.path}.html`
      let mdPath = `${nav.path}.md`

      if (nav.path === '/plugins/') {
        path = `${nav.path}index.html`
        mdPath = `${nav.path}index.md`
      }

      cy.visit(path)
      cy.contains('a', 'Improve this doc').as('editLink')
      .should('have.attr', 'href')
      .and('include', mdPath)
      .and('include', this.improveUrl)
    })
  })
})
