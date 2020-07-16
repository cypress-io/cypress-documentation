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
`version` | `string` | Full version.
`path` | `string` | Path to the browser on disk. Blank for Electron.
`info` | `string` | *(Optional)* Extra information about the browser (used for display in the browser selector of the Test Runner)
`majorVersion` | `number` | The major version number of the browser.
`isHeadless` | `boolean` | Whether the browser is running headlessly.
`isHeaded` | `boolean` | Whether the browser displays headed.

**{% fa fa-angle-right %} launchOptions** ***(object)***

Options that can be modified to control how the browser is launched, with the following properties:

Property | Type | Description
--- | --- | ---
`preferences` | `object` | An object describing browser preferences. Differs between browsers. See {% urlHash "Changing browser preferences" Changing-browser-preferences %} for details.
`args` | `string[]` | An array of strings that will be passed as command-line args when the browser is launched. Has no effect on Electron. See {% urlHash "Modify browser launch arguments" Modify-browser-launch-arguments %} for details.
`extensions` | `string[]` | An array of paths to folders containing unpacked WebExtensions to be loaded before the browser starts. Note: Electron currently only supports Chrome DevTools extensions. See {% urlHash "Add browser extensions" Add-browser-extensions %} for details.

# Usage

## Modify browser launch arguments, preferences, and extensions

Using your {% url "`pluginsFile`" plugins-guide %} you can tap into the `before:browser:launch` event and modify how Cypress launches the browser (e.g. modify arguments, user preferences, and extensions).

This event will yield you the `browser` object, which gives you information about the browser, and the `launchOptions` object, which allows you to modify how the browser is launched.

The returned `launchOptions` object will become the new launch options for the browser.

### Modify browser launch arguments:

Here are args available for the currently supported browsers:

* {% url 'Chromium-based browsers' "https://peter.sh/experiments/chromium-command-line-switches/" %}
* {% url 'Firefox' "https://developer.mozilla.org/docs/Mozilla/Command_Line_Options" %}

```js
module.exports = (on, config) => {
  on('before:browser:launch', (browser = {}, launchOptions) => {
    // `args` is an array of all the arguments that will
    // be passed to browsers when it launches
    console.log(launchOptions.args) // print all current args

    if (browser.family === 'chromium' && browser.name !== 'electron') {
      // auto open devtools
      launchOptions.args.push('--auto-open-devtools-for-tabs')

      // whatever you return here becomes the launchOptions
      return launchOptions
    }

    if (browser.family === 'firefox') {
      // auto open devtools
      launchOptions.args.push('-devtools')

      return launchOptions
    }
  })
}
```

### Add browser extensions:

```js
module.exports = (on, config) => {
  on('before:browser:launch', (browser, launchOptions) => {
    // supply the absolute path to an unpacked extension's folder
    // NOTE: extensions cannot be loaded in headless Chrome
    launchOptions.extensions.push('Users/jane/path/to/extension')

    return launchOptions
  })
}
```

### Changing browser preferences:

Here are preferences available for the currently supported browsers:

* {% url 'Chromium-based browsers' "https://src.chromium.org/viewvc/chrome/trunk/src/chrome/common/pref_names.cc?view=markup" %}
* {% url 'Electron' "https://github.com/electron/electron/blob/master/docs/api/browser-window.md#new-browserwindowoptions" %}
* Firefox: visit `about:config` URL within your Firefox browser to see all available preferences.

```js
module.exports = (on, config) => {
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
}
```

## Modify Electron app switches

Cypress Test Runner is an Electron application, and its behavior (and the behavior of the bundled-in Electron browser) can be customized using command line switches. The supported switches depend on the Electron version, see {% url "Electron documentation" https://electronjs.org/docs/api/chrome-command-line-switches/history %}.

You can pass Electron-specific launch arguments using the `ELECTRON_EXTRA_LAUNCH_ARGS` environment variable. For example, to disable HTTP browser cache and ignore certificate errors, you can set the environment variables before running Cypress like below:

### Linux/OSX

```shell
export ELECTRON_EXTRA_LAUNCH_ARGS=--disable-http-cache --lang=es
```

### Windows

```shell
set ELECTRON_EXTRA_LAUNCH_ARGS=--disable-http-cache --lang=es
```

Cypress already sets some the Electron command line switches internally. See file {% url "packages/server/lib/environment.coffee" https://github.com/cypress-io/cypress/blob/develop/packages/server/lib/environment.coffee %}. There is no way to see all currently set switches after Electron's launch.

## See all Chrome browser switches

If you are running Cypress tests using a Chromium-based browser, you can see ALL currently set command line switches and the browser version information by opening a new tab and typing `chrome://version` url.

{% imgTag /img/api/chrome-switches.png "See all Chrome switches" %}

# Examples

## Set screen size when running headless Chrome

When a browser runs headless, there is no physical display. You can override the default screen size of 1280x720 when running headless as shown below.

```js
module.exports = (on, config) => {
  on('before:browser:launch', (browser, launchOptions) => {
    if (browser.name === 'chrome' && browser.isHeadless) {
      launchOptions.args.push('--window-size=1400,1200')

      return launchOptions
    }
  })
}
```

## Start fullscreen

```js
module.exports = (on, config) => {
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
}
```

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

## Change download directory

Change the download directory of files downloaded during Cypress tests.

```js
module.exports = (on) => {
  on('before:browser:launch', (browser, options) => {
    const downloadDirectory = path.join(__dirname, '..', 'downloads')

    if (browser.family === 'chromium' && browser.name !== 'electron') {
      options.preferences.default['download'] = { default_directory: downloadDirectory }

      return options
    }

    if (browser.family === 'firefox') {
      options.preferences['browser.download.dir'] = downloadDirectory
      options.preferences['browser.download.folderList'] = 2

      // needed to prevent download prompt for text/csv files.
      options.preferences['browser.helperApps.neverAsk.saveToDisk'] = 'text/csv'

      return options
    }
  })
}
```

{% history %}
{% url "4.0.0" changelog#4-0-0 %} | New `options` object replaces old `args` as second argument to `before:browser:launch`
{% url "4.0.0" changelog#4-0-0 %} | All Chromium-based browsers, including Electron, have `chromium` set as their `family` property.
{% url "4.0.0" changelog#4-0-0 %} | Added `channel` property to browser.
{% endhistory %}
