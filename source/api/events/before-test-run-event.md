---
title: before:test:run
---

The `before:test:run` event fires before the test and all **before** and **beforeEach** hooks run.

# Environment

Event | {% url "Browser" catalog-of-events#Browser-Events %} | {% url "Background Process" background-process %}
--- | --- | ---
{% url `before:test:run` before-test-run-event %} | {% fa fa-check-circle green %} | {% fa fa-check-circle green %}

# Arguments

**{% fa fa-angle-right %} test** ***(Object)***

Details of the test.

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
