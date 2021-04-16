---
title: intercept
---

<!-- 
TODO DX-79 Refactor introduction to concisely highlight the the key capabilities of the API
- Modifying HTTP requests and responses, dynamically and statically.
- Ability to intercept all network request types: Fetch API, page loads, XMLHttpRequests, resource loads, etc.
- Common applications of the API:
- Creating error scenarios to for testing
- Slowing network traffic for testing user experience 
- etc.. 
-->

Use `cy.intercept()` to manage the behavior of HTTP requests at the network layer.

## Syntax

### Without `routeHandler` (Passive Route-matching Only)
```js
cy.intercept(url)
cy.intercept(method, url)
cy.intercept(routeMatcher)
cy.intercept(url, routeMatcher)
cy.intercept(method, url, routeMatcher)
```

### With `routeHandler` (Route-matching, Response Stubbing, Request/Response Modification and Spying)
```js
cy.intercept(url, routeHandler)
cy.intercept(method, url, routeHandler)
cy.intercept(routeMatcher, routeHandler)
cy.intercept(url, routeMatcher, routeHandler)
cy.intercept(method, url, routeMatcher, routeHandler)
```

**Note:** all intercepts are automatically cleared before every test.

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```js
cy.intercept('/users/**')
```
### Arguments

#### **<Icon name="angle-right"></Icon> url** **_(String, Glob, RegExp)_**

