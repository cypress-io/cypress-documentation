---
title: Getting Started
containerClass: component-testing
---

⚠️ The Cypress Component Testing library is in still in **Alpha**. We are rapidly developing and expect that the API may undergo breaking changes. Contribute to its development by submitting feature requests or issues [here](https://github.com/cypress-io/cypress/).
**Getting Started with Component Testing**

Welcome to the future of component testing. This document will help you create a basic project you can test in an end to end fashion with the e2e runner, as well as write component tests with the new component test runner.

If you don’t want to set anything up and just try something out, follow the instructions in **1. Quick start with a template**. If you want to see how it all works, **2. Manual Setup** Will walk you through setting it up.

1. **Quick start with a template**

If you just want to see it working but don’t want to write some code, do the following:

- Clone the cypress monorepo
- Get the template: `git checkout ct-quick-setup`
- Install deps: `yarn`
- `cd my-project`
- Component testing runner: `yarn cypress:open`
- Try modifying the Button component or the stylesheet - everything will hot reload and re-run automatically, it’s nice and fast.
- Component tests go in `cypress/component`
- E2E test runner:
- Start server with `yarn webpack-dev-server --config my-project/webpack.config.js`
- E2E runner: `node ../scripts/start.js --project ${PWD}`
- Run `e2e.spec.js`
- E2E tests go in the usual place
- **_Note: You can only have one runner open at a time at present_**.

2. **Manual Setup**

This section will show you how to set a project up from scratch that has component testing running alongside e2e testing.

**Preparation**

- Checkout the feature branch: `git checkout feat/component-testing`.
- Install the dependencies with `yarn`

**Creating a Project**

- Create a new directory. I created `my-project` at the root of the cypress repository.
- _The rest of this document assumes your project is in `cypress/my-project`_.
- `cd` in there and run `node ../scripts/start.js --project ${PWD}` to get the cypress boilerplate. Kill the runner.
- This guide will provide some basic config so you can see how easy it is to set up component testing alongside e2e testing.

**Configuring**

- Create a basic React app by adding some basic config
- **webpack.config.js**: `curl https://raw.githubusercontent.com/cypress-io/cypress/lachlan/ct-setup-testing/my-project/webpack.config.js -o webpack.config.js`
- **babel.config.js**: curl https://raw.githubusercontent.com/cypress-io/cypress/lachlan/ct-setup-testing/my-project/babel.config.js -o babel.config.js
- Component testing requires a plugin. Inside cypress/plugins/index.js add the following plugin:

```js
const { startDevServer } = require('../../../npm/webpack-dev-server')
const webpackConfig = require('../../webpack.config.js')

module.exports = (on, config) => {
  on('dev-server:start', (options) =>
    startDevServer({ options, webpackConfig })
  )
  return config
}
```

**Writing Component Tests**

We encourage you to try things out - write whatever kind of component you like. To get you started, here is a basic example.

- create `src` and inside add two files - **index.jsx** and **components.jsx** with `touch src/{components,index}.jsx`
- Update `components.jsx`:

```jsx
import \* as React from 'react'

export class Button extends React.Component {
  render() {
    return (
      <button {...this.props}>
      {this.props.children}
      </button>
    )
  }
}

export class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 0
    }
  }

  render() {
    return (
      <div>
      <div>Count is {this.state.count}</div>
      <Button onClick={() => this.setState({ count: this.state.count + 1 })}>Increment</Button>
      </div>
    )
  }
}
```

- Create a `cypress/components/Button.spec.jsx`
- Add a test:

```jsx
import * as React from 'react'
import { mount } from '../../../npm/react/dist'
import { Button } from '../../src/Components'

it('Button', () => {
  mount(<Button>Test button</Button>)
  cy.get('button').contains('Test button').click()
})
```

- Run Cypress with the `--component-testing` flag: `node ../scripts/start.js --component-testing --project ${PWD}`
- Select the spec to the left. You should see the following: <DocsImage src="/img/guides/component-testing/ct-example.png" alt="Example of Component Testing" />
- It will hot reload - try modify the spec, make it fail, etc.

**E2E Testing Alongside Component Testing**

Component testing works alongside E2E testing. Let’s add some code to make the React app a stand alone app and write an E2E test.

- Update `src/index.jsx`:

```jsx
import _ as React from 'react'
import _ as ReactDOM from 'react-dom'
import { App } from './Components'

ReactDOM.render(<App />, document.getElementById('root'))
```

- Create a `public` directory. Add `index.html` with `curl [https://raw.githubusercontent.com/cypress-io/cypress/lachlan/ct-setup-testing/my-project/public/index.html](https://raw.githubusercontent.com/cypress-io/cypress/lachlan/ct-setup-testing/my-project/public/index.html) -o public/index.html`
- Add a basic e2e spec in `cypress/integration/e2e.spec.js`:

```js
describe('e2e', () => {
  it('increments', () => {
    cy.visit('http://localhost:8080')
    cy.get('div').contains('Count is 0')
    cy.get('button').click()
    cy.get('div').contains('Count is 1')
  })
})
```

- Run the webpack dev server: `yarn webpack-dev-server --config my-project/webpack.config.js`
- Open the E2E runner: `node ../scripts/start.js --project ${PWD}` and choose `e2e.spec.js`
- It runs the spec as you would expect:
