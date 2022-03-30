---
title: Environment Variables
---

<Alert type="warning">

<strong class="alert-header">Difference between OS-level and Cypress environment
variables</strong>

In Cypress, "environment variables" are variables that are accessible via
`Cypress.env`. These are not the same as OS-level environment variables.
However,
[it is possible to set Cypress environment variables from OS-level environment variables](/guides/guides/environment-variables#Option-3-CYPRESS).

</Alert>

Environment variables are useful when:

- Values are different across developer machines.
- Values are different across multiple environments: _(dev, staging, qa, prod)_
- Values change frequently and are highly dynamic.

Environment variables can be changed easily - especially when running in CI.

#### Instead of hard coding this in your tests:

```javascript
cy.request('https://api.acme.corp') // this will break on other environments
```

#### We can move this into a Cypress environment variable:

```javascript
cy.request(Cypress.env('EXTERNAL_API')) // points to a dynamic env var
```

<Alert type="info">

<strong class="alert-header">Using 'baseUrl'</strong>

Environment variables are great at pointing to external services and servers, or
storing password or other credentials.

However, you **do not** need to use environment variables to point to the origin
and domain under test. Use `baseUrl` instead of environment variables.

[`cy.visit()`](/api/commands/visit) and [`cy.request()`](/api/commands/request)
are automatically prefixed with this value - avoiding the need to specify them.

`baseUrl` can be set in the Cypress configuration file - and then you can set an
environment variable in your OS to override it like shown below.

```shell
CYPRESS_BASE_URL=https://staging.app.com cypress run
```

</Alert>

## Setting

There are different ways to set environment variables. Each has a slightly
different use case.

**_To summarize you can:_**

- [Set in your configuration file](#Option-1-configuration-file)
- [Create a `cypress.env.json`](#Option-2-cypress-env-json)
- [Export as `CYPRESS_*`](#Option-3-CYPRESS_)
- [Pass in the CLI as `--env`](#Option-4-env)
- [Set an environment variable within test configuration.](#Option-5-Test-Configuration)

Don't feel obligated to pick just one method. It is common to use one strategy
for local development but another when running in
[CI](/guides/continuous-integration/introduction).

When your tests are running, you can use the
[`Cypress.env`](/api/cypress-api/env) function to access the values of your
environment variables.

### Option #1: configuration file

Any key/value you set in your
[Cypress configuration](/guides/references/configuration) under the `env` key
will become an environment variable.

:::cypress-config-example

```js
{
  projectId: '128076ed-9868-4e98-9cef-98dd8b705d75',
  env: {
    login_url: '/login',
    products_url: '/products'
  }
}
```

:::

#### Test file

```javascript
Cypress.env() // {login_url: '/login', products_url: '/products'}
Cypress.env('login_url') // '/login'
Cypress.env('products_url') // '/products'
```

#### Overview

<Alert type="success">

<strong class="alert-header">Benefits</strong>

- Great for values that need to be checked into source control and remain the
  same on all machines.

</Alert>

<Alert type="danger">

<strong class="alert-header">Downsides</strong>

- Only works for values that should be the same on across all machines.

</Alert>

### Option #2: `cypress.env.json`

You can create your own `cypress.env.json` file that Cypress will automatically
check. Values in here will overwrite conflicting environment variables in your
[Cypress configuration](/guides/references/configuration).

This strategy is useful because if you add `cypress.env.json` to your
`.gitignore` file, the values in here can be different for each developer
machine.

```json
{
  "host": "veronica.dev.local",
  "api_server": "http://localhost:8888/api/v1/"
}
```

#### From test file

```javascript
Cypress.env() // {host: 'veronica.dev.local', api_server: 'http://localhost:8888/api/v1'}
Cypress.env('host') // 'veronica.dev.local'
Cypress.env('api_server') // 'http://localhost:8888/api/v1/'
```

#### An Overview

<Alert type="success">

<strong class="alert-header">Benefits</strong>

- Dedicated file just for environment variables.
- Enables you to generate this file from other build processes.
- Values can be different on each machine (if not checked into source control).
- Supports nested fields (objects), e.g.
  `{ testUser: { name: '...', email: '...' } }`.

</Alert>

<Alert type="danger">

<strong class="alert-header">Downsides</strong>

- Another file you have to deal with.
- Overkill for 1 or 2 environment variables.

</Alert>

### Option #3: `CYPRESS_*`

Any exported environment variables set on the command line or in your CI
provider that start with either `CYPRESS_` or `cypress_` will automatically be
parsed by Cypress.

<Alert type="danger">

The environment variable `CYPRESS_INTERNAL_ENV` is reserved and should not be
set.

</Alert>

#### Overriding configuration options

Environment variables that match a corresponding configuration option will
override any value set in the
[Cypress configuration](/guides/references/configuration).

<Alert type="info">

Cypress automatically normalizes both the key and the value. The leading
`CYPRESS_` or `cypress_` is removed and the remaining name is camelCased, while
values are converted to `Number` or `Boolean` wherever possible.

</Alert>

For example, these enviroment variables in the command line will override any
`viewportWidth` or `viewportHeight` options set in the Cypress configuration:

```shell
export CYPRESS_VIEWPORT_WIDTH=800
export CYPRESS_VIEWPORT_HEIGHT=600
```

#### Overriding environment variables

Environment variables that do not match configuration options will be set as
environment variables for use in tests with
[`Cypress.env()`](/api/cypress-api/env), and will override any existing values
in the Cypress configuration `env` object and `cypress.env.json` files.

<Alert type="info">

Cypress automatically removes the leading `CYPRESS_` or `cypress_` from any
environment variable name specified in this way.

</Alert>

For example, these environment variables in the command line:

```shell
export CYPRESS_HOST=laura.dev.local
export cypress_api_server=http://localhost:8888/api/v1/
```

Will yield these results inside a test file:

```javascript
Cypress.env() // {HOST: 'laura.dev.local', api_server: 'http://localhost:8888/api/v1'}
Cypress.env('HOST') // 'laura.dev.local'
Cypress.env('api_server') // 'http://localhost:8888/api/v1/'
```

#### Overview:

<Alert type="success">

<strong class="alert-header">Benefits</strong>

- Quickly export some values.
- Can be stored in your `bash_profile`.
- Allows for dynamic values between different machines.
- Especially useful for CI environments.

</Alert>

<Alert type="danger">

<strong class="alert-header">Downsides</strong>

- Not as obvious where values come from versus the other options.
- No support for nested fields.

</Alert>

### Option #4: `--env`

You can pass in environment variables as options when
[using the CLI tool](/guides/guides/command-line#cypress-run).

Values here will overwrite all other conflicting environment variables.

You can use the `--env` argument for
[cypress run](/guides/guides/command-line#cypress-run).

<Alert type="warning">

Multiple values must be separated by a comma, not a space.

</Alert>

#### From the command line or CI

```shell
cypress run --env host=kevin.dev.local,api_server=http://localhost:8888/api/v1
```

#### Test file:

```javascript
Cypress.env() // {host: 'kevin.dev.local', api_server: 'http://localhost:8888/api/v1'}
Cypress.env('host') // 'kevin.dev.local'
Cypress.env('api_server') // 'http://localhost:8888/api/v1/'
```

#### Overview -

<Alert type="success">

<strong class="alert-header">Benefits</strong>

- Does not require any changes to files or configuration.
- More clear where environment variables come from.
- Allows for dynamic values between different machines.
- Overwrites all other forms of setting env variables.

</Alert>

<Alert type="danger">

<strong class="alert-header">Downsides</strong>

- Pain to write the `--env` options everywhere you use Cypress.
- No support for nested fields.

</Alert>

### Option #5: Test Configuration

You can set environment variables for specific suites or tests by passing the
`env` values to the
[test configuration](/guides/references/configuration#Test-Configuration).

#### Suite of test configuration

:::visit-mount-test-example

```js
cy.visit(`https://docs.cypress.io/${Cypress.env('language')}/`)
```

```js
cy.mount(<International lang={Cypress.env('language')} />)
```

```js
// change environment variable for single suite of tests
describe(
  'test against Spanish content',
  {
    env: {
      language: 'es',
    },
  },
  () => {
    it('displays Spanish', () => {
      __VISIT_MOUNT_PLACEHOLDER__
      cy.contains('¿Por qué Cypress?')
    })
  }
)
```

:::

#### Single test configuration

```js
// change environment variable for single test
it(
  'smoke test develop api',
  {
    env: {
      api: 'https://dev.myapi.com',
    },
  },
  () => {
    cy.request(Cypress.env('api')).its('status').should('eq', 200)
  }
)

// change environment variable for single test
it(
  'smoke test staging api',
  {
    env: {
      api: 'https://staging.myapi.com',
    },
  },
  () => {
    cy.request(Cypress.env('api')).its('status').should('eq', 200)
  }
)
```

#### Overview

<Alert type="success">

<strong class="alert-header">Benefits</strong>

- Only takes effect for duration of suite or test.
- More clear where environment variables come from.
- Allows for dynamic values between tests

</Alert>

## Overriding Configuration

If your environment variables match a standard configuration key, then instead
of setting an `environment variable` they will instead override the
configuration value.

**_Change the `baseUrl` configuration value / not set env var in
`Cypress.env()`_**

```shell
export CYPRESS_BASE_URL=http://localhost:8080
```

**_'foo' does not match config / sets env var in `Cypress.env()`_**

```shell
export CYPRESS_FOO=bar
```

You can
[read more about how environment variables can change configuration here](/guides/references/configuration).

## See also

- [Cypress.env()](/api/cypress-api/env)
- [Configuration API](/api/plugins/configuration-api)
- [Environment Variables recipe](/examples/examples/recipes#Fundamentals)
- [Test Configuration](/guides/references/configuration#Test-Configuration)
- [Pass environment variables: tips and tricks](https://glebbahmutov.com/blog/cypress-tips-and-tricks/#pass-the-environment-variables-correctly)
- [Keep passwords secret in E2E tests](https://glebbahmutov.com/blog/keep-passwords-secret-in-e2e-tests/)
