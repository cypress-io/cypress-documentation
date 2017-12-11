---
title: Configuration API
comments: false
---

Cypress enables you to dynamically modify configuration values and environment variables from your plugin file.

These means you can do things like store multiple configuration files and switch between them like:

- `cypress.qa.json`
- `cypress.dev.json`
- `cypress.prod.json`

How you choose to organize your configuration and environment variables is up to you.

# Usage

To modify configuration, you simply return an object from your plugins file exported function.

```javascript
// plugins file
module.exports = (on, config) => {
  console.log(config) // see what all is in here!

  // modify config values
  config.defaultCommandTimeout = 10000
  config.baseUrl = 'http://staging.acme.com'

  // modify env var value
  config.env.ENVIRONMENT = 'staging'

  // return config
  return config
}
```

Whenever you return an object from your `pluginFile`, Cypress will take this and "diff" it against the original configuration, and automatically set the resolved values to point to what you returned.

If you don't return an object, then configuration will not be modified.

## Promises

Additionally, Cypress will respect and await promises you return. This enables you to perform asynchronous tasks and eventually resolve with the modified configuration object.

```javascript
// promisified fs module
const fs = require('fs-extra')

function getConfigurationByFile (file) {
  const pathToConfigFile = path.resolve('..', 'config', `${file}.json`)

  return fs.readJson(pathToConfigFile)
}

// plugins file
module.exports = (on, config) => {
  // accept a configFile value or use development by default
  const file = config.env.configFile || 'development'

  return getConfigurationByFile(file)
}
```

You could now swap out configuration + environment variables like so:

```shell
cypress run
cypress run --env configFile=qa
cypress run --env configFile=staging
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

```js
// cypress/config/development.json

{
  baseUrl: 'http://localhost:1234',
  env: {
    something: 'development'
  }
}
```

```js
// cypress/config/qa.json

{
  baseUrl: 'http://qa.acme.com',
  env: {
    something: 'qa'
  }
}
```

```js
// cypress/config/staging.json

{
  baseUrl: 'http://staging.acme.com',
  env: {
    something: 'staging'
  }
}
```

```js
// cypress/config/production.json

{
  baseUrl: 'http://production.acme.com',
  env: {
    something: 'production'
  }
}
```

## Notes

These are just simple examples. Remember - you have the full power of `Node.js` at your disposal.

How you choose to organize multiple configurations and sets of environment variables is up to you. You don't even have to read off of the file system - you could store them all in memory inside of your `pluginsFile` if you wanted to.
