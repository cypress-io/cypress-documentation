---
title: API模块
---

您可以从您的测试应用程序中要求Cypress作为节点模块. 当你想在运行后直接访问测试结果时，这是非常有用的. 例如, 您可以使用此工作流:

- 发送包含截图的失败测试通知
- 重新运行一个失败的规范文件
- 踢开其他的构建或脚本

## `cypress.run()`

运行Cypress测试并且解决所有测试结果. 参考{% url 'Cypress的API模块食谱' https://github.com/cypress-io/cypress-example-recipes#cypress-module-api %}.

### 可选参数

正如`cypress run`的{% url "命令行选项" command-line %}, 您可以传递修改Cypress运行方式的选项.

选项 | 描述
------ |  ---------
`browser`  | 通过名称或文件系统路径指定要在其中运行测试的不同浏览器
`ciBuildId` | 指定要运行的唯一标识符, 通过启用{% url "分组" parallelization#Grouping-test-runs %}或者{% url "平行" parallelization %}
`config`  | 指定配置
`env`  | 指定环境变量
`group` | 将记录的测试{% url "分组" parallelization#Grouping-test-runs %}到一起去运行
`headed`  | 显示Electron浏览器而不是运行无头浏览器
`key`  | 指定你的秘密记录密钥
`noExit` | 在所有的测试都运行完后, 继续保持Cypress开着
`parallel` | {% url "并行" parallelization %}多台机器运行已记录的规格
`port`  | 覆盖缺省端口
`project` | 指向特定项目的路径
`record`  | 是否记录测试运行
`reporter`  | 指定一个mocha报告期
`reporterOptions`  | 指定mocha报告器选项
`spec`  | 指定要运行的规格

```javascript
const cypress = require('cypress')

cypress.run({
  reporter: 'junit',
  browser: 'chrome',
  config: {
    baseUrl: 'http://localhost:8080',
    chromeWebSecurity: false,
  },
  env: {
    foo: 'bar',
    baz: 'quux',
  }
})
```

### 例子

下面是一个以编程方式运行规范文件的示例:

```js
const cypress = require('cypress')

cypress.run({
  spec: './cypress/integration/examples/actions.spec.js'
})
.then((results) => {
  console.log(results)
})
.catch((err) => {
  console.error(err)
})
```

`cypress.run()`返回一个使用包含测试结果的对象进行解析的`Promise`. 一个典型的运行可以返回类似这样的东西:

```json
{
  "cypressVersion": "3.0.2",
  "endedTestsAt": "2018-07-11T17:53:35.675Z",
  "browserName": "electron",
  "browserPath": "path/to/browser",
  "browserVersion": "59.0.3071.115",
  "config": {...},
  "osName": "darwin",
  "osVersion": "14.5.0",
  "runs": [{
    "error": null,
    "hooks": [...],
    "reporter": "spec",
    "reporterStats": {...},
    "screenshots": [],
    "shouldUploadVideo": true,
    "spec": {...},
    "stats": {...},
    "tests": [...],
    "video": "User/janelane/my-app/cypress/videos/abc123.mp4"
  }],
  "runUrl": "https://dashboard.cypress.io/projects/def456/runs/12",
  "startedTestsAt": "2018-07-11T17:53:35.463Z",
  "totalDuration": 212,
  "totalFailed": 1,
  "totalPassed": 0,
  "totalPending": 0,
  "totalSkipped": 12,
  "totalSuites": 8,
  "totalTests": 13,
}
```

Find the TypeScript definition for the results object in the {% url "`cypress/cli/types` folder" https://github.com/cypress-io/cypress/tree/develop/cli/types %}.

Even when tests fail, the `Promise` still resolves with the test results. The `Promise` is only rejected if Cypress cannot run for some reason; for example if a binary has not been installed or it cannot find  a module dependency. In that case, the `Promise` will be rejected with a detailed error.

## `cypress.open()`

### Options

Just like the {% url "Command Line options" command-line %}, you can pass options that modify how Cypress runs.

Option | Description
------ | ---------
`browser` | Specify a filesystem path to a custom browser
`config`  | Specify configuration
`detached` | Open Cypress in detached mode
`env`  | Specify environment variables
`global` | Run in global mode
`port`  | Override default port
`project` | Path to a specific project

### Example

```javascript
const cypress = require('cypress')

cypress.open()
```
