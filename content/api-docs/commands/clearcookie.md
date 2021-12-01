---
title: clearCookie
---

Clear a specific browser cookie.

<Alert type="warning">

Cypress automatically clears all cookies _before_ each test to prevent state
from being shared across tests. You shouldn't need to use this command unless
you're using it to clear all cookies inside a single test.

</Alert>

## Syntax

```javascript
cy.clearCookie(name)
cy.clearCookie(name, options)
```

### Usage

**<Icon name="check-circle" color="green"/> Correct Usage**

```javascript
cy.clearCookie('authId') // clear the 'authId' cookie
```

### Arguments

**<Icon name="angle-right"/> name** **_(String)_**

The name of the cookie to be cleared.

**<Icon name="angle-right"/> options** **_(Object)_**

Pass in an options object to change the default behavior of `cy.clearCookie()`.

| Option    | Default                                                        | Description                                                                              |
| --------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `log`     | `true`                                                         | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |
| `timeout` | [`responseTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `cy.clearCookie()` to resolve before [timing out](#Timeouts)            |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`cy.clearCookie()` yields `null`.</li><li>`cy.clearCookie()` cannot be
chained further.</li></List>

## Examples

### No Args

#### Clear a cookie after logging in

In this example, on first login, our server sends us back a session cookie.
After invoking `cy.clearCookie('session_id')`, this clears the session cookie.
Then upon navigating to an unauthorized page, we asset that our server has
redirected us back to login.

```javascript
// assume we just logged in
cy.contains('Login').click()
cy.url().should('include', 'profile')
cy.clearCookie('session_id')
cy.visit('/dashboard') // we should be redirected back to login
cy.url().should('include', 'login')
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

- `cy.clearCookie()` requires being chained off of `cy`.

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

- `cy.clearCookie()` cannot have any assertions chained.

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

- `cy.clearCookie()` should never time out.

<Alert type="warning">

Because `cy.clearCookie()` is asynchronous it is technically possible for there
to be a timeout while talking to the internal Cypress automation APIs. But for
practical purposes it should never happen.

</Alert>

## Command Log

**_Clearing a cookie after setting a cookie_**

```javascript
cy.setCookie('foo', 'bar')
cy.clearCookie('foo')
cy.getCookie('foo').should('be.null')
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/clearcookie/clear-cookie-in-browser-tests.png" alt="Command Log for clearcookie" />

When clicking on `clearCookie` within the command log, the console outputs the
following:

<DocsImage src="/img/api/clearcookie/cleared-cookie-shown-in-console.png" alt="console.log for clearcookie" />

## See also

- [`cy.clearCookies()`](/api/commands/clearcookies)
- [`cy.clearLocalStorage()`](/api/commands/clearlocalstorage)
- [Cypress Cookies API](/api/cypress-api/cookies)
- [`cy.getCookie()`](/api/commands/getcookie)
- [`cy.getCookies()`](/api/commands/getcookies)
- [`cy.setCookie()`](/api/commands/setcookie)
