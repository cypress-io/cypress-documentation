// Links toward a possible conversion, or toward an existing Cypress Cloud
// account, carry a Fullstory label naming where on the page they sit and where
// they lead, plus their utm_medium as a typed property. Fullstory reports a
// click on a nested element (inline code, an icon) under that element, so
// each descendant has to carry the same attributes as the link.
const SCHEMA = '{"data-link-placement":"str"}'

function shouldBeLabeled(
  $link: JQuery<HTMLElement>,
  label: string,
  placement: string
) {
  const elements = [$link[0], ...Array.from($link[0].querySelectorAll('*'))]
  elements.forEach((element) => {
    const name = element.tagName.toLowerCase()
    expect(element.getAttribute('data-fs-element'), name).to.eq(label)
    expect(element.getAttribute('data-link-placement'), name).to.eq(placement)
    expect(element.getAttribute('data-fs-properties-schema'), name).to.eq(
      SCHEMA
    )
  })
}

function link(selector: string, text?: string) {
  return text ? cy.contains(selector, text) : cy.get(selector)
}

describe('Fullstory conversion link labels', () => {
  it('labels a pricing link in the article body', () => {
    cy.visit('/cloud/get-started/free-trial')
    link('.theme-doc-markdown a', 'Enterprise plan').should(($link) =>
      shouldBeLabeled($link, 'Docs Content - Pricing', 'free-trial')
    )
  })

  it('labels a button link and its icon', () => {
    cy.visit('/cloud/get-started/introduction')
    link(
      '.theme-doc-markdown a[href="https://cloud.cypress.io/projects/7s5okt"]'
    )
      .first()
      .should(($link) => {
        expect($link.find('svg path')).to.have.length.at.least(1)
        shouldBeLabeled($link, 'Docs Content - Open Cloud', 'none')
      })
  })

  // No conversion link in the docs wraps inline code today, so the test adds
  // one to the article, then changes the route's hash so the client module's
  // route-change pass labels it, as it would a Markdown link like
  // [`cypress open`](https://cloud.cypress.io/login).
  it('labels a link with inline code inside it, and its <code>', () => {
    cy.visit('/cloud/get-started/free-trial')
    cy.get('.theme-doc-markdown p')
      .first()
      .then(($p) => {
        $p.append(
          '<a id="code-link" href="https://cloud.cypress.io/login?utm_medium=cli-tip"><code>cypress open</code></a>'
        )
      })
    cy.get('#code-link').should('not.have.attr', 'data-fs-element')
    cy.window().then((win) => {
      win.location.hash = 'code-link'
    })
    cy.get('#code-link').should(($link) => {
      expect($link.find('code')).to.have.length(1)
      shouldBeLabeled($link, 'Docs Content - Cloud Log In', 'cli-tip')
    })
  })

  it('labels a link to the free trial guide, without a utm_medium', () => {
    cy.visit('/app/guides/cypress-studio')
    link('.theme-doc-markdown a', '30-day trial').should(($link) =>
      shouldBeLabeled($link, 'Docs Content - Free Trial Guide', 'none')
    )
  })

  it('labels links to Cypress Cloud', () => {
    cy.visit('/app/references/error-messages')
    link('.theme-doc-markdown a[href="https://on.cypress.io/cloud"]')
      .first()
      .should(($link) =>
        shouldBeLabeled($link, 'Docs Content - Open Cloud', 'none')
      )
  })

  it('labels the trial button and product heading, and not the demo button', () => {
    cy.visit('/accessibility/get-started/introduction')
    link('.theme-doc-markdown a', 'Request trial').should(($link) =>
      shouldBeLabeled($link, 'Docs Content - Request Trial', 'intro-cta')
    )
    link('.theme-doc-markdown a[href*="utm_medium=product-heading-"]').should(
      ($link) =>
        shouldBeLabeled(
          $link,
          'Docs Content - Product - Accessibility',
          'product-heading-accessibility'
        )
    )
    link('.theme-doc-markdown a', 'See a demo').should(
      'not.have.attr',
      'data-fs-element'
    )
  })

  it('labels the links on a page reached by a client-side route change', () => {
    cy.visit('/app/guides/cypress-studio')
    cy.window().then((win) => {
      ;(win as any).beforeRouteChange = true
    })
    cy.contains('.theme-doc-markdown a', '30-day trial').click()
    cy.location('pathname').should(
      'match',
      /^\/cloud\/get-started\/free-trial\/?$/
    )
    // Still the same document, so the route-change pass did the labeling.
    cy.window().its('beforeRouteChange').should('eq', true)
    link('.theme-doc-markdown a', 'Cypress Cloud Savings Calculator').should(
      ($link) =>
        shouldBeLabeled(
          $link,
          'Docs Content - Savings Calculator',
          'free-trial'
        )
    )
  })

  it('labels a footer link and its external-link icon', () => {
    cy.visit('/app/get-started/why-cypress')
    link('.footer a', 'Cypress Cloud').should(($link) => {
      expect($link.find('svg')).to.have.length(1)
      shouldBeLabeled($link, 'Docs Footer - Product - Cloud', 'footer')
    })
    link('.footer a', 'Careers').should('not.have.attr', 'data-fs-element')
  })

  // No What's New item leads to a conversion page today, so the test swaps
  // the first app item's href for a pricing link in the served JavaScript.
  // What's New renders only in the browser, so there's no server-rendered
  // HTML to disagree with.
  it('labels a What’s New link in the sidebar and its descendants', () => {
    const pricing =
      'https://www.cypress.io/pricing?utm_medium=nav-promo&utm_source=docs.cypress.io'
    cy.wrap(
      Cypress.automation('remote:debugger:protocol', {
        command: 'Network.clearBrowserCache',
      })
    )
    cy.intercept('GET', '/assets/js/*.js', (req) => {
      req.continue((res) => {
        if (typeof res.body === 'string') {
          res.body = res.body.replace(
            '"/app/tooling/cypress-tap"',
            JSON.stringify(pricing)
          )
        }
      })
    })
    cy.visit('/app/get-started/why-cypress')
    link('.theme-doc-sidebar-container a', 'Tap CLI').should(($link) => {
      expect($link.attr('href')).to.eq(pricing)
      expect($link.find('span')).to.have.length.at.least(3)
      shouldBeLabeled($link, 'Docs Sidebar - Pricing', 'nav-promo')
    })
    link('.theme-doc-sidebar-container a', 'Cypress Studio AI').should(
      'not.have.attr',
      'data-fs-element'
    )
  })
})
