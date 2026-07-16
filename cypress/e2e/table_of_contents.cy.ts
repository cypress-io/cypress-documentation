describe('Table of Contents active highlight', () => {
  // Regression test for the right-hand "Contents" panel highlighting the wrong
  // entry when a short trailing section is clicked.
  // @see https://github.com/cypress-io/cypress-documentation/issues/6074
  const activeLink = '.table-of-contents .table-of-contents__link--active'

  // Pages whose final "See also" section is short enough to sit at the very
  // bottom of the page, which is what triggered the original bug.
  const pages = [
    '/api/commands/window',
    '/api/commands/as',
  ]

  pages.forEach((page) => {
    it(`highlights "See also" when its anchor is clicked on ${page}`, () => {
      cy.visit(page)
      cy.get('.table-of-contents__link')
        .contains('See also')
        .click()
      cy.url().should('include', '#See-also')
      cy.get(activeLink).should('have.length', 1).and('contain', 'See also')
    })
  })
})
