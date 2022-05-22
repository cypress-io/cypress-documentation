---
title: Mounting Components
---

Many tests, regardless of framework or type follow a similar format: **Arrange,
Act, and Assert**. This pattern "Arrange, Act, Assert" was first coined in 2001
by Bill Wilke and is explained thoroughly in his blog post
["3A - Arrange, Act, Assert"](https://xp123.com/articles/3a-arrange-act-assert/).

When it comes to component testing, mounting your component is where we
**Arrange** our component under test. It is analogous to visiting a page in an
end-to-end test.

## What is the Mount Function?

We ship a `mount` function for each front-end framework Cypress supports, which
can be imported from the `cypress` package. It is responsible for rendering
components within Cypress's sandboxed iframe as well as handling and
framework-specific cleanup.

```js
import { mount } from 'cypress/react'
```

### The Simplest Usage of Mount

You'll import the component you want to test and then mount it:

```jsx
import { mount } from 'cypress/react'
import Stepper from './Stepper'

describe('<Stepper>', () => {
  it('mounts', () => {
    mount(<Stepper />)
  })
})
```

### Making cy.mount Available Anywhere

While you can import the `mount` function at the top of any file, you'll be
using it in every single component test, so we recommend adding it as a
[Cypress Custom Command](/api/cypress-api/custom-commands), where it will be
available on the global `cy` API wherever you need it.

Automatic configuration should have done this for you if you followed the wizard
in the Launchpad.

Your component support file should look something like the code block below. It
will have registered the `mount` method as a Cypress Command, and it will be
available in any Cypress test under `cy.mount`.

If you're using providers or other global app-level setups in your React app,
you'll want to follow the
"[Customizing cy.mount guide for React](/api/commands/mount)".

<!-- TODO: link to customizing cy.mount command -->

```js
// cypress/support/component.js
import { mount } from 'cypress/react'

Cypress.Commands.add('mount', mount)
```

Now we can update our `<Stepper />` component by removing the `mount` import and
using the `cy.mount` command. Go ahead and create a spec in your project named
`Stepper.spec.jsx` in the same directory as `Stepper.jsx` and copy the following
into it:

<code-group>
<code-block label="Stepper.cy.jsx" active>

```jsx
import Stepper from './Stepper'

describe('<Stepper>', () => {
  it('mounts', () => {
    cy.mount(<Stepper />) // this command now works in any test!
  })
})
```

</code-block>
</code-group>

## Running the Test

Now it's time to see the test in action. Open up Cypress if not already:

```bash
npx cypress open
```

And launch the browser of your choice. In the spec list, click on
**Stepper.cy.jsx** and you will see the stepper component mounted in the test
area.

Having a basic test that mounts a component in its default state is a good way
to get started testing. Since Cypress renders your component in a real browser,
you can visually see if it is rendering how it should, and you can also play
around with it manually in the test runner.

<!-- TODO - picture of mounted stepper component -->

<alert type="info">

## Cypress and Testing Library

While we don't use Testing Library in this guide, many people might wonder if it
is possible to do so with Cypress, and the answer is yes!

Cypress loves the Testing Library project. We use Testing Library internally and
our philosophy aligns closely with Testing Library's ethos and approach to
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

The setup instructions are the same for end-to-end and component testing. Within
your **component support file**, import the custom commands.

```js
// cypress/support/component.js
// cy.findBy* commands will now be available.
// This calls Cypress.Commands.add under the hood
import '@testing-library/cypress/add-commands'
```

For TypeScript users, types are packaged along with the Testing Library package.
Refer to the latest setup instructions in the Testing Library docs.

</alert>

## Next Steps

Now that we have our component mounted, next we will learn how to write tests
against it.

<NavGuide prev="/guides/getting-started/quickstart-react" next="/guides/getting-started/testing-react" />
