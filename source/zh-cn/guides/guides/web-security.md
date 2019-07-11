---
title: Web安全
---

浏览器坚持严格的{% url "`同源策略`" https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy %}
这意味着当源策略不匹配时，浏览器会限制`<iframes>`之间的访问。

因为Cypress在浏览器内工作，它必须能够随时和远程应用程序直接通信。不幸的是，浏览器自然会阻止Cypress这样做。

为了绕过这些限制，Cypress实现一些策略，包括JavaScript代码、浏览器的内部API，以及`网络代理`，以遵循`同源策略`的规则。我们的目标是完全自动化测试中的应用程序，不需要你修改应用程序的代码——我们*基本上*能做到这一点。

### Cypress在底层做的事情示例：

  - 注入{% url "`document.domain`" https://developer.mozilla.org/en-US/docs/Web/API/Document/domain %}到`text/html`页面。
  - 代理所有的HTTP/HTTPS通信。
  - 改变主机url以匹配被测试应用程序的url。
  - 使用浏览器内部API进行网络层通信。

当Cypress首次加载时，内部Cypress web应用程序托管在一个随机端口上：类似于`http://localhost:65874/__/`。

在测试中发出第一个{% url `cy.visit()` visit %}命令后，Cypress改变它的URL以匹配远程应用程序源，从而解决`同源策略`的第一个主要障碍。你的应用程序代码执行与在Cypress外部执行相同，并且一切都如预期的一样工作。

{% note info 如何支持HTTPS %}
Cypress在底层做了一些非常有趣的事情，使HTTPs站点测试能够正常工作。Cypress使你能够在网络层控制和打桩。因此，Cypress必须分配和管理浏览器证书，以便能够实时修改通信。你会注意到Chrome显示了一个警告，“SSL证书不匹配”。这是正常和正确的。在底层，我们充当自己的CA权威，动态地颁发证书，以便拦截无法访问的请求。我们只对当前正在测试的超域这样做，并绕过其他通信。这就是为什么如果你在Cypress中向另一个主机打开一个选项卡，证书将与预期匹配。
{% endnote %}

# 局限性

需要注意的是，尽管我们尽了**最大努力**确保你的应用程序在Cypress内正常工作，但是你需要注意一些限制。

## 每个测试一个超域

因为Cypress会更改自己的主机URL以匹配你的应用程序的URL，所以它要求你的应用程序在整个测试期间保持在相同的超域中。

如果你试图访问两个不同的超域，Cypress将出错。访问子域名工作正常。你可以在*不同*测试中访问不同的超域，而不是*同一个*测试。

```javascript
cy.visit('https://www.cypress.io')
cy.visit('https://docs.cypress.io') // 一切正常
```

```javascript
cy.visit('https://apple.com')
cy.visit('https://google.com')      // 这将立即出错
```

尽管Cypress试图强制执行此限制，但你的应用程序可以绕过Cypress的检测功能。

### 由于超域限制而导致错误的测试用例示例：

1. {% url `.click()` click %}点击带有`href`指向不同超域的`<a>`。
2. {% url `.submit()` submit %}提交`<form>`导致web服务器重定向到另一个超域。
3. 在应用程序中发出JavaScript重定向，例如`window.location.href = '...'`，转到另一个超域。

在每一种情况下，Cypress都将失去自动操作应用程序的能力，并立即出现错误。

继续阅读，了解如何{% url "处理这些常见问题" web-security#Common-Workarounds %}，甚至完全{% url "禁用web安全" web-security#Disabling-Web-Security %}。

## 跨域iframe

如果你的站点嵌入了一个`<iframe>`，是一个跨域框架，那么Cypress将无法自动化或与这个`<iframe>`通信。

### 使用跨域iframe的例子：

- 嵌入Vimeo或YouTube视频。
- 显示来自Stripe或Braintree的信用卡表单。
- 显示来自Auth0的嵌入式登录表单。
- 显示来自Disqus的评论。

实际上，Cypress“可能”可以像Selenium一样适应这些情况，但是你永远无法从Cypress内部访问这些iframe。

有一种解决方案，你可以使用{% url "`window.postMessage`" https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage %}直接与这些iframe通信并控制它们(如果第三方iframe支持的话)。

除此之外，你必须等待我们实现API来支持这一点(查看我们的{% issue 136 '开放问题' %})，或者你可以{% url "禁用web安全" web-security#Disabling-Web-Security %}。

## 不安全内容

由于Cypress的设计方式，如果你正在测试一个HTTPS站点，那么当你试图导航回一个HTTP站点时，Cypress就会出错。这种行为有助于突出应用程序的*相当严重的安全问题*。

### 访问不安全内容的例子：

```javascript
// 测试代码
cy.visit('https://app.corp.com')
```

在应用程序代码中，设置`cookies`并在浏览器上存储会话。现在让我们假设你的应用程序代码中只有一个`不安全`链接(或JavaScript重定向)。

```html
<!-- 应用程序代码 -->
<html>
  <a href="http://app.corp.com/page2">Page 2</a>
</html>
```

Cypress将立即失败，测试代码如下：

```javascript
// 测试代码
cy.visit('https://app.corp.com')
cy.get('a').click()               // 将立即失败
```

浏览器拒绝在安全页面上显示不安全的内容。因为Cypress最初将URL更改为与`https://app.corp.com`匹配，当浏览器跟随`href`到`http://app.corp.com/page2`时，浏览器将拒绝显示内容。

现在你可能会想，*这听起来像是Cypress的问题，因为当我在Cypress之外处理我的应用程序时，它可以正常工作。*😒

然而，事实是，Cypress在你的应用程序中暴露了一个安全漏洞，你希望它在Cypress中失败。

没有将`secure`标志设置为`true`的`cookies`将作为明文发送到不安全的URL。这使得你的应用程序很容易受到会话劫持。


即使你的web服务器强制`301重定向`回HTTPS站点，此安全漏洞仍然存在。原始HTTP请求仍然发出一次，暴露了不安全的会话信息。

### 解决方法

只需更新HTML或JavaScript代码，不导航到不安全的HTTP页面，而是只使用HTTPS。另外，请确保cookie的`secure`标志设置为`true`。

如果你无法控制代码，或者无法解决这个问题，你可以通过{% url "禁用web安全" web-security#Disabling-Web-Security %}来绕过Cypress中的这个限制。

# 常见的解决方法

让我们研究一下你在测试代码中可能遇到的跨域错误，并分析一下如何在Cypress中解决这些错误。

## 外部导航

你可能遇到此错误的最常见情况是，单击`<a>`导航到另一个超域。

```html
<!-- 在`localhost:8080`上提供的应用程序代码 -->
<html>
  <a href="https://google.com">Google</a>
</html>
```

```javascript
// 测试代码
cy.visit('http://localhost:8080') // where your web server + HTML is hosted
cy.get('a').click()               // browser attempts to load google.com, Cypress errors
```

基本上没有任何理由访问测试中无法控制的站点。它容易出错，速度很慢。

相反，你只需要测试`href`属性是否正确！

```javascript
// 这样做要容易得多，运行速度也会快得多
cy.visit('http://localhost:8080')
cy.get('a').should('have.attr', 'href', 'https://google.com') // 没有页面被加载
```

好吧，但假设你担心`google.com`提供正确的HTML内容。你会怎么测试呢？简单！只需直接向它发送一个{% url `cy.request()` request %}*不绑定到CORS或同源策略*。

```javascript
cy.visit('http://localhost:8080')
cy.get('a').then(($a) => {
  // 从<a>中取出完全限定的href
  const url = $a.prop('href')

  // 向它发起cy.request
  cy.request(url).its('body').should('include', '</html>')
})
```

还不满意吗？你真的想点击进入另一个应用程序吗？好的，那么请阅读关于{% url "禁用web安全" web-security#Disabling-Web-Security %}的内容。

## 表单提交重定向

当你提交常规HTML表单时，浏览器将遵循此`HTTP(s)请求`。


```html
<!-- 在`localhost:8080`上提供的应用程序代码 -->
<html>
  <form method="POST" action="/submit">
    <input type="text" name="email" />
    <input type="submit" value="Submit" />
  </form>
</html>
```

```javascript
cy.visit('http://localhost:8080')
cy.get('form').submit()           // 提交表单
```

如果处理`/submit`路由的后端服务器将`30x`重定向到另一个超域，则会得到`跨域`错误。

```javascript
//假设这是localhost:8080服务器上的某个node/express代码

app.post('/submit', (req, res) => {
  // 将浏览器重定向到google.com
  res.redirect('https://google.com')
})
```

一个常见的用例是单点登录(SSO)。在这种情况下，你可以`POST`到不同的服务器，并被重定向到其他地方（通常在URL中使用会话令牌）。

如果是这种情况，不要担心—你可以使用{% url `cy.request()` request %}绕过它。{% url `cy.request()` request %}很特殊，因为它*不绑定到CORS或同源策略*。

事实上，我们可以完全绕过最初的访问，直接`POST`到你的`SSO`服务器。

```javascript
cy.request('POST', 'https://sso.corp.com/auth', { username: 'foo', password: 'bar' })
  .then((response) => {
    // 取出location重定向
    const loc = response.headers['Location']

    // 从url中解析出令牌(假设其中包含令牌)
    const token = parseOutMyToken(loc)

    // 对web应用程序期望的令牌做些什么
    // 其行为可能与SSO在底层执行的行为相同
    // 假设它处理这样的查询字符串令牌
    cy.visit('http://localhost:8080?token=' + token)

    // 如果不需要使用令牌，有时可以直接访问location头部
    cy.visit(loc)
  })
```

不适合你？不知道如何设置你的令牌？如果仍然需要重定向到SSO服务器，可以阅读关于{% url "禁用web安全" web-security#Disabling-Web-Security %}的内容。

## JavaScript重定向

当我们说*JavaScript重定向*时，我们谈论的是任何一种代码，它的功能是这样的：

```javascript
window.location.href = 'http://some.superdomain.com'
```

这可能是最难测试的情况，因为它通常是由于其他原因引起的。你需要找出JavaScript代码重定向的原因。也许你没有登录，需要在其他地方处理该设置？也许你正在使用单点登录(SSO)服务器，而你只需要阅读前面关于处理该问题的部分？

如果你不明白JavaScript代码为什么要将你重定向到另一个超域，那么你可能只想阅读有关{% url "禁用web安全" web-security#Disabling-Web-Security %}的内容。

# 禁用网络安全

因此，如果你无法使用上述建议的方案解决任何问题，你可能需要禁用web安全。

这里要考虑的最后一件事是，每隔一段时间，我们就会发现Cypress中的错误，这些错误会导致可以通过其他方法修复的跨域错误。如果你认为你正遇到错误，{% url "进入我们的聊天" https://gitter.im/cypress-io/cypress %}或{% open_an_issue '打开一个问题' %}。

首先，你需要了解*并非所有浏览器都提供关闭web安全的方法*。有些浏览器提供，有些不提供。如果你依赖于禁用web安全，你将无法在不支持此功能的浏览器上运行测试。

**设置`chromeWebSecurity`为`false`允许你做以下事情：**

- 显示不安全的内容
- 导航到任何超域没有跨域错误
- 访问嵌入到应用程序中的跨域iframe。

不过，你可能会注意到，Cypress仍然强制使用{% url `cy.visit()` visit %}访问单个超域，但是有一个{% issue 944 '开放问题' %}可以更改这个限制。

还在这里吗？很酷，让我们禁用web安全吧！

***在`cypress.json`中设置`chromeWebSecurity`为`false`，剩下的我们来处理。***

```json
{
  "chromeWebSecurity": false
}
```
