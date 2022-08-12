---
title: visit
e2eSpecific: true
---

Visit a remote URL.

<Alert type="warning">

<strong class="alert-header">Best Practice</strong>

We recommend setting a `baseUrl` when using `cy.visit()`.

Read about
[best practices](/guides/references/best-practices#Setting-a-global-baseUrl)
here.

</Alert>

## Syntax

```javascript
cy.visit(url)
cy.visit(url, options)
cy.visit(options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.visit('/') // visits the baseUrl
cy.visit('index.html') // visits the local file "index.html" if baseUrl is null
cy.visit('http://localhost:3000') // specify full URL if baseUrl is null or the domain is different the baseUrl
cy.visit({
  url: '/pages/hello.html',
  method: 'GET',
})
```

### Arguments

**<Icon name="angle-right"></Icon> url** **_(String)_**

The URL to visit.

Cypress will prefix the URL with the `baseUrl` configured in your
[global configuration](/guides/references/configuration#Global) if set.

If the `baseUrl` has not been set, you will need to specify a fully qualified
URL or Cypress will attempt to act as your web server. See the
[prefixes notes](#Prefixes) for more details.

**Note:** visiting a new domain requires the Cypress window to reload. You
cannot visit different super domains in a single test.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to control the behavior of `cy.visit()`.

By default, the `cy.visit()` commands' will use the `pageLoadTimeout` and
`baseUrl` set globally in your
[configuration](/guides/references/configuration#Global).

| Option                     | Default                                                        | Description                                                                                                                                                                                                                              |
| -------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `url`                      | `null`                                                         | The URL to visit. This value will be appended to the `baseUrl` if one is configured. Behaves the same as the `url` argument.                                                                                                             |
| `method`                   | `GET`                                                          | The HTTP method to use in the visit. Can be `GET` or `POST`.                                                                                                                                                                             |
| `body`                     | `null`                                                         | An optional body to send along with a `POST` request. If it is a string, it will be passed along unmodified. If it is an object, it will be URL encoded to a string and sent with a `Content-Type: application/x-www-urlencoded` header. |
| `headers`                  | `{}`                                                           | An object that maps HTTP header names to values to be sent along with the request. _Note:_ `headers` will only be sent for the initial `cy.visit()` request, not for any subsequent requests.                                            |
| `qs`                       | `null`                                                         | Query parameters to append to the `url` of the request                                                                                                                                                                                   |
| `log`                      | `true`                                                         | Displays the command in the [Command log](/guides/core-concepts/cypress-app#Command-Log)                                                                                                                                                 |
| `auth`                     | `null`                                                         | Adds Basic Authorization headers                                                                                                                                                                                                         |
| `failOnStatusCode`         | `true`                                                         | Whether to fail on response codes other than `2xx` and `3xx`                                                                                                                                                                             |
| `onBeforeLoad`             | `function`                                                     | Called before your page has loaded all of its resources.                                                                                                                                                                                 |
| `onLoad`                   | `function`                                                     | Called once your page has fired its load event.                                                                                                                                                                                          |
| `retryOnStatusCodeFailure` | `false`                                                        | Whether Cypress should automatically retry status code errors under the hood. Cypress will retry a request up to 4 times if this is set to true.                                                                                         |
| `retryOnNetworkFailure`    | `true`                                                         | Whether Cypress should automatically retry transient network errors under the hood. Cypress will retry a request up to 4 times if this is set to true.                                                                                   |
| `timeout`                  | [`pageLoadTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `cy.visit()` to resolve before [timing out](#Timeouts) Note: Network requests are limited by the underlying operating system, and may still time out if this value is increased.                                        |

You can also set all `cy.visit()` commands' `pageLoadTimeout` and `baseUrl`
globally in the [Cypress configuration](/guides/references/configuration).

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`cy.visit()` yields the `window` object after the page finishes
loading</li></List>

Let's confirm the `window.navigator.language` after visiting the site:

```javascript
cy.visit('/') // yields the window object
  .its('navigator.language') // yields window.navigator.language
  .should('equal', 'en-US') // asserts the expected value
```

## Examples

### URL

#### Visit a local server running on `http://localhost:8000`

`cy.visit()` resolves when the remote page fires its `load` event.

```javascript
cy.visit('http://localhost:8000')
```

### Options

#### Change the default timeout

Overrides the `pageLoadTimeout` set globally in your
[configuration](/guides/references/configuration) for this page load.

```javascript
// Wait 30 seconds for page 'load' event
cy.visit('/index.html', { timeout: 30000 })
```

#### Add basic auth headers

Cypress will automatically apply the right authorization headers if you're
attempting to visit an application that requires
[Basic Authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication).

Provide the `username` and `password` in the `auth` object. Then all subsequent
requests matching the origin you're testing will have these attached at the
network level.

```javascript
cy.visit('https://www.acme.com/', {
  auth: {
    username: 'wile',
    password: 'coyote',
  },
})
```

You can also provide the username and password directly in the URL.

```javascript
// this is the same thing as providing the auth object
cy.visit('https://wile:coyote@www.acme.com')
```

<Alert type="info">

Cypress will automatically attach this header at the network proxy level,
outside of the browser. Therefore you **will not** see this header in the Dev
Tools.

</Alert>

#### Provide an `onBeforeLoad` callback function

`onBeforeLoad` is called as soon as possible, before your page has loaded all of
its resources. Your scripts will not be ready at this point, but it's a great
hook to potentially manipulate the page.

```javascript
cy.visit('http://localhost:3000/#dashboard', {
  onBeforeLoad: (contentWindow) => {
    // contentWindow is the remote page's window object
  },
})
```

<Alert type="info">

Check out our example recipes using `cy.visit()`'s `onBeforeLoad` option to:

- [Bootstrapping your App](/examples/examples/recipes#Server-Communication)
- [Set a token to `localStorage` for login during Single Sign On](/examples/examples/recipes#Logging-In)
- [Stub `window.fetch`](/examples/examples/recipes#Stubbing-and-spying)

</Alert>

#### Provide an `onLoad` callback function

`onLoad` is called once your page has fired its `load` event. All of the
scripts, stylesheets, html and other resources are guaranteed to be available at
this point.

```javascript
cy.visit('http://localhost:3000/#/users', {
  onLoad: (contentWindow) => {
    // contentWindow is the remote page's window object
    if (contentWindow.angular) {
      // do something
    }
  },
})
```

#### Add query parameters

You can provide query parameters as an object to `cy.visit()` by passing `qs` to
`options`.

```js
// visits http://localhost:3500/users?page=1&role=admin
cy.visit('http://localhost:3500/users', {
  qs: {
    page: '1',
    role: 'admin',
  },
})
```

The parameters passed to `qs` will be merged into existing query parameters on
the `url`.

```js
// visits http://example.com/users?page=1&admin=true
cy.visit('http://example.com/users?page=1', {
  qs: { admin: true },
})
```

#### Submit a form

To send a request that looks like a user submitting an HTML form, use a `POST`
method with a `body` containing the form values:

```javascript
cy.visit({
  url: 'http://localhost:3000/cgi-bin/newsletterSignup',
  method: 'POST',
  body: {
    name: 'George P. Burdell',
    email: 'burdell@microsoft.com',
  },
})
```

## Notes

### Prefixes

#### Visit is automatically prefixed with `baseUrl`

Cypress will prefix the URL with the `baseUrl` if it has been set. Configure
`baseUrl` in the [Cypress configuration](/guides/references/configuration) to
prevent repeating yourself in every `cy.visit()` command.

:::cypress-config-example

```js
{
  e2e: {
    baseUrl: 'http://localhost:3000/#/'
  }
}
```

:::

```javascript
cy.visit('dashboard') // Visits http://localhost:3000/#/dashboard
```

If you would like to visit a different host when the `baseUrl` has been set,
provide the fully qualified URL you would like to go to.

```javascript
cy.visit('http://google.com')
```

#### Visit local files

Cypress will automatically attempt to serve your files if you don't provide a
host and `baseUrl` **is not defined**. The path should be relative to your
project's root folder (the directory that contains the
[Cypress configuration file](/guides/references/configuration)).

Having Cypress serve your files is useful in smaller projects and example apps,
but isn't recommended for production apps. It is always better to run your own
server and provide the url to Cypress.

```javascript
cy.visit('app/index.html')
```

##### Visit local file when `baseUrl` is set

If you have `baseUrl` set, but need to visit a local file in a single test or a
group of tests, disable the `baseUrl` using
[per-test configuration](/guides/references/configuration#Test-Configuration).
Imagine this Cypress configuration:

:::cypress-config-example

```js
{
  e2e: {
    baseUrl: 'https://example.cypress.io'
  }
}
```

:::

The first test visits the `baseUrl`, while the second test visits the local
file.

```javascript
it('visits base url', () => {
  cy.visit('/')
  cy.contains('h1', 'Kitchen Sink')
})
it('visits local file', { baseUrl: null }, () => {
  cy.visit('index.html')
  cy.contains('local file')
})
```

### Redirects

#### Visit will automatically follow redirects

```javascript
// we aren't logged in, so our web server
// redirected us to /login
cy.visit('http://localhost:3000/admin')
cy.url().should('match', /login/)
```

### Protocol

#### Protocol can be omitted from common hosts

Cypress automatically prepends the `http://` protocol to common hosts. If you're
not using one of these 3 hosts, then make sure to provide the protocol.

```javascript
cy.visit('localhost:3000') // Visits http://localhost:3000
cy.visit('0.0.0.0:3000') // Visits http://0.0.0.0:3000
cy.visit('127.0.0.1:3000') // Visits http://127.0.0.1:3000
```

### Window

#### Visit will always yield the remote page's `window` object when it resolves

```javascript
cy.visit('index.html').then((contentWindow) => {
  // contentWindow is the remote page's window object
})
```

### User agent

Trying to change the `User-Agent`? You can set the `userAgent` as a
[configuration value](/guides/references/configuration#Browser) in your
configuration file.

### Routing

#### Prevent requests before a remote page initially loads

One common scenario Cypress supports is visiting a remote page and also
preventing any Ajax requests from immediately going out.

You may think this works:

```javascript
// this code may not work depending on implementation
cy.visit('http://localhost:8000/#/app')
cy.intercept('/users/**', { fixture: 'users' })
```

But if your app makes a request upon being initialized, _the above code will not
work_. `cy.visit()` will resolve once its `load` event fires. The
[`cy.intercept()`](/api/commands/intercept) command is not processed until
_after_ `cy.visit()` resolves.

Many applications will have already begun routing, initialization, and requests
by the time the `cy.visit()` in the above code resolves. Therefore creating a
[`cy.intercept()`](/api/commands/intercept) route will happen too late, and
Cypress will not process the requests.

Luckily Cypress supports this use case. Reverse the order of the commands:

```javascript
// this code is probably what you want
cy.intercept('/users/**', {...})
cy.visit('http://localhost:8000/#/app')
```

Cypress will automatically apply the routes to the very next `cy.visit()` and
does so immediately before any of your application code runs.

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`cy.visit()` requires being chained off of `cy`.</li><li>`cy.visit()`
requires the response to be `content-type: text/html`.</li><li>`cy.visit()`
requires the response code to be `2xx` after following
redirects.</li><li>`cy.visit()` requires the load `load` event to eventually
fire.</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`cy.visit()` will automatically wait for assertions you have chained
to pass</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`cy.visit()` can time out waiting for the page to fire its `load`
event.</li><li>`cy.visit()` can time out waiting for assertions you've added to
pass.</li></List>

## Command Log

**_Visit example application in a `beforeEach`_**

```javascript
beforeEach(() => {
  cy.visit('https://example.cypress.io/commands/viewport')
})
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/visit/visit-example-page-in-before-each-of-test.png" alt="Command Log visit" ></DocsImage>

When clicking on `visit` within the command log, the console outputs the
following:

<DocsImage src="/img/api/visit/visit-shows-any-redirect-or-cookies-set-in-the-console.png" alt="console Log visit" ></DocsImage>

## History

| Version                                       | Changes                                                                          |
| --------------------------------------------- | -------------------------------------------------------------------------------- |
| [3.5.0](/guides/references/changelog#3-5-0)   | Added support for options `qs`                                                   |
| [3.3.0](/guides/references/changelog#3-3-0)   | Added support for options `retryOnStatusCodeFailure` and `retryOnNetworkFailure` |
| [3.2.0](/guides/references/changelog#3-2-0)   | Added options `url`, `method`, `body`, and `headers`                             |
| [1.1.3](/guides/references/changelog#1-1-3)   | Added option `failOnStatusCode`                                                  |
| [0.18.2](/guides/references/changelog#0-18-2) | Automatically send `Accept: text/html,*/*` request header                        |
| [0.18.2](/guides/references/changelog#0-18-2) | Automatically send `User-Agent` header                                           |
| [0.17.0](/guides/references/changelog#0-17-0) | Cannot `cy.visit()` two different super domains in a single test                 |
| [0.6.8](/guides/references/changelog#0-6-8)   | Added option `log`                                                               |
| [0.4.3](/guides/references/changelog#0-4-3)   | Added option `onBeforeLoad`                                                      |
| [< 0.3.3](/guides/references/changelog#0-3.3) | `cy.visit()` command added                                                       |

## See also

- [`cy.go()`](/api/commands/go)
- [`cy.reload()`](/api/commands/reload)
- [`cy.request()`](/api/commands/request)
- [Recipe: Bootstrapping your App](/examples/examples/recipes#Server-Communication)
- [Recipe: Logging In - Single Sign on](/examples/examples/recipes#Logging-In)
- [Recipe: Stubbing `window.fetch`](/examples/examples/recipes#Stubbing-and-spying)
