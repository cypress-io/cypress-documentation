# User Setting Form Errors

Now that we have setup the `beforeEach()` within our test file, let's now write a test that makes sure that the form validations for the user settings are working properly.

It is important that you understand what is happening within the `beforeEach()` function which we explained in great detail in the previous lesson. Make sure you are familiar with it before continuing any further with this lesson.

Let's create a new test and call it `should display user setting form errors` like so:

```jsx
it('should display user setting form errors', () => {})
```

Now that we have added a test to this file, let's fire up Cypress and make sure that all of the logic within the `beforeEach()` is working. You should see the following if everything is working.

![User%20Setting%20Form%20Errors%204a6b7117a4a94f9297c10013552f9425/Screen_Shot_2021-06-29_at_1.15.10_PM.png](User%20Setting%20Form%20Errors%204a6b7117a4a94f9297c10013552f9425/Screen_Shot_2021-06-29_at_1.15.10_PM.png)

Let's begin to write our test by making sure that the first name and last name input fields are throwing an error properly.

First we need to get the first name field.

```jsx
cy.getBySelLike('firstName-input').type('Abc').clear().blur()
```

We are using another custom `Cypress.command()` here called `getBySelLike` which can be found in `cypress/support/commands.ts` around line `39` . This works very similarly to the `cy.getBySel` which we have used before. The only difference is that `getBySelLike` uses a wildcard to provide a "less specific" lookup.

Next, we want to make sure that the helper text is visible and contains the correct error message.

```jsx
cy.get('#user-settings-firstName-input-helper-text')
  .should('be.visible')
  .and('contain', 'Enter a first name')
```

![User%20Setting%20Form%20Errors%204a6b7117a4a94f9297c10013552f9425/Screen_Shot_2021-06-29_at_1.28.54_PM.png](User%20Setting%20Form%20Errors%204a6b7117a4a94f9297c10013552f9425/Screen_Shot_2021-06-29_at_1.28.54_PM.png)

So far, so goo. Let's do the same for the last name field.

```jsx
cy.getBySelLike('lastName-input').type('Abc').clear().blur()
cy.get('#user-settings-lastName-input-helper-text')
  .should('be.visible')
  .and('contain', 'Enter a last name')
```

![User%20Setting%20Form%20Errors%204a6b7117a4a94f9297c10013552f9425/Screen_Shot_2021-06-29_at_1.29.56_PM.png](User%20Setting%20Form%20Errors%204a6b7117a4a94f9297c10013552f9425/Screen_Shot_2021-06-29_at_1.29.56_PM.png)

# Cypress is just JavaScript

If you take a look at these two assertions you will notice that they are virtually identical.

```jsx
// First Name
cy.getBySelLike('firstName-input').type('Abc').clear().blur()
cy.get('#user-settings-firstName-input-helper-text')
  .should('be.visible')
  .and('contain', 'Enter a first name')

// Last Name
cy.getBySelLike('lastName-input').type('Abc').clear().blur()
cy.get('#user-settings-lastName-input-helper-text')
  .should('be.visible')
  .and('contain', 'Enter a last name')
```

The only difference between them are "firstName" and "lastName." Since Cypress is just JavaScript, we can abstract these assertions using `.forEach()` like so:

```jsx
;['first', 'last'].forEach((field) => {
  cy.getBySelLike(`${field}Name-input`).type('Abc').clear().blur()
  cy.get(`#user-settings-${field}Name-input-helper-text`)
    .should('be.visible')
    .and('contain', `Enter a ${field} name`)
})
```

Our test is still passing.

![User%20Setting%20Form%20Errors%204a6b7117a4a94f9297c10013552f9425/Screen_Shot_2021-06-29_at_1.33.23_PM.png](User%20Setting%20Form%20Errors%204a6b7117a4a94f9297c10013552f9425/Screen_Shot_2021-06-29_at_1.33.23_PM.png)

It is helpful to remember that at the end of the day Cypress is just JavaScript and you can easily utilize everything the JS has to offer to simplify your tests.

# Email & Phone inputs

Let's finish off our test by asserting that the email and phone inputs are also throwing the correct error messages. The code is virtually identical to the last name and first name code. The only difference is the selector name.

```jsx
cy.getBySelLike('email-input').type('abc').clear().blur()
cy.get('#user-settings-email-input-helper-text')
  .should('be.visible')
  .and('contain', 'Enter an email address')

cy.getBySelLike('email-input').type('abc@bob.').blur()
cy.get('#user-settings-email-input-helper-text')
  .should('be.visible')
  .and('contain', 'Must contain a valid email address')

cy.getBySelLike('phoneNumber-input').type('abc').clear().blur()
cy.get('#user-settings-phoneNumber-input-helper-text')
  .should('be.visible')
  .and('contain', 'Enter a phone number')

cy.getBySelLike('phoneNumber-input').type('615-555-').blur()
cy.get('#user-settings-phoneNumber-input-helper-text')
  .should('be.visible')
  .and('contain', 'Phone number is not valid')
```

We have two different assertions for both the email and phone number field since these two fields can show different error messages depending upon the error.

Finally, we will make sure that the submit button is disabled since there are error with our form.

```jsx
cy.getBySelLike('submit').should('be.disabled')
```

![User%20Setting%20Form%20Errors%204a6b7117a4a94f9297c10013552f9425/Screen_Shot_2021-06-29_at_1.37.46_PM.png](User%20Setting%20Form%20Errors%204a6b7117a4a94f9297c10013552f9425/Screen_Shot_2021-06-29_at_1.37.46_PM.png)

# Wrap Up

In this lesson, we learned how to abstract some of our assertions into a `.forEach()` to help simplify and keep our test `DRY` . We also got some more practice with writing tests for forms and also made sure to check for multiple error states and messages.
