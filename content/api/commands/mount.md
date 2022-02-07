---
title: mount
componentSpecific: true
---

<Alert type="warning">

Cypress does not have a `cy.mount()` command out-of-the-box. See below for info
on how to craft your own.

</Alert>

For
[Component Testing](/guides/overview/choosing-testing-type#What-is-Component-Testing),
we recommend creating a custom `cy.mount()` command to wrap the mount command
from the framework-specific libraries in your component tests. Doing so offers a
few advantages:

- You don't need to import the mount command into every test as the `cy.mount()`
  command is available globally.
- You can set up common scenarios that you usually have to do in each test, like
  wrapping a component in a
  [React Provider](https://reactjs.org/docs/context.html) or adding
  [Vue plugins](https://vuejs.org/v2/guide/plugins.html).

However, if you attempt to use `cy.mount()` before creating it, you will get a
warning:

<img src="/_nuxt/assets/img/guides/component-testing/cy-mount-must-be-implemented.png" alt="cy.mount() must be implemented by the user." />

This is to inform you that a `cy.mount()` command is custom to your application
and needs to be set up manually.

Let's take a look at how to implement the command.

## Creating a New `cy.mount()` Command

To use `cy.mount()` add a [custom command](/api/cypress-api/custom-commands) to
the commands file. Below are examples to start with for your commands:

<code-group-react-vue2-vue3>
<template #react>

```js
import { mount } from '@cypress/react'

Cypress.Commands.overwrite('mount', (component, options) => {
  // Wrap any parent components needed
  // ie: return mount(<MyProvider>{component}</MyProvider>, options)
  return mount(component, options)
})
```

</template>
<template #vue2>

```js
import { mount } from '@cypress/vue'

Cypress.Commands.overwrite('mount', (component, options = {}) => {
  // Setup options object
  options.extensions = options.extensions || {}
  options.extensions.plugins = options.extensions.plugins || []
  options.extensions.components = options.extensions.components || {}

  /* Add any global plugins */
  // options.global.plugins.push({
  //   install(app) {
  //     app.use(MyPlugin);
  //   },
  // });

  /* Add any global components */
  // options.global.components['Button'] = Button;

  return mount(component, options)
})
```

</template>
<template #vue3>

```js
import { mount } from '@cypress/vue'

Cypress.Commands.overwrite('mount', (component, options = {}) => {
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

  return mount(component, options)
})
```

</template>
</code-group-react-vue2-vue3>

## Adding TypeScript Typings for `cy.mount()` Commands

When working in
[TypeScript](https://docs.cypress.io/guides/tooling/typescript-support), you
will need to add custom typings for your commands to get code completion and to
avoid any TypeScript errors.

The typings need to be in a location that any code can access, therefore, we
recommend creating a `cypress.d.ts` file in the root directory, and use this
example as a starting point for customizing your own command:

<code-group-react-vue>
<template #react>

```ts
import { MountOptions, MountReturn } from '@cypress/react'

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Mounts a React node
       * @param component React Node to mount
       * @param options Additional options to pass into mount
       */
      mount(
        component: React.ReactNode,
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

## Importing Framwork Specific Mount Commands

Different frameworks render their components differently, so we provide
framework-specific `mount()` functions, which can be imported like so:

<code-group-react-vue>
<template #react-alert>
<Alert type="info">

<strong class="alert-header">A note for React users</strong>

The `mount()` command exported from the
[@cypress/react](https://github.com/cypress-io/cypress/tree/develop/npm/react)
library supports standard JSX syntax for mounting components. If you have any
questions about mount options that aren't covered in this guide, be sure to
check out the library
[documentation](https://github.com/cypress-io/cypress/tree/develop/npm/react#readme).

</Alert>
</template>
<template #react>

```js
import { mount } from '@cypress/react'
```

</template>
<template #vue-alert>
<Alert type="info">

<strong class="alert-header">A note for Vue users</strong>

The `mount()` command exported from the
[@cypress/vue](https://github.com/cypress-io/cypress/tree/develop/npm/vue)
library uses [Vue Test Utils](https://vue-test-utils.vuejs.org/) internally, but
instead of mounting your components in a virtual browser in node, it mounts them
in your actual browser. If you have any questions about mount options that
aren't covered in this guide, be sure to check out the library
[documentation](https://github.com/cypress-io/cypress/tree/develop/npm/vue#readme).

</Alert>
</template>
<template #vue>

```js
import { mount } from '@cypress/vue'
```

</template>
</code-group-react-vue>

## Additional Mount Commands

You're not limited to a single `cy.mount()` command. If needed, you can create
any number of custom mount commands, as long as they have unique names.

Below are some examples for common uses cases and libraries.

## React Examples

If your React component relies on context to work properly, you need to wrap
your component in a provider in your component tests. This is a good use case to
create a custom mount command that wraps your components for you.

Below are a few examples that demonstrate how. These examples can be adjusted
for most other providers that you will need to support.

### React Router

If you have a component that consumes a hook or component from
[React Router](https://reactrouter.com/), make sure the component has access to
a React Router provider. Below is a sample mount command that uses
`MemoryRouter` to wrap the component.

```jsx
import { mount } from '@cypress/react'
import { MemoryRouter } from 'react-router-dom'

Cypress.Commands.add('mountWithRouter', (component, options = {}) => {
  const { routerProps = { initialEntries: ['/'] }, ...mountOptions } = options

  const wrapped = <MemoryRouter {...routerProps}>{component}</MemoryRouter>

  return mount(wrapped, mountOptions)
})
```

Typings:

```ts
import { MountOptions, MountReturn } from '@cypress/react'
import { MemoryRouterProps } from 'react-router-dom'

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Mounts a React node
       * @param component React Node to mount
       * @param options Additional options to pass into mount
       */
      mountWithRouter(
        component: React.ReactNode,
        options?: MountOptions & { routerProps?: MemoryRouterProps }
      ): Cypress.Chainable<MountReturn>
    }
  }
}
```

To set up certain scenarios, pass in props that will get passed to
`MemoryRouter` in the options. Below is an example test that ensures an active
link has the correct class applied to it by initializing the router with
`initialEntries` pointed to a particular route:

```jsx
import { Navigation } from './Navigation'

it('home link should be active when url is "/"', () => {
  // No need to pass in custom initialEntries as default url is '/'
  cy.mountWithRouter(<Navigation />)

  cy.get('a').contains('Home').should('have.class', 'active')
})

it('login link should be active when url is "/login"', () => {
  cy.mountWithRouter(<Navigation />, {
    routerProps: {
      initialEntries: ['/login'],
    },
  })

  cy.get('a').contains('Login').should('have.class', 'active')
})
```

### Redux

To use a component that consumes state or actions from a
[Redux](https://react-redux.js.org/) store, create a `mountWithRedux` command
that will wrap your component in a Redux Provider:

```jsx
import { mount } from '@cypress/react'
import { Provider } from 'react-redux'
import { getStore } from '../../src/store'

Cypress.Commands.add('mountWithRedux', (component, options = {}) => {
  // Use the default store if one is not provided
  const { reduxStore = getStore(), ...mountOptions } = options

  const wrapped = <Provider store={reduxStore}>{component}</Provider>

  return mount(wrapped, mountOptions)
})
```

Typings:

```ts
import { MountOptions, MountReturn } from '@cypress/react'
import { EnhancedStore } from '@reduxjs/toolkit'
import { RootState } from './src/StoreState'

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Mounts a React node
       * @param component React Node to mount
       * @param options Additional options to pass into mount
       */
      mountWithRedux(
        component: React.ReactNode,
        options?: MountOptions & { reduxStore?: EnhancedStore<RootState> }
      ): Cypress.Chainable<MountReturn>
    }
  }
}
```

The options param can have a store that is already initialized with data:

```jsx
import { getStore } from '../redux/store'
import { setUser } from '../redux/userSlice'
import { UserProfile } from './UserProfile'

