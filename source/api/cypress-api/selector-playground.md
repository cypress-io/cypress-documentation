---
title: Cypress.SelectorPlayground
comments: false
---

`SelectorPlayground.defaults()` enables you to control the behavior of the Selector Playground.

# Syntax

```javascript
Cypress.SelectorPlayground.defaults(options)
```

## Arguments

**{% fa fa-angle-right %} options**  ***(Object)***

An object containing one or both of the following:

- *selectorPriority*: Determines the order of preference for which selector is chosen based on the element. Default: `['data-cy', 'data-test', 'data-testid', 'id', 'class', 'tag', 'attributes', 'nth-child']`
- *onElement*: A function called with the element that should return a unique selector string for the element. If a falsey value is returned, the default selector function is used.

# Examples

Set the selector priority to favor IDs, then classes, then attributes.

```javascript
Cypress.SelectorPlayground.defaults({
  selectorPriority: ['id', 'class', 'attributes']
})
```

Set a custom function for determining the selector for an element. Falls back to default behavior if the element doesn't have a `test-id` attribute.

```javascript
Cypress.SelectorPlayground.defaults({
  onElement (element) {
    if (element.hasAttribute('test-id')) {
      return `[test-id=${element.getAttribue('test-id')}]`
    }

    return false
  }
})
```
