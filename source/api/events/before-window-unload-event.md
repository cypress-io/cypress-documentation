---
title: before:window:unload
---

The `before:window:unload` event fires when your application is about to navigate away. The real event object is provided to you. Your app may have set a `returnValue` on the event, which is useful to assert on.

# Environment

{% wrap_start 'event-environment' %}

Some events run in the {% url "browser" all-events#Browser-Events %}, some in the {% url "background process" background-process %}, and some in both.

Event | Browser | Background Process
--- | --- | ---
`before:window:unload` | {% fa fa-check-circle green %} | {% fa fa-times-circle grey %}

{% wrap_end %}

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

  cy.on('page:end', (e) => {
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

- {% url `page:start` page-start-event %}
- {% url `page:ready` page-ready-event %}
- {% url `page:end` page-end-event %}
