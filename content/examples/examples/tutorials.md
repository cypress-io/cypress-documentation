---
title: Tutorial Videos
containerClass: examples
---

## Best Practices

This video by the creator of Cypress Brian Mann shows what we consider the best
practices for writing tests for a realistic application.

First we'll test our "Login Page", refactor, and then create a
[Custom Command](/api/cypress-api/custom-commands). From there we'll use
[`cy.request()`](/api/commands/request) to programmatically log in. Finally,
we'll discuss approaches for taking shortcuts by controlling your application's
state directly, and for writing your tests **in isolation** to prevent specs
from being coupled together or having to share knowledge.

| Tutorial                                                                                       | Length                           | Release date                                                | Cypress version |
| ---------------------------------------------------------------------------------------------- | -------------------------------- | ----------------------------------------------------------- | --------------- |
| [Organizing Tests, Logging In, Controlling State](https://www.youtube.com/watch?v=5XQOK0v_YRE) | <Icon name="video"></Icon> 27:21 | <time datetime="2018-02-22T16:00:00.000Z">02-22-2018</time> | 2.1.0           |

## Video playlists

Learn how to use Cypress to solve specific testing problems from the videos in
the playlists below.

- [Official Cypress.io YouTube Channel](https://www.youtube.com/cypress_io)
- [Cypress.io - end-to-end Testing Framework](https://www.youtube.com/playlist?list=PLzDWIPKHyNmK9NX9_ng2IdrkEr8L4WwB0)
  by [Bushra Alam](https://twitter.com/imBushraAlam)
- [Cypress Tips & Tricks](https://www.youtube.com/playlist?list=PLP9o9QNnQuAYYRpJzDNWpeuOVTwxmIxcI)
  by [Gleb Bahmutov](https://twitter.com/bahmutov)
- [Cypress Component Testing for Svelte](https://www.youtube.com/playlist?list=PLP9o9QNnQuAa50lwW3cUql5sgdKIWkapp)
  by [Gleb Bahmutov](https://twitter.com/bahmutov)
- [Visually testing React component using open source tools](https://www.youtube.com/playlist?list=PLP9o9QNnQuAYhotnIDEUQNXuvXL7ZmlyZ)
  by [Gleb Bahmutov](https://twitter.com/bahmutov)

You can also find free Cypress video tutorials on the
[Courses](/examples/media/courses-media) page.

## Test a React Todo App

In this tutorial, we will walk through building a "Todo" application in
[React](https://reactjs.org) while testing it with Cypress. We will look at ways
we can use Cypress to not only create a test suite for our application, but help
us write our tests and guide feature implementation.

By the end of this tutorial, you will have a feel for what it is like to test
your application with Cypress while implementing features. You will gain
experience with many of the Cypress [commands](/api/api/table-of-contents) and
see how Cypress can help you build your application while creating a great
safety net of tests along the way.

We have a lot of ground to cover, so let's get started!

**_Contents:_**

| Tutorial                                                             | Length                           | Release date                                                | Cypress version |
| -------------------------------------------------------------------- | -------------------------------- | ----------------------------------------------------------- | --------------- |
| 1. [Project setup](#1-Project-setup)                                 | <Icon name="video"></Icon> 3:52  | <time datetime="2017-11-01T16:00:00.000Z">11-01-2017</time> | 1.0.2           |
| 2. [Testing inputs](#2-Text-inputs)                                  | <Icon name="video"></Icon> 7:17  | <time datetime="2017-11-01T16:00:00.000Z">11-01-2017</time> | 1.0.2           |
| 3. [Form submission and XHRs](#3-Form-submission-and-XHRs)           | <Icon name="video"></Icon> 10:21 | <time datetime="2017-11-04T10:45:00.000Z">11-04-2017</time> | 1.0.2           |
| 4. [Loading data with fixtures](#4-Loading-data-with-fixtures)       | <Icon name="video"></Icon> 9:00  | <time datetime="2017-11-08T16:00:00.000Z">11-08-2017</time> | 1.0.2           |
| 5. [Todo item behavior](#5-Todo-item-behavior)                       | <Icon name="video"></Icon> 8:19  | <time datetime="2017-11-20T16:00:00.000Z">11-20-2017</time> | 1.0.2           |
| 6. [Toggling and debugging](#6-Toggling-and-debugging)               | <Icon name="video"></Icon> 9:05  | <time datetime="2017-11-20T16:00:00.000Z">11-20-2017</time> | 1.0.2           |
| 7. [Filters and data-driven tests](#7-Filters-and-data-driven-tests) | <Icon name="video"></Icon> 11:39 | <time datetime="2017-11-29T16:00:00.000Z">11-29-2017</time> | 1.0.2           |
| 8. [Full end-to-end tests part 1](#8-Full-end-to-end-tests-part-1)   | <Icon name="video"></Icon> 8:59  | <time datetime="2017-12-07T16:00:00.000Z">12-07-2017</time> | 1.0.2           |
| 9. [Full end-to-end tests part 2](#9-Full-end-to-end-tests-part-2)   | <Icon name="video"></Icon> 7:04  | <time datetime="2017-12-07T16:00:00.000Z">12-07-2017</time> | 1.0.2           |

### 1. Project setup

We will start by cloning a starter
[repository](https://github.com/cypress-io/cypress-tutorial-build-todo-starter).
This repo already has the build and server configuration handled. We will take a
look at the project's [`npm`](https://www.npmjs.com/) dependencies and scripts,
then jump right into getting Cypress up and running.

<Icon name="github"></Icon>
[Get the completed code for this lesson on GitHub](https://github.com/cypress-io/cypress-tutorial-build-todo/tree/01_setup)

<DocsVideo src="https://vimeo.com/240554515"></DocsVideo>

### 2. Text inputs

We will work through creating our first real test and implementing the feature
under test as we go. We will see how to find and interact with elements on the
page and how to make assertions about their behavior. We will also look into
some best practices like using `beforeEach` and defining our application's
[baseUrl](/guides/references/configuration#Global) to remove duplicated code.

<Icon name="github"></Icon>
[Get the completed code for this lesson on GitHub](https://github.com/cypress-io/cypress-tutorial-build-todo/tree/02_inputs)

<DocsVideo src="https://vimeo.com/240554808"></DocsVideo>

### 3. Form submission and XHRs

We will implement form submission for our todo app, leveraging
[`cy.server()`](/api/commands/server) and [`cy.route()`](/api/commands/route) to
stub calls to our API. We will iterate on our test and implementation, focusing
on the application's "happy path" first. Once our form is working, we'll use
another stubbed XHR call to setup a failure scenario and implement the code to
properly display an error message.

<Icon name="github"></Icon>
[Get the completed code for this lesson on GitHub](https://github.com/cypress-io/cypress-tutorial-build-todo/tree/03_form_sub)

<DocsVideo src="https://vimeo.com/241063147"></DocsVideo>

### 4. Loading data with fixtures

We will implement the initial data load for our todo app, leveraging
[`cy.server()`](/api/commands/server) and [`cy.route()`](/api/commands/route) to
stub the API call to load our data. We will use
[fixture data](/api/commands/fixture#Shortcuts) to seed our application state.
As we iterate on our test and app code, we will create and use a
[custom command](/api/cypress-api/custom-commands) to avoid unnecessary code
duplication and keep our tests clean and readable.

We will be using this list of todo objects to stub our XHR calls. For
convenience, you can copy it from here and paste it in as you follow along.

```json
[
  {
    "id": 1,
    "name": "Buy Milk",
    "isComplete": false
  },
  {
    "id": 2,
    "name": "Buy Eggs",
    "isComplete": false
  },
  {
    "id": 3,
    "name": "Buy Bread",
    "isComplete": false
  },
  {
    "id": 4,
    "name": "Make French Toast",
    "isComplete": false
  }
]
```

<Icon name="github"></Icon>
[Get the completed code for this lesson on GitHub](https://github.com/cypress-io/cypress-tutorial-build-todo/tree/04_custom_cmd)

<DocsVideo src="https://vimeo.com/241773142"></DocsVideo>

### 5. Todo item behavior

We will update our app to properly display todo items based on their
`isComplete` property, adding tests to verify the proper behavior as we go. From
there, we'll test and implement the item deletion functionality. We will cover
interacting with an element that is hidden unless hovered over and look at
different ways of handling this situation. We'll also look at the appropriate
way to hold onto references to previously queried DOM elements using
[`.as()`](/api/commands/as) to create aliases.

<Icon name="github"></Icon>
[Get the completed code for this lesson on GitHub](https://github.com/cypress-io/cypress-tutorial-build-todo/tree/05_todo_items)

<DocsVideo src="https://vimeo.com/242954792"></DocsVideo>

### 6. Toggling and debugging

We will create a test for todo item toggling. As we implement the toggle
feature, we will encounter a problem with our code and look at how Cypress can
help us debug our code. We will use the
[Cypress Command Log](/guides/core-concepts/cypress-app#Command-Log) to narrow
down our problem. Then, we can use the
[Developer Tools right in Cypress](/guides/guides/debugging#Using-the-Developer-Tools)
to step through the code to dig into the issue. We'll even see how we can update
application state while debugging and let our test confirm our theory about the
cause of the bug. Once the debugging is complete, we will refactor our code to
be less error prone, relying on the test to help us get it right.

<Icon name="github"></Icon>
[Get the completed code for this lesson on GitHub](https://github.com/cypress-io/cypress-tutorial-build-todo/tree/06_toggle_debug)

<DocsVideo src="https://vimeo.com/242961930"></DocsVideo>

### 7. Filters and data-driven tests

We will test the application's footer behavior. First, we will ensure that our
footer properly displays singular or plural text, based on the number of
remaining todos. From there, we will test and implement the list filtering
feature. We will create a test for one of the filters and see how to wire up
[React Router](https://github.com/ReactTraining/react-router) to make our filter
links work. We will then look at how we can use standard JavaScript data
structures to drive multiple assertions in our test, allowing us to test
multiple variations of the filter behavior in a single test.

<Icon name="github"></Icon>
[Get the completed code for this lesson on GitHub](https://github.com/cypress-io/cypress-tutorial-build-todo/tree/07_data_driven)

<DocsVideo src="https://vimeo.com/244696145"></DocsVideo>

### 8. Full end-to-end tests part 1

We will connect our back end API to the front end we've been building. Once we
have the back end API connected, then we will create our first true end-to-end
test. Using the back end API, we will ensure a consistent starting state by
deleting any existing data from the database. Then we will test that our
application can create and save new todos without a stubbed back end. We will
also see how we can listen to and [`cy.wait()`](/api/commands/wait) for XHR
responses in our tests to avoid flake caused by unpredictable response times.

<Icon name="github"></Icon>
[Get the completed code for this lesson on GitHub](https://github.com/cypress-io/cypress-tutorial-build-todo/tree/08_smoke_1)

<DocsVideo src="https://vimeo.com/245387683"></DocsVideo>

### 9. Full end-to-end tests part 2

We will continue building on our full end-to-end tests, this time seeding the
database to test our application against a populated database. We will repeat
the pattern of adding [`cy.wait()`](/api/commands/wait) commands to our tests to
ensure our back end has responded before moving on. Once we have tests for
deleting and updating items against a real back end, we will see how to run our
Cypress tests using `cypress run`, giving us an ideal setup for running our
tests in a CI environment.

<Icon name="github"></Icon>
[Get the completed code for this lesson on GitHub](https://github.com/cypress-io/cypress-tutorial-build-todo/tree/09_smoke_2)

<DocsVideo src="https://vimeo.com/245388948"></DocsVideo>