it('User profile should display user name', () => {
  const user = { name: 'test person' }

  // getStore is a factory method that creates a new store
  const store = getStore()

  // setUser is an action exported from the user slice
  store.dispatch(setUser(user))

  cy.mountWithRedux(<UserProfile />, { reduxStore: store })

  cy.get('div.name').should('have.text', user.name)
})
```

<Alert type="info">

The `getStore` method is a factory method that initializes a new Redux store. It
is important that the store be initialized with each new test to ensure changes
to the store don't affect other tests.

</Alert>

## Vue Examples

Adding plugins and global components are some common scenarios for creating
custom mount commands in Vue. Below are examples that demonstrate how set up a
mount command for a few popular Vue libraries. These examples can be adapted to
fit other libraries as well.

### Vue Router

To use Vue Router, create a command to register the plugin and pass in a custom
implementation of the router via the options param:

<code-group-vue2-vue3>
<template #vue2>

```js
import { mount } from '@cypress/vue'
import Vue from 'vue'
import VueRouter from 'vue-router'
import { router } from '../../src/router'

Cypress.Commands.add('mountWithRouter', (component, options = {}) => {
  // Add the VueRouter plugin
  Vue.use(VueRouter)

  // Use the router passed in via options,
  // or the default one if not provided
  options.router = options.router || router

  return mount(component, options)
})
```

Typings:

```ts
import { mount } from '@cypress/vue'
import VueRouter from 'vue-router'

