const FAQ_URL = '/faq/questions/using-cypress-faq'
const SIDEBAR = './content/_data/sidebar.json'
const { getTitle } = require('../../utils')

describe('FAQ', () => {
  beforeEach(() => {
    cy.viewport('macbook-15')
    cy.visit(FAQ_URL)
  })

  it('contains a sidebar', () => {
    cy.readFile(SIDEBAR).then(({ faq }) => {
      const sidebarItems = faq[0].children

      cy.wrap(sidebarItems).each((category) => {
        const pages = category.children

        cy.get('.app-sidebar')
          .contains(category.title)
          .then(($category) => {
            cy.get(`[data-test="${category.title}-children"]`).then(($ul) => {
              if ($ul.hasClass('hidden')) {
                cy.wrap($category).scrollIntoView().click()
              }
            })
          })

        cy.wrap(pages).each((page) => {
          const pageTitle = page.title

          cy.contains(
            `.app-sidebar [data-test="${category.slug}"] a`,
            pageTitle
          ).click({ force: true })

          cy.location('pathname').should(
            'equal',
            page.redirect || `/faq/${category.slug}/${page.slug}`
          )

          cy.contains(
            `.app-sidebar [data-test="${category.slug}"] a`,
            pageTitle
          ).should(
            'have.class',
            'nuxt-link-exact-active nuxt-link-active active-sidebar-link'
          )

          cy.get('.active-sidebar-link').should('have.length', 1)

          cy.title().should('equal', getTitle(pageTitle))

          cy.get('.main-content-title').contains(pageTitle)

          cy.visualSnapshot(`/faq/${category.slug}/${page.slug}`)
        })

        cy.visit(FAQ_URL)
      })
    })
  })
})
