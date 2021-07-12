# How to use Cypress Commands

We are starting to make some excellent progress thus far, but we have even more exciting things to learn. Within this lesson, we are going to learn about [Cypress commands](https://docs.cypress.io/api/cypress-api/custom-commands). Cypress commands are custom commands that we can write ourselves to make portions of our test code re-usable.

Commands are incredible useful and as your test suite grows larger, you will find yourself reaching for them more and more to help simplify and re-use portions of your test code.

For our specific use case, let's write a custom Cypress command that will create some default todo's for us. This way we will have a single line of code that will create some todo's in our app each time we use it.

Open the `cypress/support/commands.js` file. You will notice it has lots of code comments with instructions on how to create commands and where to go to learn more. For now, let's just delete all of these comments so we have a clean slate.

Next we will create a custom command that will add our default todo's to our app.

```jsx
Cypress.Commands.add('createDefaultTodos', () => {})
```

Let's first copy the variables from our test file into this new command.

```jsx
Cypress.Commands.add('createDefaultTodos', () => {
  const TODO_ITEM_ONE = 'Buy Milk'
  const TODO_ITEM_TWO = 'Pay Rent'
  const TODO_ITEM_THREE = 'Pickup Dry Cleaning'
})
```

Now let's add the ability to create our todos.

```jsx
Cypress.Commands.add('createDefaultTodos', () => {
  const TODO_ITEM_ONE = 'Buy Milk'
  const TODO_ITEM_TWO = 'Pay Rent'
  const TODO_ITEM_THREE = 'Pickup Dry Cleaning'

  cy.get('.new-todo')
    .type(`${TODO_ITEM_ONE}{enter}`)
    .type(`${TODO_ITEM_TWO}{enter}`)
    .type(`${TODO_ITEM_THREE}{enter}`)
})
```

Now let's update our second test to use this new command.

```jsx
it('adds three todos', () => {
  cy.createDefaultTodos()
  cy.get('.todo-list li').should('have.length', 3)
})
```

<DocsImage
src="/img/guides/real-world-testing/testing-your-first-app/how-to-user-cypress-commands/Screen_Shot_2021-06-25_at_12.02.31_PM.png"
alt="todo mvc app refactor"></DocsImage>

Great, our tests are still passing and our new command is working perfectly.

## Testing the order in which todos are added

Now let's write a simple test to make sure that each todo is added in the correct order, which means that each new todo is added to the bottom of the list.

First we will create a new `it()` block.

```jsx
it('should append new items to the bottom of the list', () => {})
```

Next we can use our new `createDefaultTodos()` to add some todo's to the app.

```jsx
it('should append new items to the bottom of the list', () => {
  cy.createDefaultTodos()
})
```

<DocsImage
src="/img/guides/real-world-testing/testing-your-first-app/how-to-user-cypress-commands/Screen_Shot_2021-06-25_at_12.08.55_PM.png"
alt="todo mvc app with all passing tests"></DocsImage>

Now let's make some assertions to make sure each todo is in the correct order.

```jsx
it('should append new items to the bottom of the list', () => {
  cy.createDefaultTodos()

  // Todo 1
  cy.get('.todo-list li').eq(0).find('label').should('contain', TODO_ITEM_ONE)

  // Todo 2
  cy.get('.todo-list li').eq(1).find('label').should('contain', TODO_ITEM_TWO)

  // Todo 3
  cy.get('.todo-list li').eq(2).find('label').should('contain', TODO_ITEM_THREE)
})
```

All tests are still passing.

While we are at it, we can also make an assertion that three todos have been added, however, let's do it in a different way than before.

In our previous tests we are asserting the number of todo's like so:

```jsx
cy.get('.todo-list li').should('have.length', 3)
```

This is completely valid, but there is also another way.

Within the bottom left hand corner of our app is some text that says "x items left" where x is the current number of todo's left to be completed.

Let's make an assertion that this text is displaying the correct message and number of todo's.

<DocsImage
src="/img/guides/real-world-testing/testing-your-first-app/how-to-user-cypress-commands/Screen_Shot_2021-06-25_at_12.16.12_PM.png"
alt="todo mvc app with chrome dev tools open"></DocsImage>

After finding the element with our dev tools, we can write the assertion like so:

```jsx
cy.get('.todo-count').contains('3 items left')
```

So our entire test now looks like this:

```jsx
it('should append new items to the bottom of the list', () => {
  cy.createDefaultTodos()

  // Todo 1
  cy.get('.todo-list li').eq(0).find('label').should('contain', TODO_ITEM_ONE)

  // Todo 2
  cy.get('.todo-list li').eq(1).find('label').should('contain', TODO_ITEM_TWO)

  // Todo 3
  cy.get('.todo-list li').eq(2).find('label').should('contain', TODO_ITEM_THREE)

  cy.get('.todo-count').contains('3 items left')
})
```

You will notice that our `.todo-count` is a `<span>` with multiple elements nested inside of it. The number is wrapped in a `<strong>` tag and the words are wrapped in `<span>` tags. The `.contains()` method will find the appropriate text even though it may be nested in several different tags 🔥

## Wrap Up

In this lesson, we learned how to create our own custom Cypress commands. We also refactored one of our tests to utilize our new command. Finally we learned about the `.contains()` method for finding text.
