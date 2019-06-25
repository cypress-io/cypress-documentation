---
title: 启动浏览器
---

当您在Cypress中运行测试时，我们将为您启动浏览器。这使我们能够：

1. 创建一个干净、原始的测试环境。
2. 访问享有特权的浏览器API以实现自动化。

# 浏览器

当Cypress开始在测试运行器中运行时，您可以选择在特定的浏览器中运行Cypress，可选的浏览器包括：

- {% url "Canary" https://www.google.com/chrome/browser/canary.html %}
- {% url "Chrome" https://www.google.com/chrome/browser/desktop/index.html %}
- {% url "Chromium" https://www.chromium.org/Home %}
- {% url "Electron" https://electron.atom.io/ %}

Cypress会自动在您的操作系统中检测可用的浏览器。你可以使用右上角的下拉菜单在测试执行器中切换浏览器：

{% imgTag /img/guides/select-browser.png "Select a different browser" %}

## Electron浏览器

除了在您的系统中找到的浏览器之外，您还会发现Electron也是可用的浏览器。Electron浏览器是Chromium的一个版本，附带{% url "Electron" https://electron.atom.io/ %}。

Electron浏览器有两个独特的优势：

1. 它可以无头运行。
2. 它内嵌在Cypress中，无需单独安装。

默认情况下，当从CLI中运行{% url '`cypress run`' command-line#cypress-run %}，将会无头启动Electron。

### 您也可以启动Electron头：

```shell
cypress run --headed
```

因为Electron是默认的浏览器，它通常在CI中运行。如果您在CI中看到运行失败，为了方便地调试，您可能需要使用`—-headed`选项在本地运行。

## Chrome浏览器

所有Chrome*风格的浏览器都将被检测并支持。

### 您可以启动Chrome浏览器：

```shell
cypress run --browser chrome
```

要在CI中使用这个命令，您需要安装您想要的浏览器，或者使用我们的{% url 'docker镜像' docker %}中的一种。

您也可以启动Chromium：

```shell
cypress run --browser chromium
```

或者Chrome Canary：

```shell
cypress run --browser canary
```

{% url '启动已安装的浏览器出现问题？请阅读关于调试浏览器启动的详细信息' debugging#Launching-browsers %}

## 通过路径启动

您可以通过指定二进制文件的路径来启动任何受支持的浏览器：

```shell
cypress run --browser /usr/bin/chromium
# or
cypress open --browser /usr/bin/chromium
```

Cypress将自动检测所提供的浏览器类型并为您启动它。

{% url '有关`--浏览器`参数的更多信息，请参阅命令行指南' command-line#cypress-run-browser-lt-browser-name-or-path-gt %}

## 不受支持的浏览器

目前很多浏览器不受支持，例如Firefox、Safari、IE。支持更多的浏览器正在我们的规划中。您可以在{% issue 310 '这里' %}阅读关于我们未来跨浏览器测试策略的详细说明。

# 浏览器环境

Cypress启动浏览器的方式与常规浏览器环境不同。但我们相信，它是以一种让测试更可靠、更容易上手的方式启动。

## 启动浏览器

当Cypress启动您的浏览器时，它将为您提供机会去修改启动浏览器的参数。

这使您可以做以下事情：

- 加载您自己的chrome扩展
- 启用或禁用实验性chrome功能

{% url '这部分API记录在这里' browser-launch-api %}

## Cypress配置

除了正常的浏览器配置文件外，Cypress还生成自己的独立配置文件。这意味着`历史记录`条目、`cookie`和来自常规浏览会话的`第三方扩展`不会影响您在Cypress中的测试。

{% note warning 等等，我需要开发人员扩展！%}
没问题-你只需要在Cypress启动的浏览器中重新安装**一次**。我们将在后续的启动中继续使用这个Cypress测试配置文件，以便保留您的所有配置。
{% endnote %}

## 禁用障碍

Cypress自动禁用Cypress启动的浏览器中的某些功能，这些功能往往会妨碍自动化测试。

### Cypress自动启动浏览器：

- 忽略证书错误。
- 允许阻止弹出窗口。
- 禁用“保存密码”。
- 禁用“自动填写表单和密码”
- 禁止请求成为您的主浏览器。
- 禁用设备发现通知。
- 禁用语言翻译。
- 禁用恢复会话。
- 禁用后台网络流量。
- 禁用背景和渲染器节流。
- 禁用提示请求使用相机或麦克风等设备的许可。
- 禁用自动播放视频的用户手势要求。

您可以看到我们在{% url "这里" https://github.com/cypress-io/cypress/blob/develop/packages/server/lib/browsers/chrome.coffee#L18 %}存放的所有默认chrome命令行开关。

# 浏览器图标

您可能会注意到，如果您已经打开了浏览器，您将在Dock中看到两个相同的浏览器图标。

{% video local /img/snippets/switching-between-cypress-and-other-chrome-browser.mp4 %}

我们知道，当Cypress在它自己的配置文件中运行时，很难区分普通浏览器和Cypress之间的区别。

因此，我们建议{% url "下载Chromium" https://www.chromium.org/Home %}或{% url "下载Canary" https://www.google.com/chrome/browser/canary.html %}。这两种浏览器的图标都与标准的Chrome浏览器不同，因此更容易区分。您还可以使用附带的{% urlHash "Electron浏览器" Electron浏览器 %}，它没有Dock图标。

{% video local /img/snippets/switching-cypress-browser-and-canary-browser.mp4 %}

此外，我们还让Cypress生成的浏览器看起来与常规会话不同。您会在浏览器的chrome周围看到一个更暗的主题。你将能从视觉上分辨出来。

{% imgTag /img/guides/cypress-browser-chrome.png "Cypress Browser with darker chrome" %}
