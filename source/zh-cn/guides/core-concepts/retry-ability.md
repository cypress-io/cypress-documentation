---
title: 重试机制
---

{% note info %}
# {% fa fa-graduation-cap %} 通过这篇文档你将会学习到

- Cypress如何重试命令和断言
- 命令在什么时候重试什么时候不重试
- 如何解决一些片状测试的情况
{% endnote %}

Cypress的核心功能时帮助测试动态Web应用程序，它具有重试机制。这就像汽车中的自动变速器一样，你通常感知不到它在工作。但是了解它的工作原理将有助于你用更少的运行时间来更快的编写测试。

# 命令和断言

在Cypress测试代码中可以调用两种类型的方法：**命令** 和 **断言**。例如，下面的测试代码中有6个命令和2个断言。

```javascript
it('creates 2 items', function () {
  cy.visit('/')                       // 命令
  cy.focused()                        // 命令
    .should('have.class', 'new-todo') // 断言
  cy.get('.new-todo')                 // 命令
    .type('todo A{enter}')            // 命令
    .type('todo B{enter}')            // 命令
  cy.get('.todo-list li')             // 命令
    .should('have.length', 2)         // 断言
})
```

{% url "命令日志" test-runner#Command-Log %} 会显示命令和断言，测试通过的断言会显示为绿色。

{% imgTag /img/guides/retry-ability/commands-assertions.png "ommands and assertions" %}

让我们看看最后一个命令和断言：

```javascript
cy.get('.todo-list li')     // command
  .should('have.length', 2) // assertion
```

因为现代Web应用程序中没有任何内容是同步的，所以Cypress不能在所有DOM元素里面去查找`todo-list`，并检查它们是否只有2个。有很多例子说明为什么这种方法效果不好。

- 如果应用程序在这些命令运行时没有更新DOM，我们该怎么办？
- 如果应用程序在填充DOM元素之前等待其后端响应，我们该怎么办？
- 如果应用程序在DOM显示之前进行了一些密集的计算，我们该怎么办？

因此，Cypress的 {% url `cy.get` get %} 命令必须更加智能，并期望应用程序可能会更新DOM。`cy.get()` 查询应用程序的DOM结构，找到与之匹配的元素，然后执行它的断言（在我们的例子中是：`should('have.length', 2)`）。

- ✅ 如果 `cy.get()` 命令后面的断言通过，则命令成功完成。
- 🚨 如果 `cy.get()` 命令后面的断言失败，那么 `cy.get()` 命令将再次重新查询应用程序的DOM结构。然后Cypress将再次尝试对来自`cy.get()`的元素进行断言。如果断言仍然失败，`cy.get()`将尝试再次重新查询DOM结构，以此类推，直到`cy.get()`命令超时。

重试能力允许测试在断言通过后立即完成每个命令，而无需硬编码等待。如果你的应用程序需要几毫秒甚至几秒来渲染每个DOM元素 - 这没什么大不了的，测试程序根本不需要改变。例如：在下面的示例中，我们引入3秒的人为延迟用于刷新我们的应用程序UI：

```javascript
app.TodoModel.prototype.addTodo = function (title) {
  this.todos = this.todos.concat({
    id: Utils.uuid(),
    title: title,
    completed: false
  })

  // let's trigger the UI to render after 3 seconds
  setTimeout(() => {
    this.inform()
  }, 3000)
}
```

我的测试仍然能通过！最后的 `cy.get('.todo-list')` 和断言 `should('have.length', 2)`清晰的显示了旋转等待图标，这意味着Cypress正在重新查询它们。

{% imgTag /img/guides/retry-ability/retry-2-items.gif "Retrying finding 2 items" %}

在DOM更新后的几毫秒内，`cy.get()` 找到了两个元素并且 `should('have.length', 2)` 断言通过。

# 多个断言

单个命令后跟着多个断言在重试的时候将按照顺序挨个尝试。因此，当第一个断言通过，将使用第一个和第二个断言重试该命令。当第一个和第二个断言通过时，将使用第一个、第二个和第三个断言重试该命令，以此类推。

例如：下面的测试有 {% url `.should()` should %} 和 {% url `.and()` and %} 断言。 `.and()`是`.should()`的别名命令，所以第二个断言实际上是{% url `.should(cb)` should#Function %}函数形式的自定义回调断言，这其中又包含2个 {% url `expect` assertions#BDD-Assertions %} 断言。

```javascript
cy.get('.todo-list li')     // command
  .should('have.length', 2) // assertion
  .and(($li) => {
    // 2 more assertions
    expect($li.get(0).textContent, 'first item').to.equal('todo a')
    expect($li.get(1).textContent, 'second item').to.equal('todo B')
  })
```

因为第二个断言 `expect($li.get(0).textContent, 'first item').to.equal('todo a')` 失败，所以永远不会到达第三个断言。超时后命令失败，命令日志正确的显示了第一个遇到的断言`should('have.length', 2)`通过了，但是第二个断言和命令本身是失败的。

{% imgTag /img/guides/retry-ability/second-assertion-fails.gif "Retrying multiple assertions" %}

# 不是每个命令都被重试

Cypress只重试查询DOM结构的命令：{% url `cy.get()` get %}， {% url `.find()` find %}， {% url `.contains()` contains %}等等。你可以通过查看API文档中的"断言"部分来检查特定的命令是否会重试。例如：{% url `.first()` first %}的"断言部分"告诉我们这个命令会一直重试直到所有的断言都通过。

{% assertions existence .first %}

## 为什么有些命令*不*重试？

当命令可能会更改被测试应用程序的状态时，不会重试命令。例如：Cypress不会重试 {% url '.click()' click %} 命令，因为它可能会改变应用程序中的某些内容。

{% note warning %}
在很小的概率下你可能想重试`.click()`这样的命令。我们描述了一个案例，事件监听器需要在窗口弹出后一段时间才会生效，这样导致`.click()`命令无法按照预期来执行。在这种特殊情况下，你可能希望"不断点击"直到点击事件被注册，点击后对话框消失。更多详细信息可以参考我们的博客：{% url "在测试中什么时候可以点击？" https://www.cypress.io/blog/2019/01/22/when-can-the-test-click/ %}。
{% endnote %}

# 内置断言

通常，Cypress的命令都有内置断言，这些断言将导致命令被重试。例如：即使没有任何附加的断言，{% url `.eq()` eq %}命令也会重试，直到它在之前产生的元素列表中找到给定索引的元素。

```javascript
cy.get('.todo-list li')     // command
  .should('have.length', 2) // assertion
  .eq(3)                    // command
```

{% imgTag /img/guides/retry-ability/eq.gif "Retrying built-in assertion" %}

一些无法重试的命令仍然具有内置的_等待_。例如：正如"断言"部分所描述的那样，{% url "`.click()`" click %}会等待点击，直到该元素变为{% url "可操作" interacting-with-elements#Actionability %}。

Cypress尝试像人类用户那样使用浏览器。

- 用户可以点击该元素吗？
- 元素时不可见的吗？
- 元素是否在另一个元素后面？
- 元素是否具有`disabled`属性？

`.click()`命令将自动等待，直到多个内置的断言检查通过，然后它将尝试单击一次。

# 超时

默认情况下，每个重试的命令最多持续4秒 - 通过 {% url `defaultCommandTimeout` configuration#Timeouts %} 来配置。 你可以通过 _所有的_ 方式来修改这个配置选项，例如配置文件，命令行参数，环境变量或者通过代码来修改。

例如，要通过命令行将默认命令超时设置为10秒：

```shell
cypress run --config defaultCommandTimeout=10000
```

有关覆盖此选项的其它示例，请参考 {% url 'Configuration: Overriding Options' configuration#Overriding-Options %}。我们不建议修改全局的超时配置。相反的，你应该将 `{ timeout: ms }` 参数传递给函数用于重试不同的时间。例如：

```javascript
// we've modified the timeout which affects default + added assertions
cy.get('.mobile-nav', { timeout: 10000 })
  .should('be.visible')
  .and('contain', 'Home')
```

Cypress将重试最多10秒，以找到包含"Home"文本的 `mobile-nav` 类的可见元素。有关更多的示例，请参考"Cypress简介"中的{% url 'Timeouts' introduction-to-cypress#Timeouts %}部分。

# 只有最后一个命令会被重试

这是一个简短的测试，它展示了一部分情况。

```javascript
it('adds two items', function () {
  cy.visit('/')

  cy.get('.new-todo').type('todo A{enter}')
  cy.get('.todo-list li')
    .find('label')
    .should('contain', 'todo A')

  cy.get('.new-todo').type('todo B{enter}')
  cy.get('.todo-list li')
    .find('label')
    .should('contain', 'todo B')
})
```

这个测试毫无疑问的在Cypress上通过。

{% imgTag /img/guides/retry-ability/adds-two-items-passes.gif "Test passes" %}

但有时候测试会失败 - 通常本地不会测试失败 - 它几乎总是在我们的持续集成服务器上失败。当测试失败时，录制的视频和屏幕截图没有显示任何明显的问题！这是测试失败的视频：

{% imgTag /img/guides/retry-ability/adds-two-items-fails.gif "Test fails" %}

问题看起来很奇怪 - 我可以清楚的看到列表中出现的标签"todo B"，那么为什么Cypress找不到它？这到底是怎么回事？

还记得我们在应用程序代码中引入的延迟导致测试超时吗？在UI重新呈现之前，我们添加了100ms的延迟。

```javascript
app.TodoModel.prototype.addTodo = function (title) {
  this.todos = this.todos.concat({
    id: Utils.uuid(),
    title: title,
    completed: false
  })
  setTimeout(() => {
    this.inform()
  }, 100)
}
```

当应用程序在我们的CI服务器上运行时，这个延迟就可能是我们测试失败的原因。 下面我们一起来寻找下问题的根源。在命令日志中，将鼠标悬停在每个命令上来查看Cypress在每个步骤中找到的元素。

在失败的测试中，确实找到了第一个标签：

{% imgTag /img/guides/retry-ability/first-item-label.png "First item label" %}

将鼠标悬停在第二个"FIND label"命令上 - 这里出了一点问题。它找到了 _第一个标签_，然后继续重新查找文本"todo B"，但是第一项仍然是"todo A"。

{% imgTag /img/guides/retry-ability/second-item-label.png "Second item label" %}

嗯，这确实很奇怪，为什么Cypress只看 _第一个_ 元素？让我们将鼠标悬停在"GET .todo-list li"命令上看看它 _找到了什么_ 。 哦，有趣的是 - 在那一刻只有一个元素。

{% imgTag /img/guides/retry-ability/second-get-li.png "Second get li" %}

在测试期间，`cy.get('.todo-list li')` 命令很快的找到了渲染的 `<li>` 元素 - 这是第一个也是唯一的一个"todo A"元素。我们的程序在等待了100ms后才把"todo B"元素附加到列表上。 当第二个元素被添加时，Cypress已经"完成了元素的查找"，它只使用第一个`<li>`元素。它只在第一个`<li>`元素中搜索`<label>`，完全忽略了新创建的第二个项目。

为了确认这一点，让我们删除延迟代码，看看在测试通过的例子中发生了什么。

{% imgTag /img/guides/retry-ability/two-items.png "Two items" %}

当应用程序没有延迟时，它会在Cypress命令`cy.get('.todo-list li')`运行之前将元素放入DOM中。`cy.get()`将会返回2个元素，`.find()` 命令将会找到正确的标签。非常棒。

既然我们已经理解了上面那个测试背后的真正原因，那我们需要考虑为什么默认的重试机制在这种情况下没有帮助我们。为什么Cypress不能发现后来添加的第二个`<li>`元素？

出于各种实现原因，Cypress命令 **仅** 重试断言之前的 **最后一个命令**。在我们的测试中：

```javascript
cy.get('.new-todo').type('todo B{enter}')
cy.get('.todo-list li')         // queries immediately, finds 1 <li>
  .find('label')                // retried, retried, retried with 1 <li>
  .should('contain', 'todo B')  // never succeeds with only 1st <li>
```

幸运的是，一旦我们了解了重试机制是如何工作以及最后一个命令如何用于断言重试，我们就可以很好的修复这个测试。

## 合并查询

我们建议的第一个解决方案是避免不必要的拆分查询元素的命令。在我们的例子中，我们首先使用`cy.get()`查询元素，然后使用`.find()`从该元素列表中查询。我们可以将两个单独的查询合并为一个 -  强制重试组合查询。

```javascript
it('adds two items', function () {
  cy.visit('/')

  cy.get('.new-todo').type('todo A{enter}')
  cy.get('.todo-list li label')   // 1 query command
    .should('contain', 'todo A')  // assertion

  cy.get('.new-todo').type('todo B{enter}')
  cy.get('.todo-list li label')   // 1 query command
    .should('contain', 'todo B')  // assertion
})
```

为了显示重试次数，我将应用程序的人工延迟增加到500ms。现在测试总是通过， 因为重试了整个选择器。当第二个"todo B"元素添加到DOM时，它会找到包含2个元素的列表。

{% imgTag /img/guides/retry-ability/combined-selectors.gif "Combined selector" %}

类似的，当使用{% url `.its()` its %} 命令处理深度嵌套的JavaScript属性时，尽量不要将它分割为多个调用。相反的，使用`.`分隔符将属性名称组合成一个调用：

```javascript
// 🛑 不推荐
// 只有最后一个`its`会被重试
cy.window()
  .its('app')             // 运行一次
  .its('model')           // 运行一次
  .its('todos')           // 重试
  .should('have.length', 2)

// ✅ 推荐
cy.window()
  .its('app.model.todos') // 重试
  .should('have.length', 2)
```

有关完整示例，请参考{% url 'Set flag to start tests' https://glebbahmutov.com/blog/set-flag-to-start-tests/ %} 的博客。

## 交替使用命令和断言

这里还有另外一种方式来修复上面的测试。无论写多长的测试，我们都建议交替使用命令和断言。在这种情况下，我将在`cy.get()`命令之后，`.find()`命令之前添加一个断言。

```javascript
it('adds two items', function () {
  cy.visit('/')

  cy.get('.new-todo').type('todo A{enter}')
  cy.get('.todo-list li')         // command
    .should('have.length', 1)     // assertion
    .find('label')                // command
    .should('contain', 'todo A')  // assertion

  cy.get('.new-todo').type('todo B{enter}')
  cy.get('.todo-list li')         // command
    .should('have.length', 2)     // assertion
    .find('label')                // command
    .should('contain', 'todo B')  // assertion
})
```

{% imgTag /img/guides/retry-ability/alternating.png "Passing test" %}

测试通过了，因为第二个 `cy.get('.todo-list li')` 被自己的断言`.should('have.length', 2)`重试了。只有在成功找到2个 `<li>` 元素，`.find('label')`命令和对应的断言才开始，到现在为止，它能够正确查询了带有正确"todo B"标签的元素。

# 其它参考

- 你可以为自己的 {% url "custom commands" custom-commands %}添加重试功能，可以参考 {% url 'this pull request to cypress-xpath' https://github.com/cypress-io/cypress-xpath/pull/12/files %}。
- 你可以使用这个第三方插件来重试附加了断言的任何功能：{% url cypress-pipe https://github.com/NicholasBoll/cypress-pipe %}。
- 请参考{% url "Cypress should callback" https://glebbahmutov.com/blog/cypress-should-callback/ %} 中的重试机制示例。
