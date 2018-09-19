---
title: before:test:run
---

The `before:test:run` event fires before the test and all **before** and **beforeEach** hooks run.

# Environment

Event | {% url "Browser" catalog-of-events#Browser-Events %} | {% url "Background Process" background-process %}
--- | --- | ---
`before:test:run` | {% fa fa-check-circle green %} | {% fa fa-check-circle green %}

# Arguments

**{% fa fa-angle-right %} test** ***(Object)***

Details of the test.

# Usage

## In the browser

In a spec file or support file you can tap into the `before:test:run` event.

```javascript
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

Using your {% url "`backgroundFile`" background-process %} you can tap into the `before:test:run` event.

```javascript
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

# See also

- {% url `after:test:run` after-test-run-event %}
