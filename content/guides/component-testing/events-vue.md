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
would; however your assertions are focused on the developer's expectations. Does
that component emit the correct events with the right arguments at the proper
time when interacting with the component?

## Testing Emitted Events

In the Stepper component, we bind native DOM click listeners with callbacks to
buttons that increment and decrement the internal counter value.

Because the component manages all of the state internally, it is opaque to the
developer or parent component consuming the Stepper.

```html
<button aria-label="decrement" @click="counter--">-</button>
<span data-cy="counter">{{ count }}</span>
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

Here is what the implementation would look like:

<code-group>
<code-block label="Stepper.vue" active>

```html
<template>
  <div>
    <button aria-label="decrement" @click="decrement">-</button>
    <span data-cy="counter">{{ count }}</span>
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
</code-group>

Above, we added a new `change` emitted event and abstracted the buttons `click`
events into their own methods.

As the developer of the Stepper component, you want to make sure that when the
end user clicks the increment and decrement buttons, that the **change** event
is emitted to the consuming component.

In Cypress, we use "spies" to accomplish this.

## Using Spies

How do we test that the custom `change` event is firing the incremented and
decremented values for the Stepper? We can use spies when we **Arrange**,
**Act**, and **Assert** in our test.

### Arrange

First, we **Arrange** our test.

Let's set up the spies and bind them to the component:

<code-group>
<code-block label="Stepper.cy.js" active>

```js
it('clicking + fires a change event with the incremented value', () => {
  // Arrange
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

> We're [aliasing](/guides/core-concepts/variables-and-aliases) the spy with
> `cy.as('onChangeSpy')` so that the Cypress Reporter prints out the name of the
> spy any time it is invoked. This lets you visually inspect the arguments of
> the emitted event in your browser. We are also able to acesss the spy by name
> later.

<alert type="warning">

You may notice the syntax above in the non-JSX example relies on binding events
to the `props` key in mount. While this isn't "idiomatic Vue", it's the current
signature of Vue Test Utils.

In the future, Cypress may propose an API change to Vue Test Utils so that this
syntax feels more natural, because **onChange** isn't actually a prop -- it's an
event.

As such, JSX may feel more idiomatic.

</alert>

### Act

Next, we **Act** by firing a click event for the increment button.

<code-group>
<code-block label="Stepper.cy.js" active>

```js
it('clicking + fires a change event with the incremented value', () => {
  // Arrange
  const onChangeSpy = cy.spy().as('onChangeSpy')
  cy.mount(Stepper, { props: { onChange: onChangeSpy } })
  // Act
  cy.get(incrementSelector).click()
})
```

</code-block>
<code-block label="Stepper.cy.jsx (With JSX)">

```jsx
it('clicking + fires a change event with the incremented value', () => {
  // Arrange
  const onChangeSpy = cy.spy().as('onChangeSpy')
  cy.mount(() => <Stepper onChange={onChangeSpy} />)
  // Act
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
it('clicking + fires a change event with the incremented value', () => {
  // Arrange
  const onChangeSpy = cy.spy().as('onChangeSpy')
  cy.mount(Stepper, { props: { onChange: onChangeSpy } })
  // Act
  cy.get(incrementSelector).click()
  // Assert
  cy.get('@onChangeSpy').should('have.been.calledWith', 1)
})
```

</code-block>
<code-block label="Stepper.cy.jsx (With JSX)">

```jsx
it('clicking + fires a change event with the incremented value', () => {
  // Arrange
  const onChangeSpy = cy.spy().as('onChangeSpy')
  cy.mount(() => <Stepper onChange={onChangeSpy} />)
  // Act
  cy.get(incrementSelector).click()
  // Assert
  cy.get('@onChangeSpy').should('have.been.calledWith', 1)
})
```

</code-block>
</code-group>

We may decide to combine this test with the previous tests we've written that
test multiple things at once in a given scenario.

Doing so is up to the discretion of the developer. Combining tests will result
in a faster overall test run. However, it may be more challenging to isolate why
a test failed in the first place. We recommend having longer tests for
end-to-end tests because setup and visiting pages are expensive. Longer tests
are not necessarily a problem for component tests because they are comparatively
quick.

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
recommend you write a [custom mount command](/api/commands/mount) and create a
Cypress alias to get back at the `wrapper`.

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
DOM events that were fired, as well as custom events that were emitted by your
component under test.

Because `wrapper.emitted()` is only data, and NOT spy-based you will have to
unpack its results to write assertions.

Your test failure messages will not be as helpful because you're not able to use
the Sinon-Chai library that Cypress ships, which comes with methods such as
`to.have.been.called` and `to.have.been.calledWith`.

Usage of the `cy.get('@vue')` alias may look something like the below code
snippet.

Notice that we're using the `'should'` function signature in order to take
advantage of Cypress's [retryability](/guides/guides/test-retries). If we
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

## Learn More

Spying is a powerful technique for observing behavior in Cypress. Learn more
about using Spies in our
[Stubs, Spies, and Clocks guide](/guides/guides/stubs-spies-and-clocks).

## What's Next?

We're going to create a container component and learn how to test slots.

<NavGuide prev="/guides/component-testing/testing-vue" next="/guides/component-testing/slots-vue" />
