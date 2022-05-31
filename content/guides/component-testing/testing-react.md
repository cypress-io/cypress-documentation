---
title: Testing React Components
---

Now that the component is mounted, the next step is to start selecting and
interacting with parts of the component. This is the **Act** step in "Arrange,
Act, Assert".

Once we are done acting on the component, we can then verify the expected state
of the component is what we think it should be. This is the **Assert** step.

## Selecting the Stepper Component

By default, the `<Stepper />` component's counter is initialized to "0". It also
has a prop that can specify an initial count.

Let's test that mounting the component (Arrange) in its default state has a
count of "0" (Assert).

Then, test that setting the initial count also works.

In your spec file, add the following tests inside the existing `describe` block:

<code-group>
<code-block label="Stepper.cy.jsx" active>

```jsx
// Set up some constants for the selectors
const stepperSelector = '[data-testid=stepper]'
const incrementSelector = '[aria-label=increment]'
const decrementSelector = '[aria-label=decrement]'

it('stepper should default to 0', () => {
  // Arrange
  cy.mount(<Stepper />)
  // Assert
  cy.get(stepperSelector).should('contain.text', 0)
})

it('supports an "initial" prop to set the value', () => {
  // Arrange
  cy.mount(<Stepper initial={100} />)
  // Assert
  cy.get(stepperSelector).should('contain.text', 100)
})
```

</code-block>
</code-group>

### What Else Should You Test in This Component?

In the above tests, we arranged and asserted, but didn't act on the component.
We should should also test that when a user interacts with the component by
clicking the "increment" and "decrement" buttons that the value of `count`
changes.

I want to pause here, though.

You'll notice that we're talking about technical, React-specific concepts. You
can do a well-written, comprehensive test for our stepper component by
approaching this test as a user would.

Don't think about `data`, `methods`, or `props`. Think solely about the UI and
use your test to automate what you would naturally do as a user.

You'll test the component thoroughly without getting bogged down in details. All
that matters is that if the developer uses the component with a given API, the
end-user will be able to use it as expected.

Now, let's test the Stepper component!

1. You can increment and decrement the stepper

<code-group>
<code-block label="Stepper.cy.jsx" active>

```js
it('can be incremented', () => {
  // Arrange
  cy.mount(<Stepper />)
  // Act
  cy.get(incrementSelector).click()
  // Assert
  cy.get(stepperSelector).should('contain.text', 1)
})

it('can be decremented', () => {
  // Arrange
  cy.mount(<Stepper />)
  // Act
  cy.get(decrementSelector).click()
  // Assert
  cy.get(stepperSelector).should('contain.text', -1)
})
```

</code-block>
</code-group>

2. Next, test the Stepper as you would if you were to play with it as a user,
   which we could consider an integration-style test.

<!-- <stepper initial="100"></stepper> -->

<code-group>
<code-block label="Stepper.cy.jsx" active>

```js
it('has an initial counter that can be incremented and decremented', () => {
  cy.mount(<Stepper initial={100} />)
  cy.get(stepperSelector).should('contain.text', 100)
  cy.get(incrementSelector).click()
  cy.get(stepperSelector).should('contain.text', 101)
  cy.get(decrementSelector).click().click().should('contain.text', 99)
})
```

</code-block>
</code-group>

## Learn More

The [Introduction to Cypress](/guides/core-concepts/introduction-to-cypress)
guide goes deeper into how to write tests with Cypress.

## What's Next?

Next, we will look at how to listen to events coming from our component.

<NavGuide prev="/guides/component-testing/mounting-react" next="/guides/component-testing/events-react" />
