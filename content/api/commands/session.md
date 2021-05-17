---
title: session
---

Use the `session` command to preserve the browser's state between tests. Once the steps to establish a session are performed, the session can be restored at a later time without executing those steps again.

<!--
Technically it's more the application's state or state *stored* in the browser. The tricky thing here is that we're only preserving cookies and local storage, so saying that we're saving "application state" is misleading. And kind of a bummer because it would be awesome if we did. For now we have app actions for that. Saying that this is a checkpoint or snapshot in time is also similarly ambiguous and misleading.
-->

A session is persisted by a browser's cookies, [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) and [`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

When your front-end application makes a request and the response contains a `Set-Cookie` header, the browser sets that value as a cookie (or multiple cookies).
Alternatively, your application may store a value (from a response, user input, etc.) in browser storage (`localStorage` or `sessionStorage`).
Either way, this persisted data is used by your application and therefore affects its behavior.

For example, if access to a page or application route requires authentication and a user were to navigate to that route, the application will look for some kind of authentication data persisted in the browser (like a session key) first. If the data doesn't exist, the user would encounter an error or be navigated to the route to authenticate (like a _Sign In_ page). Once the user signs in, the required authentication information is persisted in the browser and the user can navigate as expected.

Other examples of state persisted in the browser:

- information about the currently authenticated user
  - permissions
  - feature toggles
  - location
  - user behavior
- settings that dictate how your application should appear or behave
  - language
  - currency
  - color scheme
  - accessibility features
  - other UI preferences
- form data

## Usage & Syntax

A session must be first be defined:

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

### Setup Function

The contents of `setupFn` should be the steps to generate the session you want to preserve for later use. You can generate a session through the front-end UI or through a backend service or API.

## Examples

### Defining a Session

```js
cy.session(
  'Adam',
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

## SessionOptions

### `validate` (`Function`)

Data can become invalidated over time. For example, a user may only be authenticated for a finite duration after which the user must authenticate again. This expiration or invalidation can result in flaky tests. To remedy this, Cypress invokes `validate` on the session before using it. If the session is valid (`validate` returns `true`), then it will be used as is. Otherwise, if the session is invalid (`validate` returns `false`), then Cypress will execute the setup function first.

### `exclude` (`object`)

By default, Cypress preserves cookies and local storage _in their entirety_ when the setup function executes. If data needs to be excluded, you can specify it in the `cookies` or `localStorage` property accordingly.
An exclusion can be expressed as either an `object`, `string` or `RegExp`. You can specify an array of exclusions or just one.

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

## Dashboard

A new concept!
Just like the Command Log section, show how this is represented in the Dashboard

## Notes

## Rules

## See Also

- [`Cypress.Cookies`](/api/cypress-api/cookies)
- [`clearCookie`](/api/commands/clearcookie)
- [`clearCookies`](/api/commands/clearcookies)
- [`getCookie`](/api/commands/getcookie)
- [`getCookies`](/api/commands/getcookies)
- [`setCookie`](/api/commands/setcookie)
- `clearLocalStorage`(/api/commands/clearlocalstorage)
