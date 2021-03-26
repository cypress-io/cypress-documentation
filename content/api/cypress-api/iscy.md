---
title: Cypress.isCy
---

`Cypress.isCy()` checks if a variable is a valid instance of `cy` or a `cy` chainable.

This utility may be useful when writing [plugins](/api/plugins/writing-a-plugin) for Cypress and you want to determine if a value is a valid Cypress chainable.

## Syntax

```javascript
Cypress.isCy(obj)
```

### Arguments

**<Icon name="angle-right"></Icon> obj** **_(Object)_**

The object to test.

## Examples

```javascript
Cypress.isCy(cy) // true

const chainer = cy.wrap().then(() => {
  Cypress.isCy(chainer) // true
})

Cypress.isCy(undefined) // false

Cypress.isCy(() => {}) // false
```
