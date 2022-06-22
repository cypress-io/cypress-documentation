---
title: Testing Vue Components with Emitted Events
---

Emitted events, like props, are strictly part of the component's API. The end
user of your application is not even aware of the concept of emitted events.
This means that when you're testing emitted events, the _user_ you should keep
in mind while writing the test is the developer who will use your component.

You want to test the API contract of the component -- in Vue, a component's API
consists of props, slots, events, and **if necessary** the surrounding component
hierarchy.

Now, when you interact with the component, you should still do so as a user
would; however your assertions are focused on the developer's expectations. When
you interact with the component, does that component emit the correct events, at
the correct time, with the correct arguments?

# Testing Emitted Events

In the Stepper component, we bind native DOM click listeners with callbacks to
buttons that increment and decrement the Stepper's internal `counter`.

Because all of the state is managed internally, it is opaque to the developer or
parent component consuming the Stepper.

```html
<button aria-label="decrement" @click="counter--">-</button>
{{ counter }}
<button aria-label="increment" @click="counter++">+</button>
```

This can be fine, but depending on the needs of the developer, it can be
difficult for the _consumer of the Stepper_ (e.g. other components) to listen to
when change occurs or when the user interacts with the Stepper's various
buttons.

One solution is to `emit` an event called **change** to the consuming component
with the new internal state of the `Stepper`.

You would use the `<Stepper>` from a parent component like so:

```html
<div>
  What's your age?
  <Stepper @change="onAgeChange" />
  <!-- onAgeChange is a method the parent component defines -->
</div>
```

This is what the implementation would look like:

<code-group>
<code-block label="Composition" active>

```html
<template>
  <div data-testid="stepper">
    <button aria-label="decrement" @click="decrement">-</button>
    {{ count }}
    <button aria-label="increment" @click="increment">+</button>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  const props = defineProps(['initial'])

  const emit = defineEmits(['change'])

  const count = ref(props.initial || 0)

  const increment = () => {
    count.value++
    emit('change', count.value)
  }

  const decrement = () => {
    count.value--
    emit('change', count.value)
  }
</script>
```

</code-block>
<code-block label="Options">

```html
<template>
  <button aria-label="decrement" @click="decrement">-</button>
  {{ count }}
  <button aria-label="increment" @click="increment">+</button>
</template>

<script>
  export default {
    props: {
      initial: {
        type: Number,
        default: 0,
        required: false,
      },
    },
    data: () => ({
      count: 0,
    }),
    created() {
      this.count = this.initial
    },
    methods: {
      increment() {
        this.count++
        this.$emit('change', this.count)
      },
      decrement() {
        this.count--
        this.$emit('change', this.count)
      },
    },
  }
</script>
```

</code-block>
</code-group>

As the developer of the Stepper component, you want to make sure that when the
end user clicks the increment and decrement buttons, that the **change** event
is emitted to the consuming component.

We suggest using `spies` to accomplish this. It is still possible to use Vue
Test Util's own `emitted()` API, but the Vue Test Utils developers recommend
against doing so and would really rather you use the spy-based API Cypress ships
with.

## Using Spies

How do we test that the custom `change` event is firing the incremented and
decremented values for the Stepper? We can use spies when we **Arrange**,
**Act**, and **Assert** in our test.

### Arrange

First, we **Arrange** our test.

1. Let's setup the spies.

<code-group>
<code-block label="Stepper.cy.js" active>

```js
it('clicking increment fires a change event with the incremented value', () => {
  const onChangeSpy = cy.spy().as('onChangeSpy')
  // ...
})

it('clicking decrement fires a change event with the decremented value', () => {
  const onChangeSpy = cy.spy().as('onChangeSpy')
  // ...
})
```

</code-block>
</code-group>

<alert type="info">

We're aliasing the spy with `cy.as('aliasName')` so that the Cypress Reporter
prints out the name of the spy any time it is invoked. This lets you visually
inspect the arguments of the emitted event in your browser.

</alert>

2. Let's mount the component with the spies bound.

<code-group>
<code-block label="Stepper.cy.js" active>

```js
it('clicking + fires a change event with the incremented value', () => {
  const onChangeSpy = cy.spy().as('onChangeSpy')
  cy.mount(Stepper, { props: { onChange: onChangeSpy } })
})
```

</code-block>
<code-block label="Stepper.cy.jsx (With JSX)">

```jsx
it('clicking + fires a change event with the incremented value', () => {
  const onChangeSpy = cy.spy().as('onChangeSpy')
  cy.mount(() => <Stepper onChange={onChangeSpy} />)
})
```

</code-block>
</code-group>

<alert type="warning">

You may notice the syntax below relies on binding events to the `props` key in
mount. While this isn't "idiomatic Vue", it's the current signature of Vue Test
Utils.

In the future, Cypress may propose an API change to Vue Test Utils so that this
syntax feels more natural, because **onChange** isn't actually a prop -- it's an
event.

As such, JSX may feel more idiomatic. At Cypress, we use TSX for all of our Vue
tests.

</alert>

### Act

Next, we **Act** by firing a click event for the increment button.

<code-group>
<code-block label="Stepper.cy.js" active>

