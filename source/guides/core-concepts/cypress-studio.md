---
title: Cypress Studio
---

{% note info %}
# {% fa fa-graduation-cap %} What you'll learn

- How to extend tests interactively using the Cypress Studio
- How to add new tests interactively using the Cypress Studio

{% endnote %}

# Overview

Cypress Studio provides a visual way to generate tests within the Test Runner, by *recording interactions* against the application under test.

The {% url `.click()` click %}, {% url `.type()` type %}, {% url `.check()` check %}, {% url `.uncheck()` uncheck %}, and {% url `.select()` select %} Cypress commands are supported and will generate test code when interacting with the DOM inside of the Cypress Studio.

# Using Cypress Studio

{% note info %}
Cypress Studio is an experimental feature and can be enabled by adding the {% url "`experimentalStudio`" experiments %} attribute to your configuration file (`cypress.json` by default).
{% endnote %}

```json
{
  "experimentalStudio": true
}
```

The Cypress {% fa fa-github %} {% url "Real World App (RWA)" https://github.com/cypress-io/cypress-realworld-app %} is an open source project implementing a payment application to demonstrate real-world usage of Cypress testing methods, patterns, and workflows. It will be used to demonstrate the functionality of Cypress Studio below.

## Extending a Test

You can extend any preexisting test or start by creating a new test in your {% url "`integrationFolder`" configuration#Folders-Files %} (`cypress/integration` by default) with the following test scaffolding.

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

{% note info %}
#### {% fa fa-graduation-cap %} Real World Example
Clone the {% fa fa-github %} {% url "Real World App (RWA)" https://github.com/cypress-io/cypress-realworld-app %} and refer to the {% url "cypress/tests/demo/cypress-studio.spec.ts" https://github.com/cypress-io/cypress-realworld-app/cypress/tests/demo/cypress-studio.spec.ts %} file.
{% endnote %}

### Step 1 - Run the spec

We will use Cypress Studio to perform a "New Transaction" user journey. First, launch the Test Runner and run the spec created in the previous step.

{% imgTag /img/guides/cypress-studio/run-spec-1.png "Cypress Studio" "no-border" %}

Once the tests complete their run, hover over a test in the Command Log to reveal an "Add Commands to Test" button.

Clicking on "Add Commands to Test" will launch the Cypress Studio.

{% note info %}
Cypress Studio is directly integrated with the {% url 'Command Log' test-runner#Command-Log %}.
{% endnote %}

{% imgTag /img/guides/cypress-studio/run-spec-2.png "Cypress Studio" "no-border" %}

### Step 2 - Launch Cypress Studio

{% note success %}
Cypress will automatically execute all hooks and currently present test code, and then the test can be extended from that point on (e.g. We are logged into the application inside the `beforeEach` block).
{% endnote %}

Next, the Test Runner will execute the test in isolation and pause after the last command in the test.

{% imgTag /img/guides/cypress-studio/extend-new-transaction-ready.png "Cypress Studio Ready" "no-border" %}

Now, we can begin updating the test to create a new transaction between users.

### Step 3 - Interact with the Application

To record actions, begin interacting with the application.  Here we will click on the first name input and as a result we will see the click recorded in the Command Log.

{% imgTag /img/guides/cypress-studio/extend-new-transaction-user-list.png "Cypress Studio Extend Test" "no-border" %}

Next, we can type the name of a user to pay and click on the user in the results.

{% imgTag /img/guides/cypress-studio/extend-new-transaction-click-user.png "Cypress Studio Extend Test" "no-border" %}

We will complete the transaction form by clicking on and typing in the amount and description inputs.

{% imgTag /img/guides/cypress-studio/extend-new-transaction-form.png "Cypress Studio Extend Test" "no-border" %}

{% note success %}
Notice the commands generated in the Command Log.
{% endnote %}

Finally, we will click the "Pay" button.

{% imgTag /img/guides/cypress-studio/extend-new-transaction-pay.png "Cypress Studio Extend Test" "no-border" %}

We are presented with a confirmation page of our new transaction.

{% imgTag /img/guides/cypress-studio/extend-new-transaction-confirmation.png "Cypress Studio Extend Test Confirmation" "no-border" %}

To discard the interactions, click the "Cancel" button to exit Cypress Studio. If satisfied with the interactions with the application, click "Save Commands" and the test code will be saved to your spec file.

### Generated Test Code

Viewing our test code, we can see that the test is updated after clicking "Save Commands" with the actions we recorded in Cypress Studio.

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
    cy.get('[data-test=transaction-create-submit-payment] > .MuiButton-label').click()
    /* ==== End Cypress Studio ==== */
  })
})
```

## Adding a New Test

You can add a new test to any existing `describe` or `context` block. Next, we can add a new test, by clicking "Add New Test" our defined `describe` block.

{% imgTag /img/guides/cypress-studio/add-test-1.png "Cypress Studio Add Test" "no-border" %}

We are launched into Cypress Studio and can begin interacting with our application to generate the test.

For this test, we will add a new bank account. Our interactions are as follows:

1. Click "Bank Accounts" in left hand navigation
{% imgTag /img/guides/cypress-studio/add-test-2.png "Cypress Studio Begin Add Test" "no-border" %}
2. Click the "Create" button on Bank Accounts page
{% imgTag /img/guides/cypress-studio/add-test-create.png "Cypress Studio Add Test Create Bank Account" "no-border" %}
3. Fill out the bank account information
{% imgTag /img/guides/cypress-studio/add-test-form-complete.png "Cypress Studio Add Test Complete Bank Account Form" "no-border" %}
4. Click the "Save" button
{% imgTag /img/guides/cypress-studio/add-test-form-saving.png "Cypress Studio Add Test Saving Bank Account" "no-border" %}

To discard the interactions, click the "Cancel" button to exit Cypress Studio.

If satisfied with the interactions with the application, click "Save Commands" and prompt will ask for the name of the test.  Click "Save Test" and the test will be saved to the file.

{% imgTag /img/guides/cypress-studio/add-test-save-test.png "Cypress Studio Add Test Completed Run" "no-border" %}

Once saved, the file will be run again in Cypress.

{% imgTag /img/guides/cypress-studio/add-test-final.png "Cypress Studio Add Test Completed Run" "no-border" %}

Finally, viewing our test code, we can see that the test is updated after clicking "Save Commands" with the actions we recorded in Cypress Studio.

```js
// Code from Real World App (RWA)
import { User } from "models";

