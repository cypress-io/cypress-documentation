---
title: Cypress.env
---

`get` and `set` environment variables *in your tests*.

{% note info %}
The {% url 'Environment Variable' environment-variables %} guide explains the other ways you can set them *outside of your tests*.
{% endnote %}

{% note warning Scope %}
Environment variables set using `Cypress.env` _are only in scope for the current spec file._

Cypress runs each spec file in isolation: the browser is exited between specs. Environment variables added or changed in one spec won't be visible in other specs.
{% endnote %}

# Syntax

```javascript
Cypress.env()
Cypress.env(name)
Cypress.env(name, value)
Cypress.env(object)
```

## Arguments

**{% fa fa-angle-right %} name**  ***(String)***

The name of the environment variable to get or set.

**{% fa fa-angle-right %} value**  ***(String)***

The value of the environment variable to set.

**{% fa fa-angle-right %} object**  ***(Object)***

Set multiple environment variables with an object literal.

# Examples

## No Arguments

**Get all environment variables.**

```javascript
// cypress.json
{
  "env": {
    "foo": "bar",
    "baz": "quux"
  }
}
```

```javascript
Cypress.env() // => {foo: "bar", baz: "quux"}
```

## Name

**Return a single environment variable value.**

```javascript
// cypress.json
{
  "env": {
    "foo": "bar",
    "baz": "quux"
  }
}
```

```javascript
Cypress.env('foo') // => bar
Cypress.env('baz') // => quux
```

## Name and Value

**Cypress allows you to change the values of your environment variables from within your tests.**

{% note warning Scope %}
Remember, any changes that you make to environment variables using this API will only be in effect for the remainder of the tests _in the same spec file._
{% endnote %}

```javascript
// cypress.json
{
  "env": {
    "foo": "bar",
    "baz": "quux"
  }
}
```

```javascript
Cypress.env('host', 'http://server.dev.local')

Cypress.env('host') // => http://server.dev.local
```

## Object

**You can set multiple values by passing an object literal.**

```javascript
// cypress.json
{
  "env": {
    "foo": "bar",
    "baz": "quux"
  }
}
```

```javascript
Cypress.env({
  host: 'http://server.dev.local',
  foo: 'foo'
})

Cypress.env() // => {foo: "foo", baz: "quux", host: "http://server.dev.local"}
```

## From a plugin

Here's an example that uses `Cypress.env` to access an environment variable that's been {% url 'dynamically set in a plugin' environment-variables#Option-5-Plugins %}.

Use this approach to grab the value of an environment variable _once_ before any of the tests in your spec run.

```js
// cypress/plugins/index.js
module.exports = (on, config) => {

  config.env.sharedSecret = process.env.NODE_ENV === 'qa'
    ? 'hoop brick tort'
    : 'sushi cup lemon'

  return config
}
```
```js
// cypress/integration/secrets_spec.js
describe('Environment variable set in plugin', () => {

  let sharedSecret

  before(() => {
    sharedSecret = Cypress.env('sharedSecret')
  })

  it.only('can be accessed within test.', () => {
    cy.log(sharedSecret)
  })
})
```

# Notes

**Why would I ever need to use environment variables?**

The {% url 'Environment Variables' environment-variables %} guide explains common use cases.

**Can I pass in environment variables from the command line?**

Yes. You can do that and much more.

The {% url 'Environment Variables' environment-variables %} guide explains the other ways you can set environment variables for your tests.

**Why is it `Cypress.env` and not `cy.env`?**

As a rule of thumb anything you call from `Cypress` affects global state. Anything you call from `cy` affects local state.

Since the environment variables added or changed by `Cypress.env` are only in scope for the current spec file, you'd think that it should be `cy.env` and not `Cypress.env`&hellip; and you'd be right. The fact that `Cypress.env` affects local state is an artifact of the API evolving over time: `Cypress.env` used to affect global state&mdash;environment variables added in one test spec file were available in other specs&mdash;but the Cypress team wisely made each spec run in isolation in {% url `3.0.0` changelog#3-0-0 %} and by that time `Cypress.env` was public API.

# See also

- The {% url 'Environment Variable' environment-variables %} guide
- {% url 'configuration' configuration %}
