---
title: intercept
---

Use `cy.intercept()` to manage the behavior of HTTP requests at the network layer.

With `cy.intercept()`, you can:

* stub or spy on any type of HTTP request.
* {% urlHash "modify an HTTP request's body, headers, and URL" Intercepting-a-request %} before it is sent to the destination server.
* stub the response to an HTTP request, either dynamically or statically.
* {% urlHash "modify real HTTP responses" Intercepting-a-response %}, changing the body, headers, or HTTP status code before they are received by the browser.
* and much more - `cy.intercept()` gives full access to all HTTP requests at all stages.

# Comparison to `cy.route()`

Unlike {% url "`cy.route()`" route %}, `cy.intercept()`:

* can intercept all types of network requests including Fetch API, page loads, XMLHttpRequests, resource loads, etc.
* does not require calling {% url "`cy.server()`" server %} before use - in fact, `cy.server()` does not influence `cy.intercept()` at all.
* does not have method set to `GET` by default

# Usage

```ts
cy.intercept(url, routeHandler?)
cy.intercept(method, url, routeHandler?)
cy.intercept(routeMatcher, routeHandler?)
```

## Arguments

### **{% fa fa-angle-right %} url** **_(`string | RegExp`)_**

Specify the URL to match. See the documentation for {% urlHash "`routeMatcher`" routeMatcher-RouteMatcher %} to see how URLs are matched.

```ts
cy.intercept('http://example.com/widgets')
cy.intercept('http://example.com/widgets', { fixture: 'widgets.json' })
```

### **{% fa fa-angle-right %} method** **_(`string`)_**

Specify the HTTP method to match on.

```ts
cy.intercept('POST', 'http://example.com/widgets', {
  statusCode: 200,
  body: 'it worked!'
})
```

### **{% fa fa-angle-right %} routeMatcher** **_(`RouteMatcher`)_**

`routeMatcher` is an object used to match which incoming HTTP requests will be handled by this route.

