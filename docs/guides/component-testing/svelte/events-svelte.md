---
title: Testing Svelte Components with Emitted Events
sidebar_position: 40
---

Emitted events, like props, are strictly part of the component's API. The end
user of your application is not even aware of the concept of emitted events.
This means that when you're testing emitted events, the _user_ you should keep
in mind while writing the test is the developer who will use your component.

You want to test the API contract of the component -- in Svelte, a component's
API consists of props, ctx, events, and **if necessary** the surrounding
component hierarchy.

Now, when you interact with the component, you should still do so as a user
would; however your assertions are focused on the developer's expectations. Does
that component emit the correct events with the right arguments at the proper
time when interacting with the component?

## Testing Emitted Events

In the Stepper component, we bind native DOM click listeners with callbacks to
buttons that increment and decrement the internal counter value.

Because the component manages all of the state internally, it is opaque to the
developer or parent component consuming the Stepper.

```jsx
<button aria-label="decrement" on:click={() => count--}>-</button>
<span data-cy="count">{{ count }}</span>
<button aria-label="increment" on:click={() => count++}>+</button>
```

This can be fine, but depending on the needs of the developer, it can be
difficult for the _consumer of the Stepper_ (e.g. other components) to listen to
when change occurs or when the user interacts with the Stepper's various
buttons.

One solution is to `dispatch` an event called **change** to the consuming
component with the new internal state of the `Stepper`.

You would use the `<Stepper>` from a parent component like so:

```jsx
<div>
  What's your age?
  <Stepper on:change={handleAgeChange} />
</div>
```

Here is what the implementation would look like:

```jsx title=Stepper.svelte
<script>
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  export let count = 0

  const decrement = () => {
    count--
    dispatch('change', { count })
  }

  const increment = () => {
    count++
    dispatch('change', { count })
  }
</script>

<button aria-label="decrement" on:click={decrement}>-</button>
<span data-cy="count">{ count }</span>
<button aria-label="increment" on:click={increment}>+</button>
```

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

```js title=Stepper.cy.js
it('clicking + fires a change event with the incremented value', () => {
  // Arrange
  const onChangeSpy = cy.spy().as('onChangeSpy')
  cy.mount(Stepper).then(({ component }) => {
    component.$on('change', onChangeSpy)
  })
})
```
> We're [aliasing](/guides/core-concepts/variables-and-aliases) the spy with
> `cy.as('onChangeSpy')` so that the Cypress Reporter prints out the name of the
> spy any time it is invoked. This lets you visually inspect the arguments of
> the emitted event in your browser. We are also able to acesss the spy by name
> later.

### Act

Next, we **Act** by firing a click event for the increment button.

```js title=Stepper.cy.js
it('clicking + fires a change event with the incremented value', () => {
  // Arrange
  const onChangeSpy = cy.spy().as('onChangeSpy')
  cy.mount(Stepper).then(({ component }) => {
    component.$on('change', onChangeSpy)
  })
  // Act
  cy.get(incrementSelector).click()
})
```

### Assert

Finally, we **Assert** that the `change` event was emitted with the correct
value.

```js title=Stepper.cy.js
it('clicking + fires a change event with the incremented value', () => {
  it('clicking + fires a change event with the incremented value', () => {
  // Arrange
  const onChangeSpy = cy.spy().as('onChangeSpy')
  cy.mount(Stepper).then(({ component }) => {
    component.$on('change', onChangeSpy)
  })
  // Act
  cy.get(incrementSelector).click()
  // Assert
  cy.get('@onChangeSpy').should('have.been.calledWithMatch', { detail: { count: 1 } })
})
```

We may decide to combine this test with the previous tests we've written that
test multiple things at once in a given scenario.

Doing so is up to the discretion of the developer. Combining tests will result
in a faster overall test run. However, it may be more challenging to isolate why
a test failed in the first place. We recommend having longer tests for
end-to-end tests because setup and visiting pages are expensive. Longer tests
are not necessarily a problem for component tests because they are comparatively
quick.

## Learn More

Spying is a powerful technique for observing behavior in Cypress. Learn more
about using Spies in our
[Stubs, Spies, and Clocks guide](/guides/guides/stubs-spies-and-clocks).

## What's Next?

Check out our example Svelte applications:

- [Svelte 3 Vite 3 with Typescript](https://github.com/cypress-io/cypress-component-testing-apps/tree/main/svelte-vite-ts)
- [Svelte 3 Webpack 5 with Typescript](https://github.com/cypress-io/cypress-component-testing-apps/tree/main/svelte-webpack-ts)
