---
title: Writing Vue Component Tests
---

Many tests, regardless of framework, follow a similar format: "Arrange", "Act",
and "Assert".

This section covers how to mount Vue components in a Cypress test.

To follow along, you can download the latest version of Cypress and create a Vue
application.

## Quickstart: Create a Vue Application with Cypress

The quickest way to get started writing component tests for Vue is to use Vue's
own project scaffolding tool, and then to install and open Cypress. This will
launch Cypress's automatic configuration utility and create all the necessary
files for getting started.

```sh
npm create vue
npm install cypress -D
npx cypress open
```

<!-- TODO: link to framework configuration section of the documentation -->

A detailed walk-through of the Cypress wizard is available within the
[Framework Configuration]() section of the docs.

## Mounting your first component

Simple components with few dependencies will be easier to test.

In this guide, we'll use a `<Stepper/>` component with zero dependencies, one
prop, one bit of internal state, and one emitted event. We'll start simple and
build out our Stepper as we go.

Our `Stepper.vue` component: <stepper></stepper>

<code-group>

<code-block label="Test" active>

```js
// Stepper.cy.js
it('renders the Stepper, with a default of 0', () => {
  cy.mount(Stepper)
})
```

</code-block>

<code-block label="With JSX" active>

```js
// Stepper.cy.jsx
// JSX for Vue components? Yes, and for good reason!
// See the section on JSX in Vue below
it('renders the Stepper, with a default of 0', () => {
  cy.mount(() => <Stepper />)
})
```

</code-block>

<code-block label="Stepper.vue">

```html
<template>
  <div data-testid="stepper">
    <button aria-label="decrement" @click="count--">-</button>
    {{ count }}
    <button aria-label="increment" @click="count++">+</button>
  </div>
</template>

<script>
  export default {
    data: () => ({
      count: 0
    }
  }
</script>
```

</code-block>

</code-group>

## The Mount Function

For each frontend framework Cypress supports, we ship a `mount` function.

```js
import { mount } from 'cypress/vue'
```

If you followed the Component Testing setup wizard, your component support file
will have registered this method as a Cypress Command that's available in any
Cypress test under `cy.mount`.

```js
// cypress/support/component.js
import { mount } from 'cypress/vue'

Cypress.Commands.add('mount', mount)

cy.mount // this command now works in any test!
```

### Working with cy.mount

The mount function can be used with either a JSX syntax (provided that you've
configured your bundler to support transpiling JSX or TSX files) or an object
syntax.

The object syntax for the mount function is identical to the Vue Test Utils
version you'd use with your application's version of Vue.

#### cy.mount is a thin wrapper on top of Vue Test Utils

The Vue mounting library for Cypress is a thin wrapper around Vue Test Utils and
shares an identical signature.

Vue Test Utils is the official low-level testing library of Vue.

Vue's own documentation recommends against using it directly and instead asks
users to either use Vue Testing Library or Cypress. <!-- citation needed -->

This guide will cover many common use-cases for how to test Vue components,
however if you still need more information, please refer to the Vue Test Utils
documentation.

#### Testing a component with props

Depending on your Vue version, the syntax for how to mount your component will
change slightly.

<Alert type="info">

**Vue 2 vs. Vue 3**

Please refer to the
[Vue Test Utils migration guide](https://test-utils.vuejs.org/migration/) for
minor differences in the mount function's signature.

In general, this guide will be using Vue 3 syntax.

</Alert>

### Why JSX is helpful for your Vue component tests

JSX is not supported out of the box for Vue projects and is not considered to be
"idiomatic Vue".

Even so, when writing Cypress component tests, JSX is extremely useful because
it allows us to more easily:

1. Pass in spies to emitted events
2. Create custom DOM wrappers and styles
3. Make our components reactive when the parent controls state
4. Elegantly provide slots

#### Default slots

Most re-usable components in Vue make use of default slots.

Consider pulling out the content you expect to be rendered into a variable,
passing it into the component's render function, and then use it in an assertion
later on.

```jsx
it('renders a button', () => {
  const text = 'My awesome button!'
  cy.mount(() => <CustomButton>{text}</CustomButton>).contains(text)
})
```

#### Named slots

Another powerful feature of Vue is Named Slots.

In the below example, we want to make sure that the CustomButton is rendering
the `prefixIcon` slot when it's passed in.

Notice that when we test for the name slot's existence we pass in our own
selector to ensure that it's not only rendered, but **visible**.

If our component were to

<code-group>

<code-block label="With slot" active>

```jsx
it('renders a prefix-icon slot when passed in', () => {
  const text = 'My awesome button!'
  const prefixIcon = () => <span data-testid="my-prefix">🚀</span>

  const slots = {
    default: () => text,
    prefixIcon,
  }

  cy.mount(() => <CustomButton vSlots={slots} />)
    .contains(text)
    .get('[data-testid=my-prefix]')
    .should('be.visible')
    .and('have.text', '🚀')
})
```

</code-block>

<code-block label="Without slot">

```jsx
it('does not render the prefix-icon slot when not passed in', () => {
  const text = 'My awesome button!'

  cy.mount(() => <CustomButton>{text}</CustomButton>)
    .contains(text)
    .get('[data-testid=custom-button-prefix]')
    .should('not.exist')
})
```

</code-block>

<code-block label="Source">

```html
<template>
  <button>
    <!-- Additional styles omitted for brevity -->
    <span
      v-if="$slots.prefixIcon"
      data-testid="custom-button-prefix"
      style="margin-right: 0.85rem;"
    >
      <slot name="prefix-icon" />
    </span>

    <slot />
  </button>
</template>
```

</code-block>

</code-group>

#### Scoped slots

In Vue's JSX syntax, props are provided as the first argument to a scoped slot.

<code-group>

<code-block label="Test" active>

```jsx
it('exposes the number of times the button has been pressed', () => {
  const defaultSlotSelector = '[data-testid=content]'
  const text = 'My awesome button!'
  const slots = {
    default: ({ totalClicks }) => <span data-testid="content">Clicked: { totalClicks } times</span>,
  }

  cy.mount(() => <CustomButton vSlots={slots} />)
    .get(defaultSlotSelector)
    .should('contain.text', '0')
    .click()
    .get(defaultSlotSelector)
    .should('contain.text', '1')
    .click()
    .get(defaultSlotSelector)
    .should('contain.text', '2')
```

</code-block>

<code-block label="Source">

```html
<template>
  <button @click="totalClicks++">
    <slot :totalClicks="totalClicks" />
  </button>
</template>
```

</code-block>

</code-group>

<code-group>
<code-block label="Source (Object API)">

```js
export default {
  props: {
    initial: {
      type: Number,
      default: 0,
    },
  },
}
```

</code-block>

<code-block label="Source (Composition)">

```js
defineProps({
  initial: {
    type: Number,
    default: 0,
  },
})
```

</code-block>

<code-block label="Vue 3 Test" active>

```js
cy.mount(Stepper, { props: { initial: 10 } })
```

</code-block>
<code-block label="Vue 2 Test">

```js
cy.mount(Stepper, { propsData: { initial: 10 } })
```

</code-block>
</code-group>
