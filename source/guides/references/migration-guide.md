---
title: Migration Guide
---

# Migrating to Cypress 4.0

Changes in Cypress 4.0 mainly relate to upgrading Cypress's own dependencies, which themselves have breaking changes. This guide details the changes and how to change your code to migrate to Cypress 4.0.

## Cypress no longer supports Node 6 or earlier

Read more about the reasoning in [this issue](https://github.com/cypress-io/cypress/issues/4200).

## Changes related to Mocha upgrade

Mocha has been upgraded to Mocha 7.

Starting with [Mocha 3.0.0](https://github.com/mochajs/mocha/blob/master/CHANGELOG.md#300--2016-07-31), invoking a `done` callback *and* returning a promise in a test results in an error.

This error originates from mocha and is discussed at length [here](https://github.com/mochajs/mocha/pull/1320) and [here](https://github.com/mochajs/mocha/issues/2407).

The reason is that using two different ways to signal that a test is finished is usually a mistake, and there is always a way to only use one. There is a [proposal to handle this situation without erroring](https://github.com/mochajs/mocha/issues/2509) that may be released in a future version of Mocha.

In the meantime, you can fix the error by choosing one way or the other to signal the end of your test's execution.

Given the following test:

```javascript
it('uses invokes done and returns promise', function (done) {
  return codeUnderTest.doSomethingThatReturnsPromise().then((result) => {
    // assertions here
    done()
  })
})
```

You don't need the `done` callback. Just return the promise instead:

```javascript
it('uses invokes done and returns promise', function () {
  return codeUnderTest.doSomethingThatReturnsPromise().then((result) => {
    // assertions here
  })
})
```

Sometimes it might make more sense to use the `done` callback and not return a promise:

```javascript
it('uses invokes done and returns promise', function (done) {
  eventEmitter.on('change', () => {
    // assertions
    done()
  })

  return eventEmitter.doSomethingThatEmitsChange()
})
```

In this case, you don't need to return the promise:

```javascript
it('uses invokes done and returns promise', function (done) {
  eventEmitter.on('change', () => {
    // assertions
    done()
  })
  eventEmitter.doSomethingThatEmitsChange()
})
```

Test functions using `async/await` automatically return a promise, so they need to be refactored to not use a `done` callback.

```javascript
// Will cause overspecified error
it('uses async/await', async function (done) {
  const eventEmitter = await getEventEmitter()
  eventEmitter.on('change', () => done())
  eventEmitter.doSomethingThatEmitsChange()
})
 // Update to this
it('uses async/await', async function () {
  const eventEmitter = await getEventEmitter()
  return new Promise((resolve) => {
    eventEmitter.on('change', () => resolve())
    eventEmitter.doSomethingThatEmitsChange()
  })
})
```

 ## Changes related to Chai upgrade

 Chai has been upgraded to Chai 4, which includes a number of breaking changes and new features outlined in [Chai's migration guide](https://github.com/chaijs/chai/issues/781). Some changes you might notice include:

- The assertions: `within`, `above`, `least`, `below`, `most`, `increase`, `decrease` will throw an error if the assertion's target or arguments are not numbers.

```javascript
// These will throw errors:
expect(null).to.be.within(0, 1)
expect(null).to.be.above(10)
// This will not:
expect('string').to.have.a.length.of.at.least(3)
```

- The `.empty` assertion will now throw when it is passed non-string primitives and functions:

```javascript
// These will throw TypeErrors:
expect(Symbol()).to.be.empty
expect(function() {}).to.be.empty
```

- An error will throw when a non-existent property is read. If there are typos in property assertions, they will now appear as failures.

```javascript
// Would pass in Chai 3 but will fail in 4
expect(true).to.be.ture
```

## Changes related to Sinon.JS upgrade

Sinon.JS has been upgraded to Sinon.JS 7 with some [breaking changes](https://sinonjs.org/releases/v7.1.1/#migration-guides), including:

- An error will throw when trying to stub a non-existent property.

```javascript
// Would pass in Sinon 3 but will fail in 4+
cy.stub(obj, 'nonExistingProperty')
```

- For spies and stubs, the `reset()` method was replaced by `resetHistory()`.

```javascript
const spy = cy.spy()
const stub = cy.stub()

// Old, no longer works
spy.reset()
stub.reset()

// Update to this
spy.resetHistory()
stub.resetHistory()
```

## Cypress no longer supports CJSX by default

Cypress no longer supports CJSX (CoffeeScript + JSX), because the library used to transpile it is outdated and unmaintained.

If you need CJSX support, you can use a pre-2.x version of the Browserify preprocessor.

```shell
npm install @cypress/browserify-preprocessor@1.1.2
```

```javascript
// In cypress/plugins/index.js

const browserify = require('@cypress/browserify-preprocessor')

module.exports = (on) => {
  on('file:preprocessor', browserify())
}
```
