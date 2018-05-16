---
title: Cypress.Screenshot
comments: false
---

The Screenshot API allows you set defaults for how screenshots are captured during {% url "`.screenshot`" screenshot %} and automatic screenshots taken during test failures. You can set defaults for the following:

- Which parts of the screen to capture.
- Whether to scale your application under test in the screenshot.
- Whether to disable JavaScript timers and CSS animations when taking the screenshot.
- Whether to automatically take screenshots when there are run failures.
- Which, if any, elements to black out when taking the screenshot.
- Whether to wait for the Command Log to synchronize before taking the screenshot.

# Syntax

```javascript
Cypress.Screenshot.defaults(options)
```

## Arguments

**{% fa fa-angle-right %} options**  ***(Object)***

An object containing one or more of the following:

Option | Default | Description
--- | --- | ---
`blackout` | `[]` | Selectors for elements that should be blacked out when the screenshot is taken. Does not apply to `runner` captures.
`capture` | `'fullpage'` | Which parts of the Test Runner to capture. This value is ignored for element screenshot captures. Valid values are `app`, `fullpage`, or `runner`. When `app`, your application under test is captured in the current viewport. When `fullpage`, your application under test is captured in its entirety from top to bottom. When `runner`, the entire browser viewport, including the Cypress Command Log, is captured.  For screenshots automatically taken on test failure, capture is always coerced to `runner`. 
`disableTimersAndAnimations` | `true`| When true, prevents JavaScript timers (`setTimeout`, `setInterval`, etc) and CSS animations from running while the screenshot is taken.
`scaleAppCaptures` | `false` | Whether to scale the app to fit into the browser viewport when `capture` option is `app` or `fullpage`.
`screenshotOnRunFailure` | `true` | When true, automatically takes a screenshot when there is a failure in Run mode.
`waitForCommandSynchronization` | `true` | Whether to make an effort to sync the command log, showing the latest command run, when `capture` option is `runner`.

# Examples

## Blackout elements before screenshot

Elements that match the specified selectors will be blacked out from the screenshot, but only when the `capture` option is `app`. `blackout` is ignored is `capture` is `runner`.

```javascript
Cypress.SelectorPlayground.defaults({
  blackout: ['.secret-info', '[data-hide=true]']
})
```

## Take a screenshot of the entire Test Runner

By default, {% url `cy.screenshot()` screenshot %} only captures your application under test. You may want it to capture the entire Test Runner for debugging purposes.

```javascript
Cypress.SelectorPlayground.defaults({
  capture: 'runner'
})
```

## Allow timers and animations to keep running

By default, JavaScript timers and CSS animations are disabled to try to prevent changes to your application under test while the screenshot is taken, but you can turn off this behavior.

```javascript
Cypress.SelectorPlayground.defaults({
  disableTimersAndAnimations: false
})
```

## Disable screenshots on run failures

By default, Cypress automatically takes a screenshot when there is a failure when running `cypress run`, but you can disable this.

```javascript
Cypress.SelectorPlayground.defaults({
  screenshotOnRunFailure: false
})
```

## Scale 'app' captures

By default, scaling the application under test is turned off during when the `capture` option is `app` to prevent differences between screenshots on screens with different resolutions. You can turn scaling on and have your app scaled like it is during normal use of Cypress. This is ignored if the `capture` option is `runner`.

```javascript
Cypress.SelectorPlayground.defaults({
  scaleAppCaptures: true
})
```

## Disable waiting for command synchronization

By default, when taking the `capture` option is `runner`, Cypress makes its best effort to wait until the Command Log is synchronized before taking a screenshot. This is useful because it shows the current state of the Test Runner in the screenshot, but the current state of your application under test could have changed in the meantime and not be an accurate representation of what you want to capture. Turn off the command log synchronization to get a more accurate screenshot of your application under test. This is ignored if the `capture` option is `app`.

```javascript
Cypress.SelectorPlayground.defaults({
  waitForCommandSynchronization: false
})
```

# Notes

### Where to put screenshot configuration

A great place to put this configuration is in your {% url "`cypress/support/index.js` file" writing-and-organizing-tests#Support-file %}, since it is loaded before any test files are evaluated.

# See also

- {% url "`cy.screenshot()`" screenshot %}
- {% url 'Dashboard Service' dashboard-service %}
- {% url 'Screenshots and Videos' screenshots-and-videos %}
