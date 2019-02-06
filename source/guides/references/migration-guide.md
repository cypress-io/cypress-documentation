---
title: Migration Guide
---

## Migrating to Cypress 4.x

Cypress 4.0 introduces a change in terminology related to plugins. In [1.1.0](https://on.cypress.io/changelog#1-1-0), we introduced the _Plugins API_, providing a new and powerful way to extend Cypress. You could access the _Plugins API_ by listening to events in the `pluginsFile`, a file that's run in Node.js as part of Cypress's background process.

However, there's a problem with calling the file the `pluginsFile` and referring to this API surface as the _Plugins API_. We want to define plugins as any 3rd party code that extends Cypress, whether it's run in the browser or Node.js, but the terminology limited plugins only to code running in Node.js.

As part of 4.0, we're updating the terminilogy to hopefully be clearer.

First, we're making it clear that Cypress runs 2 processes: the _browser process_ and the _background process_.

* The _browser process_ runs, naturally, in the browser. It's where your tests and support file are run.
* The _background process_ is run in a Node.js process. It provides greater access to your file system and other capabilities outside the sandbox of the browser.

To fall in line with this, what was originally known as the `pluginsFile` (with a default location of `cypress/plugins/index.js`) is now called the `backgroundFile` (with a default location of `cypress/background/index.js`).

Plugins can run in either process. If you're creating new commands or adding utility functions that can run in the browser, you'll generally define them in the `supportFile`. If you're utilizing the various events exposed to the background process, you can use the `backgroundFile`. Some plugins might use both processes (if, for example, they create a new command that uses `cy.task` under the hood).

Keep on reading for all the changes you may need to make when upgrading to Cypress 4.0.

## Rename pluginsFile to backgroundFile

The `pluginsFile` configuration property has been renamed to {% url "`backgroundFile`" configuration#Folders-Files %}. In your `cypress.json` file...

```json
{
  "pluginsFile": "path/to/file.js"
}
```

...should be changed to:

```json
{
  "backgroundFile": "path/to/file.js"
}
```

## Change the backgroundFile location

The default path of the {% url `backgroundFile` background-process %} (previously known as the `pluginsFile`) has been changed from `cypress/plugins/index.js` to `cypress/background/index.js`. If you don't explicitly set the `backgroundFile` to a custom path, you'll need to move your background file to the new default path. In your `cypress` folder...

```text
/cypress
  /fixtures
  /integration
  /support
  /plugins
    - index.js
```

...should be changed to:

```text
/cypress
  /fixtures
  /integration
  /support
  /background
    - index.js
```

## Rename events

Various events have been renamed to maintain a more consistent format.

### In the browser process

If you listen for any of the following events in your test code, you'll need to rename them.

- Rename `command:end` to `internal:commandEnd`
- Rename `command:enqueued` to `internal:commandEnqueue`
- Rename `command:retry` to `internal:commandRetry`
- Rename `command:start` to `internal:commandStart`
- Rename `fail` to `test:fail`
- Rename `log:added` to `internal:log`
- Rename `log:changed` to `internal:logChange`
- Rename `test:before:run` to `test:start`
- Rename `test:after:run` to `test:end`
- Rename `url:changed` to `page:urlChange`
- Rename `viewport:changed` to `viewport:change`
- Rename `window:alert` to `page:alert`
- Rename `window:confirm` to `page:confirm`
- Rename `window:before:load` to `page:start`
- Rename `window:before:unload` to `before:window:unload`

For example, in your test code...

```javascript
Cypress.on('test:before:run', () => {
  // ...
})

cy.on('window:before:load', () => {
  // ...
})
```

...should be changed to:

```javascript
Cypress.on('test:start', () => {
  // ...
})

cy.on('page:start', () => {
  // ...
})
```

### In the background process

If you listen for any of the following events in your `backgroundFile`, you'll need to rename them.

- Rename `after:screenshot` to `screenshot`
- Rename `before:browser:launch` to `browser:launch`
- Rename `file:preprocessor` to `browser:filePreprocessor`

For example, in your `backgroundFile`...

```javascript
module.exports = (on) => {
  on('file:preprocessor', () => {
    // ...
  })

  on('after:screenshot', () => {
    // ...
  })
}
```

...should be changed to:

```javascript
module.exports = (on) => {
  on('browser:filePreprocessor', () => {
    // ...
  })

  on('screenshot', () => {
    // ...
  })
}
```

## Make changes related to Chai upgrade

Chai 3 has been upgraded to Chai 4, which includes a number of breaking changes and new features outlined in [Chai's migration guide](https://github.com/chaijs/chai/issues/781). Some changes you might notice include:

- The assertions: `within`, `above`, `least`, `below`, `most`, `increase`, `decrease` will throw an error if the assertion's target or arguments are not numbers.

```javascript
// These will throw errors:
expect(null).to.be.within(0, 1)
expect(null).to.be.above(10)

// This will not:
expect('string').to.have.a.length.of.at.least(3)
```

- The `.empty` assertion will now throw when it is passed non-string primitives and functions:

```javascript
// These will throw TypeErrors:
expect(Symbol()).to.be.empty
expect(function() {}).to.be.empty
```

- An error will throw when a non-existent property is read. If there are typos in property assertions, they will now appear as failures.

```javascript
// Would pass in Chai 3 but will fail in 4
expect(true).to.be.ture
```

## Make changes related to Sinon upgrade

Sinon 3 has been upgraded to Sinon 7 with some [breaking changes](https://sinonjs.org/releases/v7.1.1/#migration-guides), including:

- An error will throw when trying to stub a non-existent property.

```javascript
// Would pass in Sinon 3 but will fail in 4+
cy.stub(obj, 'nonExistingProperty')
```

- `cy.spy.reset()` was replaced by `cy.spy.resetHistory()`.
