---
title: After Screenshot API
---

After a screenshot is taken, you can get details about the screenshot via the
`after:screenshot` plugin event. This event is called when a screenshot is taken
with [`cy.screenshot()`](/api/commands/screenshot) or as a result of a test
failure. The event is called after the screenshot image is written to disk.

This allows you to record those details, manipulate the image as needed, and
return the updated details about the image.

## Syntax

::include{file=partials/warning-setup-node-events.md}

:::cypress-plugin-example

```js
on('after:screenshot', (details) => {
  /* ... */
})
```

:::

**<Icon name="angle-right"></Icon> details** **_(object)_**

An object describing the screenshot that was taken, with the following
properties:

| Property     | Type      | Description                                                                                                                                                                 |
| ------------ | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `size`       | `number`  | The size of the image file (in bytes).                                                                                                                                      |
| `takenAt`    | `string`  | The date and time the screenshot was taken. ISO 8601 format in UTC (example: `'2020-03-09T07:30:37.686Z'`)                                                                  |
| `duration`   | `number`  | Duration taking and saving the screenshot (in milliseconds).                                                                                                                |
| `dimensions` | `object`  | The width and height of the image in pixels (example: `{ width: 100, height: 50 }`)                                                                                         |
| `multipart`  | `boolean` | Whether the screenshot was stitched together from multiple screenshot images.                                                                                               |
| `pixelRatio` | `number`  | _(Optional)_ The ratio of screenshot pixels to the browser's displayed pixels.                                                                                              |
| `name`       | `string`  | _(Optional)_ The `fileName` argument passed in via [cy.screenshot()](/api/commands/screenshot#Arguments)                                                                    |
| `specName`   | `string`  | The name of the specfile where the screenshot was taken.                                                                                                                    |
| `path`       | `string`  | The absolute path to the image.                                                                                                                                             |
| `scaled`     | `boolean` | Whether the application under test was scaled to fit into the browser viewport. May be `scale` argument passed in via [cy.screenshot()](/api/commands/screenshot#Arguments) |
| `blackout`   | `array`   | The `blackout` argument passed in via [cy.screenshot()](/api/commands/screenshot#Arguments)                                                                                 |

## Usage

### Modify screenshot details

Using [setupNodeEvents](/guides/tooling/plugins-guide#Using-a-plugin) you can
tap into the `after:screenshot` event.

If you change the `path`, `size` or `dimensions` of the image, you'll want to
update the new values so that the details are correctly reported in the test
results. _Any other properties besides `path`, `size`, and `dimensions` will be
ignored._

You can return an object or a promise that resolves to an object from the
callback function. _Any type of returned value other than an object will be
ignored._ The object can contain the following properties:

- **path**: The absolute path to the current location of the image
- **size**: The size of the current image file (in bytes)
- **dimensions**: The width and height of the current image in pixels (as an
  object with the shape `{ width: 100, height: 50 }`)

The properties will be merged into the screenshot details and passed to the
`onAfterScreenshot` callback (if defined with
[Cypress.Screenshot.defaults()](/api/cypress-api/screenshot-api) and/or
[cy.screenshot()](/api/commands/screenshot)).

#### Modify screenshot path

If you move the location of the screenshot image, you'll want to specify the new
`path` of the image.

:::cypress-plugin-example

```js
const fs = require('fs')
```

```js
on('after:screenshot', (details) => {
  console.log(details) // print all details to terminal

  const newPath = '/new/path/to/screenshot.png'

  return new Promise((resolve, reject) => {
    // fs.rename moves the file to the existing directory 'new/path/to'
    // and renames the image to 'screenshot.png'
    fs.rename(details.path, newPath, (err) => {
      if (err) return reject(err)

      // because we renamed and moved the image, resolve with the new path
      // so it is accurate in the test results
      resolve({ path: newPath })
    })
  })
})
```

:::

## See also

- [cy.screenshot()](/api/commands/screenshot)
- [Cypress Cloud](/guides/cloud/introduction)
- [Plugins Guide](/guides/tooling/plugins-guide)
- [Screenshots and Videos](/guides/guides/screenshots-and-videos)
- [Visual Testing](/guides/tooling/visual-testing)
- [Writing a Plugin](/api/plugins/writing-a-plugin)
