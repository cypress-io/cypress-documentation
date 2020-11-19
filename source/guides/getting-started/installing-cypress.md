---
title: Installing Cypress
---

{% note info %}
# {% fa fa-graduation-cap %} What you'll learn

- How to install Cypress via `npm`
- How to install Cypress via direct download
- How to version and run Cypress via `package.json`

{% endnote %}

# System requirements

### Operating System

Cypress is a desktop application that is installed on your computer. The desktop application supports these operating systems:

- **macOS** 10.9 and above *(64-bit only)*
- **Linux** Ubuntu 12.04 and above, Fedora 21 and Debian 8 *(64-bit only)*
- **Windows** 7 and above

### Node.js

If you're using `npm` to install Cypress, we support:

- **Node.js** 10 or 12 and above

### Linux

If you're using Linux, you'll want to have the required dependencies installed on your system.

We also have an official {% url 'cypress/base' 'https://hub.docker.com/r/cypress/base/' %} Docker container with all of the required dependencies installed.

{% partial linux_dependencies %}

# Installing

## {% fa fa-terminal %} `npm install`

Install Cypress via `npm`:

```shell
cd /your/project/path
```

```shell
npm install cypress --save-dev
```

This will install Cypress locally as a dev dependency for your project.

{% note info %}
Make sure that you have already run {% url "`npm init`" https://docs.npmjs.com/cli/init %} or have a `node_modules` folder or `package.json` file in the root of your project to ensure cypress is installed in the correct directory.
{% endnote %}

{% video local /img/snippets/installing-cli.mp4 %}

{% note info %}
Notice that the Cypress `npm` package is a wrapper around the Cypress binary. The version of the `npm` package determines the version of the binary downloaded.
As of version `3.0`, the binary is downloaded to a global cache directory to be used across projects.
{% endnote %}

{% note success Best Practice %}

The recommended approach is to install Cypress with `npm` because :

- Cypress is versioned like any other dependency.
- It simplifies running Cypress in {% url 'Continuous Integration' continuous-integration %}.
{% endnote %}

## {% fa fa-terminal %} `yarn add`

Installing Cypress via {% url "`yarn`" https://yarnpkg.com %}:

```shell
cd /your/project/path
```

```shell
yarn add cypress --dev
```

## {% fa fa-download %} Direct download

If you're not using Node or `npm` in your project or you want to try Cypress out quickly, you can always {% url "download Cypress directly from our CDN" https://download.cypress.io/desktop %}.

{% note warning %}
Recording runs to the Dashboard is not possible from the direct download. This download is only intended as a quick way to try out Cypress. To record tests to the Dashboard, you'll need to install Cypress as an `npm` dependency.
{% endnote %}

The direct download will always grab the latest available version. Your platform will be detected automatically.

Then you can manually unzip and double click. Cypress will run without needing to install any dependencies.

{% video local /img/snippets/installing-global.mp4 %}

## {% fa fa-refresh %} Continuous integration

Please read our {% url 'Continuous Integration' continuous-integration %} docs for help installing Cypress in CI. When running in linux you'll need to install some {% url 'system dependencies' continuous-integration#Dependencies %} or you can use our {% url 'Docker images' docker %} which have everything you need prebuilt.

# Opening Cypress

If you used `npm` to install, Cypress has now been installed to your `./node_modules` directory, with its binary executable accessible from `./node_modules/.bin`.

Now you can open Cypress from your **project root** one of the following ways:

**The long way with the full path**

```shell
./node_modules/.bin/cypress open
```

**Or with the shortcut using `npm bin`**

```shell
$(npm bin)/cypress open
```

**Or by using `npx`**

**note**: {% url "npx" https://www.npmjs.com/package/npx %} is included with `npm > v5.2` or can be installed separately.

```shell
npx cypress open
```

**Or by using `yarn`**

```shell
yarn run cypress open
```

After a moment, the Cypress Test Runner will launch.

## Switching browsers

The Cypress Test Runner attempts to find all compatible browsers on the user's machine. The drop down to select a different browser is in the top right corner of the Test Runner.

{% imgTag /img/guides/browser-list-dropdown.png "Select a different browser" %}

Read {% url "Launching Browsers" launching-browsers %} for more information on how Cypress controls a real browser during end-to-end tests.

{% note info Cross Browser Support %}

Cypress currently supports Firefox and Chrome-family browsers (including Edge and Electron). To run tests optimally across these browsers in CI, check out the strategies demonstrated in the {% url "cross browser Testing" cross-browser-testing %} guide.

{% endnote %}

## Adding npm scripts

While there's nothing wrong with writing out the full path to the Cypress executable each time, it's much easier and clearer to add Cypress commands to the `scripts` field in your `package.json` file.

```javascript
{
  "scripts": {
    "cypress:open": "cypress open"
  }
}
```

Now you can invoke the command from your project root like so:

```shell
npm run cypress:open
```

...and Cypress will open right up for you.

# CLI tools

By installing Cypress through `npm` you also get access to many other CLI commands.

As of version `0.20.0` Cypress is also a fully baked `node_module` you can require in your Node scripts.

You can {% url 'read more about the CLI here' command-line %}.

# Advanced

## Environment variables

Name | Description
------ |  ---------
`CYPRESS_INSTALL_BINARY` | {% urlHash "Destination of Cypress binary that's downloaded and installed" Install-binary %}
`CYPRESS_DOWNLOAD_MIRROR` | {% urlHash "Downloads the Cypress binary though a mirror server"  Mirroring %}
`CYPRESS_CACHE_FOLDER` | {% urlHash "Changes the Cypress binary cache location" Binary-cache %}
`CYPRESS_RUN_BINARY` | {% urlHash "Location of Cypress binary at run-time" Run-binary %}
~~CYPRESS_SKIP_BINARY_INSTALL~~ | {% badge danger removed %} use `CYPRESS_INSTALL_BINARY=0` instead
~~CYPRESS_BINARY_VERSION~~ | {% badge danger removed %} use `CYPRESS_INSTALL_BINARY` instead

## Install binary

Using the `CYPRESS_INSTALL_BINARY` environment variable, you can control how Cypress is installed.  To override what is installed, you set `CYPRESS_INSTALL_BINARY` alongside the `npm install` command.

**This is helpful if you want to:**

- Install a version different than the default npm package.
    ```shell
CYPRESS_INSTALL_BINARY=2.0.1 npm install cypress@2.0.3
    ```
- Specify an external URL (to bypass a corporate firewall).
    ```shell
CYPRESS_INSTALL_BINARY=https://company.domain.com/cypress.zip npm install cypress
    ```
- Specify a file to install locally instead of using the internet.
    ```shell
CYPRESS_INSTALL_BINARY=/local/path/to/cypress.zip npm install cypress
    ```

In all cases, the fact that the binary was installed from a custom location *is not saved in your `package.json` file*. Every repeated installation needs to use the same environment variable to install the same binary.

### Skipping installation

You can also force Cypress to skip the installation of the binary application by setting `CYPRESS_INSTALL_BINARY=0`. This could be useful if you want to prevent Cypress from downloading the Cypress binary at the time of `npm install`.

```shell
CYPRESS_INSTALL_BINARY=0 npm install
```

Now Cypress will skip its install phase once the npm module is installed.

## Binary cache

As of version `3.0`, Cypress downloads the matching Cypress binary to the global system cache, so that the binary can be shared between projects. By default, global cache folders are:

- **MacOS**: `~/Library/Caches/Cypress`
- **Linux**: `~/.cache/Cypress`
- **Windows**: `/AppData/Local/Cypress/Cache`

To override the default cache folder, set the environment variable `CYPRESS_CACHE_FOLDER`.

```shell
CYPRESS_CACHE_FOLDER=~/Desktop/cypress_cache npm install
```

```shell
CYPRESS_CACHE_FOLDER=~/Desktop/cypress_cache npm run test
```

Cypress will automatically replace the `~` with the user's home directory. So you can pass `CYPRESS_CACHE_FOLDER` as a string from CI configuration files, for example:

```yml
environment:
  CYPRESS_CACHE_FOLDER: '~/.cache/Cypress'
```

See also {% url 'Continuous Integration - Caching' continuous-integration#Caching %} section in the documentation.

{% note warning %}
`CYPRESS_CACHE_FOLDER` will need to exist every time cypress is launched. To ensure this, consider exporting this environment variable. For example, in a `.bash_profile` (MacOS, Linux), or using `RegEdit` (Windows).
{% endnote %}

## Run binary

Setting the environment variable `CYPRESS_RUN_BINARY` overrides where the npm module finds the Cypress binary.

`CYPRESS_RUN_BINARY` should be a path to an already unzipped binary executable. The Cypress commands `open`, `run`, and `verify` will then launch the provided binary.

### Mac

```shell
CYPRESS_RUN_BINARY=~/Downloads/Cypress.app/Contents/MacOS/Cypress cypress run
```

### Linux

```shell
CYPRESS_RUN_BINARY=~/Downloads/Cypress/Cypress cypress run
```

### Windows

```shell
CYPRESS_RUN_BINARY=~/Downloads/Cypress/Cypress.exe cypress run
```

{% note warning %}
We recommend **not exporting** the `CYPRESS_RUN_BINARY` environment variable, since it will affect every cypress module installed on your file system.
{% endnote %}

## Download URLs

If you want to download a specific Cypress version for a given platform (Operating System), you can get it from our CDN.

The download server URL is `https://download.cypress.io`.

We currently have the following downloads available:

- Windows 64-bit (`?platform=win32&arch=x64`)
- Windows 32-bit (`?platform=win32&arch=ia32`, available since {% url "Cypress 3.3.0" changelog#3-3-0 %})
- Linux 64-bit (`?platform=linux`)
- macOS 64-bit (`?platform=darwin`)

Here are the available download URLs:

See {% url "https://download.cypress.io/desktop.json" https://download.cypress.io/desktop.json %} for all available platforms.

 Method | URL                            | Description
 ------ | ------------------------------ | -------------------------------------------------------------------------
 `GET`  | `/desktop`                     | Download Cypress at latest version (platform auto-detected)
 `GET`  | `/desktop.json`                | Returns JSON containing latest available CDN destinations
 `GET`  | `/desktop?platform=p&arch=a`   | Download Cypress for a specific platform and/or architecture
 `GET`  | `/desktop/:version`            | Download Cypress with a specified version
 `GET`  | `/desktop/:version?platform=p&arch=a` | Download Cypress with a specified version and platform and/or architecture

**Example of downloading Cypress `3.0.0` for Windows 64-bit:**

```text
https://download.cypress.io/desktop/3.0.0?platform=win32&arch=x64
```

## Mirroring

If you choose to mirror the entire Cypress download site, you can specify `CYPRESS_DOWNLOAD_MIRROR` to set the download server URL from `https://download.cypress.io` to your own mirror.

For example:

```shell
CYPRESS_DOWNLOAD_MIRROR="https://www.example.com" cypress install
```

Cypress will then attempt to download a binary with this format: `https://www.example.com/desktop/:version?platform=p`

## Opt out of sending exception data to Cypress

When an exception is thrown regarding Cypress, we send along the exception data to `https://api.cypress.io`. We solely use this information to help develop a better product.

If you would like to opt out of sending any exception data to Cypress, you can do so by setting `CYPRESS_CRASH_REPORTS=0` in your system environment variables.

### Opt out on Linux or macOS

To opt out of sending exception data on Linux or macOS, run the following command in a terminal before installing Cypress:

```shell
export CYPRESS_CRASH_REPORTS=0
```

To make these changes permanent, you can add this command to your shell's `~/.profile` (`~/.zsh_profile`, `~/.bash_profile`, etc.) to run them on every login.

### Opt out on Windows

To opt out of sending exception data on Windows, run the following command in the Command Prompt before installing Cypress:

```shell
set CYPRESS_CRASH_REPORTS=0
```

To accomplish the same thing in Powershell:

```shell
$env:CYPRESS_CRASH_REPORTS = "0"
```

To save the `CYPRESS_CRASH_REPORTS` variable for use in all new shells, use `setx`:

```shell
setx CYPRESS_CRASH_REPORTS 0
```

## Install pre-release version

If you would like to install a pre-release version of the Test Runner to test out functionality that has not yet been released, here is how:

1. Open up the list of commits to `develop` on the Cypress repo: {% url https://github.com/cypress-io/cypress/commits/develop %}
2. Find the commit that you would like to install the pre-release version of. Click the comment icon (highlighted in red below):
    {% imgTag /img/guides/install/develop-commit-comment-link.png "Example of a commit for which pre-releases are available. Comment link highlighted in red." %}
3. You should see several comments from the `cypress-bot` user with instructions for installing Cypress pre-releases. Pick the one that corresponds to your operating system and CPU architecture, and follow the instructions there to install the pre-release.

Notes on pre-releases:

- Cypress pre-releases are only available for about a month after they are built. Do not rely on these being available past one month.
- If you already have a pre-release or official release installed for a specific version of Cypress, you may need to do `cypress cache clear` before Cypress will install a pre-release. This also applies to installing an official release over a pre-release - if you have a pre-release of Cypress vX.Y.Z installed, the official release of Cypress vX.Y.Z will not install until you do `cypress cache clear`.
