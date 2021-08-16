---
title: server
---

Start a server to begin routing responses to [cy.route()](/api/commands/route)
and to change the behavior of network requests.

<Alert type="warning">

⚠️ **`cy.server()` and `cy.route()` are deprecated in Cypress 6.0.0**. In a
future release, support for `cy.server()` and `cy.route()` will be moved to a
plugin. Consider using [`cy.intercept()`](/api/commands/intercept) instead. See
our guide on
[Migrating `cy.route()` to `cy.intercept()`](/guides/references/migration-guide#Migrating-cy-route-to-cy-intercept)

</Alert>

<Alert type="warning">

⚠️ `cy.route()` and `cy.server()` only support intercepting XMLHttpRequests.
Requests using the Fetch API and other types of network requests like page loads
and `<script>` tags will not be intercepted by `cy.route()` and `cy.server()`.

**To support requests using the Fetch API you can use one of the solutions
below:**

- Use [`cy.intercept()`](/api/commands/intercept) which supports requests using
  the Fetch API and other types of network requests like page loads. See
  [`cy.intercept()`](/api/commands/intercept).
- Polyfill `window.fetch` to spy on and stub requests using `cy.route()` and
  `cy.server()` by enabling
  [`experimentalFetchPolyfill`](https://on.cypress.io/experimental). See
  [#95](https://github.com/cypress-io/cypress/issues/95) for more details and
  temporary workarounds.

</Alert>

## Syntax

```javascript
cy.server()
cy.server(options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.server()
```

### Arguments

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `cy.server()`. These
options are used for 2 different purposes:

- As defaults that are merged into [`cy.route()`](/api/commands/route).
- As configuration behavior for _all_ requests.

#### The following options are merged in as default options to [`cy.route()`](/api/commands/route)

| Option       | Default     | Description                                             |
| ------------ | ----------- | ------------------------------------------------------- |
| `delay`      | `0`         | delay for stubbed responses (in ms)                     |
| `headers`    | `null`      | response headers for stubbed routes                     |
| `method`     | `"GET"`     | method to match against requests                        |
| `onAbort`    | `undefined` | callback function which fires anytime an XHR is aborted |
| `onRequest`  | `undefined` | callback function when a request is sent                |
| `onResponse` | `undefined` | callback function when a response is returned           |
| `response`   | `null`      | response body when stubbing routes                      |
| `status`     | `200`       | response status code when stubbing routes               |

#### The following options control the behavior of the server affecting all requests

| Option               | Default               | Description                                                                                                                                                                          |
| -------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `enable`             | `true`                | pass `false` to disable existing route stubs                                                                                                                                         |
| `force404`           | `false`               | forcibly send XHR's a 404 status when the XHR's do not match any existing route                                                                                                      |
| `onAnyAbort`         | `undefined`           | callback function called when any XHR is aborted                                                                                                                                     |
| `onAnyRequest`       | `undefined`           | callback function called when any request is sent                                                                                                                                    |
| `onAnyResponse`      | `undefined`           | callback function called when any response is returned                                                                                                                               |
| `urlMatchingOptions` | `{ matchBase: true }` | The default options passed to `minimatch` when using glob strings to match URLs                                                                                                      |
| `ignore`             | function              | Callback function that filters requests from ever being logged or stubbed. By default this matches against asset-like requests such as for `.js`, `.jsx`, `.html`, and `.css` files. |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`cy.server()` yields `null`.</li><li>`cy.server()` cannot be chained
further.</li></List>

## Examples

### No Args

#### After starting a server:

- Any request that does **NOT** match a [`cy.route()`](/api/commands/route) will
  [pass through to the server](/guides/guides/network-requests#Use-Server-Responses).
- Any request that matches the `options.ignore` function will **NOT** be logged
  or stubbed.
- You will see requests named as `(XHR Stub)` or `(XHR)` in the Command Log.

```javascript
cy.server()
```

### Options

#### Change defaults for [`cy.route()`](/api/commands/route)

By default [`cy.route()`](/api/commands/route) inherits some of its options from
`cy.server()`.

In this example, our matching requests will be delayed 1000ms and have a status
of `422`, but its `response` will be what was set in
[`cy.route()`](/api/commands/route).

```javascript
cy.server({
  method: 'POST',
  delay: 1000,
  status: 422,
  response: {},
})

cy.route('/users/', { errors: 'Name cannot be blank' })
```

#### Change the default delay for all routes

Adding delay can help simulate real world network latency. Normally stubbed
responses return in under 20ms. Adding a delay can help you visualize how your
application's state reacts to requests that are in flight.

```javascript
// delay each route's response 1500ms
cy.server({ delay: 1500 })
```

#### Send 404s on unmatched requests

If you'd like Cypress to automatically send requests that do _NOT_ match routes
the following response:

| Status | Body | Headers |
| ------ | ---- | ------- |
| `404`  | ""   | `null`  |

Set `force404` to `true`.

```javascript
cy.server({ force404: true })
cy.route('/activities/**', 'fixture:activities.json')
```

```javascript
// Application Code
$(() => {
  $.get('/activities')

  // this will be sent back 404 since it
  // does not match any of the cy.routes
  $.getJSON('/users.json')
})
```

#### Change the default response headers for all routes

When you stub requests, you can automatically control their response `headers`.
This is useful when you want to send back meta data in the `headers`, such as
_pagination_ or _token_ information.

<Alert type="info">

Cypress automatically sets `Content-Length` and `Content-Type` based on the
response `body` you stub.

</Alert>

```javascript
cy.server({
  headers: {
    'x-token': 'abc-123-foo-bar',
  },
})

cy.route('GET', '/users/1', { id: 1, name: 'Amanda' }).as('getUser')
cy.visit('/users/1/profile')
cy.wait('@getUser')
  .its('responseHeaders')
  .should('have.property', 'x-token', 'abc-123-foo-bar') // true
```

```javascript
// Application Code

// lets use the native XHR object
const xhr = new XMLHttpRequest()

xhr.open('GET', '/users/1')

xhr.onload = function () {
  const token = this.getResponseHeader('x-token')

  console.log(token) // => abc-123-foo-bar
}

xhr.send()
```

#### Set a custom request header for all requests

```js
cy.server({
  onAnyRequest: (route, proxy) => {
    proxy.xhr.setRequestHeader('CUSTOM-HEADER', 'Header value')
  },
})
```

#### Change the default filtering

`cy.server()` comes with an `ignore` function that by default filters out any
requests that are for static assets like `.html`, `.js`, `.jsx`, and `.css`.

Any request that passes the `ignore` will be ignored - it will not be logged nor
will it be stubbed in any way (even if it matches a specific
[`cy.route()`](/api/commands/route)).

The idea is that we never want to interfere with static assets that are fetched
via Ajax.

**The default filter function in Cypress is:**

```javascript
const ignore = (xhr) => {
  // this function receives the xhr object in question and
  // will ignore if it's a GET that appears to be a static resource
  return (
    xhr.method === 'GET' &&
    /\.(jsx?|coffee|html|less|s?css|svg)(\?.*)?$/.test(xhr.url)
  )
}
```

**You can override this function with your own specific logic:**

```javascript
cy.server({
  ignore: (xhr) => {
    // specify your own function that should return
    // truthy if you want this xhr to be ignored,
    // not logged, and not stubbed.
  },
})
```

If you would like to change the default option for **ALL** `cy.server()` you
[can change this option permanently](/api/cypress-api/cypress-server#Options).

#### Turn off the server after you've started it

You can disable all stubbing and its effects and restore it to the default
behavior as a test is running. By setting `enable` to `false`, this disables
stubbing routes and XHR's will no longer show up as (XHR Stub) in the Command
Log. However, routing aliases can continue to be used and will continue to match
requests, but will not affect responses.

```javascript
cy.server()
cy.route('POST', '/users', {}).as('createUser')
cy.server({ enable: false })
```

## Notes

### State between tests

#### Server persists until the next test runs

Cypress automatically continues to persist the server and routing configuration
even after a test ends. This means you can continue to use your application and
still benefit from stubbing or other server configuration.

However between tests, when a new test runs, the previous configuration is
restored to a clean state. No configuration leaks between tests.

#### Outstanding requests are automatically aborted between tests

When a new test runs, any outstanding requests still in flight are automatically
aborted. In fact this happens by default whether or not you've even started a
`cy.server()`.

### `cy.visit()`

#### Server can be started before you [`cy.visit()`](/api/commands/visit)

Oftentimes your application may make initial requests immediately when it loads
(such as authenticating a user). Cypress makes it possible to start your server
and define routes before a [cy.visit()](/api/commands/visit). Upon the next
visit, the server + routes will be instantly applied before your application
loads.

You can [read more about XHR strategy here](/guides/guides/network-requests).

### `cy.request()`

#### `cy.server()` does not effect [cy.request()](/api/commands/request)

`cy.server()` and any configuration passed to `cy.server()` has no effect on
[cy.request()](/api/commands/request).

The intention of [cy.request()](/api/commands/request) is to be used for
checking endpoints on an actual, running server without having to start the
front end application.

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`cy.server()` requires being chained off of `cy`.</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`cy.server()` cannot have any assertions chained.</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`cy.server()` cannot time out.</li></List>

## Command Log

- `cy.server()` does _not_ log in the Command Log

## History

| Version                                       | Changes                                |
| --------------------------------------------- | -------------------------------------- |
| [6.0.0](/guides/references/changelog#6-0-0)   | Deprecated `cy.server()` command       |
| [5.0.0](/guides/references/changelog#5-0-0)   | Renamed `whitelist` option to `ignore` |
| [0.13.6](/guides/references/changelog#0-13-6) | Added `onAbort` callback option        |
| [0.5.10](/guides/references/changelog#0-5-10) | Added `delay` option                   |
| [0.3.3](/guides/references/changelog#0-3-3)   | Added `whitelist` option               |
| [< 0.3.3](/guides/references/changelog#0-3-3) | `cy.server()` command added            |

## See also

- [Network Requests](/guides/guides/network-requests)
- [`cy.route()`](/api/commands/route)
- [`cy.wait()`](/api/commands/wait)
