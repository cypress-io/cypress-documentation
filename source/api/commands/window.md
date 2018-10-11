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

**{% fa fa-angle-right %} options** ***(Object)***

Pass in an options object to change the default behavior of `cy.window()`.

Option | Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`timeout` | {% url `defaultCommandTimeout` configuration#Timeouts %} | {% usage_options timeout cy.window %}

## Yields {% helper_icon yields %}

{% yields sets_subject cy.window 'yields the `window` object' %}

# Examples

## No Args

***Yields the remote window object***

```javascript
cy.visit('http://localhost:8080/app')
cy.window().then((win) => {
  // win is the remote window
  // of the page at: http://localhost:8080/app
})
```

## Starting tests when the application is ready

If an application takes a while to start, it might "signal" its readiness by setting a property that Cypress can wait for.

```javascript
// app.js
// only set property "appReady" if Cypress is running tests
if (window.Cypress) {
  window.appReady = true
}
```

Cypress test runner can wait for the property `window.appReady` to be `true` before every test

```javascript
// spec.js
beforeEach(() => {
  cy.visit('/')
  cy.window().should('have.property', 'appReady', true)
})
```

See {% url "Set flag to start tests" https://glebbahmutov.com/blog/set-flag-to-start-tests/ %} for more examples.

## Options

***Passes timeout through to {% url `.should()` should %} assertion***

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

***Get the window***

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
- {% url "When Can The Test Start?" https://www.cypress.io/blog/2018/02/05/when-can-the-test-start/ %} uses `cy.window` to spy on DOM prototype to detect when the application starts adding event listeners to the DOM elements. When this happens for the first time, Cypress test runner knows that the application has started, and the tests can begin.
