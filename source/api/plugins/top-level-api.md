---
title: Plugins Top-Level API
comments: false
---

Cypress provides a way for hooking into and extending its behavior via the Plugins API. The API can be utilized within the *plugins file*, which is `cypress/plugins/index.js` by default.

{% note info %}
The *plugins file* will be required by [Cypress's server](https://github.com/cypress-io/cypress/tree/master/packages/server), so it must be compatible with the [version of node that Cypress uses](https://github.com/cypress-io/cypress/blob/master/.node-version).
{% endnote %}

The *plugins file* should export a function with the following signature:

```javascript
module.exports = (register, config) => {

}
```

The exported function is called whenever a project is opened (or at the beginning of a run if running headless) and takes 2 arguments, `register` and `config`:

## register

`register` is a function used to register events that occur during the course of running Cypress. The function registered is what we call a *plugin*.

Using it looks like this:

```javascript
module.exports = (register, config) => {
  register('<event>', (arg1, arg2) => {
    // plugin stuff here
  })
}
```

The arguments received by the callback functions and the requirements for what the plugin should do depend on the event.

The following events are available:

### on:spec:file:preprocessor

Occurs when a spec or spec-related file is needed. Read the [Preprocessor API doc](./preprocessors.html) for more details.

## config

`config` is the resolved Cypress configuration, a combination of the default config and what the user has configured in their `cypress.json`. Some plugins may require this to be passed into them, so they can take certain actions based on the configuration.
