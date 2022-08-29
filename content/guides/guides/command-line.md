---
title: Command Line
---

<Alert type="info">

## <Icon name="graduation-cap"></Icon> What you'll learn

- How to run Cypress from the command line
- How to specify which spec files to run
- How to launch other browsers
- How to record your tests to the Dashboard

</Alert>

## Installation

This guide assumes you've already read our
[Installing Cypress](/guides/getting-started/installing-cypress) guide and
installed Cypress as an `npm` module. After installing you'll be able to execute
all of the commands in this document from your **project root**.

## How to run commands

<Alert type="info">

You can alternatively require and run Cypress as a node module using our
[Module API](/guides/guides/module-api).

</Alert>

For brevity we've omitted the full path to the cypress executable in each
command's documentation.

To run a command, you'll need to prefix each command in order to properly locate
the cypress executable.

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

...or by using Yarn...

```shell
yarn cypress run
```

You may find it easier to add the cypress command to the `scripts` object in
your `package.json` file and call it from an
[`npm run` script](https://docs.npmjs.com/cli/run-script.html).

When calling a command using `npm run`, you need to pass the command's arguments
using the `--` string. For example, if you have the following command defined in
your `package.json`

```json
{
  "scripts": {
    "cy:run": "cypress run"
  }
}
```

...and want to run tests from a single spec file and record the results on the
Dashboard, the command should be:

```shell
npm run cy:run --record --spec "cypress/e2e/my-spec.cy.js"
```

If you are using the [npx](https://github.com/zkat/npx) tool, you can invoke the
locally installed Cypress tool directly:

```shell
npx cypress run --record --spec "cypress/e2e/my-spec.cy.js"
```

<Alert type="info">

Read how we typically organize and execute npm scripts in the blog post
[How I Organize my npm Scripts](https://glebbahmutov.com/blog/organize-npm-scripts/).

</Alert>

## Commands

### `cypress run`

Runs Cypress tests to completion. By default, `cypress run` will run all tests
headlessly.

```shell
cypress run [options]
```

#### Options

| Option                     | Description                                                                                                                                                                                |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--browser`, `-b`          | [Run Cypress in the browser with the given name. If a filesystem path is supplied, Cypress will attempt to use the browser at that path.](#cypress-run-browser-lt-browser-name-or-path-gt) |
| `--ci-build-id`            | [Specify a unique identifier for a run to enable grouping or parallelization.](#cypress-run-ci-build-id-lt-id-gt)                                                                          |
| `--component`              | [Run component tests](/guides/core-concepts/testing-types#What-is-Component-Testing)                                                                                                       |
| `--config`, `-c`           | [Specify configuration](#cypress-run-config-lt-config-gt)                                                                                                                                  |
| `--config-file`, `-C`      | [Specify configuration file](#cypress-run-config-file-lt-configuration-file-gt)                                                                                                            |
| `--e2e`                    | Run end to end tests (default)                                                                                                                                                             |
| `--env`, `-e`              | [Specify environment variables](#cypress-run-env-lt-env-gt)                                                                                                                                |
| `--group`                  | [Group recorded tests together under a single run](#cypress-run-group-lt-name-gt)                                                                                                          |
| `--headed`                 | [Displays the browser instead of running headlessly](#cypress-run-headed)                                                                                                                  |
| `--headless`               | [Hide the browser instead of running headed (default during `cypress run`)](#cypress-run-headless)                                                                                         |
| `--help`, `-h`             | Output usage information                                                                                                                                                                   |
| `--key`, `-k`              | [Specify your secret record key](#cypress-run-record-key-lt-record-key-gt)                                                                                                                 |
| `--no-exit`                | [Keep Cypress open after tests in a spec file run](#cypress-run-no-exit)                                                                                                                   |
| `--parallel`               | [Run recorded specs in parallel across multiple machines](#cypress-run-parallel)                                                                                                           |
| `--port`,`-p`              | [Override default port](#cypress-run-port-lt-port-gt)                                                                                                                                      |
| `--project`, `-P`          | [Path to a specific project](#cypress-run-project-lt-project-path-gt)                                                                                                                      |
| `--quiet`, `-q`            | If passed, Cypress output will not be printed to `stdout`. Only output from the configured [Mocha reporter](/guides/tooling/reporters) will print.                                         |
| `--record`                 | [Whether to record the test run](#cypress-run-record-key-lt-record-key-gt)                                                                                                                 |
| `--reporter`, `-r`         | [Specify a Mocha reporter](#cypress-run-reporter-lt-reporter-gt)                                                                                                                           |
| `--reporter-options`, `-o` | [Specify Mocha reporter options](#cypress-run-reporter-lt-reporter-gt)                                                                                                                     |
| `--spec`, `-s`             | [Specify the spec files to run](#cypress-run-spec-lt-spec-gt)                                                                                                                              |
| `--tag`, `-t`              | [Identify a run with a tag or tags](#cypress-run-tag-lt-tag-gt)                                                                                                                            |

#### `cypress run --browser <browser-name-or-path>`

```shell
cypress run --browser chrome
```

The "browser" argument can be set to `chrome`, `chromium`, `edge`, `electron`,
`firefox` to launch a browser detected on your system. Cypress will attempt to
automatically find the installed browser for you.

To launch non-stable browsers, add a colon and the desired release channel. For
example, to launch Chrome Canary, use `chrome:canary`.

You can also choose a browser by supplying a path:

```shell
cypress run --browser /usr/bin/chromium
```

[Having trouble with browser detection? Check out our troubleshooting guide](/guides/references/troubleshooting#Launching-browsers)

#### `cypress run --ci-build-id <id>`

This value should be automatically detected for most CI providers and is
unnecessary to define unless Cypress is unable to determine it.

Typically, this is defined as an environment variable within your CI provider,
defining a unique "build" or "run".

```shell
cypress run --ci-build-id BUILD_NUMBER
```

Only valid when providing a `--group` or `--parallel` flag. Read our
[parallelization](/guides/guides/parallelization) documentation to learn more.

#### `cypress run --config <config>`

Set [configuration](/guides/references/configuration) values. Separate multiple
values with commas. The values set here override any values set in your
configuration file.

```shell
cypress run --config pageLoadTimeout=100000,watchForFileChanges=false
```

For more complex configuration objects, you may want to consider passing a
[JSON.stringified](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
object surrounded by single quotes.

Here, we're passing in the configuration for component spec files.

```shell
cypress run --config '{"watchForFileChanges":false,"specPattern":["**/*.cy.js","**/*.cy.ts"]}'
```

<Alert type="info">

##### <Icon name="graduation-cap"></Icon> Real World Example

The Cypress
[Real World App (RWA)](https://github.com/cypress-io/cypress-realworld-app) uses
`--config` flag to easily specify
[viewport](/guides/references/configuration#Viewport) sizes for responsive
testing locally and in dedicated CI jobs. Examples:

- <Icon name="github"></Icon>
  [npm scripts](https://github.com/cypress-io/cypress-realworld-app/blob/07a6483dfe7ee44823380832b0b23a4dacd72504/package.json#L120)
  to run Cypress in mobile viewport.
- <Icon name="github"></Icon>
  [Circle CI job configuration](https://github.com/cypress-io/cypress-realworld-app/blob/07a6483dfe7ee44823380832b0b23a4dacd72504/.circleci/config.yml#L82-L100)
  for running test suites in mobile viewport.

</Alert>

#### `cypress run --config-file <configuration-file>`

You can specify a path to a file where
[Cypress configuration](/guides/references/configuration) values are set.

```shell
cypress run --config-file tests/cypress.config.js
```

#### `cypress run --env <env>`

Set Cypress [environment variables](/guides/guides/environment-variables).

```shell
cypress run --env host=api.dev.local
```

Pass several variables using commas and no spaces. Numbers are automatically
converted from strings.

```shell
cypress run --env host=api.dev.local,port=4222
```

Pass an object as a JSON in a string.

```shell
cypress run --env flags='{"feature-a":true,"feature-b":false}'
```

#### `cypress run --group <name>`

Group recorded tests together under a single run.

```shell
cypress run --group develop-env
```

You can add multiple groups to the same run by passing a different name. This
can help distinguish groups of specs from each other.

```shell
cypress run --group admin-tests --spec 'cypress/e2e/admin/**/*'
```

```shell
cypress run --group user-tests --spec 'cypress/e2e/user/**/*'
```

Specifying the `--ci-build-id` may also be necessary.

[Read more about grouping.](/guides/guides/parallelization#Grouping-test-runs)

#### `cypress run --headed`

By default, Cypress will run tests headlessly during `cypress run`.

Passing `--headed` will force the browser to be shown. This matches how you run
any browser via `cypress open`.

```shell
cypress run --headed
```

#### `cypress run --no-exit`

To prevent Cypress from exiting after running tests in a spec file, use
`--no-exit`.

You can pass `--headed --no-exit` in order to view the **command log** or have
access to **developer tools** after a `spec` has run.

```shell
cypress run --headed --no-exit
```

#### `cypress run --parallel`

Run recorded specs in [parallel](/guides/guides/parallelization) across multiple
machines.

```shell
cypress run --record --parallel
```

You can additionally pass a `--group` flag so this shows up as a named
[group](/guides/guides/parallelization#Grouping-test-runs).

```shell
cypress run --record --parallel --group e2e-staging-specs
```

Read our [parallelization](/guides/guides/parallelization) documentation to
learn more.

#### `cypress run --port <port>`

```shell
cypress run --port 8080
```

#### `cypress run --project <project-path>`

To see this in action we've set up an
[example repo to demonstrate this here](https://github.com/cypress-io/cypress-test-nested-projects).

```shell
cypress run --project ./some/nested/folder
```

#### `cypress run --record --key <record-key>`

Record video of tests running after
[setting up your project to record](/guides/dashboard/projects#Setup). After
setting up your project you will be given a **Record Key**.

```shell
cypress run --record --key <record_key>
```

If you set the **Record Key** as the environment variable `CYPRESS_RECORD_KEY`,
you can omit the `--key` flag.

You'd typically set this environment variable when running in
[Continuous Integration](/guides/continuous-integration/introduction).

```shell
export CYPRESS_RECORD_KEY=abc-key-123
```

Now you can omit the `--key` flag.

```shell
cypress run --record
```

You can [read more about recording runs here](/guides/dashboard/projects#Setup).

#### `cypress run --reporter <reporter>`

You can tests specifying a specific [Mocha reporter](/guides/tooling/reporters).

```shell
cypress run --reporter json
```

You can specify reporter options using the
`--reporter-options <reporter-options>` flag.

```shell
cypress run --reporter junit --reporter-options mochaFile=result.xml,toConsole=true
```

#### `cypress run --spec <spec>`

Run tests specifying a single test file to run instead of all tests. The spec
path should be an absolute path or can relative to the current working
directory.

```shell
cypress run --spec "cypress/e2e/examples/actions.cy.js"
```

Run tests within the folder matching the glob _(Note: Using double quotes is
strongly recommended)_.

```shell
cypress run --spec "cypress/e2e/login/**/*"
```

Run tests specifying multiple test files to run.

```shell
cypress run --spec "cypress/e2e/examples/actions.cy.js,cypress/e2e/examples/files.cy.js"
```

Use in combination with `--project` parameter. Imagine the Cypress tests are in
a subfolder `tests/e2e` of the current project:

```
app/
  node_modules/
  package.json
  tests/
    unit/
    e2e/
      cypress/
        integration/
          spec.js
      cypress.config.js
```

If we are in the `app` folder, we can run the specs using the following command

```shell
cypress run --project tests/e2e --spec ./tests/e2e/cypress/e2e/spec.js
```

#### `cypress run --tag <tag>`

Add a tag or tags to the recorded run. This can be used to help identify
separate run when displayed in the Dashboard.

```shell
cypress run  --record --tag "staging"
```

Give a run multiple tags.

```shell
cypress run --record --tag "production,nightly"
```

The Dashboard will display any tags sent with the appropriate run.

<DocsImage src="/img/dashboard/dashboard-run-with-tags.png" alt="Cypress run in the Dashboard displaying flags" ></DocsImage>

#### Exit code

When Cypress finishes running tests, it exits. If there are no failed tests, the
exit code will be 0.

```text
## All tests pass
$ cypress run
...
                                        Tests  Passing  Failing
    ✔  All specs passed!      00:16       17       17        0

## print exit code on Mac or Linux
$ echo $?
0
```

If there are any test failures, then the exit code will match the number of
tests that failed.

```text
## Spec with two failing tests
$ cypress run
...
                                        Tests  Passing  Failing
    ✖  1 of 1 failed (100%)   00:22       17       14        2

## print exit code on Mac or Linux
$ echo $?
2
```

If Cypress could not run for some reason (for example if no spec files were
found) then the exit code will be 1.

```text
## No spec files found
$ cypress run --spec not-found.js
...
Can't run because no spec files were found.

We searched for any files matching this glob pattern:

not-found.js

## print exit code on Mac or Linux
$ echo $?
1
```

### `cypress open`

Opens Cypress.

```shell
cypress open [options]
```

#### Options:

Options passed to `cypress open` will automatically be applied to the project
you open. These persist on all projects until you quit Cypress. These options
will also override values in the Cypress configuration file.

By passing `--browser` and `--e2e` or `--component` when launching a project,
you can open Cypress and launch the browser at the same time. Otherwise, you
will be guided through selecting a browser, project, and/or testing type.

| Option                | Description                                                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `--browser`, `-b`     | [Path to a custom browser to be added to the list of available browsers in Cypress](#cypress-open-browser-lt-browser-path-gt) |
| `--component`         | [Run component tests](/guides/core-concepts/testing-types#What-is-Component-Testing)                                          |
| `--config`, `-c`      | [Specify configuration](#cypress-open-config-lt-config-gt)                                                                    |
| `--config-file`, `-C` | [Specify configuration file](#cypress-open-config-file-lt-configuration-file-gt)                                              |
| `--detached`, `-d`    | Open Cypress in detached mode                                                                                                 |
| `--e2e`               | Run end to end tests (default)                                                                                                |
| `--env`, `-e`         | [Specify environment variables](#cypress-open-env-lt-env-gt)                                                                  |
| `--global`            | [Run in global mode](#cypress-open-global)                                                                                    |
| `--help`, `-h`        | Output usage information                                                                                                      |
| `--port`, `-p`        | [Override default port](#cypress-open-port-lt-port-gt)                                                                        |
| `--project`, `-P`     | [Path to a specific project](#cypress-open-project-lt-project-path-gt)                                                        |

#### `cypress open --browser <browser-path>`

By default, Cypress will automatically find and allow you to use the browsers
installed on your system.

The "browser" option allows you to specify the path to a custom browser to use
with Cypress:

```shell
cypress open --browser /usr/bin/chromium
```

If found, the specified browser will be added to the list of available browsers.

Currently, only browsers in the Chrome family (including the new Chromium-based
Microsoft Edge and Brave) and Firefox are supported.

[Having trouble launching a browser? Check out our troubleshooting guide](/guides/references/troubleshooting#Launching-browsers)

#### `cypress open --config <config>`

Set [configuration](/guides/references/configuration) values. Separate multiple
values with a comma. The values set here override any values set in your
configuration file.

```shell
cypress open --config pageLoadTimeout=100000,watchForFileChanges=false
```

For more complex configuration objects, you may want to consider passing a
[JSON.stringified](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
object.

Here, we're passing in the configuration for component spec files.

```shell
cypress open --config "{\"watchForFileChanges\":false,\"specPattern\":[\"**/*.cy.js\",\"**/*.cy.ts\"]}"
```

#### `cypress open --config-file <configuration-file>`

You can specify a path to a file where
[Cypress configuration](/guides/references/configuration) values are set.

```shell
cypress open --config-file tests/cypress.config.js
```

#### `cypress open --env <env>`

Set Cypress [environment variables](/guides/guides/environment-variables).

```shell
cypress open --env host=api.dev.local
```

Pass several variables using commas and no spaces. Numbers are automatically
converted from strings.

```shell
cypress open --env host=api.dev.local,port=4222
```

Pass an object as a JSON in a string.

```shell
cypress open --env flags='{"feature-a":true,"feature-b":false}'
```

#### `cypress open --global`

Opening Cypress in global mode is useful if you have multiple nested projects
but want to share a single global installation of Cypress. In this case you can
add each nested project to the Cypress in global mode, thus giving you a nice UI
to switch between them.

```shell
cypress open --global
```

#### `cypress open --port <port>`

```shell
cypress open --port 8080
```

#### `cypress open --project <project-path>`

To see this in action we've set up an
[example repo to demonstrate this here](https://github.com/cypress-io/cypress-test-nested-projects).

```shell
cypress open --project ./some/nested/folder
```

### `cypress info`

Prints information about Cypress and the current environment such as:

- A list of browsers Cypress detected on the machine.
- Any environment variables that control
  [proxy configuration](/guides/references/proxy-configuration).
- Any environment variables that start with the `CYPRESS` prefix (with sensitive
  variables like [record key](/guides/dashboard/projects#Record-keys) masked for
  security).
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

**Tip:** set
[DEBUG environment variable](/guides/references/troubleshooting#Print-DEBUG-logs)
to `cypress:launcher` when running `cypress info` to troubleshoot browser
detection.

### `cypress verify`

Verify that Cypress is installed correctly and is executable.

```shell
cypress verify
✔  Verified Cypress! /Users/jane/Library/Caches/Cypress/3.0.0/Cypress.app
```

To change the default timeout of 30 seconds, you can set the environment
variable `CYPRESS_VERIFY_TIMEOUT`:

```shell
export CYPRESS_VERIFY_TIMEOUT=60000 # wait for 60 seconds
cypress verify
```

Note that the `cypress verify` command is executed as part of the `cypress open`
and `cypress run` commands. The `CYPRESS_VERIFY_TIMEOUT` environment variable
should be provided for those commands if you wish to modify the timeout
duration.

### `cypress version`

Prints the installed Cypress binary version, the Cypress package version, the
version of Electron used to build Cypress, and the bundled Node version.

In most cases the binary and the package versions will be the same, but they
could be different if you have installed a different version of the package and
for some reason failed to install the matching binary version.

```shell
cypress version
Cypress package version: 6.0.0
Cypress binary version: 6.0.0
Electron version: 10.1.5
Bundled Node version: 12.14.1
```

You can print each individual component's version number also.

```shell
cypress version --component package
6.0.0
cypress version --component binary
6.0.0
cypress version --component electron
10.1.5
cypress version --component node
12.14.1
```

### `cypress cache [command]`

Commands for managing the global Cypress cache. The Cypress cache applies to all
installs of Cypress across your machine, global or not.

#### `cypress cache path`

Print the `path` to the Cypress cache folder. You can change the path where the
Cypress cache is located by following
[these instructions](/guides/references/advanced-installation#Binary-cache).

```shell
cypress cache path
/Users/jane/Library/Caches/Cypress
```

#### `cypress cache list`

Print all existing installed versions of Cypress. The output will be a table
with cached versions and the last time the binary was used by the user,
determined from the file's access time.

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

You can calculate the size of every Cypress version folder by adding the
`--size` argument to the command. Note that calculating the disk size can be
slow.

```shell
cypress cache list --size
┌─────────┬──────────────┬─────────┐
│ version │ last used    │ size    │
├─────────┼──────────────┼─────────┤
│ 5.0.0   │ 3 months ago │ 425.3MB │
├─────────┼──────────────┼─────────┤
│ 5.3.0   │ 5 days ago   │ 436.3MB │
└─────────┴──────────────┴─────────┘
```

#### `cypress cache clear`

Clear the contents of the Cypress cache. This is useful when you want Cypress to
clear out all installed versions of Cypress that may be cached on your machine.
After running this command, you will need to run `cypress install` before
running Cypress again.

```shell
cypress cache clear
```

#### `cypress cache prune`

Deletes all installed Cypress versions from the cache except for the
currently-installed version.

```shell
cypress cache prune
```

## Debugging commands

### Enable Debug Logs

Cypress is built using the [debug](https://github.com/visionmedia/debug) module.
That means you can receive helpful debugging output by running Cypress with this
turned on prior to running `cypress open` or `cypress run`.

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

Cypress is a rather large and complex project involving a dozen or more
submodules, and the default output can be overwhelming.

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

## History

| Version                               | Changes                                                |
| ------------------------------------- | ------------------------------------------------------ |
| [5.4.0](/guides/references/changelog) | Added `prune` subcommand to `cypress cache`            |
| [5.4.0](/guides/references/changelog) | Added `--size` flag to `cypress cache list` subcommand |
| [4.9.0](/guides/references/changelog) | Added `--quiet` flag to `cypress run`                  |
