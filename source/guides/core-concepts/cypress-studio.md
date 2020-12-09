---
title: Cypress Studio
---

{% note info %}
# {% fa fa-graduation-cap %} What you'll learn

- How to extend tests interactively using the Cypress Studio
{% endnote %}

# Overview

Cypress Studio provides users with an easy way to generate tests in the Test Runner,  by interacting with their web app, directly inside the Test Runner.


{% imgTag /img/guides/cypress-studio/cypress-studio-overview.png "Cypress Studio" "no-border" %}

## Supported Commands

- cy.click()
- cy.dblclick()
- cy.type()
- cy.select()


## Extending a Test

Cypress Studio is directly integrated with the {% url 'Command Log' test-runner#Command-Log %}.

First, launch the Test Runner and run a spec.  Once the tests complete the run, hovering over the test in the Command Log will reveal an "Extend Test" button.

{% imgTag /img/guides/cypress-studio/extend-test-1.png "Cypress Studio" "no-border" %}


Clicking on "Extend Test" will launch the Cypress Studio.

{% imgTag /img/guides/cypress-studio/extend-test-2.png "Cypress Studio Get Started" "no-border" %}

Click the "Get Started" button to begin interacting with your site to generate tests.

The Test Runner will execute the test in isolation and pause after the last line in the test.

{% imgTag /img/guides/cypress-studio/extend-test-3.png "Cypress Studio Launch" "no-border" %}