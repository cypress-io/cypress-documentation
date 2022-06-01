---
title: Testing React Components with Events
---

Events are strictly part of the component's API. The end-user of your
application is not even aware of the concept of events. When you're testing
events, the _user_ you should keep in mind while writing the test is the
developer who will use your component.

You want to test the API contract of the component -- in React, a component's
API consists of props and, **if necessary**, the surrounding component
hierarchy.

When you interact with the component, you should still do so as a user would;
however, your assertions focus on the developer's expectations. Does that
component emit the correct events with the right arguments at the proper time
when interacting with the component?

## Testing Events

In the Stepper component, we bind React `onClick` listeners with callbacks to
buttons that increment and decrement the internal counter value.

Because the component manages all of the state internally, it is opaque to the
developer or parent component consuming the Stepper.

```jsx
<div data-testid="stepper">
  <button aria-label="decrement" onClick={setCount(count - 1)}>
    -
  </button>
  {count}
  <button aria-label="increment" onClick={setCount(count + 1)}>
    +
  </button>
</div>
```

This can be fine, but depending on the needs of the developer, it can be
difficult for the _consumer of the Stepper_ (e.g. parent components) to know
when change occurs or when the user interacts with the Stepper's various
buttons.

One solution is to accept an `onChange` prop and call it when the internal state
of the `Stepper` changes.

You would use the `<Stepper>` from a parent component like so:

```jsx
<div>
  What's your age?
  <Stepper onChange={onAgeChange} />
  <!-- onAgeChange is a method the parent component defines -->
</div>
```

Here is what the implementation would look like:

<code-group>

<code-block label="Stepper.jsx" active>

```jsx
export default function Stepper({ initial = 0, onChange = () => {} }) {
  const [count, setCount] = useState(initial)

  const increment = () => {
    const newCount = count + 1
    setCount(newCount)
    onChange(newCount)
  }

  const decrement = () => {
    const newCount = count - 1
    setCount(newCount)
    onChange(newCount)
  }

  return (
    <div data-testid="stepper">
      <button aria-label="decrement" onClick={decrement}>
        -
      </button>
      {count}
      <button aria-label="increment" onClick={increment}>
        +
      </button>
    </div>
  )
}
```

</code-block>
</code-group>

Above, we added a new `onChange` prop and abstracted the buttons `onClick`
events into their own methods.

As the developer of the Stepper component, you want to make sure that when the
end-user clicks the increment and decrement buttons, that the **onChange** prop
is called to the consuming component.

In tests, we use "spies" to accomplish this.

## Using Spies

How do we test that the custom `onChange` prop is called with the incremented
and decremented values for the Stepper? We can use spies and **Arrange**,
**Act**, and **Assert** on the Stepper.

### Arrange

First, we **Arrange** our test.

Let's set up the spies and bind them to the component:

<code-group>
<code-block label="Stepper.cy.jsx" active>

```jsx
it('clicking + fires a change event with the incremented value', () => {
  // Arrange
  const onChangeSpy = cy.spy().as('onChangeSpy')
  cy.mount(Stepper, { props: { onChange: onChangeSpy } })
})
```

</code-block>
</code-group>

<alert type="info">

We're aliasing the spy with `cy.as('aliasName')` so that the Cypress Reporter
prints out the spy's name any time it is invoked. Doing so lets you visually
inspect the arguments of the emitted event in your browser.

</alert>

### Act

Next, we **Act** by firing a click event for the increment button.

<code-group>
<code-block label="Stepper.cy.jsx" active>

```jsx
it('clicking + fires a change event with the incremented value', () => {
  // Arrange
  const onChangeSpy = cy.spy().as('onChangeSpy')
  cy.mount(<Stepper onChange={onChangeSpy} />)
  // Act
  cy.get(incrementSelector).click()
})
```

</code-block>
</code-group>

### Assert

Finally, we **Assert** that the `onChange` prop was called with the correct
value.

<code-group>
<code-block label="Stepper.cy.jsx" active>

```jsx
it('clicking + fires a change event with the incremented value', () => {
  // Arrange
  const onChangeSpy = cy.spy().as('onChangeSpy')
  cy.mount(<Stepper onChange={onChangeSpy} />)
  // Act
  cy.get(incrementSelector).click()
  // Assert
  cy.get('@onChangeSpy').should('have.been.called.with', 1)
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

## Learn More

Spying is a powerful technique for observing behavior in Cypress. Learn more
about using Spies in our
[Stubs, Spies, and Clocks guide](/guides/guides/stubs-spies-and-clocks)

## What's Next?

Congratulations, you covered the basics for component testing!

Next, we will dive into more advanced topics such as how to customize our mount
command.

<NavGuide prev="/guides/component-testing/testing-react" next="/guides/component-testing/custom-mount-react" />
