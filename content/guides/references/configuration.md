---
title: Configuration
---

<Alert type="warning">

This guide is for Cypress 10 and the new JavaScript configuration file format.

If you are on an older version of Cypress that uses `cypress.json`, please see
the [legacy configuration](/guides/references/legacy-configuration) guide.

For more info on upgrading configuration to Cypress 10, see the
[migration guide](/guides/references/migration-guide#Migrating-to-Cypress-version-10-0).

</Alert>

## Configuration File

Launching Cypress for the first time, you will be guided through a wizard that
will create a Cypress configuration file for you. This file will be
`cypress.config.js` for JavaScript apps or `cypress.config.ts` for
[TypeScript](/guides/tooling/typescript-support) apps. This file is used to
store any configuration specific to Cypress.

Cypress additionally supports config files with `.mjs` or `.cjs` extensions.

Using a `.mjs` file will allow you to use
[ESM Module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
syntax in your config without the need of a transpiler step.

A '.cjs' file uses the [CommonJS](https://nodejs.org/api/modules.html) module
syntax, which is the default for JavaScript files. All JavaScript config
examples in our docs use the CommonJS format.

If you [configure your tests to record](/guides/dashboard/projects#Setup) the
results to the [Cypress Dashboard](https://on.cypress.io/dashboard-introduction)
the `projectId` will be stored in the config file as well.

## Intelligent Code Completion

The `defineConfig` helper function is exported by Cypress, and it provides
automatic code completion for configuration in many popular code editors. While
it's not strictly necessary for Cypress to parse your configuration, we
recommend wrapping your config object with `defineConfig()` like this:

:::cypress-config-example{noJson}

```js
{
  e2e: {
    baseUrl: 'http://localhost:1234'
  }
}
```

:::

## Options

The default behavior of Cypress can be modified by supplying any of the
following configuration options. Below is a list of available options and their
default values.

### Global

<!-- prettier-ignore-start -->

| Option                 | Default                           | Description                                                                                                                                                                                  |
| ---------------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `clientCertificates`   | `[]`                              | An optional array of [client certificates](/guides/references/client-certificates).                                                                                                          |
| `env`                  | `{}`                              | Any values to be set as [environment variables](/guides/guides/environment-variables).                                                                                                       |
| `includeShadowDom`     | `false`                           | Whether to traverse shadow DOM boundaries and include elements within the shadow DOM in the results of query commands (e.g. [`cy.get()`](/api/commands/get)).                                |
| `numTestsKeptInMemory` | `50`                              | The number of tests for which snapshots and command data are kept in memory. Reduce this number if you are experiencing high memory consumption in your browser during a test run.           |
| `port`                 | `null`                            | Port used to host Cypress. Normally this is a randomly generated port.                                                                                                                       |
| `redirectionLimit`     | `20`                              | The number of times that the application under test can redirect before erroring.                                                                                                            |
| `reporter`             | `spec`                            | The [reporter](/guides/tooling/reporters) used during `cypress run`.                                                                                                                         |
| `reporterOptions`      | `null`                            | The [reporter options](/guides/tooling/reporters#Reporter-Options) used. Supported options depend on the reporter.                                                                           |
| `retries`              | `{ "runMode": 0, "openMode": 0 }` | The number of times to retry a failing test. Can be configured to apply to `cypress run` or `cypress open` separately. See [Test Retries](/guides/guides/test-retries) for more information. |
| `watchForFileChanges`  | `true`                            | Whether Cypress will watch and restart tests on test file changes.                                                                                                                           |

### Timeouts

<Alert type="success">

<strong class="alert-header">Core Concept</strong>

[Timeouts are a core concept](/guides/core-concepts/introduction-to-cypress#Timeouts)
you should understand well. The default values listed here are meaningful.

</Alert>

| Option                  | Default | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defaultCommandTimeout` | `4000`  | Time, in milliseconds, to wait until most DOM based commands are considered timed out.                                                                                                                                                                                                                                                                                                                                                                                             |
| `execTimeout`           | `60000` | Time, in milliseconds, to wait for a system command to finish executing during a [`cy.exec()`](/api/commands/exec) command.                                                                                                                                                                                                                                                                                                                                                        |
| `taskTimeout`           | `60000` | Time, in milliseconds, to wait for a task to finish executing during a [`cy.task()`](/api/commands/task) command.                                                                                                                                                                                                                                                                                                                                                                  |
| `pageLoadTimeout`       | `60000` | Time, in milliseconds, to wait for `page transition events` or [`cy.visit()`](/api/commands/visit), [`cy.go()`](/api/commands/go), [`cy.reload()`](/api/commands/reload) commands to fire their page `load` events. Network requests are limited by the underlying operating system, and may still time out if this value is increased.                                                                                                                                            |
| `requestTimeout`        | `5000`  | Time, in milliseconds, to wait for a request to go out in a [`cy.wait()`](/api/commands/wait) command.                                                                                                                                                                                                                                                                                                                                                                             |
| `responseTimeout`       | `30000` | Time, in milliseconds, to wait until a response in a [`cy.request()`](/api/commands/request), [`cy.wait()`](/api/commands/wait), [`cy.fixture()`](/api/commands/fixture), [`cy.getCookie()`](/api/commands/getcookie), [`cy.getCookies()`](/api/commands/getcookies), [`cy.setCookie()`](/api/commands/setcookie), [`cy.clearCookie()`](/api/commands/clearcookie), [`cy.clearCookies()`](/api/commands/clearcookies), and [`cy.screenshot()`](/api/commands/screenshot) commands. |

### Folders / Files

| Option              | Default               | Description                                                                                                                                           |
| ------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `downloadsFolder`   | `cypress/downloads`   | Path to folder where files downloaded during a test are saved.                                                                                        |
| `fileServerFolder`  | root project folder   | Path to folder where application files will attempt to be served from.                                                                                |
| `fixturesFolder`    | `cypress/fixtures`    | Path to folder containing fixture files (Pass `false` to disable).                                                                                    |
| `screenshotsFolder` | `cypress/screenshots` | Path to folder where screenshots will be saved from [`cy.screenshot()`](/api/commands/screenshot) command or after a test fails during `cypress run`. |
| `videosFolder`      | `cypress/videos`      | Path to folder where videos will be saved during `cypress run`.                                                                                       |

### Screenshots

| Option                   | Default               | Description                                                                                                                                           |
| ------------------------ | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `screenshotOnRunFailure` | `true`                | Whether Cypress will take a screenshot when a test fails during `cypress run`.                                                                        |
| `screenshotsFolder`      | `cypress/screenshots` | Path to folder where screenshots will be saved from [`cy.screenshot()`](/api/commands/screenshot) command or after a test fails during `cypress run`. |
| `trashAssetsBeforeRuns`  | `true`                | Whether Cypress will trash assets within the `downloadsFolder`, `screenshotsFolder`, and `videosFolder` before tests run with `cypress run`.          |

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
| `downloadsFolder`       | `cypress/downloads` | Path to folder where files downloaded during a test are saved.                                                                               |
| `trashAssetsBeforeRuns` | `true`              | Whether Cypress will trash assets within the `downloadsFolder`, `screenshotsFolder`, and `videosFolder` before tests run with `cypress run`. |

### Browser

| Option                  | Default                              | Description                                                                                                                                                                                                                                                                                                                                                        |
| ----------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `chromeWebSecurity`     | `true`                               | Whether to enable Chromium-based browser's Web Security for same-origin policy and insecure mixed content. [Read more about Web Security](/guides/guides/web-security).                                                                                                                                                                                            |
| `blockHosts`            | `null`                               | A String or Array of hosts that you wish to block traffic for. [Please read the notes for examples on using this.](#blockHosts)                                                                                                                                                                                                                                    |
| `modifyObstructiveCode` | `true`                               | Whether Cypress will search for and replace obstructive JS code in `.js` or `.html` files. [Please read the notes for more information on this setting.](#modifyObstructiveCode)                                                                                                                                                                                   |
| `userAgent`             | `null`                               | Enables you to override the default user agent the browser sends in all request headers. User agent values are typically used by servers to help identify the operating system, browser, and browser version. See [User-Agent MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent) for example user agent values.              |

### Viewport

| Option           | Default | Description                                                                                                                           |
| ---------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `viewportHeight` | `660`   | Default height in pixels for the application under tests' viewport. (Override with [`cy.viewport()`](/api/commands/viewport) command) |
| `viewportWidth`  | `1000`  | Default width in pixels for the application under tests' viewport. (Override with [`cy.viewport()`](/api/commands/viewport) command)  |

### Actionability

| Option                       | Default | Description                                                                                                                                                                      |
| ---------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `animationDistanceThreshold` | `5`     | The distance in pixels an element must exceed over time to be considered animating.                                                                                              |
| `waitForAnimations`          | `true`  | Whether to wait for elements to finish animating before executing commands.                                                                                                      |
| `scrollBehavior`             | `top`   | Viewport position to which an element should be scrolled before executing commands. Can be `'center'`, `'top'`, `'bottom'`, `'nearest'`, or `false`. `false` disables scrolling. |

For more information, see the docs on
[actionability](/guides/core-concepts/interacting-with-elements#Actionability).

### Node version

<Alert type="warning">

The `nodeVersion` configuration option is deprecated and will be removed in a
future version of Cypress. Please remove this option from your configuration
file.

</Alert>

| Option        | Default  | Description                                                                                                                                                                                                                                                                                                                                 |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nodeVersion` | `system` | Can be `system` or `bundled`. If set to `system`, Cypress will try to use the same Node version that launched Cypress to execute your [plugins](/guides/tooling/plugins-guide). If that can't be determined, Cypress will use the Node version bundled with Cypress. If set to `bundled` Cypress will use the version bundled with Cypress. |

The Node version is used in Cypress to:

- Build files in the
  [supportFile](#Folders-Files).
- Execute code in the config file.

<DocsImage src="/img/guides/configuration/test-runner-settings-nodejs-version.jpg" alt="Node version in Settings in Cypress"></DocsImage>

### Experiments

Configuration might include experimental options currently being tested. See
[Experiments](/guides/references/experiments) page.

## Testing Type-Specific Options

You can provide configuration options for either E2E or Component Testing by
creating `e2e` and `component` objects inside your Cypress configuration.

### e2e

These options are available to be specified inside the `e2e` configuration
object:

| Option               | Default                               | Description                                                                                                                                                                                           |
| -------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `baseUrl`            | `null`                                | URL used as prefix for [`cy.visit()`](/api/commands/visit) or [`cy.request()`](/api/commands/request) command's URL.                                                                                  |
| `setupNodeEvents`    | `null`                                | Function in which node events can be registered and config can be modified. Takes the place of the (removed) pluginFile option. [Please read the notes for examples on using this.](#setupNodeEvents) |
| `supportFile`        | `cypress/support/e2e.{js,jsx,ts,tsx}` | Path to file to load before spec files load. This file is compiled and bundled. (Pass `false` to disable)                                                                                             |
| `specPattern`        | `cypress/e2e/**/*.cy.{js,jsx,ts,tsx}` | A String or Array of glob patterns of the test files to load.                                                                                                                                         |
| `excludeSpecPattern` | `*.hot-update.js`                     | A String or Array of glob patterns used to ignore test files that would otherwise be shown in your list of tests. [Please read the notes on using this.](#excludeSpecPattern)                         |
| `experimentalSessionAndOrigin` | `false` | Enables cross-origin and improved session support, including the [`cy.origin()`](/api/commands/origin) and [`cy.session()`](/api/commands/session) commands. This enables `testIsolation=strict` by default. Only available in end-to-end testing. |    
| `slowTestThreshold`  | `10000`                               | Time, in milliseconds, to consider a test "slow" during `cypress run`. A slow test will display in orange text in the default reporter.                                                               |
| `testIsolation`        | `legacy`                         | The [test isolation level](/guides/core-concepts/writing-and-organizing-tests#Test-Isolation) applied to ensure a clean slate between tests. |

:::cypress-config-example{noJson}

```js
{
  e2e: {
    // e2e options here
  }
}
```

:::

### component

These options are available to be specified inside the `component` configuration
object:

| Option               | Default                                  | Description                                                                                                                                                                                      |
| -------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `devServer`          | `null`                                   | Required option used to configure the component testing dev server. [Please read the notes for examples on using this.](#devServer)                                              |
| `setupNodeEvents`    | `null`                                   | Function in which node events can be registered and config can be modified. Takes the place of the (removed) plugins file. [Please read the notes for examples on using this.](#setupNodeEvents) |
| `supportFile`        | `cypress/support/component.js`           | Path to file to load before spec files load. This file is compiled and bundled. (Pass `false` to disable)                                                                                        |
| `specPattern`        | `**/*.cy.{js,jsx,ts,tsx}`                | A glob pattern String or Array of glob pattern Strings of the spec files to load. <br><br>Note that any files found matching the `e2e.specPattern` value will be automatically **excluded.** |
| `excludeSpecPattern` | `['/snapshots/*', '/image_snapshots/*']` | A String or Array of glob patterns used to ignore spec files that would otherwise be shown in your list of specs. [Please read the notes on using this.](#excludeSpecPattern)                    |
`experimentalSingleTabRunMode`                | `false` | Run all specs in a single tab, instead of creating a new tab per spec. This can improve run mode performance, but can impact spec isolation and reliability on large test suites. This experiment currently only applies to Component Testing.     
| `slowTestThreshold`  | `250`                                    | Time, in milliseconds, to consider a test "slow" during `cypress run`. A slow test will display in orange text in the default reporter.                                                          |

:::cypress-config-example{noJson}

```js
{
  component: {
    // component options here
  }
}
```

:::

<!-- prettier-ignore-end -->

## Overriding Options

Cypress gives you the option to dynamically alter configuration options. This is
helpful when running Cypress in multiple environments and on multiple developer
machines.

### Overriding Individual Options

When running Cypress from the command line you can pass a `--config` flag to
override individual config options.

For example, to override `viewportWidth` and `viewportHeight`, you can run:

```shell
cypress run --browser firefox --config viewportWidth=1280,viewportHeight=720
```

### Specifying an Alternative Config File

In the Cypress CLI, you can change which config file Cypress will use with the
[`--config-file`](/guides/guides/command-line#cypress-open-config-file-lt-configuration-file-gt)
flag.

```shell
cypress run --config-file tests/cypress.config.js
```

See the [Command Line](/guides/guides/command-line) guide for more examples.

### Testing Type-Specific Overrides

In addition to setting
[Testing Type-Specific options](#Testing-Type-Specific-Options), you can
override other configuration options for either the
[E2E Testing](/guides/core-concepts/testing-types#What-is-E2E-Testing) or
[Component Testing](/guides/core-concepts/testing-types#What-is-Component-Testing).

For example:

:::cypress-config-example{noJson}

```js
{
  // These settings apply everywhere unless overridden
  defaultCommandTimeout: 5000,
  viewportWidth: 1000,
  viewportHeight: 600,
  // Viewport settings overridden for component tests
  component: {
    viewportWidth: 500
    viewportHeight: 500
  },
  // Command timeout overridden for E2E tests
  e2e: {
    defaultCommandTimeout: 10000
  }
}
```

:::

### Environment Variables

Configuration options can be overridden with
[environment variables](/guides/guides/environment-variables). This is
especially useful in
[Continuous Integration](/guides/continuous-integration/introduction) or when
working locally. This gives you the ability to change configuration options
without modifying any code or build scripts.

For example, these enviroment variables in the command line will override any
`viewportWidth` or `viewportHeight` options set in the Cypress configuration:

```shell
export CYPRESS_VIEWPORT_WIDTH=800
export CYPRESS_VIEWPORT_HEIGHT=600
```

See the
[Environment Variables](/guides/guides/environment-variables#Option-3-CYPRESS_)
guide for more examples.

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
- `testIsolation` - this option can only be overridden at the suite-specific
  override level
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

When you open a Cypress project, expanding the Project Settings panel under
**Settings** will display the resolved configuration to you. This helps you to
understand and see where different values came from. Each set value is
highlighted to show where the value has been set via the following ways:

- Default value
- [Cypress configuration file](/guides/references/configuration)
- The
  [Cypress environment file](/guides/guides/environment-variables#Option-2-cypress-env-json)
- System
  [environment variables](/guides/guides/environment-variables#Option-3-CYPRESS)
- [Command Line arguments](/guides/guides/command-line)
- [setupNodeEvents](#setupNodeEvents)

<DocsImage src="/img/guides/configuration/v10/see-resolved-configuration.png" alt="See resolved configuration"></DocsImage>

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
`x-cypress-matched-blacklisted-host` header so you can see which rule it
matched.

<DocsImage src="/img/guides/references/v10/blocked-host.png" alt="Network tab of dev tools with analytics.js request selected and the response header highlighted"></DocsImage>

### devServer

The `devServer` option is required for [`component`](#component) testing, and
allows you to register a component testing dev server.

Typically, you will specify a `framework` and `bundler` options in `devServer`
for your framework and UI library like so:

:::cypress-config-example{noJson}

```js
{
  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack'
    },
  },
}
```

:::

See
[Framework Configuration](/guides/component-testing/component-framework-configuration)
guide for more info on all the available `framework` and `bundler` options, as
well as additional configuration options.

#### Custom Dev Server

It is possible to customize the devServer and provide your own function for
custom or advanced setups.

The devServer function receives a `cypressConfig` argument:

:::cypress-config-example{noJson}

```js
{
  component: {
    devServer(cypressConfig) {
      // return dev server instance or a promise that resolves to
      // a dev server instance here
    },
  },
}
```

:::

See the
[Custom Dev Server](/guides/component-testing/component-framework-configuration)
guide for more info.

### excludeSpecPattern

Cypress uses `minimatch` with the options: `{dot: true, matchBase: true}`. We
suggest using [https://globster.xyz](https://globster.xyz) to test what files
would match.

The `**/node_modules/**` pattern is automatically added to `specExcludePattern`,
and does not need to be specified (and can't be overridden). See [`e2e`](#e2e)
or [`component`](#component) testing-specific options.

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
time this routine has taken to the bottom of the Cypress Command Log.

<DocsImage src="/img/guides/configuration/firefox-gc-interval-in-command-log.jpg" alt="GC duration shown"></DocsImage>

#### Configuration

You can control how often GC cleanup runs via the `firefoxGcInterval`
configuration value.

`firefoxGcInterval` controls whether Cypress forces Firefox to run GC cleanup
and how frequently.

By default, we force GC cleanup between every test during
[cypress run](/guides/guides/command-line#cypress-run), but do not run any GC
cleanup during [cypress open](/guides/guides/command-line#cypress-open) using
the configuration below:

:::cypress-config-example{noJson}

```js
{
  firefoxGcInterval: {
    runMode: 1,
    openMode: null
  }
}
```

:::

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

:::cypress-config-example{noJson}

```js
{
  firefoxGcInterval: null
}
```

:::

Run GC cleanup before every other test during
[cypress run](/guides/guides/command-line#cypress-run) and
[cypress open](/guides/guides/command-line#cypress-open)

:::cypress-config-example{noJson}

```js
{
  firefoxGcInterval: 2
}
```

:::

Run GC cleanup before every 3rd test during
[cypress run](/guides/guides/command-line#cypress-run) and disable running GC
cleanup during [cypress open](/guides/guides/command-line#cypress-open).

:::cypress-config-example{noJson}

```js
{
  firefoxGcInterval: {
    runMode: 3,
    openMode: null
  }
}
```

:::

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

### setupNodeEvents

The `setupNodeEvents` function allows you to tap into, modify, or extend the
internal behavior of Cypress using the [`on`](/api/plugins/writing-a-plugin#on)
and [`config`](/api/plugins/writing-a-plugin#config) arguments, and is valid as
an [`e2e`](#e2e) or [`component`](#component) testing specific option.

<Alert type="info">

This function was added in Cypress version `10.0.0` to replace the deprecated
[plugins file](/guides/references/legacy-configuration#Plugins).

</Alert>

:::cypress-config-example{noJson}

```js
{
  e2e: {
    setupNodeEvents(on, config) {
      // e2e testing node events setup code
    },
  },
  component: {
    setupNodeEvents(on, config) {
      // component testing node events setup code
    },
  },
}
```

:::

See the [plugins guide](/guides/tooling/plugins-guide) for more information.

## Common problems

#### <Icon name="angle-right"></Icon> `baseUrl` is not set

Make sure you do not accidentally place the `baseUrl` config option into the
`env` object. The following configuration is _incorrect_ and will not work:

:::cypress-config-example{noJson}

```js
{
  // ⛔️ DOES NOT WORK
  env: {
    baseUrl: 'http://localhost:3030',
    FOO: 'bar'
  }
}
```

:::

Solution: place the `baseUrl` property outside the `env` object and inside the
[e2e](/guides/references/configuration#e2e) testing-type specific object.

:::cypress-config-example{noJson}

```js
{
  // ✅ THE CORRECT WAY
  env: {
    FOO: 'bar'
  },
  e2e: {
    baseUrl: 'http://localhost:3030',
  }
}
```

:::

You can also find a few tips on setting the `baseUrl` in this
[short video](https://www.youtube.com/watch?v=f5UaXuAc52c).

#### <Icon name="angle-right"></Icon> Test files not found when using `spec` parameter

When using the `--spec <path or mask>` argument, make it relative to the
project's folder. If the specs are still missing, run Cypress with
[DEBUG logs](/guides/references/troubleshooting#Print-DEBUG-logs) with the
following setting to see how Cypress is looking for spec files:

```shell
DEBUG=cypress:cli,cypress:server:specs
```

## History

| Version                                       | Changes                                                                               |
| --------------------------------------------- | ------------------------------------------------------------------------------------- |
| [10.4.0](/guides/references/changelog#10-4-0) | Added `e2e.testIsolation` option.                                                     |
| [10.0.0](/guides/references/changelog#10-0-0) | Reworked page to support new `cypress.config.js` and deprecated `cypress.json` files. |
| [8.7.0](/guides/references/changelog#8-7-0)   | Added `slowTestThreshold` option.                                                     |
| [8.0.0](/guides/references/changelog#8-0-0)   | Added `clientCertificates` option.                                                    |
| [7.0.0](/guides/references/changelog#7-0-0)   | Added `e2e` and `component` options.                                                  |
| [7.0.0](/guides/references/changelog#7-0-0)   | Added `redirectionLimit` option.                                                      |
| [6.1.0](/guides/references/changelog#6-1-0)   | Added `scrollBehavior` option.                                                        |
| [5.2.0](/guides/references/changelog#5-2-0)   | Added `includeShadowDom` option.                                                      |
| [5.0.0](/guides/references/changelog#5-0-0)   | Added `retries` configuration.                                                        |
| [5.0.0](/guides/references/changelog#5-0-0)   | Renamed `blacklistHosts` configuration to `blockHosts`.                               |
| [4.1.0](/guides/references/changelog#4-12-0)  | Added `screenshotOnRunFailure` configuration.                                         |
| [4.0.0](/guides/references/changelog#4-0-0)   | Added `firefoxGcInterval` configuration.                                              |
| [3.5.0](/guides/references/changelog#3-5-0)   | Added `nodeVersion` configuration.                                                    |

## See also

- [Cypress.config()](/api/cypress-api/config) and
  [Cypress.env()](/api/cypress-api/env)
- [Environment variables](/guides/guides/environment-variables)
- [Environment Variables recipe](/examples/examples/recipes#Fundamentals)
- [Extending the Cypress Configuration File](https://www.cypress.io/blog/2020/06/18/extending-the-cypress-config-file/)
  blog post and
  [@bahmutov/cypress-extends](https://github.com/bahmutov/cypress-extends)
  package.
- Blog post
  [Keep passwords secret in E2E tests](https://glebbahmutov.com/blog/keep-passwords-secret-in-e2e-tests/)
