---
title: Catalog of Events
comments: false
---

Cypress emits a series of events as it runs in your browser.

These are events are useful not only to control your application's behavior, but also for debugging purposes.

Here are some examples you can do with these events:

- Listen for `uncaught exceptions` and prevent Cypress from failing the test
- Listen for `alert` or `confirm` calls and change the `confirm` behavior
- Listen for `before:window:load` events and modify the `window` before any of your app code runs between page transitions
- Listen for `command:retry` events to understand why Cypress is internally retrying for debugging purposes

{% note info WIP %}
This page is currently a work in progress and is not fully documented.
{% endnote %}

# Events

## App Events

These events come from the application currently under test (your application). These are the most useful events for you to listen to.

Event | Details
--- | ---
**Name:** | `uncaught:exception`
**Yields:** | the error **(Object)**, mocha runnable **(Object)**
**Description:** | Fires when an uncaught exception occurs in your application. Cypress will fail the test when this fires. Return `false` from this event and Cypress will not fail the test. Also useful for debugging purposes because the actual `error` instance is provided to you.

Event | Details
--- | ---
**Name:** | `window:confirm`
**Yields:** | the confirmation text **(String)**
**Description:** | Fires when your app calls the global `window.confirm()` method. Cypress will auto accept confirmations. Return `false` from this event and the confirmation will be cancelled.

Event | Details
--- | ---
**Name:** | `window:alert`
**Yields:** | the alert text **(String)**
**Description:** | Fires when your app calls the global `window.alert()` method. Cypress will auto accept alerts. You cannot change this behavior.

Event | Details
--- | ---
**Name:** | `window:before:load`
**Yields:** | the remote window **(Object)**
**Description:** | Fires as the page begins to load, but before any of your applications JavaScript has executed. This fires at the exact same time as `cy.visit()` `onBeforeLoad` callback. Useful to modify the window on a page transition.

Event | Details
--- | ---
**Name:** | `window:load`
**Yields:** | the remote window **(Object)**
**Description:** | Fires after all your resources have finished loading after a page transition. This fires at the exact same time as a `cy.visit()` `onLoad` callback.

Event | Details
--- | ---
**Name:** | `window:before:unload`
**Yields:** | the actual beforeunload event **(Object)**
**Description:** | Fires when your application is about to navigate away. The real event object is provided to you. Your app may have set a `returnValue` on the event, which is useful to assert on.

Event | Details
--- | ---
**Name:** | `window:unload`
**Yields:** | the actual unload event **(Object)**
**Description:** | Fires when your application is has unloaded and is navigating away. The real event object is provided to you. This event is not cancelable.

Event | Details
--- | ---
**Name:** | `url:changed`
**Yields:** | the new url **(String)**
**Description:** | Fires whenever Cypress detects that your application's URL has changed.

## Cypress Events

These events come from Cypress as it issues commands and reacts to their state. These are all useful to listen to for debugging purposes.

Event | Details
--- | ---
**Name:** | `fail`
**Yields:** | the error **(Object)**, mocha runnable **(Object)**
**Description:** | Fires when the test has failed. It is technically possible to prevent the test from actually failing by binding to this event and invoking an async `done` callback. However this is **strongly discouraged**. Tests should never legitimately fail. This event exists because its extremely useful for debugging purposes.

Event | Details
--- | ---
**Name:** | `viewport:changed`
**Yields:** | the new viewport **(Object)**
**Description:** | Fires whenever the viewport changes via a `cy.viewport()` or naturally when Cypress resets the viewport to the default between tests. Useful for debugging purposes.

Event | Details
--- | ---
**Name:** | `scrolled`
**Yields:** | the element or window being scrolled **(Object)**
**Description:** | Fires whenever **Cypress** is scrolling your application. This event is fired when Cypress is {% url 'waiting for and calculating actionability' interacting-with-elements %}. It will scroll to 'uncover' elements currently being covered. This event is extremely useful to debug why Cypress may think an element is not interactive.

Event | Details
--- | ---
**Name:** | `command:enqueued`
**Yields:** | command properties and arguments **(Object)**
**Description:** | Fires when a cy command is first invoked and enqueued to be run later. Useful for debugging purposes if you're confused about the order in which commands will execute.

Event | Details
--- | ---
**Name:** | `command:start`
**Yields:** | command instance **(Object)**
**Description:** | Fires when cy begins actually running and executing your command. Useful for debugging and understanding how the command queue is async.

Event | Details
--- | ---
**Name:** | `command:end`
**Yields:** | command instance **(Object)**
**Description:** | Fires when cy finishes running and executing your command. Useful for debugging and understanding how commands are handled.

Event | Details
--- | ---
**Name:** | `command:retry`
**Yields:** | retry options **(Object)**
**Description:** | Fires whenever a command begins its retrying routines. This is called on the trailing edge after Cypress has internally waited for the retry interval. Useful to understand **why** a command is retrying, and generally includes the actual error causing the retry to happen. When commands fail the final error is the one that actually bubbles up to fail the test. This event is essentially to debug why Cypress is failing.

Event | Details
--- | ---
**Name:** | `log:added`
**Yields:** | log attributes **(Object)**, whether Cypress is in interactive mode **(Boolean)**
**Description:** | Fires whenever a command emits this event so it can be displayed in the Command Log. Useful to see how internal cypress commands utilize the {% url 'Cypress.log()' cypress-log %} API.

Event | Details
--- | ---
**Name:** | `log:changed`
**Yields:** | log attributes **(Object)**, whether Cypress is in interactive mode **(Boolean)**
**Description:** | Fires whenever a command's attributes changes. This event is debounced to prevent it from firing too quickly and too often. Useful to see how internal cypress commands utilize the {% url 'Cypress.log()' cypress-log %} API.

Event | Details
--- | ---
**Name:** | `test:before:run`
**Yields:** | test attributes **(Object)**, runnable instance **(Object)**
**Description:** | Fires before the test and all **before** and **beforeEach** hooks run.

Event | Details
--- | ---
**Name:** | `test:after:run`
**Yields:** | test attributes **(Object)**, runnable instance **(Object)**
**Description:** | Fires after the test and all **afterEach** and **after** hooks run.

## Other Events

There are a myriad of other events Cypress fires to communicate with the node server process, automation servers, mocha, the runner, and the reporter. They are strictly internal to the way Cypress works and not useful for users.

# Binding to Events

Both the global `Cypress` and `cy` objects are standard `node.js` event emitters. That means you can use the following methods to bind and unbind from events.

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

# Examples

WIP.

# Notes

## Logging All Events

Cypress uses the {% url `debug` https://github.com/visionmedia/debug %} node module for both the backend server process, and for everything running in the browser (called the driver).

If you'd like to see (the huge) stream of events that Cypress emits you can pop open your Dev Tools and write this line in the console.

```javascript
localStorage.debug = "cypress:*"
```

After you refresh the page you'll see something that looks like this in your console:

{% img /img/api/catalog-of-events/console-log-events-debug.png "console log events for debugging" %}
