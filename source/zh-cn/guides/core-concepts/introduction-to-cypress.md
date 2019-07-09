---
title: Cypress简介
---

{% note info %}

# {% fa fa-graduation-cap %} 通过这篇文档你将会学习到


- Cypress如何查询DOM
- Cypress如何管理主题及命令链
- 断言是什么样的及它是如何工作的
- 超时如何应用于命令
{% endnote %}

{% note success 重要说明! %}

这是了解关于如何使用Cypress进行测试的重要指南。阅读它,理解它。同时提出相关问题,以便我们改进它。
完成后,我们建议你观看我们的相关 {% fa fa-video-camera %} {% url "教学视频" tutorials %}。

{% endnote %}

# Cypress是简单的
简单的意思是用更少的输入完成更多的操作。让我们来看一个例子:


```js
describe('Post Resource', function() {
  it('Creating a New Post', function() {
    cy.visit('/posts/new')     // 1.

    cy.get('input.post-title') // 2.
      .type('My First Post')   // 3.

    cy.get('input.post-body')  // 4.
      .type('Hello, world!')   // 5.

    cy.contains('Submit')      // 6.
      .click()                 // 7.

    cy.url()                   // 8.
      .should('include', '/posts/my-first-post')

    cy.get('h1')               // 9.
      .should('contain', 'My First Post')
  })
})
```

你能读懂这个吗？如果你能，它可能听起来像这样:

> 1. 访问 `/posts/new` 页面.
> 2. 找到类为 `post-title` 的输入框.
> 3. 输入"My First Post".
> 4. 找到类为 `post-body` 的输入框.
> 5. 输入"Hello, world!".
> 6. 找到含有 `Submit` 文本的元素.
> 7. 点击.
> 8. 获取浏览器地址，确保地址里含有 `/posts/my-first-post`.
> 9. 找到 `h1` 标签, 确保内容里含有"My First Post".


这是一个相对简单，直接的测试，但要考虑它在客户端和服务器上覆盖了多少代码！
对于本指南的其余部分，我们将一起探索Cypress使上述示例运行的基础知识。我们将带你揭开Cypress的神秘面纱，这样你就可以高效地测试你的应用程序，使其尽可能像用户真实操作一样，并讨论如何在有用时采用快捷方式。

# 查询元素

## Cypress很像jQuery

