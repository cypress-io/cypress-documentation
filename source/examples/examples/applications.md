---
title: Applications
containerClass: examples
---

Below is a list of complete applications tested in Cypress.

Name | JS | Description
--- | --- | ---
{% urlHash 'Kitchen Sink' Kitchen-Sink %} | Vanilla | Showcases every single Cypress command
{% urlHash 'TodoMVC' TodoMVC %} | React | Compares the official TodoMVC Selenium tests to Cypress
{% urlHash 'Realworld' Realworld %} | React | Full end-to-end tests for the {% url 'gothinkster/realworld' https://github.com/gothinkster/realworld %} "Conduit" app
{% urlHash 'Phonecat' Phonecat %} | Angular 1.x | Compares the official Phonecat Protractor tests to Cypress
{% urlHash 'PieChopper' PieChopper %} | Angular 1.x | Tests a fully featured application with many forms and modals

## Kitchen Sink

{% fa fa-github %} {% url https://github.com/cypress-io/cypress-example-kitchensink %}

This is an example app which is used to showcase every command available in Cypress.

- Query and traverse DOM elements using {% url "`cy.get()`" get %}, {% url "`cy.find()`" find %} and other commands.
- {% url "`.type()`" type %} into forms, {% url "`.click()`" click %} elements, {% url "`.select()`" select %} dropdowns, and other actions.
- Change the size of the viewport using {% url "`cy.viewport()`" viewport %}.
- Navigate to other pages.
- {% url "`cy.route()`" route %} network requests, {% url "`cy.wait()`" wait %} on responses, and stub response data using {% url "`cy.fixture()`" fixture %}.
- Inspect and manipulate cookies and localStorage.

{% imgTag /img/examples/public-project-kitchen-sink.png "kitchensink running" %}

## TodoMVC

{% fa fa-github %} {% url https://github.com/cypress-io/cypress-example-todomvc %}

This repo compares {% url "Cypress Tests" https://github.com/cypress-io/cypress-example-todomvc/blob/master/cypress/integration/app_spec.js %} to {% url "official TodoMVC Tests" https://github.com/tastejs/todomvc/blob/master/tests/test.js %}. This gives you a good comparison of writing and running tests in Cypress versus vanilla Selenium.

- Query and make assertions about DOM elements state.
- Type into an input using {% url "`cy.type()`" type %}.
- Create a custom `cy.createTodo()` command to run multiple cy commands.
- Click and double click elements using {% url "`cy.click()`" click %} and {% url "`cy.dblclick()`" dblclick %}.

{% imgTag /img/examples/public-project-todomvc.png "TodoMvc testing in Cypress" %}

## Realworld

{% fa fa-github %} {% url https://github.com/cypress-io/cypress-example-realworld %}

Shows a full blogging application, "Conduit", with back end code and a database.

- Create a test user from tests by running database commands via the {% url "`cy.task()`" task %} command.
- Log in using {% url "`cy.request()`" request %} and then setting the returned JWT token in `localStorage`.
- Test all aspects of writing blog posts, commenting, and marking favorite posts.
- Collect full stack code coverage using {% url '@cypress/code-coverage' https://github.com/cypress-io/code-coverage %}. Read the Cypress {% url "code coverage guide" code-coverage %} for more details.

{% imgTag /img/examples/realworld-app.png "Realworld test in Cypress" %}

## Phonecat

{% fa fa-github %} {% url https://github.com/cypress-io/cypress-example-phonecat %}

This tests the {% url "original Angular Phonecat example app" https://github.com/angular/angular-phonecat %} using Cypress.

- Test redirect behavior of application using {% url "`.hash()`" hash %}.
- Test loading behavior of app.

{% imgTag /img/examples/public-project-phone-cat.png "Phonecat Angular tutorial app tested in cypress" %}

## PieChopper

{% fa fa-github %} {% url https://github.com/cypress-io/cypress-example-piechopper %}

This is a single page application with a decent amount of features. The tests involve a lot of form submissions.

- Test mobile responsive views using {% url `cy.viewport()` viewport %}
- Test that the app scrolls correctly
- Check checkboxes using {% url `cy.check()` check %}
- Stub responses from our back end using {% url `cy.route()` route %}

{% imgTag /img/examples/public-project-piechopper.png "Piechopper app tested in cypress" %}
