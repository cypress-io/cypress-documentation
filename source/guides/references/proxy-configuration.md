---
title: Proxy Configuration
---

Cypress needs Internet access to work. Many companies require the use of a corporate proxy to access the Internet. If your company does this, many functions of Cypress will not work until you've configured Cypress to use your proxy:

- Cypress won't be able to load web pages besides `localhost`.
- Cypress won't be able to warn you if your {% url "`baseUrl`" configuration#Global %} isn't available.
- Cypress won't be able to connect to the {% url "Dashboard Service" dashboard-introduction%} to log in or record test runs.
- `npm install cypress` may fail while downloading the Cypress binary.

If you are experiencing any or all of these issues, you may need to configure Cypress with your proxy. Instructions are available for {% urlHash "macOS" Set-a-proxy-on-Linux-or-macOS %}, {% urlHash "Linux" Set-a-proxy-on-Linux-or-macOS %}, and {% urlHash "Windows" Set-a-proxy-on-Windows %}.

{% note warning %}
Proxy Auto-Configuration (PAC) files are not currently supported. If your organization uses a PAC file, contact a network administrator to ask what HTTP proxy you should be using to access the general Internet, then use that proxy with Cypress.
{% endnote %}

{% note warning %}
SOCKS proxies are not currently supported. A workaround is to set up an HTTP proxy locally that points to your SOCKS proxy, then using that HTTP proxy with Cypress. {% url "Read more about forwarding an HTTP proxy through SOCKS." https://superuser.com/questions/423563/convert-http-requests-to-socks5 %}
{% endnote %}

# Set a proxy on Linux or macOS

To set your proxy on Linux or macOS, run the following command in a terminal before running Cypress:

```shell
export HTTP_PROXY=http://my-company-proxy.com
```

You can also set `NO_PROXY` to bypass the proxy for certain domains (by default, only `localhost` will be bypassed):

```shell
export NO_PROXY=localhost,google.com,apple.com
```

To make these changes permanent, you can add these commands to your shell's `~/.profile` (`~/.zsh_profile`, `~/.bash_profile`, etc.) to run them on every login.

# Set a proxy on Windows

When starting up after being installed, Cypress will attempt to load the proxy configured in the Windows registry by default. {% url "Learn how to set your proxy settings system-wide in Windows." https://www.howtogeek.com/tips/how-to-set-your-proxy-settings-in-windows-8.1/ %}

{% note info %}
When downloading Cypress for the first time, the `cypress` command line tool *does not* read proxy settings from the Windows registry. If you need to configure a proxy for the installation to work, you must set the appropriate environment variables as described below.
{% endnote %}

You can also set proxy environment variables before running Cypress to override the Windows registry. This is also the only way to define a proxy for `cypress install`. In Command Prompt, defining the required environment variables looks like this:

```shell
set HTTP_PROXY=http://my-company-proxy.com
```

To accomplish the same thing in Powershell:

```shell
$env:HTTP_PROXY = "http://my-company-proxy.com"
```

To save the `HTTP_PROXY` variable and use your proxy for all new shells, use `setx`:

```shell
setx HTTP_PROXY http://my-company-proxy.com
```

# Proxy environment variables

{% note warning %}
This section refers to your operating system's environment variables, *not* {% url "Cypress environment variables" guides/guides/environment-variables %}
{% endnote %}

Cypress automatically reads from your system's `HTTP_PROXY` environment variable and uses that proxy for all HTTP and HTTPS traffic. If an `HTTPS_PROXY` environment variable is set, HTTPS traffic will use that proxy instead.

To bypass the proxy for certain domains, a `NO_PROXY` environment variable can be set to a comma-separated list of domain names to not proxy traffic for. By default, traffic to `localhost` will not be proxied. To make Cypress send traffic for `localhost` through the proxy, pass `<-loopback>` in `NO_PROXY`.

If an uppercase and a lowercase version of the proxy settings are supplied (for example, `HTTP_PROXY` and `http_proxy` are both set), the lowercase variable will be preferred.

# View, unset, and set environment variables

In order to properly configure your proxy configuration, it can be helpful to know how to view currently set environment variables, unset unwanted environment variables, and set environment variables depending on your operating system.

## Linux or macOS

### Set an environment variable for the current session

```shell
export SOME_VARIABLE=some-value
```

### Unset an environment variable

```shell
unset SOME_VARIABLE
```

`echo` will print nothing after `unset`:

```shell
echo $SOME_VARIABLE
```

### See all the currently set environment variables

Print all env vars:

```shell
env
```

Print environment variables with `proxy` (case insensitive) in the name:

```shell
env | grep -i proxy
```

## Windows

Setting environment variables in Windows is different depending on if you're using *command prompt* or *Powershell*.

### Set an environment variable for current session

*Command prompt:*

```shell
set SOME_VARIABLE=some-value
```

*Powershell:*

```shell
$env:SOME_VARIABLE = "some-value"
```

### Set environment variable globally for all future sessions

```shell
setx SOME_VARIABLE some-value
```

### Unset an environment variable in the current session

*Command prompt:*

```shell
set SOME_VARIABLE=
```

*Powershell:*

```shell
Remove-Item Env:\SOME_VARIABLE
```

### See all currently set environment variables

*Command prompt:*

```shell
set
```

*Powershell:*

```shell
Get-ChildItem Env:
```

# View proxy settings in Cypress

Your current proxy settings can be viewed from within the Cypress Test Runner. Follow these steps:

1. Open up your project in Cypress via `cypress open`.
2. Click the "Settings" tab.
3. Click the "Proxy Settings" section to expand it and view the proxy settings that Cypress is currently using.

{% imgTag /img/guides/test-runner-settings-proxy-configuration.jpg "Proxy configuration in the Desktop app" %}
