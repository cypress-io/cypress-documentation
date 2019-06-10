---
title: Code Coverage
---

{% note info %}
# {% fa fa-graduation-cap %} What you'll learn

- How to instrument your application code
- How to save the coverage information collected during end-to-end and unit tests
- How to use the code coverage reports to guide test writing

{% endnote %}

# Introduction

As you write more and more end-to-end tests (hopefully you will find that Cypress Test Runner is making test writing perhaps too easy), you will find yourself wondering - do I need to write more tests? Are there parts of the application still untested? Are there parts of the application that perhaps are tested too many times? One answer to those questions is to find out which lines of the application's source code were executed during end-to-end tests. If there are important sections of the application's logic that **were not** executed from the tests, then a new test needs to be added to cover them.

Computing the source code lines that were executed during the test is done through code coverage, which requires inserting additional counters into your source code before running it. This step is called "instrumentation" and it takes your code that looks likes this:

```javascript
function add(a, b) {
  return a + b
}
module.exports = { add }
```

and parses it to find all functions, all statements, all branches and inserts a bunch of counters. For the above code it might look likes this:

```javascript
// this object keeps number of times each function
// and each statement were executed
const c = window.__coverage__ = {
  // "f" keeps count of times each function was called
  // we only have a single function in the source code
  // thus it starts with [0]
  f: [0],
  // "s" keeps count of times each statement was called
  // we have 3 statements, and they all start with 0
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

Imagine we load the above instrumented source file from the spec file. Immediately some counters will be incremented!

```javascript
const { add } = require('./add')
// JavaScript engine has parsed and evaluated "add.js" source code
// which ran some of the increment statements
// __coverage__ has now
// f: [0] - function "add" was NOT executed
// s: [1, 0, 1] - first and third counters were incremented
//    but the statement inside function "add" was NOT executed
```

We want to make sure every statement and function in the file "add.js" has been executed by our tests at least once. Thus we write a test:

```javascript
const { add } = require('./add')

it('adds numbers', () => {
  expect(add(2, 3)).to.equal(5)
})
```

When the test calls `add(2, 3)`, the counter increments inside function "add" are executed, and the coverage object becomes:

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

The single test has achieved 100% code coverage - every function and every statement has been executed at least once. Of course in the real world applications, achieving 100% code coverage requires multiple tests.

Once the tests finish, the coverage object can be serialized and saved to disk and a human-friendly report can be generated. The collected coverage information can also be sent to the external services and help during pull request reviews.

{% note info %}
If you are unfamiliar with code coverage, take a look at the "Understanding JavaScript Code Coverage" blog post {% url "part 1" https://www.semantics3.com/blog/understanding-code-coverage-1074e8fccce0/ %} and {% url "part 2" https://www.semantics3.com/blog/understanding-javascript-code-coverage-part-2-9aedaa5119e5/ %}.
{% endnote %}

This guide explains how to instrument the application source code using commonly used tools. Then we show how to save the coverage information and generate reports using Cypress plugin [@cypress/code-coverage][code-coverage]. After reading this guide you should be able to better target your tests using the code coverage information.

The full source code for this guide can be found in the repository {% url 'cypress-io/cypress-example-todomvc-redux' https://github.com/cypress-io/cypress-example-todomvc-redux %}.

# Instrumenting code

Cypress does not instrument your code - you need to do it yourself. Luckily, the golden standard for JavaScript code instrumentation is the battle-hardened [Istanbul.js][istanbul] and it plays very nicely with the Cypress Test Runner. You can instrument the code as a build step by using the module [nyc][nyc] - a command-line interface to [Istanbul.js][istanbul] library, or as a part of your code transpilation pipeline using [babel-plugin-istanbul][babel-plugin-istanbul].

To instrument the application code located in folder `src` and save it in folder `instrumented` use the following command:

```shell
npx nyc instrument --compact=false src instrumented
```

I am passing `--compact=false` flag to generate human-friendly output.

The instrumentation takes your original code like this fragment:

```javascript
const store = createStore(reducer)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

and wraps each statement with additional counters that keep track how many times each source line has been executed by the JavaScript runtime:

