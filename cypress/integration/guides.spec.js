const ORIGIN = 'http://localhost:3000'
const GUIDES_URL = `${ORIGIN}/guides/overview/why-cypress`
const SIDEBAR = './content/_data/sidebar.json'
const SIDEBAR_EN = './content/_data/en.json'

describe('Guides', () => {
  beforeEach(() => {
    cy.viewport('macbook-15')
    cy.visit(GUIDES_URL)
  })

  it('contains a sidebar', () => {
    cy.readFile(SIDEBAR).then(({ guides: sidebarGuides }) => {
      cy.readFile(SIDEBAR_EN).then(({ sidebar: { guides } }) => {
        const guideEntries = Object.entries(guides)

        // console.log('guideEntries: ', guideEntries)

        /**
         * Flattening the sidebar config so it can be used as a lookup
         * when we iterate through the `en.json` file. The `en.json` file
         * may contain key/value pairs that do not exist in the sidebar,
         * likely artifacts of items that used to exist in the sidebar
         * at one point.
         */
        const sidebarItems = Object.keys(sidebarGuides).reduce((all, key) => {
          return {
            ...all,
            ...sidebarGuides[key],
          }
        }, {})

        for (let i = 0; i < guideEntries.length; i++) {
          const [slug, userFriendlyString] = guideEntries[i]

          const existsInSidebarFile = sidebarItems[slug] !== undefined
          if (!existsInSidebarFile) {
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
          const shouldBePageLink = sidebarGuides[slug] === undefined
          if (shouldBePageLink) {
            /**
             * Steps:
             * 1. Click the link
             * 2. Assert that the title has changed
             * 3. Assert that the path has changed
             * 4. Capture a snapshot for visual regression testing
             */
            const existingTitle = cy.title()
            cy.get('.app-sidebar')
              .contains(userFriendlyString)
              .click({ force: true })
            const newTitle = cy.title()

            /**
             * The title won't change if we are already
             * on the first page and navigate to the first
             * page again.
             */
            const isDefaultPage = i === 0
            if (!isDefaultPage) {
              expect(newTitle).to.not.equal(existingTitle)
            }
            cy.visualSnapshot(`Guides / ${userFriendlyString}`)
          }
          cy.visit(GUIDES_URL)
        }
      })
    })
  })
})
