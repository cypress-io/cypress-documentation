// Code samples for the shared sitemap-scan example partial
// (`_sitemap-scan-example.mdx`). They live in this module rather than inline in
// the MDX so that Prettier formats them as plain strings and does not reflow the
// embedded JavaScript.

type Product = 'ui-coverage' | 'accessibility'

export const copy: Record<Product, { name: string; reportKind: string }> = {
  'ui-coverage': { name: 'UI Coverage', reportKind: 'coverage' },
  accessibility: { name: 'Cypress Accessibility', reportKind: 'accessibility' },
}

export const singleTestCode: Record<Product, string> = {
  'ui-coverage': `describe('UI Coverage Scan', () => {
  it('Checks UI Coverage against the URLs in sitemap.xml', () => {
    cy.request('https://<YOUR_WEBSITE>/sitemap.xml').then((response) => {
      const parser = new DOMParser()
      const xml = parser.parseFromString(response.body, 'application/xml')
      const urls = [...xml.querySelectorAll('loc')].map(
        (loc) => loc.textContent
      )

      urls.forEach((url) => {
        // UI Coverage captures the interactive elements on each page you visit
        cy.visit(url)
      })
    })
  })
})`,
  accessibility: `describe('Accessibility Scan', () => {
  it('Checks accessibility against the URLs in sitemap.xml', () => {
    cy.request('https://<YOUR_WEBSITE>/sitemap.xml').then((response) => {
      const parser = new DOMParser()
      const xml = parser.parseFromString(response.body, 'application/xml')
      const urls = [...xml.querySelectorAll('loc')].map(
        (loc) => loc.textContent
      )

      urls.forEach((url) => {
        // Cypress Accessibility captures the accessibility state of each page
        cy.visit(url)

        // Optional: only needed when content appears as you scroll (lazy-loaded
        // images, infinite lists). Test Replay already captures the full page.
        cy.contains('<YOUR_FOOTER_CONTENT>').scrollIntoView()
      })
    })
  })
})`,
}

export const separateTestCode: Record<Product, string> = {
  'ui-coverage': `const urls = ['/', '/about-us', '/pricing', '/contact', '/request-trial']

describe('UI Coverage Scan', () => {
  urls.forEach((url) => {
    it(\`Visits \${url}\`, () => {
      // UI Coverage captures the interactive elements on this page
      cy.visit(url)
    })
  })
})`,
  accessibility: `const urls = ['/', '/about-us', '/pricing', '/contact', '/request-trial']

describe('Accessibility Scan', () => {
  urls.forEach((url) => {
    it(\`Visits \${url}\`, () => {
      // Cypress Accessibility captures the accessibility state of this page
      cy.visit(url)
    })
  })
})`,
}
