---
title: Cypress.SelectorPlayground
---

The [Selector Playground](/guides/core-concepts/test-runner#Selector-Playground)
exposes APIs that enable you to:

- Change the default selector strategy
- Override the selectors that are returned per element

## Syntax

```javascript
Cypress.SelectorPlayground.defaults(options)
Cypress.SelectorPlayground.getSelector($el)
```

### Arguments

**<Icon name="angle-right"/> options** **_(Object)_**

An object containing any or all of the following options:

| Option             | Accepts            | Description                                                                                                                                                           |
| ------------------ | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `selectorPriority` | `Array of strings` | Determines the order of preference for which selector is chosen for the element.                                                                                      |
| `onElement`        | `function`         | A function called with the element that should return a unique selector string for the element. If a falsey value is returned, the default selector function is used. |

**_Default Selector Priority:_**

- `data-cy`
- `data-test`
- `data-testid`
- `id`
- `class`
- `tag`
- `attributes`
- `nth-child`

**<Icon name="angle-right"/> $el** **_(Object)_**

The [jQuery element](http://api.jquery.com/Types/#jQuery) that you want to get
the selector value for.

## Examples

### Selector Priority

Set the selector priority to favor IDs, then classes, then attributes.

```javascript
Cypress.SelectorPlayground.defaults({
  selectorPriority: ['id', 'class', 'attributes'],
})
```

### onElement Callback

Set a custom function for determining the selector for an element. Falls back to
default behavior if returning a falsey value.

```javascript
Cypress.SelectorPlayground.defaults({
  onElement: ($el) => {
    const customId = $el.attr('my-custom-attr')

    if (customId) {
      return `[my-custom-attr=${customId}]`
    }
  },
})
```

### Get Selector

Returns you the selector value for a given element as determined by the selector
strategy.

For example, consider this HTML fragment.

```html
<button id="bingo" class="number3">Cup of tea</button>
```

With the default selector strategy, the selector value will be `'#bingo'`
because IDs have priority over classes.

```js
const $el = Cypress.$('button')
const selector = Cypress.SelectorPlayground.getSelector($el) // '#bingo'
```

With a custom selector strategy that favours classes, the selector value will be
`'.number3'`.

```js
Cypress.SelectorPlayground.defaults({
  selectorPriority: ['class', 'id'],
})

const $el = Cypress.$('button')
const selector = Cypress.SelectorPlayground.getSelector($el) // '.number3'
```
