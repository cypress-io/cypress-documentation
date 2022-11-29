---
title: clearAllSessionStorage
---

Clear data in sessionStorage for all origins with which the test has interacted.

<Alert type="warning">

Cypress automatically runs this command _before_ each test to prevent state from
being shared across tests. You shouldn't need to use this command unless you're
using it to clear sessionStorage inside a single test.

</Alert>

## Syntax

```javascript
cy.clearAllSessionStorage()
cy.clearAllSessionStorage(options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.clearAllSessionStorage()
```

### Arguments

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of
`cy.clearAllSessionStorage()`.

| Option | Default | Description                                                                              |
| ------ | ------- | ---------------------------------------------------------------------------------------- |
| `log`  | `true`  | Displays the command in the [Command log](/guides/core-concepts/cypress-app#Command-Log) |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

- `cy.clearAllSessionStorage()` yields `null`.
- `cy.clearAllSessionStorage()` cannot be chained further.

## Examples

### Clear all sessionStorage

```javascript
cy.clearAllSessionStorage()
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

- `cy.clearAllSessionStorage()` requires being chained off of `cy`.

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

`cy.clearAllSessionStorage()` cannot have any assertions chained.

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`cy.clearAllSessionStorage()` cannot time out.</li></List>

## See also

- [`cy.clearAllLocalStorage()`](/api/commands/clearalllocalstorage)
- [`cy.clearCookies()`](/api/commands/clearcookies)
- [`cy.clearLocalStorage()`](/api/commands/clearlocalstorage)
- [`cy.getAllLocalStorage()`](/api/commands/getalllocalstorage)
- [`cy.getAllSessionStorage()`](/api/commands/getallsessionstorage)
