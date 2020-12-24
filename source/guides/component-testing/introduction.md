---
title: Introduction
containerClass: component-testing
---

⚠️ The Cypress Component Testing library is in still in **Alpha**. We are rapidly developing and expect that the API may undergo breaking changes. Contribute to its development by submitting feature requests or issues [here](https://github.com/cypress-io/cypress/).


# What is Cypress Component Testing?
Cypress Component Testing uses framework-specific libraries on top of the powerful Cypress Test Runner to create a **browser-based testing and isolated development environment**.

For those coming from Storybook, this is like if your style guide was testable.

Browser-based component testing with Cypress creates a tight development cycle where you never leave your browser, or your test framework, when building your components and applications.

It looks like this:

{% imgTag /img/guides/references/component-test.gif "Example React component test" %}
 
If you are new to Cypress, don't worry.

We have plenty of Component Testing examples for Vue and React to help you get started.

# Getting Started
A Cypress Component Test contains a `mount` function and assertions about the component it has rendered. A test may interact with component as a user would, using Cypress API commands like {% url "`.click()`" click %}, {% url "`.type()`" type %}, or {% url "many more" table-of-contents %}.

With Cypress as the Test Runner and assertions framework, component tests in React and Vue look very similar. Here's an example, written in Vue:
 
```javascript
import { mount } from '@cypress/vue' // or cypress-react-unit-test
import TodoList from '@/components/TodoList'

describe('TodoList', () => {
  it('renders the todo list', () => {
    mount(TodoList)
    cy.get('[data-testid=todo-list]').should('exist')
  })

  it('contains the correct number of todos', () => {
    const todos = [
      { text: 'Buy milk', id: 1 },
      { text: 'Learn Component Testing', id: 2 }
    ]

    mount(TodoList, {
      propsData: { todos }
    })

    cy.get('[data-testid=todos]').should('have.length', todos.length)
  })
})
```

If I were to write this test for a React component, the test would be almost identical. I would only have to change the `mount` function. Generally, the only framework-specific code in a Cypress Component Test is related to mounting and bundling the component. This means that, contrary to most existing component testing solutions, you do not need to await the internals of the front end framework you're working with.

# Setup and Installation

We currently support Vue and React and intend to support other frameworks in the future. The manual setup instructions between frameworks are very similar, with the difference that Vue has 1-step install via Vue CLI.

## Vue

We highly suggest using Vue CLI for a quick start. For manual installation, please check the README in the {% url "GitHub repository" https://github.com/bahmutov/cypress-vue-unit-test %}.

```sh
vue add cypress-experimental
```

Cypress component testing with Vue currently supports Vue 2.x. Support for Vue 3 is in progress.

Examples for testing different Vue applications (containing {% url "Vuex" https://github.com/bahmutov/cypress-vue-unit-test/tree/master/cypress/component/counter-vuex %}, {% url "VueRouter" https://github.com/bahmutov/cypress-vue-unit-test/tree/master/cypress/component/router-example %}, {% url "VueI18n" https://github.com/bahmutov/cypress-vue-unit-test/tree/master/cypress/component/advanced/i18n %}) exist in the component testing directory for {% url "@cypress/vue" https://github.com/bahmutov/cypress-vue-unit-test/tree/master/cypress/component %}.

## React

```sh
npm install --save-dev cypress cypress-react-unit-test
```

1. Include this plugin from your project's `cypress/support/index.js`

```js
require('cypress-react-unit-test/support')
```

2. Tell Cypress how your React application is transpiled or bundled (using Webpack), so Cypress can load your components. For example, if you use `react-scripts` (even after ejecting) do:

```js
// cypress/plugins/index.js
module.exports = (on, config) => {
  require('cypress-react-unit-test/plugins/react-scripts')(on, config)

  // IMPORTANT to return the config object
  // with the any changed environment variables
  return config
}
```

See {% url "Recipes" https://github.com/cypress-io/cypress/blob/develop/npm/react/docs/recipes.md %} for more examples.

3. ⚠️ Turn the experimental component support on in your `cypress.json`. You can also specify where component spec files are located. For example, to have them located in `src` folder use:

```json
{
  "experimentalComponentTesting": true,
  "componentFolder": "src"
}
```
