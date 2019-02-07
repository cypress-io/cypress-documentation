---
title: Configuration via the Background File
---

Cypress enables you to dynamically modify configuration values and environment variables from your background file.

These means you can do things like store multiple configuration files and switch between them like:

- `cypress.qa.json`
- `cypress.dev.json`
- `cypress.prod.json`

How you choose to organize your configuration and environment variables is up to you.

# Environment

{% wrap_start 'event-environment' %}

Some events run in the {% url "browser" all-events#Browser-Events %}, some in the {% url "background process" background-process %}, and some in both.

Event | Browser | Background Process
--- | --- | ---
`configuration` | {% fa fa-times-circle grey %} | {% fa fa-check-circle green %}

{% wrap_end %}

# Usage

## In the background process

To modify configuration, return an object from your {% url "`backgroundFile`" background-process %}'s exported function.

```javascript
module.exports = (on, config) => {
  console.log(config) // see what all is in here!

  // modify config values
  config.defaultCommandTimeout = 10000
  config.baseUrl = 'https://staging.acme.com'

  // modify env var value
  config.env.ENVIRONMENT = 'staging'

  // return config
  return config
}
```

Whenever you return an object from your `backgroundFile`, Cypress will take this and "diff" it against the original configuration, and automatically set the resolved values to point to what you returned.

If you don't return an object, then configuration will not be modified.

Resolved values will show up in your Settings tab in the Test Runner.

{% img /img/guides/plugin-configuration.png "Resolved configuration in the Desktop app" %}

## Promises

Additionally, Cypress will respect and await promises you return. This enables you to perform asynchronous tasks and eventually resolve with the modified configuration object.

```javascript
// promisified fs module
const fs = require('fs-extra')
const path = require('path')

function getConfigurationByFile (file) {
  const pathToConfigFile = path.resolve('..', 'config', `${file}.json`)

  return fs.readJson(pathToConfigFile)
}

// background file
module.exports = (on, config) => {
  // accept a configFile value or use development by default
  const file = config.env.configFile || 'development'

  return getConfigurationByFile(file)
}
```

You could now swap out configuration and environment variables like so:

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

## Notes

These are just simple examples. Remember - you have the full power of `Node.js` at your disposal.

How you choose to organize multiple configurations and sets of environment variables is up to you. You don't even have to read off of the file system - you could store them all in memory inside of your `backgroundFile` if you wanted to.

# See also

- {% url "Configuration" configuration %}
