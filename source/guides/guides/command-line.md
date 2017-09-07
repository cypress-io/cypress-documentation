---
title: Command Line
comments: false
---

{% note info %}
# {% fa fa-graduation-cap %} What You'll Learn

- How to run Cypress headlessly from the command line
- How to record your tests running from the command line
- How to output the current installed version from the command line
{% endnote %}

# Installation

This {% url "installs the Cypress Desktop Application" installing-cypress %} to your `./node_modules` directory and makes the `cypress` commands accessible from `./node_modules/.bin`.

```shell
npm install cypress
```

This means we can call the available commands below from our project root either of the following ways:

**The long way with the full path -**

```shell
./node_modules/.bin/cypress open
```

**Same with shortcut using `npm bin` -**

```shell
$(npm bin)/cypress open
```

# Available Commands

## `cypress run`

Run Cypress headlessly without spawning a browser. You can use this command when working locally or when {% url 'running Cypress in CI' continuous-integration %}.

***Run tests***

```shell
cypress run [project] [options]
```

**Project**

***Run tests specifying path to the project***

```shell
cypress run /users/john/projects/TodoMVC
```

**Options**

Option | Description
------ |  ---------
`-b`, `--browser`  | Specify name of browser to run tests in
`-c`, `--config`  | Specify configuration
`-e`, `--env`  | Specify environment variables
`-h`, `--help`  | Output usage information
`-k`, `--key`  | Specify your secret record key
`-p`, `--port`  | Override default port
`--record`  | Whether to record the test run
`-r`, `--reporter`  | Specify a mocha reporter
`-o`, `--reporter-options`  | Specify mocha reporter options
`-s`, `--spec`  | A single test file to run instead of all tests

***Run tests specifying browser***

```shell
cypress run --browser chrome
```

**note:** Cypress will attempt to accurately find all browsers available on your system. If a 
browser with matching name is not found, Cypress will attempt launching it as a command. 
If the browser is still not found, you can run Cypress with debug messages related to 
launching the browser turned on.

```shell
DEBUG=cypress:launcher cypress run --browser <name or path>
```

***Run tests specifying configuration***

Read more about {% url 'environment variables' environment-variables %} and {% url 'configuration' configuration %}.

```shell
cypress run --config pageLoadTimeout=100000,watchForFileChanges=false
```

***Run tests specifying environment variables***

```shell
cypress run --env host=api.dev.local
```

***Run tests specifying a port***

```shell
cypress run --port 8080
```

***Run tests specifying a mocha reporter***

```shell
cypress run --reporter json
```

***Run tests specifying mochas reporter options***

```shell
cypress run --reporter-options mochaFile=result.xml,toConsole=true
```

***Run tests specifying a single test file to run instead of all tests***

```shell
cypress run --spec cypress/integration/app_spec.js
```

***Run and record video of tests***

Record video of tests running after {% url 'setting up your project to record' projects-dashboard#Set-up-a-Project-to-Record %}. After setting up your project you will be given a **Record Key**.

```shell
cypress run --record --key <record_key>
```

If you set the **Record Key** as the environment variable `CYPRESS_RECORD_KEY`, you can omit the `--key` flag.

**Set environment variable (typically in {% url 'Continuous Integration' continuous-integration %}).**

```shell
export CYPRESS_RECORD_KEY=abc-key-123
```

**Omit `--key` flag when env var set.**

```shell
cypress run --record
```

You can {% url 'read more about recording runs here' projects-dashboard#Set-up-a-Project-to-Record %}.

## `cypress open`

Open the Cypress GUI application. This is the same thing as double-clicking the application.

***Open Cypress***

```shell
cypress open [options]
```

**Options**

Options passed to `cypress open` will automatically be applied to the project you open. These persist on all projects until you quit the Cypress Desktop Application. These options will also override values in `cypress.json`

Option | Description
------ | ---------
`-c`, `--config`  | Specify configuration
`-d`, `--detached` | Open Cypress in detached mode
`-e`, `--env`  | Specify environment variables
`-h`, `--help`  | Output usage information
`-p`, `--port`  | Override default port


***Open Cypress projects specifying port***

```shell
cypress open --port 8080
```

***Open Cypress projects specifying configuration***

```shell
cypress open --config pageLoadTimeout=100000,watchForFileChanges=false
```

***Open Cypress projects specifying environment variables***

```shell
cypress open --env host=api.dev.local
```

## `cypress verify`

Verify that Cypress is installed correctly and executable.

```shell
cypress verify
```

***Example Output***

```shell
Cypress application is valid and should be okay to run: /Applications/Cypress.app
```

## `cypress version`

Equivalent: `cypress --version`, `cypress -v`

Output both the versions of the the installed Cypress binary application and NPM module.
In most cases they will be the same, but could be different if you have installed a different
version of NPM package and for some reason could not install the matching binary.

```shell
cypress version
```

***Example Output***

```shell
Cypress package version: 0.20.0
Cypress binary version: 0.20.0
```

# Cypress Module API

{% note warning %}
The Cypress module API has not been finalized yet and might change in the future.
{% endnote %}

You can use Cypress as a Node module in addition to its CLI binary. The simplest example with a single spec file can be tested like this:

```js
const cypress = require('cypress')
cypress.run({
  spec: './cypress/integration/a-spec.js'
}).then(console.log, console.error)
```

## `run()` method

A Promise-returning method that resolves with an object with test results. A typical run with 2 passing tests could return something like this

```js
const cypress = require('cypress')
cypress.run({
  spec: './cypress/integration/passing-spec.js'
}).then(console.log)
```
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

If a test is failing, the promise still resolves, but with different counters

```js
const cypress = require('cypress')
cypress.run({
  spec: './cypress/integration/failing-spec.js'
}).then(console.log)
```
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

The promise is only rejected if Cypress cannot run for some reason; for example if a binary has not been installed. In that case, the promise will be rejected with detailed error.

### Options

You have already seen the first useful option `run` takes: `{spec: "<spec path>"}`. Without it Cypress will try to run all files in the default `cypress/integration` folder. This and other options all are the same as Cypress {% url "run options" #cypress-run %}, except they have to the full words and not single letter aliases.

**{% fa fa-check-circle green %} Correct Usage**

```javascript
const cypress = require('cypress')
cypress.run({
  spec: './cypress/integration/spec.js',
  port: 8220,
  browser: 'chrome'
})
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
const cypress = require('cypress')
cypress.run({
  s: './cypress/integration/spec.js',
  p: 8220,
  b: 'chrome'
})
```
