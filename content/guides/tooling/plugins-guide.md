---
title: Plugins
---

Plugins enable you to tap into, modify, or extend the internal behavior of
Cypress.

Normally, as a user, all of your test code, your application, and Cypress
commands are executed in the browser. But Cypress is also a Node process that
plugins can use.

> Plugins enable you to tap into the Node process running outside of the
> browser.

Plugins are a "seam" for you to write your own custom code that executes during
particular stages of the Cypress lifecycle.

<Alert type="info">

<strong class="alert-header">This is a brief overview</strong>

If you want more details about how to write a plugin, we've written API docs
that show you how to work with each plugin event.

You can [check out the API docs here](/api/plugins/writing-a-plugin).

</Alert>

## Use Cases

### Configuration

With plugins, you can programmatically alter the resolved configuration and
environment variables that come from the
[Cypress configuration file](/guides/references/configuration),
[`cypress.env.json`](/guides/guides/environment-variables#Option-2-cypress-env-json),
the [command line](/guides/guides/command-line), or system environment
variables.

This enables you to do things like:

- Use multiple environments with their own configurations
- Swap out environment variables based on an environment
- Read in configuration files using the built in `fs` lib
- Change the list of browsers used for testing
- Write your configuration in `yml`

Check out our [Configuration API docs](/api/plugins/configuration-api) which
describe how to use this event.

### Preprocessors

The event `file:preprocessor` is used to customize how your test code is
transpiled and sent to the browser. By default, Cypress handles ES2015+,
TypeScript, and CoffeeScript, using webpack to package it for the browser.

You can use the `file:preprocessor` event to do things like:

- Add the latest ES\* support.
- Write your test code in ClojureScript.
- Customize the Babel settings to add your own plugins.
- Customize the options for compiling TypeScript.
- Swap out webpack for Browserify or anything else.

Check out our [File Preprocessor API docs](/api/plugins/preprocessors-api) which
describe how to use this event.

### Run Lifecycle

The events [`before:run`](/api/plugins/before-run-api) and
[`after:run`](/api/plugins/after-run-api) occur before and after a run,
respectively.

You can use [`before:run`](/api/plugins/before-run-api) to do things like:

- Set up reporting on a run
- Start a timer for the run to time how long it takes

You can use [`after:run`](/api/plugins/after-run-api) to do things like:

- Finish up reporting on a run set up in `before:run`
- Stop the timer for the run set up in `before:run`

### Spec Lifecycle

The events [`before:spec`](/api/plugins/before-spec-api) and
[`after:spec`](/api/plugins/after-spec-api) run before and after a single spec
is run, respectively.

You can use [`before:spec`](/api/plugins/before-spec-api) to do things like:

- Set up reporting on a spec running
- Start a timer for the spec to time how long it takes

You can use [`after:spec`](/api/plugins/after-spec-api) to do things like:

- Finish up reporting set up in `before:spec`
- Stop the timer for the spec set up in `before:spec`
- Delete the video recorded for the spec. This prevents it from taking time and
  computing resources for compressing and uploading the video. You can do this
  conditionally based on the results of the spec, such as if it passes (so
  videos for failing tests are preserved for debugging purposes).

Check out the [Before Spec API doc](/api/plugins/before-spec-api) and
[After Spec API doc](/api/plugins/after-spec-api) which describe how to use
these events.

### Browser Launching

The event `before:browser:launch` can be used to modify the launch arguments for
each particular browser.

You can use the `before:browser:launch` event to do things like:

- Load a Chrome extension
- Enable or disable experimental chrome features
- Control which Chrome components are loaded

Check out our [Browser Launch API docs](/api/plugins/browser-launch-api) which
describe how to use this event.

### Screenshot handling

The event `after:screenshot` is called after a screenshot is taken and saved to
disk.

You can use the `after:screenshot` event to do things like:

- Save details about the screenshot
- Rename the screenshot
- Manipulate the screenshot image by resizing or cropping it

Check out our [After Screenshot API docs](/api/plugins/after-screenshot-api)
which describe how to use this event.

### cy.task

The event `task` is used in conjunction with the
[`cy.task()`](/api/commands/task) command. It allows you to write arbitrary code
in Node to accomplish tasks that aren't possible in the browser.

You can use the `task` event to do things like:

- Manipulating a database (seeding, reading, writing, etc.)
- Storing state in Node that you want persisted (since the driver is fully
  refreshed on visits)
- Performing parallel tasks (like making multiple http requests outside of
  Cypress)
- Running an external process (like spinning up a Webdriver instance of another
  browser like Safari or puppeteer)

##### <Icon name="graduation-cap"></Icon> Real World Example

The [Real World App (RWA)](https://github.com/cypress-io/cypress-realworld-app)
uses [tasks](/api/commands/task) to re-seed its database, and to filter/find
test data for various testing scenarios.

::include{file=partials/warning-setup-node-events.md}

:::cypress-plugin-example

```js
  on("task", {
    async "db:seed"() {
      // seed database with test data
      const { data } = await axios.post(`${testDataApiEndpoint}/seed`);
      return data;
    },

    // fetch test data from a database (MySQL, PostgreSQL, etc...)
    "filter:database"(queryPayload) {
      return queryDatabase(queryPayload, (data, attrs) => _.filter(data.results, attrs));
    },
    "find:database"(queryPayload) {
      return queryDatabase(queryPayload, (data, attrs) => _.find(data.results, attrs));
    },
  });
  // ..
};
```

:::

> _<Icon name="github"></Icon> Source:
> [cypress/plugins/index.ts](https://github.com/cypress-io/cypress-realworld-app/blob/develop/cypress/plugins/index.ts)_

Check out the
[Real World App test suites](https://github.com/cypress-io/cypress-realworld-app/tree/develop/cypress/tests/ui)
to see these tasks in action.

## List of plugins

Cypress maintains a curated list of plugins created by us and the community. You
can `npm install` any of the plugins listed below:

[Our curated list of Cypress plugins.](/plugins/directory)

## Installing plugins

Plugins from our [official list](/plugins/directory) are npm modules. This
enables them to be versioned and updated separately without needing to update
Cypress itself.

You can install any published plugin using NPM:

```shell
npm install <plugin name> --save-dev
```

## Using a plugin

There are two ways to use a plugin in Cypress:

1. As of Cypress version 10.0.0, you will need to add your plugin to the
   [`setupNodeEvents`](/guides/references/configuration#setupNodeEvents)
   function in the [Cypress configuration](/guides/references/configuration).
2. If you're using an older version of Cypress, you can add your plugin to the
   (deprecated) [plugins file](/guides/references/legacy-configuration#Plugins).

Here's an example of what this might look like:

:::cypress-plugin-example

```javascript
// bind to the event we care about
on('<event>', (arg1, arg2) => {
  // plugin stuff here
})
```

:::

For information on writing plugins, please check out our
[Writing a Plugin](/api/plugins/writing-a-plugin) guide.
