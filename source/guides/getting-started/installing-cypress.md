---
title: Installing Cypress
comments: false
---

{% note info %}
# {% fa fa-graduation-cap %} What You'll Learn

- How to install Cypress via `npm`.
- How to install Cypress via direct download.
- How to version and run Cypress via `package.json`

{% endnote %}

# System Requirements

Cypress is a desktop application that is installed on your computer. The desktop application supports these operating systems:

- **Mac OS** 10.9+ (Mavericks+), only 64bit binaries are provided for macOS.
- **Linux** Ubuntu 12.04+, Fedora 21, Debian 8
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

This will install Cypress locally as a dev dependency for your project. We recommend this approach because:

- Cypress is versioned like any other dependency.
- It simplifies running Cypress in {% url 'Continuous Integration' continuous-integration %}.

{% img /img/guides/installing-cli.gif %}

## {% fa fa-download %} Direct Download

If you're not using `node` or `npm` in your project or you just want to try Cypress out quickly, you can always {% url "download Cypress directly here" http://download.cypress.io/desktop %}.

Just manually unzip and double click. Cypress will run without needing to install any dependencies.

{% img /img/guides/installing-global.gif %}

## {% fa fa-refresh %} Continuous Integration

Please read our {% url 'Continuous Integration' continuous-integration %} docs for help installing Cypress in CI. When running in linux you'll need to install some {% url 'system dependencies' continuous-integration#Dependencies %} or you can just use our {% url 'Docker images' docker-images %} which have everything you need prebuilt.

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

**note**: [npx](https://www.npmjs.com/package/npx) is included with `npm > v5.2` or can be installed separately.

```shell
npx cypress open
```

After a moment, the Cypress Desktop application will launch.

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

As of version `0.20.0` Cypress is also a fully baked `node_module` you can require in your node scripts.

You can {% url 'read more about the CLI here' command-line %}.

# Advanced

Using an environment variable you can control how Cypress is installed.

This is helpful if you want to:

- Install a different version than the default npm package
- Specify an external URL (to bypass a corporate firewall)
- Specify a local file (to install locally instead of using the internet)

To override what is installed, you simply set `CYPRESS_BINARY_VERSION` with the `npm install` command.

***Examples:***

1. Install the `cypress` npm package version `1.0.3` with the binary `1.0.1` version:

    ```shell
    CYPRESS_BINARY_VERSION=1.0.1 npm install cypress@1.0.3
    ```

2. Install the Cypress binary from a given URL:

    ```shell
    CYPRESS_BINARY_VERSION=https://company.domain.com/cypress.zip npm install cypress
    ```

3. Install the Cypress binary from a local file.

    ```shell
    CYPRESS_BINARY_VERSION=/local/path/to/cypress.zip npm install cypress
    ```

In all cases, the fact that the binary was installed from a custom location *is not saved* in your `package.json` file. Every repeated installation would have to use the same environment variable to install the same binary.
