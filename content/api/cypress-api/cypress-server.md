---
title: Cypress.Server
---

<Alert type="warning">

⚠️ **`cy.server()` and `cy.route()` are deprecated in Cypress 6.0.0**. In a
future release, support for `cy.server()` and `cy.route()` will be removed.
Consider using [`cy.intercept()`](/api/commands/intercept) instead. See our
guide on
[Migrating `cy.route()` to `cy.intercept()`](/guides/references/migration-guide#Migrating-cy-route-to-cy-intercept)

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

::include{file=partials/support-file-configuration.md}

## See also

- [`cy.server()`](/api/commands/server)
