---
title: Cypress简介
---

{% note info %}
# {% fa fa-graduation-cap %} 你将会学到什么

- Cypress怎么查询DOM结构
- Cypress怎么管理主题和命令链
- 怎样写断言和它们是怎么工作
- 如果命令发生超时怎么处理
{% endnote %}

{% note success 非常重要！ %}
这是用于了解Cypress怎么进行测试的**一个非常重要的指南**。仔细阅读。弄明白它是怎么运行。如果遇到问题可以告诉我们，这样我们才能很好的改进它。

在你读完后，我们建议你观看一些我们的 {% fa fa-video-camera %} {% url "视频教程" tutorials %}.
{% endnote %}

# Cypress非常简单

简单就是用更少的代码来完成更多的工作。我们来看一个例子：

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

你能读懂这个吗？如果你能读懂，它看起来应该是这个意思：

> 1. 访问 `/posts/new`页面。
> 2. 查找 `<input>` 中class的值为 `post-title` 的元素。
> 3. 在其中输入 "My First Post"。
> 4. 查找 `<input>` 中class的值为 `post-body` 的元素。
> 5. 在其中输入 "Hello, world!"。
> 6. 查找包含文本 `Submit`的元素。
> 7. 点击它.
> 8. 获取浏览器的URL，确保它包含 `/posts/my-first-post`。
> 9. 查找 `h1` 标签，确保它包含 "My First Post"。

这是一个相对简单、直接的测试，但是它确覆盖了客户端和服务器上的很多代码！

本指南剩余部分，我们将一起探索Cypress的基本用法并逐步的让实例能够跑起来。我们会揭开Cypress所遵循规则的面纱，这样你就可以尽可能的像用户一样高效的测试你的应用程序，并讨论如何在有效的时候采取快速的方式。

# 查询元素

## Cypress 很像 jQuery

