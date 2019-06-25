---
title: Recipes
containerClass: examples
---

Recipes show you how to test common scenarios in Cypress.

{% fa fa-github %} {% url https://github.com/cypress-io/cypress-example-recipes %}

## Fundamentals 

Recipe  | Description
--- | --- 
{% url 'Node Modules' https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/fundamentals__node-modules %} | Import your own Node modules
{% url "Environment variables" https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/server-communication__env-variables %} | Passing environment variables to tests
{% url "Dynamic tests" https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/fundamentals__dynamic-tests %} | Create tests dynamically from data
{% url "Fixtures" https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/fundamentals__fixtures %} | Loading single or multiple fixtures
{% url "Adding Chai Assertions" https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/extending-cypress__chai-assertions %} | Add new or custom chai assertions
{% url "Cypress module API" https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/fundamentals__module-api %} | Run Cypress via its module API

## Testing the DOM
Recipe  | Description
--- | --- 
{% url 'Tab Handling and Links' https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/testing-dom__tab-handling-links %} |  Links that open in a new tab
{% url 'Hover and Hidden Elements' https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/testing-dom__hover-hidden-elements %} | Test hidden elements requiring hover
{% url 'Form Interactions' https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/testing-dom__form-interactions %} |  Test form elements like input type `range`
{% url 'Drag and Drop' https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/testing-dom__drag-drop %} | Use `.trigger()` to test drag and drop

## Logging In 
Recipe  | Description
--- | --- 
{% url 'Single Sign On' https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/logging-in__single-sign-on %} | Log in across multiple servers or providers
{% url 'HTML Web Forms' https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/logging-in__html-web-forms %} | Log in with a basic HTML form
{% url 'XHR Web Forms' https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/logging-in__xhr-web-forms %} | Log in using an XHR
{% url 'CSRF Tokens' https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/logging-in__csrf-tokens %} | Log in with a required CSRF token
{% url 'Json Web Tokens' https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/logging-in__jwt %} | Log in using JWT
{% url 'Using application code' https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/logging-in__using-app-code %} | Log in by calling the application code

Also see {% url "Authentication plugins" plugins#authentication and watch {% url "Organizing Tests, Logging In, Controlling State" https://www.youtube.com/watch?v=5XQOK0v_YRE %}

## Preprocessors
Recipe  | Description
--- | ---
{% url 'grep' https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/preprocessors__grep %} | Filter tests by name using Mocha-like `grep` syntax
{% url 'TypeScript with Browserify' https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/preprocessors__typescript-browserify %} | Add TypeScript support with Browserify
{% url 'TypeScript with webpack' https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/preprocessors__typescript-webpack %} | Add TypeScript support with webpack

## Blogs

Demo recipes from the blog posts at {% url "Cypress blog" https://www.cypress.io/blog %}.

Recipe  | Description
--- | --- 
{% url 'Application Actions' https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/blogs__application-actions %} | Application actions are a replacement for Page Objects
{% url 'Direct Control of AngularJS' https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/blogs__direct-control-angular %} | Bypass the DOM and control AngularJS
{% url 'E2E API Testing' https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/blogs__e2e-api-testing %} | Run your API Tests with a GUI
{% url "E2E Snapshots" https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/blogs__e2e-snapshots %} | End-to-End Snapshot Testing
{% url "Element Coverage" https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/blogs__element-coverage %} | Track elements covered by tests
{% url 'Codepen.io Testing' https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/blogs__codepen-demo %} | Test a HyperApp Codepen demo
{% url 'Testing Redux Store' https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/blogs__testing-redux-store %} | Test an application that uses central Redux data store
{% url 'Vue + Vuex + REST Testing' https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/blogs__vue-vuex-rest %} | Test an application that uses central Vuex data store
{% url "A11y Testing" https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/blogs__a11y %} | Accessability testing with {% url "cypress-axe" https://github.com/avanslaars/cypress-axe %}

## Stubbing and spying
Recipe  | Description
--- | --- 
{% url 'Stubbing Functions' https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/stubbing-spying__functions %} | Use `cy.stub()` to test function calls
{% url 'Stubbing `window.fetch`' https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/stubbing-spying__window-fetch %} | Use `cy.stub()` to control fetch requests
{% url 'Stub methods called on `window`' https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/stubbing-spying__window %}  | Use `cy.stub()` for methods called on `window`
{% url 'Stubbing Google Analytics' https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/stubbing-spying__google-analytics %} | Use `cy.stub()` to test Google Analytics calls

## Unit Testing
Recipe  | Description
--- | --- 
{% url 'Application Code' https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/unit-testing__application-code %} | Import and test your own application code
{% url 'React' https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/unit-testing__react %} |  Test your react components in isolation
{% url 'File Upload in React' https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/file-upload-react %} | Test file upload in React application

## Server Communication
Recipe  | Description
--- | --- 
{% url 'Bootstrapping your App' https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/server-communication__bootstrapping-your-app %} | Seed your application with test data
{% url 'Seeding your Database in Node' https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/server-communication__seeding-database-in-node %} | Seed your database with test data

## Community Recipes

Recipe | Description
--- | ---
{% url "Visual Regression Testing" https://github.com/mjhea0/cypress-visual-regression %} | Adding visual regression testing to Cypress
{% url "Code coverage" https://github.com/paulfalgout/cypress-coverage-example %} | Cypress with Coverage reports
{% url "Cucumber" https://github.com/TheBrainFamily/cypress-cucumber-example %} | Example usage of Cypress with Cucumber
{% url "Jest" https://github.com/TheBrainFamily/jest-runner-cypress-example %} | Example for the jest-runner-cypress