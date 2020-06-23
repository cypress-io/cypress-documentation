---
title: Cypress.Server

---

Permanently change the default options for all {% url `cy.server()` server %} instances

# Syntax

```javascript
Cypress.Server.defaults(options)
```

## Arguments

**{% fa fa-angle-right %} options**  ***(Object)***

Pass in an options object to change the default behavior of `Cypress.Server`.

# Examples

## Options

**These options will be the new defaults.**

```javascript
// pass anything here you'd normally pass to cy.server().
Cypress.Server.defaults({
  delay: 500,
  force404: false,
  whitelist: (xhr) => {
    // handle custom logic for filtering XHR requests
  }
})
```

# Notes

**Where to put server configuration**

A great place to put this configuration is in your `cypress/support/index.js` file, since it is loaded before any test files are evaluated.

# See also

- {% url `cy.server()` server %}
