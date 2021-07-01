# Users without Bank Accounts

So far we have gotten a decent amount of experience with `cy.intercept` and have demonstrated several examples of how to use it within your tests.

Sometimes, however, you not only want to `intercept` a request, but also modify some of its data, which is exactly what we will be doing in this test. We want to test to make sure that our application renders the appropriate UI when a user does not have any bank accounts.

Let's create our test and give it the following name:

```jsx
it('renders an empty bank account list state with onboarding modal', () => {})
```

The first thing we want to do is use `cy.intercept` to intercept our request and then change some of the data in that request. I will show all of the code first, and then walk you through what is going on.

```jsx
cy.intercept('POST', `${Cypress.env('apiUrl')}/graphql`, (req) => {
  const { body } = req
  if (
    body.hasOwnProperty('operationName') &&
    body.operationName === 'ListBankAccount'
  ) {
    req.alias = 'gqlListBankAccountQuery'
    req.continue((res) => {
      res.body.data.listBankAccount = []
    })
  }
})
```

First thing's first... we are using the same GraphQL endpoint in both of our tests, so let's extract this into a variable so we can easily re-use it and only have to update it in a single place.

```jsx
import { User } from "../../../src/models";
import { isMobile } from "../../support/utils";

const apiGraphQL = `${Cypress.env("apiUrl")}/graphql`;

describe("Bank Accounts", () => {

// ...
```

Next, update the test to use our new variable.

```jsx
cy.intercept('POST', apiGraphQL, (req) => {
  const { body } = req
  if (
    body.hasOwnProperty('operationName') &&
    body.operationName === 'ListBankAccount'
  ) {
    req.alias = 'gqlListBankAccountQuery'
    req.continue((res) => {
      res.body.data.listBankAccount = []
    })
  }
})
```

Remember to also update the `cy.intercept` within the `beforeEach()` as well.

This intercept is doing the following:

First, we are making a `POST` request to our GraphQL enpoint.

Then, we are storing the body of the request into a variable.

Next, we have a conditional that checks if the body object has a property called `operationName` and if that `operationName` is "ListBankAccount".

If so, then we create an alias called `gqlListBankAccountQuery`

Finally, and this is the part that we are most concerned with, we are setting the `res.body.data.listBankAccount` to and empty `[]` array.

In doing this, we are able to manipulate the response data to simulate what happens when a user does not have any bank accounts. This way we can write assertions against this request as if the response came back without any bank accounts for our user.

![Users%20without%20Bank%20Accounts%20f6fe68975c534a5589b07eac68882e94/Screen_Shot_2021-06-30_at_1.14.35_PM.png](Users%20without%20Bank%20Accounts%20f6fe68975c534a5589b07eac68882e94/Screen_Shot_2021-06-30_at_1.14.35_PM.png)

So far so good. Now let's write some assertions.

Now we need to visit the `/bankaccounts` route and then wait for the `listBankAccounQuery` to finish.

```jsx
cy.visit('/bankaccounts')
cy.wait('@gqlListBankAccountQuery')
```

Finally, we will write some assertions to make sure our UI is displaying and not displaying the elements that it should.

```jsx
cy.getBySel('bankaccount-list').should('not.exist')
cy.getBySel('empty-list-header').should('contain', 'No Bank Accounts')
cy.getBySel('user-onboarding-dialog').should('be.visible')
cy.getBySel('nav-top-notifications-count').should('exist')
```

We first want to make sure that the element which would normally display our bank accounts does not exist in the `DOM`.

Then, We make sure we are displaying the correct message since there are no bank accounts.

Next, we assert that the onboarding modal window is visible.

Finally, we assert that the user's notification count is visible.

![Users%20without%20Bank%20Accounts%20f6fe68975c534a5589b07eac68882e94/Screen_Shot_2021-06-30_at_1.17.05_PM.png](Users%20without%20Bank%20Accounts%20f6fe68975c534a5589b07eac68882e94/Screen_Shot_2021-06-30_at_1.17.05_PM.png)

# Wrap Up

In this lesson we learned how to modify response data that we captured using `cy.intercept` . We then wrote assertions against this modified response to simulate what our application does when a user does not have any bank accounts.
