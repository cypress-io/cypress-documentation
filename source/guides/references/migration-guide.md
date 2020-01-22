---
title: Migration Guide
---

# Migrating to Cypress 4.0

Changes in Cypress 4.0 mainly relate to upgrading Cypress's own dependencies, which themselves have breaking changes. This guide details the changes and how to change your code to migrate to Cypress 4.0.

## Node 8+ support

Node 4 reached its end of life on April 30, 2018 and Node 6 reached its end of life on April 30, 2019. {% url "See Node's release schedule" https://github.com/nodejs/Release %}. These Node versions will no longer be supported. The minimum Node version supported by Cypress is Node 8.

## Mocha upgrade changes

Mocha has been upgraded to Mocha 7.

Starting with [Mocha 3.0.0](https://github.com/mochajs/mocha/blob/master/CHANGELOG.md#300--2016-07-31), invoking a `done` callback *and* returning a promise in a test results in an error.

This error originates from Mocha and is discussed at length [here](https://github.com/mochajs/mocha/pull/1320) and [here](https://github.com/mochajs/mocha/issues/2407).

The reason is that using two different ways to signal that a test is finished is usually a mistake and there is always a way to only use one. There is a [proposal to handle this situation without erroring](https://github.com/mochajs/mocha/issues/2509) that may be released in a future version of Mocha.

In the meantime, you can fix the error by choosing a single way to signal the end of your test's execution.

### Example #1

{% badge danger Before %} This test has a done callback and a promise

```javascript
it('uses invokes done and returns promise', function (done) {
  return codeUnderTest.doSomethingThatReturnsPromise().then((result) => {
    // assertions here
    done()
  })
})
```

{% badge success After %} You can remove the `done` callback and return the promise instead:

```javascript
it('uses invokes done and returns promise', function () {
  return codeUnderTest.doSomethingThatReturnsPromise().then((result) => {
    // assertions here
  })
})
```

### Example #2

{% badge danger Before %} Sometimes it might make more sense to use the `done` callback and not return a promise:

```javascript
it('uses invokes done and returns promise', function (done) {
  eventEmitter.on('change', () => {
    // assertions
    done()
  })

  return eventEmitter.doSomethingThatEmitsChange()
})
```

{% badge success After %} In this case, you don't need to return the promise:

```javascript
it('uses invokes done and returns promise', function (done) {
  eventEmitter.on('change', () => {
    // assertions
    done()
  })
  eventEmitter.doSomethingThatEmitsChange()
})
```

### Example #3

Test functions using `async/await` automatically return a promise, so they need to be refactored to not use a `done` callback.

{% badge danger Before %} This will cause an overspecified error.

```javascript
it('uses async/await', async function (done) {
  const eventEmitter = await getEventEmitter()
  eventEmitter.on('change', () => done())
  eventEmitter.doSomethingThatEmitsChange()
})
```

{% badge danger Before %} Update to the test code below.

```javascript
it('uses async/await', async function () {
  const eventEmitter = await getEventEmitter()
  return new Promise((resolve) => {
    eventEmitter.on('change', () => resolve())
    eventEmitter.doSomethingThatEmitsChange()
  })
})
```

## Chai upgrade changes

Chai has been upgraded to Chai 4, which includes a number of breaking changes and new features outlined in [Chai's migration guide](https://github.com/chaijs/chai/issues/781). Some changes you might notice include:

### Example #1

Some assertions will now throw an error if the assertion's target or arguments are not numbers, including `within`, `above`, `least`, `below`, `most`, `increase` and `decrease`.

```javascript
// These will now throw errors:
expect(null).to.be.within(0, 1)
expect(null).to.be.above(10)
// This will not throw errors:
expect('string').to.have.a.length.of.at.least(3)
```

### Example #2

The `.empty` assertion will now throw when it is passed non-string primitives and functions.

```javascript
// These will now throw TypeErrors
expect(Symbol()).to.be.empty
expect(function() {}).to.be.empty
```

### Example #3

An error will throw when a non-existent property is read. If there are typos in property assertions, they will now appear as failures.

```javascript
// Would pass in Cypress 3 but will fail in 4
expect(true).to.be.ture
```

## Sinon.JS upgrade changes

Sinon.JS has been upgraded to Sinon.JS 7 with some [breaking changes](https://sinonjs.org/releases/v7.1.1/#migration-guides).

### Example #1

An error will throw when trying to stub a non-existent property.

```javascript
// Would pass in Cypress 3 but will fail in 4
cy.stub(obj, 'nonExistingProperty')
```

### Example #2

For spies and stubs, the `reset()` method was replaced by `resetHistory()`.

{% badge danger Before %} Spies and stubs using `reset()`.

```javascript
const spy = cy.spy()
const stub = cy.stub()

spy.reset()
stub.reset()
```

{% badge success After %} Update spies and stubs should now use `resetHistory()`.

```javascript
const spy = cy.spy()
const stub = cy.stub()

spy.resetHistory()
stub.resetHistory()
```

## CJSX is no longer supported

Cypress no longer supports CJSX (CoffeeScript + JSX), because the library used to transpile it is no longer maintained.

### Example #1

If you need CJSX support, you can use a pre-2.x version of the Browserify preprocessor.

```shell
npm install @cypress/browserify-preprocessor@1.1.2
```

```javascript
// cypress/plugins/index.js
const browserify = require('@cypress/browserify-preprocessor')

module.exports = (on) => {
  on('file:preprocessor', browserify())
}
```
