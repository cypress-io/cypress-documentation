---
title: Watching Tests
---

When running in interactive mode using {% url "`cypress open`" command-line#cypress-open %} Cypress watches the filesystem for changes to your spec files. Soon after added or updated a test Cypress will reload it and run all of the tests in that spec file.

This makes for a productive development experience because you can add and edit tests as you're implementing a feature and the Cypress user interface will always reflect the results of your latest edits.

{% note info %}
Remember to use {% url `.only` writing-and-organizing-tests#Excluding-and-Including-Tests %} to limit which tests are run: this can be especially useful when you've got a lot of tests in a single spec file that you're constantly editing; consider also splitting your tests into smaller files each dealing with logically related behavior.
{% endnote %}

## What is watched?

**Files**

* {% url `cypress.json` configuration %}
* {% url `cypress.env.json` environment-variables %}

**Folders**

* `cypress/integration/`
* `cypress/support/`
* `cypress/plugins/`

The folder, the files within the folder, and all child folders and their files (recursively) are watched.

{% note info %}
Those folder paths refer to the {% url 'default folder paths' configuration#Folders-Files %}. If you've configured Cypress to use different folder paths then the folders specific to your configuration will be watched.
{% endnote %}

## What isn't watched?

Everything else; this includes, but isn't limited to, the following:

* Your application code
* `node_modules`
* `cypress/fixtures/`

If you're developing using a modern JS-based web application stack then you've likely got support for some form of hot module replacement which is responsible for watching your application code&mdash;HTML, CSS, JS, etc.&mdash;and transparently reloading your application in response to changes.

## Configuration

Set the {% url `watchForFileChanges` configuration#Global %} configuration property to `false` to disable file watching.

{% note warning %}
**Nothing** is watched during {% url "`cypress run`" command-line#cypress-run %}.

The `watchForFileChanges` property is only in effect when running Cypress using {% url "`cypress open`" command-line#cypress-open %}.
{% endnote %}

The component responsible for the file-watching behavior in Cypress is the {% url 'Cypress Browserify Preprocessor' https://github.com/cypress-io/cypress-browserify-preprocessor %}. This is the default file-watcher packaged with Cypress.

If you need further control of the file-watching behavior you can configure this preprocessor explicitly: it exposes options that allow you to configure behavior such as _what_ is watched and the delay before emitting an "update" event after a change.

Cypress also ships other {% url "file-watching preprocessors" plugins %}; you'll have to configure these explicitly if you want to use them.

- {% url 'Cypress Watch Preprocessor' https://github.com/cypress-io/cypress-watch-preprocessor %}
- {% url 'Cypress Webpack Preprocessor' https://github.com/cypress-io/cypress-webpack-preprocessor %}
