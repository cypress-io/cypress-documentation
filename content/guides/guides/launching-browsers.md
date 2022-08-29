---
title: Launching Browsers
---

When you run tests in Cypress, we launch a browser for you. This enables us to:

1. Create a clean, pristine testing environment.
2. Access the privileged browser APIs for automation.

<Alert type="info">

<strong class="alert-header">Cross Browser Support</strong>

Cypress currently supports Firefox and Chrome-family browsers (including Edge
and Electron). To run tests optimally across these browsers in CI, check out the
strategies demonstrated in the
[cross browser Testing](/guides/guides/cross-browser-testing) guide.

</Alert>

## Browsers

When Cypress is initially launched, you can choose to test your application
using number of browsers including:

- [Chrome](https://www.google.com/chrome/)
- [Chrome Beta](https://www.google.com/chrome/beta/)
- [Chrome Canary](https://www.google.com/chrome/canary/)
- [Chromium](https://www.chromium.org/Home)
- [Edge](https://www.microsoft.com/edge)
- [Edge Beta](https://www.microsoftedgeinsider.com/download)
- [Edge Canary](https://www.microsoftedgeinsider.com/download)
- [Edge Dev](https://www.microsoftedgeinsider.com/download)
- [Electron](https://electron.atom.io/)
- [Firefox](https://www.mozilla.org/firefox/)
- [Firefox Developer Edition](https://www.mozilla.org/firefox/developer/)
- [Firefox Nightly](https://www.mozilla.org/firefox/nightly/)

Cypress automatically detects available browsers on your OS. You can switch the
browser by using the drop down near the top right corner:

<DocsImage src="/img/guides/launching-browsers/v10/browser-list-dropdown.png" alt="Select a different browser"></DocsImage>

### Browser versions supported

Cypress supports the browser versions below:

- Chrome 64 and above.
- Edge 79 and above.
- Firefox 86 and above.

### Download specific Chrome version

The Chrome browser is evergreen - meaning it will automatically update itself,
sometimes causing a breaking change in your automated tests. We host
[chromium.cypress.io](https://chromium.cypress.io) with links to download a
specific released version of Chrome (dev, Canary and stable) for every platform.

### Electron Browser

In addition to the browsers found on your system, you'll notice that Electron is
an available browser. The Electron browser is a version of Chromium that comes
with [Electron](https://electron.atom.io/).

The Electron browser has the advantage of coming baked into Cypress and does not
need to be installed separately.

By default, when running [cypress run](/guides/guides/command-line#cypress-run)
from the CLI, we will launch all browsers headlessly.

#### You can also launch Electron headed:

```shell
cypress run --headed
```

Because Electron is the default browser - it is typically run in CI. If you are
seeing failures in CI, to easily debug them you may want to run locally with the
`--headed` option.

### Chrome Browsers

All Chrome\* flavored browsers will be detected and are supported above
Chrome 64.

You can launch Chrome like this:

```shell
cypress run --browser chrome
```

To use this command in CI, you need to install the browser you want - or use one
of our [docker images](/examples/examples/docker).

By default, we will launch Chrome in headlessly during `cypress run`. To run
Chrome headed, you can pass the `--headed` argument to `cypress run`.

You can also launch Chromium:

```shell
cypress run --browser chromium
```

Or Chrome Beta:

```shell
cypress run --browser chrome:beta
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

### Firefox Browsers

Firefox-family browsers are supported by Cypress.

You can launch Firefox like this:

```shell
cypress run --browser firefox
```

Or Firefox Developer/Nightly Edition:

```shell
cypress run --browser firefox:dev
cypress run --browser firefox:nightly
```

To use this command in CI, you need to install these other browsers - or use one
of our [docker images](/examples/examples/docker).

By default, we will launch Firefox headlessly during `cypress run`. To run
Firefox headed, you can pass the `--headed` argument to `cypress run`.

### Launching by a path

You can launch any supported browser by specifying a path to the binary:

```shell
cypress run --browser /usr/bin/chromium
```

```shell
cypress open --browser /usr/bin/chromium
```

Cypress will automatically detect the type of browser supplied and launch it for
you.

[See the Command Line guide for more information about the `--browser` arguments](/guides/guides/command-line#cypress-run-browser-lt-browser-name-or-path-gt)

[Having trouble launching a browser? Check out our troubleshooting guide](/guides/references/troubleshooting#Launching-browsers)

### Customize available browsers

Sometimes you might want to modify the list of browsers found before running
tests.

For example, your web application might _only_ be designed to work in a Chrome
browser, and not inside the Electron browser.

In the [setupNodeEvents](/api/plugins/configuration-api) function, you can
filter the list of browsers passed inside the `config` object and return the
list of browsers you want available for selection during `cypress open`.

:::cypress-plugin-example

```javascript
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
  browsers: config.browsers.filter(
    (b) => b.family === 'chromium' && b.name !== 'electron'
  ),
}
```

:::

When you open Cypress in a project that uses the above modifications to the
`setupNodeEvents` function, Electron will no longer display in the list of
available browsers.

<Alert type="info">

If you return an empty list of browsers or `browsers: null`, the default list
will be restored automatically.

</Alert>

If you have installed a Chromium-based browser like [Brave](https://brave.com/),
[Vivaldi](https://vivaldi.com/) you can add them to the list of returned
browsers. Here is a configuration that inserts a local Brave browser into the
returned list.

:::cypress-plugin-example

```js
const execa = require('execa')
const findBrowser = () => {
  // the path is hard-coded for simplicity
  const browserPath =
    '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'

  return execa(browserPath, ['--version']).then((result) => {
    // STDOUT will be like "Brave Browser 77.0.69.135"
    const [, version] = /Brave Browser (\d+\.\d+\.\d+\.\d+)/.exec(result.stdout)
    const majorVersion = parseInt(version.split('.')[0])

    return {
      name: 'Brave',
      channel: 'stable',
      family: 'chromium',
      displayName: 'Brave',
      version,
      path: browserPath,
      majorVersion,
    }
  })
}
```

```js
return findBrowser().then((browser) => {
  return {
    browsers: config.browsers.concat(browser),
  }
})
```

:::

Once selected, the Brave browser is detected using the same approach as any
other browser of the `chromium` family.

<DocsImage src="/img/guides/launching-browsers/v10/brave-running-tests.png" alt="Brave browser executing end-to-end tests"></DocsImage>

If you modify the list of browsers, you can see the
[resolved configuration](/guides/references/configuration#Resolved-Configuration)
in the **Settings** tab.

### Unsupported Browsers

Some browsers such as Safari and Internet Explorer are not currently supported.
Support for more browsers is on our roadmap.

## Browser Environment

Cypress launches the browser in a way that's different from a regular browser
environment. But it launches in a way that we believe makes testing _more
reliable_ and _accessible_.

### Launching Browsers

When Cypress goes to launch your browser it will give you an opportunity to
modify the arguments used to launch the browser.

This enables you to do things like:

- Load your own extension
- Enable or disable experimental features

[This part of the API is documented here.](/api/plugins/browser-launch-api)

### Cypress Profile

Cypress generates its own isolated profile apart from your normal browser
profile. This means things like `history` entries, `cookies`, and
`3rd party extensions` from your regular browsing session will not affect your
tests in Cypress.

<Alert type="warning">

<strong class="alert-header">Wait, I need my developer extensions!</strong>

That's no problem - you have to reinstall them **once** in the Cypress launched
browser. We'll continue to use this Cypress testing profile on subsequent
launches so all of your configuration will be preserved.

</Alert>

### Disabled Barriers

Cypress automatically disables certain functionality in the Cypress launched
browser that tend to get in the way of automated testing.

#### The Cypress launched browser automatically:

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

You can see all of the default chrome command line switches we send
[here](https://github.com/cypress-io/cypress/blob/develop/packages/server/lib/browsers/chrome.ts#L36).

## Browser Icon

You might notice that if you already have the browser open you will see two of
the same browser icons in your dock.

<DocsImage src="/img/guides/launching-browsers/v10/multiple-chrome-icons.png" alt="Cypress icon with 2 Google Chrome icons"></DocsImage>

We understand that when Cypress is running in its own profile it can be
difficult to tell the difference between your normal browser and Cypress.

For this reason you may find downloading and using a browser's release channel
versions (Dev, Canary, etc) useful. These browsers have different icons from the
standard stable browser, making them more distinguishable. You can also use the
bundled [Electron browser](#Electron-Browser), which does not have a dock icon.

Additionally, in Chrome-based browsers, we've made the browser spawned by
Cypress look different than regular sessions. You'll see a darker theme around
the chrome of the browser. You'll always be able to visually distinguish these.

<DocsImage src="/img/guides/launching-browsers/v10/cypress-browser-chrome.png" alt="Cypress Browser with darker chrome"></DocsImage>

## Troubleshooting

[Having issues launching installed browsers? Read more about troubleshooting browser launching](/guides/references/troubleshooting#Launching-browsers)
