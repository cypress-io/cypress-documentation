# Login Errors

It is easy to fall into the trap of only testing situations and areas of our applications when things work as expected. But what about when things go wrong? Not only do we need to test the "happy path" for our users, we also need to test the "unhappy path."

A perfect example of this is making sure that our login form throws the appropriate errors when a user does not enter in their information correctly.

So let's write some tests to make sure that our form validations are working as expected.

We will create a new test and name it, "should display login errors" like so:

```jsx
it('should display login errors', () => {})
```

The next thing we need to do is navigate to the sign in page. Which our application should redirect us to automatically when we try to access the root route.

```jsx
cy.visit('/')
```

Save the file and let Cypress re-run our tests.

By the way, since Cypress automatically re-runs all of our tests whenever we save a spec file, we can tell it to only run a specific test by using the `only` method. Like so:

```jsx
it.only('should display login errors', function () {
  cy.visit('/')
})
```

This will speed up the feedback loop for our single test instead of re-running all of the tests in this file.

Below, we are using a custom Cypress command `getBySel`. Depending upon the order of these videos, this command needs to be explained either in this video or one before it so the audience understands what is going on.

# Username

Next we need to get the username input field

```jsx
cy.getBySel('signin-username').type('jdoe').find('input').clear().blur()
```

We are first getting the username input field, then typing in a user name of `jdoe`.

We have to then find the `input` as the element we are actually selecting is a div that is wrapping our input.

We then clear the input field and trigger a blur event which triggers the validation.

Now let's confirm that our validation is displaying the correct error message.

```jsx
cy.get('#username-helper-text')
  .should('be.visible')
  .and('contain', 'Username is required')
```

![Login%20Errors%20f8801815fe3840a29c47e7f778da4011/Screen_Shot_2021-06-28_at_1.40.59_PM.png](Login%20Errors%20f8801815fe3840a29c47e7f778da4011/Screen_Shot_2021-06-28_at_1.40.59_PM.png)

This test is actually asserting two things at once.

First, we are making sure that the error message is visible to the user.

Then we are making sure the error message text itself contains the correct message.

# Password

We basically want to test the exact same behavior for the password input field.

Let's make sure our validation fires when the user blurs out of the input.

```jsx
cy.getBySel('signin-password').type('abc').find('input').blur()
```

Then we will make sure the error message is displayed and has the correct message.

```jsx
cy.get('#password-helper-text')
  .should('be.visible')
  .and('contain', 'Password must contain at least 4 characters')
```

Finally, we want to make sure that our sign in button is disabled. Anytime we have errors on this screen, the user should not be able to click the sign in button.

```jsx
cy.getBySel('signin-submit').should('be.disabled')
```

![Login%20Errors%20f8801815fe3840a29c47e7f778da4011/Screen_Shot_2021-06-28_at_1.42.18_PM.png](Login%20Errors%20f8801815fe3840a29c47e7f778da4011/Screen_Shot_2021-06-28_at_1.42.18_PM.png)

# Wrap Up

---

In this lesson we learned how to test the validations for our Sign in form. First, we triggered the validation for the username field by entering in a username, clearing the field, and then blurring it. Next, we wrote an assertion that confirms that not only the helper text is visible, but also that the message is correct. Finally, we did the same thing for the password field.

# Final Code

---

```jsx
it('should display login errors', () => {
  cy.visit('/')

  // Username
  cy.getBySel('signin-username').type('jdoe').find('input').clear().blur()

  cy.get('#username-helper-text')
    .should('be.visible')
    .and('contain', 'Username is required')

  // Password
  cy.getBySel('signin-password').type('abc').find('input').blur()

  cy.get('#password-helper-text')
    .should('be.visible')
    .and('contain', 'Password must contain at least 4 characters')

  cy.getBySel('signin-submit').should('be.disabled')
})
```
