const ORIGIN = 'http://localhost:3000'
const EXAMPLES_URL = `${ORIGIN}/examples/examples/recipes#Fundamentals`
const SIDEBAR = './content/_data/sidebar.json'
const SIDEBAR_EN = './content/_data/en.json'

describe('Examples', () => {
  beforeEach(() => {
    cy.viewport('macbook-15')
    cy.visit(EXAMPLES_URL)
  })

  it('contains a sidebar', () => {
    cy.readFile(SIDEBAR).then(({ examples: sidebarExamples }) => {
      cy.readFile(SIDEBAR_EN).then(({ sidebar: { examples } }) => {
        const exampleEntries = Object.entries(examples)

        // console.log('exampleEntries: ', exampleEntries)

        /**
         * Flattening the sidebar config so it can be used as a lookup
         * when we iterate through the `en.json` file. The `en.json` file
         * may contain key/value pairs that do not exist in the sidebar,
         * likely artifacts of items that used to exist in the sidebar
         * at one point.
         */
        const sidebarItems = Object.keys(sidebarExamples).reduce((all, key) => {
          return {
            ...all,
            ...sidebarExamples[key],
          }
        }, {})

        for (let i = 0; i < exampleEntries.length; i++) {
          const [slug, userFriendlyString] = exampleEntries[i]

          const existsInSidebarYml = sidebarItems[slug] !== undefined

          if (!existsInSidebarYml) {
            continue
          }

          cy.get('.app-sidebar').contains(userFriendlyString)

          /**
           * The `en` file contains a flat list of slug-to-friendly-name pairs.
           * Each item in the `en` list may or may not be a clickable link in
           * the sidebar. We have to reference the `sidebar.json` file to determine
           * if a sidebar item is meant to be a link to another page.
           *
           * The top-level keys in the `sidebar.json` are for each of the items
           * in the top navigation bar: guides, api, plugins, examples, faq, etc.
           *
           * The nested keys of those top-level keys (e.g. the keys within `guides`)
           * are all section headers in the sidebar, and thus, not links to other pages.
           *
           * Therefore, the only clickable links in the sidebar that redirect the user
           * are any items that are not also top-level keys within the different sections
           * of `sidebar.json`.
           *
           * Alternatively, instead of doing this cross-referencing between two different
           * files (one that describes the structure of the sidebar and the other its content),
           * a `sidebar` or `en` file could exist such that the sidebar data is both
           * structured in its currently sectioned manner and contain the user-friendly
           * content.
           */
          const shouldBePageLink = sidebarExamples[slug] === undefined

          if (shouldBePageLink) {
            /**
             * Steps:
             * 1. Click the link
             * 2. Assert that the title has changed
             * 3. Assert that the path has changed
             * 4. Capture a snapshot for visual regression testing
             */
            cy.title().then(existingTitle => {
              cy.get('.app-sidebar')
                .contains(userFriendlyString)
                .click({ force: true })

              /**
               * The title won't change if we are already
               * on the first page and navigate to the first
               * page again.
               */
              const isDefaultPage = i === 0

              if (!isDefaultPage) {
                cy.title().should('equal', existingTitle)
              }

              cy.visualSnapshot(`Examples / ${userFriendlyString}`)
            })
          }

          cy.visit(EXAMPLES_URL)
        }
      })
    })
  })
})
