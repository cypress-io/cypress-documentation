---
title: All Events
containerClass: all-events
---

Cypress emits a series of events as it runs. Some occur in the {% urlHash "browser" Browser-Events %} and some occur in the {% url "background process" background-process %}.

These events are useful not only to control your application's behavior, but also for debugging purposes.

Here are some examples you can do with these events:

- Listen for `alert` or `confirm` calls and change the behavior
- Listen for `page:start` events and modify the `window` before any of your app code runs between page transitions
- Listen for `internal:commandRetry` events to understand why Cypress is internally retrying for debugging purposes
- Modify how Cypress preprocesses your spec files
- Modify browser launch arguments

# Browser Events

These events occur in the browser.

Event                                                   | Description
--------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------
{% url `after:test:run` after-test-run-event %}         | Fires after a test and all its **afterEach** and **after** hooks run, with details about the test.
{% url `test:start` test-start-event %}       | Fires before a test and all its **before** and **beforeEach** hooks run, with details about the test.
{% url `page:start` page-start-event %}                 | Fires before the page begins to load, before any of your pages's JavaScript has executed, with your page's `window` object.
{% url `page:ready` page-ready-event %}                 | Fires after all the page's resources have finished loading.
{% url `page:end` page-end-event %}                     | Fires when the page has unloaded and is navigating away.
{% url `internal:commandEnd` internal-commandend-event %}               | Fires after a command executes, with the command that was run.
{% url `internal:commandEnqueue` internal-commandenqueue-event %}     | Fires after a command is first invoked and enqueued to be run later, with the details about the command.
{% url `internal:commandRetry` internal-commandretry-event %}           | Fires before a command begins its retrying routines, with details about the retry.
{% url `internal:commandStart` internal-commandstart-event %}           | Fires before a command executes, with the command that will be run.
{% url `fail` fail-event %}                             | Fires before a test fails, with the error and the mocha runnable object.
{% url `log:added` log-added-event %}                   | Fires before a command is displayed in the Command Log, with details about the log.
{% url `log:changed` log-changed-event %}               | Fires after a command's attributes changes, with the log details and whether Cypress is in interactive mode.
{% url `scrolled` scrolled-event %}                     | Fires after **Cypress** scrolls your page, with the element or `window` being scrolled and the type of element being scrolled.
{% url `uncaught:exception` uncaught-exception-event %} | Fires after an uncaught exception occurs, with the error and the mocha runnable object.
{% url `page:urlChanged` page-urlchanged-event %}       | Fires after the page's URL changes, with the new URL.
{% url `viewport:changed` viewport-changed-event %}     | Fires after the viewport changes, with the new viewport dimensions.
{% url `page:alert` page-alert-event %}                 | Fires when the page calls the global `window.alert()` method, with the alert text.
{% url `page:confirm` page-confirm-event %}             | Fires when your app calls the global `window.confirm()` method, with the confirm text.

You can listen to browser events in your spec files or in your {% url "support file" writing-and-organizing-tests#Support-file %} via the `Cypress` and `cy` objects.

Both the global `Cypress` and `cy` objects are standard `Node.js` event emitters. That means you can use the following methods to bind and unbind from events.

- {% url 'on' https://nodejs.org/api/events.html#events_emitter_on_eventname_listener %}
- {% url 'once' https://nodejs.org/api/events.html#events_emitter_once_eventname_listener %}
- {% url 'removeListener' https://nodejs.org/api/events.html#events_emitter_removelistener_eventname_listener %}
- {% url 'removeAllListeners' https://nodejs.org/api/events.html#events_emitter_removealllisteners_eventname %}

It's important to understand why you'd want to bind to either `Cypress` or `cy`.

## Cypress

Cypress is a global object that persists for the entirety of all of your tests. Any events you bind to Cypress will apply to all tests, and will not be unbound unless you manually unbind them.

This is useful when you're debugging and just want to add a single "catch-all" event to track down things like test failures, or uncaught exceptions from your application.

## cy

The `cy` object is bound to each individual test. Events bound to `cy` will **automatically** be removed when the test ends. You don't have to worry about cleanup, and your event listeners will only be called for the duration of the single test.

# Background Events

These events occur in the {% url "background file" background-process %}.

Event                                                             | Description
------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------
{% url `after:run` after-run-event %}                             | Fires after the run finishes, with the results of the run.
{% url `after:screenshot` after-screenshot-event %}               | Fires after the a screenshot is taken, with details about the screenshot.
{% url `after:spec` after-spec-event %}                           | Fires after a spec file and its tests run, with details about the spec file and its test results.
{% url `after:test:run` after-test-run-event %}                   | Fires after a test and all its **afterEach** and **after** hooks run, with details about the test.
{% url `browser:launch` browser-launch-event %}                   | Fires before the browser is launched, giving you the ability to modify the arguments used to launch it.
{% url `before:run` before-run-event %}                           | Fires before the run starts, with details about the run.
{% url `before:spec` before-spec-event %}                         | Fires before a spec file is run, with details about the spec file.
{% url `test:start` test-start-event %}                           | Fires before a test and all its **before** and **beforeEach** hooks run, with details about the test.
{% url `internal:commandEnd` internal-commandend-event %}         | Fires after a command executes, with the command that was run.
{% url `internal:commandEnqueue` internal-commandenqueue-event %} | Fires after a command is first invoked and enqueued to be run later, with the details about the command.
{% url `internal:commandRetry` internal-commandretry-event %}     | Fires before a command begins its retrying routines, with details about the retry.
{% url `internal:commandStart` internal-commandstart-event %}     | Fires before a command executes, with the command that will be run.
{% url `brower:filePreprocessor` brower-filepreprocessor-event %} | Fires before a spec file is processed, giving you the ability to control how it's processed.
{% url `task` task-event %}                                       | Fires when you use {% url `cy.task()` task %}, with the arguments you pass to it.

# Other Events

There are a myriad of other events Cypress fires to communicate with the Node server process, automation servers, mocha, the runner, and the reporter. They are strictly internal to the way Cypress works and not useful for users.

# Notes

## Logging All Browser Events

Cypress uses the {% url `debug` https://github.com/visionmedia/debug %} node module for both the backend server process, and for everything running in the browser (called the driver).

If you'd like to see (the huge) stream of events that Cypress emits in the browser you can pop open your Dev Tools and write this line in the console.

```javascript
localStorage.debug = 'cypress:*'
```

After you refresh the page you'll see something that looks like this in your console:

{% img /img/api/all-events/console-log-events-debug.png "console log events for debugging" %}
