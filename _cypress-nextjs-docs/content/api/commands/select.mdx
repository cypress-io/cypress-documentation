---
title: select
---

Select an `<option>` within a `<select>`.

## Syntax

```javascript
.select(value)
.select(values)
.select(value, options)
.select(values, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get('select').select('user-1') // Select the 'user-1' option
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.select('John Adams') // Errors, cannot be chained off 'cy'
cy.location().select() // Errors, 'location' does not yield <select> element
```

### Arguments

**<Icon name="angle-right"></Icon> value** **_(String, Number)_**

The `value`, `index`, or text content of the `<option>` to be selected.

**<Icon name="angle-right"></Icon> values** **_(Array)_**

An array of `values`, `indexes`, or text contents of the `<option>`s to be
selected.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.select()`.

| Option    | Default                                                              | Description                                                                              |
| --------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `force`   | `false`                                                              | Forces the action, disables [waiting for actionability](#Assertions)                     |
| `log`     | `true`                                                               | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |
| `timeout` | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `.select()` to resolve before [timing out](#Timeouts)                   |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`.select()` yields the same subject it was given from the previous
command.</li></List>

## Examples

### Text Content

#### Select the `option` with the text `apples`

```html
<select>
  <option value="456">apples</option>
  <option value="457">oranges</option>
  <option value="458">bananas</option>
</select>
```

```javascript
// yields <option value="456">apples</option>
cy.get('select').select('apples').should('have.value', '456')
```

### Value

#### Select the `option` with the value "456"

```html
<select>
  <option value="456">apples</option>
  <option value="457">oranges</option>
  <option value="458">bananas</option>
</select>
```

```javascript
// yields <option value="456">apples</option>
cy.get('select').select('456').should('have.value', '456')
```

### Index

#### Select the `option` with index 0

```html
<select>
  <option value="456">apples</option>
  <option value="457">oranges</option>
  <option value="458">bananas</option>
</select>
```

```javascript
// yields <option value="456">apples</option>
cy.get('select').select(0).should('have.value', '456')
```

### Select multiple options

#### Select the options with the texts "apples" and "bananas"

```html
<select multiple>
  <option value="456">apples</option>
  <option value="457">oranges</option>
  <option value="458">bananas</option>
</select>
```

```javascript
cy.get('select')
  .select(['apples', 'bananas'])
  .invoke('val')
  .should('deep.equal', ['456', '458'])
```

#### Select the options with the values "456" and "457"

```html
<select multiple>
  <option value="456">apples</option>
  <option value="457">oranges</option>
  <option value="458">bananas</option>
</select>
```

```javascript
cy.get('select')
  .select(['456', '457'])
  .invoke('val')
  .should('deep.equal', ['456', '457'])
```

#### Select the options with the indexes 0 and 1

```html
<select multiple>
  <option value="456">apples</option>
  <option value="457">oranges</option>
  <option value="458">bananas</option>
</select>
```

```javascript
cy.get('select')
  .select([0, 1])
  .invoke('val')
  .should('deep.equal', ['456', '457'])
```

<Alert type="info">

**Note:** Passing an array into `cy.select()` will select only the options
matching values in the array, leaving all other options unselected (even those
that were previously selected). In the same manner, calling `cy.select([])` with
an empty array will clear selections on all options.

</Alert>

### Force select

#### Force select a hidden `<select>`

```html
<select style="display: none;">
  <optgroup label="Fruits">
    <option value="banana">Banana</option>
    <option value="apple">Apple</option>
  </optgroup>

  <optgroup></optgroup>
</select>
```

```javascript
cy.get('select')
  .select('banana', { force: true })
  .invoke('val')
  .should('eq', 'banana')
```

#### Force select a disabled `<select>`

Passing `{ force: true }` to `.select()` will override the actionability checks
for selecting a disabled `<select>`. However, it will not override the
actionability checks for selecting a disabled `<option>` or an option within a
disabled `<optgroup>`. See
[this issue](https://github.com/cypress-io/cypress/issues/107) for more detail.

```html
<select disabled>
  <optgroup label="Veggies">
    <option value="okra">Okra</option>
    <option value="zucchini">Zucchini</option>
  </optgroup>

  <optgroup></optgroup>
</select>
```

```javascript
cy.get('select')
  .select('okra', { force: true })
  .invoke('val')
  .should('eq', 'okra')
```

### Selected option

You can get the currently selected option using the jQuery's
[:selected selector](https://api.jquery.com/selected-selector/).

```html
<select id="name">
  <option>Joe</option>
  <option>Mary</option>
  <option selected="selected">Peter</option>
</select>
```

```javascript
cy.get('select#name option:selected').should('have.text', 'Peter')
```

## Notes

### Actionability

`.select()` is an action command that follows the rules
[defined here](/guides/core-concepts/interacting-with-elements).

However, passing `{ force: true }` to `.select()` will not override the
actionability checks for selecting a disabled `<option>` or an option within a
disabled `<optgroup>`. See
[this issue](https://github.com/cypress-io/cypress/issues/107) for more detail.

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`.select()` requires being chained off a command that yields DOM
element(s).</li><li>`.select()` requires the element to be a
`select`.</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`.select()` will automatically wait for the element to reach an
[actionable state](/guides/core-concepts/interacting-with-elements)</li><li>`.select()`
will automatically [retry](/guides/core-concepts/retry-ability) until all
chained assertions have passed</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`.select()` can time out waiting for the element to reach an
[actionable state](/guides/core-concepts/interacting-with-elements).</li><li>`.select()`
can time out waiting for assertions you've added to pass.</li></List>

## Command Log

**_Select the option with the text "Homer Simpson"_**

```javascript
cy.get('select').select('Homer Simpson')
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/select/select-homer-option-from-browser-dropdown.png" alt="Command Log select" ></DocsImage>

When clicking on `select` within the command log, the console outputs the
following:

<DocsImage src="/img/api/select/console-log-for-select-shows-option-and-any-events-caused-from-clicking.png" alt="Console Log select" ></DocsImage>

## See also

- Read
  [Working with Select elements and Select2 widgets in Cypress](https://www.cypress.io/blog/2020/03/20/working-with-select-elements-and-select2-widgets-in-cypress/)
- [`.click()`](/api/commands/click)
