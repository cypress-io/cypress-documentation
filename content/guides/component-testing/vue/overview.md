---
title: 'Vue Component Testing'
---

## Framework Support

Cypress Component Testing supports Vue 2+ with the following frameworks:

- [Vue CLI](#Vue-CLI)
- [Nuxt](#Nuxt)
- [Vue with Vite](#Vue-with-Vite)
- [Vue with Webpack](#Vue-with-Webpack)

## Tutorial

Visit the [Vue Quickstart Guide](/guides/component-testing/vue/quickstart) for a
step-by-step tutorial.

## Installation

To get up and running with Cypress Component Testing in Vue, install Cypress
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
[Configure Component Testing](/guides/component-testing/vue/quickstart#Configuring-Component-Testing)
section of the Vue quickstart guide.

## Usage

### What is the Mount Function?

We ship a `mount` function that is imported from the `cypress` package. It is
responsible for rendering components within Cypress's sandboxed iframe and
handling any framework-specific cleanup.

```ts
//Vue 3
import { mount } from 'cypress/vue'
//Vue 2
import { mount } from 'cypress/vue2'
```

While you can use the `mount` function in your tests, we recommend using
[`cy.mount()`](/api/commands/mount), which is added as a
[custom command](/api/cypress-api/custom-commands) in the
**cypress/support/component.js** file:

<code-group>
<code-block label="cypress/support/component.js" active>

```ts
import { mount } from 'cypress/vue'

Cypress.Commands.add('mount', mount)
```

</code-block>
</code-group>

This allows you to use `cy.mount()` in any component test without having to
import the framework-specific mount command, as well as customizing it to fit
your needs. For more info, visit the
[Custom Mount Commands](/guides/component-testing/vue/examples#Custom-Mount-Commands)
section in the Vue examples.

### Using `cy.mount()`

To mount a component with `cy.mount()`, import the component and pass it to the
method:

```ts
import { Stepper } from './Stepper.vue'

it('mounts', () => {
  cy.mount(Stepper)
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

### Passing Data to a Component

You can pass props and events to a component by setting `props` in the options:

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

## Framework Configuration

Cypress Component Testing works out of the box with
[Vue CLI](https://cli.vuejs.org/), [Nuxt](https://nuxtjs.org/),
[Vite](https://vitejs.dev/), and a custom [Webpack](https://webpack.js.org/)
config. Cypress will automatically detect one of these frameworks during setup
and configure them properly. The examples below are for reference purposes.

### Vue CLI

Cypress Component Testing works with Vue CLI.

#### Vue CLI Configuration

<cypress-config-file>
<template #js>

```js
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  component: {
    devServer: {
      framework: 'vue-cli',
      bundler: 'webpack',
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
      framework: 'vue-cli',
      bundler: 'webpack',
    },
  },
})
```

</template>
</cypress-config-file>

<Alert type="warning">

<strong class="alert-header">PWA Caveat</strong>

If you use the Vue CLI's PWA feature, there is a known caveat regarding
configuration. See
[here](https://github.com/cypress-io/cypress/issues/15968#issuecomment-819170918)
for more information.

</Alert>

#### Sample Vue CLI Apps

- [Vue 3 CLI 5 with TypeScript](https://github.com/cypress-io/cypress-component-testing-apps/tree/main/vue3-cli5-ts)
- [Vue 2 CLI 4 with JavaScript](https://github.com/cypress-io/cypress-component-testing-apps/tree/main/vue2-cli4-js)

### Nuxt

Cypress Component Testing works with Nuxt 2. Nuxt 3 is not yet supported.

#### Nuxt Configuration

<cypress-config-file>
<template #js>

```js
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  component: {
    devServer: {
      framework: 'nuxt',
      bundler: 'webpack',
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
      framework: 'nuxt',
      bundler: 'webpack',
    },
  },
})
```

</template>
</cypress-config-file>

#### Nuxt Sample Apps

- [Vue 2 Nuxt 2 with JavaScript](https://github.com/cypress-io/cypress-component-testing-apps/tree/main/vue2-nuxt2-js)

### Vue with Vite

Cypress Component Testing works with Vue apps that use Vite 2+ as the bundler.

#### Vite Configuration

<cypress-config-file>
<template #js>

```js
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  component: {
    devServer: {
      framework: 'vue',
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
      framework: 'vue',
      bundler: 'vite',
    },
  },
})
```

</template>
</cypress-config-file>

#### Vue Vite Sample Apps

- [Vue 3 Vite with TypeScript](https://github.com/cypress-io/cypress-component-testing-apps/tree/main/vue2-nuxt2-js)

### Vue with Webpack

Cypress Component Testing works with Vue apps that use Webpack 4+ as the
bundler.

#### Webpack Configuration

<cypress-config-file>
<template #js>

```js
module.exports = {
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'webpack',
      // optionally pass in webpack config
      webpackConfig: require('./webpack.config'),
      // or a function - the result is merged with any
      // webpack.config that is found
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
      framework: 'vue',
      bundler: 'webpack',
      // optionally pass in webpack config
      webpackConfig,
      webpackConfig: async () => {
        // ... do things ...
        const modifiedConfig = await injectCustomConfig(baseConfig)
        return modifiedConfig
      },
    },
  },
})
```

</template>
</cypress-config-file>

If you don't provide one, Cypress will try to infer your webpack config. If
Cypress cannot or you want to make modifications to your config, you can pass it
in manually via the `webpackConfig` option.

#### Vue Webpack Sample Apps

- [Vue 3 Webpack 5 with TypeScript](https://github.com/cypress-io/cypress-component-testing-apps/tree/main/vue3-webpack-ts)
