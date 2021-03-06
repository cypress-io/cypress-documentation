---
title: Getting Started
containerClass: component-testing
---

<alert type="warning">

⚠️ Cypress component testing is in still in **Alpha**. We are rapidly developing and expect that the API may undergo breaking changes. Contribute to its development by submitting feature requests or issues in the [cypress repo](https://github.com/cypress-io/cypress/).

</alert>

## What is Component Testing

_Definition: Running tests on a component in isolation._

Typically component tests are run using a Node.js testing framework like `jest` or `mocha`. Components we want to test are rendered in a virtualized browser called [JSDom](https://github.com/jsdom/jsdom).

With component testing in Cypress, you can achieve the same goal: test a component in isolation. Instead of having components render inside a terminal, Cypress renders components in a real browser. Since the components you are testing are visible in the browser, this makes it easier to test and debug when a test fails.

Component testing in Cypress is similar to end-to-end testing. The notable differences are:

- There's no need to navigate to a URL. You don't need to call [`cy.visit()`](/api/commands/visit) in your test.
- Cypress provides a blank canvas where we can `mount` components in isolation.

Let's go through the setup to start testing components.

## Try out with an existing project

If you want to see component testing working in an existing project, follow these steps:

<!-- FIXME: update the url of the example repo we choose -->

- Clone this https://github.com/elevatebart/calc.git repository.
- Install dependencies by running `npm install`.
- Run `npx cy:open` to open Cypress.

<DocsImage src="/img/guides/component-testing/first-open.png" alt="Splash Screen of Component Testing" ></DocsImage>

- Click on one of the specs. You should see the tests run.
- Open the spec file in your [preferred IDE](guides/tooling/IDE-integration#file-opener-preference) by clicking on the spec file's name in the sidebar.
- Make a change in the spec file and save to see the test re-run.
- Edit the code where the component lives in your application. The test will also automatically re-run.

<DocsImage src="/img/guides/component-testing/first-run.png" alt="Splash Screen of Component Testing" ></DocsImage>

## Set up in your project

If you want to set up component testing in a project that's already doing end-to-end testing in Cypress, this section will show you how to get setup.

Before we start testing components, let's make sure our project has the required prerequisites.

<alert type="info">

If you are using [Vue.js](https://vuejs.org/), click on the Vue tab of the code examples when available. If there is no Vue tab, the code is the same.

</alert>

### Prerequisites

- A `package.json` file at the root that runs on webpack 4 or 5.
- A `webpack.config.js` file, or a way to access webpack configuration. Refer to your framework's documentation.
- Some components that that you want to test that visually display in a browser. It could be a date picker, tabs, responsive images.
- A basic knowledge of how to write tests in Cypress.

### Install

Start by running the command below to install dependencies. It will install both the latest version of Cypress and the tooling you need to run component testing.

<code-group>
  <code-block label="React" active>

```bash
npm install cypress @cypress/react @cypress/webpack-dev-server --dev
```

  </code-block>
  <code-block label="Vue">

```bash
npm install cypress @cypress/vue @cypress/webpack-dev-server --dev
```

  </code-block>
</code-group>

### Configuration

Now that we have the necessary tools installed let's configure our tests.

In the same folder as your `package.json`, create a `cypress.json` file and a `cypress` directory. Both might already exist does not already exists. In this folder create a plugins directory containing an `index.js` file.

<alert type="info">

If it's your first time using Cypress, run `npx cypress open` and Cypress will create some example directories and files.

</alert>

Now you need to configure how Cypress will locate component spec files from within your configuration file (`cypress.json` by default). In the following configuration, all components test files are in the `src` directory and match the glob given in the `testFiles` key.

```json
{
  "componentFolder": "src",
  "testFiles": "**/*spec.{js,jsx,ts,tsx}"
}
```

You'll also need to configure the component testing framework of your choice by adding the component testing plugin. Read more about plugins in general in our [plugins guide](/guides/tooling/plugins-guide).

Since your project uses webpack, you'll be using `webpack-dev-server` to facilitate the matching of the styling and display rules of component.

<alert type="info">

If you have separate webpack configurations for development and production, use the development configuration. It'll give better location information using SourceMaps.

</alert>

```js
const { startDevServer } = require('@cypress/webpack-dev-server')
// your project's webpack configuration
const webpackConfig = require('../../webpack.config.js')

module.exports = (on, config) => {
  on('dev-server:start', (options) => {
    return startDevServer({ options, webpackConfig })
  })
  return config
}
```

We are now ready to start testing our components.

### Writing Component Tests

This example assumes a `<Button />` component exists.

- Navigate to where this component exists in your code.
- Create a spec file in the same folder called `Button.spec.jsx`.
- Write a test in the `Button.spec.jsx` file:

<code-group>
  <code-block label="React" active>

```jsx
import * as React from 'react'
import { mount } from '@cypress/react'
import Button from './button'

it('Button', () => {
  mount(<Button>Test button</Button>)
  cy.get('button').contains('Test button').click()
})
```

  </code-block>
  <code-block label="Vue">

```jsx
import { mount } from '@cypress/vue'
import Button from './button'

it('Button', () => {
  // with JSX
  mount(() => <Button>Test button</Button>)

  // ... or ...
  mount(Button, {
    slots: {
      default: 'Test button',
    },
  })

  cy.get('button').contains('Test button').click()
})
```

  </code-block>
</code-group>

- Open Cypress to test components with the command below.

```shell
npx cypress open-ct
```

- Select the spec file in the sidebar. You should see the following:

<DocsImage src="/img/guides/component-testing/one-spec.png" alt="Single Spec file with single test run" ></DocsImage>

- Try modifying the test in your IDE, make the test fail, etc. The tests re-run instantly with visual feedback.

### Set up CI

Sometimes we want to run tests without interactivity and see all results in the terminal, like when we run our tests in continuous integration.

To run all tests in the terminal, run the command below:

```shell
npx cypress run-ct
```

In the project we just built, this command will show the following results.

<DocsImage src="/img/guides/component-testing/run-result.png" alt="Result of headless test run" ></DocsImage>

To make the component tests part of your [continuous integration](/guides/guides/continuous-integration) pipeline, add a script to run `npx cypress run-ct` to your CI configuration.
