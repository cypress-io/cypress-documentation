---
title: log:added
---

The `log:added` event fires whenever a command emits this event so it can be displayed in the Command Log. Useful to see how internal cypress commands utilize the {% url 'Cypress.log()' cypress-log %} API.

# Environment

Some events run in the {% url "browser" catalog-of-events#Browser-Events %}, some in the {% url "background process" background-process %}, and some in both. {% url "See all events" catalog-of-events#Environment %}.

Event | Browser | Background Process
--- | --- | ---
`log:added` | {% fa fa-check-circle green %} | {% fa fa-times-circle grey %}

# Arguments

**{% fa fa-angle-right %} log** ***(Object)***

The log attributes.

# Usage

## In the browser

In a spec file or support file you can tap into the `log:added` event.

```javascript
Cypress.on('log:added', (log) => {
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
- {% url `log:changed` log-changed-event %}