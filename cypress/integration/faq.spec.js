const FAQ_URL = '/faq/questions/using-cypress-faq'
const SIDEBAR = './content/_data/sidebar.json'
const SIDEBAR_EN = './content/_data/en.json'
const { getTitle } = require('../../utils')

describe('FAQ', () => {
  beforeEach(() => {
    cy.viewport('macbook-15')
    cy.visit(FAQ_URL)
  })

  it('contains a sidebar', () => {
    cy.readFile(SIDEBAR).then(({ faq: sidebarFaq }) => {
      cy.readFile(SIDEBAR_EN).then(({ sidebar: { faq } }) => {
        const sidebarCategories = Object.keys(sidebarFaq)

        cy.wrap(sidebarCategories).each((category) => {
          const pages = Object.keys(sidebarFaq[category])

          cy.get('.app-sidebar')
            .contains(faq[category])
            .then(($category) => {
              cy.get(`[data-test="${faq[category]}-children"]`).then(($ul) => {
                if ($ul.hasClass('hidden')) {
                  cy.wrap($category).scrollIntoView().click()
                }
              })
            })

          cy.wrap(pages).each((page) => {
            const pageTitle = faq[page]

            cy.contains(
              `.app-sidebar [data-test="${category}"] a`,
              pageTitle
            ).click({ force: true })

            const redirects = {
              'using-cypress-faq': '/faq/questions/using-cypress-faq',
            }

            cy.location('pathname').should(
              'equal',
              redirects[page] || `/faq/${category}/${page}`
            )

            cy.contains(
              `.app-sidebar [data-test="${category}"] a`,
              pageTitle
            ).should(
              'have.class',
              'nuxt-link-exact-active nuxt-link-active active-sidebar-link'
            )

            cy.title().should('equal', getTitle(pageTitle))

            cy.get('.main-content-title').contains(pageTitle)

            cy.visualSnapshot(`/faq/${category}/${page}`)
          })

          cy.visit(FAQ_URL)
        })
      })
    })
  })
})
