---
title: 'Choosing a Testing Type: End-to-end or Component Tests?'
---

<Alert type="info">

## <Icon name="graduation-cap"></Icon> What you'll learn

- What is end-to-end testing and component testing
- Considerations for each testing type
- How to choose which test type based on your scenario </Alert>

One of the first decisions you will need to make on your testing journey is what
type of test to create. Cypress offers two options: end-to-end (e2e) and
component tests. There are benefits and considerations for each choice, and the
decision will depend on the needs of what you are currently trying to
accomplish. In the end, you will probably have a combination of both types of
tests for your app, but how do you choose right now?

Let's go over each of these test types, the benefits they bring, things to
consider, and scenarios for each.

## What is End-to-end Testing?

End-to-end testing is a technique that tests your app from the web browser
through to the back end of your application, as well as testing integrations
with third-party APIs and services. These types of tests are great at making
sure your entire app is functioning as a cohesive whole.

Cypress runs e2e tests the same way users interact with your app by using a real
browser, visiting URLs, viewing content, clicking on links and buttons, etc.
Testing this way helps ensure your tests and the user's experience are the same.

Writing end-to-end tests in Cypress can be done by developers building the
application, specialized testing engineers, or a quality assurance team
responsible for verifying an app is ready for release. Tests are written in code
with an API that simulates the steps a that a real user would take.

End-to-end tests are great at verifying your app runs as intended, from the
front end to the back end. However, end-to-end tests can be more difficult to
set up, run, and maintain. There are often infrastructure needs in setting up a
backend for testing purposes. Your team will need to develop a
[strategy](https://docs.cypress.io/guides/getting-started/testing-your-app#Testing-strategies)
on how to handle this complexity.

<Alert type="success">

### Benefits of end-to-end tests:

- Ensure your app is functioning as a cohesive whole
- Tests match the user experience
- Can be written by developers or QA Teams
- Can be used for integration testing as well

### Considerations for end-to-end tests:

- More difficult to set up, run, and maintain
- Provision testing infrastructure in CI
- Testing certain scenarios require more setup

### Common scenarios for end-to-end tests:

- Validating critical workflows like authentication and purchasing
- Ensuring data is persisted and displayed through multiple screens
- Running Smoke Tests and System Checks before deployment </Alert>

## What is Component Testing?

Modern web frameworks provide ways to write applications by breaking them into
smaller logical units called components. Components can range from fairly small
(like a button) to more complex (like a registration form).

Because of their nature, components tend to be easily testable, which is where
Cypress Component Testing comes into play.

Component tests differ from e2e tests in that instead of visiting a URL to pull
up an entire app, a component can be "mounted" and tested on its own. This
allows you to focus on testing only the component's functionality and not
worrying about other nuances with testing a component as part of the larger
application.

Typically, a component test is written by the developers working on the
component. The code for the test lives alongside the component code, and it is
common for tests to be coded simultaneously with the component, helping
developers verify the required functionality while building it.

One thing to consider, though, is even if all your component tests pass, it does
not mean your app is functioning properly. Component tests do nothing to ensure
that all the layers of your app are working well together. Therefore, a
well-tested app has a combination of e2e and component tests, with each set of
tests specializing in what they do best.

<Alert type="success">

### Benefits of component tests:

- Easier to test components in isolation
- Fast and reliable
- Easy to set up specific scenarios in tests
- Don't rely on any external system to run

### Considerations for component tests:

- Does not ensure overall app quality
- Does not call into external APIs/Services
- Usually written by developers working on the component

### Common scenarios for component tests:

- Testing a date picker works properly for a variety of scenarios
- That a form shows and hides specific sections based on input
- Testing components coming out of a design system
- Testing logic not tied to a component (like unit tests!) </Alert>
