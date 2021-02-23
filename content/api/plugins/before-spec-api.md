---
title: Before Spec API
containerClass: experimental
---

The `before:spec` event fires before a spec file is run. The event only fires when running via `cypress run`.

<Alert type="warning">

<Icon name="exclamation-triangle" color="orange"></Icon> **This is an experimental feature. In order to use it, you must set the [experimentalRunEvents](/guides/references/experiments) configuration option to `true`.**

</Alert>

## Syntax

```js
on("before:spec", (spec) => {
  /* ... */
});
```

**<Icon name="angle-right"></Icon> spec** **_(Object)_**

Details of the spec file, including the following properties:

| Property   | Description                                                                                          |
| ---------- | ---------------------------------------------------------------------------------------------------- |
| `name`     | The base name of the spec file (e.g. `login_spec.js`)                                                |
| `relative` | The path to the spec file, relative to the project root (e.g. `cypress/integration/login_spec.js`)   |
| `absolute` | The absolute path to the spec file (e.g. `/Users/janelane/my-app/cypress/integration/login_spec.js`) |

## Usage

You can return a promise from the `before:spec` event handler and it will be awaited before Cypress proceeds running the spec.

### Log the relative spec path to stdout before the spec is run

```javascript
module.exports = (on, config) => {
  on("before:spec", (spec) => {
    // spec will look something like this:
    // {
    //   name: 'login_spec.js',
    //   relative: 'cypress/integration/login_spec.js',
    //   absolute: '/Users/janelane/app/cypress/integration/login_spec.js',
    // }

    console.log("Running", spec.relative);
  });
};
```

## See also

- [After Spec API](/api/plugins/after-spec-api)
- [Before Run API](/api/plugins/before-run-api)
- [After Run API](/api/plugins/after-run-api)
- [Plugins Guide](/guides/tooling/plugins-guide)
- [Writing a Plugin](/api/plugins/writing-a-plugin)
