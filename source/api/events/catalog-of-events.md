---
title: Catalog of Events
containerClass: catalog-of-events
---

Cypress emits a series of events as it runs. Some occur in the {% urlHash "browser" Browser-Events %} and some occur in the {% url "background process" background-process %}.

These events are useful not only to control your application's behavior, but also for debugging purposes.

Here are some examples you can do with these events:

- Listen for `alert` or `confirm` calls and change the behavior
- Listen for `before:window:load` events and modify the `window` before any of your app code runs between page transitions
- Listen for `command:retry` events to understand why Cypress is internally retrying for debugging purposes
- Modify Cypress configuration before your test run
- Modify how Cypress preprocesses your spec files
- Modify browser launch arguments

# Environment

Some events run in the {% urlHash "browser" Browser-Events %}, some run in the {% urlHash "background process" Background-Events %}, and some run in both.

Event | Browser | Background Process
--- | --- | ---
{% url `after:run` after-run-event %} | | {% fa fa-check-circle green %}
{% url `after:screenshot` after-screenshot-event %} | | {% fa fa-check-circle green %}
{% url `after:spec` after-spec-event %} | | {% fa fa-check-circle green %}
{% url `after:test:run` after-test-run-event %} | {% fa fa-check-circle green %} | {% fa fa-check-circle green %}
{% url `before:browser:launch` before-browser-launch-event %} | | {% fa fa-check-circle green %}
{% url `before:run` before-run-event %} | | {% fa fa-check-circle green %}
{% url `before:spec` before-spec-event %} | | {% fa fa-check-circle green %}
{% url `before:test:run` before-test-run-event %} | {% fa fa-check-circle green %} | {% fa fa-check-circle green %}
{% url `before:window:load` before-window-load-event %} | {% fa fa-check-circle green %} |
{% url `before:window:unload` before-window-unload-event %} | {% fa fa-check-circle green %} |
{% url `command:end` command-end-event %} | {% fa fa-check-circle green %} | {% fa fa-check-circle green %}
{% url `command:enqueued` command-enqueued-event %} | {% fa fa-check-circle green %} | {% fa fa-check-circle green %}
{% url `command:retry` command-retry-event %} | {% fa fa-check-circle green %} | {% fa fa-check-circle green %}
{% url `command:start` command-start-event %} | {% fa fa-check-circle green %} | {% fa fa-check-circle green %}
{% url `configuration` configuration-event %} | | {% fa fa-check-circle green %}
{% url `fail` fail-event %} | {% fa fa-check-circle green %} |
{% url `file:preprocessor` file-preprocessor-event %} | | {% fa fa-check-circle green %}
{% url `log:added` log-added-event %} | {% fa fa-check-circle green %} |
{% url `log:changed` log-changed-event %} | {% fa fa-check-circle green %} |
{% url `scrolled` scrolled-event %} | {% fa fa-check-circle green %} |
{% url `task` task-event %} | | {% fa fa-check-circle green %}
{% url `uncaught:exception` uncaught-exception-event %} | {% fa fa-check-circle green %} |
{% url `url:changed` url-changed-event %} | {% fa fa-check-circle green %} |
{% url `viewport:changed` viewport-changed-event %} | {% fa fa-check-circle green %} |
{% url `window:alert` window-alert-event %} | {% fa fa-check-circle green %} |
{% url `window:confirm` window-confirm-event %} | {% fa fa-check-circle green %} |
{% url `window:load` window-load-event %} | {% fa fa-check-circle green %} |
{% url `window:unload` window-unload-event %} | {% fa fa-check-circle green %} |

# Other Events

There are a myriad of other events Cypress fires to communicate with the Node server process, automation servers, mocha, the runner, and the reporter. They are strictly internal to the way Cypress works and not useful for users.

# Browser Events

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

You can listen to background events in your {% url "background file" background-process %}.

# Notes

## Logging All Browser Events

Cypress uses the {% url `debug` https://github.com/visionmedia/debug %} node module for both the backend server process, and for everything running in the browser (called the driver).

If you'd like to see (the huge) stream of events that Cypress emits in the browser you can pop open your Dev Tools and write this line in the console.

```javascript
localStorage.debug = "cypress:*"
```

After you refresh the page you'll see something that looks like this in your console:

{% img /img/api/catalog-of-events/console-log-events-debug.png "console log events for debugging" %}
