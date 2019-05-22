---
title: TypeScript
---

Cypress ships with {% url "official type declarations" https://github.com/cypress-io/cypress/tree/develop/cli/types %} for {% url "TypeScript" https://www.typescriptlang.org/ %}. This allows you to write your tests in TypeScript. All that is required is a little bit of configuration.

## Transpiling TypeScript test files

Just as you would when writing TypeScript files in your project, you will have to handle transpiling your TypeScript test files. Cypress exposes a {% url "`file:preprocessor` event" preprocessors-api %} you can use to customize how your test code is transpiled and sent to the browser.

### Examples

- {% url "TypeScript with WebPack" https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/preprocessors__typescript-webpack %}
- {% url "TypeScript with Browserify" https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/preprocessors__typescript-browserify %}

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

## Types for custom commands

When adding custom commands to the `cy` object, you can add their types to avoid TypeScript errors. You can find an example in the {% url "cypress-example-todomvc custom commands" https://github.com/cypress-io/cypress-example-todomvc#custom-commands %} repo.

## Types for custom assertions

If you extend Cypress assertions, you can extend the assertion types to make the TypeScript compiler understand the new methods. See the {% url "Recipe: Adding Chai Assertions" https://github.com/cypress-io/cypress-example-recipes#adding-chai-assertions %} for instructions.
