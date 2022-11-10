---
<<<<<<<< HEAD:docs/guides/component-testing/vue/custom-mount-vue.mdx
title: Custom Mount Commands and Styles
sidebar_position: 60
========
title: Vue Examples
>>>>>>>> @{-1}:content/guides/component-testing/vue/examples.md
---

## Mounting Components

### Using `cy.mount()`

<<<<<<<< HEAD:docs/guides/component-testing/vue/custom-mount-vue.mdx
:::danger
========
To mount a component with `cy.mount()`, import the component and pass it to the
method:
>>>>>>>> @{-1}:content/guides/component-testing/vue/examples.md

```ts
import { Stepper } from './Stepper.vue'

<<<<<<<< HEAD:docs/guides/component-testing/vue/custom-mount-vue.mdx
1. Your component not compiling at all.
1. Partially broken functionality.
1. Broken styles. (Icon fonts, etc)
1. Error logs in the console.

:::
========
it('mounts', () => {
  cy.mount(Stepper)
})
```

### Passing Data to a Component
>>>>>>>> @{-1}:content/guides/component-testing/vue/examples.md

You can pass props and events to a component by setting `props` in the options:

<<<<<<<< HEAD:docs/guides/component-testing/vue/custom-mount-vue.mdx
```js title=cypress/support/component.js
// Should import normalize.css, etc
// The top of this supportfile should look very similar
// to your main.js
import '../../src/main.css'
```

## Replicating the HTML fixtures
========
<code-group>

<code-block label="Vue 3" active>

```js
cy.mount(Stepper, {
  props: {
    initial: 100,
    onChange: () => {},
  },
})
```

</code-block>
<code-block label="Vue 2" active>

```js
cy.mount(Stepper, {
  propsData: {
    initial: 100,
    onChange: () => {},
  },
})
```

</code-block>
</code-group>

### Testing Event Handlers
>>>>>>>> @{-1}:content/guides/component-testing/vue/examples.md

