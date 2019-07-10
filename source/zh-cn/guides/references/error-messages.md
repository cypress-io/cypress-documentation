---
layout: toc-top
title: 错误消息
---

# 测试文件错误

## {% fa fa-exclamation-triangle red %} No tests found in your file

这条消息意味着Cypress无法在指定的文件中找到测试。如果你有一个空的测试文件，并且还没有编写任何测试，那么你可能会收到这条消息。

{% imgTag /img/guides/no-tests-found.png "No tests found" %}

## {% fa fa-exclamation-triangle red %} We found an error preparing your test file

这条消息意味着当Cypress编译或打包测试文件时遇到错误。Cypress自动编译和打包测试代码，以便你可以使用ES2015、CoffeeScript、模块等。

### 你通常收到这条消息是因为：

- 文件不存在
- 文件或其依赖项中的语法错误
- 缺失的依赖关系

当在测试文件中修复错误时，测试将会自动重新运行。

# 支持文件错误

## {% fa fa-exclamation-triangle red %} Support file missing or invalid

从Cypress版本{% url `0.18.0` changelog#0-18-0 %}中删除了`supportFolder`选项，代之以模块支持和{% url `supportFile` configuration#Folders-Files %}配置选项。

过去常常在测试文件之前自动将任何脚本包含在`supportFolder`中。然而，自动将所有文件包含在某个目录中有点不可思议，也不直观，并且需要为实用函数创建全局变量。

### 为实用函数使用模块

Cypress同时支持ES2015模块和CommonJS模块。你可以用import/require引入npm模块及本地模块：

```javascript
import _ from 'lodash'
import util from './util'

it('uses modules', function () {
  expect(_.kebabCase('FooBar')).to.equal('foo-bar')
  expect(util.secretCode()).to.equal('1-2-3-4')
})
```

### 在测试代码之前，使用supportFile加载脚本

在测试代码之前加载安装文件仍然有用。如果你正在设置Cypress缺省值或使用自定义Cypress命令，你可以使用{% url `supportFile` configuration#Folders-Files %}配置选项，而不需要在每个测试文件中使用import/require这些缺省值/命令。

要在测试文件之前包含代码，请设置{% url `supportFile` configuration#Folders-Files %}路径。默认情况下，{% url `supportFile` configuration#Folders-Files %}被设置来查找以下文件之一：

* `cypress/support/index.js`
* `cypress/support/index.coffee`

就像你的测试文件一样，{% url `supportFile` configuration#Folders-Files %}可以使用ES2015+（或CoffeeScript）和模块，因此你可以根据需要使用import/require引入其他文件。

# 命令错误

## {% fa fa-exclamation-triangle red %} Cypress cannot execute commands outside a running test

{% imgTag /img/guides/cypress-cannot-execute.png "Cannot execute commands" %}

此消息意味着你试图在当前运行的测试之外执行一个或多个Cypress命令。Cypress必须能够将命令与特定的测试相关联。

通常这是意外发生的，就像下面的情况一样。

```javascript
describe('Some Tests', function () {
  it('is true', function () {
    expect(true).to.be.true   // 是的，很好
  })

  it('is false', function () {
    expect(false).to.be.false // 是的，也很好
  })

  context('some nested tests', function () {
    // 哎呀，你忘记在这里写it(…)了!
    // 下面的cypress命令
    // 在测试之外运行，
    // cypress抛出一个错误
    cy.visit('http://localhost:8080')
    cy.get('h1').should('contain', 'todos')
  })
})
```

只需将这些Cypress命令移动到一个`it(…)`块中，一切都会正常工作。

如果你有意在测试之外编写命令，那么可能有更好的方法来完成你想要做的事情。请阅读{% url "示例" examples/examples/recipes %}，{% url "和我们聊天" https://gitter.im/cypress-io/cypress %}, or {% open_an_issue %}。

## {% fa fa-exclamation-triangle red %} `cy...()` failed because the element you are chaining off of has become detached or removed from the dom

得到这个错误意味着你尝试与一个“死”DOM元素交互——也就是说它已经从DOM中分离或完全删除。

{% imgTag /img/guides/cy-method-failed-element-is-detached.png "cy.method() failed because element is detached" %}

Cypress错误是因为它不能与“死”元素交互——就像一个真正的用户也不能这样做一样。了解这种情况是如何发生的非常重要，而且通常很容易预防。

让我们看看下面的例子。

### 应用程序的HTML

```html
<body>
  <div id="parent">
    <button>delete</button>
  </div>
</body>
```

### 应用程序的JavaScript

```javascript
$('button').click(() => {
  // when the <button> is clicked
  // we remove the button from the DOM
  $(this).remove()
})
```

### 测试代码导致的错误

```javascript
cy.get('button').click().parent()
```

我们已经为上面的应用程序编写了程序，这样一旦`click`事件发生，按钮就会从DOM中删除。当Cypress开始处理上面测试中的下一个命令({% url `.parent()` parent %})时，它检测到生成的对象（按钮）已从DOM中分离，并抛出错误。

我们可以通过重写测试代码来防止Cypress抛出这个错误。

### 修复测试代码

```javascript
cy.get('button').click()
cy.get('#parent')
```

上面的例子过于简单化了。让我们看一个更复杂的例子。

在现代JavaScript框架中，DOM元素会经常重新呈现—这意味着旧元素会被丢弃，而新元素会取而代之。因为这发生得太快了，可能会*出现*似乎用户没有看到任何明显的变化。但是，如果你正在执行测试命令，那么与你交互的元素可能已经“死亡”。要处理这种情况，你必须：

- 了解应用程序何时重新呈现
- 重新查询新添加的DOM元素
- *防止*Cypress运行命令，直到满足特定条件

当我们说“防止”时，这通常意味着：

- 编写一个断言
- 等待一个XHR

## {% fa fa-exclamation-triangle red %} `cy....()` failed because the element cannot be interacted with

你可能会看到这条消息有4个不同的原因：

1. 元素不可见
2. 元素被另一个元素覆盖
3. 元素的中心隐藏在视图之外
4. 元素被禁用

Cypress运行多次计算，确保可以像实际用户那样*真正地*与元素交互。如果你看到这个错误，解决方案通常是显而易见的。你可能需要“保护”你的命令（由于时间或动画问题）。

在某些情况下，Cypress无法正确地允许你与本该是可交互的元素交互。如果是这样，{% open_an_issue %}。

如果希望覆盖这些内置检查，请为操作本身提供`{force: true}`选项。请参考每个命令的可用选项、附加用例和参数用法。

### 忽略内置错误检查

```javascript
cy.get('[disabled]').click({force: true}).
```

*小心这个选项。当应用程序中的元素实际上不可交互时，可以强制通过测试。*

## {% fa fa-exclamation-triangle red %} `cy....()` failed because the element is currently animating

{% imgTag /img/guides/cy-method-failed-element-is-animating.png "cy.method() failed because element is animating" %}

默认情况下，Cypress检测你试图与之交互的元素是否正在动画化。此检查确保一个元素的动画不会太快，以致于实际用户无法与该元素交互。这还可以防止一些边缘情况，比如{% url `.type()` type %}或{% url `.click()` click %}等操作在转换期间发生得太快。

Cypress将不断尝试与元素交互，直到它最终超时。如果你想强制Cypress与元素交互，有几个选项：

- 传递`{force: true}`。这将禁用*所有*错误检查
- 传递`{waitForAnimations: false}`以禁用动画错误检查
- 传递`{animationDistanceThreshold: 20}`降低检测元素是否正在动画的灵敏度。通过增加阈值，可以使元素在页面上移动得更远，而不会导致Cypress不断重试。

```javascript
cy.get('#modal button').click({ waitForAnimations: false })
```

你可以全局禁用动画错误检查，或者通过修改你的{% url '配置文件' configuration %}中的{% url '配置' configuration %}来增加阈值。

### cypress.json

```json
{
  "waitForAnimations": false,
  "animationDistanceThreshold": 50
}
```

## {% fa fa-exclamation-triangle red %} The test has finished but Cypress still has commands in its queue

让我们研究可能得到此错误消息的几种不同情况。在每种情况下，你都需要更改测试代码中的某些内容来防止错误。

{% imgTag /img/guides/the-test-has-finished.png "The test has finished but Cypress still has commands" %}

{% note warning 不稳定的测试下！ %}
这些测试中的一些依赖于竞争条件。在这些测试真正失败之前，你可能需要多次运行这些测试。你还可以尝试调整延迟时间。
{% endnote %}

### 简单示例

下面的第一个测试将通过，并向你展示Cypress试图在每次测试中防止在队列中留下命令。

即使我们在测试中返回一个字符串，Cypress也会自动计算出你已经在上面的命令中排队，并且在所有cy命令完成之前不会结束测试。

```javascript
// 这个测试通过！
it('Cypress is smart and this does not fail', function () {
  cy.get('body').children().should('not.contain', 'foo') // <- 这里不返回

  return 'foobarbaz'    // <- 这里返回
})
```

下面的示例将会失败，因为你已经使用mocha的`done`强制终止了测试。

```javascript
// 这个测试错误！
it('but you can forcibly end the test early which does fail', function (done) {
  cy.get('body')
    .then(() => {
      done() // 强制结束测试，即使下面有命令
    })
    .children()
    .should('not.contain', 'foo')
})
```

### 复杂的异步示例

在这个例子中发生的事情是，因为我们*没有*告诉mocha这是一个异步测试，所以这个测试将*立即*通过，然后进入下一个测试。然后，当`setTimeout`回调函数运行时，新命令将在错误的测试中排队。Cypress将检测到这一点，并让*下一个*测试失败。

```javascript
describe('a complex example with async code', function() {
  it('you can cause commands to bleed into the next test', function() {
    // 这是测试通过...但是...
    setTimeout(() => {
      cy.get('body').children().should('not.contain', 'foo')
    }, 10)
  })

  it('this test will fail due to the previous poorly written test', function() {
    // 这个测试错误！
    cy.wait(10)
  })
})
```

编写上述测试代码的正确方法是使用Mocha的`done`来表示它是异步的。

```javascript
it('does not cause commands to bleed into the next test', function (done) {
  setTimeout(() => {
    cy.get('body').children().should('not.contain', 'foo').then(() => {
      done()
    })
  }, 10)
})
```

### 复杂的Promise示例

在下面的例子中，我们忘记在测试中返回`Promise`。这意味着测试同步通过，但我们的`Promise`将在下一个测试中解析。
这也会导致命令在错误的测试中排队。我们将在下一个测试中得到这个错误，Cypress检测到它的命令队列中有命令。

```javascript
describe('another complex example using a forgotten "return"', function () {
  it('forgets to return a promise', function () {
    // 这个测试通过...但是...
    Cypress.Promise.delay(10).then(() => {
      cy.get('body').children().should('not.contain', 'foo')
    })
  })

  it('this test will fail due to the previous poorly written test', function () {
    // 这是测试错误！
    cy.wait(10)
  })
})
```

编写上述测试代码的正确方法是返回我们的`Promise`：

```javascript
it('does not forget to return a promise', function () {
  return Cypress.Promise.delay(10).then(() => {
    return cy.get('body').children().should('not.contain', 'foo')
  })
})
```

## {% fa fa-exclamation-triangle red %} `cy.visit()` failed because you are attempting to visit a second unique domain

请参阅{% url "Web安全" web-security#Limitations %}文档。

## {% fa fa-exclamation-triangle red %} `Cypress.addParentCommand()` / `Cypress.addDualCommand()` / `Cypress.addChildCommand()` has been removed and replaced by `Cypress.Commands.add()`

在版本{% url "`0.20.0`" changelog %}中，我们删除了用于添加自定义命令的命令，并用我们认为更简单的接口替换它们。

现在，你可以使用相同的{% url "`Cypress.Commands.add()`" custom-commands %}命令创建父命令、双命令和子命令。

请阅读{% url "编写自定义命令的新文档" custom-commands %}。

## {% fa fa-exclamation-triangle red %} Cypress detected that you invoked one or more `cy` commands in a custom command but returned a different value.

因为`cy`命令是异步的，并且排队等待稍后运行，所以返回任何其他值都没有意义。

为了方便起见，你还可以简单地省略任何返回值或返回`undefined`，Cypress就不会出错。

在Cypress的{% url "`0.20.0`" changelog %}之前的版本中，我们自动检测到这一点，并强制返回`cy`命令。为了让事情变得不那么不可思议并更清晰，我们现在抛出了一个错误。

## {% fa fa-exclamation-triangle red %} Cypress detected that you invoked one or more `cy` commands but returned a different value.

因为cy命令是异步的，并且排队等待稍后运行，所以返回任何其他值都没有意义。

为了方便起见，你还可以简单地省略任何返回值或返回`undefined`，Cypress就不会出错。

在Cypress的{% url "`0.20.0`" changelog %}之前的版本中，我们自动检测到这一点，并强制返回`cy`命令。为了让事情变得不那么不可思议并更清晰，我们现在抛出了一个错误。

## {% fa fa-exclamation-triangle red %} Cypress detected that you returned a promise from a command while also invoking one or more cy commands in that promise.

因为Cypress命令已经类似于promise，所以不需要包装它们或返回自己的promise。

Cypress将使用最后一个Cypress命令生成的任何内容来解析你的命令。

这是一个错误而不是警告的原因是Cypress内部的队列命令是串行的，而promise是在调用后立即执行的。试图协调这一点将阻止Cypress解决问题。

## {% fa fa-exclamation-triangle red %} Cypress detected that you returned a promise in a test, but also invoked one or more `cy` commands inside of that promise.

虽然这在实践中是可行的，但它通常表示反模式。你几乎不需要同时返回promise和调用`cy`命令。

`cy`命令本身已经类似promise，你可以避免使用单独的promise。

## {% fa fa-exclamation-triangle red %} Passing `cy.route({stub: false})` or `cy.server({stub: false})` is now deprecated.

你可以安全地移除：`{stub: false}`。

## {% fa fa-exclamation-triangle red %} CypressError: Timed out retrying: Expected to find element: '...', but never found it. Queried from element: <...>

如果在DOM中确定元素时可见的情况下出现此错误，则文档可能包含错误的HTML语法。在这种情况下，`document.querySelector()` 将找不到HTML格式错误之后出现的任何元素。即使你确定HTML没有任何的格式错误，但是无论如何你还要再次仔细检查（在开发工具中逐行检查）。特别是如果你已经花了很多时间去检查了所有的可能性时更加要仔细点。

# CLI错误

## {% fa fa-exclamation-triangle red %} You passed the `--record` flag but did not provide us your Record Key.

当你试图在{% url '持续集成' continuous-integration %}中运行Cypress测试时，可能会收到此错误。这意味着你没有将特定的记录键传递给：{% url '`cypress run --record`' command-line#cypress-run %}。

因为没有传递记录键，所以Cypress检查名称为`CYPRESS_RECORD_KEY`的所有环境变量。在本例中，也没有找到。

你可以通过在测试运行器中的settings选项卡中或者在{% url '仪表盘服务' https://on.cypress.io/dashboard %}中找到项目的记录键。

然后，你将需要{% url '将密钥添加到配置文件中，或者作为环境变量' continuous-integration#Record-tests %}。

## {% fa fa-exclamation-triangle red %} The `cypress ci` command has been deprecated

对于版本{% url `0.19.0` changelog#0-19-0 %}和CLI版本`0.13.0`，`cypress ci`命令已经被弃用。我们这样做是为了更清楚地说明*常规测试运行*和*记录测试运行*之间的区别。

在记录运行之前，你有环境变量：`CYPRESS_CI_KEY`，或者你写成：

```shell
cypress ci abc-key-123
```

你需要重写如下：

```shell
cypress run --record --key abc-key-123
```

如果使用环境变量`CYPRESS_CI_KEY`，则将其重命名为`cypress_record_key`。

你现在可以运行并省略`--key`标志：

```shell
cypress run --record
```

我们将自动应用record key环境变量。

## {% fa fa-exclamation-triangle red %} A Cached Cypress Binary Could not be found

在CI中，当使用`cypress run`而系统上没有安装有效的cypress二进制缓存（在linux上是`~/.cache/ cypress`）时，会发生此错误。

要修复此错误，请遵循关于{% url "在CI中缓存cypress二进制文件" continuous-integration#Caching %}的说明，然后修改CI缓存的版本，以确保构建干净。

## {% fa fa-exclamation-triangle red %} Incorrect usage of `--ci-build-id` flag

你传递了`--ci-build-id`标志，但没有提供 {% url "`--group`" command-line#cypress-run-group-lt-name-gt %}或{% url "`--parallel`" command-line#cypress-run-parallel %}标志。

`--ci-build-id`标志用于分组或将多个运行并行化。

查看我们的{% url "并行化运行指南" parallelization %}，以及何时使用{% url "`--ci-build-id`" command-line#cypress-run-ci-build-id-lt-id-gt %}选项。

## {% fa fa-exclamation-triangle red %} The `--ci-build-id`, `--group`, or `--parallel` flags can only be used when recording

你传递了`--ci-build-id`、{% url "`--group`" command-line#cypress-run-group-lt-name-gt %}或{% url "`--parallel`" command-line#cypress-run-parallel %}标志，但没有同时传递`--record`标志。

这些标志只能在记录到{% url "仪表板服务" dashboard-service %}时使用。

请查看我们的{% url "并行化" parallelization %}文档以了解更多信息。

## {% fa fa-exclamation-triangle red %} We could not determine a unique CI build ID

你传递了{% url "`--group`" command-line#cypress-run-group-lt-name-gt %}或{% url "`--parallel`" command-line#cypress-run-parallel %}标志，但我们无法自动确定或生成`ciBuildId`。

为了使用这些参数之一，必须确定`ciBuildId`。

如果你在大多数{% url "CI供应商" continuous-integration#Examples %}中运行Cypress，则会自动检测到`ciBuildId`。请检查你的CI供应商的{% url "本机识别的环境变量" parallelization#CI-Build-ID-environment-variables-by-provider %}。

你可以通过手动将ID传递给{% url "`--ci-build-id`" command-line#cypress-run-ci-build-id-lt-id-gt %}标志来避免这种检查。

请查看我们的{% url "并行化" parallelization %}来文档了解更多信息。

## {% fa fa-exclamation-triangle red %} Group name has already been used for this run

你传递了{% url "`--group`" command-line#cypress-run-group-lt-name-gt %}标志，但此组名称已经用于此运行。

如果你想尝试并行化此运行，那么还要传递{% url "`--parallel`" command-line#cypress-run-parallel %}标志，否则要传递一个不同的组名。

请查看{% url "分组测试运行" parallelization#Grouping-test-runs %}文档来了解更多信息。

## {% fa fa-exclamation-triangle red %} Cannot parallelize tests across environments

你传递了{% url "`--parallel`" command-line#cypress-run-parallel %}标志，但是我们没有在不同的环境中并行化测试。

这台机器发送的环境参数与第一台启动此并行运行的机器不同。

为了在并行模式下运行，每台机器必须发送相同的环境参数，如：

- Specs
- 操作系统名称
- 操作系统的版本号
- 浏览器的名字
- 主要的浏览器版本

请查看我们的{% url "并行化" parallelization %}文档以了解更多信息。

## {% fa fa-exclamation-triangle red %} Cannot parallelize tests in this group

你传递了`--parallel`标志，但是这个运行组最初是在没有`--parallel`标志的情况下创建的。

你不能在这个组中使用{% url "`--parallel`" command-line#cypress-run-parallel %}标志。

请查看我们的{% url "分组测试运行" parallelization#Grouping-test-runs %}文档来了解更多信息。

## {% fa fa-exclamation-triangle red %} Run must pass `--parallel` flag

你没有传递`--parallel`标志，但是这个运行的组最初是用`--parallel`标志创建的。

你必须对这个组使用{% url "`--parallel`" command-line#cypress-run-parallel %}标志。

请查看我们的{% url "并行化" parallelization %}文档来了解更多信息。

## {% fa fa-exclamation-triangle red %} Cannot parallelize tests on a stale run

你试图将{% url "`--parallel`" command-line#cypress-run-parallel %}标志传递给一个在24小时前完成的运行。

你不能在已完成那么长时间的运行中运行测试。

请查看我们的{% url "并行化" parallelization %}文档来了解更多信息。

## {% fa fa-exclamation-triangle red %} Run is not accepting any new groups

正在尝试访问的运行已经完成，不会接受新组。

当运行完成所有组时，它将等待一组可配置的时间，然后才最终完成。你必须在此期间添加更多的组。

请查看我们的{% url "并行化" parallelization %}文档来了解更多信息。

# 页面加载错误

## {% fa fa-exclamation-triangle red %} Cypress detected a cross-origin error happened on page load

{% note info %}
要更详细地解释Cypress的Web安全模型，{% url '请阅读我们的Web安全专用指南' web-security %}
{% endnote %}

这个错误意味着你的应用程序导航到Cypress没有绑定到的超域。最初，当你{% url `cy.visit()` visit %}时，Cypress将更改浏览器的url以匹配传递给{% url `cy.visit()` visit %}的`url`。这使Cypress能够与你的应用程序通信，从而绕过所有同源安全策略。

当你的应用程序导航到当前同源策略之外的超域时，Cypress无法与它通信，因此会失败。

### 对于这些常见的情况，有一些简单的解决方法：

1. 不要在测试中点击导航到应用程序外部的`<a>`链接。无论如何，这都不值得测试。你应该问问自己：*点击进入另一个应用程序有什么意义？*可能你只关心`href`属性是否与你期望的匹配。所以简单地做一个断言即可。你可以{% url '在我们的“标签处理和链接”示例方法' recipes#Testing-the-DOM %}中看到更多关于测试锚链接的策略。

2. 你正在测试一个使用`单点登录（SSO）`的页面。在这种情况下，你的web服务器可能会在超域之间重定向你，因此你将收到此错误消息。你可以通过使用{% url `cy.request()` request %}手动处理会话来解决这个重定向问题。

如果你发现自己陷入困境，无法解决这些问题，你可以把这个设置在你的`cypress.json`文件中。但在这样做之前，你应该真正理解和{% url '阅读这里的推理' web-security %}。

```javascript
// cypress.json

{
  "chromeWebSecurity": false
}
```

## {% fa fa-exclamation-triangle red %} Cypress detected that an uncaught error was thrown from a cross-origin script.

检查你的开发人员工具控制台是否有实际错误——它应该打印在那里。

可以通过添加`crossorigin`属性并设置`CORS`头部来调试这些脚本。

# 浏览器错误

## {% fa fa-exclamation-triangle red %} The Chromium Renderer process just crashed

浏览器是极其复杂的软件，它们会不时地不一致地*毫无理由*崩溃。崩溃只是运行自动化测试的一部分。

{% imgTag /img/guides/chromium-renderer-crashed.png "Chromium Renderer process just crashed" %}

目前，我们还没有实现一种自动的方法来恢复浏览器，但是实际上我们可以这样做。我们有一个{% issue 349 '开放的问题记录了步骤' %}用于重启呈现器进程并继续运行。如果你看到一致的崩溃，并希望实现此功能，请在问题中留言。

如果你正在运行`Docker`{% issue 350 '这里有个简单的一行代码来解决这个问题' %}

# 测试运行器错误

## {% fa fa-exclamation-triangle red %} Cannot connect to API server

登录、查看运行和设置要记录的新项目需要连接到外部API服务器。当连接到API服务器失败时，将显示此错误。

出现这个错误可能是因为：

1. 你没有网络。请确保已连接，然后重试。
2. 你是一个开发人员，你已经克隆了我们的代码库，但没有权限在本地运行我们的API。请阅读我们的{% url "贡献文档" https://on.cypress.io/contributing %}。

## {% fa fa-exclamation-triangle red %} Cypress detected policy settings on your computer that may cause issues

When Cypress launches Chrome, it attempts to launch it with a custom proxy server and browser extension. Certain group policies (GPOs) on Windows can prevent this from working as intended, which can cause tests to break.

If your administrator has set any of the following Chrome GPOs, it can prevent your tests from running in Chrome:

- Proxy policies: `ProxySettings, ProxyMode, ProxyServerMode, ProxyServer, ProxyPacUrl, ProxyBypassList`
- Extension policies: `ExtensionInstallBlacklist, ExtensionInstallWhitelist, ExtensionInstallForcelist, ExtensionInstallSources, ExtensionAllowedTypes, ExtensionAllowInsecureUpdates, ExtensionSettings, UninstallBlacklistedExtensions`

Here are some potential workarounds:

1. Ask your administrator to disable these policies so that you can use Cypress with Chrome.
2. Use the built-in Electron browser for tests, since it is not affected by these policies. {% url 'See the guide to launching browsers for more information.' launching-browsers#Electron-Browser %}
3. Try using Chromium instead of Google Chrome for your tests, since it may be unaffected by GPO. You can {% url "download the latest Chromium build here." https://download-chromium.appspot.com/ %}
4. If you have Local Administrator access to your computer, you may be able to delete the registry keys that are affecting Chrome. Here are some instructions:
    1. Open up Registry Editor by pressing WinKey+R and typing `regedit.exe`
    2. Look in the following locations for the policy settings listed above:
        - `HKEY_LOCAL_MACHINE\Software\Policies\Google\Chrome`
        - `HKEY_LOCAL_MACHINE\Software\Policies\Google\Chromium`
        - `HKEY_CURRENT_USER\Software\Policies\Google\Chrome`
        - `HKEY_CURRENT_USER\Software\Policies\Google\Chromium`
    3. Delete or rename any policy keys found. *Make sure to back up your registry before making any changes.*

## {% fa fa-exclamation-triangle red %} Uncaught exceptions from your application

尚未完成。我们很快会在这里添加更多内容。

现在，请访问{% url '事件目录' catalog-of-events#Uncaught-Exceptions %}页面，了解如何关闭抓取未捕获异常的示例。
