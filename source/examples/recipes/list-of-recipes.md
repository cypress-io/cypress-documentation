---
title: List of Recipes
comments: false
containerClass: examples
---

Recipes show you how to test common scenarios in Cypress.

{% fa fa-github %} {% url  https://github.com/cypress-io/cypress-example-recipes %}

Recipe | Category | Description
--- | --- | ---
{% urlHash 'Node Modules' Node-Modules %} | Fundamentals | Import your own node modules
{% urlHash 'Single Sign On' Single-Sign-On %} | Logging In | Log in across multiple servers or providers
{% urlHash 'HTML Web Forms' HTML-Web-Forms %} | Logging In | Log in with a basic HTML form
{% urlHash 'XHR Web Forms' XHR-Web-Forms %} | Logging In | Log in using an XHR
{% urlHash 'CSRF Tokens' CSRF-Tokens %} | Logging In | Log in with a required CSRF token
{% urlHash 'Tab Handling and Links' Tab-Handling-and-Links %} | Testing the DOM | Links that open in a new tab
{% urlHash 'Hover and Hidden Elements' Hover-and-Hidden-Elements %} | Testing the DOM | Test hidden elements requiring hover
{% urlHash 'Form Interactions' Form-Interactions %} | Testing the DOM | Test form elements like input type `range`
{% urlHash 'Drag \'n Drop' Drag-and-Drop %} | Testing the DOM | Use `.trigger()` to test drag and drop
{% urlHash 'Stubbing Functions' Stubbing-Functions %} | Stubbing, Spying | Use `cy.stub()` to test function calls
{% urlHash 'Stubbing `window.fetch`' Stubbing-window-fetch %} | Stubbing, Spying | Use `cy.stub()` to control fetch requests
{% urlHash 'Application Code' Application-Code %} | Unit Testing | Import and test your own application code
{% urlHash 'React with Enzyme' React-with-Enzyme %} | Unit Testing | Test your react components in isolation
{% urlHash 'Adding Chai Assertions' Adding-Chai-Assertions %} | Extending Cypress | Add new or custom chai assertions
{% urlHash 'Bootstrapping your App' Bootstrapping-your-App %} | Server Communication | Seed your application with test data

## [Node Modules](https://github.com/cypress-io/cypress-example-recipes/blob/master/cypress/integration/es2015_commonjs_modules_spec.js)

- Import ES2015 modules.
- Require CommonJS modules.
- Organize reusable utility functions.
- Import 3rd party `node_modules`.

## [Single Sign On](https://github.com/cypress-io/cypress-example-recipes/blob/master/cypress/integration/logging_in_single_sign_on_spec.js)

- Login when authentication is done on a 3rd party server.
- Parse tokens using {% url `cy.request()` request %}.
- Manually set tokens on local storage.
- Map external hosts and point to local servers.

## [HTML Web Forms](https://github.com/cypress-io/cypress-example-recipes/blob/master/cypress/integration/logging_in_html_web_form_spec.js)

- Test a standard `username/password` HTML form.
- Test errors submitting invalid data.
- Test unauthenticated redirects.
- Authenticate users with cookies.
- Create a custom `cy.login()` test command.
- Bypass needing to use your actual UI.
- Increase speed of testing with {% url `cy.request()` request %}.

## [XHR Web Forms](https://github.com/cypress-io/cypress-example-recipes/blob/master/cypress/integration/logging_in_xhr_web_form_spec.js)

- Test an AJAX backed `username/password` form.
- Test errors submitting invalid data.
- Stub JSON based XHR requests.
- Stub application functions.
- Create a custom `cy.login()` test command.
- Bypass needing to use your actual UI.
- Increase speed of testing with {% url `cy.request()` request %}.

## [CSRF Tokens](https://github.com/cypress-io/cypress-example-recipes/blob/master/cypress/integration/logging_in_csrf_tokens_spec.js)

- Use {% url `cy.request()` request %} to get around CSRF protections.
- Parse CSRF tokens out of HTML.
- Parse CSRF tokens out of response headers.
- Expose CSRF via a route.
- Disable CSRF when not in production.

## [Tab Handling and Links](https://github.com/cypress-io/cypress-example-recipes/blob/master/cypress/integration/tab_handling_anchor_links_spec.js)

- Test anchor links opening in new tabs: `<a target="_blank">`.
- Test anchor links that link to external domains: `<a href="...">`.
- Prevent content from opening in a new tab.
- Request external content that would open in a new tab using {% url "`cy.request()`" request%}.
- Speed up tests by reducing loading times.

## [Hover and Hidden Elements](https://github.com/cypress-io/cypress-example-recipes/blob/master/cypress/integration/hover_hidden_elements_spec.js)

- Interact with elements that are hidden by CSS.
- Use {% url "`.invoke()`" invoke %} and {% url "`.trigger()`" trigger %} to simulate hovering.
- Trigger `mouseover`, `mouseout`, `mouseenter`, `mouseleave` events.
Get around the lack of a `.hover()` command.

## [Form Interactions](https://github.com/cypress-io/cypress-example-recipes/blob/master/cypress/integration/form_interactions_spec.js)

- Use {% url "`.invoke()`" invoke %} and {% url "`.trigger()`" trigger %} to test a range input (slider).

## [Drag and Drop](https://github.com/cypress-io/cypress-example-recipes/blob/master/cypress/integration/drag_n_drop_spec.js)

- Use {% url "`.trigger()`" trigger %} to test drag-n-drop that uses mouse events.
- Use {% url "`.trigger()`" trigger %} to test drag-n-drop that uses drag events.

## [Stubbing Functions](https://github.com/cypress-io/cypress-example-recipes/blob/master/cypress/integration/unit_test_stubbing_dependencies_spec.js)

- Use {% url `cy.stub()` stub %} to stub dependencies in a unit test.
- Handle promises returned by stubbed functions.
- Handle callbacks in stubbed functions.

## [Stubbing `window.fetch`](https://github.com/cypress-io/cypress-example-recipes/blob/master/cypress/integration/spy_stub_clock_spec.js)

- Use {% url `cy.spy()` spy %} to verify the behavior of a function.
- Use {% url `cy.stub()` stub %} to verify and control the behavior of a function.
- Use {% url `cy.clock()` clock %} and {% url `cy.tick()` tick %} to control time.
- Stub `window.fetch` to control server responses.


## [Application Code](https://github.com/cypress-io/cypress-example-recipes/blob/master/cypress/integration/unit_test_application_code_spec.js)

- Unit test your own application code libraries.
- Import modules using ES2015.
- Test simple math functions.
- Test the canonical *fizzbuzz* test.

## [React with Enzyme](https://github.com/cypress-io/cypress-example-recipes/blob/master/cypress/integration/unit_test_react_enzyme_spec.js)

- Unit test a React JSX Component using {% url "Enzyme" http://airbnb.io/enzyme/ %}.
- Import `enzyme` from `node_modules`.
- Extend chai assertions with {% url "`chai-enzyme`" https://github.com/producthunt/chai-enzyme %}.

## [Adding Chai Assertions](https://github.com/cypress-io/cypress-example-recipes/blob/master/cypress/integration/extending_chai_assertion_plugins_spec.js)

- Extend {% url "`chai`" http://chaijs.com/ %} with the {% url "`chai-date-string`" http://chaijs.com/plugins/chai-date-string/ %} assertion plugin.
- Extend {% url "`chai`" http://chaijs.com/ %} with the {% url "`chai-colors`" http://chaijs.com/plugins/chai-colors/ %} assertion plugin.
- Globally extend {% url "`chai`" http://chaijs.com/ %} for all specs.

## [Bootstrapping your App](https://github.com/cypress-io/cypress-example-recipes/blob/master/cypress/integration/bootstrapping_app_test_data_spec.js)

- Use {% url `cy.visit()` visit %} `onBeforeLoad` callback.
- Start your application with test data.
- Stub an XHR to seed with test data.
- Wait on an XHR to finish.
