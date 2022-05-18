---
title: Mounting Components
---

Many tests, regardless of framework or type follow a similar format: **Arrange,
Act, and Assert**. This pattern "Arrange, Act, Assert" was first coined in 2001
by Bill Wilke and is explained thoroughly in his blog post
["3A - Arrange, Act, Assert"](https://xp123.com/articles/3a-arrange-act-assert/).

When it comes to component testing, mounting your component is where we
**Arrange** our component under test. It is analogous to visiting a page in an
End-to-End test.

This section covers how to mount **simple** Vue components in a Cypress test --
like Buttons, SVGs, Icons, or a Stepper component.

<!-- TODO: Switch between variants using a richer exp   erience than just rendering them in a flat list. A tabbed controller? IDK. -->

<div style="display: flex; grid-gap: 2rem;">

<button style="min-width: 120px; border: 1px solid indigo; padding: 0.5rem 0.5rem; border-radius: 3px;" >Outline</button>

<button style="min-width: 120px; background: indigo; color: white; font-weight: medium; border: 1px solid indigo; padding: 0.5rem 0.5rem; border-radius: 3px;" >Primary</button>

<button style="color: indigo; min-width: 120px; border: 1px solid indigo; padding: 0.5rem 0.5rem; border-radius: 3px;" ><icon name="graduation-cap" style="margin: 0 0.5rem;"></icon>With
an icon</button>

</div>

<!-- TODO: Add links for each key word -->

If your component uses plugins, mixins, global directives, network requests, or
other environmental setup, you will need to do additional work to get your
component mounting. This is covered later.

To follow along with this section, you can download the latest version of
Cypress and create a Vue application by following the
[Quickstart Guide](./quickstart-vue).

## What is the Mount Function?

For each front-end framework Cypress supports, we ship a `mount` function. It
can be imported from the `cypress` package. It is responsible for rendering your
component within Cypress's sandboxed iframe as well as handling any
framework-specific cleanup.

```js
import { mount } from 'cypress/vue'
```

### The Simplest Usage of Mount

You'll import the component you want to test and then use Cypress's normal API
to interact with the DOM rendered by your component.

If you're coming from Vue Test Utils, please note that the return value of
`mount` is not used.

Cypress Component tests can and should be agnostic to the framework internals
and accessing the [`wrapper`](https://test-utils.vuejs.org/api/#wrapper-methods)
that Vue Test Utils relies on is rarely necessary.

```js
import { mount } from 'cypress/vue'
import Stepper from './Stepper.vue'

describe('<Stepper>', () => {
  it('is visible', () => {
    mount(Stepper)
      .get('[data-testid=stepper]')
      .should('be.visible')
      .and('contain.text', '1')
  })
})
```

### Making cy.mount Available Anywhere

While you can import the `mount` function at the top of any file, you'll be
using it in every single component test, so we recommend adding it as a Cypress
Custom Command, where it will be available on the global `cy` API whenever you
need it.

This should have been done for you if you followed the
[automatic configuration]() wizard in the Launchpad, or if you scaffolded your
project using Vue's official starter.

Your component support file should look something like the code block below. It
will have registered the `mount` method as a Cypress Command and it will be
available in any Cypress test under `cy.mount`.

If you're using providers, plugins, directives, or other global app-level setup
in your Vue app, you'll want to follow the
"[Customizing cy.mount guide for Vue]()".

<!-- TODO: link to customizing cy.mount command -->

```js
// cypress/support/component.js
import { mount } from 'cypress/vue'

Cypress.Commands.add('mount', mount)

cy.mount // this command now works in any test!
```

### Optional JSX Support

The mount command supports the Vue Test Utils object syntax, but it can also be
used with Vue's JSX syntax (provided that you've configured your bundler to
support transpiling JSX or TSX files).

The object syntax for the mount function is identical to the Vue Test Utils
version you'd use with your application's version of Vue.

## Other Mounting Options

### Cypress and Testing Library

Cypress loves the Testing Library project. We use Testing Library internally at
Cypress! Cypress best practices align closely with Testing Library's ethos and
approach to writing tests, and we strongly endorse their best practices.

In particular, if you're looking for more resources to understand how we
recommend you approach testing your components, look to:

- [Guiding Principles - Testing Library](https://testing-library.com/docs/guiding-principles)
- [Priority of Queries - Testing Library](https://testing-library.com/docs/queries/about#priority)

For fans of
[Testing Library](https://testing-library.com/docs/cypress-testing-library/intro/),
you'll want to install `@testing-library/cypress` _instead_ of the
`@testing-library/vue` package.

```shell
npm i -D @testing-library/cypress
```

The setup instructions are the same for End-to-end and Component testing. Within
your **component support file**, import the custom commands.

```js
// cypress/support/component.js
// cy.findBy* commands will now be available.
// This calls Cypress.Commands.add under the hood
import '@testing-library/cypress/add-commands'
```

For TypeScript users, types are packaged along with the Testing Library package.
Refer to the latest setup instructions in the Testing Library docs.

### Cypress and Vue Test Utils

Vue Test Utils is the official **low-level testing library of Vue**.

Cypress's mount command is a thin wrapper around Vue Test Utils and shares an
identical signature.

<!-- Not necessary: Vue's own documentation recommends against using it directly and instead asks users to either use Vue Testing Library or Cypress. <!-- citation needed -->

The Cypress docs will cover many common use-cases for how to test Vue
components, however if you still need more information, please refer to the Vue
Test Utils documentation.

## Next Steps

Now that we have our component mounted, next we will learn how to write tests
against it.

<NavGuide prev="/guides/getting-started/quickstart-vue" next="/guides/getting-started/props-vue" />
