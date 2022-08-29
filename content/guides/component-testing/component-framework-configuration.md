---
title: Framework Configuration
---

<CtBetaAlert></CtBetaAlert>

Writing tests in Cypress is the same regardless of whichever UI library you
choose (React or Vue, currently). However, each framework requires a different
setup configuration.

Cypress currently supports the following frameworks and versions for component
testing:

| Framework                                                | UI Library  | Bundler    |
| -------------------------------------------------------- | ----------- | ---------- |
| [Create React App 4+](#Create-React-App-CRA)             | React 16+   | Webpack 4+ |
| [Next.js 11+](#Next-js) <Badge type="info">Alpha</Badge> | React 16+   | Webpack 5  |
| [React with Vite](#React-with-Vite)                      | React 16+   | Vite 2     |
| [React with Webpack](#React-with-Webpack)                | React 16+   | Webpack 4+ |
| [Vue CLI](#Vue-CLI)                                      | Vue 2+      | Webpack 4+ |
| [Nuxt 2](#Nuxt) <Badge type="info">Alpha</Badge>         | Vue 2+      | Webpack 4+ |
| [Vue with Vite](#Vue-with-Vite)                          | Vue 2+      | Vite 2     |
| [Vue with Webpack](#Vue-with-Webpack)                    | Vue 2+      | Webpack 4+ |
| [Angular](#Angular) <Badge type="info">Alpha</Badge>     | Angular 13+ | Webpack 5  |

## Automatic Configuration (Recommended)

When you launch Cypress for the first time in a project and select Component
Testing, the app will automatically guide you and set up your configuration.

Cypress offers **automatic configuration** for supported front-end frameworks
and bundlers.

For first-time setup of React or Vue apps, we strongly recommend using automatic
configuration to create all of the necessary configuration files.

### Automatic Configuration Setup

You should use the Cypress Launchpad to configure Component Testing for the
first time. To start the setup wizard, simply open Cypress and choose "Component
Testing".

<!-- TODO: Video -->

```shell
cypress open
```

The Launchpad's setup wizard will do the following things:

1. Determine what changes need to be merged into your Cypress Config file.
2. Create a component support file for [configuring global styles]() and
   installing component libraries.
3. Globally register the correct `cy.mount` command based on your framework.
4. Create `component-index.html` to let you add your application's fonts and
   global CDN downloads.
5. Add any framework-specific setup to your support files.

<!-- TODO: pic of all the files we make, collapsed -->

Once you click through all of the prompts, you'll be asked to choose a browser
to continue.

<!-- TODO: start cypress, take a pic of Choose a Browser -->

## Manual Setup

The rest of this guide covers configuring your project manually.

### Prerequisites

- [Install](/guides/getting-started/installing-cypress) Cypress.
- Create an empty cypress.config.js (or .ts) file at the root of your project.
- Create an empty cypress/support/component.js (or .ts) file.

Next, follow the instructions for your framework.

## React

For React apps, we have built-in support for Create React App, Next.js, Vite,
and a custom webpack config.

### Create React App (CRA)

To configure component testing for a React app that uses
[Create React App](https://create-react-app.dev/), you will need to configure a
`devServer` with a `framework` of "create-react-app" and a `bundler` of
"webpack" like so:

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

#### Sample Create React Apps

- [CRA 4 with JavaScript](https://github.com/cypress-io/cypress-component-testing-apps/tree/main/react-cra4-js)
- [CRA 5 with TypeScript](https://github.com/cypress-io/cypress-component-testing-apps/tree/main/react-cra5-ts)

### Next.js

<Alert type="warning">

Next.js is currently in alpha support for component testing. See
[Next.js Caveats](#Next-js-Caveats) for more info on current limitations.

</Alert>

To configure component testing for a React app that uses
[Next.js](https://nextjs.org/), you will need to configure a `devServer` with a
`framework` of "next" and a `bundler` of "webpack" like so:

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

Because of this, we recommend using E2E Testing over Component Testing for
Next.js pages and Component Testing for individual components in a Next.js app.

#### Sample Next.js Apps

- [Next.js 12 with TypeScript](https://github.com/cypress-io/cypress-component-testing-apps/tree/main/react-next12-ts)

### React with Vite

To configure component testing for a React app that uses
[Vite](https://vitejs.dev/), you will need to configure a `devServer` with a
`framework` of "react" and a `bundler` of "vite" like so:

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

#### Sample React Vite Apps

- [React Vite with TypeScript](https://github.com/cypress-io/cypress-component-testing-apps/tree/main/react-vite-ts)

### React with Webpack

To configure component testing for a React app that uses a custom
[Webpack](https://webpack.js.org/) config, you will need to configure a
`devServer` with a `framework` of "react" and a `bundler` of "webpack" like so:

<cypress-config-file>
<template #js>

```js
module.exports = {
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
      // optionally pass in webpack config
      webpackConfig: require('./webpack.config'),
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

If you don't provide a webpack config, Cypress will try to infer it. If Cypress
cannot do so, or you want to make modifications to your config, you can specify
it via the `webpackConfig` option.

#### Sample React Webpack Apps

- [React Webpack 5 with JavaScript](https://github.com/cypress-io/cypress-component-testing-apps/tree/main/react-webpack5-js)

<!-- Couldn't simply call this next section "Vue" because using "## Vue" by itself killed the tabs in the code examples -->

## Vue 2 & Vue 3

For Vue apps, we have built-in support for Vue CLI, Nuxt, Vite, and a custom
webpack config.

### Vue CLI

To configure component testing for a Vue app that uses
[Vue CLI](https://cli.vuejs.org/), you will need to configure a `devServer` with
a `framework` of "vue-cli" and a `bundler` of "webpack" like so:

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

<Alert type="warning">

Nuxt is currently in alpha support for component testing.

</Alert>

To configure component testing for a Vue app that uses
[Nuxt](https://nuxtjs.org/), you will need to configure a `devServer` with a
`framework` of "nuxt" and a `bundler` of "webpack" like so:

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

To configure component testing for a Vue app that uses
[Vite](https://vitejs.dev/), you will need to configure a `devServer` with a
`framework` of "vue" and a `bundler` of "vite" like so:

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

To configure component testing for a Vue app that uses a custom
[Webpack](https://webpack.js.org/) config, you will need to configure a
`devServer` with a `framework` of "vue" and a `bundler` of "webpack" like so:

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

## Angular

For Angular apps, we have built-in support for `@angular/cli` projects.

### Angular CLI

To configure component testing for an Angular application that uses the
[Angular CLI](https://angular.io/cli), you will need to configure a `devServer`
with a `framework` of "angular", a `bundler` of "webpack" and a `specPattern`
like so:

<cypress-config-file>
<template #js>

```js
module.exports = {
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts',
  },
}
```

</template>
<template #ts>

```ts
import { defineConfig } from 'cypress'

export default defineConfig({
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts',
  },
})
```

</template>
</cypress-config-file>

#### Sample Angular Apps

- [Angular 14](https://github.com/cypress-io/cypress-component-testing-apps/tree/main/angular)

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

### Custom Index File

By default, Cypress renders your components into an HTML file located at
`cypress/support/component-index.html`.

The index file allows you to add in global assets, such as styles, fonts, and
external scripts.

You can provide an alternative path to the file using the `indexHtmlFile` option
in the [component config](/guides/references/configuration#component) options:

```js
{
  component: {
    devServer,
    indexHtmlFile: '/custom/path/to/component-index.html'
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
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}'
  }
}
```

### Additional Config

For more information on all the available configuration options, see the
[configuration reference](/guides/references/configuration).
