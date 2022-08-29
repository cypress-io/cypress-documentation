---
title: request
---

Make an HTTP request.

## Syntax

```javascript
cy.request(url)
cy.request(url, body)
cy.request(method, url)
cy.request(method, url, body)
cy.request(options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.request('http://dev.local/seed')
```

### Arguments

**<Icon name="angle-right"></Icon> url** **_(String)_**

The URL to make the request to.

If you do not provide a fully qualified domain name (FQDN) URL, Cypress will
make its best guess as to which host you want `cy.request()` to use in the URL.

1. If you make a `cy.request()` after visiting a page, Cypress assumes the URL
   used for the `cy.visit()` is the host.

```javascript
cy.visit('http://localhost:8080/app')
cy.request('users/1.json') //  URL is  http://localhost:8080/users/1.json
```

2. If you make a `cy.request()` prior to visiting a page, Cypress assumes the
   host is the `baseUrl` property configured inside of of your
   [configuration file](/guides/references/configuration).

:::cypress-config-example

```js
{
  e2e: {
    baseUrl: 'http://localhost:1234'
  }
}
```

:::

```javascript
cy.request('seed/admin') // URL is http://localhost:1234/seed/admin
```

3. If Cypress cannot determine the host it will throw an error.

**<Icon name="angle-right"></Icon> body** **_(String, Object)_**

A request `body` to be sent in the request. Cypress sets the `Accepts` request
header and serializes the response body by the `encoding` option.

**<Icon name="angle-right"></Icon> method** **_(String)_**

Make a request using a specific method. If no method is defined, Cypress uses
the `GET` method by default.

Supported methods include:

- `GET`
- `POST`
- `PUT`
- `DELETE`
- `PATCH`
- `HEAD`
- `OPTIONS`
- `TRACE`
- `COPY`
- `LOCK`
- `MKCOL`
- `MOVE`
- `PURGE`
- `PROPFIND`
- `PROPPATCH`
- `UNLOCK`
- `REPORT`
- `MKACTIVITY`
- `CHECKOUT`
- `MERGE`
- `M-SEARCH`
- `NOTIFY`
- `SUBSCRIBE`
- `UNSUBSCRIBE`
- `SEARCH`
- `CONNECT`

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `cy.request()`.

You can also set options for `cy.request()`'s `baseUrl` and `responseTimeout`
globally in [configuration](/guides/references/configuration).