Specify the URL to match. See [Matching URL](#Matching-URL) for examples.

#### **<Icon name="angle-right"></Icon> method** **_(String)_**

Specify the [HTTP request method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, etc.) to match on.

<Alert type="bolt">

If no `method` is provided, Cypress will match _all_ HTTP methods (`*` wildcard) by default.

</Alert>

#### **<Icon name="angle-right"></Icon> routeMatcher** **_(`RouteMatcher`)_**

For more advanced matching of incoming HTTP requests, you can pass in the `routeMatcher` to specify matching beyond `url` and `method` - like headers and query parameters. See the chart below. 

All properties are optional and except when specified, can be a string or a pattern (glob or regular expression):

| Option     | Default | Description                                                                        |
|------------|---------|------------------------------------------------------------------------------------|
| auth       | null    | `username` and `password` used in HTTP Basic Authentication (_object_)             |
| headers    | null    | HTTP request headers (_object_)                                                    |
| hostname   | null    | HTTP request hostname                                                              |
| https      | null    | `true`: only secure (https://) requests, `false`: only insecure (http://) requests |
| method     | *     | HTTP request method                                                                |
| middleware | false   | Pass the request on to the next `RouteMatcher` after the request handler completes |
| path       | null    | HTTP request path after the hostname, including query parameters                   |
| pathname   | null    | Like `path`, but without query parameters                                          |
| port       | null    | HTTP request port(s) (_number_ or _array_)                                         |
| query      | null    | Parsed query string (_object_)                                                     |
| url        | null    | Full HTTP request URL                                                              |

#### **<Icon name="angle-right"></Icon> routeHandler _(<code>string | object | Function | [StaticResponse][staticresponse]</code>)_**

The `routeHandler` defines what will happen with a request if the [routeMatcher](#routeMatcher-RouteMatcher) matches.

The `routeHandler` function accepts the matched request as its argument which has methods used for [modifying the outgoing request](#Intercepting-a-request), the incoming response, or both.

If you only need to modify the response you can pass in a [`StaticResponse`][staticresponse] object (to define the body, headers, status code and more). And if it's specifically the response _body_ you're wanting to [stub](#Stubbing-a-response) you can simply pass that in as plain JSON instead.

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

- `cy.intercept()` yields `null`.
- `cy.intercept()` can be aliased, but otherwise cannot be chained further.
- Waiting on an aliased `cy.intercept()` route using [cy.wait()](/api/commands/wait) will yield an object that contains information about the matching request/response cycle. See [Using the yielded object](#Using-the-yielded-object) for examples of how to use this object.

## Examples

<!-- TODO DX-86 Add granular headings for code snippets/examples for link-ability -->
<!-- TODO DX-88 Add a routeHandler options section that includes examples for each option -->

### Matching a URL

You can provide the exact URL to match, but typically pattern matching is more effective and a glob pattern will likely be the simpler of the two to implement. See the Glob Pattern Matching section.

```js
// match any request that exactly matches the URL
cy.intercept('https://prod.cypress.io/users')

// match any request that satisfies a glob pattern
cy.intercept('**/users?_limit=+(3|5)')

// match any request that satisfies a regex pattern
cy.intercept(/\/users\?_limit=(3|5)$/)
```

<!-- TODO move this section -->
### Glob Pattern Matching URLs

Providing an exact URL to match can be too restrictive. For example, what if you wanted to run your tests on a different host? 

```js
// match any request that exactly matches the URL
cy.intercept('https://prod.cypress.io/users')
// matches this: https://prod.cypress.io/users
// ...but not this: https://staging.cypress.io/users
// ...or this: http://localhost/users
```
Glob pattern matching provides the necessary flexibility:

```js
cy.intercept('**/users')
// matches all of these:
// https://prod.cypress.io/users
// https://staging.cypress.io/users
// http://localhost/users

cy.intercept('**/users?_limit=+(3|5)')
// matches all of these:
// https://prod.cypress.io/users?_limit=3
// http://localhost/users?_limit=5

```
Under the hood, Cypress uses the [minimatch]() library for glob matching and provides access to it via the `Cypress` global.
This enables you to test your pattern in the Test Runner browser console.

You can invoke the `Cypress.minimatch` with just two arguments - the URL (string) and the pattern (string), respectively - and if it yields `true, then you have a match!

```javascript
// executed in the Test Runner browser console:
Cypress.minimatch('http://localhost/users?_limit=3', '**/users?_limit=+(3|5)') 
// true
Cypress.minimatch('http://localhost/users?_limit=5', '**/users?_limit=+(3|5)') 
// true
Cypress.minimatch('http://localhost/users?_limit=7', '**/users?_limit=+(3|5)') 
// false
```

You can also pass in options (object) as the third argument, one of which is `debug` which if set to `true`, will yield verbose output that could help you understand why your pattern isn't working as you expect:

```js
Cypress.minimatch('http://localhost/users?_limit=3', '**/users?_limit=+(3|5)', { debug: true }) 
// true (plus debug messages)
```

### Specifying a Method

If you don't pass a `method` argument, then all HTTP methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, etc.) will match.

```js
cy.intercept('**/users')
// matches this: GET http://localhost/users
// ...and this, too: POST http://localhost/users

cy.intercept('GET', '**/users')
// matches this: GET http://localhost/users
// ...but not this: POST http://localhost/users
```

### Using routeMatcher

Specifying a `method` and `url` to match can also be acheived by passing the `routeMatcher` object into `cy.intercept` instead:

```js
// These both yield the same result:
cy.intercept({ method: 'GET', url: '**/users'})
cy.intercept('GET', '**/users')
```
`routeMatcher` is ideal when you require more [advanced matching]().

### Advanced Matching
#### Method and URL
```js
// basic example shown previously
cy.intercept({ 
  method: 'GET', 
  url: '**/users'
})

// match updates to the `/users` endpoint
cy.intercept({ 
  method: '+(PUT|PATCH)', 
  url: '**/users/*'
})
// matches 
// PUT /users/1
// PATCH /users/1
// doesn't match
// GET /users
// GET /users/1

// same as above, but using regex
cy.intercept({ 
  method: '/PUT|PATCH/', 
  url: '**/users/*'
})
```
#### Path and Pathname
```js
cy.intercept({
  method: 'GET'
  pathname: 'users'
  }
})

cy.intercept({
  method: 'GET'
  path: 'users'
  }
})

// ^ those two are equivalent to this:
cy.intercept({
  method: 'GET'
  url: '**/users'
  }
})

// query params can also be included in `path` (but not `pathname`)
cy.intercept({
  method: 'GET',
  path: 'users?_limit=3'
  }
})
```
#### Query
```js
cy.intercept({
  method: 'GET',
  path: 'users'
  query: {
    _limit: 3
  }
  }
})
```
#### Protocol (https)
```js
// matches only insecure requests to `GET /users`
cy.intercept({ 
  method: 'GET', 
  url: '**/users',
  https: false
})
```
#### Hostname and Port
```js
// specify a single port with a number
cy.intercept({
  method: 'GET'
  hostname: 'localhost',
  port: 8080
  path: 'users'
})

// specify multiple ports with an array of numbers
cy.intercept({
  method: 'GET'
  hostname: 'localhost',
  port: [ 3000, 3001 ]
  path: 'users'
})
```
#### Headers
[HTTP headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers) are used by the client (like your application's front-end) and server (like the backend or API for your application) to pass along additional information with the request or response. 

```js
// matches all requests for images
cy.intercept({
  headers: {
    method: 'GET',
    Accept: 'image/*'
  }
})
```
#### Authentication
```js
cy.intercept({
  auth: {
    username: 'fakeUser',
    password: 'fakePa$$w0Rd'
  }
})
```
#### Middleware

If `true`, this will pass the request on to the next `RouteMatcher` after the request handler completes.
Can only be used with a dynamic request handler.
### Aliasing a Route

While `cy.intercept` doesn't yield anything, you can chain `as` off it to create an [`alias`]():

```js
cy.intercept('GET', '**/users').as('getAllUsers')
cy.intercept('POST', '**/users').as('createUser')
```

<!-- TODO move this -->
`cy.intercept` can be used to passively listen for matching routes and apply aliases to them without manipulating the request or its response in any way. As you'll see, this alone is powerful as it allows you to wait for these requests, resulting in more reliable tests.

### Waiting on a request

We can build upon the previous examples of defining an aliased route with [cy.wait()](/api/commands/wait) in order to wait for the request to be sent and a response to be received before executing the next command.

```js
cy.intercept('GET', '**/users').as('getAllUsers')
cy.intercept('POST', '**/users').as('createUser')

// remember the `@` prefix when referencing aliases
cy.get('button.createUser').click()
cy.wait('@createUser')
// the commands below will not execute until a response is received from `POST /users`
cy.get('#field.firstName').should('equal', 'Adam')

```

#### Making assertions on a request/response

When invoked with a route alias, [`cy.wait`](/api/commands/wait) returns an object that includes `request` and `response` which we can make assertions on:

```js
// assert that the request body includes 'user'
cy.wait('@createUser').its('request.body').should('include', 'user')

// assert that the response HTTP status is 201 (Created)
cy.wait('@createUser').its('response.statusCode').should('eq', 201)
```

<!-- make this example better
what's actually in the ic object? -->
### Using the yielded object
You could also access the entire object which represents the request/response cycle that was intercepted:

```js
cy.wait('@createUser').then((ic) => {
  const { request, response, id, ...rest } = ic
  // ...
})
```
#### Aliasing individual GraphQL requests

<!-- does this have other use cases outside of graphQL? -->
Aliases can be set on a per-request basis by setting the `alias` property of the intercepted request:

```js
cy.intercept('POST', '/graphql', (req) => {
  if (req.body.hasOwnProperty('query') && req.body.query.includes('mutation')) {
    req.alias = 'gqlMutation'
  }
})

// assert that a matching request has been made
cy.wait('@gqlMutation')
```

This is useful against GraphQL endpoints to wait for specific Queries and Mutations.

Given that the `operationName` property is optional in GraphQL requests, we can `alias` with or without this property.

With `operationName` property:

```js
cy.intercept('POST', '/graphql', (req) => {
  if (req.body.operationName.includes('ListPosts')) {
    req.alias = 'gqlListPostsQuery'
  }
})

// assert that a matching request for the ListPosts Query has been made
cy.wait('@gqlListPostsQuery')
```

```js
cy.intercept('POST', '/graphql', (req) => {
  if (req.body.operationName.includes('CreatePost')) {
    req.alias = 'gqlCreatePostMutation'
  }
})

// assert that a matching request for the CreatePost Mutation has been made
cy.wait('@gqlCreatePostMutation')
```

Without `operationName` property:

```js
cy.intercept('POST', '/graphql', (req) => {
  const { body } = req

  if (body.hasOwnProperty('query') && body.query.includes('ListPosts')) {
    req.alias = 'gqlListPostsQuery'
  }
})

// assert that a matching request for the ListPosts Query has been made
cy.wait('@gqlListPostsQuery')
```

```js
cy.intercept('POST', '/graphql', (req) => {
  const { body } = req

  if (body.hasOwnProperty('query') && body.query.includes('CreatePost')) {
    req.alias = 'gqlCreatePostMutation'
  }
})

// assert that a matching request for the CreatePost Mutation has been made
cy.wait('@gqlCreatePostMutation')
```

#### Waiting on errors

You can use [cy.wait()](/api/commands/wait) to wait on requests that end with network errors:

```js
cy.intercept('GET', '/should-err', { forceNetworkError: true }).as('err')

// assert that this request happened, and that it ended in an error
cy.wait('@err').should('have.property', 'error')
```

### Stubbing a response

#### With a string

```js
// requests to '/update' will be fulfilled with a body of "success"
cy.intercept('/update', 'success')
```

#### With a fixture

```js
// requests to '/users.json' will be fulfilled
// with the contents of the "users.json" fixture
cy.intercept('/users.json', { fixture: 'users.json' })
```

#### With a `StaticResponse` object

A [`StaticResponse`][staticresponse] object represents a response to an HTTP request, and can be used to stub routes:

```js
const staticResponse = {
  /* some StaticResponse properties here... */
}

cy.intercept('/projects', staticResponse)
```

For example, to stub a response with a JSON body:

```js
cy.intercept('/projects', {
  body: [{ projectId: '1' }, { projectId: '2' }],
})
```

Or to stub headers, status code, and body all at once:

```js
cy.intercept('/not-found', {
  statusCode: 404,
  body: '404 Not Found!',
  headers: {
    'x-not-found': 'true',
  },
})
```

See [`StaticResponse` objects][staticresponse] for more information on `StaticResponse`s.

### Intercepting a request

#### Asserting on a request

```js
cy.intercept('POST', '/organization', (req) => {
  expect(req.body).to.include('Acme Company')
})
```

#### Modifying an outgoing request

You can use the request handler callback to modify the request before it is sent.

```js
cy.intercept('POST', '/login', (req) => {
  // set the request body to something different before it's sent to the destination
  req.body = 'username=janelane&password=secret123'
})
```

#### Adding a header to an outgoing request

You can add a header to an outgoing request, or modify an existing header

```js
cy.intercept('/req-headers', (req) => {
  req.headers['x-custom-headers'] = 'added by cy.intercept'
})
```

**Note:** the new header will NOT be shown in the browser's Network tab, as the request has already left the browser. You can still confirm the header was added by waiting on the intercept as shown below:

```js
cy.intercept('/req-headers', (req) => {
  req.headers['x-custom-headers'] = 'added by cy.intercept'
}).as('headers')

// the application makes the call ...
// confirm the custom header was added
cy.wait('@headers')
  .its('request.headers')
  .should('have.property', 'x-custom-headers', 'added by cy.intercept')
```

#### Add, modify or delete a header to all outgoing requests

You can add, modify or delete a header to all outgoing requests using a `beforeEach()` in the `cypress/support/index.js` file

```ts
// Code from Real World App (RWA)
// cypress/support/index.ts
import './commands'

beforeEach(() => {
  cy.intercept(
    { url: 'http://localhost:3001/**', middleware: true },
    // Delete 'if-none-match' header from all outgoing requests
    (req) => delete req.headers['if-none-match']
  )
})
```

<Alert type="info">

##### <Icon name="graduation-cap"></Icon> Real World Example

Clone the <Icon name="github"></Icon> [Real World App (RWA)](https://github.com/cypress-io/cypress-realworld-app) and refer to the [cypress/support/index.ts](https://github.com/cypress-io/cypress-realworld-app/blob/develop/cypress/support/index.ts) file for a working example.

</Alert>

#### Dynamically stubbing a response

You can use the [`req.reply()`][req-reply] function to dynamically control the response to a request.

```js
cy.intercept('/billing', (req) => {
  // functions on 'req' can be used to dynamically respond to a request here

  // send the request to the destination server
  req.reply()

  // respond to the request with a JSON object
  req.reply({ plan: 'starter' })

  // send the request to the destination server, and intercept the response
  req.continue((res) => {
    // 'res' represents the real destination's response
    // See "Intercepting a response" for more details and examples
  })
})
```

See ["Intercepted requests"][req] for more information on the `req` object and its properties and methods.

#### Returning a Promise

If a Promise is returned from the route callback, it will be awaited before continuing with the request.

```js
cy.intercept('POST', '/login', (req) => {
  // you could asynchronously fetch test data...
  return getLoginCredentials().then((credentials) => {
    // ...and then, use it to supplement the outgoing request
    req.headers['authorization'] = credentials
  })
})
```

#### Passing a request to the next request handler

<!-- TODO DX-83 Add more examples of the `middleware` use case -->

If [`req.reply()`][req-reply] is not explicitly called inside of a request handler, requests will pass to the next request handler until none are left.

```js
// you could have a top-level middleware handler that sets an auth token on all requests
// setting `middleware: true` will cause this to always be called first
cy.intercept('http://api.company.com/', { middleware: true }, (req) => {
  req.headers['authorization'] = `token ${token}`
})

// and then have another handler that more narrowly asserts on certain requests
cy.intercept('POST', 'http://api.company.com/widgets', (req) => {
  expect(req.body).to.include('analytics')
})

// a POST request to http://api.company.com/widgets would hit both
// of those callbacks, middleware first, then the request would be sent out
// with the modified request headers to the real destination
```

### Intercepting a response

Inside of a callback passed to `req.continue()`, you can access the destination server's real response.

```js
cy.intercept('/integrations', (req) => {
  // req.continue() with a callback will send the request to the destination server
  req.continue((res) => {
    // 'res' represents the real destination response
    // you can manipulate 'res' before it's sent to the browser
  })
})
```

See ["Intercepted responses"][res] for more information on the `res` object. See ["Controlling the outbound request with `req.continue()`"][req-continue] for more information about `req.continue()`.

#### Asserting on a response

```js
cy.intercept('/projects/2', (req) => {
  req.continue((res) => {
    expect(res.body).to.include('My Project')
  })
})
```

#### Returning a Promise

If a Promise is returned from the route callback, it will be awaited before sending the response to the browser.

```js
cy.intercept('/users', (req) => {
  req.continue((res) => {
    // the response will not be sent to the browser until 'waitForSomething()' resolves
    return waitForSomething()
  })
})
```

#### Throttle or delay response all incoming responses

You can throttle or delay all incoming responses using a `beforeEach()` in the `cypress/support/index.js` file

```ts
// Code from Real World App (RWA)
// cypress/support/index.ts
import { isMobile } from './utils'
import './commands'
// Throttle API responses for mobile testing to simulate real world conditions
if (isMobile()) {
  cy.intercept({ url: 'http://localhost:3001/**', middleware: true }, (req) => {
    req.on('response', (res) => {
      // Throttle the response to 1 Mbps to simulate a mobile 3G connection
      res.setThrottle(1000)
    })
  })
}
```

<Alert type="info">

##### <Icon name="graduation-cap"></Icon> Real World Example

Clone the <Icon name="github"></Icon> [Real World App (RWA)](https://github.com/cypress-io/cypress-realworld-app) and refer to the [cypress/support/index.ts](https://github.com/cypress-io/cypress-realworld-app/blob/develop/cypress/support/index.ts) file for a working example.

</Alert>

## Intercepted requests

If a function is passed as the handler for a `cy.intercept()`, it will be called with the first argument being an object that represents the intercepted HTTP request:

```js
cy.intercept('/api', (req) => {
  // `req` represents the intercepted HTTP request
})
```

From here, you can do several things with the intercepted request:

- you can modify and assert on the request's properties (body, headers, URL, method...)
- the request can be sent to the real upstream server
  - optionally, you can intercept the response from this
- a response can be provided to stub out the request
- listeners can be attached to various events on the request

### Request object properties

The request object (`req`) has several properties from the HTTP request itself. All of the following properties on `req` can be modified except for `httpVersion`:

```ts
{
  /**
   * The body of the request.
   * If a JSON Content-Type was used and the body was valid JSON, this will be an object.
   * If the body was binary content, this will be a buffer.
   */
  body: string | object | any
  /**
   * The headers of the request.
   */
  headers: { [key: string]: string }
  /**
   * Request HTTP method (GET, POST, ...).
   */
  method: string
  /**
   * Request URL.
   */
  url: string
  /**
   * The HTTP version used in the request. Read only.
   */
  httpVersion: string
}
```

`req` also has some optional properties which can be set to control Cypress-specific behavior:

```ts
{
  /**
   * If provided, the number of milliseconds before an upstream response to this request
   * will time out and cause an error. By default, `responseTimeout` from config is used.
   */
  responseTimeout?: number
  /**
   * Set if redirects should be followed when this request is made. By default, requests will
   * not follow redirects before yielding the response (the 3xx redirect is yielded)
   */
  followRedirect?: boolean
  /**
   * If set, `cy.wait` can be used to await the request/response cycle to complete for this
   * request via `cy.wait('@alias')`.
   */
  alias?: string
}
```

Any modifications to the properties of `req` will be persisted to other request handlers, and finally merged into the actual outbound HTTP request.

### Controlling the outbound request with `req.continue()`

Calling `req.continue()` without any argument will cause the request to be sent outgoing, and the response will be returned to the browser after any other listeners have been called. For example, the following code modifies a `POST` request and then sends it to the upstream server:

```js
cy.intercept('POST', '/submitStory', (req) => {
  req.body.storyName = 'some name'
  // send the modified request and skip any other matching request handlers
  req.continue()
})
```

If a function is passed to `req.continue()`, the request will be sent to the real upstream server, and the callback will be called with the response once the response is fully received from the server. See ["Intercepted responses"][res]

Note: calling `req.continue()` will stop the request from propagating to the next matching request handler in line. See ["Interception lifecycle"][lifecycle] for more information.

### Providing a stub response with `req.reply()`

The `req.reply()` function can be used to send a stub response for an intercepted request. By passing a string, object, or [`StaticResponse`][staticresponse] to `req.reply()`, the request can be preventing from reaching the destination server.

For example, the following code stubs out a JSON response from a request interceptor:

```js
cy.intercept('/billing', (req) => {
  // dynamically get billing plan name at request-time
  const planName = getPlanName()
  // this object will automatically be JSON.stringified and sent as the response
  req.reply({ plan: planName })
})
```

Instead of passing a plain object or string to `req.reply()`, you can also pass a [`StaticResponse`][staticresponse] object. With a [`StaticResponse`][staticresponse], you can force a network error, delay/throttle the response, send a fixture, and more.

For example, the following code serves a dynamically chosen fixture with a delay of 500ms:

```js
cy.intercept('/api/users/*', async (req) => {
  // asynchronously retrieve fixture filename at request-time
  const fixtureFilename = await getFixtureFilenameForUrl(req.url)
  req.reply({
    fixture: fixtureFilename,
    delay: 500,
  })
})
```

See the [`StaticResponse` documentation][staticresponse] for more information on stubbing responses in this manner.

`req.reply()` also supports shorthand, similar to [`res.send()`][res-send], to avoid having to specify a `StaticResponse` object:

```js
req.reply(body) // equivalent to `req.reply({ body })`
req.reply(body, headers) // equivalent to `req.reply({ body, headers })`
req.reply(statusCode, body, headers) // equivalent to `req.reply({ statusCode, body, headers})`
```

There are also two convenience functions available on `req`:

```ts
{
  /**
   * Destroy the request and respond with a network error.
   */
  destroy(): void
  /**
   * Respond to this request with a redirect to a new 'location'.
   * @param statusCode HTTP status code to redirect with. Default: 302
   */
  redirect(location: string, statusCode?: number): void
}
```

Note: calling `req.reply()` will end the request phase and stop the request from propagating to the next matching request handler in line. See ["Interception lifecycle"][lifecycle] for more information.

### Request events

<!-- TODO DX-76 Add more examples of request events usage
Craft and add usage examples of the events:
before:response 
response 
after:response
within the "Intercepted requests" and "Intercepted responses" sections.
Recommend other places within the intercept docs, but also the larger docs where these examples can be linked. -->

For advanced use, several events are available on `req`, that represent different stages of the [Interception lifecycle][lifecycle].

By calling `req.on`, you can subscribe to different events:

```js
cy.intercept('/shop', (req) => {
  req.on('before:response', (res) => {
    /**
     * Emitted before `response` and before any `req.continue` handlers.
     * Modifications to `res` will be applied to the incoming response.
     * If a promise is returned, it will be awaited before processing other event handlers.
     */
  })

  req.on('response', (res) => {
    /**
     * Emitted after `before:response` and after any `req.continue` handlers - before the response is sent to the browser.
     * Modifications to `res` will be applied to the incoming response.
     * If a promise is returned, it will be awaited before processing other event handlers.
     */
  })

  req.on('after:response', (res) => {
    /**
     * Emitted once the response to a request has finished sending to the browser.
     * Modifications to `res` have no impact.
     * If a promise is returned, it will be awaited before processing other event handlers.
     */
  })
})
```

See ["Intercepted responses"][res] for more details on the `res` object yielded by `before:response` and `response`. See ["Interception lifecycle"][lifecycle] for more details on request ordering.

## Intercepted responses

The response can be intercepted in two ways:

- by passing a callback to [`req.continue()`](req-continue) within a request handler
- by listening for the `before:response` or `response` request events (see ["Request events"](#Request-events))

The response object, `res`, will be passed as the first argument to the handler function:

```js
cy.intercept('/url', (req) => {
  req.on('before:response', (res) => {
    // this will be called before any `req.continue` or `response` handlers
  })

  req.continue((res) => {
    // this will be called after all `before:response` handlers and before any `response` handlers
    // by calling `req.continue`, we signal that this request handler will be the last one, and that
    // the request should be sent outgoing at this point. for that reason, there can only be one
    // `req.continue` handler per request.
  })

  req.on('response', (res) => {
    // this will be called after all `before:response` handlers and after the `req.continue` handler
    // but before the response is sent to the browser
  })
})
```

### Response object properties

The response object (`res`) yielded to response handlers has several properties from the HTTP response itself. All of the following properties on `res` can be modified:

```ts
{
  /**
   * The body of the response.
   * If a JSON Content-Type was used and the body was valid JSON, this will be an object.
   * If the body was binary content, this will be a buffer.
   */
  body: string | object | any
  /**
   * The headers of the response.
   */
  headers: { [key: string]: string }
  /**
   * The HTTP status code of the response.
   */
  statusCode: number
  /**
   * The HTTP status message.
   */
  statusMessage: string
}
```

`res` also has some optional properties which can be set to control Cypress-specific behavior:

```ts
{
  /**
   * Kilobits per second to send 'body'.
   */
  throttleKbps?: number
  /**
   * Milliseconds to delay before the response is sent.
   */
  delay?: number
}
```

Any modifications to the properties of `res` will be persisted to other response handlers, and finally merged into the actual incoming HTTP response.

### Ending the response with `res.send()`

To end the response phase of the request, call `res.send()`. Optionally, you can pass a [`StaticResponse`][staticresponse] to `res.send()`, to be merged with the actual response.

When `res.send()` is called, the response phase will end immediately and no other response handlers will be called for the current request. Here is an example of how `res.send()` could be used:

```js
cy.intercept('/notification', (req) => {
  req.continue((res) => {
    if (res.body.status === 'failed') {
      // sends a fixture body instead of the existing 'res.body'
      res.send({ fixture: 'success.json' })
    }
  })
})
```

See the [`StaticResponse` documentation][staticresponse] for more information on the format.

`res.send()` also supports shorthand, similar to [`req.reply()`][req-reply], to avoid having to specify a `StaticResponse` object:

```js
res.send(body) // equivalent to `res.send({ body })`
res.send(body, headers) // equivalent to `res.send({ body, headers })`
res.send(statusCode, body, headers) // equivalent to `res.send({ statusCode, body, headers})`
```

There are also two convenience functions available on `res`:

```ts
{
  /**
   * Wait for 'delay' milliseconds before sending the response to the client.
   */
  setDelay: (delay: number) => IncomingHttpResponse
  /**
   * Serve the response at 'throttleKbps' kilobytes per second.
   */
  setThrottle: (throttleKbps: number) => IncomingHttpResponse
}
```

Note: calling `res.send()` will end the response phase and stop the response from propagating to the next matching response handler in line. See ["Interception lifecycle"][lifecycle] for more information.

## `StaticResponse` objects

A `StaticResponse` represents a stubbed response to an HTTP request. You can supply a `StaticResponse` to Cypress in 3 ways:

- Directly to `cy.intercept()`, to stub a response to a route: `cy.intercept('/url', staticResponse)`
- To [`req.reply()`][req-reply], to stub a response from a request handler: `req.reply(staticResponse)`
- To [`res.send()`][res-send], to stub a response from a response handler: `res.send(staticResponse)`

The following properties are available on `StaticResponse`. All properties are optional:

| Option            | Default | Description                                            |
|-------------------|---------|--------------------------------------------------------|
| fixture           | null    | Serve a fixture as the HTTP response body              |
| body              | null    | Serve a static string/JSON object as the response body |
| headers           | {}      | HTTP response headers                                  |
| statusCode        | 200     | HTTP response status code                              |
| forceNetworkError | null    | Force an error by destroying the browser session       |
| delay             | 0       | Minimum network latency/delay (milliseconds)           |
| throttleKbps      | null    | Maximum network throughput (kilobits/second)           |

See ["Stubbing a response with a `StaticResponse` object"][#with-a-staticresponse-object] for examples of stubbing with `cy.intercept()`.

## Interception lifecycle

<!-- TODO DX-82 Create flow diagram for interception lifecycle -->

The lifecycle of a `cy.intercept()` interception begins when an HTTP request is sent from your app that matches one or more registered `cy.intercept()` routes. From there, each interception has two phases: request and response.

`cy.intercept()` routes are matched in reverse order of definition, except for routes which are defined with `{ middleware: true }`, which always run first. This allows you to override existing `cy.intercept()` declarations by defining an overlapping `cy.intercept()`.

### Request phase

The following steps are used to handle the request phase.

1. Start with the first matching route according to the above algorithm (middleware first, followed by handlers in reverse order).
2. Was a handler (body, [`StaticResponse`][staticresponse], or function) supplied to `cy.intercept()`? If not, continue to step 7.
3. If the handler was a body or [`StaticResponse`][staticresponse], immediately end the request with that response.
4. If the handler was a function, call the function with `req`, the incoming request, as the first argument. See ["Intercepted requests"][req] for more information on the `req` object.
   - If [`req.reply()`][req-reply] is called, immediately end the request phase with the provided response. See ["Providing a stub response with `req.reply()`"](#Providing-a-stub-response-with-req-reply).
   - If [`req.continue()`][req-continue] is called, immediately end the request phase, and send the request to the destination server. If a callback is provided to [`req.continue()`][req-continue], it will be called during the [response phase](#Response-phase)
5. If the handler returned a Promise, wait for the Promise to resolve.
6. Merge any modifications to the request object with the real request.
7. If there is another matching `cy.intercept()`, return to step 2 and continue following steps with that route.
8. Send the request outgoing to the destination server and end the request phase. The [response phase](#Response-phase) will begin once a response is received.

### Response phase

Once the HTTP response is received from the upstream server, the following steps are applied:

1. Get a list of registered `before:response` event listeners.
2. For each `before:response` listener (if any), call it with the [`res`][res] object.
   - If [`res.send()`][res-send] is called, end the response phase and merge any passed arguments with the response.
   - If a Promise is returned, await it. Merge any modified response properties with the real response.
3. If a `req.continue()` with callback is declared for this route, call the callback with the [`res`][res] object.
   - If [`res.send()`][res-send] is called, end the response phase and merge any passed arguments with the response.
   - If a Promise is returned, await it. Merge any modified response properties with the real response.
4. Get a list of registered `response` event listeners.
5. For each `response` listener (if any), call it with the [`res`][res] object.
   - If [`res.send()`][res-send] is called, end the response phase and merge any passed arguments with the response.
   - If a Promise is returned, await it. Merge any modified response properties with the real response.
6. Send the response to the browser.
7. Once the response is complete, get a list of registered `after:response` event listeners.
8. For each `after:response` listener (if any), call it with the [`res`][res] object (minus `res.send`)
   - If a Promise is returned, await it.
9. End the response phase.

## History

| Version                                     | Changes                                                                                                                                                                                                                                                                                              |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [7.0.0](/guides/references/changelog#7-0-0) | Removed `matchUrlAgainstPath` option from `RouteMatcher`, reversed handler ordering, added request events, removed substring URL matching, removed `cy.route2` alias, added `middleware` RouteMatcher option, renamed `res.delay()` to `res.setDelay()` and `res.throttle()` to `res.setThrottle()`. |
| [6.4.0](/guides/references/changelog#6-4-0) | Renamed `delayMs` property to `delay` (backwards-compatible).                                                                                                                                                                                                                                        |
| [6.2.0](/guides/references/changelog#6-2-0) | Added `matchUrlAgainstPath` option to `RouteMatcher`.                                                                                                                                                                                                                                                |
| [6.0.0](/guides/references/changelog#6-0-0) | Renamed `cy.route2()` to `cy.intercept()`.                                                                                                                                                                                                                                                           |
| [6.0.0](/guides/references/changelog#6-0-0) | Removed `experimentalNetworkStubbing` option and made it the default behavior.                                                                                                                                                                                                                       |
| [5.1.0](/guides/references/changelog#5-1-0) | Added experimental `cy.route2()` command under `experimentalNetworkStubbing` option.                                                                                                                                                                                                                 |

## Notes

### `cy.intercept()` cannot be debugged using [`cy.request()`](/api/commands/request)

#### `cy.request()` sends requests to actual endpoints, bypassing those defined using `cy.intercept()`

The intention of `cy.request()` is to be used for checking endpoints on an actual, running server without having to start the front end application.

## See also

- [`.as()`](/api/commands/as)
- [`cy.fixture()`](/api/commands/fixture)
- [`cy.wait()`](/api/commands/wait)
- [Migrating `cy.route()` to `cy.intercept()`](/guides/references/migration-guide#Migrating-cy-route-to-cy-intercept)
- [`cy.intercept()` example recipes with real-world examples](https://github.com/cypress-io/cypress-example-recipes#stubbing-and-spying)
  - spying on requests
  - stubbing any request
  - changing the response from the server
  - intercepting static resources like HTML and CSS
  - redirecting requests
  - replying with different responses
- [How cy.intercept works](https://slides.com/bahmutov/how-cy-intercept-works) presentation
- [Cypress cy.intercept Problems](https://glebbahmutov.com/blog/cypress-intercept-problems/) with advanced `cy.intercept` tips to solve the common problems:
  - The intercept was registered too late
  - `cy.wait` uses the intercept
  - The response was cached
  - The request matched multiple intercepts
  - How to overwrite interceptors
  - How to avoid using Cypress commands inside the interceptor
  - Sending different responses
- [`cy.route()` vs `cy.route2()`](https://glebbahmutov.com/blog/cy-route-vs-route2/) blog post
- [Smart GraphQL Stubbing in Cypress](https://glebbahmutov.com/blog/smart-graphql-stubbing/) blog post
- [Open issues for `net stubbing`](https://github.com/cypress-io/cypress/issues?q=is%3Aissue+is%3Aopen+label%3Apkg%2Fnet-stubbing) and [closed issues for `net stubbing`](https://github.com/cypress-io/cypress/issues?q=is%3Aissue+is%3Aclosed+label%3Apkg%2Fnet-stubbing)

[staticresponse]: #StaticResponse-objects
[lifecycle]: #Interception-lifecycle
[req]: #Intercepted-requests
[req-continue]: #Controlling-the-outbound-request-with-req-continue
[req-reply]: #Providing-a-stub-response-with-req-reply
[res]: #Intercepted-responses
[res-send]: #Ending-the-response-with-res-send
