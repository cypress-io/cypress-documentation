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

## Examples

## SessionOptions

## SessionData

## Notes

## Rules

## See Also
