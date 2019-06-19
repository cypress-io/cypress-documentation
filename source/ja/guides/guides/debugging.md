---
title: デバッグする
---

{% note info %}
# {% fa fa-graduation-cap %} What you'll learn

- How Cypress runs in the same event loop with your code, keeping debugging simple and understandable
- How Cypress embraces the standard Developer Tools
- How and when to use `debugger` and the shorthand {% url `.debug()` debug %} command
- How to troubleshoot issues with Cypress itself
{% endnote %}

# Using `debugger`

Your Cypress test code runs in the same run loop as your application. This means you have access to the code running on the page, as well as the things the browser makes available to you, like `document`, `window`, and, of course, `debugger`.

## Debug just like you always do

Based on those statements, you might be tempted to just throw a `debugger` into your test, like so:

```js
it('let me debug like a fiend', function() {
  cy.visit('/my/page/path')

  cy.get('.selector-in-question')

  debugger // Doesn't work
})
```

This may not work exactly as you are expecting. As you may remember from the {% url "Introduction to Cypress" introduction-to-cypress %}, `cy` commands enqueue an action to be taken later. Can you see what the test above will do given that perspective?

Both {% url `cy.visit()` visit %} and {% url `cy.get()` get %} will return immediately, having enqueued their work to be done later, and `debugger` will be executed before any of the commands have actually run.

Let's use {% url `.then()` then %} to tap into the Cypress command during execution and add a `debugger` at the appropriate time:

```js
it('let me debug when the after the command executes', function () {
  cy.visit('/my/page/path')

  cy.get('.selector-in-question')
    .then(($selectedElement) => {
      // Debugger is hit after the cy.visit
      // and cy.get command have completed
      debugger
    })
})
```

Now we're in business! The first time through, {% url `cy.visit()` visit %} and the {% url `cy.get()` get %} chain (with its {% url `.then()` then %} attached) are enqueued for Cypress to execute. The `it` block exits, and Cypress starts its work:

1. The page is visited, and Cypress waits for it to load.
2. The element is queried, and Cypress automatically waits and retries for a few moments if it isn't found immediately.
3. The function passed to {% url `.then()` then %} is executed, with the found element yielded to it.
4. Within the context of the {% url `.then()` then %} function, the `debugger` is called, halting the browser and calling focus to the Developer Tools.
5. You're in! Inspect the state of your application like you normally would if you'd dropped the `debugger` into your application code.

## Using {% url `.debug()` debug %}

Cypress also exposes a shortcut for debugging commands, {% url `.debug()` debug %}. Let's rewrite the test above using this helper method:

```js
it('let me debug like a fiend', function() {
  cy.visit('/my/page/path')

  cy.get('.selector-in-question')
    .debug()
})
```

The current subject that is yielded by the {% url `cy.get()` get %} is exposed as the variable `subject` within your Developer Tools so that you can interact with it in the console.

{% imgTag /img/guides/debugging-subject.png "Debugging Subject" %}

Use {% url `.debug()` debug %} to quickly inspect any (or many!) part(s) of your application during the test. You can attach it to any Cypress chain of commands to have a look at the system's state at that moment.

# Using the Developer Tools

Though Cypress has built out {% url "an excellent Test Runner" test-runner %} to help you understand what is happening in your application and your tests, there's no replacing all the amazing work browser teams have done on their built-in development tools. Once again, we see that Cypress goes _with_ the flow of the modern ecosystem, opting to leverage these tools wherever possible.

{% note info %}
## {% fa fa-video-camera %} See it in action!

