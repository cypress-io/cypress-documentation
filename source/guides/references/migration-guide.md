---
title: Migration Guide
---

# Migrating to Cypress 4.x

## pluginsFile renamed to backgroundFile

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

## Default background file path changed

The default path of the {% url 'background file' background-process %} (previously known as the plugins file) has been changed from `cypress/plugins/index.js` to `cypress/background/index.js`. If you don't explicitly set the `backgroundFile` to a custom path, you'll need to move your background file to the new default path. In your `cypress` folder...

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

## Events renamed

Various events have been renamed to maintain a more consistent format. If you listen for any of the following events in your test code, you'll need to rename them.

- Rename `test:before:run` to `test:start`
- Rename `test:after:run` to `test:end`
- Rename `fail` to `test:fail`
- Rename `window:alert` to `page:alert`
- Rename `window:confirm` to `page:confirm`
- Rename `window:before:load` to `page:start`
- Rename `window:before:unload` to `before:window:unload`
- Rename `command:end` to `internal:commandEnd`
- Rename `command:enqueued` to `internal:commandEnqueue`
- Rename `command:retry` to `internal:commandRetry`
- Rename `command:start` to `internal:commandStart`

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

## Upgrade to Chai 4

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

## Upgrade to Sinon 7

Sinon 3 has been upgraded to Sinon 7 with some [breaking changes](https://sinonjs.org/releases/v7.1.1/#migration-guides), including:

- An error will throw when trying to stub a non-existent property.

```javascript
// Would pass in Sinon 3 but will fail in 4+
cy.stub(obj, 'nonExistingProperty')
```

- `cy.spy.reset()` was replaced by `cy.spy.resetHistory()`.