```javascript
const store = (cov_18hmhptych.s[0]++, createStore(reducer));
cov_18hmhptych.s[1]++;
render(<Provider store={store}>
    <App />
  </Provider>, document.getElementById('root'));
```

Notice the calls `cov_18hmhptych.s[0]++` and `cov_18hmhptych.s[1]++` that increment the statement counters. All counters and additional book-keeping information is stored in a single object attached to the browser's `window` object. We can see the counters if we serve the folder `instrumented` instead of `src` and open the application.

{% imgTag /img/guides/code-coverage/coverage-object.png "Code coverage object" %}

If we drill into the coverage object to see the statements executed in each file. For example the file `src/index.js` has the following information:

{% imgTag /img/guides/code-coverage/coverage-statements.png "Covered statements counters in a from the index file" %}

In green, I highlighted the 4 statements present in that file. The first three statements were executed once each, and the last statement was never executed because it probably was inside an `if` statement. By using the application, we can both increment the counters and flip some of the zero counters into positive numbers.

Instead of using `npx instrument` command, we can use `babel-plugin-istanbul` to instrument the code as part of the its transpilation. Just add this plugin to the `.babelrc` file for example:

```rc
{
  "presets": ["@babel/preset-react"],
  "plugins": ["transform-class-properties", "istanbul"]
}
```

I can now serve the application using and get instrumented code without an intermediate folder, but the result is the same instrumented code loaded by the browser, with the same `window.__coverage__` object keeping track of the original statements.

{% imgTag /img/guides/code-coverage/source-map.png "Bundled code and source mapped originals" %}

A really nice feature of both [nyc][nyc] and [babel-plugin-istanbul][babel-plugin-istanbul] is that the source maps are generated automatically, allowing to collect code coverage information, yet to interact with the original, non-instrumented code in the Developer Tools debugger. In the screenshot above the bundle (green arrow) has coverage counters, but the source mapped files in the green rectangle show the original code.

{% note info %}
The `nyc` and `babel-plugin-istanbul` only instrument the application code and not 3rd party dependencies from `node_modules`.
{% endnote %}

# Code coverage from E2E tests

To handle code coverage collected during each test, we have created Cypress plugin [@cypress/code-coverage][code-coverage]. It merges coverage from each test and saves the combined result. It also calls `nyc` (its peer dependency) to generate static HTML report for human consumption. To install the plugin use:

```shell
npm install -D @cypress/code-coverage nyc istanbul-lib-coverage
```

Then add the plugin to the support file and the plugins file:

```javascript
// cypress/support/index.js
import '@cypress/code-coverage/support'

// cypress/plugins/index.js
module.exports = (on, config) => {
  on('task', require('@cypress/code-coverage/task'))
}
```

When you run the Cypress tests now, you should see a few commands after the tests finish. I have highlighted these commands using green rectangle below.

{% imgTag /img/guides/code-coverage/coverage-plugin-commands.png "coverage plugin commands" %}

After the tests complete, the final code coverage is saved to the folder `.nyc_output`. It is a JSON file from which we can generate a report in a variety of formats. The `@cypress/code-coverage` plugin generates the HTML report automatically - you can open the `coverage/index.html` page locally after the tests finish. You can also call `nyc report` to generate other reports, for example for sending the coverage information to 3rd party services.

To see the summary of the code coverage after the tests:

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
**Tip:** store the `coverage` folder as a build artifact on your continuous integration server. Because the report is a static HTML page, some CIs can show it write from their web applications. The screenshot below shows the coverage report stored on CircleCI. Clicking on the `index.html` shows the report right in the browser.
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

Even better, we can drill down into the individual source files to see the code we have missed. In our example application, the main state logic is in the "src/reducers/todos.js" file. Let us see the code coverage in this file:

{% imgTag /img/guides/code-coverage/todos-coverage.png "Main application logic coverage" %}

Notice how the "ADD_TODO" action was executed 3 times - because our test has added 3 todo items, and the "COMPLETE_TODO" action was executed just once - because our test has marked 1 todo item as completed. The sources line not covered: marked in yellow (the switch cases the test missed) and red (regular statements) are a great guide for writing more end-to-end tests. We need tests that delete todo items, edit them, mark all of them as completed at once and clear completed items. When we cover every switch statement in "src/reducers/todos.js" we probably will achieve code coverage close to 100%. Even more importantly, we will cover the main features of the application the user is expected to use.

