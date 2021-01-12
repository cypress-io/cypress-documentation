---
title: Cypress Studio
---

{% note info %}
# {% fa fa-graduation-cap %} What you'll learn

- How to extend tests interactively using the Cypress Studio
{% endnote %}

# Overview

Cypress Studio provides a visual way to generate tests within the Test Runner, by *recording interactions* against the application under test.

{% imgTag /img/guides/cypress-studio/cypress-studio-overview.png "Cypress Studio" "no-border" %}

The {% url `.click()` click %}, {% url `.dblclick()` dblclick %}, {% url `.type()` type %} and {% url `.select()` select %} Cypress commands are supported and will generate test code when interacting with the DOM inside of the Cypress Studio.

## Using Cypress Studio

{% note info %}
Cypress Studio is an experimental feature and can be enabled by adding the `experimentalStudio` attribute to your `cypress.json`.
{% endnote %}

```json
{
  "experimentalStudio": true,
}
```

The Cypress {% fa fa-github %} {% url "Real World App (RWA)" https://github.com/cypress-io/cypress-realworld-app %} is an open source project implementing a payment application to demonstrate real-world usage of Cypress testing methods, patterns, and workflows. It will be used to demonstrate the functionality of Cypress Studio.

### Extending a Test

You can extend any preexisting test or start by creating a new test under `cypress/integration` with the following test scaffolding.

```js
describe('Cypress Studio Demo', function () {
  beforeEach(function () {
    // Seed database with test data
    cy.task('db:seed')

    // Login test user
    cy.database('find', 'users').then((user) => {
      cy.login(user.username, 's3cret', true)
    })
  })

  it('create new transaction', function () {
    // Extend test with Cypress Studio
  })

  it('create new bank account', function () {
    // Extend test with Cypress Studio
  })
})
```

{% note info %}
#### {% fa fa-graduation-cap %} Real World Example
Clone the {% fa fa-github %} {% url "Real World App (RWA)" https://github.com/cypress-io/cypress-realworld-app %} and refer to the {% url "cypress/tests/demo/cypress-studio.spec.ts" https://github.com/cypress-io/cypress-realworld-app/cypress/tests/demo/cypress-studio.spec.ts %} file.
{% endnote %}

#### Step 1 - Run the spec
We will use Cypress Studio to perform a "New Transaction" user journey. First, launch the Test Runner and run the spec created in the previous step.

{% imgTag /img/guides/cypress-studio/run-spec-1.png "Cypress Studio" "no-border" %}

Once the tests complete their run, hover over a test in the Command Log to reveal a "Add Commands to Test" button.

Clicking on "Add Commands to Test" will launch the Cypress Studio.

{% note info %}
Cypress Studio is directly integrated with the {% url 'Command Log' test-runner#Command-Log %}.
{% endnote %}

{% imgTag /img/guides/cypress-studio/run-spec-2.png "Cypress Studio" "no-border" %}

#### Step 2 - Launch Cypress Studio

{% note success %}
Cypress will automatically execute all hooks and currently present test code, and then the test can be extended from that point on (e.g. We are logged into the application inside the `beforeEach` block).
{% endnote %}

Next, the Test Runner will execute the test in isolation and pause after the last command in the test.
{% imgTag /img/guides/cypress-studio/extend-new-transaction-ready.png "Cypress Studio Ready" "no-border" %}

Now, we can begin updating the test to create a new transaction between users.

#### Step 3 - Interact with the Application

To record actions, begin interacting with the application.  Here we will click on the first name input and as a result we will see the click recorded in the Command Log.

{% imgTag /img/guides/cypress-studio/extend-new-transaction-user-list.png "Cypress Studio Extend Test" "no-border" %}

Next, we can type the name of a user to pay and click on the user in the results.

{% imgTag /img/guides/cypress-studio/extend-new-transaction-click-user.png "Cypress Studio Extend Test" "no-border" %}

We will complete the transaction form by clicking on and typing in the amount and description inputs.  
{% imgTag /img/guides/cypress-studio/extend-new-transaction-form.png "Cypress Studio Extend Test" "no-border" %}

{% note success %}
Notice the commands generated in the command log.
{% endnote %}

Finally, we will click the "Pay" button.
{% imgTag /img/guides/cypress-studio/extend-new-transaction-pay.png "Cypress Studio Extend Test" "no-border" %}

We are presented with a confirmation page of our new transaction.
{% imgTag /img/guides/cypress-studio/extend-new-transaction-confirmation.png "Cypress Studio Extend Test Confirmation" "no-border" %}

#### Run or Save Test


#### Generated Test Code


Our test is updated after clicking "Save Commands" with the actions recorded in Cypress Studio.

```js
describe('Cypress Studio Demo', function () {
  beforeEach(function () {
    // Seed database with test data
    cy.task('db:seed')

    // Login test user
    cy.database('find', 'users').then((user) => {
      cy.login(user.username, 's3cret', true)
    })
  })

  it('create new transaction', function () {
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

  it('create new bank account', function () {
    // Extend test with Cypress Studio
  })
})
```