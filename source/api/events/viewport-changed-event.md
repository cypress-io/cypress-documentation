---
title: viewport:changed
---

The `viewport:changed` event fires whenever the viewport changes via a `cy.viewport()` or naturally when Cypress resets the viewport to the default between tests. Useful for debugging purposes.

# Environment

Event | {% url "Browser" catalog-of-events#Browser-Events %} | {% url "Background Process" background-process %}
--- | --- | ---
{% url `viewport:changed` viewport-changed-event %} | {% fa fa-check-circle green %} |

# Arguments

* new viewport dimensions **(Object)**

# Usage

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