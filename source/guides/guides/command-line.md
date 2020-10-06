---
title: Command Line
---

{% note info %}
# {% fa fa-graduation-cap %} What you'll learn

- How to run Cypress from the command line
- How to specify which spec files to run
- How to launch other browsers
- How to record your tests to the Dashboard
{% endnote %}

# Installation

This guide assumes you've already read our {% url 'Installing Cypress' installing-cypress %} guide and installed Cypress as an `npm` module. After installing you'll be able to execute all of the commands in this document from your **project root**.

# How to run commands

{% note info %}
You can alternatively require and run Cypress as a node module using our {% url "Module API" module-api %}.
{% endnote %}

For brevity we've omitted the full path to the cypress executable in each command's documentation.

To run a command, you'll need to prefix each command in order to properly locate the cypress executable.

```shell
$(npm bin)/cypress run
```

...or...

```shell
./node_modules/.bin/cypress run
```

...or... (requires npm@5.2.0 or greater)

```shell
npx cypress run
```

You may find it easier to add the cypress command to the `scripts` object in your `package.json` file and call it from an {% url "`npm run` script" https://docs.npmjs.com/cli/run-script.html %}.

When calling a command using `npm run`, you need to pass the command's arguments using the `--` string. For example, if you have  the following command defined in your `package.json`

```json
{
  "scripts": {
    "cy:run": "cypress run"
  }
}
```

...and want to run tests from a single spec file and record the results on the Dashboard, the command should be:

```shell
npm run cy:run -- --record --spec "cypress/integration/my-spec.js"
```

If you are using the {% url npx https://github.com/zkat/npx %} tool, you can invoke the locally installed Cypress tool directly:

```shell
npx cypress run --record --spec "cypress/integration/my-spec.js"
```

# Commands

## `cypress run`

Runs Cypress tests to completion. By default, `cypress run` will run all tests headlessly in the Electron browser.

```shell
cypress run [options]
```

### Options

Option | Description
------ |  ---------
`--browser`, `-b`  | {% urlHash "Run Cypress in the browser with the given name. If a filesystem path is supplied, Cypress will attempt to use the browser at that path." cypress-run-browser-lt-browser-name-or-path-gt %}
`--ci-build-id` | {% urlHash "Specify a unique identifier for a run to enable grouping or parallelization." cypress-run-ci-build-id-lt-id-gt %}
`--config`, `-c`  | {% urlHash "Specify configuration" cypress-run-config-lt-config-gt %}
`--config-file`, `-C`  | {% urlHash "Specify configuration file" cypress-run-config-file-lt-config-file-gt %}
`--env`, `-e`  | {% urlHash "Specify environment variables" cypress-run-env-lt-env-gt %}
`--group`  | {% urlHash "Group recorded tests together under a single run" cypress-run-group-lt-name-gt %}
`--headed`  | {% urlHash "Displays the browser instead of running headlessly (default for Firefox and Chromium-based browsers)" cypress-run-headed %}
`--headless` | {% urlHash "Hide the browser instead of running headed (default for Electron)" cypress-run-headless %}
`--help`, `-h`  | Output usage information
`--key`, `-k`  | {% urlHash "Specify your secret record key" cypress-run-record-key-lt-record-key-gt %}
`--no-exit` | {% urlHash "Keep Cypress Test Runner open after tests in a spec file run" cypress-run-no-exit %}
`--parallel` | {% urlHash "Run recorded specs in parallel across multiple machines" cypress-run-parallel %}
`--port`,`-p`  | {% urlHash "Override default port" cypress-run-port-lt-port-gt %}
`--project`, `-P` | {% urlHash "Path to a specific project" cypress-run-project-lt-project-path-gt %}
`--quiet`, `-q` | If passed, Cypress output will not be printed to `stdout`. Only output from the configured {% url "Mocha reporter" reporters %} will print.
`--record`  | {% urlHash "Whether to record the test run" cypress-run-record-key-lt-record-key-gt %}
`--reporter`, `-r`  | {% urlHash "Specify a Mocha reporter" cypress-run-reporter-lt-reporter-gt %}
`--reporter-options`, `-o`  | {% urlHash "Specify Mocha reporter options" cypress-run-reporter-lt-reporter-gt %}
`--spec`, `-s`  | {% urlHash "Specify the spec files to run" cypress-run-spec-lt-spec-gt %}
`--tag`, `-t`  | {% urlHash "Identify a run with a tag or tags" cypress-run-spec-lt-spec-gt %}

### `cypress run --browser <browser-name-or-path>`

```shell
cypress run --browser chrome
```

The "browser" argument can be set to `chrome`, `chromium`, `edge`, `electron`, `firefox` to launch a browser detected on your system. Cypress will attempt to automatically find the installed browser for you.

To launch non-stable browsers, add a colon and the desired release channel. For example, to launch Chrome Canary, use `chrome:canary`.

You can also choose a browser by supplying a path:

```shell
cypress run --browser /usr/bin/chromium
```

{% url "Having trouble with browser detection? Check out our troubleshooting guide" troubleshooting#Launching-browsers %}

### `cypress run --ci-build-id <id>`

This value should be automatically detected for most CI providers and is unnecessary to define unless Cypress is unable to determine it.

Typically, this is defined as an environment variable within your CI provider, defining a unique "build" or "run".

```shell
cypress run --ci-build-id BUILD_NUMBER
```

Only valid when providing a `--group` or `--parallel` flag. Read our {% url "parallelization" parallelization %} documentation to learn more.

### `cypress run --config <config>`

Set {% url 'configuration' configuration %} values. Separate multiple values with a comma. The values set here override any values set in your configuration file.

```shell
cypress run --config pageLoadTimeout=100000,watchForFileChanges=false
```

{% note info %}
#### {% fa fa-graduation-cap %} Real World Example

The Cypress {% url "Real World App (RWA)" https://github.com/cypress-io/cypress-realworld-app %} uses `--config` flag to easily specify {% url viewport configuration#Viewport %} sizes for responsive testing locally and in dedicated CI jobs. Examples:
- {% fa fa-github %} {% url "npm scripts" https://github.com/cypress-io/cypress-realworld-app/blob/07a6483dfe7ee44823380832b0b23a4dacd72504/package.json#L120 %} to run Cypress in mobile viewport.
- {% fa fa-github %} {% url "Circle CI job configuration" https://github.com/cypress-io/cypress-realworld-app/blob/07a6483dfe7ee44823380832b0b23a4dacd72504/.circleci/config.yml#L82-L100 %} for running test suites in mobile viewport.

{% endnote %}

### `cypress run --config-file <config-file>`

You can specify a path to a JSON file where {% url 'configuration' configuration %} values are set. This defaults to `cypress.json`.

```shell
cypress run --config-file tests/cypress-config.json
```

You can pass `false` to disable the use of a configuration file entirely.

```shell
cypress run --config-file false
```

### `cypress run --env <env>`

Set Cypress {% url 'environment variables' environment-variables %}.

```shell
cypress run --env host=api.dev.local
```

Pass several variables using commas and no spaces. Numbers are automatically converted from strings.

```shell
cypress run --env host=api.dev.local,port=4222
```

Pass an object as a JSON in a string.

```shell
cypress run --env flags='{"feature-a":true,"feature-b":false}'
```

### `cypress run --group <name>`

Group recorded tests together under a single run.

```shell
cypress run --group develop-env
```

You can add multiple groups to the same run by passing a different name. This can help distinguish groups of specs from each other.

```shell
cypress run --group admin-tests --spec 'cypress/integration/admin/**/*'
```

```shell
cypress run --group user-tests --spec 'cypress/integration/user/**/*'
```

Specifying the `--ci-build-id` may also be necessary.

{% url "Read more about grouping." parallelization#Grouping-test-runs %}

### `cypress run --headed`

By default, Cypress will run tests in Electron headlessly.

Passing `--headed` will force Electron to be shown. This matches how you run Electron via `cypress open`.

```shell
cypress run --headed
```

### `cypress run --headless`

Cypress will run tests in Chrome and Firefox headed by default.

Passing `--headless` will force the browser to be hidden.

```shell
cypress run --headless --browser chrome
```

### `cypress run --no-exit`

To prevent the Cypress Test Runner from exiting after running tests in a spec file, use `--no-exit`.

You can pass `--headed --no-exit` in order to view the **command log** or have access to **developer tools** after a `spec` has run.

```shell
cypress run --headed --no-exit
```

### `cypress run --parallel`

Run recorded specs in {% url "parallel" parallelization %} across multiple machines.

```shell
cypress run --record --parallel
```

You can additionally pass a `--group` flag so this shows up as a named {% url "group" parallelization#Grouping-test-runs %}.

```shell
cypress run --record --parallel --group e2e-staging-specs
```

Read our {% url "parallelization" parallelization %} documentation to learn more.

### `cypress run --port <port>`

```shell
cypress run --port 8080
```

### `cypress run --project <project-path>`

To see this in action we've set up an {% url 'example repo to demonstrate this here' https://github.com/cypress-io/cypress-test-nested-projects %}.

```shell
cypress run --project ./some/nested/folder
```

### `cypress run --record --key <record-key>`

Record video of tests running after {% url 'setting up your project to record' projects#Setup %}. After setting up your project you will be given a **Record Key**.

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

You can {% url 'read more about recording runs here' projects#Setup %}.

### `cypress run --reporter <reporter>`

You can tests specifying a specific {% url "Mocha reporter" reporters %}.

```shell
cypress run --reporter json
```

You can specify reporter options using the `--reporter-options <reporter-options>` flag.

```shell
cypress run --reporter junit --reporter-options mochaFile=result.xml,toConsole=true
```

### `cypress run --spec <spec>`

Run tests specifying a single test file to run instead of all tests.

```shell
cypress run --spec "cypress/integration/examples/actions.spec.js"
```

Run tests within the folder matching the glob *(Note: Using double quotes is strongly recommended)*.

```shell
cypress run --spec "cypress/integration/login/**/*"
```

Run tests specifying multiple test files to run.

```shell
cypress run --spec "cypress/integration/examples/actions.spec.js,cypress/integration/examples/files.spec.js"
```

### `cypress run --tag <tag>`

Add a tag or tags to the recorded run. This can be used to help identify separate run when displayed in the Dashboard.

```shell
cypress run  --record --tag "staging"
```

Give a run multiple tags.

```shell
cypress run --record --tag "production,nightly"
```

The Dashboard will display any tags sent with the appropriate run.

{% imgTag /img/dashboard/dashboard-run-with-tags.png "Cypress run in the Dashboard displaying flags" %}

### Exit code

When Cypress finishes running tests, it exits. If there are no failed tests, the exit code will be 0.

```text
# All tests pass
$ cypress run
...
                                        Tests  Passing  Failing
    ✔  All specs passed!      00:16       17       17        0

# print exit code on Mac or Linux
$ echo $?
0
```

If there are any test failures, then the exit code will match the number of tests that failed.

```text
# Spec with two failing tests
$ cypress run
...
                                        Tests  Passing  Failing
    ✖  1 of 1 failed (100%)   00:22       17       14        2

# print exit code on Mac or Linux
$ echo $?
2
```

If Cypress could not run for some reason (for example if no spec files were found) then the exit code will be 1.

```text
# No spec files found
$ cypress run --spec not-found.js
...
Can't run because no spec files were found.

We searched for any files matching this glob pattern:

not-found.js

# print exit code on Mac or Linux
$ echo $?
1
```

## `cypress open`

Opens the Cypress Test Runner.

```shell
cypress open [options]
```

### Options:

Options passed to `cypress open` will automatically be applied to the project you open. These persist on all projects until you quit the Cypress Test Runner. These options will also override values in your configuration file (`cypress.json` by default).

Option | Description
------ | ---------
`--browser`, `-b`  | {% urlHash "Path to a custom browser to be added to the list of available browsers in Cypress" cypress-open-browser-lt-browser-path-gt %}
`--config`, `-c`  | {% urlHash "Specify configuration" cypress-open-config-lt-config-gt %}
`--config-file`, `-C`  | {% urlHash "Specify configuration file" cypress-open-config-file-lt-config-file-gt %}
`--detached`, `-d` | Open Cypress in detached mode
`--env`, `-e`  | {% urlHash "Specify environment variables" cypress-open-env-lt-env-gt %}
`--global` | {% urlHash "Run in global mode" cypress-open-global %}
`--help`, `-h`  | Output usage information
`--port`, `-p`  | {% urlHash "Override default port" cypress-open-port-lt-port-gt %}
`--project`, `-P` | {% urlHash "Path to a specific project" cypress-open-project-lt-project-path-gt %}

### `cypress open --browser <browser-path>`

By default, Cypress will automatically find and allow you to use the browsers installed on your system.

The "browser" option allows you to specify the path to a custom browser to use with Cypress:

```shell
cypress open --browser /usr/bin/chromium
```

If found, the specified browser will be added to the list of available browsers in the Cypress Test Runner.

Currently, only browsers in the Chrome family are supported (including the new Chromium-based Microsoft Edge and Brave).

{% url "Having trouble launching a browser? Check out our troubleshooting guide" troubleshooting#Launching-browsers %}

### `cypress open --config <config>`

Set {% url 'configuration' configuration %} values. Separate multiple values with a comma. The values set here override any values set in your configuration file.

```shell
cypress run --config pageLoadTimeout=100000,watchForFileChanges=false
```

### `cypress open --config-file <config-file>`

You can specify a path to a JSON file where {% url 'configuration' configuration %} values are set. This defaults to `cypress.json`.

```shell
cypress open --config-file tests/cypress-config.json
```

You can pass `false` to disable the use of a configuration file entirely.

```shell
cypress open --config-file false
```

### `cypress open --env <env>`

Set Cypress {% url 'environment variables' environment-variables %}.

```shell
cypress open --env host=api.dev.local
```

Pass several variables using commas and no spaces. Numbers are automatically converted from strings.

```shell
cypress open --env host=api.dev.local,port=4222
```

Pass an object as a JSON in a string.

```shell
cypress open --env flags='{"feature-a":true,"feature-b":false}'
```

### `cypress open --global`

Opening Cypress in global mode is useful if you have multiple nested projects but want to share a single global installation of Cypress. In this case you can add each nested project to the Cypress in global mode, thus giving you a nice UI to switch between them.

```shell
cypress open --global
```

### `cypress open --port <port>`

```shell
cypress open --port 8080
```

### `cypress open --project <project-path>`

To see this in action we've set up an {% url 'example repo to demonstrate this here' https://github.com/cypress-io/cypress-test-nested-projects %}.

```shell
cypress open --project ./some/nested/folder
```

## `cypress info`

Prints information about Cypress and the current environment such as:

- A list of browsers Cypress detected on the machine.
- Any environment variables that control {% url 'proxy configuration' proxy-configuration %}.
- Any environment variables that start with the `CYPRESS` prefix (with sensitive variables like {% url 'record key' projects#Record-keys %} masked for security).
- The location where run-time data is stored.
- The location where the Cypress binary is cached.
- Operating system information.
- System memory including free space.

```shell
cypress info
Displaying Cypress info...

Detected 2 browsers installed:

1. Chrome
  - Name: chrome
  - Channel: stable
  - Version: 79.0.3945.130
  - Executable: /path/to/google-chrome
  - Profile: /user/profile/folder/for/google-chrome

2. Firefox Nightly
  - Name: firefox
  - Channel: nightly
  - Version: 74.0a1
  - Executable: /path/to/firefox

Note: to run these browsers, pass <name>:<channel> to the '--browser' field

Examples:
- cypress run --browser firefox:nightly
- cypress run --browser chrome

Learn More: https://on.cypress.io/launching-browsers

Proxy Settings: none detected
Environment Variables: none detected

Application Data: /path/to/app/data/cypress/cy/development
Browser Profiles: /path/to/app/data/cypress/cy/development/browsers
Binary Caches: /user/profile/path/.cache/Cypress

Cypress Version: 4.1.0
System Platform: darwin (19.2.0)
System Memory: 17.2 GB free 670 MB
```

**Tip:** set {% url "DEBUG environment variable" troubleshooting#Print-DEBUG-logs %} to `cypress:launcher` when running `cypress info` to troubleshoot browser detection.

## `cypress verify`

Verify that Cypress is installed correctly and is executable.

```shell
cypress verify
✔  Verified Cypress! /Users/jane/Library/Caches/Cypress/3.0.0/Cypress.app
```

## `cypress version`

Output both the versions of the installed Cypress binary application and the npm module.
In most cases they will be the same, but they could be different if you have installed a different version of the npm package and for some reason could not install the matching binary.

```shell
cypress version
Cypress package version: 3.0.0
Cypress binary version: 3.0.0
```

## `cypress cache [command]`

Commands for managing the global Cypress cache. The Cypress cache applies to all installs of Cypress across your machine, global or not.

### `cypress cache path`

Print the `path` to the Cypress cache folder. You can change the path where the Cypress cache is located by following {% url "these instructions" installing-cypress#Binary-cache %}.

```shell
cypress cache path
/Users/jane/Library/Caches/Cypress
```

### `cypress cache list`

Print all existing installed versions of Cypress. The output will be a table with cached versions and the last time the binary was used by the user, determined from the file's access time.

```shell
cypress cache list
┌─────────┬──────────────┐
│ version │ last used    │
├─────────┼──────────────┤
│ 3.0.0   │ 3 months ago │
├─────────┼──────────────┤
│ 3.0.1   │ 5 days ago   │
└─────────┴──────────────┘
```

You can calculate the size of every Cypress version folder by adding the `--size` argument to the command. Note that calculating the disk size can be slow.

```shell
cypress cache list --size
┌─────────┬──────────────┬─────────┐
│ version │ last used    │ size    │
├─────────┼──────────────┼─────────┤
│ 3.0.0   │ 3 months ago │ 425.3MB │
├─────────┼──────────────┼─────────┤
│ 3.0.1   │ 5 days ago   │ 436.3MB │
└─────────┴──────────────┴─────────┘
```

### `cypress cache clear`

Clear the contents of the Cypress cache. This is useful when you want Cypress to clear out all installed versions of Cypress that may be cached on your machine. After running this command, you will need to run `cypress install` before running Cypress again.

```shell
cypress cache clear
```

# Debugging commands

Cypress is built using the {% url 'debug' https://github.com/visionmedia/debug %} module. That means you can receive helpful debugging output by running Cypress with this turned on prior to running `cypress open` or `cypress run`.

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
```

```shell
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
```

{% history %}
{% url "4.9.0" changelog %} | Added `--quiet` flag to `cypress run`
{% endhistory %}
