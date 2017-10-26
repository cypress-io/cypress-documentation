---
title: Introduction
comments: false
---

{% note info %}
# {% fa fa-graduation-cap %} What you'll learn

- Using Cypress to test during feature development
- How to use the Cypress UI to help create your tests
- How to stub network requests to test your front-end in isolation
- How to use fixtures to supply your application with test data
- How to manipulate fixture data in your specs to handle different data requirements
- How to create custom Cypress commands
- How to create data-driven tests to remove duplication
- How to setup and teardown real data to run true end-to-end tests that are reliable and repeatable

{% endnote %}

In this tutorial, we'll walk through building a todo application while testing it with Cypress. We'll look at ways we can leverage Cypress to not only create a test suite for our application, but how it can be used to help us write our tests and guide the implementation of features.

We'll start with the [project setup](./project-setup.html) where we'll clone a repository that already has the build and server configuration handled. We'll take a look at the project's dependencies and scripts and then we'll jump right into getting Cypress up and running.

From there, we'll work through creating our first real test and implementing the feature under test as we go. We'll see how to find and interact with elements on the page and how to make assertions about their behavior.

We'll continue to implement features and create tests while digging into the available commands and features that make Cypress so incredible to work with.

We'll build up the entire application using stubbed network requests in our tests. By stubbing the API based on a contract, we can effectively build the front-end for our application and then connect it to the API when it's available. We'll do just that by enabling the API once the front-end is done. Then, we'll dive into how we can code the setup and teardown of real data against the APIs and write some true end to end tests.

By the end of this tutorial, you will have a feel for what it's like to test your application with Cypress while implementing features and how Cypress can help you better implement features while creating a great safety net of tests along the way.

We have a lot of ground to cover, so let's get started!