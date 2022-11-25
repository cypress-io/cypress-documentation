---
title: Module API
---

You can require Cypress as a node module from your application under test and
run Cypress via Node.js. This can be useful when you want access to the test
results directly after the run. With this workflow, for example, you can:

- Send a notification about failing tests with included screenshot images
- Rerun a single failing spec file
- Kick off other builds or scripts

## `cypress.run()`

Runs Cypress tests via Node.js and resolve with all test results. See the
[Cypress Module API recipe](https://github.com/cypress-io/cypress-example-recipes#fundamentals).

```javascript
// e2e-run-tests.js
const cypress = require('cypress')

cypress.run({
  reporter: 'junit',
  browser: 'chrome',
  config: {
    baseUrl: 'http://localhost:8080',
    video: true,
  },
  env: {
    login_url: '/login',
    products_url: '/products',
  },
})
```

You can then run Cypress by running the following in your terminal or an npm
script:

```shell
node e2e-run-tests.js
```

### Options

Just like the [Command Line options](/guides/guides/command-line) for
`cypress run`, you can pass options that modify how Cypress runs.

| Option              | Type      | Description                                                                                                                                                        |
| ------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `browser`           | _string_  | Specify different browser to run tests in, either by name or by filesystem path                                                                                    |
| `ciBuildId`         | _string_  | Specify a unique identifier for a run to enable [grouping](/guides/guides/parallelization#Grouping-test-runs) or [parallelization](/guides/guides/parallelization) |
| `config`            | _object_  | Specify [configuration](/guides/references/configuration)                                                                                                          |
| `configFile`        | _string_  | Path to the [configuration file](/guides/references/configuration#Configuration-file) to be used.                                                                  |
| `env`               | _object_  | Specify [environment variables](/guides/guides/environment-variables)                                                                                              |
| `group`             | _string_  | [Group](/guides/guides/parallelization#Grouping-test-runs) recorded tests together under a single run                                                              |
| `headed`            | _boolean_ | Displays the browser instead of running headlessly                                                                                                                 |
| `headless`          | _boolean_ | Hide the browser instead of running headed (default during `cypress run`)                                                                                          |
| `key`               | _string_  | Specify your secret record key                                                                                                                                     |
| `exit`              | _boolean_ | Whether to close Cypress after all tests run                                                                                                                       |
| `parallel`          | _boolean_ | Run recorded specs in [parallel](/guides/guides/parallelization) across multiple machines                                                                          |
| `port`              | _number_  | Override default port                                                                                                                                              |
| `project`           | _string_  | Path to a specific project                                                                                                                                         |
| `quiet`             | _boolean_ | If passed, Cypress output will not be printed to `stdout`. Only output from the configured [Mocha reporter](/guides/tooling/reporters) will print.                 |
| `record`            | _boolean_ | Whether to record the test run                                                                                                                                     |
| `reporter`          | _string_  | Specify a [Mocha reporter](/guides/tooling/reporters)                                                                                                              |
| `reporterOptions`   | _object_  | Specify [Mocha reporter](/guides/tooling/reporters) options                                                                                                        |
| `slowTestThreshold` | _number_  | Time, in milliseconds, to consider a test "slow" during `cypress run`. A slow test will display in orange text in the default reporter.                            |
| `spec`              | _string_  | Specify the specs to run, see examples below                                                                                                                       |
| `tag`               | _string_  | Identify a run with a tag or tags                                                                                                                                  |
| `testingType`       | _string_  | Specify the type of tests to execute; either `e2e` or `component`. Defaults to `e2e`                                                                               |

### Examples

#### Run a single spec file

Here is an example of programmatically running a spec file. Note that the file
path is relative to the current working directory.

```js
// e2e-run-tests.js
const cypress = require('cypress')

cypress
  .run({
    // the path is relative to the current working directory
    spec: './cypress/e2e/examples/actions.cy.js',
  })
  .then((results) => {
    console.log(results)
  })
  .catch((err) => {
    console.error(err)
  })
```

You can then run Cypress by running the following in your terminal or an npm
script:

```shell
node e2e-run-tests.js
```

#### Run specs using wildcard

You can pass a wildcard pattern to run all matching spec files

```js
const cypress = require('cypress')

cypress.run({
  // the wildcard path is relative to the current working directory
  spec: './cypress/e2e/**/api*.js',
})
```

#### Use modern syntax

If your Node version allows you can use the modern `async / await` syntax to
wait for the Promise returned by the `cypress.run` method.

```js
const cypress = require('cypress')

;(async () => {
  const results = await cypress.run()
  // use the results object
})()
```

### Results

`cypress.run()` returns a `Promise` that resolves with an object containing the
tests results. A typical run could return something like this:

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
      '    at Context.eval (...cypress/e2e/cy.js:5:21",
      "attempts": [{
        "state": "failed",
        "error": {
          "message": "expected true to be false",
          "name": "AssertionError",
          "stack": "AssertionError: expected true to be false\n' +
      '    at Context.eval (...cypress/e2e/cy.js:5:21"
        },
        "screenshots": [{
          "name": null,
          "takenAt": "2020-08-05T08:52:20.432Z",
          "path": "User/janelane/my-app/cypress/screenshots/cy.js/test (failed).png",
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
  "runUrl": "https://cloud.cypress.io/projects/def456/runs/12",
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

You can find the TypeScript definition for the results object in the
[`cypress/cli/types` folder](https://github.com/cypress-io/cypress/tree/develop/cli/types).

### Handling errors

Even when tests fail, the `Promise` resolves with the test results. The
`Promise` is only rejected if Cypress cannot run for some reason (for example if
a binary has not been installed or it cannot find a module dependency). In that
case, the `Promise` will be rejected with a detailed error.

There is a third option - Cypress could run, but the tests could not start for
some reason. In that case the resolved value is an object with two fields

```js
{
  "failures": 1,    // non-zero number
  "message": "..."  // error message
}
```

In order to handle these possible errors, you can add a `catch` to
`cypress.run()`:

```js
// e2e-run-tests.js
const cypress = require('cypress')

cypress.run({...})
.then(result => {
  if (result.failures) {
    console.error('Could not execute tests')
    console.error(result.message)
    process.exit(result.failures)
  }

  // print test results and exit
  // with the number of failed tests as exit code
  process.exit(result.totalFailed)
})
.catch(err => {
  console.error(err.message)
  process.exit(1)
})
```

## `cypress.open()`

Open Cypress tests via Node.js.

```javascript
// e2e-open-tests.js
const cypress = require('cypress')

cypress.open({
  config: {
    baseUrl: 'http://localhost:8080',
  },
  env: {
    login_url: '/login',
    products_url: '/products',
  },
})
```

You can then open Cypress by running the following in your terminal or an npm
script:

```shell
node e2e-open-tests.js
```

### Options

Just like the [Command Line options](/guides/guides/command-line), you can pass
options that modify how Cypress runs.

| Option        | Type      | Description                                                                                       |
| ------------- | --------- | ------------------------------------------------------------------------------------------------- |
| `browser`     | _string_  | Specify a filesystem path to a custom browser                                                     |
| `config`      | _object_  | Specify [configuration](/guides/references/configuration)                                         |
| `configFile`  | _string_  | Path to the [configuration file](/guides/references/configuration#Configuration-file) to be used. |
| `detached`    | _boolean_ | Open Cypress in detached mode                                                                     |
| `env`         | _object_  | Specify [environment variables](/guides/guides/environment-variables)                             |
| `global`      | _boolean_ | Run in global mode                                                                                |
| `port`        | _number_  | Override default port                                                                             |
| `project`     | _string_  | Path to a specific project                                                                        |
| `testingType` | _string_  | Specify the type of tests to execute; either `e2e` or `component`. Defaults to `e2e`              |

### Example

```javascript
// e2e-open-tests.js
const cypress = require('cypress')

cypress.open({})
```

You can then open Cypress by running the following in your terminal or an npm
script:

```shell
node e2e-open-tests.js
```

## `cypress.cli`

### `parseRunArguments()`

If you are writing a tool that wraps around the `cypress.run()` command, you
might want to parse user-supplied command line arguments using the same logic as
`cypress run` uses. In that case, you can use the included `parseRunArguments`
function.

```javascript
// wrapper.js
const cypress = require('cypress')

const runOptions = await cypress.cli.parseRunArguments(process.argv.slice(2))
const results = await cypress.run(runOptions)
// process the "cypress.run()" results
```

An example use running from your terminal could be:

```shell
node ./wrapper cypress run --browser chrome --config ...
```

**Note:** the arguments passed to `parseRunArguments` should start with
`cypress run`.

We use CLI parsing and calling `cypress.run` to
[repeat tests to find flaky tests](https://github.com/bahmutov/cypress-repeat)
and to
[validate test numbers after a test run](https://github.com/bahmutov/cypress-expect).
Read
[Wrap Cypress Using npm Module API](https://glebbahmutov.com/blog/wrap-cypress-using-npm/)
for more examples.

## History

| Version                                       | Changes                                                 |
| --------------------------------------------- | ------------------------------------------------------- |
| [10.0.0](/guides/references/changelog#10-0-0) | `slowTestThreshold` is now scoped to each testing type. |
| [8.7.0](/guides/references/changelog#8-7-0)   | Added `slowTestThreshold` configuration option.         |
| [7.3.0](/guides/references/changelog#7-3-0)   | Added `testingType` configuration option.               |
| [5.0.0](/guides/references/changelog#5-0-0)   | Test results returned from `cypress.run()` changed.     |
| [4.11.0](/guides/references/changelog#4-11-0) | Added `cypress.cli` with `parseRunArguments` function.  |
| [4.9.0](/guides/references/changelog#4-9-0)   | Added `quiet` option to `cypress.run()`                 |
