---
title: Writing a Plugin
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

The plugins file must export a function with the following signature:

```javascript
// cypress/plugins/index.js

// export a function
module.exports = (on, config) => {
  // configure plugins here
}
```

The exported function is called whenever a project is opened either with {% url "`cypress open`" command-line#cypress-open %} or {% url "`cypress run`" command-line#cypress-run %}.

Your function will receive 2 arguments: `on` and `config`.

You can return a synchronous function, or you can also return a Promise, and it will be awaited until it resolves. This enables you to perform asynchronous actions in your exported function such as reading files in from the filesystem.

If you return or resolve with an object, Cypress will then merge this object into the `config` which enables you to overwrite configuration or environment variables.

## on

`on` is a function that you will use to register listeners on various **events** that Cypress exposes.

Registering to listen on an event looks like this:

```javascript
module.exports = (on, config) => {
  on('<event>', (arg1, arg2) => {
    // plugin stuff here
  })
}
```

Each event documents its own argument signature. To understand how to use them, please {% urlHash 'refer to the docs for each one' 'List-of-events' %}.

## config

`config` is the resolved {% url "Cypress configuration" configuration %} of the opened project.

This configuration contains all of the values that get passed into the browser for your project.

{% url 'For a comprehensive list of all configuration values look here.' https://github.com/cypress-io/cypress/blob/master/packages/server/lib/config.coffee %}

Some plugins may utilize or require these values, so they can take certain actions based on the configuration.

You can programmatically modify these values and Cypress will then respect these changes. This enables you to swap out configuration based on things like the environment you're running in.

{% url "Please check out our API docs for modifying configuration here." configuration-api %}

## List of events

***The following events are available:***

Event | Description
--- | ---
{% url `file:preprocessor` preprocessors-api %} | Occurs when a spec or spec-related file needs to be transpiled for the browser.
{% url `before:browser:launch` browser-launch-api %} | Occurs immediately before launching a browser.
{% url `task` task %} | Occurs in conjunction with the `cy.task` command.
{% url `after:screenshot` after-screenshot-api %} | Occurs after a screenshot is taken.

{% note warning "More Coming Soon" %}
The Plugins API is relatively new.

We have many new plugin events {% issue 684 'we are adding' %}.
{% endnote %}

# Execution context

Your `pluginsFile` is invoked when Cypress opens a project.

Cypress does this by spawning an independent `child_process` which then `requires` in your `pluginsFile`. This is similar to the way Visual Studio Code or Atom works.

You will need to keep in mind it is **Cypress who is requiring your file** - not your local project, not your local Node version, and not anything else under your control.

Because of this, this global context and the version of Node is controlled by Cypress.

{% note warning "Node version" %}

Keep in mind - code executed in plugins is executed **by the Node version** that comes bundled in Cypress itself.

This version of Node has **nothing to do** with your locally installed versions. Therefore you have to write Node code which is compatible with this version.

You can find the current Node version we use {% url 'here' https://github.com/cypress-io/cypress/blob/master/.node-version %}.

{% endnote %}

## npm modules

When Cypress executes your `pluginsFile` it will execute with `process.cwd()` set to your project's path. Additionally - you will be able to `require` **any node module** you have installed.

You can also `require` local files relative to your project.

**For example, if your `package.json` looked like this:**

```json
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

**Then you could do any of the following in your `pluginsFile`:**

```js
// cypress/plugins/index.js

const _ = require('lodash') // yup, dev dependencies
const path = require('path') // yup, built in node modules
const debug = require('debug') // yup, dependencies
const User = require('../../lib/models/user') // yup, relative local modules

console.log(__dirname) // /Users/janelane/Dev/my-project/cypress/plugins/index.js

console.log(process.cwd()) // /Users/janelane/Dev/my-project
```

# Error handling

Cypress spawns your `pluginsFile` in its own child process so it is isolated away from the context that Cypress itself runs in. That means you cannot accidentally modify or change Cypress' own execution in any way.

If your `pluginsFile` has an uncaught exception, an unhandled rejection from a promise, a syntax error, or anything else - we will automatically catch those and display them to you inside of the console and even in the Test Runner itself.

Errors from your plugins *will not crash* Cypress.

# File changes

Normally when writing code in Node, you typically have to restart the process after changing any files.

With Cypress, we automatically watch your `pluginsFile` and any changes made will take effect immediately. We will read the file in and execute the exported function again.

This enables you to iterate on plugin code even with Cypress already running.
