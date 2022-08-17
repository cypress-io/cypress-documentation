---
title: Browser Launch API
---

Before Cypress launches a browser, it gives you the opportunity to modify the
browser preferences, install extensions, add and remove command-line arguments,
and modify other options from the
[setupNodeEvents](/guides/tooling/plugins-guide#Using-a-plugin) function.

## Syntax

::include{file=partials/warning-setup-node-events.md}

:::cypress-plugin-example

```js
on('before:browser:launch', (browser = {}, launchOptions) => {
  /* ... */
})
```

:::

**<Icon name="angle-right"></Icon> browser** **_(object)_**

An object describing the browser being launched, with the following properties:

| Property       | Type      | Description                                                                                 |
| -------------- | --------- | ------------------------------------------------------------------------------------------- |
| `name`         | `string`  | Machine-friendly name, like `chrome`, `electron`, `edge`, or `firefox`.                     |
| `family`       | `string`  | Rendering engine being used. `chromium` or `firefox`.                                       |
| `channel`      | `string`  | Release channel of the browser, such as `stable`, `dev`, or `canary`.                       |
| `displayName`  | `string`  | Human-readable display name for the browser.                                                |
| `version`      | `string`  | Full version.                                                                               |
| `path`         | `string`  | Path to the browser on disk. Blank for Electron.                                            |
| `info`         | `string`  | _(Optional)_ Extra information about the browser (used for display in the browser selector) |
| `majorVersion` | `number`  | The major version number of the browser.                                                    |
| `isHeadless`   | `boolean` | Whether the browser is running headlessly.                                                  |
| `isHeaded`     | `boolean` | Whether the browser displays headed.                                                        |

**<Icon name="angle-right"></Icon> launchOptions** **_(object)_**

Options that can be modified to control how the browser is launched, with the
following properties:

| Property      | Type       | Description                                                                                                                                                                                                                                  |
| ------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `preferences` | `object`   | An object describing browser preferences. Differs between browsers. See [Changing browser preferences](#Changing-browser-preferences) for details.                                                                                           |
| `args`        | `string[]` | An array of strings that will be passed as command-line args when the browser is launched. Has no effect on Electron. See [Modify browser launch arguments](#Modify-browser-launch-arguments) for details.                                   |
| `extensions`  | `string[]` | An array of paths to folders containing unpacked WebExtensions to be loaded before the browser starts. Note: Electron currently only supports Chrome DevTools extensions. See [Add browser extensions](#Add-browser-extensions) for details. |

## Usage

### Modify browser launch arguments, preferences, and extensions

Using the [setupNodeEvents](/guides/tooling/plugins-guide#Using-a-plugin)
function you can tap into the `before:browser:launch` event and modify how
Cypress launches the browser (e.g. modify arguments, user preferences, and
extensions).

This event will yield you the `browser` object, which gives you information
about the browser, and the `launchOptions` object, which allows you to modify
how the browser is launched.

The returned `launchOptions` object will become the new launch options for the
browser.

#### Modify browser launch arguments:

Here are args available for the currently supported browsers:

- [Chromium-based browsers](https://peter.sh/experiments/chromium-command-line-switches/)
- [Firefox](https://developer.mozilla.org/docs/Mozilla/Command_Line_Options)

##### Open devtools by default

:::cypress-plugin-example

```js
on('before:browser:launch', (browser = {}, launchOptions) => {
  // `args` is an array of all the arguments that will
  // be passed to browsers when it launches
  console.log(launchOptions.args) // print all current args

  if (browser.family === 'chromium' && browser.name !== 'electron') {
    // auto open devtools
    launchOptions.args.push('--auto-open-devtools-for-tabs')
  }

  if (browser.family === 'firefox') {
    // auto open devtools
    launchOptions.args.push('-devtools')
  }

  if (browser.name === 'electron') {
    // auto open devtools
    launchOptions.preferences.devTools = true
  }

  // whatever you return here becomes the launchOptions
  return launchOptions
})
```

:::

#### Add browser extensions:

:::cypress-plugin-example

```js
on('before:browser:launch', (browser, launchOptions) => {
  // supply the absolute path to an unpacked extension's folder
  // NOTE: extensions cannot be loaded in headless Chrome
  launchOptions.extensions.push('Users/jane/path/to/extension')

  return launchOptions
})
```

:::

#### Changing browser preferences:

Here are preferences available for the currently supported browsers:

- [Chromium-based browsers](https://src.chromium.org/viewvc/chrome/trunk/src/chrome/common/pref_names.cc?view=markup)
- [Electron](https://github.com/electron/electron/blob/master/docs/api/browser-window.md#new-browserwindowoptions)
- Firefox: visit `about:config` URL within your Firefox browser to see all
  available preferences.

:::cypress-plugin-example

```js
on('before:browser:launch', (browser, launchOptions) => {
  if (browser.family === 'chromium' && browser.name !== 'electron') {
    // in Chromium, preferences can exist in Local State, Preferences, or Secure Preferences
    // via launchOptions.preferences, these can be acccssed as `localState`, `default`, and `secureDefault`

    // for example, to set `somePreference: true` in Preferences:
    launchOptions.preferences.default['preference'] = true

    return launchOptions
  }

  if (browser.family === 'firefox') {
    // launchOptions.preferences is a map of preference names to values
    launchOptions.preferences['some.preference'] = true

    return launchOptions
  }

  if (browser.name === 'electron') {
    // launchOptions.preferences is a `BrowserWindow` `options` object
    launchOptions.preferences.darkTheme = true

    return launchOptions
  }
})
```

:::

### Modify Electron app switches

The Cypress Launchpad is an Electron application, and its behavior (and the
behavior of the bundled-in Electron browser) can be customized using command
line switches. The supported switches depend on the Electron version, see
[Electron documentation](https://www.electronjs.org/docs/api/command-line-switches).

You can pass Electron-specific launch arguments using the
`ELECTRON_EXTRA_LAUNCH_ARGS` environment variable. For example, to disable HTTP
browser cache and ignore certificate errors, you can set the environment
variables before running Cypress like below:

#### Linux/OSX

```shell
export ELECTRON_EXTRA_LAUNCH_ARGS=--disable-http-cache --lang=es
```

#### Windows

```shell
set ELECTRON_EXTRA_LAUNCH_ARGS=--disable-http-cache --lang=es
```

Cypress already sets some the Electron command line switches internally. See
file
[packages/server/lib/environment.js](https://github.com/cypress-io/cypress/blob/develop/packages/server/lib/environment.js).
There is no way to see all currently set switches after Electron's launch.

### See all Chrome browser switches

If you are running Cypress tests using a Chromium-based browser, you can see ALL
currently set command line switches and the browser version information by
opening a new tab and typing `chrome://version` url.

<DocsImage src="/img/api/chrome-switches.png" alt="See all Chrome switches" ></DocsImage>

## Examples

### Set screen size when running headless

When a browser runs headless, there is no physical display. You can override the
default screen size of 1280x720 when running headless as shown below. This will
affect the size of screenshots and videos taken during the run.

<Alert type="warning">

This setting changes the display size of the screen and does not affect the
`viewportWidth` and `viewportHeight` set in the
[Cypress configuration](/guides/references/configuration). The `viewportWidth`
and `viewportHeight` only affect the size of the application under test
displayed inside the Cypress Test Runner. Read the blog post
[Generate High-Resolution Videos and Screenshots](https://www.cypress.io/blog/2021/03/01/generate-high-resolution-videos-and-screenshots/)
for details.

</Alert>

:::cypress-plugin-example

```js
on('before:browser:launch', (browser, launchOptions) => {
  if (browser.name === 'chrome' && browser.isHeadless) {
    // fullPage screenshot size is 1400x1200 on non-retina screens
    // and 2800x2400 on retina screens
    launchOptions.args.push('--window-size=1400,1200')

    // force screen to be non-retina (1400x1200 size)
    launchOptions.args.push('--force-device-scale-factor=1')

    // force screen to be retina (2800x2400 size)
    // launchOptions.args.push('--force-device-scale-factor=2')
  }

  if (browser.name === 'electron' && browser.isHeadless) {
    // fullPage screenshot size is 1400x1200
    launchOptions.preferences.width = 1400
    launchOptions.preferences.height = 1200
  }

  if (browser.name === 'firefox' && browser.isHeadless) {
    // menubars take up height on the screen
    // so fullPage screenshot size is 1400x1126
    launchOptions.args.push('--width=1400')
    launchOptions.args.push('--height=1200')
  }

  return launchOptions
})
```

:::

### Override the device pixel ratio

:::cypress-plugin-example

```js
on('before:browser:launch', (browser, launchOptions) => {
  if (browser.name === 'chrome' && browser.isHeadless) {
    // force screen to behave like retina
    // when running Chrome headless browsers
    // (2560x1440 in size by default)
    launchOptions.args.push('--force-device-scale-factor=2')
  }

  return launchOptions
})
```

:::

### Start fullscreen

:::cypress-plugin-example

```js
on('before:browser:launch', (browser = {}, launchOptions) => {
  if (browser.family === 'chromium' && browser.name !== 'electron') {
    launchOptions.args.push('--start-fullscreen')

    return launchOptions
  }

  if (browser.name === 'electron') {
    launchOptions.preferences.fullscreen = true

    return launchOptions
  }
})
```

:::

### Use fake video for webcam testing

By default, Cypress passes the Chrome command line switch to enable a fake video
for a media stream. This is to better enable testing webcam functionality
without having to have the necessary hardware to test.

<DocsImage src="/img/api/browser-launch-fake-video.gif" alt="Enable fake video for testing" ></DocsImage>

You can however send your own video file for testing by passing a Chrome command
line switch pointing to a video file.

:::cypress-plugin-example

```js
on('before:browser:launch', (browser = {}, launchOptions) => {
  if (browser.family === 'chromium' && browser.name !== 'electron') {
    // Mac/Linux
    launchOptions.args.push(
      '--use-file-for-fake-video-capture=cypress/fixtures/my-video.y4m'
    )

    // Windows
    // launchOptions.args.push('--use-file-for-fake-video-capture=c:\\path\\to\\video\\my-video.y4m')
  }

  return launchOptions
})
```

:::

### Support unique file download mime types

Cypress supports a myriad of mime types when testing file downloads, but in case
you have a unique one, you can add support for it.

:::cypress-plugin-example

```js
on('before:browser:launch', (browser, options) => {
  // only Firefox requires all mime types to be listed
  if (browser.family === 'firefox') {
    const existingMimeTypes =
      options.preferences['browser.helperApps.neverAsk.saveToDisk']
    const myMimeType = 'my/mimetype'

    // prevents the browser download prompt
    options.preferences[
      'browser.helperApps.neverAsk.saveToDisk'
    ] = `${existingMimeTypes},${myMimeType}`

    return options
  }
})
```

:::

<Alert type="info">

[Check out our example recipe showing how to download and validate CSV and Excel files.](/examples/examples/recipes#Testing-the-DOM)

</Alert>

### Set a Firefox flag

If we need to set a particular Firefox flag, like `browser.send_pings` we can do
it via preferences

:::cypress-plugin-example

```js
on('before:browser:launch', (browser = {}, launchOptions) => {
  if (browser.family === 'firefox') {
    launchOptions.preferences['browser.send_pings'] = true
  }

  return launchOptions
})
```

:::

The above example comes from the blog post
[How to Test Anchor Ping](https://glebbahmutov.com/blog/anchor-ping/).

## History

| Version                                     | Changes                                                                                          |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [4.0.0](/guides/references/changelog#4-0-0) | New `options` object replaces old `args` as second argument to `before:browser:launch`           |
| [4.0.0](/guides/references/changelog#4-0-0) | All Chromium-based browsers, including Electron, have `chromium` set as their `family` property. |
| [4.0.0](/guides/references/changelog#4-0-0) | Added `channel` property to browser.                                                             |
