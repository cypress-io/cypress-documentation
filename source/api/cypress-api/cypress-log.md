---
title: Cypress.log
comments: false
---

This is the internal API for controlling what get's printed to the Command Log.

Useful when writing your own {% url "custom commands" custom-commands %}.

{% note info WIP %}
This page is currently a work in progress and is not fully documented.
{% endnote %}

# Syntax

```javascript
Cypress.log(options)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
const log = Cypress.log({...}) // returns a log instance
```

## Arguments

**{% fa fa-angle-right %} options**  ***(Object)***

Pass in an options object to `Cypress.log()`.

Option | Default | Description
--- | --- | ---
`$el` | `undefined` |
`name` | `name of the command` |
`displayName` | `name of the command` | Overrides `name` only for display purposes.
`message` | `command args` |
`consoleProps` | `function() {}` |

# Examples

```javascript
Cypress.Commands.add('myCustomCommand', (arg1, arg2) => {
  const log = Cypress.log({
    consoleProps: function() {
      // return an object literal which will
      // be printed to the dev tools console
      // on click
      return {
        'Some': 'values',
        'For': 'debugging'
      }
    }
  })
})
```

# See also

- {% url `Commands` custom-commands %}
