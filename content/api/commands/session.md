---
title: session
---

Use the `session` command to preserve and restore sessions between tests. A session consists of [cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies), [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), and [`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

Applications use session data to keep track of:

- information about the currently authenticated user (permissions, feature toggles, location, user behavior, etc.)
- settings that dictate how your application should appear or behave (language, currency, color scheme, accessibility features, other UI preferences, etc.)
- user inputs (form data, settings, etc.)

With `session`, once the steps required to establish a session are performed, the session can be restored at a later time without executing those steps again.

<Alert type="warning">

Cypress clears cookies, `sessionStorage`, and `localStorage` between tests. A clean slate ensures that tests don't affect one another.

</Alert>

## Usage & Syntax

A session must first be defined:

##### **Define the Session**

```js
cy.session(name, setupFn, sessionOptions)
```

Once defined, it can be used later:

##### **Use the (Previously Defined) Session**

```js
cy.session(name)
```

### Correct Usage

```js
cy.session(
  'Peter Pan',
  () => {
    // code to generate a session goes here
  },
  {
    validate: () => {
      // code that returns `true` if the session is still valid
    },
    exclude: {
      cookies: [
        // cookies to exclude
      ],
      localStorage: [
        // local storage items to exclude
      ],
    },
  }
)
```

### Arguments

#### <Icon name="angle-right"></Icon> name (`string`)

`name` is the name you would like to refer to this session as. This could be the name of the user or type of user you're defining or using - like "Adam" or "Administrator".

#### <Icon name="angle-right"></Icon> setupFn (`Function`)

`setupFn` is the function that, when executed, updates the browser's storage, cookies, or both, with data that Cypress can preserve so you can use the session again later without having to execute again - unless it's no longer valid (see [Validate]()).

#### <Icon name="angle-right"></Icon> sessionOptions (`SessionOptions`)

`sessionOptions` contains two properties:

- `validate` (`Function`)
  - returns `true`: The session is valid and will be used.
  - returns `false`: Cypress will execute the `setupFn` to generate a new session to use.
- `exclude` (`object`) - contains properties `cookies` and `localStorage` for specifying items that you don't want Cypress to preserve.

See [SessionOptions]()

### Yields

`session` yields session data (`SessionData`), which is an `object` with properties `cookies` and `localStorage`. See [SessionData](#sessiondata).

## Examples

### Define a Session

#### Name & Setup Function

The `name` should represent the kind of session you're defining. For example, if you're setting up a session for a user with read-only permissions, then you might choose the name "read-only".
The contents of `setupFn` should be the steps to generate the session you want to preserve for later use.

```js
cy.session('read-only', () => { signIn('Adam', 'Pa$$w0Rd') })

function signIn(username, password) {
  cy.intercept('POST', '/api/auth').as('signIn')
  cy.visit('/sign-in')
  cy.get('.username').type(username)
  cy.get('.password').type(password)
  cy.contains('.button', 'Sign In').click()
  cy.wait('@signIn')
})
```

#### SessionOptions

The third and last argument you can optionally pass to `session` is `SessionOptions`.

### `validate` (`Function`)

```js
cy.session(
  'read-only',
  () => {
    signIn('Adam', 'Pa$$w0Rd')
  },
  {
    validate: () => {
      return cy.request('GET', '/api/profile').should((xhr) => {
        expect(xhr.status).to.equal(200)
      })
    },
  }
)
```

Sessions can become invalidated over time. For example, a user may only be authenticated for a finite duration after which the user must authenticate again. This expiration or invalidation can result in flaky tests. To remedy this, Cypress invokes `validate` on the session before using it. If the session is valid (`validate` returns `true`), then it will be used as is. Otherwise, if the session is invalid (`validate` returns `false`), then Cypress will execute the setup function first.

### `exclude` (`object`)

By default, Cypress preserves cookies and browser storage _in their entirety_ when the setup function executes. If data needs to be excluded, you can specify it in the `cookies` or `localStorage` property accordingly.

```js
cy.session(
  'read-only',
  () => {
    signIn('Adam', 'Pa$$w0Rd')
  },
  {
    exclude: {
      cookies: [],
      localStorage: [],
    },
  }
)
```

An exclusion can be expressed as either an `object`, `string` or `RegExp`. You can specify an array of exclusions or just one.

```js
{
  cookies: {
    domain: 'yahoo.com'
  }
}
```

```js
{
  cookies: [
    {
      domain: 'yahoo.com',
    },
    'domain=google.com',
  ]
}
```

#### `cookies` (`sessionExcludeFilterCookies`)

```ts
type sessionExcludeFilterCookies =
  | {
      domain?: string | RegExp
      name?: string | RegExp
    }
  | string
  | RegExp
