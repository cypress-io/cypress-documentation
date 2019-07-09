---
title: Cypressをインストール
---

{% note info %}
# {% fa fa-graduation-cap %} What you'll learn

- How to install Cypress via `npm`
- How to install Cypress via direct download
- How to version and run Cypress via `package.json`

{% endnote %}

# System requirements

Cypress is a desktop application that is installed on your computer. The desktop application supports these operating systems:

- **macOS** 10.9 and above *(64-bit only)*
- **Linux** Ubuntu 12.04 and above, Fedora 21 and Debian 8 *(64-bit only)*
- **Windows** 7 and above *(32-bit only)*

# Installing

## {% fa fa-terminal %} `npm install`

Installing Cypress via `npm` is easy:

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

If you're not using Node or npm in your project or you just want to try Cypress out quickly, you can always {% url "download Cypress directly from our CDN" https://download.cypress.io/desktop %}.

The direct download will always grab the latest available version. Your platform will be detected automatically.

Just manually unzip and double click. Cypress will run without needing to install any dependencies.

{% video local /img/snippets/installing-global.mp4 %}

## {% fa fa-refresh %} Continuous integration

Please read our {% url 'Continuous Integration' continuous-integration %} docs for help installing Cypress in CI. When running in linux you'll need to install some {% url 'system dependencies' continuous-integration#Dependencies %} or you can just use our {% url 'Docker images' docker %} which have everything you need prebuilt.

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

{% imgTag /img/guides/select-browser.png "Select a different browser" %}

Read {% url "Launching Browsers" launching-browsers %} for more information on how Cypress controls a real browser during end-to-end tests.

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

## Hosting

If you want to download a specific Cypress version for a given platform (Operating System), you can get it from our CDN. You may also want to host Cypress yourself and serve it from a local network.

The download server URL is `https://download.cypress.io`.

See {% url "https://download.cypress.io/desktop.json" https://download.cypress.io/desktop.json %} for all available platforms.

 Method | URL                            | Description
 ------ | ------------------------------ | -------------------------------------------------------------------------
 `GET`  | `/desktop                 `    | Download Cypress at latest version (platform auto-detected)
 `GET`  | `/desktop.json            `    | Returns JSON containing latest available CDN destinations
 `GET`  | `/desktop?platform=p      `    | Download Cypress for a specific platform
 `GET`  | `/desktop/:version`            | Download Cypress with a specified version
 `GET`  | `/desktop/:version?platform=p` | Download Cypress with a specified version and platform

**Example of downloading Cypress `3.0.0` for Windows platform:**

```
https://download.cypress.io/desktop/3.0.0?platform=win
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

In very rare cases you might want to install the pre-release version of Cypress to verify a fix from the {% url "`develop`" https://github.com/cypress-io/cypress/commits/develop %} branch, that has not been published yet.  

{% note info %}
You can preview all issues addressed from a pre-release version {% url "here" https://github.com/cypress-io/cypress/issues?utf8=%E2%9C%93&q=label%3A%22stage%3A+pending+release%22+ %}.
{% endnote %}

We build every commit in the {% url "`develop`" https://github.com/cypress-io/cypress/commits/develop %} branch for each platform and test it against downstream projects. For example, in the image below the last commit has the short SHA `e5106d9`.

{% imgTag /img/guides/install/last-commit.png "Last commit on develop branch" %}

The simplest way to find the pre-release version of the Test Runner matching this commit is to look at the commits made on our projects under test at {% url "cypress-test-example-repos" https://github.com/cypress-io/cypress-test-example-repos/commits/master %}. You will see individual commits for each built platform and architecture: `darwin` (Mac), `linux`, `win 32bit` and `win 64bit`. The built commit SHA `e5106d9` is in the subject line of the test commit:

{% imgTag /img/guides/install/test-commits.png "Test commit per platform" %}

These pre-release builds are platform-specific. Choose the platform that matches your platform; for example if you are on a Mac, click on the commit "Testing new darwin x64 ...". This commit has a custom message that shows a special temporary URL of the built binary for Mac OS and the matching npm `cypress` package.

{% imgTag /img/guides/install/beta-binary.png "Beta binary information" %}

To install this pre-release binary on Mac, you need to set the `CYPRESS_INSTALL_BINARY` environment variable to the shown `https://cdn.cypress.io/beta/binary/.../cypress.zip` value and run `npm install https://cdn.cypress.io/beta/npm/3.3.2/.../cypress.tgz`. The command in the terminal will be:

```shell
export CYPRESS_INSTALL_BINARY=https://cdn.cypress.io/beta/binary/3.3.2/darwin-x64/circle-develop-e5106d95f51eec477b8e66609939979fb87aab56-126014/cypress.zip
```

```shell
npm install https://cdn.cypress.io/beta/npm/3.3.2/circle-develop-e5106d95f51eec477b8e66609939979fb87aab56-126013/cypress.tgz
```

If my machine is Windows 64bit, I will click on the "Testing new win32 x64 ..." commit and run the command below.

```shell
set CYPRESS_INSTALL_BINARY=https://cdn.cypress.io/beta/binary/3.3.2/win32-x64/appveyor-develop-e5106d95f51eec477b8e66609939979fb87aab56-25451270/cypress.zip
```

```shell
npm install https://cdn.cypress.io/beta/npm/3.3.2/appveyor-develop-e5106d95f51eec477b8e66609939979fb87aab56-25451270/cypress.tgz
```

On Linux CI you should install the binary from the "Testing new linux x64 ..." commit.

```shell
export CYPRESS_INSTALL_BINARY=https://cdn.cypress.io/beta/binary/3.3.2/linux-x64/circle-develop-e5106d95f51eec477b8e66609939979fb87aab56-125973/cypress.zip
```

```shell
npm install https://cdn.cypress.io/beta/npm/3.3.2/circle-develop-e5106d95f51eec477b8e66609939979fb87aab56-125992/cypress.tgz
```

### Pre-release binary URL format

The above `CYPRESS_INSTALL_BINARY` urls are temporary - they are purged after 30 days. The format of the url is as follows:

```text
https://cdn.cypress.io/beta/binary/&lt;version&gt;/&lt;platform&gt;-&lt;arch&gt;/
&lt;ci name&gt;-&lt;branch name&gt;-&lt;full commit SHA&gt;-&lt;CI build number&gt;/cypress.zip
```
