---
title: test:start
---

The `test:start` event fires before the test and all **before** and **beforeEach** hooks run.

# Environment

{% wrap_start 'event-environment' %}

Some events run in the {% url "browser" all-events#Browser-Events %}, some in the {% url "background process" background-process %}, and some in both.

Event | Browser | Background Process
--- | --- | ---
`test:start` | {% fa fa-check-circle green %} | {% fa fa-check-circle green %}

{% wrap_end %}

# Arguments

**{% fa fa-angle-right %} test** ***(Object)***

Details of the test.

# Usage

## In the browser

In a spec file or support file you can tap into the `test:start` event.

```javascript
Cypress.on('test:start', (test) => {
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

Using your {% url "`backgroundFile`" background-process %} you can tap into the `test:start` event.

```javascript
module.exports = (on, config) => {
  on('test:start', (test) => {
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

- {% url `test:end` test-end-event %}
