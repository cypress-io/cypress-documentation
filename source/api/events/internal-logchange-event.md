---
title: internal:logChange
---

The `internal:logChange` event fires whenever a command's attributes changes. This event is debounced to prevent it from firing too quickly and too often. Useful to see how internal cypress commands utilize the {% url 'Cypress.log()' cypress-log %} API.

# Environment

{% wrap_start 'event-environment' %}

Some events run in the {% url "browser" all-events#Browser-Events %}, some in the {% url "background process" background-process %}, and some in both.

Event | Browser | Background Process
--- | --- | ---
`internal:logChange` | {% fa fa-check-circle green %} | {% fa fa-times-circle grey %}

{% wrap_end %}

# Arguments

**{% fa fa-angle-right %} log** ***(Object)***

The log attributes.

**{% fa fa-angle-right %} interactiveMode** ***(Boolean)***

Whether Cypress is in interactive mode.

# Usage

## In the browser

In a spec file or support file you can tap into the `internal:logChange` event.

```javascript
Cypress.on('internal:logChange', (log, interactiveMode) => {
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
- {% url `internal:log` internal-log-event %}
