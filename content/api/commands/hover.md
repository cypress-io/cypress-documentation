---
title: hover
---

<Alert type="danger">

Cypress does not have a **cy.hover()** command. See [Issue #10](https://github.com/cypress-io/cypress/issues/10).

</Alert>

If `cy.hover()` is used, an error will display and redirect you to this page.

## Workarounds

Sometimes an element has specific logic on hover and you _do_ need to "hover" in Cypress. Maybe the element doesn't even display to be clickable until you hover over another element.

Oftentimes you can use [`.trigger()`](/api/commands/trigger), [`.invoke()`](/api/commands/invoke) or [`cy.wrap()`](/api/commands/wrap) to show the element before you perform the action.

<Alert type="info">

[Check out our example recipe on testing hover and working with hidden elements](/examples/examples/recipes#Testing-the-DOM). Also take a look at the [cypress-real-events](https://github.com/dmtrKovalenko/cypress-real-events) plugin that provides native events like hover and swipe in Chromium browsers.

</Alert>

### Trigger

If the hover behavior depends on a JavaScript event like `mouseover`, you can trigger the event to achieve that behavior.

<Alert type="danger">

Using `.trigger()` will only affect events in JavaScript and will not trigger any effects in CSS.

</Alert>

As a workaround, check out the [recipe leveraging Chrome remote debugging](/examples/examples/recipes#Fundamentals) to set pseudo classes like `hover`.

#### Simulating `mouseover` event to get popover to display

```javascript
cy.get(".menu-item").trigger("mouseover");
cy.get(".popover").should("be.visible");
```

### Invoke

#### Example of showing an element in order to perform action

```javascript
cy.get(".hidden").invoke("show").click();
```

### Force click

You can also force the action to be performed on the element regardless of whether the element is visible or not.

#### Example of clicking on a hidden element

```javascript
cy.get(".hidden").click({ force: true });
```

#### Example of checking a hidden element

```javascript
cy.get(".checkbox").check({ force: true });
```

## See also

- [`.invoke()`](/api/commands/invoke)
- [`.trigger()`](/api/commands/trigger)
- [`cy.wrap()`](/api/commands/wrap)
- [Recipe: Hover and Hidden Elements](/examples/examples/recipes#Testing-the-DOM)
