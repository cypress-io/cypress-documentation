---
title: Migration Guide
---

# Migrating to Cypress 7.0

This guide details the changes and how to change your code to migrate to Cypress 7.0. [See the full changelog for 7.0](/guides/references/changelog#7-0-0).

## [`cy.intercept()`][intercept] changes

[Cypress 7.0](<(/guides/references/changelog#7-0-0)>) comes with some breaking changes to [`cy.intercept()`][intercept]:

### Handler ordering is reversed

Previous to Cypress 7.0, [`cy.intercept()`][intercept] handlers were run in the order that they are defined, stopping after the first handler to call `req.reply()`, or once all handlers are complete.

With Cypress 7.0, [`cy.intercept()`][intercept] handlers are now run in reverse order of definition, stopping after the first handler to call `req.reply()`, or once all handlers are complete.

This change was done so that users can override previously declared [`cy.intercept()`][intercept] handlers by calling [`cy.intercept()`][intercept] again. See [#9302](https://github.com/cypress-io/cypress/issues/9302) for more details.

<Badge type="danger">Before</Badge>

```js
cy.intercept(url, (req) => {
  /* This will be called first! */
})
cy.intercept(url, (req) => {
  /* This will be called second! */
})
```

<Badge type="success">After</Badge>

```js
cy.intercept(url, (req) => {
  /* This will be called second! */
})
cy.intercept(url, (req) => {
  /* This will be called first! */
})
```

### URL matching is stricter

Before Cypress 7.0, [`cy.intercept()`][intercept] would match URLs against strings by using `minimatch`, substring match, or by equality.

With Cypress 7.0, this behavior is being tightened - URLs are matched against strings only by `minimatch` or by equality. The substring match has been removed.

This more closely matches the URL matching behavior shown by `cy.route()`. However, some intercepts will not match, even though they did before.

For example, requests with querystrings may no longer match:

```js
// will this intercept match a request for `/items?page=1`?
cy.intercept('/items')
// ✅ before 7.0.0, this will match, because it is a substring
// ❌ after 7.0.0, this will not match, because of the querystring
// solution: update the intercept to match the querystring with a wildcard:
cy.intercept('/items?*')
```

Also, requests for paths in nested directories may be affected:

```js
// will this intercept match a request for `/some/items`?
cy.intercept('/items')
// ✅ before 7.0.0, this will match, because it is a substring
// ❌ after 7.0.0, this will not match, because of the leading directory
// solution: update the intercept to include the directory:
cy.intercept('/some/items')
```

Additionally, the `matchUrlAgainstPath` `RouteMatcher` option that was added in Cypress 6.2.0 has been removed in Cypress 7.0. It can be safely removed from tests.

### Deprecated `cy.route2` command removed

`cy.route2` was the original name for `cy.intercept` during the experimental phase of the feature. It was deprecated in Cypress 6.0. In Cypress 7.0, it has been removed entirely. Please update existing usages of `cy.route2` to call `cy.intercept` instead.

<Badge type="danger">Before</Badge>

```js
cy.route2('/widgets/*', { fixture: 'widget.json' }).as('widget')
```

<Badge type="success">After</Badge>

```js
cy.intercept('/widgets/*', { fixture: 'widget.json' }).as('widget')
```

### Falsy values are no longer dropped in `StaticResponse` bodies

Previously, falsy values supplied as the `body` of a `StaticResponse` would get dropped (the same as if no body was supplied). Now, the bodies are properly encoded in the response.

<Badge type="danger">Before</Badge>

```js
cy.intercept('/does-it-exist', { body: false })
// Requests to `/does-it-exist` receive an empty response body
```

<Badge type="success">After</Badge>

```js
cy.intercept('/does-it-exist', { body: false })
// Requests to `/does-it-exist` receive a response body of `false`
```

## Node.js 12+ support

Cypress comes bundled with its own [Node.js version](https://github.com/cypress-io/cypress/blob/develop/.node-version). However, installing the `cypress` npm package uses the Node.js version installed on your system.

Node.js 10 reached its end of life on Dec 31, 2019 and Node.js 13 reached its end of life on June 1, 2019. [See Node's release schedule](https://github.com/nodejs/Release). These Node.js versions will no longer be supported when installing Cypress. The minimum Node.js version supported to install Cypress is Node.js 12 or Node.js 14+.

## Migrating `cy.route()` to [`cy.intercept()`][intercept]

This guide details how to change your test code to migrate from `cy.route()` to [`cy.intercept()`][intercept]. `cy.server()` and `cy.route()` are deprecated in Cypress 6.0.0. In a future release, support for `cy.server()` and `cy.route()` will be removed.

Please also refer to the full documentation for [cy.intercept()][intercept].

### Match simple route

In many use cases, you can replace `cy.route()` with [cy.intercept()][intercept] and remove the call to `cy.server()` (which is no longer necessary).

<Badge type="danger">Before</Badge>

```js
// Set up XHR listeners using cy.route()
cy.server()
cy.route('/users').as('getUsers')
cy.route('POST', '/project').as('createProject')
cy.route('PATCH', '/projects/*').as('updateProject')
```

<Badge type="success">After</Badge>

```js
// Intercept HTTP requests
cy.intercept('/users').as('getUsers')
cy.intercept('POST', '/project').as('createProject')
cy.intercept('PATCH', '/projects/*').as('updateProject')
```

### Match against `url` and `path`

The `url` argument to [cy.intercept()][intercept] matches against the full url, as opposed to the `url` or `path` in `cy.route()`. If you're using the `url` argument in [`cy.intercept()`][intercept], you may need to update your code depending on the route you're trying to match.

<Badge type="danger">Before</Badge>

```js
// Match XHRs with a path or url of /users
cy.server()
cy.route({
  method: 'POST',
  url: '/users',
}).as('getUsers')
```

<Badge type="success">After</Badge>

```js
// Match HTTP requests with a path of /users
cy.intercept({
  method: 'POST',
  path: '/users',
}).as('getUsers')

// OR
// Match HTTP requests with an exact url of https://example.cypress.io/users
cy.intercept({
  method: 'POST',
  url: 'https://example.cypress.io/users',
}).as('getUsers')
```

### `cy.wait()` object

The object returned by `cy.wait()` is different from intercepted HTTP requests using [`cy.intercept()`][intercept] than the object returned from an awaited `cy.route()` XHR.

<Badge type="danger">Before</Badge>

```js
// Wait for XHR from cy.route()
cy.route('POST', '/users').as('createUser')
// ...
cy.wait('@createUser').then(({ requestBody, responseBody, status }) => {
  expect(status).to.eq(200)
  expect(requestBody.firstName).to.eq('Jane')
  expect(responseBody.firstName).to.eq('Jane')
})
```

<Badge type="success">After</Badge>

```js
// Wait for intercepted HTTP request
cy.intercept('POST', '/users').as('createUser')
// ...
cy.wait('@createUser').then(({ request, response }) => {
  expect(response.statusCode).to.eq(200)
  expect(request.body.name).to.eq('Jane')
  expect(response.body.name).to.eq('Jane')
})
```

### Fixtures

You can stub requests and response with fixture data by defining a `fixture` property in the `routeHandler` argument for [`cy.intercept()`][intercept].

<Badge type="danger">Before</Badge>

```js
// Stub response with fixture data using cy.route()
cy.route('GET', '/projects', 'fx:projects')
```

<Badge type="success">After</Badge>

```js
// Stub response with fixture data using cy.intercept()
cy.intercept('GET', '/projects', {
  fixture: 'projects',
})
```

### Override intercepts

As of 7.0, newer intercepts are called before older intercepts, allowing users to override intercepts. [See "Handler ordering is reversed" for more details](#Handler-ordering-is-reversed).

Before 7.0, intercepts could not be overridden. See [#9302](https://github.com/cypress-io/cypress/issues/9302) for more details.

## Migrating to Cypress 6.0

This guide details the changes and how to change your code to migrate to Cypress 6.0. [See the full changelog for 6.0](/guides/references/changelog#6-0-0).

### Non-existent element assertions

<Alert type="info">

**Key takeway:** Use `.should('not.exist')` to assert that an element does not exist in the DOM (not `.should('not.be.visible')`, etc).

</Alert>

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

<DocsImage src="/img/guides/el-incorrectly-passes-existence-check.png" alt="non-existent element before 6.0"></DocsImage>

In 6.0, these assertions will now correctly fail, telling us that the `#dropdon` element doesn't exist in the DOM.

<DocsImage src="/img/guides/el-correctly-fails-existence-check.png" alt="non-existent element in 6.0"></DocsImage>

#### Assertions on non-existent elements

This fix may cause some breaking changes in your tests if you are relying on assertions such as `not.be.visible` or `not.contains` to test that the DOM element did not _exist_ in the DOM. This means you'll need to update your test code to be more specific about your assertions on non-existent elements.

<Badge type="danger">Before</Badge> Assert that non existent element was not visible

```js
it('test', () => {
  // the .modal element is removed from the DOM on click
  cy.get('.modal').find('.close').click()
  // assertions below pass in < 6.0, but properly fail in 6.0+
  cy.get('.modal').should('not.be.visible')
  cy.get('.modal').should('not.contain', 'Upgrade')
})
```

<Badge type="success">After</Badge> Assert that non existent element does not exist

```js
it('test', () => {
  // the .modal element is removed from the DOM on click
  cy.get('.modal').find('.close').click()
  // we should instead assert that the element doesn't exist
  cy.get('.modal').should('not.exist')
})
```

### Opacity visibility

DOM elements with `opacity: 0` style are no longer considered to be visible. This includes elements with an ancestor that has `opacity: 0` since a child element can never have a computed opacity greater than that of an ancestor.

Elements where the CSS property (or ancestors) is `opacity: 0` are still considered [actionable](/guides/core-concepts/interacting-with-elements) however and [any action commands](/guides/core-concepts/interacting-with-elements#Actionability) used to interact with the element will perform the action. This matches browser's implementation on how they regard elements with `opacity: 0`.

#### Assert visibility of `opacity: 0` element

<Badge type="danger">Before</Badge> Failed assertion that `opacity: 0` element is not visible.

```js
it('test', () => {
  // '.hidden' has 'opacity: 0' style.
  // In < 5.0 this assertion would fail
  cy.get('.hidden').should('not.be.visible')
})
```

<Badge type="success">After</Badge> Passed assertion that `opacity: 0` element is not visible.

```js
it('test', () => {
  // '.hidden' has 'opacity: 0' style.
  // In 6.0 this assertion will pass
  cy.get('.hidden').should('not.be.visible')
})
```

#### Perform actions on `opacity: 0` element

In all versions of Cypress, you can interact with elements that have `opacity: 0` style.

```js
it('test', () => {
  // '.hidden' has 'opacity: 0' style.
  cy.get('.hidden').click() // ✅ clicks on element
  cy.get('.hidden').type('hi') // ✅ types into element
  cy.get('.hidden').check() // ✅ checks element
  cy.get('.hidden').select('yes') // ✅ selects element
})
```

### `cy.wait(alias)` type

[cy.route()](/api/commands/route) is deprecated in 6.0.0. We encourage the use of [cy.intercept()][intercept] instead. Due to this deprecation, the type yielded by [cy.wait(alias)](/api/commands/wait) has changed.

<Badge type="danger">Before</Badge> Before 6.0.0, [cy.wait(alias)](/api/commands/wait) would yield an object of type `WaitXHR`.

<Badge type="success">After</Badge> In 6.0.0 and onwards, [cy.wait(alias)](/api/commands/wait) will yield an object of type `Interception`. This matches the new interception object type used for [cy.intercept()][intercept].

#### Restore old behavior

If you need to restore the type behavior prior to 6.0.0 for [cy.wait(alias)](/api/commands/wait), you can declare a global override for [cy.wait()](/api/commands/wait) like so:

```ts
declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      wait(alias: string): Chainable<Cypress.WaitXHR>
    }
  }
}
```

### `—disable-dev-shm-usage`

We now pass `—disable-dev-shm-usage` to the Chrome browser flags by default. If you're passing this flag in your `plugins` file, you can now remove this code.

<Badge type="danger">Before</Badge> Passing flag in plugins file.

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

<Badge type="success">After</Badge> Remove flag from plugins file.

```js
// cypress/plugins/index.js
module.exports = (on, config) => {}
```

#### Restore old behavior

If you need to remove the flag in 6.0.0+, you can follow the workaround documented here: [#9242](https://github.com/cypress-io/cypress/issues/9242).

## Migrating to Cypress 5.0

This guide details the changes and how to change your code to migrate to Cypress 5.0. [See the full changelog for 5.0](/guides/references/changelog#5-0-0).

### Tests retries

Test retries are available in Cypress 5.0. This means that tests can be re-run a number of times before potentially being marked as a failed test. Read the [Test Retries](/guides/guides/test-retries) doc for more information on how this works and how to turn on test retries.

When test retries are turned on, there will now be a screenshot taken for every failed attempt, so there could potentially be more than 1 screenshot per test failure. Read the [Test Retries](/guides/guides/test-retries) doc for more information on how this works.

The [`cypress-plugin-retries`](https://github.com/Bkucera/cypress-plugin-retries) plugin has been deprecated in favor of test retries built into Cypress. There's guidance below on how to migrate from the [`cypress-plugin-retries`](https://github.com/Bkucera/cypress-plugin-retries) plugin to Cypress's built-in test retries.

#### Configure test retries via the CLI

<Badge type="danger">Before</Badge> Setting retries with `cypress-plugin-retries` via env vars

```shell
CYPRESS_RETRIES=2 cypress run
```

<Badge type="success">After</Badge> Setting test retries in Cypress 5.0 via env vars

```shell
CYPRESS_RETRIES=2 cypress run
```

#### Configure test retries in the configuration file

<Badge type="danger">Before</Badge> Setting retries with `cypress-plugin-retries` via configuration

```json
{
  "env": {
    "RETRIES": 2
  }
}
```

<Badge type="success">After</Badge> Setting test retries in Cypress 5.0 via configuration

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

#### Configure test retries per test

<Badge type="danger">Before</Badge> Setting retries with `cypress-plugin-retries` via the test

```js
it('test', () => {
  Cypress.currentTest.retries(2)
})
```

<Badge type="success">After</Badge> Setting test retries in Cypress 5.0 via test options

```js
it(
  'allows user to login',
  {
    retries: 2,
  },
  () => {
    // ...
  }
)
```

- `runMode` allows you to define the number of test retries when running `cypress run`
- `openMode` allows you to define the number of test retries when running `cypress open`

```js
it(
  'allows user to login',
  {
    retries: {
      runMode: 2,
      openMode: 3,
    },
  },
  () => {
    // ...
  }
)
```

### Module API results

To more accurately reflect result data for runs with [test retries](/guides/guides/test-retries), the structure of each run's `runs` array resolved from the `Promise` returned from `cypress.run()` of the Module API has changed.

Mainly there is a new `attempts` Array on each `test` which will reflect the result of each test retry.

<Badge type="danger">Before</Badge> `results.runs` Module API results

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

<Badge type="success">After</Badge> `results.runs` Module API results

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

### Cookies `whitelist` option renamed

The [Cypress.Cookies.defaults()](/api/cypress-api/cookies) `whitelist` option has been renamed to `preserve` to more closely reflect its behavior.

<Badge type="danger">Before</Badge> `whitelist` option

```js
Cypress.Cookies.defaults({
  whitelist: 'session_id',
})
```

<Badge type="success">After</Badge> `preserve` option

```js
Cypress.Cookies.defaults({
  preserve: 'session_id',
})
```

### `blacklistHosts` configuration renamed

The `blacklistHosts` configuration has been renamed to [blockHosts](/guides/references/configuration#Notes) to more closely reflect its behavior.

This should be updated in all places where Cypress configuration can be set including the via the configuration file (`cypress.json` by default), command line arguments, the `pluginsFile`, `Cypress.config()` or environment variables.

<Badge type="danger">Before</Badge> `blacklistHosts` configuration in `cypress.json`

```json
{
  "blacklistHosts": "www.google-analytics.com"
}
```

<Badge type="success">After</Badge> `blockHosts` configuration in `cypress.json`

```json
{
  "blockHosts": "www.google-analytics.com"
}
```

### Return type of `Cypress.Blob` changed

We updated the [Blob](https://github.com/nolanlawson/blob-util) library used behind [Cypress.Blob](/api/utilities/blob) from `1.3.3` to `2.0.2`.

The return type of the [Cypress.Blob](/api/utilities/blob) methods `arrayBufferToBlob`, `base64StringToBlob`, `binaryStringToBlob`, and `dataURLToBlob` have changed from `Promise<Blob>` to `Blob`.

<Badge type="danger">Before</Badge> `Cypress.Blob` methods returned a Promise

```js
Cypress.Blob.base64StringToBlob(this.logo, 'image/png').then((blob) => {
  // work with the returned blob
})
```

<Badge type="success">After</Badge> `Cypress.Blob` methods return a Blob

```js
const blob = Cypress.Blob.base64StringToBlob(this.logo, 'image/png')

// work with the returned blob
```

### `cy.server()` `whitelist` option renamed

The [cy.server()](/api/commands/server) `whitelist` option has been renamed to `ignore` to more closely reflect its behavior.

<Badge type="danger">Before</Badge> `whitelist` option

```js
cy.server({
  whitelist: (xhr) => {
    return xhr.method === 'GET' && /\.(jsx?|html|css)(\?.*)?$/.test(xhr.url)
  },
})
```

<Badge type="success">After</Badge> `ignore` option

```js
cy.server({
  ignore: (xhr) => {
    return xhr.method === 'GET' && /\.(jsx?|html|css)(\?.*)?$/.test(xhr.url)
  },
})
```

### Cookies `sameSite` property

Values yielded by [cy.setCookie()](/api/commands/setcookie), [cy.getCookie()](/api/commands/getcookie), and [cy.getCookies()](/api/commands/getcookies) will now contain the `sameSite` property if specified.

If you were using the `experimentalGetCookiesSameSite` configuration to get the `sameSite` property previously, this should be removed.

<Badge type="danger">Before</Badge> Cookies yielded before had no `sameSite` property.

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

<Badge type="success">After</Badge> Cookies yielded now have `sameSite` property if specified.

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

### dirname / filename

The globals `__dirname` and `__filename` no longer include a leading slash.

<Badge type="danger">Before</Badge> `__dirname` / `__filename`

```js
// cypress/integration/app_spec.js
it('include leading slash < 5.0', () => {
  expect(__dirname).to.equal('/cypress/integration')
  expect(__filename).to.equal('/cypress/integration/app_spec.js')
})
```

<Badge type="success">After</Badge> `__dirname` / `__filename`

```js
// cypress/integration/app_spec.js
it('do not include leading slash >= 5.0', () => {
  expect(__dirname).to.equal('cypress/integration')
  expect(__filename).to.equal('cypress/integration/app_spec.js')
})
```

### Linux dependencies

Running Cypress on Linux now requires the `libgbm` dependency (on Debian-based systems, this is available as `libgbm-dev`). To install all required dependencies on Ubuntu/Debian, you can run the script below:

```shell
apt-get install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb
```

### TypeScript esModuleInterop

Cypress no longer forces the `esModuleInterop` compiler option for TypeScript to be `true` for spec, support, and plugin files. We recommend setting it in your project's `tsconfig.json` instead if you need to.

```json
// tsconfig.json
{
  "compilerOptions": {
    "esModuleInterop": true
    /* ... other compiler options ... */
  }
}
```

### TypeScript 3.4+ support

Cypress 5.0 raises minimum required TypeScript version from 2.9+ to 3.4+. You'll need to have TypeScript 3.4+ installed within your project to have TypeScript support within Cypress.

### Node.js 10+ support

Cypress comes bundled with its own [Node.js version](https://github.com/cypress-io/cypress/blob/develop/.node-version). However, installing the `cypress` npm package uses the Node.js version installed on your system.

Node.js 8 reached its end of life on Dec 31, 2019 and Node.js 11 reached its end of life on June 1, 2019. [See Node's release schedule](https://github.com/nodejs/Release). These Node.js versions will no longer be supported when installing Cypress. The minimum Node.js version supported to install Cypress is Node.js 10 or Node.js 12+.

## Migrating to Cypress 4.0

This guide details the changes and how to change your code to migrate to Cypress 4.0. [See the full changelog for 4.0](/guides/references/changelog#4-0-0).

### Mocha upgrade

Mocha was upgraded from `2.5.3` to `7.0.1`, which includes a number of breaking changes and new features outlined in their [changelog](https://github.com/mochajs/mocha/blob/master/CHANGELOG.md). Some changes you might notice are described below.

#### <Icon name="exclamation-triangle" color="red"></Icon> Breaking Change: invoke `done` callback and return a promise

Starting with [Mocha 3.0.0](https://github.com/mochajs/mocha/blob/master/CHANGELOG.md#300--2016-07-31), invoking a `done` callback _and_ returning a promise in a test results in an error.

This error originates from Mocha and is discussed at length [here](https://github.com/mochajs/mocha/pull/1320) and [here](https://github.com/mochajs/mocha/issues/2407).

The reason is that using two different ways to signal that a test is finished is usually a mistake and there is always a way to only use one. There is a [proposal to handle this situation without erroring](https://github.com/mochajs/mocha/issues/2509) that may be released in a future version of Mocha.

In the meantime, you can fix the error by choosing a single way to signal the end of your test's execution.

##### Example #1

<Badge type="danger">Before</Badge> This test has a done callback and a promise

```javascript
it('uses invokes done and returns promise', (done) => {
  return codeUnderTest.doSomethingThatReturnsPromise().then((result) => {
    // assertions here
    done()
  })
})
```

<Badge type="success">After</Badge> You can remove the `done` callback and return the promise instead:

```javascript
it('uses invokes done and returns promise', () => {
  return codeUnderTest.doSomethingThatReturnsPromise().then((result) => {
    // assertions here
  })
})
```

##### Example #2

<Badge type="danger">Before</Badge> Sometimes it might make more sense to use the `done` callback and not return a promise:

```javascript
it('uses invokes done and returns promise', (done) => {
  eventEmitter.on('change', () => {
    // assertions
    done()
  })

  return eventEmitter.doSomethingThatEmitsChange()
})
```

<Badge type="success">After</Badge> In this case, you don't need to return the promise:

```javascript
it('uses invokes done and returns promise', (done) => {
  eventEmitter.on('change', () => {
    // assertions
    done()
  })

  eventEmitter.doSomethingThatEmitsChange()
})
```

##### Example #3

Test functions using `async/await` automatically return a promise, so they need to be refactored to not use a `done` callback.

<Badge type="danger">Before</Badge> This will cause an overspecified error.

```javascript
it('uses async/await', async (done) => {
  const eventEmitter = await getEventEmitter()
  eventEmitter.on('change', () => done())
  eventEmitter.doSomethingThatEmitsChange()
})
```

<Badge type="success">After</Badge> Update to the test code below.

```javascript
it('uses async/await', async () => {
  const eventEmitter = await getEventEmitter()
  return new Promise((resolve) => {
    eventEmitter.on('change', () => resolve())
    eventEmitter.doSomethingThatEmitsChange()
  })
})
```

#### <Icon name="exclamation-triangle" color="red"></Icon> Tests require a title

Tests now require a title and will error when not provided one.

```javascript
// Would show as pending in Cypress 3
// Will throw type error in Cypress 4:
it() // Test argument "title" should be a string. Received type "undefined"
```

### Chai upgrade

Chai was upgraded from `3.5.0` to `4.2.0`, which includes a number of breaking changes and new features outlined in [Chai's migration guide](https://github.com/chaijs/chai/issues/781). Some changes you might notice are described below.

#### <Icon name="exclamation-triangle" color="red"></Icon> Breaking Change: assertions expecting numbers

Some assertions will now throw an error if the assertion's target or arguments are not numbers, including `within`, `above`, `least`, `below`, `most`, `increase` and `decrease`.

```javascript
// These will now throw errors:
expect(null).to.be.within(0, 1)
expect(null).to.be.above(10)
// This will not throw errors:
expect('string').to.have.a.length.of.at.least(3)
```

#### <Icon name="exclamation-triangle" color="red"></Icon> Breaking Change: `empty` assertions

The `.empty` assertion will now throw when it is passed non-string primitives and functions.

```javascript
// These will now throw TypeErrors
expect(Symbol()).to.be.empty
expect(() => {}).to.be.empty
```

#### <Icon name="exclamation-triangle" color="red"></Icon> Breaking Change: non-existent properties

An error will throw when a non-existent property is read. If there are typos in property assertions, they will now appear as failures.

```javascript
// Would pass in Cypress 3 but will fail correctly in 4
expect(true).to.be.ture
```

#### <Icon name="exclamation-triangle" color="red"></Icon> Breaking Change: `include` checks strict equality

`include` now always use strict equality unless the `deep` property is set.

<Badge type="danger">Before</Badge> `include` would always use deep equality

```javascript
// Would pass in Cypress 3 but will fail correctly in 4
cy.wrap([
  {
    first: 'Jane',
    last: 'Lane',
  },
]).should('include', {
  first: 'Jane',
  last: 'Lane',
})
```

<Badge type="success">After</Badge> Need to specificy `deep.include` for deep equality

```javascript
// Specifically check for deep.include to pass in Cypress 4
cy.wrap([
  {
    first: 'Jane',
    last: 'Lane',
  },
]).should('deep.include', {
  first: 'Jane',
  last: 'Lane',
})
```

### Sinon.JS upgrade

Sinon.JS was upgraded from `3.2.0` to `8.1.1`, which includes a number of breaking changes and new features outlined in [Sinon.JS's migration guide](https://sinonjs.org/releases/latest/#migration-guides). Some changes you might notice are described below.

#### <Icon name="exclamation-triangle" color="red"></Icon> Breaking Change: stub non-existent properties

An error will throw when trying to stub a non-existent property.

```javascript
// Would pass in Cypress 3 but will fail in 4
cy.stub(obj, 'nonExistingProperty')
```

#### <Icon name="exclamation-triangle" color="red"></Icon> Breaking Change: `reset()` replaced by `resetHistory()`

For spies and stubs, the `reset()` method was replaced by `resetHistory()`.

<Badge type="danger">Before</Badge> Spies and stubs using `reset()`.

```javascript
const spy = cy.spy()
const stub = cy.stub()

spy.reset()
stub.reset()
```

<Badge type="success">After</Badge> Update spies and stubs should now use `resetHistory()`.

```javascript
const spy = cy.spy()
const stub = cy.stub()

spy.resetHistory()
stub.resetHistory()
```

### Plugin Event `before:browser:launch`

Since we now support more advanced browser launch options, during `before:browser:launch` we no longer yield the second argument as an array of browser arguments and instead yield a `launchOptions` object with an `args` property.

You can see more examples of the new `launchOptions` in use in the [Browser Launch API doc](/api/plugins/browser-launch-api).

<Badge type="danger">Before</Badge> The second argument is no longer an array.

```js
on('before:browser:launch', (browser, args) => {
  // will print a deprecation warning telling you
  // to change your code to the new signature
  args.push('--another-arg')

  return args
})
```

<Badge type="success">After</Badge> Access the `args` property off `launchOptions`

```js
on('before:browser:launch', (browser, launchOptions) => {
  launchOptions.args.push('--another-arg')

  return launchOptions
})
```

### Electron options in `before:browser:launch`

Previously, you could pass options to the launched Electron [BrowserWindow](https://www.electronjs.org/docs/api/browser-window#new-browserwindowoptions) in `before:browser:launch` by modifying the `launchOptions` object.

Now, you must pass those options as `launchOptions.preferences`:

<Badge type="danger">Before</Badge> Passing BrowserWindow options on the `launchOptions` object is no longer supported.

```js
on('before:browser:launch', (browser, args) => {
  args.darkTheme = true

  return args
})
```

<Badge type="success">After</Badge> Pass BrowserWindow options on the `options.preferences` object instead.

```js
on('before:browser:launch', (browser, launchOptions) => {
  launchOptions.preferences.darkTheme = true

  return launchOptions
})
```

### Launching Chrome Canary with `--browser`

Before 4.0, `cypress run --browser canary` would run tests in Chrome Canary.

Now, you must pass `--browser chrome:canary` to select Chrome Canary.

See the [docs for `cypress run --browser`](/guides/guides/command-line#cypress-run-browser-lt-browser-name-or-path-gt) for more information.

<Badge type="danger">Before</Badge> Passing `canary` will no longer find a browser

```shell
cypress run --browser canary
```

<Badge type="success">After</Badge> Pass `chrome:canary` to launch Chrome Canary

```shell
cypress run --browser chrome:canary
```

### Chromium-based browser `family`

We updated the [Cypress browser objects](/api/plugins/browser-launch-api) of all Chromium-based browsers, including Electron, to have `chromium` set as their `family` field.

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

#### Example #1 (Finding Electron)

<Badge type="danger">Before</Badge> This will no longer find the Electron browser.

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

<Badge type="success">After</Badge> Use `browser.name` to check for Electron

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

#### Example #2 (Finding Chromium-based browsers)

<Badge type="danger">Before</Badge> This will no longer find any browsers.

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

<Badge type="success">After</Badge> Use `browser.name` and `browser.family` to select non-Electron Chromium-based browsers

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

### `cy.writeFile()` yields `null`

`cy.writeFile()` now yields `null` instead of the `contents` written to the file. This change was made to more closely align with the behavior of Node.js [`fs.writeFile`](https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback).

<Badge type="danger">Before</Badge> This assertion will no longer pass

```js
cy.writeFile('path/to/message.txt', 'Hello World').then((text) => {
  // Would pass in Cypress 3 but will fail in 4
  expect(text).to.equal('Hello World') // false
})
```

<Badge type="success">After</Badge> Instead read the contents of the file

```js
cy.writeFile('path/to/message.txt', 'Hello World')
cy.readFile('path/to/message.txt').then((text) => {
  expect(text).to.equal('Hello World') // true
})
```

### cy.contains() ignores invisible whitespaces

Browsers ignore leading, trailing, duplicate whitespaces. And Cypress now does that, too.

```html
<p>hello world</p>
```

```javascript
cy.get('p').contains('hello world') // Fail in 3.x. Pass in 4.0.0.
cy.get('p').contains('hello\nworld') // Pass in 3.x. Fail in 4.0.0.
```

### Node.js 8+ support

Cypress comes bundled with its own [Node.js version](https://github.com/cypress-io/cypress/blob/develop/.node-version). However, installing the `cypress` npm package uses the Node.js version installed on your system.

Node.js 4 reached its end of life on April 30, 2018 and Node.js 6 reached its end of life on April 30, 2019. [See Node's release schedule](https://github.com/nodejs/Release). These Node.js versions will no longer be supported when installing Cypress. The minimum Node.js version supported to install Cypress is Node.js 8.

### CJSX is no longer supported

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

[intercept]: /api/commands/intercept
