---
title: 環境変数
---

Environment variables are useful when:

- Values are different across developer machines.
- Values are different across multiple environments: *(dev, staging, qa, prod)*
- Values change frequently and are highly dynamic.

Environment variables can be changed easily - especially when running in CI.

### Instead of hard coding this in your tests:

```javascript
cy.request('https://api.acme.corp') // this will break on other environments
```

### We can move this into an environment variable.

```javascript
cy.request(Cypress.env('EXTERNAL_API')) // points to a dynamic env var
```

{% note info "Using 'baseUrl'" %}
Environment variables are great at pointing to external services and servers, or storing password or other credentials.

However, you **do not** need to use environment variables to point to the origin and domain under test. Use `baseUrl` instead of environment variables.

{% url `cy.visit()` visit %} and {% url `cy.request()` request %} are automatically prefixed with this value - avoiding the need to specify them.

`baseUrl` can be set in your `cypress.json` - and then you can use an environment variable to override it.

```shell
CYPRESS_baseUrl=https://staging.app.com cypress run
```
{% endnote %}

# Setting

There are 5 different ways to set environment variables. Each has a slightly different use case.

***To summarize you can:***

- {% urlHash "Set in `cypress.json`" Option-1-cypress-json %}
- {% urlHash "Create a `cypress.env.json`" Option-2-cypress-env-json %}
- {% urlHash "Export as `CYPRESS_*`" Option-3-CYPRESS %}
- {% urlHash "Pass in the CLI as `--env`" Option-4-env %}
- {% urlHash "Set an environment variable within your plugins." Option-5-Plugins %}

Don't feel obligated to pick just one method. It is common to use one strategy for local development but another when running in {% url 'CI' continuous-integration %}.

When your tests are running, you can use the {% url `Cypress.env` env %} function to access the values of your environment variables.

## Option #1: `cypress.json`

Any key/value you set in your {% url 'configuration' configuration %} under the `env` key will become an environment variable.

```javascript
// cypress.json
{
  "projectId": "128076ed-9868-4e98-9cef-98dd8b705d75",
  "env": {
    "foo": "bar",
    "some": "value"
  }
}
```

### Test file

```javascript
Cypress.env()       // {foo: 'bar', some: 'value'}
Cypress.env('foo')  // 'bar'
Cypress.env('some') // 'value'
```

### Overview

{% note success Benefits %}
- Great for values that need to be checked into source control and remain the same on all machines.
{% endnote %}

{% note danger Downsides %}
- Only works for values that should be the same on across all machines.
{% endnote %}

## Option #2: `cypress.env.json`

You can create your own `cypress.env.json` file that Cypress will automatically check. Values in here will overwrite conflicting environment variables in `cypress.json`.

This strategy is useful because if you add `cypress.env.json` to your `.gitignore` file, the values in here can be different for each developer machine.

```javascript
// cypress.env.json
{
  "host": "veronica.dev.local",
  "api_server": "http://localhost:8888/api/v1/"
}
```

### Test file

```javascript
Cypress.env()             // {host: 'veronica.dev.local', api_server: 'http://localhost:8888/api/v1'}
Cypress.env('host')       // 'veronica.dev.local'
Cypress.env('api_server') // 'http://localhost:8888/api/v1/'
```

### Overview

{% note success Benefits %}
- Dedicated file just for environment variables.
- Enables you to generate this file from other build processes.
- Values can be different on each machine (if not checked into source control).
{% endnote %}

{% note danger Downsides %}
- Another file you have to deal with.
- Overkill for 1 or 2 environment variables.
{% endnote %}

## Option #3: `CYPRESS_*`

Any environment variable on your machine that starts with either `CYPRESS_` or `cypress_` will automatically be added and made available to you.

Conflicting values will override values from `cypress.json` and `cypress.env.json` files.

Cypress will *strip off* the `CYPRESS_` when adding your environment variables.

### Export cypress env variables from the command line

```shell
export CYPRESS_HOST=laura.dev.local
```

```shell
export cypress_api_server=http://localhost:8888/api/v1/
```

### Test file

```javascript
Cypress.env()             // {HOST: 'laura.dev.local', api_server: 'http://localhost:8888/api/v1'}
Cypress.env('HOST')       // 'laura.dev.local'
Cypress.env('api_server') // 'http://localhost:8888/api/v1/'
```

### Overview

{% note success Benefits %}
- Quickly export some values.
- Can be stored in your `bash_profile`.
- Allows for dynamic values between different machines.
- Especially useful for CI environments.
{% endnote %}

{% note danger Downsides %}
- Not as obvious where values come from versus the other options.
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

### Test file

```javascript
Cypress.env()             // {host: 'kevin.dev.local', api_server: 'http://localhost:8888/api/v1'}
Cypress.env('host')       // 'kevin.dev.local'
Cypress.env('api_server') // 'http://localhost:8888/api/v1/'
```

### Overview

{% note success Benefits %}
- Does not require any changes to files or configuration.
- Obvious where environment variables come from.
- Allows for dynamic values between different machines.
- Overwrites all other forms of setting env variables.
{% endnote %}

{% note danger Downsides %}
- Pain to write the `--env` options everywhere you use Cypress.
{% endnote %}

## Option #5: Plugins

Instead of setting environment variables in a file, you can use plugins to dynamically set them with Node code. This enables you to do things like use `fs` and read off configuration values and dynamically change them.

While this may take a bit more work than other options - it yields you the most amount of flexibility and the ability to manage configuration however you'd like.

{% url "We've fully documented how to do this here." configuration-api %}

# Overriding Configuration

If your environment variables match a standard configuration key, then instead of setting an `environment variable` they will instead override the configuration value.

### Change the `baseUrl` configuration value / not set env var in `Cypress.env()`

```shell
export CYPRESS_BASE_URL=http://localhost:8080
```

### 'foo' does not match config / sets env var in `Cypress.env()`

```shell
export CYPRESS_FOO=bar
```

You can {% url 'read more about how environment variables can change configuration here' configuration %}.

## See also

- {% url "Environment Variables recipe" recipes#Server-Communication %}
