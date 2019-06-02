---
title: 页面元素交互
---

{% note info %}
# {% fa fa-graduation-cap %} 从这篇文档您将会看到

- Cypress如何确定元素是否可见
- Cypress如何确定元素的可操作性
- Cypress如何处理动态元素
- 如何绕过一些检查及强制事件
{% endnote %}

# 可操作性

Cypress中一些与DOM交互的命令，例如:

- {% url `.click()` click %}
- {% url `.dblclick()` dblclick %}
- {% url `.type()` type %}
- {% url `.clear()` clear %}
- {% url `.check()` check %}
- {% url `.uncheck()` uncheck %}
- {% url `.select()` select %}
- {% url `.trigger()` trigger %}

这些命令将模拟用户与您的应用程序进行交互。在引擎下，Cypress会触发浏览器的触发事件，从而让应用程序的事件绑定触发.

在发出命令之前, Cypress会检查DOM的当前状态并进行一些操作以确保DOM元素可以接收操作.

Cypress会在{% url `默认超时` configuration#Timeouts %} 期间等待元素通过所有检查(在核心概念指南的{% url '默认断言' introduction-to-cypress#Default-Assertions %}部分有更深入的描述).

***检查和执行操作***

- {% urlHash '将元素滚动到视图中.' Scrolling %}
- {% urlHash '确认元素未隐藏.' Visibility %}
- {% urlHash '确认元素未禁用.' Disability %}
- {% urlHash '确认元素不是动画.' Animations %}
- {% urlHash '确认元素未被覆盖.' Covering %}
- {% urlHash '如果仍然被具有固定位置的元素覆盖，则滚动页面.' Scrolling %}
- {% urlHash '在所需坐标处触发事件.'  Coordinates %}

在上述任何步骤中失败，Cypress都无法与元素交互。您通常会得到一个错误，解释为什么找不到该元素是可操作的.

## Visibility

Cypress会检查很多东西以确定元素的可见性.

以下是在CSS转换中的计算因素.

### 在以下情况下，元素被视为隐藏:

- 它的 `width` 或 `height` 为 `0`.
- 它的CSS属性（或祖先）为 `visibility: hidden`.
- 它的CSS属性（或祖先）为 `display: none`.
- 它的CSS属性为 `position: fixed` 并且它在屏幕外或被覆盖的。

### 此外在以下情况下，元素也会被视为隐藏:

- 它的任何祖先 **hides overflow**\*
  - 祖先有 `width` 或 `height` 为`0`
  - 在祖先与该元素之间有一个元素有 `position: absolute`
- 它的任何祖先 **hides overflow**\*
  - 祖先或者在它与祖先之间的一个祖先是它的偏移父母
  - 它位于祖先的界限之外
- 它的任何祖先 **hides overflow**\*
  - 元素有 `position: relative`
  - 它位于祖先的界限之外

\***hides overflow** 意味着它有 `overflow: hidden`, `overflow-x: hidden`, `overflow-y : hidden`, `overflow: scroll`, or `overflow: auto`

## Disability

Cypress检查元素的 `disabled` 属性是否为`true`.

我们没有检查元素是否有属性`readonly` (但我们可能应该). {% open_an_issue %} 如果你希望我们添加此问题.

## Animations

Cypress会自动确定一个元素是否是动画并等它停止.

为了计算元素是否是动画，我们采用它所处的最后位置的样本并计算元素的斜率。你可能记得八年级代数. 😉

要计算元素是否为动画，我们检查元素本身的当前位置和先前位置. 如果距离超过 {% url `动画距离阈值` configuration#Animations %}, 则我们认为该元素是动画.

当这个值出现时，我们有多次试验找到一个较快以至于用户无法与之交互的速度. 您随时可以 {% url "增加或降低该阈值" configuration#Animations %}.

你还可以在配置选项中关闭对动画的检查 {% url `动画等待` configuration#Animations %}.

## Covering

我们还确保我们尝试与之交互的元素不被父元素覆盖.

例如，一个元素可以通过所有先前的检查，但是一个巨大的对话框可能覆盖整个屏幕，使得任何真实用户与该元素的交互都是不可能的.

{% note info %}
在检查元素是否被覆盖时，我们总是会检查其中心坐标.
{% endnote %}

如果一个元素的 *子元素* 覆盖它 - 那没有关系. 事实上我们会自动发布向子元素发起的事件.

想象一下你有这样的一个按钮:

```html
<button>
  <i class="fa fa-check">
  <span>Submit</span>
</button>
```

通常，`<i>` 或 `<span>` 元素会覆盖我们试图交互的确切坐标. 在这些情况下，事件会触发子元素. 我们甚至在{% url "命令日志" test-runner#Command-Log %}中为您注意到了这一点.

## Scrolling

在与元素交互之前，我们会*始终*将其滚动到视图中（包括其任何父元素容器）. 即使元素在没有滚动的情况下也可见，我们依旧会执行滚动算法，以便在每次运行命令时重现相同的行为.

{% note info %}
这个滚动逻辑仅适用于{% urlHash "以上的可操作命令" Actionability %}.当使用DOM命令例如 {% url "`cy.get()`" get %} 或者 {% url "`.find()`" find %}， **W我们不会滚动元素**进入视图.
{% endnote %}

滚动算法的工作原理是，将我们发出命令操作的元素的左上点滚动到其可滚动容器的左上角.

在滚动元素之后，如果我们确定它仍然被覆盖，我们将继续滚动并“轻推”页面，直到它可见. 当有`position: fixed` or `position: sticky`被固定在页面顶部的导航元素时，这种情况会经常发生.

我们的算法*应*始终能够滚动，直到元素未被覆盖.

## Coordinates

在我们验证元素是否可操作之后，Cypress将触发所有相应的事件和相应的默认操作. 通常这些事件的坐标是在元素的中心被触发的，但是大多数命令都可以让你改变它被触发的位置.

```js
cy.get('button').click({ position: 'topLeft' })
```

在{% url '命令日志' test-runner#Command-Log %}中单击命令时，通常可以使用我们触发事件的坐标.

![event coordinates](/img/guides/coords.png)

此外，我们将显示一个红色的“hitbox” - 这是一个指示事件坐标的点.

![hitbox](/img/guides/hitbox.png)

# 调试

当Cypress认为元素不可操作时，可能很难调试问题.

虽然你*应该*看到一个很好的错误消息, 但没有什么比自己检查和查看DOM更能清晰地了解其原因.

当您使用{% url "命令日志" test-runner#Command-Log %}将鼠标悬停在命令上时, 您会注意到我们会始终将应用该命令的元素滚动到视图中. 但请注意，这*不是*使用我们上面描述的算法.

事实上，当使用上述算法运行可操作的命令时，我们只会将元素滚动到视图中. 对于常规的DOM命令例如{% url `cy.get()` get %} 或者 {% url `.find()` find %}我们*不会*将元素滚动到视图中.

当鼠标悬停在快照上时，将元素滚动到视图中的原因只是为了帮助您查看相应命令找到的元素. 这是一个纯粹的视觉功能，并不一定反映命令运行时页面的样子.

换句话说，在查看之前的快照时，您无法得到正确的Cypress“看到”的内容.

您可以轻松“查看”并调试Cypress认为元素不可见的唯一方法是使用`debugger`语句.

我们建议您直接在操作之前放置 `debugger` 或使用 {% url `.debug()` debug %}命令.

确保您的开发人员工具处于打开状态，您可以非常接近“查看”Cypress正在执行的计算.

截至0.20.0，您还可以{% url '绑定' catalog-of-events %}Cypress在元素处理时触发的事件.使用带有这些事件的调试器将为您提供有关Cypress如何工作的更底层的展示.

```js
// break on a debugger before the action command
cy.get('button').debug().click()
```

# 强制

虽然上述检查非常有助于找到阻碍用户与元素交互的情况 - 但有时它们可​​能会妨碍！

有时“像用户一样”让机器完成用户与元素交互的确切步骤是不必要的.

想象一下，你有一个嵌套的导航结构，用户必须将鼠标悬停在一个非常特定的模式中，才能到所需的链接I.

当你测试时，这值得尝试复制吗？

也许不吧！对于这些场景，我们为您提供了一个简单的绕过操作，以绕过上面的所有检查，并强制事件发生！

您可以简单地传递`{ force: true }`给大多数操作命令.

```js
// 强制点击和所有后续事件
// 即使此元素被不视为“可操作”，也要触发
cy.get('button').click({ force: true })
```

{% note info "有什么不同?" %}
当你强制触发事件时，我们将:

- 继续执行所有默认操作
- 强行在元素上触发事件

我们不会执行这些:

- 将元素滚动到视图中
- 确保它是可见的
- 确保它不是只读的
- 确保它未被禁用
- 确保它不是动画
- 确保没有覆盖
- 在后代触发事件

{% endnote %}

总之，`{ force: true }`绕过检查，它将始终在所需元素处触发事件.
