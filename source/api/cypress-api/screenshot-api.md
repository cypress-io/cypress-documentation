---
title: Cypress.Screenshot
comments: false
---

The Screenshot API allows you to:

- Control which parts of the Cypress UI are captured
- Control whether to scale your app in the screenshot
- Disable timers and animations when taking the screenshot
- Automatically take screenshots when there are run failures
- Blackout certain elements when taking the screenshot
- Wait for the command log to sync up before taking the screenshot

# Syntax

```javascript
Cypress.Screenshot.defaults(options)
```

## Arguments

**{% fa fa-angle-right %} options**  ***(Object)***

An object containing one or more of the following:

Option | Accepts | Default | Description
--- | --- | --- | ---
`blackout` | `array of strings` | `[]` | Selectors for elements that should be blacked out when the screenshot is taken.
`capture` | `array of strings` | `['all']` | Which parts of the UI to capture. Options are `all` and `app`. When `all`, the Entire browser viewport, including the Cypress UI, is captured. When `app`, only your app is captured. Can be an array with both and 2 screenshots will be taken.
`disableTimersAndAnimations` | `boolean` | `true`| When true, disables JavaScript timers (`setTimeout`, `setInterval`, etc) and CSS animations from running while the screenshot is taken.
`screenshotOnRunFailure` | `boolean` | `true` | When true, automatically takes a screenshot when there is a failure in Run mode
`scaleAppCaptures` | `boolean` | `false` | When true and capturing the `app`, will scale the app to fit into the browser viewport.
`waitForCommandSynchronization` | `boolean` | `true` | When true, makes a best effort to sync the command log, showing the last run command.

# Examples

## Blackout elements before screenshot

Elements that match the selectors specified will be blacked out from the screenshot.

```javascript
Cypress.SelectorPlayground.defaults({
  blackout: ['.secret-info', '[data-hide=true]']
})
```

## Take two screenshots, capturing different amounts of the UI 

The following will take two screenshots. The first will be just your app. The second will be your app with the Cypress UI around it.

```javascript
Cypress.SelectorPlayground.defaults({
  capture: ['app', 'all']
})
```

## Allow timers and animations to keep running

While we recommend the default of disabling timers and animations while taking a screenshot, you can turn this off.

```javascript
Cypress.SelectorPlayground.defaults({
  disableTimersAndAnimations: false
})
```

## Disable screenshots on Run failures

Turn off automatically taking a screenshot when there's a failure in Run mode.

```javascript
Cypress.SelectorPlayground.defaults({
  screenshotOnRunFailure: false
})
```

## Scale 'app' captures

When capturing your app, scale the app the way it's scaled when capturing all.

```javascript
Cypress.SelectorPlayground.defaults({
  scaleAppCaptures: true
})
```

## Disable waiting for command synchronization

By default, Cypress makes a best effort to wait until the command log is synchronized before taking a screenshot. This is useful because it shows the current state of the test runner in the screenshot, but the current state of your app could change in the meantime and not be an accurate representation of what you desire to screenshot. Turn off the command log synchronization to get a more accurate screenshot of your app.

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
