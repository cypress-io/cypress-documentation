---
title: command:start Event
---

The `command:start` event fires when cy begins actually running and executing your command. Useful for debugging and understanding how the command queue is async.

# Environment

Occurs in the **browser** and in the {% url "background process" background-process %}.

# Arguments

* command **(Object)**

# Usage

## In the browser

In the browser, the argument is the actual command instance.

```javascript
// in a test or cypress/support/index.js

Cypress.on('command:start', (command) => {
  command.get('name') // => 'get'
  command.get('args') // => ['#foo']
  command.get('subject') // => jQuery(<div#foo />)
  // command instance has the following properties you can 'get':
  // - name
  // - args
  // - subject
  // - type
  // ... and more ...
})
```

## In the background process

In the background process, the argument is a pared-down, serialized version of the command.

```javascript
// cypress/background/index.js

module.exports = (on, config) => {
  on('command:start', (command) => {
    // command looks something like this:
    // {
    //   name: 'get',
    //   args: ['#foo'],
    // }
  })
}
```