```

```js
{
  localStorage: {
    origin: 'myapp.com',
    key: 'xstate-store'
  }
}
```

#### `localStorage` (`sessionExcludeFilterLocalStorage`)

```ts
type sessionExcludeFilterLocalStorage =
  | {
      origin?: string | RegExp
      key?: string | RegExp
    }
  | string
  | RegExp
```

## SessionData

`SessionData` is the [subject]() yielded by `session`. The `object` contains two properties - `cookies` and `localStorage`

### Cookie Object

`cookies` is an array of `Cookie` objects containing the following properties:

| Key        | Type             | Description                                                                   |
| ---------- | ---------------- | ----------------------------------------------------------------------------- |
| `name`     | `string`         | name of the cookie                                                            |
| `value`    | `string`         | value of the cookie                                                           |
| `path`     | `string`         | path of the cookie                                                            |
| `domain`   | `string`         | domain the cookie belongs to                                                  |
| `httpOnly` | `boolean`        | cookie is inaccessible to client-side scripts                                 |
| `secure`   | `boolean`        | cookie scope is limited to secure channels (typically HTTPS)                  |
| `expiry`   | `number`         | cookie expiration date ([Unix time](https://en.wikipedia.org/wiki/Unix_time)) |
| `sameSite` | `SameSiteStatus` | SameSite state of the cookie (`no_restriction`, `strict` or `lax`)            |

This is the same type of object yielded by [`getCookies`](/api/commands/getcookies).
Those properties are derived from the JavaScript Browser APIs: Chrome [`Network.Cookie`](https://chromedevtools.github.io/devtools-protocol/tot/Network/#type-Cookie) and Firefox [`cookies.Cookie`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/cookies/Cookie).

### LocalStorageData Object

`localStorage` is an array of `LocalStorageData` objects containing the following properties:

| Key      | Type     | Description |
| -------- | -------- | ----------- |
| `origin` | `string` | origin      |
| `value`  | `object` | value       |

## Command Log

### Session Definition(s)

### Failed Validation

### Session Usage

## Notes

When your front-end application makes a request and the response contains a `Set-Cookie` header, the browser sets that value as a cookie (or multiple cookies).
Alternatively, your application may store a value (from a response, user input, etc.) in browser storage (`localStorage` or `sessionStorage`).
Either way, this persisted data is used by your application and therefore affects its behavior.

For example, if access to a page or application route requires authentication and a user were to navigate to that route, the application will look for some kind of authentication data persisted in the browser (like a session key) first. If the data doesn't exist, the user would encounter an error or be navigated to the route to authenticate (like a _Sign In_ page). Once the user signs in, the required authentication information is persisted in the browser and the user can navigate as expected.

## Rules

## See Also

- [`Cypress.Cookies`](/api/cypress-api/cookies)
- [`cy.clearCookie()`](/api/commands/clearcookie)
- [`cy.clearCookies()`](/api/commands/clearcookies)
- [`cy.getCookie()`](/api/commands/getcookie)
- [`cy.getCookies()`](/api/commands/getcookies)
- [`cy.setCookie()`](/api/commands/setcookie)
- [`cy.clearLocalStorage()`](/api/commands/clearlocalstorage)
