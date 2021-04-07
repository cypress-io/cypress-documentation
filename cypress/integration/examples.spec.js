const EXAMPLES_URL = '/examples/examples/recipes#Fundamentals'
const SIDEBAR = './content/_data/sidebar.json'
const SIDEBAR_EN = './content/_data/en.json'
const { getTitle } = require('../../utils')

describe('Examples', () => {
  beforeEach(() => {
    cy.viewport('macbook-15')
    cy.visit(EXAMPLES_URL)
  })

  it('contains a sidebar', () => {
    cy.readFile(SIDEBAR).then(({ examples: sidebarExamples }) => {
      cy.readFile(SIDEBAR_EN).then(({ sidebar: { examples } }) => {
        const sidebarCategories = Object.keys(sidebarExamples)

        cy.wrap(sidebarCategories).each((category) => {
          const pages = Object.keys(sidebarExamples[category])

          cy.get('.app-sidebar')
            .contains(examples[category])
            .then(($category) => {
              cy.get(`[data-test="${examples[category]}-children"]`).then(
                ($ul) => {
                  if ($ul.hasClass('hidden')) {
                    $category.click()
                  }
                }
              )
            })

          cy.wrap(pages).each((page) => {
            const pageTitle = examples[page]

            cy.contains(
              `.app-sidebar [data-test="${category}"] a`,
              pageTitle
            ).click({
              force: true,
            })

            cy.location('pathname').should(
              'equal',
              `/examples/${category}/${page}`
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

            cy.visualSnapshot(`/examples/${category}/${page}`)
          })

          cy.visit(EXAMPLES_URL)
        })
      })
    })
  })
})