type MountParams = Parameters<typeof mount>
type OptionsParam = MountParams[1] & { router?: VueRouter }

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Helper mount function for Vue Components
       * @param component Vue Component or JSX Element to mount
       * @param options Options passed to Vue Test Utils
       */
      mountWithRouter(component: any, options?: OptionsParam): Chainable<any>
    }
  }
}
```

Usage:

```js
import VueRouter from 'vue-router'
import Navigation from './Navigation.vue'
import { routes } from '../router'

it('home link should be active when url is "/"', () => {
  // No need to pass in custom router as default url is '/'
  cy.mountWithRouter(Navigation)

  cy.get('a').contains('Home').should('have.class', 'router-link-active')
})

it('login link should be active when url is "/login"', () => {
  // Create a new router instance for each test
  const router = new VueRouter({
    mode: 'history',
    routes,
  })

  // Change location to `/login`
  router.push('/login')

  // Pass the already initialized router for use
  cy.mountWithRouter(Navigation, { router })

  cy.get('a').contains('Login').should('have.class', 'router-link-active')
})
```

</template>
<template #vue3>

```js
import { mount } from '@cypress/vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { routes } from '../../src/router'

Cypress.Commands.add('mountWithRouter', (component, options = {}) => {
  // Setup options object
  options.global = options.global || {}
  options.global.plugins = options.global.plugins || []

  // create router if one is not provided
  if (!options.router) {
    options.router = createRouter({
      routes: routes,
      history: createMemoryHistory(),
    })
  }

  // Add router plugin
  options.global.plugins.push({
    install(app) {
      app.use(options.router)
    },
  })

  return mount(component, options)
})
```

Typings:

```ts
import { mount } from '@cypress/vue'
import { Router } from 'vue-router'

type MountParams = Parameters<typeof mount>
type OptionsParam = MountParams[1] & { router?: Router }

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Helper mount function for Vue Components
       * @param component Vue Component or JSX Element to mount
       * @param options Options passed to Vue Test Utils
       */
      mountWithRouter(component: any, options?: OptionsParam): Chainable<any>
    }
  }
}
```

Usage:

Calling `router.push()` in the router for Vue 3 is an asynchronous operation.
Use the [cy.wrap](/api/commands/wrap) command to have Cypress await the
promise's resolve before it continues with other commands:

```js
import Navigation from './Navigation.vue'
import { routes } from '../router'
import { createMemoryHistory, createRouter } from 'vue-router'

it('home link should be active when url is "/"', () => {
  // No need to pass in custom router as default url is '/'
  cy.mountWithRouter(<Navigation />)

  cy.get('a').contains('Home').should('have.class', 'router-link-active')
})

it('login link should be active when url is "/login"', () => {
  // Create a new router instance for each test
  const router = createRouter({
    routes: routes,
    history: createMemoryHistory(),
  })

  // Change location to `/login`,
  // and await on the promise with cy.wrap
  cy.wrap(router.push('/login'))

  // Pass the already initialized router for use
  cy.mountWithRouter(<Navigation />, { router })

  cy.get('a').contains('Login').should('have.class', 'router-link-active')
})
```

</template>
</code-group-vue2-vue3>

### Vuex

To use a component that uses [Vuex](https://vuex.vuejs.org/), create a
`mountWithVuex` command that configures a Vuex store for your component:

<code-group-vue2-vue3>
<template #vue2>

```js
import { mount } from '@cypress/vue'
import Vuex from 'vuex'
import { getStore } from '../../src/plugins/store'

