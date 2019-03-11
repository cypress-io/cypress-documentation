import YAML from 'yamljs'
import _ from 'lodash'
import { improveUrl } from '../support/repo'

const API_PATH = '/api/api/table-of-contents'
const API_HTML = `${API_PATH}.html`

const FIRST_PAGE = 'table-of-contents.html'
const NEXT_PAGE = 'catalog-of-events.html'
const PAGE = '/api/events/catalog-of-events.html'

describe('API', () => {
  context('Catalog of events', () => {
    beforeEach(() => {
      cy.visit(PAGE)
    })

    it('loads catalog of events', () =>
      cy.get('.article-title')
      .contains('Catalog of Events')
    )
  })

  context('Main Menu', () =>
    it('goes straight to "API" homepage', () => {
      cy.visit('/')

      cy.contains('API')
      .click()
      cy.contains('h1', 'Table of Contents')

      cy.url()
      .should('match', new RegExp(API_HTML))
    })
  )

  context('Header', () => {
    beforeEach(() => {
      cy.visit(`${API_PATH}.html`)
    })

    it('should have link to edit doc', () => {
      cy.contains('a', 'Improve this doc').as('editLink')

      // cy.get('@editLink').should('have.attr', 'href')
      //     .and('include', API_PATH + '.md')
      cy.get('@editLink')
      .should('have.attr', 'href')
      .and('include', improveUrl)
    })
  })

  context('Sidebar', () => {
    beforeEach(() => {
      cy.visit(`${API_PATH}.html`)

      cy.readFile('source/_data/sidebar.yml')
      .then(function (yamlString) {
        this.sidebar = YAML.parse(yamlString)
        this.sidebarTitles = _.keys(this.sidebar.api)

        this.sidebarLinkNames = _.reduce(this.sidebar.api, (memo, nestedObj) => memo.concat(_.keys(nestedObj))
          , [])

        this.sidebarLinks = _.reduce(this.sidebar.api, (memo, nestedObj) => memo.concat(_.values(nestedObj))
          , [])
      })

      cy.readFile('themes/cypress/languages/en.yml')
      .then(function (yamlString) {
        this.english = YAML.parse(yamlString)
      })
    })

    it('displays current page as highlighted', () =>
      cy.get('#sidebar').find('a.current')
      .should('have.attr', 'href').and('include', API_HTML)
    )

    it('displays English titles in sidebar', () =>
      cy.get('#sidebar')
      .find('.sidebar-title strong')
      .each(function (displayedTitle, i) {
        const englishTitle = this.english.sidebar.api[this.sidebarTitles[i]]

        expect(displayedTitle.text()).to.eq(englishTitle)
      })
    )

    it('displays English link names in sidebar', () =>
      cy.get('#sidebar')
      .find('.sidebar-link').first(5)
      .each(function (displayedLink, i) {
        const englishLink = this.english.sidebar.api[this.sidebarLinkNames[i]]

        expect(displayedLink.text().trim()).to.eq(englishLink)
      })
    )

    it('displays English links in sidebar', () =>
      cy.get('#sidebar')
      .find('.sidebar-link')
      .each(function (displayedLink, i) {
        const sidebarLink = this.sidebarLinks[i]

        expect(displayedLink.attr('href')).to.include(sidebarLink)
      })
    )

    context('mobile sidebar menu', () => {
      beforeEach(() => {
        cy.viewport('iphone-6')
      })

      it('displays sidebar in mobile menu on click', () => {
        cy.get('#mobile-nav-toggle').click()

        cy.get('#mobile-nav-inner').should('be.visible')
        .find('.sidebar-li')
        .each(function (displayedLink, i) {
          const englishLink = this.english.sidebar.api[this.sidebarLinkNames[i]]

          expect(displayedLink.text().trim()).to.eq(englishLink)
        })
      })
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

  context('Pagination', () => {
    beforeEach(() => {
      cy.visit(`${API_PATH}.html`)
    })

    it('does not display Prev link on first page', () => {
      cy.get('.article-footer-prev')
      .should('not.exist')
    })

    it('displays Next link', () => {
      cy.get('.article-footer-next')
      .should('have.attr', 'href')
      .and('include', NEXT_PAGE)
    })

    describe('click on Next page', () => {
      beforeEach(() => {
        cy.get('.article-footer-next').click()
        cy.url().should('contain', NEXT_PAGE)
      })

      it('should display Prev link', () => {
        cy.get('.article-footer-prev')
        .should('be.visible')
      })

      it('click on Prev link goeso back to original page', () => {
        cy.get('.article-footer-prev').click()
        cy.url().should('contain', FIRST_PAGE)
      })
    })
  })
})
