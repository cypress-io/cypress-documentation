---
title: Testing Vue Components with Slots
---

Slots are one of the most powerful language features in Vue. With the ability to
define fallback content, named slots, and scoped slots, they allow consuming
components to inject their own markup and styles.

Like props and events, slots are part of the component's public API.

Common components like Buttons and Inputs often use slots like "prefix" and
"suffix" to allow you to define icon placement.

Page-level layout components like a Sidebar or Footer also commonly make use of
slots.

Lastly, renderless components, like a Loading or ApolloQuery component make
heavy use of slots in order to define what to render for states like: error,
loading, and default (success).

We'll be showing off how to test a

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
