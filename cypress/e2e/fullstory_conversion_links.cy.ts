// Links toward a possible conversion, or toward an existing Cypress Cloud
// account, carry a Fullstory label naming where on the page they sit and where
// they lead, plus their utm_medium as a typed property. The labels are built
// into the HTML (plugins/fullstory-conversion-links-rehype.js for Markdown,
// the components and docusaurus.config.js for the rest), and a pointer-events
// rule sends clicks on a link's nested elements to the labeled link.
const SCHEMA = '{"data-link-placement":"str"}'

function expectLabel(link: Element, label: string, placement: string) {
  expect(link.getAttribute('data-fs-element'), 'label').to.eq(label)
  expect(link.getAttribute('data-link-placement'), 'placement').to.eq(placement)
  expect(link.getAttribute('data-fs-properties-schema'), 'schema').to.eq(SCHEMA)
}

// The server-rendered HTML, which is what every client render starts from.
function serverRendered(path: string) {
  return cy
    .request(path)
    .its('body')
    .then((html: string) => new DOMParser().parseFromString(html, 'text/html'))
}

function linkByText(doc: Document, selector: string, text: string) {
  const link = Array.from(doc.querySelectorAll(selector)).find((a) =>
    a.textContent?.includes(text)
  )
  // Not .to.exist: Cypress treats an element outside the page as missing.
  expect(link, `${selector} "${text}"`).not.to.be.undefined
  return link!
}

// Clear of the sticky navbar, so elementFromPoint finds the link.
function scrollToCenter($link: JQuery<HTMLElement>) {
  $link[0].scrollIntoView({ block: 'center' })
  return $link
}

// A click anywhere on a visible nested element reaches the link itself.
function expectClicksLandOnLink($link: JQuery<HTMLElement>) {
  const visible = Array.from($link[0].querySelectorAll('*')).filter((child) => {
    const box = child.getBoundingClientRect()
    return box.width > 0 && box.height > 0
  })
  // Fails rather than passing with nothing to check.
  expect(visible.length, 'visible nested elements').to.be.greaterThan(0)
  visible.forEach((child) => {
    const box = child.getBoundingClientRect()
    const hit = child.ownerDocument.elementFromPoint(
      box.left + box.width / 2,
      box.top + box.height / 2
    )
    expect(hit, child.tagName.toLowerCase()).to.eq($link[0])
  })
}

describe('Fullstory conversion link labels', () => {
  describe('in the server-rendered HTML', () => {
    it('labels Markdown links by destination and placement', () => {
      serverRendered('/cloud/get-started/free-trial').then((doc) => {
        expectLabel(
          linkByText(doc, '.theme-doc-markdown a', 'Enterprise plan'),
          'Docs Content - Pricing',
          'free-trial'
        )
        expectLabel(
          linkByText(
            doc,
            '.theme-doc-markdown a',
            'Cypress Cloud Savings Calculator'
          ),
          'Docs Content - Savings Calculator',
          'free-trial'
        )
        // The page's own table of contents is not a link to the guide.
        doc.querySelectorAll('a[href^="#"]').forEach((a) => {
          expect(a.getAttribute('data-fs-element'), a.outerHTML).to.be.null
        })
      })
      serverRendered('/app/guides/cypress-studio').then((doc) => {
        expectLabel(
          linkByText(doc, '.theme-doc-markdown a', '30-day trial'),
          'Docs Content - Free Trial Guide',
          'none'
        )
      })
      serverRendered('/app/references/error-messages').then((doc) => {
        expectLabel(
          doc.querySelector(
            '.theme-doc-markdown a[href="https://on.cypress.io/cloud"]'
          )!,
          'Docs Content - Open Cloud',
          'none'
        )
      })
    })

    it('labels the trial button and product heading, and not the demo button', () => {
      serverRendered('/accessibility/get-started/introduction').then((doc) => {
        expectLabel(
          linkByText(doc, '.theme-doc-markdown a', 'Request trial'),
          'Docs Content - Request Trial',
          'intro-cta'
        )
        expectLabel(
          doc.querySelector(
            '.theme-doc-markdown a[href*="utm_medium=product-heading-"]'
          )!,
          'Docs Content - Product - Accessibility',
          'product-heading-accessibility'
        )
        expect(
          linkByText(doc, '.theme-doc-markdown a', 'See a demo').getAttribute(
            'data-fs-element'
          )
        ).to.be.null
      })
    })

    it('labels footer and sidebar links', () => {
      serverRendered('/cloud/get-started/introduction').then((doc) => {
        expectLabel(
          linkByText(doc, '.footer a', 'Cypress Cloud'),
          'Docs Footer - Product - Cloud',
          'footer'
        )
        expect(
          linkByText(doc, '.footer a', 'Careers').getAttribute(
            'data-fs-element'
          )
        ).to.be.null
        expectLabel(
          doc.querySelector(
            '.theme-doc-sidebar-container a[href="/cloud/get-started/free-trial"]'
          )!,
          'Docs Sidebar - Free Trial Guide',
          'none'
        )
      })
    })
  })

  describe('in the browser', () => {
    it('sends clicks on a button’s icon to the labeled link', () => {
      cy.visit('/cloud/get-started/introduction')
      cy.get(
        '.theme-doc-markdown a[href="https://cloud.cypress.io/projects/7s5okt"]'
      )
        .first()
        .then(scrollToCenter)
        .should(($link) => {
          expectLabel($link[0], 'Docs Content - Open Cloud', 'none')
          expectClicksLandOnLink($link)
        })
    })

    it('labels links on a page reached by client-side navigation', () => {
      cy.visit('/app/guides/cypress-studio')
      cy.window().then((win) => {
        ;(win as any).beforeNavigation = true
      })
      cy.contains('.theme-doc-markdown a', '30-day trial').click()
      cy.location('pathname').should(
        'match',
        /^\/cloud\/get-started\/free-trial\/?$/
      )
      // Still the same document, so React rendered this page, not the server.
      cy.window().its('beforeNavigation').should('eq', true)
      cy.contains('.theme-doc-markdown a', 'Enterprise plan').should(($link) =>
        expectLabel($link[0], 'Docs Content - Pricing', 'free-trial')
      )
    })

    // The mobile drawer renders only once it's opened.
    it('labels a sidebar link in the mobile drawer', () => {
      cy.viewport('iphone-x')
      cy.visit('/cloud/get-started/introduction')
      cy.get('.navbar__toggle').click()
      cy.get('.navbar-sidebar a[href="/cloud/get-started/free-trial"]').should(
        ($link) =>
          expectLabel($link[0], 'Docs Sidebar - Free Trial Guide', 'none')
      )
    })
  })
})
