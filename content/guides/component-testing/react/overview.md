---
title: 'React Component Testing'
---

## Framework Support

Cypress Component Testing currently supports React 16+ with the following
frameworks:

- [Create React App](#Create-React-App-CRA)
- [Next.js](#Next-js)
- [React with Vite](#React-with-Vite)
- [React with Webpack](#React-with-Webpack)

## Tutorial

Visit the [React Quickstart Guide](/guides/component-testing/react/quickstart)
for a step-by-step tutorial.

## Installation

To get up and running with Cypress Component Testing in React, install Cypress
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
[Configure Component Testing](/guides/component-testing/react/quickstart#Configuring-Component-Testing)
section of the React quickstart guide.

## Usage

### What is the Mount Function?

We ship a `mount` function that is imported from the `cypress` package. It is
responsible for rendering components within Cypress's sandboxed iframe and
handling any framework-specific cleanup.

```js
// React 18
import { mount } from 'cypress/react18'

// React 16, 17
import { mount } from 'cypress/react'
```

While you can use the `mount` function in your tests, we recommend using
[`cy.mount()`](/api/commands/mount), which is added as a
[custom command](/api/cypress-api/custom-commands) in the
**cypress/support/component.js** file:

<code-group>
<code-block label="cypress/support/component.js" active>

```ts
import { mount } from 'cypress/react'

Cypress.Commands.add('mount', mount)
```

</code-block>
</code-group>

This allows you to use `cy.mount()` in any component test without having to
import the framework-specific mount command, as well as customizing it to fit
your needs. For more info, visit the
[Custom Mount Commands](/guides/component-testing/react/examples#Custom-Mount-Commands)
section in the React examples.

### Using `cy.mount()`

To mount a component with `cy.mount()`, import the component and pass it to the
method:

```ts
import { Stepper } from './stepper'

it('mounts', () => {
  cy.mount(<Stepper />)
})
```

### Passing Data to a Component

You can pass props to a component by setting them on the JSX passed into
`cy.mount()`:

```ts
it('mounts', () => {
  cy.mount(<Stepper initial={100} onChange={() => {}} />)
})
```

## Framework Configuration

Cypress Component Testing works out of the box with
[Create React App](https://create-react-app.dev/),
[Next.js](https://nextjs.org/), [Vite](https://vitejs.dev/), and a custom
[Webpack](https://webpack.js.org/) config. Cypress will automatically detect one
of these frameworks during setup and configure them properly. The examples below
are for reference purposes.

### Create React App (CRA)

Cypress Component Testing works with CRA 4+.

#### CRA Configuration

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

Cypress Component Testing works with Next.js 11+.

#### Next.js Configuration

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

Cypress Component Testing works with React apps that use Vite 2+ as the bundler.

#### Vite Configuration

<cypress-config-file>
<template #js>

```js
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
      // optionally pass in vite config
      viteConfig: require('./webpack.config'),
      // or a function - the result is merged with
      // any `vite.config` file that is detected
      viteConfig: async () => {
        // ... do things ...
        const modifiedConfig = await injectCustomConfig(baseConfig)
        return modifiedConfig
      },
    },
  },
})
```

</template>
<template #ts>

```ts
import { defineConfig } from 'cypress'
import customViteConfig from './customConfig'

export default defineConfig({
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
      // optionally pass in vite config
      viteConfig: customViteConfig,
      // or a function - the result is merged with
      // any `vite.config` file that is detected
      viteConfig: async () => {
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

#### Sample React Vite Apps

- [React Vite with TypeScript](https://github.com/cypress-io/cypress-component-testing-apps/tree/main/react-vite-ts)

### React with Webpack

Cypress Component Testing works with React apps that use Webpack 4+ as the
bundler.

#### Webpack Configuration

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
      framework: 'react',
      bundler: 'webpack',
      // optionally pass in webpack config
      webpackConfig,
      // or a function - the result is merged with any
      // webpack.config that is found
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

If you don't provide a webpack config, Cypress will try to infer it. If Cypress
cannot do so, or you want to make modifications to your config, you can specify
it via the `webpackConfig` option.

#### Sample React Webpack Apps

- [React Webpack 5 with JavaScript](https://github.com/cypress-io/cypress-component-testing-apps/tree/main/react-webpack5-js)

## Community Resources

- [Cypress Component Test Driven Design](https://muratkerem.gitbook.io/cctdd/)
- [Cypress React Component Test Examples](https://github.com/muratkeremozcan/cypress-react-component-test-examples)
