---
title: Cypress.env
---

`get` and `set` environment variables _in your tests_.

<Alert type="info">

The [Environment Variable](/guides/guides/environment-variables) guide explains
the other ways you can set them _outside of your tests_.

</Alert>

<Alert type="warning">

<strong class="alert-header">Scope</strong>

Environment variables set using `Cypress.env` _are only in scope for the current
spec file._

Cypress runs each spec file in isolation: the browser is exited between specs.
Environment variables added or changed in one spec won't be visible in other
specs.

</Alert>

<Alert type="warning">

<strong class="alert-header">Difference between OS-level and Cypress environment
variables</strong>

In Cypress, "environment variables" are variables that are accessible via
`Cypress.env`. These are not the same as OS-level environment variables.
However,
[it is possible to set Cypress environment variables from OS-level environment variables](/guides/guides/environment-variables.html#Option-3-CYPRESS).

</Alert>

## Syntax

```javascript
Cypress.env()
Cypress.env(name)
Cypress.env(name, value)
Cypress.env(object)
```

### Arguments

**<Icon name="angle-right"></Icon> name** **_(String)_**

The name of the environment variable to get or set.

**<Icon name="angle-right"></Icon> value** **_(String)_**

The value of the environment variable to set.

**<Icon name="angle-right"></Icon> object** **_(Object)_**

Set multiple environment variables with an object literal.

## Examples

### No Arguments

#### Get all environment variables from the configuration file

```json
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

### Name

#### Return a single environment variable from the configuration file

<Alert type="warning">

<strong class="alert-header">Boolean</strong>

We automatically normalize both the key and the value when passed via the
command line. Cypress will automatically convert values into Number or Boolean.

</Alert>

```javascript
CYPRESS_HOST=laura.dev CYPRESS_IS_CI=true CYPRESS_MY_ID=123 cypress run
```

```javascript
Cypress.env('HOST') // => "laura.dev"
Cypress.env('IS_CI') // => true
Cypress.env('MY_ID') // => 123
```

### Name and Value

#### Change environment variables from the configuration file from within your tests

<Alert type="warning">

<strong class="alert-header">Scope</strong>

Remember, any changes that you make to environment variables using this API will
only be in effect for the remainder of the tests _in the same spec file._

</Alert>

```json
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

### Object

#### Override multiple values from the configuration file by passing an object literal.

```javascript
// configuration file
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
  foo: 'foo',
})

Cypress.env() // => {foo: "foo", baz: "quux", host: "http://server.dev.local"}
```

### From a plugin

Here's an example that uses `Cypress.env` to access an environment variable
that's been
[dynamically set in a plugin](/guides/guides/environment-variables#Option-5-Plugins).

Use this approach to grab the value of an environment variable _once_ before any
of the tests in your spec run.

```js
// cypress/plugins/index.js
module.exports = (on, config) => {
  config.env.sharedSecret =
    process.env.NODE_ENV === 'qa' ? 'hoop brick tort' : 'sushi cup lemon'

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

## Notes

### Why would I ever need to use environment variables?

The [Environment Variables](/guides/guides/environment-variables) guide explains
common use cases.

### Can I pass in environment variables from the command line?

Yes. You can do that and much more.

The [Environment Variables](/guides/guides/environment-variables) guide explains
the other ways you can set environment variables for your tests.

### Why is it `Cypress.env` and not `cy.env`?

As a rule of thumb anything you call from `Cypress` affects global state.
Anything you call from `cy` affects local state.

Since the environment variables added or changed by `Cypress.env` are only in
scope for the current spec file, you'd think that it should be `cy.env` and not
`Cypress.env`&hellip; and you'd be right. The fact that `Cypress.env` affects
local state is an artifact of the API evolving over time: `Cypress.env` used to
affect global state&mdash;environment variables added in one test spec file were
available in other specs&mdash;but the Cypress team wisely made each spec run in
isolation in [`3.0.0`](/guides/references/changelog#3-0-0) and by that time
`Cypress.env` was public API.

## See also

- The [Environment Variable](/guides/guides/environment-variables) guide
- [configuration file](/guides/references/configuration)