Cypress.Commands.add('mountWithVuex', (component, options = {}) => {
  // Setup options object
  options.extensions = options.extensions || {}
  options.extensions.plugins = options.extensions.plugins || []

  // Use store passed in from options, or initialize a new one
  options.store = options.store || getStore()

  // Add Vuex plugin
  options.extensions.plugins.push(Vuex)

  return mount(component, options)
})
```

<Alert type="info">

The `getStore` method is a factory method that initializes Vuex and creates a
new store. It is important that the store be initialized with each new test to
ensure changes to the store don't affect other tests.

</Alert>

Typings:

```ts
import { mount } from '@cypress/vue'
import { Store } from 'vuex'

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
      mountWithVuex(
        component: any,
        options?: OptionsParam & { store?: Store }
      ): Chainable<any>
    }
  }
}
```

Usage:

```js
import { getStore } from '@/plugins/store'
import UserProfile from './UserProfile.vue'

it.only('User profile should display user name', () => {
  const user = { name: 'test person' }

  // getStore is a factory method that creates a new store
  const store = getStore()

  // mutate the store with user
  store.commit('setUser', user)

  cy.mountWithVuex(UserProfile, {
    store,
  })

  cy.get('div.name').should('have.text', user.name)
})
```

</template>
<template #vue3>

```js
import { mount } from '@cypress/vue'
import { getStore } from '../../src/plugins/store'

Cypress.Commands.add('mountWithVuex', (component, options = {}) => {
  // Setup options object
  options.global = options.global || {}
  options.global.stubs = options.global.stubs || {}
  options.global.stubs['transition'] = false
  options.global.components = options.global.components || {}
  options.global.plugins = options.global.plugins || []

  // Use store passed in from options, or initialize a new one
  const { store = getStore(), ...mountOptions } = options

  // Add Vuex plugin
  options.global.plugins.push({
    install(app) {
      app.use(store)
    },
  })

  return mount(component, mountOptions)
})
```

<Alert type="info">

The `getStore` method is a factory method that initializes Vuex and creates a
new store. It is important that the store be initialized with each new test to
ensure changes to the store don't affect other tests.

</Alert>

Typings:

```ts
import { mount } from '@cypress/vue'
import { Store } from 'vuex'

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
      mountWithVuex(
        component: any,
        options?: OptionsParam & { store?: Store }
      ): Chainable<any>
    }
  }
}
```

Usage:

```js
import { getStore } from '@/plugins/store'
import UserProfile from './UserProfile.vue'

it.only('User profile should display user name', () => {
  const user = { name: 'test person' }

  // getStore is a factory method that creates a new store
  const store = getStore()

  // mutate the store with user
  store.commit('setUser', user)

  cy.mountWithVuex(UserProfile, {
    store,
  })

  cy.get('div.name').should('have.text', user.name)
})
```

</template>
</code-group-vue2-vue3>

### Global Components

If you have components that are registered globally in the main application
file, set them up in your mount command so your component will render them
properly:

<code-group-vue2-vue3>
<template #vue2>

```js
import { mount } from '@cypress/vue'
import Button from '../../src/components/Button.vue'

Cypress.Commands.overwrite('mount', (component, options = {}) => {
  // Setup options object
  options.extensions = options.extensions || {}
  options.extensions.plugins = options.extensions.plugins || []
  options.extensions.components = options.extensions.components || {}

  // Register global components
  options.extensions.components['Button'] = Button

  return mount(component, options)
})
```

</template>
<template #vue3>

```js
import { mount } from '@cypress/vue'
import Button from '../../src/components/Button.vue'

Cypress.Commands.overwrite('mount', (component, options = {}) => {
  // Setup options object
  options.global = options.global || {}
  options.global.components = options.global.components || {}

  // Register global components
  options.global.components['Button'] = Button

  return mount(component, options)
})
```

</template>
</code-group-vue2-vue3>
