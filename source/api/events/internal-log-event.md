---
title: internal:log
---

The `internal:log` event fires whenever a command emits this event so it can be displayed in the Command Log. Useful to see how internal cypress commands utilize the {% url 'Cypress.log()' cypress-log %} API.

# Environment

{% wrap_start 'event-environment' %}

Some events run in the {% url "browser" all-events#Browser-Events %}, some in the {% url "background process" background-process %}, and some in both.

Event | Browser | Background Process
--- | --- | ---
`internal:log` | {% fa fa-check-circle green %} | {% fa fa-times-circle grey %}

{% wrap_end %}

# Arguments

**{% fa fa-angle-right %} log** ***(Object)***

The log attributes.

# Usage

## In the browser

In a spec file or support file you can tap into the `internal:log` event.

```javascript
Cypress.on('internal:log', (log) => {
  // log looks something like this:
  //  {
  //     name: 'get',
  //     type: 'parent',
  //     message: '#foo',
  //     state: 'pending',
  //     instrument: 'command',
  //     ... more properties ...
  //  }
})
```

# See also

- {% url `cy.log()` log %}
- {% url `Cypress.log` cypress-log %}
- {% url `internal:logChange` internal-logchange-event %}
