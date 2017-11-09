---
title: Plugins
comments: false
---

Plugins provides a way for hooking into and extending the behavior of Cypress. Plugins can be configured within the plugins file, which will be searched for at `cypress/plugins/index.js` by default.

{% note info %}
You can configure a different location for the plugins file in your `cypress.json` via the {% url "`pluginsFile`" configuration#Folders-Files %} option.
{% endnote %}

## Installation

Installing a plugin requires [node.js](https://nodejs.org) (version 6.5.0+).

```shell
npm install &lt;plugin name&gt; --save-dev
```

## Usage

```javascript
module.exports = (on, config) => {
  on('<event>', (arg1, arg2) => {
    // plugin stuff here
  })
}
```

The event depends on the type of plugin you would like to utilize. The exact usage depends on the plugin itself, so refer to any given plugin's documentation for details on that usage.

For example, here's how to use the [webpack preprocessor](https://github.com/cypress-io/cypress-webpack-preprocessor):

```javascript
const webpack = require('@cypress/webpack-preprocessor')

module.exports = (on, config) => {
  on('file:preprocessor', webpack(config))
}
```

## Plugin Types

### Preprocessors

Preprocessors are plugins that can process your support file and spec files before they're served to the browser. They are also responsible for watching files for changes and notifying Cypress to re-run tests.

* Event: `file:preprocessor`
* Examples: [browserify](https://github.com/cypress-io/cypress-browserify-preprocessor),[webpack](https://github.com/cypress-io/cypress-webpack-preprocessor), [watch](https://github.com/cypress-io/cypress-watch-preprocessor)

```javascript
// the plugins file
const webpack = require('@cypress/webpack-preprocessor')

module.exports = (on, config) => {
  // register the webpack plugin, using its default options
  on('file:preprocessor', webpack(config))
}
```
