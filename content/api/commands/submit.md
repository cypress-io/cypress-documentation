---
title: submit
---

Submit a form.

<Alert type="warning">

The [subject](/guides/core-concepts/introduction-to-cypress#Subject-Management) must be a `<form>`.

</Alert>

## Syntax

```javascript
.submit()
.submit(options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get('form').submit() // Submit a form
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.submit() // Errors, cannot be chained off 'cy'
cy.get('input').submit() // Errors, 'input' does not yield a form
```

### Arguments

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.submit()`.

| Option    | Default                                                              | Description                                                                              |
| --------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `log`     | `true`                                                               | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |
| `timeout` | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `.submit()` to resolve before [timing out](#Timeouts)                   |

### Yields [<Icon name="question-circle"/>](introduction-to-cypress#Subject-Management)

<List><li>`.submit()` yields the same subject it was given from the previous command.</li></List>

## Example

### No Args

#### Submit can only be called on a single form

```html
<form id="contact">
  <input type="text" name="message" />
  <button type="submit">Send</button>
</form>
```

```javascript
cy.get('#contact').submit()
```

## Notes

### Actionability

#### Submit is not an action command

`.submit()` is not implemented like other action commands, and does not follow the same rules of [waiting for actionability](/guides/core-concepts/interacting-with-elements).

`.submit()` is a helpful command used as a shortcut. Normally a user has to perform a different "action" to submit a form. It could be clicking a submit `<button>`, or pressing `enter` on a keyboard.

Oftentimes using `.submit()` directly is more concise and conveys what you're trying to test.

If you want the other guarantees of waiting for an element to become actionable, you should use a different command like [`.click()`](/api/commands/click) or [`.type()`](/api/commands/type).

## Rules

### Requirements [<Icon name="question-circle"/>](introduction-to-cypress#Chains-of-Commands)

<List><li>`.submit()` requires being chained off a command that yields DOM element(s).</li><li>`.submit()` requires the element to be a `form`.</li></List>

### Assertions [<Icon name="question-circle"/>](introduction-to-cypress#Assertions)

<List><li>`.submit()` will automatically wait for assertions you have chained to pass</li></List>

### Timeouts [<Icon name="question-circle"/>](introduction-to-cypress#Timeouts)

<List><li>`.submit()` can time out waiting for assertions you've added to pass.</li></List>

## Command Log

**_Submit a form_**

```javascript
cy.intercept('POST', '/users', { fixture: 'user' }).as('userSuccess')
cy.get('form').submit()
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/submit/form-submit-shows-in-command-log-of-cypress.png" alt="Command Log submit" ></DocsImage>

When clicking on `submit` within the command log, the console outputs the following:

<DocsImage src="/img/api/submit/console-shows-what-form-was-submitted.png" alt="Console Log submit" ></DocsImage>

## History

| Version                                       | Changes                   |
| --------------------------------------------- | ------------------------- |
| [< 0.3.3](/guides/references/changelog#0-3-3) | `.submit()` command added |

## See also

- [`.click()`](/api/commands/click)
- [`.type()`](/api/commands/type)
