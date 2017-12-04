---
title: Cypress.arch
comments: false
---

Constant `Cypress.arch` has the CPU architecture name, as returned from Node's [`os.arch()`](https://nodejs.org/api/os.html#os_os_arch).

# Syntax

```javascript
Cypress.arch
```

# Examples

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.arch  // returns undefined
Cypress.arch() // Errors, not a function
```

# Examples

## Confirming test machine architecture

```javascript
it('has expected CPU architecture', function () {
    expect(Cypress.arch).to.be.oneOf(['x64', 'ia32'])
})
```
