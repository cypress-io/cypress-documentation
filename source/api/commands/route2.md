---
title: route2
containerClass: experimental
---

{% note warning %}
{% fa fa-warning orange %} **This is an experimental feature. In order to use it, you must manually configure the {% url "`experimentalNetworkMocking`" experiments %} option to `true`.** See {% issue 687 %} for more details.
{% endnote %}

Use `cy.route2()` to manage the behavior of network requests at the network layer.

# Comparison to `cy.route()`

Unlike {% url `cy.route()` route %}, `cy.route2()`:

- can mock all types of network requests (i.e., Fetch API, page loads, XMLHttpRequests, etc.)
- no longer requires {% url `cy.server()` server %} before use

# Syntax

```javascript
cy.route2(requestMatcher)
cy.route2(requestMatcher, response)
cy.route2(method, requestMatcher)
cy.route2(method, requestMatcher, response)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.route2('/users/**')
```

## Arguments

**{% fa fa-angle-right %} requestMatcher** ***(String, Glob, RegExp, Object)***

The `requestMatcher` argument allows you to listen for a route matching a specific URL or pattern.

For simple route matching, passing a string, glob, or RegExp is the simplest method:

```js
// String
cy.route2('/users')

// Regex
cy.route2(/users\/\d+/)

// Glob to match all paths in the /user path
// Uses minimatch for matching: https://github.com/isaacs/minimatch
cy.route2('/users/**')

// https://localhost:8080/users/1b2c3                          <-- matches
// https://localhost:8080/users/profile/edit                   <-- matches
// https://localhost:8080/users/transaction?month=03&year=2020 <-- matches
```

However, if you need to match additional properties on the route, you can pass an object instead.

```js
cy.route2({
  path: '/users/**',
  method: 'POST',
})
```

The following contains a complete list of available properties you can match against:

Option | Default | Type | Description
--- | --- | --- | ---
`auth` | `null` | *Object* | HTTP basic authentication including `username` and `password`
`headers` | `null` | *Object* | Client request headers
`hostname` | `null` | *String, RegExp, Glob* | Requested hostname
`method` | `'ALL'` | *String* | HTTP method (`GET`, `POST`, `PUT`, etc.)
`path` | `null` | *String, RegExp, Glob* | Request path after the hostname, including query params
`pathname` | `null` | *String, RegExp, Glob* | Request path after the hostname, without query params
`port` | `null` | *Number* | Requested port number
`query` | `null` | *Object* | Query parameters
`url` | `null` | *String, RegExp, Glob* | Full request URL

**{% fa fa-angle-right %} response** ***(String, Object, Array, Function)***

