---
title: wrap
---

Yield the object passed into `.wrap()`. If the object is a promise, yield its resolved value.

# Syntax

```javascript
cy.wrap(subject)
cy.wrap(subject, options)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.wrap({ name: 'Jane Lane' })
```

## Arguments

**{% fa fa-angle-right %} subject** ***(Object)***

An object to be yielded.

**{% fa fa-angle-right %} options** ***(Object)***

Pass in an options object to change the default behavior of `cy.wrap()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout cy.wrap %}

## Yields {% helper_icon yields %}

{% yields sets_subject cy.wrap 'yields the object it was called with' %}

# Examples

## Objects

### Invoke the function on the subject in wrap and return the new value

```javascript
const getName = () => {
  return 'Jane Lane'
}

cy.wrap({ name: getName }).invoke('name').should('eq', 'Jane Lane') // true
```

## Elements

### Wrap elements to continue executing commands

```javascript
cy.get('form').within(($form) => {
  // ... more commands

  cy.wrap($form).should('have.class', 'form-container')
})
```

### Conditionally wrap elements

```javascript
cy
  .get('button')
  .then(($button) => {
    // $button is a wrapped jQuery element
    if ($button.someMethod() === 'something') {
      // wrap this element so we can
      // use cypress commands on it
      cy.wrap($button).click()
    } else {
      // do something else
    }
  })
```

## Promises

You can wrap promises returned by the application code. Cypress commands will automatically wait for the promise to resolve before continuing with the yielded value to the next command or assertion. See the {% url "Logging in using application code" recipes#Logging-In %} recipe for the full example.

### Simple example

```js
const myPromise = new Promise((resolve, reject) => {
  // we use setTimeout(...) to simulate async code.
  setTimeout(() => {
    resolve({
      type: 'success',
      message: 'It worked!'
    })
  }, 2500)
})

it('should wait for promises to resolve', () => {
  cy.wrap(myPromise).its('message').should('eq', 'It worked!')
})
```

{% imgTag /img/api/wrap/cypress-wrapped-promise-waits-to-resolve.gif "Wrap of promises" %}

### Application example

```javascript
// import application code for logging in
import { userService } from '../../src/_services/user.service'

it('can assert against resolved object using .should', () => {
  cy.log('user service login')
  const username = Cypress.env('username')
  const password = Cypress.env('password')

  // wrap the promise returned by the application code
  cy.wrap(userService.login(username, password))
    // check the yielded object
    .should('be.an', 'object')
    .and('have.keys', ['firstName', 'lastName', 'username', 'id', 'token'])
    .and('contain', {
      username: 'test',
      firstName: 'Test',
      lastName: 'User'
    })

  // cy.visit command will wait for the promise returned from
  // the "userService.login" to resolve. Then local storage item is set
  // and the visit will immediately be authenticated and logged in
  cy.visit('/')
  // we should be logged in
  cy.contains('Hi Test!').should('be.visible')
})
```

**Note:** `.wrap()` will not synchronize asynchronous function calls for you. For example, given the following example:

- You have two async functions `async function foo() {...}` and `async function bar() {...}`
- You need to make sure `foo()` has resolved first before invoking `bar()`
- `bar()` is also dependent on some data that is created while after calling other Cypress commands.

**{% fa fa-exclamation-triangle red %}** If you wrap the asynchronous functions in `cy.wrap()`, then `bar()` may be called prematurely before the required data is available:

```javascript
cy.wrap(foo())

cy.get('some-button').click()
cy.get('some-input').type(someValue)
cy.get('some-submit-button').click()

// this will execute `bar()` immediately without waiting
// for other cy.get(...) functions to complete
cy.wrap(bar()) // DON'T DO THIS
```

This behavior is due to the function invocation `foo()` and `bar()`, which call the functions immediately to return a Promise.

**{% fa fa-check-circle green %}** If you want `bar()` to execute after `foo()` and the {% url "`cy.get()`" get %} commands, one solution is to chain off the final command using {% url "`.then()`" then %}:

```javascript
cy.wrap(foo())

cy.get('some-button').click()
cy.get('some-input').type(someValue)
cy.get('some-submit-button').click().then(() => {
  // this will execute `bar()` after the
  // other cy.get(...) functions complete
  cy.wrap(bar())
})
```

# Rules

## Requirements {% helper_icon requirements %}

{% requirements parent cy.wrap %}

## Assertions {% helper_icon assertions %}

{% assertions wrap cy.wrap %}

## Timeouts {% helper_icon timeout %}

{% timeouts assertions cy.wrap %}

# Command Log

**Make assertions about object**

```javascript
cy.wrap({ amount: 10 })
  .should('have.property', 'amount')
  .and('eq', 10)
```

The commands above will display in the Command Log as:

{% imgTag /img/api/wrap/wrapped-object-in-cypress-tests.png "Command Log wrap" %}

When clicking on the `wrap` command within the command log, the console outputs the following:

{% imgTag /img/api/wrap/console-log-only-shows-yield-of-wrap.png "Console Log wrap" %}

{% history %}
{% url "3.2.0" changelog#3-2-0 %} | Retry `cy.wrap()` if `undefined` when followed by {% url "`.should()`" should %}
{% url "0.4.5" changelog#0.4.5 %} | `cy.wrap()` command added
{% endhistory %}

# See also

- {% url `.invoke()` invoke %}
- {% url `.its()` its %}
- {% url `.should()` should %}
- {% url `.spread()` spread %}
- {% url `.then()` then %}
- {% url "Logging In: Using application code" recipes#Logging-In %} recipe
- {% url "Unit Testing: Application Code" recipes#Unit-Testing %} recipe
