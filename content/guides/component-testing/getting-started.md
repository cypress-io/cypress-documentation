---
title: Getting Started
containerClass: component-testing
---

⚠️ The Cypress Component Testing library is in still in **Alpha**. We are rapidly developing and expect that the API may undergo breaking changes. Contribute to its development by submitting feature requests or issues [here](https://github.com/cypress-io/cypress/).

Welcome to the future of cypress testing. Component testing.

## What is Component Testing

Testing components is almost identical to normal cypress testing except

- We do not navigate to a page to run the tests against so no `cy.visit()`
- Instead, cypress provides a blank canvas where we can `mount` our components in isolation.

Let's get you set up so you can start testing components.

## Try it out with an existing project

If you just want to see it working but don’t want to write code, follow this:

<!-- FIXME: update the url of the example repo we choose -->

- Clone the calc repo
- Install depenedencies `yarn`
- Open component testing runner `yarn cy:open`

<DocsImage src="/img/guides/component-testing/first-open.png" alt="Splash Screen of Component Testing" ></DocsImage>

- Click on one of the specs and see it run
- Open the spec file by clicking on its name above the command log
- Make a change to the spec and see it re-run
- Open the component tested and make a change, any change. The test will be re-run automatically.

<DocsImage src="/img/guides/component-testing/first-run.png" alt="Splash Screen of Component Testing" ></DocsImage>

## Set it up in your project

This section will show you how to set a project up from scratch that has component testing running alongside e2e testing.

Before we start testing components let's make sure we everything we need.

<Alert type="info">

If you are using VueJs click on the Vue tab of the code examples.

</Alert>

### Prerequisites

- An npm project with a `package.json` file at the root that runs on webpack 4 or 5. Create-react-app runs on webpack. It will work fine. So does Nextjs or Gatsby.
- A `webpack.config.js` file or a way to access it. Refer to the docs tof your framework to access it.
- A few components that have a visual part to them. It could be a Date Picker, tabs, responsive images, your imagination (and your time) is the limit.
- A basic knowledge of how to write tests in cypress

### Install

First, run the following command. It will install both the latest version of cypress and the tooling you need to run component testing.

<CodeGroup>
  <code-block label="react" active>

```bash
yarn add cypress @cypress/react @cypress/webpack-dev-server
```

  </code-block>

  <code-block label="vue">

```bash
yarn add cypress @cypress/vue @cypress/webpack-dev-server
```

  </code-block>
</CodeGroup>

### Configuration

Now that we have the necessary tools installed let's configure our tests.

In the same folder as `package.json` create a `cypress.json` file and a `cypress` directory of it does not already exists. in this folder create a `support.js` file.

The `cypress.json` file will allow us to configure where the component test files are.
In the following configuration all components test files are in the `src` directory and match the glob given in the `testFiles` key.

```json
{
  "componentFolder": "src",
  "testFiles": "**/*spec.{js,jsx,ts,tsx}"
}
```

Then it is time to fill in the `support.js` file to configure our component server.

Since our project uses webpack, we will be using webpack-dev-server to facilitate the matching of the styling and display rules of component

<Alert type="info">

If you have a dev and a production config, prefer the dev version for now, it will give you better location information using sourceMaps.

</Alert>

```js
const { startDevServer } = require('@cypress/webpack-dev-server')
const projectsWebpackConfig = require('../../webpack.config.js')

module.exports = (on, config) => {
  on('dev-server:start', (options) =>
    startDevServer({ options, projectsWebpackConfig })
  )
  return config
}
```

We are now ready to start testing our components.

### Writing Component Tests

We assume a `button` component exists.

- Navigate to where this component file is saved
- Create a `Button.spec.jsx` file in the same folder
- Add a test:

<CodeGroup>
  <code-block label="react" active>

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

  <code-block label="vue" active>

```jsx
import { mount } from '@cypress/vue'
import Button from './button'

it('Button', () => {
  mount(() => <Button>Test button</Button>)
  cy.get('button').contains('Test button').click()
})
```

  </code-block>
</CodeGroup>

- Open Cypress Component Testing

```
yarn cypress open-ct
```

- Select the spec in the sidebar. You should see the following:

<DocsImage src="/img/guides/component-testing/one-spec.png" alt="Single Spec file with single test run" ></DocsImage>

- Try modifying the spec, make the test fail, etc. the tests re-run instantly with visual feedback.

### Setup CI

Sometimes, we want to run tests without interactivity and see all results in the terminal.
To run all tests in one command we use `cypress run-ct`.

In the project we just built, this command will yield the following results.

<DocsImage src="/img/guides/component-testing/run-result.png" alt="Result of headless test run" ></DocsImage>

To make the component tests part of your continuous integration pipeline, add a script running `cypress run-ct` to travis, circle or appveyor the same way you would add a `cypress run` script without needing to start your server first. We take care of that for you.
