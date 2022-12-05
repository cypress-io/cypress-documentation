---
title: Cypress.session
---

`Cypress.session` is a collection of async session-related helper methods
intended to be used alongside the [`cy.session()`](/api/commands/session)
command.

## Syntax

```javascript
// Clear all sessions, include cached global sessions, saved on the backend.
Cypress.session.clearAllSavedSessions()
// Clear all storage and cookie date across all origins associated with the current session.
Cypress.session.clearCurrentSessionData()
// Get all storage and cookie date across all origins associated with the current session.
Cypress.session.getCurrentSessionData()
// Get all storage and cookie date saved on the backend associated with the provided session id.
Cypress.session.getSession(id)
```

Clearing all session and automatically re-running the spec
`Cypress.session.clearAllSavedSessions()` can also be done by clicking the
"Clear All Sessions" button in the
[Sessions Instrument Panel](/api/commands/session#The-Instrument-Panel).

<DocsImage src="/img/api/session/sessions-panel.png" alt="Sessions Instrument Panel" ></DocsImage>

### Arguments

**<Icon name="angle-right"></Icon> id** **_(String)_**

The name of the session whom's data storage and cookie date you'd like to
retrieve.

## Examples

### Clearing the all session data

By default, Cypress will clear the current session data **before** each test
when `testIsolation` is enabled. However, to you can remove all cached session
data with `Cypress.session.clearAllSavedSessions()`.

```js
Cypress.session.clearAllSavedSessions()
```

### Clearing the current session data when testIsolation is disabled

By default, Cypress will clear the current session data **before** each test
when `testIsolation` is enabled. If you have disabled `testIsolation` for a
suite, it can be helpful to clear the current session data in a `before()` block
to ensure the suite started in a clean test slate.

```js
describe('Dashboard', { testIsolation: false }, () => {
  before(() => {
    // ensure clean test slate for these tests
    cy.then(Cypress.session.clearCurrentSessionData)
  })
})
```

### Verified the Applied Session Data

To check all cookies, localStorage and sessionStorage that was applied after
`cy.session()` completes. You can use `Cypress.session.getCurrentSessionData()`.
This can be helpful for quickly analyzing the current browser context while
writing you `cy.session()` command.

Since this is an all-in-one helper of the `cy.getAllCookies()`,
`cy.getAllLocalStorage()` and `cy.getAllSessionStorage()` commands, we generally
recommend leverage the commands for asserting the correct session data has been
applied in the session validation.

```js
it('debug session', () => {
    cy.session('id', () => {
        ...
    })
    cy.then(async () => {
        const sessionData = await Cypress.session.getCurrentSessionData()
        cy.debug()s
    })
})
```

### Debugging Cached Session Data

If your session seems to be recreated more than expected, or doesn't seem to be
applying the cookies, `localStorage` or `sessionStorage` data that you'd expect,
you can use `Cypress.session.getSession(id)` to view what session data has been
cached by `cy.session()`. If you are missing any data, your setup and/or
validate function may not be waiting long enough for all attributes to be
applied to there page before the `cy.session()` command saves and finishes.

```js
it('debug session', () => {
    cy.session('id', () => {
        ...
    })
    cy.then(async () => {
        const sessionData = await Cypress.session.getSession('id')
        cy.debug()
    })
})
```

## See also

- [`cy.session()`](/api/commands/session)
