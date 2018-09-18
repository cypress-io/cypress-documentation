---
title: before:window:load
---

The `before:window:load` event fires as the page begins to load, but before any of your application's JavaScript has executed. This fires immediately after the `cy.visit()` `onBeforeLoad` callback. Useful to modify the window on a page transition.

# Environment

Event | {% url "Browser" catalog-of-events#Browser-Events %} | {% url "Background Process" background-process %}
--- | --- | ---
{% url `before:window:load` before-window-load-event %} | {% fa fa-check-circle green %} |

# Arguments

**{% fa fa-angle-right %} window** ***(Object)***

The remote window

# Usage

## In the browser

In a spec file or support file you can tap into the `before:window:load` event.

```js
cy.on('before:window:load', (win) => {

})
```

# Examples

## Stub a global variable before window loads or after page transitions

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

# See also

- {% url `before:window:unload` before-window-unload-event %}
- {% url `window:load` window-load %}
- {% url `window:unload` window-unload %}
