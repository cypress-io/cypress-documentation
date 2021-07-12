# Bank Accounts Overview & Setup

Like we have seen in previous lessons, before we begin writing our tests for bank accounts, we first need to setup our `beforeEach()` to execute some logic before each test.

Create a new spec file called `bankaccounts.spec.ts` inside of `cypress/tests/rwt` .

![Bank%20Accounts%20Overview%20&%20Setup%20f1325a0d3b6f440ea9310862a121702d/Screen_Shot_2021-06-30_at_9.43.38_AM.png](Bank%20Accounts%20Overview%20&%20Setup%20f1325a0d3b6f440ea9310862a121702d/Screen_Shot_2021-06-30_at_9.43.38_AM.png)

Next, create a describe block called "Bank Accounts" like so:

```jsx
describe('Bank Accounts', () => {})
```

Inside of that create our `beforeEach()` .

```jsx
describe('Bank Accounts', () => {
  beforeEach(() => {})
})
```

The first thing we will want to do is to seed our database with fresh data before each test. We have gone over in great detail what this custom task does in the \_\_\_ lesson.

Make sure to provide a link to the lesson where we discuss the seed db task in detail

```jsx
cy.task('db:seed')
```

Next we will want to automatically log in as one of the users from the seeded database before each test. If you are not familiar with the `cy.database` command, we discuss it in great detail [here](User%20Settings%20Overview%20&%20Setup%20ce4eacbf366b4978891ec77f9ff70df8.md).

Make sure to provide a link to the lesson where we discuss `cy.database` in detail

Our entire spec file should now look like this.

```jsx
import { User } from '../../../src/models'

describe('Bank Accounts', () => {
  beforeEach(() => {
    cy.task('db:seed')

    cy.database('find', 'users').then((user: User) => {
      return cy.loginByXstate(user.username)
    })
  })
})
```

# Notifications

We need to intercept the request to `GET` the notifications, so we can write assertions against it, like so:

```jsx
cy.intercept('GET', '/notifications').as('getNotifications')
```

The entire spec file up until this point:

```jsx
import { User } from '../../../src/models'

describe('Bank Accounts', () => {
  beforeEach(() => {
    cy.task('db:seed')

    cy.intercept('GET', '/notifications').as('getNotifications')

    cy.database('find', 'users').then((user: User) => {
      return cy.loginByXstate(user.username)
    })
  })
})
```

# GraphQL

The bank accounts functionality uses GraphQL and so we need to use `cy.intercept` to alias the various queries and mutations related to bank accounts. Let's first take a look at the code involved and then break it down line by line.

```jsx
cy.intercept('POST', `${Cypress.env('apiUrl')}/graphql`, (req) => {
  const { body } = req

  if (
    body.hasOwnProperty('operationName') &&
    body.operationName === 'ListBankAccount'
  ) {
    req.alias = 'gqlListBankAccountQuery'
  }

  if (
    body.hasOwnProperty('operationName') &&
    body.operationName === 'CreateBankAccount'
  ) {
    req.alias = 'gqlCreateBankAccountMutation'
  }

  if (
    body.hasOwnProperty('operationName') &&
    body.operationName === 'DeleteBankAccount'
  ) {
    req.alias = 'gqlDeleteBankAccountMutation'
  }
})
```

This intercept is doing the following:

First, we are making a `POST` request to our GraphQL endpoint.

Then, we are storing the `body` of the request into a variable.

Next, we have a conditional that checks to see if the response body object has a property called `operationName` and if the `operationName` is "ListBankAccount" we create an alias called `gqlListBankAccountQuery` .

Finally, we do basically the exact same thing two more times for the "CreateBankAccount" mutation and "DeleteBankAccount" mutation.

Our entire test file should look like the following:

```jsx
import { User } from '../../../src/models'

describe('Bank Accounts', () => {
  beforeEach(() => {
    cy.task('db:seed')

    cy.intercept('GET', '/notifications').as('getNotifications')

    cy.intercept('POST', `${Cypress.env('apiUrl')}/graphql`, (req) => {
      const { body } = req

      if (
        body.hasOwnProperty('operationName') &&
        body.operationName === 'ListBankAccount'
      ) {
        req.alias = 'gqlListBankAccountQuery'
      }

      if (
        body.hasOwnProperty('operationName') &&
        body.operationName === 'CreateBankAccount'
      ) {
        req.alias = 'gqlCreateBankAccountMutation'
      }

      if (
        body.hasOwnProperty('operationName') &&
        body.operationName === 'DeleteBankAccount'
      ) {
        req.alias = 'gqlDeleteBankAccountMutation'
      }
    })

    cy.database('find', 'users').then((user: User) => {
      return cy.loginByXstate(user.username)
    })
  })
})
```

# Sanity Check

If you try and save this file to trigger Cypress to run it, you will notice that Cypress is unable to, because it cannot find any tests in the file.

![Bank%20Accounts%20Overview%20&%20Setup%20f1325a0d3b6f440ea9310862a121702d/Screen_Shot_2021-06-30_at_10.11.48_AM.png](Bank%20Accounts%20Overview%20&%20Setup%20f1325a0d3b6f440ea9310862a121702d/Screen_Shot_2021-06-30_at_10.11.48_AM.png)

We can write a blank test to get around this so we can make sure our intercepts, aliases and user login are all working correctly within the `beforeEach()` .

```jsx
it('', () => {})
```

With this empty test in place, save your file and you should see the following:

![Bank%20Accounts%20Overview%20&%20Setup%20f1325a0d3b6f440ea9310862a121702d/Screen_Shot_2021-06-30_at_10.13.07_AM.png](Bank%20Accounts%20Overview%20&%20Setup%20f1325a0d3b6f440ea9310862a121702d/Screen_Shot_2021-06-30_at_10.13.07_AM.png)

Now that we know everything is working we are ready to begin writing our bank account tests.

# Wrap Up

In this lesson we setup the `beforeEach()` for our bank accounts spec file. We learned how to use `cy.intercept` for notifications and for GraphQL queries and mutations.
