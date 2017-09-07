---
title: Cypress.log
comments: false
---

Print relevant information to the Command Log and Console for {% url "custom commands" custom-commands %}.

# Syntax

```javascript
Cypress.log(options)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
Cypress.log({}) // Set server defaults
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.log({})  // Errors, cannot be chained off 'cy'
```

## Arguments

**{% fa fa-angle-right %} options**  ***(Object)***

Pass in an options object to `Cypress.log`.

Option | Default | Description
--- | --- | ---
`$el` |  |
`alias` | `undefined` |
`aliasType` | `undefined` |
`autoEnd` |  |
`consoleProps` | `function() {}` |
`displayName` |  |
`end` |  |
`error` |  |
`event` | `false` |
`message` | custom command args |
`name` |  |
`passed` |  |
`renderProps` | `function() {}` |
`selector` |  |
`snapshot` |  |
`type` |  |

# Examples

```javascript
Cypress.Commands.add('myCustomCommand', (el) => {

  Cypress.log({
    name:
    $el: el.get(0),
    message: 'Your custom command happened',
    consoleProps: function() {
      return {
        'Command': 'myCustomCommand'
        'Applied To': el.get(0)
      }
    }
  })
})
```

# See also

- {% url `Commands` custom-commands %}
