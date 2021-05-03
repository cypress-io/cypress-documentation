---
title: TypeScript
---

Cypress ships with [official type declarations](https://github.com/cypress-io/cypress/tree/develop/cli/types) for [TypeScript](https://www.typescriptlang.org/). This allows you to write your tests in TypeScript.

### Install TypeScript

You'll need to have TypeScript 3.4+ installed within your project to have TypeScript support within Cypress.

#### With npm

```shell
npm install --save-dev typescript
```

#### With yarn

```shell
yarn add --dev typescript
```

### Set up your dev environment

Please refer to your code editor in [TypeScript's Editor Support doc](https://github.com/Microsoft/TypeScript/wiki/TypeScript-Editor-Support) and follow the instructions for your IDE to get TypeScript support and [intelligent code completion](/guides/tooling/IDE-integration#Intelligent-Code-Completion) configured in your developer environment before continuing. TypeScript support is built in for [Visual Studio Code](https://code.visualstudio.com/), [Visual Studio](https://www.visualstudio.com/), and [WebStorm](https://www.jetbrains.com/webstorm/) - all other editors require extra setup.

### Configure tsconfig.json

We recommend the following configuration in a [`tsconfig.json`](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html) inside your [`cypress` folder](/guides/core-concepts/writing-and-organizing-tests#Folder-Structure).

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["es5", "dom"],
    "types": ["cypress"]
  },
  "include": ["**/*.ts"]
}
```

The `"types"` will tell the TypeScript compiler to only include type definitions from Cypress. This will address instances where the project also uses `@types/chai` or `@types/jquery`. Since [Chai](/guides/references/bundled-tools#Chai) and [jQuery](/guides/references/bundled-tools#Other-Library-Utilities) are namespaces (globals), incompatible versions will cause the package manager (`yarn` or `npm`) to nest and include multiple definitions and cause conflicts.

<Alert type="warning">

You may have to restart your IDE's TypeScript server if the setup above does not appear to work. For example:

VS Code (within a .ts or .js file):

- Open the command palette (Mac: `cmd+shift+p`, Windows: `ctrl+shift+p`)
- Type "restart ts" and select the "TypeScript: Restart TS server." option

If that does not work, try restarting the IDE.

</Alert>

### Types for custom commands

When adding [custom commands](/api/cypress-api/custom-commands) to the `cy` object, you can manually add their types to avoid TypeScript errors.

For example if you add the command `cy.dataCy` into your [supportFile](/guides/references/configuration#Folders-Files) like this:

```typescript
// cypress/support/index.ts
Cypress.Commands.add('dataCy', (value) => {
  return cy.get(`[data-cy=${value}]`)
})
```

Then you can add the `dataCy` command to the global Cypress Chainable interface (so called because commands are chained together) to your `cypress/support/index.ts` file.

```typescript
// in cypress/support/index.ts
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

<Alert type="info">

A nice detailed JSDoc comment above the method type will be really appreciated by any users of your custom command.

</Alert>

If your specs files are in TypeScript, you should include the TypeScript definition file, `cypress/support/index.d.ts`, with the rest of the source files.

Even if your project is JavaScript only, the JavaScript specs can know about the new command by referencing the file using the special triple slash `reference path` comment.

```typescript
// from your cypress/integration/spec.ts
it('works', () => {
  cy.visit('/')
  // IntelliSense and TS compiler should
  // not complain about unknown method
  cy.dataCy('greeting')
})
```

#### Examples:

- See [Adding Custom Commands](https://github.com/cypress-io/cypress-example-recipes#fundamentals) example recipe.
- You can find an example with custom commands written in TypeScript in [omerose/cypress-support](https://github.com/omerose/cypress-support) repo.
- Example project [cypress-example-todomvc custom commands](https://github.com/cypress-io/cypress-example-todomvc#custom-commands) uses custom commands to avoid boilerplate code.

### Types for custom assertions

If you extend Cypress assertions, you can extend the assertion types to make the TypeScript compiler understand the new methods. See the [Recipe: Adding Chai Assertions](/examples/examples/recipes#Fundamentals) for instructions.

### Types for plugins

You can utilize Cypress's type declarations in your [plugins file](/guides/tooling/plugins-guide) by annotating it like the following:

```javascript
// cypress/plugins/index.ts

/// <reference types="cypress" />

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {}
```

### Clashing types with Jest

If you are using both Jest and Cypress in the same project, the TypeScript types registered globally by the two test runners can clash. For example, both Jest and Cypress provide the clashing types for the `describe` and `it` functions. Both Jest and Expect (bundled inside Cypress) provide the clashing types for the `expect` assertion, etc. There are two solutions to disentangle the types:

1. Configure a separate `tsconfig.json` for E2E tests. See our example [cypress-io/cypress-and-jest-typescript-example](https://github.com/cypress-io/cypress-and-jest-typescript-example) repo.
2. Remove Cypress global variables by using NPM package [local-cypress](https://github.com/bahmutov/local-cypress). Read the blog post [How to Avoid Using Global Cypress Variables](https://glebbahmutov.com/blog/local-cypress/) for details.

## History

| Version                                     | Changes                                                                                    |
| ------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [5.0.0](/guides/references/changelog#5-0-0) | Raised minimum required TypeScript version from 2.9+ to 3.4+                               |
| [4.4.0](/guides/references/changelog#4-4-0) | Added support for TypeScript without needing your own transpilation through preprocessors. |

## See also

- [IDE Integration](/guides/tooling/IDE-integration)
