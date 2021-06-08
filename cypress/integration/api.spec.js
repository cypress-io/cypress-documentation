const API_URL = '/api/table-of-contents'
const SIDEBAR = './content/_data/sidebar.json'
const { getTitle } = require('../../utils')

describe('APIs', () => {
  beforeEach(() => {
    cy.viewport('macbook-15')
    cy.visit(API_URL)
  })

  it('contains a sidebar', () => {
    cy.readFile(SIDEBAR).then(({ api }) => {
      const sidebarItems = api[0].children

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
            page.slug === 'table-of-contents'
              ? '.app-sidebar a'
              : `.app-sidebar [data-test="${category.slug}"] a`,
            pageTitle
          ).click({ force: true })

          const redirects = {
            'table-of-contents': '/api/table-of-contents',
            'all-assertions': '/guides/references/assertions',
          }

          cy.location('pathname').should(
            'equal',
            page.redirect ||
              redirects[page.slug] ||
              `/api/${category.slug}/${page.slug}`
          )

          cy.contains(
            page.slug === 'table-of-contents' ||
              page.redirect === '/guides/references/assertions'
              ? '.app-sidebar a'
              : `.app-sidebar [data-test="${category.slug}"] a`,
            page.redirect === '/guides/references/assertions'
              ? 'Assertions'
              : pageTitle
          ).should(
            'have.class',
            'nuxt-link-exact-active nuxt-link-active active-sidebar-link'
          )

          cy.get('.active-sidebar-link').should('have.length', 1)

          const titleAliases = {
            'all-assertions': 'Assertions',
            _: 'Cypress._',
            $: 'Cypress.$',
            minimatch: 'Cypress.minimatch',
            promise: 'Cypress.Promise',
            sinon: 'Cypress.sinon',
            blob: 'Cypress.Blob',
            moment: 'Cypress.moment',
            'custom-commands': 'Custom Commands',
            cookies: 'Cypress.Cookies',
            'screenshot-api': 'Cypress.Screenshot',
            'selector-playground-api': 'Cypress.SelectorPlayground',
            'cypress-server': 'Cypress.Server',
            arch: 'Cypress.arch',
            browser: 'Cypress.browser',
            config: 'Cypress.config',
            dom: 'Cypress.dom',
            env: 'Cypress.env',
            isbrowser: 'Cypress.isBrowser',
            iscy: 'Cypress.isCy',
            'cypress-log': 'Cypress.log',
            platform: 'Cypress.platform',
            spec: 'Cypress.spec',
            'testing-type': 'Cypress.testingType',
            version: 'Cypress.version',
            'configuration-api': 'Configuration API',
            'preprocessors-api': 'Preprocessors API',
            'before-run-api': 'Before Run API',
            'after-run-api': 'After Run API',
            'before-spec-api': 'Before Spec API',
            'after-spec-api': 'After Spec API',
            'browser-launch-api': 'Browser Launch API',
            'after-screenshot-api': 'After Screenshot API',
          }

          cy.title().should(
            'equal',
            page.redirect?.includes('assertions')
              ? getTitle('Assertions')
              : getTitle(titleAliases[page.slug] || pageTitle)
          )

          cy.get('.main-content-title').contains(
            page.redirect?.includes('assertions')
              ? 'Assertions'
              : titleAliases[page.slug] || pageTitle
          )

          cy.visualSnapshot(`/api/${category.slug}/${page.slug}`)
        })

        cy.visit(API_URL)
      })
    })
  })
})
