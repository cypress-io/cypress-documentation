---
title: Cypress.arch
comments: false
---

Constant `Cypress.arch` returns the CPU architecture name, as returned from Node [`os.arch()`](https://nodejs.org/api/os.html#os_os_arch).

# Syntax

```javascript
Cypress.arch
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
Cypress.arch // "darwin"
```

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
