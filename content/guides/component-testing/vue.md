---
title: Vue
containerClass: component-testing
---

Testing your Vue components with Cypress is a great alternative to using Jest. The Cypress Component Test Runner is actually built by the maintainers of @vue/test-utils who work at Cypress full time. Cypress is invested in first-class support for the Vue ecosystem.

The Vue framework adapter for Cypress is a thin wrapper around @vue/test-utils and follows the same syntax. This should make learning, writing, and migrating existing tests as painless as possible.

# Writing component tests

Any component test starts by mounting your component. To do this, you'll use the mount function exported by @cypress/vue. After your component is mounted, you'll use Cypress's API to find, interact, and assert on your component's behavior.

The Cypress API and commands are almost identical between end-to-end and component tests. If you already know Cypress, you know _almost_ everything necessary for getting started with component testing. The only new concept to learn is how to mount your component.

If you have already been using Vue's official Vue Test Utils for testing, the mount command is identical. See the below examples for how to mount common types of components.

## Your first test

The `@cypress/vue` library exposes a mount function. This is the main function you'll use to mount your component. The first argument of the mount function is a component definition. This can be a self-contained string template or a Single File Component.

### Mounting basic components

Below are two examples of mounting simple, presentational Vue components and asserting on the text within them.

<code-group>
  <code-block label="Simple">

```js
import { mount } from '@cypress/vue'

it('renders my component', () => {
  const HelloWorld = {
    template: `<h1>Hello world!</h1>`,
  }

  mount(HelloWorld).get('h1').contains('Hello')
})
```

  </code-block>

  <code-block label="SFC">

```js
import { mount } from '@cypress/vue'
import HelloWorld from './HelloWorld.vue'

it('renders my component', () => {
  mount(HelloWorld).get('h1').contains('Hello')
})
```

  </code-block>
</code-group>

## Installation

The main difference between Cypress component testing and test runners like Jest is that Cypress is dev-server based. Cypress utilizes your existing dev-server configuration, whether that's Vue CLI, Webpack, or Vite\*.

- Experimental

Because Vue CLI is webpack-based, it relies on the [@cypress/webpack-dev-server]() package.

<code-group>
  <code-block label="Vue 2" active>

```sh
yarn add @cypress/vue@2 @cypress/webpack-dev-server cypress -D
```

  </code-block>

  <code-block label="Vue 3">

```sh
yarn add @cypress/vue@3 @cypress/webpack-dev-server cypress -D
```

  </code-block>
</code-group>

### Compatibility with vue-cli-plugin-e2e-cypress

We require Cypress version >= 7.0.0. Vue CLI does not ship this by default because Cypress releases breaking changes at a quicker pace than Vue CLI does major version upgrades. It is recommended that you uninstall `vue-cli-plugin-e2e-cypress` in favor of the following instructions:

#### Cypress Component Testing + End-to-end

For a project that contains both Cypress component testing _and_ end-to-end tests, you'll have an additional step to start your webapp before launching Cypress.

```sh
# End-to-end packages
yarn add cypress start-server-and-test -D
yarn start-server-and-test serve test:e2e
```

After you've removed the Vue CLI plugin and installed the latest Cypress package, you can proceed with the component testing setup instructions.

<code-group>
  <code-block label="Component Testing">

yarn add cypress
</code-block>

  <code-block label="End-to-end + Component Testing">

yarn start-server-and-test cypress -D

  </code-block>
</code-group>

### Boilerplates and examples

### Additional Help

For further information and guidance with finding, interacting, and asserting on your components, please read the general Cypress documentation.

If you need help with mounting your component, please refer to the Vue Test Utils documentation for Vue 2 or Vue 3. The @cypress/vue library is a thin wrapper around Vue Test Utils, and most guides for Vue Test Utils are applicable to Cypress component tests.

For help with Webpack or Vite, please find us in our Discord server or open a Github issue.

### Interacting with a component

Cypress's driver is responsible for finding elements, triggering events, and making DOM assertions.

We support the following versions :

- Vue 3
- Vue 2
- Vue 2 + Composition API

Please see the specific sections for each version. We depend on @vue/test-utils and increment our major versions when it does.

# General

This package is a thin wrapper around @vue/test-utils and the API is largely the same. If you are using @cypress/vue@2, you can rely on the Vue Test Utils documentation here for the majority of the mounting options. In the same vein, you can rely on
