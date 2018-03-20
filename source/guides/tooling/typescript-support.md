---
title: TypeScript Support
comments: false
---

Cypress ships with {% url "official type declarations" https://github.com/cypress-io/cypress/tree/develop/cli/types %} for {% url "TypeScript" https://www.typescriptlang.org/ %}.

# Intellisense

In order to get intellisense working, you can try a few approaches:

## Triple-Slash Directives

We have seen success in VS Code with intellisense by simply adding a [triple-slash directive](http://www.typescriptlang.org/docs/handbook/triple-slash-directives.html) to the head of your JavaScript testing file. This is the simplest way to get intellisense working.

```js
/// <reference types="Cypress" />
```

{% img /img/guides/typescript-intellisense-with-reference.gif %}

## tsconfig

If your project is written in TypeScript, you may find it more convenient to include Cypress in your `tsconfig.json`.

```json
{
  "include": [
    "integration/*.ts",
    "support/*.ts",
    "../node_modules/cypress"
  ]
}
```