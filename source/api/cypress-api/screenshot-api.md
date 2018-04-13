---
title: Cypress.Screenshot
comments: false
---

The Screenshot API allows you set defaults for how screenshots are captured. You can set defaults for the following:

- Which parts of the Cypress UI are captured
- Whether to scale your app in the screenshot
- Whether to disable timers and animations when taking the screenshot
- Whether to automatically take screenshots when there are run failures
- Which, if any, elements to black out when taking the screenshot
- Whether to wait for the command log to synchronize before taking the screenshot

# Syntax

```javascript
Cypress.Screenshot.defaults(options)
```

## Arguments

**{% fa fa-angle-right %} options**  ***(Object)***

An object containing one or more of the following:

Option | Accepts | Default | Description
--- | --- | --- | ---
`blackout` | `array of strings` | `[]` | Selectors for elements that should be blacked out when the screenshot is taken. Only applies to `app` captures.
`capture` | `string` | `'app'` | Which parts of the UI to capture. Valid values are `'runner'`, `'app'`. When `runner`, the entire browser viewport, including the Cypress UI, is captured. When `app`, only your app is captured. For test failure screenshots, capture is always coerced to `'runner'`.
`disableTimersAndAnimations` | `boolean` | `true`| When true, disables JavaScript timers (`setTimeout`, `setInterval`, etc) and CSS animations from running while the screenshot is taken.
`screenshotOnRunFailure` | `boolean` | `true` | When true, automatically takes a screenshot when there is a failure in Run mode.
`scaleAppCaptures` | `boolean` | `false` | When true and capturing the `app`, will scale the app to fit into the browser viewport. Only applies to `app` captures.
`waitForCommandSynchronization` | `boolean` | `true` | When true, makes a best effort to sync the command log, showing the last run command. Only applies to `runner` captures.

# Examples

## Blackout elements before screenshot

Elements that match the selectors specified will be blacked out from the screenshot, but only for a `app` capture. `blackout` is ignored for `runner` captures.

```javascript
Cypress.SelectorPlayground.defaults({
  blackout: ['.secret-info', '[data-hide=true]']
})
```

## Take a screenshot of the entire Cypress UI

By default, {% url `cy.screenshot()` screenshot %} only captures your app. You may want it to capture the entire Cypress UI for debugging purposes.

```javascript
Cypress.SelectorPlayground.defaults({
  capture: 'runner'
})
```

## Allow timers and animations to keep running

By default, timers and animations are disabled to try and prevent changes to your app while the screenshot is taken, but you can turn off this behavior.

```javascript
Cypress.SelectorPlayground.defaults({
  disableTimersAndAnimations: false
})
```

## Disable screenshots on Run failures

By default, Cypress takes a screenshots when there is a failure during Run mode, but you can disable this.

```javascript
Cypress.SelectorPlayground.defaults({
  screenshotOnRunFailure: false
})
```

## Scale 'app' captures

By default, app scaling is turned off during `app` captures to prevent differences between screenshots on screens with different resolutions. You can turn it on and have your app scaled like it is during normal use of Cypress. This is ignored during `runner` captures.

```javascript
Cypress.SelectorPlayground.defaults({
  scaleAppCaptures: true
})
```

## Disable waiting for command synchronization

By default, when taking a `runner` capture, Cypress makes a best effort to wait until the command log is synchronized before taking a screenshot. This is useful because it shows the current state of the test runner in the screenshot, but the current state of your app could change in the meantime and not be an accurate representation of what you desire to screenshot. Turn off the command log synchronization to get a more accurate screenshot of your app. This is ignored during `app` captures.

```javascript
Cypress.SelectorPlayground.defaults({
  waitForCommandSynchronization: false
})
```

# Notes

**Where to put screenshot configuration**

A great place to put this configuration is in your `cypress/support/index.js` file, since it is loaded before any test files are evaluated.

# See also

- {% url `cy.screenshot()` screenshot %}
