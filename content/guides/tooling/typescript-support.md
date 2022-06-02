---
title: TypeScript
---

Cypress ships with
[official type declarations](https://github.com/cypress-io/cypress/tree/develop/cli/types)
for [TypeScript](https://www.typescriptlang.org/). This allows you to write your
tests in TypeScript.

### Install TypeScript

To use TypeScript with Cypress, you will need TypeScript 3.4+. If you do not
already have TypeScript installed as a part of your framework, you will need to
install it:

<npm-or-yarn>
<template #npm>

```shell
npm install --save-dev typescript
```

</template>
<template #yarn>

```shell
yarn add --dev typescript
```

</template>
</npm-or-yarn>

### Configure tsconfig.json

We recommend creating a
[`tsconfig.json`](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
inside your
[`cypress` folder](/guides/core-concepts/writing-and-organizing-tests#Folder-Structure)
with the following configuration:

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["es5", "dom"],
    "types": ["cypress", "node"]
  },
  "include": ["**/*.ts"]
}
```

The `"types"` will tell the TypeScript compiler to only include type definitions
from Cypress. This will address instances where the project also uses
`@types/chai` or `@types/jquery`. Since
[Chai](/guides/references/bundled-libraries#Chai) and
[jQuery](/guides/references/bundled-libraries#Other-Library-Utilities) are
namespaces (globals), incompatible versions will cause the package manager
(`yarn` or `npm`) to nest and include multiple definitions and cause conflicts.

<Alert type="warning">

You may have to restart your IDE's TypeScript server if the setup above does not
appear to work. For example:

VS Code (within a .ts or .js file):

- Open the command palette (Mac: `cmd+shift+p`, Windows: `ctrl+shift+p`)
- Type "restart ts" and select the "TypeScript: Restart TS server." option

If that does not work, try restarting the IDE.

</Alert>

### Types for Custom Commands

When adding [custom commands](/api/cypress-api/custom-commands) to the `cy`
object, you can manually add their types to avoid TypeScript errors.

For example if you add the command `cy.dataCy` into your
[supportFile](/guides/references/configuration#Folders-Files) like this:

```typescript
// cypress/support/index.ts
Cypress.Commands.add('dataCy', (value) => {
  return cy.get(`[data-cy=${value}]`)
})
```

Then you can add the `dataCy` command to the global Cypress Chainable interface
(so called because commands are chained together) to your
`cypress/support/index.ts` file.

```typescript
// in cypress/support/index.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<Element>
    }
  }
}
```

<Alert type="info">

A nice detailed JSDoc comment above the method type will be really appreciated
by any users of your custom command.

</Alert>

<Alert type="info">

Types of all the parameters taken by the implementation callback are inferred
automatically based on the declared interface. Thus, in the example above, the
`value` will be of type `string` implicitly.

</Alert>

In your specs, you can now use the custom command as expected

:::visit-mount-test-example

```ts
// from your cypress/e2e/spec.cy.ts
cy.visit('/')
```

```ts
// from your src/components/MyComponent.cy.ts
cy.mount(<MyComponent />)
```

```ts
it('works', () => {
  __VISIT_MOUNT_PLACEHOLDER__
  // IntelliSense and TS compiler should
  // not complain about unknown method
  cy.dataCy('greeting')
})
```

:::

#### Adding child or dual commands

When you add a custom command with `prevSubject`, Cypress will infer the subject
type automatically based on the specified `prevSubject`.

```typescript
// in cypress/support/index.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to type a few random words into input elements
       * @param count=3
       * @example cy.get('input').typeRandomWords()
       */
      typeRandomWords(
        count?: number,
        options?: Partial<TypeOptions>
      ): Chainable<Element>
    }
  }
}
```

```typescript
// cypress/support/index.ts
Cypress.Commands.add(
  'typeRandomWords',
  { prevSubject: 'element' },
  (subject /* :JQuery<HTMLElement> */, count = 3, options?) => {
    return cy.wrap(subject).type(generateRandomWords(count), options)
  }
)
```

#### Overwriting child or dual commands

When overwriting either built-in or custom commands which make use of
`prevSubject`, you must specify generic parameters to help the type-checker to
understand the type of the `prevSubject`.

```typescript
interface TypeOptions extends Cypress.TypeOptions {
  sensitive: boolean
}

