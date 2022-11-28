---
title: Applications
containerClass: examples
---

Below is a list of complete applications tested in Cypress.

| Name                                      | JS         | Description                                                                                                   |
| ----------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------- |
| [Kitchen Sink](#Kitchen-Sink)             | Vanilla    | Showcases every single Cypress command                                                                        |
| [TodoMVC](#TodoMVC)                       | React      | Compares the official TodoMVC Selenium tests to Cypress                                                       |
| [Realworld](#Realworld)                   | React      | Full end-to-end tests for the [gothinkster/realworld](https://github.com/gothinkster/realworld) "Conduit" app |
| [Angular-playground](#Angular-playground) | Angular 11 | Full TypeScript project with code coverage                                                                    |

## Kitchen Sink

<Icon name="github"></Icon>
[https://github.com/cypress-io/cypress-example-kitchensink](https://github.com/cypress-io/cypress-example-kitchensink)

This is an example app which is used to showcase every command available in
Cypress.

- Query and traverse DOM elements using [cy.get()](/api/commands/get),
  [cy.find()](/api/commands/find) and other commands.
- [.type()](/api/commands/type) into forms, [.click()](/api/commands/click)
  elements, [.select()](/api/commands/select) dropdowns, and other actions.
- Change the size of the viewport using [cy.viewport()](/api/commands/viewport).
- Navigate to other pages.
- [cy.intercept()](/api/commands/intercept) network requests,
  [cy.wait()](/api/commands/wait) on responses, and stub response data using
  [cy.fixture()](/api/commands/fixture).
- Inspect and manipulate cookies and localStorage.

<DocsImage src="/img/examples/public-project-kitchen-sink.png" alt="kitchensink running" ></DocsImage>

## TodoMVC

<Icon name="github"></Icon>
[https://github.com/cypress-io/cypress-example-todomvc](https://github.com/cypress-io/cypress-example-todomvc)

This repo compares
[Cypress Tests](https://github.com/cypress-io/cypress-example-todomvc/blob/master/cypress/integration/app_spec.js)
to
[official TodoMVC Tests](https://github.com/tastejs/todomvc/blob/master/tests/test.js).
This gives you a good comparison of writing and running tests in Cypress versus
vanilla Selenium.

- Query and make assertions about DOM elements state.
- Type into an input using [cy.type()](/api/commands/type).
- Create a custom `cy.createTodo()` command to run multiple cy commands.
- Click and double click elements using [cy.click()](/api/commands/click) and
  [cy.dblclick()](/api/commands/dblclick).

<DocsImage src="/img/examples/public-project-todomvc.png" alt="TodoMvc testing in Cypress" ></DocsImage>

## TodoMVC Redux

<Icon name="github"></Icon>
[https://github.com/cypress-io/cypress-example-todomvc-redux](https://github.com/cypress-io/cypress-example-todomvc-redux)

A fork the
[official Redux TodoMVC example](https://github.com/reduxjs/redux/tree/master/examples/todomvc).
Through a combination of end-to-end and unit tests shows how you can achieve
100% code coverage.

- Instrument and collect code coverage following the Cypress
  [Code Coverage](/guides/tooling/code-coverage) guide.

<DocsImage src="/img/examples/todomvc-redux-100percent.png" alt="TodoMVC Redux application code coverage report" ></DocsImage>

## Realworld

<Icon name="github"></Icon>
[https://github.com/cypress-io/cypress-example-realworld](https://github.com/cypress-io/cypress-example-realworld)

Shows a full blogging application, "Conduit", with back end code and a database.

- Create a test user from tests by running database commands via the
  [cy.task()](/api/commands/task) command.
- Log in using [cy.request()](/api/commands/request) and then setting the
  returned JWT token in `localStorage`.
- Test all aspects of writing blog posts, commenting, and marking favorite
  posts.
- Collect full stack code coverage using
  [@cypress/code-coverage](https://github.com/cypress-io/code-coverage). Read
  the Cypress [code coverage guide](/guides/tooling/code-coverage) for more
  details.

<DocsImage src="/img/examples/realworld-app.png" alt="Realworld test in Cypress" ></DocsImage>

## Angular-playground

<Icon name="github"></Icon>
[https://github.com/muratkeremozcan/angular-playground](https://github.com/muratkeremozcan/angular-playground)

A 3rd-party copy of Angular's Karma examples, enhanced for innovation
activities, best practices and information sharing.

- 100% code and tests implemented in TypeScript
- CI setup using
  [Cypress CircleCI Orb](https://github.com/cypress-io/circleci-orb)
- Combined coverage with Jest and Cypress via
  [Cypress code coverage plugin](https://github.com/cypress-io/code-coverage)
- linters and pre-commit hooks: Eslint, Prettier, Js-beautify, Husky
- recording test results on Cypress Cloud

## More examples

To find more Cypress examples, search GitHub for
[`topic:cypress-example`](https://github.com/search?q=topic%3Acypress-example).
If the number of results is overwhelming, limit yourself to the examples created
under Cypress organization
[`topic:cypress-example user:cypress-io`](https://github.com/search?q=topic%3Acypress-example+user%3Acypress-io),
or created by individual Cypress engineers, like
[`topic:cypress-example user:bahmutov`](https://github.com/search?q=topic%3Acypress-example+user%3Abahmutov).
