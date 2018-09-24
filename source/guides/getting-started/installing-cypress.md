---
title: Installing Cypress
---

{% note success %}
# {% fa fa-graduation-cap %} What you'll learn

- How to install Cypress via `npm`.
- How to install Cypress via direct download.
- How to version and run Cypress via `package.json`

{% endnote %}

# System Requirements

Cypress is a desktop application that is installed on your computer. The desktop application supports these operating systems:

- **Mac OS** 10.9+ (Mavericks+), only 64bit binaries are provided for macOS.
- **Linux** Ubuntu 12.04+, Fedora 21, Debian 8, 64-bit binaries
- **Windows** 7+, only 32bit binaries are provided for Windows.

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

## {% fa fa-download %} Direct Download

If you're not using Node.js or `npm` in your project or you just want to try Cypress out quickly, you can always {% url "download Cypress directly from our CDN" http://download.cypress.io/desktop %}.

The direct download will always grab the latest available version. Your platform will be detected automatically.

Just manually unzip and double click. Cypress will run without needing to install any dependencies.

{% video local /img/snippets/installing-global.mp4 %}

## {% fa fa-refresh %} Continuous Integration

Please read our {% url 'Continuous Integration' continuous-integration %} docs for help installing Cypress in CI. When running in linux you'll need to install some {% url 'system dependencies' continuous-integration#Dependencies %} or you can just use our {% url 'Docker images' docker %} which have everything you need prebuilt.

# Opening Cypress

If you used `npm` to install, Cypress has now been installed to your `./node_modules` directory, with its binary executable accessible from `./node_modules/.bin`. This means you can call it from your project root either of the following ways:

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

After a moment, the Cypress Test Runner will launch.

## Adding npm scripts

While there's nothing wrong with writing out the full path to the Cypress executable each time, it's much easier and clearer to add Cypress commands to the `scripts` field in your `package.json` file.

```javascript
{
  // package.json

  "scripts": {
    "cypress:open": "cypress open"
  }
}
```

Now you can invoke the command like so:

```shell
npm run cypress:open
```

...and Cypress will open right up for you.

# CLI Tools

By installing Cypress through `npm` you also get access to many other CLI commands.

As of version `0.20.0` Cypress is also a fully baked `node_module` you can require in your Node scripts.

You can {% url 'read more about the CLI here' command-line %}.

# Advanced

## Environment Variables

Using an environment variable you can control how Cypress is installed. This is helpful if you want to:

- Install a different version than the default npm package.
- Specify an external URL (to bypass a corporate firewall).
- Specify a local file to install locally instead of using the internet.

To override what is installed, you simply set `CYPRESS_INSTALL_BINARY` with the `npm install` command.

### Examples:

1. Install the `cypress` npm package version `2.0.3` with the binary `2.0.1` version:

    ```shell
    CYPRESS_INSTALL_BINARY=2.0.1 npm install cypress@2.0.3
    ```

2. Install the Cypress binary from a given URL:

    ```shell
    CYPRESS_INSTALL_BINARY=https://company.domain.com/cypress.zip npm install cypress
    ```

3. Install the Cypress binary from a local file:

    ```shell
    CYPRESS_INSTALL_BINARY=/local/path/to/cypress.zip npm install cypress
    ```

In all cases, the fact that the binary was installed from a custom location *is not saved in your `package.json` file*. Every repeated installation needs to use the same environment variable to install the same binary.

## Skipping Installation

You can also force Cypress to skip the installation of the binary application. This could be useful if you want to prevent Cypress from downloading the Cypress binary at the time of `npm install`.

Just set `CYPRESS_INSTALL_BINARY=0`

```shell
CYPRESS_INSTALL_BINARY=0 npm install
```

Now Cypress will skip its install phase once the npm module is installed.

## Overriding the Binary Cache Folder

As of version `3.0`, Cypress downloads the matching Cypress binary to the global system cache, so that the binary can be shared between projects. By default, these locations are:

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

{% note warning %}
`CYPRESS_CACHE_FOLDER` will need to exist every time cypress is launched. To ensure this, consider exporting this environment variable. For example, in a `.bash_profile` (MacOS, Linux), or using `RegEdit` (Windows).
{% endnote %}

## Overriding the Cypress Binary at Runtime

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

If you want to download a specific Cypress version for a given platform, you can get it from our CDN.

You may want to do this if you want to host Cypress yourself and serve it from a local network.

The download server url is `https://download.cypress.io`.

 Method | Url | Description
 ------ | --- | -----------
`GET` | `/desktop                 `  | Download latest desktop app
`GET` | `/desktop?platform=p      `  | downloads latest desktop app for specific platform
`GET` | `/desktop.json            `  | returns desktop manifest.json
`GET` | `/desktop/:version`          | downloads desktop app by version
`GET` | `/desktop/:version?platform=p`    | downloads desktop app by OS which could be `darwin`, `win32` or `linux64`

{% note info "Example:" %}
`https://download.cypress.io/desktop/2.0.1?platform=win32`

This will download Cypress `2.0.1` for Windows platform.
{% endnote %}

If you do not provide a platform, it will be detected automatically.
