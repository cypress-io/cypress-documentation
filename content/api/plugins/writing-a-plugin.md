---
title: Writing a Plugin
---

The Plugins API allows you to hook into and extend Cypress behavior.

<Alert type="info">

**Note:** This document assumes you have read the
[Plugins Guide](/guides/tooling/plugins-guide).

</Alert>

::include{file=partials/warning-plugins-file.md}

## Plugins API

The [`setupNodeEvents`](/guides/references/configuration#setupNodeEvents)
function (or deprecated
[plugins file](/guides/references/legacy-configuration#Plugins) function)
receives 2 arguments: [`on`](#on) and [`config`](#config). It can return a
synchronous value or can also return a Promise, which will be awaited until it
resolves. This enables you to perform asynchronous actions such as reading files
in from the filesystem.

If you return or resolve with an object, Cypress will then merge this object
into the `config` which enables you to overwrite configuration or environment
variables.

:::cypress-plugin-example

```javascript
// configure plugins here
```

:::

### on

`on` is a function that you will use to register listeners on various **events**
that Cypress exposes.

Registering to listen on an event looks like this:

:::cypress-plugin-example

```javascript
on('<event>', (arg1, arg2) => {
  // plugin stuff here
})
```

:::

Each event documents its own argument signature. To understand how to use them,
please [refer to the docs for each one](#List-of-events).

### config

`config` is the resolved
[Cypress configuration](/guides/references/configuration) of the opened project.

This configuration contains all of the values that get passed into the browser
for your project.

Some plugins may utilize or require these values, so they can take certain
actions based on the configuration. If these values are programmatically
modified, Cypress will use the new values.

<Alert type="warning">

The `config` object also includes the following extra values that are not part
of the standard configuration. **These values are read only and cannot be
modified from the plugins file.**

- `configFile`: The absolute path to the
  [Cypress configuration file](/guides/references/configuration). See the
  [--config-file](guides/guides/command-line#cypress-open) and
  [configFile](guides/guides/module-api) docs for more information on this
  value.
- `projectRoot`: The absolute path to the root of the project (e.g.
  `/Users/me/dev/my-project`)
- `version`: The version number of Cypress. This can be used to handle breaking
  changes.

</Alert>

[Please check out our API docs for modifying configuration here.](/api/plugins/configuration-api)

### List of events

#### The following events are available:

| Event                                                      | Description                                                                     |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [`after:run`](/api/plugins/after-run-api)                  | Occurs after the run is finished.                                               |
| [`after:screenshot`](/api/plugins/after-screenshot-api)    | Occurs after a screenshot is taken.                                             |
| [`after:spec`](/api/plugins/after-spec-api)                | Occurs after a spec is finished running.                                        |
| [`before:browser:launch`](/api/plugins/browser-launch-api) | Occurs immediately before launching a browser.                                  |
| [`before:run`](/api/plugins/before-run-api)                | Occurs before the run starts.                                                   |
| [`before:spec`](/api/plugins/before-spec-api)              | Occurs when a spec is about to be run.                                          |
| [`file:preprocessor`](/api/plugins/preprocessors-api)      | Occurs when a spec or spec-related file needs to be transpiled for the browser. |
| [`task`](/api/commands/task)                               | Occurs in conjunction with the `cy.task` command.                               |

## Execution context

The [`setupNodeEvents`](/guides/references/configuration#setupNodeEvents)
function (or deprecated
[plugins file](/guides/references/legacy-configuration#Plugins) function) is
invoked when Cypress opens a project.

Cypress does this by spawning an independent `child_process` which then
`requires` the [Cypress configuration file](/guides/references/configuration).
This is similar to the way Visual Studio Code or Atom works.

This code will be executed using the the Node version that launched Cypress.

### npm modules

When Cypress executes the
[`setupNodeEvents`](/guides/references/configuration#setupNodeEvents) function
(or deprecated [plugins file](/guides/references/legacy-configuration#Plugins)
function) it will execute with `process.cwd()` set to your project's path.
Additionally - you will be able to `require` **any node module** you have
installed, including local files inside your project.

For example, if your `package.json` looked like this:

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

Then you could do any of the following in your `setupNodeEvents` function:

:::cypress-plugin-example

```js
const _ = require('lodash') // yup, dev dependencies
const path = require('path') // yup, core node library
const debug = require('debug') // yup, dependencies
const User = require('./lib/models/user') // yup, relative local modules

console.log(__dirname) // /Users/janelane/Dev/my-project
console.log(process.cwd()) // /Users/janelane/Dev/my-project
```

:::

## Error handling

The [Cypress configuration file](/guides/references/configuration) is loaded in
its own child process so it is isolated away from the context that Cypress
itself runs in. That means you cannot accidentally modify or change Cypress's
own execution in any way.

If your [`setupNodeEvents`](/guides/references/configuration#setupNodeEvents)
function (or deprecated
[plugins file](/guides/references/legacy-configuration#Plugins) function) has an
uncaught exception, an unhandled rejection from a promise, or a syntax error -
Cypress will automatically catch those and display them to you inside of the
console and even in Cypress itself.

Errors in your `setupNodeEvents` function _will not crash_ Cypress.

## File changes

Normally when writing code in Node, you typically have to restart the process
after changing any files.

Cypress automatically watches your
[Cypress configuration file](/guides/references/configuration) and any changes
made will take effect immediately. We will read the file in and execute the
exported function again.

This enables you to iterate on plugin code even with Cypress already running.
