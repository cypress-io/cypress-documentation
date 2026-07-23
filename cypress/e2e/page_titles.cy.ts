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

const PAGES_PER_TEST = 50

function titleFromHtml(html: string): string {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/)
  return match ? match[1].trim() : ''
}

// Every page title must end with " | <site or section suffix>":
//   accessibility/*  -> " | Cypress Accessibility Documentation"
//   ui-coverage/*    -> " | Cypress UI Coverage Documentation"
//   everything else  -> " | Cypress Documentation"
describe('Page titles have the correct appended suffix', () => {
  const urlsBySection: Record<string, string[]> = {}
  selectUrls(URLs).forEach((url) => {
    const section = url.split('/')[0]
    ;(urlsBySection[section] = urlsBySection[section] || []).push(url)
  })

  Object.entries(urlsBySection).forEach(([section, urls]) => {
    const batches: string[][] = []
    for (let i = 0; i < urls.length; i += PAGES_PER_TEST) {
      batches.push(urls.slice(i, i + PAGES_PER_TEST))
    }

    batches.forEach((batch, i) => {
      const name =
        batches.length > 1
          ? `${section} (${i + 1}/${batches.length}, ${batch.length} pages)`
          : `${section} (${batch.length} pages)`

      it(name, () => {
        const failures: string[] = []

        batch.forEach((URL) => {
          const expectedSuffix = ` | ${sectionTitles.titleSuffixForUrl(URL)}`
          cy.request({ url: URL, log: false }).then((response) => {
            const title = titleFromHtml(response.body)
            if (!title.endsWith(expectedSuffix)) {
              failures.push(
                `${URL}: title "${title}" should end with "${expectedSuffix}"`
              )
            }
          })
        })

        cy.then(() => {
          expect(
            failures.length,
            failures.length
              ? `${failures.length} page(s) with a bad title:\n${failures.join('\n')}`
              : 'all titles correct'
          ).to.eq(0)
        })
      })
    })
  })
})

describe('Page titles survive hydration (one page per suffix)', () => {
  const samples: Record<string, string> = {}
  URLs.forEach((url) => {
    const suffix = sectionTitles.titleSuffixForUrl(url)
    if (!samples[suffix]) samples[suffix] = url
  })

  Object.entries(samples).forEach(([suffix, URL]) => {
    it(`${URL}`, () => {
      cy.visit(URL)
      cy.title().should((title) => {
        expect(
          title.endsWith(` | ${suffix}`),
          `title "${title}" should end with " | ${suffix}"`
        ).to.eq(true)
      })
    })
  })
})
