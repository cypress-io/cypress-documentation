import { skipOn } from '@cypress/skip-test'
import { MAIN_NAV } from '../support/defaults'

context('Pagination', () => {
  MAIN_NAV.forEach((nav) => {
    it(`does not display Prev link on first page of ${nav.name}`, function () {
      let path = `${nav.path}.html`

      if (nav.path === '/plugins/') {
        path = `${nav.path}index.html`
      }

      cy.visit(path)
      cy.get('.article-footer-prev').should('not.exist')
    })
  })

  MAIN_NAV.forEach((nav) => {
    it(`displays Next link in ${nav.name}`, function () {
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

  // Firefox seems to stumble sometimes on loading the second page in this test
  skipOn('firefox', () => {
    MAIN_NAV.forEach((nav) => {
      it(`clicking on Next and Prev link changes url in ${nav.name}`, function () {
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
})
