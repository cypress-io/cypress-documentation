---
title: Framework Configuration
containerClass: component-testing
---

Recent years have seen an explosion in component based libraries (Vue, React) and frameworks built on top of them (Nuxt, Next). Cypress tests and written and behave the same regardless. Some frameworks require some additional configuration to work correctly with Cypress component testing.

## React (Create React App)

## Vue (Vue CLI)

Cypress works with both Vue 2 and Vue 3. The configuration is almost identical.

### Vue 2 (Vue CLI)

This guide assumes you've created your app using the [Vue CLI](https://cli.vuejs.org/). This documentation was written using Vue CLI v4.5.12.

You'll also need to install the Cypress Webpack Dev Server and Vue 2 adapter, as well as some devDependencies:

```sh
npm install cypress @cypress/vue @cypress/webpack-dev-server html-webpack-plugin@4 --dev
```

`html-webpack-plugin@4` is required because the projects created with the Vue CLI v4 use Webpack v4. If you are using Vue CLI v5 (currently in alpha) you will need `html-webpack-plugin@5` instead.

Next configure the dev-server to use the same Webpack configuration used by Vue CLI:

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

  return config
}
```

<Alert type="info">
If you are using the Vue CLI's PWA feature, there is a known caveat regarding configuration. See [here](https://github.com/cypress-io/cypress/issues/15968#issuecomment-819170918) for more information.
</Alert>

Lastly, tell Cypress where you find your test. In this example all the tests are in `src` and named `spec.js`:

```json
{
  "testFiles": "**/*.spec.js",
  "componentFolder": "src"
}
```

Finally, add a test:

```jsx
// src/components/HelloWorld.spec.js

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

Start Cypress with `npx cypress open-ct` - the test runner will open. Select your test to execute it and see the rendered output. You can also run the tests without opening a browser with `npx cypress run-ct`.

## Next.js

It's possible to use Cypress with the latest version of Next.js, which uses Webpack 4, as well as with Webpack 5 via `next.config.js` with `webpack5: true`.

### Next.js (Webpack 4)

this guide assumes you've created your app using the [`create-next-app`](https://nextjs.org/docs/api-reference/create-next-app) tool. although next.js is webpack based, it doesn't it as a direct dependency, so you'll need to install it. you'll also need to install the cypress webpack dev server and react adapter:

```sh
npm install cypress @cypress/webpack-dev-server @cypress/react html-webpack-plugin@4 webpack@4 webpack-dev-server@3 --dev
```

Note we are installing `html-webpack-plugin@4` and `webpack@4`. Those are the versions that correspond to the current version of Next.js.

Next configure the dev-server using the Next.js adapter shipped with `@cypress/react`:

```js
const injectDevServer = require('@cypress/react/plugins/next')

module.exports = (on, config) => {
  injectDevServer(on, config)

  return config
}
```

Lastly, tell Cypress where you find your test. In this example all the tests are in `cypress/pages`:

```json
{
  "testFiles": "*_/_.spec.{js,jsx}",
  "componentFolder": "cypress/pages"
}
```

Finally, add a test in `cypress/pages`:

```jsx
import React from 'react'
import { mount } from '@cypress/react'
import IndexPage from '../../pages/index'

it('Renders page component', () => {
  mount(<IndexPage />)
  cy.contains('Welcome to Next.js')
})
```

Start Cypress with `npx cypress open-ct` - the test runner will open. Select your test to execute it and see the rendered output. You can also run the tests without opening a browser with `npx cypress run-ct`.

<Alert type="info">
There are some Next.js specific caveats due to it's server side architecture relating to `getInitialProps` and `getStaticProps`. [Learn more here](https://github.com/cypress-io/cypress/tree/develop/npm/react/examples/nextjs#server-side-props).
</Alert>

### Next.js (Webpack 5)

You can also use Cypress component testing with Next.js and Webpack 5. The process is the same as with Webpack 4, described above, with a few key differences.

In your `next.config.js`, tell Next.js to use webpack 5:

```js
module.exports = {
  future: {
    webpack5: true,
  },
}
```

Finally, ensure you install Webpack 5 and the corresponding HTMLWebpackPlugin version:

```sh
npm install cypress @cypress/webpack-dev-server @cypress/react html-webpack-plugin@5 webpack@5 webpack-dev-server@3 --dev
```

Everything else is the same as configuring Cypress with Next.js and Webpack 4.

## Nuxt

... details and example configuration ...

## Vite Based Projects (Vue, React)

... details and example configuration ...
