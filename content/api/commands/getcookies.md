---
title: getCookies
---

Get all of the browser cookies.

## Syntax

```javascript
cy.getCookies();
cy.getCookies(options);
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.getCookies(); // Get all cookies
```

### Arguments

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `cy.getCookies()`.

| Option    | Default                                                        | Description                                                                              |
| --------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `log`     | `true`                                                         | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log) |
| `timeout` | [`responseTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `cy.getCookies()` to resolve before [timing out](#Timeouts)             |

### Yields [<Icon name="question-circle"/>](introduction-to-cypress#Subject-Management)

`cy.getCookies()` yields an array of cookie objects. Each cookie object has the following properties:

- `domain`
- `expiry` _(if specified)_
- `httpOnly`
- `name`
- `path`
- `sameSite` _(if specified)_
- `secure`
- `value`

## Examples

### Get Cookies

#### Get cookies after logging in

In this example, on first login our server sends us back a session cookie.

```javascript
// assume we just logged in
cy.contains("Login").click();
cy.url().should("include", "profile");
cy.getCookies()
  .should("have.length", 1)
  .then((cookies) => {
    expect(cookies[0]).to.have.property("name", "session_id");
  });
```

## Rules

### Requirements [<Icon name="question-circle"/>](introduction-to-cypress#Chains-of-Commands)

<List><li>`cy.getCookies()` requires being chained off of `cy`.</li></List>

### Assertions [<Icon name="question-circle"/>](introduction-to-cypress#Assertions)

<List><li>`cy.getCookies` will only run assertions you have chained once, and will not [retry](/guides/core-concepts/retry-ability).</li></List>

### Timeouts [<Icon name="question-circle"/>](introduction-to-cypress#Timeouts)

<List><li>`cy.getCookies()` should never time out.</li><li><Alert type="warning">

Because `cy.getCookies()` is asynchronous it is technically possible for there to be a timeout while talking to the internal Cypress automation APIs. But for practical purposes it should never happen.

</Alert></li></List>

## Command Log

```javascript
cy.getCookies()
  .should("have.length", 1)
  .then((cookies) => {
    expect(cookies[0]).to.have.property("name", "fakeCookie1");
    expect(cookies[0]).to.have.property("value", "123ABC");
    expect(cookies[0]).to.have.property("domain");
    expect(cookies[0]).to.have.property("httpOnly");
    expect(cookies[0]).to.have.property("path");
    expect(cookies[0]).to.have.property("secure");
  });
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/getcookies/get-browser-cookies-and-inspect-all-properties.png" alt="Command Log getcookies" ></DocsImage>

When clicking on `getCookies` within the command log, the console outputs the following:

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
