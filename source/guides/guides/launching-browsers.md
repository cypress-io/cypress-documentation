---
title: Launching Browsers
---

When you run tests in Cypress, we launch a browser for you. This enables us to:

1. Create a clean, pristine testing environment.
2. Access the privileged browser APIs for automation.

# Browsers

When Cypress is initially run from the Test Runner, you can choose to run Cypress in a select number of browsers including:

- {% url "Canary" https://www.google.com/chrome/browser/canary.html %}
- {% url "Chrome" https://www.google.com/chrome/browser/desktop/index.html %}
- {% url "Chromium" https://www.chromium.org/Home %}
- {% url "Edge" https://www.microsoft.com/edge %}
- {% url "Edge Beta" https://www.microsoftedgeinsider.com/download %}
- {% url "Edge Canary" https://www.microsoftedgeinsider.com/download %}
- {% url "Edge Dev" https://www.microsoftedgeinsider.com/download %}
- {% url "Electron" https://electron.atom.io/ %}
- {% url "Firefox" https://www.mozilla.org/firefox/ %} (Beta support)
- {% url "Firefox Developer Edition" https://www.mozilla.org/firefox/developer/ %} (Beta support)
- {% url "Firefox Nightly" https://www.mozilla.org/firefox/nightly/ %} (Beta support)

Cypress automatically detects available browsers on your OS. You can switch the browser in the Test Runner by using the drop down in the top right corner:

{% imgTag /img/guides/browser-list-dropdown.png "Select a different browser" %}

{% partial chromium_download %}

## Electron Browser

In addition to the browsers found on your system, you'll notice that Electron is an available browser. The Electron browser is a version of Chromium that comes with {% url "Electron" https://electron.atom.io/ %}.

The Electron browser has the advantage of coming baked into Cypress and does not need to be installed separately.

By default, when running {% url '`cypress run`' command-line#cypress-run %} from the CLI, we will launch Electron headlessly.

### You can also launch Electron headed:

```shell
cypress run --headed
```

Because Electron is the default browser - it is typically run in CI. If you are seeing failures in CI, to easily debug them you may want to run locally with the `--headed` option.

## Chrome Browsers

All Chrome* flavored browsers will be detected and are supported.

You can launch Chrome like this:

```shell
cypress run --browser chrome
```

To use this command in CI, you need to install the browser you want - or use one of our {% url 'docker images' docker %}.

By default, we will launch Chrome in headed mode. To run Chrome headlessly, you can pass the `--headless` argument to `cypress run`.

You can also launch Chromium:

```shell
cypress run --browser chromium
```

Or Chrome Canary:

```shell
cypress run --browser chrome:canary
```

Or Microsoft Edge (Chromium-based):

```shell
cypress run --browser edge
```

Or Microsoft Edge Canary (Chromium-based):

```shell
cypress run --browser edge:canary
```

{% url 'Having issues launching installed browsers? Read more about troubleshooting browser launching' troubleshooting#Launching-browsers %}

## Firefox Browsers (beta)

Firefox-family browsers have beta support.

You can launch Firefox like this:

```shell
cypress run --browser firefox
```

Or Firefox Developer/Nightly Edition:

```shell
cypress run --browser firefox:dev
cypress run --browser firefox:nightly
```

To use this command in CI, you need to install these other browsers - or use one of our {% url 'docker images' docker %}.

By default, we will launch Firefox in headed mode. To run Firefox headlessly, you can pass the `--headless` argument to `cypress run`.

## Launching by a path

You can launch any supported browser by specifying a path to the binary:

```shell
cypress run --browser /usr/bin/chromium
# or
cypress open --browser /usr/bin/chromium
```

Cypress will automatically detect the type of browser supplied and launch it for you.

{% url 'See the Command Line guide for more information about the `--browser` arguments' command-line#cypress-run-browser-lt-browser-name-or-path-gt %}

## Customize available browsers

Sometimes you might want to modify the list of browsers found before running tests.

For example, your web application might *only* be designed to work in a Chrome browser, and not inside the Electron browser.

In the plugins file, you can filter the list of browsers passed inside the `config` object and return the list of browsers you want available for selection during `cypress open`.

```javascript
// cypress/plugins/index.js
module.exports = (on, config) => {
  // inside config.browsers array each object has information like
  // {
  //   name: 'chrome',
  //   channel: 'canary',
  //   family: 'chromium',
  //   displayName: 'Canary',
  //   version: '80.0.3966.0',
  //   path:
  //    '/Applications/Canary.app/Contents/MacOS/Canary',
  //   majorVersion: 80
  // }
  return {
    browsers: config.browsers.filter((b) => b.family === 'chromium')
  }
}
```

When you open the Test Runner in a project that uses the above modifications to your plugins file, only the Chrome browsers found on the system will display in the list of available browsers.

{% imgTag /img/guides/plugins/chrome-browsers-only.png "Filtered list of Chrome browsers" %}

{% note info %}
If you return an empty list of browsers or `browsers: null`, the default list will be restored automatically.
{% endnote %}

If you have installed a Chromium-based browser like {% url Brave https://brave.com/ %}, {% url Vivaldi https://vivaldi.com/ %} you can add them to the list of returned browsers. Here is a plugins file that inserts a local Brave browser into the returned list.

```javascript
// cypress/plugins/index.js
const execa = require('execa')
const findBrowser = () => {
  // the path is hard-coded for simplicity
  const browserPath =
    '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'

  return execa(browserPath, ['--version']).then((result) => {
    // STDOUT will be like "Brave Browser 77.0.69.135"
    const [, version] = /Brave Browser (\d+\.\d+\.\d+\.\d+)/.exec(
      result.stdout
    )
    const majorVersion = parseInt(version.split('.')[0])

    return {
      name: 'Brave',
      channel: 'stable',
      family: 'chromium',
      displayName: 'Brave',
      version,
      path: browserPath,
      majorVersion
    }
  })
}

module.exports = (on, config) => {
  return findBrowser().then((browser) => {
    return {
      browsers: config.browsers.concat(browser)
    }
  })
}
```

{% imgTag /img/guides/plugins/brave-browser.png "List of browsers includes Brave browser" %}

Once selected, the Brave browser is detected using the same approach as any other browser of the `chromium` family.

{% imgTag /img/guides/plugins/brave-running-tests.png "Brave browser executing end-to-end tests" %}

If you modify the list of browsers, you can see the {% url "resolved configuration" configuration#Resolved-Configuration %} in the **Settings** tab of the Test Runner.

## Unsupported Browsers

Many browsers such as Safari and Internet Explorer are not currently supported. Support for more browsers is on our roadmap. You can read an explanation about our future cross browser roadmap {% issue 310 'here' %}.

# Browser Environment

Cypress launches the browser in a way that's different from a regular browser environment. But it launches in a way that we believe makes testing *more reliable* and *accessible*.

## Launching Browsers

When Cypress goes to launch your browser it will give you an opportunity to modify the arguments used to launch the browser.

This enables you to do things like:

- Load your own extension
- Enable or disable experimental features

{% url 'This part of the API is documented here.' browser-launch-api %}

## Cypress Profile

Cypress generates its own isolated profile apart from your normal browser profile. This means things like `history` entries, `cookies`, and `3rd party extensions` from your regular browsing session will not affect your tests in Cypress.

{% note warning Wait, I need my developer extensions! %}
That's no problem - you have to reinstall them **once** in the Cypress launched browser. We'll continue to use this Cypress testing profile on subsequent launches so all of your configuration will be preserved.
{% endnote %}

## Disabled Barriers

Cypress automatically disables certain functionality in the Cypress launched browser that tend to get in the way of automated testing.

### The Cypress launched browser automatically:

- Ignores certificate errors.
- Allows blocked pop-ups.
- Disables 'Saving passwords'.
- Disables 'Autofill forms and passwords'.
- Disables asking to become your primary browser.
- Disables device discovery notifications.
- Disables language translations.
- Disables restoring sessions.
- Disables background network traffic.
- Disables background and renderer throttling.
- Disables prompts requesting permission to use devices like cameras or mics
- Disables user gesture requirements for autoplaying videos.

You can see all of the default chrome command line switches we send {% url "here" https://github.com/cypress-io/cypress/blob/develop/packages/server/lib/browsers/chrome.ts#L36 %}.

# Browser Icon

You might notice that if you already have the browser open you will see two of the same browser icons in your dock.

{% video local /img/snippets/switching-between-cypress-and-other-chrome-browser.mp4 %}

We understand that when Cypress is running in its own profile it can be difficult to tell the difference between your normal browser and Cypress.

For this reason you may find downloading and using a browser's release channel versions (Dev, Canary, etc) useful. These browsers have different icons from the standard stable browser, making them more distinguishable. You can also use the bundled {% urlHash "Electron browser" Electron-Browser %}, which does not have a dock icon.

{% video local /img/snippets/switching-cypress-browser-and-canary-browser.mp4 %}

Additionally, in Chrome-based browsers, we've made the browser spawned by Cypress look different than regular sessions. You'll see a darker theme around the chrome of the browser. You'll always be able to visually distinguish these.

{% imgTag /img/guides/cypress-browser-chrome.png "Cypress Browser with darker chrome" %}
