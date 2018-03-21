---
title: TypeScript Support
comments: false
---

Cypress ships with {% url "official type declarations" https://github.com/cypress-io/cypress/tree/develop/cli/types %} for {% url "TypeScript" https://www.typescriptlang.org/ %}.

# IntelliSense

IntelliSense is available for Cypress. It offers intelligent parameter information directly in your IDE while writing tests. While TypeScript is used to generate the data for intellisense, you can make use of intellisense even when writing your tests in plain JavaScript. 

## Triple-Slash Directives

Adding a {% url "triple-slash directive" "http://www.typescriptlang.org/docs/handbook/triple-slash-directives.html" %} to the head of your JavaScript or TypeScript testing file should get intellisense working in most IDEs.

```js
/// <reference types="Cypress" />
```
{% img /img/guides/typescript-intellisense-with-reference.gif %}

## tsconfig.json

If you want to write your tests in TypeScript, you may find it more convenient to add a {% url "`tsconfig.json`" http://www.typescriptlang.org/docs/handbook/tsconfig-json.html %} inside your `cypress` folder.

```json
{
  "compilerOptions": {
	"strict": true,
    "baseUrl": "../node_modules",
    "target": "es5",
    "lib": ["es5", "dom"],
    "types": ["cypress"],
  },
  "include": [
    "**/*.ts"
  ]
}
```

The `"types"` will tell the TypeScript compiler to only include type definitions from Cypress. This will address instances where the project also uses `@types/chai` or `@types/jquery`. Since {% url "Chai" bundled-tools#Chai %} and {% url "jQuery" bundled-tools#Other-Library-Utilities %} are namespaces (globals), incompatible versions will cause the package manager (`yarn` or `npm`) to nest and include multiple definitions and cause conflicts.

# Examples

- {% url "TypeScript with WebPack" https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/preprocessors__typescript-webpack %}
- {% url "TypeScript with Browserify" https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/preprocessors__typescript-browserify %}