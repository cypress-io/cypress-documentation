---
title: visit
---

Visit a remote URL.

{% note warning 'Best Practice' %}
We recommend setting a `baseUrl` when using `cy.visit()`.

Read about {% url 'best practices' best-practices#Setting-a-global-baseUrl %} here.
{% endnote %}

# Syntax

```javascript
cy.visit(url)
cy.visit(url, options)
cy.visit(options)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.visit('http://localhost:3000')    // Yields the window of the remote page
```

## Arguments

**{% fa fa-angle-right %} url** ***(String)***

The URL to visit.

Cypress will prefix the URL with the `baseUrl` configured in your {% url 'network options' configuration#Global %} if you've set one.

**{% fa fa-angle-right %} options** ***(Object)***

Pass in an options object to control the behavior of `cy.visit()`.

Option | Default | Description
--- | --- | ---
`url` | `null` | The URL to visit. Behaves the same as the `url` argument.
`method` | `GET` | The HTTP method to use in the visit. Can be `GET` or `POST`.
`body` | `null` | An optional body to send along with a `POST` request. If it is a string, it will be passed along unmodified. If it is an object, it will be URL encoded to a string and sent with a `Content-Type: application/x-www-urlencoded` header.
`headers` | `{}` | An object that maps HTTP header names to values to be sent along with the request. *Note:* `headers` will only be sent for the initial `cy.visit()` request, not for any subsequent requests.
`log` | `true` | {% usage_options log %}
`auth` | `null` | Adds Basic Authorization headers
`failOnStatusCode` | `true` | Whether to fail on response codes other than `2xx` and `3xx`
`onBeforeLoad` | `function` | Called before your page has loaded all of its resources.
`onLoad` | `function` | Called once your page has fired its load event.
`retryOnStatusCodeFailure` | `false` | Whether Cypress should automatically retry status code errors under the hood
`retryOnNetworkFailure` | `true` | Whether Cypress should automatically retry transient network errors under the hood
`timeout` | {% url `pageLoadTimeout` configuration#Timeouts %} | {% usage_options timeout cy.visit %}

You can also set all `cy.visit()` commands' `pageLoadTimeout` and `baseUrl` globally in {% url 'configuration' configuration %}.

## Yields {% helper_icon yields %}

{% yields sets_subject cy.visit 'yields the `window` object after the page finishes loading' %}

# Examples

## URL

### Visit a local server running on `http://localhost:8000`

`cy.visit()` resolves when the remote page fires its `load` event.

```javascript
cy.visit('http://localhost:8000')
```

## Options

### Change the default timeout

```javascript
// Wait 30 seconds for page 'load' event
cy.visit('/index.html', { timeout: 30000 })
```

### Add basic auth headers

Cypress will automatically apply the right authorization headers if you're attempting to visit an application that requires {% url 'Basic Authentication' https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication %}.

Provide the `username` and `password` in the `auth` object. Then all subsequent requests matching the origin you're testing will have these attached at the network level.

```javascript
cy.visit('https://www.acme.com/', {
  auth: {
    username: 'wile',
    password: 'coyote'
  }
})
```

You can also provide the username and password directly in the URL.

```javascript
// this is the same thing as providing the auth object
cy.visit('https://wile:coyote@www.acme.com')
```

{% note info %}
Cypress will automatically attach this header at the network proxy level, outside of the browser. Therefore you **will not** see this header in the Dev Tools.
{% endnote %}

### Provide an `onBeforeLoad` callback function

`onBeforeLoad` is called as soon as possible, before your page has loaded all of its resources. Your scripts will not be ready at this point, but it's a great hook to potentially manipulate the page.

```javascript
cy.visit('http://localhost:3000/#dashboard', {
  onBeforeLoad: (contentWindow) => {
    // contentWindow is the remote page's window object
  }
})
```

{% note info %}
Check out our example recipes using `cy.visit()`'s `onBeforeLoad` option to:
  - {% url 'Bootstrapping your App' recipes#Server-Communication %}
  - {% url 'Set a token to `localStorage` for login during Single Sign On' recipes#Logging-In %}
  - {% url 'Stub `window.fetch`' recipes#Stubbing-and-spying %}
{% endnote %}

### Provide an `onLoad` callback function

`onLoad` is called once your page has fired its `load` event. All of the scripts, stylesheets, html and other resources are guaranteed to be available at this point.

```javascript
cy.visit('http://localhost:3000/#/users', {
  onLoad: (contentWindow) => {
    // contentWindow is the remote page's window object
    if (contentWindow.angular) {
      // do something
    }
  }
})
```

### Submit a form

To send a request that looks like a user submitting an HTML form, use a `POST` method with a `body` containing the form values:

```javascript
cy.visit({
  url: 'http://localhost:3000/cgi-bin/newsletterSignup',
  method: 'POST',
  body: {
    name: 'George P. Burdell',
    email: 'burdell@microsoft.com'
  }
})
```

# Notes

## Redirects

### Visit will automatically follow redirects

```javascript
// we aren't logged in, so our web server
// redirected us to /login
cy.visit('http://localhost:3000/admin')
cy.url().should('match', /login/)
```

## Protocol

### Protocol can be omitted from common hosts

Cypress automatically prepends the `http://` protocol to common hosts.  If you're not using one of these 3 hosts, then make sure to provide the protocol.

```javascript
cy.visit('localhost:3000') // Visits http://localhost:3000
cy.visit('0.0.0.0:3000')   // Visits http://0.0.0.0:3000
cy.visit('127.0.0.1:3000') // Visits http://127.0.0.1:3000
```

## Web Server

### Cypress can optionally act as your web server

Cypress will automatically attempt to serve your files if you don't provide a host. The path should be relative to your project's root folder (where `cypress.json` is located).

Having Cypress serve your files is useful in simple projects and example apps, but isn't recommended for real apps.  It is always better to run your own server and provide the url to Cypress.

```javascript
cy.visit('app/index.html')
```

## Prefixes

### Visit is automatically prefixed with `baseUrl`.

Configure `baseUrl` in the `cypress.json` file to prevent repeating yourself in every single `cy.visit()` command. Read more about {% url 'configuration' configuration %}.

```json
{
  "baseUrl": "http://localhost:3000/#/"
}
```

```javascript
cy.visit('dashboard') // Visits http://localhost:3000/#/dashboard
```

## Window

### Visit will always yield the remote page's `window` object when it resolves

```javascript
cy.visit('index.html').then((contentWindow) => {
  // contentWindow is the remote page's window object
})
```

## User agent

Trying to change the `User-Agent`? You can set the `userAgent` as a {% url "configuration value" configuration#Browser %} in your configuration file.

## Routing

### Prevent XHR / Ajax requests before a remote page initially loads

One common scenario Cypress supports is visiting a remote page and also preventing any Ajax requests from immediately going out.

You may think this works:

```javascript
// this code may not work depending on implementation
cy.visit('http://localhost:8000/#/app')
cy.server()
cy.route('/users/**', 'fx:users')
```

But if your app makes a request upon being initialized, *the above code will not work*. `cy.visit()` will resolve once its `load` event fires.  The {% url `cy.server()` server %} and {% url `cy.route()` route %} commands are not processed until *after* `cy.visit()` resolves.

Many applications will have already begun routing, initialization, and requests by the time the `cy.visit()` in the above code resolves. Therefore creating a {% url `cy.server()` server %} will happen too late, and Cypress will not process the requests.

Luckily Cypress supports this use case. Reverse the order of the commands:

```javascript
// this code is probably what you want
cy.server()
cy.route('/users/**', {...})
cy.visit('http://localhost:8000/#/app')
```

Cypress will automatically apply the server and routes to the very next `cy.visit()` and does so immediately before any of your application code runs.

# Rules

## Requirements {% helper_icon requirements %}

{% requirements page cy.visit %}

## Assertions {% helper_icon assertions %}

{% assertions wait cy.visit %}

## Timeouts {% helper_icon timeout %}

{% timeouts page cy.visit %}

# Command Log

***Visit example application in a `beforeEach`***

```javascript
beforeEach(function () {
  cy.visit('https://example.cypress.io/commands/viewport')
})
```

The commands above will display in the Command Log as:

{% imgTag /img/api/visit/visit-example-page-in-before-each-of-test.png "Command Log visit" %}

When clicking on `visit` within the command log, the console outputs the following:

{% imgTag /img/api/visit/visit-shows-any-redirect-or-cookies-set-in-the-console.png "console Log visit" %}

{% history %}
{% url "3.3.0" changelog#3-3-0 %} | Added support for options `retryOnStatusCodeFailure` and `retryOnNetworkFailure`
{% url "3.2.0" changelog#3-2-0 %} | Added options `url`, `method`, `body`, and `headers`
{% url "1.1.3" changelog#1-1-3 %} | Added option `failOnStatusCode`
{% url "0.18.2" changelog#0-18-2 %} | Automatically send `Accept: text/html,*/*` request header
{% url "0.18.2" changelog#0-18-2 %} | Automatically send `User-Agent` header
{% url "0.17.0" changelog#0-17-0 %} | Cannot `cy.visit()` two different super domains in a single test
{% url "0.6.8" changelog#0-6-8 %} | Added option `log`
{% url "0.4.3" changelog#0-4-3 %} | Added option `onBeforeLoad`
{% url "< 0.3.3" changelog#0-3.3 %} | `cy.visit()` command added
{% endhistory %}

# See also

- {% url `cy.go()` go %}
- {% url `cy.reload()` reload %}
- {% url `cy.request()` request %}
- {% url "Recipe: Bootstrapping your App" recipes#Server-Communication %}
- {% url "Recipe: Logging In - Single Sign on" recipes#Logging-In %}
- {% url "Recipe: Stubbing `window.fetch`" recipes#Stubbing-and-spying %}
