---
title: 安装Cypress
---

{% note info %}
# {% fa fa-graduation-cap %} 你将学到

- 如何通过`npm`来安装Cypress.
- 如何通过直接下载来安装Cypress.
- 如何通过`package.json`来确认版本以及运行Cypress.

{% endnote %}

# 系统必要条件

Cypress是一个被安装在你电脑上的桌面应用. 该桌面应用支持这些操作系统:

- **Mac OS** 10.9+ (Mavericks+), 仅提供64位二进制文件.
- **Linux** Ubuntu 12.04+, Fedora 21, Debian 8的64位二进制文件
- **Windows** 7+, 仅提供32位二进制文件.

# 安装

## {% fa fa-terminal %} `npm install`

通过`npm`来安装Cypress很容易:

```shell
cd /your/project/path
```

```shell
npm install cypress --save-dev
```

这将把Cypress作为一个dev的本地依赖安装到你的项目中.

{% note info %}
确保你已经运行了{% url "`npm init`" https://docs.npmjs.com/cli/init %}或者存在`node_modules`文件夹或者存在`package.json`文件在你项目的根目录下, 以此来确保cypress被安装到正确的路径下.
{% endnote %}

{% video local /img/snippets/installing-cli.mp4 %}

{% note info %}
注意Cypress的`npm`包是Cypress的二进制文件warpper. `npm` package的版本决定了二进制文件的下载版本.
As of version `3.0`, the binary is downloaded to a global cache directory to be used across projects.
截至`3.0`版, 二进制文件会被下载到全局缓存目录从而能够被跨项目使用.
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

If you're not using Node.js or `npm` in your project or you just want to try Cypress out quickly, you can always {% url "download Cypress directly from our CDN" http://download.cypress.io/desktop %}.

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

## Download URLs

If you want to download a specific Cypress version for a given platform (Operating System), you can get it from our CDN.

The download server URL is `https://download.cypress.io`.

We currently have the following downloads available:

* Windows 64-bit (`?platform=win32&arch=x64`)
* Windows 32-bit (`?platform=win32&arch=ia32`, available since {% url "Cypress 3.3.0" changelog#3-3-0 %})
* Linux 64-bit (`?platform=linux`)
* macOS 64-bit (`?platform=darwin`)

Here are the available download URLs:

See {% url "https://download.cypress.io/desktop.json" https://download.cypress.io/desktop.json %} for all available platforms.

 Method | URL                            | Description
 ------ | ------------------------------ | -------------------------------------------------------------------------
 `GET`  | `/desktop                 `    | Download Cypress at latest version (platform auto-detected)
 `GET`  | `/desktop.json            `    | Returns JSON containing latest available CDN destinations
 `GET`  | `/desktop?platform=p&arch=a  ` | Download Cypress for a specific platform and/or architecture
 `GET`  | `/desktop/:version`            | Download Cypress with a specified version
 `GET`  | `/desktop/:version?platform=p&arch=a` | Download Cypress with a specified version and platform and/or architecture

**Example of downloading Cypress `3.0.0` for Windows 64-bit:**

```
https://download.cypress.io/desktop/3.0.0?platform=win32&arch=x64
```

## Mirroring

If you choose to mirror the entire Cypress download site, you can specify `CYPRESS_DOWNLOAD_MIRROR` to set the download server URL from `https://download.cypress.io` to your own mirror.

For example:

```shell
CYPRESS_DOWNLOAD_MIRROR="https://www.example.com" cypress install
```

Cypress will then attempt to download a binary with this format: `https://www.example.com/desktop/:version?platform=p`
