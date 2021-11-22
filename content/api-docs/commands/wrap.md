---
title: wrap
---

Yield the object passed into `.wrap()`. If the object is a promise, yield its
resolved value.

## Syntax

```javascript
cy.wrap(subject)
cy.wrap(subject, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.wrap({ name: 'Jane Lane' })
```

### Arguments

**<Icon name="angle-right"></Icon> subject** **_(Object)_**

An object to be yielded.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `cy.wrap()`.

| Option    | Default                                                              | Description                                                                              |
| --------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `log`     | `true`                                                               | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |
| `timeout` | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `cy.wrap()` to resolve before [timing out](#Timeouts)                   |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`cy.wrap()` 'yields the object it was called with' </li></List>

## Examples

### Objects

#### Invoke the function on the subject in wrap and return the new value

```javascript
const getName = () => {
  return 'Jane Lane'
}

cy.wrap({ name: getName }).invoke('name').should('eq', 'Jane Lane') // true
```

### Elements

#### Wrap elements to continue executing commands

```javascript
cy.get('form').within(($form) => {
  // ... more commands

  cy.wrap($form).should('have.class', 'form-container')
})
```

#### Conditionally wrap elements

```javascript
cy.get('button').then(($button) => {
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

### Promises

You can wrap promises returned by the application code. Cypress commands will
automatically wait for the promise to resolve before continuing with the yielded
value to the next command or assertion. See the
[Logging in using application code](/examples/examples/recipes#Logging-In)
recipe for the full example.

#### Simple example

```js
const myPromise = new Promise((resolve, reject) => {
  // we use setTimeout(...) to simulate async code.
  setTimeout(() => {
    resolve({
      type: 'success',
      message: 'It worked!',
    })
  }, 2500)
})

it('should wait for promises to resolve', () => {
  cy.wrap(myPromise).its('message').should('eq', 'It worked!')
})
```

<DocsImage src="/img/api/wrap/cypress-wrapped-promise-waits-to-resolve.gif" alt="Wrap of promises" />

#### Application example

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
      lastName: 'User',
    })

  // cy.visit command will wait for the promise returned from
  // the "userService.login" to resolve. Then local storage item is set
  // and the visit will immediately be authenticated and logged in
  cy.visit('/')
  // we should be logged in
  cy.contains('Hi Test!').should('be.visible')
})
```

**Note:** `.wrap()` will not synchronize asynchronous function calls for you.
For example, given the following example:

- You have two async functions `async function foo() {...}` and
  `async function bar() {...}`
- You need to make sure `foo()` has resolved first before invoking `bar()`
- `bar()` is also dependent on some data that is created while after calling
  other Cypress commands.

**<Icon name="exclamation-triangle" color="red"></Icon>** If you wrap the
asynchronous functions in `cy.wrap()`, then `bar()` may be called prematurely
before the required data is available:

```javascript
cy.wrap(foo())

cy.get('some-button').click()
cy.get('some-input').type(someValue)
cy.get('some-submit-button').click()

// this will execute `bar()` immediately without waiting
// for other cy.get(...) functions to complete
cy.wrap(bar()) // DON'T DO THIS
```

This behavior is due to the function invocation `foo()` and `bar()`, which call
the functions immediately to return a Promise.

**<Icon name="check-circle" color="green"></Icon>** If you want `bar()` to
execute after `foo()` and the [cy.get()](/api/commands/get) commands, one
solution is to chain off the final command using [.then()](/api/commands/then):

```javascript
cy.wrap(foo())

cy.get('some-button').click()
cy.get('some-input').type(someValue)
cy.get('some-submit-button')
  .click()
  .then(() => {
    // this will execute `bar()` after the
    // other cy.get(...) functions complete
    cy.wrap(bar())
  })
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`cy.wrap()` requires being chained off of `cy`.</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`cy.wrap()`, when its argument is a promise, will automatically wait
until the promise resolves. If the promise is rejected, `cy.wrap()` will fail
the test.</li><li>`cy.wrap()` will automatically
[retry](/guides/core-concepts/retry-ability) until all chained assertions have
passed</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`cy.wrap()` can time out waiting for assertions you've added to
pass.</li></List>

## Command Log

**Make assertions about object**

```javascript
cy.wrap({ amount: 10 }).should('have.property', 'amount').and('eq', 10)
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/wrap/wrapped-object-in-cypress-tests.png" alt="Command Log wrap" />

When clicking on the `wrap` command within the command log, the console outputs
the following:

<DocsImage src="/img/api/wrap/console-log-only-shows-yield-of-wrap.png" alt="Console Log wrap" />

## History

| Version                                     | Changes                                                                             |
| ------------------------------------------- | ----------------------------------------------------------------------------------- |
| [3.2.0](/guides/references/changelog#3-2-0) | Retry `cy.wrap()` if `undefined` when followed by [.should()](/api/commands/should) |
| [0.4.5](/guides/references/changelog#0.4.5) | `cy.wrap()` command added                                                           |

## See also

- [`.invoke()`](/api/commands/invoke)
- [`.its()`](/api/commands/its)
- [`.should()`](/api/commands/should)
- [`.spread()`](/api/commands/spread)
- [`.then()`](/api/commands/then)
- [Logging In: Using application code](/examples/examples/recipes#Logging-In)
  recipe
- [Unit Testing: Application Code](/examples/examples/recipes#Unit-Testing)
  recipe
