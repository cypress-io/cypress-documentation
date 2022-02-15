---
title: Framework Configuration
---

Cypress component tests are written and behave the same regardless of framework
choice (Vue, React, Nuxt, Next); however, some frameworks require additional
configuration to work correctly.

All the example projects described in this page can be found
[here](https://github.com/cypress-io/cypress-component-examples).

## React (Create React App)

This guide assumes you've created your app using
[Create React App](https://create-react-app.dev/docs/documentation-intro). You
can find an example project
[here](https://github.com/cypress-io/cypress-component-examples/tree/main/create-react-app).

Once you have a React project, you'll also need to install the Cypress Webpack
Dev Server and React adapter, as well as some devDependencies:

```sh
npm install --save-dev cypress @cypress/react @cypress/webpack-dev-server html-webpack-plugin@4
```

<Alert type="info">

<strong class="alert-header">Note</strong>

`html-webpack-plugin@4` is required because the projects created with Create
React App use Webpack v4.

</Alert>

Configure the dev server to use the same Webpack configuration used by Create
React App. You can do this using the `react-scripts` plugin provided by the
`@cypress/react` module.

By default, Cypress looks for spec files anywhere in your project with an
extension of either `.cy.js`, `.cy.jsx`, `.cy.ts`, or `.cy.tsx`. However, you
can change this behavior with a custom `specPattern` value. In the following
example, we've configured Cypress to look for spec files with those same
extensions, but only in the `src` folder or any of its subdirectories.

:::cypress-config-plugin-example

```js
const { devServer } = require('@cypress/react/plugins/react-scripts')
```

```js
{
  component: {
    devServer,
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}'
  }
}
```

```json
{
  "component": {
    "specPattern": "src/**/*.cy.{js,jsx,ts,tsx}"
  }
}
```

```js
const injectDevServer = require('@cypress/react/plugins/react-scripts')

module.exports = (on, config) => {
  injectDevServer(on, config)
  return config
}
```

:::

Now add a test. We will replace the default test (using Testing Library) with
one using Cypress:

```jsx
// src/App.cy.js

import React from 'react'
import { mount } from '@cypress/react'
import App from './App'

it('renders learn react link', () => {
  mount(<App />)
  cy.get('a').contains('Learn React')
})
```

Start Cypress with `npx cypress open --component` - the Cypress App will open.
Select your test to execute it and see the rendered output. You can also run the
tests without opening a browser with `npx cypress run --component`.

## Vue (Vue CLI)

Cypress works with both Vue 2 and Vue 3. The configuration is almost identical.

### Vue 2 (Vue CLI)

This guide assumes you've created your app using the
[Vue CLI](https://cli.vuejs.org/). This documentation was written using Vue CLI
v4.5.12. You can find an example project
[here](https://github.com/cypress-io/cypress-component-examples/tree/main/vue-cli-vue-2-cypress).

You'll also need to install the Cypress Webpack Dev Server and Vue 2 adapter, as
well as some devDependencies:

```sh
npm install --save-dev cypress @cypress/vue@2 @cypress/webpack-dev-server html-webpack-plugin@4
```

<Alert type="info">

<strong class="alert-header">Note</strong>

`html-webpack-plugin@4` is required because the projects created with the Vue
CLI v4 use Webpack v4. If you are using Vue CLI v5 (currently in alpha) you will
need `html-webpack-plugin@5` instead.

</Alert>

Configure the dev server to use the same Webpack configuration used by Vue CLI.
You can do this using the plugin provided by the `@cypress/webpack-dev-server`
module.

By default, Cypress looks for spec files anywhere in your project with an
extension of either `.cy.js`, `.cy.jsx`, `.cy.ts`, or `.cy.tsx`. However, you
can change this behavior with a custom `specPattern` value. In the following
example, we've configured Cypress to look for spec files with those same
extensions, but only in the `src` folder or any of its subdirectories.

:::cypress-config-plugin-example

```js
const { startDevServer } = require('@cypress/webpack-dev-server')
const webpackConfig = require('@vue/cli-service/webpack.config')
```

```js
{
  component: {
    devServer(cypressDevServerConfig) {
      return startDevServer({
        options: cypressDevServerConfig,
        webpackConfig,
      })
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}'
  }
}
```

```json
{
  "component": {
    "specPattern": "src/**/*.cy.{js,jsx,ts,tsx}"
  }
}
```

```js
const { startDevServer } = require('@cypress/webpack-dev-server')
const webpackConfig = require('@vue/cli-service/webpack.config')

module.exports = (on, config) => {
  on('dev-server:start', (options) => {
    return startDevServer({
      options,
      webpackConfig,
    })
  })
}
```

:::

<Alert type="warning">

<strong class="alert-header">PWA Caveat</strong>

If you are using the Vue CLI's PWA feature, there is a known caveat regarding
configuration. See
[here](https://github.com/cypress-io/cypress/issues/15968#issuecomment-819170918)
for more information.

</Alert>

Now add a test:

```jsx
// src/components/HelloWorld.cy.js

import { mount } from '@cypress/vue'
import HelloWorld from './HelloWorld.vue'

it('renders a message', () => {
  mount(HelloWorld, {
    propsData: {
      msg: 'Hello Cypress!',
    },
  })

  cy.get('h1').contains('Hello Cypress!')
})
```

Start Cypress with `npx cypress open --component` - the Cypress App will open.
Select your test to execute it and see the rendered output. You can also run the
tests without opening a browser with `npx cypress run --component`.

### Vue 3 (Vue CLI)

The installation and configuration is the same as Vue 2 with the Vue CLI as
described above. The only difference is the Vue adapter should be installed
using `npm install @cypress/vue`. `@cypress/vue@2` targets Vue 2, and the
`latest` release targets Vue 3.

You can find an example project
[here](https://github.com/cypress-io/cypress-component-examples/tree/main/vue-cli-vue-3-cypress).

## Next.js

It's possible to use Cypress with the latest version of Next.js, which uses
Webpack 4, as well as with Webpack 5 via `next.config.js` with `webpack5: true`.
You can find an example project
[here](https://github.com/cypress-io/cypress-component-examples/tree/main/nextjs-webpack-4).

### Next.js (Webpack 4)

This guide assumes you've created your app using the
[`create-next-app`](https://nextjs.org/docs/api-reference/create-next-app) tool.
Although Next.js is webpack based, it doesn't have it as a direct dependency, so
you'll need to install it. You'll also need to install the cypress webpack dev
server and react adapter:

```sh
npm install --save-dev cypress @cypress/webpack-dev-server @cypress/react html-webpack-plugin@4 webpack@4 webpack-dev-server@3
```

<Alert type="info">

<strong class="alert-header">Note</strong>

Note we are installing `html-webpack-plugin@4` and `webpack@4`. Those are the
versions that correspond to the current version of Next.js.

</Alert>

Configure the dev server to use the same Webpack configuration used by Next.js.
You can do this using the `next` plugin provided by the `@cypress/react` module.

By default, Cypress looks for spec files anywhere in your project with an
extension of either `.cy.js`, `.cy.jsx`, `.cy.ts`, or `.cy.tsx`. However, you
can change this behavior with a custom `specPattern` value. In the following
example, we've configured Cypress to look for spec files with those same
extensions, but only in the `pages` and `components` folders or any of their
subdirectories.

:::cypress-config-plugin-example

```js
const { devServer } = require('@cypress/react/plugins/next')
```

```js
{
  component: {
    devServer,
    specPattern: '{pages,components}/**/*.cy.{js,jsx,ts,tsx}'
  }
}
```

```json
{
  "component": {
    "specPattern": "{pages,components}/**/*.cy.{js,jsx,ts,tsx}"
  }
}
```

```js
const injectDevServer = require('@cypress/react/plugins/next')

module.exports = (on, config) => {
  injectDevServer(on, config)
  return config
}
```

:::

Now add a test:

```jsx
// pages/IndexPage.cy.jsx

import React from 'react'
import { mount } from '@cypress/react'
import IndexPage from './index'

it('Renders page component', () => {
  mount(<IndexPage />)
  cy.contains('Welcome to Next.js')
})
```

Start Cypress with `npx cypress open --component` - the Cypress App will open.
Select your test to execute it and see the rendered output. You can also run the
tests without opening a browser with `npx cypress run --component`.

<Alert type="warning">

<strong class="alert-header">Caveats</strong>

There are some Next.js specific caveats due to its server side architecture
relating to `getInitialProps` and `getStaticProps`.
[Learn more here](https://github.com/cypress-io/cypress/tree/develop/npm/react/examples/nextjs#server-side-props).

</Alert>

### Next.js (Webpack 5)

You can also use Cypress component testing with Next.js and Webpack 5. The
process is the same as with Webpack 4, described above, with a few key
differences.

In your `next.config.js`, tell Next.js to use webpack 5:

```js
module.exports = {
  future: {
    webpack5: true,
  },
}
```

Finally, ensure you install Webpack 5 and the corresponding HTMLWebpackPlugin
version:

```sh
npm install --save-dev cypress @cypress/webpack-dev-server @cypress/react html-webpack-plugin@5 webpack@5 webpack-dev-server@3
```

Everything else is the same as configuring Cypress with Next.js and Webpack 4.

## Nuxt

This guide assumes you've created your app using the [`create-nuxt-app`]. You
can find the completed example project
[here](https://github.com/cypress-io/cypress-component-examples/tree/main/nuxt-vue-2-cypress).

Nuxt uses Vue 2 and Webpack under the hood, so you also need to install the
Cypress Webpack Dev Server and Vue 2 adapter, as well as some devDependencies:

```sh
npm install --save-dev cypress @cypress/vue@2 @cypress/webpack-dev-server html-webpack-plugin@4
```

<Alert type="info">

<strong class="alert-header">Note</strong>

`html-webpack-plugin@4` is required because the projects created with the Vue
CLI v4 use Webpack v4.

</Alert>

Configure the dev server to use the same Webpack configuration used by Nuxt. You
can do this using the plugin provided by the `@cypress/webpack-dev-server`
module.

By default, Cypress looks for spec files anywhere in your project with an
extension of either `.cy.js`, `.cy.jsx`, `.cy.ts`, or `.cy.tsx`. However, you
can change this behavior with a custom `specPattern` value. In the following
example, we've configured Cypress to look for spec files with those same
extensions, but only in the `pages` and `components` folders or any of their
subdirectories.

While it's possible to mount components in the `pages` directory, generally you
will want to be more granular with your component tests - full page tests are
best implemented with Cypress e2e runner.

:::cypress-config-plugin-example

```js
const { startDevServer } = require('@cypress/webpack-dev-server')
const { getWebpackConfig } = require('nuxt')
```

```js
{
  component: {
    async devServer(cypressDevServerConfig) {
      const webpackConfig = await getWebpackConfig()
      return startDevServer({
        options: cypressDevServerConfig,
        webpackConfig,
      })
    },
    specPattern: '{pages,components}/**/*.cy.{js,jsx,ts,tsx}'
  }
}
```

```json
{
  "component": {
    "specPattern": "{pages,components}/**/*.cy.{js,jsx,ts,tsx}"
  }
}
```

```js
const { startDevServer } = require('@cypress/webpack-dev-server')
const { getWebpackConfig } = require('nuxt')

module.exports = (on, config) => {
  on('dev-server:start', async (options) => {
    const webpackConfig = await getWebpackConfig()
    return startDevServer({
      options,
      webpackConfig,
    })
  })
}
```

:::

Now add a component:

```html
<!-- components/mountains.vue -->

<template>
  <p v-if="$fetchState.pending">Fetching mountains...</p>
  <p v-else-if="$fetchState.error">An error occurred :(</p>
  <div v-else>
    <h1>Nuxt Mountains</h1>
    <ul>
      <li v-for="mountain of mountains">{{ mountain.title }}</li>
    </ul>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        mountains: [],
      }
    },
    async fetch() {
      this.mountains = await fetch(
        'https://api.nuxtjs.dev/mountains'
      ).then((res) => res.json())
    },
  }
</script>
```

And a test:

```js
// components/mountains.cy.js

import { mount } from '@cypress/vue'
import Mountains from './mountains.vue'

describe('Mountains', () => {
  it('shows a load state', () => {
    mount(Mountains, {
      mocks: {
        $fetchState: {
          pending: true,
        },
      },
    })

    cy.get('p').contains('Fetching mountains...')
  })

  it('shows a failed state', () => {
    mount(Mountains, {
      mocks: {
        $fetchState: {
          error: true,
        },
      },
    })

    cy.get('p').contains('An error occurred :(')
  })

  it('shows a failed state', () => {
    mount(Mountains, {
      data() {
        return {
          mountains: [{ title: 'Mt Everest' }],
        }
      },
      mocks: {
        $fetchState: {},
      },
    })

    cy.get('li').contains('Mt Everest')
  })
})
```

Because Cypress mounts components in isolation, Nuxt specific APIs are generally
_not_ applied. In this example, the `fetch` hook is not automatically applied,
so we used the `mocks` mounting option to specify the three component states
(loading, error and success) and test each one in isolation.

Start Cypress with `npx cypress open --component` - the Cypress App will open.
Select your test to execute it and see the rendered output. You can also run the
tests without opening a browser with `npx cypress run --component`.

## Vite Based Projects (Vue, React)

Cypress also ships a Vite based dev server, as opposed to a Webpack based on
like the other examples on this page. This example uses a Vite project with
React, created via `npm init @vitejs/app my-react-app -- --template react`. The
configuration instructions are the same for Vue. There is an example React
project
[here](https://github.com/cypress-io/cypress-component-examples/tree/main/vite-react)
and a Vue project
[here](https://github.com/cypress-io/cypress-component-examples/tree/main/vite-vue).

Configure the dev server using the plugin provided by the
`@cypress/vite-dev-server` module.

By default, Cypress looks for spec files anywhere in your project with an
extension of either `.cy.js`, `.cy.jsx`, `.cy.ts`, or `.cy.tsx`. However, you
can change this behavior with a custom `specPattern` value. In the following
example, we've configured Cypress to look for spec files with those same
extensions, but only in the `src` folder or any of its subdirectories.

:::cypress-config-plugin-example

```js
const { startDevServer } = require('@cypress/vite-dev-server')
```

```js
{
  component: {
    devServer(cypressDevServerConfig) {
      return startDevServer({
        options: cypressDevServerConfig
      })
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}'
  }
}
```

```json
{
  "component": {
    "specPattern": "src/**/*.cy.{js,jsx,ts,tsx}"
  }
}
```

```js
const { startDevServer } = require('@cypress/vite-dev-server')

module.exports = (on, config) => {
  on('dev-server:start', (options) => {
    return startDevServer({ options })
  })
}
```

:::

Now add a test:

```jsx
// src/App.cy.jsx

import React from 'react'
import { mount } from '@cypress/react'
import App from './App'

it('renders learn react link', () => {
  mount(<App />)
  cy.get('a').contains('Learn React')
})
```

Start Cypress with `npx cypress open --component` - the Cypress App will open.
Select your test to execute it and see the rendered output. You can also run the
tests without opening a browser with `npx cypress run --component`.
