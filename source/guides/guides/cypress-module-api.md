---
title: Cypress Module API
comments: false
---

{% note warning %}
The Cypress module API has not been finalized yet and might change in the future.
{% endnote %}

You can use Cypress as a Node module in addition to its CLI binary. The simplest example with a single spec file can be tested like this:

```js
const cypress = require('cypress')
cypress.run({
  spec: './cypress/integration/a-spec.js'
}).then(console.log, console.error)
```

## `run()` method

A Promise-returning method that resolves with an object with test results. A typical run with 2 passing tests could return something like this

```js
const cypress = require('cypress')
cypress.run({
  spec: './cypress/integration/passing-spec.js'
}).then(console.log)
```
```json
{
  "tests": 2,
  "passes": 2,
  "pending": 0,
  "failures": 0,
  "duration": "2 seconds",
  "screenshots": 0,
  "video": true,
  "version": "0.20.0"
}
```

If a test is failing, the promise still resolves, but different counters

```js
const cypress = require('cypress')
cypress.run({
  spec: './cypress/integration/failing-spec.js'
}).then(console.log)
```
```json
{
  "tests": 2,
  "passes": 1,
  "pending": 0,
  "failures": 1,
  "duration": "2 seconds",
  "screenshots": 1,
  "video": true,
  "version": "0.20.0"
}
```

The promise is only rejected if Cypress cannot run for some reason; for example if a binary has not been installed. In that case, the promise will be rejected with detailed error.

### Options

You have already seen the first useful option `run` takes: `{spec: "<spec path>"}`. Without it Cypress will try to run all files in the default `cypress/integration` folder. This and other options all are the same as Cypress {% url "Command Line" command-line#cypress-run %} options, except they have to the full words and not single letter aliases.

**{% fa fa-check-circle green %} Correct Usage**

```javascript
const cypress = require('cypress')
cypress.run({
  spec: './cypress/integration/spec.js',
  port: 8220,
  browser: 'chrome'
})
```

**{% fa fa-exclamation-triangle red %} Incorrect Usage**

```javascript
const cypress = require('cypress')
cypress.run({
  s: './cypress/integration/spec.js',
  p: 8220,
  b: 'chrome'
})
```

