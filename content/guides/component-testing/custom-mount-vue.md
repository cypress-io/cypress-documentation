---
title: Custom Mount Commands and Styles
---

When working in an app that's any more complex than a Hello World app, you'll
want to create a custom Mount command if one wasn't created for you during the
automatic configuration step.

If you're using a UI Library like Vuetify or Tailwind, you'll want to replicate
the setup you're doing in your normal application for your components.

<alert type="error">

Failure to replicate the environment completely may lead to:

1. Your component not compiling at all.
1. Partially broken functionality.
1. Broken styles. (Icon fonts, )
1. Error logs in the console.

</alert>

## Broken Styles

Because your component's styles are business logic, you need to make sure the
styles are identical between your test and development environments.

If your component has Times New Roman font, if the spacing is off, or if your
icon fonts aren't rendering, you'll need to investigate what the difference
between the test and development environment is.

### Missing Icons

Icons are generally installed in your `main.js`, `css`, or at the bundler level
(e.g. Iconify and unplugin-icons).

Ensure that your Icons are being installed in your support file just like they
are in your `main.js` file OR as they are in your `index.html` file.

### Times New Roman Fonts

Make sure you've added any page-level loaded fonts into the HTML fixture!

Additionally, make sure that any page-level styles are not dependent on
component hierarchy, but are instead extracted into a `main.css` (or scss) file
and imported at the top of your support file.

<code-group>
<code-block label="Component Support File" active>

```js
// cypress/support/component.js

// Should import normalize.css, etc
// The top of this supportfile should look very similar
// to your main.js
import '../../src/main.css'
```

</code-block>
</code-group>

## Replicating the HTML fixtures

Sometimes, you'll have a third-party plugin, like a tooltip, modal, or other
portal-style component that wants to bind to a DOM node outside of your app's
normal component hierarchy.

At any given time, or in a future refactor, your component under test may decide
it wants to use that library, so you should make sure the HTML you're using to
fixture your component sandbox is identical to that of the page you'll be
rendering the component in.

If you always make sure your production HTML fixtures are close to your test
HTML fixtures, you'll rarely have to modify your tests when you refactor the
implementation of the component.

### Editing your HTML fixture

To edit the spec's fixtured HTML, open up the
`cypress/support/component-index.html` file that was fixtured for you during
automatic configuration.

Anything you change in this file will show up automatically in your tests.

You may also want to load custom libraries like `jquery` or `tailwind` like this
-- if that's how you load those libraries when your application is shipped to
production.

## Custom Mount Commands

If you used the automatic configuration option to setup your app, you'll have
the global `cy.mount` Cypress Command available throughout your tests.

As your application grows past the proof-of-concept stage, you'll want to use
plugins and tools like Vue Router, Vuex, Pinia, or Vue I18n. These are plugins
that are usually installed in your application's entry point file (`main.js`
usually). You may also pull in global plugins or style resets like
`normalize.css`

### Replicating Plugins

Most applications will have state management or routing. Both of these are Vue
plugins.

<code-group>

<code-block label="JavaScript" active>

```js
import { createPinia } from 'pinia' // or Vuex
import { createI18n } from 'vue-i18n'
import { mount } from 'cypress/vue'
import { h } from 'vue'

// We recommend that you pull this out
// into a constants file that you share with
// your main.js file.
const i18nOptions = {
  locale: 'en',
  messages: {
    en: {
      hello: 'hello!',
    },
    ja: {
      hello: 'こんにちは！',
    },
  },
}

Cypress.Commands.add('mount', (component, ...args) => {
  args.global = args.global || {}
  args.global.plugins = args.global.plugins || []
  args.global.plugins.push(createPinia())
  args.global.plugins.push(createI18n())

  return mount(() => {
    return h(VApp, {}, component)
  }, ...args)
})
```

</code-block>

<code-block label="With JSX">

```jsx
import { createPinia } from 'pinia' // or Vuex
import { createI18n } from 'vue-i18n'
import { mount } from 'cypress/vue'

// We recommend that you pull this out
// into a constants file that you share with
// your main.js file.
const i18nOptions = {
  locale: 'en',
  messages: {
    en: {
      hello: 'hello!',
    },
    ja: {
      hello: 'こんにちは！',
    },
  },
}

Cypress.Commands.add('mount', (component, ...args) => {
  args.global = args.global || {}
  args.global.plugins = args.global.plugins || []
  args.global.plugins.push(createPinia())
  args.global.plugins.push(createI18n())

  // <component> is a built-in component that comes with Vue
  return mount(
    () => (
      <VApp>
        <component is={component} />
      </VApp>
    ),
    ...args
  )
})
```

</code-block>

</code-group>

### Replicating the expected Component Hierarchy

Some Vue applications, most famously Vue apps built on top of Vuetify, require
certain components to be structured in a specific hierarchy.

All Vuetify applications require that you wrap your app in a `VApp` component
when you build it. This is an implementation detail of Vuetify, but once users
try to test components that depend on Vuetify, they get Vuetify-specific
compilation errors and quickly find out that **they need to replicate that
component hierarchy any time they need to mount a component that uses a Vuetify
component**!

