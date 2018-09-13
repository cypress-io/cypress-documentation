---
title: log:changed Event
---

The `log:changed` event fires whenever a command's attributes changes. This event is debounced to prevent it from firing too quickly and too often. Useful to see how internal cypress commands utilize the {% url 'Cypress.log()' cypress-log %} API.

# Environment

Occurs only in the **browser**.

# Arguments

* log attributes **(Object)**, whether Cypress is in interactive mode **(Boolean)**

# Usage

```javascript
Cypress.on('log:changed', (log) => {
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