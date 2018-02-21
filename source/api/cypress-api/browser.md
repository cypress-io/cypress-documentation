---
title: Cypress.browser
comments: false
---

`Cypress.browser` is an object detailing the current browser being used.

# Syntax

```javascript
Cypress.browser
// {
//   "name": "chrome",
//   "version": "50.0.2661.86",
//   "path": "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
//   "majorVersion": "50"
// },
```

# Examples

## Conditionals

```javascript
if (Cypress.browser.name === 'chrome' && Cypress.browser.majorVersion < 40) {
  it('only runs in chrome less than version 40', function () {
    // test some (hypothetical) issue with chrome < 40
  })
}
```
