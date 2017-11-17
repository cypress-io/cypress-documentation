---
title: Writing a Plugin
comments: false
---

The Plugins API allows you to hook into and extend Cypress behavior.

{% note info %}
**Note:** This document assumes you have read the {% url 'Plugins Guide' plugins-guide %}.
{% endnote %}

# Plugins API

To get started, open up this file:

```text
cypress/plugins/index.js
```

{% note info %}
By default Cypress seeds this file for new projects, but if you have an existing project just create this file yourself.
{% endnote %}

The plugins file must export a function with the following signature:

```javascript
// cypress/plugins/index.js

// export a function
module.exports = (on, config) => {
  // configure plugins here
}
```

The exported function is called whenever a project is opened either with `cypress open` or `cypress run`.

Your function will receive 2 arguments: `on` and `config`.

## on

`on` is a function that you will use to register to various **events** that Cypress exposes.

Registering to an event looks like this:

```javascript
module.exports = (on, config) => {
  on('<event>', (arg1, arg2) => {
    // plugin stuff here
  })
}
```

Each event documents its own argument signature. To understand how to use them, please {% urlHash 'refer to docs for each one' 'List-of-Events' %}.

## config

`config` is the resolved [Cypress configuration](https://on.cypress.io/guides/configuration) of the opened project.

This configuration contains all of the values that get passed into the browser for your project.

Some plugins may utilize or require these values, so they can take certain actions based on the configuration.

{% url 'For a comprehensive list of all configuration values look here.' https://github.com/cypress-io/cypress/blob/master/packages/server/lib/config.coffee %}

## List of Events

***The following events are available:***

Event | Description
--- | ---
{% url `file:preprocessor` preprocessors-api %} | Occurs when a spec or spec-related file needs to be transpiled for the browser.

{% note warning "More Coming Soon" %}
The Plugins API is brand new.

We have many new plugin events {% issue 684 'we are adding' %}.
{% endnote %}

# Execution Context

Your `pluginsFile` is invoked when Cypress opens a project.

Cypress does this by spawning an independent `child_process` which then `requires` in your `pluginsFile`. This is similar to the way Visual Studio Code or Atom works.

You'll need to keep in mind it is **Cypress who is requiring your file** - not your local project, not your local node version, and not anything else you control.

Because of this, this global context and the version of node is controlled by Cypress.

{% note warning %}
Your code must be compatible with the version of node that comes with Cypress!
{% endnote %}

Currently the node version we use is {% url `6.5.0` 'https://github.com/cypress-io/cypress/blob/master/.node-version' %}.

This node version gets updated regularly (next version will be in the `8.x.x` range) so you'll likely be able to use all the latest ES7 features.

## NPM Modules

When Cypress executes your `pluginsFile` it will execute with `process.cwd()` set to your project's path. Additionally - you'll be able to `require` **any node module** you have installed.

Additionally you can also `require` local files relative to your project.

If your `package.json` looked like this:

```js
{
  "name": "My Project",
  "dependencies": {
    "debug": "x.x.x"
  },
  "devDependencies": {
    "lodash": "x.x.x"
  }
}
```

Then you could do any of the following in your `pluginsFile`:

```js
// cypress/plugins/index.js

const _ = require('lodash') // yup, dev dependencies
const path = require('path') // yup, built in node modules
const debug = require('debug') // yup, dependencies
const User = require('../../lib/models/user') // yup, relative local modules

console.log(__dirname) // /Users/bmann/Dev/my-project/cypress/plugins/index.js

console.log(process.cwd()) // /Users/bmann/Dev/my-project
```

# Error Handling

Cypress spawns your `pluginsFile` in its own child process so it's isolated away from the context that Cypress itself runs in. That means you cannot accidentally modify or change Cypress's own execution in any way.

If your `pluginsFile` has an uncaught exception, an unhandled rejection from a promise, a syntax error, or anything else - we'll automatically catch those and display them to you inside of the console and even in the Cypress GUI itself.

Errors from your plugins will not crash Cypress.

# File Changes

Normally when writing node code, you typically have to restart the process after changing any files.

With Cypress, we automatically watch your `pluginsFile` and any changes to it will take effect immediately. We'll read the file in and execute the exported function again.

This enables you to iterate on plugin code even with Cypress already running.
