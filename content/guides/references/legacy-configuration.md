---
title: Configuration (Legacy)
---

<Alert type="warning">

Configuring Cypress via `cypress.json` no longer supported in Cypress 10.0. This
guide covers legacy configuration for Cypress 9 and below.

</Alert>

## cypress.json

The first time you open Cypress, it creates the `cypress.json` configuration
file. This JSON file is used to store any configuration values you supply. If
you [configure your tests to record](/guides/dashboard/projects#Setup) the
results to the [Cypress Dashboard](https://on.cypress.io/dashboard-introduction)
the `projectId` will be written in this file too.

<Alert type="warning">

<strong class="alert-header">Change Configuration File</strong>

You can change the configuration file or turn off the use of a configuration
file by using the
[`--config-file` flag](/guides/guides/command-line#cypress-open-config-file-lt-config-file-gt).

</Alert>

## Options

The default behavior of Cypress can be modified by supplying any of the
following configuration options. Below is a list of available options and their
default values.

### Global

| Option                 | Default                           | Description                                                                                                                                                                                  |
| ---------------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `baseUrl`              | `null`                            | URL used as prefix for [`cy.visit()`](/api/commands/visit) or [`cy.request()`](/api/commands/request) command's URL                                                                          |
| `clientCertificates`   | `[]`                              | An optional array of [client certificates](/guides/references/client-certificates)                                                                                                           |
| `env`                  | `{}`                              | Any values to be set as [environment variables](/guides/guides/environment-variables)                                                                                                        |
| `includeShadowDom`     | `false`                           | Whether to traverse shadow DOM boundaries and include elements within the shadow DOM in the results of query commands (e.g. [`cy.get()`](/api/commands/get))                                 |
| `numTestsKeptInMemory` | `50`                              | The number of tests for which snapshots and command data are kept in memory. Reduce this number if you are experiencing high memory consumption in your browser during a test run.           |
| `port`                 | `null`                            | Port used to host Cypress. Normally this is a randomly generated port                                                                                                                        |
| `redirectionLimit`     | `20`                              | The number of times that the application under test can redirect before erroring.                                                                                                            |
| `reporter`             | `spec`                            | The [reporter](/guides/tooling/reporters) used during `cypress run`                                                                                                                          |
| `reporterOptions`      | `null`                            | The [reporter options](/guides/tooling/reporters#Reporter-Options) used. Supported options depend on the reporter.                                                                           |
| `retries`              | `{ "runMode": 0, "openMode": 0 }` | The number of times to retry a failing test. Can be configured to apply to `cypress run` or `cypress open` separately. See [Test Retries](/guides/guides/test-retries) for more information. |
| `watchForFileChanges`  | `true`                            | Whether Cypress will watch and restart tests on test file changes                                                                                                                            |

### Timeouts

<Alert type="success">

<strong class="alert-header">Core Concept</strong>

[Timeouts are a core concept](/guides/core-concepts/introduction-to-cypress#Timeouts)
you should understand well. The default values listed here are meaningful.

</Alert>

| Option                  | Default        | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ----------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defaultCommandTimeout` | `4000`         | Time, in milliseconds, to wait until most DOM based commands are considered timed out                                                                                                                                                                                                                                                                                                                                                                                             |
| `execTimeout`           | `60000`        | Time, in milliseconds, to wait for a system command to finish executing during a [`cy.exec()`](/api/commands/exec) command                                                                                                                                                                                                                                                                                                                                                        |
| `taskTimeout`           | `60000`        | Time, in milliseconds, to wait for a task to finish executing during a [`cy.task()`](/api/commands/task) command                                                                                                                                                                                                                                                                                                                                                                  |
| `pageLoadTimeout`       | `60000`        | Time, in milliseconds, to wait for `page transition events` or [`cy.visit()`](/api/commands/visit), [`cy.go()`](/api/commands/go), [`cy.reload()`](/api/commands/reload) commands to fire their page `load` events. Network requests are limited by the underlying operating system, and may still time out if this value is increased.                                                                                                                                           |
| `requestTimeout`        | `5000`         | Time, in milliseconds, to wait for a request to go out in a [`cy.wait()`](/api/commands/wait) command                                                                                                                                                                                                                                                                                                                                                                             |
| `responseTimeout`       | `30000`        | Time, in milliseconds, to wait until a response in a [`cy.request()`](/api/commands/request), [`cy.wait()`](/api/commands/wait), [`cy.fixture()`](/api/commands/fixture), [`cy.getCookie()`](/api/commands/getcookie), [`cy.getCookies()`](/api/commands/getcookies), [`cy.setCookie()`](/api/commands/setcookie), [`cy.clearCookie()`](/api/commands/clearcookie), [`cy.clearCookies()`](/api/commands/clearcookies), and [`cy.screenshot()`](/api/commands/screenshot) commands |
| `slowTestThreshold`     | `10000 \| 250` | Time, in milliseconds, to consider a test "slow" during `cypress run`. A slow test will display in orange text in the default reporter. You will often want to configure this differently for component and e2e testing. Default is 10000 for e2e and 250 for component tests.                                                                                                                                                                                                    |

### Folders / Files

| Option              | Default                    | Description                                                                                                                                                                                                                                                                                |
| ------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `downloadsFolder`   | `cypress/downloads`        | Path to folder where files downloaded during a test are saved                                                                                                                                                                                                                              |
| `fileServerFolder`  | root project folder        | Path to folder where application files will attempt to be served from                                                                                                                                                                                                                      |
| `fixturesFolder`    | `cypress/fixtures`         | Path to folder containing fixture files (Pass `false` to disable)                                                                                                                                                                                                                          |
| `ignoreTestFiles`   | `*.hot-update.js`          | A String or Array of glob patterns used to ignore test files that would otherwise be shown in your list of tests. Cypress uses `minimatch` with the options: `{dot: true, matchBase: true}`. We suggest using [https://globster.xyz](https://globster.xyz) to test what files would match. |
| `integrationFolder` | `cypress/integration`      | Path to folder containing integration test files                                                                                                                                                                                                                                           |
| `pluginsFile`       | `cypress/plugins/index.js` | Path to plugins file. (Pass `false` to disable)                                                                                                                                                                                                                                            |
| `screenshotsFolder` | `cypress/screenshots`      | Path to folder where screenshots will be saved from [`cy.screenshot()`](/api/commands/screenshot) command or after a test fails during `cypress run`                                                                                                                                       |
| `supportFile`       | `cypress/support/index.js` | Path to file to load before test files load. This file is compiled and bundled. (Pass `false` to disable)                                                                                                                                                                                  |
| `testFiles`         | `**/*.*`                   | A String or Array of glob patterns of the test files to load                                                                                                                                                                                                                               |
| `videosFolder`      | `cypress/videos`           | Path to folder where videos will be saved during `cypress run`                                                                                                                                                                                                                             |

### Screenshots

| Option                   | Default               | Description                                                                                                                                          |
| ------------------------ | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `screenshotOnRunFailure` | `true`                | Whether Cypress will take a screenshot when a test fails during `cypress run`.                                                                       |
| `screenshotsFolder`      | `cypress/screenshots` | Path to folder where screenshots will be saved from [`cy.screenshot()`](/api/commands/screenshot) command or after a test fails during `cypress run` |
| `trashAssetsBeforeRuns`  | `true`                | Whether Cypress will trash assets within the `downloadsFolder`, `screenshotsFolder`, and `videosFolder` before tests run with `cypress run`.         |

For more options regarding screenshots, view the
[Cypress.Screenshot API](/api/cypress-api/screenshot-api).

### Videos

| Option                  | Default          | Description                                                                                                                                                                                                                                                                                                              |
| ----------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `trashAssetsBeforeRuns` | `true`           | Whether Cypress will trash assets within the `downloadsFolder`, `screenshotsFolder`, and `videosFolder` before tests run with `cypress run`.                                                                                                                                                                             |
| `videoCompression`      | `32`             | The quality setting for the video compression, in Constant Rate Factor (CRF). The value can be `false` to disable compression or a value between `0` and `51`, where a lower value results in better quality (at the expense of a higher file size).                                                                     |
| `videosFolder`          | `cypress/videos` | Where Cypress will automatically save the video of the test run when tests run with `cypress run`.                                                                                                                                                                                                                       |
| `video`                 | `true`           | Whether Cypress will capture a video of the tests run with `cypress run`.                                                                                                                                                                                                                                                |
| `videoUploadOnPasses`   | `true`           | Whether Cypress will process, compress, and upload videos to the [Dashboard](/guides/dashboard/introduction) even when all tests in a spec file are passing. This only applies when recording your runs to the Dashboard. Turn this off if you'd like to only upload the spec file's video when there are failing tests. |

### Downloads

| Option                  | Default             | Description                                                                                                                                  |
| ----------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `downloadsFolder`       | `cypress/downloads` | Path to folder where files downloaded during a test are saved                                                                                |
| `trashAssetsBeforeRuns` | `true`              | Whether Cypress will trash assets within the `downloadsFolder`, `screenshotsFolder`, and `videosFolder` before tests run with `cypress run`. |

### Browser

| Option                  | Default                              | Description                                                                                                                                                                                                                                                                                                                                                        |
| ----------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `chromeWebSecurity`     | `true`                               | Whether to enable Chromium-based browser's Web Security for same-origin policy and insecure mixed content.                                                                                                                                                                                                                                                         |
| `blockHosts`            | `null`                               | A String or Array of hosts that you wish to block traffic for. [Please read the notes for examples on using this.](#blockHosts)                                                                                                                                                                                                                                    |
| `firefoxGcInterval`     | `{ "runMode": 1, "openMode": null }` | (Firefox 79 and below only) Controls whether Cypress forces Firefox to run garbage collection (GC) cleanup and how frequently. During [cypress run](/guides/guides/command-line#cypress-run), the default value is `1`. During [cypress open](/guides/guides/command-line#cypress-open), the default value is `null`. See full details [here](#firefoxGcInterval). |
| `modifyObstructiveCode` | `true`                               | Whether Cypress will search for and replace obstructive JS code in `.js` or `.html` files. [Please read the notes for more information on this setting.](#modifyObstructiveCode)                                                                                                                                                                                   |
| `userAgent`             | `null`                               | Enables you to override the default user agent the browser sends in all request headers. User agent values are typically used by servers to help identify the operating system, browser, and browser version. See [User-Agent MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent) for example user agent values.              |

### Viewport

| Option           | Default | Description                                                                                                                          |
| ---------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `viewportHeight` | `660`   | Default height in pixels for the application under tests' viewport (Override with [`cy.viewport()`](/api/commands/viewport) command) |
| `viewportWidth`  | `1000`  | Default width in pixels for the application under tests' viewport. (Override with [`cy.viewport()`](/api/commands/viewport) command) |

### Actionability

| Option                       | Default | Description                                                                                                                                                                      |
| ---------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `animationDistanceThreshold` | `5`     | The distance in pixels an element must exceed over time to be considered animating                                                                                               |
| `waitForAnimations`          | `true`  | Whether to wait for elements to finish animating before executing commands                                                                                                       |
| `scrollBehavior`             | `top`   | Viewport position to which an element should be scrolled before executing commands. Can be `'center'`, `'top'`, `'bottom'`, `'nearest'`, or `false`. `false` disables scrolling. |

For more information, see the docs on
[actionability](/guides/core-concepts/interacting-with-elements#Actionability).

### Node version

<Alert type="warning">

The `nodeVersion` configuration option is deprecated and will be removed in a
future version of Cypress. Please remove this option from your configuration
file.

</Alert>

| Option        | Default  | Description                                                                                                                                                                                                                                                                                                                                |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `nodeVersion` | `system` | Can be `system` or `bundled`. If set to `system`, Cypress will try to use the same Node version that launched Cypress to execute your [plugins](/guides/tooling/plugins-guide). If that can't be determined, Cypress will use the Node version bundled with Cypress. If set to `bundled` Cypress will use the version bundled with Cypress |

The Node version is used in Cypress to:

- Build files in the
  [integrationFolder](/guides/references/configuration#Folders-Files).
- Build files in the
  [supportFile](/guides/references/configuration#Folders-Files).
- Execute code in the
  [pluginsFile](/guides/references/configuration#Folders-Files).

<DocsImage src="/img/guides/configuration/test-runner-settings-nodejs-version.jpg" alt="Node version in Settings in Test Runner" ></DocsImage>

### Experiments

Configuration might include experimental options currently being tested. See
[Experiments](/guides/references/experiments) page.

## Overriding Options

Cypress gives you the option to dynamically alter configuration values. This is
helpful when running Cypress in multiple environments and on multiple developer
machines.

This gives you the option to do things like override the `baseUrl` or
environment variables.

### Command Line

When [running Cypress from the Command Line](/guides/guides/command-line) you
can pass a `--config` flag.

#### Examples:

```shell
cypress open --config pageLoadTimeout=30000,baseUrl=https://myapp.com
```

```shell
cypress run --config integrationFolder=tests,videoUploadOnPasses=false
```

```shell
cypress run --browser firefox --config viewportWidth=1280,viewportHeight=720
```

For more complex configuration objects, you may want to consider passing a
[JSON.stringified](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
object surrounded by single quotes.

```shell
cypress open --config '{"watchForFileChanges":false,"testFiles":["**/*.js","**/*.ts"]}'
```

### Runner Specific Overrides

You can override configuration for either the E2E or
[Component Testing](/guides/component-testing/introduction/) runner using the
`e2e` and `component` options.

#### Examples

Component Testing specific viewports in configuration file (`cypress.json` by
default):

```json
{
  "viewportHeight": 600,
  "viewportWidth": 1000,
  "component": {
    "viewportHeight": 500,
    "viewportWidth": 500
  }
}
```

Testing type specific timeouts in configuration file (`cypress.json` by
default):

```json
{
  "defaultCommandTimeout": 5000,
  "e2e": {
    "defaultCommandTimeout": 10000,
    "slowTestThreshold": 5000
  },
  "component": {
    "slowTestThreshold": 150
  }
}
```

### Plugins

The Cypress plugins file runs in Node environment before the browser running a
spec file launches, giving you the most flexibility to set the configuration
values. This enables you to do things like:

- Use `fs` and read off configuration values and dynamically change them.
- Edit the list of browsers found by default by Cypress
- Set config values by reading any custom environment variables

While this may take a bit more work than other options - it yields you the most
amount of flexibility and the ability to manage configuration however you'd
like.

```js
// cypress/plugins/index.js
module.exports = (on, config) => {
  // modify the config values
  config.defaultCommandTimeout = 10000

  // read an environment variable and
  // pass its value to the specs
  config.env.userName = process.env.TEST_USER || 'Joe'
  // the specs will be able to access the above value
  // by using Cypress.env('userName')

  // IMPORTANT return the updated config object
  return config
}
```

We've fully documented how to set the configuration values from plugin file
[here](/api/plugins/configuration-api).

### Environment Variables

You can also use [environment variables](/guides/guides/environment-variables)
to override configuration values. This is especially useful in
[Continuous Integration](/guides/continuous-integration/introduction) or when
working locally. This gives you the ability to change configuration options
without modifying any code or build scripts.

By default, any environment variable that matches a corresponding configuration
key will override the configuration file (`cypress.json` by default) value.

```shell
export CYPRESS_VIEWPORT_WIDTH=800
```

```shell
export CYPRESS_VIEWPORT_HEIGHT=600
```

We automatically normalize both the key and the value. Cypress will _strip off_
the `CYPRESS_`, camelcase any keys and automatically convert values into
`Number` or `Boolean`. Make sure to prefix your environment variables with
`CYPRESS_` else they will be ignored.

#### Both options below are valid

```shell
export CYPRESS_pageLoadTimeout=100000
```

```shell
export CYPRESS_PAGE_LOAD_TIMEOUT=100000
```

<Alert type="warning">

Environment variables that do not match configuration keys will instead be set
as regular environment variables for use in your tests with `Cypress.env()`.

You can
[read more about Environment Variables](/guides/guides/environment-variables).

</Alert>

## Test Configuration

We provide two options to override the configuration while your test are
running, `Cypress.config()` and suite-specific or test-specific configuration
overrides.

<Icon name="exclamation-triangle" color="red"></Icon> **Note:** The
configuration values below are all writeable and **can be changed** via per test
configuration. Any other configuration values are readonly and cannot be changed
at run time.

- `animationDistanceThreshold`
- `baseUrl`
- `blockHosts`
- `defaultCommandTimeout`
- `env` **note:** Provided environment variables will be merged with current
  environment variables.
- `execTimeout`
- `includeShadowDom`
- `keystrokeDelay`
- `numTestsKeptInMemory`
- `pageLoadTimeout`
- `redirectionLimit`
- `requestTimeout`
- `responseTimeout`
- `retries`
- `screenshotOnRunFailure`
- `scrollBehavior`
- `slowTestThreshold`
- `viewportHeight`
- `viewportWidth`
- `waitForAnimations`

#### `Cypress.config()`

You can also override configuration values within your test using
[`Cypress.config()`](/api/cypress-api/config).

This changes the configuration _for the remaining execution of the current spec
file_. The values will reset to the previous default values after the spec has
complete.

```javascript
Cypress.config('pageLoadTimeout', 100000)

Cypress.config('pageLoadTimeout') // => 100000
```

#### Test-specific Configuration

To apply specific Cypress [configuration](/guides/references/configuration)
values to a suite or test, pass a configuration object to the test or suite
function as the second argument.

The configuration values passed in will only take effect during the suite or
test where they are set. The values will then reset to the previous default
values after the suite or test is complete.

##### Syntax

```javascript
describe(name, config, fn)
context(name, config, fn)
it(name, config, fn)
specify(name, config, fn)
```

##### Suite configuration

If you want to target a suite of tests to run or be excluded when run in a
specific browser, you can override the `browser` configuration within the suite
configuration. The `browser` option accepts the same arguments as
[`Cypress.isBrowser()`](/api/cypress-api/isbrowser).

You can configure the number of times to retries a suite of tests if they fail
during `cypress run` and `cypress open` separately.

```js
describe(
  'login',
  {
    retries: {
      runMode: 3,
      openMode: 2,
    },
  },
  () => {
    it('should redirect unauthenticated user to sign-in page', () => {
      // ...
    })

    it('allows user to login', () => {
      // ...
    })
  }
)
```

##### Single test configuration

If you want to target a test to run or be excluded when run in a specific
browser, you can override the `browser` configuration within the test
configuration. The `browser` option accepts the same arguments as
[Cypress.isBrowser()](/api/cypress-api/isbrowser).

```js
it('Show warning outside Chrome', { browser: '!chrome' }, () => {
  cy.get('.browser-warning').should(
    'contain',
    'For optimal viewing, use Chrome browser'
  )
})
```

## Resolved Configuration

When you open a Cypress project, clicking on the **Settings** tab will display
the resolved configuration to you. This helps you to understand and see where
different values came from. Each set value is highlighted to show where the
value has been set via the following ways:

- Default value
- The [configuration file](/guides/references/configuration)
- The
  [Cypress environment file](/guides/guides/environment-variables#Option-2-cypress-env-json)
- System
  [environment variables](/guides/guides/environment-variables#Option-3-CYPRESS)
- [Command Line arguments](/guides/guides/command-line)
- [Plugins file](/api/plugins/configuration-api)

<DocsImage src="/img/guides/configuration/see-resolved-configuration.jpg" alt="See resolved configuration" ></DocsImage>

## Notes

### blockHosts

By passing a string or array of strings you can block requests made to one or
more hosts.

To see a working example of this please check out our
[Stubbing Google Analytics Recipe](/examples/examples/recipes#Stubbing-and-spying).

To block a host:

- <Icon name="check-circle" color="green"></Icon> Pass only the host
- <Icon name="check-circle" color="green"></Icon> Use wildcard `*` patterns
- <Icon name="check-circle" color="green"></Icon> Include the port other than
  `80` and `443`
- <Icon name="exclamation-triangle" color="red"></Icon> Do **NOT** include
  protocol: `http://` or `https://`

<Alert type="info">

Not sure what a part of the URL a host is?
[Use this guide as a reference.](https://nodejs.org/api/url.html#url_url_strings_and_url_objects)

When blocking a host, we use [`minimatch`](/api/utilities/minimatch) to check
the host. When in doubt you can test whether something matches yourself.

</Alert>

Given the following URLs:

```text
https://www.google-analytics.com/ga.js

http://localhost:1234/some/user.json
```

This would match the following blocked hosts:

```text
www.google-analytics.com
*.google-analytics.com
*google-analytics.com

localhost:1234
```

Because `localhost:1234` uses a port other than `80` and `443` it **must be
included**.

<Alert type="warning">

<strong class="alert-header">Subdomains</strong>

Be cautious for URL's which have no subdomain.

For instance given a URL: `https://google.com/search?q=cypress`

- <Icon name="check-circle" color="green"></Icon> Matches `google.com`
- <Icon name="check-circle" color="green"></Icon> Matches `*google.com`
- <Icon name="exclamation-triangle" color="red"></Icon> Does NOT match
  `*.google.com`

</Alert>

When Cypress blocks a request made to a matching host, it will automatically
send a `503` status code. As a convenience it also sets a
`x-cypress-matched-blocked-host` header so you can see which rule it matched.

<DocsImage src="/img/guides/references/v10/blocked-host.png" alt="Network tab of dev tools with analytics.js request selected and the response header highlighted " ></DocsImage>

### modifyObstructiveCode

With this option enabled - Cypress will search through the response streams
coming from your server on `.html` and `.js` files and replace code that matches
patterns commonly found in framebusting.

These script patterns are antiquated and deprecated security techniques to
prevent clickjacking and framebusting. They are a relic of the past and are no
longer necessary in modern browsers. However many sites and applications still
implement them.

These techniques prevent Cypress from working, and they can be safely removed
without altering any of your application's behavior.

Cypress modifies these scripts at the network level, and therefore there is a
tiny performance cost to search the response streams for these patterns.

You can turn this option off if the application or site you're testing **does
not** implement these security measures. Additionally it's possible that the
patterns we search for may accidentally rewrite valid JS code. If that's the
case, please disable this option.

### firefoxGcInterval

<Alert type="warning">

The following section only applies if you are using a version of Firefox older
than Firefox 80. `firefoxGcInterval` has no effect if you are using Firefox 80
or newer, since the garbage collection bug was fixed in Firefox 80. It is
recommended to upgrade your version of Firefox to avoid this workaround.

</Alert>

Firefox versions 79 and earlier have a
[bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1608501) where it does not
run its internal garbage collection (GC) fast enough, which can lead to
consuming all available system memory and crashing.

Cypress prevents Firefox from crashing by forcing Firefox to run its GC cleanup
routines between tests.

Running GC is an expensive and **blocking** routine. It adds significant time to
the overall run, and causes Firefox to "freeze" for the duration of GC cleanup.
This causes the browser not to respond to any user input.

Cypress runs GC cleanup during
[cypress run](/guides/guides/command-line#cypress-run) only because we don't
expect users to interact with the browser - since this is typically run in CI.
We've disabled running GC during
[cypress open](/guides/guides/command-line#cypress-open) because users typically
interact with the browser.

Because GC adds additional time to the overall run, we've added the amount of
time this routine has taken to the bottom of the Command Log in the Test Runner.

<DocsImage src="/img/guides/configuration/firefox-gc-interval-in-command-log.jpg" alt="GC duration shown"></DocsImage>

#### Configuration

You can control how often GC cleanup runs via the `firefoxGcInterval`
configuration value.

`firefoxGcInterval` controls whether Cypress forces Firefox to run GC cleanup
and how frequently.

By default, we force GC cleanup between every test during
[cypress run](/guides/guides/command-line#cypress-run), but do not run any GC
cleanup during [cypress open](/guides/guides/command-line#cypress-open) using
the configuration value below:

```json
{
  "firefoxGcInterval": {
    "runMode": 1,
    "openMode": null
  }
}
```

You can override how often Cypress runs GC cleanup by setting the
`firefoxGcInterval` config value to:

- `null`, to disable it for both
  [cypress run](/guides/guides/command-line#cypress-run) and
  [cypress open](/guides/guides/command-line#cypress-open)
- a `number`, which sets the interval for both
  [cypress run](/guides/guides/command-line#cypress-run) and
  [cypress open](/guides/guides/command-line#cypress-open)
- an `object` to set different intervals for each mode

**Examples**

Turn off GC cleanup all modes

```json
{
  "firefoxGcInterval": null
}
```

Run GC cleanup before every other test during
[cypress run](/guides/guides/command-line#cypress-run) and
[cypress open](/guides/guides/command-line#cypress-open)

```json
{
  "firefoxGcInterval": 2
}
```

Run GC cleanup before every 3rd test during
[cypress run](/guides/guides/command-line#cypress-run) and disable running GC
cleanup during [cypress open](/guides/guides/command-line#cypress-open).

```json
{
  "firefoxGcInterval": {
    "runMode": 3,
    "openMode": null
  }
}
```

### isInteractive

You can open Cypress in the interactive mode via the `cypress open` command, and
in run mode via the `cypress run` command. To detect the mode from your test
code you can query the `isInteractive` property on
[Cypress.config](/api/cypress-api/config).

```javascript
if (Cypress.config('isInteractive')) {
  // interactive "cypress open" mode!
} else {
  // "cypress run" mode
}
```

### Intelligent Code Completion

IntelliSense is available for Cypress while editing your configuration file.
[Learn how to set up Intelligent Code Completion.](/guides/tooling/IDE-integration#Intelligent-Code-Completion)

## Common problems

#### <Icon name="angle-right"></Icon> `baseUrl` is not set

Make sure you do not accidentally place the <code>baseUrl</code> or another
top-level config variable into the <code>env</code> block. The following
configuration is <i>incorrect</i> and WILL NOT WORK:

```javascript
// ⛔️ DOES NOT WORK
{
  "env": {
    "baseUrl": "http://localhost:3030",
    "FOO": "bar"
  }
}
```

Solution: place the `baseUrl` property at the top level, outside the `env`
object.

```javascript
// ✅ THE CORRECT WAY
{
  "baseUrl": "http://localhost:3030",
  "env": {
    "FOO": "bar"
  }
}
```

You can also find a few tips on setting the `baseUrl` in this
[short video](https://www.youtube.com/watch?v=f5UaXuAc52c).

#### <Icon name="angle-right"></Icon> Test files not found when using `spec` parameter

When using the `--spec <path or mask>` argument, make it relative to the
project's folder. If the specs are still missing, run Cypress with
[DEBUG logs](/guides/references/troubleshooting#Print-DEBUG-logs) with the
following setting to see how the Test Runner is looking for spec files:

```shell
DEBUG=cypress:cli,cypress:server:specs
```

## History

| Version                                       | Changes                                                 |
| --------------------------------------------- | ------------------------------------------------------- |
| [10.0.0](/guides/references/changelog#10-0-0) | Added page due to deprecation of `cypress.json` file    |
| [8.7.0](/guides/references/changelog#8-7-0)   | Added `slowTestThreshold` option                        |
| [8.0.0](/guides/references/changelog#8-0-0)   | Added `clientCertificates` option                       |
| [7.0.0](/guides/references/changelog#7-0-0)   | Added `e2e` and `component` options.                    |
| [7.0.0](/guides/references/changelog#7-0-0)   | Added `redirectionLimit` option.                        |
| [6.1.0](/guides/references/changelog#6-1-0)   | Added `scrollBehavior` option.                          |
| [5.2.0](/guides/references/changelog#5-2-0)   | Added `includeShadowDom` option.                        |
| [5.0.0](/guides/references/changelog#5-0-0)   | Added `retries` configuration.                          |
| [5.0.0](/guides/references/changelog#5-0-0)   | Renamed `blacklistHosts` configuration to `blockHosts`. |
| [4.1.0](/guides/references/changelog#4-12-0)  | Added `screenshotOnRunFailure` configuration.           |
| [4.0.0](/guides/references/changelog#4-0-0)   | Added `firefoxGcInterval` configuration.                |
| [3.5.0](/guides/references/changelog#3-5-0)   | Added `nodeVersion` configuration.                      |

## See also

- [Cypress.config()](/api/cypress-api/config) and
  [Cypress.env()](/api/cypress-api/env)
- [Environment variables](/guides/guides/environment-variables)
- [Environment Variables recipe](/examples/examples/recipes#Fundamentals)
- [Extending the Cypress Config File](https://www.cypress.io/blog/2020/06/18/extending-the-cypress-config-file/)
  blog post and
  [@bahmutov/cypress-extends](https://github.com/bahmutov/cypress-extends)
  package.
- Blog post
  [Keep passwords secret in E2E tests](https://glebbahmutov.com/blog/keep-passwords-secret-in-e2e-tests/)
