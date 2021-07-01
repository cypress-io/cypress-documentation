# Cypress.log(), Snapshot & Aliases

When writing custom Cypress commands, it is often helpful to be able to output custom messages and information to the test runner which makes it easier to understand what is actually going on. Since Cypress commands are an abstraction, having proper logging information reminds you of the context and purpose the custom command has.

To learn how to utilize `Cypress.log` we are going to update our `createDefaultTodos` command to log some useful information.

Before we do that, let's update our test file to only run our `adds three todos` test. You can easily do this by appending `.only()` to our test, like so:

```jsx
it.only('adds three todos', () => {
  cy.createDefaultTodos()
  cy.get('.todo-list li').should('have.length', 3)
})
```

This will tell Cypress to only execute this test in our file. You can add `.only()` to multiple tests if you like, and only those tests will be executed.

Save the file, and now Cypress is only running this specific test.

We are going to be updating our command with the following:

```jsx
Cypress.log({
  name: 'create default todos',
  consoleProps() {
    return {
      'Inserted Todos': [TODO_ITEM_ONE, TODO_ITEM_TWO, TODO_ITEM_THREE],
    }
  },
})
```

Before we do, however, let's go over what this is doing.

First, we are passing an object to `Cypress.log()` with a name and `consoleProps()`. The `consoleProps()` function, allows us to create our own custom message that will be printed to our browsers console whenever we click on it within the test runner. We will see this in action shortly.

Now let's update our custom command in `cypress/support/commands.js` , with our log.

```jsx
Cypress.Commands.add('createDefaultTodos', () => {
  const TODO_ITEM_ONE = 'Buy Milk'
  const TODO_ITEM_TWO = 'Pay Rent'
  const TODO_ITEM_THREE = 'Pickup Dry Cleaning'

  Cypress.log({
    name: 'create default todos',
    consoleProps() {
      return {
        'Inserted Todos': [TODO_ITEM_ONE, TODO_ITEM_TWO, TODO_ITEM_THREE],
      }
    },
  })

  cy.get('.new-todo')
    .type(`${TODO_ITEM_ONE}{enter}`)
    .type(`${TODO_ITEM_TWO}{enter}`)
    .type(`${TODO_ITEM_THREE}{enter}`)
})
```

After saving the file, you should see the following in the test runner:

<DocsImage
src="/img/guides/real-world-testing/testing-your-first-app/cypress-log-snapshot-and-aliases/Screen_Shot_2021-06-28_at_10.18.03_AM.png"
alt="todo mvc app with three todos"></DocsImage>

<DocsImage
src="/img/guides/real-world-testing/testing-your-first-app/cypress-log-snapshot-and-aliases/Screen_Shot_2021-06-28_at_10.19.14_AM.png"
alt="close up of custom cypress command"></DocsImage>

You will see the name we passed to `Cypress.log()` at the top of our "TEST BODY" and after clicking on it you should see our custom message printed out to the dev console.

<DocsImage
src="/img/guides/real-world-testing/testing-your-first-app/cypress-log-snapshot-and-aliases/Screen_Shot_2021-06-28_at_10.20.24_AM.png"
alt="cypress custom log in console"></DocsImage>

This is a very handy way of providing additional information and context as to what our custom command is actually doing.

If you look on the left hand side of the runner, within the "TEST BODY," you will see some output that we don't actually need anymore. For instance, we don't need the runner to log out each time it types a new todo. We are already providing this information in our custom log message. We can prevent this output by passing `{ log: false }` like so:

```jsx
cy.get('.new-todo', { log: false })
  .type(`${TODO_ITEM_ONE}{enter}`, { log: false })
  .type(`${TODO_ITEM_TWO}{enter}`, { log: false })
  .type(`${TODO_ITEM_THREE}{enter}`, { log: false })
```

Save the file, and now the output should be much cleaner.

<DocsImage
src="/img/guides/real-world-testing/testing-your-first-app/cypress-log-snapshot-and-aliases/Screen_Shot_2021-06-28_at_10.25.26_AM.png"
alt="todo mvc app with all passing tests"></DocsImage>

