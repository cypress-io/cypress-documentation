---
title: Environment Variables
---

{% partial cypress_env_var_warning %}

Environment variables are useful when:

- Values are different across developer machines.
- Values are different across multiple environments: *(dev, staging, qa, prod)*
- Values change frequently and are highly dynamic.

Environment variables can be changed easily - especially when running in CI.

### Instead of hard coding this in your tests:

```javascript
cy.request('https://api.acme.corp') // this will break on other environments
```

### We can move this into a Cypress environment variable:

```javascript
cy.request(Cypress.env('EXTERNAL_API')) // points to a dynamic env var
```

{% note info "Using 'baseUrl'" %}
Environment variables are great at pointing to external services and servers, or storing password or other credentials.

However, you **do not** need to use environment variables to point to the origin and domain under test. Use `baseUrl` instead of environment variables.

{% url `cy.visit()` visit %} and {% url `cy.request()` request %} are automatically prefixed with this value - avoiding the need to specify them.

`baseUrl` can be set in your configuration file (`cypress.json` by default) - and then you can set an environment variable in your OS to override it like shown below.

```shell
CYPRESS_BASE_URL=https://staging.app.com cypress run
```

{% endnote %}

# Setting

There are 5 different ways to set environment variables. Each has a slightly different use case.

***To summarize you can:***

- {% urlHash "Set in your configuration file" Option-1-configuration-file %}
- {% urlHash "Create a `cypress.env.json`" Option-2-cypress-env-json %}
- {% urlHash "Export as `CYPRESS_*`" Option-3-CYPRESS %}
- {% urlHash "Pass in the CLI as `--env`" Option-4-env %}
- {% urlHash "Set an environment variable within your plugins." Option-5-Plugins %}
- {% urlHash "Set an environment variable within test configuration." Option-6-Test-Configuration %}

Don't feel obligated to pick just one method. It is common to use one strategy for local development but another when running in {% url 'CI' continuous-integration %}.

When your tests are running, you can use the {% url `Cypress.env` env %} function to access the values of your environment variables.

## Option #1: configuration file

Any key/value you set in your {% url "configuration file (`cypress.json` by default)" configuration %} under the `env` key will become an environment variable.

```json
{
  "projectId": "128076ed-9868-4e98-9cef-98dd8b705d75",
  "env": {
    "login_url": "/login",
    "products_url": "/products",
  }
}
```

### Test file

```javascript
Cypress.env()               // {login_url: '/login', products_url: '/products'}
Cypress.env('login_url')    // '/login'
Cypress.env('products_url') // '/products'
```

### Overview

{% note success Benefits %}
- Great for values that need to be checked into source control and remain the same on all machines.
{% endnote %}

{% note danger Downsides %}
- Only works for values that should be the same on across all machines.
{% endnote %}

## Option #2: `cypress.env.json`

You can create your own `cypress.env.json` file that Cypress will automatically check. Values in here will overwrite conflicting environment variables in your {% url "configuration file (`cypress.json` by default)" configuration %}.

This strategy is useful because if you add `cypress.env.json` to your `.gitignore` file, the values in here can be different for each developer machine.

```json
{
  "host": "veronica.dev.local",
  "api_server": "http://localhost:8888/api/v1/"
}
```

### From test file

```javascript
Cypress.env()             // {host: 'veronica.dev.local', api_server: 'http://localhost:8888/api/v1'}
Cypress.env('host')       // 'veronica.dev.local'
Cypress.env('api_server') // 'http://localhost:8888/api/v1/'
```

### An Overview

{% note success Benefits %}
- Dedicated file just for environment variables.
- Enables you to generate this file from other build processes.
- Values can be different on each machine (if not checked into source control).
- Supports nested fields (objects), e.g. `{ testUser: { name: '...', email: '...' } }`.
{% endnote %}

{% note danger Downsides %}
- Another file you have to deal with.
- Overkill for 1 or 2 environment variables.
{% endnote %}

## Option #3: `CYPRESS_*`

Any OS-level environment variable on your machine that starts with either `CYPRESS_` or `cypress_` will automatically be added to Cypress' environment variables and made available to you.

Conflicting values will override values from your configuration file (`cypress.json` by default) and `cypress.env.json` files.

Cypress will *strip off* the `CYPRESS_` when adding your environment variables.

{% note danger %}
The environment variable `CYPRESS_INTERNAL_ENV` is reserved and should not be set.
{% endnote %}

### Export cypress env variables from the command line

```shell
export CYPRESS_HOST=laura.dev.local
```

```shell
export cypress_api_server=http://localhost:8888/api/v1/
```

### In test file

In your test file you should omit `CYPRESS_` or `cypress_` prefix

```javascript
Cypress.env()             // {HOST: 'laura.dev.local', api_server: 'http://localhost:8888/api/v1'}
Cypress.env('HOST')       // 'laura.dev.local'
Cypress.env('api_server') // 'http://localhost:8888/api/v1/'
```