如果你之前使用过 {% url 'jQuery' https://jquery.com/ %} , 你可能习惯于这样查询元素:

```js
$('.my-selector')
```

在Cypress,查询元素的方式是相同的:

```js
cy.get('.my-selector')
```

事实上,Cypress {% url '捆绑了jQuery' bundled-tools#Other-Library-Utilities %}并向你公开其许多DOM遍历方法，以便你可以轻松使用你已熟悉的API来处理复杂的HTML结构。


```js
// 每个方法都等同于它的jQuery对应方法。用你所知道的！
cy.get('#main-content')
  .find('.article')
  .children('img[src^="/static"]')
  .first()
```

{% note success 核心概念 %}
Cypress利用jQuery强大的选择器引擎帮助现代Web开发人员熟悉和查找元素。

对选择元素的最佳实践感兴趣？ {% url '阅读这里' best-practices#Selecting-Elements %}.
{% endnote %}

但是，它们查询返回DOM元素的工作方式不同：

```js
// 很好，jQuery同步返回元素。
const $jqElement = $('.element')

// 不行！Cypress没有同步返回元素。
const $cyElement = cy.get('.element')
```

让我们来看看这是为什么...

## Cypress又不同于jQuery

**疑问:** 当jQuery无法从其选择器中找到任何匹配的DOM元素时会发生什么？

**解答:** *糟糕！*它返回一个空的jQuery集合。我们有一个真正的对象可以使用，但它不包含我们想要的元素。
所以我们需要添加检查条件并手动重试我们的查询。

```js
// $() 立即返回一个空集合。
const $myElement = $('.element').first()

// 导致出现丑陋的条件检查。
// 更糟的是,碎片化测试。
if ($myElement.length) {
  doSomething($myElement)
}
```

**疑问:** 当Cypress无法从其选择器中找到任何匹配的DOM元素时会发生什么？

**解答:** *小问题!* Cypress将自动启用重查机制，直到:

### 1. 元素被找到

```js
cy
  // cy.get() 查找'#element'元素,重复查询,直到...
  .get('#element')

  // ...它找到元素!
  // 您现在也可以通过使用.then方式使用它
  .then(($myElement) => {
    doSomething($myElement)
  })
```

### 2. 达到超时设置

```js
cy
  // cy.get() 查找'#my-nonexistent-selector'元素,重复查询直到...
  // ...达到超时它还没有找到元素.
  // Cypress 停止并且标记测试失败.
  .get('#element-does-not-exist')

  // ...这段代码不会运行...
  .then(($myElement) => {
    doSomething($myElement)
  })
```

这使Cypress更加健壮并且不受其他测试工具中出现的许多常见问题的影响。考虑可能导致查询DOM元素失败的所有情况，有:
- DOM尚未完成加载。
- 你的框架尚未完成引导。
- 一个XHR请求尚未响应。
- 一个动画尚未完成。
- 等等...

在这之前，针对上述问题，你将被迫编写一些自定义代码，如:令人讨厌的各种等待组合，有条件的重试，为空检查等。当然，这些在Cypress是不需要的，通过内置的重试机制及{% url '可定制化的超时机制' configuration#Timeouts %}, Cypress回避了这些可恶的问题。

{% note success 核心概念 %}
为了升级整体测试的稳定性，我们对如何找到DOM元素进行微小的改变。那就是使用Cypress强大的重试和超时逻辑包装了所有DOM查询，当然这些逻辑更适合真正的Web应用程序的工作方式。效果很好！
{% endnote %}

{% note info %}
在Cypress,当你想直接与DOM元素进行交互时，可调用回调函数{% url `.then()` then %}并接收元素作为其第一个参数进行使用。
当你想完全跳出重试和超时功能，使用传统的同步方法时，请使用{% url `Cypress.$` $ %}.
{% endnote %}

## 通过文本内容查询

另一种查找方式 -- 一种更人性化的方式 -- 通过文本内容进行查找, 即通过用户在页面上看到的内容. 为此, 有一个更方便的{% url `cy.contains()` contains %} 命令, 例如:

```js
// 在文档里查找文本为'New Post'的元素
cy.contains('New Post')

// 查找'.main'的元素且文本内容为'New Post'
cy.get('.main').contains('New Post')
```

从用户与您的应用交互的角度编写测试时，这很有用。他们只是知道他们想要点击标有“提交”的按钮，他们不知道它有`type`属性或`my-submit-button`的CSS类。

{% note warning 国际化 %}
如果你的应用程序为了国际化而被翻译成多种语言，请确保考虑使用面向用户的文本来查找DOM元素的含义！
{% endnote %}

## 元素缺少时

如上所示，Cypress能预估Web应用程序的异步性质，并且在第一次找不到元素时不会立即失败。
相反，Cypress为您的应用程序提供了一个时间窗口来完成它可能正在做的任何事情!

这称为`超时`，大多数命令可以使用特定的超时时间进行自定义（{% url '默认超时为4秒' configuration#Timeouts %}）。
这些命令将在其API文档中列出`timeout`选项，详细说明如何设置要继续尝试查找元素的毫秒数

```js
// 给这个元素10秒的超时时间
cy.get('.my-slow-selector', { timeout: 10000 })
```

你也可以通过 {% url '配置设置: `默认命令超时时长`' configuration#Timeouts %}设置全局的超时时间.

{% note success 核心概念 %}
为了匹配Web应用程序的行为，Cypress是异步的，并且依赖于超时来知道何时停止等待，让应用程序进入预期状态。
可以全局配置超时时间，也可以基于每个命令配置超时时间。

{% endnote %}

{% note info 超时和性能 %}
这里存在一个性能取舍问题：具有更长超时时间的测试需要更长时间才能失败。
命令总是在满足预期条件时立即进行，因此测试将按照应用程序允许的速度执行。
由于超时而失败的测试将按设计消耗整个超时时间。这意味着虽然您可能希望增加超时时间以适应应用程序的特定部分，但您不希望将其设置为“超长时间，以防万一”

{% endnote %}

在本指南的后面部分，我们将详细介绍{% urlHash '默认断言' 默认断言 %} 和 {% urlHash '超时' 超时 %}.

# 命令链接机制

了解Cypress用于将命令链接在一起的机制非常重要。它代表您管理Promise链，每个命令都会产生下一个命令的“主题”，直到链结束或遇到错误。开发人员不需要直接使用Promises，但了解它们的工作方式是很有帮助的！

## 元素交互

正如我们在最初的例子中所看到的，Cypress通过{% url `.click()` click %}和{% url `.type()` type %}命令配合使用{% url `cy.get()` get %}或 {% url `cy.contains()` contains %}命令，可以轻松对页面上的元素进行点击并输入。
这是命令链接的一个很好的例子。
让我们再看一遍：

```js
cy.get('textarea.post-body')
  .type('This is an excellent post.')
```

我们将 {% url `.type()` type %}链接到{% url `cy.get()` get %}上，告诉它输入从{% url `cy.get()` get %}命令得到的主题，这将是一个DOM元素。

以下是Cypress提供的与您的应用进行交互的更多动作命令：

- {% url `.blur()` blur %} - 使焦点DOM元素模糊.
- {% url `.focus()` focus %} - 聚焦DOM元素.
- {% url `.clear()` clear %} - 清除输入或文本区域的值.
- {% url `.check()` check %} - 选中复选框或者单选框.
- {% url `.uncheck()` uncheck %} - 取消选中复选框.
- {% url `.select()` select %} - 选择一个含有 `<option>`属性的`<select>`元素.
- {% url `.dblclick()` dblclick %} - 双击DOM元素.

这些命令确保在执行操作之前有{% url "保证" interacting-with-elements %}元素的状态。

例如，当写一个{% url `.click()` click %}命令，Cypress将确保这个元素可以与之交互(就像真实用户操作一样).它将自动等待直到元素返回一个"可执行"状态:
- 未隐藏
- 未覆盖
- 未禁用
- 非动画

在测试中与应用程序交互时，这也有助于防止碎片化。您通常可以使用`force`选项来覆盖此行为

{% note success 核心概念 %}
Cypress为{% url "元素交互 " interacting-with-elements %}提供了一套简单又有效的法则
{% endnote %}

## 元素相关的断言

断言允许您执行一些诸如确保元素可见或具有特定属性，CSS类或状态之类的操作。断言只是使您能够描述应用程序的 *期望* 状态的命令。
Cypress将自动等待，直到您的元素达到此状态，或者如果断言没有通过则测试失败。
快速了解实际应用中的断言：

```js
cy.get(':checkbox').should('be.disabled')

cy.get('form').should('have.class', 'form-horizontal')

cy.get('input').should('not.have.value', 'US')
```
上述每个示例中，最重要的是要注意Cypress将自动*等待*直到这些断言通过。这可以防止您必须知道或关心元素最终达到此状态的精确时刻

我们将在本指南后面详细了解{% urlHash '断言' 断言 %}


## 主题管理

新的Cypress链始终以`cy.[command]`开头，`command`产生的内容确定了下一个可以调用的其他命令或者(命令链)

有些方法会产生`null`，因此无法链接，例如{% url `cy.clearCookies()` clearcookies %}.

有些方法，例如 {% url `cy.get()` get %} 或者 {% url `cy.contains()` contains %}，返回一个DOM元素，允许更多命令链接上(假设它们期待一个DOM对象)像{% url `.click()` click %}或者另一个{% url `cy.contains()` contains %}

### 某些命令无法链接:
- 仅从`cy` 开始,这意味着它们不对主题进行操作 {% url `cy.clearCookies()` clearcookies %}.
- 来自用于特定类型主题的命令(如 DOM 元素):{% url `.type()` type %}.
- 来自`cy` *或* 来自主题生成命令: {% url `cy.contains()` contains %}.

### 一些无返回的命令:
- `null`, 意味着在命令之后不能链接任何命令: {% url `cy.clearCookie()` clearcookie %}.
- 他们最初用于同一主题: {% url `.click()` click %}.
- 适合命令的新主题 {% url `.wait()` wait %}.

它实际上比听起来更直观。

### 例子:

```js
cy.clearCookies()         // 完成: "空"已产生,无法链接

cy.get('.main-container') // 得到匹配 DOM 元素的数组
  .contains('Headlines')  // 得到包含内容的第一个 DOM 元素
  .click()                // 进行点击操作
```

{% note success 核心概念 %}
Cypress命令不是**返回**它们的主题，它们是**获取**它们。请记住:Cypress 命令是异步的,会排队等待执行。在执行过程中,从一个命令生成到下一个命令,并且在每个命令之间运行大量有用的 Cypress 代码,以确保一切正常。
{% endnote %}

{% note info %}
为了解决参考元素的需要,Cypress 还有一种{% url '称为别名' variables-and-aliases %}的功能。别名可帮助您**存储**和**保存**元素引用以供将来使用。
{% endnote %}

### 使用 {% url `.then()` then %} 来操作一个主题

想要跳入命令流并直接了解主题?没问题,在命令链中添加{% url '`.then()`' type %}。当前面的命令解析时,它将调用回调函数,并将产生的主题作为第一个参数

如果要在{% url `.then()` then %} 之后继续链接命令,则需要指定要链接于这些命令的主题,可以使用`null`或`undefined`以外的简单返回值来实现该主题。Cypress为你产生下一个命令
### 让我们来看一个例子:

```js
cy
  // 找到一个id为 'some-link'元素
  .get('#some-link')

  .then(($myElement) => {
    // ...模拟任意主题的一段代码

    // 获取它的 href 属性
    const href = $myElement.prop('href')

    // 替换'hash'字符和它之后的一切
    return href.replace(/(#.*)/, '')
  })
  .then((href) => {
    // href 是现在的新主题
    // 现在我们可以干我们想干的
  })
```

{% note info '核心概念' %}
我们有更多的{% url "`cy.then()`" then %}例子和用例在我们的 {% url '核心概念导引' variables-and-aliases %}教你如何正确处理异步代码,何时使用变量,以及什么是别名。
{% endnote %}

### 使用别名来引用以前的主题

Cypress有一些附加功能,像快速引用过去的主题进行调用  {% url '别名' variables-and-aliases %}. 如下所示:

```js
cy
  .get('.my-selector')
  .as('myElement') // 设置别名
  .click()

/* 更多操作 */

cy
  .get('@myElement') // 像以前那样重新查询DOM(仅在必要时)
  .click()
```
这使我们能够在元素仍在 DOM 中时重用 DOM 查询以进行更快的测试,并且当 DOM 中未立即找到 DOM 时,它会自动处理重新查询 DOM。在处理大量重新呈现的前端框架时,这尤其有用。

## 命令是异步的

请务必了解,Cypress 命令在调用时不执行任何操作,而是排队稍后运行。当我们说 Cypress 命令是异步的时,这就是我们的意思。

### 以这个简单的测试为例:

```js
it('changes the URL when "awesome" is clicked', function() {
  cy.visit('/my/resource/path') // 什么都没发生

  cy.get('.awesome-selector')   // 依然什么都没发生
    .click()                    // 不,什么都没有

  cy.url()                      // 没什么可看的
    .should('include', '/my/resource/path#awesomeness') // 没有什么
})

// 好的，测试函数已经执行完成
// 我们已经排了所有这些命令的队列
// Cypress 将按顺序运行!
```
在测试函数完成退出之前,Cypress 不会启动浏览器自动化关闭功能

{% note success 核心概念 %}

每个 Cypress 命令(和命令链)都会立即返回,并且只追加到以后要执行的命令队列中。

您**不能**故意使用命令的返回值去执行任何有用的操作。因为命令需要在后台排队和管理。

我们以这种方式设计 API 是因为 DOM 是一个高度可变的对象,它不断变化。对于 Cypress,为了防止碎片,并知道何时继续,我们必须以高度受控的方式管理命令。

{% endnote %}

{% note info "为什么我不能只使用 async / await?" %}
如果你是一个现代的JS程序员，你可能会听到"异步"并认为：**为什么我不能只使用`async/await` **而不是学习一些专有的API？

Cypress的API与您可能习惯的API完全不同：但这些设计模式非常有意。我们将在本指南的后面部分详细介绍
{% endnote %}

## 命令串行运行

测试函数运行完成后,Cypress 开始使用`cy.*`命令链执行排队的命令。上面的测试将按顺序执行:

1. 访问一个URL。
2. 通过选择器查找元素。
3. 对该元素执行单击操作。
4. 抓取URL地址。
5. 断言这个URL地址是否含有特定的 *字符串*。

这些操作将始终以连续方式发生(一个接一个),从不并行(同时)。为什么？

为了说明这一点,让我们重新回顾该操作列表,并曝光 Cypress 在每个步骤中为我们做的一些隐藏的 **✨ 魔法 ✨** :

1. 访问一个URL
  ✨ **所有外部资源已加载后等待页面`加载`事件触发**✨
2. 通过选择器查找元素
  ✨ **通过 {% url "重试" retry-ability %} 直到找到DOM元素** ✨
3. 对该元素执行单击操作
  ✨ **等到元素变为{% url '可操作状态' interacting-with-elements %}后进行操作** ✨
4. 抓取URL地址...
5. 断言这个URL地址是否含有特定的 *字符串*
  ✨ **通过 {% url "重试" retry-ability %} 直到断言通过** ✨

正如你所看到的,Cypress 会执行大量额外的工作,以确保应用程序的状态与我们的命令期望的匹配。每个命令可能快速解析(速度如此之快,你不会看到它们处于挂起状态),但其他命令可能需要几秒钟甚至几十秒才能解决。

虽然大多数命令会在几秒钟后超时,但一些特殊命令如预期特定事物需要更长的时间的,如{% url `cy.visit()` visit %} 自然会等待更长时间才会超时。

这些命令都有自己特定的超时值，这些可以在{% url '配置' configuration %}文档里进行查看。

{% note success 核心概念 %}
在下一步开始之前,为确保步骤成功而进行的任何等待或重试都是必须的。如果在达到超时之前它们仍未成功完成,则测试将失败。
{% endnote %}

## 命令是Promises形式

 Cypress的大秘密: 我们已经采取了我们最喜欢的模式来编写JavaScript代码,Promises,并把它直接构建到Cypress的结构中。如上文,当我们说Cypress是排队进行执行的,这里我们可以重申一下,可以"添加Promises到Promises链"

让我们将上一个示例与它的原始、基于Promise的虚构版本进行比较：

### 证明槽糕的Promise是无效的代码

```js
it('changes the URL when "awesome" is clicked', function() {
  // 这是一段无效代码.
  // 仅仅用于展示.
  return cy.visit('/my/resource/path')
  .then(() => {
    return cy.get('.awesome-selector')
  })
  .then(($element) => {
    // not analogous
    return cy.click($element)
  })
  .then(() => {
    return cy.url()
  })
  .then((url) => {
    expect(url).to.eq('/my/resource/path#awesomeness')
  })
})
```

### Cypress是怎样的呢, 用Promises包裹并隐藏于其中.

```javascript
it('changes the URL when "awesome" is clicked', function() {
  cy.visit('/my/resource/path')

  cy.get('.awesome-selector')
    .click()

  cy.url()
    .should('include', '/my/resource/path#awesomeness')
})
```

大有不同！除了代码更方便阅读，Cypress还做了很多。因为**Promises自身是没有重试机制的**。

如果没有**重试机制**,断言将随机失败。这将导致出现奇怪、不一致的结果。这也是为什么我们不能使用新的JS功能,如`async/await`。

Cypress无法生成独立于其他命令的原始值。这是因为 Cypress 命令在内部的行为类似于异步数据流,只有在**受到其他命令**影响和修改后才能解析。这意味着我们不能以块的形式产生随机值,因为我们必须在传递值之前了解你的期望。

这些设计模式确保我们可以创建**确定性**、**可重复**、**一致性**的测试。

{% note info %}
Cypress 使用Promises 进行设计来源于参考 {% url "Bluebird" http://bluebirdjs.com/ %}. 但是,Cypress 命令不返回典型的Promise实例。通常我们返回所谓的` 链子 `,它就像一个位于Promise内部实例之上的层。

由于这个原因,你永远不能从Cypress命令中返回或分配任何有用的值。

如果你想了解更多关于Cypress异步实现，请查阅我们的{% url '核心概念导引' variables-and-aliases %}。
{% endnote %}

## 命令又不是Promises形式

Cypress API 不是Promises的1:1实现。它拥有Promise的特性但也有需要注意的重要不同。

1.你不能**比速度**或者同时运行多个命令(并行)。
2.你不能‘突然’忘记返回或者链接命令。
3.你不能添加`.catch`去处理一个出错的命令。

这些限制在 Cypress API 中内置有*非常* 具体的原因。

Cypress的整个意图(以及它与其他测试工具截然不同的地方)是创建一致的、非片状的测试,这些测试在一次运行到下一个运行中执行相同。实现这一点并不容易 - 我们做出了一些权衡。Cypress对于习惯于使用Promises的开发人员来说可能并不陌生。

让我们深入了解一下每种利弊:

### 你不能**比速度**或者同时运行多个命令

Cypress可以保证每次运行时能以明确的、相同的方式执行其所有命令。

一些Cypress命令有很多方式可以*改变* 浏览器的状态。

- {% url `cy.request()` request %} 自动从远程服务器获取Cookie及设置Cookie。
- {% url `cy.clearCookies()` clearcookies %} 清空浏览器的所有cookies。
- {% url `.click()` click %} 使应用程序对单击事件做出响应。

上述命令都不是[幂等],它们会引起副作用。无法使用并行命令，是因为命令必须以受控的串行方式运行,以便创建一致性。由于集成测试和端到端测试主要是模仿真实用户的操作,Cypress会在真实用户一步一步操作后对其命令进行模型建模。

### 您不会突然地忘记返回或命令链

在promises里，如果你不返回promise或命令链，就很容易"失去"一个嵌套的Promise。

让我们猜想一下接下来的Node代码:

```js
// 假设我们已经引入了我们的fs模块
return fs.readFile('/foo.txt', 'utf8')
.then((txt) => {
  // 糟糕！我们忘了返回Promise或者命令链
  // 它基本上'消失'了.
  // 这会生成奇怪的异常和
  // 难以追踪的 Bug
  fs.writeFile('/foo.txt', txt.replace('foo', 'bar'))

  return fs.readFile('/bar.json')
  .then((json) => {
    // ...
  })
})
```

在Promise中,这甚至是可能的,因为您有能力并行执行多个异步操作。在钩子下,每个promise'链'返回一个promise实例,用于跟踪链接的父实例和子实例之间的关系

由于 Cypress 强制命令*只能* 串行运行,因此你无需在 Cypress 中对此进行关注。我们将所有命令排队到*全局* 实例上。由于只有单个命令队列实例,因此命令不可能永远*'丢失'*。

您将每一个Cypress命令视为一个"队列"。最终,他们将百分之百的按照确定的顺序进行运行。
甚至不需要`返回` Cypress命令.

### 你不能添加`.catch`去处理一个出错的命令

在Cypress里,对于一个已经失败的命令没有内置错误恢复功能。命令及其断言必须全部通过,或者是其中一个失败,则所有剩余命令不会运行,并且测试失败。

你可能会担心:

> 如何使用*if/else* 创建条件控制流?假设,如果元素存在(或不存在),我应该做什么?

这个问题的问题是这种类型的条件控制流最终是非确定性的。这意味着脚本(或机器人)不可能 100% 始终如一地遵循它。

通常,只有极少数非常具体的情况可以创建控制流。要求从错误中恢复，实际上只是请求另一个`if/else` 控制流。

话虽如此,只要你能识别到控制流的潜在缺陷,就可以在Cypress中做到这一点!

你可以查阅如何实现 {% url '条件测试' conditional-testing %}.

# 断言

正如我们在本指南前面提到的:

> 断言用于描述**元素**、**对象**和**应用程序**的**所需**状态。

Cypress 与其他测试工具的独特之处是命令**自动重试**其断言。事实上,他们会通过"下游"来看待你所表达的内容,并修改他们的行为,以使你的断言获得通过。

你应该把断言看作是**守卫**。

使用你的**守卫**来描述你的应用程序应该是什么样子,Cypress 将自动进行**限制、等待和重试**,直到它达到该状态。

{% note success '核心概念' %}
每个API命令都使用断言记录其行为 - 例如,它如何重试或等待断言通过。
{% endnote %}

## 用英语进行断言

让我们看看你是如何用英语描述一个断言:

> 在点击 `<button>`后,我期望它的类属性最终为 `active`.

为了在Cypress里实现这个，你需要这样写:

```js
cy.get('button').click().should('have.class', 'active')
```
即使以异步方式操作按钮或在不确定时间段之后进行点击,类为`.active`的验证也会通过。

```javascript
// 即使我们添加了类
// 2秒后...
// 这个测试结果依然是通过的!
$('button').on('click', (e) => {
  setTimeout(() => {
    $(e.target).addClass('active')
  }, 2000)
})
```

这是另外一个例子:

> 向我的服务器发送一个HTTP请求后，我期望的返回内容等于`{name: 'Jane'}`

用你写的断言来确认这一点:

```js
cy.request('/users/1').its('body').should('deep.eq', { name: 'Jane' })
```

## 何时使用断言?

尽管 Cypress 为你提供了多种断言,但有时最好的测试可能根本不会使用断言!怎么会这样?断言难道不是测试的基本部分吗?

### 参考这个例子:

```js
cy.visit('/home')

cy.get('.main-menu')
  .contains('New Project')
  .click()

cy.get('.title')
  .type('My Awesome Project')

cy.get('form')
  .submit()
```

如果没有一个显式断言,该测试有很多种失败可能!原因如下:
- {% url `cy.visit()` visit %} 不仅仅能返回成功，还能返回其他的。
- {% url `cy.get()` get %} 在DOM里查找元素时可能失败。
- 我们想通过 {% url `.click()` click %} 点击的元素可能被其他元素覆盖。
- 我们想通过 {% url `.type()` type %} 进行输入的元素可能被禁用。
- 表单提交的结果可能是不成功的状态。
- 页面内的JS(正在测试的应用程序)可能会引发错误。

你还能想到更多的吗?

{% note success 核心概念 %}

通过Cypress,您不必为了一个有用的测试添加断言。即使没有断言,几行 Cypress 也能确保数千行代码在客户端和服务器之间正常工作!

这是因为许多命令都内置了{% urlHash '默认断言' 默认断言 %}以便为你提供更高水平的保障。
{% endnote %}

## 默认断言

许多命令具有默认的内置断言,或者更确切地说,要求可能会导致失败的命令,而无需添加显式断言

### 例如:

- {% url `cy.visit()` visit %} 预期这个页面是状态为`200`的 `text/html`内容页。
- {% url `cy.request()` request %} 预期远程服务器存在并提供响应。
- {% url `cy.contains()` contains %} 预期包含内容的元素最终存在于DOM中。
- {% url `cy.get()` get %} 预期元素最终存在于DOM中。
- {% url `.find()` find %} 预期元素最终存在于DOM 中。
- {% url `.type()` type %} 预期元素最终为 *可输入* 状态。
- {% url `.click()` click %} 预期元素最终为 *可操作* 状态。
- {% url `.its()` its %} 预期最终找到当前主题的一个属性。

某些命令可能有特殊的要求，需要立即返回而不需要重试:例如{% url `cy.request()` request %}。

其他命令(如基于DOM的命令)将自动{% url "重试" retry-ability %}并等待其相应的元素出现,否则才会失败。

更多 - 操作性命令将自动等待其元素达到可操作状态,否则才会失败。

{% note success 核心概念 %}
所有基于DOM的命令都将自动等待直到发现其元素存在于DOM中。

基于DOM的命令，你不需要写 {% url "`.should('exist')`" should %}。除非你想添加一个额外的`.should()`断言。
{% endnote %}

{% note danger "否定DOM断言" %}
如果你链接了`.should()`命令，则默认的`.should('exist')`不会断言。对于大多数 *正面* 断言,如`.should('have.class')`，因为这些断言首先意味着存在,但如果你链接 *否定* 断言,例如`.should('not.have.class')`,即使DOM元素不存在也会通过：

```
cy.get('.does-not-exist').should('not.be.visible')         // 通过
cy.get('.does-not-exist').should('not.have.descendants')   // 通过
```

适用于自定义断言,例如传递回调时:

```
// 通过,前提是回调本身已通过
cy.get('.does-not-exist').should(($element) => {
  expect($element.find('input')).to.not.exist
})
```

关于这种行为有{% url '公开的讨论' https://github.com/cypress-io/cypress/issues/205 %}
{% endnote %}

这些规则非常直观,大多数命令都允许你灵活地重写或绕过它们可能失败的默认方式,通常是通过传递`{force: true}`选项。

### 示例 #1: 存在性和可操作性

```js
cy
  // 这里有一个默认断言
  // button必须存在于DOM中才能继续执行
  .get('button')

  // 在点击之前，按钮的状态必须是 "可操作性状态"
  // 它不能禁用,被覆盖或者隐藏在视图中。
  .click()
```

Cypress 会自动 *等待* 元素直到默认断言通过。就像你添加的显示断言一样，所有的断言共享*相同* 的超时值。

### 示例 #2: 推翻默认断言

大多数情况，当你查询元素时，你期望它们已经存在。但是有时候你希望等到它们*不再* 存在。

所以你需要做的是添加断言让Cypress**推翻**其等待元素存在的规则。

```js
// Cypress将一直等待直到
// 点击<button> 按钮后，它不再存在
cy.get('button.close').click().should('not.exist')

// 确认这个 #modal 元素不在DOM里存在
// 自动等待,直到它消失!
cy.get('#modal').should('not.exist')
```

{% note success '核心概念' %}
向任何DOM命令添加 {% url "`.should('not.exist')`" should %},Cypress 将推翻其默认断言,并自动等待,直到元素不存在。
{% endnote %}

### 示例 #3: 其他默认断言

其他命令具有与DOM无关的其他默认断言。

例如, {% url `.its()` its %} 要求你查找的属性存在于对象上。

```js
// 创建一个空对象
const obj = {}

// 1秒后设置'foo' 属性
setTimeout(() => {
  obj.foo = 'bar'
}, 1000)

// .its() 将等待,直到"foo"属性位于对象上
cy.wrap(obj).its('foo')
```

## 断言列表

Cypress捆绑了{% url "`Chai`" bundled-tools#Chai %}, {% url "`Chai-jQuery`" bundled-tools#Chai-jQuery %}, 和 {% url "`Sinon-Chai`" bundled-tools#Sinon-Chai %}提供的内置断言。你可以在{% url '断言引用列表' assertions %}中看到它们的完整列表。您也可以{% url "编写自己的断言作为 Chai 插件" recipes#Fundamentals %},并在Cypress使用它们。

## 编写断言

在 Cypress 中有两种断言写法:

1. **隐式主题:** 使用 {% url `.should()` should %} 或者 {% url `.and()` and %}.
2. **显示主题:** 使用 `expect`.

## 隐式主题

在Cypress里使用{% url `.should()` should %} 或者 {% url `.and()` and %}断言是首选方式。这些典型的命令，表明它们通常直接应用于当前的命令链中。

```javascript
// 这里隐含的主题是第一<tr>
// 断言 <tr>有一个active类
cy.get('tbody tr:first').should('have.class', 'active')
```

您可以使用{% url `.and()` and %}将多个断言链接在一起,这只是{% url `.should()` should %}的另一个名称，目的是为了使代码更容易阅读:

```js
cy.get('#header a')
  .should('have.class', 'active')
  .and('have.attr', 'href', '/users')
```

因为 {% url "`.should('have.class')`" should %} 并不会改变主题,对同一元素执行时使用{% url "`.and('have.attr')`" and %} 。当你需要针对单个主题快速断言多个内容时,这非常方便。

如果我们以显式形式编写此断言,它将如下所示:

```js
cy.get('tbody tr:first').should(($tr) => {
  expect($tr).to.have.class('active')
  expect($tr).to.have.attr('href', '/users')
})
```

隐式形式要短得多!那么,你希望何时使用显式呢？

通常,当您想要:
  - 对同一主题进行多次断言
  - 在做出断言之前,以某种方式预估主题

## 显式主题

使用`expect`允许你传递特定主题并对此进行断言。这可能是你通常在单元测试中编写的断言:

```js
// 这里显示主题是布尔:值为真
expect(true).to.be.true
```

{% note info 你知道你能在Cypress中写单元测试吗? %}
参考我们的例子 {% url '单元测试' recipes %} 和 {% url '反应单元测试的组件' recipes#Unit-Testing %}.
{% endnote %}

当你需要的时候,显式断言很棒:

- 断言可以自定义逻辑.
- 对同一主题进行多个断言.

{% url `.should()` should %} 命令允许我们传递一个回调函数,该函数将产生的主题作为其第一个参数。这和 {% url `.then()` then %}一样, 预期Cypress 会自动**等待和重试** 回调函数内的所有传递的内容。

{% note info '复杂断言' %}

下面的示例是一个例子,我们在其中跨多个元素进行断言。使用{% url `.should()` should %}回调函数,是一种可以从**父级** 查询到多个子元素并对其状态进行断言的方式。

这样做使你能够**限制**和**保护**后代的状态,确保其与预期匹配,而无需使用常规 Cypress DOM 命令单独查询它们。
{% endnote %}

```javascript
cy
  .get('p')
  .should(($p) => {
    // 从DOM元素里模拟我们的主题
    // 得到所有p的文本数组
    let texts = $p.map((el, i) => {
      return Cypress.$(el).text()
    })

    // jQuery map 返回jQuery 对象
    // .get() 将此转换为简单数组
    texts = texts.get()

    // 数组的长度应为3
    expect(texts).to.have.length(3)

    // 与特定的内容进行匹配
    expect(texts).to.deep.eq([
      'Some text from first p',
      'More text from second p',
      'And even more text from third p'
    ])
  })
```

{% note danger 确保 `.should()`是安全的 %}

当使用带有{% url `.should()` should %}的回调函数时,请确保整个函数可以多次执行,而不会产生副作用。Cypress 将{% url "重试" retry-ability %} 逻辑应用于这些函数:如果出现故障,它将重复重新运行断言,直到达到超时。这意味着你的代码应该是重试安全的。此的技术术语意味着你的代码必须为 **幂**。

{% endnote %}

# 超时

几乎所有命令都可以以某种方式超时。

所有断言,无论是默认断言,还是您添加的断言都共享相同的超时值。

## 应用超时

您可以修改命令的超时时间。此超时时长会影响其默认断言(如果有)和您添加的任何特定断言。

请记住,因为断言用于描述前面的命令的条件-修改`超时`将影响前面的命令 *而不是断言本身*。

### 示例 #1: 默认断言

```js
// 因为 .get()有一个默认断言
// 直到找到元素,或者它超时并标记失败
cy.get('.mobile-nav')
```

Cypress内部实现:

- 查询 `.mobile-nav` 元素
  ✨**等待4秒直到在DOM里找到它**✨

### 示例 #2: 附加断言

```js
// 在这个测试里我们已经添加了2个断言
cy
  .get('.mobile-nav')
  .should('be.visible')
  .and('contain', 'Home')
```

Cypress内部实现:

- 查询 `.mobile-nav` 元素
  ✨**等待4秒直到在DOM里找到它**✨
  ✨**等待4秒直到它是可见状态**✨
  ✨**等待4秒直到找到文本内容含有'Home'**✨

Cypress等待所有断言通过的*总* 时间是 cy.get()的超时时长(即4秒)。

每个命令都可以修改超时时长，但它将影响默认断言及该命令链上的断言。

### 示例 #3: 修改超时时长

```js
// 我们已经修改了默认断言和添加断言的超时时长
cy
  .get('.mobile-nav', { timeout: 10000 })
  .should('be.visible')
  .and('contain', 'Home')
```

Cypress 内部实现:

- 查询 `.mobile-nav` 元素  
  ✨**等待10秒直到在DOM里找到它**✨
  ✨**等待10秒直到它是可见状态**✨
  ✨**等待10秒直到找到文本内容含有'Home'**✨
 
请注意,此超时设置已经影响所有断言,Cypress 现在将等待*最多总计10秒* 时间,以便所有断言都通过。

## 默认值

Cypress 根据命令的类型提供了几种不同的超时值.

我们根据某些操作预期确定的时长来设置默认超时时间。

例如:
- {% url `cy.visit()` visit %} 加载远程页面,直到所有外部资源完成其加载阶段才能解析。这可能需要一段时间,所以它的默认时长设置为`60000ms`.
- {% url `cy.exec()` exec %} 执行一个系统命令，例如 *初始化数据库*。 我们预计这可能需要很长时间, 它的默认时长设置为`60000ms`.
- {% url `cy.wait()` wait %} 实际使用2个不同的超时。当等待 {% url '路由别名' variables-and-aliases#Routes %}时, 我们等待一个匹配的请求 `5000ms`, 紧接着等待服务器响应 `30000ms`. 我们预期你的应用程序能够快速发出匹配的请求,但我们预计服务器的响应可能会需要更长的时间。

大多数其他命令(包括所有基于 DOM 的命令)默认在 4000ms 之后超时。

<!-- ***为什么只有4秒？这听起来太短了!***

如果你使用过其他测试框架，您可能想知道为什么这个值太低了。事实上，我们经常看到我们的一些用户最初增加它，有时高达25倍。

你不应该等待应用程序渲染DOM元素超过4秒！

让我们来看看为什么你可能想要增加这个，以及一些最佳实践。

最常见的场景是DOM元素在*一系列网络请求之后*呈现。网络请求本身必须通过互联网，使他们容易变得可能很慢。

我们看到的典型反模式之一是不恰当的。

你需要克服的典型障碍之一是*慢速测试*。 -->
