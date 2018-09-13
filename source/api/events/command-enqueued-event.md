---
title: command:enqueued Event
---

The `command:enqueued` event fires when a cy command is first invoked and enqueued to be run later. Useful for debugging purposes if you're confused about the order in which commands will execute.

# Environment

Occurs in the **browser** and in the {% url "background process" background-process %}.

# Arguments

* command properties **(Object)**

# Usage

## In the browser

```javascript
// in a test or cypress/support/index.js

Cypress.on('command:enqueued', (command) => {
  // command looks something like this:
  // {
  //   name: 'get',
  //   args: ['#foo'],
  //   type: 'parent'
  // }
})
```

## In the background process

```javascript
// cypress/background/index.js

module.exports = (on, config) => {
  on('command:enqueued', (command) => {
    // command looks something like this:
    // {
    //   name: 'get',
    //   args: ['#foo'],
    // }
  })
}
```
