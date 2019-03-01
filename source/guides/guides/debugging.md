---
title: Debugging
---

{% note info %}
# {% fa fa-graduation-cap %} What you'll learn

- How Cypress runs in the runloop with your code, keeping debugging simple and understandable
- How Cypress embraces the standard DevTools
- How and when to use `debugger` and the shorthand {% url `.debug()` debug %} command
- How to troubleshoot issues with Cypress itself
- How to learn about bug type and changes
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
4. Within the context of the {% url `.then()` then %} function, the `debugger` is called, halting the browser and calling focus to the DevTools.
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

The current subject that is yielded by the {% url `cy.get()` get %} is exposed as the variable `subject` within your DevTools so that you can interact with it in the console.

{% img /img/guides/debugging-subject.png "Debugging Subject" %}

Use {% url `.debug()` debug %} to quickly inspect any (or many!) part(s) of your application during the test. You can attach it to any Cypress chain of commands to have a look at the system's state at that moment.

# Using the DevTools

Though Cypress has built out {% url "an excellent Test Runner" test-runner %} to help you understand what is happening in your application and your tests, there's simply no replacing all the amazing work browser teams have done on their built-in development tools. Once again, we see that Cypress goes _with_ the flow of the modern ecosystem, opting to leverage these tools wherever possible.

{% note info %}
## {% fa fa-video-camera %} See it in action!

You can see a walk-through of debugging some application code from Cypress {% url "in this segment from our React tutorial series" https://vimeo.com/242961930#t=264s %}.
{% endnote %}

## Get console logs for commands

All of Cypress's commands, when clicked on within the {% url "Command Log" test-runner#Command-Log %}, print extra information about the command, its subject, and its yielded result. Try clicking around the Command Log with your DevTools open! You may find some useful information here.

### When clicking on `.type()` command, the DevTools console outputs the following:

![Console Log](/img/api/type/console-log-of-typing-with-entire-key-events-table-for-each-character.png)

# Troubleshooting Cypress

There are times when you will encounter errors or unexpected behavior with Cypress itself. In this situation, we recommend checking these support resources **first**.

## Support channels

- Connect with our community in {% url "Gitter" https://gitter.im/cypress-io/cypress %}
- Search existing {% url "GitHub issues" https://github.com/cypress-io/cypress/issues %}
- Search this documentation (search is in the top right) 😉
- Search {% url "Stack Overflow" https://stackoverflow.com/questions/tagged/cypress %} for relevant answers
- If your organization signs up for one of our {% url "paid plans" https://www.cypress.io/pricing/ %}, you can get dedicated email support, which gives you one-on-one help from our team.
- If you still haven't found a solution, {% url "open an issue" https://github.com/cypress-io/cypress/issues/new %} *with a reproducible example*.

## Print DEBUG logs

Cypress is built using the {% url 'debug' https://github.com/visionmedia/debug %} module. That means you can receive helpful debugging output by running Cypress with this turned on.

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

{% url 'Read more about the CLI options here' command-line#Debugging-commands %}

## Log Cypress events

When Cypress is running in the Test Runner, you can have every event it fires logged out to the console as shown below. {% url 'Read more about logging events in the browser here' catalog-of-events#Logging-All-Events %}.

{% img /img/api/catalog-of-events/console-log-events-debug.png "console log events for debugging" %}

## Launching browsers

Cypress attempts to {% url 'automatically find installed Chrome versions for you' launching-browsers %}. However, probing for browsers across different environments can be error-prone. If Cypress cannot find a browser but you know you have it installed, there are ways to ensure that Cypress can "see" it.

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

Browser Name | Expected Binary Name
--- | ---
`chrome` | `google-chrome`
`chromium` | `chromium-browser`
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

To use a browser installed at a different path, create a symbolic link using `mklink` in the location that Cypress expects to find your browser.

{% url 'Read more about creating symbolic links on Windows' https://www.howtogeek.com/howto/16226/complete-guide-to-symbolic-links-symlinks-on-windows-or-linux/ %}

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

# Type of Bug/Changes

This section will show you how to identify bug types.

## Run Cypress with `DEBUG`

Stop the application server and run Cypress only.
```shell
  DEBUG=cypress* \
  npx cypress run \
  --spec cypress/integration/02-adding-items/demo.js
  ```

Note: You should see a LOT of messages before the error is shown

Cypress uses {% url "debug" https://github.com/visionmedia/debug#readme %} module to control debug CLI messages.

Read {% url "Good Logging" https://glebbahmutov.com/blog/good-logging/ %}

## Detailed Logs

note: there are more levels to DEBUG messages

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

If the problem is seen during `cypress open` you can print debug logs too. Open browser DevTools

```
localStorage.debug = "cypress*"
// to disable debug messages
delete localStorage.debug
```
Reload the browser "Cmd + R"

There is only "cypress:driver" package that runs in the browser

![Console Log](/img/api/debug/debug-driver.jpg)

## Step through test

Open 'cypress/integration/02-adding-items/demo.js' and add `cy.pause()` command

```
it('adds items', function () {
  cy.pause()
  cy.get('.new-todo')
    // ...
})
```
Note: You can observe the application, the DOM, the network, the storage after each command to make sure everything happens as expected.

## After the test has finished

After the test has finished
```
cy.now('command name', ...args)
  .then(console.log)
Runs single command right now. Might change in the future.
```

### If your app throws an error

```
// throw error when loading todos
loadTodos ({ commit }) {
  commit('SET_LOADING', true)

  setTimeout(() => {
    throw new Error('Random problem')
  }, 50)
  ```
![Console Log](/img/api/debug/random-problem.png)

Cypress catches expception from the application

## How to debug `cypress run` failures
### Isolate the Problem

- Look at the video recording and screenshots
- Split large spec files into smaller ones
- Split long tests into shorter ones
- Run using --browser chrome

### `cypress-failed-log`
Saves the Cypress test command log as a JSON file if a test fails

## Run failing test

- Add a failure to the cypress/integration/02-adding-items/demo.js spec
- Run this spec from the command line to see the command log
Note: expected result is on the next slide

![Console Log](/img/api/debug/failed-log.png)

`cypress-failed-log` output.
