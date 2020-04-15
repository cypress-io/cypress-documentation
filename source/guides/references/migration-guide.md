---
title: Migration Guide
---

# Migrating to Cypress 4.0

This guide details the changes and how to change your code to migrate to Cypress 4.0.

## Mocha upgrade

Mocha was upgraded from `2.5.3` to `7.0.1`, which includes a number of breaking changes and new features outlined in their {% url "changelog" https://github.com/mochajs/mocha/blob/master/CHANGELOG.md %}. Some changes you might notice are described below.

### {% fa fa-warning red %} Breaking Change: invoke `done` callback and return a promise

Starting with [Mocha 3.0.0](https://github.com/mochajs/mocha/blob/master/CHANGELOG.md#300--2016-07-31), invoking a `done` callback *and* returning a promise in a test results in an error.

This error originates from Mocha and is discussed at length [here](https://github.com/mochajs/mocha/pull/1320) and [here](https://github.com/mochajs/mocha/issues/2407).

The reason is that using two different ways to signal that a test is finished is usually a mistake and there is always a way to only use one. There is a [proposal to handle this situation without erroring](https://github.com/mochajs/mocha/issues/2509) that may be released in a future version of Mocha.

In the meantime, you can fix the error by choosing a single way to signal the end of your test's execution.

#### Example #1

{% badge danger Before %} This test has a done callback and a promise

```javascript
it('uses invokes done and returns promise', (done) => {
  return codeUnderTest.doSomethingThatReturnsPromise().then((result) => {
    // assertions here
    done()
  })
})
```

{% badge success After %} You can remove the `done` callback and return the promise instead:

```javascript
it('uses invokes done and returns promise', () => {
  return codeUnderTest.doSomethingThatReturnsPromise().then((result) => {
    // assertions here
  })
})
```

#### Example #2

{% badge danger Before %} Sometimes it might make more sense to use the `done` callback and not return a promise:

```javascript
it('uses invokes done and returns promise', (done) => {
  eventEmitter.on('change', () => {
    // assertions
    done()
  })

  return eventEmitter.doSomethingThatEmitsChange()
})
```

{% badge success After %} In this case, you don't need to return the promise:

```javascript
it('uses invokes done and returns promise', (done) => {
  eventEmitter.on('change', () => {
    // assertions
    done()
  })

  eventEmitter.doSomethingThatEmitsChange()
})
```

#### Example #3

Test functions using `async/await` automatically return a promise, so they need to be refactored to not use a `done` callback.

{% badge danger Before %} This will cause an overspecified error.

```javascript
it('uses async/await', async (done) => {
  const eventEmitter = await getEventEmitter()
  eventEmitter.on('change', () => done())
  eventEmitter.doSomethingThatEmitsChange()
})
```

{% badge success After %} Update to the test code below.

```javascript
it('uses async/await', async () => {
  const eventEmitter = await getEventEmitter()
  return new Promise((resolve) => {
    eventEmitter.on('change', () => resolve())
    eventEmitter.doSomethingThatEmitsChange()
  })
})
```

### {% fa fa-warning red %} Tests require a title

Tests now require a title and will error when not provided one.

```javascript
// Would show as pending in Cypress 3
// Will throw type error in Cypress 4:
it() // Test argument "title" should be a string. Received type "undefined"
```

## Chai upgrade

Chai was upgraded from `3.5.0` to `4.2.0`, which includes a number of breaking changes and new features outlined in {% url "Chai's migration guide" https://github.com/chaijs/chai/issues/781 %}. Some changes you might notice are described below.

### {% fa fa-warning red %} Breaking Change: assertions expecting numbers

Some assertions will now throw an error if the assertion's target or arguments are not numbers, including `within`, `above`, `least`, `below`, `most`, `increase` and `decrease`.

```javascript
// These will now throw errors:
expect(null).to.be.within(0, 1)
expect(null).to.be.above(10)
// This will not throw errors:
expect('string').to.have.a.length.of.at.least(3)
```

### {% fa fa-warning red %} Breaking Change: `empty` assertions

The `.empty` assertion will now throw when it is passed non-string primitives and functions.

```javascript
// These will now throw TypeErrors
expect(Symbol()).to.be.empty
expect(() => {}).to.be.empty
```

### {% fa fa-warning red %} Breaking Change: non-existent properties

An error will throw when a non-existent property is read. If there are typos in property assertions, they will now appear as failures.

```javascript
// Would pass in Cypress 3 but will fail correctly in 4
expect(true).to.be.ture
```

### {% fa fa-warning red %} Breaking Change: `include` checks strict equality

`include` now always use strict equality unless the `deep` property is set.

{% badge danger Before %} `include` would always use deep equality

```javascript
// Would pass in Cypress 3 but will fail correctly in 4
cy.wrap([{
  first: 'Jane',
  last: 'Lane'
}])
.should('include', {
  first: 'Jane',
  last: 'Lane'
})
```

{% badge success After %} Need to specificy `deep.include` for deep equality

```javascript
// Specifically check for deep.include to pass in Cypress 4
cy.wrap([{
  first: 'Jane',
  last: 'Lane'
}])
.should('deep.include', {
  first: 'Jane',
  last: 'Lane'
})
```

## Sinon.JS upgrade

Sinon.JS was upgraded from `3.2.0` to `8.1.1`, which includes a number of breaking changes and new features outlined in {% url "Sinon.JS's migration guide" https://sinonjs.org/releases/latest/#migration-guides %}. Some changes you might notice are described below.

### {% fa fa-warning red %} Breaking Change: stub non-existent properties

An error will throw when trying to stub a non-existent property.

```javascript
// Would pass in Cypress 3 but will fail in 4
cy.stub(obj, 'nonExistingProperty')
```

### {% fa fa-warning red %} Breaking Change: `reset()` replaced by `resetHistory()`

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

## Plugin Event `before:browser:launch`

Since we now support more advanced browser launch options, during `before:browser:launch` we no longer yield the second argument as an array of browser arguments and instead yield a `launchOptions` object with an `args` property.

You can see more examples of the new `launchOptions` in use in the {% url "Browser Launch API doc" browser-launch-api %}.

{% badge danger Before %} The second argument is no longer an array.

```js
on('before:browser:launch', (browser, args) => {
  // will print a deprecation warning telling you
  // to change your code to the new signature
  args.push('--another-arg')

  return args
})
```

{% badge success After %} Access the `args` property off `launchOptions`

```js
on('before:browser:launch', (browser, launchOptions) => {
  launchOptions.args.push('--another-arg')

  return launchOptions
})
```

## Electron options in `before:browser:launch`

Previously, you could pass options to the launched Electron {% url "BrowserWindow" https://www.electronjs.org/docs/api/browser-window#new-browserwindowoptions %} in `before:browser:launch` by modifying the `launchOptions` object.

Now, you must pass those options as `launchOptions.preferences`:

{% badge danger Before %} Passing BrowserWindow options on the `launchOptions` object is no longer supported.

```js
on('before:browser:launch', (browser, args) => {
  args.darkTheme = true

  return args
})
```

{% badge success After %} Pass BrowserWindow options on the `options.preferences` object instead.

```js
on('before:browser:launch', (browser, launchOptions) => {
  launchOptions.preferences.darkTheme = true

  return launchOptions
})
```

## Launching Chrome Canary with `--browser`

Before 4.0, `cypress run --browser canary` would run tests in Chrome Canary.

Now, you must pass `--browser chrome:canary` to select Chrome Canary.

See the {% url "docs for `cypress run --browser`" command-line#cypress-run-browser-lt-browser-name-or-path-gt %} for more information.

{% badge danger Before %} Passing `canary` will no longer find a browser

```shell
cypress run --browser canary
```

{% badge success After %} Pass `chrome:canary` to launch Chrome Canary

```shell
cypress run --browser chrome:canary
```

## Chromium-based browser `family`

We updated the {% url "Cypress browser objects" browser-launch-api %} of all Chromium-based browsers, including Electron, to have `chromium` set as their `family` field.

```js
module.exports = (on, config) => {
  on('before:browser:launch', (browser = {}, launchOptions) => {
    if (browser.family === 'electron') {
      // would match Electron in 3.x
      // will match no browsers in 4.0.0
      return launchOptions
    }

    if (browser.family === 'chromium') {
      // would match no browsers in 3.x
      // will match any Chromium-based browser in 4.0.0
      // ie Chrome, Canary, Chromium, Electron, Edge (Chromium-based)
      return launchOptions
    }
  })
}
```

### Example #1 (Finding Electron)

{% badge danger Before %} This will no longer find the Electron browser.

```js
module.exports = (on, config) => {
  on('before:browser:launch', (browser = {}, args) => {
    if (browser.family === 'electron') {
      // run code for Electron browser in 3.x
      return args
    }
  })
}
```

{% badge success After %} Use `browser.name` to check for Electron

```js
module.exports = (on, config) => {
  on('before:browser:launch', (browser = {}, launchOptions) => {
    if (browser.name === 'electron') {
      // run code for Electron browser in 4.0.0
      return launchOptions
    }
  })
}
```

### Example #2 (Finding Chromium-based browsers)

{% badge danger Before %} This will no longer find any browsers.

```js
module.exports = (on, config) => {
  on('before:browser:launch', (browser = {}, args) => {
    if (browser.family === 'chrome') {
      // in 4.x, `family` was changed to 'chromium' for all Chromium-based browsers
      return args
    }
  })
}
```

{% badge success After %} Use `browser.name` and `browser.family` to select non-Electron Chromium-based browsers

```js
module.exports = (on, config) => {
  on('before:browser:launch', (browser = {}, launchOptions) => {
    if (browser.family === 'chromium' && browser.name !== 'electron') {
      // pass launchOptions to Chromium-based browsers in 4.0
      return launchOptions
    }
  })
}
```

## `cy.writeFile()` yields `null`

`cy.writeFile()` now yields `null` instead of the `contents` written to the file. This change was made to more closely align with the behavior of Node.js {% url "`fs.writeFile`" https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback %}.

{% badge danger Before %} This assertion will no longer pass

```js
cy.writeFile('path/to/message.txt', 'Hello World')
  .then((text) => {
    // Would pass in Cypress 3 but will fail in 4
    expect(text).to.equal('Hello World') // false
  })
```

{% badge success After %} Instead read the contents of the file

```js
cy.writeFile('path/to/message.txt', 'Hello World')
cy.readFile('path/to/message.txt').then((text) => {
  expect(text).to.equal('Hello World') // true
})
```

## cy.contains() ignores invisible whitespaces

Browsers ignore leading, trailing, duplicate whitespaces. And Cypress now does that, too.

```html
<p>hello
world</p>
```

```javascript
cy.get('p').contains('hello world') // Fail in 3.x. Pass in 4.0.0.
cy.get('p').contains('hello\nworld') // Pass in 3.x. Fail in 4.0.0.
```

## Node.js 8+ support

Cypress comes bundled with it's own {% url "Node.js version" https://github.com/cypress-io/cypress/blob/develop/.node-version %}. However, installing the `cypress` npm package uses the Node.js version installed on your system.

Node.js 4 reached its end of life on April 30, 2018 and Node.js 6 reached its end of life on April 30, 2019. {% url "See Node's release schedule" https://github.com/nodejs/Release %}. These Node.js versions will no longer be supported when installing Cypress. The minimum Node.js version supported to install Cypress is Node.js 8.

## CJSX is no longer supported

Cypress no longer supports CJSX (CoffeeScript + JSX), because the library used to transpile it is no longer maintained.

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
