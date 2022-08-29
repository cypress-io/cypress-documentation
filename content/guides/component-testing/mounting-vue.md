---
title: Mounting Components
---

Many tests, regardless of framework or type, follow a similar format: **Arrange,
Act, and Assert**. This pattern "Arrange, Act, Assert" was first coined in 2001
by Bill Wilke and is explained thoroughly in his blog post
["3A - Arrange, Act, Assert"](https://xp123.com/articles/3a-arrange-act-assert/).

When it comes to component testing, mounting your component is where we
**Arrange** our component under test. It is analogous to visiting a page in an
end-to-end test.

## What is the Mount Function?

We ship a `mount` function for each front-end framework Cypress supports, which
is imported from the `cypress` package. It is responsible for rendering
components within Cypress's sandboxed iframe and handling and framework-specific
cleanup.

```js
import { mount } from 'cypress/vue'
```

Vue 2 projects will import the `mount` function from `cypress/vue2` like so:

```js
import { mount } from 'cypress/vue2'
```

### Using `cy.mount()` Anywhere

While you can use the `mount` function in your tests, we recommend using
[`cy.mount()`](/api/commands/mount), which is added as a
[custom command](/api/cypress-api/custom-commands) in the
**cypress/support/component.js** file:

<code-group>
<code-block label="cypress/support/component.js" active>

```js
import { mount } from 'cypress/vue'

Cypress.Commands.add('mount', mount)
```

</code-block>
</code-group>

This allows you to use `cy.mount()` in any component test without having to
import the framework-specific mount command.

You can customize `cy.mount` to fit your needs. For instance, if you are using
plugins or other global app-level setups in your Vue app, you can configure them
here. For more info, see the
[Customizing cy.mount() guide for Vue](/guides/component-testing/custom-mount-vue).

### Your First Component Test

Now that you have a component let's write a spec that mounts the component.

To get started, create a spec file in the same directory as the `Stepper.vue`
component and name it **Stepper.cy.js**. Then paste the following into it:

<code-group>
<code-block label="Stepper.cy.js" active>

```js
import Stepper from './Stepper.vue'

describe('<Stepper>', () => {
  it('mounts', () => {
    cy.mount(Stepper)
  })
})
```

</code-block>
</code-group>

Here, we have a single test that ensures that our component mounts.

> If you're coming from Vue Test Utils, please note that the return value of
> `mount` is not used. Cypress Component tests can and should be agnostic to the
> framework internals and accessing the
> [`wrapper`](https://test-utils.vuejs.org/api/#wrapper-methods) that Vue Test
> Utils rely on is rarely necessary.

## Running the Test

Now it's time to see the test in action. Open up Cypress if it is not already
running:

```bash
npx cypress open --component
```

> The `--component` flag will launch us directly into component testing

And launch the browser of your choice. In the spec list, click on
**Stepper.cy.js** and you will see the stepper component mounted in the test
area.

<DocsImage 
  src="/img/guides/component-testing/first-test-run-vue.png" 
  caption="Stepper Mount Test"> </DocsImage>

A basic test that mounts a component in its default state is an excellent way to
start testing. Since Cypress renders your component in a real browser, you have
a lot of advantages, such as seeing that the component renders as it should,
interacting with the component in the test runner, and using the browser dev
tools to inspect and debug both your tests and the component's code.

Feel free to play around with the `Stepper` component by interacting with the
increment and decrement buttons.

### Optional JSX Support

The mount command supports the Vue Test Utils object syntax, but it can also be
used with Vue's JSX syntax (provided that you've configured your bundler to
support transpiling JSX or TSX files).

The object syntax for the mount function is identical to the Vue Test Utils
version you'd use with your application's version of Vue.

The rest of this guide will show tests in Vue Test Utils syntax and JSX.

## Cypress and Testing Library

While we don't use [Testing Library](https://testing-library.com/) in this
guide, many people might wonder if it is possible to do so with Cypress and the
answer is yes!

Cypress loves the Testing Library project. We use Testing Library internally,
and our philosophy aligns closely with Testing Library's ethos and approach to
writing tests. We strongly endorse their best practices.

In particular, if you're looking for more resources to understand how we
recommend you approach testing your components, look to:

- [Guiding Principles - Testing Library](https://testing-library.com/docs/guiding-principles)
- [Priority of Queries - Testing Library](https://testing-library.com/docs/queries/about#priority)

For fans of
[Testing Library](https://testing-library.com/docs/cypress-testing-library/intro/),
you'll want to install `@testing-library/cypress` _instead_ of the
`@testing-library/react` package.

```shell
npm i -D @testing-library/cypress
```

The setup instructions are the same for E2E and Component Testing. Within your
**component support file**, import the custom commands.

```js
// cypress/support/component.js
// cy.findBy* commands will now be available.
// This calls Cypress.Commands.add under the hood
import '@testing-library/cypress/add-commands'
```

For TypeScript users, types are packaged along with the Testing Library package.
Refer to the latest setup instructions in the Testing Library docs.

## Next Steps

Now that we have our component mounted, next we will learn how to write tests
against it.

<NavGuide prev="/guides/component-testing/quickstart-vue" next="/guides/component-testing/testing-vue" />