```js
const incrementSelector = '[aria-label=increment]'

it('clicking + fires a change event with the incremented value', () => {
  const onChangeSpy = cy.spy().as('onChangeSpy')
  cy.mount(Stepper, { props: { onChange: onChangeSpy } })
  cy.get(incrementSelector).click()
})
```

</code-block>
<code-block label="Stepper.cy.jsx (With JSX)">

```jsx
const incrementSelector = '[aria-label=increment]'

it('clicking + fires a change event with the incremented value', () => {
  const onChangeSpy = cy.spy().as('onChangeSpy')
  cy.mount(() => <Stepper onChange={onChangeSpy} />)
  cy.get(incrementSelector).click()
})
```

</code-block>
</code-group>

### Assert

Finally, we **Assert** that the `change` event was emitted with the correct
value.

<code-group>
<code-block label="Stepper.cy.js" active>

```js
const incrementSelector = '[aria-label=increment]'

it('clicking + fires a change event with the incremented value', () => {
  const onChangeSpy = cy.spy().as('onChangeSpy')
  cy.mount(Stepper, { props: { onChange: onChangeSpy } })

  cy.get(incrementSelector).click()
  cy.get('@onChangeSpy').should('have.been.calledWith', 1)
})
```

</code-block>
<code-block label="Stepper.cy.jsx (With JSX)">

```jsx
const incrementSelector = '[aria-label=increment]'

it('clicking + fires a change event with the incremented value', () => {
  const onChangeSpy = cy.spy().as('onChangeSpy')
  cy.mount(() => <Stepper onChange={onChangeSpy} />)

  cy.get(incrementSelector).click()
  cy.get('@onChangeSpy').should('have.been.calledWith', 1)
})
```

</code-block>
</code-group>

We may decide to combine this test with the previous tests we've written that
test multiple things at once in a given scenario.

This is up to the discretion of the developer. Combining tests will result in a
faster overall test run, however it may be more difficult to isolate why a test
failed in the first place. For end-to-end tests, because setup and visiting
pages is expensive, we recommend having longer tests. This is not necessarily a
problem for Component tests because they are comparatively quick.

## Using Vue Test Utils

In order to encourage interoperability between your existing component tests and
Cypress, we support using Vue Test Utils' API.

```js
cy.mount(Stepper).then((wrapper) => {
  // this is the Vue Test Utils wrapper
})
```

<!-- TODO: Custom mount command docs -->

If you intend to use the `wrapper` frequently and use Vue Test Util's API, we
recommend you write a [custom mount command]() and create a Cypress alias to get
back at the `wrapper`.

```js
import { mount } from 'cypress/vue'

Cypress.Commands.add('mount', (...args) => {
  return mount(...args).then((wrapper) => {
    return cy.wrap(wrapper).as('vue')
  })
})

// the "@vue" alias will now work anywhere
// after you've mounted your component
cy.mount(Stepper).doStuff().get('@vue') // The subject is now the Vue Wrapper
```

This means that you are able to get to the resulting `wrapper` returned from the
`mount` command and use `wrapper.emitted()` in order to gain access to Native
DOM events that were fired, as well as Custom Events that were emitted by your
component under test.

Because `wrapper.emitted()` is only data, and NOT spy-based you will have to
unpack its results to write assertions.

Your test failure messages will not be as helpful because you're not able to use
the Sinon-Chai library that Cypress ships, which comes with methods such as
`to.have.been.called` and `to.have.been.calledWith`.

Usage of the `cy.get('@vue')` alias may look something like the below code
snippet.

Notice that we're using the `'should'` function signature in order to take
advantage of Cypress's [retryability]() <!-- TODO: Retryability link -->. If we
chained using `cy.then` instead of `cy.should`, we may run into the kinds of
issues you have in Vue Test Utils tests where you have to use `await` frequently
in order to make sure the DOM has updated or any reactive events have fired.

<code-group>
<code-block label="With emitted" active>

```js
cy.mount(Stepper, { props: { initial: 100 } })
cy.get(incrementSelector).click()
cy.get('@vue').should((wrapper) => {
  expect(wrapper.emitted('change')).to.have.length
  expect(wrapper.emitted('change')[0][0]).to.equal('101')
})
```

</code-block>
<code-block label="With spies">

```js
const onChangeSpy = cy.spy().as('onChangeSpy')

cy.mount(Stepper, { props: { initial: 100, onChange: onChangeSpy } })

cy.get(incrementSelector).click()
cy.get('@onChangeSpy').should('have.been.calledWith', '101')
```

</code-block>

Regardless of our recommendation to use spies instead of the internal Vue Test
Utils API, you may decide to continue using `emitted` as it _automatically_
records every single event emitted from the component, and so you won't have to
create a spy for every event emitted.

This auto-spying behavior could be useful for components that emit _many_ custom
events.

<!-- TODO: do we need this still?
Cypress has custom DX and failure messages built-in to the Sinon spies that power Cypress's method spies and mocks, so we strongly recommend using the first option. -->

## What's Next?

We're going to create a container component and learn how to test slots.

<NavGuide prev="/guides/component-testing/props-vue" next="/guides/component-testing/slots-vue" />
