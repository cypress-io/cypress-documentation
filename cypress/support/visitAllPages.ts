// Shared helper for the "visit every page" specs. These exist mostly to
// generate UI Coverage and Accessibility reports in Cypress Cloud.
//
// Large sections are split into chunks so Cypress Cloud can load-balance them
// across parallel containers instead of one container walking every page in a
// section. `chunk`/`chunks` select an evenly-distributed slice of the section.
export function visitAllPages(section: string, chunk = 0, chunks = 1) {
  const URLs: Array<string> = Cypress.expose('URLs')

  const pages = URLs.filter((URL) => URL.startsWith(section)).filter(
    (_, index) => index % chunks === chunk
  )

  const suffix = chunks > 1 ? ` (${chunk + 1}/${chunks})` : ''

  describe(`Visit ${section} pages${suffix}`, () => {
    pages.forEach((URL) => {
      it(`Visit ${URL} `, () => {
        cy.visit(URL)
        cy.get('h1').should('be.visible').and('not.have.text', 'Page Not Found')

        cy.get('[aria-label="Switch to dark mode"]').click()
      })
    })
  })
}
