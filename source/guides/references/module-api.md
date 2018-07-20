---
title: Module API
---

You can require Cypress as a Node module.

## `cypress.run()`

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
  "startedTestsAt": "2018-07-11T17:53:35.463Z",
  "endedTestsAt": "2018-07-11T17:53:35.675Z",
  "totalDuration": 212,
  "totalTests": 13,
  "totalFailed": 1,
  "totalPassed": 0,
  "totalPending": 0,
  "totalSkipped": 12,
  "browserName": "electron",
  "browserVersion": "59.0.3071.115",
  "osName": "darwin",
  "osVersion": "14.5.0",
  "cypressVersion": "3.0.2",
  "config": {}
}
```

Even when tests fail, the `Promise` still resolves with the test results. The `Promise` is only rejected if Cypress cannot run for some reason; for example if a binary has not been installed or it cannot find . In that case, the `Promise` will be rejected with a detailed error.

## `cypress.open()`

```javascript
const cypress = require('cypress')

cypress.open()
```

## Options

Just like the {% url "Command Line options" command-line %}, you can pass options that modify how Cypress runs.

Option | Description
------ |  ---------
`browser`  | Specify different browser to run tests in
`config`  | Specify configuration
`env`  | Specify environment variables
`headed`  | Display the Electron browser instead of running headlessly
`key`  | Specify your secret record key
`no-exit` | Keep Cypress open after all tests run
`port`  | Override default port
`project` | Path to a specific project
`record`  | Whether to record the test run
`reporter`  | Specify a mocha reporter
`reporter-options`  | Specify mocha reporter options
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