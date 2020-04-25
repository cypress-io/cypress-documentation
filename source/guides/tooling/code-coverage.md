---
title: Code Coverage
---

{% note info %}
# {% fa fa-graduation-cap %} What you'll learn

- How to instrument your application code
- How to save the coverage information collected during end-to-end and unit tests
- How to use the code coverage reports to guide writing tests
{% endnote %}

<!-- textlint-disable -->
{% video youtube C8g5X4vCZJA %}
<!-- textlint-enable -->

# Introduction

As you write more and more end-to-end tests, you will find yourself wondering - do I need to write more tests? Are there parts of the application still untested? Are there parts of the application that perhaps are tested too much? One answer to those questions is to find out which lines of the application's source code were executed during end-to-end tests. If there are important sections of the application's logic that **were not** executed from the tests, then a new test should be added to ensure that part of our application logic is tested.

Computing the source code lines that were executed during the test is done through **code coverage**. Code coverage requires inserting additional counters into your source code before running it. This step is called **instrumentation**. Instrumentation takes code that looks like this...

```javascript
// add.js
function add(a, b) {
  return a + b
}
module.exports = { add }
```

...and parses it to find all functions, statements, and branches and then inserts **counters** into the code. For the above code it might look like this:

```javascript
// this object counts the number of times each
// function and each statement is executed
const c = window.__coverage__ = {
  // "f" counts the number of times each function is called
  // we only have a single function in the source code
  // thus it starts with [0]
  f: [0],
  // "s" counts the number of times each statement is called
  // we have 3 statements and they all start with 0
  s: [0, 0, 0]
}

// the original code + increment statements
// uses "c" alias to "window.__coverage__" object
// the first statement defines the function,
// let's increment it
c.s[0]++
function add(a, b) {
  // function is called and then the 2nd statement
  c.f[0]++
  c.s[1]++

  return a + b
}
// 3rd statement is about to be called
c.s[2]++
module.exports = { add }
```

Imagine we load the above instrumented source file from our test spec file. Immediately some counters will be incremented!

```javascript
// add.spec.js
const { add } = require('./add')
// JavaScript engine has parsed and evaluated "add.js" source code
// which ran some of the increment statements
// __coverage__ has now
// f: [0] - function "add" was NOT executed
// s: [1, 0, 1] - first and third counters were incremented
// but the statement inside function "add" was NOT executed
```

We want to make sure every statement and function in the file `add.js` has been executed by our tests at least once. Thus we write a test:

```javascript
// add.spec.js
const { add } = require('./add')

it('adds numbers', () => {
  expect(add(2, 3)).to.equal(5)
})
```

When the test calls `add(2, 3)`, the counter increments inside the "add" function are executed, and the coverage object becomes:

```javascript
{
  // "f" keeps count of times each function was called
  // we only have a single function in the source code
  // thus it starts with [0]
  f: [1],
  // "s" keeps count of times each statement was called
  // we have 3 statements, and they all start with 0
  s: [1, 1, 1]
}
```

This single test has achieved 100% code coverage - every function and every statement has been executed at least once. But, in real world applications, achieving 100% code coverage requires multiple tests.

Once the tests finish, the coverage object can be serialized and saved to disk so that a human-friendly report can be generated. The collected coverage information can also be sent to external services and help during pull request reviews.

