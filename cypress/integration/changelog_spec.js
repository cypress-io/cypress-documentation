describe('Changelog', () => {
  beforeEach(() => {
    cy.visit('/guides/references/changelog.html')
  })

  // check if rendering messed up and removed the sidebar
  it('has navigation sidebar', () => {
    return cy.get('aside#sidebar')
    .should('be.visible')
  })

  if (Cypress.isDevelopment()) {
    it('has a truncated table of contents', () => {
      cy.get('aside#article-toc')
      .should('be.visible')
      .get('.toc-item')
      .should('have.length', 6) //# including truncation warning

      cy.url()
      .should('match', /.+#\d+-\d+-\d+/)
    })
  } else {
    it('has a populated table of contents', () => {
      cy.get('aside#article-toc')
      .contains('0.19.0', { timeout: 10000 })
      .click()

      cy.url()
      .should('include', '#0-19-0')
    })
  }
})
