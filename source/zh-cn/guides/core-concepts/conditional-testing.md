---
title: 条件测试
---

{% note info %}
# {% fa fa-graduation-cap %} 你将会学到

- 条件测试时你测试的一个很好的选择
- 无法进行条件测试的情况
- 处理条件测试常见场景的策略
{% endnote %}

# 定义

条件测试是指常见的编程模式：

> If X, then Y, else Z

我们许多用户都在询问如何在Cypress完成这个看似简单的常规用法。

以下是一些示例：

- 无论元素是否存在，我该如何做一些不同的事情？
- 我的应用程序做 A/B测试，我该如何解释？
- 我的用户收到“欢迎向导”，但是现有用户没有。我是否可以随时关闭向导，如果没有显示，请忽略它。
- 我可以从Cypress失败的命令中恢复测试程序么？例如 {% url "`cy.get()`" get %} 找不到元素。
- 我正在尝试编写动态测试，根据页面上的文本执行不同的操作。
- 我想自动找到所有 `<a>` 元素，根据我找到的元素，我想检查每个链接是否有效。

问题是 - 虽然上面的情况看起来很简单，但是以这种方式编写测试通常会导致测试不稳定，随机失败以及难以追踪边缘情况。

让我们来研究为什么以及如何克服这些问题...

# 问题

现代JavaScript应用程序具有高度动态性和可变性。他们的状态和DOM在一段时间内不断变化。

**条件测试**的问题是它只能在状态稳定时使用。在现代应用中，了解状态何时稳定通常是不可能的。

对于一个人 - 我们假设状态总是相同的，如果事情从现在开始变化10毫秒或100毫秒，我们甚至可能不会注意到这种变化。

对于一个机器人 - 这10毫秒甚至代表了十亿多的时钟周期。时间尺度差异令人难以置信。

人类还有直觉。如果单击一个按钮并看到加载一个加载中的图片，那么你将假设该状态处于不稳定状态并将自动等待它完成。

机器人没有直觉 - 它将完全按照程序设计来执行。

为了说明这点，让我们列举一个非常简单的例子来尝试有条件的测试不稳定状态。

## DOM不稳定

```js
// 你的应用程序代码

// 随机的时间
const random = Math.random() * 100

// 创建一个 <button> 元素
const btn = document.createElement('button')

// 把它附加到body元素上
document.body.appendChild(btn)

setTimeout(() => {
  // 在不确定的时间后把该按钮的class属性设置为active
  btn.setAttribute('class', 'active')
}, random)
```

```js
// 你的Cypress测试代码
it('does something different based on the class of the button', function () {
  // 尝试重复执行这个测试
  // 你将会发现这个测试有时候能通过测试
  // 但是有时候却是不能通过测试

  cy.get('button').then(($btn) => {
    if ($btn.hasClass('active')) {
      // 如果它是active我们做其它事情
    } else {
      // 做其它事情
    }
  })
})
```

你能看到这个问题吗？这个测试是不确定的。`<button>`有时候会有 `active` 而有时候又没有。在**大多数**情况下，你不能依赖DOM的状态来确定你应该有条件的做什么。

这就是片状测试的核心。在Cypress中，我们在设计API的时候就确保了每一步都能抵御这种类型的情况。

# 目前的情况

对DOM进行条件测试的**唯一**方法是，如果你100%确定状态已经“稳定”并且没有可能的方式进行更改。

这就对了！在任何其他情况下，如果你尝试依赖DOM的状态进行条件测试，则会出现片状测试。

我们来看几个例子。

## Server side rendering

If your application is server side rendered without JavaScript that asynchronously modifies the DOM - congratulations, you can easily do conditional testing on the DOM!

Why? Because if the DOM is not going to change after the `load` event occurs, then it can accurately represent a stable state of truth.

You can safely skip down to the bottom where we provide examples of conditional testing.

## Client side rendering

