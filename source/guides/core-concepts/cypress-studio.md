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

{% imgTag /img/guides/cypress-studio/extend-test-1.png "Cypress Studio" "no-border" %}

Once the tests complete their run, hover over the test in the Command Log to reveal an "Extend Test" button. Clicking on "Extend Test" will launch the Cypress Studio.

{% note info %}
Cypress Studio is directly integrated with the {% url 'Command Log' test-runner#Command-Log %}.
{% endnote %}

{% imgTag /img/guides/cypress-studio/extend-test-2.png "Cypress Studio" "no-border" %}

#### Step 2 - Launch Cypress Studio for a test

Click the "Get Started" button to begin interacting with your site to generate tests.
{% imgTag /img/guides/cypress-studio/extend-test-3.png "Cypress Studio Get Started" "no-border" %}

{% note success %}
Cypress will automatically execute all hooks and currently present test code, and then the test can be extended from that point on (e.g. We are logged into the application inside the `beforeEach` block).
{% endnote %}

Next, the Test Runner will execute the test in isolation and pause after the last command in the test.
{% imgTag /img/guides/cypress-studio/extend-test-4.png "Cypress Studio Extend Test" "no-border" %}

Now, we can begin updating the test to create a new transaction between users.

#### Step 3 - Interact with the Application

To record actions, begin interacting with the application.  Here we will click on the first name input and as a result we will see the click recorded in the Command Log.

{% imgTag /img/guides/cypress-studio/extend-test-5.png "Cypress Studio Extend Test" "no-border" %}

Next, we can type the name of a user to pay and click on the user in the results.

{% imgTag /img/guides/cypress-studio/extend-test-6.png "Cypress Studio Extend Test" "no-border" %}

We will complete the transaction form by clicking on and typing in the amount and description inputs.  
{% imgTag /img/guides/cypress-studio/extend-test-7.png "Cypress Studio Extend Test" "no-border" %}

{% note success %}
Notice the commands generated in the command log.
{% endnote %}

Finally, we will click the "Pay" button.
{% imgTag /img/guides/cypress-studio/extend-test-8.png "Cypress Studio Extend Test" "no-border" %}

We are presented with a confirmation page of our new transaction.
{% imgTag /img/guides/cypress-studio/extend-test-9.png "Cypress Studio Extend Test Confirmation" "no-border" %}

