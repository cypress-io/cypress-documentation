---
title: Recipes
containerClass: examples
---

Recipes show you how to test common scenarios in Cypress.

<Icon name="github"></Icon>
[https://github.com/cypress-io/cypress-example-recipes](https://github.com/cypress-io/cypress-example-recipes)

## Fundamentals

| Recipe                                                                                                                                          | Description                                                                                     |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| [Node Modules](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/fundamentals__node-modules)                           | Import your own Node modules                                                                    |
| [Environment variables](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/server-communication__env-variables)         | Passing environment variables to tests                                                          |
| [Handling errors](https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/fundamentals__errors)                              | Handling thrown errors and unhandled promise rejections                                         |
| [Dynamic tests](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/fundamentals__dynamic-tests)                         | Create tests dynamically from JSON data                                                         |
| [Dynamic tests from CSV](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/fundamentals__dynamic-tests-from-csv)       | Create tests dynamically from CSV file                                                          |
| [Dynamic tests from API](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/fundamentals__dynamic-tests-from-api)       | Create tests dynamically by calling an external API                                             |
| [Fixtures](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/fundamentals__fixtures)                                   | Loading single or multiple fixtures                                                             |
| [Adding Custom Commands](https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/fundamentals__add-custom-command)           | Write your own custom commands using JavaScript with correct types for IntelliSense to work     |
| [Adding Custom Commands (TS)](https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/fundamentals__add-custom-command-ts)   | Write your own custom commands using TypeScript                                                 |
| [Adding Chai Assertions](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/extending-cypress__chai-assertions)         | Add new or custom chai assertions                                                               |
| [Cypress module API](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/fundamentals__module-api)                       | Run Cypress via its module API                                                                  |
| [Wrapping Cypress module API](https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/fundamentals__module-api-wrap)         | Writing a wrapper around "cypress run" command line parsing                                     |
| [Custom browsers](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/fundamentals__custom-browsers)                     | Control which browsers the project can use, or even add a custom browser into the list          |
| [Use Chrome Remote Interface](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/fundamentals__chrome-remote-debugging) | Use Chrome debugger protocol to trigger hover state and print media style                       |
| [Out-of-the-box TypeScript](https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/fundamentals__typescript)                | Write tests in TypeScript without setting up preprocessors                                      |
| [Per-test timeout](https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/fundamentals__timeout)                            | Fail a test if it runs longer than the specified time limit                                     |
| [Cypress events](https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/fundamentals__cy-events)                            | Using `Cypress.on` and `cy.on` to listen to Cypress events like `before:window:load`            |
| [Video resolution](https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/fundamentals__window-size)                        | Increase the browser window size to record high quality videos and capture detailed screenshots |

## Testing the DOM

| Recipe                                                                                                                                      | Description                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [Tab Handling and Links](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/testing-dom__tab-handling-links)        | Links that open in a new tab                                                 |
| [Hover and Hidden Elements](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/testing-dom__hover-hidden-elements)  | Test hidden elements requiring hover                                         |
| [Form Interactions](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/testing-dom__form-interactions)              | Test form elements like input type `range`                                   |
| [Drag and Drop](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/testing-dom__drag-drop)                          | Use `.trigger()` to test drag and drop                                       |
| [Shadow DOM](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/testing-dom__shadow-dom)                            | Test elements within shadow DOM                                              |
| [Waiting for static resource](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/testing-dom__wait-for-resource)    | Shows how to wait for CSS, image, or any other static resource to load       |
| [CSV load and table test](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/testing-dom__csv-table)                | Loads CSV file and compares objects against cells in a table                 |
| [Evaluate performance metrics](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/testing-dom__performance-metrics) | Utilize Cypress to monitor a website                                         |
| [Root style](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/testing-dom__root-style)                            | Trigger input color change that modifies CSS variable                        |
| [Select widgets](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/testing-dom__select2)                           | Working with `<select>` elements and [Select2](https://select2.org/) widgets |
| [Lit Elements](https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/testing-dom__lit-element)                         | Testing Lit Elements with Shadow DOM                                         |
| [File download](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/testing-dom__download)                           | Download and validate CSV, Excel, text, Zip, and image files                 |
| [Page reloads](https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/testing-dom__page-reloads)                        | Avoiding `while` loop when dealing with randomness                           |
| [Pagination](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/testing-dom__pagination)                            | Clicking the "Next" link until we reach the last page                        |
| [Clipboard](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/testing-dom__clipboard)                              | Copy and paste text into the clipboard from the test                         |

## Logging In

| Recipe                                                                                                                          | Description                                 |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| [Basic Auth](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/logging-in__basic-auth)                 | Log in using Basic Authentication           |
| [Single Sign On](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/logging-in__single-sign-on)         | Log in across multiple servers or providers |
| [HTML Web Forms](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/logging-in__html-web-forms)         | Log in with a basic HTML form               |
| [XHR Web Forms](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/logging-in__xhr-web-forms)           | Log in using an XHR                         |
| [CSRF Tokens](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/logging-in__csrf-tokens)               | Log in with a required CSRF token           |
| [Json Web Tokens](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/logging-in__jwt)                   | Log in using JWT                            |
| [Using application code](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/logging-in__using-app-code) | Log in by calling the application code      |

Also see [Authentication plugins](/plugins/directory#authentication) and watch
[Organizing Tests, Logging In, Controlling State](https://www.youtube.com/watch?v=5XQOK0v_YRE)

## Preprocessors

| Recipe                                                                                                                                        | Description                                         |
| --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| [Grep tests](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/preprocessors__grep)                                  | Filter tests by name using Mocha-like `grep` syntax |
| [Typescript with Browserify](https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/preprocessors__typescript-browserify) | Add typescript support with browserify              |
| [Typescript with Webpack](https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/preprocessors__typescript-webpack)       | Add typescript support with webpack                 |
| [Flow with Browserify](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/preprocessors__flow-browserify)             | Add flow support with Browserify                    |

## Blogs

Demo recipes from the blog posts at [Cypress blog](https://www.cypress.io/blog).

| Recipe                                                                                                                                  | Description                                                                                                       |
| --------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| [Application Actions](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/blogs__application-actions)            | Application actions are a replacement for Page Objects                                                            |
| [Direct Control of AngularJS](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/blogs__direct-control-angular) | Bypass the DOM and control AngularJS                                                                              |
| [E2E API Testing](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/blogs__e2e-api-testing)                    | Run your API Tests with a GUI                                                                                     |
| [E2E Snapshots](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/blogs__e2e-snapshots)                        | End-to-End Snapshot Testing                                                                                       |
| [Element Coverage](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/blogs__element-coverage)                  | Track elements covered by tests                                                                                   |
| [Codepen.io Testing](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/blogs__codepen-demo)                    | Test a HyperApp Codepen demo                                                                                      |
| [Testing Redux Store](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/blogs__testing-redux-store)            | Test an application that uses central Redux data store                                                            |
| [Vue + Vuex + REST Testing](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/blogs__vue-vuex-rest)            | Test an application that uses central Vuex data store                                                             |
| [A11y Testing](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/blogs__a11y)                                  | Accessibility testing with [cypress-axe](https://github.com/avanslaars/cypress-axe)                               |
| [Automate Angular Testing](https://www.cypress.io/blog/2019/08/02/guest-post-angular-adding-cypress-ui-tests-to-your-devops-pipeline)   | Automate Angular Testing                                                                                          |
| [React DevTools](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/blogs__use-react-devtools)                  | Loads React DevTools Chrome extension automatically                                                               |
| [Expect N assertions](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/blogs__assertion-counting)             | How to expect a certain number of assertions in a test                                                            |
| [Browser notifications](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/blogs__notification)                 | How to test application that uses [`Notification`](https://developer.mozilla.org/en-US/docs/Web/API/notification) |
| [Testing iframes](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/blogs__iframes)                            | Accessing elements in 3rd party iframe, spy and stub network calls from iframe                                    |
| [Class decorators](https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/blogs__class-decorator)                   | Using JavaScript class decorator to expose objects created by the application so they are reachable from tests    |
| [Form Submit](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/blogs__form-submit)                            | Removing flake from the test where a page is reloaded after form submission                                       |
| [Using Day.js instead of Moment.js](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/blogs__dayjs)            | Using [day.js](https://day.js.org/) library instead of the deprecated `Cypress.moment`                            |

## Stubbing and spying

| Recipe                                                                                                                                         | Description                                                           |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [Stubbing Functions](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/stubbing-spying__functions)                    | Use `cy.stub()` to test function calls                                |
| [Stubbing `window.fetch`](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/stubbing-spying__window-fetch)            | Use `cy.stub()` to control fetch requests                             |
| [Stubbing using`cy.intercept`](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/stubbing-spying__intercept)          | Control network using `cy.intercept` API                              |
| [Stubbing `window.open` and `console.log`](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/stubbing-spying__window) | Use `cy.stub()` and `cy.spy()` to test application behavior           |
| [Stubbing `window.print`](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/stubbing-spying__window-print)            | Use `cy.stub() `to test `window.print` call made from the application |
| [Stubbing Google Analytics](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/stubbing-spying__google-analytics)      | Use `cy.stub()` and `cy.intercept()` to test Google Analytics calls   |
| [Stub methods called on `console`](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/stubbing-spying__console)        | Use `cy.stub()` to test and control methods called on `console`       |
| [Stub resource loading](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/stubbing__resources)                        | Use `MutationObserver` to stub resource loading like `img` tags       |
| [Stub `navigator.cookieEnabled` property](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/stubbing__navigator)      | Use `cy.stub()` to mock the `navigator.cookieEnabled` property        |

## Unit Testing

| Recipe                                                                                                                        | Description                               |
| ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| [Application Code](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/unit-testing__application-code) | Import and test your own application code |

**Note:** looking for the React/Vue component testing recipes? Read the
[Introducing the Cypress Component Test Runner– new in 7.0.0](https://www.cypress.io/blog/2021/04/06/introducing-the-cypress-component-test-runner/)
blog post.

## Server Communication

| Recipe                                                                                                                                                     | Description                                                                                                                  |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Bootstrapping your App](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/server-communication__bootstrapping-your-app)          | Seed your application with test data                                                                                         |
| [Seeding your Database in Node](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/server-communication__seeding-database-in-node) | Seed your database with test data                                                                                            |
| [XHR assertions](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/server-communication__xhr-assertions)                          | Spy and assert on application's network calls                                                                                |
| [Visiting 2nd domain](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/server-communication__visit-2nd-domain)                   | Visiting two different domains from two different tests and passing value from one test to another                           |
| [Pass value between specs](https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/server-communication__pass-value-between-specs)      | Pass a value from spec to spec using `cy.task`                                                                               |
| [Stream test results](https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/server-communication__stream-tests)                       | Streams each test result from the browser to the plugins to an external process via IPC                                      |
| [Offline](https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/server-communication__offline)                                        | Test web application when the network is offline                                                                             |
| [Server timing](https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/server-communication__server-timing)                            | Report server timing results from Cypress test                                                                               |
| [Wait for API](https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/server-communication__wait-for-api)                              | Call the backend using `cy.request` until it responds                                                                        |
| [Making HTTP requests](https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/server-communication__request)                           | How to use `cy.request`, `window.fetch`, and `cy.task` commands to make HTTP requests to the server with and without cookies |

## Other Cypress Recipes

| Recipe                                                                                                                 | Description                                                                                |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [Visual Testing](/guides/tooling/visual-testing)                                                                       | Official Cypress guide to visual testing                                                   |
| [Code Coverage](/guides/tooling/code-coverage)                                                                         | Official Cypress guide to code coverage                                                    |
| [Detect Page Reload](https://glebbahmutov.com/blog/detect-page-reload/)                                                | How to detect from Cypress test when a page reloads using object property assertions       |
| [Run in Docker](https://www.cypress.io/blog/2019/05/02/run-cypress-with-a-single-docker-command/)                      | Run Cypress with a single Docker command                                                   |
| [SSR E2E](https://glebbahmutov.com/blog/ssr-e2e/)                                                                      | End-to-end Testing for Server-Side Rendered Pages                                          |
| [Using TS aliases](https://glebbahmutov.com/blog/using-ts-aliases-in-cypress-tests/)                                   | Using TypeScript aliases in Cypress tests                                                  |
| [Stub Navigator API](https://glebbahmutov.com/blog/stub-navigator-api/)                                                | Stub navigator API in end-to-end tests                                                     |
| [Readable Cypress.io tests](https://glebbahmutov.com/blog/readable-tests/)                                             | How to write readable tests using custom commands and custom Chai assertions               |
| [Conditional Parallelization](https://glebbahmutov.com/blog/parallel-or-not/)                                          | Run Cypress in parallel mode on CircleCI depending on environment variables                |
| [`.should()` Callback](https://glebbahmutov.com/blog/cypress-should-callback/)                                         | Examples of `.should(cb)` assertions                                                       |
| [React component testing](https://glebbahmutov.com/blog/cypress-jump/)                                                 | Create a React component using JSX and inject it into live application from a Cypress test |
| [Unit testing Vuex data store](https://dev.to/bahmutov/unit-testing-vuex-data-store-using-cypress-io-test-runner-3g4n) | Complete walkthrough for anyone trying to unit test a data store                           |
| [Triple Tested Static Site](https://glebbahmutov.com/blog/triple-tested/)                                              | How to test static sites three times before and after deployment to GitHub pages           |

## Community Recipes

| Recipe                                                                           | Description                                 |
| -------------------------------------------------------------------------------- | ------------------------------------------- |
| [Visual Regression Testing](https://github.com/mjhea0/cypress-visual-regression) | Adding visual regression testing to Cypress |
| [Code coverage](https://github.com/paulfalgout/cypress-coverage-example)         | Cypress with Coverage reports               |
| [Cucumber](https://github.com/TheBrainFamily/cypress-cucumber-example)           | Example usage of Cypress with Cucumber      |
| [Jest](https://github.com/TheBrainFamily/jest-runner-cypress-example)            | Example for the jest-runner-cypress         |
