---
title: session
---

This command is pretty much all you need.

#### What's a Session?

A session is the state of your application that can be persisted by a browser's cookies and [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage). The "state" of your application can be

- information about the current authenticated user
  - authentication key
  - session key
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

##### Define the Session

```js
cy.session(name, setupFn, sessionOptions)
```

##### Use the (Previously Defined) Session

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

`setupFn` is the function that, when executed, updates the browser's local storage, cookies, or both, with data that Cypress can preserve so you can use the session again later without having to re-authenticate again - unless it's no longer valid (see [Validate]()).

#### <Icon name="angle-right"></Icon> sessionOptions (`SessionOptions`)

`sessionOptions` contains two properties:

- `validate` (`Function`)
  - returns `true`: The session is valid and will be used.
  - returns `false`: Cypress will execute the `setupFn` to generate a new session to use.
- `exclude` (`object`) - contains properties `cookies` and `localStorage` for specifying items that you don't want Cypress to preserve.

See [SessionOptions]()

### Yields

`session` yields session data (`SessionData`), which is an `object` with properties `cookies` and `localStorage`. See [SessionData]().

## Examples

## SessionOptions

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

## Notes

## Rules

## See Also
