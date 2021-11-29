---
title: Cypress.testingType
---

`Cypress.testingType` returns the current testing type, determined by the Test
Runner chosen to run. The `Cypress.testingType` returns `e2e` for Cypress Test
Runner `integration` tests, or `component` for experimental
[Component Testing](guides/component-testing/introduction).

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
