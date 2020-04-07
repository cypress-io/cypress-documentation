---
title: each

---

Iterate through an array like structure (arrays or objects with a `length` property).

# Syntax

```javascript
.each(callbackFn)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.get('ul>li').each(() => {...}) // Iterate through each 'li'
cy.getCookies().each(() => {...}) // Iterate through each cookie
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript

cy.each(() => {...})            // Errors, cannot be chained off 'cy'
cy.location().each(() => {...}) // Errors, 'location' doesn't yield an array
```

## Arguments

**{% fa fa-angle-right %} callbackFn** ***(Function)***

Pass a function that is invoked with the following arguments:

- `value`
- `index`
- `collection`

## Yields {% helper_icon yields %}

{% yields same_subject .each %}

# Examples

## DOM Elements

***Iterate over an array of DOM elements***

```javascript
cy
  .get('ul>li')
  .each(($el, index, $list) => {
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

***The original array is always yielded***

No matter what is returned in the callback function, `.each()` will always yield the original array.

```javascript
cy
  .get('li').should('have.length', 3)
  .each(($li, index, $lis) => {
    return 'something else'
  })
  .then(($lis) => {
    expect($lis).to.have.length(3) // true
  })
```

## Promises

***Promises are awaited***

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

# Notes

## Return early

***Stop `each` prematurely***

You can stop the `.each()` loop early by returning `false` in the callback function.

# Rules

## Requirements {% helper_icon requirements %}

{% requirements child .each %}

## Assertions {% helper_icon assertions %}

{% assertions once .each %}

## Timeouts {% helper_icon timeout %}

{% timeouts promises .each %}

# Command Log

- `cy.each()` does *not* log in the Command Log

# See also

- {% url `.spread()` spread %}
- {% url `.then()` then %}
