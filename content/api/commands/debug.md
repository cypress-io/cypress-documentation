---
title: debug
---

Set a `debugger` and log what the previous command yields.

<Alert type="warning">

You need to have your Developer Tools open for `.debug()` to hit the breakpoint.

</Alert>

## Syntax

```javascript
.debug()
.debug(options)

// ---or---

cy.debug()
cy.debug(options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.debug().getCookie('app') // Pause to debug at beginning of commands
cy.get('nav').debug() // Debug the `get` command's yield
```

### Arguments

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.debug()`.

| Option | Default | Description                                                                              |
| ------ | ------- | ---------------------------------------------------------------------------------------- |
| `log`  | `true`  | Displays the command in the [Command log](/guides/core-concepts/cypress-app#Command-Log) |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`.debug()` yields the same subject it was given from the previous
command.</li></List>

## Examples

### Debug

#### Pause with debugger after `.get()`

```javascript
cy.get('a').debug().should('have.attr', 'href')
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`.debug()` can be chained off of `cy` or off another
command.</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`.debug()` is a utility command.</li><li>`.debug()` will not run
assertions. Assertions will pass through as if this command did not
exist.</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`.debug()` cannot time out.</li></List>

## Command Log

**_Log out the current subject for debugging_**

```javascript
cy.get('.ls-btn').click({ force: true }).debug()
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/debug/how-debug-displays-in-command-log.png" alt="Command Log debug" ></DocsImage>

When clicking on the `debug` command within the command log, the console outputs
the following:

<DocsImage src="/img/api/debug/console-gives-all-debug-info-for-command.png" alt="console.log debug" ></DocsImage>

## See also

- [Cypress Cloud](https://on.cypress.io/cloud)
- [`.pause()`](/api/commands/pause)
- [`cy.log()`](/api/commands/log)
- [`cy.screenshot()`](/api/commands/screenshot)
