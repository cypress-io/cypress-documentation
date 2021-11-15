---
title: clearCookies
---

Clear all browser cookies for current domain and subdomain.

<Alert type="warning">

Cypress automatically clears all cookies _before_ each test to prevent state
from being shared across tests. You shouldn't need to use this command unless
you're using it to clear a specific cookie inside a single test.

</Alert>

## Syntax

```javascript
cy.clearCookies()
cy.clearCookies(options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.clearCookies() // clear all cookies
```

### Arguments

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `cy.clearCookies()`.

| Option    | Default                                                        | Description                                                                              |
| --------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `log`     | `true`                                                         | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |
| `timeout` | [`responseTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `cy.clearCookies()` to resolve before [timing out](#Timeouts)           |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`cy.clearCookies()` yields `null`.</li><li>`cy.clearCookies()` cannot
be chained further.</li></List>

## Examples

### No Args

#### Clear all cookies after logging in

In this example, on first login our server sends us back a session cookie. After
invoking `cy.clearCookies()` this clears the session cookie, and upon navigating
to an unauthorized page, our server should have redirected us back to login.

```javascript
// assume we just logged in
cy.contains('Login').click()
cy.url().should('include', 'profile')
cy.clearCookies()
cy.visit('/dashboard') // we should be redirected back to login
cy.url().should('include', 'login')
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

- `cy.clearCookies()` requires being chained off of `cy`.

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

- `cy.clearCookies()` cannot have any assertions chained.

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

- `cy.clearCookies()` should never time out.

<Alert type="warning">

Because `cy.clearCookies()` is asynchronous it is technically possible for there
to be a timeout while talking to the internal Cypress automation APIs. But for
practical purposes it should never happen.

</Alert>

## Command Log

**_Clear cookies after getting cookies_**

```javascript
cy.getCookies().should('have.length', 1)
cy.clearCookies()
cy.getCookies().should('be.empty')
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/clearcookies/clear-all-cookies-in-cypress-tests.png" alt="Command Log" ></DocsImage>

When clicking on `clearCookies` within the command log, the console outputs the
following:

<DocsImage src="/img/api/clearcookies/inspect-cleared-cookies-in-console.png" alt="Console Log" ></DocsImage>

## See also

- [`cy.clearCookie()`](/api/commands/clearcookie)
- [Cypress Cookies API](/api/cypress-api/cookies)
- [`cy.getCookie()`](/api/commands/getcookie)
- [`cy.getCookies()`](/api/commands/getcookies)
- [`cy.setCookie()`](/api/commands/setcookie)
