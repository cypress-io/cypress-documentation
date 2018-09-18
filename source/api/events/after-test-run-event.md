---
title: after:test:run
---

The `after:test:run` event fires after the test and all **afterEach** and **after** hooks run.

# Environment

Event | {% url "Browser" catalog-of-events#Browser-Events %} | {% url "Background Process" background-process %}
--- | --- | ---
{% url `after:test:run` after-test-run-event %} | {% fa fa-check-circle green %} | {% fa fa-check-circle green %}

# Arguments

**{% fa fa-angle-right %} test** ***(Object)***

Details of the test.

# Usage

## In the browser

In a spec file or support file you can tap into the `after:test:run` event.

```javascript
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

Using your {% url "`backgroundFile`" background-process %} you can tap into the `after:test:run` event.

```javascript
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

# See also

- {% url `before:test:run` before-test-run-event %}
- {% url `fail` fail-event %}
- {% url 'Module API' module-api %}
