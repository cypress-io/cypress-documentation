---
title: Cypress.SelectorPlayground

---

The Selector Playground exposes API's that enable you to:

- Change the default selector strategy
- Override the selectors that are returned per element

# Syntax

```javascript
Cypress.SelectorPlayground.defaults(options)
Cypress.SelectorPlayground.getSelector($el)
```

## Arguments

**{% fa fa-angle-right %} options**  ***(Object)***

An object containing one or both of the following:

Option | Accepts | Description
--- | --- | ---
`selectorPriority` | `Array of strings` | Determines the order of preference for which selector is chosen for the element.
`onElement` | `function` | A function called with the element that should return a unique selector string for the element. If a falsey value is returned, the default selector function is used.

***Default Selector Priority:***

- `data-cy`
- `data-test`
- `data-testid`
- `id`
- `class`
- `tag`
- `attributes`
- `nth-child`

# Examples

## Selector Priority

Set the selector priority to favor IDs, then classes, then attributes.

```javascript
Cypress.SelectorPlayground.defaults({
  selectorPriority: ['id', 'class', 'attributes']
})
```

## onElement Callback

Set a custom function for determining the selector for an element. Falls back to default behavior if returning a falsey value.

```javascript
Cypress.SelectorPlayground.defaults({
  onElement: ($el) => {
    const customId = $el.attr('my-custom-attr')

    if (customId) {
      return `[my-custom-attr=${customId}]`
    }
  }
})
```

## Get Selector

Returns you the selector value for a given element.

```js
// query for a button
const $el = Cypress.$('button')

// do something like console.log()
const selector = Cypress.SelectorPlayground.getSelector($el)

```
