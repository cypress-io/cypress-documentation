const YAML = require('yamljs')
const _ = require('lodash')

context('Sidebar', () => {
  it('displays current page as highlighted', function () {
    cy.wrap(this.MAIN_NAV).each(function (nav) {
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
    it('displays titles and links in sidebar', function () {
      cy.wrap(this.langValues).each(function (lang) {
        let sidebarYaml = 'source/_data/sidebar.yml'
        let visitUrlPrefix = ''

        if (lang !== 'en') {
          sidebarYaml = `source/${lang}/_data/sidebar.yml`
          visitUrlPrefix = lang
        }

        cy.wrap(this.MAIN_NAV).each((nav) => {
          if (nav.name === 'Plugins') return

          cy.readFile(sidebarYaml)
          .then(function (yamlString) {
            this.navName = _.toLower(nav.name)

            this.sidebar = YAML.parse(yamlString)
            this.sidebarTitles = _.keys(this.sidebar[this.navName])

            this.sidebarLinkNames = _.reduce(this.sidebar[this.navName], (memo, nestedObj) => memo.concat(_.keys(nestedObj))
              , [])

            this.sidebarLinks = _.reduce(this.sidebar[this.navName], (memo, nestedObj) => memo.concat(_.values(nestedObj))
              , [])
          })

          cy.visit(`${visitUrlPrefix}${nav.path}.html`)

          cy.get('#sidebar').within(() => {
            cy.get('.sidebar-title strong')
            .each(function (displayedTitle, i) {
              const title = this[lang].sidebar[this.navName][this.sidebarTitles[i]]

              expect(displayedTitle.text(), `Sidebar heading '${displayedTitle.text()}' matches translated title in ${lang}.yml`).to.eq(title)
            })

            cy.get('.sidebar-link')
            .each(function (displayedLink, i) {
              const link = this[lang].sidebar[this.navName][this.sidebarLinkNames[i]]
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
