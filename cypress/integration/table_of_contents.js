const FAQ_PATH = '/faq/questions/using-cypress-faq'
const GUIDES_PATH = '/guides/overview/why-cypress.html'
const API_PATH = '/api/api/table-of-contents'

describe('Table of Contents', () => {
  beforeEach(function () {
    //# skip running this test if we are in interactive mode
    if (Cypress.config('isInteractive')) {
      this.skip()
    }

    cy.server()
  })

  context('API', () => {
    beforeEach(() => {
      cy.visit(`${API_PATH}.html`)
    })

    it('displays toc', function () {
      cy.get('.sidebar-link')
      .each((linkElement) => {
        cy.log(linkElement[0].innerText)

        cy.request(linkElement[0].href).its('body')
        .then((body) => {
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

  context('FAQ', () => {
    beforeEach(() => {
      cy.visit(`${FAQ_PATH}.html`)
    })

    it('displays toc links', () => {
      cy.get('.toc-level-2>.toc-link').as('tocLinks')

      cy.get('.faq h2').not('.article-title').each(($h2, i) => {
        cy.get('@tocLinks').eq(i).then(($link) => {
          expect($link.text()).to.eq($h2.text())

          expect($link.attr('href')).to.eq(`#${$h2.attr('id')}`)
        })
      })
    })
  })

  context('Guides', function () {
    before(() => {
      cy.visit(GUIDES_PATH)
    })

    it('displays toc', () =>
      cy.get('.sidebar-link')
      .each(function (linkElement) {
        cy.log(linkElement[0].innerText)
        cy.request(linkElement[0].href).its('body')
        .then(function (body) {
          const $body = Cypress.$(body)

          const $h1s = $body.find('.article h1').not('.article-title')
          const $h2s = $body.find('.article h2')

          const $h1links = $body.find('.toc-level-1>.toc-link')
          const $h2links = $body.find('.toc-level-2>.toc-link')

          $h1s.each(function (i, el) {
            const $h1 = Cypress.$(el)
            const $link = $h1links.eq(i)

            expect($link.text()).to.eq($h1.text())
            expect($link.attr('href')).to.eq(`#${$h1.attr('id')}`)
          })

          $h2s.each(function (i, el) {
            const $h2 = Cypress.$(el)
            const $link = $h2links.eq(i)

            expect($link.text()).to.eq($h2.text())
            expect($link.attr('href')).to.eq(`#${$h2.attr('id')}`)
          })
        })
      })
    )
  })
})

