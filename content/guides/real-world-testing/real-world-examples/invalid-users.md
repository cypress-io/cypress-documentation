# Invalid Users

We now need to test to make sure that anyone who enters in invalid credentials like a bad username or bad password is shown the invalid user error message.

Let's create our test and name it like so:

```jsx
it('should error for an invalid user', () => {})
```

Remember, we can use the `only` method to have Cypress re-run only this specific test.

Make sure to remove `.only` from all other tests.

```jsx
it.only('should error for an invalid user', function () {})
```

First we need to visit the sign in page

```jsx
cy.visit('/')
```

Next let's grab our username field and enter in a bad username

```jsx
cy.getBySel('signin-username').type('jdoe')
```

Then let's grab our password field and enter in a bad password

```jsx
cy.getBySel('signin-password').type('password')
```

Now we need to click the sign in button.

```jsx
cy.getBySel('signin-submit').click()
```

Finally, lets confirm the correct error and message is shown.

```jsx
cy.getBySel('signin-error')
  .should('be.visible')
  .and('have.text', 'Username or password is invalid')
```

![Invalid%20Users%20e4ffe0bf7c9645fba0de70a12a7830ed/Screen_Shot_2021-06-28_at_1.50.00_PM.png](Invalid%20Users%20e4ffe0bf7c9645fba0de70a12a7830ed/Screen_Shot_2021-06-28_at_1.50.00_PM.png)

# Wrap Up

In this lesson, we wrote a test that makes sure that the proper error message is shown when a user tries to login with invalid credentials.

# Final Code

---

```jsx
it.only('should error for an invalid user', () => {
  cy.visit('/')
  cy.getBySel('signin-username').type('jdoe')
  cy.getBySel('signin-password').type('password')
  cy.getBySel('signin-submit').click()
  cy.getBySel('signin-error')
    .should('be.visible')
    .and('have.text', 'Username or password is invalid')
})
```
