---
title: TypeScript
---

Cypress ships with {% url "official type declarations" https://github.com/cypress-io/cypress/tree/develop/cli/types %} for {% url "TypeScript" https://www.typescriptlang.org/ %}. This allows you to write your tests in TypeScript.

## Install TypeScript

You'll need to have TypeScript installed within your project to have TypeScript support within Cypress.

```bash
npm install typescript
```

## Set up your dev environment

Please refer to your code editor in {% url "TypeScript's Editor Support doc" https://github.com/Microsoft/TypeScript/wiki/TypeScript-Editor-Support %} and follow the instructions for your IDE to get TypeScript support and {% url "intelligent code completion" IDE-integration#Intelligent-Code-Completion %} configured in your developer environment before continuing. TypeScript support is built in for {% url "Visual Studio Code" https://code.visualstudio.com/ %}, {% url "Visual Studio" https://www.visualstudio.com/ %}, and {% url "WebStorm" https://www.jetbrains.com/webstorm/ %} - all other editors require extra setup.

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

{% note warning %}
You may have to restart your IDE's TypeScript server if the setup above does not appear to work. For example:

VS Code (within a .ts or .js file):
* Open the command palette (Mac: `cmd+shift+p`, Windows: `ctrl+shift+p`)
* Type "restart ts" and select the "TypeScript: Restart TS server." option

If that does not work, try restarting the IDE.
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

Even if your project is JavaScript only, the JavaScript specs can know about the new command by referencing the file using the special triple slash `reference path` comment.

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
- You can find an example with custom commands written in TypeScript in {% url "omerose/cypress-support" https://github.com/omerose/cypress-support %} repo.
- Example project {% url "cypress-example-todomvc custom commands" https://github.com/cypress-io/cypress-example-todomvc#custom-commands %} uses custom commands to avoid boilerplate code.

## Types for custom assertions

If you extend Cypress assertions, you can extend the assertion types to make the TypeScript compiler understand the new methods. See the {% url "Recipe: Adding Chai Assertions" recipes#Fundamentals %} for instructions.

## Types for plugins

You can utilize Cypress's type declarations in your {% url "plugins file" plugins-guide %} by annotating it like the following:

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

# See also

- {% url "IDE Integration" IDE-integration %}
