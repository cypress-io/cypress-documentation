// loads Cypress types and any of our custom commands
/// <reference path="../support/index.d.ts" />
// @ts-check

const GUIDES_PATH = '/guides/overview/why-cypress.html'

describe('Main', () => {
  beforeEach(() => {
    cy.server()
  })

  context('CSS', () => {
    beforeEach(() => {
      cy.visit('/')

      // wait for the page redirect and load
      cy.url().should('contain', 'why-cypress')
    })

    // only works in development environment where each CSS
    // file is separate
    if (Cypress.isDevelopment()) {
      it('loads roboto', () => {
        cy.request('/fonts/vendor/roboto-fontface/css/roboto/roboto-fontface.css')
      })
    }

    it('has limited container height', () => {
      return cy.get('#container')
      .then((el) => {
        const elHeight = getComputedStyle(el[0]).height
        const viewportHeight = Cypress.config('viewportHeight')

        expect(elHeight).to.equal(`${viewportHeight}px`)
      })
    })

    it('has app CSS style rules', () => {
      const isAppStyle = (ruleList) => {
        return ruleList.href.includes('/cypress.css') || // local separate CSS files
        ruleList.href.includes('/style')
      } // single bundle in production

      cy.document()
      .then(function (doc) {
        const appRules = Cypress._.find(doc.styleSheets, isAppStyle)

        expect(appRules, 'app rules are loaded').to.not.be.undefined
        cy.log('found App style rules')

        const containerRules = Cypress._.find(appRules.rules, { selectorText: '#container' })

        expect(containerRules, 'has #container CSS').to.not.be.undefined

        cy.log('found CSS rules for', containerRules.selectorText)
      })
    })
  })

  context('Pages', () => {
    describe('404', () => {
      return it('displays', () => {
        cy.visit('/404.html')

        cy.contains('404')
      })
    })

    describe('Root routes to main guides', () => {
      beforeEach(() => {
        cy.visit('/')
      })

      it('displays', () => {
        cy.url().should('include', GUIDES_PATH)
      })
    })
  })

  describe('Intro to Cypress', () => {
    beforeEach(() => {
      cy.visit('/guides/core-concepts/introduction-to-cypress.html')
    })

    // check if rendering messed up and removed the sidebar
    it('has navigation sidebar', () => {
      return cy.get('aside#sidebar')
      .should('be.visible')
    })
  })
})
