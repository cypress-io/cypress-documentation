---
title: after:screenshot
---

After a screenshot is taken, you can get details about the screenshot via the `after:screenshot` background event. This event is called whether a screenshot is taken with {% url `cy.screenshot()` screenshot %} or as a result of a test failure. The event is called after the screenshot image is written to disk.

This allows you to record those details or manipulate the image as needed. You can also return updated details about the image.

# Environment

{% wrap_start 'event-environment' %}

Some events run in the {% url "browser" all-events#Browser-Events %}, some in the {% url "background process" background-process %}, and some in both.

Event | Browser | Background Process
--- | --- | ---
`after:screenshot` | {% fa fa-times-circle grey %} | {% fa fa-check-circle green %}

{% wrap_end %}

# Arguments

**{% fa fa-angle-right %} screenshot** ***(Object)***

Details of the screenshot including dimensions, path names, and any screenshot options.

# Usage

## In the background process

Using your {% url "`backgroundFile`" background-process %} you can tap into the `after:screenshot` event.

You can return an object or a promise that resolves an object from the callback function. Any type of value other than an object will be ignored. The object can contain the following properties:

* **path**: absolute path to the image
* **size**: size of the image file in bytes
* **dimensions**: width and height of the image in pixels (as an object with the shape `{ width: 100, height: 50 }`)

If you change any of those properties of the image, you should include the new values in the returned object, so that the details are correctly reported in the test results. For example, if you crop the image, return the new size and dimensions of the image.

The properties will be merged into the screenshot details and passed to the `onAfterScreenshot` callback (if defined with {% url 'Cypress.Screenshot.defaults()' screenshot-api %} and/or {% url 'cy.screenshot()' screenshot %}). Any other properties besides *path*, *size*, and *dimensions* will be ignored.

```js
module.exports = (on, config) => {
  on('after:screenshot', (details) => {
    // details will look something like this:
    // {
    //   size: 10248
    //   takenAt: '2018-06-27T20:17:19.537Z'
    //   duration: 4071
    //   dimensions: { width: 1000, height: 660 }
    //   multipart: false
    //   pixelRatio: 1
    //   name: 'my-screenshot'
    //   specName: 'integration/my-spec.js'
    //   testFailure: true
    //   path: '/path/to/my-screenshot.png'
    //   scaled: true
    //   blackout: []
    // }
  })
})
```

# Examples

## Rename a screenshot file

```js
const fs = require('fs')

module.exports = (on, config) => {
  on('after:screenshot', (details) => {
    const newPath = '/new/path/to/screenshot.png'

    return new Promise((resolve, reject) => {
      fs.rename(details.path, newPath, (err) => {
        if (err) return reject(err)

        // because we renamed/moved the image, resolve with the new path
        // so it is accurate in the test results
        resolve({ path: newPath })
      })
    })
  })
}
```

# See also

- {% url `.screenshot()` screenshot %}
- {% url `Cypress.Screenshot` screenshot-api %}
