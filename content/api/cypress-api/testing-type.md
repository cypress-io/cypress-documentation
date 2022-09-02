---
title: Cypress.testingType
---

`Cypress.testingType` returns the current testing type, determined by your
selection in the Cypress Launchpad. The `Cypress.testingType` returns `e2e` for
[E2E Testing](/guides/core-concepts/testing-types#What-is-E2E-Testing) or
`component` for
[Component Testing](/guides/core-concepts/testing-types#What-is-Component-Testing).

## Syntax

```javascript
Cypress.testingType // returns 'e2e' or 'component'
```

## Examples

### Testing Type

```javascript
it('is running experimental component testing mode', () => {
  expect(Cypress.testingType).to.equal('component')
})
```

### Conditionals

```javascript
it('does something differently', () => {
  if (Cypress.testingType === 'e2e') {
    cy.exec('something')
  } else {
    cy.exec('something else')
  }
})
```

## History

| Version                               | Changes                     |
| ------------------------------------- | --------------------------- |
| [7.0.0](/guides/references/changelog) | Added `Cypress.testingType` |
