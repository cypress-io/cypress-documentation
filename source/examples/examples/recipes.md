---
title: Recipes
containerClass: examples
---

Recipes show you how to test common scenarios in Cypress.

{% fa fa-github %} {% url  https://github.com/cypress-io/cypress-example-recipes %}

Recipe | Category | Description
--- | --- | ---
{% urlHash 'Node Modules' Node-Modules %} | Fundamentals | Import your own Node modules
{% urlHash 'Single Sign On' Single-Sign-On %} | Logging In | Log in across multiple servers or providers
{% urlHash 'HTML Web Forms' HTML-Web-Forms %} | Logging In | Log in with a basic HTML form
{% urlHash 'XHR Web Forms' XHR-Web-Forms %} | Logging In | Log in using an XHR
{% urlHash 'CSRF Tokens' CSRF-Tokens %} | Logging In | Log in with a required CSRF token
{% url 'Json Web Tokens' https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/logging-in__jwt %} | Logging In | Log in using JWT
{% urlHash 'Tab Handling and Links' Tab-Handling-and-Links %} | Testing the DOM | Links that open in a new tab
{% urlHash 'Hover and Hidden Elements' Hover-and-Hidden-Elements %} | Testing the DOM | Test hidden elements requiring hover
{% urlHash 'Form Interactions' Form-Interactions %} | Testing the DOM | Test form elements like input type `range`
{% urlHash 'Drag and Drop' Drag-and-Drop %} | Testing the DOM | Use `.trigger()` to test drag and drop
{% urlHash 'TypeScript with Browserify' TypeScript-with-Browserify %} | Preprocessors | Add TypeScript support with Browserify
{% urlHash 'TypeScript with webpack' TypeScript-with-webpack %} | Preprocessors | Add TypeScript support with webpack
{% urlHash 'Direct Control of AngularJS' Direct-Control-of-AngularJS %} | Blogs | Bypass the DOM and control AngularJS
{% urlHash 'E2E API Testing' E2E-API-Testing %} | Blogs | Run your API Tests with a GUI
{% urlHash 'Codepen.io Testing' Codepen-Testing %} | Blogs | Test a HyperApp Codepen demo
{% urlHash 'Redux Testing' Redux-Testing %} | Blogs | Test an application that uses central Redux data store
{% urlHash 'Vue + Vuex + REST Testing' Vue-Vuex-REST-Testing %} | Blogs | Test an application that uses central Vuex data store
{% urlHash 'Stubbing Functions' Stubbing-Functions %} | Stubbing, Spying | Use `cy.stub()` to test function calls
{% urlHash 'Stubbing `window.fetch`' Stubbing-window-fetch %} | Stubbing, Spying | Use `cy.stub()` to control fetch requests
{% urlHash 'Stub methods called on `window`' Stubbing-window-fetch %} | Stubbing, Spying | Use `cy.stub()` for methods called on `window`
{% urlHash 'Stubbing Google Analytics' Stubbing-Google-Analytics %} | Stubbing, Spying | Use `cy.stub()` to test Google Analytics calls
{% urlHash 'Application Code' Application-Code %} | Unit Testing | Import and test your own application code
{% urlHash 'React' React %} | Unit Testing | Test your react components in isolation
{% urlHash 'File Upload in React' File-Upload-in-React %} | Unit Testing | Test file upload in React application
{% urlHash 'Adding Chai Assertions' Adding-Chai-Assertions %} | Extending Cypress | Add new or custom chai assertions
{% urlHash 'Bootstrapping your App' Bootstrapping-your-App %} | Server Communication | Seed your application with test data
{% urlHash 'Seeding your Database in Node' Seeding-your-Database-in-Node %} | Server Communication | Seed your database with test data
{% urlHash 'Environment Variables' Environment-Variables %} | Server Communication | Pass environment variables to your tests
{% urlHash 'Cypress CircleCI Orb' Cypress-CircleCI-Orb %} | Continuous Integration | Install, cache and run Cypress tests on CircleCI with minimal configuration.

## [Node Modules](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/fundamentals__node-modules)

- Import ES2015 modules.
- Require CommonJS modules.
- Organize reusable utility functions.
- Import 3rd party `node_modules`.

## [Single Sign On](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/logging-in__single-sign-on)

- Login when authentication is done on a 3rd party server.
- Parse tokens using {% url `cy.request()` request %}.
- Manually set tokens on localStorage.
- Map external hosts and point to local servers.

## [HTML Web Forms](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/logging-in__html-web-forms)

- Test a standard `username/password` HTML form.
- Test errors submitting invalid data.
- Test unauthenticated redirects.
- Authenticate users with cookies.
- Create a custom `cy.login()` test command.
- Bypass needing to use your actual UI.
- Increase speed of testing with {% url `cy.request()` request %}.

## [XHR Web Forms](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/logging-in__xhr-web-forms)

- Test an Ajax backed `username/password` form.
- Test errors submitting invalid data.
- Stub JSON based XHR requests.
- Stub application functions.
- Create a custom `cy.login()` test command.
- Bypass needing to use your actual UI.
- Increase speed of testing with {% url `cy.request()` request %}.

## [CSRF Tokens](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/logging-in__csrf-tokens)

- Use {% url `cy.request()` request %} to get around CSRF protections.
- Parse CSRF tokens out of HTML.
- Parse CSRF tokens out of response headers.
- Expose CSRF via a route.
- Disable CSRF when not in production.

## [Tab Handling and Links](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/testing-dom__tab-handling-links)

- Test anchor links opening in new tabs: `<a target="_blank">`.
- Test anchor links that link to external domains: `<a href="...">`.
- Prevent content from opening in a new tab.
- Request external content that would open in a new tab using {% url "`cy.request()`" request%}.
- Speed up tests by reducing loading times.

## [Hover and Hidden Elements](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/testing-dom__hover-hidden-elements)

- Interact with elements that are hidden by CSS.
- Use {% url "`.invoke()`" invoke %} and {% url "`.trigger()`" trigger %} to simulate hovering.
- Trigger `mouseover`, `mouseout`, `mouseenter`, `mouseleave` events.
Get around the lack of a `.hover()` command.

## [Form Interactions](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/testing-dom__form-interactions)

- Use {% url "`.invoke()`" invoke %} and {% url "`.trigger()`" trigger %} to test a range input (slider).

## [Drag and Drop](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/testing-dom__drag-drop)

- Use {% url "`.trigger()`" trigger %} to test drag-n-drop that uses mouse events.
- Use {% url "`.trigger()`" trigger %} to test drag-n-drop that uses drag events.
- Use {% url "`cypress-file-upload`" https://github.com/abramenal/cypress-file-upload %} to test drag-n-drop that works with file uploads.

## [TypeScript with Browserify](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/preprocessors__typescript-browserify)

- Use {% url "`@cypress/browserify-preprocessor`" https://github.com/cypress-io/cypress-browserify-preprocessor %} to write Cypress tests in TypeScript

## [TypeScript with webpack](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/preprocessors__typescript-webpack)

- Use {% url "`@cypress/webpack-preprocessor`" https://github.com/cypress-io/cypress-webpack-preprocessor %} to write Cypress tests in TypeScript
- Lint TypeScript spec code against Cypress type definitions

## [Direct Control of AngularJS](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/blogs__direct-control-angular)

- {% url "Blog article written here" https://www.cypress.io/blog/2017/11/15/Control-Angular-Application-From-E2E-Tests %}
- Programmatically control AngularJS
- Bypass the DOM, update scopes directly
- Create custom command for controlling services

## [E2E API Testing](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/blogs__e2e-api-testing)

- {% url "Blog article written here" https://www.cypress.io/blog/2017/11/07/Add-GUI-to-Your-E2E-API-Tests %}
- Use {% url `cy.request()` request %} to perform API Testing
- Use the Cypress Test Runner to help debug requests

## [Codepen Testing](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/blogs__codepen-demo)

- Load Codepen and get around iframe security restrictions.
- Use {% url "`cy.request()`" request %} to load a document into test iframe.
- Test {% url "HyperApp.js" https://hyperapp.js.org/ %} application through the DOM and through actions.

## [Redux Testing](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/blogs__testing-redux-store)

- control application via DOM and check the Redux store
- use Redux actions directly from tests
- load initial Redux state from a fixture file
- use {% url cypress-pipe https://github.com/NicholasBoll/cypress-pipe#readme %} plugin
- use {% url cypress-plugin-snapshots https://github.com/meinaart/cypress-plugin-snapshots#readme %} plugin

## [Vue + Vuex + REST Testing](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/blogs__vue-vuex-rest)

- Test a {% url "Vue.js" https://vuejs.org/ %} web application that uses central data store
- Mock REST calls to the server
- Dispatch actions to the {% url "Vuex" https://vuex.vuejs.org/en/ %} store
- Test text file upload

## [Stubbing Functions](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/stubbing-spying__functions)

- Use {% url `cy.stub()` stub %} to stub dependencies in a unit test.
- Handle promises returned by stubbed functions.
- Handle callbacks in stubbed functions.

## [Stubbing `window.fetch`](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/stubbing-spying__window-fetch)

- Use {% url `cy.spy()` spy %} to verify the behavior of a function.
- Use {% url `cy.stub()` stub %} to verify and control the behavior of a function.
- Use {% url `cy.clock()` clock %} and {% url `cy.tick()` tick %} to control time.
- Stub `window.fetch` to control server responses.

## [Stubbing methods called on `window`](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/stubbing-spying__window)

- Use {% url "`cy.stub()`" stub %} to test `window.open` behavior.

## [Stubbing Google Analytics](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/stubbing-spying__google-analytics)

- Use {% url `blacklistHosts` configuration#Browser %} to block Google Analytics from receiving requests.
- Use {% url `cy.stub()` stub %} to verify that `window.ga(...)` was called with the correct arguments

## [Application Code](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/unit-testing__application-code)

- Unit test your own application code libraries.
- Import modules using ES2015.
- Test simple math functions.
- Test the canonical *fizzbuzz* test.

## [React](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/unit-testing__react)
- Unit test a React JSX Component using [Enzyme](http://airbnb.io/enzyme/), [react-testing-library](https://github.com/kentcdodds/react-testing-library) and [cypress-react-unit-test](https://github.com/bahmutov/cypress-react-unit-test) libraries.

## [File Upload in React](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/file-upload-react)

- Passing synthetic test file to upload via an {% url "`.trigger('change')`" trigger %} event
- Stub remote server using {% url "`cy.route()`" route %}
- Alternatively stub `axios.post` method using {% url "`cy.stub()`" stub %}
- Alternatively, use {% url "`cypress-file-upload`" https://github.com/abramenal/cypress-file-upload %} to test file upload

## [Adding Chai Assertions](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/extending-cypress__chai-assertions)

- Extend {% url "`chai`" http://chaijs.com/ %} with the {% url "`chai-date-string`" http://chaijs.com/plugins/chai-date-string/ %} assertion plugin.
- Extend {% url "`chai`" http://chaijs.com/ %} with the {% url "`chai-colors`" http://chaijs.com/plugins/chai-colors/ %} assertion plugin.
- Globally extend {% url "`chai`" http://chaijs.com/ %} for all specs.

## [Bootstrapping your App](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/server-communication__bootstrapping-your-app)

- Use {% url `cy.visit()` visit %} `onBeforeLoad` callback.
- Start your application with test data.
- Stub an XHR to seed with test data.
- Wait on an XHR to finish.

## [Seeding your Database in Node](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/server-communication__seeding-database-in-node)

- Use {% url `cy.task()` task %} to communicate with Node via the `pluginsFile`.
- Seed your database with test data.
- Wrap your `pluginsFile` so you can require files that use ES modules (`import`/`export`).

## [Environment Variables](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/server-communication__env-variables)

- Pass values via `env` object in `cypress.json`.
- Pass any variable that starts with `CYPRESS_`.
- Extract any other variable from `process.env` using `cypress/plugins/index.js` callback.

## [Cypress CircleCI Orb](https://github.com/cypress-io/cypress-example-circleci-orb)

- Installs npm dependencies
- Run Cypress tests
- Record the output to the Cypress Dashboard
