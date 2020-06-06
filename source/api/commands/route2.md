---
title: route2
---

Use `cy.route2()` to manage the behavior of network requests at the network layer.

Unlike {% url `cy.route()` route %}, `cy.route2()` can mock all types of network requests (Fetch API, page loads, etc.) in addition to XMLHttpRequests. With `cy.route2()`, there is no need to define a {% url `cy.server()` server %} before use.

{% note danger %}
🚨 **This is an experimental feature. You must explicitly enable it by setting the `experimentalNetworkMocking` configuration option to `true`.** See {% issue 687 %} for more details.
{% endnote %}

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

Listen for a route matching a specific URL or pattern.

Pass in an object to match additional properties of the route.

Option | Default | Description
--- | --- | ---
`auth` | `null` | Object with a `username` and `password` to match HTTP basic authentication
`headers` | `null` | Object to match client request headers
`hostname` | `null` | String, RegExp, or Glob to match based on requested hostname
`method` | `'ALL'` | Match based on HTTP method (`GET`. `POST`, `PUT`, etc.)
`path` | `null` | String, RegExp, or Glob to match on request path after the hostname, including query params
`pathname` | `null` | String, RegExp, or Glob to match on request path after the hostname, without query params
`port` | `null` | Match based on requested port number
`query` | `null` | Object to match based on query parameters
`url` | `null` | String, RegExp, or Glob to match based on full request URL

**{% fa fa-angle-right %} response** ***(String, Object, Array, Function)***

Supply a response `body` to *stub* in the matching route. You can also supply a function to modify properties of the request and response.

**{% fa fa-angle-right %} method** ***(String)***

Match the route to a specific method (`GET`, `POST`, `PUT`, etc).

{% note bolt %}
If no method is defined Cypress will match `ALL` requests by default.
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

Before a request gets passed through, we can modify the request before it is sent out through a function. The function exposes a `req` object which contains the request.

```javascript
cy.route2('/users', (req) => {
  // modify the headers or body
  req.headers = {...req.headers, accept: 'application/json'}
  req.body = {...req.body, foo: 'bar'}

  // delay the request
  req.delay(100)
  // split delay between server and client
  req.delay(100, 200)
  // or
  req.delay({
    client: 100,
    server: 200
  })

  // throttle the response
  req.throttle('3G')
})
```

### Modify response

After a request that gets passed through, we can modify the response from the server before it is returned through a function. The function exposes a `req` object which contains the request. The `req.reply()` function exposes a `res` object which contains the response.

```javascript
cy.route2('/users', (req) => {
  // passing a function to req.reply causes the request to pass through
  // and allows the response from the origin server to be modified
  req.reply((res) => {
    res.status = 200
    res.headers['x-new-headers'] = 'from-server'

    // dynamically alter body
    res.body = res.body.replace('window.top', 'window.self')
  })
})
```

## With Stubbing

If you pass a `response` to `cy.route()`, Cypress will stub the response in the request.

### `url` as a string

When passing a `string` as the `url`, the URL must match *exactly* what you've written. You'll want to use the decoded string and not include any hash encoding (ie. use `@` instead of `%40`).

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

You can also use a function as a response which enables you to add logic and modify properties of the response. The function exposes a `req` object which contains the request as well as a way to `reply` with a response.

```javascript
cy.route2('/login', (req) => {
  // reply with status code
  req.reply(200)

  // reply with status code and body
  req.reply(200, { some: 'response' })

  // reply with status code, body and headers
  req.reply(200, { some: 'response' }, { 'x-new-headers': 'from-server' })

  // reply with body
  req.reply({
    some: 'response'
  })

  // reply with status code, body and headers
  req.reply({
    status: 200,
    body: {
      some: 'response'
    },
    headers: {
      'x-new-headers': 'from-server'
    }
  })

  // redirect the request
  req.redirect('/register')
})
```

### Matching requests and routes

Any request that matches the `method` and `url` of a route will be responded to based on the configuration of that route.

{% note bolt %}
By default, all HTTP methods will be used used to match routes. If you want to stub a route with a specific HTTP method such as `POST` then you {% urlHash 'must be explicit about the method' Arguments %}.
{% endnote %}

### Specify the method

The below example matches all `DELETE` requests to "/users" and stubs a response with an empty JSON object.

```javascript
cy.route2('DELETE', '**/users/*', {})
```
