---
title: After Spec API
---

The `after:spec` event fires after a spec file is run. When running cypress via
`cypress open`, the event will fire when the browser closes.

## Syntax

::include{file=partials/warning-setup-node-events.md}

<Alert type="warning">

⚠️ When running via `cypress open`, the `after:spec` event only fires if the
[experimentalInteractiveRunEvents flag](/guides/references/configuration#Experiments)
is enabled.

</Alert>

:::cypress-plugin-example

```js
on('after:spec', (spec, results) => {
  /* ... */
})
```

:::

**<Icon name="angle-right"></Icon> spec** **_(Object)_**

Details of the spec file, including the following properties:

| Property   | Description                                                                                |
| ---------- | ------------------------------------------------------------------------------------------ |
| `name`     | The base name of the spec file (e.g. `login.cy.js`)                                        |
| `relative` | The path to the spec file, relative to the project root (e.g. `cypress/e2e/login.cy.js`)   |
| `absolute` | The absolute path to the spec file (e.g. `/Users/janelane/my-app/cypress/e2e/login.cy.js`) |

**<Icon name="angle-right"></Icon> results** **_(Object)_**

Details of the spec file's results, including numbers of passes/failures/etc and
details on the tests themselves.

Results are only provided when running via `cypress run`. When running via
`cypress open`, the results will be undefined.

## Usage

You can return a promise from the `after:spec` event handler and it will be
awaited before Cypress proceeds with processing the spec's video or moving on to
further specs if there are any.

### Log the relative spec path to stdout after the spec is run

```javascript
module.exports = (on, config) => {
  on('after:spec', (spec, results) => {
    // spec will look something like this:
    // {
    //   name: 'login.cy.js',
    //   relative: 'cypress/e2e/login.cy.js',
    //   absolute: '/Users/janelane/my-app/cypress/e2e/login.cy.js',
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
    //   video: '/Users/janelane/my-app/cypress/videos/login.cy.js.mp4',
    //   screenshots: [],
    //   // ...more properties...
    // }
    console.log('Finished running', spec.relative)
  })
}
```

## Examples

### Delete the recorded video if the spec passed

You can delete the recorded video for a spec when certain conditions are met.
This will skip the compression and uploading of the video when recording to Cypress Cloud.

The example below shows how to delete the recorded video for specs with no
failing tests.

:::cypress-plugin-example

```javascript
// need to install the "del" module as a dependency
// npm i del --save-dev
const del = require('del')
```

```js
on('after:spec', (spec, results) => {
  if (results && results.stats.failures === 0 && results.video) {
    // `del()` returns a promise, so it's important to return it to ensure
    // deleting the video is finished before moving on
    return del(results.video)
  }
})
```

:::

### Delete the recorded video if no tests retried

You can delete the recorded video for a spec when certain conditions are met.
This will skip the compression and uploading of the video when recording to Cypress Cloud.

The example below shows how to delete the recorded video for specs that had no
retry attempts when using Cypress [test retries](/guides/guides/test-retries).

:::cypress-plugin-example

```js
// need to install these dependencies
// npm i lodash del --save-dev
const _ = require('lodash')
const del = require('del')
```

```js
on('after:spec', (spec, results) => {
  if (results && results.video) {
    // Do we have failures for any retry attempts?
    const failures = _.some(results.tests, (test) => {
      return _.some(test.attempts, { state: 'failed' })
    })
    if (!failures) {
      // delete the video if the spec passed and no tests retried
      return del(results.video)
    }
  }
})
```

:::

## See also

- [Before Spec API](/api/plugins/before-spec-api)
- [Before Run API](/api/plugins/before-run-api)
- [After Run API](/api/plugins/after-run-api)
- [Plugins Guide](/guides/tooling/plugins-guide)
- [Writing a Plugin](/api/plugins/writing-a-plugin)
