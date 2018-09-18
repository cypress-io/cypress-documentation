---
title: log:changed
---

The `log:changed` event fires whenever a command's attributes changes. This event is debounced to prevent it from firing too quickly and too often. Useful to see how internal cypress commands utilize the {% url 'Cypress.log()' cypress-log %} API.

# Environment

Event | {% url "Browser" catalog-of-events#Browser-Events %} | {% url "Background Process" background-process %}
--- | --- | ---
{% url `log:changed` log-changed-event %} | {% fa fa-check-circle green %} |

# Arguments

**{% fa fa-angle-right %} log** ***(Object)***

The log attributes.

**{% fa fa-angle-right %} interactiveMode** ***(Boolean)***

Whether Cypress is in interactive mode.

# Usage

```javascript
Cypress.on('log:changed', (log, interactiveMode) => {
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