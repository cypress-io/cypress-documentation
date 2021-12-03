---
title: mount
componentSpecific: true
---

<Alert type="warning">

Cypress does not have a **cy.mount()** command out-of-the-box. See below for
info on how to craft your own.

</Alert>

For
[Component Testing](/guides/overview/choosing-testing-type#What-is-Component-Testing),
we recommend creating a custom `cy.mount` command which wraps the mount command
from the framework-specific libraries in your component tests. Doing so offers a
few advantages:

- You don't need to import the mount command into every test as the `cy.mount`
  command is available globally.
- You can set up common scenarios that you usually have to do in each test, like
  wrapping a component in a
  [React Provider](https://reactjs.org/docs/context.html) or adding
  [Vue plugins](https://vuejs.org/v2/guide/plugins.html).

If you attempt to use `cy.mount` before creating it, you will get a warning:

<img src="/_nuxt/assets/img/guides/component-testing/cy-mount-must-be-implemented.png" alt="cy.mount must be implemented by the user." />

Let's take a look at how to implement the command.

## Creating a New `cy.mount` Command

To use `cy.mount` you will need to add a
[custom command](/api/cypress-api/custom-commands) to the commands file. Below
are examples that you can start with for your commands:

<code-group-react-vue>
<template #react>

```js
import { mount } from '@cypress/react'

Cypress.Commands.overwrite('mount', (jsx, options) => {
  // Wrap any parent components needed
  // ie: return mount(<MyProvider>{jsx}</MyProvider>, options)
  return mount(jsx, options)
})
```

</template>
<template #vue>

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

</template>
</code-group-react-vue>

## Adding TypeScript Typings for `cy.mount` Commands

When working in
[TypeScript](https://docs.cypress.io/guides/tooling/typescript-support), you
will need to add custom typings for your commands to get code completion and to
avoid any TypeScript errors.

The typings will need to be in a location that any code can access, therefore,
we recommend creating a `cypress.d.ts` file in the root directory.

Then, you can update the `cypress.d.ts` file with:

<code-group-react-vue>
<template #react>

```ts
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

</template>
<template #vue>

```ts
import { mount } from '@cypress/vue'

type MountParams = Parameters<typeof mount>
type OptionsParam = MountParams[1]

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Helper mount function for Vue Components
       * @param component Vue Component or JSX Element to mount
       * @param options Options passed to Vue Test Utils
       */
      mount(component: any, options?: OptionsParam): Chainable<any>
    }
  }
}
```

</template>
</code-group-react-vue>

If your tests have trouble finding the types for the custom commands, manually
include the `cypress.d.ts` file in all your `tsconfig.json` files like so:

```json
"include": ["./src", "cypress.d.ts"]
```

## Additional Mount Commands

You're not limited to a single `cy.mount()` command. If needed, you can create
any number of custom mount commands, as long as they have unique names.

Below are some examples for specific use cases.

## React Examples

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

You can pass in custom props for the `MemoryRouter` in the `options` param.

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

### Redux

To use a component that consumes state or actions from a Redux store, you can
create a `mountWithRedux` command that will wrap your component in a Redux
Provider:

```jsx
import { mount } from '@cypress/react'
import { Provider } from 'react-redux'

Cypress.Commands.add('mountWithRedux', (component, store, options = {}) => {
  const wrapped = <Provider store={store}>{component}</Provider>
  return mount(wrapped, options)
})
```

Typings:

```jsx
import { MountOptions, MountReturn } from '@cypress/react';
import { EnhancedStore } from '@reduxjs/toolkit';
import { RootState } from './src/StoreState';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Mounts a React node
       * @param jsx React Node to mount
       * @param store The store to initialize the provider with
       * @param options Additional options to pass into mount
       */
      mountWithRedux(
        jsx: React.ReactNode,
        store: EnhancedStore<RootState>,
        options?: MountOptions
      ): Cypress.Chainable<MountReturn>;
    }
  }
}
```

The second param to the `mountWithRedux` command is the store that the provider
gets initialized with. We recommend having a factory method that returns a new
store each time so that the store is not reused between tests.

Example Usage:

```jsx
import { getStore } from '../redux/store'
import { setUser } from '../redux/userSlice'
import { UserProfile } from './UserProfile'

it('User profile should display users name', () => {
  const user = { name: 'test person' }
  const store = getStore()
  // setUser is an action exported from the user slice
  store.dispatch(setUser(user))
  cy.mountWithRedux(<UserProfile />, store)
  cy.get('div.name').should('have.text', user.name)
})
```

## Vue Examples

### Plugins & Global Vue Components

Vue components like Buttons and TextFields might be registered at the global
level in the main file to avoid having to import them into each component that
consumes them. If you try to run a test on one of these, the common components
won't render because the tests don't use the `app` that is setup in the main
file.

We can create a custom mount command that will add these global components to
the options that get passed into `mount`:

```jsx
import { mount } from '@cypress/vue'

Cypress.Commands.add('mount', (comp, options = {}) => {
    // Setup options object
    options.global = options.global || {};
    options.global.stubs = options.global.stubs || {};
    options.global.stubs['transition'] = false;
    options.global.components = options.global.components || {};
    options.global.plugins = options.global.plugins || [];

    // Add any global plugins
    // options.global.plugins.push({
    //   install(app) {
    //     app.use(MyPlugin);
    //   },
    // });

    // Add any global components
    options.global.components['Button'] = Button

    return mount(comp, options)
  }
```