However, in most modern applications these days - when the `load` event occurs, usually nothing has rendered on the screen. It is usually at this moment that your scripts begin to load dynamic content and begin to render asynchronously.

Unfortunately, it is not possible for you to use the DOM to do conditional testing. To do this would require you to know with 100% guarantee that your application has finished all asynchronous rendering and that there are no pending network requests, setTimeouts, intervals, postMessage, or async/await code.

This is difficult to do (if not impossible) without making changes to your application. You could use a library like {% url "Zone.js" https://github.com/angular/zone.js/ %}, but even that does not capture every async possibility.

In other words, you cannot do conditional testing safely if you want your tests to run 100% consistently.

But do not fret - there are better workarounds to still achieve conditional testing **without** relying on the DOM. You just have to *anchor* yourself to another piece of truth that is not mutable.

# The strategies

If you are unable to guarantee that the DOM is stable - don't worry, there are other ways you can do conditional testing or work around the problems inherent with it.

**You could:**

- Remove the need to ever do conditional testing.
- Force your application to behave deterministically.
- Check other sources of truth (like your server or database).
- Embed data into other places (cookies / local storage) you could read off.
- Add data to the DOM that you can read off to know how to proceed.

Let's explore some examples of conditional testing that will pass or fail 100% of the time.

## A/B campaign

In this example let's assume you visit your website and the content will be different based on which A/B campaign your server decides to send. Perhaps it is based on geo-location, IP address, time of day, locale, or other factors that are difficult to control. How can you write tests in this manner?

Easily: control which campaign gets sent, or provide a reliable means to know which one it is.

### Use URL query params:

```js
// tell your backend server which campaign you want sent
// so you can deterministically know what it is ahead of time
cy.visit('https://app.com?campaign=A')

...

cy.visit('https://app.com?campaign=B')

...

cy.visit('https://app.com?campaign=C')
```

Now there is not even a need to do conditional testing since you are able to know ahead of time what campaign was sent. Yes, this may require server side updates, but you have to make an untestable app testable if you want to test it!

### Use the server:

Alternatively, if your server saves the campaign with a session, you could just ask your server to tell you which campaign you are on.

```js
// this sends us the session cookies
cy.visit('https://app.com')

// assuming this sends us back
// the campaign information
cy.request('https://app.com/me')
  .its('body.campaign')
  .then((campaign) => {
    // runs different cypress test code
    // based on the type of campaign
    return campaigns.test(campaign)
  })
```

### Use session cookies:

Perhaps an even easier way to test this is if your server sent the campaign in a session cookie that you could read off.

```js
cy.visit('https://app.com')
cy.getCookie('campaign')
  .then((campaign) => {
    return campaigns.test(campaign)
  })
```

### Embed data in the DOM:

Another valid strategy would be to embed data directly into the DOM - but do so in a way where this data is **always** present and query-able. It would have to be present 100% of the time, else this would not work.

```js
cy.get('html')
  .should('have.attr', 'data-campaign').then((campaign) => {
    return campaigns.test(campaign)
  })
```

## Welcome wizard

In this example, let's imagine you are running a bunch of tests and each time you load your application, it may show a "Welcome Wizard" modal.

In this situation, you want to close the wizard when it is present and ignore it if it is not.

The problem with this is that if the wizard renders asynchronously (as it likely does) you cannot use the DOM to conditionally dismiss it.

Once again - we will need another reliable way to achieve this without involving the DOM.

These patterns are pretty much the same as before:

### Use the URL to control it:

```js
// dont show the wizard
cy.visit('https://app.com?wizard=0')
```

```js
// show the wizard
cy.visit('https://app.com?wizard=1')
```

We would likely just need to update our client side code to check whether this query param is present. Now we know ahead of time whether it will or will not be shown.

### Use Cookies to know ahead of time:

In the case where you cannot control it, you can still conditionally dismiss it **if** you know whether it is going to be shown.

```js
cy.visit('https://app.com')
cy.getCookie('showWizard')
  .then((val) => {
    if (val) {
      // dismiss the wizard conditionally by enqueuing these
      // three additional commands
      cy.get('#wizard').contains('Close').click()
    }
  })
  .get(...)    // more commands here
  .should(...) // more commands here
  .click()     // more commands here
```

### Use your server or database:

If you store and/or persist whether to show the wizard on the server, then just ask it.

```js
cy.visit('https://app.com')
cy.request('https://app.com/me')
  .its('body.showWizard')
  .then((val) => {
    if (val) {
      // dismiss the wizard conditionally by enqueuing these
      // three additional commands
      cy.get('#wizard').contains('Close').click()
    }
  })
  .get(...)    // more commands here
  .should(...) // more commands here
  .click()     // more commands here
```

Alternatively, if you are creating users, it might just be easier to create the user and set whether you want the wizard to be shown ahead of time. That would avoid this check later.

### Embed data in the DOM:

Another valid strategy would be to embed data directly into the DOM but to do so in a way that the data is **always** present and query-able. The data would have to be present 100% of the time, otherwise this strategy would not work.

```js
cy.get('html').should('have.attr', 'data-wizard').then((wizard) => {
  if (wizard) {
    // dismiss the wizard conditionally by enqueuing these
    // three additional commands
    cy.get('#wizard').contains('Close').click()
  }
})
.get(...)    // more commands here
.should(...) // more commands here
.click()     // more commands here
```

## Element existence

In the case where you **are** trying to use the DOM to do conditional testing, you can utilize the ability to synchronously query for elements in Cypress to create control flow.

{% note warning %}
In the event you did not read a word above and skipped down here, we will reiterate it one more time:

You cannot do conditional testing on the DOM unless you are either:

- Server side rendering with no asynchronous JavaScript.
- Using client side JavaScript that **only** ever does synchronous rendering.

It is crucial that you understand how your application works else you will write flaky tests.
{% endnote %}

Let's imagine we have a scenario where our application may do two separate things that we are unable to control. In other words you tried every strategy above and for whatever reason you were unable to know ahead of time what your application will do.

Testing this in Cypress is possible.

```js
// app code
$('button').on('click', (e) => {
  // do something synchronously randomly
  if (Math.random() < .5) {
    // append an input
    $('<input />').appendTo($('body'))
  } else {
    // or append a textarea
    $('<textarea />').appendTo($('body'))
  }
})
```

```js
// click the button causing the new
// elements to appear
cy.get('button').click()
cy.get('body').then(($body) => {
  // synchronously query from body
  // to find which element was created
  if ($body.find('input').length) {
    // input was found, do something else here
    return 'input'
  }

  // else assume it was textarea
  return 'textarea'
})
  .then((selector) => {
    // selector is a string that represents
    // the selector we could use to find it
    cy.get(selector).type(`found the element by selector ${selector}`)
  })
```

We will reiterate one more time. Had the `<input>` or the `<textarea>` been rendered asynchronously, you could not use the pattern above. You would have to involve arbitrary delays which will not work in every situation, will slow down your tests, and will still leave chances that your tests are flaky (and are an all-around anti-pattern).

Cypress is built around creating **reliable tests**. The secret to writing good tests is to provide as much "state" and "facts" to Cypress and to "guard it" from issuing new commands until your application has reached the desired state it needs to proceed.

Doing conditional testing adds a huge problem - that the test writer themselves are unsure what the given state will be. In those situations, the only reliable way to have accurate tests is to embed this dynamic state in a reliable and consistent way.

If you are not sure if you have written a potentially flaky test, there is an easy way to figure it out. Repeat the test an excessive number of times, and then repeat by modifying the Developer Tools to throttle the Network and the CPU. This will create different loads that simulate different environments (like CI). If you've written a good test, it will pass or fail 100% of the time.

```js
Cypress._.times(100, (i) => {
  it(`num ${i + 1} - test the thing conditionally`, () => {
    // do the conditional bits 100 times
  })
})
```

## Dynamic text

The pattern of doing something conditionally based on whether or not certain text is present is identical to element existence above.

### Conditionally check whether an element has certain text:

```js
// this only works if there's 100% guarantee
// body has fully rendered without any pending changes
// to its state
cy.get('body').then(($body) => {
    // synchronously ask for the body's text
    // and do something based on whether it includes
    // another string
    if ($body.text().includes('some string')) {
      // yup found it
      cy.get(...).should(...)
    } else {
      // nope not here
      cy.get(...).should(...)
    }
  })
```

# Error Recovery

Many of our users ask how they can recover from failed commands.

> If I had error handling, I could just try to find X and if X fails go find Y

Because error handling is a common idiom in most programming languages, and especially in Node.js, it seems reasonable to expect to do that in Cypress.

However, this is really the same question as asking to do conditional testing just wrapped up in a slightly different implementation detail.

For instance you may want to do this:

**The following code is not valid, you cannot add error handling to Cypress commands. The code is just for demonstration purposes.**
```js
cy.get('button').contains('hello')
  .catch((err) => {
    // oh no the button wasn't found
    // (or something else failed)
    cy.get('somethingElse').click()
  })
```

If you've been reading along, then you should already have a grasp on why trying to implement conditional code with asynchronous rendering is not a good idea. If the test writer cannot accurately predict the given state of the system, then neither can Cypress. Error handling offers no additional proof this can be done deterministically.

You should think of failed commands in Cypress as akin to uncaught exceptions in server side code. It is not possible to try to recover in those scenarios because the system has transitioned to an unreliable state. Instead you generally always opt to crash and log. When Cypress fails the test - that is exactly what it is doing. Bailing out, skipping any remaining commands in the test, and logging out the failure.

But... for the sake of the argument, let's imagine for a moment you did have error handling in Cypress.

Enabling this would mean that for every single command, it would recover from errors, but only after each applicable command timeout was reached. Since timeouts start at 4 seconds (and exceed from there), this means that it would only fail after a long, long time.

Let's reimagine our "Welcome Wizard" example from before.

**The following code is not valid, you cannot add error handling to Cypress commands. The code is just for demonstration purposes.**
```js
// great error recovery code
function keepCalmAndCarryOn () {
  cy.get(...).should(...).click()
}

cy
  .get('#wizard').contains('Close').click()
  .catch((err) => {
    // no problem, i guess the wizard didn't exist
    // or something... no worries
    keepCalmAndCarryOn()
  })
  .then(keepCalmAndCarryOn)
```

In the **best** case scenario, we have wasted at LEAST 4 seconds waiting on the `<#wizard>` element to possibly exist before we errored and continued on.

But in the **worst** case scenario we have a situation where the `<#wizard>` **was** going to be rendered, but it didn't render within our given timeout. Let's assume this was due to a pending network request or WebSocket message or a queued timer, or anything else.

In this situation, not only did we wait a long period of time, but when the `<#wizard>` element was eventually shown it's likely caused an error downstream on other commands.

If you cannot accurately know the state of your application then no matter what programming idioms you have available - **you cannot write 100% deterministic tests**.

Still not convinced?

Not only is this an anti-pattern, but it's an actual logical fallacy.

You may think to yourself... okay fine, but 4 seconds - man that's not enough. Network requests could be slow, let's bump it up to 1 minute!

Even then, it's still possible a WebSocket message could come in... so 5 minutes!

Even then, not enough, it's possible a setTimeout could trigger... 60 minutes.

Continually raising the timeout only beleaguers the point. As you approach infinity your confidence does continue to rise on the chances you could prove the desired state will be reached, but you can never prove it will. Instead you could theoretically be waiting for the heat death of the universe for a condition to come that is only a moment away from happening. There is no way to prove or disprove that it *may* conditionally happen.

You, the test writer must know ahead of time what your application is programmed to do - or have 100% confidence that the state of a mutable object (like the DOM) has stabilized in order to write accurate conditional tests.
