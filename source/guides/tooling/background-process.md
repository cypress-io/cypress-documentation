---
title: Background Process

---

Normally, all of your test code, your application, and Cypress commands are executed in the browser. But Cypress also runs a Node.js process outside the browser that you can utilize. We call this the **background process**.

The **background file** enables you to run code in the **background process** to hook into, modify, or extend the internal behavior of Cypress via Node.js.

**Background events** are a "seam" for you to write your own custom code that executes during particular stages of the Cypress lifecycle. {% url "Check out the various events here" catalog-of-events %}.

# Use Cases

## Configuration

You can programmatically alter the resolved configuration and environment variables that come from `cypress.json`, {% url `cypress.env.json` environment-variables#Option-2-cypress-env-json %}, the CLI, or system environment variables.

This enables you to do things like:

- Use multiple environments with their own configurations
- Swap out environment variables based on an environment
- Read in configuration files using the built in `fs` lib
- Write your configuration in `yml`

Check out our {% url '`configuration` docs' configuration-event %} which describe how to use this event.

## Preprocessors

The event `file:preprocessor` is used to customize how your test code is transpiled and sent to the browser. By default Cypress handles CoffeeScript and ES6 using `babel` and then uses `browserify` to package it for the browser.

You can use the `file:preprocessor` event to do things like:

- Add TypeScript support.
- Add the latest ES* support.
- Write your test code in ClojureScript.
- Customize the `babel` settings to add your own plugins.
- Swap out `browserify` for `webpack` or anything else.

Check out the {% url '`file:preprocessor` event docs' file-preprocessor-event %} which describe how to use this event.

## Browser Launching

The event `before:browser:launch` can be used to modify the launch arguments for each particular browser.

You can use the `before:browser:launch` event to do things like:

- Load a Chrome extension
- Change print media
- Enable or disable experimental chrome features
- Control which Chrome components are loaded

Check out the {% url '`before:browser:launch` event docs' before-browser-launch-event %} which describe how to use this event.

## Screenshot handling

The event `after:screenshot` is called after a screenshot is taken and saved to disk.

You can use the `after:screenshot` event to do things like:

- Save details about the screenshot
- Rename the screenshot
- Manipulate the screenshot image by resizing or cropping it

Check out the {% url '`after:screenshot` event docs' after-screenshot-event %} which describe how to use this event.

## cy.task

The event `task` is used in conjunction with the {% url `cy.task()` task %} command. It allows you to write arbitrary code in Node.js to accomplish tasks that aren't possible in the browser.

You can use the `task` event to do things like:

- Manipulating a database (seeding, reading, writing, etc.)
- Storing state in Node that you want persisted (since the driver is fully refreshed on visits)
- Performing parallel tasks (like making multiple http requests outside of Cypress)
- Running an external process (like spinning up a Webdriver instance of another browser like Firefox, Safari, or puppeteer)

Check out the {% url '`task` event docs' task-event %} which describe how to use this event.

# API

Whether you install an NPM module, or just want to write your own code - you should do all of that in this file:

```text
cypress/background/index.js
```

{% note info %}
By default Cypress seeds this file for new projects, but if you have an existing project, just create this file yourself.
{% endnote %}

Inside of this file, you will export a function. Cypress will call this function, pass you the project's configuration, and enable you to bind to the events exposed.

```javascript
// cypress/background/index.js

// export a function
module.exports = (on, config) => {

  // bind to the event we care about
  on('<event>', (arg1, arg2) => {
    // plugin stuff here
  })
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

Each event documents its own argument signature. To understand how to use them, please {% url "refer to the docs for each one" catalog-of-events %}.

## config

`config` is the resolved {% url "Cypress configuration" configuration %} of the opened project.

This configuration contains all of the values that get passed into the browser for your project.

{% url 'For a comprehensive list of all configuration values look here.' https://github.com/cypress-io/cypress/blob/master/packages/server/lib/config.coffee %}

Some plugins may utilize or require these values, so they can take certain actions based on the configuration.

You can programmatically modify these values and Cypress will then respect these changes. This enables you to swap out configuration based on things like the environment you're running in.

{% url "Please check out our API docs for modifying configuration here." configuration-event %}

# Execution context

Your `backgroundFile` is invoked when Cypress opens a project.

Cypress does this by spawning an independent `child_process` which then `requires` in your `backgroundFile`. This is similar to the way Visual Studio Code or Atom works.

You will need to keep in mind it is **Cypress who is requiring your file** - not your local project, not your local Node version, and not anything else under your control.

Because of this, this global context and the version of Node is controlled by Cypress.

{% note warning "Node version" %}

Keep in mind - code executed in plugins is executed **by the Node version** that comes bundled in Cypress itself.

This version of Node has **no relation** to locally installed versions. Therefore you have to write Node code which is compatible with this version.

You can find the current Node version we use {% url 'here' https://github.com/cypress-io/cypress/blob/master/.node-version %}.

{% endnote %}

## NPM modules

When Cypress executes your `backgroundFile` it will execute with `process.cwd()` set to your project's path. Additionally - you will be able to `require` **any Node module** you have installed.

You can also `require` local files relative to your project.

**For example, if your `package.json` looked like this:**

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

**Then you could do any of the following in your `backgroundFile`:**

```js
// cypress/plugins/index.js

const path = require('path') // native node packages
const debug = require('debug') // dependencies
const _ = require('lodash') // dev dependencies
const User = require('../../lib/models/user') // relative local modules

console.log(__filename) // /Users/janelane/Dev/my-project/cypress/background/index.js

console.log(process.cwd()) // /Users/janelane/Dev/my-project
```

# Error handling

Cypress spawns your `backgroundFile` in its own child process so it is isolated away from the context that Cypress itself runs in. That means you cannot accidentally modify or change Cypress' own execution in any way.

If your `backgroundFile` has an uncaught exception, an unhandled rejection from a promise, a syntax error, or anything else - we will automatically catch those and display them to you inside of the console and even in the Test Runner itself.

Errors from your plugins *will not crash* Cypress.

# File changes

Normally when writing code in Node, you typically have to restart the process after changing any files.

With Cypress, we automatically watch your `backgroundFile` and any changes made will take effect immediately. We will read the file in and execute the exported function again.

This enables you to iterate on plugin code even with Cypress already running.
