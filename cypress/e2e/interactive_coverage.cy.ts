const URLs: Array<string> = Cypress.expose('URLs')

const REPRESENTATIVE_PAGES = [
  ...new Set(URLs.map((url) => url.split('/')[0])),
]
  .sort()
  .map((section) => URLs.filter((url) => url.split('/')[0] === section).sort()[0])
  .filter(Boolean)

const VIEWPORTS = [
  { name: 'desktop', width: 1200, height: 800 },
  { name: 'mobile', width: 375, height: 812 },
]

function expandSidebar(root: string) {
  cy.get(root).then(($el) => {
    const collapsed = $el
      .find('button:visible')
      .toArray()
      .filter((el) => el.querySelector('[class*="-rotate-90"]'))
    if (collapsed.length === 0) {
      return
    }
    cy.wrap(collapsed[0]).scrollIntoView().click()
    expandSidebar(root)
  })
}

function exerciseContentTabs() {
  cy.get('body').then(($body) => {
    $body.find('[role="tab"]:visible').toArray().forEach((el) => {
      cy.wrap(el).click()
    })
  })
}

function exerciseSearch() {
  // Match the button, not the "Search ⌘K" label, which is hidden below `sm`.
  cy.contains('button', 'Search ⌘K').click()
  cy.get('.DocSearch-Modal').should('be.visible')
  cy.get('.DocSearch-Input').type('cypress')
  cy.get('body').type('{esc}')
  cy.get('.DocSearch-Modal').should('not.exist')
}

function exerciseDesktopChrome() {
  expandSidebar('nav[aria-label="Docs sidebar"]')
  exerciseContentTabs()
  exerciseSearch()
}

function openMobileDrawer() {
  // Retry the toggle until it reports expanded — its first click can be dropped
  // pre-hydration. Keying off aria-expanded (React state) rather than the
  // drawer's animating CSS visibility avoids re-clicking a drawer that's opening.
  const ensureExpanded = (n: number) => {
    cy.get('.navbar__toggle:visible', { timeout: 15000 }).first().then(($toggle) => {
      if ($toggle.attr('aria-expanded') === 'true' || n >= 6) {
        return
      }
      cy.wrap($toggle).click()
      ensureExpanded(n + 1)
    })
  }
  ensureExpanded(0)
  cy.get('.navbar__toggle:visible', { timeout: 15000 })
    .first()
    .should('have.attr', 'aria-expanded', 'true')
  cy.get('.navbar-sidebar').should('be.visible')
}

function exerciseMobileChrome() {
  openMobileDrawer()
  expandSidebar('.navbar-sidebar')
  // The back button only exists while the secondary menu is shown.
  cy.get('.navbar-sidebar').then(($drawer) => {
    const back = $drawer.find('.navbar-sidebar__back:visible')
    if (back.length) {
      cy.wrap(back.first()).click()
    }
  })
  cy.get('.navbar-sidebar__close:visible').click()
  cy.get('.navbar-sidebar').should('not.be.visible')
  exerciseContentTabs()
  exerciseSearch()
}

describe('Interactive UI Coverage', () => {
  VIEWPORTS.forEach((viewport) => {
    describe(viewport.name, () => {
      REPRESENTATIVE_PAGES.forEach((URL) => {
        it(`exercises interactive chrome on ${URL}`, () => {
          cy.viewport(viewport.width, viewport.height)
          cy.visit(URL)
          cy.get('h1').should('be.visible').and('not.have.text', 'Page Not Found')

          if (viewport.name === 'mobile') {
            exerciseMobileChrome()
          } else {
            exerciseDesktopChrome()
          }

          cy.get('[aria-label="Switch to dark mode"]:visible').first().click()
        })
      })
    })
  })
})
