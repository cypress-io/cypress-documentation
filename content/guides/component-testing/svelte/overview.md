---
title: 'Svelte Component Testing'
---

## Framework Support

Cypress Component Testing supports Svelte 3+ in a variety of different
frameworks:

- [Svelte with Vite](#Svelte-with-Vite)
- [Svelte with Webpack](#Svelte-with-Webpack)

## Tutorial

Visit the [Svelte Quickstart Guide](/guides/component-testing/svelte/quickstart)
for a step-by-step tutorial.

## Installation

To get up and running with Cypress Component Testing in Svelte, install Cypress
into your project:

```bash
npm i cypress -D
```

Open Cypress:

```bash
npx cypress open
```

<DocsImage 
  src="/img/guides/component-testing/select-test-type.jpg" 
  caption="Choose Component Testing"> </DocsImage>

The Cypress Launchpad will guide you through configuring your project.

For a step-by-step guide through the installation wizard, refer to the
[Configure Component Testing](/guides/component-testing/svelte/quickstart#Configuring-Component-Testing)
section of the Svelte quickstart guide.

## Usage

### What is the Mount Function?

We ship a `mount` function that is imported from the `cypress` package. It is
responsible for rendering components within Cypress's sandboxed iframe and
handling any framework-specific cleanup.

```js
import { mount } from 'cypress/svelte'
```

While you can use the `mount` function in your tests, we recommend using
[`cy.mount()`](/api/commands/mount), which is added as a
[custom command](/api/cypress-api/custom-commands) in the
**cypress/support/component.js** file:

<code-group>
<code-block label="cypress/support/component.js" active>

```ts
import { mount } from 'cypress/svelte'

Cypress.Commands.add('mount', mount)
```

</code-block>
</code-group>

This allows you to use `cy.mount()` in any component test without having to
import the framework-specific mount command, as well as customizing it to fit
your needs. For more info, visit the
[Custom Mount Commands](/guides/component-testing/svelte/examples#Custom-Mount-Commands)
section in the Svelte examples.

### Using `cy.mount()`

To mount a component with `cy.mount()`, import the component and pass it to the
method:

```ts
import { Stepper } from './stepper.svelte'

it('mounts', () => {
  cy.mount(Stepper)
})
```

### Passing Data to a Component

You can pass props to a component by setting props in the options: `cy.mount()`:

```ts
it('mounts', () => {
  cy.mount(Stepper, { props: { count: 100 } })
})
```

### Accessing the Component Instance

There might be times when you might want to access the component instance
directly in your tests. To do so, use `.then()`, which enables us to work with
the subject that was yielded from the `cy.mount()` command.

```js
cy.mount(Stepper).then(({ component }) => {
  //component is the rendered instance of Stepper
})
```

### Testing Events

To test emitted events from a Svelte component, we can use access the component
instances and use `$on` method to listen to events raised. We can also pass in a
Cypress spy so we can query the spy later for results. In the example below, we
listen to the `change` event and validate it was called as expected:

```js
it('clicking + fires a change event with the incremented value', () => {
  const changeSpy = cy.spy().as('changeSpy')
  cy.mount(Stepper).then(({ component }) => {
    component.$on('change', changeSpy)
  })
  cy.get('[data-cy=increment]').click()
  cy.get('@changeSpy').should('have.been.calledWithMatch', {
    detail: { count: 1 },
  })
})
```

## Framework Configuration

Cypress Component Testing works out of the box with [Vite](https://vitejs.dev/),
and a custom [Webpack](https://webpack.js.org/) config. Cypress will
automatically detect one of these frameworks during setup and configure them
properly. The examples below are for reference purposes.

### Svelte with Vite

Cypress Component Testing works with Svelte apps that use Vite 2+ as the
bundler.

#### Vite Configuration

<cypress-config-file>
<template #js>

```js
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  component: {
    devServer: {
      framework: 'svelte',
      bundler: 'vite',
    },
  },
})
```

</template>
<template #ts>

```ts
import { defineConfig } from 'cypress'

export default defineConfig({
  component: {
    devServer: {
      framework: 'svelte',
      bundler: 'vite',
    },
  },
})
```

</template>
</cypress-config-file>

#### Svelte Vite Sample Apps

- [Svelte 3 Vite 3 with Typescript](https://github.com/cypress-io/cypress-component-testing-apps/tree/main/svelte-vite-ts)

### Svelte with Webpack

Cypress Component Testing works with Vue apps that use Webpack 4+ as the
bundler.

#### Webpack Configuration

<cypress-config-file>
<template #js>

```js
module.exports = {
  component: {
    devServer: {
      framework: 'svelte',
      bundler: 'webpack',
      // optionally pass in webpack config
      webpackConfig: require('./webpack.config'),
      // or a function - the result is merged with the base config
      webpackConfig: async () => {
        // ... do things ...
        const modifiedConfig = await injectCustomConfig(baseConfig)
        return modifiedConfig
      },
    },
  },
}
```

</template>
<template #ts>

```ts
import { defineConfig } from 'cypress'
import webpackConfig from './webpack.config'

export default defineConfig({
  component: {
    devServer: {
      framework: 'svelte',
      bundler: 'webpack',
      // optionally pass in webpack config
      webpackConfig,
    },
  },
})
```

</template>
</cypress-config-file>

If you don't provide one, Cypress will try to infer your webpack config. If
Cypress cannot or you want to make modifications to your config, you can pass it
in manually via the `webpackConfig` option.

#### Svelte Webpack Sample Apps

- [Svelte 3 Webpack 5 with Typescript](https://github.com/cypress-io/cypress-component-testing-apps/tree/main/svelte-webpack-ts)