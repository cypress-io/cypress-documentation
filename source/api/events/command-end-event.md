---
title: internal:commandEnd
---

The `internal:commandEnd` event fires when Cypress finishes running and executing your command. Useful for debugging and understanding how commands are handled.

# Environment

{% wrap_start 'event-environment' %}

Some events run in the {% url "browser" all-events#Browser-Events %}, some in the {% url "background process" background-process %}, and some in both.

Event | Browser | Background Process
--- | --- | ---
`internal:commandEnd` | {% fa fa-check-circle green %} | {% fa fa-check-circle green %}

{% wrap_end %}

# Arguments

**{% fa fa-angle-right %} command** ***(Object)***

The command that was run.

# Usage

## In the browser

In a spec file or support file you can tap into the `internal:commandEnd` event. In the browser, the argument is the actual command instance.

```javascript
Cypress.on('internal:commandEnd', (command) => {
  command.get('name') // => 'get'
  command.get('args') // => ['#foo']
  command.get('subject') // => jQuery(<div#foo />)
  // you can .get() the following properties:
  // - name
  // - args
  // - subject
  // - type
  // ... and more ...
})
```

## In the background process

Using your {% url "`backgroundFile`" background-process %} you can tap into the `internal:commandEnd` event. In the background process, the argument is a pared-down, serialized version of the command.

```javascript
module.exports = (on, config) => {
  on('internal:commandEnd', (command) => {
    // command looks something like this:
    // {
    //   name: 'get',
    //   args: ['#foo'],
    // }
  })
}
```

# See also

- {% url `internal:commandEnqueue:event` internal-commandenqueue-event %}
- {% url `command:retry:event` command-retry-event %}
- {% url `command:start:event` command-start-event %}
