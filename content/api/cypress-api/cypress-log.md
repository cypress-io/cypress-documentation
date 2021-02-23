---
title: Cypress.log
---

This is the internal API for controlling what gets printed to the Command Log.

Useful when writing your own [custom commands](/api/cypress-api/custom-commands).

## Syntax

```javascript
Cypress.log(options)
```

### Arguments

**<Icon name="angle-right"></Icon> options**  ***(Object)***

Pass in an options object to `Cypress.log()`.

Option | Default | Description
--- | --- | ---
`$el` | `undefined` |
`name` | `name of the command` |
`displayName` | `name of the command` | Overrides `name` only for display purposes.
`message` | `command args` |
`consoleProps` | `function() {}` |

## Examples

We want the Command Log and the console in the DevTools to log specific properties of our custom command.

```javascript
Cypress.Commands.add('setSessionStorage', (key, value) => {
  // Turn off logging of the cy.window() to command log
  cy.window({ log: false }).then((window) => {
    window.sessionStorage.setItem(key, value)
  })

  const log = Cypress.log({
    name: 'setSessionStorage',
    // shorter name for the Command Log
    displayName: 'setSS',
    message: `${key}, ${value}`,
    consoleProps: () => {
      // return an object which will
      // print to dev tools console on click
      return {
        'Key': key,
        'Value': value,
        'Session Storage': window.sessionStorage
      }
    }
  })
})
```

The code above displays in the Command Log as shown below, with the console properties shown on click of the command.

<DocsImage src="/img/api/Cypress.log-custom-logging-and-console.png" alt="Custom logging of custom command" ></DocsImage>

## See also

- [`Commands`](/api/cypress-api/custom-commands)

