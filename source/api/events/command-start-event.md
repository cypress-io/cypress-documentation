---
title: command:start
---

The `command:start` event fires when Cypress begins actually running and executing your command. Useful for debugging and understanding {% url 'how the command queue is async' introduction-to-cypress#Commands-Are-Asynchronous %}.

# Environment

{% wrap_start 'event-environment' %}

Some events run in the {% url "browser" all-events#Browser-Events %}, some in the {% url "background process" background-process %}, and some in both.

Event | Browser | Background Process
--- | --- | ---
`command:start` | {% fa fa-check-circle green %} | {% fa fa-check-circle green %}

{% wrap_end %}

# Arguments

**{% fa fa-angle-right %} command** ***(Object)***

The command to be run.

# Usage

## In the browser

In a spec file or support file you can tap into the `command:start` event. In the browser, the argument is the actual command instance.

```javascript
Cypress.on('command:start', (command) => {
  command.get('name')    // => 'get'
  command.get('args')    // => ['#foo']
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

Using your {% url "`backgroundFile`" background-process %} you can tap into the `command:start` event. In the background process, the argument is a pared-down, serialized version of the command.

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

# See also

- {% url `internal:commandEnd:event` internal-commandend-event %}
- {% url `command:enqueued:event` command-enqueued-event %}
- {% url `command:retry:event` command-retry-event %}