All properties are optional. All properties that are set must match for the route to handle a request. If a `string` is passed to any property, it will be glob-matched against the request using {% url "`minimatch`" https://github.com/isaacs/minimatch %}.The available `routeMatcher` properties are listed below:

```ts
{
  /**
   * Match against the username and password used in HTTP Basic authentication.
   */
  auth?: { username: string | RegExp, password: string | RegExp }
  /**
   * Match against HTTP headers on the request.
   */
  headers?: {
    [name: string]: string | RegExp
  }
  /**
   * Match against the requested HTTP hostname.
   */
  hostname?: string | RegExp
  /**
   * If 'true', only HTTPS requests will be matched.
   * If 'false', only HTTP requests will be matched.
   */
  https?: boolean
  /**
   * Match against the request's HTTP method.
   * @default '*'
   */
  method?: string | RegExp
  /**
   * Match on request path after the hostname, including query params.
   */
  path?: string | RegExp
  /**
   * Matches like 'path', but without query params.
   */
  pathname?: string | RegExp
  /**
   * Match based on requested port, or pass an array of ports
   * to match against any in that array.
   */
  port?: number | number[]
  /**
   * Match on parsed querystring parameters.
   */
  query?: {
    [key: string]: string | RegExp
  }
  /**
   * Match against the full request URL.
   * If a string is passed, it will be used as a substring match,
   * not an equality match.
   */
  url?: string | RegExp
}
```

`routeMatcher` usage examples:

```ts
cy.intercept({
  pathname: '/search',
  query: {
    q: 'some terms'
  }
}).as('searchForTerms')
// this 'cy.wait' will only resolve once a request is made to '/search'
// with the query paramater 'q=some+terms'
cy.wait('@searchForTerms')

cy.intercept({
  // this RegExp matches any URL beginning with 'http://api.example.com/widgets'
  url: /^http:\/\/api\.example\.com\/widgets/
  headers: {
    'x-requested-with': 'exampleClient'
  }
}, (req) => {
  // only requests to URLs starting with 'http://api.example.com/widgets'
  // having the header 'x-requested-with: exampleClient' will be received
})
```

### **{% fa fa-angle-right %} routeHandler** **_(`string | object | Function | StaticResponse`)_**

The `routeHandler` defines what will happen with a request if the {% urlHash "`routeMatcher`" routeMatcher-RouteMatcher %} matches. It can be used to {% urlHash "statically define a response" Stubbing-a-response %} for matching requests, or a function can be passed to {% urlHash "dynamically intercept the outgoing request" Intercepting-a-request %}.

* If a **string** is passed, requests to the route will be fulfilled with that string as the body. Passing `"foo"` is equivalent to using a `StaticResponse` object with `{ body: "foo" }`.
* If a **`StaticResponse` object** is passed, requests to the route will be fulfilled with a response using the values supplied in the `StaticResponse`. A `StaticResponse` can define the body of the response, as well as the headers, HTTP status code, and more. See {% urlHash "Stubbing a response with a `StaticResponse` object" With-a-StaticResponse-object %} for an example of how this is used.
* If an **object with no `StaticResponse` keys** is passed, it will be sent as a JSON response body. For example, passing `{ foo: 'bar' }` is equivalent to passing `{ body: { foo: 'bar' } }`.
* If a **function callback** is passed, it will be called whenever a request matching this route is received, with the first parameter being the request object. From inside the callback, you can modify the outgoing request, send a response, access the real response, and much more. See {% urlHash "Intercepting a request" Intercepting-a-request %} and {% urlHash "Intercepting a response" Intercepting-a-response %} for examples of dynamic interception.

## Yields {% helper_icon yields %}

* `cy.intercept()` yields `null`.
* `cy.intercept()` can be aliased, but otherwise cannot be chained further.
* Waiting on an aliased `cy.intercept()` route using {% url "`cy.wait()`" wait %} will yield an object that contains information about the matching request/response cycle. See {% urlHash "Using the yielded object" Using-the-yielded-object %} for examples of how to use this object.

# Examples

## Waiting on a request

Use {% url "`cy.wait()`" wait %} with `cy.intercept()` aliases to wait for the request/response cycle to complete.

### With URL

```js
cy.intercept('http://example.com/settings').as('getSettings')
// once a request to http://example.com/settings responds, this 'cy.wait' will resolve
cy.wait('@getSettings')
```

### With {% urlHash "`RouteMatcher`" routeMatcher-RouteMatcher %}

```js
cy.intercept({
  url: 'http://example.com/search',
  query: { q: 'expected terms' },
}).as('search')

// once any type of request to http://example.com/search with a querystring containing
// 'q=expected+terms' responds, this 'cy.wait' will resolve
cy.wait('@search')
```

### Using the yielded object

Using {% url "`cy.wait()`" wait %} on a `cy.intercept()` route alias yields an interception object which represents the request/response cycle:

```js
cy.wait('@someRoute').then((interception) => {
  // 'interception' is an object with properties 'id', 'request' and 'response'
})
```

You can chain {% url `.its()` its %} and {% url `.should()` should %} to assert against request/response cycles:

```js
// assert that a request to this route was made with a body that included 'user'
cy.wait('@someRoute').its('request.body').should('include', 'user')

// assert that a request to this route received a response with HTTP status 500
cy.wait('@someRoute').its('response.statusCode').should('eq', 500)

// assert that a request to this route received a response body that includes 'id'
cy.wait('@someRoute').its('response.body').should('include', 'id')
```

### Aliasing individual requests

Aliases can be set on a per-request basis by setting the `alias` property of the intercepted request:

```js
cy.intercept('POST', '/graphql', (req) => {
  if (req.body.includes('mutation')) {
    req.alias = 'gqlMutation'
  }
})

// assert that a matching request has been made
cy.wait('@gqlMutation')
```

## Stubbing a response

### With a string

```js
// requests to '/update' will be fulfilled with a body of "success"
cy.intercept('/update', 'success')
```

### With a fixture

```js
// requests to '/users.json' will be fulfilled
// with the contents of the "users.json" fixture
cy.intercept('/users.json', { fixture: 'users.json' })
```

### With a `StaticResponse` object

A `StaticResponse` object represents a response to an HTTP request, and can be used to stub routes:

```js
const staticResponse = { /* some StaticResponse properties here... */ }

cy.intercept('/projects', staticResponse)
```

Here are the available properties on `StaticResponse`:

```ts
{
  /**
   * Serve a fixture as the response body.
   */
  fixture?: string
  /**
   * Serve a static string/JSON object as the response body.
   */
  body?: string | object | object[]
  /**
   * HTTP headers to accompany the response.
   * @default {}
   */
  headers?: { [key: string]: string }
  /**
   * The HTTP status code to send.
   * @default 200
   */
  statusCode?: number
  /**
   * If 'forceNetworkError' is truthy, Cypress will destroy the browser connection
   * and send no response. Useful for simulating a server that is not reachable.
   * Must not be set in combination with other options.
   */
  forceNetworkError?: boolean
  /**
   * Milliseconds to delay before the response is sent.
   */
  delayMs?: number
  /**
   * Kilobits per second to send 'body'.
   */
  throttleKbps?: number
}
```

## Intercepting a request

### Asserting on a request

```js
cy.intercept('POST', '/organization', (req) => {
  expect(req.body).to.include('Acme Company')
})
```

### Modifying an outgoing request

You can use the route callback to modify the request before it is sent.

```js
cy.intercept('POST', '/login', (req) => {
  // set the request body to something different before it's sent to the destination
  req.body = 'username=janelane&password=secret123'
})
```

### Dynamically stubbing a response

You can use the `req.reply()` function to dynamically control the response to a request.

```js
cy.intercept('/billing', (req) => {
  // functions on 'req' can be used to dynamically respond to a request here

  // send the request to the destination server
  req.reply()

  // respond to the request with a JSON object
  req.reply({ plan: 'starter' })

  // send the request to the destination server, and intercept the response
  req.reply((res) => {
    // 'res' represents the real destination's response
    // See "Intercepting a response" for more details and examples
  })
})
```

The available functions on `req` are:

```ts
{
  /**
   * Destroy the request and respond with a network error.
   */
  destroy(): void
  /**
   * Control the response to this request.
   * If a function is passed, the request will be sent outgoing,
   * and the function will be called with the response from the upstream server.
   * If a 'StaticResponse' is passed, it will be used as the response
   * and no request will be made to the upstream server.
   */
  reply(interceptor?: StaticResponse | HttpResponseInterceptor): void
  /**
   * Shortcut to reply to the request with a body and optional headers.
   */
  reply(body: string | object, headers?: { [key: string]: string }): void
  /**
   * Shortcut to reply to the request with an HTTP status code
   * and optional body and headers.
   */
  reply(status: number, body?: string | object, headers?: { [key: string]: string }): void
  /**
   * Respond to this request with a redirect to a new 'location'.
   * @param statusCode HTTP status code to redirect with. Default: 302
   */
  redirect(location: string, statusCode?: number): void
}
```

### Returning a Promise

If a Promise is returned from the route callback, it will be awaited before continuing with the request.

```js
cy.intercept('POST', '/login', (req) => {
  // you could asynchronously fetch test data...
  return getLoginCredentials()
  .then((credentials) => {
    // ...and then, use it to supplement the outgoing request
    req.headers['authorization'] = credentials
  })
})
```

### Passing a request to the next route handler

If `req.reply()` is not explicitly called inside of a route callback, requests will pass to the next route callback until none are left.

```js
// you could have a top-level http that sets an auth token on all requests
cy.intercept('http://api.company.com/', (req) => {
  req.headers['authorization'] = `token ${token}`
})

// and then another http that more narrowly asserts on certain requests
cy.intercept('POST', 'http://api.company.com/widgets', (req) => {
  expect(req.body).to.include('analytics')
})

// a POST request to http://api.company.com/widgets would hit both
// of those callbacks in order then it would be sent out
// with the modified request headers to the real destination
```

## Intercepting a response

Inside of a callback passed to `req.reply()`, you can access the destination server's real response.

```js
cy.intercept('/integrations', (req) => {
  // req.reply() with a callback will send the request to the destination server
  req.reply((res) => {
    // 'res' represents the real destination response
    // you can manipulate 'res' before it's sent to the browser
  })
})
```

### Asserting on a response

```js
cy.intercept('/projects', (req) => {
  req.reply((res) => {
    expect(res.body).to.include('My Project')
  })
})
```

### Returning a Promise

If a Promise is returned from the route callback, it will be awaited before sending the response to the browser.

```js
cy.intercept('/users', (req) => {
  req.reply((res) => {
    // the response will not be sent to the browser until 'waitForSomething()' resolves
    return waitForSomething()
  })
})
```

### Modifying an incoming response

You can use the `res.send()` function to dynamically control the incoming response. Also, any modifications to `res` will be persisted when the response is sent to the browser.

`res.send()` is implicitly called after the `req.reply` callback finishes if it has not already been called.

```js
cy.intercept('/notification', (req) => {
  req.reply((res) => {
    // replaces 'res.body' with "Success" and sends the response to the browser
    res.send('Success')

    // sends a fixture body instead of the existing 'res.body'
    res.send({ fixture: 'success.json' })

    // delays the response by 1000ms
    res.delay(1000)

    // throttles the response to 64kbps
    res.throttle(64)
  })
})
```

The available functions on `res` are:

```ts
{
  /**
    * Continue the HTTP response, merging the supplied values with the real response.
    */
  send(status: number, body?: string | number | object, headers?: { [key: string]: string }): void
  send(body: string | object, headers?: { [key: string]: string }): void
  send(staticResponse: StaticResponse): void
  /**
    * Continue the HTTP response to the browser,
    * including any modifications made to 'res'.
    */
  send(): void
  /**
    * Wait for 'delayMs' milliseconds before sending the response to the client.
    */
  delay: (delayMs: number) => IncomingHttpResponse
  /**
    * Serve the response at 'throttleKbps' kilobytes per second.
    */
  throttle: (throttleKbps: number) => IncomingHttpResponse
}
```

{% history %}
{% url "6.0.0" changelog#6-0-0 %} | Renamed `cy.route2()` to `cy.intercept()`.
{% url "6.0.0" changelog#6-0-0 %} | Removed `experimentalNetworkStubbing` option and made it the default behavior.
{% url "5.1.0" changelog#5-1-0 %} | Added experimental `cy.route2()` command under `experimentalNetworkStubbing` option.
{% endhistory %}

# See also

* {% url "`cy.intercept()` example recipes with real-world examples" https://github.com/cypress-io/cypress-example-recipes#stubbing-and-spying %}
* {% url "`cy.route()` vs `cy.route2()`" https://glebbahmutov.com/blog/cy-route-vs-route2/ %} blog post
* {% url "Smart GraphQL Stubbing in Cypress" https://glebbahmutov.com/blog/smart-graphql-stubbing/ %} blog post
* {% url "open issues for `net stubbing`" https://github.com/cypress-io/cypress/issues?q=is%3Aissue+is%3Aopen+label%3Apkg%2Fnet-stubbing %} and {% url "closed issues for `net stubbing`" https://github.com/cypress-io/cypress/issues?q=is%3Aissue+is%3Aclosed+label%3Apkg%2Fnet-stubbing %}
