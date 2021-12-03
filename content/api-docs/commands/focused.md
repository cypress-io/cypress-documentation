---
title: focused
---

Get the DOM element that is currently focused.

## Syntax

```javascript
cy.focused()
cy.focused(options)
```

### Usage

**<Icon name="check-circle" color="green"/> Correct Usage**

```javascript
cy.focused() // Yields the element currently in focus
```

### Arguments

**<Icon name="angle-right"/> options** **_(Object)_**

Pass in an options object to change the default behavior of `cy.focused()`.

| Option    | Default                                                              | Description                                                                              |
| --------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `log`     | `true`                                                               | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |
| `timeout` | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `cy.focused()` to resolve before [timing out](#Timeouts)                |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`cy.focused()` yields the DOM element(s) it found.</li></List>

## Examples

### No Args

#### Get the element that is focused

```javascript
cy.focused().then(($el) => {
  // do something with $el
})
```

#### Blur the element with focus

```javascript
cy.focused().blur()
```

#### Make an assertion on the focused element

```javascript
cy.focused().should('have.attr', 'name', 'username')
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`cy.focused()` requires being chained off a command that yields DOM
element(s).</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`cy.focused()` will automatically
[retry](/guides/core-concepts/retry-ability) until the element(s)
[exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions)</li><li>`cy.focused()`
will automatically [retry](/guides/core-concepts/retry-ability) until all
chained assertions have passed</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`cy.focused()` can time out waiting for the element(s) to
[exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions).</li><li>`cy.focused()`
can time out waiting for assertions you've added to pass.</li></List>

## Command Log

**_Make an assertion on the focused element_**

```javascript
cy.focused().should('have.attr', 'name').and('eq', 'num')
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/focused/make-assertion-about-focused-element.png" alt="Command Log focused" />

When clicking on the `focused` command within the command log, the console
outputs the following:

<DocsImage src="/img/api/focused/currently-focused-element-in-an-input.png" alt="console focused" />

## See also

- [`.blur()`](/api/commands/blur)
- [`.focus()`](/api/commands/focus)
