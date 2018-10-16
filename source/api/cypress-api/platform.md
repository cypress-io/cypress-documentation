---
title: Cypress.platform
---

`Cypress.platform` returns you the underlying OS name, as returned from Node's {% url "`os.platform()`" https://nodejs.org/api/os.html#os_os_platform %}.

Even though Cypress runs in the browser, it automatically makes this property available for use in your tests.

# Syntax

```javascript
Cypress.platform // 'darwin'
```

# Examples

## Conditionals

```javascript
it('has JSON files', function () {
  // if windows do one thing, else do another
  const cmd = Cypress.platform === 'win32' ? 'dir *.json' : 'ls *.json'

  cy.exec(cmd)
    .its('stdout')
    .should('include', 'package.json')
})
```
