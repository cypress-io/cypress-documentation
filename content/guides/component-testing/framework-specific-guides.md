---
title: Framework Specific Guides
containerClass: component-testing
---

Recent years have seen an explosion in component based libraries (Vue, React) and frameworks built on top of them (Nuxt, Next). Cypress tests and written and behave the same regardless. Some frameworks require some additional configuration to work correctly with Cypress component testing.

## React (Create React App)

## Vue (Vue CLI)

... details and example configuration ...

## Next

It's possible to use Cypress with the latest version of Next.js, which uses Webpack 4, as well as with Webpack 5 via `next.config.js` with `webpack5: true`.

## Current (Webpack 4)

This guide assumes you've created your app using the [`create-next-app`](https://nextjs.org/docs/api-reference/create-next-app) tool. Although Next.js is webpack based, it doesn't it as a direct dependency, so you'll need to install it. You'll also need to install the Cypress Webpack Dev Server and React adapter:

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

``json
{
"testFiles": "\*_/_.spec.{js,jsx}",
"componentFolder": "cypress/pages"
}

````

Finally, add a test:

```jsx
import React from 'react'
import { mount } from '@cypress/react'
import IndexPage from '../../pages/index'

it('Renders page component', () => {
  mount(<IndexPage />)
  cy.contains('Welcome to Next.js')
})
````

## Future Next.js (Webpack 5)

You can also use Cypress component testing with Next.js and Webpack 5. The process is the same as with Webpack 4, described above, with a few key differences.

### Webpack 5 with Next.js

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
