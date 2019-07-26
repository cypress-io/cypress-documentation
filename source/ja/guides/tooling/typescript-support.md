---
title: TypeScript
---

Cypress ships with {% url "official type declarations" https://github.com/cypress-io/cypress/tree/develop/cli/types %} for {% url "TypeScript" https://www.typescriptlang.org/ %}. This allows you to write your tests in TypeScript. All that is required is a little bit of configuration.

## Transpiling TypeScript test files

Just as you would when writing TypeScript files in your project, you will have to handle transpiling your TypeScript test files. Cypress exposes a {% url "`file:preprocessor` event" preprocessors-api %} you can use to customize how your test code is transpiled and sent to the browser.

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

When adding {% url "custom commands" custom-commands %} to the `cy` object, you can manually add their types to avoid TypeScript errors.

For example if you add the command `cy.dataCy` into your {% url "`supportFile`" configuration#Folders-Files %} like this:

```javascript
// cypress/support/index.js
Cypress.Commands.add('dataCy', (value) => {
  return cy.get(`[data-cy=${value}]`)
})
```

Then you can add the `dataCy` command to the global Cypress Chainable interface (so called because commands are chained together) by creating a new TypeScript definitions file beside your {% url "`supportFile`" configuration#Folders-Files %}, in this case at `cypress/support/index.d.ts`.

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
A nice detailed JSDoc comment above the method type will be really appreciated by any users of your custom command.
{% endnote %}

If your specs files are in TypeScript, you should include the TypeScript definition file, `cypress/support/index.d.ts`, with the rest of the source files.

Even if your project is JavaScript only, the JavaScript specs can know about the new command by referencing the file using the special tripple slash `reference path` comment.

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

### Examples:

- See {% url "Adding Custom Commands" https://github.com/cypress-io/cypress-example-recipes#fundamentals %} example recipe.
- You can find a simple example with custom commands written in TypeScript in {% url "omerose/cypress-support" https://github.com/omerose/cypress-support %} repo.
- Example project {% url "cypress-example-todomvc custom commands" https://github.com/cypress-io/cypress-example-todomvc#custom-commands %} uses custom commands to avoid boilerplate code.

## Types for custom assertions

If you extend Cypress assertions, you can extend the assertion types to make the TypeScript compiler understand the new methods. See the {% url "Recipe: Adding Chai Assertions" recipes#Fundamentals %} for instructions.

## Additional information

See the excellent advice on {% url "setting Cypress using TypeScript" https://basarat.gitbooks.io/typescript/docs/testing/cypress.html %} in the {% url "TypeScript Deep Dive" https://basarat.gitbooks.io/typescript/content/ %} e-book by {% url "Basarat Syed" https://twitter.com/basarat %}. Take a look at {% url "this video" https://www.youtube.com/watch?v=1Vr1cAN_CLA %} Basarat has recorded and the accompanying repo {% url basarat/cypress-ts https://github.com/basarat/cypress-ts %}.

{% fa fa-github %} We have published a utility npm module, {% url "add-typescript-to-cypress" https://github.com/bahmutov/add-typescript-to-cypress %}, that sets TypeScript test transpilation for you with a single command.
