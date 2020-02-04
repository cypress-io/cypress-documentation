---
title: Browser Launch API
---

Before Cypress launches a browser, it gives you the ability to modify the arguments used to launch it.

This is helpful to modify, remove, or add your own arguments.

The most common use case is adding your own web extension - {% url "example recipe" https://www.cypress.io/blog/2020/01/07/how-to-load-the-react-devtools-extension-in-cypress/ %}.

# Usage

## Modify browser launch arguments, preferences, and extensions

Using your {% url "`pluginsFile`" plugins-guide %} you can tap into the `before:browser:launch` event and modify how Cypress launches the browser (e.g. modify arguments, user preferences, and extensions).

This event will yield you the `browser` object, which gives you information about the browser, and the `options` object, which allows you to modify how the browser is launched.

The returned `options` object will become the new launch options for the browser.

Here are options for the currently supported browsers:

* {% url 'Chrome, Chromium, Canary, or Microsoft Edge (Chromium based) browsers' "https://peter.sh/experiments/chromium-command-line-switches/" %}
* {% url 'Firefox' "http://kb.mozillazine.org/About:config_entries" %}
* {% url 'Electron' "https://github.com/electron/electron/blob/master/docs/api/browser-window.md#new-browserwindowoptions" %}

### Modify browser launch arguments:

```js
module.exports = (on, config) => {
  on('before:browser:launch', (browser = {}, options) => {
    // browser will look something like this
    // {
    //   name: 'chrome',
    //   family: 'chromium',
    //   channel: 'stable',
    //   displayName: 'Chrome',
    //   version: '63.0.3239.108',
    //   path: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    //   majorVersion: '63'
    // }

    if (browser.family === 'chromium' && browser.name !== 'electron') {
      // `args` is an array of all the arguments that will
      //  be passed to Chromium-based browsers when it launchers
      options.args.push('--start-fullscreen')

      // whatever you return here becomes the launch options
      return options
    }

    if (browser.family === 'firefox') {
      args.extensions.push('/path/to/my/extension')
      args.preferences['browser.blink_allowed'] = true
    }

    if (browser.name === 'electron') {
      // `args` is a `BrowserWindow` options object
      // https://electronjs.org/docs/api/browser-window#new-browserwindowoptions
      options.preferences['fullscreen'] = true

      // whatever you return here becomes the new launch options
      return options
    }

    if (browser.family === 'firefox') {
      options.firefoxOptions.windowSizeMode = 'fullscreen'

      return options
    }
  })
}
```

### Add browser extensions:

```js
module.exports = (on, config) => {
  on('browser:before:launch', (browser, options) => {
    // supply the path to an unpacked WebExtension
    // NOTE: extensions cannot be loaded in headless Chrome
    options.extensions.push('/path/to/webextension')

    return options
  })
}
```

Changing browser preferences:

```js
module.exports = (on, config) => {
  on('browser:before:launch', (browser, options) => {
    if (browser.family === 'chromium' && browser.name !== 'electron') {
      // in Chromium, preferences can exist in Local State, Preferences, or Secure Preferences
      // via options.preferences, these can be acccssed as `localState`, `default`, and `secureDefault`

      // for example, to set `somePreference: true` in Preferences:
      options.preferences.default.somePreference = true

      // more information about Chromium preferences can be found here:
      // https://www.chromium.org/developers/design-documents/preferences

      return options
    }

    if (browser.family === 'firefox') {
      // TODO @Bkucera what does this look like?

      return options
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
  on('before:browser:launch', (browser = {}, options) => {
    if (browser.family === 'chromium' && browser.name !== 'electron') {
      // Mac/Linux
      options.args.push('--use-file-for-fake-video-capture=cypress/fixtures/my-video.y4m')

      // Windows
      // options.args.push('--use-file-for-fake-video-capture=c:\\path\\to\\video\\my-video.y4m')
    }

    return options
  })
}
```

{% history %}
{% url "4.0.0" changelog#4-0-0 %} | New `options` object replaces old `args` as second argument to `before:browser:launch`
{% url "4.0.0" changelog#4-0-0 %} | All Chromium-based browsers, including Electron, have `chromium` set as their `family` property.
{% url "4.0.0" changelog#4-0-0 %} | Added `channel` property to browser.
{% endhistory %}
