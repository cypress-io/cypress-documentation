---
title: then
---

Enables you to work with the subject yielded from the previous command.

<Alert type="info">


**Note:** `.then()` assumes you are already familiar with core concepts such as [closures](/guides/core-concepts/variables-and-aliases#Closures).

</Alert>

<Alert type="info">


**Note:** Prefer [`.should()` with callback](/api/commands/should#Function) over `.then()` for assertions as they are automatically rerun until no assertions throw within it but be aware of [differences](/api/commands/should#Differences).

</Alert>

## Syntax

```javascript
.then(callbackFn)
.then(options, callbackFn)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.get('.nav').then(($nav) => {})  // Yields .nav as first arg
cy.location().then((loc) => {})   // Yields location object as first arg
```

### Arguments

**<Icon name="angle-right"></Icon> options** ***(Object)***

Pass in an options object to change the default behavior of `.then()`.

Option | Default | Description
--- | --- | ---
`timeout` | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `.then()` to resolve before [timing out](#Timeouts)

**<Icon name="angle-right"></Icon> callbackFn** ***(Function)***

Pass a function that takes the previously yielded subject as its first argument.

### Yields [<Icon name="question-circle"/>](introduction-to-cypress#Subject-Management)

`.then()` is modeled identically to the way Promises work in JavaScript.  Whatever is returned from the callback function becomes the new subject and will flow into the next command (with the exception of `undefined`).

Additionally, the result of the last Cypress command in the callback function will be yielded as the new subject and flow into the next command if there is no `return`.

When `undefined` is returned by the callback function, the subject will not be modified and will instead carry over to the next command.

Just like Promises, you can return any compatible "thenable" (anything that has a `.then()` interface) and Cypress will wait for that to resolve before continuing forward through the chain of commands.

## Examples

<Alert type="info">


We have several more examples in our [Core Concepts Guide](/guides/core-concepts/variables-and-aliases) which go into the various ways you can use `.then()` to store, compare, and debug values.

</Alert>

### DOM element

#### The `button` element is yielded

```javascript
cy.get('button').then(($btn) => {
  const cls = $btn.attr('class')

  cy.wrap($btn).click().should('not.have.class', cls)
})
```

#### The number is yielded from previous command

```js
cy.wrap(1).then((num) => {
  cy.wrap(num).should('equal', 1) // true
}).should('equal', 1) // true
```

### Change subject

#### The el subject is changed with another command

```javascript
cy.get('button').then(($btn) => {
  const cls = $btn.attr('class')

  cy.wrap($btn).click().should('not.have.class', cls)
    .find('i')
    // since there is no explicit return
    // the last Cypress command's yield is yielded
}).should('have.class', 'spin') // assert on i element
```

#### The number subject is changed with another command

```javascript
cy.wrap(1).then((num) => {
  cy.wrap(num)).should('equal', 1) // true
  cy.wrap(2)
}).should('equal', 2) // true
```

#### The number subject is changed by returning

```javascript
cy.wrap(1).then((num) => {
  cy.wrap(num).should('equal', 1) // true

  return 2
}).should('equal', 2) // true
```

#### Returning `undefined` will not modify the yielded subject

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

### Promises

Cypress waits for Promises to resolve before continuing

#### Example using Q

```javascript
cy.get('button').click().then(($button) => {
  const p = Q.defer()

  setTimeout(() => {
    p.resolve()
  }, 1000)

  return p.promise
})
```

#### Example using bluebird

```javascript
cy.get('button').click().then(($button) => {
  return Promise.delay(1000)
})
```

#### Example using jQuery deferred's

```javascript
cy.get('button').click().then(($button) => {
  const df = $.Deferred()

  setTimeout(() => {
    df.resolve()
  }, 1000)

  return df
})
```

## Notes

### Differences

### What's the difference between `.then()` and `.should()`/`.and()`?

Using `.then()` allows you to use the yielded subject in a callback function and should be used when you need to manipulate some values or do some actions.

When using a callback function with `.should()` or `.and()`, on the other hand, there is special logic to rerun the callback function until no assertions throw within it. You should be careful of side affects in a `.should()` or `.and()` callback function that you would not want performed multiple times.

## Rules

### Requirements [<Icon name="question-circle"/>](introduction-to-cypress#Chains-of-Commands)

<List><li>`.then()` requires being chained off a previous command.</li></List>

### Assertions [<Icon name="question-circle"/>](introduction-to-cypress#Assertions)

<List><li>`.then` will only run assertions you have chained once, and will not [retry](/guides/core-concepts/retry-ability).</li></List>

### Timeouts [<Icon name="question-circle"/>](introduction-to-cypress#Timeouts)

<List><li>`.then()` can time out waiting for a promise you've returned to resolve.</li></List>

## Command Log

- `.then()` does *not* log in the Command Log

## History

Version | Changes
--- | ---
[0.14.0](/guides/references/changelog#0-14-0) | Added `timeout` option
[< 0.3.3](/guides/references/changelog#0-3-3) | `.then()` command added

## See also

- [`.and()`](/api/commands/and)
- [`.each()`](/api/commands/each)
- [`.invoke()`](/api/commands/invoke)
- [`.its()`](/api/commands/its)
- [`.should()`](/api/commands/should)
- [`.spread()`](/api/commands/spread)
- [Guide: Using Closures to compare values](/guides/core-concepts/variables-and-aliases#Closures)
- [Guide: Chains of Commands](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

