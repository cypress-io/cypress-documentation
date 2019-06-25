---
title: 桩、间谍和时钟
---

{% note info %}
# {% fa fa-graduation-cap %} 你将会学习到什么


- Cypress包含哪些库来提供典型的测试方法
- 如何使用桩来断言调用了代码，但又阻止代码运行
- 如何使用间谍在不干扰代码执行的情况下断言代码被调用
- 如何控制确定性测试代码的时间也就是时间依赖
- Cypress如何改进和扩展所包含的库
{% endnote %}

# 功能

Cypress内嵌使用{% url `cy.stub()` stub %}、{% url `cy.spy()` spy %}进行打桩和监视的能力或使用{% url `cy.clock()` clock %}修改应用程序的时间-这允许您操作`Date`、`setTimeout`、`setInterval`等。

当写**单元测试**和**集成测试**时，这些命令非常有用。

# 库和工具

Cypress自动捆绑和包装这些库：

| 名称 | 作用 |
| --- | ---- |
| {% url "`sinon`" http://sinonjs.org %} | 提供{% url `cy.stub()` stub %}和{% url `cy.spy()` spy %}的API |
| {% url "`lolex`" https://github.com/sinonjs/lolex %} | 提供{% url `cy.clock()` clock %}和{% url `cy.tick()` tick %}的API |
| {% url "`sinon-chai`" https://github.com/domenic/sinon-chai %} | 添加`chai`断言给桩和间谍 |

您可以参考这些库的各个文档来查看更多示例和说明。

# 常见的场景

{% note info 示例测试！ %}
{% url '查看我们的示例方法测试间谍、桩和时间' recipes#Stubbing-window-fetch %}
{% endnote %}

## 桩

桩是一种修改函数并将它的行为控制权委托给您（程序员）的方法。

桩是非常常见的单元测试，但在某些集成/端到端测试中仍然有用。

```javascript
// 创建一个单独的桩（通常用于单元测试）
cy.stub()

// 用一个桩函数代替obj.method()
cy.stub(obj, 'method')

// 强制obj.method()返回"foo"
cy.stub(obj, 'method').returns('foo')

// 当调用"bar"参数时，强制obj.method()返回"foo"
cy.stub(obj, 'method').withArgs('bar').returns('foo')

// 强制obj.method()返回一个解析为"foo"的promise
cy.stub(obj, 'method').resolves('foo')

// 强制obj.method()返回被拒绝带有错误的promise
cy.stub(obj, 'method').rejects(new Error('foo'))
```

当一个函数有您想要控制的副作用时，您通常会打桩函数。

***场见的场景：***

- 您有一个接收回调并希望调用回调的函数。
- 函数返回一个`Promise`，您希望自动解析或拒绝它。
- 您有一个包装`window.location`且不希望您的应用程序被导航的函数。
- 您试图通过强制某些东西失败来测试应用程序的“失败路径”。
- 您试图通过强制某些东西成功来测试应用程序的“适当路径”。
- 您试图“欺骗”应用程序，使其认为已登录或已退出。
- 您正在使用`oauth`并希望打桩登录方法。

{% note info cy.stub() %}
{% url '阅读更多关于如何使用`cy.stub()`的信息' stub %}
{% endnote %}

## 间谍

间谍使您能够监视一个函数，让您可以捕捉然后断言被调用函数带有正确的参数，或者函数被调用一定次数，甚至返回值是什么或被调用的函数的上下文是什么。

间谍**不**修改函数的行为-它原封不动。当您测试多函数之间的契约时，间谍是最有用的，您不用关心实际函数可能产生的副作用（如果有的话）。

```javascript
cy.spy(obj, 'method')
```

{% note info cy.spy() %}
{% url '阅读更多关于如何使用间谍`cy.spy()`' spy %}
{% endnote %}

## 时钟

在某些情况下，控制应用程序的`date`和`time`以便覆盖应用程序的行为或避免缓慢的测试是非常有用的。

{% url `cy.clock()` clock %} 给您能力来控制：

- `Date`
- `setTimeout`
- `setInterval`

***常见的场景***

- 您用`setInterval`轮询应用程序中的某些东西并想要控制它。
- 您已经**节流**或**防抖**了要控制的函数。

一旦您启用了{% url `cy.clock()` clock %}您就可以通过**tick**以毫秒来控制时间。

```javascript
cy.clock()
cy.visit('http://localhost:3333')
cy.get('#search').type('foobarbaz')
cy.tick(1000)
```

{% url `cy.clock()` clock %}很特殊，它可以在访问您的应用程序**之前**被调用，在下次访问时，我们将自动绑定它到应用程序。我们在应用程序被调用的任何计时器“之前”绑定。这个工作原理与{% url `cy.server()` server %} + {% url `cy.route()` route %}相同。

## 断言

一旦有`桩`或`间谍`在手，您就可以创建关于它们的断言。

```javascript
const user = {
  getName: (arg) => {
    return arg
  },

  updateEmail: (arg) => {
    return arg
  },

  fail: () => {
    throw new Error('fail whale')
  }
}

// 强制user.getName()返回"Jane"
cy.stub(user, 'getName').returns('Jane Lane')

// 监视updateEmail但是不改变它的行为
cy.spy(user, 'updateEmail')

// 监视fail但不改变它的行为
cy.spy(user, 'fail')

// 调用getName
const name  = user.getName(123)

// 调用updateEmail
const email = user.updateEmail('jane@devs.com')

try {
  // 调用fail
  user.fail()
} catch (e) {

}

expect(name).to.eq('Jane Lane')                            // 结果为真
expect(user.getName).to.be.calledOnce                      // 结果为真
expect(user.getName).not.to.be.calledTwice                 // 结果为真
expect(user.getName).to.be.calledWith(123)
expect(user.getName).to.be.calledWithExactly(123)          // 结果为真
expect(user.getName).to.be.calledOn(user)                  // 结果为真

expect(email).to.eq('jane@devs.com')                       // 结果为真
expect(user.updateEmail).to.be.calledWith('jane@devs.com') // 结果为真
expect(user.updateEmail).to.have.returned('jane@devs.com') // 结果为真

expect(user.fail).to.have.thrown('Error')                  // 结果为真
```

# 集成和扩展

除了将这些工具集成在一起，我们还扩展和改进了这些工具的协作。

***一些例子：***

- 我们将Sinon's的参数stringifier替换为一个低噪音、高性能的自定义版本。
- 我们改进了`sinon-chai`断言输出，方法是更改通过与失败测试期间显示的内容。
- 我们在`桩`和`间谍`API中添加了别名支持。
- 我们在测试之间自动还原和删除`桩`、`间谍`和`时钟`。

我们也将所有这些API直接集成到命令日志中，所以您可以直观地看到应用程序中发生了什么。

***我们直观地指出：***

- 调用`桩`
- 调用`间谍`
- 调用`时钟`

当您使用带有{% url `.as()` as %}命令的别名时，我们还将这些别名与调用关联起来。这与别名{% url `cy.route()` route %}的工作原理相同。

当通过调用方法`.withArgs(...)`创建桩时，我们可以将它们可视化地链接在一起。

当您点击桩或间谍时，我们也会输出**非常**有用的调试信息。

***例如，我们自动显示：***

- 调用计数（和总调用数）
- 参数，不转变它们（它们是实际的参数）
- 函数返回值
- 函数调用的上下文

# 另请参阅

- [“端到端测试中的打桩导航API”](https://glebbahmutov.com/blog/stub-navigator-api/)
- [“通过APP操作和效果减少不可测试代码”](https://www.cypress.io/blog/2019/02/28/shrink-the-untestable-code-with-app-actions-and-effects/)
