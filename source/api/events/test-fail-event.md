---
title: test:fail
---

The `test:fail` event fires when the test has failed. It is technically possible to prevent the test from actually failing by binding to this event and invoking an async `done` callback. However this is **strongly discouraged**. Tests should never legitimately fail. This event exists because it's extremely useful for debugging purposes.

# Environment

{% wrap_start 'event-environment' %}

Some events run in the {% url "browser" all-events#Browser-Events %}, some in the {% url "background process" background-process %}, and some in both.

Event | Browser | Background Process
--- | --- | ---
`test:fail` | {% fa fa-check-circle green %} | {% fa fa-times-circle grey %}

{% wrap_end %}

# Arguments

**{% fa fa-angle-right %} error** ***(Object)***

The error instance.

**{% fa fa-angle-right %} runnable** ***(Object)***

The Mocha runnable this failed on.

# Usage

## In the browser

### Debug the moment a test fails

In a spec file or support file you can tap into the `fail` event.

```javascript
// if you want to debug when a test fails, put this in the support file,
// or at the top of an individual spec file
Cypress.on('test:fail', (err, runnable) => {
  debugger

  // we now have access to the err instance
  // and the mocha runnable this failed on
  throw error // throw error to have test still fail
})

it('calls the "fail" callback when this test fails', function () {
  // when this cy.get() fails the callback is invoked
  // with the error
  cy.get('element-that-does-not-exist')
})
```

# See also

- {% url `internal:commandEnd` internal-commandend-event %}
- {% url `internal:commandRetry` internal-commandretry-event %}
- {% url `uncaught:exception` uncaught-exception-event %}
