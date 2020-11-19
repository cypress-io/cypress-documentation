const API_PATH = '/api/api/table-of-contents'

describe('API', () => {
  context('Catalog of events', () => {
    beforeEach(() => {
      cy.visit('/api/events/catalog-of-events.html')
    })

    it('loads catalog of events', () => {
      return cy.get('.article-title')
      .contains('Catalog of Events')
    })
  })

  context('Table of Contents', () => {
    beforeEach(() => {
      cy.visit(`${API_PATH}.html`)
    })

    it('displays toc', function () {
      //# skip running this test if we are in interactive mode
      if (Cypress.config('isInteractive')) {
        this.skip()
      }

      cy.get('.sidebar-link')
      .each((linkElement) => {
        cy.task('log', `Requesting ${linkElement[0].innerText}`)
        cy.request(linkElement[0].href).then((response) => {
          const body = response.body
          const $body = Cypress.$(body)

          const $h1s = $body.find('.article h1').not('.article-title')
          const $h2s = $body.find('.article h2')

          const $h1links = $body.find('.toc-level-1>.toc-link')
          const $h2links = $body.find('.toc-level-2>.toc-link')

          if ($h1links.length) {
            $h1s.each((i, el) => {
              const $h1 = Cypress.$(el)
              const $link = $h1links.eq(i)

              expect($link.text()).to.eq($h1.text())

              expect($link.attr('href')).to.eq(`#${$h1.attr('id')}`)
            })
          }

          if ($h2links.length) {
            $h2s.each((i, el) => {
              const $h2 = Cypress.$(el)
              const $link = $h2links.eq(i)

              expect($link.text()).to.eq($h2.text())

              expect($link.attr('href')).to.eq(`#${$h2.attr('id')}`)
            })
          }
        })
      })
    })
  })
})
