---
title: Cypress.isBrowserType
comments: false
---

`Cypress.isBrowserType` returns true if the current browser is of the type of the name passed or false if it does not. The name is case-insensitive.

These browsers will return true for `Cypress.isBrowserType('chrome')`:

* Chrome
* Canary
* Chromium
* Electron

These browsers will return true for `Cypress.isBrowserType('firefox')`:

* Firefox
* Firefox Developer Edition
* Firefox Nightly

# Syntax

```javascript
// while running in Chrome
Cypress.isBrowserType('chrome') // true
Cypress.isBrowserType('Chrome') // true
Cypress.isBrowserType('firefox') // false

// while running in Canary
Cypress.isBrowserType('chrome') // true
Cypress.isBrowserType('firefox') // false

// while running Firefox Nightly
Cypress.isBrowserType('firefox') // true
Cypress.isBrowserType('chrome') // false
```

# Examples

## Conditionals

```javascript
if (Cypress.isBrowserType('chrome')) {
  it('only runs in chrome-based browser', function () {
    // test some (hypothetical) issue with chrome-based browsers
  })
}
```