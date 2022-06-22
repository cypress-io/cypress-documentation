---
title: getCookie
---

Get a browser cookie by its name.

## Syntax

```javascript
cy.getCookie(name)
cy.getCookie(name, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.getCookie('auth_key') // Get cookie with name 'auth_key'
```

### Arguments

**<Icon name="angle-right"></Icon> name** **_(String)_**

The name of the cookie to get. Required.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `cy.getCookie()`.

| Option    | Default                                                        | Description                                                                              |
| --------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `log`     | `true`                                                         | Displays the command in the [Command log](/guides/core-concepts/cypress-app#Command-Log) |
| `timeout` | [`responseTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `cy.getCookie()` to resolve before [timing out](#Timeouts)              |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

`cy.getCookie()` yields a cookie object with the following properties:

- `domain`
- `expiry` _(if specified)_
- `httpOnly`
- `name`
- `path`
- `sameSite` _(if specified)_
- `secure`
- `value`

#### When a cookie matching the name could not be found:

`cy.getCookie()` yields `null`.

## Examples

### Session id

#### Get `session_id` cookie after logging in

In this example, on first login, our server sends us back a session cookie.

```javascript
// assume we just logged in
cy.contains('Login').click()
cy.url().should('include', 'profile')
// retries until cookie with value=189jd09su
// is found or default command timeout ends
cy.getCookie('session_id')
  .should('have.property', 'value', '189jd09su')
  .then((cookie) => {
    // cookie is an object with "domain", "name" and other properties
  })
```

You can check the cookie existence without comparing any of its properties

```javascript
cy.getCookie('my-session-cookie').should('exist')
```

If you need the cookie value, for example to use in a subsequent call

```js
let cookie

cy.getCookie('session_id')
  .should('exist')
  .then((c) => {
    // save cookie until we need it
    cookie = c
  })

// some time later, force the "cy.request"
// to run ONLY after the cookie has been set
// by placing it inside ".then"
cy.get('#submit')
  .click()
  .then(() => {
    cy.request({
      url: '/api/admin',
      headers: {
        'my-token-x': cookie.value,
      },
    })
  })
```

#### Using `cy.getCookie()` to test logging in

<Alert type="info">

Check out our example recipes using `cy.getCookie()` to test
[logging in using HTML web forms](/examples/examples/recipes#Logging-In),
[logging in using XHR web forms](/examples/examples/recipes#Logging-In) and
[logging in with single sign on](/examples/examples/recipes#Logging-In)

</Alert>

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

- `cy.getCookie()` requires being chained off of `cy`.

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

- `cy.getCookie()` will only run assertions you have chained once, and will not
  [retry](/guides/core-concepts/retry-ability).

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

- `cy.getCookie()` should never time out.

<Alert type="warning">

Because `cy.getCookie()` is asynchronous it is technically possible for there to
be a timeout while talking to the internal Cypress automation APIs. But for
practical purposes it should never happen.

</Alert>

## Command Log

```javascript
cy.getCookie('fakeCookie1').should('have.property', 'value', '123ABC')
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/getcookie/get-browser-cookie-and-make-assertions-about-object.png" alt="Command Log getcookie" ></DocsImage>

When clicking on `getCookie` within the command log, the console outputs the
following:

<DocsImage src="/img/api/getcookie/inspect-cookie-object-properties-in-console.png" alt="Console Log getcookie" ></DocsImage>

## History

| Version                                     | Changes                                                                                            |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| [5.0.0](/guides/references/changelog#5-0-0) | Removed `experimentalGetCookiesSameSite` and made `sameSite` property always available.            |
| [4.3.0](/guides/references/changelog#4-3-0) | Added `sameSite` property when the `experimentalGetCookiesSameSite` configuration value is `true`. |

## See also

- [`cy.clearCookie()`](/api/commands/clearcookie)
- [`cy.clearCookies()`](/api/commands/clearcookies)
- [Cypress Cookies API](/api/cypress-api/cookies)
- [`cy.getCookies()`](/api/commands/getcookies)
- [`cy.setCookie()`](/api/commands/setcookie)
