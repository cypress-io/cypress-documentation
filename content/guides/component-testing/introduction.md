---
title: Introduction
containerClass: component-testing
---

⚠️ The Cypress Component Testing library is still in **Alpha**. We are rapidly
developing and expect that the API may undergo breaking changes. Contribute to
its development by submitting feature requests or issues
[here](https://github.com/cypress-io/cypress/).

</alert>

## What is Component Testing?

_Definition: Running tests on a component in isolation._

Typically component tests are run using a Node.js testing framework like `jest`
or `mocha`. Components we want to test are rendered in a virtualized browser
called [jsdom](https://github.com/jsdom/jsdom).

With component testing in Cypress, you can achieve the same goal: test a
component in isolation. Instead of having components render inside a terminal,
Cypress renders components in a real browser. Since the components you are
testing are visible in the browser, this makes it easier to test and debug when
a test fails.

Component testing in Cypress is similar to end-to-end testing. The notable
differences are:

- There's no need to navigate to a URL. You don't need to call
  [`cy.visit()`](/api/commands/visit) in your test.
- Cypress provides a blank canvas where we can `mount` components in isolation.

## Getting Started

A Cypress Component Test contains a `mount` function and assertions about the
component it has rendered. A test may interact with component as a user would,
using Cypress API commands like [.click()](/api/commands/click),
[.type()](/api/commands/type), or [many more](/api/api/table-of-contents).

With Cypress as the Test Runner and assertions framework, component tests in
React and Vue look very similar. Here's an example, written in React:

```javascript
import { mount } from '@cypress/react' // or @cypress/vue
import TodoList from './components/TodoList'

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

    mount(<TodoList todos={todos} />)

    cy.get('[data-testid=todos]').should('have.length', todos.length)
  })
})
```

If you are already familiar with Cypress, you'll notice it is almost exactly the
same as a Cypress end-to-end testing - all your existing Cypress knowledge and
experience is transferrable.

## Project Setup

Let's go through the setup to start testing components. You can set it up with
an existing React or Vue project, or start a new project from scratch. This
guide assumes your project uses a [Webpack based](https://webpack.js.org/) tool
chain. For our experimental Vite based instructions, please see the information
here.

<alert type="info">

If you currently do not use Webpack, you can create a separate configuration for
Webpack specifically for Cypress Component Testing. Follow the
[Webpack getting started guide](https://webpack.js.org/guides/getting-started/)
to create a new Webpack config, then continue following the
[Installation guide](#Install) below.

</alert>

### Prerequisites

- A project with a `package.json` file at the root that runs on Webpack 4 or 5.
- A `webpack.config.js` file, or a way to access Webpack configuration. Refer to
  your framework's documentation.
- Some components that you want to test that visually display in a browser. It
  could be a date picker, tabs, responsive images.
- A basic knowledge of how to write tests in Cypress. (See the
  [Getting Started](/guides/core-concepts/introduction-to-cypress) guide.)

### ⚠️ Existing end-to-end users

If you are using Cypress Component Testing in a project that also has tests
written with the Cypress End-to-End test runner, you may want to configure some
Component Testing specific defaults.

You can configure or override Component Testing defaults in your
[Cypress configuration](/guides/references/configuration) using the `component`
key.

For example, if you would like to use a different viewport size or target
different test files for Component Testing, your Cypress configuration might
look like this:

:::cypress-config-example

```js
{
  e2e: {
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}"
  }
  component: {
    specPattern: ".*/__tests__/.*spec.tsx",
    viewportHeight: 500,
    viewportWidth: 700
  }
}
```

:::

The Component Testing runner will use all the configuration at the root level of
your configuration file and apply any Component Testing specific overrides.

### Install

<alert type="info">

If you are using [Vue.js](https://vuejs.org/), click on the Vue tab of the code
examples in our documentation when available. If there is no Vue tab, the code
is the same.

</alert>

Start by running the command below to install dependencies. It will install both
the latest version of Cypress and the tooling you need to run component testing.

<code-group>
  <code-block label="React" active>

```bash
npm install --save-dev cypress @cypress/react @cypress/webpack-dev-server webpack-dev-server
```

  </code-block>
  <code-block label="Vue">

```bash
npm install --save-dev cypress @cypress/vue @cypress/webpack-dev-server webpack-dev-server
```

  </code-block>
</code-group>

<alert type="info">

If it's your first time using Cypress, check out the
[main Getting Started documentation](/guides/getting-started/installing-cypress).

</alert>

Once installed, you need to configure how Cypress will locate component spec
files. In the following Cypress configuration, all components test files
contained within the `src` directory and match the glob given in the
`specPattern` key.

:::cypress-config-example

```js
{
  component: {
    specPattern: '**/*spec.{js,jsx,ts,tsx}'
  }
}
```

:::

You will also need to configure the component testing framework of your choice
by installing the corresponding component testing plugin. Read more about
Cypress plugins in our [plugins guide](/guides/tooling/plugins-guide). For
example, if you are using Create React App, you will need to use the
`react-scripts` plugin as shown below.

Note we have a conditional check against `config.testingType`. This is useful if
your project is using the legacy plugins file for the End-to-end runner, and you
don't want them to conflict.

### React (using CRA)

:::cypress-plugin-example{configProp=component noComment}

```js
if (config.testingType === 'component') {
  require('@cypress/react/plugins/react-scripts')(on, config)
}

return config
```

:::

### Vue (using vue-cli)

:::cypress-plugin-example{configProp=component noComment}

```js
if (config.testingType === 'component') {
  const { startDevServer } = require('@cypress/webpack-dev-server')

  // Vue's Webpack configuration
  const webpackConfig = require('@vue/cli-service/webpack.config.js')

  on('dev-server:start', (options) =>
    startDevServer({ options, webpackConfig })
  )
}
```

:::

### Generic Webpack

:::cypress-plugin-example{configProp=component noComment}

```js
if (config.testingType === 'component') {
  const { startDevServer } = require('@cypress/webpack-dev-server')

  // Your project's Webpack configuration
  const webpackConfig = require('../../webpack.config.js')

  on('dev-server:start', (options) =>
    startDevServer({ options, webpackConfig })
  )
}
```

:::

If you have a different React development environment from Create React App,
such as Next.js, or use a Vue template other than vue-cli, you will need to
import the appropriate plugin. See a list of officially maintained plugins
[here](https://github.com/cypress-io/cypress/tree/develop/npm/react/plugins).
Each of these plugins perform the same tasks under the hood. Alternatively, if
you have your own Webpack configuration, you can just provide it (without need
for a specific plugin) as specified above.

<alert type="info">

If you have separate Webpack configurations for development and production, use
the development configuration. It will give better location information using
SourceMaps.

</alert>

### Writing Component Tests

This example assumes a project with a `<Button />` component.

We recommend locating your component tests next to the components you are
testing. If you are using our recommended `specPattern` glob
(`**/*spec.{js,jsx,ts,tsx}`) [as described above](#Install):

- Navigate to where this component exists in your code.
- Create a spec file in the same folder called `Button.spec.jsx`.

Otherwise create `Button.spec.jsx` in the relevant directory based on your
configuration.

Once the test file exists, we can begin to write a test called
`Button.spec.jsx`:

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

<alert type="info">

The React and Vue tests are nearly identical, allowing for a common shared test
style across frameworks!

</alert>

- Open Cypress in Component Testing mode:

```shell
npx cypress open --component
```

- Select the spec file in the sidebar. You should see the following:

<DocsImage src="/img/guides/component-testing/one-spec.png" alt="Single Spec file with single test run" ></DocsImage>

- Try to modify the test in your editor, make the test fail, etc. The tests will
  re-run instantly with immediate visual feedback.

### Set up CI

Sometimes we want to run tests without interactivity and see all results in the
terminal, like when we run our tests in continuous integration.

To run all component tests in the terminal, run the command below:

```shell
npx cypress run --component
```

In the project we just built, this command will show the following results.

<DocsImage src="/img/guides/component-testing/run-result.png" alt="Result of headless test run" ></DocsImage>

To make the component tests part of your
[continuous integration](/guides/continuous-integration/introduction) pipeline,
add a script to run `npx cypress run --component` to your CI configuration.

For example, see the repo
[cypress-react-component-example](https://github.com/bahmutov/cypress-react-component-example)
that uses [Cypress GitHub Action](https://github.com/cypress-io/github-action)
to first run the E2E tests, then run the component tests.

### Experimental

The tools listed in this section are actively being developed. We will support
early adoption of these projects in order to get community feedback.
Please report issues against these projects in Github or contact us on
[Discord](https://discord.gg/Cd4CdSx) for additional support.

#### Vite

For a quick-start, please take a look at the boilerplate repositories below. To
setup a project from scratch please check out the below configuration.

**From Boilerplate**

- [Vite + Vue 3](https://github.com/JessicaSachs/cypress-loves-vite) (VueConfUS
  2021 by Jessica Sachs)

**From Scratch**

To get started with Vite, please follow the installation instructions for
Webpack, but replace `@cypress/webpack-dev-server` with
`@cypress/vite-dev-server`. Here is a sample `plugins.js` file where the
`dev-server:start` event is registered with Vite.

```js
import { startDevServer } from '@cypress/vite-dev-server'

export default function (on, config) {
  on('dev-server:start', (options) => {
    const viteConfig = {
      // import or inline your vite configuration from vite.config.js
    }
    return startDevServer({ options, viteConfig })
  })
}
```

Exactly like Webpack, you should start Cypress with
`yarn cypress open --component`. Writing component tests when using Vite is
_exactly_ the same as when using Webpack. Minor differences may occur depending
on the

**Known issues**

- Missing Vitesse support
- May flake in resource-constrained CI machines
- Issues with certain PWA plugins

**Debugging Strategies**

Issues will often arise during the initial compilation and start of your
project. Please collect logs and focus on stripping down your `viteConfig` to
work around any issues. Please log any issues in Github.

**Collecting logs**

To debug any Vite issues, run Cypress using
`DEBUG=cypress:* yarn cypress open --component`.

**Compiling your project**

Remove all plugins and pass in an empty `viteConfig` into the `startDevServer`
options. Add plugins in one-at-a-time
