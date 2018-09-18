---
title: command:end
---

The `command:end` event fires when Cypress finishes running and executing your command. Useful for debugging and understanding how commands are handled.

# Environment

Event | {% url "Browser" catalog-of-events#Browser-Events %} | {% url "Background Process" background-process %}
--- | --- | ---
{% url `command:end` command-end-event %} | {% fa fa-check-circle green %} | {% fa fa-check-circle green %}

# Arguments

**{% fa fa-angle-right %} command** ***(Object)***

The command that was run.

# Usage

## In the browser

In a spec file or support file you can tap into the `command:end` event. In the browser, the argument is the actual command instance.

```javascript
Cypress.on('command:end', (command) => {
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

Using your {% url "`backgroundFile`" background-process %} you can tap into the `command:end` event. In the background process, the argument is a pared-down, serialized version of the command.

```javascript
module.exports = (on, config) => {
  on('command:end', (command) => {
    // command looks something like this:
    // {
    //   name: 'get',
    //   args: ['#foo'],
    // }
  })
}
```

# See also

- {% url `command:enqueued:event` command-enqueued-event %}
- {% url `command:retry:event` command-retry-event %}
- {% url `command:start:event` command-start-event %}
