const { getTitle } = require('../../../utils')
const OVERRIDES = require('../../fixtures/sidebar-overrides.json')

const INITIAL_URL = {
  guides: '/',
  api: '/api/table-of-contents',
  examples: '/examples/examples/recipes#Fundamentals',
  faq: '/faq/questions/using-cypress-faq',
}

export const runSidebarTests = ([section]) => {
  describe(section.title, () => {
    section.children.forEach((category) => {
      describe(category.title, () => {
        beforeEach(() => {
          cy.viewport('macbook-15')
          cy.visit(INITIAL_URL[section.slug])

          // scroll category button into view and expand it if hidden
          cy.get('.app-sidebar')
            .contains(category.title)
            .then(($category) => {
              cy.get(`[data-test="${category.title}-children"]`).then(($ul) => {
                if ($ul.hasClass('hidden')) {
                  cy.wrap($category).scrollIntoView().click()
                }
              })
            })
        })

        category.children.forEach((page) => {
          it(page.title, () => {
            const isLink = page.redirect || page.slug

            const constructedPath = `/${section.slug}/${category.slug}/${page.slug}`
            const pathname = page.redirect || constructedPath
            const categorySlug =
              OVERRIDES.CATEGORY_SLUG[pathname] || category.slug
            const sidebarText = OVERRIDES.SIDEBAR_TEXT[pathname] || page.title
            const pageTitle = OVERRIDES.PAGE_TITLE[pathname] || page.title

            // If the item is not a link, simply verify that it has the correct text
            if (!isLink) {
              cy.contains(
                `.app-sidebar [data-test="${categorySlug}"] div`,
                sidebarText
              )

              return
            }

            // click the page link in the sidebar
            cy.contains(
              `.app-sidebar [data-test="${category.slug}"] a[href="${pathname}"]`,
              page.title
            ).click({ force: true })

            // ensure the correct page has been navigated to
            cy.location('pathname').should('equal', pathname)

            // ensure the current sidebar category contains an active link with the current page title
            cy.contains(
              `.app-sidebar [data-test="${categorySlug}"] a[href="${pathname}"]`,
              sidebarText
            ).should(
              'have.class',
              'nuxt-link-exact-active nuxt-link-active active-sidebar-link'
            )

            // ensure only one link is active in the sidebar
            cy.get('.active-sidebar-link').should('have.length', 1)

            // ensure the page title and header are correct
            cy.title().should('equal', getTitle(pageTitle))
            cy.get('h1').contains(pageTitle)

            cy.visualSnapshot(constructedPath)
          })
        })
      })
    })
  })
}
