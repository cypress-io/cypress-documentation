---
title: window:load
---

The `window:load` event fires after all your resources have finished loading after a page transition. This fires at the exact same time as a `cy.visit()` `onLoad` callback.

# Environment

Event | {% url "Browser" catalog-of-events#Browser-Events %} | {% url "Background Process" background-process %}
--- | --- | ---
{% url `window:load` window-load-event %} | {% fa fa-check-circle green %} |

# Arguments

**{% fa fa-angle-right %} window** ***(Object)***

The remote window

# Usage

## In the browser

In a spec file or support file you can tap into the `window:load` event.

```javascript
it('listens for window:load', function () {
  cy.on('window:load', (win) => {
    // window is the newly loaded window
  })

  cy.visit('/test.html')
})
```
