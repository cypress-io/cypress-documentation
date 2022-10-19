---
title: Cypress.session
---

`Cypress.session` is a collection of session-related helper methods intended to
be used alongside the [`cy.session()`](/api/commands/session) command.

<Alert type="warning">

<strong class="alert-header"><Icon name="exclamation-triangle"></Icon>
Experimental</strong>

The `session` API is currently experimental, and can be enabled by setting the
[`experimentalSessionAndOrigin`](/guides/references/experiments) option to
`true` in the Cypress config.

Enabling this flag does the following:

- It adds the `cy.session()` and [`cy.origin()`](/api/commands/origin) commands,
  and [`Cypress.session`](/api/cypress-api/session) API.
- It adds the following new behaviors (that will be the default in a future
  major update of Cypress) at the beginning of each test:
  - The
    [`testIsolation`](/guides/core-concepts/writing-and-organizing-tests#Test-Isolation)
    mode is enhanced from `legacy` mode to `on` mode such that
    - The page is cleared (by setting it to `about:blank`).
    - All active session data (cookies, `localStorage` and `sessionStorage`)
      across all domains are cleared.
- It overrides the
  [`Cypress.Cookies.preserveOnce()`](/api/cypress-api/cookies#Preserve-Once) and
  [`Cypress.Cookies.defaults()`](/api/cypress-api/cookies#Defaults) methods.
- Cross-origin navigation will no longer fail immediately, but instead, time out
  based on [`pageLoadTimeout`](/guides/references/configuration#Timeouts).
- Tests will no longer wait on page loads before moving on to the next test.

Because the page is cleared at the beginning of each test by default,
[`cy.visit()`](/api/commands/visit) must be explicitly called at the beginning
of each test.

</Alert>

## Syntax

Clear all saved sessions and re-run the current spec file.

```javascript
Cypress.session.clearAllSavedSessions()
```

This can also be done by clicking the "Clear All Sessions" button in the
[Sessions Instrument Panel](/api/commands/session#The-Instrument-Panel).

<DocsImage src="/img/api/session/sessions-panel.png" alt="Sessions Instrument Panel" ></DocsImage>

## See also

- [`cy.session()`](/api/commands/session)
