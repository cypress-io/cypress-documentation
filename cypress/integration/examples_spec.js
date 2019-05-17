import YAML from 'yamljs'
import _ from 'lodash'
import { improveUrl } from '../support/repo'

const EXAMPLES_PATH = '/examples/examples/recipes'

describe('Examples', () => {
  beforeEach(() => {
    cy.server()
    cy.visit(`${EXAMPLES_PATH}.html`)
  })

  context('Main Menu', () =>
    it('goes straight to "Recipes"', () => {
      cy.visit('/')

      cy.contains('Examples')
      .click()
      cy.contains('h1', 'Recipes')

      cy.url()
      .should('include', EXAMPLES_PATH)
    })
  )

  context('Header', () =>
    it('should have link to edit doc', () => {
      cy.contains('a', 'Improve this doc').as('editLink')
      // cy.get('@editLink').should('have.attr', 'href')
      //     .and('include', GUIDES_PATH + '.md')
      cy.get('@editLink').should('have.attr', 'href')
      .and('include', improveUrl)
    })
  )

  context('Sidebar', () => {
    beforeEach(() => {
      cy.readFile('source/_data/sidebar.yml')
      .then(function (yamlString) {
        this.sidebar = YAML.parse(yamlString)
        this.sidebarTitles = _.keys(this.sidebar.examples)

        this.sidebarLinkNames = _.reduce(this.sidebar.examples, (memo, nestedObj) => memo.concat(_.keys(nestedObj))
          , [])

        this.sidebarLinks = _.reduce(this.sidebar.examples, (memo, nestedObj) => memo.concat(_.values(nestedObj))
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
      .should('have.attr', 'href')
      .and('include', `${EXAMPLES_PATH}.html`)
    )

    context('English', () => {
      it('displays English titles in sidebar', () =>
        cy.get('#sidebar')
        .find('.sidebar-title strong')
        .each(function (displayedTitle, i) {
          const englishTitle = this.english.sidebar.examples[this.sidebarTitles[i]]

          expect(displayedTitle.text()).to.eq(englishTitle)
        })
      )

      it('displays English link names in sidebar', () =>
        cy.get('#sidebar')
        .find('.sidebar-link').first()
        .each(function (displayedLink, i) {
          const englishLink = this.english.sidebar.examples[this.sidebarLinkNames[i]]

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
        cy.visit(`zh-cn${EXAMPLES_PATH}.html`)
      })

      it('displays titles in sidebar', () =>
        cy.get('#sidebar')
        .find('.sidebar-title strong')
        .each(function (displayedTitle, i) {
          const chineseTitle = this.chinese.sidebar.examples[this.sidebarTitles[i]]

          expect(displayedTitle.text()).to.eq(chineseTitle)
        })
      )

      it('displays link names in sidebar', () =>
        cy.get('#sidebar')
        .find('.sidebar-link').first()
        .each(function (displayedLink, i) {
          const chineseLink = this.chinese.sidebar.examples[this.sidebarLinkNames[i]]

          expect(displayedLink.text().trim()).to.eq(chineseLink)
        })
      )

      it('displays links in sidebar', () =>
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
            const englishLink = this.english.sidebar.examples[this.sidebarLinkNames[i]]

            expect(displayedLink.text().trim()).to.eq(englishLink)
          })
        })
      })

      describe('Chinese', () => {
        beforeEach(() => {
          cy.get('#mobile-lang-select').select('zh-cn').should('have.value', 'zh-cn')
          cy.url().should('contain', 'zh-cn')
          cy.visit(`zh-cn${EXAMPLES_PATH}.html`)
        })

        it('displays sidebar in mobile menu on click', () => {
          cy.get('.mobile-nav-link')
          .each(function (displayedLink, i) {
            const chineseLink = this.chinese.sidebar.examples[this.sidebarLinkNames[i]]

            expect(displayedLink.text().trim()).to.eq(chineseLink)
          })
        })
      })
    })
  })
})
