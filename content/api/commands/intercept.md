---
title: intercept
---

Spy and stub network requests and responses.

<Alert type="info">

**Tip**: We recommend you read the
[Network Requests](/guides/guides/network-requests) guide first.

</Alert>

<Alert type="bolt">

`cy.intercept()` is the successor to `cy.route()` as of Cypress 6.0.0. See
[Comparison to `cy.route`](#Comparison-to-cy-route).

</Alert>

<Alert type="warning">

All intercepts are automatically cleared before every test.

</Alert>

## Syntax

```js
// spying only
cy.intercept(url)
cy.intercept(method, url)
cy.intercept(routeMatcher)
```

See arguments [url](/api/commands/intercept#url-String-Glob-RegExp),
[method](/api/commands/intercept#method-String) and
[routeMatcher](/api/commands/intercept#routeMatcher-RouteMatcher)

```js
// spying and response stubbing
cy.intercept(url, staticResponse)
cy.intercept(method, url, staticResponse)
cy.intercept(routeMatcher, staticResponse)
cy.intercept(url, routeMatcher, staticResponse)
```

See
[staticResponse](/api/commands/intercept#staticResponse-lt-code-gtStaticResponselt-code-gt)
argument

```js
// spying, dynamic stubbing, request modification, etc.
cy.intercept(url, routeHandler)
cy.intercept(method, url, routeHandler)
cy.intercept(routeMatcher, routeHandler)
cy.intercept(url, routeMatcher, routeHandler)
```

See
[routeHandler](/api/commands/intercept#routeHandler-lt-code-gtFunctionlt-code-gt)
argument

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```js
// spying
cy.intercept('/users/**')
cy.intercept('GET', '/users*')
cy.intercept({
  method: 'GET',
  url: '/users*',
  hostname: 'localhost',
})

// spying and response stubbing
cy.intercept('POST', '/users*', {
  statusCode: 201,
  body: {
    name: 'Peter Pan',
  },
})

// spying, dynamic stubbing, request modification, etc.
cy.intercept('/users*', { hostname: 'localhost' }, (req) => {
  /* do something with request and/or response */
})
```

### Arguments

#### **<Icon name="angle-right"></Icon> method** **_(String)_**

Match the route to a specific
[HTTP method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) (`GET`,
`POST`, `PUT`, etc).

<Alert type="bolt">

If no method is defined Cypress will match all requests by default.

</Alert>

#### **<Icon name="angle-right"></Icon> url** **_(String, Glob, RegExp)_**

Specify the URL to match. See [Matching `url`][match-url] for examples.

Alternatively, specify the URL via the [`routeMatcher`][arg-routematcher]
argument (below).

#### **<Icon name="angle-right"></Icon> routeMatcher** **_(`RouteMatcher`)_**

`routeMatcher` is an object used to match the incoming HTTP requests with this
intercepted route.

All properties are optional but all those that are set must match for the
request to be intercepted. If a `string` is passed to any property, it will be
glob-matched against the request using
[`Cypress.minimatch`](/api/utilities/minimatch) with the `{ matchBase: true }`
minimatch option applied.

| Option     | Description                                                                                     |
| ---------- | ----------------------------------------------------------------------------------------------- |
| auth       | HTTP Basic Authentication (`object` with keys `username` and `password`)                        |
| headers    | HTTP request headers (`object`)                                                                 |
| hostname   | HTTP request hostname                                                                           |
| https      | `true`: only secure (https://) requests, `false`: only insecure (http://) requests              |
| method     | HTTP request method (matches any method by default)                                             |
| middleware | `true`: match route first and in defined order, `false`: match route in reverse order (default) |
| path       | HTTP request path after the hostname, including query parameters                                |
| pathname   | Like `path`, but without query parameters                                                       |
| port       | HTTP request port(s) (`number` or `Array`)                                                      |
| query      | Parsed query string (`object`)                                                                  |
| times      | Maximum number of times to match (`number`)                                                     |
| url        | Full HTTP request URL                                                                           |

See [examples](#With-RouteMatcher) below.

#### <Icon name="angle-right"></Icon> staticResponse (<code>[StaticResponse][staticresponse]</code>)

By passing in a `StaticResponse` as the last argument, you can
[statically define (stub) a response](#Stubbing-a-response) for matched
requests. See [`StaticResponse` object](#StaticResponse-objects) for the list of
properties.

See
[Stubbing a response with a `StaticResponse` object](#With-a-StaticResponse-object)
for an example.

#### <Icon name="angle-right"></Icon> routeHandler (<code>Function</code>)

The `routeHandler` function is called whenever a request is matched, with the
first argument being the request object. From inside the callback, you have
access to the entire request-response where you can modify the outgoing request,
send a response, access the real response, and more.

See ["Intercepted requests"][req] and
[Request/Response Modification with `routeHandler`](#Request-Response-Modification-with-routeHandler).

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

- `cy.intercept()` yields `null`.
- `cy.intercept()` can be aliased, but otherwise cannot be chained further.
- Waiting on an aliased `cy.intercept()` route using
  [cy.wait()](/api/commands/wait) will yield an object that contains information
  about the matching request/response cycle. See
  [Using the yielded object](#Using-the-yielded-object) for examples of how to
  use this object.

## Examples

<Alert type="info">

`cy.intercept` can be used solely for spying: to passively listen for matching
routes and apply [aliases](#Aliasing-a-Route) to them without manipulating the
request or its response in any way. This alone is powerful as it allows you to
[wait](#Waiting-on-a-request) for these requests, resulting in more reliable
tests.

</Alert>

### Matching `url`

You can provide the exact [URL](#Arguments) to match or use pattern-matching to
match many URLs at once, either with globs or with regex. See
[Glob Pattern Matching URLs](#Glob-Pattern-Matching-URLs).

```js
// match any request that exactly matches the URL
cy.intercept('https://prod.cypress.io/users')

// match any request that satisfies a glob pattern
cy.intercept('/users?_limit=*')

// match any request that satisfies a regex pattern
cy.intercept(/\/users\?_limit=(3|5)$/)
```

### Matching `method`

<Alert type="warning">

If you don't pass in a [`method` argument][arg-method], then all HTTP methods
(`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, etc.) will match.

</Alert>

```js
cy.intercept('/users')
// matches this: GET http://localhost/users
// ...and this, too: POST http://localhost/users

cy.intercept('GET', '/users')
// matches this: GET http://localhost/users
// ...but not this: POST http://localhost/users
```

### Matching with [RouteMatcher](#routeMatcher-RouteMatcher)

Specifying a `method` and `url` to match can also be acheived by passing the
`routeMatcher` object into `cy.intercept` instead:

```js
// These both yield the same result:
cy.intercept({ method: 'GET', url: '**/users' })
cy.intercept('GET', '**/users')
```

```js
// Match any type of request with the pathname `/search`
// and the query paramater 'q=some+terms'
cy.intercept({
  pathname: '/search',
  query: {
    q: 'some terms',
  },
}).as('searchForTerms')
```

```js
cy.intercept(
  {
    // this RegExp matches any URL beginning with
    // 'http://api.example.com/' and ending with '/edit' or '/save'
    url: /^http:\/\/api\.example\.com\/.*\/(edit|save)/,
    // matching requests must also contain this header
    headers: {
      'x-requested-with': 'exampleClient',
    },
  }
})
```

```js
// this example will cause 1 request to `/temporary-error`
// to receive a network error and subsequent requests will
// not match this `RouteMatcher`
cy.intercept('/temporary-error', { times: 1 }, { forceNetworkError: true })
```

### Pattern Matching

```js
// match updates to the `/users` endpoint using glob matching
cy.intercept({
  method: '+(PUT|PATCH)',
  url: '**/users/*',
})
// matches:
//   PUT /users/1
//   PATCH /users/1
//   doesn't match
//   GET /users
//   GET /users/1

// same as above, but using regex
cy.intercept({
  method: '/PUT|PATCH/',
  url: '**/users/*',
})
```

### Aliasing an intercepted route

While `cy.intercept` doesn't yield anything, you can chain
[`.as`](/api/commands/as) to it to create an
[alias](/guides/core-concepts/variables-and-aliases#Aliases) which can be used
to [wait on a request](#Waiting-on-a-request).

```js
cy.intercept('GET', '/users').as('getAllUsers')
cy.intercept('POST', '/users').as('createUser')
```

### Aliasing individual requests

Aliases can be set on a per-request basis by setting the `alias` property of the
intercepted request. This is especially useful when intercepting GraphQL
requests:

```js
cy.intercept('POST', '/graphql', (req) => {
  if (req.body.hasOwnProperty('query') && req.body.query.includes('mutation')) {
    req.alias = 'gqlMutation'
  }
})

// assert that a matching request has been made
cy.wait('@gqlMutation')
```

<Alert type="info">

For more guidance around aliasing requests with GraphQL, see
[Working with GraphQL](/guides/end-to-end-testing/working-with-graphql)

</Alert>

### Waiting on a request

Use [cy.wait()](/api/commands/wait) with
[aliasing an intercepted route](#aliasing-an-intercepted-route) to wait for the
request/response cycle to complete.

#### With URL

```js
cy.intercept('http://example.com/settings').as('getSettings')

// once a request to get settings responds, 'cy.wait' will resolve
cy.wait('@getSettings')
```

#### With [RouteMatcher](#routeMatcher-RouteMatcher)

```js
cy.intercept({
  url: 'http://example.com/search*',
  query: { q: 'expected terms' },
}).as('search')

// once any type of request to search with a querystring
// containing 'q=expected+terms' responds, 'cy.wait' will resolve
cy.wait('@search')
```

#### Using the yielded object

Using [cy.wait()](/api/commands/wait) on a `cy.intercept()` route alias yields
an interception object which represents the request/response cycle:

```js
cy.wait('@someRoute').then((interception) => {
  // 'interception' is an object with properties
  // 'id', 'request' and 'response'
})
```

You can chain [`.its()`](/api/commands/its) and
[`.should()`](/api/commands/should) to assert against request/response cycles:

```js
// assert that a request to this route
// was made with a body that included 'user'
cy.wait('@someRoute').its('request.body').should('include', 'user')

// assert that a request to this route
// received a response with HTTP status 500
cy.wait('@someRoute').its('response.statusCode').should('eq', 500)

// assert that a request to this route
// received a response body that includes 'id'
cy.wait('@someRoute').its('response.body').should('include', 'id')
```

#### Waiting on errors

You can use [cy.wait()](/api/commands/wait) to wait on requests that end with
network errors:

```js
cy.intercept('GET', '/should-err', { forceNetworkError: true }).as('err')

// assert that this request happened
// and that it ended in an error
cy.wait('@err').should('have.property', 'error')
```

### Stubbing a response

#### With a string

```js
// requests to '/update' will be fulfilled
// with a body of "success"
cy.intercept('/update', 'success')
```

#### With a fixture

```js
// requests to '/users.json' will be fulfilled
// with the contents of the "users.json" fixture
cy.intercept('/users.json', { fixture: 'users.json' })
```

#### With a `StaticResponse` object

A [`StaticResponse`][staticresponse] object represents a response to an HTTP
request, and can be used to stub routes:

```js
const staticResponse = {
  /* some StaticResponse properties here... */
}

cy.intercept('/projects', staticResponse)
```

Stub a response with a JSON body:

```js
cy.intercept('/projects', {
  body: [{ projectId: '1' }, { projectId: '2' }],
})
```

Stub headers, status code, and body all at once:

```js
cy.intercept('/not-found', {
  statusCode: 404,
  body: '404 Not Found!',
  headers: {
    'x-not-found': 'true',
  },
})
```

Stub response with a fixture that is read as a Buffer:

```js
cy.intercept('/not-found', {
  fixture: 'media/gif.mp4,null',
})
```

See also [`StaticResponse` object][staticresponse].

### Using the **`routeHandler`** function

By specifying a [`routeHandler`][arg-routehandler] function as the last argument
to `cy.intercept`, you'll have access to the entire request-response session,
enabling you to modify the outgoing request, manipulate the real response, make
assertions, etc.

The `routeHandler` takes the incoming HTTP request (`IncomingHTTPRequest`) as
the first argument.

```js
cy.intercept('/users*', (req) => {
  /* do something with request and/or response */
})
```

<Alert type="info">

Throughout these examples we will refer to the incoming HTTP request as `req`.
Those of you with [Express.js](https://expressjs.com/)
[middleware](https://expressjs.com/en/guide/writing-middleware.html) experience
should be familiar with this syntax.

</Alert>

#### Asserting on a request

```js
cy.intercept('POST', '/organization', (req) => {
  expect(req.body).to.include('Acme Company')
})
```

#### Modifying an outgoing request

You can use the request handler callback to modify the [intercepted request
object][req] before it is sent.

```js
// set the request body to something different
// before it's sent to the destination
cy.intercept('POST', '/login', (req) => {
  req.body = 'username=janelane&password=secret123'
})

// dynamically set the alias
cy.intercept('POST', '/login', (req) => {
  req.alias = 'login'
})
```

#### Adding a header to an outgoing request

You can add a header to an outgoing request, or modify an existing header

```js
cy.intercept('/req-headers', (req) => {
  req.headers['x-custom-headers'] = 'added by cy.intercept'
})
```

**Note:** the new header will NOT be shown in the browser's Network tab, as the
request has already left the browser. You can still confirm the header was added
by waiting on the intercept as shown below:

#### Waiting on the intercept

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

You can add, modify or delete a header to all outgoing requests using a
`beforeEach()` in the
[supportFile](/guides/core-concepts/writing-and-organizing-tests#Support-file).

```js
beforeEach(() => {
  cy.intercept(
    { url: 'http://localhost:3001/**', middleware: true },
    // Delete 'if-none-match' header from all outgoing requests
    (req) => delete req.headers['if-none-match']
  )
})
```

#### Dynamically stubbing a response

You can use the [`req.reply()`][req-reply] function to dynamically control the
response to a request.

```js
cy.intercept('/billing', (req) => {
  // functions on 'req' can be used to
  // dynamically respond to a request here

  // send the request to the destination server
  req.reply()

  // respond to the request with a JSON object
  req.reply({ plan: 'starter' })

  // send the request to the destination server
  // and intercept the response
  req.continue((res) => {
    // 'res' represents the real destination's response
    // See "Intercepting a response" for more details and examples
  })
})
```

See ["Intercepted requests"][req] for more information on the `req` object and
its properties and methods.

#### Returning a Promise

If a Promise is returned from the route callback, it will be awaited before
continuing with the request.

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

If [`req.reply()`][req-reply] or [`req.continue()`][req-continue] is not
explicitly called inside of a request handler, requests will pass to the next
request handler until none are left.

```js
// you could have a top-level middleware handler that
// sets an auth token on all requests
// but remember setting `middleware: true` will
// cause this to always be called first
cy.intercept('http://api.company.com/', { middleware: true }, (req) => {
  req.headers['authorization'] = `token ${token}`
})

// and then have another handler that
// more narrowly asserts on certain requests
cy.intercept('POST', 'http://api.company.com/widgets', (req) => {
  expect(req.body).to.include('analytics')
})

// a POST request to http://api.company.com/widgets would hit both
// of those callbacks, middleware first, then the request would be
// sent out with the modified request headers to the
// real destination
```

### Intercepting a response

Inside of a callback passed to `req.continue()`, you can access the destination
server's real response.

```js
cy.intercept('/integrations', (req) => {
  // req.continue() with a callback will send the request to
  // the destination server
  req.continue((res) => {
    // 'res' represents the real destination response
    // you can manipulate 'res' before it's sent to the browser
  })
})
```

See ["Intercepted responses"][res] for more information on the `res` object. See
["Controlling the outbound request with `req.continue()`"][req-continue] for
more information about `req.continue()`.

#### Asserting on a response

```js
cy.intercept('/projects/2', (req) => {
  req.continue((res) => {
    expect(res.body).to.include('My Project')
  })
})
```

#### Returning a Promise

If a Promise is returned from the route callback, it will be awaited before
sending the response to the browser.

```js
cy.intercept('/users', (req) => {
  req.continue((res) => {
    // the response will not be sent to the browser until
    // 'waitForSomething()' resolves
    return waitForSomething()
  })
})
```

#### Throttle or delay response all incoming responses

You can throttle or delay all incoming responses using a `beforeEach()` in the
[supportFile](/guides/core-concepts/writing-and-organizing-tests#Support-file).

```js
// Throttle API responses to simulate real-world conditions
beforeEach(() => {
  cy.intercept(
    {
      url: 'http://localhost:3001/**',
      middleware: true,
    },
    (req) => {
      req.on('response', (res) => {
        // Throttle the response to 1 Mbps to simulate a
        // mobile 3G connection
        res.setThrottle(1000)
      })
    }
  )
})
```

### Request/Response Modification with `routeHandler`

Specify [`routeHandler`][arg-routehandler] as the last argument to modify the
outgoing request, stub a response, make assertions, etc.

<!-- TODO DX-188 emphasize the usage of StaticResponse as the routeHandler -->

If a function is passed as the `routeHandler`, it will be called with the
intercepted HTTP request:

```js
cy.intercept('/api', (req) => {
  // do something with the intercepted request
})
```

From here, you can do several things with the intercepted request:

<!-- TODO DX-190 add links to examples -->

- modify and make assertions on the request like its body, headers, URL, method,
  etc. ([example](#Asserting-on-a-request-1))
- stub out the response without interacting with a real back-end
  ([example](#Controlling-the-response)
- pass the request through to its destination and modify or make assertions on
  the real response on its way back ([example](#Controlling-the-response))
- attach listeners to various events on the request
  ([example](#Controlling-the-response))

#### Asserting on a request

You can use the request handler callback to make an assertion on the
[intercepted request object][req] before it is sent.

```js
// match requests to create a user
cy.intercept('POST', '/users', (req) => {
  // make an assertion on the payload contents
  expect(req.body).to.include('Peter Pan')
})
```

#### Controlling the outgoing request

The outgoing request, including its body, headers, etc., can be modified before
it's sent.

```js
// modify the request body before it's sent to its destination
cy.intercept('POST', '/users', (req) => {
  req.body = {
    name: 'Peter Pan',
  }
})

// add a header to an outgoing request
cy.intercept('POST', '/users', (req) => {
  req.headers['x-custom-header'] = 'added by cy.intercept'
})

// modify an existing header
cy.intercept('POST', '/users', (req) => {
  req.headers['authorization'] = 'Basic YWxhZGRpbjpvcGVuc2VzYW1l'
})
```

#### Verifying the request modification

```js
cy.intercept('POST', '/users', (req) => {
  req.headers['x-custom-header'] = 'added by cy.intercept'
}).as('createUser')

cy.get('button.save').click()
// you can see the headers in the console output by selecting
// this line in the command log:
cy.wait('@createUser')
  // ...or make an assertion:
  .its('request.headers')
  .should('have.property', 'x-custom-header', 'added by cy.intercept')
```

<Alert type="warning">

The request modification cannot be verified by inspecting the browser's network
traffic (for example, in Chrome DevTools), since the browser logs network
traffic _before_ Cypress can intercept it.

</Alert>

<Alert type="warning">

`cy.intercept()` cannot be debugged using
[`cy.request()`](/api/commands/request)! Cypress only intercepts requests made
by your front-end application.

</Alert>

#### Controlling the response

The intercepted request passed to the route handler (hereafter referred to as
`req`, though you can use any name) contains methods to dynamically control the
response to a request:

- `req.reply()` - stub out a response requiring no dependency on a real back-end
- `req.continue()` - modify or make assertions on the real response
- `req.destroy()` - destroy the request and respond with a network error
- `req.redirect()` - respond to the request with a redirect to a specified
  location
- `req.on()` - modify the response by attaching to events

Stubbing out a response (`req.reply()`):

`req.reply()` takes a [`StaticResponse`][staticresponse] object as the first
argument:

```js
// stub out the response without interacting with a real back-end
cy.intercept('POST', '/users', (req) => {
  req.reply({
    headers: {
      Set-Cookie: 'newUserName=Peter Pan;'
    },
    statusCode: 201,
    body: {
      name: 'Peter Pan'
    },
    delay: 10, // milliseconds
    throttleKbps: 1000, // to simulate a 3G connection
    forceNetworkError: false // default
  })
})

// stub out a response body using a fixture
cy.intercept('GET', '/users', (req) => {
  req.reply({
    statusCode: 200, // default
    fixture: 'users.json'
  })
})
```

See [`StaticResponse` objects][staticresponse] below for more information.

The `reply` method also supports shorthand to avoid having to specify a
`StaticResponse` object:

```js
// equivalent to `req.reply({ body })`
req.reply(body)

// equivalent to `req.reply({ body, headers })`
req.reply(body, headers)

// equivalent to `req.reply({ statusCode, body, headers})`
req.reply(statusCode, body, headers)
```

<Alert type="bolt">

Note: Calling `reply()` will end the request phase and stop the request from
propagating to the next matching request handler in line. See [Interception
Lifecycle][lifecycle].

</Alert>

See also
[Providing a stub response with `req.reply()`](#Providing-a-stub-response-with-req-reply)

Modifying the real response (`continue`):

The `continue` method accepts a function which is passed an object representing
the real response being intercepted on its way back to the client (your
front-end application).

```js
// pass the request through and make an assertion on
// the real response
cy.intercept('POST', '/users', (req) => {
  req.continue((res) => {
    expect(res.body).to.include('Peter Pan')
  })
})
```

See also
[Controlling the outbound request with `req.continue()`](#Controlling-the-outbound-request-with-req-continue)

Responding with a network error (`destroy`):

```js
// dynamically destroy the request and
// respond with a network error
cy.intercept('POST', '/users', (req) => {
  if (mustDestroy(req)) {
    req.destroy()
  }

  function mustDestroy(req) {
    // code that determines whether to force a network error
    // based on the contents of `req`
  }
})
```

Responding with a new location (`redirect`):

```js
// respond to this request with a redirect to a new 'location'
cy.intercept('GET', '/users', (req) => {
  // statusCode defaults to `302`
  req.redirect('/customers', 301)
})
```

Responding by listening to events (`on`):

```js
cy.intercept('GET', '/users', (req) => {
  req.on('before:response', (res) => {
    // do something when the `before:response` event is triggered
  })
})
cy.intercept('POST', '/users', (req) => {
  req.on('response', (res) => {
    // do something when the `response` event is triggered
  })
})
```

See example for
[throttling a response](#Throttle-or-delay-response-all-incoming-responses) See
more examples of [events](#Request-events)

#### Returning a Promise

If a Promise is returned from the route callback, it will be awaited before
continuing with the request.

```js
cy.intercept('POST', '/users', (req) => {
  // asynchronously fetch test data
  return getAuthToken().then((token) => {
    // ...and apply it to the outgoing request
    req.headers['Authorization'] = `Basic ${token}`
  })
})

cy.intercept('POST', '/users', (req) => {
  req.continue((res) => {
    // the response will not be sent to the browser until
    // `waitForSomething()` resolves:
    return waitForSomething()
  })
})
```

#### Stubbing a response with a string

```js
// requests to create a user will be fulfilled
// with a body of 'success'
cy.intercept('POST', '/users', 'success')
// { body: 'sucess' }
```

## Intercepted requests

If a function is passed as the handler for a `cy.intercept()`, it will be called
with the first argument being an object that represents the intercepted HTTP
request:

```js
cy.intercept('/api', (req) => {
  // `req` represents the intercepted HTTP request
})
```

From here, you can do several things with the intercepted request:

- you can modify and assert on the request's properties (body, headers, URL,
  method...)
- the request can be sent to the real upstream server
  - optionally, you can intercept the response from this
- a response can be provided to stub out the request
- listeners can be attached to various events on the request

### Request object properties

The request object (`req`) has several properties from the HTTP request itself.
All of the following properties on `req` can be modified except for
`httpVersion`:

```ts
{
  /**
   * The body of the request.
   * If a JSON Content-Type was used and the body was valid JSON,
   * this will be an object.
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
   * URL query string as object.
   */
  query: Record<string, string|number>
  /**
   * The HTTP version used in the request. Read only.
   */
  httpVersion: string
}
```

`req` also has some optional properties which can be set to control
Cypress-specific behavior:

```ts
{
  /**
   * If provided, the number of milliseconds before an upstream
   * response to this request will time out and cause an error.
   * By default, `responseTimeout` from config is used.
   */
  responseTimeout?: number
  /**
   * Set if redirects should be followed when this request is made.
   * By default, requests will not follow redirects before
   * yielding the response (the 3xx redirect is yielded).
   */
  followRedirect?: boolean
  /**
   * If set, `cy.wait` can be used to await the request/response
   * cycle to complete for this request via `cy.wait('@alias')`.
   */
  alias?: string
}
```

Any modifications to the properties of `req` will be persisted to other request
handlers, and finally merged into the actual outbound HTTP request.

### Controlling the outbound request with `req.continue()`

Calling `req.continue()` without any argument will cause the request to be sent
outgoing, and the response will be returned to the browser after any other
listeners have been called. For example, the following code modifies a `POST`
request and then sends it to the upstream server:

```js
cy.intercept('POST', '/submitStory', (req) => {
  req.body.storyName = 'some name'
  // send the modified request and skip any other
  // matching request handlers
  req.continue()
})
```

If a function is passed to `req.continue()`, the request will be sent to the
real upstream server, and the callback will be called with the response once the
response is fully received from the server. See ["Intercepted responses"][res]

Note: calling `req.continue()` will stop the request from propagating to the
next matching request handler in line. See ["Interception lifecycle"][lifecycle]
for more information.

### Providing a stub response with `req.reply()`

The `req.reply()` function can be used to send a stub response for an
intercepted request. By passing a string, object, or
[`StaticResponse`][staticresponse] to `req.reply()`, the request can be
preventing from reaching the destination server.

For example, the following code stubs out a JSON response from a request
interceptor:

```js
cy.intercept('/billing', (req) => {
  // dynamically get billing plan name at request-time
  const planName = getPlanName()
  // this object will automatically be JSON.stringified and
  // sent as the response
  req.reply({ plan: planName })
})
```

Instead of passing a plain object or string to `req.reply()`, you can also pass
a [`StaticResponse`][staticresponse] object. With a
[`StaticResponse`][staticresponse], you can force a network error,
delay/throttle the response, send a fixture, and more.

For example, the following code serves a dynamically chosen fixture with a delay
of 500ms:

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

See the [`StaticResponse` documentation][staticresponse] for more information on
stubbing responses in this manner.

#### `req.reply()` shorthand

`req.reply()` also supports shorthand, similar to [`res.send()`][res-send], to
avoid having to specify a `StaticResponse` object:

```js
// equivalent to `req.reply({ body })`
req.reply(body)

// equivalent to `req.reply({ body, headers })`
req.reply(body, headers)

// equivalent to `req.reply({ statusCode, body, headers})`
req.reply(statusCode, body, headers)
```

#### Convenience functions

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

See examples in the [Controlling the response](#Controlling-the-response)
section

Note: calling `req.reply()` will end the request phase and stop the request from
propagating to the next matching request handler in line. See ["Interception
lifecycle"][lifecycle] for more information.

### Request events

For advanced use, several events are available on `req`, that represent
different stages of the [Interception lifecycle][lifecycle].

By calling `req.on`, you can subscribe to different events:

```js
cy.intercept('/shop', (req) => {
  req.on('before:response', (res) => {
    /**
     * Emitted before `response` and before any `req.continue`
     * handlers. Modifications to `res` will be applied to the
     * incoming response. If a promise is returned, it will be
     * awaited before processing other event handlers.
     */
  })

  req.on('response', (res) => {
    /**
     * Emitted after `before:response` and after any
     * `req.continue` handlers - before the response is sent
     * to the browser. Modifications to `res` will be applied
     * to the incoming response. If a promise is returned, it
     * will be awaited before processing other event handlers.
     */
  })

  req.on('after:response', (res) => {
    /**
     * Emitted once the response to a request has finished
     * sending to the browser. Modifications to `res` have no
     * impact. If a promise is returned, it will be awaited
     * before processing other event handlers.
     */
  })
})
```

See ["Intercepted responses"][res] for more details on the `res` object yielded
by `before:response` and `response`. See ["Interception lifecycle"][lifecycle]
for more details on request ordering.

## Intercepted responses

The response can be intercepted in two ways:

- by passing a callback to [`req.continue()`](req-continue) within a request
  handler
- by listening for the `before:response` or `response` request events (see
  ["Request events"](#Request-events))

The response object, `res`, will be passed as the first argument to the handler
function:

```js
cy.intercept('/url', (req) => {
  req.on('before:response', (res) => {
    // this will be called before any `req.continue` or
    // `response` handlers
  })

  req.continue((res) => {
    // this will be called after all `before:response`
    // handlers and before any `response` handlers
    // by calling `req.continue`, we signal that this
    // request handler will be the last one, and that
    // the request should be sent outgoing at this point.
    // for that reason, there can only be one
    // `req.continue` handler per request.
  })

  req.on('response', (res) => {
    // this will be called after all `before:response`
    // handlers and after the `req.continue` handler
    // but before the response is sent to the browser
  })
})
```

### Response object properties

The response object (`res`) yielded to response handlers has several properties
from the HTTP response itself. All of the following properties on `res` can be
modified:

| Property      | Description                                       |
| ------------- | ------------------------------------------------- |
| body          | response body (`object`, `string`, `ArrayBuffer`) |
| headers       | response headers (`object`)                       |
| statusCode    | response status code (`number`)                   |
| statusMessage | response status message (`string`)                |

**Note about `body`:** If the response header contains
`Content-Type: application/json` and the body contains valid JSON, this will be
an `object`. And if the body contains binary content, this will be a buffer.

`res` also has some optional properties which can be set to control
Cypress-specific behavior:

| Property     | Description                                                                 |
| ------------ | --------------------------------------------------------------------------- |
| throttleKbps | Maximum data transfer rate of the response (kilobits/second)                |
| delay        | Minimum network latency or delay to add to the response time (milliseconds) |

Any modifications to the properties of `res` will be persisted to other response
handlers, and finally merged into the actual incoming HTTP response.

### Ending the response with `res.send()`

To end the response phase of the request, call `res.send()`. Optionally, you can
pass a [`StaticResponse`][staticresponse] to `res.send()`, to be merged with the
actual response.

When `res.send()` is called, the response phase will end immediately and no
other response handlers will be called for the current request. Here is an
example of how `res.send()` could be used:

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

See the [`StaticResponse` documentation][staticresponse] for more information on
the format.

#### `res.send()` shorthand

`res.send()` also supports shorthand, similar to [`req.reply()`][req-reply], to
avoid having to specify a `StaticResponse` object:

```js
// equivalent to `res.send({ body })`
res.send(body)

// equivalent to `res.send({ body, headers })`
res.send(body, headers)

// equivalent to `res.send({ statusCode, body, headers})`
res.send(statusCode, body, headers)
```

#### Convenience functions

There are also two convenience functions available on `res`:

```ts
{
  /**
   * Wait for 'delay' milliseconds before sending the
   * response to the client.
   */
  setDelay: (delay: number) => IncomingHttpResponse
  /**
   * Serve the response at 'throttleKbps' kilobytes per second.
   */
  setThrottle: (throttleKbps: number) => IncomingHttpResponse
}
```

Note: calling `res.send()` will end the response phase and stop the response
from propagating to the next matching response handler in line. See
["Interception lifecycle"][lifecycle] for more information.

## `StaticResponse` objects

A `StaticResponse` represents a
[statically defined response (stub)](#Stubbing-a-response).

The following properties are available on `StaticResponse`.

| Option            | Description                                                                                                                                                                                                                       |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| statusCode        | HTTP response status code                                                                                                                                                                                                         |
| headers           | HTTP response headers                                                                                                                                                                                                             |
| body              | Serve a static response body (`object`, `string`, `ArrayBuffer`) (when `fixture` is omitted).                                                                                                                                     |
| fixture           | Serve a fixture as the HTTP response body (allowed when `body` is omitted). Read the contents with an encoding other than the [default for the file type](/api/commands/fixture#Encoding), pass the fixture like `path,encoding`. |
| forceNetworkError | Force an error by destroying the browser connection                                                                                                                                                                               |
| delay             | Minimum network latency or delay to add to the response time (milliseconds)                                                                                                                                                       |
| throttleKbps      | Maximum data transfer rate of the response (kilobits/second)                                                                                                                                                                      |

**Note:** All properties are optional.

You can supply a `StaticResponse` to Cypress in 3 ways:

- To `cy.intercept()` as
  [`an argument`](#staticResponse-lt-code-gtStaticResponselt-code-gt), to stub a
  response to a route: `cy.intercept('/url', staticResponse)`
- To [`req.reply()`][req-reply], to stub a response from a request handler:
  `req.reply(staticResponse)`
- To [`res.send()`][res-send], to stub a response from a response handler:
  `res.send(staticResponse)`

See
["Stubbing a response with a `StaticResponse` object"](#With-a-StaticResponse-object)
for examples of stubbing with `cy.intercept()`.

## Interception lifecycle

The lifecycle of a `cy.intercept()` interception begins when an HTTP request is
sent from your app that matches one or more registered `cy.intercept()` routes.
From there, each interception has two phases: request and response.

`cy.intercept()` routes are matched in reverse order of definition, except for
routes which are defined with `{ middleware: true }`, which always run first.
This allows you to override existing `cy.intercept()` declarations by defining
an overlapping `cy.intercept()`:

<DocsImage src="/img/api/intercept/middleware-algo.png" alt="Middleware Algorithm" ></DocsImage>

### Request phase

The following steps are used to handle the request phase.

1. Start with the first matching route according to the above algorithm
   (middleware first, followed by handlers in reverse order).
2. Was a handler (body, [`StaticResponse`][staticresponse], or function)
   supplied to `cy.intercept()`? If not, continue to step 7.
3. If the handler was a body or [`StaticResponse`][staticresponse], immediately
   end the request with that response.
4. If the handler was a function, call the function with `req`, the incoming
   request, as the first argument. See ["Intercepted requests"][req] for more
   information on the `req` object.
   - If [`req.reply()`][req-reply] is called, immediately end the request phase
     with the provided response. See
     ["Providing a stub response with `req.reply()`"](#Providing-a-stub-response-with-req-reply).
   - If [`req.continue()`][req-continue] is called, immediately end the request
     phase, and send the request to the destination server. If a callback is
     provided to [`req.continue()`][req-continue], it will be called during the
     [response phase](#Response-phase)
5. If the handler returned a Promise, wait for the Promise to resolve.
6. Merge any modifications to the request object with the real request.
7. If there is another matching `cy.intercept()`, return to step 2 and continue
   following steps with that route.
8. Send the request outgoing to the destination server and end the request
   phase. The [response phase](#Response-phase) will begin once a response is
   received.

### Response phase

Once the HTTP response is received from the upstream server, the following steps
are applied:

1. Get a list of registered `before:response` event listeners.
2. For each `before:response` listener (if any), call it with the [`res`][res]
   object.
   - If [`res.send()`][res-send] is called, end the response phase and merge any
     passed arguments with the response.
   - If a Promise is returned, await it. Merge any modified response properties
     with the real response.
3. If a `req.continue()` with callback is declared for this route, call the
   callback with the [`res`][res] object.
   - If [`res.send()`][res-send] is called, end the response phase and merge any
     passed arguments with the response.
   - If a Promise is returned, await it. Merge any modified response properties
     with the real response.
4. Get a list of registered `response` event listeners.
5. For each `response` listener (if any), call it with the [`res`][res] object.
   - If [`res.send()`][res-send] is called, end the response phase and merge any
     passed arguments with the response.
   - If a Promise is returned, await it. Merge any modified response properties
     with the real response.
6. Send the response to the browser.
7. Once the response is complete, get a list of registered `after:response`
   event listeners.
8. For each `after:response` listener (if any), call it with the [`res`][res]
   object (minus `res.send`)
   - If a Promise is returned, await it.
9. End the response phase.

## Glob Pattern Matching URLs

When [matching a URL][match-url], providing an exact URL to match can be too
restrictive. For example, what if you wanted to run your tests on a different
host?

```js
// match any request that exactly matches the URL
cy.intercept('https://prod.cypress.io/users')
// matches this: https://prod.cypress.io/users
// ...but not this: https://staging.cypress.io/users
// ...or this: http://localhost/users
```

Glob pattern matching provides the necessary flexibility:

```js
cy.intercept('/users')
// matches all of these:
//   https://prod.cypress.io/users
//   https://staging.cypress.io/users
//   http://localhost/users

cy.intercept('/users?_limit=+(3|5)')
// matches all of these:
//   https://prod.cypress.io/users?_limit=3
//   http://localhost/users?_limit=5
```

### Cypress.minimatch

Under the hood, `cy.intercept` uses the [minimatch](/api/utilities/minimatch)
library with the `{ matchBase: true }` option applied for glob matching and
provides access to it via the `Cypress` global. This enables you to test your
pattern in your spec or in the Cypress browser console.

You can invoke the `Cypress.minimatch` with just two arguments - the URL
(`string`) and the pattern (`string`), respectively - and if it yields `true`,
then you have a match!

```javascript
expect(
  Cypress.minimatch('http://localhost/users?_limit=3', '**/users?_limit=+(3|5)')
).to.be.true
expect(
  Cypress.minimatch('http://localhost/users?_limit=5', '/users?_limit=+(3|5)', {
    matchBase: true,
  })
).to.be.true
expect(
  Cypress.minimatch('http://localhost/users?_limit=7', '**/users?_limit=+(3|5)')
).to.be.false
```

#### minimatch options

You can also pass in options (`object`) as the third argument, one of which is
`debug` which if set to `true`, will yield verbose output that could help you
understand why your pattern isn't working as you expect:

```js
Cypress.minimatch('http://localhost/users?_limit=3', '**/users?_limit=+(3|5)', {
  debug: true,
})
// true (plus debug messages)
```

## Comparison to `cy.route()`

Unlike [cy.route()](/api/commands/route), `cy.intercept()`:

- can intercept all types of network requests including Fetch API, page loads,
  XMLHttpRequests, resource loads, etc.
- does not require calling [cy.server()](/api/commands/server) before use - in
  fact, `cy.server()` does not influence `cy.intercept()` at all.
- does not have method set to `GET` by default, but intercepts `*` methods.

## `cy.intercept()` and request caching

`cy.intercept()` intercepts requests at the network layer. This can cause
confusion when trying to intercept a request that has already been cached by the
browser. If a request is served from the browser cache, it will never hit the
network layer, and `cy.intercept()` will never fire.

To see if this is affecting your app, check the Developer Tools. In the
following example, all of the requests circled in red have been served from
cache, and will not send an HTTP request. Thus, they cannot be intercepted by
`cy.intercept()`:

<DocsImage src="/img/api/intercept/devtools-cached-responses.png" alt="Screenshot of Chrome DevTools showing cached responses." ></DocsImage>

If you would like to intercept resources that normally send cache headers, here
are some workarounds:

- Turn off cache headers on your development server when in testing mode.
- Disable caching on responses by adding a top-level `cy.intercept()` that
  removes cache headers from desired requests. For example:
  ```ts
  beforeEach(() => {
    cy.intercept(
      'https://api.example.com/**/*',
      { middleware: true },
      (req) => {
        req.on('before:response', (res) => {
          // force all API responses to not be cached
          res.headers['cache-control'] = 'no-store'
        })
      }
    )
  })
  ```
- Chromium-family browsers only: Use `remote:debugger:protocol` to disable cache
  entirely. For more information, see
  [this comment on issue #14459](https://github.com/cypress-io/cypress/issues/14459#issuecomment-768616195)

## Command Log

```javascript
cy.intercept('/accounts*').as('accountsGet')
cy.intercept('/company', { companyId: 1 }).as('companyGet')
cy.intercept('/teams*', [{ teamId: 2 }]).as('teamsGet')
```

Whenever you create `cy.intercept()` rules, Cypress will display a new
Instrument Panel called _Routes_. It will list the routing table in the
Instrument Panel, including the `method`, `RouteMatcher`, if the route is
stubbed, any alias, and number of matched requests:

<!-- Code to reproduce screenshot:
it('cy.intercept command log', () => {
    cy.intercept('/accounts*').as('accountsGet')
    cy.intercept('/company', { companyId: 1 }).as('companyGet')
    cy.intercept('/teams*', [{ teamId: 2 }]).as('teamsGet')
    cy.then(() => {
        fetch('/accounts?page=1')
        fetch('/company')
        fetch('/teams?page=1')
    })
})
-->

<DocsImage src="/img/api/intercept/command-log-routes-ui.png" alt="Screenshot of Command Log Routes UI"></DocsImage>

When HTTP requests are made, Cypress will log them in the Command Log and
indicate whether they matched a `cy.intercept()` by the presence of a yellow
badge on the right hand side:

<DocsImage src="/img/api/intercept/command-log-fetches.png" alt="Screenshot of example fetches"></DocsImage>

The circular indicator is filled if the request went to the destination server,
but unfilled if the request was stubbed with a response.

Clicking on a request that matched a `cy.intercept()` will print additional
information about the request and response to the console:

<DocsImage src="/img/api/intercept/console-props.png" alt="Screenshot of cy.intercept console output"></DocsImage>

[Read more about request logging in Cypress.](/guides/guides/network-requests#Command-Log)

## History

| Version                                     | Changes                                                                                                                                                                                                                                                                                              |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [7.6.0](/guides/references/changelog#7-0-0) | Added `query` option to `req` (The incoming request object yielded to request handler functions).                                                                                                                                                                                                    |
| [7.0.0](/guides/references/changelog#7-0-0) | Removed `matchUrlAgainstPath` option from `RouteMatcher`, reversed handler ordering, added request events, removed substring URL matching, removed `cy.route2` alias, added `middleware` RouteMatcher option, renamed `res.delay()` to `res.setDelay()` and `res.throttle()` to `res.setThrottle()`. |
| [6.4.0](/guides/references/changelog#6-4-0) | Renamed `delayMs` property to `delay` (backwards-compatible).                                                                                                                                                                                                                                        |
| [6.2.0](/guides/references/changelog#6-2-0) | Added `matchUrlAgainstPath` option to `RouteMatcher`.                                                                                                                                                                                                                                                |
| [6.0.0](/guides/references/changelog#6-0-0) | Renamed `cy.route2()` to `cy.intercept()`.                                                                                                                                                                                                                                                           |
| [6.0.0](/guides/references/changelog#6-0-0) | Removed `experimentalNetworkStubbing` option and made it the default behavior.                                                                                                                                                                                                                       |
| [5.1.0](/guides/references/changelog#5-1-0) | Added experimental `cy.route2()` command under `experimentalNetworkStubbing` option.                                                                                                                                                                                                                 |

## See also

- [`.as()`](/api/commands/as)
- [`cy.wait()`](/api/commands/wait)
- [Network Requests Guide](/guides/guides/network-requests)
- [Cypress Example Recipes](https://github.com/cypress-io/cypress-example-recipes#stubbing-and-spying)
- [Kitchen Sink Examples](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/cypress/integration/2-advanced-examples/network_requests.spec.js)
- [Migrating `cy.route()` to `cy.intercept()`](/guides/references/migration-guide#Migrating-cy-route-to-cy-intercept)
<!-- TODO add examples from the resources below to `cypress-example-recipes` repo -->
- [Smart GraphQL Stubbing in Cypress](https://glebbahmutov.com/blog/smart-graphql-stubbing/)
  blog post
- [How cy.intercept works](https://slides.com/bahmutov/how-cy-intercept-works)
- [Cypress `cy.intercept()` Problems](https://glebbahmutov.com/blog/cypress-intercept-problems/)

[staticresponse]: #StaticResponse-objects
[lifecycle]: #Interception-lifecycle
[req]: #Intercepted-requests
[req-continue]: #Controlling-the-outbound-request-with-req-continue
[req-reply]: #Providing-a-stub-response-with-req-reply
[res]: #Intercepted-responses
[res-send]: #Ending-the-response-with-res-send
[match-url]: #Matching-url
[glob-match-url]: #Glob-Pattern-Matching-URLs
[arg-method]: #method-String
[arg-routehandler]:
  #routeHandler-lt-code-gtstring-object-Function-StaticResponselt-code-gt
[arg-routematcher]: #routeMatcher-RouteMatcher
