---
title: Code Coverage
---

{% note info %}
# {% fa fa-graduation-cap %} What you'll learn

- How to instrument your application code
- How to save the coverage information collected during end-to-end and unit tests
- How to use the code coverage reports to guide test writing

{% endnote %}

You can find what parts of your application code are covered by the Cypress tests and use it to optimize the test writing. The collected information can be sent to external services and help during pull request reviews.

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

A really nice feature of both [nyc][nyc] and [babel-plugin-istanbul][babel-plugin-istanbul] is that the source maps are generated automatically, allowing to collect code coverage information, yet to interact with the original, non-instrumented code in the DevTools debugger. In the screenshot above the bundle (green arrow) has coverage counters, but the source mapped files in the green rectangle show the original code.


[istanbul]: https://istanbul.js.org
[nyc]: https://github.com/istanbuljs/nyc
[babel-plugin-istanbul]: https://github.com/istanbuljs/babel-plugin-istanbul
