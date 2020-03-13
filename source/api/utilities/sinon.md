---
title: Cypress.sinon
---

Cypress automatically includes {% url 'Sinon.JS' http://sinonjs.org/ %} and exposes it as `Cypress.sinon`.

# Syntax

```javascript
Cypress.sinon.method()
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
Cypress.sinon.match.string
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.sinon.match.string // Errors, cannot be chained off 'cy'
```

# Examples

## `Cypress.sinon.match.string`

Application code where `setProperty` is called

```js
document.querySelector('input[type=color]').addEventListener('change', (e) => {
  document.documentElement.style.setProperty('--background-color', e.target.value)
})
```

Test that `setProperty` was called with string

```javascript
cy.document()
.its('documentElement.style')
.then((style) => {
  cy.spy(style, 'setProperty').as('setColor')
})

cy.get('input[type=color]')
.invoke('val', '#ff0000')
.trigger('change')

// we don't care about '--background-color' exact
// value but know it should be a string
cy.get('@setColor')
.should('have.been.calledWith', Cypress.sinon.match.string, '#ff0000')
```
