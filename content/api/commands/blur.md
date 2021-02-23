---
title: blur
---

Blur a focused element.

<Alert type="warning">


This element must currently be in focus. If you want to ensure an element is focused before blurring, try using [`.focus()`](/api/commands/focus) before `.blur()`.

</Alert>

## Syntax

```javascript
.blur()
.blur(options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get('[type="email"]').type('me@email.com').blur() // Blur email input
cy.get('[tabindex="1"]').focus().blur()              // Blur el with tabindex
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.blur('input')              // Errors, cannot be chained off 'cy'
cy.window().blur()            // Errors, 'window' does not yield DOM element
```

### Arguments

**<Icon name="angle-right"></Icon> options**  ***(Object)***

Pass in an options object to change the default behavior of `.blur`.

Option | Default | Description
--- | --- | ---
`log` | `true` | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log)
`force` | `false` | Forces the action, disables checking if [element is focused](#Requirements)
`timeout` | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `.blur()` to resolve before [timing out](#Timeouts)

### Yields [<Icon name="question-circle"/>](introduction-to-cypress#Subject-Management)

<List><li>`.blur()` yields the same subject it was given from the previous command.</li></List>

## Examples

### No Args

#### Blur the comment input

```javascript
cy.get('[name="comment"]').type('Nice Product!').blur()
```

### Options

#### Blur the first input

Setting `force` to `true` in the options disables checking whether the input is focusable or currently has focus.

```javascript
cy.get('input:first').blur({ force: true })
```

## Notes

### Actionability

#### Blur is not an action command

`.blur()` is not implemented like other action commands, and does not follow the same rules of [waiting for actionability](/guides/core-concepts/interacting-with-elements).

`.blur()` is a helpful command used as a shortcut. Normally there's no way for a user to "blur" an element. Typically the user would have to perform **another** action like clicking or tabbing to a different element. Needing to perform a separate action like this is very indirect.

Therefore it's often much more efficient to test the blur behavior directly with `.blur()`.

### Timeouts

#### `.blur()` can time out because your browser did not receive any blur events

If you see this error, you may want to ensure that the main browser window is currently focused. This means not being focused in debugger or any other window when the command is run.

Internally Cypress does account for this, and will polyfill the blur events when necessary to replicate what the browser does. Unfortunately the browser will still behave differently when not in focus - for instance it may throttle async events. Your best bet here is to keep Cypress focused when working on a test.

## Rules

### Requirements [<Icon name="question-circle"/>](introduction-to-cypress#Chains-of-Commands)

<List><li>`.blur()` requires being chained off a command that yields DOM element(s).</li><li>`.blur()` requires the element to currently have focus.</li><li>`.blur()` requires the element to be able to receive focus.</li></List>

### Assertions [<Icon name="question-circle"/>](introduction-to-cypress#Assertions)

<List><li>`.blur` will automatically wait for assertions you have chained to pass</li></List>

### Timeouts [<Icon name="question-circle"/>](introduction-to-cypress#Timeouts)

<List><li>`.blur()` can time out waiting for assertions you've added to pass.</li></List>

## Command Log

***Blur a textarea after typing.***

```javascript
cy.get('[name="comment"]').focus().type('Nice Product!').blur()
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/blur/blur-input-command-log.png" alt="command log for blur" ></DocsImage>

When clicking on the `blur` command within the command log, the console outputs the following:

<DocsImage src="/img/api/blur/console-showing-blur-command.png" alt="console.log for blur" ></DocsImage>

## See also

- [`.focus()`](/api/commands/focus)
- [`cy.focused()`](/api/commands/focused)

