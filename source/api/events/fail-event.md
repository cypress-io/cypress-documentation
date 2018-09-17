---
title: fail Event
---

The `fail` event fires when the test has failed. It is technically possible to prevent the test from actually failing by binding to this event and invoking an async `done` callback. However this is **strongly discouraged**. Tests should never legitimately fail. This event exists because it's extremely useful for debugging purposes.

# Environment

Occurs only in the **browser**.

# Arguments

* the error **(Object)**
* mocha runnable **(Object)**

# Usage

Debug the moment a test fails.

```javascript
// if you want to debug when a test fails, put this in the support file, 
// or at the top of an individual spec file
Cypress.on('fail', (err, runnable) => {
  debugger

  // we now have access to the err instance
  // and the mocha runnable this failed on
})

it('calls the "fail" callback when this test fails', function () {
  // when this cy.get() fails the callback is invoked
  // with the error
  cy.get('element-that-does-not-exist')
})
```
