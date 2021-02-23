---
title: After Spec API
containerClass: experimental
---

The `after:spec` event fires after a spec file is run. The event only fires when running via `cypress run`.

<Alert type="warning">


<Icon name="exclamation-triangle" color="orange"></Icon> **This is an experimental feature. In order to use it, you must set the [experimentalRunEvents](/guides/references/experiments) configuration option to `true`.**

</Alert>

## Syntax

```js
on('after:spec', (spec, results) => { /* ... */ })
```

**<Icon name="angle-right"></Icon> spec** ***(Object)***

Details of the spec file, including the following properties:

Property | Description
--- | ---
`name` | The base name of the spec file (e.g. `login_spec.js`)
`relative` | The path to the spec file, relative to the project root (e.g. `cypress/integration/login_spec.js`)
`absolute` | The absolute path to the spec file (e.g. `/Users/janelane/my-app/cypress/integration/login_spec.js`)

**<Icon name="angle-right"></Icon> results** ***(Object)***

Details of the spec file's results, including numbers of passes/failures/etc and details on the tests themselves.

## Usage

You can return a promise from the `after:spec` event handler and it will be awaited before Cypress proceeds with processing the spec's video or moving on to further specs if there are any.

### Log the relative spec path to stdout after the spec is run

```javascript
module.exports = (on, config) => {
  on('after:spec', (spec, results) => {
    // spec will look something like this:
    // {
    //   name: 'login_spec.js',
    //   relative: 'cypress/integration/login_spec.js',
    //   absolute: '/Users/janelane/my-app/cypress/integration/login_spec.js',
    // }

    // results will look something like this:
    // {
    //   stats: {
    //     suites: 0,
    //     tests: 1,
    //     passes: 1,
    //     pending: 0,
    //     skipped: 0,
    //     failures: 0,
    //     // ...more properties
    //   }
    //   reporter: 'spec',
    //   tests: [
    //     {
    //       title: ['login', 'logs user in'],
    //       state: 'passed',
    //       body: 'function () {}',
    //       // ...more properties...
    //     }
    //   ],
    //   error: null,
    //   video: '/Users/janelane/my-app/cypress/videos/login_spec.js.mp4',
    //   screenshots: [],
    //   // ...more properties...
    // }
    console.log('Finished running', spec.relative)
  })
}
```

## Examples

### Delete the recorded video if the spec passed

You can delete the recorded video for a spec. This will skip the compression and uploading of the video when recording to the Dashboard.

The example below shows how to delete the recorded video for a spec with no failing tests.

```javascript
const del = require('del')

module.exports = (on, config) => {
  on('after:spec', (spec, results) => {
    if (results.stats.failures === 0 && results.video) {
      // `del()` returns a promise, so it's important to return it to ensure
      // deleting the video is finished before moving on
      return del(results.video)
    }
  })
}
```

## See also

- [Before Spec API](/api/plugins/before-spec-api)
- [Before Run API](/api/plugins/before-run-api)
- [After Run API](/api/plugins/after-run-api)
- [Plugins Guide](/guides/tooling/plugins-guide)
- [Writing a Plugin](/api/plugins/writing-a-plugin)

