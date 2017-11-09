---
title: Plugins
comments: false
---

Plugins provides a way for hooking into and extending the behavior of Cypress. Plugins can be configured within the plugins file, which will be searched for at `cypress/plugins/index.js` by default.

{% note info %}
You can configure a different location for the plugins file in your `cypress.json` via the {% url "`pluginsFile`" configuration#Folders-Files %} option.
{% endnote %}

# Installation

See the list of available {% url "plugins" plugins %} to install.

```shell
npm install &lt;plugin name&gt; --save-dev
```

Installing a plugin requires [node.js](https://nodejs.org) (version 6.5.0+).

# Usage

```javascript
module.exports = (on, config) => {
  on('<event>', (arg1, arg2) => {
    // plugin stuff here
  })
}
```

The **event** depends on the {% urlHash "type of plugin" Plugin-types %} you are using. The exact usage depends on the plugin itself, so refer to any given plugin's documentation for details on its usage.

For example, here's how to use the [webpack preprocessor](https://github.com/cypress-io/cypress-webpack-preprocessor):

```javascript
const webpack = require('@cypress/webpack-preprocessor')

module.exports = (on, config) => {
  on('file:preprocessor', webpack(config))
}
```

# Plugin types

## Preprocessors

Preprocessors are plugins that can process your {% url "support file" writing-and-organizing-tests#Support-file %} and {% url "test files" writing-and-organizing-tests#Test-files %} before they are served to the browser. They are also responsible for watching files for changes and notifying Cypress to re-run tests.

* **Event:** `file:preprocessor`
* **Examples:** {% url "browserify-preprocessor" https://github.com/cypress-io/cypress-browserify-preprocessor %}, {% url "webpack-preprocessor" https://github.com/cypress-io/cypress-webpack-preprocessor %}, {% url "watch-preprocessor" https://github.com/cypress-io/cypress-watch-preprocessor %}

```javascript
// the plugins file
const webpack = require('@cypress/webpack-preprocessor')

module.exports = (on, config) => {
  // register the webpack plugin, using its default options
  on('file:preprocessor', webpack(config))
}
```
