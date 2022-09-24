---
title: Testing React Components
---

Now that the component is mounted, the next step is to start selecting and
interacting with parts of the component. This is the **Act** step in "Arrange,
Act, Assert".

Once we are done acting on the component, we can then verify the expected state
of the component is what we think it should be. This is the **Assert** step.

## Selecting the Stepper Component

By default, the Stepper component's counter is initialized to "0". It also has a
prop that can specify an initial count.

Let's test that mounting the component (Arrange) in its default state has a
count of "0" (Assert).

Then, we will test that setting the initial count also works.

In your spec file, add the following inside the existing `describe` block:

<code-group>
<code-block label="Stepper.cy.jsx" active>

```jsx
// Set up some constants for the selectors
const counterSelector = '[data-cy=counter]'
const incrementSelector = '[aria-label=increment]'
const decrementSelector = '[aria-label=decrement]'

it('stepper should default to 0', () => {
  // Arrange
  cy.mount(<Stepper />)
  // Assert
  cy.get(counterSelector).should('have.text', '0')
})

it('supports an "initial" prop to set the value', () => {
  // Arrange
  cy.mount(<Stepper initial={100} />)
  // Assert
  cy.get(counterSelector).should('have.text', '100')
})
```

> In the above example, we set up some variables to hold selector patterns so we
> don't have to type them again and again. See our guide on
> [selector best practices](/guides/references/best-practices#Selecting-Elements)
> for more info on how to write selectors.

</code-block>
</code-group>

### What Else Should You Test in This Component?

In the above tests, we arranged and asserted, but didn't act on the component.
We should also test that when a user interacts with the component by
clicking the "increment" and "decrement" buttons that the value of `count`
changes.

I want to pause here, though.

You'll notice that we're talking about how a user would interact with the
component, and not technical, React-specific concepts.

You can do a well-written, comprehensive test for our Stepper component by
approaching this test as a user would.

Don't think about `data`, `methods`, or `props`. Think solely about the UI and
use your test to automate what you would naturally do as a user.

You'll test the component thoroughly without getting bogged down in details. All
that matters is that if the developer uses the component with a given API, the
end-user will be able to use it as expected.

Now, let's test the Stepper component! Add the following tests:

1. You can increment and decrement the stepper

<code-group>
<code-block label="Stepper.cy.jsx" active>

```js
it('when the increment button is pressed, the counter is incremented', () => {
  // Arrange
  cy.mount(<Stepper />)
  // Act
  cy.get(incrementSelector).click()
  // Assert
  cy.get(counterSelector).should('have.text', '1')
})

it('when the decrement button is pressed, the counter is decremented', () => {
  // Arrange
  cy.mount(<Stepper />)
  // Act
  cy.get(decrementSelector).click()
  // Assert
  cy.get(counterSelector).should('have.text', '-1')
})
```

</code-block>
</code-group>

2. Next, run through the behavior of the Stepper as a user would. There is
   duplication of coverage here -- but that's okay because it exercises the
   component in a more real-world usage. This test is more likely to fail if
   there are _any_ issues in the component, not just with specific buttons or
   text rendered.

<code-group>
<code-block label="Stepper.cy.jsx" active>

```jsx
it('when clicking increment and decrement buttons, the counter is changed as expected', () => {
  cy.mount(<Stepper initial={100} />)
  cy.get(counterSelector).should('have.text', '100')
  cy.get(incrementSelector).click()
  cy.get(counterSelector).should('have.text', '101')
  cy.get(decrementSelector).click().click()
  cy.get(counterSelector).should('have.text', '99')
})
```

</code-block>
</code-group>

</code-block>
</code-group>

## Learn More

The [Introduction to Cypress](/guides/core-concepts/introduction-to-cypress)
guide goes deeper into how to write tests with Cypress.

## What's Next?

We're going to emit a custom event from our Stepper component and learn how to
test that it was called.

<NavGuide prev="/guides/component-testing/mounting-react" next="/guides/component-testing/events-react" />
