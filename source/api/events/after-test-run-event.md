---
title: after:test:run Event
---

The `after:test:run` event fires after the test and all **afterEach** and **after** hooks run.

# Environment

Occurs in the **browser** and in the {% url "background process" background-process %}.

# Arguments Received

* test attributes **(Object)**

# Usage

## In the browser

```javascript
// in a test or cypress/support/index.js

Cypress.on('after:test:run', (test) => {
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
  on('after:test:run', (test) => {
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
