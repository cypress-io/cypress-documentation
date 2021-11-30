---
title: mount
componentSpecific: true
---

<Alert type="warning">

Cypress does not have a **cy.mount()** command out-of-the-box. See below for
info on how to craft your own.

</Alert>

We recommend creating a custom `cy.mount` command which wraps the mount command
from the framework-specific libraries in your component tests. Doing so offers a
few advantages:

- You don't need to import the mount command into every test as the `cy.mount`
  command is available globally
- You can set up common scenarios that you usually have to do in each test, like
  wrapping a component in a
  [React Provider](https://reactjs.org/docs/context.html) or adding
  [Vue plugins](https://vuejs.org/v2/guide/plugins.html)

If you attempt to use `cy.mount` before creating it, you will get a warning:

<img src="/_nuxt/assets/img/guides/component-testing/cy-mount-must-be-implemented.png" alt="cy.mount must be implemented by the user." />

Let's take a look at how to implement the command.

## Creating a New `cy.mount` Command

To use `cy.mount` you will need to add a
[custom command](/api/cypress-api/custom-commands) to the commands file. Below
are examples that you can start with for your commands:

:::react-vue-example

```js
import { mount } from '@cypress/react'
Cypress.Commands.overwrite('mount', (jsx, options) => {
  // Wrap any parent components needed
  // ie: return mount(<MyProvider>{jsx}</MyProvider>, options)
  return mount(jsx, options)
})
```

```js
import { mount } from '@cypress/vue'
Cypress.Commands.overwrite('mount', (comp, options = {}) => {
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

See [examples](#Examples) below for practical use cases.

## Adding TypeScript Typings for `cy.mount` Commands

When working in
[TypeScript](https://docs.cypress.io/guides/tooling/typescript-support), you
will need to add some custom typings for your commands to get code completion
and avoid any TypeScript errors. Below are the typings for the above examples
for React and Vue:

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

```json
"include": ["./src", "cypress.d.ts"]
```

## Examples

You can create as many custom mount commands as you need. There might be times
when you need to do additional setup for certain tests that other tests don't
need. In this case, it is good to create a new command for those tests.

Below are some examples for specific use cases.

### React Router

If you have a component that consumes a hook or component from React Router, you
will need to make sure the component has access to a React Router provider.
Below is a sample mount command that uses `MemoryRouter` to wrap the component.
Setup props for `MemoryRouter` can be passed in the options param as well:

```jsx
import { mount } from '@cypress/react'
import { MemoryRouter } from 'react-router-dom'

Cypress.Commands.add('mountWithRouter', (component, options) => {
  const { routerProps = { initialEntries: ['/'] }, ...mountOptions } = options

  const wrapped = <MemoryRouter {...routerProps}>{component}</MemoryRouter>
  return mount(wrapped, mountOptions)
})
```

Example usage:

```jsx
it('Logout link should appear when logged in', () => {
  cy.mountWithRouter(<Navigation loggedIn={true} />, {
    routerProps: {
      initialEntries: ['/home'],
    },
  })
  cy.contains('Logout').should('exist')
})
```

### React Redux

When using Redux, your component might consume data from a Redux store. Below is
an example that setups a Redux Provider and

```jsx
import { mount } from '@cypress/react'
import { Provider as ReduxProvider } from 'react-redux'
import { getStore } from '../../redux/store'

Cypress.Commands.add('mountWithRedux', (component, options) => {
  const { reduxProps = { store: getStore() }, ...mountOptions } = options

  const wrapped = <ReduxProvider {...reduxProps}>{component}</ReduxProvider>
  return mount(wrapped, mountOptions)
})
```

The below example sets up a
