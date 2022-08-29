---
title: screenshot
---

Take a screenshot of the application under test and, optionally, the
[Cypress Command Log](/guides/core-concepts/cypress-app#Command-Log).

## Syntax

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

### Usage

**<Icon name="check-circle" color="green"></Icon> Correct Usage**

```javascript
cy.screenshot()
cy.get('.post').screenshot()
```

### Arguments

**<Icon name="angle-right"></Icon> fileName** **_(String)_**

A name for the image file. Will be relative to the
[screenshots folder](/guides/references/configuration#Folders-Files) and the
path to the spec file. When passed a path, the folder structure will be created.
See the [Naming conventions](/api/commands/screenshot#Naming-conventions) below
for more.

**<Icon name="angle-right"></Icon> options** **_(Object)_**

Pass in an options object to change the default behavior of `.screenshot()`.

| Option                       | Default                                                        | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `log`                        | `true`                                                         | Displays the command in the [Command log](/guides/core-concepts/cypress-app#Command-Log)                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `blackout`                   | `[]`                                                           | Array of string selectors used to match elements that should be blacked out when the screenshot is taken. Does not apply to `runner` captures.                                                                                                                                                                                                                                                                                                                                                                                       |
| `capture`                    | `'fullPage'`                                                   | Which parts of the Cypress Test Runner to capture. This value is ignored for element screenshot captures. Valid values are `viewport`, `fullPage`, or `runner`. When `viewport`, the application under test is captured in the current viewport. When `fullPage`, the application under test is captured in its entirety from top to bottom. When `runner`, the entire browser viewport, including the Cypress Command Log, is captured. For screenshots automatically taken on test failure, capture is always coerced to `runner`. |
| `clip`                       | `null`                                                         | Position and dimensions (in pixels) used to crop the final screenshot image. Should have the following shape: `{ x: 0, y: 0, width: 100, height: 100 }`                                                                                                                                                                                                                                                                                                                                                                              |
| `disableTimersAndAnimations` | `true`                                                         | When true, prevents JavaScript timers (`setTimeout`, `setInterval`, etc) and CSS animations from running while the screenshot is taken.                                                                                                                                                                                                                                                                                                                                                                                              |
| `padding`                    | `null`                                                         | Padding used to alter the dimensions of a screenshot of an element. It can either be a number, or an array of up to four numbers [using CSS shorthand notation](https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties). This property is only applied for element screenshots and is ignored for all other types.                                                                                                                                                                                                    |
| `scale`                      | `false`                                                        | Whether to scale the app to fit into the browser viewport. This is always coerced to `true` when `capture` is `runner`.                                                                                                                                                                                                                                                                                                                                                                                                              |
| `timeout`                    | [`responseTimeout`](/guides/references/configuration#Timeouts) | Time to wait for `.screenshot()` to resolve before [timing out](#Timeouts)                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `overwrite`                  | `false`                                                        | Whether to overwrite duplicate screenshot files with the same file name when saving.                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `onBeforeScreenshot`         | `null`                                                         | A callback before a non-failure screenshot is taken. When capturing screenshots of an element, the argument is the element being captured. For other screenshots, the argument is the `document`.                                                                                                                                                                                                                                                                                                                                    |
| `onAfterScreenshot`          | `null`                                                         | A callback after a non-failure screenshot is taken. When capturing screenshots of an element, the first argument is the element being captured. For other screenshots, the first argument is the `document`. The second argument is properties concerning the screenshot, including the `path` it was saved to and the `dimensions` of the saved screenshot.                                                                                                                                                                         |

For more details on these options and to set some as defaults across all uses of
`.screenshot()`, see the
[Cypress.Screenshot API doc](/api/cypress-api/screenshot-api).

### Yields [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Subject-Management)

<List><li>`.screenshot()` yields the same subject it was given from the previous
command.</li></List>

## Examples

The screenshot will be stored in the `cypress/screenshots` folder by default.
You can change the directory where screenshots are saved in the
[Cypress configuration](/guides/references/configuration#Folders-Files).

### No Args

#### Take a screenshot

```javascript
// cypress/e2e/users.cy.js

describe('my tests', () => {
  it('takes a screenshot', () => {
    // screenshot will be saved as
    // cypress/screenshots/users.cy.js/my tests -- takes a screenshot.png
    cy.screenshot()
  })
})
```

### Filename

#### Take a screenshot and save as a specific filename

```javascript
// screenshot will be saved as
// cypress/screenshots/spec.cy.js/clicking-on-nav.png
cy.screenshot('clicking-on-nav')
```

#### Take a screenshot and save in a specific directory

```javascript
// screenshot will be saved as
// cypress/screenshots/spec.cy.js/actions/login/clicking-login.png
cy.screenshot('actions/login/clicking-login')
```

### Clip

#### Crop a screenshot to a specific position and size

```javascript
// screenshot will be clipped 20px from the top and left
// to the dimensions 400px x 300px
cy.screenshot({ clip: { x: 20, y: 20, width: 400, height: 300 } })
```

### Screenshot an element

#### Take a screenshot of the first `.post` element

```javascript
cy.get('.post').first().screenshot()
```

#### Take a screenshot of the first `.post` element with 10px of padding around it

```javascript
cy.get('.post').first().screenshot({ padding: 10 })
```

#### Chain off the screenshot to click the element captured

```javascript
cy.get('button').first().screenshot().click()
```

### Get screenshot info from the `onAfterScreenshot` callback

```javascript
cy.screenshot('my-screenshot', {
  onAfterScreenshot($el, props) {
    // props has information about the screenshot,
    // including but not limited to the following:
    // {
    //   name: 'my-screenshot',
    //   path: '/Users/janelane/project/screenshots/spec.cy.js/my-screenshot.png',
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

## Notes

### Naming conventions

Screenshot naming follows these rules:

- Screenshots are saved inside the
  [screenshots folder](/guides/core-concepts/writing-and-organizing-tests#Asset-File-Paths).
  Inside that folder, the screenshot is saved inside a folder structure relative
  to the path of the spec file, which is adjusted to remove any common ancestor
  paths shared with all other spec files. Inside this folder, the screenshot
  will be saved with the test name:
  `{screenshotsFolder}/{adjustedSpecPath}/{testName}.png`
- For a named screenshot, the name is used instead of the suites and test name:
  `{screenshotsFolder}/{adjustedSpecPath}/{name}.png`
- For any duplicate screenshots (named or not), they will be appended with a
  number: `{screenshotsFolder}/{adjustedSpecPath}/{testName} (1).png`.

<Alert type="info">

This behavior can be changed by passing the `{overwrite: true}` option to
`cy.screenshot()` to explicitly overwrite duplicate screenshots.

</Alert>

- For a failure screenshot, the default naming scheme is used and the name is
  appended with ` (failed)`:
  ```javascript
  {screenshotsFolder}/{adjustedSpecPath}/{testName} (failed).png
  ```

For example, given a spec file located at `cypress/e2e/users/login.cy.js`:

```javascript
describe('my tests', () => {
  it('takes a screenshot', () => {
    // NOTE: This file has multiple screenshots
    // each screenshot has a common ancestor path of `/users/`.
    // In this scenario `/users/` is stripped from the path.
    // cypress/screenshots/login.cy.js/my tests -- takes a screenshot.png
    cy.screenshot()
    // cypress/screenshots/login.cy.js/my tests -- takes a screenshot (1).png
    cy.screenshot()
    // cypress/screenshots/login.cy.js/my tests -- takes a screenshot (2).png
    cy.screenshot()

    // cypress/screenshots/login.cy.js/my-screenshot.png
    cy.screenshot('my-screenshot')
    // cypress/screenshots/login.cy.js/my-screenshot (1).png
    cy.screenshot('my-screenshot')
    // cypress/screenshots/login.cy.js/my/nested/screenshot.png
    cy.screenshot('my/nested/screenshot')

    // if this test fails, the screenshot will be saved to
    // cypress/screenshots/login.cy.js/my tests -- takes a screenshot (failed).png
  })
})
```

<Alert type="info">

To learn more about how to write and organize tests and how assets are saved,
see
[Writing And Organizing Tests](/guides/core-concepts/writing-and-organizing-tests#Asset-Files)

</Alert>

### `after:screenshot` plugin event

You can get details about any given screenshot and manipulate it after it has
been written to disk with the
[`after:screenshot` plugin event](/api/plugins/after-screenshot-api).

### Test Failures

#### Automatic screenshots on test failure

When running through `cypress run` or in
[Continuous Integration](/guides/continuous-integration/introduction), Cypress
automatically takes a screenshot when a test fails. You can optionally turn this
off by setting `screenshotOnRunFailure` to `false` within your
[`screenshotOnRunFailure`](/guides/references/configuration#Screenshots) or
[Cypress.Screenshot.defaults()](/api/cypress-api/screenshot-api).

### Viewing Screenshots

#### Screenshots in CI

You can see screenshots taken during a CI run in the
[Dashboard Service](https://on.cypress.io/dashboard) without any extra work.

Alternatively, to see screenshots in your Continuous Integration UI, most CI
providers document a way to export the screenshots as artifacts and to make them
available. Please see their appropriate documentation.

### Asynchronous

#### Understanding when the screenshot is taken

Taking a screenshot is an asynchronous action that takes around `100ms` to
complete. By the time the screenshot is taken, _it is possible something in your
application may have changed_. It is important to realize that the screenshot
may not reflect what your application looked like 100% when the command was
issued.

For example - say a command we wrote timed out:
[`cy.get('#element')`](/api/commands/get). This causes your test to fail.
Cypress then automatically takes a screenshot when the test fails, but it is
possible something in your application changed within this `100ms` timeframe.
Hypothetically, your app could render the element you were originally expecting
to be present. When this happens, the screenshot may provide confusing results.
It is unlikely, but theoretically possible.

Another potential problem to be aware of is that our own Command Log is using
React under the hood and only rendering asynchronously during an animation
frame. It is possible you will see screenshots taken before our Command Log is
done rendering. This means you may not see the **error displayed** in the
screenshot. But this is also why we take a video - to show you the complete
failure.

We make our best effort to synchronize taking a screenshot with our renderer,
but the current state of your application under test could have changed in the
meantime and not be an accurate representation of what you want to capture.

### Full page captures and fixed/sticky elements

When passing `fullPage` to the `capture` option, Cypress scrolls the application
under test from top to bottom, takes screenshots at each point and stitches them
together. Due to this, elements that are `position: fixed` or `position: sticky`
will appear multiple times in the final screenshot. To prevent this, in most
cases you can programmatically change the element to be `position: absolute`
before the screenshot and change it back afterwards like shown below:

```javascript
cy.get('.sticky-header').invoke('css', 'position', 'absolute')
cy.screenshot()
cy.get('.sticky-header').invoke('css', 'position', null)
```

## Rules

### Requirements [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Chains-of-Commands)

- `cy.screenshot()` can be chained off of `cy` or off a command that yields a
  single DOM element.

### Assertions [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Assertions)

- `cy.screenshot()` will only run assertions you have chained once, and will not
  [retry](/guides/core-concepts/retry-ability).

### Timeouts [<Icon name="question-circle"/>](/guides/core-concepts/introduction-to-cypress#Timeouts)

- `cy.screenshot()` should never time out.

<Alert type="warning">

Because `cy.screenshot()` is asynchronous it is technically possible for there
to be a timeout while talking to the internal Cypress automation APIs. But for
practical purposes it should never happen.

</Alert>

## Command Log

#### Take a screenshot with a specific filename

```javascript
cy.screenshot('my-image')
```

The commands above will display in the Command Log as:

<DocsImage src="/img/api/screenshot/command-log-shows-name-of-screenshot-taken.png" alt="Command Log screenshot" ></DocsImage>

When clicking on `screenshot` within the command log, the console outputs the
following:

<DocsImage src="/img/api/screenshot/console-logs-exactly-where-screenshot-was-saved-in-file-system.png" alt="Console Log screenshot" ></DocsImage>

## History

| Version                                     | Changes                             |
| ------------------------------------------- | ----------------------------------- |
| [3.5.0](/guides/references/changelog#3-5-0) | Added support for option `padding`. |

## See also

- [After Screenshot API](/api/plugins/after-screenshot-api)
- [`cy.debug()`](/api/commands/debug)
- [`Cypress.Screenshot`](/api/cypress-api/screenshot-api)
- [Dashboard Service](/guides/dashboard/introduction)
- [`.pause()`](/api/commands/pause)
- [Screenshots and Videos](/guides/guides/screenshots-and-videos)
- [Visual Testing](/guides/tooling/visual-testing)
