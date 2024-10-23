describe('Visit Main Nav', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('root reroutes to App ', () => {
    cy.url().should('include', '/app/get-started/why-cypress')
  })

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