---
title: Writing and Organizing Tests
---

<Alert type="info">

## <Icon name="graduation-cap"></Icon> What you'll learn

- How to organize your test and support files.
- What languages are supported in your test files.
- How Cypress handles unit tests vs integration tests.
- How to group your tests.

</Alert>

<Alert type="success">

<strong class="alert-header">Best Practices</strong>

We recently gave a "Best Practices" conference talk at AssertJS (February 2018).
This video demonstrates how to approach breaking down your application and
organizing your tests.

<Icon name="play-circle"></Icon>
[https://www.youtube.com/watch?v=5XQOK0v_YRE](https://www.youtube.com/watch?v=5XQOK0v_YRE)

</Alert>

## Folder structure

After adding a new project, Cypress will automatically scaffold out a suggested
folder structure. By default it will create:

<code-group>
<code-block label="JavaScript" active>

```text
E2E:
/cypress.config.js
/cypress/fixtures/example.json
/cypress/support/commands.js
/cypress/support/e2e.js

Component:
/cypress.config.js
/cypress/fixtures/example.json
/cypress/support/commands.js
/cypress/support/component.js
/cypress/support/component-index.html

Both:
/cypress.config.js
/cypress/fixtures/example.json
/cypress/support/commands.js
/cypress/support/e2e.js
/cypress/support/component.js
/cypress/support/component-index.html
```

</code-block>
<code-block label="TypeScript">

```text
E2E:
/cypress.config.ts
/cypress/fixtures/example.json
/cypress/support/commands.ts
/cypress/support/e2e.ts

Component:
/cypress.config.ts
/cypress/fixtures/example.json
/cypress/support/commands.ts
/cypress/support/component.ts
/cypress/support/component-index.html

Both:
/cypress.config.ts
/cypress/fixtures/example.json
/cypress/support/commands.ts
/cypress/support/e2e.ts
/cypress/support/component.ts
/cypress/support/component-index.html
```

</code-block>
</code-group>

### Configuring Folder Structure

While Cypress allows you to configure where your tests, fixtures, and support
files are located, if you're starting your first project, we recommend you use
the above structure.

You can modify the folder configuration in your configuration file. See the
[Cypress configuration](/guides/references/configuration#Folders-Files) for more
detail.

<Alert type="info">

<strong class="alert-header">What files should I add to my '.gitignore file'
?</strong>

Cypress will create a
[`screenshotsFolder`](/guides/references/configuration#Screenshots) and a
[`videosFolder`](/guides/references/configuration#Videos) to store the
screenshots and videos taken during the testing of your application. Many users
will opt to add these folders to their `.gitignore` file. Additionally, if you
are storing sensitive environment variables in your
[Cypress configuration](/guides/references/configuration) or
[`cypress.env.json`](/guides/guides/environment-variables#Option-2-cypress-env-json),
these should also be ignored when you check into source control.

</Alert>

### Spec files

Test files are located in `cypress/e2e` by default, but can be
[configured](/guides/references/configuration#Folders-Files) to another
directory. Test files may be written as:

- `.js`
- `.jsx`
- `.ts`
- `.tsx`
- `.coffee`
- `.cjsx`

Cypress also supports `ES2015` out of the box. You can use either
`ES2015 modules` or `CommonJS modules`. This means you can `import` or `require`
both **npm packages** and **local relative modules**.

<Alert type="info">

<strong class="alert-header">Example Recipe</strong>

Check out our recipe using
[ES2015 and CommonJS modules](/examples/examples/recipes#Fundamentals).

</Alert>

To see an example of every command used in Cypress, open the
[`2-advanced-examples` folder](https://github.com/cypress-io/cypress-example-kitchensink/tree/master/cypress/integration/2-advanced-examples)
within your `cypress/e2e` folder.

### Fixture Files

Fixtures are used as external pieces of static data that can be used by your
tests. Fixture files are located in `cypress/fixtures` by default, but can be
[configured](/guides/references/configuration#Folders-Files) to another
directory.

You would typically use them with the [`cy.fixture()`](/api/commands/fixture)
command and most often when you're stubbing
[Network Requests](/guides/guides/network-requests).

### Asset Files

There are some folders that may be generated after a test run, containing assets
that were generated during the test run.

You may consider adding these folders to your `.gitignore` file to ignore
checking these files into source control.

#### Download Files

Any files downloaded while testing an application's file download feature will
be stored in the [`downloadsFolder`](/guides/references/configuration#Downloads)
which is set to `cypress/downloads` by default.

```text
/cypress
  /downloads
    - records.csv
```

#### Screenshot Files

If screenshots were taken via the [cy.screenshot()](/api/commands/screenshot)
command or automatically when a test fails, the screenshots are stored in the
[`screenshotsFolder`](/guides/references/configuration#Screenshots) which is set
to `cypress/screenshots` by default.

```text
/cypress
  /screenshots
    /app.cy.js
      - Navigates to main menu (failures).png
```

To learn more about screenshots and settings available, see
[Screenshots and Videos](/guides/guides/screenshots-and-videos#Screenshots)

#### Video Files

Any videos recorded of the run are stored in the
[`videosFolder`](/guides/references/configuration#Videos) which is set to
`cypress/videos` by default.

```text
/cypress
  /videos
    - app.cy.js.mp4
```

#### Asset File Paths

Generated screenshots and videos are saved inside their respective folders
(`cypress/screenshots`, `cypress/videos`). The paths of the generated files will
be stripped of any common ancestor paths shared between all spec files found by
the `specPattern` option (or via the `--spec` command line option or `spec`
module API option, if specified)

**Example 1:**

- Spec file found
  - `cypress/e2e/path/to/file/one.cy.js`
- Common ancester paths (calculated at runtime)
  - `cypress/e2e/path/to/file`
- Generated screenshot file
  - `cypress/screenshots/one.cy.js/your-screenshot.png`
- Generated video file
  - `cypress/videos/one.cy.js.mp4`

**Example 2:**

- Spec files found
  - `cypress/e2e/path/to/file/one.cy.js`
  - `cypress/e2e/path/to/two.cy.js`
- Common ancester paths (calculated at runtime)
  - `cypress/e2e/path/to/`
- Generated screenshot files
  - `cypress/screenshots/file/one.cy.js/your-screenshot.png`
  - `cypress/screenshots/two.cy.js/your-screenshot.png`
- Generated video files
  - `cypress/videos/file/one.cy.js.mp4`
  - `cypress/videos/two.cy.js.mp4`

To learn more about videos and settings available, see
[Screenshots and Videos](/guides/guides/screenshots-and-videos#Screenshots)

### Plugins file

::include{file=partials/warning-plugins-file.md}

The plugins file is a special file that executes in Node before the project is
loaded, before the browser launches, and during your test execution. While the
Cypress tests execute in the browser, the plugins file runs in the background
Node process, giving your tests the ability to access the file system and the
rest of the operating system by calling the [cy.task()](/api/commands/task)
command.

The plugins file is a good place to define how you want to bundle the spec files
via the [preprocessors](/api/plugins/preprocessors-api), how to find and launch
the browsers via the [browser launch API](/api/plugins/browser-launch-api), and
other cool things. Read our [plugins guide](/guides/tooling/plugins-guide) for
more details and examples.

The initial imported plugins file can be
[configured to another file](/guides/references/configuration#Folders-Files).

### Support file

To include code before your test files, set the
[`supportFile`](/guides/references/configuration#Testing-Type-Specific-Options)
path. By default,
[`supportFile`](/guides/references/configuration#Testing-Type-Specific-Options)
is set to look for one of the following files:

**Component:**

- `cypress/support/component.js`
- `cypress/support/component.jsx`
- `cypress/support/component.ts`
- `cypress/support/component.tsx`

**E2E:**

- `cypress/support/e2e.js`
- `cypress/support/e2e.jsx`
- `cypress/support/e2e.ts`
- `cypress/support/e2e.tsx`

<Alert type="danger">

⚠️ For a given testing type, multiple matching `supportFile` files will result
in an error when Cypress loads.

</Alert>

::testing-type-specific-option{option=supportFile}

Cypress automatically creates an example support file for each configured
testing type, which has several commented out examples.

This file runs **before** every single spec file. We do this purely as a
convenience mechanism so you don't have to import this file.

By default Cypress will automatically include type-specific support files. For
E2E, the default is `cypress/support/e2e.{js,jsx,ts,tsx}`, and for Component
Testing `cypress/support/component.{js,jsx,ts,tsx}`.

The support file is a great place to put reusable behavior such as
[custom commands](/api/cypress-api/custom-commands) or global overrides that you
want applied and available to all of your spec files.

The initial imported support file can be configured to another file or turned
off completely using the
[supportFile](/guides/references/configuration#Folders-Files) configuration.
From your support file you can `import` or `require` other files to keep things
organized.

You can define behaviors in a `before` or `beforeEach` within any of the
`cypress/support` files:

```javascript
beforeEach(() => {
  cy.log('I run before every test in every spec file!!!!!!')
})
```

<DocsImage src="/img/guides/core-concepts/v10/global-hooks.png" alt="Global hooks for tests"></DocsImage>

<Alert type="info">

**Note:** This example assumes you are already familiar with Mocha
[hooks](/guides/core-concepts/writing-and-organizing-tests#Hooks).

</Alert>

#### Execution

Cypress executes the support file before the spec file. For example, when
Cypress executes a spec file via `cypress open` or `cypress run`, it executes
the files in the following order:

**e2e example:**

1. `support/e2e.js` (your support file)
2. `e2e/spec-a.cy.js` (your spec file)

**component example:**

1. `support/component.js` (your support file)
2. `components/Button/Button.cy.js` (your spec file)

### Troubleshooting

If Cypress does not find the spec files for some reason, you can troubleshoot
its logic by opening or running Cypress with
[debug logs](/guides/references/troubleshooting#Print-DEBUG-logs) enabled:

```shell
DEBUG=cypress:server:specs npx cypress open
## or
DEBUG=cypress:server:specs npx cypress run
```

## Writing tests

Cypress is built on top of [Mocha](/guides/references/bundled-libraries#Mocha)
and [Chai](/guides/references/bundled-libraries#Chai). We support both Chai's
`BDD` and `TDD` assertion styles. Tests you write in Cypress will mostly adhere
to this style.

If you're familiar with writing tests in JavaScript, then writing tests in
Cypress will be a breeze.

<Alert type="info">

To start writing tests for your app, follow our guides for writing your first
[Component](/guides/component-testing/writing-your-first-component-test) or
[End-to-End](/guides/end-to-end-testing/writing-your-first-end-to-end-test)
test.

</Alert>

### Test Structure

The test interface, borrowed from
[Mocha](/guides/references/bundled-libraries#Mocha), provides `describe()`,
`context()`, `it()` and `specify()`.

`context()` is identical to `describe()` and `specify()` is identical to `it()`,
so choose whatever terminology works best for you.

```javascript
// -- Start: Our Application Code --
function add(a, b) {
  return a + b
}

function subtract(a, b) {
  return a - b
}

function divide(a, b) {
  return a / b
}

function multiply(a, b) {
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

### Hooks

Cypress also provides hooks (borrowed from
[Mocha](/guides/references/bundled-libraries#Mocha)).

These are helpful to set conditions that you want to run before a set of tests
or before each test. They're also helpful to clean up conditions after a set of
tests or after each test.

```javascript
before(() => {
  // root-level hook
  // runs once before all tests
})

beforeEach(() => {
  // root-level hook
  // runs before every test block
})

afterEach(() => {
  // runs after each test block
})

after(() => {
  // runs once all tests are done
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

#### The order of hook and test execution is as follows:

- All `before()` hooks run (once)
- Any `beforeEach()` hooks run
- Tests run
- Any `afterEach()` hooks run
- All `after()` hooks run (once)

<Alert type="danger">

<Icon name="exclamation-triangle"></Icon> Before writing `after()` or
`afterEach()` hooks, please see our
[thoughts on the anti-pattern of cleaning up state with `after()` or `afterEach()`](/guides/references/best-practices#Using-after-or-afterEach-hooks).

</Alert>

### Excluding and Including Tests

To run a specified suite or test, append `.only` to the function. All nested
suites will also be executed. This gives us the ability to run one test at a
time and is the recommended way to write a test suite.

```javascript
// -- Start: Our Application Code --
function fizzbuzz(num) {
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
  function numsExpectedToEq(arr, expected) {
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

To skip a specified suite or test, append `.skip()` to the function. All nested
suites will also be skipped.

```javascript
it.skip('returns "fizz" when number is multiple of 3', () => {
  numsExpectedToEq([9, 12, 18], 'fizz')
})
```

### Test Isolation

<Alert type="success">

<Icon name="check-circle" color="green"></Icon> **Best Practice:** Clean up
state **before** tests run.

</Alert>

Test isolation is the practice of resetting application state _before_ each
test.

Cleaning up state ensures that the operation of one test does not affect another
test later on. The goal for each test should be to reliably pass whether run in
isolation or consecutively with other tests. Having tests that depend on the
state of an earlier test can potentially cause nondeterministic test failures.

Cypress supports two modes of test isolation, `legacy` and `strict`.

#### Legacy Mode

When in `legacy` mode, Cypress handles resetting the state for:

- [aliases](/api/commands/as)
- [cookies](/api/commands/clearcookies)
- [clock](/api/commands/clock)
- [intercepts](/api/commands/intercepts)
- [localStorage](/api/commands/clearlocalstorage)
- [routes](/api/commands/route)
- [sessions](/api/commands/session)
- [spies](/api/commands/spy)
- [stubs](/api/commands/stub)
- [viewport](/api/commands/viewport)

#### Strict Mode

<Alert type="warning">

<strong class="alert-header"><Icon name="exclamation-triangle"></Icon>
Experimental</strong>

`strict` mode is currently experimental and can be enabled by setting
the [`experimentalSessionAndOrigin`](/guides/references/experiments) flag
to `true` in the Cypress config. This is the default test isolation behavior
when using the `experimentalSessionAndOrigin` experiment.

</Alert>

When in `strict` mode, Cypress handles resetting the state for everything
outlined above for `legacy` mode, in addition to clearing the page by visiting
`about:blank` before each test. This clears the dom's state and non-persistent
browser state. This forces you to re-visit your application and perform the
series of interactions needed to build the dom and browser state so the tests
can reliably pass when run standalone or in a randomized order.

The test isolation mode is a global configuration and can be overridden at the
`describe` level with the
[`testIsolation`](./guides/references/configuration#global) option.

### Test Configuration

It is possible to apply
[test configuration](/guides/references/configuration#Test-Configuration) values
to a suite or test. Pass a configuration object to the test or suite function as
the second argument.

This configuration will take effect during the suite or tests where they are set
then return to their previous default values after the suite or tests are
complete.

#### Syntax

```javascript
describe(name, config, fn)
context(name, config, fn)
it(name, config, fn)
specify(name, config, fn)
```

#### Allowed config values

<Icon name="exclamation-triangle" color="red"></Icon> **Note:** Some
configuration values are readonly and cannot be changed via test configuration.
Be sure to review the list of
[test configuration options](/guides/references/configuration##Test-Configuration).

#### Suite configuration

If you want to target a suite of tests to run or be excluded when run in a
specific browser, you can override the `browser` configuration within the suite
configuration. The `browser` option accepts the same arguments as
[Cypress.isBrowser()](/api/cypress-api/isbrowser).

The following suite of tests will be skipped if running tests in Chrome
browsers.

```js
describe('When NOT in Chrome', { browser: '!chrome' }, () => {
  it('Shows warning', () => {
    cy.get('[data-testid="browser-warning"]').should(
      'contain',
      'For optimal viewing, use Chrome browser'
    )
  })

  it('Links to browser compatibility doc', () => {
    cy.get('a.browser-compat')
      .should('have.attr', 'href')
      .and('include', 'browser-compatibility')
  })
})
```

The following suite of tests will only execute when running in the Firefox
browser. It will overwrite the viewport resolution in one of the tests, and will
merge any current environment variables with the provided ones.

```js
describe(
  'When in Firefox',
  {
    browser: 'firefox',
    viewportWidth: 1024,
    viewportHeight: 700,
    env: {
      DEMO: true,
      API: 'http://localhost:9000',
    },
  },
  () => {
    it('Sets the expected viewport and API URL', () => {
      expect(cy.config('viewportWidth')).to.equal(1024)
      expect(cy.config('viewportHeight')).to.equal(700)
      expect(cy.env('API')).to.equal('http://localhost:9000')
    })

    it(
      'Uses the closest API environment variable',
      {
        env: {
          API: 'http://localhost:3003',
        },
      },
      () => {
        expect(cy.env('API')).to.equal('http://localhost:3003')
        // other environment variables remain unchanged
        expect(cy.env('DEMO')).to.be.true
      }
    )
  }
)
```

#### Single test configuration

You can configure the number of retry attempts during `cypress run` or
`cypress open`. See [Test Retries](/guides/guides/test-retries) for more
information.

```js
it('should redirect unauthenticated user to sign-in page', {
    retries: {
      runMode: 3,
      openMode: 2
    }
  } () => {
    // test code...
  })
})
```

### Dynamically Generate Tests

You can dynamically generate tests using JavaScript.

```javascript
describe('if your app uses jQuery', () => {
  ;['mouseover', 'mouseout', 'mouseenter', 'mouseleave'].forEach((event) => {
    it('triggers event: ' + event, () => {
      // if your app uses jQuery, then we can trigger a jQuery
      // event that causes the event callback to fire
      cy.get('#with-jquery')
        .invoke('trigger', event)
        .get('[data-testid="messages"]')
        .should('contain', 'the event ' + event + 'was fired')
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

### Assertion Styles

Cypress supports both BDD (`expect`/`should`) and TDD (`assert`) style plain
assertions. [Read more about plain assertions.](/guides/references/assertions)

```javascript
it('can add numbers', () => {
  expect(add(1, 2)).to.eq(3)
})

it('can subtract numbers', () => {
  assert.equal(subtract(5, 12), -7, 'these numbers are equal')
})
```

The [.should()](/api/commands/should) command and its alias
[.and()](/api/commands/and) can also be used to more easily chain assertions off
of Cypress commands.
[Read more about assertions.](/guides/core-concepts/introduction-to-cypress#Assertions)

```js
cy.wrap(add(1, 2)).should('equal', 3)
```

## Running tests

You can run a test by clicking on the spec filename. For example the
[Cypress RealWorld App](https://github.com/cypress-io/cypress-example-realworld)
has multiple test files, but below we run the "new-transaction.spec.ts" test
file by clicking on it.

<DocsImage src="/img/guides/core-concepts/v10/run-single-spec.gif" alt="Running a single spec"></DocsImage>

## Test statuses

After the Cypress spec completes every test has one of 4 statuses: **passed**,
**failed**, **pending**, or **skipped**.

### Passed

Passed tests have successfully completed all their commands without failing any
assertions. The test screenshot below shows a passed test:

<DocsImage src="/img/guides/core-concepts/v10/todo-mvc-passing-test.png" alt="Cypress with a single passed test"></DocsImage>

Note that a test can pass after several
[test retries](/guides/guides/test-retries). In that case the Command Log shows
some failed attempts, but ultimately the entire test finishes successfully.

### Failed

Good news - the failed test has found a problem. Could be much worse - it could
be a user hitting this bug!

<DocsImage src="/img/guides/core-concepts/v10/todo-mvc-failing-test.png" alt="Cypress with a single failed test"></DocsImage>

After a test fails, the screenshots and videos can help find the problem so it
can be fixed.

### Pending

You can write _placeholder_ tests in several ways as shown below, and Cypress
knows NOT to run them. Cypress marks all the tests below as _pending_.

```js
describe('TodoMVC', () => {
  it('is not written yet')

  it.skip('adds 2 todos', function () {
    cy.visit('/')
    cy.get('[data-testid="new-todo"]')
      .type('learn testing{enter}')
      .type('be cool{enter}')
    cy.get('[data-testid="todo-list"] li').should('have.length', 100)
  })

  xit('another test', () => {
    expect(false).to.true
  })
})
```

All 3 tests above are marked _pending_ when Cypress finishes running the spec
file.

<DocsImage src="/img/guides/core-concepts/v10/todo-mvc-pending-tests.png" alt="Cypress with three pending test"></DocsImage>

So remember - if you (the test writer) knowingly skip a test using one of the
above three ways, Cypress counts it as a _pending_ test.

### Skipped

The last test status is for tests that you _meant_ to run, but these tests were
skipped due to some run-time error. For example, imagine a group of tests
sharing the same `beforeEach` hook - where you visit the page in the
`beforeEach` hook.

```js
/// <reference types="cypress" />

describe('TodoMVC', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('hides footer initially', () => {
    cy.get('[data-testid="filters"]').should('not.exist')
  })

  it('adds 2 todos', () => {
    cy.get('[data-testid="new-todo"]')
      .type('learn testing{enter}')
      .type('be cool{enter}')
    cy.get('[data-testid="todo-list"] li').should('have.length', 2)
  })
})
```

If the `beforeEach` hook completes and both tests finish, two tests are passing.

<DocsImage src="/img/guides/core-concepts/v10/todo-mvc-2-tests-passing.png" alt="Cypress showing two passing tests"></DocsImage>

But what happens if a command inside the `beforeEach` hook fails? For example,
let's pretend we want to visit a non-existent page `/does-not-exist` instead of
the `/`. If we change our `beforeEach` to fail:

```js
beforeEach(() => {
  cy.visit('/does-not-exist')
})
```

When Cypress starts executing the first test, the `beforeEach` hook fails. Now
the first test is marked as **failed**. BUT if the `beforeEach` hook failed
once, why would we execute it _again_ before the second test? It would just fail
the same way! So Cypress _skips_ the remaining tests in that block, because they
would also fail due to the `beforeEach` hook failure.

<DocsImage src="/img/guides/core-concepts/v10/todo-mvc-failed-and-skipped-tests.png" alt="Cypress showing one failed and one skipped test"></DocsImage>

If we collapse the test commands, we can see the empty box marking the skipped
test "adds 2 todos".

<DocsImage src="/img/guides/core-concepts/v10/todo-mvc-skipped-test.png" alt="Cypress showing one skipped test"></DocsImage>

The tests that were meant to be executed but were skipped due to some run-time
problem are marked "skipped" by Cypress.

**Tip:** read the blog post
[Cypress Test Statuses](https://glebbahmutov.com/blog/cypress-test-statuses/)
for more examples explaining the reasoning behind these test statuses. Read the
blog post
[Writing Test Progress](https://glebbahmutov.com/blog/writing-tests-progress/)
to learn how to use the pending tests to tracking the test strategy
implementation.

## Watching tests

When running in using [cypress open](/guides/guides/command-line#cypress-open),
Cypress watches the filesystem for changes to your spec files. Soon after adding
or updating a test Cypress will reload it and run all of the tests in that spec
file.

This makes for a productive development experience because you can add and edit
tests as you're implementing a feature and the Cypress user interface will
always reflect the results of your latest edits.

<Alert type="info">

Remember to use
[`.only`](/guides/core-concepts/writing-and-organizing-tests#Excluding-and-Including-Tests)
to limit which tests are run: this can be especially useful when you've got a
lot of tests in a single spec file that you're constantly editing; consider also
splitting your tests into smaller files each dealing with logically related
behavior.

</Alert>

### What is watched?

#### Files

- [Cypress configuration](/guides/references/configuration)
- [cypress.env.json](/guides/guides/environment-variables)

#### Folders

- E2E directory (`cypress/e2e/` by default)
- Support directory (`cypress/support/` by default)

The folder, the files within the folder, and all child folders and their files
(recursively) are watched.

<Alert type="info">

Those folder paths refer to the
[default folder paths](/guides/references/configuration#Folders-Files). If
you've configured Cypress to use different folder paths then the folders
specific to your configuration will be watched.

</Alert>

### What isn't watched?

Everything else; this includes, but isn't limited to, the following:

- Your application code
- `node_modules`
- `cypress/fixtures/`

If you're developing using a modern JS-based web application stack then you've
likely got support for some form of hot module replacement which is responsible
for watching your application code&mdash;HTML, CSS, JS, etc.&mdash;and
transparently reloading your application in response to changes.

### Configuration

Set the [`watchForFileChanges`](/guides/references/configuration#Global)
configuration property to `false` to disable file watching.

<Alert type="warning">

**Nothing** is watched during
[cypress run](/guides/guides/command-line#cypress-run).

The `watchForFileChanges` property is only in effect when running Cypress using
[cypress open](/guides/guides/command-line#cypress-open).

</Alert>

The component responsible for the file-watching behavior in Cypress is the
[`webpack-preprocessor`](https://github.com/cypress-io/cypress/tree/master/npm/webpack-preprocessor).
This is the default file-watcher packaged with Cypress.

If you need further control of the file-watching behavior you can configure this
preprocessor explicitly: it exposes options that allow you to configure behavior
such as _what_ is watched and the delay before emitting an "update" event after
a change.

Cypress also ships other [file-watching preprocessors](/plugins/directory);
you'll have to configure these explicitly if you want to use them.

- [Cypress Watch Preprocessor](https://github.com/cypress-io/cypress-watch-preprocessor)
- [Cypress webpack Preprocessor](https://github.com/cypress-io/cypress/tree/master/npm/webpack-preprocessor)
