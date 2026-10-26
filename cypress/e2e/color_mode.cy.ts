describe('Color mode', () => {
  const PAGE = '/app/get-started/why-cypress'

  // Emulates the operating system light or dark setting through the Chrome
  // DevTools Protocol, so the page sees a real `prefers-color-scheme` and its
  // change events. With no `scheme`, it clears the emulation. The call sits
  // inside `cy.then` so it runs in command order, not while Cypress is still
  // queuing the test's commands.
  const setSystemColorScheme = (scheme?: 'light' | 'dark') =>
    cy.then(() =>
      Cypress.automation('remote:debugger:protocol', {
        command: 'Emulation.setEmulatedMedia',
        params: {
          features: scheme ? [{ name: 'prefers-color-scheme', value: scheme }] : [],
        },
      })
    )

  const theme = () => cy.get('html')
  const toggle = (label: string) => cy.get(`button[aria-label="${label}"]`)

  // `theme` is the localStorage key Docusaurus saves the toggle's choice under.
  // The inline theme script sets `data-theme` before React runs, so wait for
  // hydration too: only then is Docusaurus listening for system changes.
  const visit = (savedTheme?: 'light' | 'dark') => {
    cy.visit(PAGE, {
      onBeforeLoad(win) {
        if (savedTheme) win.localStorage.setItem('theme', savedTheme)
        else win.localStorage.removeItem('theme')
      },
    })
    theme().should('have.attr', 'data-has-hydrated', 'true')
  }

  // Emulation persists in the browser after a test ends, so clear it after
  // each one to start the next test or spec from the default setting.
  afterEach(() => setSystemColorScheme())

  it('matches a dark system setting when nothing is saved', () => {
    setSystemColorScheme('dark')
    visit()
    theme().should('have.attr', 'data-theme', 'dark')
    toggle('Switch to light mode').should('be.visible')
  })

  it('matches a light system setting when nothing is saved', () => {
    setSystemColorScheme('light')
    visit()
    theme().should('have.attr', 'data-theme', 'light')
    toggle('Switch to dark mode').should('be.visible')
  })

  it('follows the system setting when it changes on an open page', () => {
    setSystemColorScheme('light')
    visit()
    theme().should('have.attr', 'data-theme', 'light')
    setSystemColorScheme('dark')
    theme().should('have.attr', 'data-theme', 'dark')
  })

  it('keeps a saved choice over the system setting', () => {
    setSystemColorScheme('dark')
    visit('light')
    theme().should('have.attr', 'data-theme', 'light')
    setSystemColorScheme('light')
    setSystemColorScheme('dark')
    theme().should('have.attr', 'data-theme', 'light')
  })

  it('saves the toggle choice and keeps it across a reload', () => {
    setSystemColorScheme('dark')
    visit()
    toggle('Switch to light mode').click()
    theme().should('have.attr', 'data-theme', 'light')
    cy.window()
      .its('localStorage')
      .invoke('getItem', 'theme')
      .should('eq', 'light')
    cy.reload()
    theme().should('have.attr', 'data-theme', 'light')
  })
})