### Overview:

{% note success Benefits %}
- Quickly export some values.
- Can be stored in your `bash_profile`.
- Allows for dynamic values between different machines.
- Especially useful for CI environments.
{% endnote %}

{% note danger Downsides %}
- Not as obvious where values come from versus the other options.
- No support for nested fields.
{% endnote %}

## Option #4: `--env`

Lastly you can pass in environment variables as options when {% url 'using the CLI tool' command-line#cypress-run %}.

Values here will overwrite all other conflicting environment variables.

You can use the `--env` argument for {% url '`cypress run`' command-line#cypress-run %}.

{% note warning  %}
Multiple values must be separated by a comma, not a space.
{% endnote %}

### From the command line or CI

```shell
cypress run --env host=kevin.dev.local,api_server=http://localhost:8888/api/v1
```

### Test file:

```javascript
Cypress.env()             // {host: 'kevin.dev.local', api_server: 'http://localhost:8888/api/v1'}
Cypress.env('host')       // 'kevin.dev.local'
Cypress.env('api_server') // 'http://localhost:8888/api/v1/'
```

### Overview -

{% note success Benefits %}
- Does not require any changes to files or configuration.
- More clear where environment variables come from.
- Allows for dynamic values between different machines.
- Overwrites all other forms of setting env variables.
{% endnote %}

{% note danger Downsides %}
- Pain to write the `--env` options everywhere you use Cypress.
- No support for nested fields.
{% endnote %}

## Option #5: Plugins

Instead of setting environment variables in a file, you can use plugins to dynamically set them with Node code. This enables you to do things like use `fs` and read off configuration values and dynamically change them. 

For example, if you use the {% url dotenv https://github.com/motdotla/dotenv#readme %} package to read the `.env` file, you could then grab the needed environment variables from the `process.env` object and place them into `config.env` to make available in the tests:

```
// .env file
USER_NAME=aTester
```

```js
// plugins/index.js
require('dotenv').config()
module.exports = (on, config) => {
  // copy any needed variables from process.env to config.env
  config.env.username = process.env.USER_NAME

  // do not forget to return the changed config object!
  return config
}

// integration/spec.js
it('has username to use', () => {
  expect(Cypress.env('username')).to.be.a('string')
})
```

{% url "We've fully documented how to do this here." configuration-api %}

### Overview

{% note success Benefits %}
- Most amount of flexibility
- Ability to manage configuration however you'd like
{% endnote %}

{% note danger Downsides %}
- Requires knowledge of writing in Node
- More challenging
{% endnote %}

## Option #6: Test Configuration

You can set environment variables for specific suites or tests by passing the `env` values to the {% url "test configuration" configuration#Test-Configuration %}.

### Suite of test configuration

```js
// change environment variable for single suite of tests
describe('test against Spanish site', {
  env: {
    language: 'es'
  }
}, () => {
  it('displays Spanish', () => {
    cy.visit(`https://docs.cypress.io/${Cypress.env('language')}/`)
    cy.contains('¿Por qué Cypress?')
  })
})
```

### Single test configuration

```js
// change environment variable for single test
it('smoke test develop api', {
  env: {
    api: 'https://dev.myapi.com'
  }
}, () => {
  cy.request(Cypress.env('api')).its('status').should('eq', 200)
})

// change environment variable for single test
it('smoke test staging api', {
  env: {
    api: 'https://staging.myapi.com'
  }
}, () => {
  cy.request(Cypress.env('api')).its('status').should('eq', 200)
})
```

### Overview

{% note success Benefits %}
- Only takes effect for duration of suite or test.
- More clear where environment variables come from.
- Allows for dynamic values between tests
{% endnote %}

# Overriding Configuration

If your environment variables match a standard configuration key, then instead of setting an `environment variable` they will instead override the configuration value.

***Change the `baseUrl` configuration value / not set env var in `Cypress.env()`***

```shell
export CYPRESS_BASE_URL=http://localhost:8080
```

***'foo' does not match config / sets env var in `Cypress.env()`***

```shell
export CYPRESS_FOO=bar
```

You can {% url 'read more about how environment variables can change configuration here' configuration %}.

# See also

- {% url "`Cypress.env()`" env %}
- {% url "Configuration API" configuration-api %}
- {% url "Environment Variables recipe" recipes#Fundamentals %}
- {% url "Test Configuration" configuration#Test-Configuration %}
- {% url "Pass environment variables: tips and tricks" https://glebbahmutov.com/blog/cypress-tips-and-tricks/#pass-the-environment-variables-correctly %}
- {% url "Keep passwords secret in E2E tests" https://glebbahmutov.com/blog/keep-passwords-secret-in-e2e-tests/ %}
