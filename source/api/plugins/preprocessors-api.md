---
title: Preprocessors API
comments: false
---

A preprocessor is a {% url "plugin" plugins-api %} that runs when the {% url "support file" writing-and-organizing-tests#Support-file %} or {% url "test files" writing-and-organizing-tests#Test-files %} is required by the Test Runner.

It can compile or transpile that file from another language (e.g. CoffeeScript, ClojureScript) to JavaScript or from a newer version of JavaScript (e.g. ES2017) to a version that has more browser compatibility (ES5).

It can also watch the source file for changes, re-process it, and tell Cypress to re-run the tests.

# Examples

See the following preprocessors as examples. The code contains comments that explain how it utilizes the preprocessor API.

* [Browserify Preprocessor](https://github.com/cypress-io/cypress-browserify-preprocessor)
* [Webpack Preprocessor](https://github.com/cypress-io/cypress-webpack-preprocessor)
* [Watch Preprocessor](https://github.com/cypress-io/cypress-watch-preprocessor)

# Usage

A user will configure a preprocessor by listening to the `file:preprocessor` event in their {% url "`plugins file`" configuration#Folders-Files %} (`cypress/plugins/index.js` by default), like so:

```javascript
// plugins file
module.exports = (on) => {
  on('file:preprocessor', (config) => {
    // ...
  })
}
```

***The callback function should return one of the following:***

* The path to the **output file**\*.
* A promise\*\* that resolves the path to the **output file**\*.
* A promise\*\* that rejects with an error that occurred during processing.

\* *The output file is the file that is created by the processing and will be served to the browser. If, for example, the source file is CoffeeScript (e.g. `spec.coffee`), the preprocessor should compile the CoffeeScript into JavaScript (e.g. `spec.js`), write that JavaScript file to disk, and return or resolve the full path to that file (e.g. `/Users/foo/tmp/spec.js`).*

\*\* *The promise should resolve only after the file has completed writing to disk. The promise resolving is a signal that the file is ready to be served to the browser.*

{% note warning %}
This function can and *will* be called multiple times with the same `filePath`, because it is called any time the file is requested by the browser (i.e. on each run of the tests). Make sure not to start a new watcher each time it is called. Instead, cache the watcher and, on subsequent calls, return a promise that resolves when the latest version of the file has been processed.
{% endnote %}

# Config object properties

The `config` object passed to the callback function has the following properties:

Property | Description
--------- | ----------
`filePath` | The full path to the source file.
`outputPath` | A path unique to the source file for saving the preprocessed file to disk. A preprocessor can choose to write the file elsewhere, but this provides a convenient default path for the file (alongside other Cypress app data).
`shouldWatch` | A boolean indicating whether the preprocessor should watch for file changes or not.

# Config object events

The `config` object passed to the callback function is an [Event Emitter](https://nodejs.org/api/events.html#events_class_eventemitter).

***Receiving 'close' event***

When the spec being run is closed or the project is closed, the 'close' event will be emitted. The preprocessor should do any necessary cleanup in this function, like closing the watcher when watching.

```javascript
// example
const watcher = fs.watch(filePath, /* ... */)

config.on('close', () => {
  watcher.close()
})
```

***Sending 'rerun' event***

If watching for file changes, emit 'rerun' after a file has finished being processed to let Cypress know to rerun the tests.

```javascript
// example
fs.watch(filePath, () => {
  config.emit('rerun')
})
```

# Publishing

Publish preprocessors to [npm](https://www.npmjs.com/) with the naming convention `cypress-*-preprocessor` (e.g. cypress-clojurescript-preprocessor).

Use the following npm keywords:

```json
"keywords": [
  "cypress",
  "cypress-plugin",
  "cypress-preprocessor"
]
```

Feel free to submit your published plugins to our {% url "list of plugins" plugins %}.
