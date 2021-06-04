---
title: Cypress.Promise
---

Cypress automatically includes [Bluebird](https://github.com/petkaantonov/bluebird) and exposes it as `Cypress.Promise`.

Instantiate a new bluebird promise.

## Syntax

```javascript
new Cypress.Promise(fn)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
new Cypress.Promise((resolve, reject) => { ... })
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
new cy.Promise(...)  // Errors, cannot be chained off 'cy'
```

## Examples

Use `Cypress.Promise` to create promises. Cypress is promise aware so if you return a promise from inside of commands like [`.then()`](/api/commands/then), Cypress will not continue until those promises resolve.

### Basic Promise

```javascript
cy.get('button').then(($button) => {
  return new Cypress.Promise((resolve, reject) => {
    // do something custom here
  })
})
```

### Waiting for Promises

```javascript
it('waits for promises to resolve', () => {
  let waited = false

  function waitOneSecond() {
    // return a promise that resolves after 1 second
    return new Cypress.Promise((resolve, reject) => {
      setTimeout(() => {
        // set waited to true
        waited = true

        // resolve with 'foo' string
        resolve('foo')
      }, 1000)
    })
  }

  cy.wrap(null).then(() => {
    // return a promise to cy.then() that
    // is awaited until it resolves
    return waitOneSecond().then((str) => {
      expect(str).to.eq('foo')
      expect(waited).to.be.true
    })
  })
})
```

## Notes

### Rejected test promises do not fail tests

If the test code has an unhandled rejected promise, it does not automatically fail the test. If you do want to fail the test if there is an unhandled rejected promise in the test code you have to do one of two things:

If you use `Cypress.Promise` in your test code, register a callback using Bluebird's API

```javascript
Cypress.Promise.onPossiblyUnhandledRejection((error, promise) => {
  throw error
})
```

If you use native built-in promises in your test code, register an event listener on the test `window` object:

```javascript
window.addEventListener('unhandledrejection', (event) => {
  throw event.reason
})
```

**Note:** because this is the test `window` object, such listeners are NOT reset before every test. You can register such listeners once using the `before` hook in the spec file.

## See also

- [Bundled Tools](/guides/references/bundled-tools)
- The recipe [Handling errors](/examples/examples/recipes#Fundamentals)
