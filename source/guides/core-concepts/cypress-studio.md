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

The following Cypress commands are supported. Test code will be generated when interacting with the DOM inside of the Cypress Studio:

- {% url `.click()` click %}
- {% url `.dblclick()` dblclick %}
- {% url `.type()` type %}
- {% url `.select()` select %}


## Extending a Test

Cypress Studio is directly integrated with the {% url 'Command Log' test-runner#Command-Log %}.

First, launch the Test Runner and run a spec.  Once the tests complete the run, hovering over the test in the Command Log will reveal an "Extend Test" button. Clicking on "Extend Test" will launch the Cypress Studio.

{% imgTag /img/guides/cypress-studio/extend-test-1.png "Cypress Studio" "no-border" %}

Click the "Get Started" button to begin interacting with your site to generate tests.
{% imgTag /img/guides/cypress-studio/extend-test-2.png "Cypress Studio Get Started" "no-border" %}

Next, the Test Runner will execute the test in isolation and pause after the last command in the test.
{% imgTag /img/guides/cypress-studio/extend-test-3.png "Cypress Studio Extend Test" "no-border" %}

To record actions, begin interacting with the application.  Here we will click on the first name input and as a result we will see the click recorded in the Command Log.

{% imgTag /img/guides/cypress-studio/extend-test-4.png "Cypress Studio Extend Test" "no-border" %}

Next, we can type a new name and see that action recorded.

{% imgTag /img/guides/cypress-studio/extend-test-5.png "Cypress Studio Extend Test" "no-border" %}