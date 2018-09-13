---
title: window:load Event
---

The `window:load` event fires after all your resources have finished loading after a page transition. This fires at the exact same time as a `cy.visit()` `onLoad` callback.

# Environment

Occurs only in the **browser**.

# Arguments

* the remote window **(Object)**

# Usage

```javascript
it('listens for window:load', function () {
  cy.on('window:load', (win) => {
    // window is the newly loaded window
  })

  cy.visit('/test.html')
})
```
