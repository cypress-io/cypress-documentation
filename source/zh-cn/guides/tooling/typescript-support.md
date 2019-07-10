---
title: TypeScript
---

Cypress使用{% url "TypeScript" https://www.typescriptlang.org/ %}作为{% url "官方类型定义" https://github.com/cypress-io/cypress/tree/develop/cli/types %}(语言包)。这意味着你可以使用TypeScript编写测试。所有这些只需要一点点的设置。

## 1. 源码转换TypeScript测试文件

你可能会想要直接在项目中写Typescript，那就必须处理源码转换问题。Cypress暴露一个{% url "`file:preprocessor` event" preprocessors-api %}以便你可以自定义你的源码是如何进行转换和发送到浏览器的。

### 1.1 示例

- {% url "TypeScript with WebPack" https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/preprocessors__typescript-webpack %}
- {% url "TypeScript with Browserify" https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/preprocessors__typescript-browserify %}
- {% url "Simple Repo of TypeScript with WebPack" https://github.com/omerose/cypress-support %}

## 2. 设置开发环境

请参考自己的开发IDE在{% url "TypeScript's编辑器支持文档" https://github.com/Microsoft/TypeScript/wiki/TypeScript-Editor-Support %}中的描述，并按照其指导在你的开发环境中集成TypeScript支持和{% url "代码智能提示" intelligent-code-completion %}。TypeScript在{% url "Visual Studio Code" https://code.visualstudio.com/ %}、{% url "Visual Studio" https://www.visualstudio.com/ %}和{% url "WebStorm" https://www.jetbrains.com/webstorm/ %}得到了源生支持 - 而其他所有的IDE需要额外的设置。

## 3. 配置tsconfig.json

我们建议在{% url "`cypress` folder" writing-and-organizing-tests#Folder-Structure %}文件夹下的{% url "`tsconfig.json`" http://www.typescriptlang.org/docs/handbook/tsconfig-json.html %}使用如下的配置：

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

其中`"types"`告诉TypeScript编译器仅导入Cypress相关的定义。这还将找到项目中使用`@types/chai`或`@types/jquery`的实例。因为{% url "Chai" bundled-tools#Chai %}和{% url "jQuery" bundled-tools#Other-Library-Utilities %}是命名空间(全局的)，不匹配的版本将导致包管理(`yarn`或`npm`)形成嵌套或包含多个不同的定义甚至冲突。

{% note info %}
You can find an example of Jest and Cypress installed in the same project using a separate `tsconfig.json` file in the {% url cypress-io/cypress-and-jest-typescript-example https://github.com/cypress-io/cypress-and-jest-typescript-example %} repo.
{% endnote %}

## 自定义命令类型

当添加自定义命令给`cy`对象时，你可以添加上类型以避免TypeScript错误。 你可以在 {% url "repo example here" https://github.com/omerose/cypress-support %}中找到最简单和Cypress和TypeScript的实现。

## TODO MVC Example Repo

你可以在{% url "cypress-example-todomvc custom commands" https://github.com/cypress-io/cypress-example-todomvc#custom-commands %} 中找到示例。

## 自定义断言类型

如果你想扩展Cypress断言，你可以扩展断言类型，让TypeScript编译器理解新的方法。参考断言{% url "Recipe: Adding Chai Assertions" https://github.com/cypress-io/cypress-example-recipes#adding-chai-assertions %}。

## Additional information

See the excellent advice on {% url "setting Cypress using TypeScript" https://basarat.gitbooks.io/typescript/docs/testing/cypress.html %} in the {% url "TypeScript Deep Dive" https://basarat.gitbooks.io/typescript/content/ %} e-book by {% url "Basarat Syed" https://twitter.com/basarat %}. Take a look at {% url "this video" https://www.youtube.com/watch?v=1Vr1cAN_CLA %} Basarat has recorded and the accompanying repo {% url basarat/cypress-ts https://github.com/basarat/cypress-ts %}.

{% fa fa-github %} We have published a utility npm module, {% url "add-typescript-to-cypress" https://github.com/bahmutov/add-typescript-to-cypress %}, that sets TypeScript test transpilation for you with a single command.