Custom `cy.mount` commands to the rescue! You may find the JSX syntax to be more
straightforward.

You'll also need to replicate the plugin setup steps from the Vuetify docs for
everything to compile.

<code-group>

<code-block label="JavaScript" active>

```js
import Vuetify from 'vuetify/lib'
import { VApp } from 'vuetify'
import { mount } from 'cypress/vue'
import { h } from 'vue'

// We recommend that you pull this out
// into a constants file that you share with
// your main.js file.
const vuetifyOptions = {}

Cypress.Commands.add('mount', (component, ...args) => {
  args.global = args.global || {}
  args.global.plugins = args.global.plugins || []
  args.global.plugins.push(new Vuetify(vuetifyOptions))

  return mount(() => {
    return h(VApp, {}, component)
  }, ...args)
})
```

</code-block>

<code-block label="With JSX">

```jsx
import Vuetify from 'vuetify/lib'
import { VApp } from 'vuetify'
import { mount } from 'cypress/vue'

// We recommend that you pull this out
// into a constants file that you share with
// your main.js file.
const vuetifyOptions = {}

Cypress.Commands.add('mount', (component, ...args) => {
  args.global = args.global || {}
  args.global.plugins = args.global.plugins || []
  args.global.plugins.push(new Vuetify(vuetifyOptions))

  // <component> is a built-in component that comes with Vue
  return mount(
    () => (
      <VApp>
        <component is={component} />
      </VApp>
    ),
    ...args
  )
})
```

</code-block>

</code-group>

At this point, you should be able to setup a complex application and mount
components that use all of Vue's language features.

Congrats! Happy building. 🎉

### Vue Router

To use Vue Router, create a command to register the plugin and pass in a custom
implementation of the router via the options param:

<code-group-vue2-vue3>
<template #vue2>

```js
import { mount } from 'cypress/vue'
import Vue from 'vue'
import VueRouter from 'vue-router'
import { router } from '../../src/router'

Cypress.Commands.add('mount', (component, options = {}) => {
  // Add the VueRouter plugin
  Vue.use(VueRouter)

  // Use the router passed in via options,
  // or the default one if not provided
  options.router = options.router || router

  return mount(component, options)
})
```

<code-group>
<code-block label="TypeScript Typings" active>

```ts
import { mount } from 'cypress/vue'
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
      mount(component: any, options?: OptionsParam): Chainable<any>
    }
  }
}
```

</code-group>
</code-block>

Usage:

```js
import VueRouter from 'vue-router'
import Navigation from './Navigation.vue'
import { routes } from '../router'

it('home link should be active when url is "/"', () => {
  // No need to pass in custom router as default url is '/'
  cy.mount(Navigation)

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
  cy.mount(Navigation, { router })

  cy.get('a').contains('Login').should('have.class', 'router-link-active')
})
```

</template>
<template #vue3>

```js
import { mount } from 'cypress/vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { routes } from '../../src/router'

Cypress.Commands.add('mount', (component, options = {}) => {
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

<code-group>
<code-block label="TypeScript Typings" active>

```ts
import { mount } from 'cypress/vue'
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
      mount(component: any, options?: OptionsParam): Chainable<any>
    }
  }
}
```

</code-group>
</code-block>

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
  cy.mount(<Navigation />)

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
  cy.mount(<Navigation />, { router })

  cy.get('a').contains('Login').should('have.class', 'router-link-active')
})
```

</template>
</code-group-vue2-vue3>

### Vuex

To use a component that uses [Vuex](https://vuex.vuejs.org/), create a `mount`
command that configures a Vuex store for your component:

<code-group-vue2-vue3>
<template #vue2>

```js
import { mount } from 'cypress/vue'
import Vuex from 'vuex'
import { getStore } from '../../src/plugins/store'

Cypress.Commands.add('mount', (component, options = {}) => {
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

<code-group>
<code-block label="TypeScript Typings" active>

```ts
import { mount } from 'cypress/vue'
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
      mount(
        component: any,
        options?: OptionsParam & { store?: Store }
      ): Chainable<any>
    }
  }
}
```

</code-group>
</code-block>

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

  cy.mount(UserProfile, {
    store,
  })

  cy.get('div.name').should('have.text', user.name)
})
```

</template>
<template #vue3>

```js
import { mount } from 'cypress/vue'
import { getStore } from '../../src/plugins/store'

Cypress.Commands.add('mount', (component, options = {}) => {
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

<code-group>
<code-block label="TypeScript Typings" active>

```ts
import { mount } from 'cypress/vue'
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
      mount(
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

  cy.mount(UserProfile, {
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
import { mount } from 'cypress/vue'
import Button from '../../src/components/Button.vue'

Cypress.Commands.add('mount', (component, options = {}) => {
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
import { mount } from 'cypress/vue'
import Button from '../../src/components/Button.vue'

Cypress.Commands.add('mount', (component, options = {}) => {
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

<NavGuide prev="/guides/component-testing/slots-vue" />
