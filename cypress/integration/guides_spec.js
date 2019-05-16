import YAML from 'yamljs'
import _ from 'lodash'
import { improveUrl } from '../support/repo'

const GUIDES_PATH = '/guides/overview/why-cypress.html'

const FIRST_PAGE = 'why-cypress.html'
const NEXT_PAGE = 'key-differences.html'

describe('Guides', () => {
  context('Main Menu', () =>
    it('goes straight to "Why Cypress?"', () => {
      cy.visit('/')

      cy.contains('Guides')
      .click()
      cy.contains('h1', 'Why Cypress?')

      cy.url()
      .should('include', GUIDES_PATH)
    })
  )

  context('Header', () => {
    beforeEach(() => cy.visit(GUIDES_PATH))

    it('should have link to edit doc', () => {
      cy.contains('a', 'Improve this doc').as('editLink')
      // cy.get("@editLink").should("have.attr", "href")
      //     .and("include", GUIDES_PATH + ".md")
      cy.get('@editLink').should('have.attr', 'href')
      .and('include', improveUrl)
    })
  })

  context('Sidebar', () => {
    beforeEach(() => {
      cy.visit(GUIDES_PATH)

      cy.readFile('source/_data/sidebar.yml')
      .then(function (yamlString) {
        this.sidebar = YAML.parse(yamlString)
        this.sidebarTitles = _.keys(this.sidebar.guides)

        this.sidebarLinkNames = _.reduce(this.sidebar.guides, (memo, nestedObj) => memo.concat(_.keys(nestedObj))
          , [])

        this.sidebarLinks = _.reduce(this.sidebar.guides, (memo, nestedObj) => memo.concat(_.values(nestedObj))
          , [])
      })

      cy.readFile('themes/cypress/languages/en.yml')
      .then(function (yamlString) {
        this.english = YAML.parse(yamlString)
      })

      cy.readFile('themes/cypress/languages/zh-cn.yml')
      .then(function (yamlString) {
        this.chinese = YAML.parse(yamlString)
      })
    })

    it('displays current page as highlighted', () =>
      cy.get('#sidebar').find('a.current')
      .should('have.attr', 'href').and('include', FIRST_PAGE)
    )

    context('English', () => {
      it('displays English titles in sidebar', () =>
        cy.get('#sidebar')
        .find('.sidebar-title strong')
        .each(function (displayedTitle, i) {
          const englishTitle = this.english.sidebar.guides[this.sidebarTitles[i]]

          expect(displayedTitle.text()).to.eq(englishTitle)
        })
      )

      it('displays English link names in sidebar', () =>
        cy.get('#sidebar')
        .find('.sidebar-link').first()
        .each(function (displayedLink, i) {
          const englishLink = this.english.sidebar.guides[this.sidebarLinkNames[i]]

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
    })

    context('Chinese', () => {
      beforeEach(() => {
        cy.get('#lang-select').select('zh-cn').should('have.value', 'zh-cn')
        cy.url().should('contain', 'zh-cn')
        cy.visit(`zh-cn${GUIDES_PATH}`)
      })

      it('displays Chinese titles in sidebar', () =>
        cy.get('#sidebar')
        .find('.sidebar-title strong')
        .each(function (displayedTitle, i) {
          const chineseTitle = this.chinese.sidebar.guides[this.sidebarTitles[i]]

          expect(displayedTitle.text()).to.eq(chineseTitle)
        })
      )

      it('displays Chinese link names in sidebar', () =>
        cy.get('#sidebar')
        .find('.sidebar-link').first()
        .each(function (displayedLink, i) {
          const chineseLink = this.chinese.sidebar.guides[this.sidebarLinkNames[i]]

          expect(displayedLink.text().trim()).to.eq(chineseLink)
        })
      )

      it('displays Chinese links in sidebar', () =>
        cy.get('#sidebar')
        .find('.sidebar-link')
        .each(function (displayedLink, i) {
          const sidebarLink = this.sidebarLinks[i]

          expect(displayedLink.attr('href')).to.include(sidebarLink)
          expect(displayedLink.attr('href')).to.include('zh-cn')
        })
      )
    })

    context('mobile sidebar menu', () => {
      beforeEach(() => {
        cy.viewport('iphone-6')
        cy.get('#mobile-nav-toggle').click()
        cy.get('#mobile-nav-inner').should('be.visible')
      })

      describe('English', () => {
        it('displays sidebar in mobile menu on click', () => {
          cy.get('.mobile-nav-link')
          .each(function (displayedLink, i) {
            const englishLink = this.english.sidebar.guides[this.sidebarLinkNames[i]]

            expect(displayedLink.text().trim()).to.eq(englishLink)
          })
        })
      })

      describe('Chinese', () => {
        beforeEach(() => {
          cy.get('#mobile-lang-select').select('zh-cn').should('have.value', 'zh-cn')
          cy.url().should('contain', 'zh-cn')
          cy.visit(`zh-cn${GUIDES_PATH}`)
        })

        it('displays sidebar in mobile menu on click', () => {
          cy.get('.mobile-nav-link')
          .each(function (displayedLink, i) {
            const chineseLink = this.chinese.sidebar.guides[this.sidebarLinkNames[i]]

            expect(displayedLink.text().trim()).to.eq(chineseLink)
          })
        })
      })
    })
  })

  context('Table of Contents', function () {
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

  context('Pagination', () => {
    beforeEach(() => cy.visit(GUIDES_PATH))

    it('does not display Prev link on first page', () => {
      cy.get('.article-footer-prev').should('not.exist')
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
        cy.get('.article-footer-prev').should('be.visible')
      })

      it('clicking on Prev link should go back to original page', () => {
        cy.get('.article-footer-prev').click()

        cy.url().should('contain', FIRST_PAGE)
      })
    })
  })
})
