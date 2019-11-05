---
title: Cypress.isBrowser
comments: false
---

`Cypress.isBrowser` returns `true` if the current browser matches the name passed or `false` if it does not. The name is case-insensitive.

# Syntax

```javascript
// while running in Chrome
Cypress.isBrowser('chrome')  // true
Cypress.isBrowser('Chrome')  // true
Cypress.isBrowser('firefox') // false
Cypress.isBrowser('canary')  // false
```

# Examples

## Conditionals

```javascript
if (Cypress.isBrowser('chrome')) {
  it('only runs in chrome', function () {
    // test some (hypothetical) issue with chrome
  })
}
```
