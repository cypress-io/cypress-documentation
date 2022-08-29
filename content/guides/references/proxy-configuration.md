---
title: Proxy Configuration
---

Cypress needs Internet access to work. Many companies require the use of a
corporate proxy to access the Internet. If your company does this, many
functions of Cypress will not work until you've configured Cypress to use your
proxy:

- Cypress won't be able to load web pages besides `localhost`.
- Cypress won't be able to warn you if your
  [baseUrl](/guides/references/configuration#Global) isn't available.
- Cypress won't be able to connect to the
  [Dashboard Service](/guides/dashboard/introduction) to log in or record test
  runs.
- `npm install cypress` may fail while downloading the Cypress binary.

If you are experiencing any or all of these issues, you may need to configure
Cypress with your proxy. Instructions are available for
[macOS](#Set-a-proxy-on-Linux-or-macOS),
[Linux](#Set-a-proxy-on-Linux-or-macOS), and [Windows](#Set-a-proxy-on-Windows).

<Alert type="warning">

Proxy Auto-Configuration (PAC) files are not currently supported. If your
organization uses a PAC file, contact a network administrator to ask what HTTP
proxy you should be using to access the general Internet, then use that proxy
with Cypress.

</Alert>

<Alert type="warning">

SOCKS proxies are not currently supported. A workaround is to set up an HTTP
proxy locally that points to your SOCKS proxy, then using that HTTP proxy with
Cypress.
[Read more about forwarding an HTTP proxy through SOCKS.](https://superuser.com/questions/423563/convert-http-requests-to-socks5)

</Alert>

## Set a proxy on Linux or macOS

To set your proxy on Linux or macOS, run the following command in a terminal
before running Cypress:

```shell
export HTTP_PROXY=http://my-company-proxy.com
```

You can also set `NO_PROXY` to bypass the proxy for certain domains (by default,
only `localhost` will be bypassed):

```shell
export NO_PROXY=localhost,google.com,apple.com
```

To make these changes permanent, you can add these commands to your shell's
`~/.profile` (`~/.zsh_profile`, `~/.bash_profile`, etc.) to run them on every
login.

## Set a proxy on Windows

When starting up after being installed, Cypress will attempt to load the proxy
configured in the Windows registry by default.
[Learn how to set your proxy settings system-wide in Windows.](https://www.howtogeek.com/tips/how-to-set-your-proxy-settings-in-windows-8.1/)

<Alert type="info">

When downloading Cypress for the first time, the `cypress` command line tool
_does not_ read proxy settings from the Windows registry. If you need to
configure a proxy for the installation to work, you must set the appropriate
environment variables as described below.

</Alert>

You can also set proxy environment variables before running Cypress to override
the Windows registry. This is also the only way to define a proxy for
`cypress install`. In Command Prompt, defining the required environment
variables looks like this:

```shell
set HTTP_PROXY=http://my-company-proxy.com
```

To accomplish the same thing in PowerShell:

```shell
$env:HTTP_PROXY = "http://my-company-proxy.com"
```

To save the `HTTP_PROXY` variable and use your proxy for all new shells, use
`setx`:

```shell
setx HTTP_PROXY http://my-company-proxy.com
```

## Proxy environment variables

<Alert type="warning">

This section refers to your operating system's environment variables, _not_
[Cypress environment variables](/guides/guides/environment-variables)

</Alert>

Cypress automatically reads from your system's `HTTP_PROXY` environment variable
and uses that proxy for all HTTP and HTTPS traffic. If an `HTTPS_PROXY`
environment variable is set, HTTPS traffic will use that proxy instead.

To bypass the proxy for certain domains, a `NO_PROXY` environment variable can
be set to a comma-separated list of domain names to not proxy traffic for. By
default, traffic to `localhost` will not be proxied. To make Cypress send
traffic for `localhost` through the proxy, pass `<-loopback>` in `NO_PROXY`.

If an uppercase and a lowercase version of the proxy settings are supplied (for
example, `HTTP_PROXY` and `http_proxy` are both set), the lowercase variable
will be preferred.

## View, unset, and set environment variables

In order to properly configure your proxy configuration, it can be helpful to
know how to view currently set environment variables, unset unwanted environment
variables, and set environment variables depending on your operating system.

### Linux or macOS

#### Set an environment variable for the current session

```shell
export SOME_VARIABLE=some-value
```

#### Unset an environment variable

```shell
unset SOME_VARIABLE
```

`echo` will print nothing after `unset`:

```shell
echo $SOME_VARIABLE
```

#### See all the currently set environment variables

Print all env vars:

```shell
env
```

Print environment variables with `proxy` (case insensitive) in the name:

```shell
env | grep -i proxy
```

### Windows

Setting environment variables in Windows is different depending on if you're
using _command prompt_ or _PowerShell_.

#### Set an environment variable for current session

_Command prompt:_

```shell
set SOME_VARIABLE=some-value
```

_PowerShell:_

```shell
$env:SOME_VARIABLE = "some-value"
```

#### Set environment variable globally for all future sessions

```shell
setx SOME_VARIABLE some-value
```

#### Unset an environment variable in the current session

_Command prompt:_

```shell
set SOME_VARIABLE=
```

_PowerShell:_

```shell
Remove-Item Env:\SOME_VARIABLE
```

#### See all currently set environment variables

_Command prompt:_

```shell
set
```

_PowerShell:_

```shell
Get-ChildItem Env:
```

## View proxy settings in Cypress

Your current proxy settings can be viewed from within Cypress. Follow these
steps:

1. Open up your project in Cypress via `cypress open`.
2. Click the "Settings" tab.
3. Click the "Proxy Settings" section to expand it and view the proxy settings
   that Cypress is currently using.

<DocsImage src="/img/guides/configuration/test-runner-settings-proxy-configuration.jpg" alt="Proxy configuration in the Desktop app"></DocsImage>
