---
title: 报告生成器
---

因为Cypress也是在Mocha的基础上构建的，所以任何为Mocha构建的报告生成器都可以在Cypress里使用。这里有一个Mocha内建报告生成器列表：

* {% url "Mocha内建报告生成器" https://mochajs.org/#reporters %}

我们同样为Mocha添加了另外两个普遍使用的第三方的报告生成器。同样地构建在Cypress里，你可以不用额外安装直接使用：

* {% url "`teamcity`" https://github.com/cypress-io/mocha-teamcity-reporter %}
* {% url "`junit`" https://github.com/michaelleeallen/mocha-junit-reporter %}

最后，我们也支持自定义，或其他第三方的报告生成器。

{% note success %}
你知道吗？你可以利用Mocha使用{% urlHash '多报告生成器' 多报告生成器 %}？

这通常在CI的时候是很有用的。典型的情况是，我们看到使用者用默认的`spec`报告去展示`stdout`，同时也用`junit`生成一个实际的报告文件。
{% endnote %}

{% note %}
Once you've read through the documentation below, we invite you to experience the power of Cypress reporters via {% url "Section 9" https://github.com/cypress-io/testing-workshop-cypress/blob/master/slides/09-reporters/PITCHME.md %} of our open source {% url "testing workshop for Cypress" https://github.com/cypress-io/testing-workshop-cypress %}.
{% endnote %}

# 报告生成器选项

一些报告生成器接受参数以便用户自定义一些行为。这些可以在`cypress.json`或在命令行里进行传递：

***cypress.json***

```json
{
  "reporter": "junit",
  "reporterOptions": {
    "mochaFile": "results/my-test-output.xml",
    "toConsole": true
  }
}
```

### 命令行

```shell
cypress run --reporter junit \
  --reporter-options "mochaFile=results/my-test-output.xml,toConsole=true"
```

以上配置会输出JUnit的报告到`STDOUT`（标准输出）并保存一份为XML文件。有的报告生成器可能不支持参数选项，就算有也可能各自不相同。请参考各自的报告生成器文档。

## Report per spec

从Cypress 3+开始，在`cypress run`的执行过程中，每一个测试用例文件都是完全单独运行的，这意味着后面的测试结果会覆盖之前的测试结果呢。为了针对每个测试文件生成单独的测试报告，请在`mochaFile`文件中使用`[hash]`：

```json
{
  "reporter": "junit",
  "reporterOptions": {
    "mochaFile": "results/my-test-output-[hash].xml"
  }
}
```

这将会在`results`目录下创建分开的XML报告文件。你可以使用第三方的工具来进行合并。比如，对于{% url Mochawesome https://github.com/adamgruber/mochawesome %}报告生成器，有一款{% url mochawesome-merge https://github.com/antontelesh/mochawesome-merge %}工具。

# 多报告生成器

很多时候，我们看到用户想要拥有多报告生成器的能力。当运行在CI模式下的时候，你可能想要生成一个`junit`报告的同时，再生成一个`json`格式的报告。这是非常好的，但是，通过设置了这些之后你将可能，不会再在测试运行时收到额外的反馈信息。

解决方案有的，就是使用多报告生成器。你将收到两个报告带来的益处。

我们建议使用这个优秀的npm模块：

{% fa fa-github %} {% url 'https://github.com/stanleyhlng/mocha-multi-reporters' %}

对于我们自己的内部项目，每一个我们都使用多报告生成器。

## 多报告生成器示例

示例都在{% url https://github.com/cypress-io/cypress-example-circleci-orb %}已被实现。

### 用例文件测试报告到标准输出`STDOUT`，保存JUnit XML文件

我们想要输出一个测试用例“spec”报告到`STDOUT`，同时，保存Mochawesome JSON格式的所有报告并且合并到一个单独的报告文件里。

我们需要安装额外的依赖，包括Mocha本身：

```shell
npm install --save-dev mocha mocha-multi-reporters mocha-junit-reporter
```

然后添加一个单独的`reporter-config.json`文件，使能`spec`和`junit`报告生成器，使得`junit`报告生成器能够保存每一个单独的XML报告文件：

```json
{
  "reporterEnabled": "spec, mocha-junit-reporter",
  "reporterOptions": {
    "mochaFile": "cypress/results/results-[hash].xml"
  }
}
```

命令行指令告诉Cypress使用`mocha-multi-reporters`模块并且指明了配置文件：

```shell
cypress run --reporter mocha-multi-reporters \
  --reporter-options configFile=reporter-config.json
```

注意：我们推荐在运行此指令前，删除`cypress/results`目录下所有的文件，因为每一次运行都会生成新的XML文件。比如，我们可以在`package.json`下面添加npm脚本指令：

```
{
  "scripts": {
    "delete:reports": "rm cypress/results/* || true",
    "prereport": "npm run delete:reports",
    "report": "cypress run"
  }
}
```

然后再调用`npm run report`。

### 用例文件测试报告到标准输出`STDOUT`，输出合并后的Mochawesome JSON报告文件

本示例在{% url https://github.com/cypress-io/cypress-example-circleci-orb %}的分支`spec-and-single-mochawesome-json`有展示。我们想要输出测试用例文件对应的报告文件到标准输出`STDOUT`，保存各个测试用例文件的Mochawesome JSON报告，并合并所有的JSON报告成一个。

我们需要安装几个依赖：

```shell
npm install --save-dev mocha mochawesome mochawesome-merge mochawesome-report-generator
```

然后在`cypress.json`配置报告生成器，跳过HTML报告生成并保存每一个JSON测试报告到`cypress/results`目录：

```json
{
  "reporter": "mochawesome",
  "reporterOptions": {
    "reportDir": "cypress/results",
    "overwrite": false,
    "html": false,
    "json": true
  }
}
```

这样就会生成`cypress/results/mochawesome.json, cypress/results/mochawesome_001.json, ...`等报告文件。然后我门就可以使用{% url 'mochawesome-merge' https://github.com/antontelesh/mochawesome-merge %}来合并它们。

```shell
npx mochawesome-merge --reportDir cypress/results > mochawesome.json
```

现在我们可以利用`mochawesome.json`和% url https://github.com/adamgruber/mochawesome-report-generator %}来生成一个合并后的HTML报告了：

```shell
npx mochawesome-report-generator mochawesome.json
```

这样会生成一个如下所示的漂亮的独立的HTML报告`mochawesome-report/mochawesome.html`。你可以看到，所有的测试结果，时间信息，甚至测试代码信息等：

{% imgTag /img/guides/mochawesome-report.png "Mochawesome HTML report" %}

请参考{% url 'Integrating Mochawesome reporter with Cypress's http://antontelesh.github.io/testing/2019/02/04/mochawesome-merge.html %}了解更多信息。

# 自定义报告生成器

Cypress支持自定义报告生成器，不管是在你本地的还是通过{% url "npm" https://www.npmjs.com/ %}安装的。

## 本地报告生成器

假设你有如下的目录结构：

```txt
> my-project
  > cypress
  > src
  > reporters
    - custom.js
```

### 设定自定义报告生成器的路径：

```javascript
// cypress.json

{
  "reporter": "reporters/custom.js"
}
```

以上路径是相对于`cypress.json`文件所在的位置的相对路径。

### 命令行

```shell
cypress run --reporter reporters/custom.js
```

我们同样支持传递绝对路径。

## npm报告生成器

如果你通过npm来安装一个自定义的报告生成器，需要按照如下定义包名：

```javascript
// cypress.json

{
  "reporter": "mochawesome"
}
```

### 命令行

```shell
cypress run --reporter mochawesome
```

{% note info  %}
你需要为报告生成器安装所有的对等依赖项，哪怕它们与Cypress是绑定在一起的。例如，{% url "mochawesome" https://github.com/adamgruber/mochawesome %}需要`mocha`作为对等依赖。你需要为你的项目安装`mocha`作为一个开发依赖项以便它能正常工作。
{% endnote %}