如果你以前使用过 {% url 'jQuery' https://jquery.com/ %} ， 那你可能像这样查询过元素:

```js
$('.my-selector')
```

使用Cypress，查询元素也是一样:

```js
cy.get('.my-selector')
```

事实上，Cypress {% url '捆绑jQuery' bundled-tools#Other-Library-Utilities %} 并且公开了许多DOM遍历方法，因此你可以轻松的使用熟悉的API来应付复杂的HTML结构。

```js
// 每个方法都对应jQuery中的方法。你可以使用你所有知道的所有方法。
cy.get('#main-content')
  .find('.article')
  .children('img[src^="/static"]')
  .first()
```

{% note success 核心概念 %}
Cypress利用jQuery的强大选择器引擎来让开发人员容易上手和易读。

对选择元素的最佳实践感兴趣？{% url '点我' best-practices#Selecting-Elements %}.
{% endnote %}

但是，查询DOM返回的结果不一样：

```js
// 这是可以的，jQuery 同步返回元素。
const $jqElement = $('.element')

// 这是不可用！Cypress不同步返回元素
const $cyElement = cy.get('.element')
```

让我们来看看为什么会这样...

## Cypress和jQuery不一样

**问题：** 当jQuery无法从选择器中找到任何匹配的DOM元素时会发生什么？

**答案：** *糟糕！* 它返回一个空的jQuery集合。我们需要一个真正的可以使用的对象，但它不包含我们想要的元素。所以我们开始添加条件检查并手动重试我们的查询。

```js
// $() 立即返回一个空的集合
const $myElement = $('.element').first()

// 看上去是丑陋和糟糕的条件检查
if ($myElement.length) {
  doSomething($myElement)
}
```

**问题：** 当Cypress无法从选择器中找到任何匹配的DOM元素时会发生什么？

**答案：** *没什么大不了的！* Cypress会自动重试查询，直到：

### 1. 找到元素

```js
cy
  // cy.get() 寻找 '#element'，重复查询直到...
  .get('#element')

  // ...它能找到这个元素
  // 这个时候你就可以用.then来处理它
  .then(($myElement) => {
    doSomething($myElement)
  })
```

### 2. 达到了超时时间

```js
cy
  // cy.get() 寻找 '#my-nonexistent-selector'，重复查询直到...
  // ...它在超时之前都找不到该元素。
  // Cypress停止并且该测试失败。
  .get('#element-does-not-exist')

  // ...这段代码将永远不会执行...
  .then(($myElement) => {
    doSomething($myElement)
  })
```

这将使Cypress变得强大并且不受其它测试工具中出现的问题的影响。考虑所有可能导致DOM查询失败的原因：

- DOM还没有加载。
- 你的框架还没有完成引导。
- 一个XHR请求还没响应。
- 一个动画效果还没完成。
- 以及其它...

在此之前，你需要用心的编写自定义代码来防止这些情况发生：任意的等待、条件重试和null值检查。 这些在Cypress都不需要了！通过内建的重试和 {% url '可自定义的超时控制' configuration#Timeouts %}，Cypress杜绝了所有这些不稳定的问题。

{% note success 核心概念 %}
Cypress使用强大的重试和超时逻辑来包装所有DOM查询，这些逻辑更适合真正的Web应用程序的工作方式。我们对如何找到DOM元素进行微小的改变，这将给所有的测试带来稳定性上的提升。
{% endnote %}

{% note info %}
在Cypress中，当你想直接和DOM元素交互时，使用 {% url `.then()` then %} 的回调函数来接收元素作为第一个参数。 如果你想完全跳过重试和超时功能并执行传统的同步工作，请使用 {% url `Cypress.$` $ %}.
{% endnote %}

## 通过文本内容来查找

定位元素的另一种方式 -- 更人性化的方式 -- 是通过内容来查找， 用户在页面上看到什么内容我们就用它来查找。为此，有一个方便的函数{% url `cy.contains()` contains %}，例如：

```js
// 在页面中找到包含'New Post'文本的元素
cy.contains('New Post')

// 在'.main'元素中查找包含'New Post'文本的元素
cy.get('.main').contains('New Post')
```

从用户和应用交互的角度来编写测试时，这会很有用。他们只是想知道他们要点击标有"Submit"的按钮，他们不知道`type`包含一个`submit`属性，或者CSS的类名叫做`my-submit-button`。

{% note warning 国际化 %}
如果你的应用程序被翻译成多种语言，请确保你知道用文本来查找DOM元素的含义！
{% endnote %}

## 当元素缺失时

就像上面说的，Cypress预判Web应用程序的异步性，并且在第一次找不到元素时不会立即失败。相反，Cypress给应用程序提供了一个时间窗口来完成它可能正在做的任何事情！

这个就是大家所说的`超时`, 大部分命令都可以自定义超时时间 ({% url '默认超时4秒' configuration#Timeouts %})。这些命令在文档中会列出一个`超时`选项，详细说明如何设置该参数。

```js
// 给这个元素10秒钟来加载完毕
cy.get('.my-slow-selector', { timeout: 10000 })
```

你还可以{% url '设置: `defaultCommandTimeout`' configuration#Timeouts %}全局的超时时间。

{% note success 核心概念 %}
为了匹配Web应用程序的行为，Cypress是异步的，并依赖超时来知道在什么时候停止等待当应用程序进入预期状态。超时可以通过全局配置，也可以基于每个命令来配置。
{% endnote %}

{% note info 超时和性能 %}
这里存在性能的折中： **具有更长超时时间的测试需要更长的等待才能失败**。命令总是在满足预期条件时就立即执行，因此测试将按照应用程序允许的速度执行。由于超时而失败的测试将消耗整个超时时间。这意味着虽然你可能希望增加超时时间来特殊处理应用程序的某个逻辑，但你不希望设置为"超长，以防万一"。
{% endnote %}

在本指南的后面部分，我们将详细介绍 {% urlHash '默认断言' Default-Assertions %} 和 {% urlHash '超时' Timeouts %}.

# Chains of Commands

It's very important to understand the mechanism Cypress uses to chain commands together. It manages a Promise chain on your behalf, with each command yielding a 'subject' to the next command, until the chain ends or an error is encountered. The developer should not need to use Promises directly, but understanding how they work is helpful!

## Interacting With Elements

As we saw in the initial example, Cypress makes it easy to click on and type into elements on the page by using {% url `.click()` click %} and {% url `.type()` type %} commands with a {% url `cy.get()` get %} or {% url `cy.contains()` contains %} command. This is a great example of chaining in action. Let's see it again:

```js
cy.get('textarea.post-body')
  .type('This is an excellent post.')
```

We're chaining the {% url `.type()` type %} onto the {% url `cy.get()` get %}, telling it to type into the subject yielded from the {% url `cy.get()` get %} command, which will be a DOM element.

Here are even more action commands Cypress provides to interact with your app:

- {% url `.blur()` blur %} - Make a focused DOM element blur.
- {% url `.focus()` focus %} - Focus on a DOM element.
- {% url `.clear()` clear %} - Clear the value of an input or textarea.
- {% url `.check()` check %} - Check checkbox(es) or radio(s).
- {% url `.uncheck()` uncheck %} - Uncheck checkbox(es).
- {% url `.select()` select %} - Select an `<option>` within a `<select>`.
- {% url `.dblclick()` dblclick %} - Double-click a DOM element.

These commands ensure {% url "some guarantees" interacting-with-elements %} about what the state of the elements should be prior to performing their actions.

For example, when writing a {% url `.click()` click %} command, Cypress ensures that the element is able to be interacted with (like a real user would). It will automatically wait until the element reaches an "actionable" state by:

- Not being hidden
- Not being covered
- Not being disabled
- Not animating

This also helps prevent flake when interacting with your application in tests. You can usually override this behavior with a `force` option.

{% note success Core Concept %}
Cypress provides a simple but powerful algorithm when {% url " interacting with elements." interacting-with-elements %}
{% endnote %}

## Asserting About Elements

Assertions let you do things like ensuring an element is visible or has a particular attribute, CSS class, or state. Assertions are just commands that enable you to describe the *desired* state of your application. Cypress will automatically wait until your elements reach this state, or fail the test if the assertions don't pass.  Here's a quick look at assertions in action:

```js
cy.get(':checkbox').should('be.disabled')

cy.get('form').should('have.class', 'form-horizontal')

cy.get('input').should('not.have.value', 'US')
```

In each of these examples, it's important to note that Cypress will automatically *wait* until these assertions pass. This prevents you from having to know or care about the precise moment your elements eventually do reach this state.

We will learn more about {% urlHash 'assertions' Assertions %} later in this guide.

## Subject Management

A new Cypress chain always starts with `cy.[command]`, where what is yielded by the `command` establishes what other commands can be called next (chained).

Some methods yield `null` and thus cannot be chained, such as {% url `cy.clearCookies()` clearcookies %}.

Some methods, such as {% url `cy.get()` get %} or {% url `cy.contains()` contains %}, yield a DOM element, allowing further commands to be chained onto them (assuming they expect a DOM subject) like {% url `.click()` click %} or even {% url `cy.contains()` contains %} again.

### Some commands cannot be chained:
- From `cy` only, meaning they do not operate on a subject: {% url `cy.clearCookies()` clearcookies %}.
- From commands yielding particular kinds of subjects (like DOM elements): {% url `.type()` type %}.
- From both `cy` *or* from a subject-yielding command: {% url `cy.contains()` contains %}.

### Some commands yield:
- `null`, meaning no command can be chained after the command: {% url `cy.clearCookie()` clearcookie %}.
- The same subject they were originally yielded: {% url `.click()` click %}.
- A new subject, as appropriate for the command {% url `.wait()` wait %}.

This is actually much more intuitive than it sounds.

### Examples:

```js
cy.clearCookies()         // Done: 'null' was yielded, no chaining possible

cy.get('.main-container') // Yields an array of matching DOM elements
  .contains('Headlines')  // Yields the first DOM element containing content
  .click()                // Yields same DOM element from previous command
```

{% note success Core Concept %}
Cypress commands do not **return** their subjects, they **yield** them. Remember: Cypress commands are asynchronous and get queued for execution at a later time. During execution, subjects are yielded from one command to the next, and a lot of helpful Cypress code runs between each command to ensure everything is in order.
{% endnote %}

{% note info %}
To work around the need to reference elements, Cypress has a feature {% url 'known as aliasing' variables-and-aliases %}. Aliasing  helps you to **store** and **save** element references for future use.
{% endnote %}

### Using {% url `.then()` then %} To Act On A Subject

Want to jump into the command flow and get your hands on the subject directly? No problem, simply add a {% url '`.then()`' type %} to your command chain. When the previous command resolves, it will call your callback function with the yielded subject as the first argument.

If you wish to continue chaining commands after your {% url `.then()` then %}, you'll need to specify the subject you want to yield to those commands, which you can achieve with a simple return value other than `null` or `undefined`. Cypress will yield that to the next command for you.

### Let's look at an example:

```js
cy
  // Find the el with id 'some-link'
  .get('#some-link')

  .then(($myElement) => {
    // ...massage the subject with some arbitrary code

    // grab its href property
    const href = $myElement.prop('href')

    // strip out the 'hash' character and everything after it
    return href.replace(/(#.*)/, '')
  })
  .then((href) => {
    // href is now the new subject
    // which we can work with now
  })
```

{% note info 'Core Concept' %}
We have many more examples and use cases of {% url "`cy.then()`" then %} in our {% url 'Core Concept Guide' variables-and-aliases %} that teaches you how to properly deal with asynchronous code, when to use variables, and what aliasing is.
{% endnote %}

### Using Aliases to Refer to Previous Subjects

Cypress has some added functionality for quickly referring back to past subjects called {% url 'Aliases' variables-and-aliases %}. It looks something like this:

```js
cy
  .get('.my-selector')
  .as('myElement') // sets the alias
  .click()

/* many more actions */

cy
  .get('@myElement') // re-queries the DOM as before (only if necessary)
  .click()
```

This lets us reuse our DOM queries for faster tests when the element is still in the DOM, and it automatically handles re-querying the DOM for us when it is not immediately found in the DOM. This is particularly helpful when dealing with front end frameworks that do a lot of re-rendering!

## Commands Are Asynchronous

It is very important to understand that Cypress commands don't do anything at the moment they are invoked, but rather enqueue themselves to be run later. This is what we mean when we say Cypress commands are asynchronous.

### Take this simple test, for example:

```js
it('changes the URL when "awesome" is clicked', function() {
  cy.visit('/my/resource/path') // Nothing happens yet

  cy.get('.awesome-selector')   // Still nothing happening
    .click()                    // Nope, nothing

  cy.url()                      // Nothing to see, yet
    .should('include', '/my/resource/path#awesomeness') // Nada.
})

// Ok, the test function has finished executing...
// We've queued all of these commands and now
// Cypress will begin running them in order!
```

Cypress doesn't kick off the browser automation magic until the test function exits.

{% note success Core Concept %}
Each Cypress command (and chain of commands) returns immediately, having only been appended to a queue of commands to be executed at a later time.

You purposefully **cannot** do anything useful with the return value from a command. Commands are enqueued and managed entirely behind the scenes.

We've designed our API this way because the DOM is a highly mutable object that constantly goes stale. For Cypress to prevent flake, and know when to proceed, we manage commands in a highly controlled deterministic way.
{% endnote %}

{% note info "Why can't I use async / await?" %}
If you're a modern JS programmer you might hear "asynchronous" and think: **why can't I just use `async/await`** instead of learning some proprietary API?

Cypress's APIs are built very differently from what you're likely used to: but these design patterns are incredibly intentional. We'll go into more detail later in this guide.
{% endnote %}

## Commands Run Serially

After a test function is finished running, Cypress goes to work executing the commands that were enqueued using the `cy.*` command chains. The test above would cause an execution in this order:

1. Visit a URL.
2. Find an element by its selector.
3. Perform a click action on that element.
4. Grab the URL.
5. Assert the URL to include a specific *string*.

These actions will always happen serially (one after the other), never in parallel (at the same time). Why?

To illustrate this, let's revisit that list of actions and expose some of the hidden **✨ magic ✨** Cypress does for us at each step:

1. Visit a URL
  ✨ **and wait for the page `load` event to fire after all external resources have loaded**✨
2. Find an element by its selector
  ✨ **and retry repeatedly until it is found in the DOM** ✨
3. Perform a click action on that element
  ✨ **after we wait for the element to reach an {% url 'actionable state' interacting-with-elements %}** ✨
4. Grab the URL and...
5. Assert the URL to include a specific *string*
  ✨ **and retry repeatedly until the assertion passes** ✨

As you can see, Cypress does a lot of extra work to ensure the state of the application matches what our commands expect about it. Each command may resolve quickly (so fast you won't see them in a pending state) but others may take seconds, or even dozens of seconds to resolve.

While most commands time out after a few seconds, other specialized commands that expect particular things to take much longer like {% url `cy.visit()` visit %} will naturally wait longer before timing out.

These commands have their own particular timeout values which are documented in our {% url 'configuration' configuration %}.

{% note success Core Concept %}
Any waiting or retrying that is necessary to ensure a step was successful must complete before the next step begins. If they don't complete successfully before the timeout is reached, the test will fail.
{% endnote %}

## Commands Are Promises

This is the big secret of Cypress: we've taken our favorite pattern for composing JavaScript code, Promises, and built them right into the fabric of Cypress. Above, when we say we're enqueuing actions to be taken later, we could restate that as "adding Promises to a chain of Promises".

Let's compare the prior example to a fictional version of it as raw, Promise-based code:

### Noisy Promise demonstration. Not valid code.

```js
it('changes the URL when "awesome" is clicked', function() {
  // THIS IS NOT VALID CODE.
  // THIS IS JUST FOR DEMONSTRATION.
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

### How Cypress really looks, Promises wrapped up and hidden from us.

```javascript
it('changes the URL when "awesome" is clicked', function() {
  cy.visit('/my/resource/path')

  cy.get('.awesome-selector')
    .click()

  cy.url()
    .should('include', '/my/resource/path#awesomeness')
})
```

Big difference! In addition to reading much cleaner, Cypress does more than this, because **Promises themselves have no concepts of retry-ability**.

Without **retry-ability**, assertions would randomly fail. This would lead to flaky, inconsistent results. This is also why we cannot use new JS features like `async / await`.

Cypress cannot yield you primitive values isolated away from other commands. That is because Cypress commands act internally like an asynchronous stream of data that only resolve after being affected and modified **by other commands**. This means we cannot yield you discrete values in chunks because we have to know everything about what you expect before handing off a value.

These design patterns ensure we can create **deterministic**, **repeatable**, **consistent** tests that are **flake free**.

{% note info %}
Cypress is built using Promises that come from {% url "Bluebird" http://bluebirdjs.com/ %}. However, Cypress commands do not return these typical Promise instances. Instead we return what's called a `Chainer` that acts like a layer sitting on top of the internal Promise instances.

For this reason you cannot **ever** return or assign anything useful from Cypress commands.

If you'd like to learn more about handling asynchronous Cypress Commands please read our {% url 'Core Concept Guide' variables-and-aliases %}.
{% endnote %}

## Commands Are Not Promises

The Cypress API is not an exact 1:1 implementation of Promises. They have Promise like qualities and yet there are important differences you should be aware of.

1. You cannot **race** or run multiple commands at the same time (in parallel).
2. You cannot 'accidentally' forget to return or chain a command.
3. You cannot add a `.catch` error handler to a failed command.

There are *very* specific reasons these limitations are built into the Cypress API.

The whole intention of Cypress (and what makes it very different from other testing tools) is to create consistent, non-flaky tests that perform identically from one run to the next. Making this happen isn't free - there are some trade-offs we make that may initially seem unfamiliar to developers accustomed to working with Promises.

Let's take a look at each trade-off in depth:

### You cannot race or run multiple commands at the same time

Cypress guarantees that it will execute all of its commands *deterministically* and identically every time they are run.

A lot of Cypress commands *mutate* the state of the browser in some way.

- {% url `cy.request()` request %} automatically gets + sets cookies to and from the remote server.
- {% url `cy.clearCookies()` clearcookies %} clears all of the browser cookies.
- {% url `.click()` click %} causes your application to react to click events.

None of the above commands are *idempotent*; they all cause side effects. Racing commands is not possible because commands must be run in a controlled, serial manner in order to create consistency. Because integration and e2e tests primarily mimic the actions of a real user, Cypress models its command execution model after a real user working step by step.

### You cannot accidentally forget to return or chain a command

In real promises it's very easy to 'lose' a nested Promise if you don't return it or chain it correctly.

Let's imagine the following Node.js code:

```js
// assuming we've promisified our fs module
return fs.readFile('/foo.txt', 'utf8')
.then((txt) => {
  // oops we forgot to chain / return this Promise
  // so it essentially becomes 'lost'.
  // this can create bizarre race conditions and
  // bugs that are difficult to track down
  fs.writeFile('/foo.txt', txt.replace('foo', 'bar'))

  return fs.readFile('/bar.json')
  .then((json) => {
    // ...
  })
})
```

The reason this is even possible to do in the Promise world is because you have the power to execute multiple asynchronous actions in parallel. Under the hood, each promise 'chain' returns a promise instance that tracks the relationship between linked parent and child instances.

Because Cypress enforces commands to run *only* serially, you do not need to be concerned with this in Cypress. We enqueue all commands onto a *global* singleton. Because there is only ever a single command queue instance, it's impossible for commands to ever be *'lost'*.

You can think of Cypress as "queueing" every command. Eventually they'll get run and in the exact order they were used, 100% of the time.

There is no need to ever `return` Cypress commands.

### You cannot add a `.catch` error handler to a failed command

In Cypress there is no built in error recovery from a failed command. A command and its assertions all *eventually* pass, or if one fails, all remaining commands are not run, and the test fails.

You might be wondering:

> How do I create conditional control flow, using if/else? So that if an element does (or doesn't) exist, I choose what to do?

The problem with this question is that this type of conditional control flow ends up being non-deterministic. This means it's impossible for a script (or robot), to follow it 100% consistently.

In general, there are only a handful of very specific situations where you *can* create control flow. Asking to recover from errors is actually just asking for another `if/else` control flow.

With that said, as long as you are aware of the potential pitfalls with control flow, it is possible to do this in Cypress!

You can read all about how to do {% url 'conditional testing' conditional-testing %} here.

# Assertions

As we mentioned previously in this guide:

> Assertions describe the **desired** state of your **elements**, your **objects**, and your **application**.

What makes Cypress unique from other testing tools is that commands **automatically retry** their assertions. In fact, they will look "downstream" at what you're expressing and modify their behavior to make your assertions pass.

You should think of assertions as **guards**.

Use your **guards** to describe what your application should look like, and Cypress will automatically **block, wait, and retry** until it reaches that state.

{% note success 'Core Concept' %}
Each API Command documents its behavior with assertions - such as how it retries or waits for assertions to pass.
{% endnote %}

## Asserting in English

Let's look at how you'd describe an assertion in english:

> After clicking on this `<button>`, I expect its class to eventually be `active`.

To express this in Cypress you'd write:

```js
cy.get('button').click().should('have.class', 'active')
```

This above test will pass even if the `.active` class is applied to the button asynchronously - or after a indeterminate period of time.

```javascript
// even though we are adding the class
// after two seconds...
// this test will still pass!
$('button').on('click', (e) => {
  setTimeout(() => {
    $(e.target).addClass('active')
  }, 2000)
})
```

Here's another example.

> After making an HTTP request to my server, I expect the response body to equal `{name: 'Jane'}`

To express this with an assertion you'd write:

```js
cy.request('/users/1').its('body').should('deep.eq', { name: 'Jane' })
```

## When To Assert?

Despite the dozens of assertions Cypress makes available to you, sometimes the best test may make no assertions at all! How can this be? Aren't assertions a basic part of testing?

### Consider this example:

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

Without a single explicit assertion, there are dozens of ways this test can fail! Here's a few:

- The initial {% url `cy.visit()` visit %} could respond with something other than success.
- Any of the {% url `cy.get()` get %} commands could fail to find their elements in the DOM.
- The element we want to {% url `.click()` click %} on could be covered by another element.
- The input we want to {% url `.type()` type %} into could be disabled.
- Form submission could result in a non-success status code.
- The in-page JS (the application under test) could throw an error.

Can you think of any more?

{% note success Core Concept %}
With Cypress, you don't have to assert to have a useful test. Even without assertions, a few lines of Cypress can ensure thousands of lines of code are working properly across the client and server!

This is because many commands have a built in {% urlHash 'Default Assertion' Default-Assertions %} which offer you a high level of guarantee.
{% endnote %}

## Default Assertions

Many commands have a default, built-in assertion, or rather have requirements that may cause it to fail without needing an explicit assertion you've added.

### For instance:

- {% url `cy.visit()` visit %} expects the page to send `text/html` content with a `200` status code.
- {% url `cy.request()` request %} expects the remote server to exist and provide a response.
- {% url `cy.contains()` contains %} expects the element with content to eventually exist in the DOM.
- {% url `cy.get()` get %} expects the element to eventually exist in the DOM.
- {% url `.find()` find %} also expects the element to eventually exist in the DOM.
- {% url `.type()` type %} expects the element to eventually be in a *typeable* state.
- {% url `.click()` click %} expects the element to eventually be in an *actionable* state.
- {% url `.its()` its %} expects to eventually find a property on the current subject.

Certain commands may have a specific requirement that causes them to immediately fail without retrying: such as {% url `cy.request()` request %}.

Others, such as DOM based commands will automatically retry and wait for their corresponding elements to exist before failing.

Even more - action commands will automatically wait for their element to reach an {% url 'actionable state' interacting-with-elements %} before failing.

{% note success Core Concept %}
All DOM based commands automatically wait for their elements to exist in the DOM.

You don't need to write {% url "`.should('exist')`" should %} after a DOM based command, unless you chain extra `.should()` assertions.
{% endnote %}

{% note danger "Negative DOM assertions" %}
If you chain any `.should()` command, the default `.should('exist')` is not asserted. This does not matter for most *positive* assertions, such as `.should('have.class')`, because those imply existence in the first place, but if you chain *negative* assertions ,such as `.should('not.have.class')`, they will pass even if the DOM element doesn't exist:

```
cy.get('.does-not-exist').should('not.be.visible')         // passes
cy.get('.does-not-exist').should('not.have.descendants')   // passes
```

This also applies to custom assertions such as when passing a callback:

```
// passes, provided the callback itself passes
cy.get('.does-not-exist').should(($element) => {   
  expect($element.find('input')).to.not.exist 
})
```

There's an {% url 'open discussion' https://github.com/cypress-io/cypress/issues/205 %} about this behavior.
{% endnote %}

These rules are pretty intuitive, and most commands give you the flexibility to override or bypass the default ways they can fail, typically by passing a `{force: true}` option.

### Example #1: Existence and Actionability

```js
cy
  // there is a default assertion that this
  // button must exist in the DOM before proceeding
  .get('button')

  // before issuing the click, this button must be "actionable"
  // it cannot be disabled, covered, or hidden from view.
  .click()
```

Cypress will automatically *wait* for elements to pass their default assertions. Just like with explicit assertions you've added, all of these assertions share the *same* timeout values.

### Example #2: Reversing the Default Assertion

Most of the time, when querying for elements, you expect them to eventually exist. But sometimes you wish to wait until they *don't* exist.

All you have to do is add that assertion and Cypress will **reverse** its rules waiting for elements to exist.

```js
// now Cypress will wait until this
// <button> is not in the DOM after the click
cy.get('button.close').click().should('not.exist')

// and now make sure this #modal does not exist in the DOM
// and automatically wait until it's gone!
cy.get('#modal').should('not.exist')
```

{% note success 'Core Concept' %}
By adding {% url "`.should('not.exist')`" should %} to any DOM command, Cypress will reverse its default assertion and automatically wait until the element does not exist.
{% endnote %}

### Example #3: Other Default Assertions

Other commands have other default assertions not related to the DOM.

For instance, {% url `.its()` its %} requires that the property you're asking about exists on the object.

```js
// create an empty object
const obj = {}

// set the 'foo' property after 1 second
setTimeout(() => {
  obj.foo = 'bar'
}, 1000)

// .its() will wait until the 'foo' property is on the object
cy.wrap(obj).its('foo')
```

## List of Assertions

Cypress bundles {% url "`Chai`" bundled-tools#Chai %}, {% url "`Chai-jQuery`" bundled-tools#Chai-jQuery %}, and {% url "`Sinon-Chai`" bundled-tools#Sinon-Chai %} to provide built-in assertions. You can see a comprehensive list of them in {% url 'the list of assertions reference' assertions %}. You can also {% url "write your own assertions as Chai plugins" recipes#Adding-Chai-Assertions %} and use them in Cypress.

## Writing Assertions

There are two ways to write assertions in Cypress:

1. **Implicit Subjects:** Using {% url `.should()` should %} or {% url `.and()` and %}.
2. **Explicit Subjects:** Using `expect`.

## Implicit Subjects

Using {% url `.should()` should %} or {% url `.and()` and %} commands is the preferred way of making assertions in Cypress. These are typical Cypress commands, which means they apply to the currently yielded subject in the command chain.

```javascript
// the implicit subject here is the first <tr>
// this asserts that the <tr> has an .active class
cy.get('tbody tr:first').should('have.class', 'active')
```

You can chain multiple assertions together using {% url `.and()` and %}, which is just another name for {% url `.should()` should %} that makes things more readable:

```js
cy.get('#header a')
  .should('have.class', 'active')
  .and('have.attr', 'href', '/users')
```

Because {% url "`.should('have.class')`" should %} does not change the subject, {% url "`.and('have.attr')`" and %} is executed against the same element. This is handy when you need to assert multiple things against a single subject quickly.

If we wrote this assertion in the explicit form "the long way", it would look like this:

```js
cy.get('tbody tr:first').should(($tr) => {
  expect($tr).to.have.class('active')
  expect($tr).to.have.attr('href', '/users')
})
```

The implicit form is much shorter! So when would you want to use the explicit form?

Typically when you want to:
  - Assert multiple things about the same subject
  - Massage the subject in some way prior to making the assertion

## Explicit Subjects

Using `expect` allows you to pass in a specific subject and make an assertion about it. This is probably how you're used to seeing assertions written in unit tests:

```js
// the explicit subject here is the boolean: true
expect(true).to.be.true
```

{% note info Did you know you can write Unit Tests in Cypress? %}
Check out our example recipes for {% url 'unit testing' recipes %} and {% url 'unit testing React components' recipes#React-with-Enzyme %}.
{% endnote %}

Explicit assertions are great when you want to:

- Perform custom logic prior to making the assertion.
- Make multiple assertions against the same subject.

The {% url `.should()` should %} command allows us to pass a callback function that takes the yielded subject as its first argument. This works just like {% url `.then()` then %}, except Cypress automatically **waits and retries** for everything inside of the callback function to pass.

{% note info 'Complex Assertions' %}
The example below is a use case where we are asserting across multiple elements. Using a {% url `.should()` should %} callback function is a great way to query from a **parent** into multiple children elements and assert something about their state.

Doing so enables you to **block** and **guard** Cypress by ensuring the state of descendants matches what you expect without needing to query them individually with regular Cypress DOM commands.
{% endnote %}

```javascript
cy
  .get('p')
  .should(($p) => {
    // massage our subject from a DOM element
    // into an array of texts from all of the p's
    let texts = $p.map((i, el) => {
      return Cypress.$(el).text()
    })

    // jQuery map returns jQuery object
    // and .get() converts this to a simple array
    texts = texts.get()

    // array should have length of 3
    expect(texts).to.have.length(3)

    // with this specific content
    expect(texts).to.deep.eq([
      'Some text from first p',
      'More text from second p',
      'And even more text from third p'
    ])
  })
```

{% note danger Make sure `.should()` is safe %}
When using a callback function with {% url `.should()` should %}, be sure that the entire function can be executed multiple times without side effects. Cypress applies its retry logic to these functions: if there's a failure, it will repeatedly rerun the assertions until the timeout is reached. That means your code should be retry-safe. The technical term for this means your code must be **idempotent**.
{% endnote %}

# Timeouts

Almost all commands can time out in some way.

All assertions, whether they're the default ones or whether they've been added by you all share the same timeout values.

## Applying Timeouts

You can modify a command's timeout. This timeout affects both its default assertions (if any) and any specific assertions you've added.

Remember because assertions are used to describe a condition of the previous commands - the `timeout` modification goes on the previous commands *not the assertions*.

### Example #1: Default Assertion

```js
// because .get() has a default assertion
// that this element exists, it can time out and fail
cy.get('.mobile-nav')
```

Under the hood Cypress:

- Queries for the element `.mobile-nav`
  ✨**and waits up to 4 seconds for it to exist in the DOM**✨

### Example #2: Additional Assertions

```js
// we've added 2 assertions to our test
cy
  .get('.mobile-nav')
  .should('be.visible')
  .and('contain', 'Home')
```

Under the hood Cypress:

- Queries for the element `.mobile-nav`
  ✨**and waits up to 4 seconds for it to exist in the DOM**✨
  ✨**and waits up to 4 seconds for it to be visible**✨
  ✨**and waits up to 4 seconds for it to contain the text: 'Home'**✨

The *total* amount of time Cypress will wait for *all* of the assertions to pass is for the duration of the {% url "`cy.get()`" get %} `timeout` (which is 4 seconds).

Timeouts can be modified per command and this will affect all default assertions and any assertions chained after that command.

### Example #3: Modifying Timeouts

```js
// we've modified the timeout which affects default + added assertions
cy
  .get('.mobile-nav', { timeout: 10000 })
  .should('be.visible')
  .and('contain', 'Home')
```

Under the hood Cypress:

- Gets the element `.mobile-nav`
  ✨**and waits up to 10 seconds for it to exist in the DOM**✨
  ✨**and waits up to 10 seconds for it to be visible**✨
  ✨**and waits up to 10 seconds for it to contain the text: 'Home'**✨

Notice that this timeout has flowed down to all assertions and Cypress will now wait *up to 10 seconds total* for all of them to pass.

## Default Values

Cypress offers several different timeout values based on the type of command.

We've set their default timeout durations based on how long we expect certain actions to take.

For instance:
- {% url `cy.visit()` visit %} loads a remote page and does not resolve *until all of the external resources complete their loading phase*. This may take awhile, so its default timeout is set to `60000ms`.
- {% url `cy.exec()` exec %} runs a system command such as *seeding a database*. We expect this to potentially take a long time, and its default timeout is set to `60000ms`.
- {% url `cy.wait()` wait %} actually uses 2 different timeouts. When waiting for a {% url 'routing alias' variables-and-aliases#Routes %}, we wait for a matching request for `5000ms`, and then additionally for the server's response for `30000ms`. We expect your application to make a matching request quickly, but we expect the server's response to potentially take much longer.

That leaves most other commands including all DOM based commands to time out by default after 4000ms.

<!-- ***Why only 4 seconds? That sounds low!***

If you've used other testing frameworks, you might wonder why this value is so low. In fact we regularly see our some users initially increasing it sometimes up to 25x!

You shouldn't need to wait for your application to render DOM elements for more than 4 seconds!

Let's look at why you're likely wanting to increase this, and some best practices.

The most common scenario is that DOM elements render *after* a series of network requests. The network requests themselves must go over the internet, leaving them susceptible to be potentially slow.

One of the typical anti-patterns we see is not properly

One of the typical hurdles you will need to overcome is *slow tests*. -->
