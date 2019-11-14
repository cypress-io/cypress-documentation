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

The event `file:preprocessor` is used to customize how your test code is transpiled and sent to the browser. By default Cypress handles CoffeeScript and ES6 using `babel` and then uses `browserify` to package it for the browser.

You can use the `file:preprocessor` event to do things like:

- Add TypeScript support.
- Add the latest ES* support.
- Write your test code in ClojureScript.
- Customize the `babel` settings to add your own plugins.
- Swap out `browserify` for `webpack` or anything else.

Check out our {% url 'File Preprocessor API docs' preprocessors-api %} which describe how to use this event.

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
- Running an external process (like spinning up a Webdriver instance of another browser like Firefox, Safari, or puppeteer)

# List of plugins

Cypress maintains an official list of plugins created by us and the community. You can `npm install` any of the plugins listed below:

{% url 'Our official list of Cypress plugins.' plugins %}

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

# Change list of browsers

Cypress comes with bundled Electron browser and also tries to find all supported browsers on your machine at start up. Sometimes you might want to modify this list of browsers before running the tests. For example, your web application might ONLY work on a Chrome browser, and not inside the Electron browser. In the plugins file, filter the list of browsers passed inside the `config` object and return a limited list

```javascript
// cypress/plugins/index.js
module.exports = (on, config) => {
  // inside config.browsers array each object has information like
  // {
  //   name: 'canary',
  //   family: 'chrome',
  //   displayName: 'Canary',
  //   version: '80.0.3966.0',
  //   path:
  //    '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
  //   majorVersion: 80
  // }
  return {
    browsers: config.browsers.filter((b) => b.family === 'chrome')
  }
}
```

When you open Cypress GUI in a project that uses the above plugins file, you will only find the Chrome browsers found on the system, and no Electron browser.

{% imgTag /img/guides/plugins/chrome-browsers-only.png "Filtered list of Chrome browsers" %}

{% note info %}
If you return an empty list of browsers or `browsers: null`, the default list will be restored automatically.
{% endnote %}

If you have installed a Chromium-based browser like {% url Brave https://brave.com/ %}, {% url Vivaldi https://vivaldi.com/ %} and even the new {% url "Microsoft Edge Beta" https://www.microsoftedgeinsider.com/en-us/ %} you can add them to the list of returned browsers. Here is a plugins file that inserts a local Brave browser into the returned list.

```javascript
// cypress/plugins/index.js
const execa = require('execa')
const findBrowser = () => {
  // the path is hard-coded for simplicity
  const browserPath =
    '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'

  return execa(browserPath, ['--version']).then((result) => {
    // STDOUT will be like "Brave Browser 77.0.69.135"
    const [, version] = /Brave Browser (\d+\.\d+\.\d+\.\d+)/.exec(
      result.stdout
    )
    const majorVersion = parseInt(version.split('.')[0])

    return {
      name: 'Brave',
      family: 'chrome',
      displayName: 'Brave',
      version,
      path: browserPath,
      majorVersion
    }
  })
}

module.exports = (on, config) => {
  return findBrowser().then((browser) => {
    return {
      browsers: config.browsers.concat(browser)
    }
  })
}
```

{% imgTag /img/guides/plugins/brave-browser.png "List of browsers includes Brave browser" %}

Once selected, the Brave browser is detected using the same approach as any other browser of the `chrome` family.

{% imgTag /img/guides/plugins/brave-running-tests.png "Brave browser executing end-to-end tests" %}

If you modify the list of browsers, the Test Runner highlights the updated list in the Settings tab of the Test Runner.

