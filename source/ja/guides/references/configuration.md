---
title: 設定
---

When a project is added to Cypress, a `cypress.json` file is created in the project. This file is used to store the `projectId` ({% url 'after configuring your tests to record' dashboard-service#Setup %}) and any configuration values you supply.

```json
{
  "projectId": "jd90q7"
}
```

# Options

The default behavior of Cypress can be modified by supplying any of the following configuration options. Below is a list of available options and their default values.

## Global

Option | Default | Description
----- | ---- | ----
`baseUrl` | `null` | URL used as prefix for {% url `cy.visit()` visit %} or {% url `cy.request()` request %} command's URL
`env` | `{}` | Any values to be set as {% url 'environment variables' environment-variables %}
`ignoreTestFiles` | `*.hot-update.js` | A String or Array of glob patterns used to ignore test files that would otherwise be shown in your list of tests. Cypress uses `minimatch` with the options: `{dot: true, matchBase: true}`. We suggest using {% url "http://globtester.com" http://globtester.com %} to test what files would match.
`numTestsKeptInMemory` | `50` | The number of tests for which snapshots and command data are kept in memory. Reduce this number if you are experiencing high memory consumption in your browser during a test run.
`port` | `null` | Port used to host Cypress. Normally this is a randomly generated port
`reporter` | `spec` | The {% url 'reporter' reporters %} used during `cypress run`
`reporterOptions` | `null` | The {% url 'reporter options' reporters#Reporter-Options %} used. Supported options depend on the reporter.
`testFiles` | `**/*.*` | A String glob pattern of the test files to load
`watchForFileChanges` | `true` | Whether Cypress will watch and restart tests on test file changes

## Timeouts

{% note success Core Concept %}
{% url 'Timeouts are a core concept' introduction-to-cypress#Timeouts %} you should understand well. The default values listed here are meaningful.
{% endnote %}

Option | Default | Description
----- | ---- | ----
`defaultCommandTimeout` | `4000` | Time, in milliseconds, to wait until most DOM based commands are considered timed out
`execTimeout` | `60000` | Time, in milliseconds, to wait for a system command to finish executing during a {% url `cy.exec()` exec %} command
`taskTimeout` | `60000` | Time, in milliseconds, to wait for a task to finish executing during a {% url `cy.task()` task %} command
`pageLoadTimeout` | `60000` | Time, in milliseconds, to wait for `page transition events` or {% url `cy.visit()` visit %}, {% url `cy.go()` go %}, {% url `cy.reload()` reload %} commands to fire their page `load` events. Network requests are limited by the underlying operating system, and may still time out if this value is increased.
`requestTimeout` | `5000` | Time, in milliseconds, to wait for an XHR request to go out in a {% url `cy.wait()` wait %} command
`responseTimeout` | `30000` | Time, in milliseconds, to wait until a response in a {% url `cy.request()` request %}, {% url `cy.wait()` wait %}, {% url `cy.fixture()` fixture %}, {% url `cy.getCookie()` getcookie %}, {% url `cy.getCookies()` getcookies %}, {% url `cy.setCookie()` setcookie %}, {% url `cy.clearCookie()` clearcookie %}, {% url `cy.clearCookies()` clearcookies %}, and {% url `cy.screenshot()` screenshot %} commands

## Folders / Files

Option | Default | Description
----- | ---- | ----
`fileServerFolder`    | root project folder    |Path to folder where application files will attempt to be served from
`fixturesFolder`    | `cypress/fixtures`    | Path to folder containing fixture files (Pass `false` to disable)
`integrationFolder` | `cypress/integration` | Path to folder containing integration test files
`pluginsFile` | `cypress/plugins/index.js` | Path to plugins file. (Pass `false` to disable)
`screenshotsFolder`     | `cypress/screenshots`     | Path to folder where screenshots will be saved from {% url `cy.screenshot()` screenshot %} command or after a test fails during `cypress run`
`supportFile` | `cypress/support/index.js` | Path to file to load before test files load. This file is compiled and bundled. (Pass `false` to disable)
`videosFolder`     | `cypress/videos`     | Path to folder where videos will be saved during `cypress run`

## Screenshots

Option | Default | Description
----- | ---- | ----
`screenshotsFolder`     | `cypress/screenshots`     | Path to folder where screenshots will be saved from {% url `cy.screenshot()` screenshot %} command or after a test fails during `cypress run`
`trashAssetsBeforeRuns` | `true` | Whether Cypress will trash assets within the `screenshotsFolder` and `videosFolder` before tests run with `cypress run`.

For more options regarding screenshots, view the {% url 'Cypress.Screenshot API' screenshot-api %}.

## Videos

Option | Default | Description
----- | ---- | ----
`trashAssetsBeforeRuns` | `true` | Whether Cypress will trash assets within the `screenshotsFolder` and `videosFolder` before tests run with `cypress run`.
`videoCompression` | `32` | The quality setting for the video compression, in Constant Rate Factor (CRF). The value can be `false` to disable compression or a value between `0` and `51`, where a lower value results in better quality (at the expense of a higher file size).
`videosFolder`     | `cypress/videos` | Where Cypress will automatically save the video of the test run when tests run with `cypress run`.
`video`     | `true`     | Whether Cypress will capture a video of the tests run with `cypress run`.
`videoUploadOnPasses`     | `true`     | Whether Cypress will process, compress, and upload videos to the {% url "Dashboard" dashboard-service %} even when all tests in a spec file are passing. This only applies when recording your runs to the Dashboard. Turn this off if you'd like to only upload the spec file's video when there are failing tests.

## Browser

Option | Default | Description
----- | ---- | ----
`chromeWebSecurity`    | `true`    | Whether Chrome Web Security for `same-origin policy` and `insecure mixed content` is enabled. {% url 'Read more about this here' web-security %}
`userAgent` | `null` | Enables you to override the default user agent the browser sends in all request headers. User agent values are typically used by servers to help identify the operating system, browser, and browser version. See {% url "User-Agent MDN Documentation" https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent %} for example user agent values.
`blacklistHosts` | `null` | A String or Array of hosts that you wish to block traffic for. {% urlHash 'Please read the notes for examples on using this.' blacklistHosts %}
`modifyObstructiveCode` | `true` | Whether Cypress will search for and replace obstructive JS code in `.js` or `.html` files. {% urlHash 'Please read the notes for more information on this setting.' modifyObstructiveCode %}

## Viewport

Option | Default | Description
----- | ---- | ----
`viewportHeight` | `660` | Default height in pixels for the application under tests' viewport (Override with {% url `cy.viewport()` viewport %} command)
`viewportWidth` | `1000` | Default width in pixels for the application under tests' viewport. (Override with {% url `cy.viewport()` viewport %} command)

## Animations

Option | Default | Description
----- | ---- | ----
`animationDistanceThreshold` | `5` | The distance in pixels an element must exceed over time to be considered animating
`waitForAnimations` | `true` | Whether to wait for elements to finish animating before executing commands

# Overriding Options

Cypress gives you the option to dynamically alter configuration values. This is helpful when running Cypress in multiple environments and on multiple developer machines.

This gives you the option to do things like override the `baseUrl` or environment variables.

## Command Line

When {% url 'running Cypress from the Command Line' command-line %} you can pass a `--config` flag.

**Examples:**

```shell
cypress open --config watchForFileChanges=false,waitForAnimations=false
```

```shell
cypress run --config integrationFolder=tests,fixturesFolder=false
```

```shell
cypress run --record --config viewportWidth=1280,viewportHeight=720
```

## Plugins

As of {% url `1.2.0` changelog#1-2-0 %} you can programmatically modify configuration values using Node code. This enables you to do things like use `fs` and read off configuration values and dynamically change them.

While this may take a bit more work than other options - it yields you the most amount of flexibility and the ability to manage configuration however you'd like.

{% url "We've fully documented how to do this here." configuration-api %}

## Environment Variables

You can also use {% url 'environment variables' environment-variables %} to override configuration values. This is especially useful in {% url 'Continuous Integration' continuous-integration %} or when working locally. This gives you the ability to change configuration options without modifying any code or build scripts.

By default, any environment variable that matches a corresponding configuration key will override the `cypress.json` value.

```shell
export CYPRESS_VIEWPORT_WIDTH=800
```

```shell
export CYPRESS_VIEWPORT_HEIGHT=600
```

We automatically normalize both the key and the value. Cypress will *strip off* the `CYPRESS_`, camelcase any keys and automatically convert values into `Number` or `Boolean`. Make sure to prefix your environment variables with `CYPRESS_` else they will be ignored.

**Both options below are valid**

```shell
export CYPRESS_pageLoadTimeout=100000
```

```shell
export CYPRESS_PAGE_LOAD_TIMEOUT=100000
```

{% note warning  %}
Environment variables that do not match configuration keys will instead be set as regular environment variables for use in your tests with `Cypress.env()`.

You can {% url 'read more about Environment Variables' environment-variables %}.
{% endnote %}

## `Cypress.config()`

You can also override configuration values within your test using {% url `Cypress.config()` config %}.

{% note warning Scope %}
Configuration set using `Cypress.config` _is only in scope for the current spec file._
{% endnote %}

```javascript
Cypress.config('pageLoadTimeout', 100000)

Cypress.config('pageLoadTimeout') // => 100000
```

# Resolved Configuration

When you open a Cypress project, clicking on the *Settings* tab will display the resolved configuration to you. This makes it easy to understand and see where different values came from.

{% imgTag /img/guides/configuration/see-resolved-configuration.jpg "See resolved configuration" %}

# Notes

## blacklistHosts

By passing a string or array of strings you can block requests made to one or more hosts.

To see a working example of this please check out our {% url 'Stubbing Google Analytics Recipe' recipes#Stubbing-and-spying %}.

To blacklist a host:

- {% fa fa-check-circle green %} Pass only the host
- {% fa fa-check-circle green %} Use wildcard `*` patterns
- {% fa fa-check-circle green %} Include the port other than `80` and `443`
- {% fa fa-exclamation-triangle red %} Do **NOT** include protocol: `http://` or `https://`

{% note info %}
Not sure what a part of the URL a host is? {% url 'Use this guide as a reference.' https://nodejs.org/api/url.html#url_url_strings_and_url_objects %}

When blacklisting a host, we use {% url `minimatch` minimatch %} to check the host. When in doubt you can test whether something matches yourself.
{% endnote %}

Given the following URLs:

```text
https://www.google-analytics.com/ga.js

http://localhost:1234/some/user.json
```

This would match the following blacklisted hosts:

```text
www.google-analytics.com
*.google-analytics.com
*google-analytics.com

localhost:1234
```

Because `localhost:1234` uses a port other than `80` and `443` it **must be included**.

{% note warning "Subdomains" %}
Be cautious for URL's which have no subdomain.

For instance given a URL: `https://google.com/search?q=cypress`

- {% fa fa-check-circle green %} Matches `google.com`
- {% fa fa-check-circle green %} Matches `*google.com`
- {% fa fa-exclamation-triangle red %} Does NOT match `*.google.com`
{% endnote %}

When Cypress blocks a request made to a matching host, it will automatically send a `503` status code. As a convenience it also sets a `x-cypress-matched-blacklist-host` header so you can see which rule it matched.

{% imgTag /img/guides/blacklist-host.png "Network tab of dev tools with analytics.js request selected and the response header 'x-cypress-matched-blacklisted-host: www.google-analytics.com' highlighted " %}

## modifyObstructiveCode

With this option enabled - Cypress will search through the response streams coming from your server on `.html` and `.js` files and replace code that {% url 'matches the following patterns.' https://github.com/cypress-io/cypress/issues/886#issuecomment-364779884 %}

These script patterns are antiquated and deprecated security techniques to prevent clickjacking and framebusting. They are a relic of the past and are no longer necessary in modern browsers. However many sites and applications still implement them.

These techniques prevent Cypress from working, and they can be safely removed without altering any of your application's behavior.

Cypress modifies these scripts at the network level, and therefore there is a tiny performance cost to search the response streams for these patterns.

You can turn this option off if the application or site you're testing **does not** implement these security measures. Additionally it's possible that the patterns we search for may accidentally rewrite valid JS code. If that's the case, please disable this option.

## Intelligent Code Completion

IntelliSense is available for Cypress while editing your `cypress.json` file. {% url "Learn how to set up Intelligent Code Completion." intelligent-code-completion %}
