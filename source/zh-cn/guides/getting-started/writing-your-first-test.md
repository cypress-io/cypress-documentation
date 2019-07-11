---
title: 编写第一个测试
---

{% note info %}
# {% fa fa-graduation-cap %} 通过这篇文档你将会学习到

- 如何在Cypress里面开始测试一个新的项目.
- 通过的测试和失败的测试看起来如何.
- 测试网页导航, DOM查询, 以及编写断言.
{% endnote %}

{% video vimeo 237115455 %}

# 添加一个测试文件

假设你已成功{% url "安装了测试运行器" installing-cypress#Installing %}并且{% url "打开了Cypress应用程序" installing-cypress#Opening-Cypress %}, 现在是时候写我们的第一个测试了. 我们将:

1. 创建一个`sample_spec.js`文件.
2. 查看Cypress更新我们的规格列表.
3. 在交互模式下启动Cypress.

让我们在为我们准备的`cypress/integration`文件夹里面创建一个新文件:

```shell
touch {your_project}/cypress/integration/sample_spec.js
```

一旦我们创建了该文件，我们就会看到Cypress测试运行器立即将其显示在集成测试列表中. Cypress监控你的规格文件是否有任何变化，并自动显示任何变化。

即使我们还没有编写任何测试 - 也没关系 - 让我们点击`sample_spec.js`并观看Cypress启动你的浏览器。

{% note info %}
Cypress在你系统上安装的浏览器中打开测试. 你可以在{% url "启动浏览器" launching-browsers %}中详细了解我们如何执行此操作.
{% endnote %}

{% video local /img/snippets/empty-file-30fps.mp4 %}

我们现在正式进入{% url 'Cypress测试运行器' test-runner %}. 这是我们将花费大部分时间用于测试的地方。

{% note warning %}
注意Cypress显示无法找到任何测试的信息. 这很正常 - 我们还没有写任何测试呢! 有时候如果解析测试文件出错, 你也需要看这些信息. 你始终可以打开**Dev Tools**来检查控制台是否存在任何阻止Cypress读取测试的语法或者解析错误.
{% endnote %}

# 写一个简单的测试

现在是时候编写我们的第一个测试了. 我们将:

1. 编写我们的第一次通过测试.
2. 编写我们的第一次失败测试.
3. 观察Cypress实时重装.

当我们继续保存新的测试文件时, 我们会看到浏览器实时自动重新加载.

打开你最喜欢的IDEA并将下面的代码添加到`sample spec.js`测试文件中.

```js
describe('My First Test', function() {
  it('Does not do much!', function() {
    expect(true).to.equal(true)
  })
})
```

一旦你保存这个文件, 你应该看到浏览器重新加载.

虽然它没干啥有用的事儿, 这依旧使我们第一个通过的测试哟! ✅

在{% url '命令日志' test-runner#Command-Log %}中, 你将看到Cypress显示套件, 包含你的第一个测试和你的第一个断言(应该是以绿色通过的形式展示).

{% imgTag /img/guides/first-test.png "My first test shown passing in the Test Runner" %}

{% note info %}
注意Cypress会以默认页面的形式{% url "页面的右侧" test-runner#Application-Under-Test %}显示这个信息. Cypress假设你将想要出去并且{% url "访问" visit %}互联网上的一个URL-同时你不这样做也没问题.
{% endnote %}

现在来写我们的第一条失败测试.

```js
describe('My First Test', function() {
  it('Does not do much!', function() {
    expect(true).to.equal(false)
  })
})
```

一旦你再次保存, 你将看到Cypress以红色显示失败的测试, 因为`true`与`false`不相等.

{% imgTag /img/guides/failing-test.png "Failing test" %}

Cypress提供了一个很好的{% url '测试运行器' test-runner %}, 它为你提供了一套可视化结构的测试和断言套件, 很快你也会看到命令, 页面事件, 网络请求等.

{% video local /img/snippets/first-test-30fps.mp4 %}

{% note info 什么是describe, it, 和expect? %}
所有这些功能都来自Cypress自带的{% url '捆绑工具' bundled-tools %}.

- `describe`和`it`来自{% url 'Mocha' https://mochajs.org %}
- `expect`来自{% url 'Chai' http://www.chaijs.com %}

Cypress建立在这些你可能已经有一些熟悉和了解的流行的工具和框架之上*(希望你已经有所了解)*. 如果你还不了解的话, 也没问题.
{% endnote %}


{% note success 使用 ESlint? %}
检验我们的{% url "Cypress ESLint插件" https://github.com/cypress-io/eslint-plugin-cypress %}.
{% endnote %}

# 写一个*真实的*测试

**坚固的测试通常包括3个阶段:**

1. 设置应用程序状态.
2. 采取行动.
3. 对应用程序的状态结果做断言.

你可能也会看到这样的措辞"Given, When, Then",或者 "Arrange, Act, Assert". 这个想法很简单: 首先你把应用程序置于某种特定状态, 然后你对应用程序执行一些会造成它改变的操作, 最后你检查应用程序的状态结果.

今天, 我们将从一个狭隘的视角对这些步骤进行观察并且把它们清楚地映射到Cypress对应的命令上:

1. 访问一个网页.
2. 查询一个元素.
3. 与这个元素交互.
4. 断言页面上的内容.

## {% fa fa-globe %} 步骤1: 访问页面

首先, 让我们来访问一个网页. 我们将在这个例子里面访问我们的{% url '厨房水槽' applications#Kitchen-Sink %}应用页面, 你可以在这个页面尝试Cypress, 而无需担心没有一个页面可以用来测试.

使用{% url `cy.visit()` visit %}很简单, 我们把我们想访问的URL传进去就行. 让我们用下面这个真真正正访问页面的操作来替换掉我们之前的测试:

```js
describe('My First Test', function() {
  it('Visits the Kitchen Sink', function() {
    cy.visit('https://example.cypress.io')
  })
})
```

保存文件并且切换回到Cypress测试运行器. 你可能会注意到一些:

1. 现在{% url '命令日志' test-runner#Command-Log %}展示了新的`访问`动作.
2. 厨房水槽应用程序已经加载到了{% url 'App预览' test-runner#Overview %}窗.
3. 测试结果是绿色的(通过), 虽然我们没有写断言.
4. `访问`将展示了一个**蓝色挂起状态**直到页面完成加载.

如果请求返回了一个非`2xx`的状态码, 比如`404`或者`500`, 或者在代码的里面有一个JavaScript错误的话, 测试将会失败.

{% video local /img/snippets/first-test-visit-30fps.mp4 %}

{% note danger 只测试你有所掌控的Apps%}
虽然在这个向导里我们测试了我们的例子应用程序: {% url "`https://example.cypress.io`" https://example.cypress.io %} - 但你**不应该**测试你**没有掌控度**的应用程序. 为什么?

- 他们很容易在任意时刻改变从而破坏掉测试.
- 他们也许会做A/B测试, 这将导致获得一致的结果成为不可能.
- 他们可能侦测到你的脚本, 从而把你加入黑名单(Google就做了这种事).
- 他们可能有安全功能能够阻止Cypress运作.

Cypress的核心点是作为一个你每天使用的工具来构建和测试**你自己的应用程序**.

Cypress不是一个**通用目的**网页自动化工具. 它不太适合实时编写脚本, 以及测试不在你掌控下的网页产品.
{% endnote %}

## {% fa fa-search %} 步骤2: 查询一个元素

现在我们得到一个加载好的页面了, 我们需要对它进行一个动作. 我们何不点击一个页面上的一个链接呢? 听起来足够简单呢, 让我们来找一个我们喜欢的链接... `type`元素怎么样?

通过这个元素的内容找到它, 我们将使用{% url "`cy.contains()`" contains %}.

让我门把它加到我们的测试里面, 并看下会发生什么吧:

```js
describe('My First Test', function() {
  it('finds the content "type"', function() {
    cy.visit('https://example.cypress.io')

    cy.contains('type')
  })
})
```

我们的测试现在应该在{% url '命令日志' test-runner#Command-Log %}里面展示`CONTAINS`并且依旧是绿色(通过的).

即使没有添加一个断言, 我们也知道一切都是OK的! 这是因为Cypress的许多命令都会被构建失败如果它们没有发现它们预期该发现的东西. 这叫做{% url '默认断言' introduction-to-cypress#Default-Assertions %}.

为了验证这个, 拿一个页面上不存在的元素来替换`type`元素, 比如`hype`元素. 你将注意到仅仅过了4秒钟测试显示为红色了!

你能看到Cypress在幕后在做什么吗? 它自动的等待以及重试, 因为它预期着**最终**能在DOM里面发现内容. 它不会马上失败!

{% imgTag /img/guides/first-test-failing-contains.png "Test failing to not find content 'hype'" %}

{% note warning '错误信息' %}
我们在Cypress里精心编写了数百条定制错误消息，试图用简单的术语解释出错的原因. 在本例中Cypress尝试在整个页面去发现内容: `hype`, 但是**超时了**.
{% endnote %}

在我们添加另一个命令之前 - 让我们先把这个测试设为通过. 把`hype`替换为`type`.

{% video local /img/snippets/first-test-contains-30fps.mp4 %}

## {% fa fa-mouse-pointer %} 步骤3: 点击一个元素

好的, 现在我们想点击我们知道的链接. 我们该怎么做呢? 你几乎可以猜到哦: 添加一个{% url "`.click()`" click %}命令到之前的命令后面就可以了, 像这样:

```js
describe('My First Test', function() {
  it('clicks the link "type"', function() {
    cy.visit('https://example.cypress.io')

    cy.contains('type').click()
  })
})
```

你几乎可以把它当成一个小故事来读呢! Cypress称呼这个为"链接", 并且我们把命令链接起来构建测试, 这真的是通过一种声明的方式去表达app的动作呢.

还请注意{% url 'App预览' test-runner#Overview %}窗在点击之后更新了, 跟随被点击的链接显示了目标页:

现在我们可以对这个新页面做一下断言了!

{% video local /img/snippets/first-test-click-30fps.mp4 %}

{% note info %}
{% fa fa-magic %} 想在你的规格文件里面查看智能代码补全只需要添加一个单条注释哦. 阅读{% url '智能代码补全' intelligent-code-completion#Triple-slash-directives %}了解更多.
{% endnote %}

## {% fa fa-check-square-o %} 步骤4: 写断言

让我们对我们点进去的新页面上的某个元素写一个断言吧. 也许我们想确保一下新的URL是我们预期的URL. 我们可以通过{% url "`.should()`" should %}来链接一个断言, 来检查URL.

它看起来像这样子:

```js
describe('My First Test', function() {
  it('clicking "type" navigates to a new url', function() {
    cy.visit('https://example.cypress.io')

    cy.contains('type').click()

    // 应该存在一个包含'/commands/actions'的新URL
    cy.url().should('include', '/commands/actions')
  })
})
```

### 添加更多的命令和断言

在给定的测试中我们不需要被单条的交互和断言所限制. 事实上, 一个应用程序中的许多交互可能都需要多个步骤并且有可能通过超过一种方式去改变你的应用程序状态.

我们可以在这个测试里面继续交互和断言, 通过添加其他的链接来和新页面的元素进行交互和验证来做到.

我们可以用{% url "`cy.get()`" get %}继续CSS类来选择一个元素. 然后我们可以用{% url "`.type()`" type %}命令在选中输入框里面输入文本. 最后, 我们可以通过输入另一个{% url "`.should()`" should %}来验证输入框反映的文本值.

```js
describe('My First Test', function() {
  it('Gets, types and asserts', function() {
    cy.visit('https://example.cypress.io')

    cy.contains('type').click()

    // 应该存在一个包含'/commands/actions'的新URL
    cy.url().should('include', '/commands/actions')

    // 获取一个输入, 输入进去并且验证文本值已经更新了
    cy.get('.action-email')
      .type('fake@email.com')
      .should('have.value', 'fake@email.com')
  })
})
```

就是这样: Cypress中的一个简单的访问页面的测试, 发现一个连接并点击它, 在新页面验证URL并且接着验证一个元素各种反应. 如果我们大声读出来, 它应该听起来像:

> 1. 访问: `https://example.cypress.io`
> 2. 通过内容去找到一个元素: `type`
> 3. 点击它
> 4. 获得URL
> 5. 断言它包含: `/commands/actions`
> 6. 通过`.actions-email`类去获得输入值
> 7. 在输入框输入`fake@email.com`
> 8. 断言输入框反映了新的文本值

或者按如下的Given, When, Then语法:

> 1. 给定一个用户的访问`https://example.cypress.io`
> 2. 当他们点击到标签为`type`的连接时
> 3. 并且他们是否在对类名为`.actions-email`的输入框输入"fake@email.com"
> 3. 然后这个URL应该包含`/commands/actions`
> 4. 然后类名为`.actions-email`的输入框有"fake@email.com"作为它的文本值

即使你的非技术合作伙伴也可以很好的欣赏你写的测试哦!

嘿, 这是一个非常干净的测试! 我们没有必要说出到底是*如何*工作起来的, 只是我们想验证一系列特定的事件和结果.

{% video local /img/snippets/first-test-assertions-30fps.mp4 %}

{% note info '页面转变' %}
值得注意的是, 这个测试在两个不同的页面上进行了转换.

1. 一开始 {% url "`cy.visit()`" visit %}
2. 然后{% url "`.click()`" click %}到了新的页面

Cypress自动检测诸如`页面转换事件`这样的东西, 并且将自动**停止**运行命令, 直到下一个页面**完成**加载.

如果**下一页**没有完成其加载阶段, Cypress将结束测试并呈现一个错误提示.

在幕后 - 这意味着你不必须要担心命令意外的运行在了旧的页面上, 也不用担心命令对部分加载的页面起了作用.

我们之前提到过, Cypress在超时发现一个DOM元素之前等待**4秒钟** - 但在这种情况下, 当Cypress侦测到`一个页面转变事件`时, 它会为一个单`页面加载`事件的超时时间增加到**60秒**.

换句话说, 基于命令和事件的发生, Cypress自动根据网页应用程序的表现来改变它的预期超时时长.

这些不同的超时时长被规定在{% url '配置' configuration#Timeouts %}文件中.
{% endnote %}

# 调试

Cypress提供了调试工具来帮你理解一个测试.

**我们给你能够做下面事情的能力:**

- 适时的追溯每一个命令的快照.
- 查看发生的特殊的`页面事件`.
- 接收关于每个命令的额外输出.
- 在多个命令间向前/后移动.
- 将命令暂停并且反复的单步调试它们.
- 当发现隐藏的或者多个元素的时候可视化它们.

让我们使用现有的测试代码看看其中的一些实际操作.

## 时间旅行

将鼠标**悬停**在命令日志中的`CONTAINS`命令上.

你看到发生了什么吗?

{% imgTag /img/guides/first-test-hover-contains.png "Hovering over the contains tab highlights the dom element in the App in the Test Runner" %}

Cypress自动回溯到该命令解析之时的快照. 此外, 因为{% url `cy.contains()` contains %}在页面找到了DOM元素, Cypress还突出显示元素并将其滚动到视图中(到页面顶部).

现在, 如果你记得在测试结束时我们最终得到了一个不同的URL:

> https://example.cypress.io/commands/actions

但是当我们把鼠标悬浮在`CONTAINS`上时, Cypress返回快照被记录时出现的URL.

{% imgTag /img/guides/first-test-url-revert.png "The url address bar shows https://example.cypress.io/" %}

## 快照

命令也是交互式的. 继续去点击一下`CLICK`命令.

{% imgTag /img/guides/first-test-click-revert.png "A click on the click command in the Command Log with Test Runner labeled as 1, 2, 3" %}

注意到它高亮成紫色. 它做了三件值得注意的事...

### 1. 固定快照
我们现在已经**固定**了这个快照. 悬浮在其他命令之上将不会返回它们. 这给了我们机会去手动检查处于当时快照情况下的测试下的应用程序的DOM元素.

### 2. 事件hitbox
因为{% url `.click()` click %}是一个动作命令, 这意味着我们还会在事件发生的坐标处看到一个红色的hitbox.

### 3. 快照菜单面板
还有一个新的菜单面板. 某些命令(比如动作命令)将拍摄若干个快照: **之前**和**之后**. 我们现在可以在这些快照间来回切换.

**之前**快照是在点击事件触发之前拍摄的. **之后**快照是在点击事件之后马上拍摄的. 虽然这个点击事件造成我们的浏览器加载一个新的页面, 它不是一个瞬间的转变. 它取决于你的页面加载的多快, 你可能仍然看到同样的页面, 或在页面卸载和转换时出现的空白屏幕.

当一个命令在我们的应用程序里面造成一个立即的视觉变化, 在之前和之后间切换将更新我们的快照. 我们可以通过在命令日志里面点击`TYPE`命令来查看这个动作. 现在, 点击**之前**将向我们展示默认状态下的输入值, 也就是占位符的文本. 点击**之后**将向我们展示完成了`TYPE`命令之后的情况(也就是我们输入在输入框中的值).

## 页面时间

注意还有一个看起来很有趣的日志: `(PAGE LOAD)`后面紧跟着另一个入口`(NEW URL)`. 这些都不是我们发出的命令 - 相反, Cypress本身将在重要的事件发生的时候在你的应用程序注销(*****感觉这里翻译的有问题*****). 请注意它们会看起来不同(它们是灰色的, 并且没有数字).

{% imgTag /img/guides/first-test-page-load.png "Command log shows 'Page load --page loaded--' and 'New url https://example.cypress.io/'" %}

**Cypress注销页面事件:**

- 网络XHR请求
- URL哈希变化
- 页面加载
- 表单提交

## 控制台输出

除了命令是交互的, 它们也在你的控制台输出额外的调试信息.

打开你的Dev Tools并且点击类名为`.action-email`的选择器的`GET`请求.

{% imgTag /img/guides/first-test-console-output.png "Test Runner with get command pinned and console log open showing the yielded element" %}

**我们能够看到Cypress在控制台输出了额外的信息:**

- Command (that was issued)
- Yielded (被这个命令返回的东西)
- Elements (发现的元素个数)
- Selector (我们用的参数)

我们甚至可以把返回的东西展开并且检查每一个单独的元素, 或者我们甚至可以点击它们, 并在元素面板里面检查它们!

## 特殊命令

除了具有有用的UI之外, 还有专门用于调试任务的特殊命令.

例如有:

- {% url "`cy.pause()`" pause %}
- {% url "`cy.debug()`" debug %}

让我们添加一个{% url "`cy.pause()`" pause %}到我们的测试代码里面并且看下会发生什么.

```js
describe('My First Test', function() {
  it('clicking "type" shows the right headings', function() {
    cy.visit('https://example.cypress.io')

    cy.pause()

    cy.contains('type').click()

    // 应该在一个新的包含'/commands/actions'的URL上
    cy.url().should('include', '/commands/actions')

    // 获得一个输入框, 将输入值输入并且验证是否输入框有更新
    cy.get('.action-email')
      .type('fake@email.com')
      .should('have.value', 'fake@email.com')
  })
})
```

现在Cypress提供我们一个UI界面来在每个命令之间前进(类似于一个调试器).

{% imgTag /img/guides/first-test-paused.png "Test Runner shows label saying 'Paused' with Command Log showing 'Pause'" %}

## 运转示例

{% video local /img/snippets/first-test-debugging-30fps.mp4 %}

<!-- ## 奖金步骤: 重构

一旦我们有了覆盖我们正在进行的系统的可通过的测试, 我们通常希望更进一步确保测试代码本身结构良好且可维护. 这有时在TDD生态圈中表示为“红色，绿色，重构”，这意味着：

1. 写一个失败测试.
2. 写代码保证测试通过.
3. 清理代码, 保持测试通过.

不管你期初对于写测试代码是什么感觉, 总之重构这个步骤是非常重要的! 我们希望我们的代码都能够很好的被维护和延伸, 以便它能活得长久同时富有成效, *包括我们的测试代码*.

使之具体化, 假设我们向这个套件添加了第二个类似的测试:

```js
describe('My First Test', function() {
  it("clicking type shows the heading Actions", function() {
    cy.visit('https://example.cypress.io')

    cy.contains('type').click()

    cy.get("h1").should('have.value', "Actions")
  })

  it("clicking focus shows the heading Focus Command", function() {
    cy.visit('https://example.cypress.io')

    cy.contains("focus").click()

    cy.get("h1").should('have.value', "Focus Command")
  })
})
```

我们在这里有一些重复, 可能会进行一些重构动作, 但是在这个简短的教程中, 我们将做一个简单而常见的. 让我们将初始化访问移动到`beforeEach()`块中.

```js
describe('My First Test', function() {
  beforeEach(function() {
    cy.visit('https://example.cypress.io')
  })

  it("clicking type shows the heading Actions", function() {
    cy.contains('type').click()

    cy.get("h1").should('have.value', "Actions")
  })

  it("clicking focus shows the heading Focus Command", function() {
    cy.contains("focus").click()

    cy.get("h1").should('have.value', "Focus Command")
  })
})
```

`beforeEach()`在同一个`describe()`中在每一个测试之前运行, 也就是我们的这个测试例子中的两个动作. 这两种测试都通过了, 而且都更短, 更容易阅读.

-->

# 下一步

- 开始{% url '测试你的app' testing-your-app %}.
- 为Cypress命令和断言设立{% url '智能代码补全' intelligent-code-completion %}.
- 搜索Cypress的文档说明书来更快的发现你需要的东西.

{% imgTag /img/guides/search-box.png "Use the search box to find relevant documentation" %}
