---
title: 代码智能补全
---

# 编写测试

## 特点

Cypress提供IntelliSense. 它直接在你的IDE里面提供智能代码建议, 当你在写测试代码的时候. 一个典型的IntelliSense弹窗显示命令定义, 一个代码示例和到完整文档页面的链接.

### 在输入Cypress命令的时候自动补全

{% video local /img/snippets/intellisense-cypress-assertion-matchers.mp4 %}

### 当在编写或者悬停在Cypress命令上时提供Signature帮助

{% video local /img/snippets/intellisense-method-signature-examples.mp4 %}

### 当输入断言链的时候自动补全, 包括当在测试DOM元素时仅显示DOM断言.

{% video local /img/snippets/intellisense-assertion-chainers.mp4 %}

## 在你的开发环境中设置

这个文档假设你已经{% url "安装了Cypress" installing-cypress %}.

Cypress包含TypeScript{% url "类型声明" https://github.com/cypress-io/cypress/tree/develop/cli/types %}. 现代文本编辑器可以使用这些类型声明在规范文件中来显示IntelliSense.

### 三斜杠指令

最简单的在输入Cypress命令或者断言时查看IntelliSense的方法是添加一个{% url "三斜杠指令" "http://www.typescriptlang.org/docs/handbook/triple-slash-directives.html" %}到你的JavaScript或者TypeScript测试代码文件. 这将在每个文件的基础上打开IntelliSense. 只需复制下面的注释行并将其粘贴到规范文件中.

```js
/// <reference types="Cypress" />
```

{% video local /img/snippets/intellisense-setup.mp4 %}

如果你写{% url '自定义命令' custom-commands %}并且为他们提供TypeScript定义, 你可以使用三斜杠指令来显示IntelliSense, 即使你的项目仅使用JavaScript. 例如, 如果你的自定义命令写在`cypress/support/commands.js`中, 并且你在, (后面这一段有点不知道怎么翻译)and you describe them in `cypress/support/index.d.ts` use:

```js
// Cypress对象"cy"的类型定义
/// <reference types="cypress" />

// 自定义命令如"createDefaultTodos"命令的类型定义
/// <reference types="../support" />
```

参考{% url `cypress-example-todomvc` https://github.com/cypress-io/cypress-example-todomvc#cypress-intellisense %}仓库的工作示例.

如果三斜杠指令不起作用, 请参考{% url "TypeScript的编辑器支持文档" https://github.com/Microsoft/TypeScript/wiki/TypeScript-Editor-Support %}中的代码编辑器, 并且遵循你的IDE的指令去获得{% url "TypeScript支持" typescript-support %}并且首先在你的研发环境中配置智能代码补全. TypeScript是内置在{% url "Visual Studio Code" https://code.visualstudio.com/ %}, {% url "Visual Studio" https://www.visualstudio.com/ %}和{% url "WebStorm" https://www.jetbrains.com/webstorm/ %}中的, 所有其他的编辑器需要额外设置智能代码补全功能.

### 通过`tsconfig`参考类型声明

在你的{% url "`cypress`文件夹" writing-and-organizing-tests#Folder-Structure %}中按照以下配置添加一个{% url "`tsconfig.json`" http://www.typescriptlang.org/docs/handbook/tsconfig-json.html %}文件, 应该可以使智能代码工作起来.

```json
{
  "compilerOptions": {
    "allowJs": true,
    "baseUrl": "../node_modules",
    "types": [
      "cypress"
    ]
  },
  "include": [
    "**/*.*"
  ]
}
```

# 配置

## 特征

当编辑{% url "`cypress.json`" configuration %}文件, 你可以用我们的{% url "json模式文件" https://on.cypress.io/cypress.schema.json %}来在你的IDE中为每个配置属性获取智能工具提示.

### 当编写和悬停在配置键上时的属性帮助

{% video local /img/snippets/intellisense-cypress-config-tooltips.mp4 %}

### 属性列表的智能默认填入值

{% video local /img/snippets/intellisense-config-defaults.mp4 %}

## 在你的开发环境中设置

智能代码补全使用JSON模式在{% url "Visual Studio Code" https://code.visualstudio.com/ %}和{% url "Visual Studio" https://www.visualstudio.com/ %}里面是被默认支持的. 所有其他的编辑器将需要额外的配置或者插件来支持JSON模式.

要在{% url "Visual Studio Code" https://code.visualstudio.com/ %}里面设置, 你可以打开`Preferences / Settings / User Settings`并且添加`json.schemas`属性.

```json
{
  "json.schemas": [
    {
      "fileMatch": [
        "cypress.json"
      ],
      "url": "https://on.cypress.io/cypress.schema.json"
    }
  ]
}
```

# 参见

- {% url '通过正确的TypeScript类型向全局`window`添加自定义属性' https://github.com/bahmutov/test-todomvc-using-app-actions#intellisense %}
