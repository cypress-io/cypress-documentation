---
title: 配置
---

当一个项目被添加到Cypress中时，项目中会创建`cypress.json`文件。这个文件用于存储`projectId`（{% url '在配置要记录的测试之后' dashboard-service#Setup %}）和你提供的任何配置值。

```json
{
  "projectId": "jd90q7"
}
```

# 选项

Cypress的默认行为可以通过提供以下任何配置选项来修改。下面是可用选项及其默认值的列表。

## 全局

选项 | 默认值 | 描述
----- | ---- | ----
`baseUrl` | `null` | url用作{% url `cy.visit()` visit %}或{% url `cy.request()` request %}命令的url前缀
`env` | `{}` | 要设置为{% url '环境变量' environment-variables %}的任何值
`ignoreTestFiles` | `*.hot-update.js` |用于忽略测试文件的glob模式的字符串或数组，否则那些测试文件将显示在测试列表中。Cypress使用`minimatch`选项：`{dot: true, matchBase: true}`。我们建议使用{% url "http://globtester.com" http://globtester.com %}来测试哪些文件匹配。
`numTestsKeptInMemory` | `50` | 快照和命令数据将保存在内存中的测试数量。如果在测试运行期间浏览器的内存消耗很高，请减少这个数字。
`port` | `null` | 用于托管Cypress的端口。通常这是一个随机生成的端口。
`reporter` | `spec` | {% url '报告生成器' reporters %}在`cypress run`时使用
`reporterOptions` | `null` | 使用的{% url '报告生成器选项' reporters#Reporter-Options %}。所支持的选项取决于报告生成器。
`testFiles` | `**/*.*` | 要加载的字符串glob模式的测试文件
`watchForFileChanges` | `true` | Cypress是否会在测试文件更改时监视并重新启动测试

## 超时

{% note success 核心概念 %}
{% url '超时' introduction-to-cypress#Timeouts %}应该是个很好理解的核心概念。这里列出的默认值是有意义的。
{% endnote %}

选项 | 默认值 | 描述
----- | ---- | ----
`defaultCommandTimeout` | `4000` | 等待时间(以毫秒为单位)，直到大多数基于DOM的命令被认为超时
`execTimeout` | `60000` | {% url `cy.exec()` exec %}命令期间等待系统命令执行结束的时间(以毫秒为单位)
`taskTimeout` | `60000` | {% url `cy.task()` task %}命令期间等待任务执行结束的时间(以毫秒为单位)
`pageLoadTimeout` | `60000` | 等待`页面转换事件`或{% url `cy.visit()` visit %}、{% url `cy.go()` go %}、{% url `cy.reload()` reload %}命令来触发它们的页面`加载`事件的时间(以毫秒为单位)。网络请求受底层操作系统的限制，即使这个值增加，仍然可能超时。
`requestTimeout` | `5000` | 等待{% url `cy.wait()` wait %}命令发出XHR请求的时间(以毫秒为单位)
`responseTimeout` | `30000` | 等待响应的时间(以毫秒为单位)，直到{% url `cy.request()` request %}、{% url `cy.wait()` wait %}、{% url `cy.fixture()` fixture %}、{% url `cy.getCookie()` getcookie %}、{% url `cy.getCookies()` getcookies %}、{% url `cy.setCookie()` setcookie %}、{% url `cy.clearCookie()` clearcookie %}、{% url `cy.clearCookies()` clearcookies %}和{% url `cy.screenshot()` screenshot %}中的一个返回响应。

## 文件夹/文件

选项 | 默认值 | 描述
----- | ---- | ----
`fileServerFolder`    | 项目根目录    | 应用程序文件将尝试从其中提供服务的文件夹路径
`fixturesFolder`    | `cypress/fixtures`    | 包含fixture文件的文件夹路径（传递`false`禁用）
`integrationFolder` | `cypress/integration` | 包含集成测试文件的文件夹路径
`pluginsFile` | `cypress/plugins/index.js` | 插件文件的路径。（传递`false`禁用）
`screenshotsFolder`     | `cypress/screenshots`     | 通过{% url `cy.screenshot()` screenshot %}命令保存或者在`cypress run`过程中测试失败后保存的截屏存放的文件夹路径
`supportFile` | `cypress/support/index.js` | 加载测试文件之前要加载的文件路径。这个文件被编译并绑定。（传递`false`禁用）
`videosFolder`     | `cypress/videos`     | 在`cypress run`过程中保存的视频存放的文件夹路径

## 截屏

选项 | 默认值 | 描述
----- | ---- | ----
`screenshotsFolder`     | `cypress/screenshots`     | 通过{% url `cy.screenshot()` screenshot %}命令保存或者在`cypress run`过程中测试失败后保存的截屏存放的文件夹路径
`trashAssetsBeforeRuns` | `true` | 在使用`cypress run`运行测试之前，Cypress是否会清除`screenshotsFolder`和`videosFolder`中的资源

有关截屏的更多选项，请查看{% url 'Cypress.Screenshot API' screenshot-api %}。

## 视频

选项 | 默认值 | 描述
----- | ---- | ----
`trashAssetsBeforeRuns` | `true` | 在使用`cypress run`运行测试之前，Cypress是否会清除`screenshotsFolder`和`videosFolder`中的资源
`videoCompression` | `32` | 视频压缩的质量设置，以恒定速率系数(CRF)表示。该值可以是`false`以禁用压缩或`0`和`51`之间的值，其中较低的值会产生更好的质量（以更大的文件大小为代价）。
`videosFolder`     | `cypress/videos` | 当通过`cypress run`运行测试时，Cypress会自动保存测试运行的视频。
`video`     | `true`     | Cypress是否会捕捉通过`cypress run`运行的测试视频。
`videoUploadOnPasses`     | `true`     | Cypress是否将处理、压缩和上传视频到{% url "仪表盘" dashboard-service %}，即使spec文件中的所有测试都通过了。这只适用于记录在仪表板上的运行。如果你只想在测试失败时上传spec文件的视频，请关闭此功能。

## 浏览器

选项 | 默认值 | 描述
----- | ---- | ----
`chromeWebSecurity`    | `true`    | 是否启用`同源策略`和`不安全混合内容`的Chrome Web安全。{% url '在此处阅读更多相关内容' web-security %}
`userAgent` | `null` | 使你能够重写浏览器在所有请求头中发送的默认用户代理。服务器通常使用用户代理值来帮助识别操作系统、浏览器和浏览器版本。有关用户代理值的示例，请参见{% url "用户代理MDN文档" https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent %}。
`blacklistHosts` | `null` | 希望为其阻塞通信的字符串或主机数组。{% urlHash '请阅读注解中的例子。' blacklistHosts %}
`modifyObstructiveCode` | `true` | Cypress是否会在.js或.html文件中搜索并替换阻塞的JS代码。{% urlHash '有关此设置的更多信息，请阅读注解。' modifyObstructiveCode %}

## 视口

选项 | 默认值 | 描述
----- | ---- | ----
`viewportHeight` | `660` | 测试视口下应用程序的默认高度（以像素为单位）。（使用{% url `cy.viewport()` viewport %}命令重写）
`viewportWidth` | `1000` | 测试视口下应用程序的默认宽度（以像素为单位）。（使用{% url `cy.viewport()` viewport %}命令重写）

## 动画

选项 | 默认值 | 描述
----- | ---- | ----
`animationDistanceThreshold` | `5` | 元素的距离（以像素为单位）必须超过一定的时间才能被认为是动画
`waitForAnimations` | `true` | 是否在执行命令之前等待元素结束动画

# 重写选项

Cypress提供了动态更改配置值的选项。这对于在多个环境和多个开发人员机器上运行Cypress非常有用。

这为你提供了这样的选项，例如重写`baseUrl`或环境变量。

## 命令行

当{% url '在命令行运行Cypress' command-line %}时，可以传递一个`--config`标志。

**示例：**

```shell
cypress open --config watchForFileChanges=false,waitForAnimations=false
```

```shell
cypress run --config integrationFolder=tests,fixturesFolder=false
```

```shell
cypress run --record --config viewportWidth=1280,viewportHeight=720
```

## 插件

对于{% url `1.2.0` changelog#1-2-0 %}，你可以使用Node代码以编程方式修改配置值。这使你能够使用`fs`之类的操作，读取配置值并动态更改它们。

虽然这可能比其他选项需要更多的工作—它为你提供了最大的灵活性和管理配置的能力。

{% url "我们已经在这里完整地记录了如何做到这一点。" configuration-api %}

## 环境变量

还可以使用{% url '环境变量' environment-variables %}重写配置值。这在{% url '持续集成' continuous-integration %}或在本地工作时特别有用。这使你能够在不修改任何代码或构建脚本的情况下更改配置选项。

默认情况下，任何与相应配置键匹配的环境变量都将重写`cypress.json`的值。

```shell
export CYPRESS_VIEWPORT_WIDTH=800
```

```shell
export CYPRESS_VIEWPORT_HEIGHT=600
```

我们自动对键和值进行标准化。Cypress将*剥去*`CYPRESS_`， 驼峰命名任意键，并自动将值转换为`Number`或`Boolean`。确保你的环境变量前缀为`CYPRESS_ `，否则它们将被忽略。

**下面的两个选项都是有效的**

```shell
export CYPRESS_pageLoadTimeout=100000
```

```shell
export CYPRESS_PAGE_LOAD_TIMEOUT=100000
```

{% note warning  %}
不匹配配置键的环境变量将被设置为常规环境变量，以便在`Cypress.env()`的测试中使用。

你可以{% url '阅读更多关于环境变量的信息' environment-variables %}。
{% endnote %}

## `Cypress.config()`

还可以使用{% url `Cypress.config()` config %}重写测试中的配置值。

{% note warning 作用域 %}
使用`Cypress.config`的配置集_只在当前spec文件的作用域内。_
{% endnote %}

```javascript
Cypress.config('pageLoadTimeout', 100000)

Cypress.config('pageLoadTimeout') // => 100000
```

# 解析配置

当你打开Cypress项目时，单击*设置*选项卡将向你显示已解析的配置。这使得理解和查看不同的值从何而来变得很容易。

{% imgTag /img/guides/configuration/see-resolved-configuration.jpg "See resolved configuration" %}

# 注解

## blacklistHosts

通过传递字符串或字符串数组，可以阻止向一个或多个主机发出的请求。

要查看这方面的使用示例，请查看{% url '谷歌解析方法' recipes#Stubbing-and-spying %}。

将主机列入黑名单：

- {% fa fa-check-circle green %} 只传递主机
- {% fa fa-check-circle green %} 使用通配符`*`模式
- {% fa fa-check-circle green %} 包含`80`和`443`以外的端口
- {% fa fa-exclamation-triangle red %} **不**包含协议：`http://`或`https://`

{% note info %}
不确定URL的哪一部分是主机？{% url '以本指南为参考。' https://nodejs.org/api/url.html#url_url_strings_and_url_objects %}

将主机列入黑名单时，使用{% url `minimatch` minimatch %}检查主机。当有疑问时，你可以测试某些东西是否符合你的需求。
{% endnote %}

给定以下网址：

```text
https://www.google-analytics.com/ga.js

http://localhost:1234/some/user.json
```

这将匹配以下黑名单主机：

```text
www.google-analytics.com
*.google-analytics.com
*google-analytics.com

localhost:1234
```

因为`localhost:1234`使用的端口不是`80`和`443`，所以*必须包含*它。

{% note warning “子域名” %}
小心没有子域名的URL。

例如给定一个URL：`https://google.com/search?q=cypress`

- {% fa fa-check-circle green %} 匹配`google.com`
- {% fa fa-check-circle green %} 匹配`*google.com`
- {% fa fa-exclamation-triangle red %} 不匹配`*.google.com`
{% endnote %}

当Cypress阻塞向匹配主机发出的请求时，它将自动发送一个`503`状态码。为了方便起见，它还设置了一个`x-cypress-blacklist-host`头，以便你可以看到它匹配了哪个规则。

{% imgTag /img/guides/blacklist-host.png "Network tab of dev tools with analytics.js request selected and the response header 'x-cypress-matched-blacklisted-host: www.google-analytics.com' highlighted " %}

## modifyObstructiveCode

启用此选项后，Cypress将搜索来自`.html`和`.js`文件上服务器的响应流，并替换{% url '匹配以下模式' https://github.com/cypress-io/cypress/issues/886#issuecomment-364779884 %}的代码。

这些脚本模式是过时和弃用的安全技术，用于防止点击劫持和帧崩溃。它们是过去的残留物，在现代浏览器中不再需要。然而，许多站点和应用程序仍然实现它们。

这些技术妨碍Cypress工作，并且可以在不改变任何应用程序行为的情况下安全地删除它们。

Cypress在网络级别修改这些脚本，因此搜索这些模式的响应流会有很小的性能开销。

如果你测试的应用程序或站点*没有*实现这些安全措施，你可以关闭此选项。此外，我们搜索的模式可能会不小心重写有效的JS代码。如果是这种情况，请禁用此选项。

## 智能代码补全

Cypress在编辑你的`cypress.json`文件时可以使用智能提示。{% url "了解如何设置智能代码补全。" intelligent-code-completion %}
