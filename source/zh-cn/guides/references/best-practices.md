---
title: 最佳实践
layout: toc-top
---

## 用例组织，登录，状态控制

{% note danger %}
{% fa fa-warning red %} **反面典型：** 共享页面对象，使用UI登录，不使用快捷方式。
{% endnote %}

{% note success %}
{% fa fa-check-circle green %} **最佳实践：** 用例模块分离，程式化登录，控制应用状态。
{% endnote %}

在2018年2月，我们就“最佳实践”议题在AssertJS展开了一次讨论。以下视频展示了如何书写快速的、规模化的用例：

{% fa fa-play-circle %} {% url https://www.youtube.com/watch?v=5XQOK0v_YRE %}

## 元素选择

{% note danger %}
{% fa fa-warning red %} **反面典型：** 使用易变化的高脆性选择器。
{% endnote %}

{% note success %}
{% fa fa-check-circle green %} **最佳实践：** 使用`data-*`属性来提供选择器上下文并将它们与CSS或JS更改隔离开来。
{% endnote %}

你编写的每个测试都将包含元素的选择器。为了避免许多麻烦，你应该编写对变化具有弹性的选择器。

我们经常看到用户遇到针对其元素的问题，因为：

- 你的应用程序可能使用动态类或更改的ID
- 你的选择器可能从开发处成为变更的的CSS样式或JS行为

有幸，要避免上述两种麻烦也是非常容易的：

1. 不要基于CSS属性，比如`id`，`class`，`tag`等来定位元素；
2. 不要使用可能会改变`textContent`的元素定位；
3. 添加`data-*`属性来来定位元素更加容易。

### 它是如何工作的？

假设有一个我们想要进行交互的按钮：

```html
<button id="main" class="btn btn-large" data-cy="submit">Submit</button>
```

让我们来研究下如何定位它：

选择器 | 推荐程度 | 备注
--- | --- | ---
`cy.get('button').click()` | {% fa fa-warning red %} 绝不 | 最糟糕的方式 - 太泛了，没有上下文。
`cy.get('.btn.btn-large').click()` | {% fa fa-warning red %} 绝不 | 糟糕。高度耦合，太容易改变。
`cy.get('#main').click()` | {% fa fa-warning orange %} 一般 | 稍好。但依然是耦合方式且绑定了JS事件监听器。
`cy.contains('Submit').click()` | {% fa fa-check-circle green %} 相对 | 好得多了，但依然绑定了可能改变的文本内容。
`cy.get('[data-cy=submit]').click()` | {% fa fa-check-circle green %} 推荐 | 最好的，从所有可能的变化中分离开了。

用`tag`，`class`或`id`来定位上面的元素是非常不稳定的，并且很容易改变。应用可能会清理掉元素，可能会重构CSS并更新ID，或者还可能添加或删除影响元素样式的类。

然而，添加`data-cy`属性到元素，给予了我们专用于测试的元素定位器。

CSS或JS行为的改变不会影响到`data-cy`属性，这意味着它不是与某个元素的**行为**或**风格**相绑定的。

也就是说，它就是专用于测试代码运行的！

{% note info "你知道吗？" %}

{% url "Selector Playground" test-runner#Selector-Playground %}自动遵循这些最佳实践原则。

当决定一个唯一的定位器时，它会自动选择包含这些属性的元素：

- `data-cy`
- `data-test`
- `data-testid`

{% endnote %}

### 文本内容：

当看过以上规则后你可能会好奇：

> 如果我应该一直使用data属性定位的话，那什么时候用`cy.contains()`呢？

一个简单的经验法则就是问问自己：

如果元素的内容发生**变化**，你希望当前测试失败吗？

 - 如果答案是肯定的：那么使用{% url `cy.contains()` contains %}；
 - 如果答案为否：则使用data属性。

**示例：**

回顾关于按钮的`<html>`源码：

```html
<button id="main" class="btn btn-large" data-cy="submit">Submit</button>
```

问题在于：`Submit`的文本内容重要程度如何？如果文本内容由`Submit`变成`Save` - 你希望此次测试的结果为失败吗？

如果答案是“是”，因为`Submit`是非常重要的，不应该改变 - 那么请使用{% url `cy.contains()` contains %}来定位这个元素。这样一来，如果文本内容改变了，测试就失败了（问题就被发现了）。

如果答案是“否”，因为文本内容是允许改变的 - 那么请使用利用data属性的{% url `cy.get()` get %}。就算文本变成了`Save`也不会导致测试用例失败。

## 设置返回值

{% note danger %}
{% fa fa-warning red %} **反面典型：** 希望通过`const`，`let`或`var`来设置指令的返回值。
{% endnote %}

{% note success %}
{% fa fa-check-circle green %} **最佳实践：** 使用{% url 'closures to access and store' variables-and-aliases %}等指令回传给你。
{% endnote %}

许多新手看了Cypress的代码并认为它是同步机制的。

我们看到新手绝大多数会这样写代码：

```js
// 不要这样做，它是不会按你想的去运行的

const button = cy.get('button')

const form = cy.get('form')

// 会失败
button.click()
```

{% note info '你知道吗？' %}
在Cypress里，你几乎用不着使用`const`，`let`或`var`。如果你用了，那只能说明你可能在用错误的办法。
{% endnote %}

如果你是Cypress新手，想要更好的了解指令是如何运行的 - 请{% url '阅读我们的Cypress介绍 - 指令部分' introduction-to-cypress#Chains-of-Commands %}。

如果你已经熟悉了Cypress指令，但依然在使用`const`，`let`或`var`，那么你可能正在做这些事：

- 你正在尝试“保存并对比”值，比如**text**，**classes**，**attributes**；
- 你正在试着在不同的用例或前置`before`和`beforeEWach`之间“共享”值。

如果要达成以上目的，请参阅我们的{% url '变量和别名指南' variables-and-aliases %}。

## 访问外部站点

{% note danger %}
{% fa fa-warning red %} **反面典型：** 尝试访问和你没控制的站点或服务器。
{% endnote %}

{% note success %}
{% fa fa-check-circle green %} **最佳实践：** 只测试你可控的。尽量避免请求一个第三方的服务器。如果是必要的时候，使用{% url `cy.request()` request %}来与第三方的服务进行APIs对话。
{% endnote %}


我们的许多使用者尝试做的第一件事就是在他们的测试中测试包含第三方的服务。

你可能希望在以下几种情况下访问第三方服务器：

1.当你的应用通过OAuth使用其他提供商时，测试登录；
2.验证服务器是否更新了第三方服务；
3.检查你的电子邮件，看看你的服务器是否发送了“忘记密码”电子邮件。

起初，你可能想要使用{% url `cy.visit()` visit %}或使用Cypress遍历第三方登录窗口。

然而，你应该**绝不**使用你的UI访问第三方网站，因为：

 - 这非常耗费时间并且减慢了测试速度；
 - 第三方网站可能已更改或更新其内容；
 - 第三方网站可能存在你无法控制的问题；
 - 第三方网站可能会检测到你正在通过脚本进行测试并阻止你；
 - 第三方网站可能正在运行A/B随机竞制。

让我们看看处理这些情况的一些策略。

### 如果登录：

许多OAuth提供商提供A/B竞制，这意味着它们的登录屏幕是动态改变的。也让自动化测试变得难起来。

许多OAuth提供商也限制了web请求的可以发送的次数。比如，如果你测试一下Google，Google会**自动地**检测到你不是一个人类而给你一个代码验证码的登录屏幕。

另外，测试OAuth提供商，变数是非常大的 - 你可能一开始就需要一个在它里面的真实用户，任何对此用户的修改将会影响下游的其它测试用例。

**以下是一些在一定程度上可以解决或缓和此类问题的办法：**

1. {% url "Stub" stub %} OAuth提供程序并完全绕过他们的UI。你可以欺骗你的应用程序，使其相信OAuth提供程序已将其令牌传递给你的应用程序。
2. 如果你**必须**获得真实令牌，你可以使用{% url `cy.request()` request %}并使用你的OAuth提供商提供的**程序化** API。这些API可能一般不会那么频繁地更改，一定程度上避免出现访问次数限制和A/B随机竞制问题。
3. 你也可以向服务器寻求帮助，而不是让你的测试代码绕过OAuth。也许所有OAuth令牌都是在数据库中生成用户。通常，OAuth只是最初在你的服务器会与客户端建立自己的会话时有用。如果是这种情况，只需使用{% url `cy.request()` request %}直接从你的服务器获取会话并完全绕过程序。

{% note info 示例 %}
{% url "我们在登录案例里有多个实例如何做到这些" recipes %}
{% endnote %}

### 第三方服务：

有时你在应用中采取的行为**可能**会影响另一个第三方应用程序。这些情况并不常见，但有可能。想象一下，你的应用程序与GitHub集成，使用你的应用程序，你可以更改GitHub内的数据。

在运行测试之后，你可以使用{% url `cy.request()` request %}直接以后台方式与GitHub的API进行交互，而不是尝试{% url `cy.visit()` visit %}GitHub。

这避免了需要使用另一个应用程序的UI。

### 邮件验证：

通常，在进行用户注册或忘记密码等场景时，你的服务器会安排要发送的电子邮件。

检查发生这种情况的最简单方法可能是在服务器级别进行单元或集成测试，而不是在端到端级别。你通常不需要测试只有你的服务器参与的交互，比如边缘影响或其他类似服务。

然而，如果你**确实**想要在Cypress编写测试，那么你已经拥有了这样的工具来完成这项工作而不涉及UI。

1. 你可以使用`cy.request()`在一个后端节点请求获取哪些电子邮件已经在队列里或已发送。这将为你提供一种程序化的方式来知晓(已发生的流程)，而无需涉及UI。你的服务器必须公开此后端节点；
2. 你还可以将`cy.request()`用于第三方服务器，该服务器公开API以读取电子邮件。然后，你将向服务器提供来自你应用的正确的身份验证凭据，或者你可以使用环境变量来完成。

## 前后用例的状态依赖

{% note danger %}
{% fa fa-warning red %} **反面典型：** 耦合多个用例在一起。
{% endnote %}

{% note success %}
{% fa fa-check-circle green %} **最佳实践：** 用例应该一直保持相互独立并各自运行通过。
{% endnote %}

你只需要做一件事就可以知道你是否错误地耦合了测试，或者一个测试是否依赖于前一个测试的状态。

在测试中放置一个`.only`并刷新浏览器。

如果这个测试可以自己运行并且通过 - 祝贺你写了一个很好的测试。

如果不是这种情况，那么你应该重构并改变你的方法。

如何解决这个问题：

 - 将先前测试中的重复代码移动到`before`或`beforeEach`钩子。
 - 将多个测试组合成一个更大的测试。

让我们看一下以下填写表单的测试：

```javascript
// 一个错误的示范
describe('my form', function () {
  it('visits the form', function () {
    cy.visit('/users/new')
  })

  it('requires first name', function () {
    cy.get('#first').type('Johnny')
  })

  it('requires last name', function () {
    cy.get('#last').type('Appleseed')
  })

  it('can submit a valid form', function () {
    cy.get('form').submit()
  })
})
```

上面的测试有什么问题？它们全都被耦合在一起了！

如果你写一个`.only`到上面最后三个的任意一个用例上，它们的结果将是失败。因为为了运行成功，每一个测试用例都假设前面的用例是按顺序执行的。

为了解决这个问题有两种办法：

### 合并成一个用例

```javascript
// 稍微修改后好了一点
describe('my form', function () {
  it('can submit a valid form', function () {
    cy.visit('/users/new')

    cy.log('filling out first name') // 如果你业务确实需要这一步
    cy.get('#first').type('Johnny')

    cy.log('filling out last name') // 如果你业务确实需要这一步
    cy.get('#last').type('Appleseed')

    cy.log('submitting form') // 如果你业务确实需要这一步
    cy.get('form').submit()
  })
})
```

现在我们可以设置一个`.only`到这个测试用例上，它运行时将成功地与其他任何用例呈现无关性。理想的Cypress工作流是同一时间编写和与独立的用例互动。

### 在每个测试用例开始前执行共享代码

```javascript
describe('my form', function () {
  beforeEach(function () {
    cy.visit('/users/new')
    cy.get('#first').type('Johnny')
    cy.get('#last').type('Appleseed')
  })

  it('displays form validation', function () {
    cy.get('#first').clear() // 清除名字
    cy.get('form').submit()
    cy.get('#errors').should('contain', 'First name is required')
  })

  it('can submit a valid form', function () {
    cy.get('form').submit()
  })
})
```

上面的示例是理想的，因为现在我们正在重置每个测试之间的状态，并确保先前测试中没有任何内容泄漏到后续测试中。

我们也在表单的“默认”状态基础上增加了新的前置，这使编写多个测试变得容易。这样每个测试都有所依赖，但每个测试都可以独立运行并通过。

## 创建仅有单一断言的“微”测试

{% note danger %}
{% fa fa-warning red %} **反面典型：** 就好像在写单元测试。
{% endnote %}

{% note success %}
{% fa fa-check-circle green %} **最佳实践：** 别担心，多添加点断言。
{% endnote %}

我们已经见识过许多使用者像这样写代码：

```javascript
describe('my form', function () {
  before(function () {
    cy.visit('/users/new')
    cy.get('#first').type('johnny')
  })

  it('has validation attr', function () {
    cy.get('#first').should('have.attr', 'data-validation', 'required')
  })

  it('has active class', function () {
    cy.get('#first').should('have.class', 'active')
  })

  it('has formatted first name', function () {
    cy.get('#first').should('have.value', 'Johnny') // capitalized first letter
  })
})
```

首先，技术上来说这肯定是能通过的 - 但这样太极端了，不够高效。

为什么在单元测试中才使用此模式：

 - 当断言失败时，你依靠测试的标题来知道失败的原因
 - 你被告知添加多个断言很糟糕并且接受这是真理
 - 拆分的多个测试没有性能损失因为它们运行得非常快

为什么你不应该在Cypress里这样做：

 - 编写集成测试与单元测试不同
 - 你将始终知道（并且可以直观地看到）在大型测试中哪个断言失败
 - Cypress运行一系列异步的生命周期事件，在测试之间会重置状态
 - 重置测试比添加更多断言要慢得多

Cypress的测试通常会发出30多个命令。因为几乎每个命令都有一个默认断言（因此可能会失败），即使通过限制断言数，你也不会自己节省出任何东西，因为**任何单个的命令都可能隐式的失败**。

你应该如何重写这些测试：

```javascript
describe('my form', function () {
  before(function () {
    cy.visit('/users/new')
  })

  it('validates and formats first name', function () {
    cy.get('#first')
      .type('johnny')
      .should('have.attr', 'data-validation', 'required')
      .and('have.class', 'active')
      .and('have.value', 'Johnny')
  })
})
```

## 使用钩子`after`或`afterEach`

{% note danger %}
{% fa fa-warning red %} **反面典型：** 使用`after`或`afterEach`钩子来清理环境状态。
{% endnote %}

{% note success %}
{% fa fa-check-circle green %} **最佳实践：**在**测试**运行前，就清理环境状态。
{% endnote %}

我们看到许多使用者添加代码到`after`或`afterEach`钩子里，以便清理因当前测试造成的环境状态变化。

我们看到的大多数这样的代码会这样写：

```js
describe('logged in user', function () {
  beforeEach(function () {
    cy.login()
  })

  afterEach(function () {
    cy.logout()
  })

  it('tests', ...)
  it('more', ...)
  it('things', ...)
})
```

让我们来看看为什么这不是真的有必要。

### 状态保存是你的朋友：

Cypress**最优秀**部分之一是强调可调试性。与其他测试工具不同 - 当你的测试结束时 - 你将在测试完成的确切位置留下你的应用程序的状态。

这是一个**非常好的**让你在测试完成后可以继续**使用**你的应用程序的机会！这使你能够一步一步地编写**多步骤测试**，逐步地驱动你的应用程序，边编写测试边调试应用程序代码。

我们已经让Cypress支持这种情况。事实上，Cypress在测试结束时**不会**清理自己的内部状态。我们**希望**你在测试结束时保存测试状态！像{% url "`stubs`" stub %}，{% url "`spies`" spy %}甚至{% url "`routes`" route %}这样的东西都**不会**在测试结束时被删除。这意味着你的应用程序在运行Cypress命令期间和在测试结束后手动使用它时的行为相同。

如果在每次测试后删除应用程序的状态，那么你将立即失去在此模式下使用应用程序继续调试的能力。在结束时注销登录，将始终在测试结束时为你提供相同的登录页面。为了调试你的应用程序或编写某个测试步骤，你将需要注释掉自定义的`cy.logout（）`命令。

### 都是缺点，没有优点：

目前，我们假设由于某种原因，你的应用程序特别地**需要**运行最后的`after`或`afterEach`代码。让我们假设一下，如果该代码(因为某些异常)没有运行呢 - 所有的东西都将错乱。

这很好 - 但即使是这种情况，它也不应该进入`after`或`afterEach`钩子。为什么？到目前为止，我们一直在谈论退出登录，但让我们使用一个不同的例子。让我们使用需要重置数据库的例子吧。

**事情是这样的：**

>在每次测试之后，我想确保数据库重置为0记录，因此当下一个测试运行时，它将以干净状态运行。

**考虑到这一点你将写这样的东西：**

```js
afterEach(function () {
  cy.resetDb()
})
```

问题就出在这里：**没有任何机制可以保证这些代码一定会运行**。

假设你已编写此命令，因为它必须在下一次测试之前运行，那么绝对最糟糕的处理是把它放在在`after`或`afterEach`钩子中。

为什么？因为如果你在测试过程中刷新了Cypress(因为某种原因) - 你将在数据库中建立破坏性的临时状态，你的自定义`cy.resetDb()`函数永远不会被调用。

而因为你写的测试逻辑的原因，每一个用例又需要这种状态清理，那么下一次测试将立即失败。为什么？因为当你刷新了Cypress时，重置状态就不会发生了。

### 状态重置应该在每个测试运行之前进行：

最简单的解决方案就是把你的清理代码放到测试运行**之前**。

放到`before`或`beforeEach`钩子里的代码**总**会先于测试代码运行 - 哪怕你在某个测试运行中期刷新了Cypress。

这同样是一个使用{%url 'root level hooks in mocha' https://github.com/mochajs/mochajs.github.io/blob/master/index.md#root-level-hooks %}的绝好时机。{% url "`cypress/support/index.js` file" writing-and-organizing-tests#Support-file %}是放置这些的完美地点，因为它总是率先于所有的测试文件做检测。

**添加到root的钩子总是会在所有测试集里运行！**

```js
// cypress/support/index.js

beforeEach(function () {
  // 现在，不管怎样，这个将优先于所有测试文件的所有测试用例运行
  // across all files no matter what
  cy.resetDb()
})
```

就这么简单！

### 状态的重置是必要的吗？

你应该问自己的最后一个问题是 - 有必要重置状态吗？请记住，Cypress已经在每次测试前自动清除{% url "`localStorage`" clearlocalstorage %}，{% url "cookies" clearcookies %}，sessions等。确保你没有尝试清除已被Cypress自动清除的状态。

如果你正试图清理的东西存在在服务器上 - 请务必清理它。你将需要按照常规的测试思想去运行和清理！但如果状态与你当前正在测试的(前端)应用程序相关 - 你甚至可能不需要清除它。

*译者注（理解有误请提BUG）：这里可能主要考虑清理环境时，被清理的数据是在前端还是在后端。如果是前端数据，比如在localStorage、cookies或sessions里的，那么Cypress会自动帮你清理掉，所以不需要自己再去清理一遍；而如果是测试时对服务器的数据造成了影响，则一定要清理。*

你唯一需要清理状态的时间是，如果一个测试运行的操作影响下游的另一个测试。只有那些情况下你需要进行状态清理。

## 不必要的等待

{% note danger %}
{% fa fa-warning red %} **反面典型：** 使用{% url `cy.wait(Number)` wait#Time %}等待一个武断的时间。
{% endnote %}

{% note success %}
{% fa fa-check-circle green %} **最佳实践：** 使用路由别名或断言来监听Cypress运行，直到一个明确的条件达成。
{% endnote %}

在Cypress，你机会用不到`cy.wait()`来等待一个武断的时间段。如果你发现自己正在这么做，那么应该有更好的、更简单方法来达成你的需求。

比如我们假设有如下例子：

### 在`cy.request()`后不必要的等待

在{% url `cy.request()` request %}指令下等待是不必要的，因为它本身就会一直等待直至收到一个服务器的响应。在{% url `cy.request()` request %}之后添加的5秒等待是无谓的。

```javascript
cy.request('http://localhost:8080/db/seed')
cy.wait(5000)     // <--- 这里是没必要的
```

### 在`cy.visit()`后不必要的等待

在{% url '`cy.visit()`' visit %}之后添加的等待是不必要的，因为本身它就会在页面的`load`事件产生(页面加载完成的标志)后才结束。在那个时候，所有页面的内容都加载了，包括Javascript、stylesheets和html代码。

```javascript
cy.visit('http://localhost/8080')
cy.wait(5000)     // <--- 这里是没必要的
```

### 在`cy.get()`前不必要的等待

在{% url `cy.get()` get %}之前添加的等待是不必要的，因为{% url `cy.get()` get %}会自动重试直至table的`tr`的长度为2。

任何时候，只要指令后跟了断言，那么它会自动重试直至断言通过。这使得你不必担心没法描述什么时候应用到达了什么状态。

```javascript
cy.server()
cy.route('GET', /users/, [{ 'name': 'Maggy' }, { 'name': 'Joan' }])
cy.get('#fetch').click()
cy.wait(4000)     // <--- 这里是没必要的
cy.get('table tr').should('have.length', 2)
```

另一种更好的办法是使用route别名进行显示等待：

```javascript
cy.server()
cy.route('GET', /users/, [{ 'name': 'Maggy' }, { 'name': 'Joan' }]).as('getUsers')
cy.get('#fetch').click()
cy.wait('@getUsers')     // <--- wait explicitly for this route to finish
cy.get('table tr').should('have.length', 2)
```

## Web服务

{% note danger %}
{% fa fa-warning red %} **反面典型：** 想通过Cypress脚本{% url `cy.exec()` exec %}或{% url `cy.task()` task %}来启动web服务。
{% endnote %}

{% note success %}
{% fa fa-check-circle green %} **最佳实践：** 在Test Runner或无头模式下，先于运行Cypress之前启动web服务。
{% endnote %}

我们不建议你在Cypres里启动一个后台服务。

任何通过{% url "`cy.exec()`" exec %}或{% url "`cy.task()`" task %}启动的指令最终都必须要退出。否则的话，Cypress将不会继续执行下一个指令。

想通过{% url "`cy.exec()`" exec %}或{% url "`cy.task()`" task %}来启动web服务会带来很多问题，因为：

- 你必须把进程置于后台
- 你失去了通过终端控制的权利
- 你失去了它的`stdout`或日志记录
- 每一次测试运行，你会纠结在让一个已经运行的web服务重新启动的复杂事务里
- 你可能陷于端口冲突的问题里

**为什么我不能在`after`钩子中关闭进程？**

因为无法保证在`after`中的代码始终会运行。

在Cypress测试运行器中工作时，你始终可以在测试过程中重新启动/刷新。当发生这种情况时，`after`中的代码将不会执行。

**那我该怎么办？**

在运行Cypress之前启动你的Web服务器，并在完成后将其终止。

你想在CI中运行吗？

我们有{% url '你该如何启动和停止web服务示例' continuous-integration#Boot-your-server %}。

## 设置全局baseUrl

{% note danger %}
{% fa fa-warning red %} **反面典型：** 跳过设置`baseUrl`而直接使用{% url "`cy.visit()`" visit %}。
{% endnote %}

{% note success %}
{% fa fa-check-circle green %} **最佳实践：**在`cypress.json`文件里设置`baseUrl`。
{% endnote %}

在配置中添加{% url "`baseUrl`" configuration#Global %}可以省略将`baseUrl`传递给{% url "`cy.visit()`" visit %}和{% url "`cy.request()`" request %}。Cypress默认认为这是你要使用的url。

添加{% url "`baseUrl`" configuration#Global %}还可以在Cypress测试的初始启动期间节省一些时间。

当你开始运行测试时，Cypress不知道你计划测试的应用的网址。因此，Cypress初次会打开`https://localhost` + 一个随机端口。

### 没有设置`baseUrl`，Cypress在`localhost` + 随机端口加载主窗口
{% imgTag /img/guides/cypress-loads-in-localhost-and-random-port.png "Url address shows localhost:53927/__/#tests/integration/organizations/list_spec.coffee" %}

一旦遇到{% url "`cy.visit()`" visit %}，Cypress就会切换到主窗口的url到你访问中指定的url。当你的测试首次启动时，这可能会导致“闪烁”或“重新加载”。

通过设置`baseUrl`，你可以完全避免重新加载。一旦测试开始，Cypress将在你指定的`baseUrl`中加载主窗口。

### cypress.json

```json
{
  "baseUrl": "http://localhost:8484"
}
```

### 通过设置`baseUrl`，Cypress会在主窗口加载`baseUrl`

{% imgTag /img/guides/cypress-loads-window-in-base-url-localhost.png "Url address bar shows localhost:8484/__tests/integration/organizations/list_spec.coffee" %}

通过设置`baseUrl`，让你可以看到服务端是否在我们使用`cypress open`打开指定的`baseUrl`时停止了运行：

{% imgTag /img/guides/cypress-ensures-baseUrl-server-is-running.png "Test Runner with warning about how Cypress could not verify server set as the baseUrl is running" "no-border" %}

我们还会在尝试使用`cypress run`运行一个指定的`baseUrl`数次失败后，展示一个服务端未运行的错误：

{% imgTag /img/guides/cypress-verifies-server-is-running-during-cypress-run.png "The terminal warns and retries when the url at your baseUrl is not running" %}
