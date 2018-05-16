---
title: Command Line

---

{% note info %}
# {% fa fa-graduation-cap %} What You'll Learn

- How to run Cypress from the command line
- How to run headlessly
- How to launch other browsers
- How to record your tests
{% endnote %}

# Installation

This Guide assumes you've already read our {% url 'Installing Cypress' installing-cypress %} guide and installed Cypress as an `npm` module.

After installing you'll be able to execute all of the following commands.

{% note warning %}
For brevity we've omitted the full path to the cypress executable in each command.

You'll need to prefix each command with:

- `$(npm bin)/cypress`
- ...or...
- `./node_modules/.bin/cypress`

Or just add cypress commands to the `scripts` field in your `package.json` file.
{% endnote %}

# Commands

## `cypress run`

Runs Cypress to completion. By default will run all tests headlessly in the `Electron` browser.

### Run tests

```shell
cypress run [options]
```

**Options**

Option | Description
------ |  ---------
`-b`, `--browser`  | Specify different browser to run tests in
`-c`, `--config`  | Specify configuration
`-e`, `--env`  | Specify environment variables
`-h`, `--help`  | Output usage information
`-k`, `--key`  | Specify your secret record key
`-p`, `--port`  | Override default port
`-P`, `--project` | Path to a specific project
`-r`, `--reporter`  | Specify a mocha reporter
`-o`, `--reporter-options`  | Specify mocha reporter options
`-s`, `--spec`  | Specify the specs to run
`--record`  | Whether to record the test run
`--headed`  | Display the electron browser instead of running headlessly

### Run tests specifying browser

```shell
cypress run --browser chrome
```

{% note warning %}
Cypress will attempt to find all supported browsers available on your system. If Cypress cannot find the browser you should turn on debugging for additional output.
{% endnote %}

```shell
DEBUG=cypress:launcher cypress run --browser chrome
```

### Run tests in Electron in headed mode

By default, Cypress will run tests in Electron headlessly.

Passing `--headed` will force Electron to be shown. This matches how you run Electron in the GUI.

```shell
cypress run --headed
```

### Run tests specifying configuration

Read more about {% url 'environment variables' environment-variables %} and {% url 'configuration' configuration %}.

```shell
cypress run --config pageLoadTimeout=100000,watchForFileChanges=false
```

### Run tests specifying environment variables

```shell
cypress run --env host=api.dev.local
```

### Run tests specifying a port

```shell
cypress run --port 8080
```

### Run tests specifying a mocha reporter

```shell
cypress run --reporter json
```

### Run tests specifying mochas reporter options

```shell
cypress run --reporter-options mochaFile=result.xml,toConsole=true
```

### Run tests specifying a single test file to run instead of all tests

```shell
cypress run --spec cypress/integration/app.spec.js
```

### Run tests specifying a glob of where to look for test files

```shell
cypress run --spec cypress/integration/login/**/*
```

### Run tests specifying multiple test files to run

```shell
cypress run --spec cypress/integration/filter.spec.js, cypress/integration/users.spec.js
```

### Run tests specifying a project

By default, Cypress expects your `cypress.json` to be found where your `package.json` is. However, you can point Cypress to run in a different location.

This enables you to install Cypress in a top level `node_modules` folder but run Cypress in a nested folder. This is also helpful when you have multiple Cypress projects in your repo.

To see this in action we've set up an {% url 'example repo to demonstrate this here' https://github.com/cypress-io/cypress-test-nested-projects %}.

```shell
cypress run --project ./some/nested/folder
```

### Run and record video of tests

