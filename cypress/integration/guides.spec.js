const SIDEBAR = './content/_data/sidebar.json'
const SIDEBAR_EN = './content/_data/en.json'
const { getTitle } = require('../../utils')

describe('Guides', () => {
  beforeEach(() => {
    cy.viewport('macbook-15')
    cy.visit('/')
  })

  it('contains a sidebar', () => {
    cy.readFile(SIDEBAR).then(({ guides: sidebarGuides }) => {
      cy.readFile(SIDEBAR_EN).then(({ sidebar: { guides } }) => {
        const sidebarCategories = Object.keys(sidebarGuides)

        cy.wrap(sidebarCategories).each((category) => {
          const pages = Object.keys(sidebarGuides[category])

          cy.get('.app-sidebar')
            .contains(guides[category])
            .then(($category) => {
              cy.get(`[data-test="${guides[category]}-children"]`).then(
                ($ul) => {
                  if ($ul.hasClass('hidden')) {
                    cy.wrap($category).scrollIntoView().click()
                  }
                }
              )
            })

          cy.wrap(pages).each((page) => {
            /**
             * The `title` in the front matter is _usually_ the same as the
             * `en.json` data for that key. However, some exceptions exist
             * which use a front matter `title` that does not match.
             */
            const titleMismatches = {
              'dashboard-introduction': 'Dashboard',
              'protractor-to-cypress': 'Migrating from Protractor to Cypress',
            }

            const pageTitle = titleMismatches[page] || guides[page]

            if (page === 'component-testing-introduction') {
              // for now, bypass an error thrown on this page by vue-meta
              return
            }

            // Title on /guides/dashboard/introduction is "Dashboard" whereas the sidebar
            // item is "Introduction"
            const sidebarItemMismatches = {
              Dashboard: 'Introduction',
              Protractor: 'Migrating from Protractor to Cypress',
            }

            cy.contains(
              `.app-sidebar [data-test="${category}"] a`,
              sidebarItemMismatches[pageTitle] || pageTitle
            ).click({ force: true })

            const redirects = {
              'dashboard-introduction': '/guides/dashboard/introduction',
              'continuous-integration-introduction':
                '/guides/continuous-integration/introduction',
            }

            cy.location('pathname').should(
              'equal',
              redirects[page] || `/guides/${category}/${page}`
            )

            cy.contains(
              `.app-sidebar [data-test="${category}"] a`,
              sidebarItemMismatches[pageTitle] || pageTitle
            ).should(
              'have.class',
              'nuxt-link-exact-active nuxt-link-active active-sidebar-link'
            )

            cy.title().should('equal', getTitle(pageTitle))

            cy.get('.main-content-title').contains(pageTitle)

            cy.visualSnapshot(`/guides/${category}/${page}`)
          })

          cy.visit('/')
        })
      })
    })
  })
})
