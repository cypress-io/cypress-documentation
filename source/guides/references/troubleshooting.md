---
title: Troubleshooting
---

There are times when you will encounter errors or unexpected behavior with Cypress itself. In this situation, we recommend checking these support resources **first**.

# Support channels

- Connect with our community in {% url "Gitter" https://gitter.im/cypress-io/cypress %}
- Search existing {% url "GitHub issues" https://github.com/cypress-io/cypress/issues %}
- Search this documentation (search is in the top right) 😉
- Search {% url "Stack Overflow" https://stackoverflow.com/questions/tagged/cypress %} for relevant answers
- If your organization signs up for one of our {% url "paid plans" https://www.cypress.io/pricing/ %}, you can get dedicated email support, which gives you one-on-one help from our team.
- If you still haven't found a solution, {% url "open an issue" https://github.com/cypress-io/cypress/issues/new %} *with a reproducible example*.

# Isolate the Problem

When debugging a failing test, follow these general principles to isolate the problem:

- Look at the {% url "video recordings and screenshots" screenshots-and-videos %}.
- Split large spec files into smaller ones.
- Split long tests into smaller tests.
- Run the same test using {% url '`--browser chrome`' command-line#cypress-run-browser-lt-browser-name-or-path-gt %}. The problem might be isolated to the Electron browser.
- If isolated to the Electron browser. Run the same tests in both Electron and Chrome, then compare the screenshots/videos. Look for and isolate any differences in the Command Log.

{% partial chromium_download %}

# Clear Cypress cache

If you're having an issue during installation of Cypress, try removing the contents of the Cypress cache.

This will clear out all installed versions of Cypress that may be cached on your machine.

```shell
cypress cache clear
```

After running this command, you will need to run `cypress install` before running Cypress again.

```shell
npm install cypress --save-dev
```

# Launching browsers

Cypress attempts to {% url 'automatically find installed Chrome versions for you' launching-browsers %}. However, probing for browsers across different environments can be error-prone. If Cypress cannot find a browser but you know you have it installed, there are ways to ensure that Cypress can "see" it.

{% note info Using the `--browser` command line argument %}
You can also supply the `--browser` command line argument to launch a browser from a known filesystem path to bypass browser auto detection. {% url "See 'Launching Browsers' for more information" launching-browsers#Launching-by-a-path %}
{% endnote %}

You can see the full list of found browsers and their properties within the {% url "resolved configuration" configuration#Resolved-Configuration %} in the **Settings** tab of the Test Runner.

Another way to log what is found by Cypress is to run Cypress with the {% urlHash "DEBUG environment variable" Print-DEBUG-logs %} set to `cypress:launcher`. This will print information about the found browsers and their properties to the terminal.

**Tip:** use the {% url '`cypress info`' command-line#cypress-info %} command to see all locally detected browsers.

## Mac

On Mac, Cypress attempts to find installed browsers by their bundle identifier. If this does not succeed, it will fall back to the Linux browser detection method.

Browser Name | Expected Bundle Identifier | Expected Executable
--- | --- | ---
`chrome` | `com.google.Chrome` | `Contents/MacOS/Google Chrome`
`chromium` | `org.chromium.Chromium` | `Contents/MacOS/Chromium`
`chrome:canary` | `com.google.Chrome.canary` | `Contents/MacOS/Google Chrome Canary`

For the current list, see {% url 'packages/launcher' https://github.com/cypress-io/cypress/blob/develop/packages/launcher/lib/darwin/index.ts %} files.

## Linux

On Linux, Cypress scans your `PATH` for a number of different binary names. If the browser you are trying to use does not exist under one of the expected binary names, Cypress will not be able to find it.

Browser Name | Expected Binary Name(s)
--- | ---
`chrome` | `google-chrome`, `chrome`, or `google-chrome-stable`
`chromium` | `chromium-browser` or `chromium`
`chrome:canary` | `google-chrome-canary`

These binary names should work for most Linux distributions. If your distribution packages browsers under a different binary name, you can add a symlink using the expected binary name so that Cypress can detect it.

For example, if your distribution packages Google Chrome as `chrome`, you could add a symlink to `google-chrome` like this:

```shell
sudo ln `which chrome` /usr/local/bin/google-chrome
```

## Windows

On Windows, Cypress scans the following locations to try to find each browser:

Browser Name | Expected Path
--- | ---
`chrome` | `C:/Program Files (x86)/Google/Chrome/Application/chrome.exe`
`chromium` | `C:/Program Files (x86)/Google/chrome-win32/chrome.exe`
`chrome:canary` | `%APPDATA%/../Local/Google/Chrome SxS/Application/chrome.exe`

For the current list, see {% url 'packages/launcher' https://github.com/cypress-io/cypress/blob/develop/packages/launcher/lib/windows/index.ts %} files.

To make a browser installed at a different path be auto-detected, create a symbolic link using `mklink` in the location that Cypress expects to find your browser.

{% url 'Read more about creating symbolic links on Windows' https://www.howtogeek.com/howto/16226/complete-guide-to-symbolic-links-symlinks-on-windows-or-linux/ %}

# Allow the Cypress Chrome extension

Cypress utilizes a Chrome extension within the Test Runner in order to run properly. If you or your company block specific Chrome extensions, this may cause problems with running Cypress. You will want to ask your administrator to allow the Cypress extension ID below:

```sh
caljajdfkjjjdehjdoimjkkakekklcck
```

# Allow Cypress URLs on VPNs

{% partial vpn_allowed_list %}

# Clear App Data

Cypress maintains some local application data in order to save user preferences and more quickly start up. Sometimes this data can become corrupted. You may fix an issue you have by clearing this app data.

## To clear App Data

1. Open Cypress via `cypress open`
2. Go to `File` -> `View App Data`
3. This will take you to the directory in your file system where your App Data is stored. If you cannot open Cypress, search your file system for a directory named `cy` whose content should look something like this:

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

# Print DEBUG logs

Cypress is built using the {% url 'debug' https://github.com/visionmedia/debug %} module. That means you can receive helpful debugging output by running Cypress with this turned on. **Note:** you will see a LOT of messages when running with `DEBUG=...` setting.

**On Mac or Linux:**

```shell
DEBUG=cypress:* cypress run
```

**On Windows:**

```shell
set DEBUG=cypress:*
cypress run
```

Read more {% url 'about the CLI options here' command-line#Debugging-commands %} and {% url "Good Logging" https://glebbahmutov.com/blog/good-logging/ %} blog post.

## Detailed Logs

There are several levels of `DEBUG` messages

```shell
# prints very few top-level messages
DEBUG=cypress:server ...
# prints ALL messages from server package
DEBUG=cypress:server* ...
# prints messages only from config parsing
DEBUG=cypress:server:config ...
```

This allows you to isolate the problem a little better

## Debug logs in the browser

If the problem is seen during `cypress open` you can print debug logs in the browser too. Open the browser's Developer Tools and set a `localStorage` property:

```javascript
localStorage.debug = 'cypress*'

// to disable debug messages
delete localStorage.debug
```

Reload the browser and see debug messages within the Developer Tools console. You will only see the "cypress:driver" package logs that run in the browser, as you can see below.

{% imgTag /img/api/debug/debug-driver.jpg "Debug logs in browser" %}

# Log memory and CPU usage

You can tell Cypress to log out a summary of the memory and CPU usage of itself and any subprocesses at a regular interval by enabling the `cypress:server:util:process_profiler` debug stream, like so:

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

{% imgTag /img/guides/troubleshooting-cypress-process-profiler-cli.jpg "Process printout of Cypress in CLI" %}

By default, process information is collected and summarized is printed once every 10 seconds. You can override this interval by setting the `CYPRESS_PROCESS_PROFILER_INTERVAL` environment variable to the desired interval in milliseconds.

You can also obtain more detailed per-process information by enabling the verbose `cypress-verbose:server:util:process_profiler` debug stream.

# Debugging flake

While Cypress is {% url "flake-resistant" key-differences#flake-resistant %}, some users do experience flake, particularly when running locally versus in CI. Most often in cases of flaky tests, we see that there are not enough assertions surrounding test actions or network requests before moving on to the next assertion.

If there is any variation in the speed of the network requests or responses in interactive mode versus run mode, then there can be failures in one over the other.

Because of this, we recommend asserting on as many required steps as possible before moving forward with the test. This also helps later to isolate where the exact failure is when debugging.

Flake can also occur when there are differences between your local and test environments. You can review the {% url "FAQ here" using-cypress-faq#Why-do-my-Cypress-tests-pass-locally-but-not-in-CI %} for tips on how to address tests that pass locally but fail in CI.

The Cypress Dashboard also offers {% url "Analytics" analytics %} that illustrate trends in your tests and can help identify the tests that fail most often. This could help narrow down what is causing the flake -- for example, seeing increased failures after a change to the test environment could indicate issues with the new environment.

# Additional information

## Write command log to the terminal

You can include the plugin [cypress-failed-log](https://github.com/bahmutov/cypress-failed-log) in your tests. This plugin writes the list of Cypress commands to the terminal as well as a JSON file if a test fails.

{% imgTag /img/api/debug/failed-log.png "cypress-failed-log terminal output" %}

# Hacking on Cypress

If you want to dive into Cypress and edit the code yourself, you can do that. The Cypress code is open source and licensed under an {% url "MIT license" https://github.com/cypress-io/cypress/blob/develop/LICENSE %}. There are a few tips on getting started that we've outlined below.

## Contribute

If you'd like to contribute directly to the Cypress code, we'd love to have your help! Please check out our {% url "contributing guide" https://github.com/cypress-io/cypress/blob/develop/CONTRIBUTING.md %} to learn about the many ways you can contribute.

## Run the Cypress app by itself

Cypress comes with an npm CLI module that parses the arguments, starts the Xvfb server (if necessary), and then opens the Test Runner application built on top of {% url "Electron" https://electronjs.org/ %}.

Some common situations on why you would want to run the Cypress app by itself are to:

- debug Cypress not starting or hanging
- debug problems related to the way CLI arguments are parsed by the npm CLI module

Here is how you can launch Cypress application directly without the npm CLI module. First, find where the binary is installed using the {% url "`cypress cache path`" command-line#cypress-cache-path %} command.

For example, on a Linux machine:

```shell
npx cypress cache path
/root/.cache/Cypress
```

Second, try a smoke test that verifies that the application has all its required dependencies present on the host machine:

```shell
/root/.cache/Cypress/3.3.1/Cypress/Cypress --smoke-test --ping=101
101
```

If there is a missing dependency, the application should print an error message. You can see the Electron verbose log messages by setting an {% url "environment variable ELECTRON_ENABLE_LOGGING" https://www.electronjs.org/docs/api/command-line-switches %}:

```shell
ELECTRON_ENABLE_LOGGING=true DISPLAY=10.130.4.201:0 /root/.cache/Cypress/3.3.1/Cypress/Cypress --smoke-test --ping=101
[809:0617/151243.281369:ERROR:bus.cc(395)] Failed to connect to the bus: Failed to connect to socket /var/run/dbus/system_bus_socket: No such file or directory
101
```

If the smoke test fails to execute, check if a shared library is missing (a common problem on Linux machines without all of the Cypress dependencies present).

```shell
ldd /home/person/.cache/Cypress/3.3.1/Cypress/Cypress
  linux-vdso.so.1 (0x00007ffe9eda0000)
  libnode.so => /home/person/.cache/Cypress/3.3.1/Cypress/libnode.so (0x00007fecb43c8000)
  libpthread.so.0 => /lib/x86_64-linux-gnu/libpthread.so.0 (0x00007fecb41ab000)
  libgtk-3.so.0 => not found
  libgdk-3.so.0 => not found
  ...
```

**Tip:** use {% url "Cypress Docker image" docker %} or install dependencies by copying them from one of our official Docker images.

**Note:** verbose Electron logging might show warnings that still allow Cypress to work normally. For example, the Cypress Test Runner opens normally despite the scary output below:

```shell
ELECTRON_ENABLE_LOGGING=true DISPLAY=10.130.4.201:0 /root/.cache/Cypress/3.3.1/Cypress/Cypress
[475:0617/150421.326986:ERROR:bus.cc(395)] Failed to connect to the bus: Failed to connect to socket /var/run/dbus/system_bus_socket: No such file or directory
[475:0617/150425.061526:ERROR:bus.cc(395)] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[475:0617/150425.079819:ERROR:bus.cc(395)] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[475:0617/150425.371013:INFO:CONSOLE(73292)] "%cDownload the React DevTools for a better development experience: https://fb.me/react-devtools
You might need to use a local HTTP server (instead of file://): https://fb.me/react-devtools-faq", source: file:///root/.cache/Cypress/3.3.1/Cypress/resources/app/packages/desktop-gui/dist/app.js (73292)
```

You can also see verbose Cypress logs when running the Test Runner binary

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

If the smoke test does not show a specific error yet fails, try printing the Electron crash stack to maybe pinpoint the problem better:

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

## Patch Cypress

Cypress comes with an npm CLI module that parses the arguments, starts the Xvfb server (if necessary), and then opens the Test Runner application built on top of {% url "Electron" https://electronjs.org/ %}.

If you're encountering a bug in the current version of Cypress, you can implementing a temporary fix by patching Cypress in your own project. Here is an example of how to do this.

1. Install {% url "patch-package" https://github.com/ds300/patch-package %}.
2. Add a patch step to your CI configuration after installing your npm packages.

  ```yaml
  - run: npm ci
  - run: npx patch-package
  ```

  Alternatively, you can apply the patch during a post-install phase. In your `package.json`, for example, you could add the following:

  ```json
  {
    "scripts": {
      "postinstall": "patch-package"
    }
  }
  ```

3. Edit the line causing the problem *in your local node_modules folder* within `node_modules/cypress`.
4. Run the `npx patch-package cypress` command. This command will create a new file `patches/cypress+3.4.1.patch`.

  ```shell
  npx patch-package cypress
  patch-package 6.1.2
  • Creating temporary folder
  • Installing cypress@3.4.1 with npm
  • Diffing your files with clean files
  ✔ Created file patches/cypress+3.4.1.patch
  ```

5. Commit the new `patches` folder to git.

{% note info %}
If you find a patch for an error, please add a comment explaining your workaround to the relevant Cypress GitHub issue. It will help us release an official fix faster.
{% endnote %}

## Edit the installed Cypress code

The installed Test Runner comes with the fully transpiled, unobfuscated JavaScript source code that you can hack on. You might want to directly modify the installed Test Runner code to:

- investigate a hard to recreate bug that happens on your machine
- change the run-time behavior of Cypress before opening a pull request
- have fun 🎉

First, print where the binary is installed using the {% url "`cypress cache path`" command-line#cypress-cache-path %} command.

For example, on a Mac:

```shell
npx cypress cache path
/Users/jane/Library/Caches/Cypress
```

Second, open the source code at the following path in any code editor. Make sure to substitute `3.3.1` for the desired version of the Test Runner you want to edit.

```text
/Users/jane/Library/Caches/Cypress/3.3.1/Cypress.app/Contents/Resources/app/packages/
```

You can change anything in the JavaScript code:

{% imgTag /img/guides/source-code.png "Source code of the Test Runner in a text editor" %}

When finished, if necessary, remove the edited Test Runner version and reinstall the Cypress official version to get back to the official released code.

```shell
rm -rf /Users/jane/Library/Caches/Cypress/3.3.1
npm install cypress@3.3.1
```
