---
title: within
---

Scopes all subsequent cy commands to within this element. Useful when working within a particular group of elements such as a `<form>`.

## Syntax

```javascript
.within(callbackFn)
.within(options, callbackFn)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get('.list').within(($list) => {}) // Yield the `.list` and scope all commands within it
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.within(() => {}) // Errors, cannot be chained off 'cy'
cy.getCookies().within(() => {}) // Errors, 'getCookies' does not yield DOM element
```

### Arguments

**<Icon name="angle-right"></Icon> callbackFn** **_(Function)_**

Pass a function that takes the current yielded subject as its first argument.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.within()`.

| Option | Default | Description                                                                              |
| ------ | ------- | ---------------------------------------------------------------------------------------- |
| `log`  | `true`  | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |

### Yields [<Icon name="question-circle"/>](introduction-to-cypress#Subject-Management)

<List><li>`.within()` yields the same subject it was given from the previous command.</li></List>

## Examples

### Forms

#### Get inputs within a form and submit the form

```html
<form>
  <input name="email" type="email" />
  <input name="password" type="password" />
  <button type="submit">Login</button>
</form>
```

```javascript
cy.get('form').within(($form) => {
  // you have access to the found form via
  // the jQuery object $form if you need it

  // cy.get() will only search for elements within form,
  // not within the entire document
  cy.get('input[name="email"]').type('john.doe@email.com')
  cy.get('input[name="password"]').type('password')
  cy.root().submit()
})
```

### Tables

#### Find row with specific cell and confirm other cells in the row

```html
<table>
  <tr>
    <td>My first client</td>
    <td>My first project</td>
    <td>0</td>
    <td>Active</td>
    <td><button>Edit</button></td>
  </tr>
</table>
```

```javascript
cy.contains('My first client')
  .parent('tr')
  .within(() => {
    // all searches are automatically rooted to the found tr element
    cy.get('td').eq(1).contains('My first project')
    cy.get('td').eq(2).contains('0')
    cy.get('td').eq(3).contains('Active')
    cy.get('td').eq(4).contains('button', 'Edit').click()
  })
```

### Temporarily escape

You can temporarily escape the `.within` context by starting a new command chain with [cy.root](/api/commands/root) followed by [.closest](/api/commands/closest) commands.

```html
<section class="example">
  <!-- note the input field outside the form -->
  <input id="name" type="text" />
  <form>
    <input name="email" type="email" />
    <input name="password" type="password" />
    <button type="submit">Login</button>
  </form>
</section>
```

```javascript
cy.get('form').within(($form) => {
  // temporarily escape the .within context
  cy.root().closest('.example').find('#name').type('Joe')
  // continue using the .within context
  cy.get('input[name="email"]').type('john.doe@email.com')
  cy.get('input[name="password"]').type('password')
  cy.root().submit()
})
```

## Rules

### Requirements [<Icon name="question-circle"/>](introduction-to-cypress#Chains-of-Commands)

<List><li>`.within()` requires being chained off a previous command.</li></List>

### Assertions [<Icon name="question-circle"/>](introduction-to-cypress#Assertions)

<List><li>`.within()` will only run assertions you have chained once, and will not [retry](/guides/core-concepts/retry-ability).</li></List>

### Timeouts [<Icon name="question-circle"/>](introduction-to-cypress#Timeouts)

<List><li>`.within()` cannot time out.</li></List>

## Command Log

**_Get the input within the form_**

```javascript
cy.get('.query-form').within((el) => {
  cy.get('input:first')
})
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/within/go-within-other-dom-elements.png" alt="Command Log within" ></DocsImage>

When clicking on the `within` command within the command log, the console outputs the following:

<DocsImage src="/img/api/within/within-shows-its-yield-in-console-log.png" alt="Console Log within" ></DocsImage>

## History

| Version                                       | Changes                   |
| --------------------------------------------- | ------------------------- |
| [< 0.3.3](/guides/references/changelog#0-3-3) | `.within()` command added |

## See also

- [`.root()`](/api/commands/root)
