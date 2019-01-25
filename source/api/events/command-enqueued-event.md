---
title: command:enqueued
---

The `command:enqueued` event fires when a `cy` command is first invoked and enqueued to be run later. Useful for debugging purposes if you're confused about the order in which commands will execute.

# Environment

{% wrap_start 'event-environment' %}

Some events run in the {% url "browser" all-events#Browser-Events %}, some in the {% url "background process" background-process %}, and some in both.

Event | Browser | Background Process
--- | --- | ---
`command:enqueued` | {% fa fa-check-circle green %} | {% fa fa-check-circle green %}

{% wrap_end %}

# Arguments

**{% fa fa-angle-right %} properties** ***(Object)***

The properties of the command to be run.

# Usage

## In the browser

In a spec file or support file you can tap into the `command:enqueued` event.

```javascript
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

Using your {% url "`backgroundFile`" background-process %} you can tap into the `command:enqueued` event.

```javascript
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

# See also

- {% url `internal:commandEnd:event` internal-commandend-event %}
- {% url `command:retry:event` command-retry-event %}
- {% url `command:start:event` command-start-event %}
