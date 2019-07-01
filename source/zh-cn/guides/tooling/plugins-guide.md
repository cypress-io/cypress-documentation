---
title: 插件
---

插件能够使你深入了解，修改或者扩展Cypress的内部行为

通常来说, 一个使用者, 所有的测试代码, 应用程序, 和Cypress命令都可以在浏览器中执行。 但是Cypress也是一个插件可以处理Node.js的进程。

> 插件能够使你在浏览器外部运行`node`进程。

插件是一个“接缝”你可以编写自己的自定义代码，该代码在Cypress生命周期的特定阶段执行。

{% note info "这是一个简短的概述" %}
如果你想了解更多一些关于如何编写插件，我们已经编写了API文档，向你展示如何处理每个插件事件。

你可以 {% url "点击这里查看API文档" writing-a-plugin %}。
{% endnote %}

# 用例

## 配置

使用插件，你可以通过编程方式更改来自`cypress.json`的已解析配置和环境变量，{% url `cypress.env.json` environment-variables#Option-2-cypress-env-json %}, CLI, 或者系统环境变量。

这使你能够执行以下操作：

- 使用自己配置的多个环境
- 基于环境的环境变量交换
- 使用内置`fs`库读取配置文件
- 在`yml`中写你的配置

点击 {% url 'Configuration API 文档' configuration-api %} 查看如何使用此事件。

## Preprocessors

事件`file:preprocessor`用于如何自定义编译测试代码并将其发送到浏览器。Cypress使用`babel`自动地处理CoffeeScript和ES6，然后使用`browserify`为浏览器打包。

你可以使用`file:preprocessor`事件来执行以下操作：

- 添加TypeScript支持。
- 添加最新的ES*支持。
- 用ClojureScript编写你的测试代码。
- 自定义`babel`设置来添加你自己的插件。
- 将`browserify`替换为`webpack`或者其他东西。

点击 {% url 'File Preprocessor API 文档' preprocessors-api %} 查看如何使用此事件。

## 浏览器启动

事件`before:browser:launch`可用于修改每个特定浏览器的启动参数。

你可以使用`before:browser:launch`事件执行以下操作：

- 加载Chrome扩展
- 改变打印媒体库
- 启用活禁用实验Chrome功能
- 控制加载哪些Chrome组件

点击 {% url 'Browser Launch API 文档' browser-launch-api %} 查看如何使用此事件。

## 屏幕截图处理

这个事件`after:screenshot`是在截图并保存到磁盘后调用。

你可以使用`after:screenshot`事件执行以下操作：

- 保存屏幕截图的详细信息
- 更改屏幕截图的名字
- 通过调整或裁剪屏幕来处理屏幕截图图像

点击 {% url 'After Screenshot API 文档' after-screenshot-api %} 查看如何使用此事件。

## cy.task

事件`task`是与{% url `cy.task()` task %}命令一起使用。 它允许你在node.js中编写任意代码，以完成浏览器中不可能完成的任务。

你可以使用`task`事件执行以下操作：

- 操作数据库（sedding、读取、写入等）
- 在要保留的节点中存储状态（因为在访问时驱动程序完全刷新）
- 执行并行任务 (比如在Cypress发出多个HTTP请求)
- 运行外部进程 (就像在另一个浏览器如firefox、safari或puppeteer上运转一个Webdriver实例)

# 插件列表

Cypress保留了我们在社区创建的插件的官方列表。你可以安装下面列出的任何插件：

{% url '我们官方的Cypress插件列表。' plugins %}

# 安装插件

我们的插件{% url '官方列表' plugins %}只是npm模块。 这能够使它们可以单独进行版本控制和更新，而不需要更新Cypress本身。

你可以NPM安装和使用任何已发布的插件:

```shell
npm install &lt;plugin name&gt; --save-dev
```

# 使用插件

无论你是安装一个NPM模块，还是只想编写自己的代码你都应该在这个文件中完成所有这些操作：

```text
cypress/plugins/index.js
```

{% note info %}
默认情况下，Cypress会为新项目创建这个文件，但是如果你有一个现有的项目，只需自己创建这个文件。
{% endnote %}

在这个文件中，你将导出一个函数。Cypress将调用此函数，将项目的配置传递给你，并使你能够绑定到公开的事件。

```javascript
// cypress/plugins/index.js

// export a function
module.exports = (on, config) => {

  // bind to the event we care about
  on('<event>', (arg1, arg2) => {
    // plugin stuff here
  })
}
```

有关编写插件的更多信息，请{% url "点击这里查看 API 文档 " writing-a-plugin %}。
