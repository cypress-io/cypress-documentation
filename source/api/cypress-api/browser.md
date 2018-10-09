---
title: Cypress.browser
---

`Cypress.browser` returns you properties of the browser.

# Syntax

```javascript
Cypress.browser // returns browser object
```

# Examples

## Log browser information

### `Cypress.browser` returns browser object

```js
it('log browser info', function() {
  console.log(Cypress.browser)
  // {
  //   name: 'chrome',
  //   displayName: 'Chrome',
  //   version: '67.123.456.90',
  //   majorVersion: '67',
  //   path: '/path/to/browser',
  //   isHeaded: true,
  //   isHeadless: false
  // }
})
```

## Conditionals

### Check that Chrome specific styles are applied

```css
@media and (-webkit-min-device-pixel-ratio:0) {
  .header {
    margin-right: 0;
  }
}
```

```javascript
it('has correct Chrome specific css property', function () {
  // if in Chrome, check css property was properly applied
  if (Cypress.browser.name === 'chrome') {
    cy
    .get('.header')
    .should('have.css', 'margin-right')
    .and('eq', '0')
  }
})
```
