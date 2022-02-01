---
title: Cypress.spec
---

`Cypress.spec` returns you the properties of the spec under test.

## Syntax

```javascript
Cypress.spec // returns spec object
```

## Examples

### Log spec information

#### `Cypress.spec` returns an object

```js
it('log spec info', () => {
  console.log(Cypress.spec)
  // {
  //   name: 'filter.cy.js',
  //   relative: 'cypress/e2e/filter.cy.js',
  //   absolute: '/Users/janelane/Dev/web-app/cypress/e2e/filter.cy.js',
  // }
})
```
