---
title: Preprocessors API
comments: false
---

A preprocessor is a [plugin](./top-level-api.html) that runs when the support file or a spec file is required by the test runner.

It can compile/transpile that file from another language (e.g. CoffeeScript, ClojureScript) to JavaScript or from a newer version of JavaScript (e.g. ES2017) to a version that has more browser compatibility (ES5).

It can also watch the source file for changes, re-process it, and tell Cypress to re-run the tests.

See the following preprocessors as examples. The code contains comments that explain how it utilizes the preprocessor API.

* [Browserify Preprocessor](https://github.com/cypress-io/cypress-browserify-preprocessor)
* [Webpack Preprocessor](https://github.com/cypress-io/cypress-webpack-preprocessor)
* [Watch Preprocessor](https://github.com/cypress-io/cypress-watch-preprocessor)

Preprocessors should be published to [npm](https://www.npmjs.com/) with the name being `cypress-*-preprocessor` (e.g. cypress-clojurescript-preprocessor). Use the following npm keywords: `cypress`, `cypress-plugin`, `cypress-preprocessor`.

Setting a preprocessor involves registering the `on:spec:file:preprocessor` event in the *plugins file* (`cypress/plugins/index.js` by default), like so:

```javascript
// plugins file
module.exports = (register, config) => {
  register('on:spec:file:preprocessor', (filePath, util) => {
    // ...
  })
}
```

The callback function should return one of the following:

* The path to the **output file**\*
* A promise\*\* that resolves the path to the **output file**\*
* A promise\*\* that rejects with an error that occurred during processing

\* The **output file** is the file that is created by the processing and will be served to the browser. If, for example, the source file is CoffeeScript (e.g. `spec.coffee`), the preprocessor should compile the CoffeeScript into JavaScript (e.g. `spec.js`), write that JavaScript file to disk, and return or resolve the full path to that file (e.g. `/Users/foo/tmp/spec.js`).

\*\* The promise should resolve only after the file has completed writing to disk. The promise resolving is a signal that the file is ready to be served to the browser.

{% note warning %}
This function can and will be called multiple times with the same filePath, because it is called any time the file is requested by the browser (i.e. on each run of the tests). Make sure not to start a new watcher each time it is called. Instead, cache the watcher and, on subsequent calls, return a promise that resolves when the latest version of the file has been processed.
{% endnote %}

The callback function is called with the following arguments:

## filePath

The full path to the source file.

## util

An object of the following utility functions:

### util.getOutputPath(filePath)

Takes the `filePath` passed into the preprocessor function and returns a path for saving the preprocessed file to disk. A preprocessor can choose to write the file elsewhere, but this provides a convenient place to put the file (alongside other Cypress app data).

```javascript
// example
util.getOutputPath(filePath)
// => /Users/jane-lane/Library/Application Support/Cypress/cy/production/projects/sample-project-fc17bd175cded40c4feec4861b699fc2/bundles/cypress/integration/example_spec.js
```

### util.fileUpdated(filePath)

If watching for file changes, this function should be called (with the source `filePath`) after a file has finished being processed to let Cypress know to re-run the tests.

```javascript
// example
fs.watch(filePath, () => {
  util.fileUpdated(filePath)
})
```

### util.onClose(function)

This registers a function that will be called if the spec being run is closed or the project is closed. The preprocessor should do any necessary cleanup in this function, like closing the watcher when watching.

```javascript
// example
const watcher = fs.watch(filePath, /* ... */)

util.onClose(() => {
  watcher.close()
})
```
