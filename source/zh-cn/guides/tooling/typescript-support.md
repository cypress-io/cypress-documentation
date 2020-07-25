---
title: TypeScript
---

Cypress自带了 {% url "TypeScript" https://www.typescriptlang.org/ %} {% url "官方类型声明" https://github.com/cypress-io/cypress/tree/develop/cli/types %}让你可以使用Typescript写测试代码。

## 安装 TypeScript

要让Cypress支持Typescript你需要在项目中安装TypeScript

```bash
npm install typescript
```

## 配置开发环境

在开始之前，请参考 {% url "TypeScript's Editor Support 文档" https://github.com/Microsoft/TypeScript/wiki/TypeScript-Editor-Support %} 并按照步骤配置你的IDE来支持TypeScript，参考{% url "intelligent code completion" IDE-integration#Intelligent-Code-Completion %} 来配置你的开发环境，{% url "Visual Studio Code" https://code.visualstudio.com/ %}，{% url "Visual Studio" https://www.visualstudio.com/ %}和{% url "WebStorm" https://www.jetbrains.com/webstorm/ %}原生支持Typescript，其他编辑器需要额外的配置。

## 配置 tsconfig.json

我们推荐你在{% url "`cypress` 文件夹下" writing-and-organizing-tests#Folder-Structure %}按下面的配置来配置你的{% url "`tsconfig.json`" http://www.typescriptlang.org/docs/handbook/tsconfig-json.html %}。

```json
{
  "compilerOptions": {
    "strict": true,
    "baseUrl": "../node_modules",
    "target": "es5",
    "lib": ["es5", "dom"],
    "types": ["cypress"]
  },
  "include": [
    "**/*.ts"
  ]
}
```

`"types"`会告诉TypeScript编译器只包含Cypress的类型声明，这个配置也会处理使用`@types/chai`或`@types/jquery`的实例。 由于 {% url "Chai" bundled-tools#Chai %} 和 {% url "jQuery" bundled-tools#Other-Library-Utilities %} 是全局的命名空间，不兼容的版本会使包管理工具(`yarn` 或 `npm`)处理依赖并加载多个版本导致冲突。

{% note info %}
在 {% url cypress-io/cypress-and-jest-typescript-example https://github.com/cypress-io/cypress-and-jest-typescript-example %} 仓库中你可以找到Jest和Cypress在同一个项目中使用不同`tsconfig.json`的例子。
{% endnote %}

{% note warning %}
如果上述的配置没有生效，你可能需要重启下你的IDE的TypeScript服务，例如：

VS Code (在.ts 或 .js 文件中):
* 打开command面板 (Mac: `cmd+shift+p`, Windows: `ctrl+shift+p`)
* 输入 "restart ts" 并选择 "TypeScript: Restart TS server." 选项

如果还不行就重启IDE.
{% endnote %}

## 自定义命令的类型

当你给`cy`对象添加{% url "自定义命令" custom-commands %}时，你可以手动添加它们的类型避免Typescript报错。

例如你按下面的方式在 {% url "`supportFile`" configuration#Folders-Files %} 添加了 `cy.dataCy` 命令：

```javascript
// cypress/support/index.js
Cypress.Commands.add('dataCy', (value) => {
  return cy.get(`[data-cy=${value}]`)
})
```

然后通过在 {% url "`supportFile`" configuration#Folders-Files %} 旁边创建一个新的Typescript声明，本例中是`cypress/support/index.d.ts`， `dataCy` 命令就被添加到全局的Cypress链式调用接口中 （之所以这样说是因为命令是链接在一起的）。

```typescript
// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
    */
    dataCy(value: string): Chainable<Element>
  }
}
```

{% note info %}
方法类型上面编写良好JSDoc注释对使用你的自定义命令的用户很有帮助
{% endnote %}

如果你的specs文件是用Typescript写的，你需要将Typescript声明文件 `cypress/support/index.d.ts` 和其他源文件一起包含。

即使你的项目是纯JavaScript编写的，JavaScript specs文件也能通过三个斜杠的`reference path`注释指向的文件识别到新的命令。

```javascript
// from your cypress/integration/spec.js
/// <reference path="../support/index.d.ts" />
it('works', () => {
  cy.visit('/')
  // IntelliSense and TS compiler should
  // not complain about unknown method
  cy.dataCy('greeting')
})
```

### 示例：

- 查阅 {% url "添加自定义命令" https://github.com/cypress-io/cypress-example-recipes#fundamentals %} 示例。
- 使用Typescript编写的自定义命令的例子可以在 {% url "omerose/cypress-support" https://github.com/omerose/cypress-support %} 仓库找到。
- 使用自定义命令避免样板代码的示例项目 {% url "cypress-example-todomvc custom commands" https://github.com/cypress-io/cypress-example-todomvc#custom-commands %}。

## 自定义断言的类型

如果你要扩展Cypress断言， 你可以扩展断言类型使得Typescript编译器能识别新的方法，参阅 {% url "Recipe: Adding Chai Assertions" recipes#Fundamentals %} 说明

## 插件的类型

你可以在{% url "plugins文件" plugins-guide %}里利用Cypress的类型声明按如下方式注解：

```javascript
// cypress/plugins/index.js

/// <reference types="cypress" />

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {

}
```

{% history %}
{% url "4.4.0" changelog#4-4-0 %} | Added support for TypeScript without needing your own transpilation through preprocessors.
{% endhistory %}

# 另请参阅

- {% url "IDE集成" IDE-integration %}
