---
title: setCookie
---

Set a browser cookie.

## Syntax

```javascript
cy.setCookie(name, value)
cy.setCookie(name, value, options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.setCookie('auth_key', '123key') // Set the 'auth_key' cookie to '123key'
```

### Arguments

**<Icon name="angle-right"></Icon> name** **_(String)_**

The name of the cookie to set.

**<Icon name="angle-right"></Icon> value** **_(String)_**

The value of the cookie to set.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `cy.setCookie()`.

| Option     | Default                                                        | Description                                                                                                                                                                                                           |
| ---------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `log`      | `true`                                                         | Displays the command in the [Command log](/guides/core-concepts/test-runner#Command-Log)                                                                                                                              |
| `domain`   | `window.location.hostname`                                     | The domain the cookie is visible to                                                                                                                                                                                   |
| `expiry`   | 20 years into the future                                       | When the cookie expires, specified in seconds since [Unix Epoch](https://en.wikipedia.org/wiki/Unix_time).                                                                                                            |
| `httpOnly` | `false`                                                        | Whether the cookie is an HTTP only cookie                                                                                                                                                                             |
| `path`     | `/`                                                            | The cookie path                                                                                                                                                                                                       |
| `secure`   | `false`                                                        | Whether the cookie is a secure cookie                                                                                                                                                                                 |
| `timeout`  | [`responseTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `cy.setCookie()` to resolve before [timing out](#Timeouts)                                                                                                                                           |
| `sameSite` | `undefined`                                                    | Cookie's SameSite value. If set, should be one of `lax`, `strict`, or `no_restriction`. Pass `undefined` to use the browser's default. Note: `no_restriction` can only be used if the `secure` flag is set to `true`. |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

`cy.setCookie()` yields a cookie object with the following properties:

- `domain`
- `expiry` _(if specified)_
- `httpOnly`
- `name`
- `path`
- `sameSite` _(if specified)_
- `secure`
- `value`

## Examples

### Name Value

#### Set a cookie

<!-- cspell:ignore sufh,aaiidhf -->

```javascript
cy.getCookies().should('be.empty')
cy.setCookie('session_id', '189jd09sufh33aaiidhf99d09')
cy.getCookie('session_id').should(
  'have.property',
  'value',
  '189jd09sufh33aaiidhf99d09'
)
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

- `cy.setCookie()` requires being chained off of `cy`.

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

- `cy.setCookie()` will only run assertions you have chained once, and will not
  [retry](/guides/core-concepts/retry-ability).

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

- `cy.setCookie()` should never time out.

<Alert type="warning">

Because `cy.setCookie()` is asynchronous it is technically possible for there to
be a timeout while talking to the internal Cypress automation APIs. But for
practical purposes it should never happen.

</Alert>

## Command Log

```javascript
cy.getCookies().should('be.empty')
cy.setCookie('fakeCookie1', '123ABC')
cy.getCookie('fakeCookie1').should('have.property', 'value', '123ABC')
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/setcookie/set-cookie-on-browser-for-testing.png" alt="Command Log setcookie" ></DocsImage>

When clicking on `setCookie` within the command log, the console outputs the
following:

<DocsImage src="/img/api/setcookie/see-cookie-properties-expiry-domain-and-others-in-test.png" alt="Console Log setcookie" ></DocsImage>

## History

| Version                                       | Changes                                                                                                                                          |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| [5.0.0](/guides/references/changelog#5-0-0)   | Removed `experimentalGetCookiesSameSite` and made `sameSite` property always available.                                                          |
| [4.3.0](/guides/references/changelog#4-3-0)   | Added `sameSite` property when the [experimentalGetCookiesSameSite](/guides/references/configuration#Experiments) configuration value is `true`. |
| [0.16.0](/guides/references/changelog#0-16-0) | `cy.setCookie()` command added                                                                                                                   |

## See also

- [`cy.clearCookie()`](/api/commands/clearcookie)
- [`cy.clearCookies()`](/api/commands/clearcookies)
- [Cypress Cookies API](/api/cypress-api/cookies)
- [`cy.getCookie()`](/api/commands/getcookie)
- [`cy.getCookies()`](/api/commands/getcookies)
