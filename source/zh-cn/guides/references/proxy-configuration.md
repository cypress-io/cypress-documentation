---
title: 代理配置
---

Cypress需要访问网络才能工作。许多公司需要使用公司的代理来访问网络。如果你公司也需要这样做，那么Cypress的许多功能将不会起作用直到你配置好Cypress来使用你的代理：

* Cypress将不能加载除了`localhost`以外的网页。
* Cypress将不能在你的{% url "`baseUrl`" configuration#Global %}不可用时警告你。
* Cypress将不能连接到{% url "数据面板服务" dashboard-service %} 来登入或者记录测试运行。
* `npm install cypress`可能在下载Cypress二进制文件时失败。

如果你正在经历部分或所有的这些问题，你可能需要配置Cypress的代理。相应的配置说明可查看{% urlHash "macOS" 在Linux或macOS上设置代理 %}，{% urlHash "Linux" 在Linux或macOS上设置代理 %}，和{% urlHash "Windows" 在Windows上设置代理 %}.

{% note warning %}
目前不支持自动配置代理。如果你的组织使用代理自动配置文件，那么请联系公司的网络管理员并询问访问互联网应该使用的HTTP代理，然后在Cypress中使用那个代理。
{% endnote %}

{% note warning %}
目前不支持SOCKS代理。一个解决方案是在本地设置一个HTTP代理，该代理指向SOCKS代理，然后在Cypress中使用那个HTTP代理。 {% url "阅读更多关于如何通过SOCKS转发HTTP代理。" https://superuser.com/questions/423563/convert-http-requests-to-socks5 %}
{% endnote %}

# 在Linux或macOS上设置代理

运行Cypress之前，在终端中运行如下命令以在Linux或者macOS上设置你的代理：

```shell
export HTTP_PROXY=http://my-company-proxy.com
```

你也可以设置`NO_PROXY`来为某些域名绕过代理（默认情况下，只有`localhost`会被绕过）：

```shell
export NO_PROXY=localhost,google.com,apple.com
```

为了让这些改变永久生效，你可以将这些命令添加到你shell的`~/.profile`（`~/.zsh_profile`，`~/.bash_profile`等文件中。）以便在每次登录时运行它们。

# 在Windows上设置代理

Cypress在安装后启动时，默认会尝试加载配置在Windows注册表中的代理。 {% url "学习如何在Windows系统中设置你的系统级代理。" https://www.howtogeek.com/tips/how-to-set-your-proxy-settings-in-windows-8.1/ %}

{% note info %}
当第一次下载Cypress时，`cypress`命令行工具*不会*从Windows注册表中读取代理设置。如果你需要为安装过程配置一个代理，你必须像下面描述的那样设置合适的环境变量。
{% endnote %}

你也可以在运行Cypress之前设置代理环境变量来覆盖Windows注册表。这也是唯一为`cypress install`定义一个代理的方法。在命令行中可以使用下面的命令定义需要的环境变量：

```shell
set HTTP_PROXY=http://my-company-proxy.com
```

使用下面的命令来在Powershell中完成同样的工作：

```shell
$env:HTTP_PROXY = "http://my-company-proxy.com"
```

使用`setx`来保存`HTTP_PROXY`变量并在所有新的shell中使用你的代理：

```shell
setx HTTP_PROXY http://my-company-proxy.com
```

# 代理环境变量

{% note warning %}
本节讲述的是你操作系统的环境变量，*而不是* {% url "Cypress环境变量" guides/guides/environment-variables %}
{% endnote %}

Cypress自动读取你系统的`HTTP_PROXY`环境变量并将该代理用于所有的HTTP和HTTPS流量。但是如果你设置了环境变量`HTTPS_PROXY`，HTTPS流量则会使用该代理。

为了绕过某些域名的代理，你可以设置环境变量`NO_PROXY`的值为一个以逗号分割的域名列表，这样这些域名的流量就不会被代理。默认情况下，`localhost`的流量不会被代理。

如果同时设置了一个大写版本和小写版本的代理（比如说，`HTTP_PROXY` 和 `http_proxy`都被设置了），则会优先使用小写的环境变量。

# 查看，释放，以及设置环境变量

为了正确地配置代理，了解怎样查看当前设置的环境变量，怎样释放不想要的环境变量，以及怎样根据你的操作系统设置环境变量将是很有帮助的。

## Linux或macOS

### 为当前会话设置一个环境变量

```shell
export SOME_VARIABLE=some-value
```

### 释放一个环境变量

```shell
unset SOME_VARIABLE
```

使用`unset`命令释放环境变量后，再使用`echo`将不会打印出该环境变量的值：

```shell
echo $SOME_VARIABLE
```

### 查看所有当前设置的环境变量

打印所有的环境变量：

```shell
env
```

打印名称中带有`proxy`（不区分大小写）的环境变量：

```shell
env | grep -i proxy
```

## Windows

在Windows上设置环境变量的方法根据你是使用*命令提示符*还是*Powershell*而有所区别。

### 为当前会话设置一个环境变量

*命令提示符：*

```shell
set SOME_VARIABLE=some-value
```

*Powershell:*

```shell
$env:SOME_VARIABLE = "some-value"
```

### 为所有以后的会话设置全局的环境变量

```shell
setx SOME_VARIABLE some-value
```

### 在当前会话中释放一个环境变量

*命令提示符：*

```shell
set SOME_VARIABLE=
```

*Powershell:*

```shell
Remove-Item Env:\SOME_VARIABLE
```

### 查看所有当前设置的环境变量

*命令提示符：*

```shell
set
```

*Powershell:*

```shell
Get-ChildItem Env:
```

# 查看Cypress中的代理设置

你可以在Cypress测试执行器中查看当前的代理设置。步骤如下：

1. 通过运行`cypress open`命令在Cypress中打开你的项目。
2. 点击“设置”标签。
3. 点击“代理设置”将其展开，查看Cypress当前正在使用的代理。

{% imgTag /img/guides/proxy-configuration.png "桌面应用程序中的代理配置" %}