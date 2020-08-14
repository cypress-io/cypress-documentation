---
title: window
---

Get the `window` object of the page that is currently active.

# Syntax

```javascript
cy.window()
cy.window(options)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.window()
```

## Arguments

**{% fa fa-angle-right %} options** **_(Object)_**

Pass in an options object to change the default behavior of `cy.window()`.

| Option    | Default                                                  | Description                           |
| --------- | -------------------------------------------------------- | ------------------------------------- |
| `log`     | `true`                                                   | {% usage_options log %}               |
| `timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout cy.window %} |

## Yields {% helper_icon yields %}

{% yields sets_subject cy.window 'yields the `window` object' %}

# Examples

## No Args

### Yield the remote window object

```javascript
cy.visit('http://localhost:8080/app')
cy.window().then((win) => {
  // win is the remote window
  // of the page at: http://localhost:8080/app
})
```

### Check a custom property

If the application sets a custom property, like:

```javascript
window.tags = {
  foo: 'bar',
}
```

Our test can confirm the property was properly set.

```javascript
cy.window()
  .its('tags.foo')
  .should('equal', 'bar')
```

**Note:** Cypress commands are asynchronous, so you cannot check a property value before the Cypress commands ran.

```javascript
it('equals bar', () => {
  let foo

  cy.window()
    .then((win) => {
      foo = win.foo
    })

  // variable "foo" is still undefined
  // because the above "then" callback
  // has not been executed yet
  expect(foo).to.equal('bar') // test fails
})
```

Instead, use {% url `cy.then()` then %} callback to check the value.

```javascript
it('equals bar', () => {
  let foo

  cy.window()
    .then((win) => {
      foo = win.foo
    })
    .then(() => {
      // variable "foo" has been set
      expect(foo).to.equal('bar') // test passes
    })
})
```

## Start tests when app is ready

If an application takes a while to start, it might "signal" its readiness by setting a property that Cypress can wait for.

```javascript
// app.js
// only set property "appReady" if Cypress is running tests
if (window.Cypress) {
  window.appReady = true
}
```

Cypress Test Runner can wait for the property `window.appReady` to be `true` before every test

```javascript
// spec.js
beforeEach(() => {
  cy.visit('/')
  cy.window().should('have.property', 'appReady', true)
})
```

{% note info "When Can The Test Start?" %}
{% url "This blog post" https://www.cypress.io/blog/2018/02/05/when-can-the-test-start/ %} explains how to use `cy.window()` to spy on the DOM `prototype` to detect when the application starts adding event listeners to the DOM elements. When this happens for the first time, the Test Runner knows that the application has started and the tests can begin.

See {% url '"Set flag to start tests"' https://glebbahmutov.com/blog/set-flag-to-start-tests/ %} for more examples.
{% endnote %}

## Options

### Passes timeout through to {% url `.should()` should %} assertion

```javascript
cy.window({ timeout: 10000 }).should('have.property', 'foo')
```

# Notes 

## Cypress uses 2 different windows.

Let's say you want to check the type of the events. You might write code like below:

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

It fails. But the interesting thing is that the type of `event` is `KeyboardEvent` when you `console.log(event)`. 

It's because Cypress Runner uses `iframe` to load the test application. In other words, `KeyboardEvent` used in the the code above and the `KeyboardEvent` class from which `event` variable is constructed are different `KeyboardEvent`s. 

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

# Rules

## Requirements {% helper_icon requirements %}

{% requirements parent cy.window %}

## Assertions {% helper_icon assertions %}

{% assertions retry cy.window %}

## Timeouts {% helper_icon timeout %}

{% timeouts assertions cy.window %}

# Command Log

**_Get the window_**

```javascript
cy.window()
```

The commands above will display in the Command Log as:

{% imgTag /img/api/window/window-command-log-for-cypress-tests.png "Command Log window" %}

When clicking on `window` within the command log, the console outputs the following:

{% imgTag /img/api/window/console-shows-the-applications-window-object-being-tested.png "Console Log window" %}

{% history %}
{% url "0.20.0" changelog#0-20-0 %} | Can call {% url "`.focus()`" focus %} and {% url "`.blur()`" blur %} on `cy.window()`
{% url "0.11.6" changelog#0-11-6 %} | `cy.window()` logs to Command Log
{% endhistory %}

# See also

- {% url `cy.visit()` visit %}
- {% url `cy.document()` document %}
- {% url `cy.its()` its %}
- {% url 'Adding custom properties to the global `window` with the right TypeScript type' https://github.com/bahmutov/test-todomvc-using-app-actions#intellisense %}
- {% url 'Set flag to start tests' https://glebbahmutov.com/blog/set-flag-to-start-tests/ %}
