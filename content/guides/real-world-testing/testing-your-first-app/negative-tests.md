# Negative tests

Up until this point, we have been writing tests and assertions to make sure that things are displayed correctly. For instance, our `should append new items to the bottom of the list` test makes sure that our todo's are listed in the correct order and that the todo count text is correct.

This is all well and good, but it is also important to write tests to make sure that things are _not_ shown when they are not supposed to be. So instead of testing the positive case, make sure to also test the negative.

This will make more sense when we write our first "negative" test. For instance, I am not sure if you noticed this or not, but when a todo is added to the application a `<footer>` is appended to the bottom of the app. When there are no todo's the `<footer>` is removed.

Let's write a test to make sure that the `<footer>` is not visible to our users when there are no todos.

```jsx
it('does NOT display the footer when there are no todos', () => {})
```

Now let's grab the `<footer>` element and write an assertion that it does not exist when there are no todos.

```jsx
cy.get('.footer').should('not.exist')
```

<DocsImage
src="/img/guides/real-world-testing/testing-your-first-app/negative-tests/Screen_Shot_2021-06-25_at_2.33.00_PM.png"
alt="todo mvc with all passing tests"></DocsImage>

Great our test is passing. Let's also think of some other elements that should not exist when there are no todo's.

Another element that should not exist is our `.todo-list` element. Let's write another assertion to make sure that this too does not exist if there are no todo's.

```jsx
cy.get('.todo-list').should('not.exist')
```

Since we now checking for multiple elements, let's update our test name to be more explicit.

```jsx
it('does NOT display the footer or todo-list when there are no todos', () => {
  cy.get('.footer').should('not.exist')
  cy.get('.todo-list').should('not.exist')
})
```

## Practice:

Now that you know how to test for when things should not exist, write a new test that does the opposite of the test we just wrote. Instead of making sure something does not exist when there are no todo's, write a test that makes sure that the `<footer>` and `.todo-list` exist when there are todo's.

## Wrap Up:

In this lesson we learned the importance of writing "negative" tests, which in this case was to make sure that certain elements did not exist if there were no todo's. We will see more of these types of tests in future lessons.
