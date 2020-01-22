---
title: Errors
---

Sometimes tests fail. Sometimes we want them to fail, just so we know they're doing the right thing when the pass. But other times, tests fail unintentionally and we need to figure out why. Cypress tries its best to provide errors that make that process as easy as possible.

Let's take a look at the anatomy of an error, by way of a failing test.

```javascript
it('failure', () => {
  cy
  .get('div')
  .find('h1')
})
```

{% imgTag /img/guides/command-failure-error.png "example command failure error" %}

1. **Error name**: This is the type of the error (e.g. AssertionError, CypressError)
2. **Error message**: This generally tells you what went wrong. It can vary in length. Some are short like in the example, while some are long, and may tell you exactly how to fix the error.
3. **View stack trace button**: Clicking this toggles the visibility of the stack trace.
4. **Stack trace**: This is hidden by default, but clicking *View stack trace* will show it in full. Stack traces vary in length. Click on the blue file path, and the file will open in your {% url "application of choice" file-opener-preference %}.
5. **Code frame file**: This is usually the top line of the stack trace and is shows the file, line, and column that is highlighted in the code frame below. Click on it to open it in your {% url "application of choice" file-opener-preference %}.
6. **Code frame**: This shows a snippet of code where the failure occurred, with the relevant line highlighted.
7. **Print to console button**: Click this to print the error in your DevTools console. This will usually allow you to click on lines in the stack trace and open files in your DevTools.

## Source maps

Cypress utilizes source maps to enhance the error experience. Stack traces are translated so that your source files are shown instead of the generated file that is loaded by the browser. This also enables displaying code frames. Without inline source maps, you will not see code frames.

By default, Cypress will include an inline source map in your spec file, so you will get the most out of the error experience. If you {% url "modify the preprocessor" preprocessors-api %}, ensure that inline source maps are enabled to get the same experience. With webpack and the {% url "webpack preprocessor" https://github.com/cypress-io/cypress-webpack-preprocessor %}, for example, set {% url "the `devtool` option" https://webpack.js.org/configuration/devtool/ %} to `inline-source-map`.
