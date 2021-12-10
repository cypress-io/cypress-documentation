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
we recommend creating a custom `cy.mount()` command which wraps the mount
command from the framework-specific libraries in your component tests. Doing so
offers a few advantages:

- You don't need to import the mount command into every test as the `cy.mount()`
  command is available globally.
- You can set up common scenarios that you usually have to do in each test, like
  wrapping a component in a
  [React Provider](https://reactjs.org/docs/context.html) or adding
  [Vue plugins](https://vuejs.org/v2/guide/plugins.html).

If you attempt to use `cy.mount()` before creating it, you will get a warning:

<img src="/_nuxt/assets/img/guides/component-testing/cy-mount-must-be-implemented.png" alt="cy.mount() must be implemented by the user." />

Let's take a look at how to implement the command.

## Creating a New `cy.mount()` Command

To use `cy.mount()` you will need to add a
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

## Adding TypeScript Typings for `cy.mount()` Commands

When working in
[TypeScript](https://docs.cypress.io/guides/tooling/typescript-support), you
will need to add custom typings for your commands to get code completion and to
avoid any TypeScript errors.

The typings will need to be in a location that any code can access, therefore,
we recommend creating a `cypress.d.ts` file in the root directory, and use this
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

Below are some examples for common uses cases and libraries.

## React Examples

If your React component relies on provider to work properly, you will need to
wrap your component in that provider in your component tests. This is a good use
case to create a custom mount command that wraps your components for you.

Below are a few examples that demonstrate how. These examples can be adjusted
for most other providers that you will need to support.

### React Router

If you have a component that consumes a hook or component from
[React Router](https://reactrouter.com/), you will need to make sure the
component has access to a React Router provider. Below is a sample mount command
that uses `MemoryRouter` to wrap the component. Setup props for `MemoryRouter`
can be passed in the options param as well:

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
       * @param jsx React Node to mount
       * @param options Additional options to pass into mount
       */
      mountWithRouter(
        jsx: React.ReactNode,
        options?: MountOptions & { routerProps?: MemoryRouterProps }
      ): Cypress.Chainable<MountReturn>
    }
  }
}
```

In this setup, you can pass in custom props for the `MemoryRouter` in the
`options` param. Below is an example test that ensures an active link has the
correct class applied to it by initializing the router with `initialEntries`
pointed to a particular route:

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
[Redux](https://react-redux.js.org/) store, you can create a `mountWithRedux`
command that will wrap your component in a Redux Provider:

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
       * @param jsx React Node to mount
       * @param options Additional options to pass into mount
       */
      mountWithRedux(
        jsx: React.ReactNode,
        options?: MountOptions & { reduxStore?: EnhancedStore<RootState> }
      ): Cypress.Chainable<MountReturn>
    }
  }
}
```

You can pass in an instance of the store that the provider will use on the
options param, which can be useful to initialize a store with certain data for
tests. It is important that the store be initialized with each new test to
ensure changes to the store don't affect other tests:

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

## Vue Examples

Adding plugins and global components are some common scenarios for creating
custom mount commands in Vue. Below are examples that demonstrate how set up a
mount command for a few popular Vue libraries. These examples can be adapted to
other libraries as well.

### Vuetify

This example shows how to set a global `cy.mount()` command that configures
[Vuetify](https://vuetifyjs.com/), ensuring components that utilize the UI
library display properly during test runs.

Vuetify is a plugin that must be registered and have a few custom attributes on
the root element setup for styling to appear correct.

<code-group-vue2-vue3>
<template #vue2>

```js
import { mount } from '@cypress/vue'
import vuetify from '../../src/plugins/vuetify'

Cypress.Commands.overwrite('mount', (comp, options = {}) => {
  // Add attributes needed for Vuetify styling
  const root = document.getElementById('__cy_root')
  if (!root.classList.contains('v-application')) {
    root.classList.add('v-application')
  }
  root.setAttribute('data-app', 'true')

  // vuetify import calls Vue.use(Vuetify) directly
  // so no need to call it directly here

  return mount(comp, {
    vuetify,
    ...options,
  })
})
```

</template>
<template #vue3>

```js
import { mount } from '@cypress/vue'
import vuetify from '../../src/plugins/vuetify'

Cypress.Commands.overwrite('mount', (comp, options = {}) => {
  // Setup options object
  options.global = options.global || {}
  options.global.plugins = options.global.plugins || []

  // Add attributes needed for Vuetify styling
  const root = document.getElementById('__cy_root')
  if (!root.classList.contains('v-application')) {
    root.classList.add('v-application')
  }
  root.setAttribute('data-app', 'true')

  // Add Vuetify plugin
  options.global.plugins.push({
    install(app) {
      app.use(vuetify)
    },
  })

  return mount(comp, options)
})
```

</template>
</code-group-vue2-vue3>

Typings:

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

Usage:

```ts
import Button from './Button.vue'

it('Shows a button', () => {
  cy.mount(Button, {
    slots: {
      default: () => 'Click Me',
    },
  })
  cy.contains('Click Me').should('exist')
})
```

### Vue Router

To wire up a plugin such as Vue Router, you can create a custom command to
register the plugin and pass in a custom implementation of the router via the
options param.

<code-group-vue2-vue3>
<template #vue2>

```js
import { mount } from '@cypress/vue'
import Vue from 'vue'
import VueRouter from 'vue-router'
import { router } from '../../src/router'

Cypress.Commands.add('mountWithRouter', (comp, options = {}) => {
  // Add the VueRouter plugin
  Vue.use(VueRouter)

  // Use the router passed in via options,
  // or the default one if not provided
  options.router = options.router || router

  return mount(comp, options)
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

Cypress.Commands.add('mountWithRouter', (comp, options = {}) => {
  // Setup options object
  options.global = options.global || {}
  options.global.plugins = options.global.plugins || []

  // Use the router passed in via options,
  // or the default one if not provided
  options.router =
    options.router ||
    createRouter({
      routes: routes,
      history: createMemoryHistory(),
    })

  // Add router plugin
  options.global.plugins.push({
    install(app) {
      app.use(options.router)
    },
  })

  return mount(comp, options)
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
You can use the [cy.wrap](/api/commands/wrap) command to have Cypress await the
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

### Global Components

If you have components that are registered globally in the main application
file, you will need to set them up in your mount command as well.

<code-group-vue2-vue3>
<template #vue2>

```js
import { mount } from '@cypress/vue'
import Button from '../../src/components/Button.vue'

Cypress.Commands.overwrite('mount', (comp, options = {}) => {
  // Register global components
  Vue.component('Button', Button)

  return mount(comp, options)
})
```

</template>
<template #vue3>

```js
import { mount } from '@cypress/vue'
import Button from '../../src/components/Button.vue'

Cypress.Commands.overwrite('mount', (comp, options = {}) => {
  // Setup options object
  options.global = options.global || {}
  options.global.components = options.global.components || {}

  // Register global components
  options.global.components['Button'] = Button

  return mount(comp, options)
})
```

</template>
</code-group-vue2-vue3>
