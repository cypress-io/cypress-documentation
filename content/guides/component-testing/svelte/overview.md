---
title: 'Svelte Component Testing'
---

## Framework Support

Cypress Component Testing supports Svelte 3+ in a variety of different
frameworks:

- [Svelte with Vite](#Svelte-with-Vite)
- [Svelte with Webpack](#Svelte-with-Webpack)

<Alert type="warning">

Svelte is currently in alpha support for component testing.

</Alert>

## Tutorial

Visit the [Svelte Quickstart Guide](/guides/component-testing/svelte/quickstart)
for a step-by-step tutorial on creating a new Svelte app and adding component
tests.

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

<Alert type="info">

For a step-by-step guide on how to create a component test, refer to the
[Svelte Quickstart](/guides/component-testing/svelte/quickstart) guide.

For usage and examples, visit the
[Svelte Examples](/guides/component-testing/svelte/examples) guide.

</Alert>

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
