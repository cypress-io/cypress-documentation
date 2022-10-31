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
- It adds the concept of
  [`testIsolation`](/guides/core-concepts/writing-and-organizing-tests#Test-Isolation)
  which defaults to `on`, such that:
  - The page is cleared (by setting it to `about:blank`).
  - Cookies, local storage and session storage in all domains are cleared.
- It supersedes the
  [`Cypress.Cookies.preserveOnce()`](/api/cypress-api/cookies#Preserve-Once) and
  [`Cypress.Cookies.defaults()`](/api/cypress-api/cookies#Defaults) methods.
- Cross-origin requests will now succeed, however, to interact with a
  cross-origin page you must use a `cy.origin` block.

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
