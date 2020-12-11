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

## Using Cypress Studio

The Cypress {% fa fa-github %} {% url "Real World App (RWA)" https://github.com/cypress-io/cypress-realworld-app %} will be use to demo the functionality of Cypress Studio.

### Extending a Test

Create a file under `cypress/integration` with the following test scaffolding.

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

We will use Cypress Studio to perform a New Transaction user journey.

We are logged into the application inside the `beforeEach` block.

Cypress Studio is directly integrated with the {% url 'Command Log' test-runner#Command-Log %}.

First, launch the Test Runner and run the spec created in the previous step.

{% imgTag /img/guides/cypress-studio/extend-test-1.png "Cypress Studio" "no-border" %}

Once the tests complete the run, hovering over the test in the Command Log will reveal an "Extend Test" button. Clicking on "Extend Test" will launch the Cypress Studio.

{% imgTag /img/guides/cypress-studio/extend-test-2.png "Cypress Studio" "no-border" %}

Click the "Get Started" button to begin interacting with your site to generate tests.
{% imgTag /img/guides/cypress-studio/extend-test-3.png "Cypress Studio Get Started" "no-border" %}

Next, the Test Runner will execute the test in isolation and pause after the last command in the test.
{% imgTag /img/guides/cypress-studio/extend-test-4.png "Cypress Studio Extend Test" "no-border" %}

Now, we can begin updating the test to create a new transaction between users.

To record actions, begin interacting with the application.  Here we will click on the first name input and as a result we will see the click recorded in the Command Log.

{% imgTag /img/guides/cypress-studio/extend-test-5.png "Cypress Studio Extend Test" "no-border" %}

Next, we can type the name of a user to pay and click on the user in the results.

{% imgTag /img/guides/cypress-studio/extend-test-6.png "Cypress Studio Extend Test" "no-border" %}


Next, we will complete the transaction form clicking on and typing in the amount and description inputs.  Notice the commands generated in the command log.
{% imgTag /img/guides/cypress-studio/extend-test-7.png "Cypress Studio Extend Test" "no-border" %}


Finally, we will click the "Pay" button.
{% imgTag /img/guides/cypress-studio/extend-test-8.png "Cypress Studio Extend Test" "no-border" %}

We are presented with a confirmation page of our new transaction.
{% imgTag /img/guides/cypress-studio/extend-test-9.png "Cypress Studio Extend Test Confirmation" "no-border" %}

## Supported Commands

The following Cypress commands are supported. Test code will be generated when interacting with the DOM inside of the Cypress Studio:

- {% url `.click()` click %}
- {% url `.dblclick()` dblclick %}
- {% url `.type()` type %}
- {% url `.select()` select %}
