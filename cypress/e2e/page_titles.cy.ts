import sectionTitles from '../../src/sectionTitles'

const URLs: Array<string> = Cypress.expose('URLs')

// Optional: `cypress run --env limitPerSection=2` to spot-check a few pages
// per section instead of every page (useful for fast local iteration).
const limitPerSection: number = Cypress.expose('limitPerSection')

function selectUrls(urls: string[]): string[] {
  if (!limitPerSection) return urls
  const counts: Record<string, number> = {}
  return urls.filter((url) => {
    const section = url.split('/')[0]
    counts[section] = (counts[section] || 0) + 1
    return counts[section] <= limitPerSection
  })
}

// Every page title must end with " | <site or section suffix>":
//   accessibility/*  -> " | Cypress Accessibility Documentation"
//   ui-coverage/*    -> " | Cypress UI Coverage Documentation"
//   everything else  -> " | Cypress Documentation"
describe('Page titles have the correct appended suffix', () => {
  selectUrls(URLs).forEach((URL) => {
    it(`${URL}`, () => {
      const expectedSuffix = ` | ${sectionTitles.titleSuffixForUrl(URL)}`
      cy.visit(URL)
      cy.title().should((title) => {
        expect(
          title.endsWith(expectedSuffix),
          `title "${title}" should end with "${expectedSuffix}"`
        ).to.eq(true)
      })
    })
  })
})
