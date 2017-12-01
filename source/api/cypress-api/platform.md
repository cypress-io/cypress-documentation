---
title: Cypress.platform
comments: false
---

Constant `Cypress.platform` returns the current OS name, as returned from Node [`os.platform()`](https://nodejs.org/api/os.html#os_os_platform).

# Syntax

```javascript
Cypress.platform
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
Cypress.platform // "darwin"
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.platform  // returns undefined
Cypress.platform() // Errors, not a function
```

# Examples

## Running OS-specific command

```javascript
it('has JSON files', function () {
    if (Cypress.platform === 'win32') {
        cy.exec('dir *.json')
          .its('stdout')
          .should('include', 'package.json')
    } else {
        cy.exec('ls *.json')
          .its('stdout')
          .should('include', 'package.json')
    }
})
```
