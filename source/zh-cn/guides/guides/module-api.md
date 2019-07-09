---
title: API模块
---

你可以从你的测试应用程序中要求Cypress作为Node的模块。当你想在运行后直接访问测试结果时，这是非常有用的. 例如, 你可以使用此工作流:

- 发送包含截图的失败测试通知
- 重新运行一个失败的规范文件
- 踢开其他的构建或脚本

## `cypress.run()`

运行Cypress测试并且解决所有测试结果. 参考{% url 'Cypress的API模块食谱' https://github.com/cypress-io/cypress-example-recipes#cypress-module-api %}.

### 可选参数

正如`cypress run`的{% url "命令行选项" command-line %}, 你可以传递修改Cypress运行方式的选项.

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

在{% url "`cypress/cli/types`文件夹中" https://github.com/cypress-io/cypress/tree/develop/cli/types %}为结果对象集找到TypeScript定义.

即使测试失败, `Promise`仍然使用测试结果解析. 如果Cypress因为某些原因跑不起来, `Promise`才会被拒绝; 例如, 如果没有安装某个二进制文件，或者无法找到某个模块依赖项. 在这种情况下, `Promise`将被拒绝, 并给出详细报错信息.

## `cypress.open()`

### 可选参数

正如{% url "命令行选项" command-line %}, 你可以传递修改Cypress运行方式的选项.

选项 | 描述
------ | ---------
`browser` | 给自定义浏览器指定文件系统路径
`config`  | 指定配置
`detached` | 在分离模式中打开Cypress
`env`  | 指定环境变量
`global` | 全局模式下运行
`port`  | 覆盖默认端口
`project` | 指向特定项目的路径

### 例子

```javascript
const cypress = require('cypress')

cypress.open()
```
