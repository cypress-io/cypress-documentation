---
title: spread
---

Expand an array into multiple arguments.

<Alert type="info">


Identical to [`.then()`](/api/commands/then), but always expects an array-like structure as its subject.

</Alert>

## Syntax

```javascript
.spread(callbackFn)
.spread(options, callbackFn)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.getCookies().spread(() => {}) // Yield all cookies
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.spread(() => {}) // Errors, cannot be chained off 'cy'
cy.location().spread()   // Errors, 'location' does not yield an array
```

### Arguments

**<Icon name="angle-right"></Icon> fn** ***(Function)***

Pass a function that expands the array into its arguments.

**<Icon name="angle-right"></Icon> options** ***(Object)***

Pass in an options object to change the default behavior of `.spread()`.

Option | Default | Description
--- | --- | ---
`timeout` | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `.spread()` to resolve before [timing out](#Timeouts)

### Yields [<Icon name="question-circle"/>](introduction-to-cypress#Subject-Management)

<List><li>`.spread()` 'yields the return value of your callback function' </li><li>`.spread()` wll not change the subject if `null` or `undefined` is returned.</li></List>

## Examples

### Aliased Routes

#### Expand the array of aliased routes

```javascript
cy.intercept('/users/').as('getUsers')
cy.intercept('/activities/').as('getActivities')
cy.intercept('/comments/').as('getComments')
cy.wait(['@getUsers', '@getActivities', '@getComments'])
  .spread((getUsers, getActivities, getComments) => {
    // each interception is now an individual argument
  })
```

### Cookies

#### Expand the array of cookies

```javascript
cy.getCookies().spread((cookie1, cookie2, cookie3) => {
  // each cookie is now an individual argument
})
```

## Rules

### Requirements [<Icon name="question-circle"/>](introduction-to-cypress#Chains-of-Commands)

<List><li>`.spread()` requires being chained off a previous command.</li><li>`.spread()` requires being chained off a command that yields an array-like structure.</li></List>

### Assertions [<Icon name="question-circle"/>](introduction-to-cypress#Assertions)

<List><li>`.spread` will only run assertions you have chained once, and will not [retry](/guides/core-concepts/retry-ability).</li></List>

### Timeouts [<Icon name="question-circle"/>](introduction-to-cypress#Timeouts)

<List><li>`.spread()` can time out waiting for a promise you've returned to resolve.</li></List>

## Command Log

`.spread()` does *not* log in the Command Log

## History

Version | Changes
--- | ---
[0.5.9](/guides/references/changelog#0-5.9) | `.spread()` command added

## See also

- [`.each()`](/api/commands/each)
- [`.then()`](/api/commands/then)

