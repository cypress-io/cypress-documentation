---
title: Plugins
---

Plugins enable you to tap into, modify, or extend the internal behavior of Cypress.

Normally, as a user, all of your test code, your application, and Cypress commands are executed in the browser. But Cypress is also a Node process that plugins can use.

> Plugins enable you to tap into the Node process running outside of the browser.

Plugins are a "seam" for you to write your own custom code that executes during particular stages of the Cypress lifecycle. It also allows you to execute code within your own Node version when the {% url "`nodeVersion`" configuration#Node-version %} is set in your configuration.

{% note info "This is a brief overview" %}
If you want more details about how to write a plugin, we've written API docs that show you how to work with each plugin event.

You can {% url "check out the API docs here" writing-a-plugin %}.
{% endnote %}

# Use Cases

## Configuration

With plugins, you can programmatically alter the resolved configuration and environment variables that come from {% url "your configuration file (`cypress.json` by default)" configuration %}, {% url `cypress.env.json` environment-variables#Option-2-cypress-env-json %}, the {% url "command line" command-line %}, or system environment variables.

This enables you to do things like:

- Use multiple environments with their own configurations
- Swap out environment variables based on an environment
- Read in configuration files using the built in `fs` lib
- Change the list of browsers used for testing
- Write your configuration in `yml`

Check out our {% url 'Configuration API docs' configuration-api %} which describe how to use this event.

## Preprocessors

The event `file:preprocessor` is used to customize how your test code is transpiled and sent to the browser. By default, Cypress handles ES2015+, TypeScript, and CoffeeScript, using webpack to package it for the browser.

You can use the `file:preprocessor` event to do things like:

- Add the latest ES* support.
- Write your test code in ClojureScript.
- Customize the Babel settings to add your own plugins.
- Customize the options for compiling TypeScript.
- Swap out webpack for Browserify or anything else.

Check out our {% url 'File Preprocessor API docs' preprocessors-api %} which describe how to use this event.

## Run Lifecycle

The event {% url `before:spec` before-spec-api %} occurs before a run starts.

You can use {% url `before:run` before-run-api %} to do things like:

- Set up reporting on a run
- Start a timer for the run to time how long it takes

## Spec Lifecycle

The events {% url `before:spec` before-spec-api %} and {% url `after:spec` after-spec-api %} run before and after a single spec is run, respectively.

You can use {% url `before:spec` before-spec-api %} to do things like:

- Set up reporting on a spec running
- Start a timer for the spec to time how long it takes

You can use {% url `after:spec` after-spec-api %} to do things like:

- Finish up reporting set up in `before:spec`
- Stop the timer for the spec set up in `before:spec`
- Delete the video recorded for the spec. This prevents it from taking time and computing resources for compressing and uploading the video. You can do this conditionally based on the results of the spec, such as if it passes (so videos for failing tests are preserved for debugging purposes).

Check out the {% url 'Before Spec API doc' before-spec-api %} and {% url 'After Spec API doc' after-spec-api %} which describe how to use these events.

## Browser Launching

The event `before:browser:launch` can be used to modify the launch arguments for each particular browser.

You can use the `before:browser:launch` event to do things like:

- Load a Chrome extension
- Enable or disable experimental chrome features
- Control which Chrome components are loaded

Check out our {% url 'Browser Launch API docs' browser-launch-api %} which describe how to use this event.

## Screenshot handling

The event `after:screenshot` is called after a screenshot is taken and saved to disk.

You can use the `after:screenshot` event to do things like:

- Save details about the screenshot
- Rename the screenshot
- Manipulate the screenshot image by resizing or cropping it

Check out our {% url 'After Screenshot API docs' after-screenshot-api %} which describe how to use this event.

## cy.task

The event `task` is used in conjunction with the {% url `cy.task()` task %} command. It allows you to write arbitrary code in Node to accomplish tasks that aren't possible in the browser. It also allows you to execute code within your own Node version when the {% url "`nodeVersion`" configuration#Node-version %} is set in your configuration.

You can use the `task` event to do things like:

- Manipulating a database (seeding, reading, writing, etc.)
- Storing state in Node that you want persisted (since the driver is fully refreshed on visits)
- Performing parallel tasks (like making multiple http requests outside of Cypress)
- Running an external process (like spinning up a Webdriver instance of another browser like Safari or puppeteer)

#### {% fa fa-graduation-cap %} Real World Example

The {% url "Real World App (RWA)" https://github.com/cypress-io/cypress-realworld-app %} uses {% url tasks task %} to re-seed its database, and to filter/find test data for various testing scenarios.

```ts
// cypress/plugins/index.ts

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

> *{% fa fa-github %} Source: {% url "cypress/plugins/index.ts" https://github.com/cypress-io/cypress-realworld-app/blob/develop/cypress/plugins/index.ts %}*

Check out the {% url "Real World App test suites" https://github.com/cypress-io/cypress-realworld-app/tree/develop/cypress/tests/ui %} to see these tasks in action.

# List of plugins

Cypress maintains a curated list of plugins created by us and the community. You can `npm install` any of the plugins listed below:

{% url 'Our curated list of Cypress plugins.' plugins %}

# Installing plugins

Plugins from our {% url 'official list' plugins %} are npm modules. This enables them to be versioned and updated separately without needing to update Cypress itself.

You can install any published plugin using NPM:

```shell
npm install &lt;plugin name&gt; --save-dev
```

# Using a plugin

Whether you install an npm module, or want to write your own code - you should do all of that in this file:

```text
cypress/plugins/index.js
```

{% note info %}
By default Cypress seeds this file for new projects, but if you have an existing project create this file yourself.
{% endnote %}

Inside of this file, you will export a function. Cypress will call this function, pass you the project's configuration, and enable you to bind to the events exposed.

```javascript
// cypress/plugins/index.js

// export a function
module.exports = (on, config) => {
  // bind to the event we care about
  on('<event>', (arg1, arg2) => {
    // plugin stuff here
  })
}
```

For more information on writing plugins, please {% url "check out our API docs here" writing-a-plugin %}.
