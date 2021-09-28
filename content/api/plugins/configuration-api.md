---
title: Configuration API
---

Cypress enables you to dynamically modify configuration values and environment
variables from your Cypress configuration.

## Usage

<Alert type="warning">

⚠️ This code is part of the
[setupNodeEvents](/guides/tooling/plugins-guide#Using-a-plugin) function and
thus executes in the Node environment. You cannot call `Cypress` or `cy`
commands in this file, but you do have the direct access to the file system and
the rest of the operating system.

</Alert>

To modify configuration, you return a config object from `setupNodeEvents`
within this exported function.

:::cypress-plugin-example

```js
console.log(config) // see everything in here!

// modify config values
config.defaultCommandTimeout = 10000
config.baseUrl = 'https://staging.acme.com'

// modify env var value
config.env.ENVIRONMENT = 'staging'

// IMPORTANT return the updated config object
return config
```

:::

Whenever you return an object from your `setupNodeEvents`, Cypress will take
this and "diff" it against the original configuration and automatically set the
resolved values to point to what you returned.

If you don't return an object, then configuration will not be modified.

<Alert type="warning">

The `config` object also includes the following extra values that are not part
of the standard configuration. **These values are read only and cannot be
modified from the `setupNodeEvents` function in the Cypress configuration.**

- `configFile`: The absolute path to the Cypress configuration file. See the
  [--config-file](guides/guides/command-line#cypress-open) and
  [configFile](guides/guides/module-api) docs for more information on this
  value.
- `projectRoot`: The absolute path to the root of the project (e.g.
  `/Users/me/dev/my-project`)

</Alert>

Resolved values will show up in the "Settings" tab of the Test Runner.

<DocsImage src="/img/guides/plugin-configuration.png" alt="Resolved configuration in the Desktop app" ></DocsImage>

### Promises

Additionally, Cypress will respect and await promises you return. This enables
you to perform asynchronous tasks and eventually resolve with the modified
configuration object. See the
[example on switching between multiple configuration files](#Switch-between-multiple-configuration-files)
for a full example.

## Examples

### Customize available browsers

The configuration includes the list of browsers found on your system that are
available to Cypress.

<Alert type="info">

Read our full guide on [Launching Browsers](/guides/guides/launching-browsers)
for more information on how this works.

</Alert>

In [setupNodeEvents](/guides/tooling/plugins-guide#Using-a-plugin), you can
filter the list of browsers passed inside the `config` object and return the
list of browsers you want available for selection during `cypress open`.

:::cypress-plugin-example

```javascript
// inside config.browsers array each object has information like
// {
//   name: 'chrome',
//   family: 'chromium',
//   channel: 'canary',
//   displayName: 'Canary',
//   version: '80.0.3966.0',
//   path:
//    '/Applications/Canary.app/Contents/MacOS/Canary',
//   majorVersion: 80
// }
return {
  browsers: config.browsers.filter((b) => b.family === 'chromium'),
}
```

:::

When you open the Test Runner in a project that uses the above modifications,
only the Chrome browsers found on the system will display in the list of
available browsers.

<DocsImage src="/img/guides/plugins/chrome-browsers-only.png" alt="Filtered list of Chrome browsers" ></DocsImage>

<Alert type="info">

If you return an empty list of browsers or `browsers: null`, the default list
will be restored automatically.

</Alert>

If you modify the list of browsers, you can see the
[resolved configuration](/guides/references/configuration#Resolved-Configuration)
in the **Settings** tab of the Test Runner.

### Switch between multiple configuration files

This means you can do things like store multiple configuration files and switch
between them like:

- `cypress.qa.json`
- `cypress.dev.json`
- `cypress.prod.json`

How you choose to organize your configuration and environment variables is up to
you.

:::cypress-plugin-example

```js
// promisified fs module
const fs = require('fs-extra')
const path = require('path')

function getConfigurationByFile(file) {
  const pathToConfigFile = path.resolve('..', 'config', `${file}.json`)

  return fs.readJson(pathToConfigFile)
}
```

```js
// accept a configFile value or use development by default
const file = config.env.configFile || 'development'

return getConfigurationByFile(file)
```

:::

You could now swap out configuration + environment variables like so:

```shell
cypress run
```

```shell
cypress run --env configFile=qa
```

```shell
cypress run --env configFile=staging
```

```shell
cypress run --env configFile=production
```

Each of these environments would read in the configuration at these files:

```text
cypress/config/development.json
cypress/config/qa.json
cypress/config/staging.json
cypress/config/production.json
```

This would enable you to do things like this:

```json
// cypress/config/development.json

{
  "baseUrl": "http://localhost:1234",
  "env": {
    "something": "development"
  }
}
```

```json
// cypress/config/qa.json

{
  "baseUrl": "https://qa.acme.com",
  "env": {
    "something": "qa"
  }
}
```

```json
// cypress/config/staging.json

{
  "baseUrl": "https://staging.acme.com",
  "env": {
    "something": "staging"
  }
}
```

```json
// cypress/config/production.json

{
  "baseUrl": "https://production.acme.com",
  "env": {
    "something": "production"
  }
}
```

This is a less complicated example. Remember - you have the full power of Node
at your disposal.

How you choose to edit the configuration is up to you. You don't have to read
off of the file system - you could store them all in memory inside of
[setupNodeEvents](/guides/tooling/plugins-guide#Using-a-plugin) if you wanted.

### Runner Specific Plugins

You can access the type of tests running via the `config.testingType` property.
The testing type is either `e2e` or `component` depending on if the E2E or
[Component Testing](/guides/component-testing/introduction/) runner was
launched. This allows you to configure runner specific plugins.

#### Use Cypress React Plugin Conditionally

Conditionally apply the Cypress React Plugin if launching via Component Testing:

```js
module.exports = (on, config) => {
  if (config.testingType === 'component') {
    require('@cypress/react/plugins/react-scripts')(on, config)
  }

  return config
}
```

## History

| Version                               | Changes                                   |
| ------------------------------------- | ----------------------------------------- |
| [7.0.0](/guides/references/changelog) | Added `testingType` property to `config`. |

## See also

- The
  [Configuration](https://github.com/cypress-io/testing-workshop-cypress#intermediate)
  section of the Cypress Testing Workshop
- blog post
  [Keep passwords secret in E2E tests](https://glebbahmutov.com/blog/keep-passwords-secret-in-e2e-tests/)
