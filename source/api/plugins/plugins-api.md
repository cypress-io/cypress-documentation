---
title: Plugins API
comments: false
---

The Plugins API allows you to hook into and extend Cypress behavior.

# pluginsFile

The API can be utilized within the plugins file, which will be searched for at `cypress/plugins/index.js` by default. Users can configure a different location for the plugins file in their `cypress.json` via the {% url "`pluginsFile`" configuration#Folders-Files %} option.

{% note info %}
The plugins file will be required by [Cypress' server](https://github.com/cypress-io/cypress/tree/master/packages/server), so it must be compatible with the [version of node that Cypress uses](https://github.com/cypress-io/cypress/blob/master/.node-version).
{% endnote %}

The plugins file should export a function with the following signature:

```javascript
module.exports = (on, config) => {
  // configure plugins here
}
```

The exported function is called whenever a project is opened (or at the beginning of a run if running tests headlessly) and takes 2 arguments, `on` and `config`:

# on

`on` is a function used on **events** that occur during the course of running Cypress. The function registered is what we call a *plugin*.

{% url "Using it looks like this:" plugins-guide %}

```javascript
module.exports = (on, config) => {
  on('<event>', (arg1, arg2) => {
    // plugin stuff here
  })
}
```

The arguments received by the callback functions and the requirements for what the plugin should do depend on the **event**.

***The following events are available:***

* `file:preprocessor` Occurs when a spec or spec-related file is needed. Read the [Preprocessor API doc](./preprocessors.html) for more details.

# config

`config` is the resolved [Cypress configuration](https://on.cypress.io/guides/configuration), a combination of the default config and what the user has configured via `cypress.json`, `cypress.env.json`, command line options, and/or environment variables. Some plugins may require this to be passed along to them, so they can take certain actions based on the configuration.
