---
title: pause
---

Stop `cy` commands from running and allow interaction with the application under
test. You can then "resume" running all commands or choose to step through the
"next" commands from the Command Log.

<Alert type="info">

This does not set a `debugger` in your code, unlike
[`.debug()`](/api/commands/debug)

</Alert>

## Syntax

```javascript
.pause()
.pause(options)

cy.pause()
cy.pause(options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.pause().getCookie('app') // Pause at the beginning of commands
cy.get('nav').pause() // Pause after the 'get' commands yield
```

### Arguments

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.pause()`.

| Option | Default | Description                                                                              |
| ------ | ------- | ---------------------------------------------------------------------------------------- |
| `log`  | `true`  | Displays the command in the [Command log](/guides/core-concepts/cypress-app#Command-Log) |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`.pause()` yields the same subject it was given from the previous
command.</li></List>

## Examples

### No Args

#### Pause after assertion

```javascript
cy.get('a')
  .should('have.attr', 'href')
  .and('match', /dashboard/)
  .pause()
cy.get('button').should('not.be.disabled')
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`.pause()` can be chained off of `cy` or off another
command.</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`.pause()` is a utility command.</li><li>`.pause()` will not run
assertions. Assertions will pass through as if this command did not
exist.</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`.pause()` cannot time out.</li></List>

## Command Log

### Pause and step through each `.click()` command

```javascript
cy.get('#action-canvas')
  .click(80, 75)
  .pause()
  .click(170, 75)
  .click(80, 165)
  .click(100, 185)
  .click(125, 190)
  .click(150, 185)
  .click(170, 165)
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/pause/initial-pause-in-gui-highlights-the-pause-command.png" alt="Pause command on intial pause" ></DocsImage>

When clicking on "Next: 'click'" at the top of the Command Log, the Command Log
will run only the next command and pause again.

#### Click "Next"

<DocsImage src="/img/api/pause/next-goes-on-to-next-command-during-pause.png" alt="Pause command after clicking next" ></DocsImage>

#### Click "Next" again

<DocsImage src="/img/api/pause/continue-in-pause-command-just-like-debugger.png" alt="Continue to next command during pause" ></DocsImage>

#### Click "Next" again

<DocsImage src="/img/api/pause/pause-goes-to-show-next-click.png" alt="Pause command" ></DocsImage>

#### Click "Next" again

<DocsImage src="/img/api/pause/clicking-on-canvas-continues-as-we-click-next.png" alt="Pause command" ></DocsImage>

#### Click "Next" again

<DocsImage src="/img/api/pause/last-next-click-before-out-test-is-finished.png" alt="Pause command" ></DocsImage>

#### Click "Next" again, then 'Resume'

<DocsImage src="/img/api/pause/next-then-resume-shows-our-test-has-ended.png" alt="Pause command" ></DocsImage>

## See also

- [Cypress Cloud](https://on.cypress.io/cloud)
- [`cy.debug()`](/api/commands/debug)
- [`cy.log()`](/api/commands/log)
- [`cy.screenshot()`](/api/commands/screenshot)
