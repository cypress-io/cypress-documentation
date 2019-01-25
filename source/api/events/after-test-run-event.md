---
title: after:test:run
---

The `after:test:run` event fires after the test and all **afterEach** and **after** hooks run.

# Environment

{% wrap_start 'event-environment' %}

Some events run in the {% url "browser" all-events#Browser-Events %}, some in the {% url "background process" background-process %}, and some in both.

Event | Browser | Background Process
--- | --- | ---
`after:test:run` | {% fa fa-check-circle green %} | {% fa fa-check-circle green %}

{% wrap_end %}

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

- {% url `test:start` test-start-event %}
- {% url `fail` fail-event %}
- {% url 'Module API' module-api %}
