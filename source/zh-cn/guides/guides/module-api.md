---
title: Module API
---

You can require Cypress as a Node module.

## `cypress.run()`

### Options

Just like the {% url "Command Line options" command-line %} for `cypress run`, you can pass options that modify how Cypress runs.

Option | Description
------ |  ---------
`browser`  | Specify different browser to run tests in
`ciBuildId` | Specify a unique identifier for a run to enable {% url "grouping" parallelization#Grouping-test-runs %} or {% url "parallelization" parallelization %}
`config`  | Specify configuration
`env`  | Specify environment variables
`group` | {% url "Group" parallelization#Grouping-test-runs %} recorded tests together under a single run
`headed`  | Display the Electron browser instead of running headlessly
`key`  | Specify your secret record key
`noExit` | Keep Cypress open after all tests run
`parallel` | Run recorded specs in {% url "parallel" parallelization %} across multiple machines
`port`  | Override default port
`project` | Path to a specific project
`record`  | Whether to record the test run
`reporter`  | Specify a mocha reporter
`reporterOptions`  | Specify mocha reporter options
`spec`  | Specify the specs to run

```javascript
const cypress = require('cypress')

cypress.run({
  reporter: 'junit',
  browser: 'chrome',
  config: {
    baseUrl: 'http://localhost:8080',
    chromeWebSecurity: false,
  },
  env: {
    foo: 'bar',
    baz: 'quux',
  }
})
```

### Example

Here is an example of programmatically running a spec file:

```js
const cypress = require('cypress')

cypress.run({
  spec: './cypress/integration/examples/actions.spec.js'
})
.then((results) => {
  console.log(results)
})
.catch((err) => {
  console.error(err)
})
```

`cypress.run()` returns a `Promise` that resolves with an object containing the tests results. A typical run could return something like this:

```json
{
  "cypressVersion": "3.0.2",
  "endedTestsAt": "2018-07-11T17:53:35.675Z",
  "browserName": "electron",
  "browserPath": "path/to/browser",
  "browserVersion": "59.0.3071.115",
  "config": {...},
  "osName": "darwin",
  "osVersion": "14.5.0",
  "runs": [{
    "error": null,
    "hooks": [...],
    "reporter": "spec",
    "reporterStats": {...},
    "screenshots": [],
    "shouldUploadVideo": true,
    "spec": {...},
    "stats": {...},
    "tests": [...],
    "video": "User/janelane/my-app/cypress/videos/abc123.mp4"
  }],
  "runUrl": "https://dashboard.cypress.io/projects/def456/runs/12",
  "startedTestsAt": "2018-07-11T17:53:35.463Z",
  "totalDuration": 212,
  "totalFailed": 1,
  "totalPassed": 0,
  "totalPending": 0,
  "totalSkipped": 12,
  "totalSuites": 8,
  "totalTests": 13,
}
```

Even when tests fail, the `Promise` still resolves with the test results. The `Promise` is only rejected if Cypress cannot run for some reason; for example if a binary has not been installed or it cannot find  a module dependency. In that case, the `Promise` will be rejected with a detailed error.

## `cypress.open()`

### Options

Just like the {% url "Command Line options" command-line %}, you can pass options that modify how Cypress runs.

Option | Description
------ | ---------
`config`  | Specify configuration
`detached` | Open Cypress in detached mode
`env`  | Specify environment variables
`global` | Run in global mode
`port`  | Override default port
`project` | Path to a specific project

### Example

```javascript
const cypress = require('cypress')

cypress.open()
```
