---
title: Introduction
containerClass: component-testing
---

⚠️ The Cypress Component Testing library is still in **Alpha**. We are rapidly developing and expect that the API may undergo breaking changes. Contribute to its development by submitting feature requests or issues [here](https://github.com/cypress-io/cypress/).

</alert>

## What is Component Testing?

_Definition: Running tests on a component in isolation._

Typically component tests are run using a Node.js testing framework like `jest` or `mocha`. Components we want to test are rendered in a virtualized browser called [jsdom](https://github.com/jsdom/jsdom).

With component testing in Cypress, you can achieve the same goal: test a component in isolation. Instead of having components render inside a terminal, Cypress renders components in a real browser. Since the components you are testing are visible in the browser, this makes it easier to test and debug when a test fails.

Component testing in Cypress is similar to end-to-end testing. The notable differences are:

- There's no need to navigate to a URL. You don't need to call [`cy.visit()`](/api/commands/visit) in your test.
- Cypress provides a blank canvas where we can `mount` components in isolation.

A component test looks like this:

```jsx
import { mount } from '@cypress/react' // or @cypress-vue
import TodoList from '@/components/TodoList'

describe('TodoList', () => {
  it('renders the todo list', () => {
    mount(<TodoList />)
    cy.get('[data-testid=todo-list]').should('exist')
  })

  it('contains the correct number of todos', () => {
    const todos = [
      { text: 'Buy milk', id: 1 },
      { text: 'Learn Component Testing', id: 2 },
    ]

    mount(TodoList, {
      propsData: { todos },
    })

    cy.get('[data-testid=todos]').should('have.length', todos.length)
  })
})
```

If you are already familiar with Cypress, you'll notice it is almost exactly the same as a Cypresss end-to-end test - all your existing Cypress knowledge and experience is transferrable.

## Try out with an existing project

Let's go through the setup to start testing components. If you want to see component testing working in an React or Vue existing project, follow these steps:

## ⚠️ For existing end-to-end users

If you are using Cypress Component Testing in a project that also has tests written with the Cypress end-to-end runner, you may want to configure some Component Testing specific defaults.

You can configure or override specific defaults in [`cypress.json`](/guides/references/configuration) using the `component` key. For example, if you would like to use a different test glob and viewport for Component Testing, your `cypress.json` might look like this:

```json
{
  "testFiles": "cypress/integration/*.spec.js",
  "component": {
    "testFiles": ".*/__tests__/.*spec.tsx",
    "viewportHeight": 500,
    "viewportWidth": 700
  }
}
```

The Component Testing runner will use all the configuration at the root level of `cypress.json`, and apply any Component Testing specific overrides.

### Prerequisites

- A project with a `package.js` file at the root that runs on webpack 4 or 5.
- A `webpack.config.js` file, or a way to access webpack configuration. Refer to your framework's documentation.
- Some components that that you want to test that visually display in a browser. It could be a date picker, tabs, responsive images.
- A basic knowledge of how to write tests in Cypress.

### Install

<alert type="info">

If you are using [Vue.js](https://vuejs.org/), click on the Vue tab of the code examples when available. If there is no Vue tab, the code is the same.

</alert>

Start by running the command below to install dependencies. It will install both the latest version of Cypress and the tooling you need to run component testing.

<code-group>
  <code-block label="React" active>

```bash
npm install --save-dev cypress @cypress/react @cypress/webpack-dev-server
```

  </code-block>
  <code-block label="Vue">

```bash
npm install --save-dev cypress @cypress/vue @cypress/webpack-dev-server
```

  </code-block>
</code-group>

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

You'll also need to configure the component testing framework of your choice by adding the component testing plugin. Read more about plugins in general in our [plugins guide](/guides/tooling/plugins-guide). If you are using Create React App, you will need to use the `react-scripts` plugin as shown below in your `cypress/plugins/index.js` file.

<code-group>
  <code-block label="React (using create-react-app)" active>

```js
// cypress/plugins/index.js

module.exports = (on, config, mode) => {
  if (mode === 'component') {
    require('@cypress/react/plugins/react-scripts')(on, config)
  }

  return config
}
```

  </code-block>
  <code-block label="Vue (using vue-cli)">

```js
// cypress/plugins/index.js

module.exports = (on, config, mode) => {
  if (mode === 'component') {
    const { startDevServer } = require('@cypress/webpack-dev-server')
    const webpackConfig = require('@vue/cli-service/webpack.config.js')
    on('dev-server:start', (options) =>
      startDevServer({ options, webpackConfig })
    )
  }

  return config
}
```

  </code-block>
</code-group>

Note we have a conditional check against `mode`. This is useful if your project is already using some existing plugins for the E2E runner, and you don't want them to conflict.

If you are using a React template other than Create React App, such as Next.js, or a Vue template other than vue-cli, you will need to import the appropriate plugin. See a list of officially maintained plugins [here](https://github.com/cypress-io/cypress/tree/develop/npm/react/plugins). Alternatively, if you have your own webpack configuration, you can just provide it:

```js
// cypress/plugins/index.js
const { startDevServer } = require('@cypress/webpack-dev-server')
// your project's webpack configuration
const webpackConfig = require('../../webpack.config.js')

module.exports = (on, config, mode) => {
  if (mode === 'component') {
    on('dev-server:start', (options) => {
      return startDevServer({ options, webpackConfig })
    })
  }

  return config
}
```

The [plugins](https://github.com/cypress-io/cypress/tree/develop/npm/react/plugins) we provide for common project configurations just do the same thing under the hood.

<alert type="info">

If you have separate webpack configurations for development and production, use the development configuration. It'll give better location information using SourceMaps.

</alert>

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
import Button from './Button'

it('Button', () => {
  mount(<Button>Test button</Button>)
  cy.get('button').contains('Test button').click()
})
```

  </code-block>
  <code-block label="Vue">

```jsx
import { mount } from '@cypress/vue'
import Button from './Button'

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
