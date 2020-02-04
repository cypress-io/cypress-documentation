---
title: Browser Launch API
---

Before Cypress launches a browser, it gives you the opportunity to modify the browser preferences, install extensions, add and remove command-line arguments, and modify other options.

# Syntax

```js
on('before:browser:launch', (browser = {}, launchOptions) => { /* ... */ })
```

**{% fa fa-angle-right %} browser** ***(object)***

An object describing the browser being launched, with the following properties:

Property | Type | Description
--- | --- | ---
`name`| `string` | Machine-friendly name, like `chrome`, `electron`, or `firefox`.
`family` | `string` | Rendering engine being used. `chromium` or `firefox`.
`channel` | `string` | Release channel of the browser, such as `stable`, `dev`, or `canary`.
`displayName` | `string` | Human-readable display name for the browser.
`version` | `string` | Full version string.
`path` | `string` | Path to the browser on disk. Blank for Electron.
`majorVersion` | `number` | The major version number of the browser.


**{% fa fa-angle-right %} launchOptions** ***(object)***

Options that can be modified to control how the browser is launched, with the following properties:

Property | Type | Description
--- | --- | ---
`preferences` | `object` | An object describing browser preferences. Differs between browsers. See {% url "\"Changing browser preferences\"" #Changing-browser-preferences %} for details.
`args` | `string[]` | An array of strings that will be passed as command-line args when the browser is launched. Has no effect on Electron. See {% url "\"Modify browser launch arguments\"" #Modify-browser-launch-arguments %} for details.
`extensions` | `string[]` | An array of paths to folders containing unpacked WebExtensions, to be loaded before the browser starts. Note: Electron currently only supports Chrome DevTools extensions. See {% url "\"Add browser extensions\"" #Add-browser-extensions %} for details.
`windowSize` | `string` | By default, browsers will open `maximized`. You can make a browser open in fullscreen mode by passing `fullscreen` here.


# Usage

## Modify browser launch arguments, preferences, and extensions

Using your {% url "`pluginsFile`" plugins-guide %} you can tap into the `before:browser:launch` event and modify how Cypress launches the browser (e.g. modify arguments, user preferences, and extensions).

This event will yield you the `browser` object, which gives you information about the browser, and the `launchOptions` object, which allows you to modify how the browser is launched.

The returned `launchOptions` object will become the new launch options for the browser.

### Modify browser launch arguments:

```js
module.exports = (on, config) => {
  on('before:browser:launch', (browser = {}, launchOptions) => {
    if (browser.family === 'chromium' && browser.name !== 'electron') {
      // `args` is an array of all the arguments that will
      //  be passed to Chromium-based browsers when it launchers
      launchOptions.args.push('--start-fullscreen')

      // whatever you return here becomes the launchOptions
      return launchOptions
    }

    if (browser.family === 'firefox') {
      launchOptions.args.push('-some-cli-argument')

      return launchOptions
    }
  })
}
```

### Add browser extensions:

```js
module.exports = (on, config) => {
  on('browser:before:launch', (browser, launchOptions) => {
    // supply the path to an unpacked WebExtension
    // NOTE: extensions cannot be loaded in headless Chrome
    launchOptions.extensions.push('/path/to/webextension')

    return launchOptions
  })
}
```

### Changing browser preferences:

```js
module.exports = (on, config) => {
  on('browser:before:launch', (browser, launchOptions) => {
    if (browser.family === 'chromium' && browser.name !== 'electron') {
      // in Chromium, preferences can exist in Local State, Preferences, or Secure Preferences
      // via launchOptions.preferences, these can be acccssed as `localState`, `default`, and `secureDefault`

      // for example, to set `somePreference: true` in Preferences:
      launchOptions.preferences.default.somePreference = true

      // more information about Chromium preferences can be found here:
      // https://www.chromium.org/developers/design-documents/preferences

      return launchOptions
    }

    if (browser.family === 'firefox') {
      // launchOptions.preferences is a map of preference names to values
      launchOptions.preferences['browser.startup.homepage'] = 'https://cypress.io'

      return launchOptions
    }

    if (browser.name === 'electron') {
      // launchOptions.preferences is a `BrowserWindow` `options` object:
      // https://electronjs.org/docs/api/browser-window#new-browserwindowoptions
      launchOptions.preferences.darkTheme = true

      return launchOptions
    }
  })
}
```

## Modify Electron app switches

Cypress Test Runner is an Electron application, and its behavior (and the behavior of the bundled-in Electron browser) can be customized using command line switches. The supported switches depend on the Electron version, see {% url "Electron documentation" https://electronjs.org/docs/api/chrome-command-line-switches/history %}.

You can pass Electron-specific launch arguments using the `ELECTRON_EXTRA_LAUNCH_ARGS` environment variable. For example, to disable HTTP browser cache and ignore certificate errors, you can set the environment variables before running Cypress like below:

### Linux/OSX

```shell
export ELECTRON_EXTRA_LAUNCH_ARGS=--disable-http-cache --ignore-certificate-errors
```

### Windows

```shell
set ELECTRON_EXTRA_LAUNCH_ARGS=--disable-http-cache --ignore-certificate-errors
```

Cypress already sets some the Electron command line switches internally. See file {% url "packages/server/lib/environment.coffee" https://github.com/cypress-io/cypress/blob/develop/packages/server/lib/environment.coffee %}. There is no way to see all currently set switches after Electron's launch.

## See all Chrome browser switches

If you are running Cypress tests using a Chromium-based browser, you can see ALL currently set command line switches and the browser version information by opening a new tab and typing `chrome://version` url.

{% imgTag /img/api/chrome-switches.png "See all Chrome switches" %}

# Examples

## Use fake video for webcam testing

By default, Cypress passes the Chrome command line switch to enable a fake video for a media stream. This is to better enable testing webcam functionality without having to have the necessary hardware to test.

{% imgTag /img/api/browser-launch-fake-video.gif "Enable fake video for testing" %}

You can however send your own video file for testing by passing a Chrome command line switch pointing to a video file.

```js
module.exports = (on, config) => {
  on('before:browser:launch', (browser = {}, launchOptions) => {
    if (browser.family === 'chromium' && browser.name !== 'electron') {
      // Mac/Linux
      launchOptions.args.push('--use-file-for-fake-video-capture=cypress/fixtures/my-video.y4m')

      // Windows
      // launchOptions.args.push('--use-file-for-fake-video-capture=c:\\path\\to\\video\\my-video.y4m')
    }

    return launchOptions
  })
}
```

{% history %}
{% url "4.0.0" changelog#4-0-0 %} | New `options` object replaces old `args` as second argument to `before:browser:launch`
{% url "4.0.0" changelog#4-0-0 %} | All Chromium-based browsers, including Electron, have `chromium` set as their `family` property.
{% url "4.0.0" changelog#4-0-0 %} | Added `channel` property to browser.
{% endhistory %}