Record video of tests running after {% url 'setting up your project to record' dashboard-service#Setup %}. After setting up your project you will be given a **Record Key**.

```shell
cypress run --record --key <record_key>
```

If you set the **Record Key** as the environment variable `CYPRESS_RECORD_KEY`, you can omit the `--key` flag.

You'd typically set this environment variable when running in {% url 'Continuous Integration' continuous-integration %}.

```shell
export CYPRESS_RECORD_KEY=abc-key-123
```

Now you can omit the `--key` flag.

```shell
cypress run --record
```

You can {% url 'read more about recording runs here' dashboard-service#Setup %}.

## `cypress open`

Opens the Cypress Test Runner in interactive mode.

### Open Cypress

```shell
cypress open [options]
```

**Options**

Options passed to `cypress open` will automatically be applied to the project you open. These persist on all projects until you quit the Cypress Test Runner. These options will also override values in `cypress.json`

Option | Description
------ | ---------
`-c`, `--config`  | Specify configuration
`-d`, `--detached` | Open Cypress in detached mode
`-e`, `--env`  | Specify environment variables
`-h`, `--help`  | Output usage information
`-p`, `--port`  | Override default port
`-P`, `--project` | Path to a specific project
`--global` | Run in global mode

### Open Cypress projects specifying port

```shell
cypress open --port 8080
```

### Open Cypress projects specifying configuration

```shell
cypress open --config pageLoadTimeout=100000,watchForFileChanges=false
```

### Open Cypress projects specifying environment variables

```shell
cypress open --env host=api.dev.local
```

### Open Cypress in global mode

Opening Cypress in global mode is useful if you have multiple nested projects but want to share a single global installation of Cypress. In this case you can add each nested project to the Cypress in global mode, thus giving you a nice UI to switch between them.

```shell
cypress open --global
```

## `cypress verify`

Verify that Cypress is installed correctly and is executable.

```shell
cypress verify
```

### Example Output

```shell
Cypress application is valid and should be okay to run: /Applications/Cypress.app
```

## `cypress version`

Equivalent: `cypress --version`, `cypress -v`

Output both the versions of the installed Cypress binary application and NPM module.
In most cases they will be the same, but could be different if you have installed a different version of the NPM package and for some reason could not install the matching binary.

```shell
cypress version
```

### Example Output

```shell
Cypress package version: 0.20.0
Cypress binary version: 0.20.0
```

# Cypress Module API

You can use also require Cypress as a Node module.

{% note warning %}
The Cypress module is brand new and we are still adding more functionality to it. Its API may change in the future.
{% endnote %}

Here's an example of programmatically running a spec file:

```js
const cypress = require('cypress')

cypress.run({
  spec: './cypress/integration/a-spec.js'
})
.then((results) => {
  console.log(results)
})
.catch((err) => {
  console.error(err)
})
```

## `cypress.run()`

`cypress.run()` returns a `Promise` that resolves with an object containing the tests results. A typical run with 2 passing tests could return something like this:

```json
{
  "tests": 2,
  "passes": 2,
  "pending": 0,
  "failures": 0,
  "duration": "2 seconds",
  "screenshots": 0,
  "video": true,
  "version": "0.20.0"
}
```

Even when tests fail, the `Promise` still resolves with the test results.

```json
{
  "tests": 2,
  "passes": 1,
  "pending": 0,
  "failures": 1,
  "duration": "2 seconds",
  "screenshots": 1,
  "video": true,
  "version": "0.20.0"
}
```

The `Promise` is only rejected if Cypress cannot run for some reason; for example if a binary has not been installed. In that case, the `Promise` will be rejected with a detailed error.

### Options

Just like the CLI options above, you can pass options that modify how Cypress runs.

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

# Debugging Commands

Cypress is built using the {% url 'debug' https://github.com/visionmedia/debug %} module. That means you can receive helpful debugging output by running Cypress with this turned on.

**On Mac or Linux:**
```shell
DEBUG=cypress:* cypress open
```

```shell
DEBUG=cypress:* cypress run
```
**On Windows:**

```shell
set DEBUG=cypress:*
cypress open
```

```shell
set DEBUG=cypress:*
cypress run
```

Cypress is a rather large and complex project involving a dozen or more submodules, and the default output can be overwhelming.

**To filter debug output to a specific module**

```shell
DEBUG=cypress:cli cypress run
```

```shell
DEBUG=cypress:launcher cypress run
```

...or even a 3rd level deep submodule

```shell
DEBUG=cypress:server:project cypress run
DEBUG=cypress:server:scaffold cypress run
DEBUG=cypress:server:socket cypress run
DEBUG=cypress:server:bundle cypress run
```
