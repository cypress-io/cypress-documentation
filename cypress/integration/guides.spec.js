const SIDEBAR = './content/_data/sidebar.json'
const SIDEBAR_EN = './content/_data/en.json'

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

          cy.get('.app-sidebar').contains(guides[category])

          cy.wrap(pages).each((page) => {
            const pageTitle = guides[page]

            cy.contains(
              `.app-sidebar [data-test="${category}"] a`,
              pageTitle
            ).click({ force: true })

            const redirects = {
              'dashboard-introduction': '/guides/dashboard/introduction/',
              'continuous-integration-introduction':
                '/guides/continuous-integration/introduction/',
            }

            cy.location('pathname').should(
              'equal',
              redirects[page] || `/guides/${category}/${page}/`
            )

            cy.contains(
              `.app-sidebar [data-test="${category}"] a`,
              pageTitle
            ).should(
              'have.class',
              'nuxt-link-exact-active nuxt-link-active active-sidebar-link'
            )

            cy.title().should('equal', pageTitle)

            cy.get('.main-content-title').contains(pageTitle)

            cy.visualSnapshot(`/guides/${category}/${page}`)
          })

          cy.visit('/')
        })
      })
    })
  })
})
