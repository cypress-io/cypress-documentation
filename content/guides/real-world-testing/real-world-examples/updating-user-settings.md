# Updating User Settings

For this test, we need to make sure that we can update the first name, last name, email and phone number on the user settings form.

Let's create a new test.

```jsx
it('updates first name, last name, email and phone number', () => {})
```

Remember, that we can use `.only` to have Cypress only execute this test.

```jsx
it.only('updates first name, last name, email and phone number', () => {})
```

First, we need to grab all of the input fields and fill them out with the data we want to update.

```jsx
cy.getBySelLike('firstName').clear().type('New First Name')
cy.getBySelLike('lastName').clear().type('New Last Name')
cy.getBySelLike('email').clear().type('email@email.com')
cy.getBySelLike('phoneNumber-input').clear().type('6155551212').blur()
```

Then let's write an assertion to make sure that the submit button is not disabled.

```jsx
cy.getBySelLike('submit').should('not.be.disabled')
```

Then we need to click the submit button.

```jsx
cy.getBySelLike('submit').click()
```

Our entire test up until this point should look like this:

```jsx
it.only('updates first name, last name, email and phone number', () => {
  cy.getBySelLike('firstName').clear().type('New First Name')
  cy.getBySelLike('lastName').clear().type('New Last Name')
  cy.getBySelLike('email').clear().type('email@email.com')
  cy.getBySelLike('phoneNumber-input').clear().type('6155551212').blur()

  cy.getBySelLike('submit').should('not.be.disabled')
  cy.getBySelLike('submit').click()
})
```

![Updating%20User%20Settings%20b9fa1c959e5c430a8e73d6609eb49ec7/Screen_Shot_2021-06-29_at_3.12.06_PM.png](Updating%20User%20Settings%20b9fa1c959e5c430a8e73d6609eb49ec7/Screen_Shot_2021-06-29_at_3.12.06_PM.png)

# Updating the user

So far the only thing we have really tested is that we can fill out the update user settings form and can click the submit button. Our test does not actually let us know if the user's information has actually been updated. In order to see if you user's information has indeed been updated, we can use `cy.intercept` to check the response.

We will need to `intercept` the `PATCH` request to the /users endpoint. Make sure to put this as the very first line of the test, like so:

```jsx
it.only("updates first name, last name, email and phone number", () => {
  cy.intercept("PATCH", "/users/*").as("updateUser");
// ...
```

Now that we have an alias for our `PATCH` request, we can assert that our endpoint gives us back the proper response code once our user has been updated.

```jsx
cy.wait('@updateUser').its('response.statusCode').should('equal', 204)
```

Now, our entire test should look like:

```jsx
it.only('updates first name, last name, email and phone number', () => {
  cy.intercept('PATCH', '/users/*').as('updateUser')

  cy.getBySelLike('firstName').clear().type('New First Name')
  cy.getBySelLike('lastName').clear().type('New Last Name')
  cy.getBySelLike('email').clear().type('email@email.com')
  cy.getBySelLike('phoneNumber-input').clear().type('6155551212').blur()

  cy.getBySelLike('submit').should('not.be.disabled')
  cy.getBySelLike('submit').click()

  cy.wait('@updateUser').its('response.statusCode').should('equal', 204)
})
```

![Updating%20User%20Settings%20b9fa1c959e5c430a8e73d6609eb49ec7/Screen_Shot_2021-06-29_at_3.19.39_PM.png](Updating%20User%20Settings%20b9fa1c959e5c430a8e73d6609eb49ec7/Screen_Shot_2021-06-29_at_3.19.39_PM.png)

Finally, we can make an assertion that our UI has been updated with our new user's data, by checking to see that the user's first name is displayed correctly in the left sidebar in the upper left hand corner.

```jsx
cy.getBySel('sidenav-user-full-name').should('contain', 'New First Name')
```

![Updating%20User%20Settings%20b9fa1c959e5c430a8e73d6609eb49ec7/Screen_Shot_2021-06-29_at_3.21.53_PM.png](Updating%20User%20Settings%20b9fa1c959e5c430a8e73d6609eb49ec7/Screen_Shot_2021-06-29_at_3.21.53_PM.png)

# Wrap Up

In this lesson we learned how to test the user settings update form by submitting new user data. We learned how to use `cy.intercept()` to intercept our `PATCH` request, and also how to alias network requests. We then used this aliased network request to write an assertion that the server returned the correct HTTP status code. Finally, we wrote an assertion to make sure that our UI updated with the new user first name and last name in the left sidebar.
