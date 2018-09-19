---
title: url:changed
---

The `url:changed` event fires whenever Cypress detects that your application's URL has changed.

# Environment

Event | {% url "Browser" catalog-of-events#Browser-Events %} | {% url "Background Process" background-process %}
--- | --- | ---
`url:changed` | {% fa fa-check-circle green %} |

# Arguments

**{% fa fa-angle-right %} url** ***(String)***

The new url.

# Usage

## In the browser

In a spec file or support file you can tap into the `url:changed` event.

```javascript
Cypress.on('url:changed', (url) => {
  // will be called once with url equal to 'http://<url>/page1.html'
  // and again with url equal to 'http://<url>/page2.html'
})

it('clicks links to new page', () => {
  cy.visit('/page1.html')
  cy.get('a[href="/page2.html"]').click()
})
```

# See also

- {% url `cy.location` location %}
- {% url `cy.url` url %}
