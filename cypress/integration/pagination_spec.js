context('Pagination', () => {
  it('does not display Prev link on first page', function () {
    cy.wrap(this.MAIN_NAV).each(function (nav) {
      let path = `${nav.path}.html`

      if (nav.path === '/plugins/') {
        path = `${nav.path}index.html`
      }

      cy.visit(path)
      cy.get('.article-footer-prev').should('not.exist')
    })
  })

  it('displays Next link', function () {
    cy.wrap(this.MAIN_NAV).each(function (nav) {
      if (nav.nextPage) {
        let path = `${nav.path}.html`

        if (nav.path === '/plugins/') {
          path = `${nav.path}index.html`
        }

        cy.visit(path).then(() => {
          cy.get('.article-footer-next')
          .should('have.attr', 'href')
          .and('include', nav.nextPage)
        })
      }
    })
  })

  it('clicking on Next and Prev link changes url', function () {
    cy.wrap(this.MAIN_NAV).each(function (nav) {
      if (nav.nextPage && nav.firstPage) {
        let path = `${nav.path}.html`

        if (nav.path === '/plugins/') {
          path = `${nav.path}index.html`
        }

        cy.visit(path).then(() => {
          cy.get('.article-footer-next').click()

          cy.url().should('contain', nav.nextPage)
          cy.get('.article-footer-prev').click()

          cy.url().should('contain', nav.firstPage)
        })
      }
    })
  })
})