This allows you to supply a response `body` to {% url 'stub' stubs-spies-and-clocks#Stubs %} in the matching route. This is accomplished by giving you access to the request that you can use in a plain function.

```js
cy.route2('/users/**', (req) => {
  req.send({
    statusCode: 200,
    body: JSON.stringify({
      profile: {
        firstName: 'Tony',
        lastName: 'Jarvis'
      }
    })
  })
})
```

In addition, because you have access to the request, this means that you can modify the request as well:

```js
cy.route2('/users/**', (req) => {
  req.headers = { ...req.headers, accept: 'application/json' }
  req.body = { ...req.body, note: 'Custom note' }
})
```

**{% fa fa-angle-right %} method** ***(String)***

Match the route to a specific HTTP method (`GET`, `POST`, `PUT`, etc).

{% note bolt %}
By default, Cypress will match `ALL` requests.
{% endnote %}

## Yields {% helper_icon yields %}

{% yields null_alias cy.route2 %}

# Examples

## Without Stubbing

If you do not pass a `response` to a route, Cypress will pass the request through without stubbing it. We can still wait for the request to resolve later.

### Wait on `GET` request matching `url`

```javascript
cy.route2('**/users').as('getUsers')
cy.visit('/users')
cy.wait('@getUsers')
```

### Wait on matching `method` and `url`

```javascript
cy.route2('POST', '**/users').as('postUser')
cy.visit('/users')
cy.get('#first-name').type('Julius{enter}')
cy.wait('@postUser')
```

### Wait on `url` matching glob

Under the hood Cypress uses {% url 'minimatch' https://github.com/isaacs/minimatch %} to match glob patterns of `url`.

This means you can take advantage of `*` and `**` glob support. This makes it *much* easier to route against dynamic segments without having to build up a complex `RegExp`.

We expose {% url `Cypress.minimatch` minimatch %} as a function that you can use in your console to test routes.

### Match route against any UserId

```javascript
cy.route2('**/users/*/comments')

// https://localhost:7777/users/123/comments     <-- matches
// https://localhost:7777/users/123/comments/465 <-- does not match
```

### Use glob to match all segments

```javascript
cy.route2('**/posts/**')

// https://localhost:7777/posts/1            <-- matches
// https://localhost:7777/posts/foo/bar/baz  <-- matches
// https://localhost:7777/posts/quuz?a=b&1=2 <-- matches
```

### Modify request

Before a request gets passed through, we can modify the request. The `response` function accepts the request object as a parameter.

You can also (optionally) add a simulated {% urlHash 'delay' Simulate-delay %} or {% urlHash 'throttle' Simulate-throttle %} on the request to be sent out.

```javascript
cy.route2('/users', (req) => {
  // modify the headers or body
  req.headers = {...req.headers, accept: 'application/json'}
  req.body = {...req.body, foo: 'bar'}
})
```

### Modify response

After a request gets passed through, we can modify the response from the server. The `response` function accepts the request object as a parameter. Calling `.send()` on the request exposes a `response` object that can be modified.

```javascript
cy.route2('/users', (req) => {
  // passing a function to req.send causes the request to pass through
  // and allows the response from the origin server to be modified
  req.send((res) => {
    res.status = 200
    res.headers['x-new-headers'] = 'from-server'

    // dynamically alter body
    res.body = res.body.replace('window.top', 'window.self')
  })
})
```

## With Stubbing

If you pass a `response` to `cy.route2()`, Cypress will stub the response in the request.

### `url` as a string

When passing a String as the `url`, the URL must match *exactly* what you've written. You'll want to use the decoded string and not include any hash encoding (ie. use `@` instead of `%40`).

```javascript
cy.route2('https://localhost:7777/surveys/customer?email=john@doe.com', [
  {
    id: 1,
    name: 'john'
  }
])
```

### `url` as a RegExp

When passing a RegExp as the `url`, the url will be tested against the regular expression and will apply if it passes.

```javascript
cy.route2(/users\/\d+/, { id: 1, name: 'Phoebe' })
```

```javascript
// Application Code
$.get('https://localhost:7777/users/1337', (data) => {
  console.log(data) // => {id: 1, name: "Phoebe"}
})
```

### Response functions

You can also use a function as a response which enables you to add logic and modify properties of the response. The function exposes a `req` object which contains the request as well as a way to `send` with a response.

```javascript
cy.route2('/login', (req) => {
  req.send('Success')
})
```

```javascript
// reply with body and headers
cy.route2('/login', (req) => {
  req.reply('Success', { 'x-new-headers': 'from-server' })
})
```

```javascript
// reply with an object containing more response details
cy.route2('/login', (req) => {
  req.send({
    statusCode: 200,
    body: JSON.stringify({
      some: 'response'
    }),
    headers: {
      'x-new-headers': 'from-server'
    },
    // If `destroySocket` is truthy, Cypress will destroy the connection to the
    // browser and send no response. Useful for simulating a server that is not
    // reachable. Must not be set in combination with other options.
    destroySocket: false
  })
})
```

```javascript
// continue the HTTP response to the browser, including any modifications made to `res`
cy.route2('/login', (req) => {
  req.send()
})
```

### Matching requests and routes

When a request matches any of the following route properties:

- `method`
- `url`
- `auth`
- `path`
- `query`
- `port`
- and so forth

The `RouteMatcher` will respond based on the configuration of that route.

{% note bolt %}
By default, all HTTP methods will be used used to match routes. If you want to stub a route with a specific HTTP method such as `POST` then you {% urlHash 'must be explicit about the method' Arguments %}.
{% endnote %}

### Specify the method

The below example matches all `DELETE` requests to "/users" and stubs a response with an empty JSON object.

```javascript
cy.route2('DELETE', '**/users/*', {})
```

### Making multiple requests to the same route

You can test a route multiple times with unique response objects by using {% url 'aliases' variables-and-aliases#Aliases %} and {% url '`cy.wait()`' wait %}. Each time we use `cy.wait()` for an alias, Cypress waits for the next nth matching request.

```javascript
// Define two HTTP methods on the same route
cy.route2('GET', '/api/blog').as('getBlogPost')
cy.route2('POST', '/api/blog').as('postBlogPost')

cy.get('#search').type('Network Requests with Cypress')
cy.get('#submit').click()

// Wait for the first response to finish
cy.wait('@getBlogPost')
// Wait for the second response to finish
cy.wait('@postBlogPost')

// we responded with 1 beetle item so now we should
// have one result
cy.get('#blog-post-results').should('have.length', 1)
```

### Fixtures

Instead of writing a response inline you can automatically connect a response with a {% url `cy.fixture()` fixture %}.

```javascript
cy.route2('**/posts/*', { fixture: 'logo.png' }).as('getLogo')
cy.route2('**/users', { fixture: 'users/all.json' }).as('getUsers')
cy.route2('**/admin', { fixture: 'users/admin.json' }).as('getAdmin')
```

You may want to define the `cy.route2()` after receiving the fixture and working with its data.

```javascript
cy.fixture('user').then((user) => {
  user.firstName = 'Jane'
  // work with the users array here

  cy.route2('GET', '**/user/123', user)
})

cy.visit('/users')
cy.get('.user').should('include', 'Jane')
```

## Options

### Server redirect

You can simulate a server redirect through the `redirect` method exposed by the handler function.

```javascript
cy.route2('/login', (req) => {
  req.redirect('/register')
})
```

### Simulate delay

You can specify a delay (in ms) before the response is sent to the client.

```javascript
cy.route2('/users', (req) => {
  req.delay(200)
})
```

### Simulate throttle

You can specify the speed at which a response is served at (in kilobytes per second).

```javascript
cy.route2('/users', (req) => {
  req.throttle(3000)
})
```
