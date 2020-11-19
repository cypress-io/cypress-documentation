---
title: Cypress.config
---

`get` and `set` configuration options *in your tests*.

{% note info New to Cypress? %}
{% url 'Read about configuration first.' configuration %}
{% endnote %}

{% note warning Scope %}
Configuration set using `Cypress.config` _is only in scope for the current spec file._

Cypress runs each spec file in isolation: the browser is exited between specs. Configuration changed in one spec won't be visible in other specs.
{% endnote %}

{% note warning Note %}
Not all configuration values can be changed during runtime. See {% urlHash "Notes" Notes %} below for details.
{% endnote %}

# Syntax

```javascript
Cypress.config()
Cypress.config(name)
Cypress.config(name, value)
Cypress.config(object)
```

## Arguments

**{% fa fa-angle-right %} name**  ***(String)***

The name of the configuration to get or set.

**{% fa fa-angle-right %} value**  ***(String)***

The value of the configuration to set.

**{% fa fa-angle-right %} object**  ***(Object)***

Set multiple configuration options with an object literal.

# Examples

## No Arguments

### Get all configuration options from {% url 'configuration' configuration %} file (`cypress.json` by default)

```json
{
  "defaultCommandTimeout": 10000
}
```

<!-- textlint-disable -->

```javascript
Cypress.config() // => {defaultCommandTimeout: 10000, pageLoadTimeout: 30000, ...}
```
<!-- textlint-enable -->

## Name

### Return a single configuration option from {% url 'configuration' configuration %} file (`cypress.json` by default)

```json
{
  "pageLoadTimeout": 60000
}
```

```javascript
Cypress.config('pageLoadTimeout') // => 60000
```

## Name and Value

### Change the values of configuration options from configuration file (`cypress.json` by default) from within your tests

{% note warning Scope %}
Remember, any changes that you make to configuration using this API will only be in effect for the remainder of the tests _in the same spec file._
{% endnote %}

```json
{
  "viewportWidth": 1280,
  "viewportHeight": 720
}
```

```javascript
Cypress.config('viewportWidth', 800)

Cypress.config('viewportWidth') // => 800
```

## Object

### Override multiple options from configuration file (`cypress.json` by default) by passing an object literal

```json
{
  "defaultCommandTimeout": 4000,
  "pageLoadTimeout": 30000,
}
```

```javascript
Cypress.config({
  defaultCommandTimeout: 10000,
  viewportHeight: 900
})

Cypress.config() // => {defaultCommandTimeout: 10000, viewportHeight: 900, ...}
```

# Notes

## Not all config values can be changed at all times

Some configuration values cannot be changed while running a test. Anything that's not directly under Cypress's control - like timeouts, `userAgent`, or environment variables - will be ignored at run-time.

## Test Configuration

To apply specific Cypress {% url "configuration" configuration %} values to a suite or test, you can pass a {% url "test configuration" configuration#Test-Configuration %} object to the test or suite function.

While `Cypress.config()` changes configuration values through the entire spec file, using test configuration will only change configuration values during the suite or test where they are set. The values will then reset to the previous default values after the suite or test is complete.

See the full guide on {% url "test configuration", configuration#Test-Configuration %}.

## Why is it `Cypress.config` and not `cy.config`?

As a rule of thumb anything you call from `Cypress` affects global state. Anything you call from `cy` affects local state.

Since the configuration added or changed by `Cypress.config` is only in scope for the current spec file, you'd think that it should be `cy.config` and not `Cypress.config`&hellip;and you'd be right. The fact that `Cypress.config` affects local state is an artifact of the API evolving over time: `Cypress.config` used to affect global state&mdash;configuration added in one test spec file was available in other specs&mdash;but the Cypress team wisely made each spec run in isolation in {% url `3.0.0` changelog#3-0-0 %} and by that time `Cypress.config` was public API.

{% history %}
0.12.6 | `Cypress.config` added
{% endhistory %}

# See also

- {% url 'configuration' configuration %}
- The {% url 'Environment Variable' environment-variables %} guide
- {% url "Test Configuration" configuration#Test-Configuration %}
