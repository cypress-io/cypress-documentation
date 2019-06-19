/// <reference types="cypress" />
describe('i18n', () => {
  beforeEach(() => {
    cy.server()
    cy.visit('/')

    cy.url().should('contain', 'why-cypress')
  })

  it('uses English in Command Line guide', () => {
    cy.visit('/guides/guides/command-line.html')
    cy.document().its('documentElement.lang').should('equal', 'en')
    cy.get('meta[property="og:title"]').invoke('attr', 'content').should('equal', 'Command Line')
    cy.contains('h1', 'Command Line')
  })

  context('language select', () => {
    it('selects English by default', () => {
      cy.get('#lang-select').find('option')
      .contains('English').should('be.selected')
    })

    it('lists all languages', function () {
      cy.get('#lang-select').find('option').each(function (lang, i) {
        expect(lang).to.have.value(this.langValues[i])

        expect(lang).to.contain(this.langNames[i])
      })
    })

    describe('select lang', () => {
      it('displays lang as selected and within url', function () {
        cy.wrap(this.langValues).each((lang) => {
          if (lang === 'en') return

          cy.get('#lang-select')
          .select(lang)
          .should('have.value', lang)
          cy.url().should('include', lang)
          cy.document().its('documentElement.lang').should('equal', lang)
        })
      })
    })
  })

  context('Mobile', () => {
    beforeEach(() => {
      cy.viewport('iphone-6')
    })

    it('displays lang as selected and within url', function () {
      cy.wrap(this.langValues).each((lang) => {
        if (lang === 'en') return

        cy.get('#mobile-nav-toggle').click()
        cy.get('#mobile-nav-inner').should('be.visible')

        cy.get('#mobile-lang-select')
        .select(lang)
        .should('have.value', lang)
        cy.url().should('include', lang)
      })
    })
  })
})
