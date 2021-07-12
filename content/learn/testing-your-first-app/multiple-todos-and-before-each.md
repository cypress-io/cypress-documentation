# Multiple todos & beforeEach()

Now that we have our first test under our belt, let's write some more and learn about some new Cypress features along the way.

Our first test simply makes sure that a single todo can be added to our application. However, a todo app that only takes a single todo is basically useless. So let's write a test to make sure our app can add multiple todos.

First, we need to create another `it` function. We will test that our app can add three todos, so we will name our `it` function like so.

```jsx
describe('React TodoMVC', () => {
  it('adds a single todo', () => {
    cy.visit('http://127.0.0.1:8888')
    cy.get('.new-todo').type('Buy Milk{enter}')
    cy.get('.todo-list li').should('have.length', 1)
  })

  it('adds three todos', () => {})
})
```

Remember, the first thing we need to do is to tell Cypress to navigate to our app. Each `it` function is a completely separate test, so for each new test we write we have to specifically tell Cypress to `navigate` to our application.

You may start to see a potential annoyance here. Granted, since we only have two tests right now, this is not that big of a deal but what if our test file had several tests. This would mean that within every single `it()` we would have to specifically tell Cypress to `navigate` to our app for each test, which is very repetitive and annoying. There is a better way fortunately.

## beforeEach()

Cypress provides something called the `beforeEach()` function which is perfect for code that you want executed before each and every single test. This is exactly what we need to handle navigating to our app for each test. Let's update our test file to use this function like so:

```jsx
describe('React TodoMVC', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:8888')
  })

  it('adds a single todo', () => {
    cy.get('.new-todo').type('Buy Milk{enter}')
    cy.get('.todo-list li').should('have.length', 1)
  })

  it('adds three todos', () => {})
})
```

With this simple update, both of our tests are still passing and we have cleaned up our duplicate code.

The `beforeEach()` is a great way to perform any kind of setup your tests may need in a single place and helps to keep your tests `DRY` .

## Multiple Todos

Now let's update our `adds three todos` test to add three todos.

```jsx
it('adds three todos', () => {
  cy.get('.new-todo').type('Buy Milk{enter}')
  cy.get('.new-todo').type('Pay Rent{enter}')
  cy.get('.new-todo').type('Pickup Dry Cleaning{enter}')
})
```

<DocsImage
src="/img/guides/real-world-testing/testing-your-first-app/multiple-todos-and-before-each/Screen_Shot_2021-06-25_at_11.19.56_AM.png"
alt="todo mvc app with three todos"></DocsImage>

Great our application can easily handle adding three todos.

However, you may have noticed we are repeating ourselves once again.

```jsx
it('adds a single todo', () => {
  cy.get('.new-todo').type('Buy Milk{enter}') // Same todo
  cy.get('.todo-list li').should('have.length', 1)
})

it('adds three todos', () => {
  cy.get('.new-todo').type('Buy Milk{enter}') // Same todo
  cy.get('.new-todo').type('Pay Rent{enter}')
  cy.get('.new-todo').type('Pickup Dry Cleaning{enter}')
})
```

Instead of having to manually type out and hard code each and every todo, we can simply put them into a variable. Remember, Cypress is just JavaScript at the end of the day, so let's refactor the names of our todos into variables so we can easily re-use them.

We will create variables at the top of our test, just underneath the `describe()` block.

```jsx
describe('React TodoMVC', () => {
  const TODO_ITEM_ONE = 'Buy Milk'
  const TODO_ITEM_TWO = 'Pay Rent'
  const TODO_ITEM_THREE = 'Pickup Dry Cleaning'

  beforeEach(() => {
    cy.visit('http://127.0.0.1:8888')
  })

// ...
```

Then we can simply update our todo's to use these new variables.

```jsx
describe('React TodoMVC', () => {
  const TODO_ITEM_ONE = 'Buy Milk'
  const TODO_ITEM_TWO = 'Pay Rent'
  const TODO_ITEM_THREE = 'Pickup Dry Cleaning'

  beforeEach(() => {
    cy.visit('http://127.0.0.1:8888')
  })

  it('adds a single todo', () => {
    cy.get('.new-todo').type(`${TODO_ITEM_ONE}{enter}`)
    cy.get('.todo-list li').should('have.length', 1)
  })

  it('adds three todos', () => {
    cy.get('.new-todo').type(`${TODO_ITEM_ONE}{enter}`)
    cy.get('.new-todo').type(`${TODO_ITEM_TWO}{enter}`)
    cy.get('.new-todo').type(`${TODO_ITEM_THREE}{enter}`)
  })
})
```

