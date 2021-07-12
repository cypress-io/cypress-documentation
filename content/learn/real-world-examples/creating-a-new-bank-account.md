# Creating a New Bank Account

I suppose this is somewhat obvious, but one of the most important tests we can write regarding the bank accounts functionality is to make sure that users are able to create new bank accounts.

Let's create a new test and call it "creates a new bank account," like so:

```jsx
it('creates a new bank account', () => {})
```

Next we need to click on the "Bank Accounts" link in the left sidebar.

```jsx
cy.getBySel('sidenav-bankaccounts').click()
```

![Creating%20a%20New%20Bank%20Account%20cea6a5293dbe48f2a92901d22e854de5/Screen_Shot_2021-06-30_at_10.19.19_AM.png](Creating%20a%20New%20Bank%20Account%20cea6a5293dbe48f2a92901d22e854de5/Screen_Shot_2021-06-30_at_10.19.19_AM.png)

Next, we will click on the "Create" button and write an assertion that the application has taken us to the correct screen, by validating the URL.

```jsx
cy.getBySel('bankaccount-new').click()
cy.location('pathname').should('eq', '/bankaccounts/new')
```

![Creating%20a%20New%20Bank%20Account%20cea6a5293dbe48f2a92901d22e854de5/Screen_Shot_2021-06-30_at_10.21.15_AM.png](Creating%20a%20New%20Bank%20Account%20cea6a5293dbe48f2a92901d22e854de5/Screen_Shot_2021-06-30_at_10.21.15_AM.png)

Next, we need to fill out this form with some bank account information and then save it.

```jsx
// Create Bank Account Form
cy.getBySelLike('bankName-input').type('The Best Bank')
cy.getBySelLike('routingNumber-input').type('987654321')
cy.getBySelLike('accountNumber-input').type('123456789')
cy.getBySelLike('submit').click()
```

![Creating%20a%20New%20Bank%20Account%20cea6a5293dbe48f2a92901d22e854de5/Screen_Shot_2021-06-30_at_10.22.29_AM.png](Creating%20a%20New%20Bank%20Account%20cea6a5293dbe48f2a92901d22e854de5/Screen_Shot_2021-06-30_at_10.22.29_AM.png)

Finally, we will write an assertion that ensures that our new bank account has been created successfully, but first we will need to use [cy.wait](https://docs.cypress.io/api/commands/wait) to wait upon the `gqlCreateBankAccountMutation` .

```jsx
cy.wait('@gqlCreateBankAccountMutation')
```

This will make sure that the our assertions are not executed until the mutation, which creates our new bank account is complete.

Then we can simply write an assertion that makes sure the UI now lists two bank accounts and that our newly created bank accounts name is displayed properly, like so:

```jsx
cy.getBySelLike('bankaccount-list-item')
  .should('have.length', 2)
  .eq(1)
  .should('contain', 'The Best Bank')
```

![Creating%20a%20New%20Bank%20Account%20cea6a5293dbe48f2a92901d22e854de5/Screen_Shot_2021-06-30_at_10.25.36_AM.png](Creating%20a%20New%20Bank%20Account%20cea6a5293dbe48f2a92901d22e854de5/Screen_Shot_2021-06-30_at_10.25.36_AM.png)

Our entire test, should look like the following:

```jsx
it('creates a new bank account', () => {
  cy.getBySel('sidenav-bankaccounts').click()
  cy.getBySel('bankaccount-new').click()
  cy.location('pathname').should('eq', '/bankaccounts/new')

  // Create Bank Account Form
  cy.getBySelLike('bankName-input').type('The Best Bank')
  cy.getBySelLike('routingNumber-input').type('987654321')
  cy.getBySelLike('accountNumber-input').type('123456789')
  cy.getBySelLike('submit').click()

  // Validates new bank is created
  cy.wait('@gqlCreateBankAccountMutation')

  cy.getBySelLike('bankaccount-list-item')
    .should('have.length', 2)
    .eq(1)
    .should('contain', 'The Best Bank')
})
```

# Mobile View

Remember how in previous tests we are utilizing the `isMobile()` utility function to determine if the test is being run on a mobile simulated device? Let's add that into this test as well, like so:

```jsx
import { isMobile } from '../../support/utils'
// ...

it('creates a new bank account', () => {
  if (isMobile()) {
    cy.getBySel('sidenav-toggle').click()
  }

  cy.getBySel('sidenav-bankaccounts').click()
  cy.getBySel('bankaccount-new').click()
  cy.location('pathname').should('eq', '/bankaccounts/new')

  // Create Bank Account Form
  cy.getBySelLike('bankName-input').type('The Best Bank')
  cy.getBySelLike('routingNumber-input').type('987654321')
  cy.getBySelLike('accountNumber-input').type('123456789')
  cy.getBySelLike('submit').click()

  // Validates new bank is created
  cy.wait('@gqlCreateBankAccountMutation')

  cy.getBySelLike('bankaccount-list-item')
    .should('have.length', 2)
    .eq(1)
    .should('contain', 'The Best Bank')
})
```

This way whenever our tests are run in a browser that simulates the size of a mobile device, our test will click on the correct element so our test doesn't break.

# Wrap Up

In this lesson we wrote a test to make sure that users are able to create new bank accounts. We learned how to use `cy.wait` to make sure that the GraphQL mutation responsible for creating bank accounts finishes before our assertions are executed.
