---
title: state

---

Get and set state _synchronously_.

# Syntax

```javascript
.state()
.state(key)
.state(key, value)
```

## Usage

### Getting

```javascript
const window = cy.state('window')
```

```javascript
const location = cy.state('location')
```

You can also retrieve all of the existing state synchronously:

```javascript
const allState = cy.state()
```

### Setting

```javascript
cy.state('ids', [1, 2, 3])
```

The state with the key `ids` can subsequently be accessed synchronously.

```javascript
const ids = cy.state('ids') // [1, 2, 3]
```

## Arguments

**{% fa fa-angle-right %} key**  ***(String)***

The `key` of the `value` that is being get or set.

**{% fa fa-angle-right %} value**  ***(any)***

The `value` to be associated with the `key`.

Can be a value of any JavaScript type including `null` and `undefined`.

# Examples

## Get an existing value

***Get the remote window object***

```javascript
const window = cy.state('window')
```

This is a _synchronous_ operation. Contrast this with {% url `cy.window()` window %} which _yields_ the remote window object _asynchronously_.

## No Args

***Get all the state***

```javascript
const allState = cy.state()
```

This will return all of the existing state. (An `Object`.)

{% note warning %}
Remember that `.state()` is a _synchronous_ operation. Most Cypress commands are _asynchronous_ meaning they are queued up to be run later. The `.state()` will only reflect any state from those other commands once they have been run.
{% endnote %}

# Rules

## Timeouts {% helper_icon timeout %}

{% timeouts none .state %}

# Command Log

- `.state()` does *not* log in the Command Log

# Notes

## Primary Use Case

`.state()` is _synchronous_ and as such it's super useful in the implementation of Cypress' core commands and your own {% url "custom commands" custom-commands %} where you can use it to access the remote window object or document and perform actions immediately.

For example, you may have created a custom `login` command {% url "to login programmatically" recipes#Single-Sign-On %} to your SSO system. You might choose to use `.state()` to store the authenticated principal&hellip;

```javascript
Cypress.Commands.add('login', (credentials) => {

  // do the login using the credentials
  const principal = ...

  // store the principal for later use
  cy.state('principal', principal)
})
```

&hellip; which can then be used later in the context of that test.

```javascript
cy.login(credentials)
  .then(() => {
    const principal = cy.state('principal')

    // do something with the principal
  })
```

## Scope

The state exposed by `.state()` is scoped to each test. State that is set in one test will not be available in other tests.

Within the scope of each test the `.state()` is accessible to other commands: it's one way of sharing state across distinct commands that is nevertheless still isolated to a single test.

## What's In `.state()`?

Here's a non-exhaustive listing of _some_ of the state that is exposed in `.state()`.

Key | Value
--- | ---
`aliases` | The aliases configured via {% url `.as()` as %}.
`current` | The current command; for example {% url `.log()` log %} or {% url `.visit()` visit %}.
`runnable` | State about the current test such as whether it has failed.
`subject` | The currently yielded subject.
`url` | The current URL being visited.
`urls` | The URLs that have been visited in this test.
`viewportHeight` | The viewport height.
`viewportWidth` | The viewport width.
`window` | The remote window object.

# See also

- {% url `Commands` custom-commands %}
