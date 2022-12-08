---
title: getCookies
---

Get browser cookies for the current domain or the specified domain.

## Syntax

```javascript
cy.getCookies()
cy.getCookies(options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.getCookies() // Get cookies for the currrent domain
```

### Arguments

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `cy.getCookies()`.

| Option    | Default                                                        | Description                                                                              |
| --------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `domain`  | Hostname of the current URL                                    | Retrieves the cookies from the specified domain                                          |
| `log`     | `true`                                                         | Displays the command in the [Command log](/guides/core-concepts/cypress-app#Command-Log) |
| `timeout` | [`responseTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `cy.getCookies()` to resolve before [timing out](#Timeouts)             |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

`cy.getCookies()` yields an array of cookie objects. Each cookie object has the
following properties:

- `domain`: _(String)_
- `expiry`: _(Number)_ _(if specified)_
- `httpOnly`: _(Boolean)_
- `name`: _(String)_
- `path`: _(String)_
- `sameSite`: _(String)_ _(if specified)_
- `secure`: _(Boolean)_
- `value`: _(String)_

`cy.getCookies()` is not a query. It will not update the returned list if
further cookies are added after it initially executes.

## Examples

### Get Cookies

#### Get cookies after logging in

In this example, on first login our server sends us back a session cookie.

```javascript
// assume we just logged in
cy.contains('Login').click()
cy.url().should('include', 'profile')
cy.getCookies()
  .should('have.length', 1)
  .then((cookies) => {
    expect(cookies[0]).to.have.property('name', 'session_id')
  })
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

- `cy.getCookies()` requires being chained off of `cy`.

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

- `cy.getCookies()` will only run assertions you have chained once, and will not
  [retry](/guides/core-concepts/retry-ability).

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

- `cy.getCookies()` should never time out.

<Alert type="warning">

Because `cy.getCookies()` is asynchronous it is technically possible for there
to be a timeout while talking to the internal Cypress automation APIs. But for
practical purposes it should never happen.

</Alert>

## Command Log

```javascript
cy.getCookies()
  .should('have.length', 1)
  .then((cookies) => {
    expect(cookies[0]).to.have.property('name', 'fakeCookie1')
    expect(cookies[0]).to.have.property('value', '123ABC')
    expect(cookies[0]).to.have.property('domain')
    expect(cookies[0]).to.have.property('httpOnly')
    expect(cookies[0]).to.have.property('path')
    expect(cookies[0]).to.have.property('secure')
  })
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/getcookies/get-browser-cookies-and-inspect-all-properties.png" alt="Command Log getcookies" ></DocsImage>

When clicking on `getCookies` within the command log, the console outputs the
following:

<DocsImage src="/img/api/getcookies/test-application-cookies.png" alt="Console Log getcookies" ></DocsImage>

## History

| Version                                     | Changes                                                                                                                                          |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| [5.0.0](/guides/references/changelog#5-0-0) | Removed `experimentalGetCookiesSameSite` and made `sameSite` property always available.                                                          |
| [4.3.0](/guides/references/changelog#4-3-0) | Added `sameSite` property when the [experimentalGetCookiesSameSite](/guides/references/configuration#Experiments) configuration value is `true`. |

## See also

- [`cy.clearCookie()`](/api/commands/clearcookie)
- [`cy.clearCookies()`](/api/commands/clearcookies)
- [Cypress Cookies API](/api/cypress-api/cookies)
- [`cy.getCookie()`](/api/commands/getcookie)
- [`cy.setCookie()`](/api/commands/setcookie)
