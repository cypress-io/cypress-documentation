const YAML = require('yamljs')
const _ = require('lodash')

context('Mobile', () => {
  beforeEach(() => {
    cy.viewport('iphone-6')
  })

  describe('Sidebar', () => {
    it('displays sidebar in mobile menu on click', function () {
      cy.wrap(this.langValues).each((lang) => {
        let sidebarYaml = 'source/_data/sidebar.yml'
        let visitUrlPrefix = ''

        if (lang !== 'en') {
          sidebarYaml = `source/${lang}/_data/sidebar.yml`
          visitUrlPrefix = lang
        }

        cy.readFile(sidebarYaml)
        .then(function (yamlString) {
          this.sidebar = YAML.parse(yamlString)
          this.sidebarTitles = _.keys(this.sidebar.guides)

          this.sidebarLinkNames = _.reduce(this.sidebar.guides, (memo, nestedObj) => memo.concat(_.keys(nestedObj))
            , [])

          this.sidebarLinks = _.reduce(this.sidebar.guides, (memo, nestedObj) => memo.concat(_.values(nestedObj))
            , [])
        })

        cy.visit(`${visitUrlPrefix}/guides/overview/why-cypress.html`)
        cy.get('#mobile-nav-toggle').click()
        cy.get('#mobile-nav-inner').should('be.visible')
        cy.get('.mobile-nav-link')
        .each(function (displayedLink, i) {
          const link = this[lang].sidebar.guides[this.sidebarLinkNames[i]]

          expect(displayedLink.text().trim(), `Sidebar link '${displayedLink.text()}' matches translated title in ${lang}.yml`).to.eq(link)
        })
      })
    })
  })
})