You can see a walk-through of debugging some application code from Cypress {% url "in this segment from our React tutorial series" https://vimeo.com/242961930#t=264s %}.
{% endnote %}

## Get console logs for commands

All of Cypress's commands, when clicked on within the {% url "Command Log" test-runner#Command-Log %}, print extra information about the command, its subject, and its yielded result. Try clicking around the Command Log with your Developer Tools open! You may find some useful information here.

### When clicking on `.type()` command, the Developer Tools console outputs the following:

{% imgTag /img/api/type/console-log-of-typing-with-entire-key-events-table-for-each-character.png "Console Log type" %}

# Troubleshooting Cypress

There are times when you will encounter errors or unexpected behavior with Cypress itself. In this situation, we recommend checking these support resources **first**.

## Support channels

- Connect with our community in {% url "Gitter" https://gitter.im/cypress-io/cypress %}
- Search existing {% url "GitHub issues" https://github.com/cypress-io/cypress/issues %}
- Search this documentation (search is in the top right) 😉
- Search {% url "Stack Overflow" https://stackoverflow.com/questions/tagged/cypress %} for relevant answers
- If your organization signs up for one of our {% url "paid plans" https://www.cypress.io/pricing/ %}, you can get dedicated email support, which gives you one-on-one help from our team.
- If you still haven't found a solution, {% url "open an issue" https://github.com/cypress-io/cypress/issues/new %} *with a reproducible example*.

## Isolate the Problem

When debugging a failing test, follow these general principles to isolate the problem:

- Look at the {% url "video recordings and screenshots" screenshots-and-videos %}.
- Split large spec files into smaller ones.
- Split long tests into smaller tests.
- Run the same test using {% url '`--browser chrome`' command-line#cypress-run-browser-lt-browser-name-or-path-gt %}. The problem might be isolated to the Electron browser.
- If isolated to the Electron browser. Run the same tests in both Electron and Chrome, then compare the screenshots/videos. Look for and isolate any differences in the Command Log.

## Clear Cypress cache

If you're having an issue during installation of Cypress, try removing the contents of the Cypress cache.

This will clear out all installed versions of Cypress that may be cached on your machine.

```shell
cypress cache clear
```

After running this command, you will need to run `cypress install` before running Cypress again.

```shell
npm install cypress --save-dev
```

## Launching browsers

Cypress attempts to {% url 'automatically find installed Chrome versions for you' launching-browsers %}. However, probing for browsers across different environments can be error-prone. If Cypress cannot find a browser but you know you have it installed, there are ways to ensure that Cypress can "see" it.

{% note info Using the `--browser` command line argument %}
You can also supply the `--browser` command line argument to launch a browser from a known filesystem path to bypass browser auto detection. {% url "See 'Launching Browsers' for more information" launching-browsers#Launching-by-a-path % } %}
{% endnote %}

To see debug logs from the browser launcher, run Cypress with the `DEBUG` environment variable set to `cypress:launcher`.

### Mac

On Mac, Cypress attempts to find installed browsers by their bundle identifier. If this does not succeed, it will fall back to the Linux browser detection method.

Browser Name | Expected Bundle Identifier | Expected Executable
--- | --- | ---
`chrome` | `com.google.Chrome` | `Contents/MacOS/Google Chrome`
`chromium` | `org.chromium.Chromium` | `Contents/MacOS/Chromium`
`canary` | `com.google.Chrome.canary` | `Contents/MacOS/Google Chrome Canary`

### Linux

On Linux, Cypress scans your `PATH` for a number of different binary names. If the browser you are trying to use does not exist under one of the expected binary names, Cypress will not be able to find it.

Browser Name | Expected Binary Name(s)
--- | ---
`chrome` | `google-chrome`, `chrome`, or `google-chrome-stable`
`chromium` | `chromium-browser` or `chromium`
`canary` | `google-chrome-canary`

These binary names should work for most Linux distributions. If your distribution packages browsers under a different binary name, you can add a symlink using the expected binary name so that Cypress can detect it.

For example, if your distribution packages Google Chrome as `chrome`, you could add a symlink to `google-chrome` like this:

```shell
sudo ln `which chrome` /usr/local/bin/google-chrome
```

### Windows

On Windows, Cypress scans the following locations to try to find each browser:

Browser Name | Expected Path
--- | ---
`chrome` | `C:/Program Files (x86)/Google/Chrome/Application/chrome.exe`
`chromium` | `C:/Program Files (x86)/Google/chrome-win32/chrome.exe`
`canary` | `%APPDATA%/../Local/Google/Chrome SxS/Application/chrome.exe`

To make a browser installed at a different path be auto-detected, create a symbolic link using `mklink` in the location that Cypress expects to find your browser.

{% url 'Read more about creating symbolic links on Windows' https://www.howtogeek.com/howto/16226/complete-guide-to-symbolic-links-symlinks-on-windows-or-linux/ %}

## Chrome extension whitelisting

Cypress utilizes a Chrome extension within the Test Runner in order to run properly. If you or your company whitelist specific Chrome extensions, this may cause problems with running Cypress. You will want to ask your administrator to whitelist the Cypress extension ID below:

```sh
caljajdfkjjjdehjdoimjkkakekklcck
```

## Clear App Data

Cypress maintains some local application data in order to save user preferences and more quickly start up. Sometimes this data can become corrupted. You may fix an issue you have by clearing this app data.

### To clear App Data

1. Open Cypress via `cypress open`
2. Go to `File` -> `View App Data`
3. This will take you to the directory in your file system where your App Data is stored. If you cannot open Cypress, search your file system for a directory named `cy` whose content should look something like this:

  ```
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

## Step through test commands

You can run the test command by command using the {% url `.pause()` pause %} command.

```javascript
it('adds items', function () {
  cy.pause()
  cy.get('.new-todo')
  // more commands
})
```

This allows you to inspect the web application, the DOM, the network, and any storage after each command to make sure everything happens as expected.

## Print DEBUG logs

Cypress is built using the {% url 'debug' https://github.com/visionmedia/debug %} module. That means you can receive helpful debugging output by running Cypress with this turned on. **Note:** you will see a LOT of messages when running with `DEBUG=...` setting.

**On Mac or Linux:**

```shell
DEBUG=cypress:* cypress open
```

**On Windows:**

```shell
set DEBUG=cypress:*
```

```shell
cypress open
```

Read more {% url 'about the CLI options here' command-line#Debugging-commands %} and {% url "Good Logging" https://glebbahmutov.com/blog/good-logging/ %} blog post.

### Detailed Logs

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

### Debug logs in the browser

If the problem is seen during `cypress open` you can print debug logs in the browser too. Open the browser's Developer Tools and set a `localStorage` property:

```javascript
localStorage.debug = 'cypress*'

// to disable debug messages
delete localStorage.debug
```

Reload the browser and see debug messages within the Developer Tools console. You will only see the "cypress:driver" package logs that run in the browser, as you can see below.

{% imgTag /img/api/debug/debug-driver.jpg "Debug logs in browser" %}

## Log Cypress events

In addition to the `DEBUG` messages, Cypress also emits multiple events you can listen to as shown below. {% url 'Read more about logging events in the browser here' catalog-of-events#Logging-All-Events %}.

{% imgTag /img/api/catalog-of-events/console-log-events-debug.png "console log events for debugging" %}

## Run Cypress command outside the test

If you need to run a Cypress command straight from the Developer Tools console, you can use the internal command `cy.now('command name', ...arguments)`. For example, to run the equivalent of `cy.task('database', 123)` outside the normal execution command chain:

```javascript
cy.now('task', 123)
  .then(console.log)
// runs cy.task(123) and prints the resolved value
```

{% note warning %}
The `cy.now()` command is an internal command and may change in the future.
{% endnote %}

## Additional information

### Write command log to the terminal

You can include the plugin [cypress-failed-log](https://github.com/bahmutov/cypress-failed-log) in your tests. This plugin writes the list of Cypress commands to the terminal as well as a JSON file if a test fails.

{% imgTag /img/api/debug/failed-log.png "cypress-failed-log terminal output" %}

# Hacking on Cypress

If you want to dive into Cypress and edit the code yourself, you can do that. The Cypress code is open source and licensed under an {% url "MIT license" https://github.com/cypress-io/cypress/blob/develop/LICENSE %}. There are a few tips on getting started that we've outlined below.

## Contribute

If you'd like to contribute directly to the Cypress code, we'd love to have your help! Please check out our {% url "contributing guide" https://github.com/cypress-io/cypress/blob/develop/CONTRIBUTING.md %} to learn about the many ways you can contribute.

## Run the Cypress app by itself

Cypress comes with an npm CLI module that parses the arguments, starts the Xvfb server (if necessary), and then opens the Test Runner application built on top of {% url "Electron" https://electronjs.org/ %}. Some common situations on why you would want to do this are:

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

If there is a missing dependency, the application should print an error message. You can see the Electron verbose log messages by setting an {% url "environment variable ELECTRON_ENABLE_LOGGING" https://electronjs.org/docs/api/environment-variables %}:

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
