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

- Rename `test:before:run` to `before:test:run`
- Rename `test:after:run` to `after:test:run`
- Rename `window:before:load` to `before:window:load`
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
Cypress.on('before:test:run', () => {
  // ...
})

cy.on('before:window:load', () => {
  // ...
})
```
