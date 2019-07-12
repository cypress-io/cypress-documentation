---
title: TypeScript
---

Cypress使用{% url "TypeScript" https://www.typescriptlang.org/ %}作为{% url "官方类型定义" https://github.com/cypress-io/cypress/tree/develop/cli/types %}(语言包)。这意味着你可以使用TypeScript编写测试。所有这些只需要一点点的设置。

## 源码转换TypeScript测试文件

你可能会想要直接在项目中写Typescript，那就必须处理源码转换问题。Cypress暴露一个{% url "`file:preprocessor` event" preprocessors-api %}以便你可以自定义你的源码是如何进行转换和发送到浏览器的。

### Examples

- {% url "TypeScript with WebPack" https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/preprocessors__typescript-webpack %}
- {% url "TypeScript with Browserify" https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/preprocessors__typescript-browserify %}
- {% url "Simple Repo of TypeScript with WebPack" https://github.com/omerose/cypress-support %}

## Set up your dev environment

Please refer to your code editor in {% url "TypeScript's Editor Support doc" https://github.com/Microsoft/TypeScript/wiki/TypeScript-Editor-Support %} and follow the instructions for your IDE to get TypeScript support and {% url "intelligent code completion" intelligent-code-completion %} configured in your developer environment before continuing. TypeScript support is built in for {% url "Visual Studio Code" https://code.visualstudio.com/ %}, {% url "Visual Studio" https://www.visualstudio.com/ %}, and {% url "WebStorm" https://www.jetbrains.com/webstorm/ %} - all other editors require extra setup.

## Configure tsconfig.json

We recommend the following configuration in a {% url "`tsconfig.json`" http://www.typescriptlang.org/docs/handbook/tsconfig-json.html %} inside your {% url "`cypress` folder" writing-and-organizing-tests#Folder-Structure %}.

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

The `"types"` will tell the TypeScript compiler to only include type definitions from Cypress. This will address instances where the project also uses `@types/chai` or `@types/jquery`. Since {% url "Chai" bundled-tools#Chai %} and {% url "jQuery" bundled-tools#Other-Library-Utilities %} are namespaces (globals), incompatible versions will cause the package manager (`yarn` or `npm`) to nest and include multiple definitions and cause conflicts.

{% note info %}
You can find an example of Jest and Cypress installed in the same project using a separate `tsconfig.json` file in the {% url cypress-io/cypress-and-jest-typescript-example https://github.com/cypress-io/cypress-and-jest-typescript-example %} repo.
{% endnote %}

## Types for custom commands

When adding custom commands to the `cy` object, you can add their types to avoid TypeScript errors. You can find the simplest implementation of Cypress and TypeScript in this {% url "repo example here" https://github.com/omerose/cypress-support %}.

## TODO MVC Example Repo

You can find an example in the {% url "cypress-example-todomvc custom commands" https://github.com/cypress-io/cypress-example-todomvc#custom-commands %} repo.

## Types for custom assertions

If you extend Cypress assertions, you can extend the assertion types to make the TypeScript compiler understand the new methods. See the {% url "Recipe: Adding Chai Assertions" recipes#Fundamentals %} for instructions.

## Additional information

See the excellent advice on {% url "setting Cypress using TypeScript" https://basarat.gitbooks.io/typescript/docs/testing/cypress.html %} in the {% url "TypeScript Deep Dive" https://basarat.gitbooks.io/typescript/content/ %} e-book by {% url "Basarat Syed" https://twitter.com/basarat %}. Take a look at {% url "this video" https://www.youtube.com/watch?v=1Vr1cAN_CLA %} Basarat has recorded and the accompanying repo {% url basarat/cypress-ts https://github.com/basarat/cypress-ts %}.

{% fa fa-github %} We have published a utility npm module, {% url "add-typescript-to-cypress" https://github.com/bahmutov/add-typescript-to-cypress %}, that sets TypeScript test transpilation for you with a single command.
