const API_URL = '/api/table-of-contents'
const SIDEBAR = './content/_data/sidebar.json'
const SIDEBAR_EN = './content/_data/en.json'
const { getTitle } = require('../../utils')

describe('APIs', () => {
  beforeEach(() => {
    cy.viewport('macbook-15')
    cy.visit(API_URL)
  })

  it('contains a sidebar', () => {
    cy.readFile(SIDEBAR).then(({ api: sidebarApi }) => {
      cy.readFile(SIDEBAR_EN).then(({ sidebar: { api } }) => {
        const sidebarCategories = Object.keys(sidebarApi)

        cy.wrap(sidebarCategories).each((category) => {
          const pages = Object.keys(sidebarApi[category])

          cy.get('.app-sidebar').contains(api[category])

          cy.wrap(pages).each((page) => {
            const pageTitle = api[page]

            cy.contains(
              page === 'table-of-contents'
                ? '.app-sidebar a'
                : `.app-sidebar [data-test="${category}"] a`,
              pageTitle
            ).click({
              force: true,
            })

            const redirects = {
              'table-of-contents': '/api/table-of-contents',
              'all-assertions': '/guides/references/assertions',
            }

            cy.location('pathname').should(
              'equal',
              redirects[page] || `/api/${category}/${page}`
            )

            cy.contains(
              page === 'table-of-contents' || page === 'all-assertions'
                ? '.app-sidebar a'
                : `.app-sidebar [data-test="${category}"] a`,
              page === 'all-assertions' ? 'Assertions' : pageTitle
            ).should(
              'have.class',
              'nuxt-link-exact-active nuxt-link-active active-sidebar-link'
            )

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
              getTitle(titleAliases[page] || pageTitle)
            )

            cy.get('.main-content-title').contains(
              titleAliases[page] || pageTitle
            )

            cy.visualSnapshot(`/api/${category}/${page}`)
          })

          cy.visit(API_URL)
        })
      })
    })
  })
})
