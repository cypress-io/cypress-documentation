---
title: session
---

This command is pretty much all you need.

What is a session?

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

## Notes

## Rules

## See Also