Much better. Now we can easily re-use these todos throughout our tests.

Finally, let's add an assertion like we did in our first test to make sure only three todo's have been added. Like so:

```jsx
it('adds three todos', () => {
  cy.get('.new-todo').type(`${TODO_ITEM_ONE}{enter}`)
  cy.get('.new-todo').type(`${TODO_ITEM_TWO}{enter}`)
  cy.get('.new-todo').type(`${TODO_ITEM_THREE}{enter}`)
  cy.get('.todo-list li').should('have.length', 3)
})
```

And all of our tests are passing. Awesome!

## Making our tests more robust

So we currently have two tests, one that confirms we can add a single todo and another that confirms we can add three todos, or multiple todos. This is great and useful, but we can take these tests a step further to make them even more robust. For example, shouldn't we also test that the todo's we create render the correct text within the app? That seems like a useful thing to test, so let's update our tests to do just that.

Let's first try this out, but updating our first test which just adds a single todo. Once we get that working we can add this assertion to the other test.

If we inspect our app with our dev tools again, we want to make sure that the text that we enter into the input field is rendered exactly as one of our todos. We can see that within each `<li>` each todo name is wrapped in a `<label>` element.

<DocsImage
src="/img/guides/real-world-testing/testing-your-first-app/multiple-todos-and-before-each/Screen_Shot_2021-06-25_at_11.32.00_AM.png"
alt="todo mvc app with chrome dev tools open"></DocsImage>

Knowing this, we can make an assertion that our todo's name is `contained` within this `<label>` element.

First we need to get all of the `<li>` elements.

```jsx
cy.get('.todo-list li')
```

Then we want to make sure we grab the first element in this array. We can do that by using the [eq()](https://docs.cypress.io/api/commands/eq) method.

```jsx
cy.get('.todo-list li').eq(0)
```

When then pass `eq()` the index of our element, which in our case should be the first one, and it will return that element from the array.

Then we will use the [find()](https://docs.cypress.io/api/commands/find) method to `find` our `<label>` element.

```jsx
cy.get('.todo-list li').eq(0).find('label')
```

The `find()` method will look for child elements of a specific selector.

So, we are getting the first `<li>` element from the `.todo-list` element and then within that `<li>` element we are looking for the `<label>` element.

Finally, we want to make sure that the `<label>` `contains` the text of our todo item.

```jsx
cy.get('.todo-list li').eq(0).find('label').should('contain', TODO_ITEM_ONE)
```

Save the file and let the tests run again and make sure everything passes.

<DocsImage
src="/img/guides/real-world-testing/testing-your-first-app/multiple-todos-and-before-each/Screen_Shot_2021-06-25_at_11.40.52_AM.png"
alt="cypress with passing test assertions"></DocsImage>

Great, everything is green and passing.

## Aside

```jsx
cy.get('.todo-list li').eq(0).find('label').should('contain', TODO_ITEM_ONE)
```

When you attach multiple methods one after the other like this, this is referred to as "chaining." You can chaining multiple Cypress methods together to perform powerful assertions. However, chaining several methods together can quickly become difficult to read. An easy way to solve this is to simply format this "chain" slightly differently, like so:

```jsx
it('adds a single todo', () => {
  cy.get('.new-todo').type(`${TODO_ITEM_ONE}{enter}`)
  cy.get('.todo-list li').eq(0).find('label').should('contain', TODO_ITEM_ONE)
  cy.get('.todo-list li').should('have.length', 1)
})
```

This is entirely optional, but we often find it makes reading long chained assertions much simpler and easier to read.

## Wrap Up

We learned how to use the `beforeEach()` method so that each of our tests visits the appropriate URL. We then created a new test that confirms that we can add three todos and also refactored our todo's into variables for re-usability. Finally, we made our tests more robust by making sure the text entered is properly rendered by `chaining` multiple methods together.