We can quickly write more E2E tests:

{% imgTag /img/guides/code-coverage/more-tests.png "Cypress Test Runner passed more tests" %}

The produced HTML report shows 99% code coverage

{% imgTag /img/guides/code-coverage/almost-100.png "99 percent code coverage" %}

Every source file but 1 is covered at 100%. We can have great confidence in our application, and safely refactor the code, knowing that we have a robust set of end-to-end tests. If possible, we advise to implement {% url 'visual testing' visual-testing %} in addition to Cypress functional tests to avoid CSS and visual regressions.

# Combined E2E and unit coverage

Let us look at the one file that has a "missed" line. It is file "src/selectors/index.js" shown below

{% imgTag /img/guides/code-coverage/selectors.png "Selectors file with a line not covered by end-to-end tests" %}

The source line not covered by the end-to-end tests shows an edge case NOT reachable from the UI. Yet this switch case is definitely worth testing - at least to avoid accidentally changing its behavior during refactoring. We can directly test this piece of code by importing the `getVisibleTodos` function from the Cypress spec file. In essense we are using the Cypress Test Runner as a unit testing tool (find more unit testing recipes {% url here" https://github.com/cypress-io/cypress-example-recipes#unit-testing %}). Here is our test to confirm that the error is thrown:

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

The test passes, even if the there is no web application visited.

{% imgTag /img/guides/code-coverage/unit-test.png "Unit test for selector" %}

Previously we have instrumented the application code (either using a build step, or inserting a plugin into the Babel pipeline). Now we are NOT loading an application, instead we are only running the test files by themselves. If we want to collect the code coverage from the unit tests, we need to instrument the source code of *our spec files*. The simplest way to do this is to use the same `.babelrc` with `babel-plugin-istanbul` and tell the Cypress built-in bundler to use `.babelrc` when bundling specs. One can use the `@cypress/code-coverage` again to do this:

```javascript
module.exports = (on, config) => {
  on('task', require('@cypress/code-coverage/task'))
  // tell Cypress to use .babelrc file
  // and instrument the specs files
  // only the extra application files will be instrumented
  // not the spec files themselves
  on('file:preprocessor', require('@cypress/code-coverage/use-babelrc'))

  return config
}
```

For reference, the `.babelrc` file is shared between the example application and the spec files, thus Cypress tests are transpiled the same way as the application code is.

```rc
{
  "presets": ["@babel/preset-react"],
  "plugins": ["transform-class-properties", "istanbul"]
}
```

When we run Cypress with `babel-plugin-istanbul` included and inspect the `window.__coverage__` object in the **spec iframe**, we should see the coverage information for the application source files.

{% imgTag /img/guides/code-coverage/code-coverage-in-unit-test.png "Code coverage in the unit test" %}

The code coverage information in unit tests and end-to-end tests has the same format; the `@cypress/code-coverage` plugin automatically grabs both and saves the combined report. Thus we can see the code coverage from the `cypress/integration/selectors-spec.js` file after running the test.

{% imgTag /img/guides/code-coverage/unit-test-coverage.png "Selectors code coverage" %}

Our unit test is hitting the line we could not reach from the end-to-end tests, and if we execute all spec files - we will get 100% code coverage.

{% imgTag /img/guides/code-coverage/100percent.png "Full code coverage" %}

# See also

- The official [@cypress/code-coverage][code-coverage] plugin
- {% url "Combined End-to-end and Unit Test Coverage" https://glebbahmutov.com/blog/combined-end-to-end-and-unit-test-coverage/ %}
- {% url "Code Coverage by Parcel Bundler" https://glebbahmutov.com/blog/code-coverage-by-parcel/ %}
- {% url "Code Coverage for End-to-end Tests" https://glebbahmutov.com/blog/code-coverage-for-e2e-tests/ %}

[istanbul]: https://istanbul.js.org
[nyc]: https://github.com/istanbuljs/nyc
[babel-plugin-istanbul]: https://github.com/istanbuljs/babel-plugin-istanbul
[code-coverage]: https://github.com/cypress-io/code-coverage
