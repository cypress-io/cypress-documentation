---
title: focus
---

Focus on a DOM element.

## Syntax

```javascript
.focus()
.focus(options)
```

### Usage

**<Icon name="check-circle" color="green"/> Correct Usage**

```javascript
cy.get('input').first().focus() // Focus on the first input
```

**<Icon name="exclamation-triangle" color="red"/> Incorrect Usage**

```javascript
cy.focus('#search') // Errors, cannot be chained off 'cy'
cy.window().focus() // Errors, 'window' does not yield DOM element
```

### Arguments

**<Icon name="angle-right"/> options** **_(Object)_**

Pass in an options object to change the default behavior of `.focus()`.

| Option    | Default                                                              | Description                                                                              |
| --------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `log`     | `true`                                                               | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |
| `timeout` | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `.focus()` to resolve before [timing out](#Timeouts)                    |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`.focus()` yields the same subject it was given from the previous
command.</li></List>

## Examples

### No Args

#### Focus on an input

```javascript
cy.get('[type="input"]').focus()
```

#### Focus, type, and blur a textarea

```javascript
// yields the <textarea> for further chaining
cy.get('textarea').focus().type('Nice Product!').blur()
```

## Notes

### Actionability

#### Focus is not an action command

`.focus()` is not implemented like other action commands, and does not follow
the same rules of
[waiting for actionability](/guides/core-concepts/interacting-with-elements).

`.focus()` is a helpful command used as a shortcut. Normally there's no way for
a user to "focus" an element without causing another action or side effect.
Typically the user would have to click or tab to this element.

Oftentimes using `.focus()` directly is more concise and conveys what you're
trying to test.

If you want the other guarantees of waiting for an element to become actionable,
you should use a different command like [`.click()`](/api/commands/click).

### Blur Events

#### Cypress blurs other focused elements first

If there is currently a different DOM element with focus, Cypress issues a
`blur` event to that element before running the `.focus()` command.

### Focusable

#### Can only be called on a valid focusable element

Ensure the element you are trying to call `.focus()` on is a
[focusable element](https://www.w3.org/TR/html5/editing.html#focusable).

### Timeouts

#### Can time out because your browser did not receive any focus events

If you see this error, you may want to ensure that the main browser window is
currently focused. This means not being focused in debugger or any other window
when the command is run.

Internally Cypress does account for this, and will polyfill the blur events when
necessary to replicate what the browser does. Unfortunately the browser will
still behave differently when not in focus - for instance it may throttle async
events. Your best bet here is to keep Cypress focused when working on a test.

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`.focus()` requires being chained off a command that yields DOM
element(s).</li><li>`.focus()` requires the element to be able to receive
focus.</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`.focus()` will automatically wait for assertions you have chained to
pass</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`.focus()` can time out waiting for assertions you've added to
pass.</li></List>

## Command Log

**_Focus the textarea_**

```javascript
cy.get('[name="comment"]').focus()
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/focus/get-input-then-focus.png" alt="Command Log focus" />

When clicking on the `focus` command within the command log, the console outputs
the following:

<DocsImage src="/img/api/focus/console-log-textarea-that-was-focused-on.png" alt="console.log focus" />

## See also

- [`.blur()`](/api/commands/blur)
- [`.click()`](/api/commands/click)
- [`cy.focused()`](/api/commands/focused)
- [`.type()`](/api/commands/type)
