---
title: select
---

Select an `<option>` within a `<select>`.

# Syntax

```javascript
.select(value)
.select(values)
.select(value, options)
.select(values, options)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.get('select').select('user-1') // Select the 'user-1' option
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.select('John Adams')  // Errors, cannot be chained off 'cy'
cy.location().select()   // Errors, 'location' does not yield <select> element
```

## Arguments

**{% fa fa-angle-right %} value**  ***(String)***

The `value` or text content of the `<option>` to be selected.

**{% fa fa-angle-right %} values**  ***(Array)***

An array of `values` or text contents of the `<option>`s to be selected.

**{% fa fa-angle-right %} options**  ***(Object)***

Pass in an options object to change the default behavior of `.select()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`force` | `false` | {% usage_options force select %}
`timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout .select %}

## Yields {% helper_icon yields %}

{% yields same_subject .select %}

# Examples

## Text Content

### Select the `option` with the text `apples`

```html
<select>
  <option value="456">apples</option>
  <option value="457">oranges</option>
  <option value="458">bananas</option>
</select>
```

```javascript
// yields <option value="456">apples</option>
cy.get('select')
  .select('apples').should('have.value', '456')
```

## Value

### Select the `option` with the value "456"

```html
<select>
  <option value="456">apples</option>
  <option value="457">oranges</option>
  <option value="458">bananas</option>
</select>
```

```javascript
// yields <option value="456">apples</option>
cy.get('select')
  .select('456').should('have.value', '456')
```

## Select multiple options

### Select the options with the texts "apples" and "bananas"

```html
<select multiple>
  <option value="456">apples</option>
  <option value="457">oranges</option>
  <option value="458">bananas</option>
</select>
```

```javascript
cy.get('select')
  .select(['apples', 'bananas']).invoke('val')
  .should('deep.equal', ['456', '458'])
```

### Select the options with the values "456" and "457"

```html
<select multiple>
  <option value="456">apples</option>
  <option value="457">oranges</option>
  <option value="458">bananas</option>
</select>
```

```javascript
cy.get('select')
  .select(['456', '457']).invoke('val')
  .should('deep.equal', ['456', '457'])
```

## Force select

### Force select a hidden `<select>`

```html
<select style="display: none;">
  <optgroup label="Fruits">
    <option value="banana">Banana</option>
    <option value="apple">Apple</option>
  <optgroup>
</select>
```

```javascript
cy.get('select')
  .select('banana', { force: true })
  .invoke('val')
  .should('eq', 'banana')
```

### Force select a disabled `<select>`

Passing `{ force: true }` to `.select()` will override the actionability checks for selecting a disabled `<select>`. However, it will not override  the actionability checks for selecting a disabled `<option>` or an option within a disabled `<optgroup>`. See {% issue 107 "this issue" %} for more detail.

```html
<select disabled>
  <optgroup label="Veggies">
    <option value="okra">Okra</option>
    <option value="zucchini">Zucchini</option>
  <optgroup>
</select>
```

```javascript
cy.get('select')
  .select('okra', { force: true })
  .invoke('val')
  .should('eq', 'okra')
```

# Notes

## Actionability

`.select()` is an action command that follows the rules {% url 'defined here' interacting-with-elements %}.

However, passing `{ force: true }` to `.select()` will not override the actionability checks for selecting a disabled `<option>` or an option within a disabled `<optgroup>`. See {% issue 107 "this issue" %} for more detail.

# Rules

## Requirements {% helper_icon requirements %}

{% requirements selectability .select %}

## Assertions {% helper_icon assertions %}

{% assertions actions .select %}

## Timeouts {% helper_icon timeout %}

{% timeouts actions .select %}

# Command Log

***Select the option with the text "Homer Simpson"***

```javascript
cy.get('select').select('Homer Simpson')
```

The commands above will display in the Command Log as:

{% imgTag /img/api/select/select-homer-option-from-browser-dropdown.png "Command Log select" %}

When clicking on `select` within the command log, the console outputs the following:

{% imgTag /img/api/select/console-log-for-select-shows-option-and-any-events-caused-from-clicking.png "Console Log select" %}

# See also

- Read {% url 'Working with Select elements and Select2 widgets in Cypress' https://www.cypress.io/blog/2020/03/20/working-with-select-elements-and-select2-widgets-in-cypress/ %}
- {% url `.click()` click %}
