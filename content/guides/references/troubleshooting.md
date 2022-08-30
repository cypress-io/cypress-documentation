---
title: Troubleshooting
---

There are times when you will encounter errors or unexpected behavior with
Cypress itself. In this situation, we recommend checking these support resources
**first**.

## Support channels

- Connect with our community in [Discord](https://discord.gg/ncdA3Jz63n)
- Search existing [GitHub issues](https://github.com/cypress-io/cypress/issues)
- Search this documentation (search is in the top right) 😉
- Search [Stack Overflow](https://stackoverflow.com/questions/tagged/cypress)
  for relevant answers
- If your organization signs up for one of our
  [paid plans](https://www.cypress.io/pricing/), you can get dedicated email
  support, which gives you one-on-one help from our team.
- If you still haven't found a solution,
  [open an issue](https://github.com/cypress-io/cypress/issues/new/choose) _with
  a reproducible example_.

### Common GitHub issues

Below are some of common problem topics users experience with a link to the main
issue(s) and links to the open and closed issues in the topic. Maybe you can
find an open or closed issue matching your problem. Even open issues might
suggest a workaround or shed more information on the problem.

| Label                 | Description                                                       | Issues                                                                                                                                                                                                                                                               |
| --------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| browser detection     | Local browser is not detected                                     | [open](https://github.com/cypress-io/cypress/labels/topic%3A%20browser%20detection), [closed](https://github.com/cypress-io/cypress/issues?q=label%3A%22topic%3A+browser+detection%22+is%3Aclosed)                                                                   |
| cross-origin          | Getting cross-origin error                                        | [open](https://github.com/cypress-io/cypress/labels/topic%3A%20cross-origin%20%E2%A4%AD), [closed](https://github.com/cypress-io/cypress/issues?q=label%3A%22topic%3A+cross-origin+%E2%A4%AD%22+is%3Aclosed)                                                         |
| cy.request            | Issues related to [`cy.request()`](/api/commands/request) command | [open](https://github.com/cypress-io/cypress/labels/topic%3A%20cy.request), [closed](https://github.com/cypress-io/cypress/issues?q=label%3A%22topic%3A+cy.request%22+is%3Aclosed)                                                                                   |
| fixtures              | Fixture loading and usage                                         | [open](https://github.com/cypress-io/cypress/labels/topic%3A%20fixtures), [closed](https://github.com/cypress-io/cypress/issues?q=label%3A%22topic%3A+fixtures%22+is%3Aclosed)                                                                                       |
| hooks                 | Issues related to hooks                                           | [open](https://github.com/cypress-io/cypress/labels/topic%3A%20hooks%20%E2%86%AA), [closed](https://github.com/cypress-io/cypress/issues?q=label%3A%22topic%3A+hooks+%E2%86%AA%22+is%3Aclosed)                                                                       |
| iframes               | Working with iframes                                              | [open](https://github.com/cypress-io/cypress/labels/topic%3A%20iframes), [closed](https://github.com/cypress-io/cypress/issues?q=label%3A%22topic%3A+iframes%22+is%3Aclosed)                                                                                         |
| installation          | Cypress cannot be downloaded or installed                         | [open](https://github.com/cypress-io/cypress/labels/topic%3A%20installation), [closed](https://github.com/cypress-io/cypress/issues?q=label%3A%22topic%3A+installation%22+is%3Aclosed)                                                                               |
| network               | Controlling network requests                                      | [open](https://github.com/cypress-io/cypress/labels/topic%3A%20network), [closed](https://github.com/cypress-io/cypress/issues?q=label%3A%22topic%3A+network%22+is%3Aclosed)                                                                                         |
| performance           | Slow loading, slow network, etc                                   | [open](https://github.com/cypress-io/cypress/labels/type%3A%20performance%20%F0%9F%8F%83%E2%80%8D%E2%99%80%EF%B8%8F), [closed](https://github.com/cypress-io/cypress/issues?q=label%3A%22type%3A+performance+%F0%9F%8F%83%E2%80%8D%E2%99%80%EF%B8%8F%22+is%3Aclosed) |
| screenshots           | Taking image screenshots                                          | [open](https://github.com/cypress-io/cypress/labels/topic%3A%20screenshots%20%F0%9F%93%B8), [closed](https://github.com/cypress-io/cypress/issues?q=label%3A%22topic%3A+screenshots+%F0%9F%93%B8%22+is%3Aclosed)                                                     |
| scrolling             | Scrolling elements into view                                      | [open](https://github.com/cypress-io/cypress/labels/topic%3A%20scrolling%20%E2%86%95%EF%B8%8F), [closed](https://github.com/cypress-io/cypress/issues?q=label%3A%22topic%3A+scrolling+%E2%86%95%EF%B8%8F%22+is%3Aclosed)                                             |
| spec execution        | Running all or filtered specs                                     | [open](https://github.com/cypress-io/cypress/labels/topic%3A%20spec%20execution), [closed](https://github.com/cypress-io/cypress/issues?q=label%3A%22topic%3A+spec+execution%22+is%3Aclosed)                                                                         |
| test execution        | Running tests inside a single spec                                | [open](https://github.com/cypress-io/cypress/labels/topic%3A%20test%20execution), [closed](https://github.com/cypress-io/cypress/issues?q=label%3A%22topic%3A+test+execution%22+is%3Aclosed)                                                                         |
| TypeScript            | Transpiling or bundling TypeScript                                | [open](https://github.com/cypress-io/cypress/labels/topic%3A%20typescript), [closed](https://github.com/cypress-io/cypress/issues?q=label%3A%22topic%3A+typescript%22+is%3Aclosed)                                                                                   |
| video                 | Problems with video recordings                                    | [open](https://github.com/cypress-io/cypress/labels/topic%3A%20video%20%F0%9F%93%B9), [closed](https://github.com/cypress-io/cypress/issues?q=label%3A%22topic%3A+video+%F0%9F%93%B9%22+is%3Aclosed)                                                                 |
| file downloads        | File downloads are not working                                    | [open](https://github.com/cypress-io/cypress/labels/topic%3A%20downloads%20%E2%AC%87%EF%B8%8F), [closed](https://github.com/cypress-io/cypress/issues?q=label%3A%22topic%3A+downloads+%E2%AC%87%EF%B8%8F%22+is%3Aclosed)                                             |
| intercept             | Network stubbing using [cy.intercept](/api/commands/intercept)    | [open](https://github.com/cypress-io/cypress/labels/pkg%2Fnet-stubbing), [closed](https://github.com/cypress-io/cypress/issues?q=label%3Apkg%2Fnet-stubbing+is%3Aclosed)                                                                                             |
| SIG\* errors          | Crashes with errors like `SIGSEGV`                                | [open](https://github.com/cypress-io/cypress/labels/topic%3A%20SIG%20errors), [closed](https://github.com/cypress-io/cypress/issues?q=label%3A%22topic%3A+SIG+errors%22+is%3Aclosed)                                                                                 |
| environment variables | Parsing and using environment variables                           | [open](https://github.com/cypress-io/cypress/labels/topic%3A%20environment%20variables), [closed](https://github.com/cypress-io/cypress/issues?q=label%3A%22topic%3A+environment+variables%22+is%3Aclosed)                                                           |

## Isolate the Problem

When debugging a failing test, follow these general principles to isolate the
problem:

- Look at the
  [video recordings and screenshots](/guides/guides/screenshots-and-videos).
- Split large spec files into smaller ones.
- Split long tests into smaller tests.
- Run the same test using
  [--browser chrome](/guides/guides/command-line#cypress-run-browser-lt-browser-name-or-path-gt).
  The problem might be isolated to the Electron browser.
- If isolated to the Electron browser. Run the same tests in both Electron and
  Chrome, then compare the screenshots/videos. Look for and isolate any
  differences in the Command Log.

## Download specific Chrome version

The Chrome browser is evergreen - meaning it will automatically update itself,
sometimes causing a breaking change in your automated tests. We host
[chromium.cypress.io](https://chromium.cypress.io) with links to download a
specific released version of Chrome (dev, Canary and stable) for every platform.

## Clear Cypress cache

If you're having an issue during installation of Cypress, try removing the
contents of the Cypress cache.

This will clear out all installed versions of Cypress that may be cached on your
machine.

```shell
cypress cache clear
```

After running this command, you will need to run `cypress install` before
running Cypress again.

```shell
npm install cypress --save-dev
```

## Launching browsers

Cypress attempts to
[automatically find installed Chrome versions for you](/guides/guides/launching-browsers).
However, probing for browsers across different environments can be error-prone.
If Cypress cannot find a browser but you know you have it installed, there are
ways to ensure that Cypress can "see" it.

<Alert type="info">

<strong class="alert-header">Using the `--browser` command line
argument</strong>

You can also supply the `--browser` command line argument to launch a browser
from a known filesystem path to bypass browser auto detection.
[See 'Launching Browsers' for more information](/guides/guides/launching-browsers#Launching-by-a-path)

</Alert>

You can see the full list of found browsers and their properties within the
[resolved configuration](/guides/references/configuration#Resolved-Configuration)
in the **Settings** tab of Cypress.

Another way to log what is found by Cypress is to run Cypress with the
[DEBUG environment variable](#Print-DEBUG-logs) set to `cypress:launcher`. This
will print information about the found browsers and their properties to the
terminal.

**Tip:** use the [cypress info](/guides/guides/command-line#cypress-info)
command to see all locally detected browsers.

### Mac

On Mac, Cypress attempts to find installed browsers by their bundle identifier.
If this does not succeed, it will fall back to the Linux browser detection
method.

| Browser Name    | Expected Bundle Identifier | Expected Executable                   |
| --------------- | -------------------------- | ------------------------------------- |
| `chrome`        | `com.google.Chrome`        | `Contents/MacOS/Google Chrome`        |
| `chromium`      | `org.chromium.Chromium`    | `Contents/MacOS/Chromium`             |
| `chrome:canary` | `com.google.Chrome.canary` | `Contents/MacOS/Google Chrome Canary` |

For the current list, see
[packages/launcher](https://github.com/cypress-io/cypress/blob/develop/packages/launcher/lib/darwin/index.ts)
files.

### Linux

On Linux, Cypress scans your `PATH` for a number of different binary names. If
the browser you are trying to use does not exist under one of the expected
binary names, Cypress will not be able to find it.

| Browser Name    | Expected Binary Name(s)                              |
| --------------- | ---------------------------------------------------- |
| `chrome`        | `google-chrome`, `chrome`, or `google-chrome-stable` |
| `chromium`      | `chromium-browser` or `chromium`                     |
| `chrome:canary` | `google-chrome-canary`                               |

These binary names should work for most Linux distributions. If your
distribution packages browsers under a different binary name, you can add a
symlink using the expected binary name so that Cypress can detect it.

For example, if your distribution packages Google Chrome as `chrome`, you could
add a symlink to `google-chrome` like this:

```shell
sudo ln `which chrome` /usr/local/bin/google-chrome
```

### Windows

On Windows, Cypress scans the following locations to try to find each browser:

| Browser Name    | Expected Path                                                 |
| --------------- | ------------------------------------------------------------- |
| `chrome`        | `C:/Program Files (x86)/Google/Chrome/Application/chrome.exe` |
| `chromium`      | `C:/Program Files (x86)/Google/chrome-win32/chrome.exe`       |
| `chrome:canary` | `%APPDATA%/../Local/Google/Chrome SxS/Application/chrome.exe` |

For the current list, see
[packages/launcher](https://github.com/cypress-io/cypress/blob/develop/packages/launcher/lib/windows/index.ts)
files.

To make a browser installed at a different path be auto-detected, create a
symbolic link using `mklink` in the location that Cypress expects to find your
browser.

[Read more about creating symbolic links on Windows](https://www.howtogeek.com/howto/16226/complete-guide-to-symbolic-links-symlinks-on-windows-or-linux/)

Occasionally Cypress will have issues detecting the type of browser in Windows
environments. To manually detect the browser type, append the browser type to
the end of the path:

```shell
cypress open --browser C:/User/Application/browser.exe:chrome
```

## Allow the Cypress Chrome extension

Cypress utilizes a Chrome extension in order to run properly. If you or your
company block specific Chrome extensions, this may cause problems with running
Cypress. You will want to ask your administrator to allow the Cypress extension
ID below:

```sh
caljajdfkjjjdehjdoimjkkakekklcck
```

## Allow Cypress URLs on VPNs

To send the data and results of your tests to the
[Dashboard](https://on.cypress.io/dashboard-introduction), Cypress needs free
access to some URLs.

If you are running the tests from within a restrictive VPN you will need to
allow some URLs so that Cypress can have effective communication with the
Dashboard.

**The URLs are the following:**

- `https://api.cypress.io` - **Cypress API**
- `https://assets.cypress.io` - **Asset CDN** (Org logos, icons, videos,
  screenshots, etc.)
- `https://authenticate.cypress.io` - **Authentication API**
- `https://dashboard.cypress.io` - **Dashboard app**
- `https://docs.cypress.io` - **Cypress documentation**
- `https://download.cypress.io` - **CDN download of Cypress binary**
- `https://on.cypress.io` - **URL shortener for link redirects**

## Clear App Data

Cypress maintains some local application data in order to save user preferences
and more quickly start up. Sometimes this data can become corrupted. You may fix
an issue you have by clearing this app data.

### To clear App Data

1. Open Cypress via `cypress open`
2. Go to `File` -> `View App Data`
3. This will take you to the directory in your file system where your App Data
   is stored. If you cannot open Cypress, search your file system for a
   directory named `cy` whose content should look something like this:

```text
📂 production
  📄 all.log
  📁 browsers
  📁 bundles
  📄 cache
  📁 projects
  📁 proxy
  📄 state.json
```

4. Delete everything in the `cy` folder
5. Close Cypress and open it up again

## Print DEBUG logs

Cypress is built using the [debug](https://github.com/visionmedia/debug) module.
That means you can receive helpful debugging output by running Cypress with this
turned on. **Note:** you will see a LOT of messages when running with
`DEBUG=...` setting.

**On Mac or Linux:**

```shell
DEBUG=cypress:* cypress run
```

**On Windows:**

On Windows, you'll need to run the command in a command prompt terminal (not
PowerShell).

```shell
set DEBUG=cypress:*
cypress run
```

If you have issues with the logs not printing, it may be a permissions issue
with setting the environment variable in your terminal. You may need to run your
terminal in administrative mode or review your permission settings.

Read more
[about the CLI options here](/guides/guides/command-line#Debugging-commands) and
[Good Logging](https://glebbahmutov.com/blog/good-logging/) blog post.

### Detailed Logs

There are several levels of `DEBUG` messages

```shell
## prints very few top-level messages
DEBUG=cypress:server ...
## prints ALL messages from server package
DEBUG=cypress:server* ...
## prints messages only from config parsing
DEBUG=cypress:server:config ...
```

This allows you to isolate the problem a little better

### Log sources

Cypress is built from multiple packages, each responsible for its own logging:
server, reporter, driver, command line, etc. Each package writes debug logs
under a different source. Here are a few common log sources and when you might
want to enable them

| Set `DEBUG` to value            | To enable debugging                                                   |
| ------------------------------- | --------------------------------------------------------------------- |
| `cypress:cli`                   | The top-level command line parsing problems                           |
| `cypress:server:args`           | Incorrect parsed command line arguments                               |
| `cypress:server:specs`          | Not finding the expected specs                                        |
| `cypress:server:project`        | Opening the project                                                   |
| `cypress:server:browsers`       | Finding installed browsers                                            |
| `cypress:launcher`              | Launching the found browser                                           |
| `cypress:server:video`          | Video recording                                                       |
| `cypress:network:*`             | Adding network interceptors                                           |
| `cypress:net-stubbing*`         | Network interception in the proxy layer                               |
| `cypress:server:reporter`       | Problems with test reporters                                          |
| `cypress:server:preprocessor`   | Processing specs                                                      |
| `cypress:server:socket-e2e`     | Watching spec files                                                   |
| `cypress:server:task`           | Invoking the `cy.task()` command                                      |
| `cypress:server:socket-base`    | Debugging `cy.request()` command                                      |
| `cypress:webpack`               | Bundling specs using webpack                                          |
| `cypress:server:fixture`        | Loading fixture files                                                 |
| `cypress:server:record:ci-info` | Git commit and CI information when recording to the Cypress Dashboard |

You can combine several areas together using the comma character. For example,
to debug specs not being found, use:

```shell
## see how CLI arguments were parsed
## and how Cypress tried to locate spec files
DEBUG=cypress:cli,cypress:server:specs npx cypress run --spec ...
```

You can also exclude a log source using `-` character. For example, to see all
`cypress:server*` messages without noisy browser messages use:

```shell
DEBUG=cypress:server*,-cypress:server:browsers* npx cypress run
```

#### Debug log depth

Sometimes the logged object has deeply nested properties and is shown as
`[Object]` instead of the full serialization.

```shell
DEBUG=cypress:server:socket-base npx cypress run

cypress:server:socket-base backend:request { eventName: 'http:request', args:
  [ { url: 'http://localhost:7065/echo', method: 'POST', body: [Object], auth: [Object],
  json: true, encoding: 'utf8', gzip: true, timeout: 30000, followRedirect: true,
  failOnStatusCode: true, retryOnNetworkFailure: true,
  retryOnStatusCodeFailure: false } ] } +5ms
```

You can increase the printed object depth using the `DEBUG_DEPTH` environment
variable

```shell
DEBUG=cypress:server:socket-base DEBUG_DEPTH=3 npx cypress run

cypress:server:socket-base backend:request { eventName: 'http:request', args:
  [ { url: 'http://localhost:7065/echo', method: 'POST', body: { text: 'ping!' },
  auth: { username: 'jane.lane', password: 'password123' }, json: true, encoding: 'utf8',
  gzip: true, timeout: 30000, followRedirect: true, failOnStatusCode: true,
  retryOnNetworkFailure: true, retryOnStatusCodeFailure: false } ] } +4ms
```

#### 3rd party modules

Some 3rd party modules like
[@cypress/request](https://github.com/cypress-io/request) output additional log
messages by inspecting the `NODE_DEBUG` environment variable. For example to
debug the network interception and the requests made by the `@cypress/request`
use:

```shell
DEBUG=cypress:net-stubbing:server:intercept-request \
  NODE_DEBUG=request npx cypress run
```

### Debug logs in the browser

If the problem is seen during `cypress open` you can print debug logs in the
browser too. Open the browser's Developer Tools and set a `localStorage`
property:

```javascript
localStorage.debug = 'cypress*'

// to disable debug messages
delete localStorage.debug
```

Reload the browser and turn on 'Verbose' logs to see debug messages within the
Developer Tools console. You will only see the **cypress\:driver** package logs
that run in the browser, as you can see below.

<DocsImage src="/img/api/debug/debug-driver.jpg" alt="Debug logs in browser" ></DocsImage>

## Log memory and CPU usage

You can tell Cypress to log out a summary of the memory and CPU usage of itself
and any subprocesses at a regular interval by enabling the
`cypress:server:util:process_profiler` debug stream, like so:

**On Mac or Linux:**

```shell
DEBUG=cypress:server:util:process_profiler cypress run
```

**On Windows:**

```shell
set DEBUG=cypress:server:util:process_profiler
cypress run
```

In the resulting output, processes are grouped by their name.

<DocsImage src="/img/guides/troubleshooting/troubleshooting-cypress-process-profiler-cli.jpg" alt="Process printout of Cypress in CLI"></DocsImage>

By default, process information is collected and summarized is printed once
every 10 seconds. You can override this interval by setting the
`CYPRESS_PROCESS_PROFILER_INTERVAL` environment variable to the desired interval
in milliseconds.

You can also obtain more detailed per-process information by enabling the
verbose `cypress-verbose:server:util:process_profiler` debug stream.

## Disable the Command Log

In some cases the [Command Log](/guides/core-concepts/cypress-app#Command-Log),
responsible for displaying test commands, assertions, and statuses in the
Cypress Test Runner, may cause performance issues resulting in slower tests or
the browser crashing.

In order to isolate these issues, you can hide the Command Log by passing the
environment variable below during `cypress open` or `cypress run`.

```shell
CYPRESS_NO_COMMAND_LOG=1 cypress run
```

With this variable set, Cypress will skip rendering the Command Log entirely,
and perform none of the usual DOM updates to display information about commands
and statuses as the test runs.

**Note:** With this variable set, screenshots and videos will not include the
Command Log.

## Additional information

### Write command log to the terminal

You can include the plugin
[cypress-failed-log](https://github.com/bahmutov/cypress-failed-log) in your
tests. This plugin writes the list of Cypress commands to the terminal as well
as a JSON file if a test fails.

<DocsImage src="/img/api/debug/failed-log.png" alt="cypress-failed-log terminal output"></DocsImage>

## Hacking on Cypress

If you want to dive into Cypress and edit the code yourself, you can do that.
The Cypress code is open source and licensed under an
[MIT license](https://github.com/cypress-io/cypress/blob/develop/LICENSE). There
are a few tips on getting started that we've outlined below.

### Contribute

If you'd like to contribute directly to the Cypress code, we'd love to have your
help! Please check out our
[contributing guide](https://github.com/cypress-io/cypress/blob/develop/CONTRIBUTING.md)
to learn about the many ways you can contribute.

### Run Cypress by itself

Cypress comes with an npm CLI module that parses the arguments, starts the Xvfb
server (if necessary), and then opens Cypress.

Some common situations on why you would want to run Cypress by itself are to:

- debug Cypress not starting or hanging
- debug problems related to the way CLI arguments are parsed by the npm CLI
  module

Here is how you can launch Cypress directly without the npm CLI module. First,
find where the binary is installed using the
[cypress cache path](/guides/guides/command-line#cypress-cache-path) command.

For example, on a Linux machine:

```shell
npx cypress cache path
/root/.cache/Cypress
```

Second, try a smoke test that verifies that the application has all its required
dependencies present on the host machine:

```shell
/root/.cache/Cypress/3.3.1/Cypress/Cypress --smoke-test --ping=101
101
```

If there is a missing dependency, the application should print an error message.
You can see the Electron verbose log messages by setting an
[environment variable ELECTRON_ENABLE_LOGGING](https://www.electronjs.org/docs/api/command-line-switches):

```shell
ELECTRON_ENABLE_LOGGING=true DISPLAY=10.130.4.201:0 /root/.cache/Cypress/3.3.1/Cypress/Cypress --smoke-test --ping=101
[809:0617/151243.281369:ERROR:bus.cc(395)] Failed to connect to the bus: Failed to connect to socket /var/run/dbus/system_bus_socket: No such file or directory
101
```

If the smoke test fails to execute, check if a shared library is missing (a
common problem on Linux machines without all of the Cypress dependencies
present).

```shell
ldd /home/person/.cache/Cypress/3.3.1/Cypress/Cypress
  linux-vdso.so.1 (0x00007ffe9eda0000)
  libnode.so => /home/person/.cache/Cypress/3.3.1/Cypress/libnode.so (0x00007fecb43c8000)
  libpthread.so.0 => /lib/x86_64-linux-gnu/libpthread.so.0 (0x00007fecb41ab000)
  libgtk-3.so.0 => not found
  libgdk-3.so.0 => not found
  ...
```

**Tip:** use [Cypress Docker image](/examples/examples/docker) or install
dependencies by copying them from one of our official Docker images.

**Note:** verbose Electron logging might show warnings that still allow Cypress
to work normally. For example, Cypress opens normally despite the scary output
below:

```shell
ELECTRON_ENABLE_LOGGING=true DISPLAY=10.130.4.201:0 /root/.cache/Cypress/3.3.1/Cypress/Cypress
[475:0617/150421.326986:ERROR:bus.cc(395)] Failed to connect to the bus: Failed to connect to socket /var/run/dbus/system_bus_socket: No such file or directory
[475:0617/150425.061526:ERROR:bus.cc(395)] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[475:0617/150425.079819:ERROR:bus.cc(395)] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[475:0617/150425.371013:INFO:CONSOLE(73292)] "%cDownload the React DevTools for a better development experience: https://fb.me/react-devtools
You might need to use a local HTTP server (instead of file://): https://fb.me/react-devtools-faq", source: file:///root/.cache/Cypress/3.3.1/Cypress/resources/app/packages/desktop-gui/dist/app.js (73292)
```

You can also see verbose Cypress logs when running the Cypress binary

```shell
DEBUG=cypress* DISPLAY=10.130.4.201:0 /root/.cache/Cypress/3.3.1/Cypress/Cypress --smoke-test --ping=101
cypress:ts Running without ts-node hook in environment "production" +0ms
cypress:server:cypress starting cypress with argv [ '/root/.cache/Cypress/3.3.1/Cypress/Cypress', '--smoke-test', '--ping=101' ] +0ms
cypress:server:args argv array: [ '/root/.cache/Cypress/3.3.1/Cypress/Cypress', '--smoke-test', '--ping=101' ] +0ms
cypress:server:args argv parsed: { _: [ '/root/.cache/Cypress/3.3.1/Cypress/Cypress' ], smokeTest: true, ping: 101, cwd: '/root/.cache/Cypress/3.3.1/Cypress/resources/app/packages/server' } +7ms
cypress:server:args options { _: [ '/root/.cache/Cypress/3.3.1/Cypress/Cypress' ], smokeTest: true, ping: 101, cwd: '/root/.cache/Cypress/3.3.1/Cypress/resources/app/packages/server', config: {} } +2ms
cypress:server:args argv options: { _: [ '/root/.cache/Cypress/3.3.1/Cypress/Cypress' ], smokeTest: true, ping: 101, cwd: '/root/.cache/Cypress/3.3.1/Cypress/resources/app/packages/server', config: {}, pong: 101 } +1ms
cypress:server:appdata path: /root/.config/Cypress/cy/production +0ms
cypress:server:cypress starting in mode smokeTest +356ms
101
cypress:server:cypress about to exit with code 0 +4ms
```

If the smoke test does not show a specific error yet fails, try printing the
Electron crash stack to maybe pinpoint the problem better:

```shell
ELECTRON_ENABLE_STACK_DUMPING=1 npx cypress verify
...
Received signal 11 SEGV_MAPERR ffffffb27e8955bb
#0 0x55c6389f83d9 (/root/.cache/Cypress/3.8.2/Cypress/Cypress+0x35d13d8)
r8: 0000000000000000  r9: 00007ffcf0387c80 r10: 00007ffcf0387bd8 r11: 000000000000000e
r12: 00007ffcf0387d2c r13: 00007f3ea737b720 r14: ffffffb27e89558b r15: 00007f3ea8974200
di: 0000000000000000  si: 0000000000000020  bp: 0000000000000000  bx: 0000004f2f375580
dx: 0000000000000001  ax: 0000000000000030  cx: 0000000000000001  sp: 00007ffcf0387d00
ip: 00007f3ea89582dd efl: 0000000000010246 cgf: 002b000000000033 erf: 0000000000000005
trp: 000000000000000e msk: 0000000000000000 cr2: ffffffb27e8955bb
[end of stack trace]
Calling _exit(1). Core file will not be generated.
```

### Patch Cypress

Cypress comes with an npm CLI module that parses the arguments, starts the Xvfb
server (if necessary), and then opens Cypress.

If you're encountering a bug in the current version of Cypress, you can
implementing a temporary fix by patching Cypress in your own project. Here is an
example of how to do this.

1. Install [patch-package](https://github.com/ds300/patch-package).
2. Add a patch step to your CI configuration after installing your npm packages.

```yaml
- run: npm ci
- run: npx patch-package
```

Alternatively, you can apply the patch during a post-install phase. In your
`package.json`, for example, you could add the following:

```json
{
  "scripts": {
    "postinstall": "patch-package"
  }
}
```

3. Edit the line causing the problem _in your local node_modules folder_ within
   `node_modules/cypress`.
4. Run the `npx patch-package cypress` command. This command will create a new
   file `patches/cypress+3.4.1.patch`.

```shell
npx patch-package cypress
patch-package 6.1.2
• Creating temporary folder
• Installing cypress@3.4.1 with npm
• Diffing your files with clean files
✔ Created file patches/cypress+3.4.1.patch
```

5. Commit the new `patches` folder to git.

<Alert type="info">

If you find a patch for an error, please add a comment explaining your
workaround to the relevant Cypress GitHub issue. It will help us release an
official fix faster.

</Alert>

### Edit the installed Cypress code

The installed application comes with the fully transpiled, unobfuscated
JavaScript source code that you can hack on. You might want to directly modify
the installed app code to:

- investigate a hard to recreate bug that happens on your machine
- change the run-time behavior of Cypress before opening a pull request
- have fun 🎉

First, print where the binary is installed using the
[cypress cache path](/guides/guides/command-line#cypress-cache-path) command.

For example, on a Mac:

```shell
npx cypress cache path
/Users/jane/Library/Caches/Cypress
```

Second, open the source code at the following path in any code editor. Make sure
to substitute `3.3.1` for the desired version of Cypress you want to edit.

```text
/Users/jane/Library/Caches/Cypress/3.3.1/Cypress.app/Contents/Resources/app/packages/
```

You can change anything in the JavaScript code:

<DocsImage src="/img/guides/troubleshooting/source-code.png" alt="Source code of Cypress in a text editor" ></DocsImage>

When finished, if necessary, remove the edited Cypress version and reinstall the
Cypress official version to get back to the official released code.

```shell
rm -rf /Users/jane/Library/Caches/Cypress/3.3.1
npm install cypress@3.3.1
```
