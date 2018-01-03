---
title: Cypress.dom
comments: false
---

`Cypress.dom.method()` is a collection of DOM related helper methods.

{% note info 'WIP' %}
There are actually dozens of methods attached to `Cypress.dom`.

These methods are used internally by Cypress in nearly every single built in command.

We suggest {% url 'reading through the source code here' https://github.com/cypress-io/cypress/blob/master/packages/driver/src/dom/index.coffee %} to see all of the methods and what they do.
{% endnote %}

# Syntax

```javascript
Cypress.dom.isHidden(element)
```

# Examples

## Is Hidden

**Returns a boolean indicating whether an element is hidden.**

Cypress internally uses this method *everywhere* to figure out whether an element is hidden, {% url "mostly for actionability" interacting-with-elements %}.

```javascript
const $el = $("#modal")

Cypress.dom.isHidden($el) // => false
```
