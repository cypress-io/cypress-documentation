---
title: Migration Guide
---

# Migrating to Cypress 4.x

## pluginsFile renamed to backgroundFile

The `pluginsFile` configuration property has been renamed to `backgroundFile`. 

```json
{
  "pluginsFile": "path/to/file.js"
}
```

should become:

```json
{
  "backgroundFile": "path/to/file.js"
}
```

## Default background file path changed

The default path of the {% url 'background file' background-process %} (previously known as the plugins file) has been changed from `cypress/plugins/index.js` to `cypress/background/index.js`. If you don't explicitly set the `backgroundFile` to a custom path, you'll need to move your background file to the new default path.

```text
/cypress
  /fixtures
  /integration
  /support
  /plugins
    - index.js
```

should become:

```text
/cypress
  /fixtures
  /integration
  /support
  /background
    - index.js
```

## Events renamed

Various events have been renamed to a more consistent format. If you listen for any of the following events in your test code, you'll need to rename them.

- `test:before:run` renamed to `before:test:run`
- `test:after:run` renamed to `after:test:run`
- `window:before:load` renamed to `before:window:load`
- `window:before:unload` renamed to `before:window:unload`

```javascript
Cypress.on('test:before:run', () => {
  // ...
})

cy.on('window:before:load', () => {
  // ...
})
```

should become:

```javascript
Cypress.on('before:test:run', () => {
  // ...
})

cy.on('before:window:load', () => {
  // ...
})
```
