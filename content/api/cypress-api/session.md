---
title: Cypress.session
---

`Cypress.session` is a collection of session-related helper methods intended to
be used alongside the [`cy.session()`](/api/commands/session) command.

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
