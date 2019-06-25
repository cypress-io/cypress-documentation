---
title: 变量和别名
---

{% note info %}
# {% fa fa-graduation-cap %} 你将会学习到什么

- 如何处理异步命令
- 别名是什么以及它们如何简化你的代码
- 为什么你很少需要在Cypress中使用变量
- 如何对对象，元素和路由使用别名
{% endnote %}

# 返回值

Cypress的新用户最初可能会发现使用我们的异步API具有一定的挑战性。

{% note success '不用担心！' %}
有许多简单易用的方法可以用于引用，比较和利用Cypress产生的对象。

一旦你掌握了异步代码，你就会发现你可以做所有同步操作所做的事情，而这不需要你的代码做任何的兼容。

这篇指南探讨了编写优秀Cypress代码的许多常见模式，这些代码甚至可以处理最复杂的情况。
{% endnote %}

异步API保留在JavaScript中。它们在现代代码中随处可见。事实上，大多数新的浏览器API都是异步的，许多核心节点模块也是异步的。

下面我们将探讨的模式在Cypress内外都很有用。

你应该认识到的第一个也是最重要的概念是...

{% note danger '返回值' %}
**你不能分配或使用任何Cypress命令的返回值** 。命令将会放入队列中并异步执行。
{% endnote %}

```js
// ...这样是不行的...

// nope
const button = cy.get('button')

// nope
const form = cy.get('form')

// nope
button.click()
```

## 闭包

要想访问每个Cypress命令返回的内容，请使用 {% url `.then()` then %}。

```js
cy.get('button').then(($btn) => {
  // $btn is the object that the previous
  // command yielded us
})
```

如果你熟悉 {% url 'native Promises' https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises %}，Cypress的 `.then()`和它是同样的工作方式。你可以继续在 `.then()` 中嵌套更多Cypress命令。

每个嵌套命令都可以访问之前命令中完成的工作。最终的可读性非常好。

```js
cy.get('button').then(($btn) => {

  // 保存按钮的文本
  const txt = $btn.text()

  // 提交表单
  cy.get('form').submit()

  // 比较两个按钮的文字
  // 并确保它们不一样
  cy.get('button').should(($btn2) => {
    expect($btn2.text()).not.to.eq(txt)
  })
})

// 这些命令在所有命令之后运行
// 其它之前的命令已经完成
cy.get(...).find(...).should(...)
```

在所有嵌套命令完成之前， `.then()` 以外的命令不会运行。

{% note info %}
通过使用回调函数，我们创建了一个{% url 闭包 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures %}。闭包使我们能够保留引用，用于引用之前命令中完成的工作。
{% endnote %}

## 调试

在`.then()` 函数中使用 {% url `debugger` https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger %}是很好的机会。这可以帮助你了解命令的执行顺序。这也让你可以检查Cypress在每个命令中产生的对象的内容。

```js
cy.get('button').then(($btn) => {
  // 检查 $btn <object>
  debugger

  cy.get('#countries').select('USA').then(($select) => {
    // 检查 $select <object>
    debugger

    cy.url().should((url) => {
      // 检查 the url <string>
      debugger

      $btn    // 仍然可以使用
      $select // 仍然可以使用
    })
  })
})

```

## 变量

通常在Cypress中你几乎不需要使用 `const`， `let` 或 `var`。通过闭包，你始终可以访问Cypress为你提供的对象。

此规则的一个例外是当你处理可变对象（更改状态）时。当事物改变状态时，你经常想要将对象的旧值与下一个值进行比较。

下面是使用`const`的一个很好的例子。

```html
<button>increment</button>

you clicked button <span id='num'>0</span> times
```

```js
// app code
let count = 0

$('button').on('click', function () {
  $('#num').text(count += 1)
})
```

```js
// cypress test code
cy.get('#num').then(($span) => {
  // 记录当前的数字
  const num1 = parseFloat($span.text())

  cy.get('button').click().then(() => {
    // 再次记录它
    const num2 = parseFloat($span.text())

    // 确保它符合我们的预期
    expect(num2).to.eq(num1 + 1)
  })
})
```

使用 `const` 的原因是因为 `$span` 对象是可变的。每当你有可变对象并且你想要比较它们时，你需要存储它们的值。使用`const`是一种完美的方式。

# 别名

使用 `.then()` 回调函数来访问以前的命令值是很棒的，但是当你在`before` 或 `beforeEach`等钩子中运行代码时会发生什么？

