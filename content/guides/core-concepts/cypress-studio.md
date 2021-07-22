---
title: Cypress Studio
---

<Alert type="info">

## <Icon name="graduation-cap"></Icon> What you'll learn

- How to extend tests interactively using the Cypress Studio
- How to add new tests interactively using the Cypress Studio

</Alert>

## Overview

Cypress Studio provides a visual way to generate tests within the Test Runner,
by _recording interactions_ against the application under test.

The [`.click()`](/api/commands/click), [`.type()`](/api/commands/type),
[`.check()`](/api/commands/check), [`.uncheck()`](/api/commands/uncheck), and
[`.select()`](/api/commands/select) Cypress commands are supported and will
generate test code when interacting with the DOM inside of the Cypress Studio.

## Using Cypress Studio

<Alert type="info">

Cypress Studio is an experimental feature and can be enabled by adding the
[experimentalStudio](/guides/references/experiments) attribute to your
configuration file (`cypress.json` by default).

</Alert>

```json
{
  "experimentalStudio": true
}
```

The Cypress <Icon name="github"></Icon>
[Real World App (RWA)](https://github.com/cypress-io/cypress-realworld-app) is
an open source project implementing a payment application to demonstrate
real-world usage of Cypress testing methods, patterns, and workflows. It will be
used to demonstrate the functionality of Cypress Studio below.

### Extending a Test

You can extend any preexisting test or start by creating a new test in your
[integrationFolder](/guides/references/configuration#Folders-Files)
(`cypress/integration` by default) with the following test scaffolding.

```js
// Code from Real World App (RWA)
describe('Cypress Studio Demo', () => {
  beforeEach(() => {
    // Seed database with test data
    cy.task('db:seed')

    // Login test user
    cy.database('find', 'users').then((user) => {
      cy.login(user.username, 's3cret', true)
    })
  })

  it('create new transaction', () => {
    // Extend test with Cypress Studio
  })
})
```

<Alert type="info">

##### <Icon name="graduation-cap"></Icon> Real World Example

Clone the <Icon name="github"></Icon>
[Real World App (RWA)](https://github.com/cypress-io/cypress-realworld-app) and
refer to the
[cypress/tests/demo/cypress-studio.spec.ts](https://github.com/cypress-io/cypress-realworld-app/blob/develop/cypress/tests/demo/cypress-studio.spec.ts)
file.

</Alert>

#### Step 1 - Run the spec

We will use Cypress Studio to perform a "New Transaction" user journey. First,
launch the Test Runner and run the spec created in the previous step.

<DocsImage src="/img/guides/cypress-studio/run-spec-1.png" alt="Cypress Studio" no-border></DocsImage>

Once the tests complete their run, hover over a test in the Command Log to
reveal an "Add Commands to Test" button.

Clicking on "Add Commands to Test" will launch the Cypress Studio.

<Alert type="info">

Cypress Studio is directly integrated with the
[Command Log](/guides/core-concepts/test-runner#Command-Log).

</Alert>

<DocsImage src="/img/guides/cypress-studio/run-spec-2.png" alt="Cypress Studio" no-border></DocsImage>

#### Step 2 - Launch Cypress Studio

<Alert type="success">

Cypress will automatically execute all hooks and currently present test code,
and then the test can be extended from that point on (e.g. We are logged into
the application inside the `beforeEach` block).

</Alert>

Next, the Test Runner will execute the test in isolation and pause after the
last command in the test.

<DocsImage src="/img/guides/cypress-studio/extend-new-transaction-ready.png" alt="Cypress Studio Ready" no-border></DocsImage>

Now, we can begin updating the test to create a new transaction between users.

#### Step 3 - Interact with the Application

To record actions, begin interacting with the application. Here we will click on
the first name input and as a result we will see the click recorded in the
Command Log.

<DocsImage src="/img/guides/cypress-studio/extend-new-transaction-user-list.png" alt="Cypress Studio Extend Test" no-border></DocsImage>

Next, we can type the name of a user to pay and click on the user in the
results.

<DocsImage src="/img/guides/cypress-studio/extend-new-transaction-click-user.png" alt="Cypress Studio Extend Test" no-border></DocsImage>

We will complete the transaction form by clicking on and typing in the amount
and description inputs.

<DocsImage src="/img/guides/cypress-studio/extend-new-transaction-form.png" alt="Cypress Studio Extend Test" no-border></DocsImage>

<Alert type="success">

Notice the commands generated in the Command Log.

</Alert>

Finally, we will click the "Pay" button.

<DocsImage src="/img/guides/cypress-studio/extend-new-transaction-pay.png" alt="Cypress Studio Extend Test" no-border></DocsImage>

We are presented with a confirmation page of our new transaction.

<DocsImage src="/img/guides/cypress-studio/extend-new-transaction-confirmation.png" alt="Cypress Studio Extend Test Confirmation" no-border></DocsImage>

To discard the interactions, click the "Cancel" button to exit Cypress Studio.
If satisfied with the interactions with the application, click "Save Commands"
and the test code will be saved to your spec file.

#### Generated Test Code

Viewing our test code, we can see that the test is updated after clicking "Save
Commands" with the actions we recorded in Cypress Studio.

```js
// Code from Real World App (RWA)
describe('Cypress Studio Demo', () => {
  beforeEach(() => {
    // Seed database with test data
    cy.task('db:seed')

    // Login test user
    cy.database('find', 'users').then((user) => {
      cy.login(user.username, 's3cret', true)
    })
  })

  it('create new transaction', () => {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('[data-test=nav-top-new-transaction]').click()
    cy.get('[data-test=user-list-search-input]').click()
    cy.get('[data-test=user-list-search-input]').type('dev')
    cy.get('[data-test=user-list-item-tsHF6_D5oQ]').click()
    cy.get('#amount').type('$25')
    cy.get('#transaction-create-description-input').click()
    cy.get('#transaction-create-description-input').type('Sushi dinner')
    cy.get(
      '[data-test=transaction-create-submit-payment] > .MuiButton-label'
    ).click()
    /* ==== End Cypress Studio ==== */
  })
})
```

### Adding a New Test

You can add a new test to any existing `describe` or `context` block, by
clicking "Add New Test" on our defined `describe` block.

<DocsImage src="/img/guides/cypress-studio/add-test-1.png" alt="Cypress Studio Add Test" no-border></DocsImage>

We are launched into Cypress Studio and can begin interacting with our
application to generate the test.

For this test, we will add a new bank account. Our interactions are as follows:

1. Click "Bank Accounts" in left hand navigation
   <DocsImage src="/img/guides/cypress-studio/add-test-2.png" alt="Cypress Studio Begin Add Test" no-border></DocsImage>
2. Click the "Create" button on Bank Accounts page
   <DocsImage src="/img/guides/cypress-studio/add-test-create.png" alt="Cypress Studio Add Test Create Bank Account" no-border></DocsImage>
3. Fill out the bank account information
   <DocsImage src="/img/guides/cypress-studio/add-test-form-complete.png" alt="Cypress Studio Add Test Complete Bank Account Form" no-border></DocsImage>
4. Click the "Save" button
   <DocsImage src="/img/guides/cypress-studio/add-test-form-saving.png" alt="Cypress Studio Add Test Saving Bank Account" no-border></DocsImage>

To discard the interactions, click the "Cancel" button to exit Cypress Studio.

If satisfied with the interactions with the application, click "Save Commands"
and prompt will ask for the name of the test. Click "Save Test" and the test
will be saved to the file.

<DocsImage src="/img/guides/cypress-studio/add-test-save-test.png" alt="Cypress Studio Add Test Completed Run" no-border></DocsImage>

Once saved, the file will be run again in Cypress.

<DocsImage src="/img/guides/cypress-studio/add-test-final.png" alt="Cypress Studio Add Test Completed Run" no-border></DocsImage>

Finally, viewing our test code, we can see that the test is updated after
clicking "Save Commands" with the actions we recorded in Cypress Studio.

```js
// Code from Real World App (RWA)
import { User } from 'models'

describe('Cypress Studio Demo', () => {
  beforeEach(() => {
    cy.task('db:seed')

    cy.database('find', 'users').then((user: User) => {
      cy.login(user.username, 's3cret', true)
    })
  })

  it('create new transaction', () => {
    // Extend test with Cypress Studio
  })

  /* === Test Created with Cypress Studio === */
  it('create bank account', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('[data-test=sidenav-bankaccounts]').click()
    cy.get('[data-test=bankaccount-new] > .MuiButton-label').click()
    cy.get('#bankaccount-bankName-input').click()
    cy.get('#bankaccount-bankName-input').type('Test Bank Account')
    cy.get('#bankaccount-routingNumber-input').click()
    cy.get('#bankaccount-routingNumber-input').type('987654321')
    cy.get('#bankaccount-accountNumber-input').click()
    cy.get('#bankaccount-accountNumber-input').type('123456789')
    cy.get('[data-test=bankaccount-submit] > .MuiButton-label').click()
    /* ==== End Cypress Studio ==== */
  })
})
```

<Alert type="info">

##### <Icon name="graduation-cap"></Icon> Real World Example

Clone the <Icon name="github"></Icon>
[Real World App (RWA)](https://github.com/cypress-io/cypress-realworld-app) and
refer to the
[cypress/tests/demo/cypress-studio.spec.ts](https://github.com/cypress-io/cypress-realworld-app/blob/develop/cypress/tests/demo/cypress-studio.spec.ts)
file.

</Alert>

## History

| Version                                     | Changes                              |
| ------------------------------------------- | ------------------------------------ |
| [6.3.0](/guides/references/changelog#6-3-0) | Added Cypress Studio as experimental |
