---
title: Before Spec API
---

The `before:spec` event fires before a spec file is run. When running cypress
via `cypress open`, the event will fire when the browser launches.

## Syntax

::include{file=partials/warning-setup-node-events.md}

<Alert type="warning">

⚠️ When running via `cypress open`, the `before:spec` event only fires if the
[experimentalInteractiveRunEvents flag](/guides/references/configuration#Experiments)
is enabled.

</Alert>

```js
on('before:spec', (spec) => {
  /* ... */
})
```

**<Icon name="angle-right"></Icon> spec** **_(Object)_**

Details of the spec file, including the following properties:

| Property   | Description                                                                                          |
| ---------- | ---------------------------------------------------------------------------------------------------- |
| `name`     | The base name of the spec file (e.g. `login_spec.js`)                                                |
| `relative` | The path to the spec file, relative to the project root (e.g. `cypress/integration/login_spec.js`)   |
| `absolute` | The absolute path to the spec file (e.g. `/Users/janelane/my-app/cypress/integration/login_spec.js`) |

## Usage

You can return a promise from the `before:spec` event handler and it will be
awaited before Cypress proceeds running the spec.

### Log the relative spec path to stdout before the spec is run

```javascript
module.exports = (on, config) => {
  on('before:spec', (spec) => {
    // spec will look something like this:
    // {
    //   name: 'login_spec.js',
    //   relative: 'cypress/integration/login_spec.js',
    //   absolute: '/Users/janelane/app/cypress/integration/login_spec.js',
    // }

    console.log('Running', spec.relative)
  })
}
```

## See also

- [After Spec API](/api/plugins/after-spec-api)
- [Before Run API](/api/plugins/before-run-api)
- [After Run API](/api/plugins/after-run-api)
- [Plugins Guide](/guides/tooling/plugins-guide)
- [Writing a Plugin](/api/plugins/writing-a-plugin)
