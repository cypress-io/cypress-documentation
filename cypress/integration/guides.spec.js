const SIDEBAR = './content/_data/sidebar.json'
const { getTitle } = require('../../utils')

describe('Guides', () => {
  beforeEach(() => {
    cy.viewport('macbook-15')
    cy.visit('/')
  })

  it('contains a sidebar', () => {
    cy.readFile(SIDEBAR).then(({ guides }) => {
      const sidebarItems = guides[0].children

      cy.wrap(sidebarItems).each((category) => {
        const pages = category.children

        cy.get('.app-sidebar')
          .contains(category.title)
          .then(($category) => {
            cy.get(`[data-test="${category.slug.toLowerCase()}"]`).then(
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
            'dashboard/introduction': 'Dashboard',
            'migrating-to-cypress/protractor': 'Protractor',
          }

          const pageTitle =
            titleMismatches[`${category.slug}/${page.slug}`] || page.title

          if (page === 'component-testing-introduction') {
            // for now, bypass an error thrown on this page by vue-meta
            return
          }

          // Title on /guides/dashboard/introduction is "Dashboard" whereas the sidebar
          // item is "Introduction"
          const sidebarItemMismatches = {
            Dashboard: 'Introduction',
          }

          cy.contains(
            `.app-sidebar [data-test="${category.title}-children"] a`,
            sidebarItemMismatches[pageTitle] || pageTitle
          ).click({ force: true })

          const redirects = {
            'dashboard-introduction': '/guides/dashboard/introduction',
            'continuous-integration-introduction':
              '/guides/continuous-integration/introduction',
          }

          cy.location('pathname').should(
            'equal',
            redirects[page] || `/guides/${category.slug}/${page.slug}`
          )

          cy.contains(
            `.app-sidebar [data-test="${category.title}-children"] a`,
            sidebarItemMismatches[pageTitle] || pageTitle
          ).should(
            'have.class',
            'nuxt-link-exact-active nuxt-link-active active-sidebar-link'
          )

          const titleExceptionMap = {
            Protractor: 'Migrating from Protractor to Cypress',
          }

          cy.title().should(
            'equal',
            getTitle(titleExceptionMap[pageTitle] || pageTitle)
          )

          cy.get('.main-content-title').contains(pageTitle)

          cy.visualSnapshot(`/guides/${category.slug}/${page.slug}`)
        })

        cy.visit('/')
      })
    })
  })
})
