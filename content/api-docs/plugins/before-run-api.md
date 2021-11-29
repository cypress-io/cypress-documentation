---
title: Before Run API
---

The `before:run` event fires before a run starts. When running cypress via
`cypress open`, the event will fire when opening a project.

The event will fire each time `cypress run` executes. As a result, if running
your specs in [parallel](/guides/guides/parallelization), the event will fire
once for each machine on which the tests are run.

## Syntax

<Alert type="warning">

⚠️ This code is part of the
[plugins file](/guides/core-concepts/writing-and-organizing-tests#Plugin-files)
and thus executes in the Node environment. You cannot call `Cypress` or `cy`
commands in this file, but you do have the direct access to the file system and
the rest of the operating system.

</Alert>

<Alert type="warning">

⚠️ When running via `cypress open`, the `before:run` event only fires if the
[experimentalInteractiveRunEvents flag](/guides/references/configuration#Experiments)
is enabled.

</Alert>

```js
on('before:run', (details) => {
  /* ... */
})
```

**<Icon name="angle-right"></Icon> details** **_(Object)_**

Details of the run, including the project config, system information, and the
version of Cypress. More details are included when running via `cypress run`.

## Usage

You can return a promise from the `before:run` event handler and it will be
awaited before Cypress proceeds running your specs.

### Log the browser and the number of specs that will be run

```javascript
module.exports = (on, config) => {
  on('before:run', (details) => {
    // details will look something like this when run via `cypress run`:
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
    //   system: {
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

    // details will look something like this when run via `cypress open`:
    // {
    //   config: {
    //     projectId: '12345',
    //     baseUrl: 'http://example.com/',
    //     viewportWidth: 1000,
    //     viewportHeight: 660,
    //     // ...more properties...
    //   },
    //   system: {
    //     osName: 'darwin',
    //     osVersion: '16.7.0',
    //   }
    //   cypressVersion: '7.0.0'
    // }

    if (details.specs && details.browser) {
      // details.specs and details.browser will be undefined in interactive mode
      console.log('Running', details.specs.length, 'specs in', details.browser.name)
    }
  })
}
```

## See also

- [After Run API](/api/plugins/after-run-api)
- [Before Spec API](/api/plugins/before-spec-api)
- [After Spec API](/api/plugins/after-spec-api)
- [Plugins Guide](/guides/tooling/plugins-guide)
- [Writing a Plugin](/api/plugins/writing-a-plugin)