Cypress.Commands.overwrite<'type', 'element'>(
  'type',
  (originalFn, element, text, options?: Partial<TypeOptions>) => {
    if (options && options.sensitive) {
      // turn off original log
      options.log = false
      // create our own log with masked message
      Cypress.log({
        $el: element,
        name: 'type',
        message: '*'.repeat(text.length),
      })
    }

    return originalFn(element, text, options)
  }
)
```

As you can see there are generic parameters `<'type', 'element'>` are used:

1. The first parameter is the command name, equal to first parameter passed to
   `Cypress.Commands.overwrite`.
2. The second parameter is the type of the `prevSubject` that is used by the
   original command. Possible values:
   - 'element' infers it as `JQuery<HTMLElement>`
   - 'window' infers it as `Window`
   - 'document' infers it as `Document`
   - 'optional' infers it as `unknown`

#### Examples:

- Find
  [the standalone example](https://github.com/cypress-io/add-cypress-custom-command-in-typescript).
- See
  [Adding Custom Commands](https://github.com/cypress-io/cypress-example-recipes#fundamentals)
  example recipe.
- You can find an example with custom commands written in TypeScript in
  [omerose/cypress-support](https://github.com/omerose/cypress-support) repo.
- Example project
  [cypress-example-todomvc custom commands](https://github.com/cypress-io/cypress-example-todomvc#custom-commands)
  uses custom commands to avoid boilerplate code.

### Types for custom assertions

If you extend Cypress assertions, you can extend the assertion types to make the
TypeScript compiler understand the new methods. See the
[Recipe: Adding Chai Assertions](/examples/examples/recipes#Fundamentals) for
instructions.

### Types for plugins

::include{file=partials/warning-plugins-file.md}

You can utilize Cypress's type declarations in your
[plugins file](/guides/tooling/plugins-guide) by annotating it like the
following:

```javascript
// cypress/plugins/index.ts

/// <reference types="cypress" />

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {}
```

### Using an External Typings File

You might find it easier to organize your types by moving them from the support
file into an external
[declaration (\*.d.ts) file](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html).
To do so, create a new file, like _cypress.d.ts_, and cut the types for your
custom commands/assertions from the _support_ file and into the new file. Below
is an example of moving the custom `cy.mount` typings that come by default with
a component testing app into a root level _cypress.d.ts_ file.

<code-group>
<code-block label="cypress.d.ts" active>

```ts
import { mount } from 'cypress/react'

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}
```

</code-block>
</code-group>

You might need to include the _\*.d.ts_ in the include options in any
_tsconfig.json_ files in your project for TypeScript to pick up the new types:

<code-group>
<code-block label="tsconfig.json" active>

```json
"include": [
  "src",
  "./cypress.d.ts"
]
```

</code-block>
</code-group>

<code-group>
<code-block label="./cypress/tsconfig.json" active>

```json
"include": [
  "**/*.ts",
  "../cypress.d.ts"
]
```

</code-block>
</code-group>

### Set up your dev environment

Please refer to your code editor in
[TypeScript's Editor Support doc](https://github.com/Microsoft/TypeScript/wiki/TypeScript-Editor-Support)
and follow the instructions for your IDE to get TypeScript support and
[intelligent code completion](/guides/tooling/IDE-integration#Intelligent-Code-Completion)
configured in your developer environment before continuing. TypeScript support
is built in for [Visual Studio Code](https://code.visualstudio.com/),
[Visual Studio](https://www.visualstudio.com/), and
[WebStorm](https://www.jetbrains.com/webstorm/) - all other editors require
extra setup.

### Clashing types with Jest

If you are using both Jest and Cypress in the same project, the TypeScript types
registered globally by the two test runners can clash. For example, both Jest
and Cypress provide the clashing types for the `describe` and `it` functions.
Both Jest and Expect (bundled inside Cypress) provide the clashing types for the
`expect` assertion, etc. There are two solutions to disentangle the types:

1. Configure a separate `tsconfig.json` for E2E tests. See our example
   [cypress-io/cypress-and-jest-typescript-example](https://github.com/cypress-io/cypress-and-jest-typescript-example)
   repo.
2. Remove Cypress global variables by using NPM package
   [local-cypress](https://github.com/bahmutov/local-cypress). Read the blog
   post
   [How to Avoid Using Global Cypress Variables](https://glebbahmutov.com/blog/local-cypress/)
   for details.

## History

| Version                                       | Changes                                                                                    |
| --------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [10.0.0](/guides/references/changelog#10-0-0) | Update guide to cover TypeScript setup for component testing                               |
| [5.0.0](/guides/references/changelog#5-0-0)   | Raised minimum required TypeScript version from 2.9+ to 3.4+                               |
| [4.4.0](/guides/references/changelog#4-4-0)   | Added support for TypeScript without needing your own transpilation through preprocessors. |

## See also

- [IDE Integration](/guides/tooling/IDE-integration)
