describe('Basic tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('root reroutes to App ', () => {
    cy.url().should('include', '/app/get-started/why-cypress')
  })

  describe('Main Nav', () => {
    it('App', () => {
      cy.get('nav a').contains('App').click()
      cy.url().should('include', '/app/get-started/why-cypress')
      cy.get('[aria-current="page"]').should('contain', 'App')
    })

    it('API', () => {
      cy.get('nav a').contains('API').click()
      cy.url().should('include', '/api/table-of-contents')
      cy.get('[aria-current="page"]').should('contain', 'API')
    })

    it('Cloud', () => {
      cy.get('nav a').contains('Cloud').click()
      cy.url().should('include', '/cloud/get-started/introduction')
      cy.get('[aria-current="page"]').should('contain', 'Cloud')
    })

    it('UI Coverage', () => {
      cy.get('nav a').contains('UI Coverage').click()
      cy.url().should('include', '/ui-coverage/get-started/introduction')
      cy.get('[aria-current="page"]').should('contain', 'UI Coverage')
    })

    it('Accessibility', () => {
      cy.get('nav a').contains('Accessibility').click()
      cy.url().should('include', '/accessibility/get-started/introduction')
      cy.get('[aria-current="page"]').should('contain', 'Accessibility')
    })
  })

  describe('Announcement Bar', () => {
    it('should close when clicking close btn', () => {
      cy.get('[role="banner"]').should('be.visible')
      cy.get('.close').click()
      cy.get('[role="banner"]').should('not.exist')
    })
  })

  describe('Dark mode', () => {
    it('switch to dark mode when clicked', () => {
      cy.get('[data-theme=light]').should('have.css', 'background-color', 'rgb(255, 255, 255)')  // white
      cy.get('[aria-label="Switch to dark mode"]').click()
      cy.get('[data-theme=dark]').should('have.css', 'background-color', 'rgb(27, 30, 46)') // dark gray
    })
  })

  describe('Search', () => {
    it('search opens search popup', () => {
      cy.contains('Search ⌘K').click()
      cy.get('.DocSearch-Modal').should('be.visible')
    })
  })
})