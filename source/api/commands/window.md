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
    .then(() =>
      // variable "foo" has been set
      expect(foo).to.equal('bar') // test passes
    )
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

![Command Log](/img/api/window/window-command-log-for-cypress-tests.png)

When clicking on `window` within the command log, the console outputs the following:

![Console Log](/img/api/window/console-shows-the-applications-window-object-being-tested.png)

# See also

- {% url `cy.visit()` visit %}
- {% url `cy.document()` document %}
- {% url `cy.its()` its %}
