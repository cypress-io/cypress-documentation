---
title: Cypress.currentTest
---

`Cypress.currentTest` returns the currently executing test instance with
properties to access the title of the test.

## Syntax

```javascript
// an object with title and titlePath properties
Cypress.currentTest

// the title of the current test
Cypress.currentTest.title

// an array with the current test's title path
Cypress.currentTest.titlePath
```

## Examples

### Get current test title

```javascript
describe('app layout and responsiveness', () => {
  it('toggles the nav', () => {
    expect(Cypress.currentTest.title).to.eq('toggles the nav')
  })
})
```

### Get full path of current test title

```javascript
describe('app layout and responsiveness', () => {
  it('toggles the nav', () => {
    expect(Cypress.currentTest.titlePath).to.deep.eq([
      'app layout and responsiveness',
      'toggles the nav',
    ])
  })
})
```

## History

| Version                                     | Changes                     |
| ------------------------------------------- | --------------------------- |
| [8.2.0](/guides/references/changelog#8-2-0) | `Cypress.currentTest` added |
