---
title: 测试执行器
---

{% note info %}
# {% fa fa-graduation-cap %} 通过这篇文档你将会学习到

- Cypress测试执行器的功能和目的
- 如何使用选择定位器定位页面元素
{% endnote %}

# 概述

Cypress在一个独特的交互式运行器中运行测试，允许你崽执行时查看命令，同时还可以查看被测试应用程序。

{% imgTag /img/guides/gui-diagram.png "Cypress Test Runner" "no-border" %}

# 命令日志

测试执行器的左侧直观的展示了可用的测试文件。每个测试块都是正确嵌套的， 单击每个测试，将会显示测试执行中的每个Cypress命令和断言，以及在相关的 `before`, `beforeEach`, `afterEach`, 和 `after` 中执行的任何命令和断言。

{% imgTag /img/guides/command-log.png 436 "Cypress Test Runner" %}

### 悬停在命令上

当悬停在每个命令和断言上时，测试执行器会将正在测试的应用程序（右侧）恢复到执行该命令时的状态。这将会允许你在测试时通过“时间旅行”回到应用程序之前的状态。

{% note info  %}
默认情况下，Cypress为时间旅行保留了50个测试快照和命令数据。如果你在浏览器中看到极高的内存消耗，则可能需要降低在 {% url 'configuration' configuration#Global %} 中的 `numTestsKeptInMemory` 配置项的值。
{% endnote %}

### 单击命令

单击每个命令，断言或错误都会在开发工具控制台中显示额外的信息。当测试执行完毕后，单击命令也会让测试的应用程序（右侧）‘固定’在之前的状态。

{% imgTag /img/guides/clicking-commands.png "Click to console.log and to pin" %}

# 仪表盘

对于某些命令，例如：{% url `cy.route()` route %}， {% url `cy.stub()` stub %}，和 {% url `cy.spy()` spy %}，这是一个额外的工具面板显示在测试上方，以提供有关测试状态的更多信息。

### Routes:

{% imgTag /img/guides/instrument-panel-routes.png "Routes Instrument Panel" %}

### Stubs:

{% imgTag /img/guides/instrument-panel-stubs.png "Stubs Instrument Panel" %}

### Spies:

{% imgTag /img/guides/instrument-panel-spies.png "Spies Instrument Panel" %}

# 测试中的应用程序

测试执行器的右侧用于显示正在测试的应用程序（AUT:Application Under Test）:使用 {% url `cy.visit()` visit %} 或从访问过的应用程序进行的任何后续路由调用跳转到的应用程序。

在下面的示例中，我们在测试文件中编写了以下代码：

```javascript
cy.visit('https://example.cypress.io')

cy.title().should('include', 'Kitchen Sink')
```

在下面相应的应用程序预览中，你可以看到右侧显示`https://example.cypress.io`。应用程序不仅可以看见，而且完全可以互动。你可以打开开发者工具来检查元素，就像正常应用程序一样。DOM结构完全可用于调试。

{% imgTag /img/guides/application-under-test.png "Application Under Test" %}

AUT还会在测试中显示指定的大小和方向。你可以使用 {% url `cy.viewport()` viewport %} 命令或者通过 {% url "Cypress配置" configuration#Viewport %}来更改大小或方向。如果AUT不适合当前浏览器窗口，则会适当缩放窗口以适应浏览器窗口大小。

AUT的当前大小和比例显示在窗口的右上角。

下图显示我们的应用程序宽度为`1000px`，高度为`660px`，缩放为 `100%`。

{% imgTag /img/guides/viewport-scaling.png "Viewport Scaling" %}

*注意: 右侧窗口也可能用于在测试文件中显示语法错误，以防止测试继续运行。*

{% imgTag /img/guides/errors.png "Errors" %}

# 选择定位器

选择定位器是一个互动功能，可以帮助你：

* 确定元素的唯一选择器。
* 查看哪些元素与给定的选择器匹配。
* 查看哪个元素与一串文本匹配。

{% video local /img/snippets/selector-playground.mp4 %}

## 唯一性

Cypress将通过运行一系列选择器策略自动计算目标元素的**唯一选择器**。

默认情况下，Cypress鼓励：

1. `data-cy`
2. `data-test`
3. `data-testid`
4. `id`
5. `class`
6. `tag`
7. `attributes`
8. `nth-child`

{% note info "这个是可以配置的" %}
Cypress允许你控制选择器的确定方式。

使用 {% url "`Cypress.SelectorPlayground`" selector-playground-api %} API来控制要返回的选择器。
{% endnote %}

## 最佳实践

你可能会发现自己很难写出好的选择器，因为：

- 你的应用程序使用动态ID和类名
- 只要有CSS或内容发生变化，你的测试就会中断

为了帮助解决这些常见挑战，选择定位器在确定唯一选择器时会自动更喜欢某些 `data-*` 属性。

请阅读我们的 {% url "最佳实践指南" best-practices#Selecting-Elements %}来帮助你确定元素并防止CSS或者JS改变导致测试中断。

## 查找选择器

要打开选择定位器，请单击顶部URL旁边的 `{% fa fa-crosshairs grey %}` 按钮。将鼠标悬停在应用程序中的元素上，以便在工具提示中预览该元素的唯一选择器。

{% imgTag /img/guides/test-runner/open-selector-playground.gif "Opening selector playground and hovering over elements" %}

单击元素，它的选择器将显示在顶部。从那里，你可以将其复制到剪切板(`{% fa fa-copy grey %}`) 或将其打印到控制台 (`{% fa fa-terminal %}`)。

{% imgTag /img/guides/test-runner/copy-selector-in-selector-playground.gif "Clicking an element, copying its selector to clipboard, printing it to the console" %}

## 使用经验

顶部显示器的框也是一个文本输入框。

### 编辑选择器

当你编辑选择器时，他会显示有多少元素匹配并突出显示应用程序中的这些元素。

{% imgTag /img/guides/test-runner/typing-a-selector-to-find-in-playground.gif "Type a selector to see what elements it matches" %}

### 切换到Contains

你还可以尝试在给定一串文本的情况下，使用 {% url `cy.contains()` contains %}将会产生什么效果。单击 `cy.get` 并切换到 `cy.contains`。

输入文本来查看它匹配的元素。请注意 {% url `cy.contains()` contains %} 仅产生与文本匹配的第一个元素，即时页面上的多个元素包含文本也是如此。

{% imgTag /img/guides/test-runner/cy-contains-in-selector-playground.gif "Experiment with cy.contains" %}

### 禁用突出显示

如果你觉得在使用选择定位器时，元素的突出显示可能会妨碍你，那么你可以像下面那样来关闭它。

{% imgTag /img/guides/test-runner/turn-off-highlight-in-selector-playground.gif "Turn off highlighting" %}
