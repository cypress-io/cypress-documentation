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

**Get all configuration options.**

```javascript
// cypress.json

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

**Return just a single configuration option value.**

```javascript
// cypress.json

{
  "pageLoadTimeout": 60000
}
```

```javascript
Cypress.config('pageLoadTimeout') // => 60000
```

## Name and Value

**Cypress allows you to change the values of your configuration options from within your tests.**

{% note warning Scope %}
Remember, any changes that you make to configuration using this API will only be in effect for the remainder of the tests _in the same spec file._
{% endnote %}

```javascript
// cypress.json

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

**You can set multiple values by passing an object literal.**


```javascript
// cypress.json

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

## Why is it `Cypress.config` and not `cy.config`?

As a rule of thumb anything you call from `Cypress` affects global state. Anything you call from `cy` affects local state.

Since the configuration added or changed by `Cypress.config` is only in scope for the current spec file, you'd think that it should be `cy.config` and not `Cypress.config`&hellip;and you'd be right. The fact that `Cypress.config` affects local state is an artifact of the API evolving over time: `Cypress.config` used to affect global state&mdash;configuration added in one test spec file was available in other specs&mdash;but the Cypress team wisely made each spec run in isolation in {% url `3.0.0` changelog#3-0-0 %} and by that time `Cypress.config` was public API.

# See also

- {% url 'configuration' configuration %}
- The {% url 'Environment Variable' environment-variables %} guide