```js
beforeEach(function () {
  cy.button().then(($btn) => {
    const text = $btn.text()
  })
})

it('does not have access to text', function () {
  // 我们如何获取文本 ?!?!
})
```

我们如何才能访问`text`？

我们可以让我们的代码使用 `let` 进行一些丑陋的中转来访问它。

{% note danger '不要这样做' %}
以下代码仅供演示
{% endnote %}

```js
describe('a suite', function () {
  // 这里将会给‘text’创建一个闭包
  // 所以我们可以访问它
  let text

  beforeEach(function () {
    cy.button().then(($btn) => {
      // 重新定义text的引用
      text = $btn.text()
    })
  })

  it('does have access to text', function () {
    // 现在text可以使用了
    // 但是这不是一个很好的解决方式 :(
    text
  })
})
```

幸运的是，你不需要这样做。Cypress可以轻松应对这些情况。

{% note success '介绍名别' %}
别名是Cypress的一个强大构造器，它有很多用途。我们将在下面探讨它们的每个功能。

首先，我们将通过别名轻松的在钩子和测试代码之间共享对象。
{% endnote %}

## 共享上下文

共享上下文是使用别名的最简单的功能。

要为你想要共享的内容添加别名，请使用 {% url `.as()` as %} 命令。

让我们看看在上面的例子中怎么使用别名。

```js
beforeEach(function () {
  // 对 $btn.text() 取个别名叫 'text'
  cy.get('button').invoke('text').as('text')
})

it('has access to text', function () {
  this.text // 现在可以直接使用
})
```

