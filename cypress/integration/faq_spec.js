import YAML from 'yamljs'
import _ from 'lodash'

const FAQ_PATH = '/faq/questions/using-cypress-faq'

describe('FAQ', () => {
  beforeEach(() => {
    cy.server()

    cy.visit(`${FAQ_PATH}.html`)
  })

  context('Main Menu', () =>
    it('goes straight to "Using Cypress"', () => {
      cy.visit('/')

      cy.contains('FAQ')
      .click()
      cy.contains('h1', 'Using Cypress')

      cy.url()
      .should('include', FAQ_PATH)
    })
  )

  context('Sidebar', () => {
    beforeEach(() => {
      cy.readFile('source/_data/sidebar.yml')
      .then(function (yamlString) {
        this.sidebar = YAML.parse(yamlString)
        this.sidebarTitles = _.keys(this.sidebar.faq)

        this.sidebarLinkNames = _.reduce(this.sidebar.faq, (memo, nestedObj) => memo.concat(_.keys(nestedObj))
          , [])

        return this.sidebarLinks = _.reduce(this.sidebar.faq, (memo, nestedObj) => memo.concat(_.values(nestedObj))
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
      .should('have.attr', 'href').and('include', `${FAQ_PATH}.html`)
    )


    context('English', () => {
      it('displays English titles in sidebar', () =>
        cy.get('#sidebar')
        .find('.sidebar-title strong').each(function (displayedTitle, i) {
          const englishTitle = this.english.sidebar.faq[this.sidebarTitles[i]]

          expect(displayedTitle.text()).to.eq(englishTitle)
        })
      )

      it('displays English link names in sidebar', () =>
        cy.get('#sidebar')
        .find('.sidebar-link')
        .each(function (displayedLink, i) {
          const englishLink = this.english.sidebar.faq[this.sidebarLinkNames[i]]

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
        cy.visit(`zh-cn${FAQ_PATH}.html`)
      })

      it('displays titles in sidebar', () =>
        cy.get('#sidebar')
        .find('.sidebar-title strong').each(function (displayedTitle, i) {
          const chineseTitle = this.chinese.sidebar.faq[this.sidebarTitles[i]]

          expect(displayedTitle.text()).to.eq(chineseTitle)
        })
      )

      it('displays link names in sidebar', () =>
        cy.get('#sidebar')
        .find('.sidebar-link')
        .each(function (displayedLink, i) {
          const chineseLink = this.chinese.sidebar.faq[this.sidebarLinkNames[i]]

          expect(displayedLink.text().trim()).to.eq(chineseLink)
        })
      )

      it('displays links in sidebar', () =>
        cy.get('#sidebar')
        .find('.sidebar-link')
        .each(function (displayedLink, i) {
          const sidebarLink = this.sidebarLinks[i]

          expect(displayedLink.attr('href')).to.include(sidebarLink)
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
            const englishLink = this.english.sidebar.faq[this.sidebarLinkNames[i]]

            expect(displayedLink.text().trim()).to.eq(englishLink)
          })
        })
      })

      describe('Chinese', () => {
        beforeEach(() => {
          cy.get('#mobile-lang-select').select('zh-cn').should('have.value', 'zh-cn')
          cy.url().should('contain', 'zh-cn')
          cy.visit(`zh-cn${FAQ_PATH}.html`)
        })

        it('displays sidebar in mobile menu on click', () => {
          cy.get('.mobile-nav-link')
          .each(function (displayedLink, i) {
            const chineseLink = this.chinese.sidebar.faq[this.sidebarLinkNames[i]]

            expect(displayedLink.text().trim()).to.eq(chineseLink)
          })
        })
      })
    })
  })

  context('Table of Contents', () =>
    it('displays toc links', () => {
      cy.get('.toc-level-2>.toc-link').as('tocLinks')

      cy.get('.faq h2').not('.article-title').each(($h2, i) => {
        cy.get('@tocLinks').eq(i).then(($link) => {
          expect($link.text()).to.eq($h2.text())

          expect($link.attr('href')).to.eq(`#${$h2.attr('id')}`)
        })
      })
    })
  )
})
