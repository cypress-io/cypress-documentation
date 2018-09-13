---
title: url:changed Event
---

The `url:changed` event fires whenever Cypress detects that your application's URL has changed.

# Environment

Occurs only in the **browser**.

# Arguments

* the new url **(String)**

# Usage

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