## Aliases

Aliases in Cypress provide a way for you to reference something later on in your test. You can think of it like a variable where you are storing something which can then be utilized later on. Within our custom command to `createDefaultTodos` we can return our newly created todo's from the command, which we can then access as an alias within our test. Aliases can be used for all sorts of things, but in our case we simply want to alias the todo elements or `<li>'s` from the DOM. This will make more sense when we break down the code involved and update our test to use this alias.

The first thing we want to do is store our newly created log into a variable.

```jsx
let cmd = Cypress.log({
  name: 'create default todos',
  consoleProps() {
    return {
      'Inserted Todos': [TODO_ITEM_ONE, TODO_ITEM_TWO, TODO_ITEM_THREE],
    }
  },
})
```

Then we want to grab all of the newly created todo `<li>'s` and make them available to be aliased, like so:

```jsx
cy.get('.todo-list li', { log: false }).then(function ($listItems) {
  cmd.set({ $el: $listItems }).end()
})
```

First, we are grabbing all of the `.todo-list` `<li>` elements, which are three todos. We are also turning off logging for `.get()` to the test runner.

`.then()` we are putting those elements into a variable called `$listItems` which we then `.set()` on our `Cypress.log()` .

Finally, we use `[.end()](https://docs.cypress.io/api/commands/end)` to let Cypress now that our command is finished.

After saving the file, our test should still be passing but nothing has really changed, as we are not using our todo items as an alias. Let's update one of our tests to take advantage of this alias.

We will be updating our test called `adds three todos` like so:

```jsx
it.only('adds three todos', () => {
  cy.createDefaultTodos().as('todos')
  cy.get('@todos').should('have.length', 3)
})
```

After saving the file, our test is still passing and the runner has also logged our new alias.

<DocsImage
src="/img/guides/real-world-testing/testing-your-first-app/cypress-log-snapshot-and-aliases/Screen_Shot_2021-06-28_at_10.48.45_AM.png"
alt="todo mvc app with passing tests"></DocsImage>

Now the test runner specifically states that our `.get()` is getting `@todos` which is the alias we just created.

## Snapshot

Before we wrap up this lesson, we would like to introduce you to the `.snapshot()` method. Currently, when you click on our custom `createDefaultTodos` command in the test runner you will see the following.

<DocsImage
src="/img/guides/real-world-testing/testing-your-first-app/cypress-log-snapshot-and-aliases/Screen_Shot_2021-06-28_at_10.52.41_AM.png"
alt="cypress DOM snapshot"></DocsImage>

There isn't any ui on the right hand side even though the runner says "DOM Snapshot (pinned)" at the bottom. The reason being is that we have not told Cypress to specifically take a snapshot of the DOM in our custom command. We can easily update our command like so to get what we need.

```jsx
cy.get('.todo-list li', { log: false }).then(function ($listItems) {
  cmd.set({ $el: $listItems }).snapshot().end()
})
```

After saving the file you should now see the following:

<DocsImage
src="/img/guides/real-world-testing/testing-your-first-app/cypress-log-snapshot-and-aliases/Screen_Shot_2021-06-28_at_10.54.26_AM.png"
alt="cypress DOM snapshot"></DocsImage>

Next to the "DOM Snapshot (pinned)" you will see two buttons with a 1 and 2 respectively. Button 1 is selected by default and doesn't display anything, however, clicking on button 2 will show a snapshot of the DOM with our three newly created todos.

<DocsImage
src="/img/guides/real-world-testing/testing-your-first-app/cypress-log-snapshot-and-aliases/Screen_Shot_2021-06-28_at_10.54.29_AM.png"
alt="cypress DOM snapshot"></DocsImage>

## Practice

Update the `should append new items to the bottom of the list` test to use an alias just like we did in the `adds three todos` test.

## Wrap Up

In this lesson, we learned how to log custom information to the test runner and the browser's console. We also learned how to hide logging information from the runner with `{ log: false }` . We also learned how to create and use aliases within our custom command. Finally, we learned how to tell Cypress to take snapshots of the DOM within our custom command.
