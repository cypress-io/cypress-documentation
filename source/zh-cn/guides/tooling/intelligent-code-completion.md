---
title: Intelligent Code Completion智能代码补全
---

# Writing Tests
# 编写测试

## Features
## 特点

IntelliSense is available for Cypress. It offers intelligent code suggestions directly in your IDE while writing tests. A typical IntelliSense popup shows command definition, a code example and a link to the full documentation page.
Cypress提供IntelliSense. 它直接在你的IDE里面提供智能代码建议, 当你在写测试代码的时候. 一个典型的IntelliSense弹窗显示命令定义, 一个代码示例和到完整文档页面的链接.

### Autocomplete while typing Cypress commands
### 在输入Cypress命令的时候自动补全

{% video local /img/snippets/intellisense-cypress-assertion-matchers.mp4 %}

### Signature help when writing and hovering on Cypress commands
### 当在编写或者悬停在Cypress命令上时提供Signature帮助

{% video local /img/snippets/intellisense-method-signature-examples.mp4 %}

### Autocomplete while typing assertion chains, including only showing DOM assertions if testing on a DOM element.
### 当输入断言链的时候自动补全, 包括当在测试DOM元素时仅显示DOM断言.

{% video local /img/snippets/intellisense-assertion-chainers.mp4 %}

## Set up in your Dev Environment
## 在你的开发环境中设置

This document assumes you have {% url "installed Cypress" installing-cypress %}.
这个文档假设你已经{% url "安装了Cypress" installing-cypress %}.

Cypress comes with TypeScript {% url "type declarations" https://github.com/cypress-io/cypress/tree/develop/cli/types %} included. Modern text editors can use these type declarations to show IntelliSense inside spec files.
Cypress包含TypeScript{% url "类型声明" https://github.com/cypress-io/cypress/tree/develop/cli/types %}. 现代文本编辑器可以使用这些类型声明在规范文件中来显示IntelliSense.

### Triple slash directives
### 三斜杠指令

The simplest way to see IntelliSense when typing a Cypress command or assertion is to add a {% url "triple-slash directive" "http://www.typescriptlang.org/docs/handbook/triple-slash-directives.html" %} to the head of your JavaScript or TypeScript testing file. This will turn the IntelliSense on a per file basis. Just copy the comment line below and paste it into your spec file.
最简单的在输入Cypress命令或者断言时查看IntelliSense的方法是添加一个{% url "三斜杠指令" "http://www.typescriptlang.org/docs/handbook/triple-slash-directives.html" %}到你的JavaScript或者TypeScript测试代码文件. 这将在每个文件的基础上打开IntelliSense. 只需复制下面的注释行并将其粘贴到规范文件中.

```js
/// <reference types="Cypress" />
```

{% video local /img/snippets/intellisense-setup.mp4 %}

If you write {% url 'custom commands' custom-commands %} and provide TypeScript definitions for them, you can use the triple slash directives to show IntelliSense, even if your project uses only JavaScript. For example, if your custom commands are written in `cypress/support/commands.js` and you describe them in `cypress/support/index.d.ts` use:
如果你写{% url '自定义命令' custom-commands %}并且为他们提供TypeScript定义, 你可以使用三斜杠指令来显示IntelliSense, 即使你的项目仅使用JavaScript. 例如, 如果你的自定义命令写在`cypress/support/commands.js`中, 并且你在, (后面这一段有点不知道怎么翻译)and you describe them in `cypress/support/index.d.ts` use:

```js
// type definitions for Cypress object "cy"
// Cypress对象"cy"的类型定义
/// <reference types="cypress" />

// type definitions for custom commands like "createDefaultTodos"
// 自定义命令如"createDefaultTodos"命令的类型定义
/// <reference types="../support" />
```

See the {% url `cypress-example-todomvc` https://github.com/cypress-io/cypress-example-todomvc#cypress-intellisense %} repository for a working example.
参考{% url `cypress-example-todomvc` https://github.com/cypress-io/cypress-example-todomvc#cypress-intellisense %}仓库的工作示例.

If the triple slash directive does not work, please refer to your code editor in {% url "TypeScript's Editor Support doc" https://github.com/Microsoft/TypeScript/wiki/TypeScript-Editor-Support %} and follow the instructions for your IDE to get {% url "TypeScript support" typescript-support %} and intelligent code completion configured in your developer environment first. TypeScript support is built in for {% url "Visual Studio Code" https://code.visualstudio.com/ %}, {% url "Visual Studio" https://www.visualstudio.com/ %}, and {% url "WebStorm" https://www.jetbrains.com/webstorm/ %} - all other editors require extra setup.
如果三斜杠指令不起作用, 请参考{% url "TypeScript的编辑器支持文档" https://github.com/Microsoft/TypeScript/wiki/TypeScript-Editor-Support %}中的代码编辑器, 并且遵循你的IDE的指令去获得{% url "TypeScript支持" typescript-support %}并且首先在你的研发环境中配置智能代码补全. TypeScript是内置在{% url "Visual Studio Code" https://code.visualstudio.com/ %}, {% url "Visual Studio" https://www.visualstudio.com/ %}和{% url "WebStorm" https://www.jetbrains.com/webstorm/ %}中的, 所有其他的编辑器需要额外设置智能代码补全功能.

### Reference type declarations via `tsconfig`

Adding a {% url "`tsconfig.json`" http://www.typescriptlang.org/docs/handbook/tsconfig-json.html %} inside your {% url "`cypress` folder" writing-and-organizing-tests#Folder-Structure %} with the following configuration should get intelligent code completion working.

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

# Configuration

## Features

When editing the {% url "`cypress.json`" configuration %} file, you can use our {% url "json schema file" https://on.cypress.io/cypress.schema.json %} to get intelligent tooltips in your IDE for each configuration property.

### Property help when writing and hovering on configuration keys

{% video local /img/snippets/intellisense-cypress-config-tooltips.mp4 %}

### Properties list with intelligent defaults

{% video local /img/snippets/intellisense-config-defaults.mp4 %}


## Set up in your Dev Environment

Intelligent code completion using JSON schemas is supported by default in {% url "Visual Studio Code" https://code.visualstudio.com/ %} and {% url "Visual Studio" https://www.visualstudio.com/ %}. All other editors will require extra configuration or plugins for JSON schema support.

To set up in {% url "Visual Studio Code" https://code.visualstudio.com/ %} you can open `Preferences / Settings / User Settings` and add the `json.schemas` property.

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

# See also

- {% url 'Adding custom properties to the global `window` with the right TypeScript type' https://github.com/bahmutov/test-todomvc-using-app-actions#intellisense %}
