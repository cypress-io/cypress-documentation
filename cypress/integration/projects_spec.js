/// <reference types="cypress" />
describe('Projects using Cypress page', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.contains('.main-nav-link', 'Examples').click()
    cy.contains('.sidebar-link', 'Projects').click()
    cy.contains('.article-title', 'Projects').should('be.visible')
  })

  it('lists a few projects', () => {
    cy.get('.projects-list li').should('have.length.gt', 2)
  })
})