| Option                     | Default                                                        | Description                                                                                                                                                                                              |
| -------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `log`                      | `true`                                                         | Displays the command in the [Command log](/guides/core-concepts/cypress-app#Command-Log)                                                                                                                 |
| `url`                      | `null`                                                         | The URL to make the request to                                                                                                                                                                           |
| `method`                   | `GET`                                                          | The HTTP method to use in the request                                                                                                                                                                    |
| `auth`                     | `null`                                                         | Adds Authorization headers. [Accepts these options.](https://github.com/request/request#http-authentication)                                                                                             |
| `body`                     | `null`                                                         | Body to send along with the request                                                                                                                                                                      |
| `failOnStatusCode`         | `true`                                                         | Whether to fail on response codes other than `2xx` and `3xx`                                                                                                                                             |
| `followRedirect`           | `true`                                                         | Whether to automatically follow redirects                                                                                                                                                                |
| `form`                     | `false`                                                        | Whether to convert the `body` values to URL encoded content and set the `x-www-form-urlencoded` header                                                                                                   |
| `encoding`                 | `utf8`                                                         | The encoding to be used when serializing the response body. The following encodings are supported: `ascii`, `base64`, `binary`, `hex`, `latin1`, `utf8`, `utf-8`, `ucs2`, `ucs-2`, `utf16le`, `utf-16le` |
| `gzip`                     | `true`                                                         | Whether to accept the `gzip` encoding                                                                                                                                                                    |
| `headers`                  | `null`                                                         | Additional headers to send; Accepts object literal                                                                                                                                                       |
| `qs`                       | `null`                                                         | Query parameters to append to the `url` of the request                                                                                                                                                   |
| `retryOnStatusCodeFailure` | `false`                                                        | Whether Cypress should automatically retry status code errors under the hood. Cypress will retry a request up to 4 times if this is set to true.                                                         |
| `retryOnNetworkFailure`    | `true`                                                         | Whether Cypress should automatically retry transient network errors under the hood. Cypress will retry a request up to 4 times if this is set to true.                                                   |
| `timeout`                  | [`responseTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `cy.request()` to resolve before [timing out](#Timeouts)                                                                                                                                |

You can also set options for `cy.request()`'s `baseUrl` and `responseTimeout`
globally in the [Cypress configuration](/guides/references/configuration).

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

`cy.request()` yields the `response` as an object literal containing properties
such as:

- `status`
- `body`
- `headers`
- `duration`

## Examples

### URL

#### Make a `GET` request

`cy.request()` is great for talking to an external endpoint before your tests to
seed a database.

```javascript
beforeEach(() => {
  cy.request('http://localhost:8080/db/seed')
})
```

#### Issue an HTTP request

Sometimes it's quicker to test the contents of a page rather than
[`cy.visit()`](/api/commands/visit) and wait for the entire page and all of its
resources to load.

```javascript
cy.request('/admin').its('body').should('include', '<h1>Admin</h1>')
```

### Method and URL

#### Send a `DELETE` request

```javascript
cy.request('DELETE', 'http://localhost:8888/users/827')
```

#### Alias the request using [.as()](/api/commands/as)

```javascript
cy.request('https://jsonplaceholder.cypress.io/comments').as('comments')

cy.get('@comments').should((response) => {
  expect(response.body).to.have.length(500)
  expect(response).to.have.property('headers')
  expect(response).to.have.property('duration')
})
```

### Method, URL, and Body

#### Send a `POST` request with a JSON body

```javascript
cy.request('POST', 'http://localhost:8888/users/admin', { name: 'Jane' }).then(
  (response) => {
    // response.body is automatically serialized into JSON
    expect(response.body).to.have.property('name', 'Jane') // true
  }
)
```

### Options

#### Request a page while disabling auto redirect

To test the redirection behavior of a login without a session, `cy.request` can
be used to check the `status` and `redirectedToUrl` property.

The `redirectedToUrl` property is a special Cypress property that normalizes the
URL the browser would normally follow during a redirect.

```javascript
cy.request({
  url: '/dashboard',
  followRedirect: false, // turn off following redirects
}).then((resp) => {
  // redirect status code is 302
  expect(resp.status).to.eq(302)
  expect(resp.redirectedToUrl).to.eq('http://localhost:8082/unauthorized')
})
```

#### Download a PDF file

By passing the `encoding: binary` option, the `response.body` will be serialized
binary content of the file. You can use this to access various file types via
`.request()` like `.pdf`, `.zip`, or `.doc` files.

```javascript
cy.request({
  url: 'http://localhost:8080/some-document.pdf',
  encoding: 'binary',
}).then((response) => {
  cy.writeFile('path/to/save/document.pdf', response.body, 'binary')
})
```

#### Get Data URL of an image

By passing the `encoding: base64` option, the `response.body` will be
base64-encoded content of the image. You can use this to construct a
[Data URI](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)
for use elsewhere.

```javascript
cy.request({
  url: 'https://docs.cypress.io/img/logo.png',
  encoding: 'base64',
}).then((response) => {
  const base64Content = response.body
  const mime = response.headers['content-type'] // or 'image/png'
  // see https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
  const imageDataUrl = `data:${mime};base64,${base64Content}`
})
```

#### HTML form submissions using form option

Oftentimes, once you have a proper e2e test around logging in, there's no reason
to continue to `cy.visit()` the login and wait for the entire page to load all
associated resources before running any other commands. Doing so can slow down
our entire test suite.

Using `cy.request()`, we can bypass all of this because it automatically gets
and sets cookies as if the requests had come from the browser.

```javascript
cy.request({
  method: 'POST',
  url: '/login_with_form', // baseUrl is prepend to URL
  form: true, // indicates the body should be form urlencoded and sets Content-Type: application/x-www-form-urlencoded headers
  body: {
    username: 'jane.lane',
    password: 'password123',
  },
})

// to prove we have a session
cy.getCookie('cypress-session-cookie').should('exist')
```

#### Using `cy.request()` for HTML Forms

<Alert type="info">

[Check out our example recipe using `cy.request()` for HTML web forms](/examples/examples/recipes#Logging-In)

</Alert>

### Request Polling

#### Call `cy.request()` over and over again

This is useful when you're polling a server for a response that may take awhile
to complete.

All we're really doing here is creating a recursive function. Nothing more
complicated than that.

```js
// a regular ol' function folks
function req () {
  cy
    .request(...)
    .then((resp) => {
      // if we got what we wanted

      if (resp.status === 200 && resp.body.ok === true)
        // break out of the recursive loop
        return

      // else recurse
      req()
    })
}

cy
  // do the thing causing the side effect
  .get('button').click()

  // now start the requests
  .then(req)

```

## Notes

### Debugging

#### Request is not displayed in the Network Tab of Developer Tools

Cypress does not _actually_ make an XHR request from the browser. We are
actually making the HTTP request from Cypress (in Node). So, you won't see the
request inside of your Developer Tools.

### CORS

#### CORS is bypassed

Normally when the browser detects a cross-origin HTTP request, it will send an
`OPTIONS` preflight check to ensure the server allows cross-origin requests, but
`cy.request()` bypasses CORS entirely.

```javascript
// we can make requests to any external server, no problem.
cy.request('https://www.google.com/webhp?#q=cypress.io+cors')
  .its('body')
  .should('include', 'Testing, the way it should be') // true
```

### Cookies

#### Cookies are automatically sent and received

Before sending the HTTP request, we automatically attach cookies that would have
otherwise been attached had the request come from the browser. Additionally, if
a response has a `Set-Cookie` header, these are automatically set back on the
browser cookies.

In other words, `cy.request()` transparently performs all of the underlying
functions as if it came from the browser.

### [`cy.intercept()`](/api/commands/intercept), [`cy.server()`](/api/commands/server), and [`cy.route()`](/api/commands/route)

#### `cy.request()` sends requests to actual endpoints, bypassing those defined using `cy.route()` or `cy.intercept()`

`cy.server()` and any configuration passed to
[`cy.server()`](/api/commands/server) has no effect on `cy.request()`.

The intention of `cy.request()` is to be used for checking endpoints on an
actual, running server without having to start the front end application.

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`cy.request()` requires being chained off of
`cy`.</li><li>`cy.request()` requires that the server sends a
response.</li><li>`cy.request()` requires that the response status code be `2xx`
or `3xx` when `failOnStatusCode` is `true`.</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`cy.request()` will only run assertions you have chained once, and
will not [retry](/guides/core-concepts/retry-ability).</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`cy.request()` can time out waiting for the server to
respond.</li></List>

## Command Log

**_Request comments endpoint and test response_**

```javascript
cy.request('https://jsonplaceholder.typicode.com/comments').then((response) => {
  expect(response.status).to.eq(200)
  expect(response.body).to.have.length(500)
  expect(response).to.have.property('headers')
  expect(response).to.have.property('duration')
})
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/request/testing-request-url-and-its-response-body-headers.png" alt="Command Log request" ></DocsImage>

When clicking on `request` within the command log, the console outputs the
following:

<DocsImage src="/img/api/request/console-log-request-response-body-headers-status-url.png" alt="Console Log request" ></DocsImage>

## History

| Version                                     | Changes                                                                                                                                                                                                                                                                    |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [4.7.0](/guides/references/changelog#3-3-0) | Added support for `encoding` option.                                                                                                                                                                                                                                       |
| [3.3.0](/guides/references/changelog#3-3-0) | Added support for options `retryOnStatusCodeFailure` and `retryOnNetworkFailure`.                                                                                                                                                                                          |
| [3.2.0](/guides/references/changelog#3-2-0) | Added support for any valid HTTP `method` argument including `TRACE`, `COPY`, `LOCK`, `MKCOL`, `MOVE`, `PURGE`, `PROPFIND`, `PROPPATCH`, `UNLOCK`, `REPORT`, `MKACTIVITY`, `CHECKOUT`, `MERGE`, `M-SEARCH`, `NOTIFY`, `SUBSCRIBE`, `UNSUBSCRIBE`, `SEARCH`, and `CONNECT`. |

## See also

- [`cy.exec()`](/api/commands/exec)
- [`cy.task()`](/api/commands/task)
- [`cy.visit()`](/api/commands/visit)
- [Recipe: Logging In - Single Sign on](/examples/examples/recipes#Logging-In)
- [Recipe: Logging In - HTML Web Form](/examples/examples/recipes#Logging-In)
- [Recipe: Logging In - XHR Web Form](/examples/examples/recipes#Logging-In)
- [Recipe: Logging In - CSRF Tokens](/examples/examples/recipes#Logging-In)
