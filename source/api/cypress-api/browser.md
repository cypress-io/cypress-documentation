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

### Screenshot only in headless browser

```javascript
Cypress.Commands.overwrite('screenshot', (originalFn, subject, name, options) => {
  // only take screenshots in headless browser
  if (Cypress.browser.isHeadless) {
    // return the original screenshot function
    return originalFn(subject, name, options)
  }

  return cy.log('No screenshot taken when headed')
})

// only takes in headless browser
cy.screenshot()
```

{% history %}
{% url "3.0.2" changelog#3-0-2 %} | `Cypress.browser` introduced
{% endhistory %}

# See also

- {% url "Browser Launch API" browser-launch-api %}
- {% url "Cross Browser Testing" cross-browser-testing %}
- {% url "`Cypress.isBrowser`" is-browser %}
- {% url "Launching Browsers" launching-browsers %}
