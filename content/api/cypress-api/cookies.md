---
title: Cypress.Cookies
---

<Alert type="warning">

⚠️ **`Cypress.Cookies.preserveOnce()` and `Cypress.Cookies.defaults()` are
deprecated in Cypress 9.7.0**. In a future release, support for
`Cypress.Cookies.preserveOnce()` and `Cypress.Cookies.defaults()` will be
removed. Consider using the experimental [`cy.session()`](/api/commands/session)
command instead to cache and restore cookies and other sessions details between
tests.

</Alert>

`Cookies.preserveOnce()` and `Cookies.defaults()` enable you to control Cypress'
cookie behavior.

`Cookies.debug()` enables you to generate logs to the console whenever any
cookies are modified.

Cypress automatically clears all cookies **before** each test to prevent state
from building up.

You can take advantage of `Cypress.Cookies.preserveOnce()` or even preserve
cookies by their name to preserve values across multiple tests. This enables you
to preserve sessions through several tests.

## Syntax

```javascript
Cypress.Cookies.debug(enable, options)
Cypress.Cookies.preserveOnce(names...)
Cypress.Cookies.defaults(options)
```

### Arguments

**<Icon name="angle-right"></Icon> enable** **_(Boolean)_**

Whether cookie debugging should be enabled.

**<Icon name="angle-right"></Icon> names**

Names of cookies to be preserved. Pass an unlimited number of arguments.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Set defaults for all cookies, such as preserving a set of cookies to bypass
being cleared before each test.

## Examples

### Debug

#### Log when cookie values are created, modified or deleted

By turning on debugging, Cypress will automatically generate logs to the console
when it _sets_ or _clears_ cookie values. This is useful to help you understand
how Cypress clears cookies before each test, and is useful to visualize how to
handle preserving cookies in between tests.

```javascript
Cypress.Cookies.debug(true) // now Cypress will log when it alters cookies

cy.clearCookie('foo')
cy.setCookie('foo', 'bar')
```

<DocsImage src="/img/api/cookies/cookies-in-console-log.png" alt="Console log when debugging cookies" ></DocsImage>

#### Turn off verbose debugging output

By default Cypress will log the cookie object which allows you to inspect all of
its properties. However you may not need that level of detail and you can turn
this off.

```javascript
Cypress.Cookies.debug(true, { verbose: false })
```

Now when Cypress logs cookies they will only include the `name` and `value`.

<DocsImage src="/img/api/cookies/debugger-console-log-of-cookies.png" alt="Console log cookies with debug" ></DocsImage>

Debugging will be turned on until you explicitly turn it off.

```javascript
Cypress.Cookies.debug(false) // now debugging is turned off
```

### Preserve Once

#### Preserve cookies through multiple tests

Cypress gives you an interface to automatically preserve cookies for multiple
tests. Cypress automatically clears all cookies before each new test starts by
default.

By clearing cookies before each test you are guaranteed to always start from a
clean state. Starting from a clean state prevents coupling your tests to one
another and prevents situations where mutating something in your application in
one test affects another one downstream.

<Alert type="info">

The most common use case for preserving cookies is to prevent having to log in
to your application before each individual test. This is a problem if the
majority of each test is spent logging in a user.

</Alert>

You can use `Cypress.Cookies.preserveOnce()` to preserve cookies through
multiple tests.

There are _likely_ better ways to do this, but this isn't well documented at the
moment. Every application is different and there is no one-size-fits-all
solution. For the moment, if you're using session-based cookies, this method
will work.

```javascript
describe('Dashboard', () => {
  before(() => {
    // log in only once before any of the tests run.
    // your app will likely set some sort of session cookie.
    // you'll need to know the name of the cookie(s), which you can find
    // in your Resources -> Cookies panel in the Chrome Dev Tools.
    cy.login()
  })

  beforeEach(() => {
    // before each test, we can automatically preserve the
    // 'session_id' and 'remember_token' cookies. this means they
    // will not be cleared before the NEXT test starts.
    //
    // the name of your cookies will likely be different
    // this is an example
    Cypress.Cookies.preserveOnce('session_id', 'remember_token')
  })

  it('displays stats', () => {
    // ...
  })

  it('can do something', () => {
    // ...
  })

  it('opens a modal', () => {
    // ...
  })
})
```

### Defaults

#### Set global default cookies

You can modify the global defaults and preserve a set of Cookies which will
always be preserved across tests.

Any change you make here will take effect immediately for the remainder of every
single test.

<Alert type="info">

::include{file=partials/support-file-configuration.md}

</Alert>

#### `preserve` accepts:

- String
- Array
- RegExp
- Function

#### Preserve String

```javascript
// now any cookie with the name 'session_id' will
// not be cleared before each test runs
Cypress.Cookies.defaults({
  preserve: 'session_id',
})
```

#### Preserve Array

```javascript
// now any cookie with the name 'session_id' or 'remember_token'
// will not be cleared before each test runs
Cypress.Cookies.defaults({
  preserve: ['session_id', 'remember_token'],
})
```

#### Preserve RegExp

```javascript
// now any cookie that matches this RegExp
// will not be cleared before each test runs
Cypress.Cookies.defaults({
  preserve: /session|remember/,
})
```

#### Preserve Function

```javascript
Cypress.Cookies.defaults({
  preserve: (cookie) => {
    // implement your own logic here
    // if the function returns truthy
    // then the cookie will not be cleared
    // before each test runs
  },
})
```

## History

| Version                                       | Changes                                                                                       |
| --------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [9.7.0](/guides/references/changelog#9-7-0)   | Deprecated `preserveOnce` and `defaults`                                                      |
| [5.0.0](/guides/references/changelog#5-0-0)   | Renamed `whitelist` option to `preserve`                                                      |
| [0.16.1](/guides/references/changelog#0-16-1) | `{verbose: false}` option added                                                               |
| [0.16.0](/guides/references/changelog#0-16-0) | Removed support for `Cypress.Cookies.get`, `Cypress.Cookies.set` and `Cypress.Cookies.remove` |
| [0.12.4](/guides/references/changelog#0-12-4) | `Cypress.Cookies` API added                                                                   |

## See also

- [`cy.clearCookie()`](/api/commands/clearcookie)
- [`cy.clearCookies()`](/api/commands/clearcookies)
- [`cy.getCookie()`](/api/commands/getcookie)
- [`cy.getCookies()`](/api/commands/getcookies)
- [`cy.setCookie()`](/api/commands/setcookie)
