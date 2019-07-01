---
title: 环境变量
---

环境变量在以下情况很有用：

- 不同开发人员计算机中的值是不同的。
- 不同环境下的值是不同的：*(dev, staging, qa, prod)*
- 值频繁变化且高度动态。

环境变量很容易更改—尤其是在CI中运行时。

### 不要在测试中对其进行硬编码：

```javascript
cy.request('https://api.acme.corp') // 这将在其他环境中中断
```

### 我们可以把它移到环境变量中。

```javascript
cy.request(Cypress.env('EXTERNAL_API')) // 指向动态环境变量
```

{% note info "使用'baseUrl'" %}
环境变量非常适用于指向外部服务和服务器，或者存储密码或其他证书。

但是，你**不**需要使用环境变量来指向测试的原点和域名。使用`baseUrl`而不是环境变量。

{% url `cy.visit()` visit %}和{% url `cy.request()` request %}自动以这个值作为前缀——不必去指定它们。

可以在`cypress.json`中设置`baseUrl`——然后你可以使用环境变量来覆盖它。

```shell
CYPRESS_baseUrl=https://staging.app.com cypress run
```
{% endnote %}

# 设置

设置环境变量有5种不同的方法。每种都有一个稍微不同的使用示例。

***简而言之，你可以***

- {% urlHash "在`cypress.json`文件中设置" 选择-1-cypress-json %}
- {% urlHash "创建一个`cypress.env.json`文件" 选择-2-cypress-env-json %}
- {% urlHash "导出为`CYPRESS_*`" 选择-3-CYPRESS %}
- {% urlHash "在CLI中传递为`--env`" 选择-4-env %}
- {% urlHash "在插件中设置一个环境变量。" 选择-5-插件 %}

不要认为只能选择一种方法。常见的做法是，使用一种策略进行本地开发，但在CI中运行时使用另一种策略。

测试运行时，可以使用{% url `Cypress.env` env %}函数访问环境变量的值。

## 选择 #1: `cypress.json`

在{% url '配置文件' configuration %}的`env`键下设置的任何键/值对都将成为环境变量。

```javascript
// cypress.json
{
  "projectId": "128076ed-9868-4e98-9cef-98dd8b705d75",
  "env": {
    "foo": "bar",
    "some": "value"
  }
}
```

### 测试文件

```javascript
Cypress.env()       // {foo: 'bar', some: 'value'}
Cypress.env('foo')  // 'bar'
Cypress.env('some') // 'value'
```

### 综述

{% note success 优点 %}
- 非常适用于需要签入源代码管理并在所有计算机上保持相同的值。
{% endnote %}

{% note danger 缺点 %}
- 只适用于所有计算机上应该相同的值。
{% endnote %}

## 选择 #2: `cypress.env.json`

你可以创建自己的`cypress.env.json`文件，Cypress将会自动检查它。这里的值会覆盖`cypress.json`中冲突的环境变量。

这个策略很有用，因为如果添加`cypress.env.json`到你的`.gitignore`文件，这里的值对于每个开发人员的计算机将会是不同的。

```javascript
// cypress.env.json
{
  "host": "veronica.dev.local",
  "api_server": "http://localhost:8888/api/v1/"
}
```

### 测试文件

```javascript
Cypress.env()             // {host: 'veronica.dev.local', api_server: 'http://localhost:8888/api/v1'}
Cypress.env('host')       // 'veronica.dev.local'
Cypress.env('api_server') // 'http://localhost:8888/api/v1/'
```

### 综述

{% note success 优点 %}
- 专用文件，只用于环境变量。
- 使你能够从其他构建过程生成此文件。
- 每个计算机上的值可能不同（如果没有签入源代码控制）。
{% endnote %}

{% note danger 缺点 %}
- 多一个需要处理的文件。
- 过度干预1或2个环境变量
{% endnote %}

## 选择 #3: `CYPRESS_*`

你的计算机中任何以`CYPRESS_`或`cypress_`开头的环境变量都将自动添加并提供给你。

冲突值将覆盖来自`cypress.json`和`cypress.env.json`文件的值。

Cypress在添加环境变量时会*去掉* `CYPRESS_`。

### 从命令行导出cypress环境变量

```shell
export CYPRESS_HOST=laura.dev.local
```

```shell
export cypress_api_server=http://localhost:8888/api/v1/
```

### 测试文件

```javascript
Cypress.env()             // {HOST: 'laura.dev.local', api_server: 'http://localhost:8888/api/v1'}
Cypress.env('HOST')       // 'laura.dev.local'
Cypress.env('api_server') // 'http://localhost:8888/api/v1/'
```

### 综述

{% note success 优点 %}
- 快速导出一些值。
- 可以存储在你的`bash_profile`。
- 允许不同机器之间的动态值。
- 特别适用于CI环境。
{% endnote %}

{% note danger 缺点 %}
- 与其他选项相比，值从何而来并不明显。
{% endnote %}

## 选择 #4: `--env`

最后，你可以在{% url '使用CLI工具' command-line#cypress-run %}时将环境变量作为选项传递进来。

这里的值将覆盖所有其他冲突的环境变量。

你可以为{% url '`cypress run`' command-line#cypress-run %}使用`--env`参数。

{% note warning  %}
多个值之间必须用逗号分隔，而不是空格。
{% endnote %}

### 从命令行或CI

```shell
cypress run --env host=kevin.dev.local,api_server=http://localhost:8888/api/v1
```

### 测试文件

```javascript
Cypress.env()             // {host: 'kevin.dev.local', api_server: 'http://localhost:8888/api/v1'}
Cypress.env('host')       // 'kevin.dev.local'
Cypress.env('api_server') // 'http://localhost:8888/api/v1/'
```

### 综述

{% note success 优点 %}
- 不需要对文件或配置进行任何更改。
- 环境变量的来源显而易见。
- 允许不同机器之间的动态值。
- 覆盖所有其他形式设置的env变量。
{% endnote %}

{% note danger 缺点 %}
- 在使用Cypress的任何地方编写`--env`选项都很痛苦。
{% endnote %}

## 选择 #5: 插件

你可以使用插件通过Node.js代码动态地设置环境变量，而不是在文件中设置环境变量。这使你可以执行诸如使用`fs`和读出配置值并动态更改它们之类的操作。

虽然这可能比其他选项需要更多的操作—无论你想要什么，它都会给你提供了最大的灵活性和管理配置的能力。

{% url "我们已经在这里完整地记录了如何做到这一点。" configuration-api %}

# 覆盖配置

如果你的环境变量与标准配置键匹配，那么它们将改为覆盖配置值，而不是设置`环境变量`。

### 修改`baseUrl`配置值/不在`Cypress.env()`中设置环境变量

```shell
export CYPRESS_BASE_URL=http://localhost:8080
```

### 'foo'不匹配配置/在`Cypress.env()`中设置环境变量

```shell
export CYPRESS_FOO=bar
```

你可以{% url '在这里阅读更多关于环境变量如何更改配置的信息' configuration %}

## 另请参阅

- {% url "环境变量的设置方法" recipes#Environment-Variables %}
