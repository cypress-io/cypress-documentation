---
title: before:window:unload
---

The `before:window:unload` event fires when your application is about to navigate away. The real event object is provided to you. Your app may have set a `returnValue` on the event, which is useful to assert on.

# Environment

Event | {% url "Browser" catalog-of-events#Browser-Events %} | {% url "Background Process" background-process %}
--- | --- | ---
{% url `before:window:unload` before-window-unload-event %} | {% fa fa-check-circle green %} |

# Arguments

**{% fa fa-angle-right %} event** ***(Object)***

The `beforeunload` event.

# Usage

## In the browser

In a spec file or support file you can tap into the `before:window:unload` event. 

```js
cy.on('before:window:unload', (e) => {

})
```

# Examples

## Test that your application was redirected.

```javascript
// in your app
$('button').on('click', (e) => {
  // change the page programmatically
  window.location.href = '/some/new/link'
})

// in a test
it('redirects to another page on click', function (done) {
  // this event will automatically be unbound when this
  // test ends because it's attached to 'cy'
  cy.on('before:window:unload', (e) => {
    // no return value on the event
    expect(e.returnValue).to.be.undefined
  })

  cy.on('window:unload', (e) => {
    // using mocha's async done callback to finish
    // this test so we are guaranteed the application
    // was unloaded while navigating to the new page
    done()
  })

  // click the button causing the page redirect
  cy.get('button').click()
})
```

# See also

- {% url `before:window:load` before-window-load-event %}
- {% url `window:load` window-load-event %}
- {% url `window:unload` window-unload-event %}
