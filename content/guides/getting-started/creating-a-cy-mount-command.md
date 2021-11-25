---
title: Creating a cy.mount Command
---

We recommend creating a custom `cy.mount` command which wraps the mount command
from the framework-specific libraries in your component tests. Doing so offers a
few advantages:

- You don't need to import the mount command into every test as the `cy.mount`
  command is available globally
- You can set up common scenarios that you usually have to do in each test, like
  wrapping a React component in a provider or adding Vue plugins

Cypress does not provide a `cy.mount` command out-of-the-box. If you attempt to
use `cy.mount` before creating it, you will get a warning letting you know:

<img src="/_nuxt/assets/img/guides/component-testing/cy-mount-must-be-implemented.png" alt="cy.mount must be implemented by the user." />

Let's take a look at how to implement one.

## Creating a New `cy.mount` Command

To use `cy.mount` you will need to add a custom command to the commands file.
Below are examples that you can start with for your commands:

:::react-vue-example

```js
import { mount } from '@cypress/react'
Cypress.Commands.add('mount', (jsx, options) => {
  // Wrap any parent components needed
  // ie: return mount(<MyProvider>{jsx}</MyProvider>, options)
  return mount(jsx, options)
})
```

```js
import { mount } from '@cypress/vue'
Cypress.Commands.add('mount', (comp, options = {}) => {
  // Setup options object
  options.global = options.global || {}
  options.global.stubs = options.global.stubs || {}
  options.global.stubs['transition'] = false
  options.global.components = options.global.components || {}
  options.global.plugins = options.global.plugins || []

  /* Add any global plugins */
  // options.global.plugins.push({
  //   install(app) {
  //     app.use(MyPlugin);
  //   },
  // });

  /* Add any global components */
  // options.global.components['Button'] = Button;

  return mount(comp, options)
})
```

:::

For more info on adding custom commands like `cy.mount`, see our
[Custom Commands API](/api/cypress-api/custom-commands) guide.

## Adding TypeScript Typings for `cy.mount` Commands

When working in TypeScript, you will need to add some custom typings for your
commands to get code completion and avoid any TypeScript errors. Below are the
typings for the above examples for React and Vue:

:::react-vue-example

```ts
// cypress.d.ts
import { MountOptions, MountReturn } from '@cypress/react'
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Mounts a React node
       * @param jsx React Node to mount
       * @param options Additional options to pass into mount
       */
      mount(
        jsx: React.ReactNode,
        options?: MountOptions
      ): Cypress.Chainable<MountReturn>
    }
  }
}
```

```ts
import { mount } from '@cypress/vue'
type MountParams = Parameters<typeof mount>

declare global {
  namespace Cypress {
    type ComponentParam = MountParams[0] | JSX.Element
    type OptionsParam = MountParams[1]
    interface Chainable {
      /**
       * Helper mount function for Vue Components
       * @param component Vue Component or JSX Element to mount
       * @param options Options passed to Vue Test Utils
       */
      mount(component: ComponentParam, options?: OptionsParam): Chainable<any>
    }
  }
}
```

:::

The typings will need to be in a location that any code can access in the
application. We recommend adding them to a `cypress.d.ts` file at the root of
the application and updating any tsconfig.json files to reference the typings
file in the `include` option:

```
"include": ["./src", "cypress.d.ts"]
```

## Other Mount Commands

You can create as many custom mount commands as you need. For instance, below is
a command that wraps a React component that requires React Router with
`<MemoryRouter>`:

```
Cypress.Commands.add(
  'mountWithRouter',
  (jsx, options) => mount(<MemoryRouter>{jsx}</MemoryRouter>, options)
);
```

## When Not to Use a Custom Mount Command

Just like commands in general, not every scenario requires adding a custom mount
command. For instance, if you have a command for a particular test and it
doesn't get reused elsewhere, it makes more sense to put that logic in a local
function to the test. See the best practices section in the
[Commands API](api/cypress-api/custom-commands#Best-Practices) for more info.
