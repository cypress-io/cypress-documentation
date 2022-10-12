---
title: 'Svelte Component Testing'
---

## Framework Support

Cypress Component Testing supports Svelte 3+ in a variety of different
frameworks:

- Svelte with Vite
- Svelte with Webpack

## Tutorial

Visit the [Svelte Quickstart Guide](/guides/component-testing/quickstart-svelte)
for a step-by-step tutorial.

## Installation

To get up and running with Cypress Component Testing in Svelte, install Cypress
into your project:

```bash
npm i cypress -D
```

Open Cypress:

```bash
npx cypress open
```

<DocsImage 
  src="/img/guides/component-testing/select-test-type.jpg" 
  caption="Choose Component Testing"> </DocsImage>

The Cypress Launchpad will guide you through configuring your project.

For a step-by-step guide through the installation wizard, refer to the
[Configure Component Testing](/guides/component-testing/quickstart-svelte#Configuring-Component-Testing)
section of the Svelte quickstart guide.

## Usage

### What is the Mount Function?

We ship a `mount` function that is imported from the `cypress` package. It is
responsible for rendering components within Cypress's sandboxed iframe and
handling any framework-specific cleanup.

```js
import { mount } from 'cypress/svelte'
```

While you can use the `mount` function in your tests, we recommend using
[`cy.mount()`](/api/commands/mount), which is added as a
[custom command](/api/cypress-api/custom-commands) in the
**cypress/support/component.js** file:

<code-group>
<code-block label="cypress/support/component.js" active>

```ts
import { mount } from 'cypress/svelte'

Cypress.Commands.add('mount', mount)
```

</code-block>
</code-group>

This allows you to use `cy.mount()` in any component test without having to
import the framework-specific mount command, as well as customizing it to fit
your needs. For more info, visit the
[Custom Mount Commands](/guides/component-testing/examples-svelte#Custom-Mount-Commands)
section in the Svelte examples.

### Using `cy.mount()`

To mount a component with `cy.mount()`, import the component and pass it to the
method:

```ts
import { Stepper } from './stepper.svelte'

it('mounts', () => {
  cy.mount(Stepper)
})
```

### Passing Data to a Component

You can pass props to a component by setting props in the options: `cy.mount()`:

```ts
it('mounts', () => {
  cy.mount(Stepper, { props: { count: 100 } })
})
```

### Accessing the Component Instance

There might be times when you might want to access the component instance
directly in your tests. To do so, use `.then()`, which enables us to work with
the subject that was yielded from the `cy.mount()` command.

```js
cy.mount(Stepper).then(({ component }) => {
  //component is the rendered instance of Stepper
})
```

### Testing Events

To test emitted events from a Svelte component, we can use access the component
instances and use `$on` method to listen to events raised. We can also pass in a
Cypress spy so we can query the spy later for results. In the example below, we
listen to the `change` event and validate it was called as expected:

```js
it('clicking + fires a change event with the incremented value', () => {
  const changeSpy = cy.spy().as('changeSpy')
  cy.mount(Stepper).then(({ component }) => {
    component.$on('change', changeSpy)
  })
  cy.get('[data-cy=increment]').click()
  cy.get('@changeSpy').should('have.been.calledWithMatch', {
    detail: { count: 1 },
  })
})
```
