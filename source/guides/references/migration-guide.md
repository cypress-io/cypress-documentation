---
title: Migration Guide
---

# Migrating `cy.route()` to `cy.intercept()`

This guide details how to change your test code to migrate from `cy.route()` to `cy.intercept()`. `cy.server()` and `cy.route()` are deprecated in Cypress 6.0.0. In a future release, support for `cy.server()` and `cy.route()` will be removed.

Please also refer to the full documentation for {% url "`cy.intercept()`" intercept %}.

## Match simple route

In many use cases, you can replace `cy.route()` with {% url "`cy.intercept()`" intercept %} and remove the call to `cy.server()` (which is no longer necessary).

{% badge danger Before %}

```js
// Set up XHR listeners using cy.route()
cy.server()
cy.route('/users').as('getUsers')
cy.route('POST', '/project').as('createProject')
cy.route('PATCH', '/projects/*').as('updateProject')
```

{% badge success After %}

```js
// Intercept HTTP requests
cy.intercept('/users').as('getUsers')
cy.intercept('POST', '/project').as('createProject')
cy.intercept('PATCH', '/projects/*').as('updateProject')
```

## Match against `url` and `path`

The `url` argument to {% url "`cy.intercept()`" intercept %} matches against the full url, as opposed to the `url` or `path` in `cy.route()`. If you're using the `url` argument in `cy.intercept()`, you may need to update your code depending on the route you're trying to match.

{% badge danger Before %}

```js
// Match XHRs with a path or url of /users
cy.server()
cy.route({
  method: 'POST',
  url: '/users'
}).as('getUsers')
```

{% badge success After %}

```js
// Match HTTP requests with a path of /users
cy.intercept({
  method: 'POST',
  path: '/users'
}).as('getUsers')

// OR
// Match HTTP requests with an exact url of https://example.cypress.io/users
cy.intercept({
  method: 'POST',
  url: 'https://example.cypress.io/users'
}).as('getUsers')
```

## `cy.wait()` object

The object returned by `cy.wait()` is different from intercepted HTTP requests using `cy.intercept()` than the object returned from an awaited `cy.route()` XHR.

{% badge danger Before %}

```js
// Wait for XHR from cy.route()
cy.route('POST', '/users').as('createUser')
// ...
cy.wait('@createUser')
  .then(({ requestBody, responseBody, status }) => {
    expect(status).to.eq(200)
    expect(requestBody.firstName).to.eq('Jane')
    expect(responseBody.firstName).to.eq('Jane')
  })
```

{% badge success After %}

```js
// Wait for intercepted HTTP request
cy.intercept('POST', '/users').as('createUser')
// ...
cy.wait('@createUser')
  .then(({ request, response }) => {
    expect(response.statusCode).to.eq(200)
    expect(request.body.name).to.eq('Jane')
    expect(response.body.name).to.eq('Jane')
  })
```

## Fixtures

You can stub requests and response with fixture data by defining a `fixture` property in the `routeHandler` argument for `cy.intercept()`.

{% badge danger Before %}

```js
// Stub response with fixture data using cy.route()
cy.route('GET', '/projects', 'fx:projects')
```

{% badge success After %}

```js
// Stub response with fixture data using cy.intercept()
cy.intercept('GET', '/projects', {
  fixture: 'projects'
})
```

## Override route matchers

