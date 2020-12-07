---
title: Cypress.moment
---

Cypress automatically includes {% url 'moment.js' http://momentjs.com/ %} and exposes it as `Cypress.moment`.

Use `Cypress.moment` to help format or parse dates.

{% note warning %}
⚠️ **`Cypress.moment` is deprecated in Cypress 6.1.0 and will be replaced in a future release.** Consider migrating to a different datetime formatter.
{% endnote %}

# Syntax

```javascript
Cypress.moment()
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
Cypress.moment()
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
cy.moment() // Errors, cannot be chained off 'cy'
```

# Examples

**Test that the span contains formatted text for today**

```javascript
const todaysDate = Cypress.moment().format('MMM DD, YYYY')

cy.get('span').should('contain', 'Order shipped on: ' + todaysDate)
```

# See also

- {% url 'Bundled Tools' bundled-tools %}
- {% url `cy.clock()` clock %}
