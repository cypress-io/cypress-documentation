---
title: Cypress.arch
menuTitle: arch
---

`Cypress.arch` returns you the CPU architecture name of the underlying OS, as returned from Node's [`os.arch()`](https://nodejs.org/api/os.html#os_os_arch).

Even though Cypress runs in the browser, it automatically makes this property available for use in your tests.

## Syntax

```javascript
Cypress.arch // 'x64'
```

## Examples

### CPU Architecture

```javascript
it('has expected CPU architecture', () => {
  expect(Cypress.arch).to.be.oneOf(['x64', 'ia32'])
})
```

### Conditionals

```javascript
it('does something differently', () => {
  if (Cypress.arch === 'x64') {
    cy.exec('something')
  } else {
    cy.exec('something else')
  }
})
```

## History

| Version                                     | Changes              |
| ------------------------------------------- | -------------------- |
| [1.1.3](/guides/references/changelog#1-1-3) | `Cypress.arch` added |
