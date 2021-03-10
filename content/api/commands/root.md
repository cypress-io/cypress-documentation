---
title: root
---

Get the root DOM element.

## Syntax

```javascript
cy.root()
cy.root(options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.root() // Yield root element <html>
cy.get('nav').within(($nav) => {
  cy.root() // Yield root element <nav>
})
```

### Arguments

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.root()`.

| Option    | Default                                                              | Description                                                                              |
| --------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `log`     | `true`                                                               | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |
| `timeout` | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `cy.root()` to resolve before [timing out](#Timeouts)                   |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

`.root()` yields the root DOM element.

The root element yielded is `<html>` by default. However, when calling `.root()` from a [`.within()`](/api/commands/within) command, the root element will point to the element you are "within".

## Examples

### HTML

#### Get the root element

```javascript
cy.root() // yields <html>
```

### Within

#### Get the root element in a [`.within()`](/api/commands/within) callback function

```javascript
cy.get('form').within(($form) => {
  cy.get('input[name="email"]').type('john.doe@email.com')
  cy.get('input[name="password"]').type('password')
  cy.root().submit() // submits the form yielded from 'within'
})
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`cy.root()` requires being chained off of `cy`.</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`cy.root()` will automatically [retry](/guides/core-concepts/retry-ability) until all chained assertions have passed</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`cy.root()` can time out waiting for assertions you've added to pass.</li></List>

## Command Log

#### Get root element

```javascript
cy.root().should('match', 'html')

cy.get('.query-ul').within(() => {
  cy.root().should('have.class', 'query-ul')
})
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/root/find-root-element-and-assert.png" alt="Command Log root" ></DocsImage>

When clicking on the `root` command within the command log, the console outputs the following:

<DocsImage src="/img/api/root/console-log-root-which-is-usually-the-main-document.png" alt="Console Log root" ></DocsImage>

## See also

- [`cy.get()`](/api/commands/get)
- [`.within()`](/api/commands/within)