在引擎的支持下，别名基础对象和基元使用Mocha的{% url `context` https://github.com/mochajs/mocha/wiki/Shared-Behaviours %} 对象: 也就是说，别名可以作为 `this.*`来使用。

Mocha会在每个测试的所有适用的挂钩中自动为我们共享上下文。此外，每次测试后都会自动清理这些别名和属性。

```js
describe('parent', function () {
  beforeEach(function () {
    cy.wrap('one').as('a')
  })

  context('child', function () {
    beforeEach(function () {
      cy.wrap('two').as('b')
    })

    describe('grandchild', function () {
      beforeEach(function () {
        cy.wrap('three').as('c')
      })

      it('can access all aliases as properties', function () {
        expect(this.a).to.eq('one')   // true
        expect(this.b).to.eq('two')   // true
        expect(this.c).to.eq('three') // true
      })
    })
  })
})
```

### 访问 Fixtures:

共享上下文最常用的例子是处理 {% url `cy.fixture()` fixture %}时。

通常，你可以通过 `beforeEach`来加载fixture，但是想要在测试中使用这些值。

```js
beforeEach(function () {
  // 对用户的fixtures取个别名
  cy.fixture('users.json').as('users')
})

it('utilize users in some way', function () {
  // 访问users的属性
  const user = this.users[0]

  // 确保header中包含第一个用户名字
  cy.get('header').should('contain', user.name)
})
```

{% note danger '小心异步命令' %}
不要忘记 **Cypress命令是异步的**!

在`.as()`命令运行之前，不能使用 `this.*` 引用。
{% endnote %}

```js
it('is not using aliases correctly', function () {
  cy.fixture('users.json').as('users')

  // 这样不行
  //
  // this.users是没有定义的
  // 因为‘as’命令只是放到队列中
  // 它还没有真正运行
  const user = this.users[0]
})
```

我们在适用于这种情况之前多次引入了相同的原则。如果要访问命令产生的内容，则必须使用 {% url `.then()` then %}在闭包中执行此操作。

```js
// 一切都好
cy.fixture('users.json').then((users) => {
  // 现在我们可以完全避免使用别名
  // 并且只使用回调函数
  const user = users[0]

  // 通过
  cy.get('header').should('contain', user.name)
})
```

### 避免使用`this`

{% note warning '箭头功能' %}
如果你使用{% url '箭头功能' https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions %}在你的测试或者钩子中，那么你通过`this.*`来访问别名的属性是不可以的。

这就是为什么我们所有的例子都是使用常规的 `function () {}` 语法而不是lambda的箭头语法`() => {}`。
{% endnote %}


为了避免使用 `this.*` 语法，还有另一种方法来访问别名。

在{% url `cy.get()` get %} 命令中能够使用`@`字符访问具有特殊语法的别名：

```js
beforeEach(function () {
  // 给users fixtures取个别名
  cy.fixture('users.json').as('users')
})

it('utilize users in some way', function () {
  // 使用特殊的 '@' 语法来访问别名
  // 这样避免使用 'this'
  cy.get('@users').then((users) => {
    // access the users argument
    const user = users[0]

    // 确保header中包含第一个用户名字
    cy.get('header').should('contain', user.name)
  })
})
```

通过使用{% url `cy.get()` get %}，我们避免使用`this`。

请记住，两种方法都有不同的场景，因为他们具有不同的人体工程学。

当使用 `this.users`时，我们可以同步访问它，而当使用 `cy.get('@users')` 时，它就变成了异步命令。

你可以将 `cy.get('@users')` 视为与 {% url `cy.wrap(this.users)` wrap  %}做了同样的事情。

## 元素

与DOM元素一起使用时，别名具有其它特殊特征。

在对DOM元素使用别名后，你可以稍后访问它们以供重用。

```javascript
// 将所有找到的tr取个别名叫'rows'
cy.get('table').find('tr').as('rows')
```

在内部，Cypress已经引用了作为别名“rows”返回的 `<tr>` 集合。要在以后引用这些相同的“rows”。你可以使用 {% url `cy.get()` get %} 命令。

```javascript
// Cypress 返回 <tr> 的引用
// 它允许我们继续链接命令
// 来找到第1行
cy.get('@rows').first().click()
```

因为我们在{% url `cy.get()` get %}中使用了`@`字符，而不是查询DOM元素， {% url `cy.get()` get %} 寻找现有的别名为 `rows`的并返回引用（如果找到它）。

### 旧元素：

在很多单页面JavaScript应用程序中，DOM不断地重新刷新应用程序的各个部分。如果你通过{% url `cy.get()` get %}来获取别名中的元素，但是这时DOM中的元素已经被删除了，那么Cypress将会重新查询DOM来再次查找这些元素。

```html
<ul id="todos">
  <li>
    Walk the dog
    <button class="edit">edit</button>
  </li>
  <li>
    Feed the cat
    <button class="edit">edit</button>
  </li>
</ul>
```

让我们假设当我们单击 `.edit` 按钮时，我们的 `<li>` 在DOM中重新渲染。它不是显示编辑按钮，而是显示一个 `<input />` 文本字段，文本可以编辑。之前的 `<li>` 已经 *完全* 的从DOM中删除了，并且在它的位置呈现了一个新的 `<li>` 。

```javascript
cy.get('#todos li').first().as('firstTodo')
cy.get('@firstTodo').find('.edit').click()
cy.get('@firstTodo').should('have.class', 'editing')
  .find('input').type('Clean the kitchen')
```

当我们引用 `@firstTodo`时，Cypress检查它所引用的所有元素是否仍在DOM中。如果是，则返回那些现有的元素。如果不是，Cypress将重新执行导致别名定义的命令。

在我们的例子中，它将重新发出命令：`cy.get('#todos li').first()`。一切正常因为找到了新的 `<li>` 。

{% note warning  %}
*通常*，重放以前的命令将返回你期望的值，但有时候并非总是如此。建议你在可以的时候**尽快取个别名**，而不是进一步通过命令链来命名。

- `cy.get('#nav header .user').as('user')` {% fa fa-check-circle green %} (good)
- `cy.get('#nav').find('header').find('.user').as('user')` {% fa fa-warning red %} (bad)

如果有疑问，你可以*始终*通过常规的 {% url `cy.get()` get %} 来再次查询元素。
{% endnote %}

## 路由

别名也可以和 {% url 路由 route %}一起使用。对路由使用别名可以做到以下几点：

- 确保你的应用程序提出预期的请求
- 等待服务器发送响应
- 访问实际的XHR对象来进行断言

{% imgTag /img/guides/aliasing-routes.jpg "Alias commands" %}

这是一个对路由取个别名并等待它完成的示例。

```js
cy.server()
cy.route('POST', '/users', { id: 123 }).as('postUser')

cy.get('form').submit()

cy.wait('@postUser').its('requestBody').should('have.property', 'name', 'Brian')

cy.contains('Successfully created user: Brian')
```

{% note info '初次使用Cypress？' %}
{% url '我们有关于网络请求更加详细和全面的指南。' network-requests %}
{% endnote %}

## 请求

别名同样可以在{% url requests request %} 中使用。

下面是给请求取个别名并在后面访问其属性的例子。

```js
cy.request('https://jsonplaceholder.cypress.io/comments').as('comments')

// 在这里有其它的测试代码

cy.get('@comments').should((response) => {
  if (response.status === 200) {
      expect(response).to.have.property('duration')
    } else {
      // 在这里你可以做任何你想做的判断
    }
  })
})
```
