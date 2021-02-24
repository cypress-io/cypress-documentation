---
title: within
---

Scopes all subsequent cy commands to within this element. Useful when working within a particular group of elements such as a `<form>`.

# Syntax

```javascript
.within(callbackFn)
.within(options, callbackFn)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.get('.list').within(($list) => {}) // Yield the `.list` and scope all commands within it
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.within(() => {})              // Errors, cannot be chained off 'cy'
cy.getCookies().within(() => {}) // Errors, 'getCookies' does not yield DOM element
```

## Arguments

**{% fa fa-angle-right %} callbackFn** ***(Function)***

Pass a function that takes the current yielded subject as its first argument.

**{% fa fa-angle-right %} options** ***(Object)***

Pass in an options object to change the default behavior of `.within()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}

## Yields {% helper_icon yields %}

{% yields same_subject .within %}

# Examples

## Forms

### Get inputs within a form and submit the form

```html
<form>
  <input name="email" type="email">
  <input name="password" type="password">
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

## Tables

### Find row with specific cell and confirm other cells in the row

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
cy.contains('My first client').parent('tr').within(() => {
  // all searches are automatically rooted to the found tr element
  cy.get('td').eq(1).contains('My first project')
  cy.get('td').eq(2).contains('0')
  cy.get('td').eq(3).contains('Active')
  cy.get('td').eq(4).contains('button', 'Edit').click()
})
```

## Temporarily escape

You can temporarily escape the `.within` context by starting a new command chain with {% url 'cy.root' root %} followed by {% url '.closest' closest %} commands.

```html
<section class="example">
  <!-- note the input field outside the form -->
  <input id="name" type="text">
  <form>
    <input name="email" type="email">
    <input name="password" type="password">
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

# Rules

## Requirements {% helper_icon requirements %}

{% requirements child .within %}

## Assertions {% helper_icon assertions %}

{% assertions once .within %}

## Timeouts {% helper_icon timeout %}

{% timeouts none .within %}

# Command Log

***Get the input within the form***

```javascript
cy.get('.query-form').within((el) => {
  cy.get('input:first')
})
```

The commands above will display in the Command Log as:

{% imgTag /img/api/within/go-within-other-dom-elements.png "Command Log within" %}

When clicking on the `within` command within the command log, the console outputs the following:

{% imgTag /img/api/within/within-shows-its-yield-in-console-log.png "Console Log within" %}

{% history %}
{% url "< 0.3.3" changelog#0-3-3 %} | `.within()` command added
{% endhistory %}

# See also

- {% url `.root()` root %}