{% note info %}
If you are unfamiliar with code coverage or want to learn more, take a look at the "Understanding JavaScript Code Coverage" blog post {% url "Part 1" https://www.semantics3.com/blog/understanding-code-coverage-1074e8fccce0/ %} and {% url "Part 2" https://www.semantics3.com/blog/understanding-javascript-code-coverage-part-2-9aedaa5119e5/ %}.
{% endnote %}

This guide explains how to instrument the application source code using common tools. Then we show how to save the coverage information and generate reports using the {% url "`@cypress/code-coverage`" https://github.com/cypress-io/code-coverage %} Cypress plugin. After reading this guide you should be able to better target your tests using the code coverage information.

This guide explains how to find what parts of your application code are covered by Cypress tests so you can have 100% confidence that your tests aren't missing crucial parts of your application. The collected information can be sent to external services, automatically run during pull request reviews, and integrated into CI.

{% note info %}
The full source code for this guide can be found in the {% url 'cypress-io/cypress-example-todomvc-redux' https://github.com/cypress-io/cypress-example-todomvc-redux %} repository.
{% endnote %}

# Instrumenting code

Cypress does not instrument your code - you need to do it yourself. The golden standard for JavaScript code instrumentation is the battle-hardened {% url "Istanbul" https://istanbul.js.org %} and, luckily, it plays very nicely with the Cypress Test Runner. You can instrument the code as a build step through one of two ways:

- Using the {% url "nyc" https://github.com/istanbuljs/nyc %} module - a command-line interface for the {% url "Istanbul" https://istanbul.js.org %} library
- As part of your code transpilation pipeline using the {% url "`babel-plugin-istanbul`" https://github.com/istanbuljs/babel-plugin-istanbul %} tool.

## Using NYC

To instrument the application code located in your `src` folder and save it in an `instrumented` folder use the following command:

```shell
npx nyc instrument --compact=false src instrumented
```

We are passing the `--compact=false` flag to generate human-friendly output.

The instrumentation takes your original code like this fragment...

```js
const store = createStore(reducer)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

...and wraps each statement with additional counters that keep track of how many times each source line has been executed by the JavaScript runtime.

```javascript
const store = (cov_18hmhptych.s[0]++, createStore(reducer));
cov_18hmhptych.s[1]++;
render(<Provider store={store}>
    <App />
  </Provider>, document.getElementById('root'));
```

Notice the calls to `cov_18hmhptych.s[0]++` and `cov_18hmhptych.s[1]++` that increment the statement counters. All counters and additional book-keeping information is stored in a single object attached to the browser's `window` object. We can see the counters if we serve the `instrumented` folder instead of `src` and open the application.

{% imgTag /img/guides/code-coverage/coverage-object.png "Code coverage object" %}

If we drill into the coverage object we can see the statements executed in each file. For example the file `src/index.js` has the following information:

{% imgTag /img/guides/code-coverage/coverage-statements.png "Covered statements counters in a from the index file" %}

In green, we highlighted the 4 statements present in that file. The first three statements were each executed once and the last statement was never executed (it probably was inside an `if` statement). By using the application, we can both increment the counters and flip some of the zero counters into positive numbers.

## Using code transpilation pipeline

Instead of using the `npx instrument` command, we can use {% url "`babel-plugin-istanbul`" https://github.com/istanbuljs/babel-plugin-istanbul %} to instrument the code as part of its transpilation. Add this plugin to the `.babelrc` file.

```json
{
  "presets": ["@babel/preset-react"],
  "plugins": ["transform-class-properties", "istanbul"]
}
```

We can now serve the application and get instrumented code without an intermediate folder, but the result is the same instrumented code loaded by the browser, with the same `window.__coverage__` object keeping track of the original statements.

{% note info %}
Check out {% url "`@cypress/code-coverage#examples`" https://github.com/cypress-io/code-coverage#examples %} for full example projects showing different code coverage setups.
{% endnote %}

{% imgTag /img/guides/code-coverage/source-map.png "Bundled code and source mapped originals" %}

A really nice feature of both {% url "nyc" https://github.com/istanbuljs/nyc %} and {% url "`babel-plugin-istanbul`" https://github.com/istanbuljs/babel-plugin-istanbul %} is that the source maps are generated automatically, allowing us to collect code coverage information, but also interact with the original, non-instrumented code in the Developer Tools. In the screenshot above the bundle (green arrow) has coverage counters, but the source mapped files in the green rectangle show the original code.

{% note info %}
The `nyc` and `babel-plugin-istanbul` only instrument the application code and not 3rd party dependencies from `node_modules`.
{% endnote %}

# E2E code coverage

To handle code coverage collected during each test, we created a {% url "`@cypress/code-coverage`" https://github.com/cypress-io/code-coverage %} Cypress plugin. It merges coverage from each test and saves the combined result. It also calls `nyc` (its peer dependency) to generate static HTML reports for human consumption.

## Install the plugin

```shell
npm install -D @cypress/code-coverage nyc istanbul-lib-coverage
```

Then add the code below to your {% url "`supportFile`" configuration#Folders-Files %} and {% url "`pluginsFile`" configuration#Folders-Files %}.

```js
// cypress/support/index.js
import '@cypress/code-coverage/support'
```

```js
// cypress/plugins/index.js
module.exports = (on, config) => {
  require('@cypress/code-coverage/task')(on, config)

  return config
}
```

When you run the Cypress tests now, you should see a few commands after the tests finish. We have highlighted these commands using a green rectangle below.

{% imgTag /img/guides/code-coverage/coverage-plugin-commands.png "coverage plugin commands" %}

After the tests complete, the final code coverage is saved to a `.nyc_output` folder. It is a JSON file from which we can generate a report in a variety of formats. The {% url "`@cypress/code-coverage`" https://github.com/cypress-io/code-coverage %} plugin generates the HTML report automatically - you can open the `coverage/index.html` page locally after the tests finish. You can also call `nyc report` to generate other reports, for example, sending the coverage information to 3rd party services.

## See code coverage summary

To see the summary of the code coverage after tests run, run the command below.

```shell
npx nyc report --reporter=text-summary

========= Coverage summary =======
Statements   : 76.3% ( 103/135 )
Branches     : 65.31% ( 32/49 )
Functions    : 64% ( 32/50 )
Lines        : 81.42% ( 92/113 )
==================================
```

{% note info %}
**Tip:** store the `coverage` folder as a build artifact on your continuous integration server. Because the report is a static HTML page, some CIs can show it right from their web applications. The screenshot below shows the coverage report stored on CircleCI. Clicking on `index.html` shows the report right in the browser.
{% endnote %}

{% imgTag /img/guides/code-coverage/circleci-coverage-report.png "coverage HTML report on CircleCI" %}

# Code coverage as a guide

Even a single end-to-end test can cover a lot of the application code. For example, let's run the following test that adds a few items, then marks one of them as completed.

```javascript
it('adds and completes todos', () => {
  cy.visit('/')
  cy.get('.new-todo')
    .type('write code{enter}')
    .type('write tests{enter}')
    .type('deploy{enter}')

  cy.get('.todo').should('have.length', 3)

  cy.get('.todo')
    .first()
    .find('.toggle')
    .check()

  cy.get('.todo')
    .first()
    .should('have.class', 'completed')
})
```

After running the test and opening the HTML report, we see 76% code coverage in our application.

{% imgTag /img/guides/code-coverage/single-test.png "Coverage report after a single test" %}

Even better, we can drill down into the individual source files to see what code we missed. In our example application, the main state logic is in the `src/reducers/todos.js` file. Let's see the code coverage in this file:

{% imgTag /img/guides/code-coverage/todos-coverage.png "Main application logic coverage" %}

Notice how the **ADD_TODO** action was executed 3 times - because our test has added 3 todo items, and the **COMPLETE_TODO** action was executed just once - because our test has marked 1 todo item as completed.

The source lines not covered marked in yellow (the switch cases the test missed) and red (regular statements) are a great guide for writing more end-to-end tests. We need tests that delete todo items, edit them, mark all of them as completed at once and clear completed items. When we cover every switch statement in `src/reducers/todos.js` we probably will achieve close to 100% code coverage. Even more importantly, we will cover the main features of the application the user is expected to use.

We can write more E2E tests.

{% imgTag /img/guides/code-coverage/more-tests.png "Cypress Test Runner passed more tests" %}

The produced HTML report shows 99% code coverage

{% imgTag /img/guides/code-coverage/almost-100.png "99 percent code coverage" %}

Every source file but 1 is covered at 100%. We can have great confidence in our application, and safely refactor the code knowing that we have a robust set of end-to-end tests.

If possible, we advise implementing {% url 'visual testing' visual-testing %} in addition to Cypress functional tests to avoid CSS and visual regressions.

# E2E and unit code coverage

Let's look at the one file that has a "missed" line. It is the `src/selectors/index.js` file shown below.

{% imgTag /img/guides/code-coverage/selectors.png "Selectors file with a line not covered by end-to-end tests" %}

The source line not covered by the end-to-end tests shows an edge case NOT reachable from the UI. Yet this switch case is definitely worth testing - at least to avoid accidentally changing its behavior during future refactoring.

We can directly test this piece of code by importing the `getVisibleTodos` function from the Cypress spec file. In essense we are using the Cypress Test Runner as a unit testing tool (find more unit testing recipes {% url "here" https://github.com/cypress-io/cypress-example-recipes#unit-testing %}).

Here is our test to confirm that the error is thrown.

```javascript
// cypress/integration/selectors-spec.js
import { getVisibleTodos } from '../../src/selectors'

describe('getVisibleTodos', () => {
  it('throws an error for unknown visibility filter', () => {
    expect(() => {
      getVisibleTodos({
        todos: [],
        visibilityFilter: 'unknown-filter'
      })
    }).to.throw()
  })
})
```

The test passes, even if there is no web application visited.

{% imgTag /img/guides/code-coverage/unit-test.png "Unit test for selector" %}

Previously we instrumented the application code (either using a build step or inserting a plugin into the Babel pipeline). In the example above, we are NOT loading an application, instead we are only running the test files by themselves.

If we want to collect the code coverage from the unit tests, we need to instrument the source code of *our spec files*. The simplest way to do this is to use the same `.babelrc` with {% url "`babel-plugin-istanbul`" https://github.com/istanbuljs/babel-plugin-istanbul %} and tell the Cypress built-in bundler to use `.babelrc` when bundling specs. One can use the {% url "`@cypress/code-coverage`" https://github.com/cypress-io/code-coverage %} plugin again to do this by adding the code below to your {% url "`pluginsFile`" configuration#Folders-Files %}.

```javascript
// cypress/plugins/index.js
module.exports = (on, config) => {
  require('@cypress/code-coverage/task')(on, config)
  // tell Cypress to use .babelrc file
  // and instrument the specs files
  // only the extra application files will be instrumented
  // not the spec files themselves
  on('file:preprocessor', require('@cypress/code-coverage/use-babelrc'))

  return config
}
```

For reference, the `.babelrc` file is shared between the example application and the spec files, thus Cypress tests are transpiled the same way the application code is transpiled.

```json
{
  "presets": ["@babel/preset-react"],
  "plugins": ["transform-class-properties", "istanbul"]
}
```

When we run Cypress with {% url "`babel-plugin-istanbul`" https://github.com/istanbuljs/babel-plugin-istanbul %} included and inspect the `window.__coverage__` object in the **spec iframe**, we should see the coverage information for the application source files.

{% imgTag /img/guides/code-coverage/code-coverage-in-unit-test.png "Code coverage in the unit test" %}

The code coverage information in unit tests and end-to-end tests has the same format; the {% url "`@cypress/code-coverage`" https://github.com/cypress-io/code-coverage %} plugin automatically grabs both and saves the combined report. Thus we can see the code coverage from the `cypress/integration/selectors-spec.js` file after running the test.

{% imgTag /img/guides/code-coverage/unit-test-coverage.png "Selectors code coverage" %}

Our unit test is hitting the line we could not reach from the end-to-end tests, and if we execute all spec files - we will get 100% code coverage.

{% imgTag /img/guides/code-coverage/100percent.png "Full code coverage" %}

# Full stack code coverage

A complex application might have a Node back end with its own complex logic. From the front end web application, the calls to the API go through layers of code. It would be nice to track what back end code has been exercised during Cypress end-to-end tests.

Are our end-to-end tests that are so effective at covering the web application code also covering the back end server code?

**Long story short: yes.** You can collect the code coverage from the back end, and let the `@cypress/code-coverage` plugin merge it with the front end coverage, creating a single full stack report.

{% note info %}
The full source code for this section can be found in the {% url 'cypress-io/cypress-example-realworld' https://github.com/cypress-io/cypress-example-realworld %} repository.
{% endnote %}

You can run your Node server and instrument it using nyc on the fly. Instead of the "normal" server start command, you can run the command `npm run start:coverage` defined in the `package.json` like this:

```json
{
  "scripts": {
    "start": "node server",
    "start:coverage": "nyc --silent node server"
  }
}
```

In your server, insert another middleware from `@cypress/code-coverage`. If you use an Express server, include `middleware/express`:

```javascript
const express = require('express')
const app = express()

require('@cypress/code-coverage/middleware/express')(app)
```

If your server uses hapi, include `middleware/hapi`

```javascript
if (global.__coverage__) {
  require('@cypress/code-coverage/middleware/hapi')(server)
}
```

**Tip:** you can conditionally register the endpoint only if there is a global code coverage object, and you can {% url "exclude the middleware code from the coverage numbers" https://github.com/gotwarlost/istanbul/blob/master/ignoring-code-for-coverage.md %}:

```javascript
/* istanbul ignore next */
if (global.__coverage__) {
  require('@cypress/code-coverage/middleware/hapi')(server)
}
```

For any other server type, define a `GET /__coverage__` endpoint and return the `global.__coverage__` object.

```javascript
if (global.__coverage__) {
  // handle "GET __coverage__" requests
  onRequest = (response) => {
    response.sendJSON({ coverage: global.__coverage__ })
  }
}
```

In order for the `@cypress/code-coverage` plugin to know that it should request the back end coverage, add the new endpoint to the `cypress.json` environment settings under `env.codeCoverage.url` key. For example, if the application back end is running at port 3000 and we are using the default "GET /__coverage__" endpoint, set the following:

```json
{
  "env": {
    "codeCoverage": {
      "url": "http://localhost:3000/__coverage__"
    }
  }
}
```

From now on, the front end code coverage collected during end-to-end tests will be merged with the code coverage from the instrumented back end code and saved in a single report. Here is an example report from the {% url 'cypress-io/cypress-example-realworld' https://github.com/cypress-io/cypress-example-realworld %} example:

{% imgTag /img/guides/code-coverage/full-coverage.png "Combined code coverage report from front and back end code" %}

You can explore the above combined full stack coverage report at the {% url 'coveralls.io/github/cypress-io/cypress-example-realworld' https://coveralls.io/github/cypress-io/cypress-example-realworld %} dashboard.

# Future work

We are currently exploring two additional features for code coverage during end-to-end tests. First, we would like to avoid the "manual" instrumentation step using the Istanbul.js library and instead capture the native code coverage that can be collected by the Chrome browser's V8 engine. You can find a proof-of-concept example in {% url bahmutov/cypress-native-chrome-code-coverage-example https://github.com/bahmutov/cypress-native-chrome-code-coverage-example %} repository.

Second, we would like to capture the code coverage from *the locally running back end server* that is serving the front end web application and handles the API requests from the web application under test. We believe that E2E tests with additional {% url "API tests" https://www.cypress.io/blog/2017/11/07/add-gui-to-your-e2e-api-tests/ %} that Cypress can perform can effectively cover a lot of back end code.

# Examples

You can find full examples showing different code coverage setups in the following repositories:

- {% url 'cypress-io/cypress-example-todomvc-redux' https://github.com/cypress-io/cypress-example-todomvc-redux %} is the example code used in this guide.
- {% url 'cypress-io/cypress-example-realworld' https://github.com/cypress-io/cypress-example-realworld %} shows how to collect the coverage information from both back and front end code and merge it into a single report.
- {% url 'bahmutov/code-coverage-webpack-dev-server' https://github.com/bahmutov/code-coverage-webpack-dev-server %} shows how to collect code coverage from an application that uses webpack-dev-server.
- {% url 'bahmutov/code-coverage-vue-example' https://github.com/bahmutov/code-coverage-vue-example %} collects code coverage for Vue.js single file components.
- {% url 'lluia/cypress-typescript-coverage-example' https://github.com/lluia/cypress-typescript-coverage-example %} shows coverage for a React App that uses TypeScript.
- {% url 'bahmutov/cypress-and-jest' https://github.com/bahmutov/cypress-and-jest %} shows how to run Jest unit tests and Cypress unit tests, collecting code coverage from both test runners, and then produce a merged report.
- {% url 'rootstrap/react-redux-base' https://github.com/rootstrap/react-redux-base %} shows an example with a realistic webpack config. Instruments the source code using `babel-plugin-istanbul` during tests.
- {% url 'skylock/cypress-angular-coverage-example' https://github.com/skylock/cypress-angular-coverage-example %} shows an Angular 8 + TypeScript application with instrumentation done using `ngx-build-plus`.
- {% url 'bahmutov/testing-react' https://github.com/bahmutov/testing-react %} shows how to get code coverage for a React application created using `CRA v3` without ejecting `react-scripts`.
- {% url 'bahmutov/next-and-cypress-example' https://github.com/bahmutov/next-and-cypress-example %} shows how to get back end and front end coverage for a Next.js project. `middleware/nextjs.js`.

Find the full list of examples linked in {% url cypress-io/code-coverage#external-examples https://github.com/cypress-io/code-coverage#external-examples %}.

# See also

- The official {% url "@cypress/code-coverage" https://github.com/cypress-io/code-coverage %} plugin
- {% url "Combined End-to-end and Unit Test Coverage" https://glebbahmutov.com/blog/combined-end-to-end-and-unit-test-coverage/ %}
- {% url "Code Coverage by Parcel Bundler" https://glebbahmutov.com/blog/code-coverage-by-parcel/ %}
- {% url "Code Coverage for End-to-end Tests" https://glebbahmutov.com/blog/code-coverage-for-e2e-tests/ %}
