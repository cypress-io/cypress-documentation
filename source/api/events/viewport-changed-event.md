---
title: viewport:changed
---

The `viewport:changed` event fires whenever the viewport changes via a `cy.viewport()` or naturally when Cypress resets the viewport to the default between tests. Useful for debugging purposes.

# Environment

Some events run in the {% url "browser" all-events#Browser-Events %}, some in the {% url "background process" background-process %}, and some in both.

Event | Browser | Background Process
--- | --- | ---
`viewport:changed` | {% fa fa-check-circle green %} | {% fa fa-times-circle grey %}

# Arguments

**{% fa fa-angle-right %} viewport** ***(String)***

The new viewport dimensions.

# Usage

## In the browser

In a spec file or support file you can tap into the `viewport:changed` event.

```javascript
Cypress.on('viewport:changed', (viewport) => {
  // viewport is:
  //  {
  //    viewportHeight: 400,
  //    viewportWidth: 500,
  //  }
})

it('changes the viewport', () => {
  cy.viewport(500, 400)
})
```

# See also

- {% url `cy.viewport` viewport %}
