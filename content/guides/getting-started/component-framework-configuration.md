---
title: Framework Configuration
---

Writing tests in Cypress is the same regardless of framework choice (Vue, React,
Nuxt, Next, etc.). However, each framework requires additional setup and
configuration to run properly.

## Automatic Setup

Launching Cypress for the first time in a project will start a wizard that will
automatically guide you through setup.

To get started, visit the
[installation guide](/guides/getting-started/installing-cypress#Installing) on
how to install and launch Cypress for the first time.

## Manual Setup

The rest of this guide covers setting up and configuring your project manually.

### Prerequisites

- [Install](/guides/getting-started/installing-cypress#Installing) Cypress.
- Create an empty cypress.config.js (or .ts) file at the root of your project.
- Create an empty cypress/support/component.js (or .ts) file.

Next, follow the instructions for your framework.

## React

### Create React App (CRA)

For [Create React App](https://create-react-app.dev/), you will need to install
the Cypress React Adapter as well as the Cypress Webpack Dev Server as dev
dependencies:

<npm-or-yarn>
<template #npm>

```sh
npm install --save-dev @cypress/react @cypress/webpack-dev-server
```

</template>
<template #yarn>

```sh
yarn add -D @cypress/react @cypress/webpack-dev-server
```

</template>
</npm-or-yarn>

<Alert type="info">

<strong class="alert-header">Note</strong>

If you are using Create React App v4, additionally install
`html-webpack-plugin@4`, which works with the version of Webpack that comes with
CRAv4.

</Alert>

Next, you will need to configure component testing.

A dev server is needed to launch component testing. Cypress provides a dev
server that works with CRA out of the box. Import 'devServer' from
`@cypress/react/plugins/react-scripts`, then pass in the `devServer` to the
component configuration in the cypress config file.

Copy the following into your cypress config file:

<cypress-config-file>
<template #js>

```js
const { defineConfig } = require('cypress')
const { devServer } = require('@cypress/react/plugins/react-scripts')

module.exports = defineConfig({
  component: {
    devServer,
  },
})
```

</template>
<template #ts>

```ts
import { defineConfig } from 'cypress'
import { devServer } from '@cypress/react/plugins/react-scripts'

export default defineConfig({
  component: {
    devServer,
  },
})
```

</template>
</cypress-config-file>

You can find an example Create React App project
[here](https://github.com/cypress-io/cypress-component-examples/tree/main/setup-create-react-app).

### Next.js

For [Next.js](https://nextjs.org/), you will need to install the Cypress React
Adapter as well as the Cypress Webpack Dev Server as dev dependencies:

<npm-or-yarn>
<template #npm>

```sh
npm install --save-dev @cypress/react @cypress/webpack-dev-server
```

</template>
<template #yarn>

```sh
yarn add -D @cypress/react @cypress/webpack-dev-server
```

</template>
</npm-or-yarn>

<Alert type="info">

<strong class="alert-header">Note</strong>

If you are using a version of Next.js that uses WebPack v4 (before Next.js v11),
also install `html-webpack-plugin@4`, which works with Webpack 4.

</Alert>

A dev server is needed to launch component testing. Cypress provides a dev
server that works with Next.js out of the box. Import 'devServer' from
`@cypress/react/plugins/next`, then pass in the `devServer` to the component
configuration in the cypress config file.

Copy the following into your cypress config file:

<cypress-config-file>
<template #js>

```js
const { defineConfig } = require('cypress')
const { devServer } = require('@cypress/react/plugins/next')

module.exports = defineConfig({
  component: {
    devServer,
  },
})
```

</template>
<template #ts>

```ts
import { defineConfig } from 'cypress'
import { devServer } from '@cypress/react/plugins/next'

export default defineConfig({
  component: {
    devServer,
  },
})
```

</template>
</cypress-config-file>

<Alert type="warning">

<strong class="alert-header">Caveats</strong>

There are some Next.js specific caveats due to its server-side architecture
relating to `getInitialProps` and `getStaticProps`.
[Learn more here](https://github.com/cypress-io/cypress/tree/develop/npm/react/examples/nextjs#server-side-props).

</Alert>

You can find an example Next.js project
[here](https://github.com/cypress-io/cypress-component-examples/tree/main/setup-create-next-app).

### Vite

For React projects that use [Vite](https://vitejs.dev/), you will need to
install the Cypress React Adapter as well as the Cypress Vite Dev Server as dev
dependencies:

<npm-or-yarn>
<template #npm>

```sh
npm install --save-dev @cypress/react @cypress/vite-dev-server
```

</template>
<template #yarn>

```sh
yarn add -D @cypress/react @cypress/vite-dev-server
```

</template>
</npm-or-yarn>

A dev server is needed to launch component testing. Cypress provides a dev
server that works with Vite out of the box. Import 'devServer' from
`@cypress/vite-dev-server`, then pass in the `devServer` to the component
configuration in the cypress config file.

Copy the following into your cypress config file:

<cypress-config-file>
<template #js>

```js
const { defineConfig } = require('cypress')
const { devServer } = require('@cypress/vite-dev-server')

module.exports = defineConfig({
  component: {
    devServer,
  },
})
```

</template>
<template #ts>

```ts
import { defineConfig } from 'cypress'
import { devServer } from '@cypress/vite-dev-server'

export default defineConfig({
  component: {
    devServer,
  },
})
```

</template>
</cypress-config-file>

You can find an example React project that uses Vite
[here](https://github.com/cypress-io/cypress-component-examples/tree/main/setup-vite-react-app).

<!-- Couldn't simply call this section "Vue" because using "## Vue" by itself killed the tabs in the code examples -->

## Vue 2 & Vue 3

### Vue CLI

For [Vue CLI](https://cli.vuejs.org/) projects, you will need to install the
Cypress Vue adapter and the Cypress Webpack Dev Server as dev dependencies.

The version of the Cypress Vue adapter you need depends on the version of Vue
you are using.

For Vue 3, install the latest `@cypress/vue` package:

<npm-or-yarn>
<template #npm>

```sh
npm install --save-dev @cypress/vue @cypress/webpack-dev-server
```

</template>
<template #yarn>

```sh
yarn add -D @cypress/vue @cypress/webpack-dev-server
```

</template>
</npm-or-yarn>

For Vue 2, install the `@cypress/vue@2` package:

<npm-or-yarn>
<template #npm>

```sh
npm install --save-dev @cypress/vue@2 @cypress/webpack-dev-server
```

</template>
<template #yarn>

```sh
yarn add -D @cypress/vue@2 @cypress/webpack-dev-server
```

</template>
</npm-or-yarn>

<Alert type="info">

<strong class="alert-header">Note</strong>

If you are using a version of Vue CLI before v5, additionally install
`html-webpack-plugin@4`, which works with the version of Webpack that comes with
Vue CLI before v5.

</Alert>

A dev server is needed to launch component testing. Import 'devServer' from
`@cypress/webpack-dev-server`, then pass in the `devServer` to the component
configuration in the cypress config file.

You will also need to pass the Webpack config that Vue CLI uses to the dev
server. To do so, import the config from `@vue/cli-service/webpack.config` and
pass it into `devServerConfig`.

Copy the following into your cypress config file:

<cypress-config-file>
<template #js>

```js
const { defineConfig } = require('cypress')
const { devServer } = require('@cypress/webpack-dev-server')
const webpackConfig = require('@vue/cli-service/webpack.config')

module.exports = defineConfig({
  component: {
    devServer,
    devServerConfig: {
      webpackConfig,
    },
  },
})
```

</template>
<template #ts>

```ts
import { defineConfig } from 'cypress'
import { devServer } from '@cypress/webpack-dev-server'
import webpackConfig from '@vue/cli-service/webpack.config'

export default defineConfig({
  component: {
    devServer,
    devServerConfig: {
      webpackConfig,
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

You can find an example Vue 3 CLI project
[here](https://github.com/cypress-io/cypress-component-examples/tree/main/setup-vue-cli-vue3),
and an example Vue 2 CLI project
[here](https://github.com/cypress-io/cypress-component-examples/tree/main/setup-vue-cli-vue2).

### Nuxt

[Nuxt](https://nuxtjs.org/) uses Vue 2 and Webpack 4 under the hood, so you will
need to install the Cypress Webpack Dev Server and Vue 2 adapter, as well as
some dev dependencies:

<npm-or-yarn>
<template #npm>

```sh
npm install --save-dev cypress @cypress/vue@2 @cypress/webpack-dev-server html-webpack-plugin@4
```

</template>
<template #yarn>

```sh
yarn add -D cypress @cypress/vue@2 @cypress/webpack-dev-server html-webpack-plugin@4
```

</template>
</npm-or-yarn>

<Alert type="info">

<strong class="alert-header">Note</strong>

`html-webpack-plugin@4` is required because the projects created with Nuxt v2
use Webpack v4.

</Alert>

A dev server is needed to launch component testing. Import 'devServer' from
`@cypress/webpack-dev-server`, then pass in the `devServer` to the component
configuration in the cypress config file.

You will also need to pass the Webpack config Nuxt uses to the dev server. To do
so, import `getWebpackConfig` from `nuxt` and pass it into `devServerConfig`.

Copy the following into your cypress config file:

<cypress-config-file>
<template #js>

```js
const { defineConfig } = require('cypress')
const { devServer } = require('@cypress/webpack-dev-server')
const { getWebpackConfig } = require('nuxt')

module.exports = defineConfig({
  component: {
    devServer: async (cypressDevServerConfig) => {
      const webpackConfig = await getWebpackConfig()
      return devServer(cypressDevServerConfig, { webpackConfig })
    },
  },
})
```

</template>
<template #ts>

```ts
import { defineConfig } from 'cypress'
import { devServer } from '@cypress/webpack-dev-server'
import { getWebpackConfig } from 'nuxt'

export default defineConfig({
  component: {
    devServer: async (cypressDevServerConfig: Cypress.DevServerConfig) => {
      const webpackConfig = await getWebpackConfig()
      return devServer(cypressDevServerConfig, { webpackConfig })
    },
  },
})
```

</template>
</cypress-config-file>

Notice that the call to `getWebpackConfig` returns a promise. We can load the
`devServer` asynchronously by wrapping the call to `devServer` in an async
function and passing the `devServerConfig` as the second param into it.

You can find a sample Vue Nuxt project
[here](https://github.com/cypress-io/cypress-component-examples/tree/main/setup-nuxt-vue-2).

### Vite

For Vue projects that use [Vite](https://vitejs.dev/), you will need to install
the Cypress Vue Adapter as well as the Cypress Vite Dev Server as dev
dependencies:

<npm-or-yarn>
<template #npm>

```sh
npm install --save-dev @cypress/vue @cypress/vite-dev-server
```

</template>
<template #yarn>

```sh
yarn add -D @cypress/vue @cypress/vite-dev-server
```

</template>
</npm-or-yarn>

A dev server is needed to launch component testing. Cypress provides a dev
server that works with Vite out of the box. Import 'devServer' from
`@cypress/vite-dev-server`, then pass in the `devServer` to the component
configuration in the cypress config file.

Copy the following into your cypress config file:

<cypress-config-file>
<template #js>

```js
const { defineConfig } = require('cypress')
const { devServer } = require('@cypress/vite-dev-server')

module.exports = defineConfig({
  component: {
    devServer,
  },
})
```

</template>
<template #ts>

```ts
import { defineConfig } from 'cypress'
import { devServer } from '@cypress/vite-dev-server'

export default defineConfig({
  component: {
    devServer,
  },
})
```

</template>
</cypress-config-file>

You can find an example Vue project that uses Vite
[here](https://github.com/cypress-io/cypress-component-examples/tree/main/setup-vite-vue-app).

## Component Testing Config

Below are a few additional configuration values that are specific to component
testing.

### Custom Index file

By default, Cypress renders your components into an HTML file located at
`cypress/support/component-index.html`

The index file allows you to add in global assets, such as styles, fonts, and
external scripts.

You can provide an alternative path to the file using the `indexHtmlFile` option
in `devServerConfig`:

```js
{
  component: {
    devServer,
    devServerConfig: {
      indexHtmlFile: '/custom/path/to/index.html'
    }
  }
}
```

### Spec Pattern for Component Tests

By default, Cypress looks for spec files anywhere in your project with an
extension of `.cy.js`, `.cy.jsx`, `.cy.ts`, or `.cy.tsx`. However, you can
change this behavior for component tests with a custom `specPattern` value. In
the following example, we've configured Cypress to look for spec files with
those same extensions, but only in the `src` folder or any of its
subdirectories.

```js
{
  component: {
    devServer,
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}'
  }
}
```

### Additional Config

For more information on all the available configuration options, see
[configuration reference](/guides/references/configuration).