describe("Cypress Studio Demo", () => {
  beforeEach(() => {
    cy.task("db:seed");

    cy.database("find", "users").then((user: User) => {
      cy.login(user.username, "s3cret", true);
    });
  });

  it("create new transaction", () => {
    // Extend test with Cypress Studio
  });

  /* === Test Created with Cypress Studio === */
  it('create bank account', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('[data-test=sidenav-bankaccounts]').click();
    cy.get('[data-test=bankaccount-new] > .MuiButton-label').click();
    cy.get('#bankaccount-bankName-input').click();
    cy.get('#bankaccount-bankName-input').type('Test Bank Account');
    cy.get('#bankaccount-routingNumber-input').click();
    cy.get('#bankaccount-routingNumber-input').type('987654321');
    cy.get('#bankaccount-accountNumber-input').click();
    cy.get('#bankaccount-accountNumber-input').type('123456789');
    cy.get('[data-test=bankaccount-submit] > .MuiButton-label').click();
    /* ==== End Cypress Studio ==== */
  });
})
```

{% note info %}
#### {% fa fa-graduation-cap %} Real World Example
Clone the {% fa fa-github %} {% url "Real World App (RWA)" https://github.com/cypress-io/cypress-realworld-app %} and refer to the {% url "cypress/tests/demo/cypress-studio.spec.ts" https://github.com/cypress-io/cypress-realworld-app/cypress/tests/demo/cypress-studio.spec.ts %} file.
{% endnote %}

{% history %}
{% url "6.3.0" changelog#6-3-0 %} | Added Cypress Studio as experimental
{% endhistory %}
