---
title: Catalog of Events
comments: false
---

Here's the complete list of Cypress events emitted.

You can use the accompanying {% url "`on`" on %}, {% url "`once`" once %}, {% url "`removeListener`" removelistener %} and {% url "`removeAllListeners`" removealllisteners %} methods on either the `Cypress` or `cy` (automatically unbound between tests) object to work with these events.

## Events

Event | Args | Description
----- | ---- | ----------
`"app:scrolled"` | subject, subject type | When app under test is scrolled
`"before:window:load"` | window |
`"before:window:unload"` | beforeUnload event |
`"canceled"` | |
`"collect:run:state"` | |
`"command:enqueued"` | command |
`"command:end"` | command |
`"command:queue:before:end"` | - |
`"command:queue:end"` | - |
`"command:retry"` | command | When command is retried
`"command:start"` | command |
`"fail"` | error, runnable | When test has failed
`"form:submitted"` | |
`"log:added"` | command, event | When log added to Command Log
`"log:changed"` | command, event |
`"navigation:changed"` | eventName |
`"next:subject:prepared"` | subject, jQuery wrapped subject |
`"page:loading"` | bool |
`"paused"` | | When test is paused using {% url `cy.pause()` pause %}
`"runnable:after:run:async"` | log, runnable |
`"script:error"` | |
`"stability:changed"` | bool, eventName |
`"test:after:run"` | log, runnable |
`"test:before:run"` | log, runnable |
`"test:before:run:async"` | log, runnable |
`"test:set:state"` | log, function |
`"uncaught:exception"` | error, runnable | When uncaught exception is thrown
`"url:changed"` | url |
`"viewport:changed"` | viewport sizes, function |
`"visit:failed"` | |
`"window:alert"` | event, message |
`"window:confirm"` | string |
`"window:load"` | window |
`"window:unload"` | unload event |
