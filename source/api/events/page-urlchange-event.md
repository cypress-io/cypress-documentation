---
title: page:urlChange
---

The `page:urlChange` event fires whenever Cypress detects that your application's URL has changed.

# Environment

{% wrap_start 'event-environment' %}

Some events run in the {% url "browser" all-events#Browser-Events %}, some in the {% url "background process" background-process %}, and some in both.

Event | Browser | Background Process
--- | --- | ---
`page:urlChange` | {% fa fa-check-circle green %} | {% fa fa-times-circle grey %}

{% wrap_end %}

# Arguments

**{% fa fa-angle-right %} url** ***(String)***

The new url.

# Usage

## In the browser

In a spec file or support file you can tap into the `page:urlChange` event.

```javascript
Cypress.on('page:urlChange', (url) => {
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
