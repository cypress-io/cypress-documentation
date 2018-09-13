---
title: before:test:run Event
---

The `before:test:run` event fires before the test and all **before** and **beforeEach** hooks run.

# Environment

Occurs in the **browser** and in the {% url "background process" background-process %}.

# Arguments Received

* test attributes **(Object)**

# Usage

## In the browser

```javascript
// in a test or cypress/support/index.js

Cypress.on('before:test:run', (test) => {
  // test looks something like this:
  // {
  //   body: 'function () {\nexpect('login').to.work;\n}',
  //   title: 'login works',
  //   type: 'test',
  //   // ...more properties...
  // }
})
```

## In the background process

```javascript
// cypress/background/index.js

module.exports = (on, config) => {
  on('before:test:run', (test) => {
  // test looks something like this:
  // {
  //   body: 'function () {\nexpect('login').to.work;\n}',
  //   title: 'login works',
  //   type: 'test',
  //   // ...more properties...
  // }
  })
}
```
