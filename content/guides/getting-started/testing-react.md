---
title: Testing React Components
---

## Testing the Stepper Component

One of the props the `<Stepper />` component has is `initial`, which lets us
control the initial value of the stepper. Let's write a test verifying that the
stepper's initial value is `0` when we don't pass the `initial` prop and a
custom value when we do.

In your spec file, add the following tests inside the existing `describe` block:

<code-group>
<code-block label="Stepper.cy.jsx" active>

```jsx
// Set up some constants for the selectors
const stepperSelector = '[data-testid=stepper]'
const incrementSelector = '[aria-label=increment]'
const decrementSelector = '[aria-label=decrement]'

it('stepper should default to 0', () => {
  cy.mount(<Stepper />)
  cy.get(stepperSelector).should('contain.text', 0)
})

it('supports an "initial" prop to set the value', () => {
  cy.mount(<Stepper initial={100} />)
  cy.get(stepperSelector).should('contain.text', 100)
})
```

</code-block>
</code-group>

### What else should you test in this component?

We should also test that when a user interacts with the component by clicking
the "increment" and "decrement" buttons that the value of `count` changes.

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
  cy.mount(<Stepper />)
  cy.get(incrementSelector).click()
  cy.get(stepperSelector).should('contain.text', 1)
})

it('can be decremented', () => {
  cy.mount(<Stepper />)
  cy.get(decrementSelector).click()
  cy.get(stepperSelector).should('contain.text', -1)
})
```

</code-block>
</code-group>

2. Finally, test the Stepper as you would if you were to play with it as a user,
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

### Cypress and Testing Library

Cypress loves the Testing Library project. We use Testing Library internally at
Cypress! Cypress's philosophy aligns closely with Testing Library's ethos and
approach to writing tests, and we strongly endorse their best practices.

In particular, if you're looking for more resources to understand how we
recommend you approach testing your components, look to:

- [Guiding Principles - Testing Library](https://testing-library.com/docs/guiding-principles)
- [Priority of Queries - Testing Library](https://testing-library.com/docs/queries/about#priority)

For fans of
[Testing Library](https://testing-library.com/docs/cypress-testing-library/intro/),
you'll want to install `@testing-library/cypress` _instead_ of the
`@testing-library/react` package.

```shell
npm i -D @testing-library/cypress
```

The setup instructions are the same for end-to-end and component testing. Within
your **component support file**, import the custom commands.

```js
// cypress/support/component.js
// cy.findBy* commands will now be available.
// This calls Cypress.Commands.add under the hood
import '@testing-library/cypress/add-commands'
```

For TypeScript users, types are packaged along with the Testing Library package.
Refer to the latest setup instructions in the Testing Library docs.

## Learn More

...links to selectors, best practices, etc..

## What's next?

Next, we will look at how to listen to events coming from our component.
