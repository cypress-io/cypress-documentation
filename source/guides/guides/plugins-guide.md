---
title: Plugins
comments: false
---

Plugins enable you to tap into, modify, or extend the internal behavior of Cypress.

Normally, as a user, all of your test code, your application, and Cypress commands are executed in the browser. But Cypress is also a **Node.js** process that plugins can use.

> Plugins enable you to tap into the `node` process running outside of the browser.

Plugins are a "seam" for you to write your own custom code that executes during particular stages of the Cypress lifecycle.

{% note info "This is a brief overview" %}
If you want more details about how to write a plugin, we've written API docs that show you how to work with each plugin event.

You can {% url "check out the API docs here" writing-a-plugin %}.
{% endnote %}

# Use Cases

## Configuration

With plugins, you can programmatically alter the resolved configuration and environment variables that come from `cypress.json`, `cypress.env.json`, the CLI, or system environment variables.

This enables you to do things like:

- Use multiple environments with their own configurations
- Swap out environment variables based on an environment
- Read in configuration files using the built in `fs` lib
- Write your configuration in `yml`

Check out our {% url 'Configuration API docs' configuration-api %} which describe how to use this event.

## Preprocessors

This event: `file:preprocessor` is used to customize how your test code is transpiled and sent to the browser. By default Cypress handles CoffeeScript and ES6 using `babel` and then uses `browserify` to package it for the browser.

You can use the `file:preprocessor` event to do things like:

- Add TypeScript support.
- Add the latest ES* support.
- Write your test code in ClojureScript.
- Customize the `babel` settings to add your own plugins.
- Swap out `browserify` for `webpack` or anything else.

Check out our {% url 'File Preprocessor API docs' preprocessors-api %} which describe how to use this event.

## Browser Launching

This event: `before:browser:launch` can be used to modify the launch arguments for each particular browser.

You can use the `before:browser:launch` to do things like:

- Load a Chrome extension
- Change print media
- Enable or disable experimental chrome features
- Control which Chrome components are loaded

Check out our {% url 'Browser Launch API docs' browser-launch-api %} which describe how to use this event.

# List of plugins

Cypress maintains an official list of plugins created by us and the community. You can `npm install` any of the plugins listed below:

{% url 'Our official list of Cypress plugins.' plugins %}

# Installing plugins

Plugins from our {% url 'official list' plugins %} are just NPM modules. This enables them to be versioned and updated separately without needing to update Cypress itself.

You can install any published plugin using NPM:

```shell
npm install &lt;plugin name&gt; --save-dev
```

# Using a plugin

Whether you install an NPM module, or just want to write your own code - you should do all of that in this file:

```text
cypress/plugins/index.js
```

{% note info %}
By default Cypress seeds this file for new projects, but if you have an existing project just create this file yourself.
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
