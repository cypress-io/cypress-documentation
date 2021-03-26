---
title: get
---

Get one or more DOM elements by selector or [alias](/guides/core-concepts/variables-and-aliases).

<Alert type="info">

The querying behavior of this command is similar to how [`$(...)`](http://api.jquery.com/jQuery/) works in jQuery.

</Alert>

## Syntax

```javascript
cy.get(selector)
cy.get(alias)
cy.get(selector, options)
cy.get(alias, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get('.list > li') // Yield the <li>'s in .list
```

### Arguments

**<Icon name="angle-right"></Icon> selector** **_(String selector)_**

A selector used to filter matching DOM elements.

**<Icon name="angle-right"></Icon> alias** **_(String)_**

An alias as defined using the [`.as()`](/api/commands/as) command and referenced with the `@` character and the name of the alias.

You can use `cy.get()` for aliases of primitives, regular objects, or even DOM elements.

When using aliases with DOM elements, Cypress will query the DOM again if the previously aliased DOM element has gone stale.

<Alert type="info">

<strong class="alert-header">Core Concept</strong>

[You can read more about aliasing objects and elements in our Core Concept Guide](/guides/core-concepts/variables-and-aliases#Aliases).

</Alert>

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `cy.get()`.

| Option             | Default                                                                           | Description                                                                                                  |
| ------------------ | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `log`              | `true`                                                                            | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log)                     |
| `timeout`          | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts)              | Time to wait for `cy.get()` to resolve before [timing out](#Timeouts)                                        |
| `withinSubject`    | null                                                                              | Element to search for children in. If null, search begins from root-level DOM element                        |
| `includeShadowDom` | [`includeShadowDom` config option value](/guides/references/configuration#Global) | Whether to traverse shadow DOM boundaries and include elements within the shadow DOM in the yielded results. |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`cy.get()` yields the DOM element(s) it found.</li></List>

## Examples

### Selector

#### Get the input element

```javascript
cy.get('input').should('be.disabled')
```

#### Find the first `li` descendent within a `ul`

```javascript
cy.get('ul li:first').should('have.class', 'active')
```

#### Find the dropdown-menu and click it

```javascript
cy.get('.dropdown-menu').click()
```

#### Find 5 elements with the given data attribute

```javascript
cy.get('[data-test-id="test-example"]').should('have.length', 5)
```

#### Find the link with an href attribute containing the word "questions" and click it

```javascript
cy.get('a[href*="questions"]').click()
```

#### Find the element with id that starts with "local-"

```javascript
cy.get('[id^=local-]')
```

#### Find the element with id that ends with "-remote"

```javascript
cy.get('[id$=-remote]')
```

#### Find the element with id that starts with "local-" and ends with "-remote"

```javascript
cy.get('[id^=local-][id$=-remote]')
```

### Get in `.within()`

#### `cy.get()` in the [`.within()`](/api/commands/within) command

Since `cy.get()` is chained off of `cy`, it always looks for the selector within the entire `document`. The only exception is when used inside a [.within()](/api/commands/within) command.

```javascript
cy.get('form').within(() => {
  cy.get('input').type('Pamela') // Only yield inputs within form
  cy.get('textarea').type('is a developer') // Only yield textareas within form
})
```

### Alias

For a detailed explanation of aliasing, [read more about aliasing here](/guides/core-concepts/variables-and-aliases#Aliases).

#### Get the aliased 'todos' elements

```javascript
cy.get('ul#todos').as('todos')

//...hack hack hack...

//later retrieve the todos
cy.get('@todos')
```

#### Get the aliased 'submitBtn' element

```javascript
beforeEach(() => {
  cy.get('button[type=submit]').as('submitBtn')
})

it('disables on click', () => {
  cy.get('@submitBtn').should('be.disabled')
})
```

#### Get the aliased 'users' fixture

```javascript
beforeEach(() => {
  cy.fixture('users.json').as('users')
})

it('disables on click', () => {
  // access the array of users
  cy.get('@users').then((users) => {
    // get the first user
    const user = users[0]

    cy.get('header').contains(user.name)
  })
})
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`cy.get()` requires being chained off a command that yields DOM element(s).</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`cy.get()` will automatically [retry](/guides/core-concepts/retry-ability) until the element(s) [exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions)</li><li>`cy.get()` will automatically [retry](/guides/core-concepts/retry-ability) until all chained assertions have passed</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`cy.get()` can time out waiting for the element(s) to [exist in the DOM](/guides/core-concepts/introduction-to-cypress#Default-Assertions).</li><li>`cy.get()` can time out waiting for assertions you've added to pass.</li></List>

## Command Log

**_Get an input and assert on the value_**

```javascript
cy.get('input[name="firstName"]').should('have.value', 'Homer')
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/get/get-element-and-make-an-assertion.png" alt="Command Log get" ></DocsImage>

When clicking on the `get` command within the command log, the console outputs the following:

<DocsImage src="/img/api/get/console-log-get-command-and-elements-found.png" alt="Console Log get" ></DocsImage>

## History

| Version                                     | Changes                          |
| ------------------------------------------- | -------------------------------- |
| [5.2.0](/guides/references/changelog#5-2-0) | Added `includeShadowDom` option. |

## See also

- [`.as()`](/api/commands/as)
- [`cy.contains()`](/api/commands/contains)
- [`.find()`](/api/commands/find)
- [`.within()`](/api/commands/within)
- [Retry-ability](/guides/core-concepts/retry-ability)
