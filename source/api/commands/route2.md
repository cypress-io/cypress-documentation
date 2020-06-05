---
title: route2
---

Use `cy.route2()` to manage the behavior of network requests at the network layer.

Unlike `cy.route()`, `cy.route2()` can mock all types of network requests (Fetch API, page loads, etc.) in addition to XMLHttpRequests.

{% note danger %}
🚨 **This is an experimental feature. You must explicitly enable it by setting the `experimentalNetworkMocking` configuration option to `true`.** See {% issue 687 %} for more details.
{% endnote %}

# Syntax

```javascript
cy.route2(requestMatcher)
cy.route2(requestMatcher, response)
cy.route2(requestMatcher, handler)
cy.route2(method, requestMatcher)
cy.route2(method, requestMatcher, response)
cy.route2(method, requestMatcher, handler)
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
`auth` | `null` | Match HTTP basic authentication
`headers` | `null` | Match client request headers
`hostname` | `null` | Match based on requested hostname
`method` | `'GET'` | Match based on HTTP method
`path` | `null` | Match on request path after the hostname, including query params
`pathname` | `null` | Match on request path after the hostname, without query params
`port` | `null` | Match based on requested port
`query` | `null` | Match based on querystring parameters
`url` | `null` | Match based on full request URL

**{% fa fa-angle-right %} response** ***(String, Object, Array)***

Supply a response `body` to *stub* in the matching route.

**{% fa fa-angle-right %} method** ***(String)***

Match the route to a specific method (`GET`, `POST`, `PUT`, etc).

{% note bolt %}
If no method is defined Cypress will match `GET` requests by default.
{% endnote %}

**{% fa fa-angle-right %} handler** ***(Function)***

Supply a function to handle this route.

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
cy.route('POST', '**/users').as('postUser')
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
cy.route('**/users/*/comments')

// https://localhost:7777/users/123/comments     <-- matches
// https://localhost:7777/users/123/comments/465 <-- does not match
```

### Use glob to match all segments

```javascript
cy.route('**/posts/**')

// https://localhost:7777/posts/1            <-- matches
// https://localhost:7777/posts/foo/bar/baz  <-- matches
// https://localhost:7777/posts/quuz?a=b&1=2 <-- matches
```

### Modify response

With a request gets passed through, we can still modify the response through a `handler` function.

```javascript
cy.route('/login', (req) => {
  // passing a function to req.reply causes the request to pass through
  // and allows the response from the origin server to be modified

  req.reply((res) => {
    // res.body
    // res.headers
    // res.status

    res.status = 200
    res.headers['x-new-headers'] = 'from-server'

    // dynamically alter body
    res.body = res.body.replace('window.top', 'window.self')
  })
})
```
