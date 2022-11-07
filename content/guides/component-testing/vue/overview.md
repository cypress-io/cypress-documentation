---
title: 'Vue Component Testing'
---

## Framework Support

Cypress Component Testing supports Vue 2+ with the following frameworks:

- [Vue CLI](#Vue-CLI)
- [Nuxt](#Nuxt) <Badge type="info">Beta</Badge>
- [Vue with Vite](#Vue-with-Vite)
- [Vue with Webpack](#Vue-with-Webpack)

## Tutorial

Visit the [Vue Quickstart Guide](/guides/component-testing/vue/quickstart) for a
step-by-step tutorial on creating a new Vue app and adding component tests.

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

<Alert type="info">

For a step-by-step guide on how to create a component test, refer to the
[Vue Quickstart](/guides/component-testing/vue/quickstart) guide.

For usage and examples, visit the
[Vue Examples](/guides/component-testing/vue/examples) guide.

</Alert>

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

<Alert type="warning">

Nuxt is currently in beta support for component testing.

</Alert>

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
