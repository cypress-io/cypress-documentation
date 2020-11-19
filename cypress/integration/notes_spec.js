describe('notes plugin', () => {
  beforeEach(() => {
    cy.visit('guides/references/configuration.html')
  })

  it('notes render', () => {
    cy.get('blockquote.note')
  })
})
