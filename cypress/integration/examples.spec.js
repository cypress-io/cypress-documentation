const EXAMPLES_URL = '/examples/examples/recipes#Fundamentals'
const SIDEBAR = './content/_data/sidebar.json'
const { getTitle } = require('../../utils')

describe('Examples', () => {
  beforeEach(() => {
    cy.viewport('macbook-15')
    cy.visit(EXAMPLES_URL)
  })

  it('contains a sidebar', () => {
    cy.readFile(SIDEBAR).then(({ examples }) => {
      const sidebarItems = examples[0].children

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
            `/examples/${category.slug}/${page.slug}`
          )

          cy.contains(
            `.app-sidebar [data-test="${category.slug}"] a`,
            pageTitle
          ).should(
            'have.class',
            'nuxt-link-exact-active nuxt-link-active active-sidebar-link'
          )

          const titleExceptionMap = {
            tutorials: 'Tutorial Videos',
          }

          cy.title().should(
            'equal',
            getTitle(titleExceptionMap[page.slug] || pageTitle)
          )

          cy.get('.main-content-title').contains(
            titleExceptionMap[page.slug] || pageTitle
          )

          cy.visualSnapshot(`/examples/${category.slug}/${page.slug}`)
        })

        cy.visit(EXAMPLES_URL)
      })
    })
  })
})
