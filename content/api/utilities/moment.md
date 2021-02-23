---
title: Cypress.moment
---

Cypress automatically includes [moment.js](http://momentjs.com/) and exposes it as `Cypress.moment`.

Use `Cypress.moment` to help format or parse dates.

<Alert type="warning">

⚠️ **`Cypress.moment` is deprecated in Cypress 6.1.0 and will be replaced in a future release.** Consider migrating to a different datetime formatter. For example, see the recipe [Using Day.js instead of Moment.js](https://github.com/cypress-io/cypress-example-recipes#blogs).

</Alert>

## Syntax

```javascript
Cypress.moment();
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
Cypress.moment();
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript
cy.moment(); // Errors, cannot be chained off 'cy'
```

## Examples

**Test that the span contains formatted text for today**

```javascript
const todaysDate = Cypress.moment().format("MMM DD, YYYY");

cy.get("span").should("contain", "Order shipped on: " + todaysDate);
```

## See also

- [Bundled Tools](/guides/references/bundled-tools)
- [`cy.clock()`](/api/commands/clock)
