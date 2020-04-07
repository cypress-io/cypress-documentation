---
title: Cypress.Promise

---

Cypress automatically includes {% url 'Bluebird' https://github.com/petkaantonov/bluebird %} and exposes it as `Cypress.Promise`.

Instantiate a new bluebird promise.

# Syntax

```javascript
new Cypress.Promise(fn)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
new Cypress.Promise((resolve, reject) => { ... })
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
new cy.Promise(...)  // Errors, cannot be chained off 'cy'
```
# Examples

Use `Cypress.Promise` to create promises. Cypress is promise aware so if you return a promise from inside of commands like {% url `.then()` then %}, Cypress will not continue until those promises resolve.

## Basic Promise

```javascript
cy.get('button').then(($button) => {
  return new Cypress.Promise((resolve, reject) => {
    // do something custom here
  })
})
```

## Waiting for Promises

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

# See also

- {% url 'Bundled Tools' bundled-tools %}
