---
title: before:window:load Event
---

The `before:window:load` event fires as the page begins to load, but before any of your application's JavaScript has executed. This fires immediately after the `cy.visit()` `onBeforeLoad` callback. Useful to modify the window on a page transition.

# Environment

Occurs only in the **browser**.

# Arguments

* the remote window **(Object)**

# Usage

This example demonstrates stubbing a global variable before the window loads originally or after page transitions.

```javascript
it('can modify the window prior to page load on all pages', function () {
  const stub = cy.stub()

  // prevent google analytics from loading and replace it with a stub before
  // every single page load including all new page navigations
  cy.on('before:window:load', (win) => {
    Object.defineProperty(win, 'ga', {
      configurable: false,
      writeable: false,
      get: () => stub // always return the stub
    })
  })

  cy
    // before:window:load will be called here
    .visit('/first/page')
    .then((win) => {
      // and here
      win.location.href = '/second/page'
    })
    // and here
    .get('a').click()
})
```
