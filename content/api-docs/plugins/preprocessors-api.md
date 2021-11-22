---
title: Preprocessors API
---

A preprocessor is the plugin responsible for preparing a
[support file](/guides/core-concepts/writing-and-organizing-tests#Support-file)
or a [test file](/guides/core-concepts/writing-and-organizing-tests#Test-files)
for the browser.

A preprocessor could transpile your file from another language (CoffeeScript or
ClojureScript) or from a newer version of JavaScript (ES2017).

A preprocessor also typically watches the source files for changes, processes
them again, and then notifies Cypress to re-run the tests.

## Examples

We've created three preprocessors as examples for you to look at. These are
fully functioning preprocessors.

The code contains comments that explain how it utilizes the preprocessor API.

- [webpack preprocessor](https://github.com/cypress-io/cypress/tree/master/npm/webpack-preprocessor)
- [Browserify preprocessor](https://github.com/cypress-io/cypress-browserify-preprocessor)
- [Watch preprocessor](https://github.com/cypress-io/cypress-watch-preprocessor)

### See also

The blog post
[Write Cypress Markdown Preprocessor](https://glebbahmutov.com/blog/write-cypress-preprocessor/)
shows how to write your own file preprocessor.

## Defaults

By default, Cypress comes packaged with the **webpack preprocessor** already
installed.

The webpack preprocessor handles:

- ES2015 and JSX via Babel
- TypeScript
- CoffeeScript `1.x.x`
- Watching and caching files

<Alert type="info">

Are you looking to change the **default options** for webpack?

</Alert>

If you already use webpack in your project, you can pass in your webpack config
as
[shown here](https://github.com/cypress-io/cypress/tree/master/npm/webpack-preprocessor#options).

If you don't use webpack in your project or would like to keep the majority of
the default options, you can
[modify the default options](https://github.com/cypress-io/cypress/tree/master/npm/webpack-preprocessor#modifying-default-options).
Editing the options allows you to do things like:

- Add your own Babel plugins
- Modify options for TypeScript compilation
- Add support for CoffeeScript `2.x.x`

## Usage

<Alert type="warning">

⚠️ This code is part of the
[plugins file](/guides/core-concepts/writing-and-organizing-tests#Plugin-files)
and thus executes in the Node environment. You cannot call `Cypress` or `cy`
commands in this file, but you do have the direct access to the file system and
the rest of the operating system.

</Alert>

To use a preprocessor, you should bind to the `file:preprocessor` event in your
[pluginsFile](/guides/references/configuration#Folders-Files):

```javascript
// plugins file
module.exports = (on, config) => {
  on('file:preprocessor', (file) => {
    // ...
  })
}
```

### The callback function should return one of the following:

- A promise\* that eventually resolves the path to the **built file**\*\*.
- A promise\* that eventually rejects with an error that occurred during
  processing.

> \* The promise should resolve only after the file has completed writing to
> disk. The promise resolving is a signal that the file is ready to be served to
> the browser.

---

> \*\* The built file is the file that is created by the preprocessor that will
> eventually be served to the browser.

> If, for example, the source file is `spec.coffee`, the preprocessor should:

1. Compile the CoffeeScript into JavaScript `spec.js`
2. Write that JavaScript file to disk (example: `/Users/foo/tmp/spec.js`)
3. Resolve with the absolute path to that file: `/Users/foo/tmp/spec.js`

<Alert type="warning">

This callback function can and _will_ be called multiple times with the same
`filePath`.

The callback function is called any time a file is requested by the browser.
This happens on each run of the tests.

Make sure not to start a new watcher each time it is called. Instead, cache the
watcher and, on subsequent calls, return a promise that resolves when the latest
version of the file has been processed.

</Alert>

## File object

The `file` object passed to the callback function has the following properties:

| Property      | Description                                                                                                                                                                                                                       |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `filePath`    | The full path to the source file.                                                                                                                                                                                                 |
| `outputPath`  | The suggested path for saving the preprocessed file to disk. This is unique to the source file. A preprocessor can choose to write the file elsewhere, but Cypress automatically provides you this value as a convenient default. |
| `shouldWatch` | A boolean indicating whether the preprocessor should watch for file changes or not.                                                                                                                                               |

## File events

The `file` object passed to the callback function is an
[Event Emitter](https://nodejs.org/api/events.html#events_class_eventemitter).

### Receiving 'close' event

When the running spec, the project, or the browser is closed while running
tests, the `close` event will be emitted. The preprocessor should do any
necessary cleanup in this function, like closing the watcher when watching.

```javascript
// example
const watcher = fs.watch(filePath /* ... */)

file.on('close', () => {
  watcher.close()
})
```

### Sending 'rerun' event

If watching for file changes, emit `rerun` after a file has finished being
processed to let Cypress know to rerun the tests.

```javascript
// example
fs.watch(filePath, () => {
  file.emit('rerun')
})
```

## Publishing

Publish preprocessors to [npm](https://www.npmjs.com/) with the naming
convention `cypress-*-preprocessor` (e.g. cypress-clojurescript-preprocessor).

Use the following npm keywords:

```json
"keywords": [
  "cypress",
  "cypress-plugin",
  "cypress-preprocessor"
]
```

Feel free to submit your published plugins to our [list of plugins](/plugins).
