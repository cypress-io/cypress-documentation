---
title: Proxy Configuration
---

Cypress needs Internet access to work. Many companies require the use of a corporate proxy to access the Internet. If your company does this, many functions of Cypress will not work until you've configured Cypress to use your proxy:

* Cypress won't be able to load web pages besides `localhost`.
* Cypress won't be able to warn you if your {% url "`baseUrl`" configuration#Global %} isn't available.
* Cypress won't be able to connect to the {% url "Dashboard Service" dashboard-service %} to log in or record test runs.
* `npm install cypress` may fail while downloading the Cypress binary.

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

Cypress will attempt to load the proxy configured in the Windows registry by default. {% url "Learn how to set your proxy settings system-wide in Windows." https://www.howtogeek.com/tips/how-to-set-your-proxy-settings-in-windows-8.1/ %}

You can override this behavior by setting proxy environment variables before running Cypress. In Command Prompt, it looks like this:

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

To bypass the proxy for certain domains, a `NO_PROXY` environment variable can be set to a comma-separated list of domain names to not proxy traffic for. By default, traffic to `localhost` will not be proxied.

If an uppercase and a lowercase version of the proxy settings are supplied (for example, `HTTP_PROXY` and `http_proxy` are both set), the lowercase variable will be preferred.

## View and set environment variables on Linux or macOS

To set an environment variable for the current session, you can just use the `export` command:

```shell
export SOME_VARIABLE=some-value
```

To unset an environment variable, use the `unset` command:

```shell
unset SOME_VARIABLE
echo $SOME_VARIABLE ## will print nothing
```

To see all the currently set environment variables, use `env`:

```shell
env ## prints all environment variables
env | grep -i proxy ## prints all environment variables with `proxy` (case insensitive) in the name
```

## View and set environment variables on Windows

Setting environment variables in Windows is different depending on if you're using command prompt or Powershell.

To set an environment variable for the current session:

```shell
set SOME_VARIABLE=some-value  ## in command prompt
$env:SOME_VARIABLE = "some-value"  ## in Powershell
```

To set it globally for all future sessions:

```shell
setx SOME_VARIABLE some-value
```

To unset an environment variable in the current session:

```shell
set SOME_VARIABLE=  ## in command prompt
Remove-Item Env:\SOME_VARIABLE  ## in Powershell
```

To see all the currently set environment variables:

```shell
set  ## in command prompt
Get-ChildItem Env:  ## in Powershell
```

# View proxy settings in Cypress

Your current proxy settings can be viewed from within the Cypress Test Runner. Follow these steps:

1. Open up your project in Cypress via `cypress open`.
2. Click the "Settings" tab.
3. Click the "Proxy Settings" section to expand it and view the proxy settings that Cypress is currently using.

![Proxy configuration in the Desktop app](/img/guides/proxy-configuration.png)
