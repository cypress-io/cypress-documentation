---
title: each
---

Iterate through an array like structure (arrays or objects with a `length` property).

## Syntax

```javascript
.each(callbackFn)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get('ul>li').each(() => {...}) // Iterate through each 'li'
cy.getCookies().each(() => {...}) // Iterate through each cookie
```

**<Icon name="exclamation-triangle" color="red"></Icon> Incorrect Usage**

```javascript

cy.each(() => {...})            // Errors, cannot be chained off 'cy'
cy.location().each(() => {...}) // Errors, 'location' doesn't yield an array
```

### Arguments

**<Icon name="angle-right"></Icon> callbackFn** **_(Function)_**

Pass a function that is invoked with the following arguments:

- `value`
- `index`
- `collection`

### Yields [<Icon name="question-circle"/>](introduction-to-cypress#Subject-Management)

<List><li>`.each()` yields the same subject it was given from the previous command.</li></List>

## Examples

### DOM Elements

**_Iterate over an array of DOM elements_**

```javascript
cy.get('ul>li').each(($el, index, $list) => {
  // $el is a wrapped jQuery element
  if ($el.someMethod() === 'something') {
    // wrap this element so we can
    // use cypress commands on it
    cy.wrap($el).click()
  } else {
    // do something else
  }
})
```

**_The original array is always yielded_**

No matter what is returned in the callback function, `.each()` will always yield the original array.

```javascript
cy.get('li')
  .should('have.length', 3)
  .each(($li, index, $lis) => {
    return 'something else'
  })
  .then(($lis) => {
    expect($lis).to.have.length(3) // true
  })
```

### Promises

**_Promises are awaited_**

If your callback function returns a `Promise`, it will be awaited before iterating over the next element in the collection.

```javascript
cy.wrap([1, 2, 3]).each((num, i, array) => {
  return new Cypress.Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, num * 100)
  })
})
```

## Notes

### Return early

**_Stop `each` prematurely_**

You can stop the `.each()` loop early by returning `false` in the callback function.

## Rules

### Requirements [<Icon name="question-circle"/>](introduction-to-cypress#Chains-of-Commands)

<List><li>`.each()` requires being chained off a previous command.</li></List>

### Assertions [<Icon name="question-circle"/>](introduction-to-cypress#Assertions)

<List><li>`.each()` will only run assertions you have chained once, and will not [retry](/guides/core-concepts/retry-ability).</li></List>

### Timeouts [<Icon name="question-circle"/>](introduction-to-cypress#Timeouts)

<List><li>`.each()` can time out waiting for a promise you've returned to resolve.</li></List>

## Command Log

- `cy.each()` does _not_ log in the Command Log

## See also

- [`.spread()`](/api/commands/spread)
- [`.then()`](/api/commands/then)
