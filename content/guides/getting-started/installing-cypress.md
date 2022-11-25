---
title: Installing Cypress
---

<Alert type="info">

## <Icon name="graduation-cap"></Icon> What you'll learn

- How to install Cypress via `npm`
- How to install Cypress via direct download
- How to version and run Cypress via `package.json`

</Alert>

First, make sure you have all the [system requirements](#System-requirements).

## Installing

### <Icon name="terminal"></Icon> `npm install`

Install Cypress via `npm`:

```shell
cd /your/project/path
```

```shell
npm install cypress --save-dev
```

This will install Cypress locally as a dev dependency for your project.

<Alert type="info">

Make sure that you have already run
[`npm init`](https://docs.npmjs.com/cli/init) or have a `node_modules` folder or
`package.json` file in the root of your project to ensure cypress is installed
in the correct directory.

</Alert>

<DocsVideo src="/img/snippets/installing-cli.mp4" title="Install via CLI"></DocsVideo>

<Alert type="info">

Notice that the Cypress `npm` package is a wrapper around the Cypress binary.
The version of the `npm` package determines the version of the binary
downloaded. As of version `3.0`, the binary is downloaded to a global cache
directory to be used across projects.

System proxy properties `http_proxy`, `https_proxy` and `no_proxy` are respected
for the download of the Cypress binary. You can also use the npm properties
`npm_config_proxy` and `npm_config_https_proxy`. Those have lower priority, so
they will only be used if the system properties are being resolved to not use a
proxy.

</Alert>

<Alert type="success">

<strong class="alert-header">Best Practice</strong>

The recommended approach is to install Cypress with `npm` because:

- Cypress is versioned like any other dependency.
- It simplifies running Cypress in
  [Continuous Integration](/guides/continuous-integration/introduction).

</Alert>

### <Icon name="terminal"></Icon> `yarn add`

Installing Cypress via [`yarn`](https://yarnpkg.com):

```shell
cd /your/project/path
```

```shell
yarn add cypress --dev
```

System proxy properties `http_proxy`, `https_proxy` and `no_proxy` are respected
for the download of the Cypress binary.

### <Icon name="download"></Icon> Direct download

If you're not using Node or `npm` in your project or you want to try Cypress out
quickly, you can always
[download Cypress directly from our CDN](https://download.cypress.io/desktop).

<Alert type="warning">

Recording runs to Cypress Cloud is not possible from the direct download. This
download is only intended as a quick way to try out Cypress. To record tests to
Cypress Cloud, you'll need to install Cypress as an `npm` dependency.

</Alert>

The direct download will always grab the latest available version. Your platform
will be detected automatically.

Then you can manually unzip and double click. Cypress will run without needing
to install any dependencies.

<DocsVideo src="/img/snippets/installing-global.mp4" title="Install via direct download"></DocsVideo>

<Alert type="info">

<strong class="alert-header">Direct downloading for old versions</strong>

It is possible to download an old version from our CDN by suffixing the URL with
the desired version (ex.
[https://download.cypress.io/desktop/6.8.0](https://download.cypress.io/desktop/6.8.0)).

</Alert>

### <Icon name="cog"></Icon> Advanced Installation

If you have more complex requirements, want to level-up your Cypress workflow or
just need help with troubleshooting, check out our
[Advanced Installation](/guides/references/advanced-installation) reference.

### <Icon name="sync-alt"></Icon> Continuous integration

Please read our
[Continuous Integration](/guides/continuous-integration/introduction) docs for
help installing Cypress in CI. When running in Linux you'll need to install some
[system dependencies](/guides/continuous-integration/introduction#Dependencies)
or you can use our [Docker images](/examples/examples/docker) which have
everything you need prebuilt.

## System requirements

### Operating System

Cypress is a desktop application that is installed on your computer. The desktop
application supports these operating systems:

- **macOS** 10.9 and above _(Intel or Apple Silicon 64-bit (x64 or arm64))_
- **Linux** Ubuntu 12.04 and above, Fedora 21 and Debian 8 _(x86_64 or Arm
  64-bit (x64 or arm64))_ (see [Linux Prerequisites](#Linux-Prerequisites) down
  below)
- **Windows** 7 and above _(64-bit only)_

### Node.js

If you're using `npm` to install Cypress, we support:

- **Node.js** 12 or 14 and above

### Hardware

When running Cypress locally, it should run comfortably on any machine that is
capable of modern web development.

When running Cypress in CI, however, some of the lower-tier configurations might
not be able to run Cypress reliably, especially when recording videos or doing
longer test runs.

Some issues you might run into in CI that could be a sign of insufficient
resources are:

- Exiting early during `cypress run` or abruptly closing (“crashing”)
- Frozen or missing frames in the video that is captured
- Increased runtime

When running Cypress in CI, we recommend that you have the following hardware
requirements:

#### CPU

- 2 CPUs minimum to run Cypress
- 1 additional CPU if video recording is enabled
- 1 additional CPU per process you run outside of Cypress, such as:
  - App server (frontend)
  - App server (backend)
  - App database
  - Any additional infrastructure (Redis, Kafka, etc..)

### Memory

- 4GB minimum, 8GB+ for longer test runs

### Linux Prerequisites

If you're using Linux, you'll want to have the required dependencies installed
on your system.

#### Ubuntu/Debian

```shell
apt-get install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb
```

#### CentOS

```shell
yum install -y xorg-x11-server-Xvfb gtk2-devel gtk3-devel libnotify-devel GConf2 nss libXScrnSaver alsa-lib
```

#### Docker

Docker images with all of the required dependencies installed are available
under [cypress/base](https://github.com/cypress-io/cypress-docker-images)

If you're running your projects in containers, then you'll want Cypress in the
container with the Node.js process.

```
  ui:
    image: cypress/base:latest
    # if targeting a specific node version, use e.g.
    # image: cypress/base:14
```

`cypress/base` is a drop-in replacement for
[base docker node images](https://hub.docker.com/_/node/).

**Great, now [install Cypress](#Installing)!**

## Next Steps

[Open the app](/guides/getting-started/opening-the-app) and take it for a test
drive!
