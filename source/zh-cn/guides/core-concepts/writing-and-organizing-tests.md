---
title: 编写和组织测试
---

{% note info %}
# {% fa fa-graduation-cap %} 你将会学习到什么

- 怎么组织你的测试和支持文件。
- 测试文件支持哪些语言。
- Cypress怎么处理单元测试与集成测试。
- 如何对测试进行分组。
{% endnote %}

{% note success "最佳实践" %}
我们最近在AssertJS(2018年2月）举行了“最佳实践”会议。该视频演示了如何分解应用程序和组织测试。

{% fa fa-play-circle %} {% url https://www.youtube.com/watch?v=5XQOK0v_YRE %}
{% endnote %}

# 目录结构

在新建项目后，Cypress将自动创建标准文件夹结构，默认情况下，它将是这样：

```text
/cypress
  /fixtures
    - example.json

  /integration
    /examples
      - actions.spec.js
      - aliasing.spec.js
      - assertions.spec.js
      - connectors.spec.js
      - cookies.spec.js
      - cypress_api.spec.js
      - files.spec.js
      - local_storage.spec.js
      - location.spec.js
      - misc.spec.js
      - navigation.spec.js
      - network_requests.spec.js
      - querying.spec.js
      - spies_stubs_clocks.spec.js
      - traversal.spec.js
      - utilities.spec.js
      - viewport.spec.js
      - waiting.spec.js
      - window.spec.js

  /plugins
    - index.js

  /support
    - commands.js
    - index.js
```

***配置文件夹结构***

虽然Cypress允许你自定义测试文件、fixtures和support文件夹位置，但如果你要开始第一个项目，我们建议你使用上面的标准结构。

你可以在`cypress.json`中修改文件夹的配置。有关更多详细信息，请参考{% url '配置' configuration#Folders-Files %}。

{% note info "我应该将哪些文件添加到'.gitignore 文件' ？" %}
Cypress将会创建{% url `screenshotsFolder` configuration#Screenshots %} 和 {% url `videosFolder` configuration#Videos %}目录，用于保存在测试程序期间拍摄的屏幕截图和视频。许多用户会选择将这些文件夹添加到他们的 `.gitignore` 文件中. 另外，如果你将敏感环境变量存储在 `cypress.json` 或者 {% url `cypress.env.json` environment-variables#Option-2-cypress-env-json %}中，那么当你使用源代码管理工具时也应该忽略这些文件。
{% endnote %}

## Fixture 文件

Fixtures是测试过程中需要用到的外部静态数据。Fixture文件默认存放在 `cypress/fixtures` 中，但它可以 {% url '配置' configuration#Folders-Files %} 到另外一个目录。

你通常会将它们与 {% url `cy.fixture()` fixture %} 命令一起使用，并且最常用于存储 {% url '网络请求' network-requests %}。

## 测试文件

测试文件默认位于 `cypress/integration` 中，但它可以 {% url '配置' configuration#Folders-Files %} 到另外一个目录。测试文件支持以下格式：

- `.js`
- `.jsx`
- `.coffee`
- `.cjsx`

Cypress还支持开箱即用的 `ES2015` 。你可以使用 `ES2015 modules` 或 `CommonJS modules`。这意味着你可以 `import` 或 `require` **npm packages** 和 **local relative modules**。

{% note info 示例 %}
你可以参考我们的例子 {% url 'ES2015 and CommonJS modules' recipes#Node-Modules %}.
{% endnote %}

要查看Cypress中每个命令的示例， 可以打开你的 `cypress/integration` 文件夹中的 {% url "`example` 目录" https://github.com/cypress-io/cypress-example-kitchensink/blob/master/cypress/integration/examples %} 。

要开始为你的应用程序编写测试，只需要在 `cypress/integration` 文件夹中创建一个新文件，例如：`app_spec.js`。刷新Cypress测试执行程序中的测试列表，你新建的文件应该会出现在列表中。

## 插件（Plugin）文件

默认情况下，Cypress将会在每个spec文件运行**之前**自动包含插件文件 `cypress/plugins/index.js`。我们这样做纯粹是想方便用户，因此你不必在每个spec中导入此文件。

初始导入的插件文件可以 {% url '配置为另外一个文件' configuration#Folders-Files %}。 

{% url "了解有关更多使用插件来扩展Cypress的信息." plugins-guide %}

## 支持（Support）文件

默认情况下，Cypress会自动包含支持文件 `cypress/support/index.js`。该文件在每个spec文件**之前**运行。 我们这样做纯粹是想方便用户，因此你不必在每个spec中导入此文件。

初始导入的插件文件可以 {% url '配置为另外一个文件' configuration#Folders-Files %}.

支持文件是存放可重用行为的好地方，例如你希望应用程序可用于所有文件的自定义命令或全局覆盖。

你可以在任何 `cypress/support` 文件中的 `beforeEach` 中定义自己的行为：

```javascript
beforeEach(function () {
  cy.log('I run before every test in every spec file!!!!!!')
})
```

{% imgTag /img/guides/global-hooks.png "Global hooks for tests" %}

{% note info %}
**Note:** 这个示例假设你已经熟悉 Mocha {% url '钩子' writing-and-organizing-tests#Hooks %}. 
{% endnote %}

{% note danger%}
{% fa fa-warning %} 请记住，在全局钩子中设置某些内容会让其变得不那么灵活，无法进行更改以及测试其行为。 
{% endnote %}

对于你的支持文件，你还是需要通过组织 `import` 或 `require` 来包含其它文件。

我们会自动为你提供一个示例支持文件，该文件中有几个注释掉的示例。

{% note info 示例 %}
我们的 {% url '扩展Cypress示例' recipes#Node-Modules %} 向你展示了如何修改支持文件。
{% endnote %}

# 编写测试

Cypress建立在{% url 'Mocha' bundled-tools#Mocha %} 和 {% url 'Chai' bundled-tools#Chai %}之上。我们支持Chai的 `BDD` 和 `TDD` 断言风格。你在Cypress中写的测试大部分都是这种风格。

如果你熟悉用JavaScript编写测试，那么在Cypress中编写测试将是轻而易举的事情。

## 测试结构

从 {% url 'Mocha' bundled-tools#Mocha %} 借鉴过来的测试接口提供了 `describe()`，`context()`，`it()`和`specify()`方法。

`context()` 与 `describe()` 相同， `specify()` 与 `it()` 相同，所以选择最适合你的就行了。

```javascript
// -- Start: Our Application Code --
function add (a, b) {
  return a + b
}

function subtract (a, b) {
  return a - b
}

function divide (a, b) {
  return a / b
}

function multiply (a, b) {
  return a * b
}
// -- End: Our Application Code --

// -- Start: Our Cypress Tests --
describe('Unit test our math functions', function() {
  context('math', function() {
    it('can add numbers', function() {
      expect(add(1, 2)).to.eq(3)
    })

    it('can subtract numbers', function() {
      expect(subtract(5, 12)).to.eq(-7)
    })

    specify('can divide numbers', function() {
      expect(divide(27, 9)).to.eq(3)
    })

    specify('can multiply numbers', function() {
      expect(multiply(5, 4)).to.eq(20)
    })
  })
})
// -- End: Our Cypress Tests --
```

## 钩子

Cypress还提供了钩子(从{% url 'Mocha' bundled-tools#Mocha %}借鉴过来)。

这有助于你在一组测试运行之前或每次测试运行之前设置一些条件。它们也有助于在一系列测试后或每次测试后清理一些条件。

```javascript
describe('Hooks', function() {
  before(function() {
    // runs once before all tests in the block
  })

  after(function() {
    // runs once after all tests in the block
  })

  beforeEach(function() {
    // runs before each test in the block
  })

  afterEach(function() {
    // runs after each test in the block
  })
})
```

### 钩子和测试执行的顺序如下：

- 所有 `before()` 钩子 (只运行一次)
- 任何 `beforeEach()` 钩子
- 运行测试
- 任何 `afterEach()` 钩子
- 所有 `after()` 钩子 (只运行一次)

{% note danger %}
{% fa fa-warning %} 在编写 `after()` 或 `afterEach()` 钩子时，请参考我们的 {% url "关于用 `after()` 或 `afterEach()` 来清理状态的一些想法" best-practices#Using-after-or-afterEach-hooks %}。
{% endnote %}

## 排除和包括测试

要运行指定的套件或测试，只需要将 `.only` 附件到该函数即可。所有嵌套的套件也将被执行。这使我们能够一次运行一个测试，并且这是编写测试套件的推荐方法。

```javascript
// -- Start: Our Application Code --
function fizzbuzz (num) {
  if (num % 3 === 0 && num % 5 === 0) {
    return 'fizzbuzz'
  }

  if (num % 3 === 0) {
    return 'fizz'
  }

  if (num % 5 === 0) {
    return 'buzz'
  }
}
// -- End: Our Application Code --

// -- Start: Our Cypress Tests --
describe('Unit Test FizzBuzz', function () {
  function numsExpectedToEq (arr, expected) {
    // loop through the array of nums and make
    // sure they equal what is expected
    arr.forEach((num) => {
      expect(fizzbuzz(num)).to.eq(expected)
    })
  }

  it.only('returns "fizz" when number is multiple of 3', function () {
    numsExpectedToEq([9, 12, 18], 'fizz')
  })

  it('returns "buzz" when number is multiple of 5', function () {
    numsExpectedToEq([10, 20, 25], 'buzz')
  })

  it('returns "fizzbuzz" when number is multiple of both 3 and 5', function () {
    numsExpectedToEq([15, 30, 60], 'fizzbuzz')
  })
})

```

要跳过指定的套件或测试，只需要将 `.skip()` 附加到该函数即可。所有嵌套套件也将被跳过。

```javascript
it.skip('returns "fizz" when number is multiple of 3', function () {
  numsExpectedToEq([9, 12, 18], 'fizz')
})
```

## 动态生成测试

你可以使用JavaScript来动态生成测试。

```javascript
describe('if your app uses jQuery', function () {
  ['mouseover', 'mouseout', 'mouseenter', 'mouseleave'].forEach((event) => {
    it('triggers event: ' + event, function () {
      // if your app uses jQuery, then we can trigger a jQuery
      // event that causes the event callback to fire
      cy
        .get('#with-jquery').invoke('trigger', event)
        .get('#messages').should('contain', 'the event ' + event + 'was fired')
    })
  })
})
```

上面的代码将生成一个包含4个测试的套件。

```text
> if your app uses jQuery
  > triggers event: 'mouseover'
  > triggers event: 'mouseout'
  > triggers event: 'mouseenter'
  > triggers event: 'mouseleave'
```

## 断言风格

Cypress支持BDD (`expect`/`should`) 和 TDD (`assert`) 风格断言。 {% url "阅读更过断言的内容" assertions %}

```javascript
it('can add numbers', function() {
  expect(add(1, 2)).to.eq(3)
})

it('can subtract numbers', function() {
  assert.equal(subtract(5, 12), -7, 'these numbers are equal')
})
```

# 监听测试文件

当使用 {% url "`cypress open`" command-line#cypress-open %}命令启动交互模式时，Cypress会监视spec文件的改动。添加或更新测试文件后，Cypress会重新加载并运行该spec文件中的所有测试。

这可以提供高效的开发体验，因为你可以在实现功能时添加和编辑测试，Cypress用户界面将始终反映最新编辑的结果。

{% note info %}
请记住使用 {% url `.only` writing-and-organizing-tests#Excluding-and-Including-Tests %} 来限制运行哪些测试：当你在一个测试中进行大量测试时，这会特别有用。你也可以考虑将spec文件拆分成较小的文件，每个文件处理逻辑相关的行为。
{% endnote %}

## 哪些内容被监听

**文件**

* {% url `cypress.json` configuration %}
* {% url `cypress.env.json` environment-variables %}

**文件夹**

* `cypress/integration/`
* `cypress/support/`
* `cypress/plugins/`

上面的文件夹，文件夹中的文件以及所有子文件夹及其文件（递归）都将被监视。

{% note info %}
这些文件夹路径引用自 {% url '默认文件夹路径' configuration#Folders-Files %}。如果你已经将Cypress配置为使用不同的文件夹路径，那么就会监听你自己配置的文件夹。
{% endnote %}

## 哪些内容不被监听

其它一切，这包括但不限于以下内容：

* 你应用程序的代码
* `node_modules`
* `cypress/fixtures/`

如果你正在使用基于现代Web应用程序的技术栈进行开发，那么你可能会获得某种形式的热模块替换支持，这些替换负责监视你的应用程序代码 - HTML，CSS，JS，其它。- 如果有文件改动将会重新加载你的应用程序。

## 配置

设置 {% url `watchForFileChanges` configuration#Global %} 配置项为 `false` 将会禁用文件监视功能。

{% note warning %}
在执行 {% url "`cypress run`" command-line#cypress-run %}命令期间，是不会监听**任何**内容。

只有在使用 {% url "`cypress open`" command-line#cypress-open %}命令时候，`watchForFileChanges` 属性才会生效。
{% endnote %}

负责Cypress文件监视行为的组件是 {% url 'Cypress Browserify Preprocessor' https://github.com/cypress-io/cypress-browserify-preprocessor %}。这是Cypress默认的文件监视器。

如果你需要进一步控制文件监视行为，可以显示的配置此预处理器：它公开了可以配置哪些选项，例如 _what_被监视以及更改后发出更新事件之前的延迟。

Cypress还发布了其它{% url "文件监视预处理器" plugins %}插件，如果你需要使用它们，必须明确的配置它们。

- {% url 'Cypress Watch Preprocessor' https://github.com/cypress-io/cypress-watch-preprocessor %}
- {% url 'Cypress webpack Preprocessor' https://github.com/cypress-io/cypress-webpack-preprocessor %}