Pass a Cypress [spy](/guides/guides/stubs-spies-and-clocks#Spies) to an event
prop and validate it was called:

```js
it('clicking + fires a change event with the incremented value', () => {
  const onChangeSpy = cy.spy().as('onChangeSpy')
  cy.mount(Stepper, { props: { onChange: onChangeSpy } })
  cy.get('[data-cy=increment]').click()
  cy.get('@onChangeSpy').should('have.been.calledWith', 1)
})
```

### Using JSX

The mount command also supports JSX syntax (provided that you've configured your
bundler to support transpiling JSX or TSX files). Some might find using JSX
syntax beneficial when writing tests.

Sample with JSX:

```jsx
it('clicking + fires a change event with the incremented value', () => {
  const onChangeSpy = cy.spy().as('onChangeSpy')
  cy.mount(<Stepper initial={100} onChange={onChangeSpy} />)
  cy.get('[data-cy=increment]').click()
  cy.get('@onChangeSpy').should('have.been.calledWith', 101)
})
```

## Using Slots

### Default Slot

<code-group>
<code-block label="DefaultSlot.cy.js" active>

```js
import DefaultSlot from './DefaultSlot.vue'

describe('<DefaultSlot />', () => {
  it('renders', () => {
    cy.mount(DefaultSlot, {
      slots: {
        default: 'Hello there!',
      },
    })
    cy.get('div.content').should('have.text', 'Hello there!')
  })
})
```

</code-block>
<code-block label="DefaultSlot.cy.jsx (JSX)">

```jsx
import DefaultSlot from './DefaultSlot.vue'

describe('<DefaultSlot />', () => {
  it('renders', () => {
    cy.mount(<DefaultSlot>Hello there!</DefaultSlot>)
    cy.get('div.content').should('have.text', 'Hello there!')
  })
})
```

</code-block>
<code-block label="DefaultSlot.vue">

```html
<template>
  <div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script setup></script>
```

</code-block>
</code-group>

### Named Slot

<code-group>

<code-block label="NamedSlot.cy.js" active>

```js
import NamedSlot from './NamedSlot.vue'

describe('<NamedSlot />', () => {
  it('renders', () => {
    const slots = {
      header: 'my header',
      footer: 'my footer',
    }
    cy.mount(NamedSlot, {
      slots,
    })
    cy.get('header').should('have.text', 'my header')
    cy.get('footer').should('have.text', 'my footer')
  })
})
```

</code-block>
<code-block label="NamedSlot.cy.jsx (JSX)">

```jsx
import NamedSlot from './NamedSlot.vue'

describe('<NamedSlot />', () => {
  it('renders', () => {
    const slots = {
      header: 'my header',
      footer: 'my footer',
    }
    cy.mount(<NamedSlot>{{ ...slots }}</NamedSlot>)
    cy.get('header').should('have.text', 'my header')
    cy.get('footer').should('have.text', 'my footer')
  })
})
```

</code-block>

<code-block label="NamedSlot.vue">

```html
<template>
  <div>
    <header>
      <slot name="header" />
    </header>
    <footer>
      <slot name="footer" />
    </footer>
  </div>
</template>

<script setup></script>
```

</code-block>
</code-group>

For more info on testing Vue components with slots, refer to the
[Vue Test Utils Slots guide](https://test-utils.vuejs.org/guide/advanced/slots.html).

## Using Vue Test Utils

In order to encourage interoperability between your existing component tests and
Cypress, we support using Vue Test Utils' API.

```js
cy.mount(Stepper).then((wrapper) => {
  // this is the Vue Test Utils wrapper
})
```

<!-- TODO: Custom mount command docs -->

If you intend to use the `wrapper` frequently and use Vue Test Util's API, we
recommend you write a [custom mount command](/api/commands/mount) and create a
Cypress alias to get back at the `wrapper`.

```js
import { mount } from 'cypress/vue'

Cypress.Commands.add('mount', (...args) => {
  return mount(...args).then((wrapper) => {
    return cy.wrap(wrapper).as('vue')
  })
})

// the "@vue" alias will now work anywhere
// after you've mounted your component
cy.mount(Stepper).doStuff().get('@vue') // The subject is now the Vue Wrapper
```

This means that you are able to get to the resulting `wrapper` returned from the
`mount` command and use `wrapper.emitted()` in order to gain access to Native
DOM events that were fired, as well as custom events that were emitted by your
component under test.

Because `wrapper.emitted()` is only data, and NOT spy-based you will have to
unpack its results to write assertions.

Your test failure messages will not be as helpful because you're not able to use
the Sinon-Chai library that Cypress ships, which comes with methods such as
`to.have.been.called` and `to.have.been.calledWith`.

Usage of the `cy.get('@vue')` alias may look something like the below code
snippet.

Notice that we're using the `'should'` function signature in order to take
advantage of Cypress's [retryability](/guides/guides/test-retries). If we
chained using `cy.then` instead of `cy.should`, we may run into the kinds of
issues you have in Vue Test Utils tests where you have to use `await` frequently
in order to make sure the DOM has updated or any reactive events have fired.

<code-group>
<code-block label="With emitted" active>

```js
cy.mount(Stepper, { props: { initial: 100 } })
cy.get(incrementSelector).click()
cy.get('@vue').should((wrapper) => {
  expect(wrapper.emitted('change')).to.have.length
  expect(wrapper.emitted('change')[0][0]).to.equal('101')
})
```

</code-block>
<code-block label="With spies">

```js
const onChangeSpy = cy.spy().as('onChangeSpy')

cy.mount(Stepper, { props: { initial: 100, onChange: onChangeSpy } })

cy.get(incrementSelector).click()
cy.get('@onChangeSpy').should('have.been.calledWith', '101')
```

</code-block>
</code-group>

Regardless of our recommendation to use spies instead of the internal Vue Test
Utils API, you may decide to continue using `emitted` as it _automatically_
records every single event emitted from the component, and so you won't have to
create a spy for every event emitted.

This auto-spying behavior could be useful for components that emit _many_ custom
events.

## Custom Mount Commands

<<<<<<<< HEAD:docs/guides/component-testing/vue/custom-mount-vue.mdx
If you used the automatic configuration option to setup your app, you'll have
the global `cy.mount()` Cypress Command available throughout your tests.
========
### Customizing `cy.mount()`
>>>>>>>> @{-1}:content/guides/component-testing/vue/examples.md

While you can use the [mount()](/guides/component-testing/vue/api#mount)
function in your tests, we recommend using [`cy.mount()`](/api/commands/mount),
which is a [custom command](/api/cypress-api/custom-commands) that is defined in
the **cypress/support/component.js** file:

<code-group>
<code-block label="cypress/support/component.js" active>

```js
import { mount } from 'cypress/vue'

Cypress.Commands.add('mount', mount)
```

</code-block>
</code-group>

This allows you to use `cy.mount()` in any test without having to import the
`mount()` function in each and every spec file.

By default, `cy.mount()` is a simple passthrough to `mount()`, however, you can
customize `cy.mount()` to fit your needs. For instance, if you are using plugins
or other global app-level setups in your Vue app, you can configure them here.

Below are a few examples that demonstrate using a custom mount command. These
examples can be adjusted for most other providers that you will need to support.

### Replicating Plugins

Most applications will have state management or routing. Both of these are Vue
plugins.

<<<<<<<< HEAD:docs/guides/component-testing/vue/custom-mount-vue.mdx
<Tabs>
<TabItem value="JavaScript" active>
========
<code-group>

<code-block label="cypress/support/component.js " active>
>>>>>>>> @{-1}:content/guides/component-testing/vue/examples.md

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

</TabItem>

<TabItem value="With JSX">

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

</TabItem>
</Tabs>

### Replicating the expected Component Hierarchy

Some Vue applications, most famously Vue apps built on top of Vuetify, require
certain components to be structured in a specific hierarchy.

All Vuetify applications require that you wrap your app in a `VApp` component
when you build it. This is an implementation detail of Vuetify, but once users
try to test components that depend on Vuetify, they get Vuetify-specific
compilation errors and quickly find out that **they need to replicate that
component hierarchy any time they need to mount a component that uses a Vuetify
component**!

Custom `cy.mount()` commands to the rescue! You may find the JSX syntax to be more
straightforward.

You'll also need to replicate the plugin setup steps from the Vuetify docs for
everything to compile.

<<<<<<<< HEAD:docs/guides/component-testing/vue/custom-mount-vue.mdx
<Tabs>
<TabItem value="JavaScript" active>
========
<code-group>

<code-block label="cypress/support/component.js" active>
>>>>>>>> @{-1}:content/guides/component-testing/vue/examples.md

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

</TabItem>

<TabItem value="With JSX">

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

</TabItem>
</Tabs>

At this point, you should be able to setup a complex application and mount
components that use all of Vue's language features.

Congrats! Happy building. 🎉

### Vue Router

To use Vue Router, create a command to register the plugin and pass in a custom
implementation of the router via the options param:

<!-- Vue 2 & 3 -->

<Tabs>
<TabItem value='Vue 3'>

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

</TabItem>

<TabItem value='Vue 2'>

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

</TabItem>
</Tabs>

<!-- TypeScript Typings -->

<Tabs>
<TabItem value="Vue 3 - TypeScript Typings" active>

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

</TabItem>

<TabItem value="Vue 2 - TypeScript Typings" active>

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

</TabItem>
</Tabs>

Usage:

<Tabs>
  <TabItem value="Vue 3 - Usage">

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

</TabItem>

  <TabItem value="Vue 2 - Usage">

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

</TabItem>
</Tabs>

### Vuex

To use a component that uses [Vuex](https://vuex.vuejs.org/), create a `mount`
command that configures a Vuex store for your component:

<!-- Vue 2 & 3 -->

<Tabs>
<TabItem value='Vue 3'>

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

</TabItem>

<TabItem value='Vue 2'>

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

</TabItem>
</Tabs>

:::info

The `getStore` method is a factory method that initializes Vuex and creates a
new store. It is important that the store be initialized with each new test to
ensure changes to the store don't affect other tests.

:::

<!-- TypeScript Typings -->

```ts title="TypeScript Typings"
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

```js title="Usage"
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

### Global Components

If you have components that are registered globally in the main application
file, set them up in your mount command so your component will render them
properly:

<Tabs>
<TabItem value='Vue 2'>

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

</TabItem>
<TabItem value='Vue 3'>

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

<<<<<<<< HEAD:docs/guides/component-testing/vue/custom-mount-vue.mdx
</TabItem>
</Tabs>
========
</template>
</code-group-vue2-vue3>
>>>>>>>> @{-1}:content/guides/component-testing/vue/examples.md
