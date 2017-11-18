---
title: Plugins
comments: false
---

Plugins enable you to tap into, modify, or extend the internal behavior of Cypress.

Normally, as a user, all of your test code, your application, and Cypress commands are executed in the browser. But Cypress is also a **Node.js** process that plugins can use.

> Plugins enable you to tap into the `node` process running outside of the browser.

Plugins are a "seam" for you to write your own custom code that executes during particular stages of the Cypress lifecycle.

{% note info "New Projects" %}
When new projects are added to Cypress we will automatically seed them with a basic plugins file.

By default Cypress will create a plugins file at: `cypress/plugins/index.js`.

This is configurable in your `cypress.json` with the {% url "`pluginsFile`" configuration#Folders-Files %} option.
{% endnote %}

# Plugin types

## Preprocessors

As of today we offer a single plugin event: `file:preprocessor`. This event is used to customize how your test code is transpiled and sent to the browser. By default Cypress handles CoffeeScript and ES6 using `babel` and then uses `browserify` to package it for the browser.

You can use the `file:preprocessor` event to do things like:

- Add TypeScript support.
- Add the latest ES* support.
- Write your test code in ClosureScript.
- Customize the `babel` settings to add your own plugins.
- Swap out `browserify` for `webpack` or anything else.

Check out our {% url 'File Preprocessor API docs' preprocessors-api %} which describe how to use this event.

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

Check out our {% url 'Writing a Plugin doc' writing-a-plugin %} which describes how to write plugins.

{% note warning "Node version" %}

Keep in mind - code executed in plugins is executed **by the node version** that comes bundled in Cypress itself.

This version of node has **nothing to do** with your locally installed versions. Therefore you have to write node code which is compatible with this version.

You can find the current node version we use {% url 'here' https://github.com/cypress-io/cypress/blob/master/.node-version %}.

This node version gets updated regularly (next version will be in the `8.x.x` range) so you'll likely be able to use all the latest ES7 features.

{% endnote %}
