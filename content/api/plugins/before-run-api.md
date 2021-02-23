---
title: Before Run API
containerClass: experimental
---

The `before:run` event fires before a run starts. The event only fires when running via `cypress run`.

The event will fire each time `cypress run` executes. As a result, if running your specs in [parallel](/guides/guides/parallelization), the event will fire once for each machine on which the tests are run.

<Alert type="warning">

<Icon name="exclamation-triangle" color="orange"></Icon> **This is an experimental feature. In order to use it, you must set the [experimentalRunEvents](/guides/references/experiments) configuration option to `true`.**

</Alert>

## Syntax

```js
on("before:run", (details) => {
  /* ... */
});
```

**<Icon name="angle-right"></Icon> details** **_(Object)_**

Details of the run, including the project config, details about the browser and system, and the specs that will be run.

## Usage

You can return a promise from the `before:run` event handler and it will be awaited before Cypress proceeds running your specs.

### Log the browser and the number of specs that will be run

```javascript
module.exports = (on, config) => {
  on("before:run", (details) => {
    // details will look something like this:
    // {
    //   config: {
    //     projectId: '12345',
    //     baseUrl: 'http://example.com/',
    //     viewportWidth: 1000,
    //     viewportHeight: 660,
    //     // ...more properties...
    //   },
    //   browser: {
    //     name: 'electron',
    //     version: '59.0.3071.115',
    //     // ...more properties...
    //   },
    //   system:
    //   {
    //     osName: 'darwin',
    //     osVersion: '16.7.0',
    //   }
    //   cypressVersion: '6.1.0',
    //   specs: [
    //     {
    //       name: 'login_spec.js',
    //       relative: 'cypress/integration/login_spec.js',
    //       absolute: '/Users/janelane/app/cypress/integration/login_spec.js',
    //     },
    //     // ... more specs
    //   ],
    //   specPattern: [
    //     '**/*_spec.js'
    //   ],
    //   parallel: false,
    //   group: 'group-1',
    //   tag: 'tag-1'
    // }

    console.log(
      "Running",
      details.specs.length,
      "specs in",
      details.browser.name
    );
  });
};
```

## See also

- [After Run API](/api/plugins/after-run-api)
- [Before Spec API](/api/plugins/before-spec-api)
- [After Spec API](/api/plugins/after-spec-api)
- [Plugins Guide](/guides/tooling/plugins-guide)
- [Writing a Plugin](/api/plugins/writing-a-plugin)
