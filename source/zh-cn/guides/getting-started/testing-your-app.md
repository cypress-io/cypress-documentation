---
title: 测试你的应用程序
---

{% note info %}
# {% fa fa-graduation-cap %} 通过这篇文档你将会学习到

- Cypress与你后端的关系
- 如何配置Cypress以适用你自己的应用
- 使用和不使用授权机制
- 高效地使用测试数据
{% endnote %}

<!-- textlint-disable terminology -->
{% video youtube 5XQOK0v_YRE %}
<!-- textlint-enable -->

# {% fa fa-terminal %} No.1: 启动服务

假设你已经成功地在你的项目中{% url "安装Cypress" installing-cypress#Installing %}并且{% url "打开Cypress" installing-cypress#Opening-Cypress %}, 首先你要做的第一件事应该是你要做的第一件事是启动托管应用程序的本地开发服务器。

比如类似这样**http://localhost:8080**的样子.

{% note warning '警告' %}
千万别试图从Cypress脚本里启动一个web服务。更新信息可以参考阅读{% url '最佳实践' best-practices#Web-Servers %}.
{% endnote %}

{% note info '为什么要启动一个本机开发服务呢?' %}

你也许会很奇怪 - 为什么我不能只访问已经投入生产的应用程序?

毫无疑问，你当然*可以*测试已经部署的应用，但，这远不是Cypress所提倡的 *最佳选择*。

Cypress的构建和优化使其成为你日常本地开发的工具。事实上，在你开始使用Cypress一段时间之后，我们相信你可能会发现甚至在 **所有开发过程中** 都很有用。

最终，你不仅可以同时进行测试和开发，而且你实际上可以更快地构建应用程序，当然进行测试是“免费”的。

更重要的是 - 由于Cypress使你能够执行诸如存根网络请求之类的操作，你甚至无需服务器提供有效的JSON响应即可构建你的Web应用程序。

最后但同样重要的是 - 尝试对已经开发完毕的应用程序进行注入测试比在编写测试时构建它更加困难。你可能会遇到一系列初始的前期挑战/障碍(不熟悉前后端调用逻辑等)，最好是从开发一开始就编写测试(Cypress倡导TDD?)。

为什么要针对本地服务器进行测试的最后一个也许也是最重要的原因是，能够控制它们。当你的应用程序在生产中运行时，你无法控制它。

最后的最后，也许也是为什么要在本地创建servers并针对性地进行测试的最最重要的原因就是，你具有了完全控制它们的能力。当你的应用已经在生产环境时，你已经没办法完全控制它了。

当处于开发模式时，你可以轻松地：

- 获取截图
- 通过运行脚本看到所有数据的流转
- 暴露出测试环境的所有对象的既定流程走向
- 去化那些让自动化难以运行的安全功能
- 重置服务或数据库的状态

话虽如此 - 你依然可以自己选择到底怎么做啦。

许多Cypress的用户都选择在本地运行绝大多数的集成测试，而在生产环境上运行少数的冒烟测试。
{% endnote %}

# {% fa fa-globe %} No.2: 访问服务

一旦服务开始运行，我们就可以访问它啦！

让我们首先删除Cypress为你默认创建的`examples`目录，因为我们在之前的文档中已经学习过了：

```shell
rm cypress/integration/sample_spec.js
```

现在让我们创建我们自己的测试文件`home_page_spec.js`：

```shell
touch cypress/integration/home_page_spec.js
```

一旦文件创建成功，你应该可以在测试文件列表里看到它：

{% imgTag /img/guides/testing-your-app-home-page-spec.png  "List of files including home_page_spec.js" "no-border" %}

现在，添加如下代码到你的测试文件里：

```js
describe('The Home Page', function() {
  it('successfully loads', function() {
    cy.visit('http://localhost:8080') // change URL to match your dev URL
  })
})
```

然后，点击 `home_page_spec.js` 然后见证Cypress打开你的浏览器吧！

如果你忘记了启动Cypress服务了，你将看到以下错误：

{% imgTag /img/guides/testing-your-app-visit-fail.png "Error in Test Runner showing cy.visit failed" %}

如果你已经启动了Cypress服务，你将会看到应用启动并且开始工作了。

# {% fa fa-cogs %} No.3: Cypress配置

试想，你将迅速意识到你可能会在很多地方需要输入URL，因为测试就是在你的应用中去访问不同的页面。万幸，Cypress提供了一个{% url "配置选项" configuration %}。让我们试试吧！

打开在你安装Cypress的项目的根目录下的`cypress.json`。默认这是一个空的json文件：


```json
{}
```

让我们添加一个`baseUrl`项：

```json
{
  "baseUrl": "http://localhost:8080"
}
```

这将为{% url `cy.visit()` visit %}和{% url `cy.request()` request %}添加一个默认baseUrl作为前缀。

{% note info %}
只要你修改了`cypress.json`, Cypress都将重启并关闭掉它打开的浏览器。这是正常的。要重新启动浏览器只要点击测试文件就好。
{% endnote %}

现在我们可以访问一个相对地址啦，不再需要主机名或端口号了：

```js
describe('The Home Page', function() {
  it('successfully loads', function() {
    cy.visit('/')
  })
})
```

漂亮！一切都应该是正常的。

{% note info 配置项 %}
Cypress有许多配置选项可供你自定义其行为。 诸如测试文件所在的位置，默认超时时间，环境变量，要使用哪种报告等等。

详见{% url "配置" configuration %}！
{% endnote %}

# 测试策略

你即将开始为你的应用程序编写测试，并且只有*你*知道你的应用程序，因此我们没有给你更多具体的建议。

**测试的内容，边界和集成情况，可能的回归等等完全取决于你，你的应用程序和你的团队。**

但是，现代web测试有一些每个团队都会经历的坑，所以这里有一些关于你可能遇到的常见情况的小小提示。

## 1. 数据构造

根据应用程序的构建方式 - 你的Web应用程序一般会受到服务器的影响和控制。

通常，现在的服务器通过JSON与前端应用程序通信，但你也可能会面对传统的呈现的HTML Web应用程序的服务器端。

通常，服务器负责发送反映某种**状态**的响应 - 通常在数据库(或配置文件)中。

传统上，在使用Selenium编写`e2e`测试时，在自动化浏览器之前，你需要进行某些**set up和tear down**。

也许你需要生成一个用户，并利用它生成一些关联数据和记录。 你可能已经熟悉使用静态数据或工厂服务等。

要测试各种页面状态（如空视图或分页视图），你需要先在服务器创造好条件，以便可以测试这些状态。

**包括但不限于以上的测试经验策略， 在Cypress里你可以通过以下3种方式轻易达成：**

- {% url `cy.exec()` exec %} - 运行系统指令
- {% url `cy.task()` task %} - 通过{% url "`pluginsFile`" configuration#Folders-Files %}在Node里运行代码
- {% url `cy.request()` request %} - 发起HTTP请求

如果你启动了`node.js`服务，你可以添加钩子`before`或`beforeEach`来执行一个`npm`任务：

```js
describe('The Home Page', function () {
  beforeEach(function () {
    // reset and seed the database prior to every test
    cy.exec('npm run db:reset && npm run db:seed')
  })

  it('successfully loads', function() {
    cy.visit('/')
  })
})
```

不仅仅是执行系统命令，你可能有需要更多的灵活性和只有在测试环境中运行时才会暴露一系列路由的需求等。

**例如，你想一次编写多个请求，以告诉你的服务器你要创建的状态：**

```js
describe('The Home Page', function () {
  beforeEach(function () {
    // reset and seed the database prior to every test
    cy.exec('npm run db:reset && npm run db:seed')

    // seed a post in the DB that we control from our tests
    cy.request('POST', '/test/seed/post', {
      title: 'First Post',
      authorId: 1,
      body: '...'
    })

    // seed a user in the DB that we can control from our tests
    cy.request('POST', '/test/seed/user', { name: 'Jane' }).its('body').as('currentUser')
  })

  it('successfully loads', function() {
    // this.currentUser will now point to the response
    // body of the cy.request() that we could use
    // to log in or work with in some way

    cy.visit('/')
  })
})
```

虽然以上做法没有什么所谓的*错误*，但它确实增加了很多复杂性。 你将挣扎于同步服务器和浏览器之间的状态 - 另外你将始终需要在测试过程中写setup/teardown（这很慢）。

好消息是我们不是Selenium，也不是传统的e2e测试工具。 这意味着我们不受此限制。

**Cypress有其他几种办法，也许能让你有更好更快的体验。**

## 2. 服务存根

相对于“数据构造”，另一种合法的与服务后端“交互”的办法就是“绕过”它。简单得多！

你可以**存根**来自server端的JSON响应，这样你在前端依然可以看到正常的HTML/JS/CSS等。

这意味着，不是重置数据库，或者繁琐地“条件制造和清理”我们想要的状态，你可以强制服务器响应**你想要的任何**样子。通过这种方式，我们不仅没有阻止服务器和浏览器之间的状态同步，还可以防止我们在测试时可能出现的状态异变。这意味着我们的测试不会建立可能影响其他测试的状态来。

另一个好处是，这使你能够**构建你的应用程序**而不需要存在后端服务了！你可以按照希望构建数据的方式构建它，甚至可以测试所有边缘情况，而无需服务器。

然而 - 现在的情况时两种策略都是有效的，**你可能需要自己找到平衡**。

虽然存根很棒，但这意味着你无法保证存根响应有效负载实际上与服务器将发送的内容相匹配。但是，依然有许多有效方法可以解决这个问题：

### 2.1 提前生成固定数据

你可以让server提前生成所有的固定数据，这样一来，这些data就能真正反映服务端将会产生的数据了。

### 2.2 先不用存根写一个单独的端到端测试，然后用存根方法写剩下的(用例)

另一种更平衡的方法就是整合两种策略。 你可以拿一个单独的正常路径用例做完全真实的端到端测试。 它使用该功能真正的应用实现 - 包括通过真正的数据库设置数据和状态等。

一旦确定它是正常工作的了，你就可以使用存根来测试所有边缘情况和其他方案。 在绝大多数情况下使用真实数据没有任何好处。 我们建议绝大多数测试使用存根数据。 它们将快几个数量级，而且复杂程度要低得多。

{% note info '指南：网络请求' %}
请阅读我们的{% url '网络请求指南' network-requests %}，了解更多的如何通过分析和策略来达到以上目标。
{% endnote %}

## 3. 登录

你必须克服的第一个（也可称是最困难的）障碍之一是测试登录到你的应用程序。

没有什么比像登录更慢的测试套件，但应用程序的所有好部分很可能需要经过身份验证的用户！ 这里有一些技巧。

### 3.1 完全测试登录流程 - 但只有一次！

将你的注册和登录流程置于测试覆盖范围内是一个好主意，因为它对所有用户都非常重要，而且你永远不希望它破坏。

正如我们刚刚提到的，登录是**任务关键**的功能之一，应该可能涉及你的服务器。 我们建议你使用你的UI测试注册和登录，因为真实用户会！

以下是从数据库构造数据开始的示例：

```js
describe('The Login Page', function () {
  beforeEach(function () {
    // reset and seed the database prior to every test
    cy.exec('npm run db:reset && npm run db:seed')

    // seed a user in the DB that we can control from our tests
    // assuming it generates a random password for us
    cy.request('POST', '/test/seed/user', { username: 'jane.lane' })
      .its('body')
      .as('currentUser')
  })

  it('sets auth cookie when logging in via form submission', function () {
    // destructuring assignment of the this.currentUser object
    const { username, password } = this.currentUser

    cy.visit('/login')

    cy.get('input[name=username]').type(username)

    // {enter} causes the form to submit
    cy.get('input[name=password]').type(`${password}{enter}`)

    // we should be redirected to /dashboard
    cy.url().should('include', '/dashboard')

    // our auth cookie should be present
    cy.getCookie('your-session-cookie').should('exist')

    // UI should reflect this user being logged in
    cy.get('h1').should('contain', 'jane.lane')
  })
})
```

你可能还会继续测试你的登录界面的以下情况，比如：

- 非法的用户名/密码
- 用户名已存在
- 密码复杂度要求
- 边缘用例，比如用户锁定或已删除

以上每一种情况都要求进行全面的测试。

现在，当你的登录测试成功之后，你可能开始想：

> "...好的，漂亮! 让我们在每一个测试用例中重复这些登录过程吧！"

{% note danger '不! 千万别！' %}
不要用UI登录来测试每一个用例。
{% endnote %}

让我们来研究和展开一下原因。

### 3.2 绕过UI

当你为**非常具体**的功能编写测试时，你*应*使用你的UI进行测试。

但是，当你在测试系统的另一个模块时，而它依赖于之前功能的状态时：**不要使用你的UI设置此状态**。

这是一个更具说服力的例子：

想象一下，你正在测试**购物车**的功能。 要对此进行测试，你需要能够将商品添加到该购物车。 那么商品来自哪里？ 你是否应该使用UI登录管理区域，然后创建所有商品，包括其描述，类别和图像？ 完成后，你是否应该访问每个商品并将每个商品添加到购物车？

不，你不应该这样做。

{% note warning '警告' %}
不要用你的UI去构建状态。这是非常缓慢，繁琐和不必要的。

请阅读{% url '最佳实践' best-practices %}。
{% endnote %}

 **登录**与我们刚才描述的*完全相同的场景*。 登录只是在所有其他测试之前的先决状态条件。

因为Cypress不是Selenium，我们实际上可以在这里采取一个巨大的捷径，不需要使用UI而直接使用{% url `cy.request()` request %}。

因为{% url `cy.request()` request %}会自动获取并设置cookie，我们实际上可以使用它来构建状态而不使用浏览器的UI，但仍然可以使其完全像它来自浏览器一样！

让我们重温上面的例子，但假设我们正在测试系统的其他部分。

```js
describe('The Dashboard Page', function () {
  beforeEach(function () {
    // reset and seed the database prior to every test
    cy.exec('npm run db:reset && npm run db:seed')

    // seed a user in the DB that we can control from our tests
    // assuming it generates a random password for us
    cy.request('POST', '/test/seed/user', { username: 'jane.lane' })
      .its('body')
      .as('currentUser')
  })

  it('logs in programmatically without using the UI', function () {
    // destructuring assignment of the this.currentUser object
    const { username, password } = this.currentUser

    // programmatically log us in without needing the UI
    cy.request('POST', '/login', {
      username,
      password
    })

    // now that we're logged in, we can visit
    // any kind of restricted route!
    cy.visit('/dashboard')

    // our auth cookie should be present
    cy.getCookie('your-session-cookie').should('exist')

    // UI should reflect this user being logged in
    cy.get('h1').should('contain', 'jane.lane')
  })
})
```

你看得到差别吗？ 我们能够登录而无需实际使用我们的UI。 这节省了大量时间访问登录页面，填写用户名，密码，并等待服务器在*每次测试之前*(登录后)重定向。

因为我们以前在不使用任何捷径方式的情况下端到端地测试了登录系统，所以我们已经100％有信心它正常工作。

在处理系统的其他地方，那些需要设置状态的任何模块时，请使用上述方法。 请记住 - 不要使用你的用户界面！

{% note info '授权图谱' %}
某些登录可能比我们刚刚介绍的更复杂。

我们已经创建了几个包含其他方案的方法，例如处理CSRF令牌或测试基于XHR的登录表单。

请移步{% url '登录探索图谱' recipes %}查看。
{% endnote %}

# 正式开始

好了，该说的都说完了。现在起探究Cypress和开始测试你的应用吧！

以下有我们的更多的指南：

- {% url "视频教程" tutorials %} - 一步一步教的视频教程；
- {% url "Cypress API" table-of-contents %} - 可以学习Cypress有哪些可用的命令
- {% url "Cypress介绍" introduction-to-cypress %} - 解释了Cypress到底是如何工作的
- {% url '命令行' command-line %} - 介绍了如何在交互模式下运行你所有的测试
- {% url '持续集成' continuous-integration %} - 如何持续集成Cypress
