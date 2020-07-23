---
title: Writing and Organizing Tests
---

{% note info %}
# {% fa fa-graduation-cap %} What you'll learn

- How to organize your test and support files.
- What languages are supported in your test files.
- How Cypress handles unit tests vs integration tests.
- How to group your tests.
{% endnote %}

{% note success "Best Practices" %}
We recently gave a "Best Practices" conference talk at AssertJS (February 2018). This video demonstrates how to approach breaking down your application and organizing your tests.

{% fa fa-play-circle %} {% url https://www.youtube.com/watch?v=5XQOK0v_YRE %}
{% endnote %}

# Folder Structure

After adding a new project, Cypress will automatically scaffold out a suggested folder structure. By default it will create:

```text
/cypress
  /fixtures
    - example.json

  /integration
    /examples
      - actions.spec.js
      - aliasing.spec.js
      - assertions.spec.js
      - connectors.spec.js
      - cookies.spec.js
      - cypress_api.spec.js
      - files.spec.js
      - local_storage.spec.js
      - location.spec.js
      - misc.spec.js
      - navigation.spec.js
      - network_requests.spec.js
      - querying.spec.js
      - spies_stubs_clocks.spec.js
      - traversal.spec.js
      - utilities.spec.js
      - viewport.spec.js
      - waiting.spec.js
      - window.spec.js

  /plugins
    - index.js

  /support
    - commands.js
    - index.js
```

## Configuring Folder Structure

While Cypress allows you to configure where your tests, fixtures, and support files are located, if you're starting your first project, we recommend you use the above structure.

You can modify the folder configuration in your configuration file. See {% url 'configuration' configuration#Folders-Files %} for more detail.

{% note info "What files should I add to my '.gitignore file' ?" %}
Cypress will create a {% url `screenshotsFolder` configuration#Screenshots %} and a {% url `videosFolder` configuration#Videos %} to store the screenshots and videos taken during the testing of your application. Many users will opt to add these folders to their `.gitignore` file. Additionally, if you are storing sensitive environment variables in your configuration file (`cypress.json` by default) or {% url `cypress.env.json` environment-variables#Option-2-cypress-env-json %}, these should also be ignored when you check into source control.
{% endnote %}

## Fixture Files

Fixtures are used as external pieces of static data that can be used by your tests. Fixture files are located in `cypress/fixtures` by default, but can be {% url 'configured' configuration#Folders-Files %} to another directory.

You would typically use them with the {% url `cy.fixture()` fixture %} command and most often when you're stubbing {% url 'Network Requests' network-requests %}.

## Test files

Test files are located in `cypress/integration` by default, but can be {% url 'configured' configuration#Folders-Files %} to another directory. Test files may be written as:

- `.js`
- `.jsx`
- `.coffee`
- `.cjsx`

Cypress also supports `ES2015` out of the box. You can use either `ES2015 modules` or `CommonJS modules`. This means you can `import` or `require` both **npm packages** and **local relative modules**.

{% note info Example Recipe %}
Check out our recipe using {% url 'ES2015 and CommonJS modules' recipes#Fundamentals %}.
{% endnote %}

To see an example of every command used in Cypress, open the {% url "`example` folder" https://github.com/cypress-io/cypress-example-kitchensink/blob/master/cypress/integration/examples %} within your `cypress/integration` folder.

To start writing tests for your app, create a new file like `app_spec.js` within your `cypress/integration` folder. Refresh your tests list in the Cypress Test Runner and your new file should have appeared in the list.

## Plugin files

By default Cypress will automatically include the plugins file `cypress/plugins/index.js` **before** every single spec file it runs. We do this purely as a convenience mechanism so you don't have to import this file in every single one of your spec files.

The initial imported plugins file can be {% url 'configured to another file' configuration#Folders-Files %}.

{% url "Read more about using plugins to extend Cypress behavior." plugins-guide %}

## Support file

By default Cypress will automatically include the support file `cypress/support/index.js`. This file runs **before** every single spec file. We do this purely as a convenience mechanism so you don't have to import this file in every single one of your spec files.

{% note danger%}
{% fa fa-warning %} Keep in mind, when clicking "Run all specs" after {% url "`cypress open`" command-line#cypress-open %}, the code in the support file is executed once before all spec files, instead of once before each spec file. See {% urlHash "Execution" Execution %} for more details.
{% endnote %}

The initial imported support file can be configured to another file or turned off completely using the  {% url '`supportFile`' configuration#Folders-Files %} configuration.

The support file is a great place to put reusable behavior such as {% url "custom commands" custom-commands %} or global overrides that you want applied and available to all of your spec files.

From your support file you can `import` or `require` other files to keep things organized.

We automatically seed an example support file, which has several commented out examples.

You can define behaviors in a `before` or `beforeEach` within any of the `cypress/support` files:

```javascript
beforeEach(() => {
  cy.log('I run before every test in every spec file!!!!!!')
})
```

{% imgTag /img/guides/global-hooks.png "Global hooks for tests" %}

{% note info %}
**Note:** This example assumes you are already familiar with Mocha {% url 'hooks' writing-and-organizing-tests#Hooks %}.
{% endnote %}

### Execution

Cypress executes the support file before the spec file. For example when you click on a test file named `spec-a.js` via {% url "`cypress open`" command-line#cypress-open %}, then the Test Runner executes the files in the following order:

```html
<!-- bundled support file -->
<script src="support/index.js"></script>
<!-- bundled spec file -->
<script src="integration/spec-a.js"></script>
```

The same happens when using the {% url "`cypress run`" command-line#cypress-run %} command: a new browser window is opened for each support and spec file pair.

But when you click on "Run all specs" button after {% url "`cypress open`" command-line#cypress-open %}, the Test Runner bundles and concatenates all specs together, in essence running scripts like shown below. This means the code in the support file is executed once before all spec files, instead of once before each spec file.

```html
<!-- bundled support file -->
<script src="support/index.js"></script>
<!-- bundled first spec file, second spec file, etc -->
<script src="integration/spec-a.js"></script>
<script src="integration/spec-b.js"></script>
...
<script src="integration/spec-n.js"></script>
```

{% note info %}
Having a single support file when running all specs together might execute `before` and `beforeEach` hooks in ways you may not anticipate. Read {% url "'Be careful when running all specs together'" https://glebbahmutov.com/blog/run-all-specs/ %} for examples.
{% endnote %}

# Writing tests

Cypress is built on top of {% url 'Mocha' bundled-tools#Mocha %} and {% url 'Chai' bundled-tools#Chai %}. We support both Chai's `BDD` and `TDD` assertion styles. Tests you write in Cypress will mostly adhere to this style.

If you're familiar with writing tests in JavaScript, then writing tests in Cypress will be a breeze.

## Test Structure

The test interface, borrowed from {% url 'Mocha' bundled-tools#Mocha %}, provides `describe()`, `context()`, `it()` and `specify()`.

`context()` is identical to `describe()` and `specify()` is identical to `it()`, so choose whatever terminology works best for you.

```javascript
// -- Start: Our Application Code --
function add (a, b) {
  return a + b
}

function subtract (a, b) {
  return a - b
}

function divide (a, b) {
  return a / b
}

function multiply (a, b) {
  return a * b
}
// -- End: Our Application Code --

// -- Start: Our Cypress Tests --
describe('Unit test our math functions', () => {
  context('math', () => {
    it('can add numbers', () => {
      expect(add(1, 2)).to.eq(3)
    })

    it('can subtract numbers', () => {
      expect(subtract(5, 12)).to.eq(-7)
    })

    specify('can divide numbers', () => {
      expect(divide(27, 9)).to.eq(3)
    })

    specify('can multiply numbers', () => {
      expect(multiply(5, 4)).to.eq(20)
    })
  })
})
// -- End: Our Cypress Tests --
```

## Hooks

Cypress also provides hooks (borrowed from {% url 'Mocha' bundled-tools#Mocha %}).

These are helpful to set conditions that you want to run before a set of tests or before each test. They're also helpful to clean up conditions after a set of tests or after each test.

```javascript
beforeEach(() => {
  // root-level hook
  // runs before every test
})

describe('Hooks', () => {
  before(() => {
    // runs once before all tests in the block
  })

  beforeEach(() => {
    // runs before each test in the block
  })

  afterEach(() => {
    // runs after each test in the block
  })

  after(() => {
    // runs once after all tests in the block
  })
})
```

### The order of hook and test execution is as follows:

- All `before()` hooks run (once)
- Any `beforeEach()` hooks run
- Tests run
- Any `afterEach()` hooks run
- All `after()` hooks run (once)

{% note danger %}
{% fa fa-warning %} Before writing `after()` or `afterEach()` hooks, please see our {% url "thoughts on the anti-pattern of cleaning up state with `after()` or `afterEach()`" best-practices#Using-after-or-afterEach-hooks %}.
{% endnote %}

{% note danger %}
{% fa fa-warning %} Be wary of root-level hooks, as they could execute in a surprising order when clicking the "Run all specs" button. Instead place them inside `describe` or `context` suites for isolation. Read {% url "'Be careful when running all specs together'" https://glebbahmutov.com/blog/run-all-specs/ %}.
{% endnote %}

## Excluding and Including Tests

To run a specified suite or test, append `.only` to the function. All nested suites will also be executed. This gives us the ability to run one test at a time and is the recommended way to write a test suite.

```javascript
// -- Start: Our Application Code --
function fizzbuzz (num) {
  if (num % 3 === 0 && num % 5 === 0) {
    return 'fizzbuzz'
  }

  if (num % 3 === 0) {
    return 'fizz'
  }

  if (num % 5 === 0) {
    return 'buzz'
  }
}
// -- End: Our Application Code --

// -- Start: Our Cypress Tests --
describe('Unit Test FizzBuzz', () => {
  function numsExpectedToEq (arr, expected) {
    // loop through the array of nums and make
    // sure they equal what is expected
    arr.forEach((num) => {
      expect(fizzbuzz(num)).to.eq(expected)
    })
  }

  it.only('returns "fizz" when number is multiple of 3', () => {
    numsExpectedToEq([9, 12, 18], 'fizz')
  })

  it('returns "buzz" when number is multiple of 5', () => {
    numsExpectedToEq([10, 20, 25], 'buzz')
  })

  it('returns "fizzbuzz" when number is multiple of both 3 and 5', () => {
    numsExpectedToEq([15, 30, 60], 'fizzbuzz')
  })
})
```

To skip a specified suite or test, append `.skip()` to the function. All nested suites will also be skipped.

```javascript
it.skip('returns "fizz" when number is multiple of 3', () => {
  numsExpectedToEq([9, 12, 18], 'fizz')
})
```

## Test Configuration

To apply a specific Cypress {% url "configuration" configuration %} value to a suite or test, pass a configuration object to the test or suite function as the second argument.

This configuration will take effect during the suite or tests where they are set then return to their previous default values after the suite or tests are complete.

### Syntax

```javascript
describe(name, config, fn)
context(name, config, fn)
it(name, config, fn)
specify(name, config, fn)
```

### Allowed config values

{% partial allowed_test_config %}

### Suite of test configuration

You can configure the size of the viewport height and width within a suite.

```js
describe('page display on medium size screen', {
  viewportHeight: 1000,
  viewportWidth: 400
}, () => {
  it('does not display sidebar', () => {
    cy.get('#sidebar').should('not.be.visible')
  })

  it('shows hamburger menu', () => {
    cy.get('#header').find('i.menu').should('be.visible')
  })
})
```

### Single test configuration

If you want to target a test to run or be excluded when run in a specific browser, you can override the `browser` configuration within the test configuration. The `browser` option accepts the same arguments as {% url "`Cypress.isBrowser()`" isbrowser %}.

```js
it('Show warning outside Chrome', {  browser: '!chrome' }, () => {
  cy.get('.browser-warning')
    .should('contain', 'For optimal viewing, use Chrome browser')
})
```

## Dynamically Generate Tests

You can dynamically generate tests using JavaScript.

```javascript
describe('if your app uses jQuery', () => {
  ['mouseover', 'mouseout', 'mouseenter', 'mouseleave'].forEach((event) => {
    it('triggers event: ' + event, () => {
      // if your app uses jQuery, then we can trigger a jQuery
      // event that causes the event callback to fire
      cy
        .get('#with-jquery').invoke('trigger', event)
        .get('#messages').should('contain', 'the event ' + event + 'was fired')
    })
  })
})
```

The code above will produce a suite with 4 tests:

```text
> if your app uses jQuery
  > triggers event: 'mouseover'
  > triggers event: 'mouseout'
  > triggers event: 'mouseenter'
  > triggers event: 'mouseleave'
```

## Assertion Styles

Cypress supports both BDD (`expect`/`should`) and TDD (`assert`) style assertions. {% url "Read more about assertions." assertions %}

```javascript
it('can add numbers', () => {
  expect(add(1, 2)).to.eq(3)
})

it('can subtract numbers', () => {
  assert.equal(subtract(5, 12), -7, 'these numbers are equal')
})
```

# Watching tests

When running in using {% url "`cypress open`" command-line#cypress-open %}, Cypress watches the filesystem for changes to your spec files. Soon after adding or updating a test Cypress will reload it and run all of the tests in that spec file.

This makes for a productive development experience because you can add and edit tests as you're implementing a feature and the Cypress user interface will always reflect the results of your latest edits.

{% note info %}
Remember to use {% url `.only` writing-and-organizing-tests#Excluding-and-Including-Tests %} to limit which tests are run: this can be especially useful when you've got a lot of tests in a single spec file that you're constantly editing; consider also splitting your tests into smaller files each dealing with logically related behavior.
{% endnote %}

## What is watched?

### Files

- {% url "Configuration file (`cypress.json`) by default" configuration %}
- {% url "`cypress.env.json`" environment-variables %}

### Folders

- Integration directory (`cypress/integration/` by default)
- Support directory (`cypress/support/` by default)
- Plugins directory (`cypress/plugins/` by default)

The folder, the files within the folder, and all child folders and their files (recursively) are watched.

{% note info %}
Those folder paths refer to the {% url 'default folder paths' configuration#Folders-Files %}. If you've configured Cypress to use different folder paths then the folders specific to your configuration will be watched.
{% endnote %}

## What isn't watched?

Everything else; this includes, but isn't limited to, the following:

- Your application code
- `node_modules`
- `cypress/fixtures/`

If you're developing using a modern JS-based web application stack then you've likely got support for some form of hot module replacement which is responsible for watching your application code&mdash;HTML, CSS, JS, etc.&mdash;and transparently reloading your application in response to changes.

## Configuration

Set the {% url `watchForFileChanges` configuration#Global %} configuration property to `false` to disable file watching.

{% note warning %}
**Nothing** is watched during {% url "`cypress run`" command-line#cypress-run %}.

The `watchForFileChanges` property is only in effect when running Cypress using {% url "`cypress open`" command-line#cypress-open %}.
{% endnote %}

The component responsible for the file-watching behavior in Cypress is the {% url 'Cypress Browserify Preprocessor' https://github.com/cypress-io/cypress-browserify-preprocessor %}. This is the default file-watcher packaged with Cypress.

If you need further control of the file-watching behavior you can configure this preprocessor explicitly: it exposes options that allow you to configure behavior such as _what_ is watched and the delay before emitting an "update" event after a change.

Cypress also ships other {% url "file-watching preprocessors" plugins %}; you'll have to configure these explicitly if you want to use them.

- {% url 'Cypress Watch Preprocessor' https://github.com/cypress-io/cypress-watch-preprocessor %}
- {% url 'Cypress webpack Preprocessor' https://github.com/cypress-io/cypress-webpack-preprocessor %}
