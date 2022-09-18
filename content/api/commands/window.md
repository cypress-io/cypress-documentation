---
title: window
---

Get the `window` object of the page that is currently active.

## Syntax

```javascript
cy.window()
cy.window(options)
```

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.window()
```

### Arguments

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `cy.window()`.

| Option    | Default                                                              | Description                                                                              |
| --------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `log`     | `true`                                                               | Displays the command in the [Command log](/guides/core-concepts/cypress-app#Command-Log) |
| `timeout` | [`defaultCommandTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `cy.window()` to resolve before [timing out](#Timeouts)                 |

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`cy.window()` 'yields the `window` object' </li></List>

## Examples

### No Args

#### Yield the remote window object

<e2e-or-ct>
<template #e2e>

```js
cy.visit('http://localhost:8080/app')
cy.window().then((win) => {
  // win is the remote window
})
```

</template>
<template #ct>

```js
cy.mount(<MyComponent />)
cy.window().then((win) => {
  // win is the remote window
})
```

</template>
</e2e-or-ct>

#### Check a custom property

If the application sets a custom property, like:

```javascript
window.tags = {
  foo: 'bar',
}
```

Our test can confirm the property was properly set.

```javascript
cy.window().its('tags.foo').should('equal', 'bar')
```

**Note:** Cypress commands are asynchronous, so you cannot check a property
value before the Cypress commands ran.

```javascript
it('equals bar', () => {
  let foo

  cy.window().then((win) => {
    foo = win.tags.foo
  })

  // variable "foo" is still undefined
  // because the above "then" callback
  // has not been executed yet
  expect(foo).to.equal('bar') // test fails
})
```

Instead, use [`cy.then()`](/api/commands/then) callback to check the value.

```javascript
it('equals bar', () => {
  let foo

  cy.window()
    .then((win) => {
      foo = win.tags.foo
    })
    .then(() => {
      // variable "foo" has been set
      expect(foo).to.equal('bar') // test passes
    })
})
```

### Start tests when app is ready

If an application takes a while to start, it might "signal" its readiness by
setting a property that Cypress can wait for.

```javascript
// app.js
// only set property "appReady" if Cypress is running tests
if (window.Cypress) {
  window.appReady = true
}
```

Cypress can wait for the property `window.appReady` to be `true` before every
test

```js
// spec.cy.js
beforeEach(() => {
  cy.visit('/')
  cy.window().should('have.property', 'appReady', true)
})
```

<Alert type="info">

<strong class="alert-header">When Can The Test Start?</strong>

[This blog post](https://www.cypress.io/blog/2018/02/05/when-can-the-test-start/)
explains how to use `cy.window()` to spy on the DOM `prototype` to detect when
the application starts adding event listeners to the DOM elements. When this
happens for the first time, Cypress knows that the application under test has
started and the tests can begin.

See
[Set flag to start tests](https://glebbahmutov.com/blog/set-flag-to-start-tests/)
for more examples.

</Alert>

### Options

#### Passes timeout through to [`.should()`](/api/commands/should) assertion

```javascript
cy.window({ timeout: 10000 }).should('have.property', 'foo')
```

## Notes

### Cypress uses 2 different windows.

Let's say you want to check the type of the events. You might write code like
below:

```js
it('test', (done) => {
  cy.get('#test-input').then((jQueryElement) => {
    let elemHtml = jQueryElement.get(0)

    elemHtml.addEventListener('keydown', (event) => {
      expect(event instanceof KeyboardEvent).to.be.true
      done()
    })
  })

  cy.get('#test-input').type('A')
})
```

It fails. But the interesting thing is that the type of `event` is
`KeyboardEvent` when you `console.log(event)`.

It's because Cypress uses an `iframe` to load the application under test. In
other words, the `KeyboardEvent` used in the the code above and the
`KeyboardEvent` class from which the `event` variable is constructed are
different `KeyboardEvent`s.

That's why the test should be written like this.

```js
it('should trigger KeyboardEvent with .type inside Cypress event listener', (done) => {
  cy.window().then((win) => {
    cy.get('#test-input').then((jQueryElement) => {
      let elemHtml = jQueryElement.get(0)

      elemHtml.addEventListener('keydown', (event) => {
        expect(event instanceof win['KeyboardEvent']).to.be.true
        done()
      })
    })
  })

  cy.get('#test-input').type('A')
})
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

<List><li>`cy.window()` requires being chained off of `cy`.</li></List>

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

<List><li>`cy.window()` will automatically
[retry](/guides/core-concepts/retry-ability) until all chained assertions have
passed</li></List>

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

<List><li>`cy.window()` can time out waiting for assertions you've added to
pass.</li></List>

## Command Log

**_Get the window_**

```javascript
cy.window()
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/window/window-command-log-for-cypress-tests.png" alt="Command Log window" ></DocsImage>

When clicking on `window` within the command log, the console outputs the
following:

<DocsImage src="/img/api/window/console-shows-the-applications-window-object-being-tested.png" alt="Console Log window" ></DocsImage>

## History

| Version                                       | Changes                                                                                     |
| --------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [0.20.0](/guides/references/changelog#0-20-0) | Can call [.focus()](/api/commands/focus) and [.blur()](/api/commands/blur) on `cy.window()` |
| [0.11.6](/guides/references/changelog#0-11-6) | `cy.window()` logs to Command Log                                                           |

## See also

- [`cy.visit()`](/api/commands/visit)
- [`cy.document()`](/api/commands/document)
- [`cy.its()`](/api/commands/its)
- [Adding custom properties to the global `window` with the right TypeScript type](https://github.com/bahmutov/test-todomvc-using-app-actions#intellisense)
- [Set flag to start tests](https://glebbahmutov.com/blog/set-flag-to-start-tests/)
