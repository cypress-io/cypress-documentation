---
title: 取舍
containerClass: faq
---

与任何其他测试工具不同，Cypress使用自己独特的架构自动化浏览器。虽然这解锁了你在其他任何地方找不到的力量，但还是有特定的权衡取舍。天下没有免费的午餐！

在本指南中，我们将列出一些缺陷以及关键是如何解决这些问题。

虽然起初看起来这些都是Cypress的严格限制导致的 - 我们认为你很快就会意识到这些界限中的许多实际上都“有好处”。从某种意义上说，它们可以阻止你编写糟糕，缓慢或古里古怪的测试。

### 将永久存在的“缺陷”：

- Cypress不是一般的{% urlHash "自动化工具" 自动化限制 %}
- Cypress命令{% urlHash "在浏览器内" 在浏览器内 %}运行
- 永远不会支持{% urlHash "多页签浏览" 多页签 %}
- 你无法使用Cypress同时驱动{% urlHash "两个浏览器在同一时间" 同一时间打开多浏览器 %}
- 每个测试都绑定到{% urlHash "单个域名后缀" 同域 %}

### 临时“缺陷”:

我们有{% url 'open issues' 'https://github.com/cypress-io/cypress/issues' %}，在那儿你可以看到Cypress将要解决的完整的问题清单，我们会高亮出一些相对重要的Cypress将要解决的问题，欢迎来一起{% url "做贡献" https://on.cypress.io/contributing %}。
这里面许多的问题已经在被解决或在{% url "里程碑" roadmap %}计划中。

- {% url "缺少`cy.hover()`指令的折中方案" hover %}
- {% issue 299 "没有`cy.tab()`指令" %}
- {% issue 311#issuecomment-339824191 "不支持源生或移动端事件" %}
- {% issue 170#issuecomment-340012621 "需要支持不同应用的文件上传" %}
- {% issue 433#issuecomment-280465552 "需要支持不同应用的文件下载" %}
- {% issue 685 "iframe支持有限，但可以用" %}
- {% issue 310 "除Chrome和Electron外没有对跨浏览器的支持" %}
- {% issue 95#issuecomment-281273126 "使用`window.fetch`时无法使用`cy.route()`但已有一个折中方案" %}，请参考{% url "此指导" https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/stubbing-spying__window-fetch/cypress/integration %}
- {% issue 144 "没有对shadow DOM的支持，但已有一个折中方案" %}，请参考{% url "这个评论" https://github.com/cypress-io/cypress/issues/830#issuecomment-449411701 %}

# 将永久存在的“缺陷”

## 自动化限制

Cypress是一个专业工具，可以很好地完成一件事：在开发过程中对Web应用程序进行端到端测试。你不应该将Cypress用于不适用的事情，例如：

- 索引网络(搜索)
- 蜘蛛链接
- 性能测试
- 脚本编写第三方网站

因为已经有其他优秀的工具针对上面列出的每个项目进行了专业突破。

Cypress的**甜点**是，被用作测试你自己的应用程序的工具，**就像你在构建它时一样**。它专为开发人员和QA工程师而设计，而非手动测试人员或探索性测试。

## 在浏览器内

以防你之前错过了这点 - Cypress测试其实是在浏览器内运行！这意味着我们可以做其他工具无法做到的事情。不需要对象序列化或JSON有线协议。你可以对所测试的应用程序中的所有内容进行真正的本机访问。Cypress不可能“错过”元素，它总是知道你的应用程序触发任何类型的事件的那一刻。

但这也意味着你的测试代码也会**在浏览器中运行**，测试代码不在Node.js或任何其他服务器端语言中运行。我们将支持的web的**唯一**语言是：JavaScript。

这种权衡意味着它使得与后端进行通信变得更加困难 - 就像你的服务器或数据库一样。你将无法直接连接或导入这些服务器端库或模块。虽然你当然可以要求可以在浏览器中使用的`node_modules`包。此外，你可以使用{% url "our Plugins API" writing-a-plugin %}或{% url "`cy.task()`" task %}来使用Node导入或直接与你的后端脚本对话。

要与你的数据库或服务器通信，你需要使用{% url `cy.exec()` exec %}，{% url `cy.task()` task %}或{% url `cy.request()` request %}指令。这意味着你需要公开初始化和设置数据库的方法。这真的不是那么难，但它可能需要比你的后端语言编写的其他测试工具更多的体力活儿。

这里的权衡是在浏览器中完成所有操作（基本上所有测试）都是为了Cypress有更好的体验。但意味着在浏览器之外可能需要额外的工作。

在未来，我们**确实**有计划发布基于其他语言的后端适配工具。

## 多页签

由于Cypress在浏览器中运行，因此它永远不会支持多标签。我们当然可以使用浏览器自带的自动化API来实现切换标签，但我们没有理由进行兼容(意指这不是Cypress需要考虑的范畴)。

大多数情况下，当用户单击打开新选项卡的`<a>`标签时，需要使用此情况。然后，用户希望切换到该选项卡以验证加载的内容。但是，你不应该这样做。事实上，我们有{% url '如何不通过多页签来测试这种情况的指南' recipes#Testing-the-DOM %}。

更进一步考虑 - 我们认为这属于浏览器本身行为，不应该考虑到测试用例里。你应该问问自己为什么要测试单击`<a href="/foo" target="_blank">`打开一个新选项卡。你已经知道这是浏览器原本的自身设计，你已经知道它就只是由`target="_blank"`属性触发的而已。

既然如此，只需测试(点击后)触发浏览器会执行此行为**这一点** - 而不是测试行为的全部。

```js
cy.get('a[href="/foo"]').should('have.attr', 'target', '_blank') // 就这么简单
```

此种原则贯穿Cypress全部。不要测试不该测的东西。这样会慢、脆弱、无任何价值。只需要测试你关心的、带来这些行为的底层设计。

## 同一时间打开多浏览器

就像多个选项卡一样 - Cypress不支持一次控制多个打开的浏览器。

但是**可以**将Cypress与另一个后端进程同步 - 无论是Selenium还是Puppeteer来驱动第二个打开的浏览器。我们实际上已经很好地看到了这项工作！

话虽如此，除了在最不寻常和罕见的情况下，你仍然可以测试大多数应用程序行为而无需同时打开多个浏览器。

你可能会问这样的功能：

>我正在尝试测试聊天应用程序。我可以一次使用Cypress运行多个浏览器吗？

无论你是在测试聊天应用程序还是其他任何东西 - 你真正要问的是测试的逻辑协作。但是，**你其实不需要重新创建整个环境，来达到测试100％覆盖率的协作的目的**。

因为这样做可以更快，更准确，更具可扩展性。

虽然超出了本文的指南范围，但你可以使用以下原则测试聊天应用程序。其中每一个都会要求引入更多逻辑协作：

### 仅使用浏览器:

```text
    &downarrow;
&leftarrow; browser &rightarrow;
    &uparrow;
```

避免与server后端交互，通过mock(模拟)假的消息响应或用户离开聊天了，来拉起你的JavaScript回调。

你可以{% url "stub" stub %}任何东西或模拟任何单一场景。消息响应，离线消息，连接，重连，断开连接，聊天组等等。任何在浏览器内发生的事情都可以完整地测试。甚至关闭浏览器也可以被打桩，因为你可以断言请求体不正确。

### 打桩其他连接：

```text
server &rightarrow; browser
            &downarrow;
server &leftarrow; browser
  &downarrow;
(other connections stubbed)
  &downarrow;
server &rightarrow; browser
```

使用你的服务器从浏览器接收消息，并通过模拟从“另一个参与者”发送消息来模拟那个参与者。这当然是基于你的特定的应用程序处理逻辑的，但通常你可以将记录插入数据库，或者在服务器侧执行一些操作，就好像需要将一个客户端的消息发送回浏览器真实的（要达到的某些前置条件）一样。

通常，此模式使你可以避免建立又一个WebSocket连接，但仍然可以实现浏览器和服务器的双向通信。这样一来你还可以测试边缘情况（断开连接等），而不必实际处理真实连接。

### 新连接介绍:

```text
server &rightarrow; browser
            &downarrow;
server &leftarrow; browser
  &downarrow;
server &rightarrow; other connection
            &downarrow;
server &leftarrow; other connection
  &downarrow;
server &rightarrow; browser
```

要测试这种情况 - 你需要一个浏览器可以连接的、你可以进行通信和控制的一个后台进程。

你可以有许多办法可用，以下是一个使用HTTP server的模拟客户端并暴露一个REST接口让我们控制的示例：

```js
// Cypress tests

// tell the http server at 8081 to connect to 8080
cy.request('http://localhost:8081/connect?url=http://localhost:8080')

// tell the http server at 8081 to send a message
cy.request('http://localhost:8081/message?m=hello')

// tell the http server at 8081 to disconnect
cy.request('http://localhost:8081/disconnect')
```

这个HTTP server可以是这样的：

```js
const client = require('socket.io:client')
const express = require('express')

const app = express()

let socket

app.get('/connect', (req, res) => {
  const url = req.query.url

  socket = client(url)

  socket.on('connect', () => {
    res.sendStatus(200)
  })
})

app.get('/message', (req, res) => {
  const msg = req.query.m

  socket.send(msg, () => {
    res.sendStatus(200)
  })
})

app.get('/disconnect', (req, res) => {
  socket.on('disconnect', () => {
    res.sendStatus(200)
  })

  socket.disconnect()
})

app.listen(8081, () => {})
```

这样可以避免打开新的浏览器，却可以给你足够的信心两个客户端100%的达到了端到端的连接通信。

## 同域

每一个测试都被限制在只能访问单个域名后缀。

什么是域名后缀？ 比如如下的urls示例，它们都有同一个域名后缀`cypress.io`。

- `http://cypress.io`
- `https://cypress.io`
- `https://www.cypress.io`
- `https://docs.cypress.io`
- `https://example.cypress.io/commands/querying`

其规则是：

- {% fa fa-warning red %} 你 **不能** 在同一个测试里{% url "访问" visit %}两个不同的域名后缀
- {% fa fa-check-circle green %} 你 **能** 在同一个测试里{% url "访问" visit %} 不同的子域名
- {% fa fa-check-circle green %} 你 **能** 在不同的测试里{% url "访问" visit %} 不同的域名后缀

```javascript
cy.visit('https://www.cypress.io')
cy.visit('https://docs.cypress.io') // 没问题
```

```javascript
cy.visit('https://apple.com')
cy.visit('https://google.com')      // 这将立即导致错误
```

存在此限制是因为Cypress在运行时会切换到每个特定测试下的域。

这里的好消息是，在一次测试中需要访问两个不同的域名后缀极为罕见。为什么？因为浏览器有一个称为`同源策略`的自然安全屏障，这意味着像`localStorage`，`cookies`，`service workers`和许多其他API之类的状态不会在它们之间共享。

因此，你在一个站点上执行的操作不可能影响另一个站点。

作为一个最佳世间，你不应访问不受你控制的第三方服务或与之互动。但是，也有例外！如果你的组织使用单点登录（SSO）或OAuth，则可能涉及在域名后缀之外的的第三方服务。

我们已经写了几个专门针对这种情况的指导：

- {% url '最佳实践之访问外部站点' best-practices#Visiting-external-sites %}
- {% url 'Web安全之通用折中方案' web-security#Common-Workarounds %}
- {% url '指南：SSO登录 - Single Sign On' recipes#Logging-In %}
