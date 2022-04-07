---
title: Framework Configuration
---

Writing tests in Cypress is the same regardless of whichever UI library you
choose (React or Vue, currently). However, each framework requires a different
setup configuration.

Cypress currently supports the following frameworks for component testing:

| Framework                                 | UI Library |
| ----------------------------------------- | ---------- |
| [Create React App](#Create-React-App-CRA) | React      |
| [Next.js](#Next-js) (Alpha)               | React      |
| [React with Vite](#Vite)                  | React      |
| [React with Webpack](#Webpack)            | React      |
| [Vue CLI](#Vue-CLI)                       | Vue        |
| [Nuxt](#Nuxt) (Alpha)                     | Vue        |
| [Vue with Vite](#Vite-1)                  | Vue        |
| [Vue with Webpack](#Webpack-1)            | Vue        |

Additional frameworks can be configured using a
[Custom Dev Server Function](#Custom-Dev-Server).

## Automatic Setup

When you launch Cypress for the first time in a project and select Component
Testing, the app will automatically guide you and set up your configuration.

To get started, visit the
[installation guide](/guides/getting-started/installing-cypress#Installing) on
how to install and launch Cypress for the first time.

## Manual Setup

The rest of this guide covers configuring your project manually.

### Prerequisites

- [Install](/guides/getting-started/installing-cypress#Installing) Cypress.
- Create an empty cypress.config.js (or .ts) file at the root of your project.
- Create an empty cypress/support/component.js (or .ts) file.

Next, follow the instructions for your framework.

## React

For React apps, we have built-in support for Create React App, Next.js, Vite,
and a custom webpack config.

### Create React App (CRA)

To configure component testing for a React app that uses
[Create React App](https://create-react-app.dev/), you will need to configure a
`devServer` with a framework of `create-react-app` and a bundler of `webpack`
like so:

<cypress-config-file>
<template #js>

```js
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  component: {
    devServer: {
      framework: 'create-react-app',
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
      framework: 'create-react-app',
      bundler: 'webpack',
    },
  },
})
```

</template>
</cypress-config-file>

You can find an example Create React App project
[here](https://github.com/cypress-io/cypress-component-examples/tree/main/setup-create-react-app).

### Next.js

<Alert type="warning">

Next.js is currently in alpha support for component testing. See
[Next.js Caveats](#Nextjs-Caveats) for more info on current limitations.

</Alert>

To configure component testing for a React app that uses
[Next.js](https://nextjs.org/), you will need to configure a `devServer` with a
framework of `next` and a bundler of `webpack` like so:

<cypress-config-file>
<template #js>

```js
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  component: {
    devServer: {
      framework: 'next',
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
      framework: 'next',
      bundler: 'webpack',
    },
  },
})
```

</template>
</cypress-config-file>

You can find an example Next.js project
[here](https://github.com/cypress-io/cypress-component-examples/tree/main/setup-create-next-app).

#### Next.js Caveats

There are some specific caveats to consider when testing Next.js
[Pages](https://nextjs.org/docs/basic-features/pages) in component testing.

A page component could have additional logic in its `getServerSideProps` or
`getStaticProps` methods. These methods only run on the server, so they are not
available to run inside a component test. Trying to test a page in a component
test would result in the props being passed into the page to be undefined.

While you could pass in props directly to the page component in a component
test, that would leave these server-side methods untested. However, an
end-to-end test would execute and test a page entirely.

Because of this, we recommend using end-to-end testing over component testing
for Next.js pages and component testing for individual components in a Next.js
app.

### Vite

To configure component testing for a React app that uses
[Vite](https://vitejs.dev/), you will need to configure a `devServer` with a
framework of `react` and a bundler of `vite` like so:

<cypress-config-file>
<template #js>

```js
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  component: {
    devServer: {
      framework: 'react',
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
      framework: 'react',
      bundler: 'vite',
    },
  },
})
```

</template>
</cypress-config-file>

You can find an example React project that uses Vite
[here](https://github.com/cypress-io/cypress-component-examples/tree/main/setup-vite-react-app).

### Webpack

To configure component testing for a React app that uses a custom
[Webpack](https://webpack.js.org/) config, you will need to configure a
`devServer` with a framework of `react` and a bundler of `webpack` like so:

<cypress-config-file>
<template #js>

```js
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
      // optionally pass in webpack config
      webpackConfig: require('webpack.config'),
    },
  },
})
```

</template>
<template #ts>

```ts
import { defineConfig } from 'cypress'
import webpackConfig from 'webpack.config'

export default defineConfig({
  component: {
    devServer: {
      framework: 'react',
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

You can find an example React project that uses Webpack
[here](https://github.com/cypress-io/cypress-component-examples/tree/main/setup-webpack-react-app).

<!-- Couldn't simply call this next section "Vue" because using "## Vue" by itself killed the tabs in the code examples -->

## Vue 2 & Vue 3

For Vue apps, we have built-in support for Vue CLI, Nuxt, Vite, and a custom
webpack config.

### Vue CLI

To configure component testing for a Vue app that uses
[Vue CLI](https://cli.vuejs.org/), you will need to configure a `devServer` with
a framework of `vue-cli` and a bundler of `webpack` like so:

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

You can find an example Vue 3 CLI project
[here](https://github.com/cypress-io/cypress-component-examples/tree/main/setup-vue-cli-vue3),
and an example Vue 2 CLI project
[here](https://github.com/cypress-io/cypress-component-examples/tree/main/setup-vue-cli-vue2).

### Nuxt

<Alert type="warning">

Nuxt is currently in alpha support for component testing.

</Alert>

To configure component testing for a Vue app that uses
[Nuxt](https://nuxtjs.org/), you will need to configure a `devServer` with a
framework of `nuxt` and a bundler of `webpack` like so:

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

You can find a sample Vue Nuxt project
[here](https://github.com/cypress-io/cypress-component-examples/tree/main/setup-nuxt-vue-2).

### Vite

To configure component testing for a Vue app that uses
[Vite](https://vitejs.dev/), you will need to configure a `devServer` with a
framework of `vue` and a bundler of `vite` like so:

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

You can find an example Vue project that uses Vite
[here](https://github.com/cypress-io/cypress-component-examples/tree/main/setup-vite-vue-app).

### Webpack

To configure component testing for a Vue app that uses a custom
[Webpack](https://webpack.js.org/) config, you will need to configure a
`devServer` with a framework of `vue` and a bundler of `webpack` like so:

<cypress-config-file>
<template #js>

```js
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'webpack',
      // optionally pass in webpack config
      webpackConfig: require('webpack.config'),
    },
  },
})
```

</template>
<template #ts>

```ts
import { defineConfig } from 'cypress'
import webpackConfig from 'webpack.config'

export default defineConfig({
  component: {
    devServer: {
      framework: 'vue',
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

You can find an example Vue project that uses Webpack
[here](https://github.com/cypress-io/cypress-component-examples/tree/main/setup-webpack-vue-app).

## Component Testing Config

Below are a few additional configuration values that are specific to component
testing.

### Custom Dev Server

A custom function can be passed into the `devServer` option, which allows the
use of other dev servers not provided by Cypress out of the box. These can be
from the Cypress community, preview builds not included with the app, or a
custom one you create.

The function's signature takes in a
[Cypress Configuration](/guides/references/configuration) object as its only
parameter and returns either an instance of a `devServer` or a promise that
resolves to a `devServer` instance.

<cypress-config-file>
<template #js>

```js
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  component: {
    devServer(cypressConfig) {
      // return devServer instance or a promise that resolves to
      // a dev server here
      return {
        port: 1234,
        close: () => {},
      }
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
    devServer(cypressConfig: CypressConfiguration) {
      // return devServer instance or a promise that resolves to
      // a dev server here
      return {
        port: 1234,
        close: () => {},
      }
    },
  },
})
```

</template>
</cypress-config-file>

### Custom Index file

By default, Cypress renders your components into an HTML file located at
`cypress/support/component-index.html`.

The index file allows you to add in global assets, such as styles, fonts, and
external scripts.

You can provide an alternative path to the file using the `indexHtmlFile` option
in the `component` config options:

```js
{
  component: {
    devServer,
    indexHtmlFile: '/custom/path/to/index.html'
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
