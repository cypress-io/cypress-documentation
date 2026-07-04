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
  // Target the search button, not the "Search ⌘K" label — that label is hidden
  // below the sm breakpoint, so matching its text fails at mobile widths.
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
  // The toggle can miss its first click if it fires before the navbar hydrates,
  // so retry until the drawer actually opens.
  const attempt = (n: number) => {
    cy.get('body').then(($body) => {
      const drawer = $body.find('.navbar-sidebar')
      const isOpen = drawer.length > 0 && drawer.css('visibility') !== 'hidden'
      if (isOpen || n >= 6) {
        return
      }
      cy.get('.navbar__toggle:visible').first().click()
      cy.wait(200)
      attempt(n + 1)
    })
  }
  attempt(0)
  cy.get('.navbar-sidebar').should('be.visible')
}

function exerciseMobileChrome() {
  openMobileDrawer()
  expandSidebar('.navbar-sidebar')
  // The "back to main menu" button only exists while the secondary (docs
  // sidebar) menu is shown, so click it only when present.
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