Unlike `cy.route()`, `cy.intercept()` currently does _not_ allow you to override a previous response. For more information on this, see {% issue 9302 %} and {% url "this blog post" https://glebbahmutov.com/blog/cypress-intercept-problems/#no-overwriting-interceptors %}. Overriding responses will be added in a future release.

# Migrating to Cypress 6.0

This guide details the changes and how to change your code to migrate to Cypress 6.0. {% url "See the full changelog for 6.0" changelog#6-0-0 %}.

## Non-existent element assertions

{% note info %}
**Key takeway:** Use `.should('not.exist')` to assert that an element does not exist in the DOM (not `.should('not.be.visible')`, etc).
{% endnote %}

In previous versions of Cypress, there was a possibility for tests to falsely pass when asserting a negative state on non-existent elements.

For example, in the tests below we want to test that the search dropdown is no longer visible when the search input is blurred because we hide the element in CSS styles. Except in this test, we've mistakenly misspelled one of our selectors.

```js
cy.get('input[type=search]').type('Cypress')
cy.get('#dropdown').should('be.visible')
cy.get('input[type=search]').blur()

// below we misspelled "dropdown" in the selector 😞
// the assertions falsely pass in Cypress < 6.0
// and will correctly fail in Cypress 6.0 +
cy.get('#dropdon').should('not.be.visible')
cy.get('#dropdon').should('not.have.class', 'open')
cy.get('#dropdon').should('not.contain', 'Cypress')
```

{% imgTag /img/guides/el-incorrectly-passes-existence-check.png "non-existent element before 6.0" "width-600" %}

In 6.0, these assertions will now correctly fail, telling us that the `#dropdon` element doesn't exist in the DOM.

{% imgTag /img/guides/el-correctly-fails-existence-check.png "non-existent element in 6.0" "width-600" %}

### Assertions on non-existent elements

This fix may cause some breaking changes in your tests if you are relying on assertions such as `not.be.visible` or `not.contains` to test that the DOM element did not *exist* in the DOM. This means you'll need to update your test code to be more specific about your assertions on non-existent elements.

{% badge danger Before %} Assert that non existent element was not visible

```js
it('test', () => {
  // the .modal element is removed from the DOM on click
  cy.get('.modal').find('.close').click()
  // assertions below pass in < 6.0, but properly fail in 6.0+
  cy.get('.modal').should('not.be.visible')
  cy.get('.modal').should('not.contain', 'Upgrade')
})
```

{% badge success After %} Assert that non existent element does not exist

```js
it('test', () => {
  // the .modal element is removed from the DOM on click
  cy.get('.modal').find('.close').click()
  // we should instead assert that the element doesn't exist
  cy.get('.modal').should('not.exist')
})
```

## Opacity visibility

DOM elements with `opacity: 0` style are no longer considered to be visible. This includes elements with an ancestor that has `opacity: 0` since a child element can never have a computed opacity greater than that of an ancestor.

Elements where the CSS property (or ancestors) is `opacity: 0` are still considered {% url "actionable" interacting-with-elements %} however and {% url "any action commands"  interacting-with-elements#Actionability %} used to interact with the element will perform the action. This matches browser's implementation on how they regard elements with `opacity: 0`.

### Assert visibility of `opacity: 0` element

{% badge danger Before %} Failed assertion that `opacity: 0` element is not visible.

```js
it('test', () => {
  // '.hidden' has 'opacity: 0' style.
  // In < 5.0 this assertion would fail
  cy.get('.hidden').should('not.be.visible')
})
```

{% badge success After %} Passed assertion that `opacity: 0` element is not visible.

```js
it('test', () => {
  // '.hidden' has 'opacity: 0' style.
  // In 6.0 this assertion will pass
  cy.get('.hidden').should('not.be.visible')
})
```

### Perform actions on `opacity: 0` element

In all versions of Cypress, you can interact with elements that have `opacity: 0` style.

```js
it('test', () => {
  // '.hidden' has 'opacity: 0' style.
  cy.get('.hidden').click()       // ✅ clicks on element
  cy.get('.hidden').type('hi')    // ✅ types into element
  cy.get('.hidden').check()       // ✅ checks element
  cy.get('.hidden').select('yes') // ✅ selects element
})
```

## `cy.wait(alias)` type

{% url "`cy.route()`" route %} is deprecated in 6.0.0. We encourage the use of {% url "`cy.intercept()`" intercept %} instead. Due to this deprecation, the type yielded by {% url "`cy.wait(alias)`" wait %} has changed.

{% badge danger Before %} Before 6.0.0, {% url "`cy.wait(alias)`" wait %} would yield an object of type `WaitXHR`.

{% badge success After %} In 6.0.0 and onwards, {% url "`cy.wait(alias)`" wait %} will yield an object of type `Interception`. This matches the new interception object type used for {% url "`cy.intercept()`" intercept %}.

### Restore old behavior

If you need to restore the type behavior prior to 6.0.0 for {% url "`cy.wait(alias)`" wait %}, you can declare a global override for {% url "`cy.wait()`" wait %} like so:

```ts
declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      wait(alias: string): Chainable<Cypress.WaitXHR>
    }
  }
}
```

## `—disable-dev-shm-usage`

We now pass `—disable-dev-shm-usage` to the Chrome browser flags by default. If you're passing this flag in your `plugins` file, you can now remove this code.

{% badge danger Before %} Passing flag in plugins file.

```js
// cypress/plugins/index.js
module.exports = (on, config) => {
  on('before:browser:launch', (browser = {}, launchOptions) => {
    if (browser.family === 'chromium' && browser.name !== 'electron') {
      launchOptions.args.push('--disable-dev-shm-usage')
    }

    return launchOptions
  })
}
```

{% badge success After %} Remove flag from plugins file.

```js
// cypress/plugins/index.js
module.exports = (on, config) => {}
```

### Restore old behavior

If you need to remove the flag in 6.0.0+, you can follow the workaround documented here: {% issue 9242 %}.

# Migrating to Cypress 5.0

This guide details the changes and how to change your code to migrate to Cypress 5.0. {% url "See the full changelog for 5.0" changelog#5-0-0 %}.

## Tests retries

Test retries are available in Cypress 5.0. This means that tests can be re-run a number of times before potentially being marked as a failed test. Read the {% url "Test Retries" test-retries %} doc for more information on how this works and how to turn on test retries.

When test retries are turned on, there will now be a screenshot taken for every failed attempt, so there could potentially be more than 1 screenshot per test failure. Read the {% url "Test Retries" test-retries %} doc for more information on how this works.

The {% url "`cypress-plugin-retries`" https://github.com/Bkucera/cypress-plugin-retries %} plugin has been deprecated in favor of test retries built into Cypress. There's guidance below on how to migrate from the {% url "`cypress-plugin-retries`" https://github.com/Bkucera/cypress-plugin-retries %} plugin to Cypress's built-in test retries.

### Configure test retries via the CLI

{% badge danger Before %} Setting retries with `cypress-plugin-retries` via env vars

```shell
CYPRESS_RETRIES=2 cypress run
```

{% badge success After %} Setting test retries in Cypress 5.0 via env vars

```shell
CYPRESS_RETRIES=2 cypress run
```

### Configure test retries in the configuration file

{% badge danger Before %} Setting retries with `cypress-plugin-retries` via configuration

```json
{
  "env":
  {
    "RETRIES": 2
  }
}
```

{% badge success After %} Setting test retries in Cypress 5.0 via configuration

```json
{
  "retries": 1
}
```

- `runMode` allows you to define the number of test retries when running `cypress run`
- `openMode` allows you to define the number of test retries when running `cypress open`

```json
{
  "retries": {
    "runMode": 1,
    "openMode": 3
  }
}
```

### Configure test retries per test

{% badge danger Before %} Setting retries with `cypress-plugin-retries` via the test

```js
it('test', () => {
  Cypress.currentTest.retries(2)
})
```

{% badge success After %} Setting test retries in Cypress 5.0 via test options

```js
it('allows user to login', {
  retries: 2
}, () => {
  // ...
})
```

- `runMode` allows you to define the number of test retries when running `cypress run`
- `openMode` allows you to define the number of test retries when running `cypress open`

```js
it('allows user to login', {
  retries: {
    runMode: 2,
    openMode: 3
  }
}, () => {
  // ...
})
```

## Module API results

To more accurately reflect result data for runs with {% url "test retries" test-retries %}, the structure of each run's `runs` array resolved from the `Promise` returned from `cypress.run()` of the Module API has changed.

Mainly there is a new `attempts` Array on each `test` which will reflect the result of each test retry.

{% badge danger Before %} `results.runs`  Module API results

```json
{
  // ...
  "runs": [{
    // ...
    "hooks": [{
      "hookId": "h1",
      "hookName": "before each",
      "title": [ "before each hook" ],
      "body": "function () {\n  expect(true).to.be["true"];\n}"
    }],
    // ...
    "screenshots": [{
      "screenshotId": "8ddmk",
      "name": null,
      "testId": "r2",
      "takenAt": "2020-08-05T08:52:20.432Z",
      "path": "User/janelane/my-app/cypress/screenshots/spec.js/test (failed).png",
      "height": 720,
      "width": 1280
    }],
    "stats": {
      // ...
      "wallClockStartedAt": "2020-08-05T08:38:37.589Z",
      "wallClockEndedAt": "2018-07-11T17:53:35.675Z",
      "wallClockDuration": 1171
    },
    "tests": [{
      "testId": "r2",
      "title": [ "test" ],
      "state": "failed",
      "body": "function () {\n  expect(true).to.be["false"];\n}",
      "stack": "AssertionError: expected true to be false\n' +
        '    at Context.eval (...cypress/integration/spec.js:5:21",
      "error": "expected true to be false",
      "timings": {
        "lifecycle": 16,
        "test": {...}
      },
      "failedFromHookId": null,
      "wallClockStartedAt": "2020-08-05T08:38:37.589Z",
      "wallClockDuration": 1171,
      "videoTimestamp": 4486
    }],
  }],
  // ...
}
```

{% badge success After %} `results.runs` Module API results

```json
{
  // ...
  "runs": [{
    // ...
    "hooks": [{
      "hookName": "before each",
      "title": [ "before each hook" ],
      "body": "function () {\n  expect(true).to.be["true"];\n}"
    }],
    // ...
    "stats": {
      // ...
      "startedAt": "2020-08-05T08:38:37.589Z",
      "endedAt": "2018-07-11T17:53:35.675Z",
      "duration": 1171
    },
    "tests": [{
      "title": [ "test" ],
      "state": "failed",
      "body": "function () {\n  expect(true).to.be["false"];\n}",
      "displayError": "AssertionError: expected true to be false\n' +
      '    at Context.eval (...cypress/integration/spec.js:5:21",
      "attempts": [{
        "state": "failed",
        "error": {
          "message": "expected true to be false",
          "name": "AssertionError",
          "stack": "AssertionError: expected true to be false\n' +
      '    at Context.eval (...cypress/integration/spec.js:5:21"
        },
        "screenshots": [{
          "name": null,
          "takenAt": "2020-08-05T08:52:20.432Z",
          "path": "User/janelane/my-app/cypress/screenshots/spec.js/test (failed).png",
          "height": 720,
          "width": 1280
        }],
        "startedAt": "2020-08-05T08:38:37.589Z",
        "duration": 1171,
        "videoTimestamp": 4486
      }]
    }],
  }],
  // ...
}
```

## Cookies `whitelist` option renamed

The {% url "`Cypress.Cookies.defaults()`" cookies %} `whitelist` option has been renamed to `preserve` to more closely reflect its behavior.

{% badge danger Before %} `whitelist` option

```js
Cypress.Cookies.defaults({
  whitelist: 'session_id'
})
```

{% badge success After %} `preserve` option

```js
Cypress.Cookies.defaults({
  preserve: 'session_id'
})
```

## `blacklistHosts` configuration renamed

The `blacklistHosts` configuration has been renamed to {% url "`blockHosts`" configuration#Notes %} to more closely reflect its behavior.

This should be updated in all places where Cypress configuration can be set including the via the configuration file (`cypress.json` by default), command line arguments, the `pluginsFile`, `Cypress.config()` or environment variables.

{% badge danger Before %} `blacklistHosts` configuration in `cypress.json`

```json
{
  "blacklistHosts": "www.google-analytics.com"
}
```

{% badge success After %} `blockHosts` configuration in `cypress.json`

```json
{
  "blockHosts": "www.google-analytics.com"
}
```

## Return type of `Cypress.Blob` changed

We updated the {% url 'Blob' https://github.com/nolanlawson/blob-util %} library used behind {% url "`Cypress.Blob`" blob %} from `1.3.3` to `2.0.2`.

The return type of the {% url "`Cypress.Blob`" blob %} methods `arrayBufferToBlob`, `base64StringToBlob`, `binaryStringToBlob`, and `dataURLToBlob` have changed from `Promise<Blob>` to `Blob`.

{% badge danger Before %} `Cypress.Blob` methods returned a Promise

```js
Cypress.Blob.base64StringToBlob(this.logo, 'image/png')
.then((blob) => {
  // work with the returned blob
})
```

{% badge success After %} `Cypress.Blob` methods return a Blob

```js
const blob = Cypress.Blob.base64StringToBlob(this.logo, 'image/png')

// work with the returned blob
```

## `cy.server()` `whitelist` option renamed

The {% url "`cy.server()`" server %} `whitelist` option has been renamed to `ignore` to more closely reflect its behavior.

{% badge danger Before %} `whitelist` option

```js
cy.server({
  whitelist: (xhr) => {
    return xhr.method === 'GET' && /\.(jsx?|html|css)(\?.*)?$/.test(xhr.url)
  }
})
```

{% badge success After %} `ignore` option

```js
cy.server({
  ignore: (xhr) => {
    return xhr.method === 'GET' && /\.(jsx?|html|css)(\?.*)?$/.test(xhr.url)
  }
})
```

## Cookies `sameSite` property

Values yielded by {% url "`cy.setCookie()`" setcookie %}, {% url "`cy.getCookie()`" getcookie %}, and {% url "`cy.getCookies()`" getcookies %} will now contain the `sameSite` property if specified.

If you were using the `experimentalGetCookiesSameSite` configuration to get the `sameSite` property previously, this should be removed.

{% badge danger Before %} Cookies yielded before had no `sameSite` property.

```js
cy.getCookie('token').then((cookie) => {
  // cy.getCookie() yields a cookie object
  // {
  //   domain: "localhost",
  //   expiry: 1593551644,
  //   httpOnly: false,
  //   name: "token",
  //   path: "/commands",
  //   secure: false,
  //   value: "123ABC"
  // }
})
```

{% badge success After %} Cookies yielded now have `sameSite` property if specified.

```js
cy.getCookie('token').then((cookie) => {
  // cy.getCookie() yields a cookie object
  // {
  //   domain: "localhost",
  //   expiry: 1593551644,
  //   httpOnly: false,
  //   name: "token",
  //   path: "/commands",
  //   sameSite: "strict",
  //   secure: false,
  //   value: "123ABC"
  // }
})
```

## __dirname / __filename

The globals `__dirname` and `__filename` no longer include a leading slash.

{% badge danger Before %} `__dirname` / `__filename`

```js
// cypress/integration/app_spec.js
it('include leading slash < 5.0', () => {
  expect(__dirname).to.equal('/cypress/integration')
  expect(__filename).to.equal('/cypress/integration/app_spec.js')
})
```

{% badge success After %} `__dirname` / `__filename`

```js
// cypress/integration/app_spec.js
it('do not include leading slash >= 5.0', () => {
  expect(__dirname).to.equal('cypress/integration')
  expect(__filename).to.equal('cypress/integration/app_spec.js')
})
```

## Linux dependencies

Running Cypress on Linux now requires the `libgbm` dependency (on Debian-based systems, this is available as `libgbm-dev`). To install all required dependencies on Ubuntu/Debian, you can run the script below:

```shell
apt-get install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb
```

## TypeScript esModuleInterop

Cypress no longer forces the `esModuleInterop` compiler option for TypeScript to be `true` for spec, support, and plugin files. We recommend setting it in your project's `tsconfig.json` instead if you need to.

```json
// tsconfig.json
{
  "compilerOptions": {
    "esModuleInterop": true,
    /* ... other compiler options ... */
  }
}
```

## TypeScript 3.4+ support

Cypress 5.0 raises minimum required TypeScript version from 2.9+ to 3.4+. You'll need to have TypeScript 3.4+ installed within your project to have TypeScript support within Cypress.

## Node.js 10+ support

Cypress comes bundled with it's own {% url "Node.js version" https://github.com/cypress-io/cypress/blob/develop/.node-version %}. However, installing the `cypress` npm package uses the Node.js version installed on your system.

Node.js 8 reached its end of life on Dec 31, 2019 and Node.js 11 reached its end of life on June 1, 2019. {% url "See Node's release schedule" https://github.com/nodejs/Release %}. These Node.js versions will no longer be supported when installing Cypress. The minimum Node.js version supported to install Cypress is Node.js 10 or Node.js 12+.

# Migrating to Cypress 4.0

This guide details the changes and how to change your code to migrate to Cypress 4.0. {% url "See the full changelog for 4.0" changelog#4-0-0 %}.

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
