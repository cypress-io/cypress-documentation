---
title: Cypress.Screenshot
---

The Screenshot API allows you set defaults for how screenshots are captured
during [.screenshot](/api/commands/screenshot) and automatic screenshots taken
during test failures. You can set defaults for the following:

- Which parts of the screen to capture.
- Whether to scale your application under test in the screenshot.
- Whether to disable JavaScript timers and CSS animations when taking the
  screenshot.
- Whether to automatically take screenshots when there are run failures.
- Which, if any, elements to black out when taking the screenshot.
- Whether to wait for the Command Log to synchronize before taking the
  screenshot.

## Syntax

```javascript
Cypress.Screenshot.defaults(options)
```

### Arguments

**<Icon name="angle-right"></Icon> options** **_(Object)_**

An object containing one or more of the following:

| Option                       | Default      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ---------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `blackout`                   | `[]`         | Array of string selectors used to match elements that should be blacked out when the screenshot is taken. Does not apply to `runner` captures.                                                                                                                                                                                                                                                                                                                                                                                         |
| `capture`                    | `'fullPage'` | Which parts of the Cypress Test Runner to capture. This value is ignored for element screenshot captures. Valid values are `viewport`, `fullPage`, or `runner`. When `viewport`, your application under test is captured in the current viewport. When `fullPage`, your application under test is captured in its entirety from top to bottom. When `runner`, the entire browser viewport, including the Cypress Command Log, is captured. For screenshots automatically taken on test failure, capture is always coerced to `runner`. |
| `disableTimersAndAnimations` | `true`       | When true, prevents JavaScript timers (`setTimeout`, `setInterval`, etc) and CSS animations from running while the screenshot is taken.                                                                                                                                                                                                                                                                                                                                                                                                |
| `scale`                      | `false`      | Whether to scale the app to fit into the browser viewport. This is always coerced to `true` for `runner` captures.                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `screenshotOnRunFailure`     | `true`       | When true, automatically takes a screenshot when there is a failure during `cypress run`.                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `overwrite`                  | `false`      | Whether to overwrite duplicate screenshot files with the same file name when saving.                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `onBeforeScreenshot`         | `null`       | A callback before a (non-failure) screenshot is taken. For an element capture, the argument is the element being captured. For other screenshots, the argument is the `$el`.                                                                                                                                                                                                                                                                                                                                                           |
| `onAfterScreenshot`          | `null`       | A callback after a (non-failure) screenshot is taken. For an element capture, the first argument is the element being captured. For other screenshots, the first argument is the `$el`. The second argument is properties concerning the screenshot, including the path it was saved to and the dimensions of the saved screenshot.                                                                                                                                                                                                    |

## Examples

### Blackout elements before screenshot

Elements that match the specified selectors will be blacked out from the
screenshot, but only when the `capture` option is `viewport`. `blackout` is
ignored if `capture` option is `runner`.

```javascript
Cypress.Screenshot.defaults({
  blackout: ['.secret-info', '[data-hide=true]'],
})
```

### Take a screenshot of the entire Cypress browser window

By default, [`cy.screenshot()`](/api/commands/screenshot) only captures your
application under test. You may want it to capture the entire Cypress browser
for debugging purposes.

```javascript
Cypress.Screenshot.defaults({
  capture: 'runner',
})
```

### Allow timers and animations to keep running

By default, JavaScript timers and CSS animations are disabled to try to prevent
changes to your application under test while the screenshot is taken, but you
can turn off this behavior.

```javascript
Cypress.Screenshot.defaults({
  disableTimersAndAnimations: false,
})
```

### Disable screenshots on run failures

By default, Cypress automatically takes a screenshot when there is a failure
when running `cypress run`, but you can disable this.

```javascript
Cypress.Screenshot.defaults({
  screenshotOnRunFailure: false,
})
```

### Overwrite existing screenshots

By default, Cypress saves unique screenshot files for every screenshot that is
taken within the same test. You can choose to overwrite existing screenshots
with the same file name using the `overwrite` option.

```javascript
Cypress.Screenshot.defaults({
  overwrite: true,
})
```

### Scale `viewport` and `fullPage` captures

By default, scaling the application under test is turned off during when the
`capture` option is `viewport` to prevent differences between screenshots on
screens with different resolutions. You can turn scaling on and have your app
scaled like it is during normal use of Cypress. This is always coerced to `true`
if the `capture` option is `runner`.

```javascript
Cypress.Screenshot.defaults({
  scale: true,
})
```

### Change the DOM using `onBeforeScreenshot` and `onAfterScreenshot`

The `onBeforeScreenshot` and `onAfterScreenshot` callbacks provide an
opportunity to synchronously change the DOM to create a more consistent state
for the screenshot.

In this example, imagine there is a clock in your app showing the current time.
This can cause screenshots to be non-deterministic, which could create false
negatives when screenshot diffing. You can use `onBeforeScreenshot` to hide the
clock and then show it again with `onAfterScreenshot`.

```javascript
Cypress.Screenshot.defaults({
  onBeforeScreenshot($el) {
    const $clock = $el.find('.clock')

    if ($clock) {
      $clock.hide()
    }
  },

  onAfterScreenshot($el, props) {
    const $clock = $el.find('.clock')

    if ($clock) {
      $clock.show()
    }
  },
})
```

### Get properties from the `onAfterScreenshot` callback

```javascript
Cypress.Screenshot.defaults({
  onAfterScreenshot($el, props) {
    // props has information about the screenshot,
    // including but not limited to the following:
    // {
    //   path: '/Users/janelane/project/screenshots/my-screenshot.png',
    //   size: '15 kb',
    //   dimensions: {
    //     width: 1000,
    //     height: 660,
    //   },
    //   scaled: true,
    //   blackout: ['.foo'],
    //   duration: 2300,
    // }
  },
})
```

## Notes

#### Where to put screenshot configuration

::include{file=partials/support-file-configuration.md}

## History

| Version                                     | Changes                                 |
| ------------------------------------------- | --------------------------------------- |
| [8.7.0](/guides/references/changelog#8-7-0) | Added `overwrite` configuration option. |

## See also

- [cy.screenshot()](/api/commands/screenshot)
- [Dashboard Service](/guides/dashboard/introduction)
- [Screenshots and Videos](/guides/guides/screenshots-and-videos)
- [Visual Testing](/guides/tooling/visual-testing)
