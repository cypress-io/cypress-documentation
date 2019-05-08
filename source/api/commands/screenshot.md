---
title: screenshot
---

Take a screenshot of the application under test and, optionally, the {% url "Cypress Command Log" test-runner#Command-Log %}.

# Syntax

```javascript
.screenshot()
.screenshot(fileName)
.screenshot(options)
.screenshot(fileName, options)

// ---or---

cy.screenshot()
cy.screenshot(fileName)
cy.screenshot(options)
cy.screenshot(fileName, options)
```

## Usage

**{% fa fa-check-circle green %} Correct Usage**

```javascript
cy.screenshot()
cy.get('.post').screenshot()
```

## Arguments

**{% fa fa-angle-right %} fileName** ***(String)***

A name for the image file. Will be relative to the {% url 'screenshots folder' configuration#Folders-Files %} and the path to the spec file. When passed a path, the folder structure will be created. See the {% url "Naming conventions" screenshot#Naming-conventions %} below for more.

**{% fa fa-angle-right %} options** ***(Object)***

Pass in an options object to change the default behavior of `.screenshot()`.

Option |Default | Description
--- | --- | ---
`log` | `true` | {% usage_options log %}
`blackout` | `[]` | Array of string selectors used to match elements that should be blacked out when the screenshot is taken. Does not apply to `runner` captures.
`capture` | `'fullPage'` | Which parts of the Test Runner to capture. This value is ignored for element screenshot captures. Valid values are `viewport`, `fullPage`, or `runner`. When `viewport`, the application under test is captured in the current viewport. When `fullPage`, the application under test is captured in its entirety from top to bottom. When `runner`, the entire browser viewport, including the Cypress Command Log, is captured.  For screenshots automatically taken on test failure, capture is always coerced to `runner`.
`clip` | `null` | Position and dimensions (in pixels) used to crop the final screenshot image. Should have the following shape: `{ x: 0, y: 0, width: 100, height: 100 }`
`disableTimersAndAnimations` | `true`| When true, prevents JavaScript timers (`setTimeout`, `setInterval`, etc) and CSS animations from running while the screenshot is taken.
`scale` | `false` | Whether to scale the app to fit into the browser viewport. This is always coerced to `true` when `capture` is `runner`.
`timeout` | {% url `responseTimeout` configuration#Timeouts %} | {% usage_options timeout .screenshot %}
`onBeforeScreenshot` | `null` | A callback before a non-failure screenshot is taken. When capturing screenshots of an element, the argument is the element being captured. For other screenshots, the argument is the `document`.
`onAfterScreenshot` | `null` | A callback after a non-failure screenshot is taken. When capturing  screenshots of an element, the first argument is the element being captured. For other screenshots, the first argument is the `document`. The second argument is properties concerning the screenshot, including the `path` it was saved to and the `dimensions` of the saved screenshot.

For more details on these options and to set some as defaults across all uses of `.screenshot()`, see the {% url 'Cypress.Screenshot API doc' screenshot-api %}.

## Yields {% helper_icon yields %}

{% yields same_subject .screenshot %}

# Examples

The screenshot will be stored in the `cypress/screenshots` folder by default. You can change the directory where screenshots are saved in your {% url 'configuration' configuration#Folders-Files %}.

## No Args

### Take a screenshot

```javascript
// cypress/integration/users.spec.js

describe('my tests', function () {
  it('takes a screenshot', function () {
    // screenshot will be saved as
    // cypress/screenshots/users.spec.js/my tests -- takes a screenshot.png
    cy.screenshot()
  })
})
```

## Filename

### Take a screenshot and save as a specific filename

```javascript
// screenshot will be saved as
// cypress/screenshots/spec.js/clicking-on-nav.png
cy.screenshot('clicking-on-nav')
```

### Take a screenshot and save in a specific directory

```javascript
// screenshot will be saved as
// cypress/screenshots/spec.js/actions/login/clicking-login.png
cy.screenshot('actions/login/clicking-login')
```

## Clip

### Crop a screenshot to a specific position and size

```javascript
// screenshot will be clipped 20px from the top and left
// to the dimensions 400px x 300px
cy.screenshot({ x: 20, y: 20, width: 400, height: 300 })
```

## Screenshot an element

### Take a screenshot of the first `.post` element

```javascript
cy.get('.post').first().screenshot()
```

### Chain off the screenshot to click the element captured

```javascript
cy.get('button').first().screenshot().click()
```

## Get screenshot info from the `onAfterScreenshot` callback

```javascript
cy.screenshot('my-screenshot', {
  onAfterScreenshot ($el, props) {
    // props has information about the screenshot,
    // including but not limited to the following:

    // {
    //   name: 'my-screenshot',
    //   path: '/Users/janelane/project/screenshots/spec.js/my-screenshot.png',
    //   size: '15 kb',
    //   dimensions: {
    //     width: 1000,
    //     height: 660,
    //   },
    //   scaled: true,
    //   blackout: [],
    //   duration: 2300,
    // }
  },
})
```

# Notes

## Naming conventions

Screenshot naming follows these rules:

* By default, a screenshot is saved to a file with a path relative to the {% url 'screenshots folder' configuration#Folders-Files %}, appended by a path relating to where the spec file exists, with a name including the current test's suites and test name: `{screenshotsFolder}/{specPath}/{testName}.png`
* For a named screenshot, the name is used instead of the suites and test name: `{screenshotsFolder}/{specPath}/{name}.png`
* For any duplicate screenshots (named or not), they will be appended with a number: `{screenshotsFolder}/{specPath}/{testName} (1).png`
* For a failure screenshot, the default naming scheme is used and the name is appended with ` (failed)`: `{screenshotsFolder}/{specPath}/{testName} (failed).png`

For example, given a spec file located at `cypress/integration/users/login_spec.js`:

```javascript
describe('my tests', function () {
  it('takes a screenshot', function () {
    cy.screenshot() // cypress/screenshots/users/login_spec.js/my tests -- takes a screenshot.png
    cy.screenshot() // cypress/screenshots/users/login_spec.js/my tests -- takes a screenshot (1).png
    cy.screenshot() // cypress/screenshots/users/login_spec.js/my tests -- takes a screenshot (2).png

    cy.screenshot('my-screenshot') // cypress/screenshots/users/login_spec.js/my-screenshot.png
    cy.screenshot('my-screenshot') // cypress/screenshots/users/login_spec.js/my-screenshot (1).png

    cy.screenshot('my/nested/screenshot') // cypress/screenshots/users/login_spec.js/my/nested/screenshot.png

    // if this test fails, the screenshot will be saved to cypress/screenshots/users/login_spec.js/my tests -- takes a screenshot (failed).png
  })
})
```

## `after:screenshot` plugin event

You can get details about any given screenshot and manipulate it after it has been written to disk with the {% url '`after:screenshot` plugin event' after-screenshot-api %}.

## Test Failures

### Automatic screenshots on test failure

When running through `cypress run` or in {% url 'Continuous Integration' continuous-integration %}, Cypress automatically takes a screenshot when a test fails. You can optionally turn this off by setting `screenshotOnRunFailure` to `false` within {% url 'Cypress.Screenshot.defaults()' screenshot-api %}.

## Viewing Screenshots

### Screenshots in CI

You can see screenshots taken during a CI run in the {% url 'Dashboard Service' https://on.cypress.io/dashboard %} without any extra work.

Alternatively, to see screenshots in your Continuous Integration UI, most CI providers document a way to export the screenshots as artifacts and to make them available. Please see their appropriate documentation.

## Asynchronous

### Understanding when the screenshot is taken

Taking a screenshot is an asynchronous action that takes around `100ms` to complete. By the time the screenshot is taken, *it is possible something in your application may have changed*. It is important to realize that the screenshot may not reflect what your application looked like 100% when the command was issued.

For example - say a command we wrote timed out: {% url "`cy.get('#element')`" get %}. This causes your test to fail. Cypress then automatically takes a screenshot when the test fails, but it is possible something in your application changed within this `100ms` timeframe. Hypothetically, your app could render the element you were originally expecting to be present. When this happens, the screenshot may provide confusing results. It is unlikely, but theoretically possible.

Another potential problem to be aware of is that our own Command Log is using React under the hood and only rendering asynchronously during an animation frame. It is possible you will see screenshots taken before our Command Log is done rendering. This means you may not see the **error displayed** in the screenshot. But this is also why we take a video - to show you the complete failure.

We make our best effort to synchronize taking a screenshot with our renderer, but the current state of your application under test could have changed in the meantime and not be an accurate representation of what you want to capture.

## Full page captures and fixed/sticky elements

When passing `fullPage` to the `capture` option, Cypress scrolls the application under test from top to bottom, takes screenshots at each point and stitches them together. Due to this, elements that are `position: fixed` or `position: sticky` will appear multiple times in the final screenshot. To prevent this, in most cases you can programmatically change the element to be `position: absolute` before the screenshot and change it back afterwards like shown below:

```javascript
cy.get('.sticky-header').invoke('css', 'position', 'absolute')
cy.screenshot()
cy.get('.sticky-header').invoke('css', 'position', null)
```

# Rules

## Requirements {% helper_icon requirements %}

{% requirements dual_existence_single_dom cy.screenshot %}

## Assertions {% helper_icon assertions %}

{% assertions once cy.screenshot %}

## Timeouts {% helper_icon timeout %}

{% timeouts automation cy.screenshot %}

# Command Log

### Take a screenshot with a specific filename

```javascript
cy.screenshot('my-image')
```

The commands above will display in the Command Log as:

![Command Log](/img/api/screenshot/command-log-shows-name-of-screenshot-taken.png)

When clicking on `screenshot` within the command log, the console outputs the following:

![Console Log](/img/api/screenshot/console-logs-exactly-where-screenshot-was-saved-in-file-system.png)

# See also

- {% url `Cypress.Screenshot` screenshot-api %}
- {% url 'After Screenshot API' after-screenshot-api %}
- {% url `cy.debug()` debug %}
- {% url 'Dashboard Service' dashboard-service %}
- {% url 'Screenshots and Videos' screenshots-and-videos %}
- {% url `.pause()` pause %}
