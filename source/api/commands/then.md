---
title: then
---

Enables you to work with the subject yielded from the previous command.

{% note info %}
**Note:** `.then()` assumes you are already familiar with core concepts such as {% url 'closures' variables-and-aliases#Closures %}.
{% endnote %}

{% note info %}
**Note:** Prefer {% url '`.should()` with callback' should#Function %} over `.then()` for assertions as they are automatically rerun until no assertions throw within it but be aware of {% url 'differences' should#Differences %}.
{% endnote %}

# Syntax

```javascript
.then(callbackFn)
.then(options, callbackFn)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.get('.nav').then(($nav) => {})  // Yields .nav as first arg
cy.location().then((loc) => {})   // Yields location object as first arg
```

## Arguments

**{% fa fa-angle-right %} options** ***(Object)***

Pass in an options object to change the default behavior of `.then()`.

Option | Default | Description
--- | --- | ---
`timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout .then %}

**{% fa fa-angle-right %} callbackFn** ***(Function)***

Pass a function that takes the previously yielded subject as its first argument.

## Yields {% helper_icon yields %}

`.then()` is modeled identically to the way Promises work in JavaScript.  Whatever is returned from the callback function becomes the new subject and will flow into the next command (with the exception of `undefined`).

Additionally, the result of the last Cypress command in the callback function will be yielded as the new subject and flow into the next command if there is no `return`.

When `undefined` is returned by the callback function, the subject will not be modified and will instead carry over to the next command.

Just like Promises, you can return any compatible "thenable" (anything that has a `.then()` interface) and Cypress will wait for that to resolve before continuing forward through the chain of commands.

# Examples

{% note info %}
We have several more examples in our {% url 'Core Concepts Guide' variables-and-aliases %} which go into the various ways you can use `.then()` to store, compare, and debug values.
{% endnote %}

## DOM element

### The `button` element is yielded

```javascript
cy.get('button').then(($btn) => {
  const cls = $btn.attr('class')

  cy.wrap($btn).click().should('not.have.class', cls)
})
```

### The number is yielded from previous command

```js
cy.wrap(1).then((num) => {
  cy.wrap(num).should('equal', 1) // true
}).should('equal', 1) // true
```

## Change subject

### The el subject is changed with another command

```javascript
cy.get('button').then(($btn) => {
  const cls = $btn.attr('class')

  cy.wrap($btn).click().should('not.have.class', cls)
    .find('i')
    // since there is no explicit return
    // the last Cypress command's yield is yielded
}).should('have.class', 'spin') // assert on i element
```

### The number subject is changed with another command

```javascript
cy.wrap(1).then((num) => {
  cy.wrap(num)).should('equal', 1) // true
  cy.wrap(2)
}).should('equal', 2) // true
```

### The number subject is changed by returning

```javascript
cy.wrap(1).then((num) => {
  cy.wrap(num)).should('equal', 1) // true
  return 2
}).should('equal', 2) // true
```

### Returning `undefined` will not modify the yielded subject

```javascript
cy.get('form')
.then(($form) => {
  console.log('form is:', $form)
  // undefined is returned here, but $form will be
  // yielded to allow for continued chaining
}).find('input').then(($input) => {
  // we have our $input element here since
  // our form element was yielded and we called
  // .find('input') on it
})
```

## Promises

Cypress waits for Promises to resolve before continuing

### Example using Q

```javascript
cy.get('button').click().then(($button) => {
  const p = Q.defer()

  setTimeout(() => {
    p.resolve()
  }, 1000)

  return p.promise
})
```

### Example using bluebird

```javascript
cy.get('button').click().then(($button) => {
  return Promise.delay(1000)
})
```

### Example using jQuery deferred's

```javascript
cy.get('button').click().then(($button) => {
  const df = $.Deferred()

  setTimeout(() => {
    df.resolve()
  }, 1000)

  return df
})
```

# Notes

## Differences

{% partial then_should_difference %}

# Rules

## Requirements {% helper_icon requirements %}

{% requirements child .then %}

## Assertions {% helper_icon assertions %}

{% assertions once .then %}

## Timeouts {% helper_icon timeout %}

{% timeouts promises .then %}

# Command Log

- `.then()` does *not* log in the Command Log

{% history %}
{% url "0.14.0" changelog#0-14-0 %} | Added `timeout` option
{% url "< 0.3.3" changelog#0-3-3 %} | `.then()` command added
{% endhistory %}

# See also

- {% url `.and()` and %}
- {% url `.each()` each %}
- {% url `.invoke()` invoke %}
- {% url `.its()` its %}
- {% url `.should()` should %}
- {% url `.spread()` spread %}
- {% url 'Guide: Using Closures to compare values' variables-and-aliases#Closures %}
- {% url 'Guide: Chains of Commands' introduction-to-cypress#Chains-of-Commands %}
