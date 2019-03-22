---
title: window:&lt;event&gt;
---

You can use the `window:<event>` event to listen for arbitrary events on the page's `window`, where `<event>` is any event name that can be listened for on a page's `window`. This is the same as listening to the events with `window.addEventListener` with the following advantages:

* You can listen before the page has loaded (before `cy.visit`) and the listener will be bound once the page loads
* If the page changes or transitions, the listener will be re-bound when the new page loads
* If you listen with `cy.on` (as opposed to `Cypress.on`), the listener will be unbound when the test ends

There are a large number of events you can listen to. {% url "View this reference" https://developer.mozilla.org/en-US/docs/Web/Events %} for list of many of them.

# Environment

{% wrap_start 'event-environment' %}

Some events run in the {% url "browser" all-events#Browser-Events %}, some in the {% url "background process" background-process %}, and some in both.

Event | Browser | Background Process
--- | --- | ---
`window:<event>` | {% fa fa-check-circle green %} | {% fa fa-times-circle grey %}

{% wrap_end %}

# Arguments

**{% fa fa-angle-right %} event** ***(Object)***

The event object. The type of object and properties on the object depend on the event.

# Usage

To listen to an event on the window, prefix it with `window:`. For example, to listen to the `resize` event, listen to `window:resize`.

## In the browser

In a spec file or support file you can tap into the `window:<event>` event. In this example we listen to the `hashchange` event via `window:hashchange` in order to assert that the URL changed as expected.

```javascript
it('visits about when "about" is clicked', (done) => {
  cy.on('window:hashchange', (event) => {
    // event looks like:
    // {
    //   bubbles: false
    //   defaultPrevented: false
    //   newURL: "http://localhost:8080/index.html#about"
    //   oldURL: "http://localhost:8080/index.html"
    //   target: Window {...}
    //   type: "hashchange"
    //   ... more properties ...
    // }

    expect(event.newUrl).to.match(/about/)
    done()
  })

  cy.visit('http://localhost:8080/index.html')
  // this will navigate to #about and trigger a hashchange event
  cy.get('.nav .about').click()
})
```
