const YAML = require('yamljs')
const _ = require('lodash')

import { MAIN_NAV } from '../support/defaults'

context('Sidebar', function () {
  MAIN_NAV.forEach((nav) => {
    it(`displays current page as highlighted in ${nav.name}`, function () {
      let path = `${nav.path}.html`

      if (nav.path === '/plugins/') {
        path = `${nav.path}index.html`
      }

      cy.visit(path).then(() => {
        if (nav.firstPage) {
          cy.get('#sidebar').find('a.current')
          .should('have.attr', 'href').and('include', nav.firstPage)
        }
      })
    })
  })

  context('Titles and links', () => {
    MAIN_NAV.forEach((nav) => {
      if (nav.name === 'Plugins') return

      const navName = _.toLower(nav.name)

      it(`displays titles and links in ${nav.name} sidebar`, function () {
        cy.wrap(this.langValues).each(function (lang) {
          this.sidebarYaml = 'source/_data/sidebar.yml'
          this.visitUrlPrefix = ''

          if (lang !== 'en') {
            this.sidebarYaml = `source/${lang}/_data/sidebar.yml`
            this.visitUrlPrefix = lang
          }

          cy.readFile(this.sidebarYaml)
          .then(function (yamlString) {
            this.sidebar = YAML.parse(yamlString)
            this.sidebarTitles = _.keys(this.sidebar[navName])

            this.sidebarLinkNames = _.reduce(this.sidebar[navName], (memo, nestedObj) => memo.concat(_.keys(nestedObj))
              , [])

            this.sidebarLinks = _.reduce(this.sidebar[navName], (memo, nestedObj) => memo.concat(_.values(nestedObj))
              , [])
          })

          const page = `${this.visitUrlPrefix}${nav.path}.html`

          cy.task('log', `Visiting ${page}`)
          cy.visit(`${page}`)

          cy.get('#sidebar').within(() => {
            cy.get('.sidebar-title strong')
            .each(function (displayedTitle, i) {
              const title = this[lang].sidebar[navName][this.sidebarTitles[i]]

              expect(displayedTitle.text(), `Sidebar heading '${displayedTitle.text()}' matches translated title in ${lang}.yml`).to.eq(title)
            })

            cy.get('.sidebar-link')
            .each(function (displayedLink, i) {
              const link = this[lang].sidebar[navName][this.sidebarLinkNames[i]]
              const sidebarLink = this.sidebarLinks[i]

              expect(displayedLink.text().trim(), `Sidebar link text '${displayedLink.text()}' matches translated title in ${lang}.yml`).to.eq(link)
              expect(displayedLink.attr('href'), `Sidebar link href '${displayedLink.attr('href')}' has correct link ${sidebarLink} for language: ${lang}`).to.include(sidebarLink)
            })
          })
        })
      })
    })
  })
})
