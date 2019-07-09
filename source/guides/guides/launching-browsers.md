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
- {% url "Electron" https://electron.atom.io/ %}

Cypress automatically detects available browsers on your OS. You can switch the browser in the Test Runner by using the drop down in the top right corner:

{% imgTag /img/guides/select-browser.png "Select a different browser" %}

{% partial chromium_download %}

## Electron Browser

In addition to the browsers found on your system, you'll notice that Electron is an available browser. The Electron browser is a version of Chromium that comes with {% url "Electron" https://electron.atom.io/ %}.

The Electron browser has two unique advantages:

1. It can be run headlessly.
2. It comes baked into Cypress and does not need to be installed separately.

By default, when running {% url '`cypress run`' command-line#cypress-run %} from the CLI, we will launch Electron headlessly.

### You can also launch Electron headed:

```shell
cypress run --headed
```

Because Electron is the default browser - it is typically run in CI. If you are seeing failures in CI, to easily debug them you may want to run locally with the `--headed` option.

## Chrome Browsers

All Chrome* flavored browsers will be detected and are supported.

### You can launch Chrome browsers:

```shell
cypress run --browser chrome
```

To use this command in CI, you need to install the browser you want - or use one of our {% url 'docker images' docker %}.

You can also launch Chromium:

```shell
cypress run --browser chromium
```

Or Chrome Canary:

```shell
cypress run --browser canary
```

{% url 'Having issues launching installed browsers? Read more about debugging browser launching' debugging#Launching-browsers %}

## Launching by a path

You can launch any supported browser by specifying a path to the binary:

```shell
cypress run --browser /usr/bin/chromium
# or
cypress open --browser /usr/bin/chromium
```

Cypress will automatically detect the type of browser supplied and launch it for you.

{% url 'See the Command Line guide for more information about the `--browser` arguments' command-line#cypress-run-browser-lt-browser-name-or-path-gt %}

## Unsupported Browsers

Many browsers such as Firefox, Safari, and Internet Explorer are not currently supported. Support for more browsers is on our roadmap. You can read an exhaustive explanation about our future cross browser testing strategy {% issue 310 'here' %}.

# Browser Environment

Cypress launches the browser in a way that's different from a regular browser environment. But it launches in a way that we believe makes testing *more reliable* and *accessible*.

## Launching Browsers

When Cypress goes to launch your browser it will give you an opportunity to modify the arguments used to launch the browser.

This enables you to do things like:

- Load your own chrome extension
- Enable or disable experimental chrome features

{% url 'This part of the API is documented here.' browser-launch-api %}

## Cypress Profile

Cypress generates its own isolated profile apart from your normal browser profile. This means things like `history` entries, `cookies`, and `3rd party extensions` from your regular browsing session will not affect your tests in Cypress.

{% note warning Wait, I need my developer extensions! %}
That's no problem - you just have to reinstall them **once** in the Cypress launched browser. We'll continue to use this Cypress testing profile on subsequent launches so all of your configuration will be preserved.
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

You can see all of the default chrome command line switches we send {% url "here" https://github.com/cypress-io/cypress/blob/develop/packages/server/lib/browsers/chrome.coffee#L18 %}.

# Browser Icon

You might notice that if you already have the browser open you will see two of the same browser icons in your Dock.

{% video local /img/snippets/switching-between-cypress-and-other-chrome-browser.mp4 %}

We understand that when Cypress is running in its own profile it can be difficult to tell the difference between your normal browser and Cypress.

For this reason we recommend {% url "downloading Chromium" https://www.chromium.org/Home %} or {% url "downloading Canary" https://www.google.com/chrome/browser/canary.html %}. These browsers both have different icons from the standard Chrome browser and it'll be much easier to tell the difference. You can also use the bundled {% urlHash "Electron browser" Electron-Browser %}, which does not have a Dock icon.

{% video local /img/snippets/switching-cypress-browser-and-canary-browser.mp4 %}

Additionally, we've made the browsers spawned by Cypress look different than regular sessions. You'll see a darker theme around the chrome of the browser. You'll always be able to visually distinguish these.

{% imgTag /img/guides/cypress-browser-chrome.png "Cypress Browser with darker chrome" %}
