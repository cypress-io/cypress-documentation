---
title: Customizing Mount Commands for React
---

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

<code-group>
<code-block label="Component Support File" active>

```jsx
import { mount } from 'cypress/react'
import { MemoryRouter } from 'react-router-dom'

Cypress.Commands.add('mount', (component, options = {}) => {
  const { routerProps = { initialEntries: ['/'] }, ...mountOptions } = options

  const wrapped = <MemoryRouter {...routerProps}>{component}</MemoryRouter>

  return mount(wrapped, mountOptions)
})
```

</code-group>
</code-block>

Typings:

<code-group>
<code-block label="cypress.d.ts (or other typings file)" active>

```ts
import { MountOptions, MountReturn } from 'cypress/react'
import { MemoryRouterProps } from 'react-router-dom'

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
        options?: MountOptions & { routerProps?: MemoryRouterProps }
      ): Cypress.Chainable<MountReturn>
    }
  }
}
```

</code-group>
</code-block>

To set up certain scenarios, pass in props that will get passed to
`MemoryRouter` in the options. Below is an example test that ensures an active
link has the correct class applied to it by initializing the router with
`initialEntries` pointed to a particular route:

```jsx
import { Navigation } from './Navigation'

it('home link should be active when url is "/"', () => {
  // No need to pass in custom initialEntries as default url is '/'
  cy.mount(<Navigation />)

  cy.get('a').contains('Home').should('have.class', 'active')
})

it('login link should be active when url is "/login"', () => {
  cy.mount(<Navigation />, {
    routerProps: {
      initialEntries: ['/login'],
    },
  })

  cy.get('a').contains('Login').should('have.class', 'active')
})
```

### Redux

To use a component that consumes state or actions from a
[Redux](https://react-redux.js.org/) store, create a `mount` command that will
wrap your component in a Redux Provider:

<code-group>
<code-block label="Component Support File" active>

```jsx
import { mount } from 'cypress/react'
import { Provider } from 'react-redux'
import { getStore } from '../../src/store'

Cypress.Commands.add('mount', (component, options = {}) => {
  // Use the default store if one is not provided
  const { reduxStore = getStore(), ...mountOptions } = options

  const wrapped = <Provider store={reduxStore}>{component}</Provider>

  return mount(wrapped, mountOptions)
})
```

</code-group>
</code-block>

Typings:

<code-group>
<code-block label="cypress.d.ts (or other typings file)" active>

```ts
import { MountOptions, MountReturn } from 'cypress/react'
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
      mount(
        component: React.ReactNode,
        options?: MountOptions & { reduxStore?: EnhancedStore<RootState> }
      ): Cypress.Chainable<MountReturn>
    }
  }
}
```

</code-group>
</code-block>

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

  cy.mount(<UserProfile />, { reduxStore: store })

  cy.get('div.name').should('have.text', user.name)
})
```

<Alert type="info">

The `getStore` method is a factory method that initializes a new Redux store. It
is important that the store be initialized with each new test to ensure changes
to the store don't affect other tests.

</Alert>
