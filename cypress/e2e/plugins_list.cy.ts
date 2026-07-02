describe('Plugins list', () => {
  const search = '[data-cy=plugins-search]'
  const categoryFilter = '[data-cy=plugins-category-filter]'
  const badgeFilter = '[data-cy=plugins-badge-filter]'
  const resultCount = '[data-cy=plugins-result-count]'

  const countFromText = (text: string) =>
    Number((text.match(/Showing (\d+)/) || [])[1])

  beforeEach(() => {
    cy.visit('/app/plugins/plugins-list')
    // Wait for hydration so the filter controls are interactive.
    cy.get(search).should('be.enabled')
    cy.get(resultCount).should('contain', 'Showing')
  })

  it('explains every trust level in the badge legend', () => {
    cy.get('[aria-label="What the badges mean"]').within(() => {
      cy.contains('official').should('be.visible')
      cy.contains('verified').should('be.visible')
      cy.contains('community').should('be.visible')
      cy.contains('deprecated').should('be.visible')
      // The key trust message for the largest group.
      cy.contains('not reviewed by Cypress').should('be.visible')
    })
  })

  it('lists many plugins with a result count by default', () => {
    cy.get(resultCount)
      .invoke('text')
      .then((text) => expect(countFromText(text)).to.be.greaterThan(50))
    cy.get('[data-cy="plugin-@cypress/grep"]').should('exist')
  })

  it('narrows the list with the search box', () => {
    cy.get(resultCount)
      .invoke('text')
      .then((text) => {
        const before = countFromText(text)
        cy.get(search).type('accessibility')
        cy.get('[data-cy="plugin-cypress-axe"]').should('be.visible')
        cy.get('[data-cy="plugin-cypress-vite"]').should('not.exist')
        cy.get(resultCount)
          .invoke('text')
          .then((filtered) =>
            expect(countFromText(filtered)).to.be.lessThan(before)
          )
      })
  })

  it('shows an empty state when nothing matches', () => {
    cy.get(search).type('zzzznotarealpluginxyz')
    cy.get(resultCount).should('contain', 'Showing 0 plugins')
    cy.contains('No plugins match your search').should('be.visible')
  })

  it('filters down to a single category', () => {
    cy.get(categoryFilter).select('Accessibility')
    cy.get('section[data-cy^="plugin-"]').should('have.length', 1)
    cy.contains('h2', 'Accessibility').should('be.visible')
    cy.get('[data-cy="plugin-cypress-axe"]').should('exist')
    cy.get('[data-cy="plugin-cypress-vite"]').should('not.exist')
  })

  it('filters by trust level and flags deprecated plugins', () => {
    cy.get(badgeFilter).select('Deprecated')
    cy.get('li.card').should('have.length.greaterThan', 0)
    // Every remaining card carries the deprecated badge (badge text is
    // lowercase in the DOM and only capitalized via CSS, so match loosely).
    cy.get('li.card').each(($card) => {
      cy.wrap($card)
        .contains(/deprecated/i)
        .should('exist')
    })
    // A known moved package is flagged with an explanatory notice.
    cy.get('[data-cy="plugin-cypress-testing-library"]')
      .contains(/deprecated/i)
      .should('exist')
    cy.get('[data-cy="plugin-cypress-testing-library"]').should(
      'contain',
      'moved'
    )
  })

  it('surfaces npm and version trust signals on a card', () => {
    cy.get(search).type('cucumber')
    cy.get('[data-cy="plugin-Cucumber"]').within(() => {
      cy.contains('Updated').should('be.visible')
      cy.contains('Cypress').should('be.visible')
      cy.get('a[href*="npmjs.com/package/"]').should('exist')
    })
  })

  it('opens plugin links in a new tab safely', () => {
    cy.get('[data-cy="plugin-cypress-axe"] h3 a')
      .should('have.attr', 'target', '_blank')
      .and('have.attr', 'rel', 'noopener noreferrer')
  })
})
