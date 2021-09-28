---
title: Writing a Plugin
---

The Plugins API allows you to hook into and extend Cypress behavior.

<Alert type="info">

**Note:** This document assumes you have read the
[Plugins Guide](/guides/tooling/plugins-guide).

</Alert>

## Plugins API

To get started, open up this file:

```text
cypress/plugins/index.js
```

The plugins file must export a function with the following signature:

:::cypress-plugin-example

```javascript
// configure plugins here
```

:::

<Alert type="warning">

⚠️ ⚠️ This code is part of the
[setupNodeEvents](/guides/tooling/plugins-guide#Using-a-plugin) function and
thus executes in the Node environment. You cannot call `Cypress` or `cy`
commands in this file, but you do have the direct access to the file system and
the rest of the operating system.

</Alert>

The exported function is called whenever a project is opened either with
[cypress open](/guides/guides/command-line#cypress-open) or
[cypress run](/guides/guides/command-line#cypress-run).

Your function will receive 2 arguments: `on` and `config`.

You can return a synchronous function, or you can also return a Promise, and it
will be awaited until it resolves. This enables you to perform asynchronous
actions in your exported function such as reading files in from the filesystem.

If you return or resolve with an object, Cypress will then merge this object
into the `config` which enables you to overwrite configuration or environment
variables.

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

[For a comprehensive list of all configuration values look here.](https://github.com/cypress-io/cypress/blob/master/packages/server/lib/config.js)

Some plugins may utilize or require these values, so they can take certain
actions based on the configuration.

You can programmatically modify these values and Cypress will then respect these
changes. This enables you to swap out configuration based on things like the
environment you're running in.

<Alert type="warning">

The `config` object also includes the following extra values that are not part
of the standard configuration. **These values are read only and cannot be
modified from `setupNodeEvents`.**

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

[setupNodeEvents](/guides/tooling/plugins-guide#Using-a-plugin) is invoked when
Cypress opens a project.

Cypress does this by spawning an independent `child_process` which then
`requires` in `setupNodeEvents`. This is similar to the way Visual Studio Code
or Atom works.

You will need to keep in mind it is **Cypress who is requiring your file** - not
your local project, not your local Node version, and not anything else under
your control.

Because of this, this global context and the version of Node is controlled under
Cypress.

<Alert type="warning">

<strong class="alert-header">Node version</strong>

Keep in mind - code executed in plugins **may** be executed by the Node version
that comes bundled in Cypress itself.

This version of Node has **nothing to do** with your locally installed versions.
Therefore you may want to write Node code which is compatible with this version
or document that the user of your plugin will need to set a specific
[nodeVersion](/guides/references/configuration#Node-version) in their
configuration.

You can find the current Node version we use when the `nodeVersion` is set to
the default `bundled`
[here](https://github.com/cypress-io/cypress/blob/master/.node-version).

</Alert>

### npm modules

When Cypress executes `setupNodeEvents` it will execute with `process.cwd()` set
to your project's path. Additionally - you will be able to `require` **any node
module** you have installed.

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

**Then you could do any of the following in `setupNodeEvents`:**

:::cypress-plugin-example

```js
const _ = require('lodash') // yup, dev dependencies
const path = require('path') // yup, built in node modules
const debug = require('debug') // yup, dependencies
const User = require('../../lib/models/user') // yup, relative local modules

console.log(__dirname) // /Users/janelane/Dev/my-project

console.log(process.cwd()) // /Users/janelane/Dev/my-project
```

:::

## Error handling

Cypress spawns [setupNodeEvents](/guides/tooling/plugins-guide#Using-a-plugin)
in its own child process so it is isolated away from the context that Cypress
itself runs in. That means you cannot accidentally modify or change Cypress's
own execution in any way.

If `setupNodeEvents` has an uncaught exception, an unhandled rejection from a
promise, or a syntax error - we will automatically catch those and display them
to you inside of the console and even in the Test Runner itself.

Errors from your plugins _will not crash_ Cypress.

## File changes

Normally when writing code in Node, you typically have to restart the process
after changing any files.

With Cypress, we automatically watch `setupNodeEvents` and any changes made will
take effect immediately. We will read the file in and execute the exported
function again.

This enables you to iterate on plugin code even with Cypress already running.
