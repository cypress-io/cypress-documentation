---
title: Cypress.Server
---

<Alert type="warning">

⚠️ **`cy.server()` and `cy.route()` are deprecated in Cypress 6.0.0**. In a
future release, support for `cy.server()` and `cy.route()` will be moved to a
plugin. Consider using [`cy.intercept()`](/api/commands/intercept.html) instead.
See our guide on
[Migrating `cy.route()` to `cy.intercept()`](/guides/references/migration-guide.html#Migrating-cy-route-to-cy-intercept)

</Alert>

Permanently change the default options for all
[`cy.server()`](/api/commands/server) instances

## Syntax

```javascript
Cypress.Server.defaults(options)
```

### Arguments

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `Cypress.Server`.

## Examples

### Options

**These options will be the new defaults.**

```javascript
// pass anything here you'd normally pass to cy.server().
Cypress.Server.defaults({
  delay: 500,
  force404: false,
  ignore: (xhr) => {
    // handle custom logic for filtering XHR requests
  },
})
```

## Notes

**Where to put server configuration**

A great place to put this configuration is in your `cypress/support/index.js`
file, since it is loaded before any test files are evaluated.

## See also

- [`cy.server()`](/api/commands/server)
