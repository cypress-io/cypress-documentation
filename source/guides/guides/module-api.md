---
title: Module API
---

You can require Cypress as a node module from your application under test. This can be useful when you want to access to the test results directly after the run. With this workflow, for example, you can:

- Send a notification about failing tests with included screenshot images
- Rerun a single failing spec file
- Kick off other builds or scripts

## `cypress.run()`

Runs Cypress tests and resolve with all test results. See the {% url 'Cypress Module API recipe' https://github.com/cypress-io/cypress-example-recipes#fundamentals %}.

### Options:

Just like the {% url "Command Line options" command-line %} for `cypress run`, you can pass options that modify how Cypress runs.

Option | Type | Description
------ | ---- | ---------
`browser` | *string* | Specify different browser to run tests in, either by name or by filesystem path
`ciBuildId` | *string* | Specify a unique identifier for a run to enable {% url "grouping" parallelization#Grouping-test-runs %} or {% url "parallelization" parallelization %}
`config` | *object* | Specify {% url "configuration" configuration %}
`configFile` | *string / boolean* | Path to the config file to be used. If `false` is passed, no config file will be used.
`env` | *object* | Specify {% url "environment variables" environment-variables %}
`group` | *string* | {% url "Group" parallelization#Grouping-test-runs %} recorded tests together under a single run
`headed` | *boolean* | Displays the browser instead of running headlessly (default Firefox and Chromium-based browsers)
`headless` | *boolean* | Hide the browser instead of running headed (defaults for Electron)
`key` | *string* | Specify your secret record key
`exit` | *boolean* | Whether to close Cypress after all tests run
`parallel` | *boolean* | Run recorded specs in {% url "parallel" parallelization %} across multiple machines
`port` | *number* | Override default port
`project` | *string* | Path to a specific project
`quiet`| *boolean* | If passed, Cypress output will not be printed to `stdout`. Only output from the configured {% url "Mocha reporter" reporters %} will print.
`record` | *boolean* | Whether to record the test run
`reporter` | *string* | Specify a {% url "Mocha reporter" reporters %}
`reporterOptions` | *object* | Specify {% url "Mocha reporter" reporters %} options
`spec` | *string* | Specify the specs to run
`tag` | *string* | Identify a run with a tag or tags

```javascript
const cypress = require('cypress')

cypress.run({
  reporter: 'junit',
  browser: 'chrome',
  config: {
    baseUrl: 'http://localhost:8080',
    video: true,
  },
  env: {
    foo: 'bar',
    baz: 'quux',
  }
})
```

### Example:

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
    "hooks": [{
      "hookName": "before each",
      "title": [ "before each hook" ],
      "body": "function () {\n  expect(true).to.be["true"];\n}"
    }],
    "reporter": "spec",
    "reporterStats": {...},
    "shouldUploadVideo": true,
    "spec": {...},
    "stats": {
      "suites": 1,
      "tests": 1,
      "passes": 0,
      "pending": 0,
      "skipped": 0,
      "failures": 1,
      "startedAt": "2020-08-05T08:38:37.589Z",
      "endedAt": "2018-07-11T17:53:35.675Z",
      "duration": 1171
    },
    "tests": [{
      "title": [ "test" ],
      "state": "failed",
      "body": "function () {\n  expect(true).to.be["false"];\n}",
      "displayError": "AssertionError: expected true to be false\n' +
      '    at Context.eval (...cypress/integration/spec.js:5:21",
      "attempts": [{
        "state": "failed",
        "error": {
          "message": "expected true to be false",
          "name": "AssertionError",
          "stack": "AssertionError: expected true to be false\n' +
      '    at Context.eval (...cypress/integration/spec.js:5:21"
        },
        "screenshots": [{
          "name": null,
          "takenAt": "2020-08-05T08:52:20.432Z",
          "path": "User/janelane/my-app/cypress/screenshots/spec.js/test (failed).png",
          "height": 720,
          "width": 1280
        }],
        "startedAt": "2020-08-05T08:38:37.589Z",
        "duration": 1171,
        "videoTimestamp": 4486
      }]
    }],
    "video": "User/janelane/my-app/cypress/videos/abc123.mp4"
  }],
  "runUrl": "https://dashboard.cypress.io/projects/def456/runs/12",
  "startedTestsAt": "2018-07-11T17:53:35.463Z",
  "totalDuration": 212,
  "totalFailed": 1,
  "totalPassed": 0,
  "totalPending": 0,
  "totalSkipped": 0,
  "totalSuites": 1,
  "totalTests": 1,
}
```

Find the TypeScript definition for the results object in the {% url "`cypress/cli/types` folder" https://github.com/cypress-io/cypress/tree/develop/cli/types %}.

Even when tests fail, the `Promise` still resolves with the test results. The `Promise` is only rejected if Cypress cannot run for some reason; for example if a binary has not been installed or it cannot find  a module dependency. In that case, the `Promise` will be rejected with a detailed error.

## `cypress.open()`

### Options

Just like the {% url "Command Line options" command-line %}, you can pass options that modify how Cypress runs.

Option |  Type | Description
------ | ---- | ---------
`browser` | *string* | Specify a filesystem path to a custom browser
`config` | *object* | Specify {% url "configuration" configuration %}
`configFile` | *string / boolean* | Path to the config file to be used. If `false` is passed, no config file will be used.
`detached` | *boolean* | Open Cypress in detached mode
`env` | *object* | Specify {% url "environment variables" environment-variables %}
`global` | *boolean* | Run in global mode
`port` | *number* | Override default port
`project` | *string* | Path to a specific project

### Example

```javascript
const cypress = require('cypress')

cypress.open()
```

{% history %}
{% url "5.0.0" changelog %} | Test results returned from `cypress.run()` changed.
{% url "4.9.0" changelog#4-9-0 %} | Added `quiet` option to `cypress.run()`
{% endhistory %}
