---
title: Cypress.dom
---

`Cypress.dom.method()` is a collection of DOM related helper methods.

{% note warning %}
There are actually dozens of methods attached to `Cypress.dom` that are not documented below. These methods are used internally by Cypress in nearly every single built in command.

We suggest {% url 'reading through the source code here' https://github.com/cypress-io/cypress/blob/develop/packages/driver/src/dom/index.js %} to see all of the methods and what they do.
{% endnote %}

# Syntax

```javascript
Cypress.dom.isHidden(element)
```

# Examples

## Is hidden

**Returns a boolean indicating whether an element is hidden.**

Cypress internally uses this method *everywhere* to figure out whether an element is hidden, {% url "mostly for actionability" interacting-with-elements %}.

```javascript
cy.get('p').then(($el) => {
  Cypress.dom.isHidden($el) // false
})
```

## Is detached

**Returns a boolean indicating whether an element is detached from the DOM.**

```javascript
cy.get('p').then(($el) => {
  Cypress.dom.isDetached($el) // false
})
```
