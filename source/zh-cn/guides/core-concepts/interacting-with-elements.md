---
title: 元素交互
---

{% note info %}
# {% fa fa-graduation-cap %} 通过这篇文档你将会学习到

- Cypress怎么计算可见性
- Cypress怎么确保元素的可操作性
- Cypress怎么处理动画元素
- 怎么绕过这些检查并强制执行事件
{% endnote %}

# 可操作

Cypress的一些命令可以用于和DOM进行交互，例如：

- {% url `.click()` click %}
- {% url `.dblclick()` dblclick %}
- {% url `.type()` type %}
- {% url `.clear()` clear %}
- {% url `.check()` check %}
- {% url `.uncheck()` uncheck %}
- {% url `.select()` select %}
- {% url `.trigger()` trigger %}

这些命令模拟用户与应用程序交互。Cypress会触发浏览器的事件，进而触发应用程序绑定的事件。

在发出任何命令之前，我们会检查DOM的当前状态并采取一些操作以确保DOM元素“准备好”接收操作。

Cypress将在{% url `defaultCommandTimeout` configuration#Timeouts %}期间等待元素通过所有这些检查 （在 {% url 'Default Assertions' introduction-to-cypress#Default-Assertions %}核心概念中有详细描述）。

***执行检查和操作***

- {% urlHash '将元素滚动到视图中。' 滚动 %}
- {% urlHash '确保元素未隐藏。' 可见性 %}
- {% urlHash '确保元素未禁用。' 不可操作 %}
- {% urlHash '确保元素不是动画。' 动画 %}
- {% urlHash '确保元素没有被覆盖。' 覆盖 %}
- {% urlHash '如果任然被具有固定位置的元素覆盖，则滚动页面。' 滚动 %}
- {% urlHash '在所需坐标处触发事件。'  坐标 %}

每当Cypress无法与元素交互时，它可能会在上述任何步骤中失败。你通常会得到一个错误，解释为什么找不到该元素时可操作的。

## 可见性

Cypress检查了很多东西以确定元素的可见性。

The following calculations factor in CSS translations and transforms.

### 在以下情况，元素会被视为隐藏:

- 它的 `width` 或者 `height` 是 `0`.
- 它的CSS属性（或祖先）是 `visibility: hidden`.
- 它的CSS属性（或祖先）是 `display: none`.
- 它的CSS属性是 `position: fixed` 并且它在屏幕外或被掩盖。

### 此外，在以下情况，元素也会被视为隐藏：

- 它的任何祖先存在 **hides overflow**\*
  - 并且该祖先的 `width` 或者 `height` 是 `0`
  - 并且该祖先和当前元素之间是`position: absolute`关系
- 它的任何祖先存在 **hides overflow**\*
  - 并且该祖先是介于它和当前元素之间的偏移父母
  - 并且它位于祖先的界限之外
- 它的任何祖先存在 **hides overflow**\*
  - 并且当前元素时 `position: relative`
  - 并且它位于祖先的界限之外

\***hides overflow** 意味着它有 `overflow: hidden`, `overflow-x: hidden`, `overflow-y : hidden`, `overflow: scroll`, 或者 `overflow: auto` 属性。

## 不可操作

Cypress检查元素的 `disabled` 属性是否为 `true`。

我们不会检查一个元素是否具有 `readonly` 属性 (但是我们应该需要检查)。如果你希望我们添加此内容，你可以 {% open_an_issue %} 

## 动画

Cypress将自动确定一个元素是否是动画并等到它停止。

为了确定一个元素是否是动画，我们采用它所处的最后位置的数据并计算元素的斜率。你可能还记得八年级代数。😉

要计算元素是否为动画，我们检查元素本身的当前位置和之前位置。如果距离超过 {% url `animationDistanceThreshold` configuration#Animations %} 配置的值，那么我们将该元素视为动画。

当确定这个值的时候，我们做了一些实验让用户“感觉”这个过程很快。你始终可以通过配置来 {% url "增加或减少这个值" configuration#Animations %}.

你还可以设置配置项{% url `waitForAnimations` configuration#Animations %}来关闭动画检查。

## 覆盖

我们还确保我们尝试与之交互的元素不会被父元素覆盖。

例如，一个元素可以通过所有之前的检查，但是一个巨大的对话框可能覆盖整个屏幕，使得与该元素的交互对于任何真实用户都是不可能的。

{% note info %}
在检查元素是否被覆盖时，我们总是检查其中心坐标。
{% endnote %}

如果*子元素*覆盖它了 - 那没关系。事实上，我们会自动触发子元素的事件。

想象一下你有一个这样的按钮：

```html
<button>
  <i class="fa fa-check">
  <span>Submit</span>
</button>
```

通常， `<i>` 或 `<span>` 元素覆盖了我们试图与之交互的确切坐标。在这些情况下，子元素事件仍然会被触发。 我们甚至在{% url "Command Log" test-runner#Command-Log %}中记录了这种情况。

## 滚动

在与元素交互之前，我们*始终*将其滚动到视图中（包括其任何父容器）。 即时元素在没有滚动的情况下也是可见的，我们也会执行滚动算法，以便在每次运行命令时重现相同的行为。

{% note info %}
此滚动逻辑仅适用于 {% urlHash "上面可以操作的命令" 可操作 %}。 当使用DOM命令时，**我们不会滚动元素** 到视图中，例如 {% url "`cy.get()`" get %} or {% url "`.find()`" find %}.
{% endnote %}

滚动算法通过将我们发出命令的元素的顶部最左侧点滚动到其可滚动容器的顶部最左侧。

在滚动元素后，如果我们确定它仍然被覆盖，我们将继续滚动并“轻推”页面，直到它变得可见。 当你有固定在页面顶部的 `position: fixed` 或者 `position: sticky`导航元素时，最常发生这种情况。

我们的算法 *应该* 始终滚动元素直到它未被覆盖。

## 坐标

在我们验证元素是否可操作之后，Cypress将触发所有响应的事件和响应的默认操作。通常这些事件的坐标是在元素的中心被触发的，但是大多数命令都可以让你改变它被触发的位置。

```js
cy.get('button').click({ position: 'topLeft' })
```

单击{% url 'Command Log' test-runner#Command-Log %}中的命令时，我们通常可以看到触发事件时的坐标。

{% imgTag /img/guides/coords.png "Event coordinates" %}

此外，我们将显示一个红色的“点击格“ - 这是一个指示时间坐标的点。

{% imgTag /img/guides/hitbox.png "Hitbox" %}

# 调试

当Cypress认为元素不可操作时，可能很难调试这个问题。

虽然你*应该*看到一个很好的错误信息，但没有什么能够在视觉上检查并自己查看DOM以了解其原因来的直接。

当你使用 {% url "Command Log" test-runner#Command-Log %} 将鼠标悬停在命令上时，你会注意到我们始终将应用该命令的元素滚动到视图中。 请注意这里使用的算法和上面的*不*一样。

事实上，当使用上述算法运行可操作的命令时，我们只会将元素滚动到视图中。我们*不会*在常规DOM命令中滚动元素，例如： {% url `cy.get()` get %} 或 {% url `.find()` find %}。

将鼠标悬停在快照上时将元素滚动到视图中的原因只是为了帮助你查看相应命令找到的元素。这是一个纯粹的视觉功能，并不一定反映命令运行时的页面的样子。

换句话说，在查看之前的快照时，你无法正确显示Cypress"看到"的内容。

如果你想“查看”并调试Cypress认为元素不可见的唯一方法是使用`debugger`语句。

我们建议在操作之前直接放置 `debugger` 或使用 {% url `.debug()` debug %} 命令.

确保你的开发者工具处于打开状态，你可以非常接近的“看到”Cypress正在执行的计算。

从`0.20.0`开始，你也可以通过{% url '绑定事件' catalog-of-events %}来触发它。Cypress在你的元素处理时会触发它。 使用带有这些事件的调试器将为你提供有关Cypress如何工作的更低级别视图。

```js
// break on a debugger before the action command
cy.get('button').debug().click()
```

# 强制

虽然上述检查非常有助于找到阻止用户与元素交互的情况 - 但有时他们可能会妨碍我们！

有时候让一个机器人“像一个真实用户”一样与元素进行交互式不值得的。

想象一下，你有一个嵌套的导航结构，用户必须将鼠标悬停在一个非常特定的模式中，才能达到所需的链接。

当你测试时，你认为值得这样做吗？

或许不值得！对于这些场景，我们为你提供了一个简单的逃生舱，用来绕过上面的所有检查，并让事件强制发生！

你可以将 `{ force: true }` 传递给大多数命令。

```js
// 强制点击这个元素
// 即使此元素‘不可操作’
cy.get('button').click({ force: true })
```

{% note info "这有什么区别？" %}
当你强制让一个事件发生的时候：

- 继续执行所有默认操作
- 强制在这个元素上触发这个事件

我们将不会执行这些：

- 将元素滚动到视图中
- 确保它是可见的
- 确保它不是只读的
- 确保它未禁用
- 确保它不是动画
- 确保它没有被覆盖
- 触发后代的事件

{% endnote %}

总之，`{ force: true }` 跳过检查，它总是在所需的元素上触发事件。
