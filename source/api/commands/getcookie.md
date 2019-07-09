---
title: getCookie
---

Get a browser cookie by its name.

# Syntax

```javascript
cy.getCookie(name)
cy.getCookie(name, options)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.getCookie('auth_key')     // Get cookie with name 'auth_key'
```

## Arguments

**{% fa fa-angle-right %} name** ***(String)***

The name of the cookie to get. Required.

**{% fa fa-angle-right %} options** ***(Object)***

Pass in an options object to change the default behavior of `cy.getCookie()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`timeout` | {% url `responseTimeout` configuration#Timeouts %} | {% usage_options timeout cy.getCookie %}

## Yields {% helper_icon yields %}

`cy.getCookie()` yields a cookie object with the following properties:

- `name`
- `value`
- `path`
- `domain`
- `httpOnly`
- `secure`
- `expiry`

### When a cookie matching the name could not be found:

`cy.getCookie()` yields `null`.

# Examples

## Session id

### Get `session_id` cookie after logging in

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
        'my-token-x': cookie.value
      }
    })
  })
```

### Using `cy.getCookie()` to test logging in

{% note info %}
Check out our example recipes using `cy.getCookie()` to test {% url 'logging in using HTML web forms' recipes#Logging-In %}, {% url 'logging in using XHR web forms' recipes#Logging-In %} and {% url 'logging in with single sign on' recipes#Logging-In %}
{% endnote %}

# Rules

## Requirements {% helper_icon requirements %}

{% requirements parent cy.getCookie %}

## Assertions {% helper_icon assertions %}

{% assertions once cy.getCookie %}

## Timeouts {% helper_icon timeout %}

{% timeouts automation cy.getCookie %}

# Command Log

```javascript
cy.getCookie('fakeCookie1').should('have.property', 'value', '123ABC')
```

The commands above will display in the Command Log as:

{% imgTag /img/api/getcookie/get-browser-cookie-and-make-assertions-about-object.png "Command Log getcookie" %}

When clicking on `getCookie` within the command log, the console outputs the following:

{% imgTag /img/api/getcookie/inspect-cookie-object-properties-in-console.png "Console Log getcookie" %}

# See also

- {% url `cy.clearCookie()` clearcookie %}
- {% url `cy.clearCookies()` clearcookies %}
- {% url 'Cypress Cookies API' cookies %}
- {% url `cy.getCookies()` getcookies %}
- {% url `cy.setCookie()` setcookie %}
