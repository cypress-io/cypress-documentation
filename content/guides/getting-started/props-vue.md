---
title: Vue Components with Props
---

## Mounting Your First Component

Simple components with few environmental dependencies will be easiest to test.

Start with a `<Button>`, a `<Stepper>`, or the `<HelloWorld>` component that
comes with the initial Vue project scaffold. Here are a few examples of similar
components that will be easier or harder to test.

| Easier-to-test             | Harder-to-test                        |
| :------------------------- | :------------------------------------ |
| A Presentational Component | A Presentational Component w/ Vuetify |
| Layout Component w/ Slots  | Layout Component w/ Vue Router        |
| Product List with Props    | Product List w/ Pinia or Vuex         |

In this guide, we'll use a `<Stepper/>` component with zero dependencies and one
bit of internal state -- a simple "counter" that can be incremented and
decremented by two buttons.

We'll add one prop, called `initial` to set the initial value in the
`<Stepper>`.

Then, we'll emit a custom "change" event whenever the user clicks on the
increment and decrement buttons. Testing this is covered in
"[Testing Emitted Events]()".

We'll start simple and build out our Stepper as we go.

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

## Testing a Component with Props

We're going to add functionality to our `Stepper.vue` component.

We want to be able to control the _initial value of the stepper_. To do this,
we'll declare `initial` as an optional prop and test that the prop is used by
the component.

Here's the `Stepper.vue` component, with the `initial` prop set to **100**:
<stepper :initial="100"></stepper>

To test this component, we'll exercise the Stepper's API and validate that the
initial prop sets the internal `count` state for the first time.

<code-group>

<code-block label="Test" active>

```js
// Stepper.cy.js
it('supports an "initial" prop to set the value', () => {
  cy.mount(Stepper, { props: { initial: 100 } })
    .get('[data-testid=stepper]')
    .should('contain.text', 100)
})
```

</code-block>

<code-block label="With JSX" active>

```js
// Stepper.cy.jsx
it('supports an "initial" prop to set the value', () => {
  cy.mount(() => <Stepper initial={100} />)
    .get('[data-testid=stepper]')
    .should('contain.text', 100)
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
    props: {
      initial: {
        type: Number,
        default: 0,
        required: false
      }
    },
    data: () => ({
      count: 0
    },
    created() {
      this.count = this.initial
    }
  }
</script>
```

</code-block>

</code-group>

<Alert type="info">

Depending on your Vue version, the syntax for how to mount your component will
change slightly. Please always refer to the Vue Test Utils documentation for the
latest syntax when using the mount function's Object API.

The main difference is that "props" should be "propsData" for Vue 2
applications.

</Alert>

### What Else Should You Test in This Component?

We should also test that the `initial` prop is used to set the `counter`, which
is **reactive** and should change when the `increment` and `decrement` buttons
are clicked.

If we didn't interact with the component, our test wouldn't catch various logic
issues -- such as using `{{ initial }}` in the template, or hard-coding the
template to be `100`.

<alert type="info">

You'll notice that we're talking about technical, Vue-specific concepts. A
well-written, comprehensive test for our Stepper component can instead be done
by approaching this test like user would.

Don't think about `data`, `methods`, or `emitted` events. Think solely about the
UI and use your test to automate what you would naturally do as a user.

This way, you'll test the component thoroughly, without getting bogged down in
the technical details. At the end of the day, all that matters is that if the
developer uses the component with a given API, the end user will be able to use
it as expected.

</alert>

Now, let's render and interact with the Stepper component as a user would!

1. First, ensure that the initial value of the Stepper is correct

```js
const stepperSelector = '[data-testid=stepper]'

it('supports an initial prop', () => {
  cy.mount(Stepper, { props: { initial: 100 } })
    .get(stepperSelector)
    .should('contain.text', 100),
})
```

2. Next, ensure that you can increment and decrement the Stepper by clicking on
   the correct buttons.

```js
const stepperSelector = '[data-testid=stepper]'
const incrementSelector = '[aria-label=increment]'
const decrementSelector = '[aria-label=decrement]'

it('can be incremented', () => {
  cy.mount(Stepper)
    .get(incrementSelector)
    .click()
    .get(stepperSelector)
    .should('contain.text', 1)
})

it('can be decremented', () => {
  cy.mount(Stepper)
    .get(decrementSelector)
    .click()
    .get(stepperSelector)
    .should('contain.text', -1)
})
```

3. Finally, run through the behavior of the Stepper as a user would. There is
   duplication of coverage here -- but that's okay because it exercises the
   component in a more real-world usage. This test is more likely to fail if
   there are _any_ issues in the component, not just with specific buttons or
   text rendered.

<stepper initial="100"></stepper>

```js
const stepperSelector = '[data-testid=stepper]'
const incrementSelector = '[aria-label=increment]'
const decrementSelector = '[aria-label=decrement]'

it('has an initial counter that can be incremented and decremented', () => {
  cy.mount(Stepper, { props: { initial: 100 } })
    .get(stepperSelector)
    .should('contain.text', 100),
    .get(incrementSelector)
    .click()
    .get(stepperSelector)
    .should('contain.text', 101)
    .get(decrementSelector)
    .click()
    .click()
    .should('contain.text', 99)
})
```

<Alert type="info">

**Vue 2 vs. Vue 3**

Please refer to the
[Vue Test Utils migration guide](https://test-utils.vuejs.org/migration/) for
minor differences in the mount function's signature.

In general, this guide will be using Vue 3 syntax.

</Alert>

## Learn More

The [Introduction to Cypress](/guides/core-concepts/introduction-to-cypress)
guide goes deeper into how to write tests with Cypress.

## What's Next?

We're going to emit a custom event from our Stepper component.

<NavGuide prev="/guides/getting-started/mounting-vue" next="/guides/getting-started/events-vue" />
