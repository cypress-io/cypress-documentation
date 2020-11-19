const YAML = require('yamljs')
const _ = require('lodash')

import { MAIN_NAV } from '../support/defaults'

describe('Page Header', () => {
  beforeEach(() => {
    cy.server()
  })

  MAIN_NAV.forEach((nav) => {
    // the Plugin docs doesn't have a sidebar
    // the API docs don't really need translations (since it's all commands)
    if (nav.name === 'Plugins' || nav.name === 'API') return

    it(`displays correct page title for ${nav.name}`, function () {
    // disabling this test because we are copying untranslated English document pages
    // into other language folders. A single translated page title is not enough to count
    // thus the sidebar has translated title, but the page itself shows English translation
    // limit to English instead of "this.langValues"
      const languages = ['en']

      cy.wrap(languages).each(function (lang) {
        let sidebarYaml = 'source/_data/sidebar.yml'
        let visitUrlPrefix = ''

        if (lang !== 'en') {
          sidebarYaml = `source/${lang}/_data/sidebar.yml`
          visitUrlPrefix = lang
        }

        cy.readFile(sidebarYaml)
        .then(function (yamlString) {
          this.navName = _.toLower(nav.name)

          this.sidebar = YAML.parse(yamlString)
          this.sidebarTitles = _.keys(this.sidebar[this.navName])

          this.sidebarLinkNames = _.reduce(this.sidebar[this.navName], (memo, nestedObj) => memo.concat(_.keys(nestedObj))
            , [])

          this.sidebarLinks = _.reduce(this.sidebar[this.navName], (memo, nestedObj) => memo.concat(_.values(nestedObj))
            , [])

          cy.visit(`${visitUrlPrefix}${nav.path}.html`)

          cy.get('.sidebar-link')
          .each(($linkElement) => {
            cy.request(`${$linkElement[0].href}`).its('body')
            .then((body) => {
              const page = _.last($linkElement[0].href.split('/'))

              if (page !== 'assertions.html') {
                const $body = Cypress.$(body)
                const $h1 = $body.find('h1.article-title')

                expect($h1.text(), `Page title '${$h1.text()}' in ${page} matches translated title in ${lang}.yml`).to.eq($linkElement.text().trim())
              }
            })
          })
        })
      })
    })
  })

  it('should have link to edit doc in each language', function () {
    cy.wrap(this.langValues).each(function (lang) {
      // In English it probably is "Improve this doc",
      // and in other languages it is a translation
      const improvePageText = this[lang].page.improve

      cy.log(`Language **${lang}**`)
      let visitUrlPrefix = ''

      if (lang !== 'en') {
        visitUrlPrefix = lang
      }

      cy.wrap(MAIN_NAV).each((nav) => {
        let path = `${nav.path}.html`
        let mdPath = `${nav.path}.md`

        if (nav.path === '/plugins/') {
          path = `${nav.path}index.html`
          mdPath = `${nav.path}index.md`
        }

        cy.visit(`${visitUrlPrefix}${path}`)

        cy.contains('a', improvePageText).as('editLink')
        .should('have.attr', 'href')
        .and('include', mdPath)
        .and('include', this.improveUrl)
      })
    })
  })
})
