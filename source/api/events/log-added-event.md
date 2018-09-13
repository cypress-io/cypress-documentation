---
title: log:added Event
---

The `log:added` event fires whenever a command emits this event so it can be displayed in the Command Log. Useful to see how internal cypress commands utilize the {% url 'Cypress.log()' cypress-log %} API.

# Environment

Occurs only in the **browser**.

# Arguments

* log attributes **(Object)**

# Usage

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