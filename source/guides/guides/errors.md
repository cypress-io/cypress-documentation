---
title: Errors
---

Sometimes tests fail. Sometimes we want them to fail, just so we know they're testing the right thing when they pass. But other times, tests fail unintentionally and we need to figure out why. Cypress provides some tools to help make that process as easy as possible.

# Anatomy of an error

Let's take a look at the anatomy of an error and how it is displayed in Cypress, by way of a failing test.

```javascript
it('failure', () => {
  cy
  .get('div')
  .find('h1') // this element does not exist
})
```

The `<h1>` element does not exist in our application under test, so the test above will fail. Within Cypress, an error will show on failure that includes the following pieces of information:

{% partial errors_anatomy %}

# Source maps

Cypress utilizes source maps to enhance the error experience. Stack traces are translated so that your source files are shown instead of the generated file that is loaded by the browser. This also enables displaying code frames. Without inline source maps, you will not see code frames.

By default, Cypress will include an inline source map in your spec file, so you will get the most out of the error experience. If you {% url "modify the preprocessor" preprocessors-api %}, ensure that inline source maps are enabled to get the same experience. With webpack and the {% url "webpack preprocessor" https://github.com/cypress-io/cypress-webpack-preprocessor %}, for example, set {% url "the `devtool` option" https://webpack.js.org/configuration/devtool/ %} to `inline-source-map`.
