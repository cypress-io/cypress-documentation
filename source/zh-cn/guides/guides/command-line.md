---
title: 命令行
---

{% note info %}
# {% fa fa-graduation-cap %} 通过这篇文档你将会学习到

- 如何从命令行启动Cypress
- 如何定义跑哪个测试文件
- 如何启动其他浏览器
- 如何从Dashboard录制用例
{% endnote %}

# 安装

本指南假设你已经阅读过{% url 'Installing Cypress' installing-cypress %}并已经将Cypress安装成`npm`模块。安装完成后你就可以从**项目根目录**执行本篇提到的所有命令。

# 如何启动Cypress

{% note info %}
你也可以使用我们的{% url "Module API" module-api %}将Cypress当成node模块调用和启动它。
{% endnote %}

为简洁起见，我们在每个命令的文档中省略了cypress可执行文件的完整路径。

要运行命令，你需要为每个命令添加前缀，以便正确定位cypress可执行文件。

```shell
$(npm bin)/cypress run
```

或

```shell
./node_modules/.bin/cypress run
```

或（要求npm@5.2.0+）

```shell
npx cypress run
```

你可能会发现将cypress命令添加到`package.json`文件中的`scripts`里并从{% url "`npm run` 脚本" https://docs.npmjs.com/cli/run-script.html %}调用它更方便。

使用`npm run`调用命令时，需要使用`--`字符串传递命令的参数。 比如，假设在`package.json`中定义了以下命令：

```json
{
  "scripts": {
    "cy:run": "cypress run"
  }
}
```

此时想运行一个单独的测试用例文件并且记录测试结果到Dashboard的话，那么命令应该是：

```shell
npm run cy:run -- --record --spec "cypress/integration/my-spec.js"
```

如果你正在使用{% url npx https://github.com/zkat/npx %}工具， 你可以直接调用本地安装的Cypress:

```shell
npx cypress run --record --spec "cypress/integration/my-spec.js"
```

# 命令集

## `cypress run`

默认情况下，Cypress会将`Electron`作为无头浏览器运行完你所有的测试用例。

```shell
cypress run [可选项]
```

**可选项**

选项 | 描述
------ |  ---------
`--browser`, `-b`  | {% urlHash "定义一个运行用例的不同的浏览器" cypress-run-browser-lt-browser-name-or-path-gt %}
`--ci-build-id` | {% urlHash "对某次运行定义一个唯一的标识符以使能分组或并行测试" cypress-run-ci-build-id-lt-id-gt %}
`--config`, `-c`  | {% urlHash "定义配置" cypress-run-config-lt-config-gt %}
`--env`, `-e`  | {% urlHash "定义环境变量" cypress-run-env-lt-env-gt %}
`--group`  | {% urlHash "在单次运行里将录制的用例分组" cypress-run-group-lt-name-gt %}
`--headed`  | {% urlHash "显式运行Electron浏览器而不是无头模式" cypress-run-headed %}
`--help`, `-h`  | 显式帮助信息
`--key`, `-k`  | {% urlHash "定义录制秘钥" cypress-run-record-key-lt-record-key-gt %}
`--no-exit` | {% urlHash "运行完某个测试文件完毕后，保持Cypress运行器打开" cypress-run-no-exit %}
`--parallel` | {% urlHash "在多台机器上并行运行录制好的用例" cypress-run-parallel %}
`--port`,`-p`  | {% urlHash "定义和覆盖默认端口" cypress-run-port-lt-port-gt %}
`--project`, `-P` | {% urlHash "定义项目路径" cypress-run-project-lt-project-path-gt %}
`--record`  | {% urlHash "是否录制测试视频" cypress-run-record-key-lt-record-key-gt %}
`--reporter`, `-r`  | {% urlHash "定义Mocha报告生成器" cypress-run-reporter-lt-reporter-gt %}
`--reporter-options`, `-o`  | {% urlHash "定义Mocha报告生成器可选项" cypress-run-reporter-lt-reporter-gt %}
`--spec`, `-s`  | {% urlHash "定义运行的测试用例文件（一个或多个）" cypress-run-spec-lt-spec-gt %}

### `cypress run --browser <browser-name-or-path>`

```shell
cypress run --browser chrome
```

只要系统上可以检测到，"browser" 参数可以被设置为"chrome"，"canary"，"chromium"，或"electron"。 Cypress会试图自动找到已经装好的浏览器。

你也可以通过其路径进行自定义浏览器类型，如：

```shell
cypress run --browser /usr/bin/chromium
```

目前，仅支持Chrome家族的浏览器。

{% url "有浏览器检测问题？看看调试指南吧！" debugging#Launching-browsers %}

### `cypress run --ci-build-id <id>`

对绝大多数的CI提供者来说，这个<id>值一般是自动检测到的，并不需要自定义。除非Cypress已经决定不到它了。

典型的情况是，这个<id>是CI提供者用来定义一个环境变量的，比如某一次构建或运行的编号。

```shell
cypress run --ci-build-id BUILD_NUMBER
```

上面这个指令仅在定义了`--group`或`--parallel`标志位时才合法。阅读{% url "parallelization" parallelization %}了解更多。

### `cypress run --config <config>`

请参考{% url 'environment variables' environment-variables %}和{% url 'configuration' configuration %}。

```shell
cypress run --config pageLoadTimeout=100000,watchForFileChanges=false
```

### `cypress run --env <env>`

传递单个运行参数：

```shell
cypress run --env host=api.dev.local
```

多个参数传递，使用逗号（无空格）分割。数字将自动转换为字符串：

```shell
cypress run --env host=api.dev.local,port=4222
```

传递Json字串对象：

```shell
cypress run --env flags='{"feature-a":true,"feature-b":false}'
```

### `cypress run --group <name>`

在某次运行中{% url "跑单组测试用例" parallelization#Grouping-test-runs %}。

```shell
cypress run --group develop-env
```

你也可以通过添加一个名称来添加多组测试用例，这可以让你区分开不同测试文件所在的组。

```shell
cypress run --group admin-tests --spec 'cypress/integration/admin/**/*
```

```shell
cypress run --group user-tests --spec 'cypress/integration/user/**/*
```

`--ci-build-id`的定义是必要的。

{% url "了解分组的更多信息。" parallelization#Grouping-test-runs %}

### `cypress run --headed`

默认情况下，Cypress在Electron无头浏览器里运行用例。

增加`--headed`参数将强制显式运行Electron浏览器。这取决于你如何运行它。

```shell
cypress run --headed
```

### `cypress run --no-exit`

要想在运行完毕测试用例后关闭掉Cypress运行器，请使用`--no-exit`.

你也可以使用`--headed --no-exit`，以便在某个`spec`运行完毕后可以查看**命令日志**或进入**开发者工具**。

```shell
cypress run --headed --no-exit
```

### `cypress run --parallel`

在多台机器上{% url "并行" parallelization %}运行测试文件。

```shell
cypress run --record --parallel
```

你可以添加一个`--group`标志，这样并行测试就会有一个{% url "分组" parallelization#Grouping-test-runs %}.

```shell
cypress run --record --parallel --group e2e-staging-specs
```

阅读{% url "并行" parallelization %}了解更多。

### `cypress run --port <port>`

```shell
cypress run --port 8080
```

### `cypress run --project <project-path>`

默认情况下，Cypress会在`package.json`所在的目录查找`cypress.json`文件。然而，你也可以指明Cypress在不同的位置运行。

这让你可以在`node_modules`的顶级目录安装Cypress，但可以在其子目录下运行起来。同时对于你有多个项目的情况也很有帮助。

为了说明这一点，我们已经设置了一个{% url '体验示例项目' https://github.com/cypress-io/cypress-test-nested-projects %}.

```shell
cypress run --project ./some/nested/folder
```

### `cypress run --record --key <record-key>`

测试过程{% url '设置项目自动录制' dashboard-service#Setup %}。项目设置好后，你将会得到一个**Record Key**.

```shell
cypress run --record --key <record_key>
```

如果你设置了**Record Key**为环境变量`CYPRESS_RECORD_KEY`，你可以忽略`--key`参数。

典型示例是你运行{% url '持续集成' continuous-integration %}的时候设置这个环境变量。

```shell
export CYPRESS_RECORD_KEY=abc-key-123
```

现在你可以忽略`--key` 参数了。

```shell
cypress run --record
```

阅读{% url '更多关于录制运行' dashboard-service#Setup %}的内容。

### `cypress run --reporter <reporter>`

测试时你可以指定{% url "Mocha报告生成器" reporters %}：

```shell
cypress run --reporter json
```

你可以定义报告生成器可选项`--reporter-options <reporter-options>`参数：

```shell
cypress run --reporter junit --reporter-options mochaFile=result.xml,toConsole=true
```

### `cypress run --spec <spec>`

运行某个单独的测试文件而不是所有的测试用例：

```shell
cypress run --spec "cypress/integration/examples/actions.spec.js"
```

运行*号匹配到的文件目录（注意：推荐使用双星号**）：

```shell
cypress run --spec "cypress/integration/login/**/*"
```

运行指定多个测试文件：

```shell
cypress run --spec "cypress/integration/examples/actions.spec.js,cypress/integration/examples/files.spec.js"
```

## `cypress open`

在交互模式下打开Cypress测试运行器：

```shell
cypress open [options]
```

**可选项**

传给`cypress open`的可选项会自动应用到你打开的项目。这些配置项在所有项目中生效除非你关掉Cypress测试运行器。当然，这些选项可以在`cypress.json`里被重载掉。

可选项 | 描述
------ | ---------
`--browser`, `-b`  | {% urlHash "指定运行测试的浏览器" cypress-open-browser-lt-browser-path-gt %}
`--config`, `-c`  | {% urlHash "指定配置" cypress-open-config-lt-config-gt %}
`--detached`, `-d` | 以静默模式打开Cypress
`--env`, `-e`  | {% urlHash "定义环境变量" cypress-open-env-lt-env-gt %}
`--global` | {% urlHash "全局模式" cypress-open-global %}
`--help`, `-h`  | 输出帮助说明
`--port`, `-p`  | {% urlHash "重载默认端口" cypress-open-port-lt-port-gt %}
`--project`, `-P` | {% urlHash "指定项目路径" cypress-open-project-lt-project-path-gt %}

### `cypress open --browser <browser-path>`

默认情况下，Cypress会自动查找你系统中可使用的浏览器。

“browser”选项允许你通过浏览器所在的位置指定使用何种浏览器：

```shell
cypress open --browser /usr/bin/chromium
```

当前，只有Chrome家族的浏览器是支持的。

{% url "对使用浏览器有疑问？请阅读调试指南" debugging#Launching-browsers %}。

### `cypress open --config <config>`

```shell
cypress open --config pageLoadTimeout=100000,watchForFileChanges=false
```

### `cypress open --env <env>`

```shell
cypress open --env host=api.dev.local
```

### `cypress open --global`

如果你想使用一处安装的Cypress到多个项目中，那么以全局模式打开Cypress是非常有用的。这样，你就可以在全局模式下添加每个子项目到Cypress里，你就可以有一个漂亮UI界面进行切换啦：

```shell
cypress open --global
```

### `cypress open --port <port>`

```shell
cypress open --port 8080
```

### `cypress open --project <project-path>`

默认情况下，Cypress希望在`package.json`所在的地方找到你的`cypress.json`。 但是，你可以指定Cypress在不同的位置运行。

这使你可以在顶级`node_modules`文件夹中安装Cypress，但在嵌套子文件夹中运行它。 如果你的仓库中有多个Cypress项目，这也很有用。

为了看到这一点，我们设置了一个 {% url '示例演示仓库' https://github.com/cypress-io/cypress-test-nested-projects %}。

```shell
cypress open --project ./some/nested/folder
```

## `cypress verify`

验证Cypress安装正确并可用：

```shell
cypress verify
✔  Verified Cypress! /Users/jane/Library/Caches/Cypress/3.0.0/Cypress.app
```

## `cypress version`

输出已安装的Cypress二进制应用程序和npm模块的版本。
在大多数情况下，它们将是相同的，但如果你安装了不同版本的npm软件包，并且由于某种原因无法安装匹配的二进制文件，它们可能会有所不同。

```shell
cypress version
Cypress package version: 3.0.0
Cypress binary version: 3.0.0
```

## `cypress cache [command]`

用于管理全局Cypress缓存的命令。Cypress缓存适用于整个机器上的所有Cypress安装，无论是否全局安装的。

### `cypress cache path`

打印Cypress缓存`path`（路径）。

```shell
cypress cache path
/Users/jane/Library/Caches/Cypress
```

### `cypress cache list`

打印所有已安装的Cypress版本。 输出将是**空格分隔的**版本号列表。

```shell
cypress cache list
3.0.0 3.0.1 3.0.2
```

### `cypress cache clear`

清除cypress缓存的内容。当你希望cypress清除可能在你的计算机上所有已安装的缓存下来的cypress版本时，这非常有用。 运行此命令后，你需要在再次运行Cypress之前运行`cypress install`。

```shell
cypress cache clear
```

# 调试命令

Cypress使用{% url 'debug' https://github.com/visionmedia/debug %}模块完成构建。这意味着你可以通过运行`cypress open`或`cypress run`启动预先打开的具有帮助性调试输出。

**在Mac或Linux上：**

```shell
DEBUG=cypress:* cypress open
```
```shell
DEBUG=cypress:* cypress run
```

**在Windows上：**

```shell
set DEBUG=cypress:*
```
```shell
cypress run
```

Cypress是一个相当庞大和复杂的项目，涉及十几个或更多的子模块，默认输出可能是潮水般的。

**将调试输出过滤到特定模块：**

```shell
DEBUG=cypress:cli cypress run
```

```shell
DEBUG=cypress:launcher cypress run
```

...甚至一个第三级的子模块：

```shell
DEBUG=cypress:server:project cypress run
```
