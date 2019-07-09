---
title: get
---

Get one or more DOM elements by selector or {% url 'alias' variables-and-aliases %}.

{% note info %}
The querying behavior of this command matches exactly how {% url `$(...)` http://api.jquery.com/jQuery/ %} works in jQuery.
{% endnote %}

# Syntax

```javascript
cy.get(selector)
cy.get(alias)
cy.get(selector, options)
cy.get(alias, options)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.get('.list > li') // Yield the <li>'s in .list
```

## Arguments

**{% fa fa-angle-right %} selector** **_(String selector)_**

A selector used to filter matching DOM elements.

**{% fa fa-angle-right %} alias** **_(String)_**

An alias as defined using the {% url `.as()` as %} command and referenced with the `@` character and the name of the alias.

You can use `cy.get()` for aliases of primitives, regular objects, or even DOM elements.

When using aliases with DOM elements, Cypress will query the DOM again if the previously aliased DOM element has gone stale.

{% note info 'Core Concept' %}
{% url 'You can read more about aliasing objects and elements in our Core Concept Guide' variables-and-aliases#Aliases %}.
{% endnote %}

**{% fa fa-angle-right %} options** **_(Object)_**

Pass in an options object to change the default behavior of `cy.get()`.

| Option    | Default                                                  | Description                        |
| --------- | -------------------------------------------------------- | ---------------------------------- |
| `log`     | `true`                                                   | {% usage_options log %}            |
| `timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout cy.get %} |
| 'withinSubject' | null                                               | {% usage_options withinSubject %} |

## Yields {% helper_icon yields %}

{% yields sets_dom_subject cy.get %}

# Examples

## Selector

### Get the input element

```javascript
cy.get('input').should('be.disabled')
```

### Find the first `li` descendent within a `ul`

```javascript
cy.get('ul li:first').should('have.class', 'active')
```

### Find the dropdown-menu and click it

```javascript
cy.get('.dropdown-menu').click()
```

### Find 5 elements with the given data attribute

```javascript
cy.get('[data-test-id="test-example"]').should('have.length', 5)
```

## Get in `.within()`

### `cy.get()` in the {% url `.within()` within %} command

Since `cy.get()` is chained off of `cy`, it always looks for the selector within the entire `document`. The only exception is when used inside a {% url "`.within()`" within %} command.

```javascript
cy.get('form').within(() => {
  cy.get('input').type('Pamela') // Only yield inputs within form
  cy.get('textarea').type('is a developer') // Only yield textareas within form
})
```

## Alias

For a detailed explanation of aliasing, {% url 'read more about aliasing here' variables-and-aliases#Aliases %}.

### Get the aliased 'todos' elements

```javascript
cy.get('ul#todos').as('todos')

//...hack hack hack...

//later retrieve the todos
cy.get('@todos')
```

### Get the aliased 'submitBtn' element

```javascript
beforeEach(function() {
  cy.get('button[type=submit]').as('submitBtn')
})

it('disables on click', function() {
  cy.get('@submitBtn').should('be.disabled')
})
```

### Get the aliased 'users' fixture

```javascript
beforeEach(function() {
  cy.fixture('users.json').as('users')
})

it('disables on click', function() {
  // access the array of users
  cy.get('@users').then((users) => {
    // get the first user
    const user = users[0]

    cy.get('header').contains(user.name)
  })
})
```

# Rules

## Requirements {% helper_icon requirements %}

{% requirements dom cy.get %}

## Assertions {% helper_icon assertions %}

{% assertions existence cy.get %}

## Timeouts {% helper_icon timeout %}

{% timeouts existence cy.get %}

# Command Log

**_Get an input and assert on the value_**

```javascript
cy.get('input[name="firstName"]').should('have.value', 'Homer')
```

The commands above will display in the Command Log as:

{% imgTag /img/api/get/get-element-and-make-an-assertion.png "Command Log get" %}

When clicking on the `get` command within the command log, the console outputs the following:

{% imgTag /img/api/get/console-log-get-command-and-elements-found.png "Console Log get" %}

# See also

- {% url `.as()` as %}
- {% url `cy.contains()` contains %}
- {% url `.find()` find %}
- {% url `.within()` within %}
- {% url "Retry-ability" retry-ability %}
