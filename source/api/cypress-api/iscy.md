---
title: Cypress.isCy
---

`Cypress.isCy()` checks if a variable is a valid instance of `cy` or a `cy` chainable.

# Syntax

```javascript
Cypress.isCy(obj)
```

## Arguments

**{% fa fa-angle-right %} obj** ***(any)***

The object to test.

# Examples

```javascript
Cypress.isCy(cy) // true

const chainer = cy.wrap().then(() => {
  Cypress.isCy(chainer) // true
})

Cypress.isCy(undefined) // false

Cypress.isCy(() => {}) // false
```
