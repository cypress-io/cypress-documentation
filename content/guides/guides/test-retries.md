---
title: Test Retries
---

<Alert type="info">

## <Icon name="graduation-cap"></Icon> What you'll learn

- What are test retries?
- Why are test retries important?
- How to configure test retries

</Alert>

## Introduction

End-to-end (E2E) tests excel at testing complex systems. However, there are
still behaviors that are hard to verify and make tests flaky (i.e., unreliable)
and fail sometimes due to unpredictable conditions (eg., temporary outages in
external dependencies, random network errors, etc.). Some other common race
conditions that could result in unreliable tests include:

- Animations
- API calls
- Test server / database availability
- Resource dependencies availability
- Network issues

With test retries, Cypress is able to retry failed tests to help reduce test
flakiness and continuous integration (CI) build failures. By doing so, this will
save your team valuable time and resources so you can focus on what matters most
to you.

## How It Works

By default, tests will not retry when they fail. You will need to
[enable test retries in your configuration](#Configure-Test-Retries) to use this
feature.

Once test retries are enabled, tests can be configured to have X number of retry
attempts. For example, if test retries has been configured with `2` retry
attempts, Cypress will retry tests up to 2 additional times (for a total of 3
attempts) before potentially being marked as a failed test.

When each test is run again, the following
[hooks](/guides/core-concepts/writing-and-organizing-tests#Hooks) will be re-run
also:

- `beforeEach`
- `afterEach`

<Alert type="warning">

However, failures in `before` and `after` hooks will not trigger a retry.

</Alert>

**The following is a detailed step-by-step example of how test retries works:**

Assuming we have configured test retries with `2` retry attempts (for a total of
3 attempts), here is how the tests might run:

1. A test runs for the first time. If the
   <Icon name="check-circle" color="green"></Icon> test passes, Cypress will
   move forward with any remaining tests as usual.

2. If the <Icon name="times" color="red"></Icon> test fails, Cypress will tell
   you that the first attempt failed and will attempt to run the test a second
   time.

<DocsImage src="/img/guides/test-retries/v10/attempt-2-start.png"></DocsImage>

3. If the <Icon name="check-circle" color="green"></Icon> test passes after the
   second attempt, Cypress will continue with any remaining tests.

4. If the <Icon name="times" color="red"></Icon> test fails a second time,
   Cypress will make the final third attempt to re-run the test.

<DocsImage src="/img/guides/test-retries/v10/attempt-3-start.png"></DocsImage>

5. If the <Icon name="times" color="red"></Icon> test fails a third time,
   Cypress will mark the test as failed and then move on to run any remaining
   tests.

<DocsImage src="/img/guides/test-retries/v10/attempt-3-fail.png"></DocsImage>

The following is a screen capture of what test retries looks like on the same
failed test when run via [cypress run](/guides/guides/command-line#cypress-run).

<DocsImage src="/img/guides/test-retries/cli-error-message.png"></DocsImage>

During [cypress open](/guides/guides/command-line#cypress-open) you will be able
to see the number of attempts made in the
[Command Log](/guides/core-concepts/cypress-app#Command-Log) and expand each
attempt for review and debugging if desired.

## Configure Test Retries

### Global Configuration

Typically you will want to define different retry attempts for `cypress run`
versus `cypress open`. You can configure this in the
[Cypress configuration](/guides/guides/command-line#cypress-open-config-file-lt-configuration-file-gt)
by passing the `retries` option an object with the following options:

- `runMode` allows you to define the number of test retries when running
  `cypress run`
- `openMode` allows you to define the number of test retries when running
  `cypress open`

```jsx
{
  "retries": {
    // Configure retry attempts for `cypress run`
    // Default is 0
    "runMode": 2,
    // Configure retry attempts for `cypress open`
    // Default is 0
    "openMode": 0
  }
}
```

#### Configure retry attempts for all modes

If you want to configure the retry attempts for all tests run in both
`cypress run` and `cypress open`, you can configure this in the
[Cypress configuration](/guides/guides/command-line#cypress-open-config-file-lt-configuration-file-gt)
by defining the `retries` property and setting the desired number of retries.

```jsx
{
  "retries": 1
}
```

### Custom Configurations

#### Individual Test(s)

If you want to configure retry attempts on a specific test, you can set this by
using the
[test's configuration](/guides/core-concepts/writing-and-organizing-tests#Test-Configuration).

```jsx
// Customize retry attempts for an individual test
describe('User sign-up and login', () => {
  // `it` test block with no custom configuration
  it('should redirect unauthenticated user to sign-in page', () => {
    // ...
  })

  // `it` test block with custom configuration
  it(
    'allows user to login',
    {
      retries: {
        runMode: 2,
        openMode: 1,
      },
    },
    () => {
      // ...
    }
  )
})
```

#### Test Suite(s)

If you want to configure try attempts for a suite of tests, you can do this by
setting the suite's configuration.

```jsx
// Customizing retry attempts for a suite of tests
describe('User bank accounts', {
  retries: {
    runMode: 2,
    openMode: 1,
  }
}, () => {
  // The per-suite configuration is applied to each test
  // If a test fails, it will be retried
  it('allows a user to view their transactions', () => {
    // ...
  }

  it('allows a user to edit their transactions', () => {
    // ...
  }
})
```

You can find more information about custom configurations here:
[Test Configuration](/guides/references/configuration#Test-Configuration)

## Screenshots

When a test retries, Cypress will continue to take screenshots for each failed
attempt or [cy.screenshot()](/api/commands/screenshot) and suffix each new
screenshot with `(attempt n)`, corresponding to the current retry attempt
number.

With the following test code, you would see the below screenshot filenames when
all 3 attempts fail:

<e2e-or-ct>
<template #e2e>

```js
describe('User Login', () => {
  it('displays login errors', () => {
    cy.visit('/')
    cy.screenshot('user-login-errors')
    // ...
  })
})
```

</template>
<template #ct>

```js
describe('User Login', () => {
  it('displays login errors', () => {
    cy.mount(<Login />)
    cy.screenshot('user-login-errors')
    // ...
  })
})
```

</template>
</e2e-or-ct>

```js
// screenshot filename from cy.screenshot() on 1st attempt
'user-login-errors.png'
// screenshot filename on 1st failed attempt
'user-login-errors (failed).png'
// screenshot filename from cy.screenshot() on 2nd attempt
'user-login-errors (attempt 2).png'
// screenshot filename on 2nd failed attempt
'user-login-errors (failed) (attempt 2).png'
// screenshot filename from cy.screenshot() on 3rd attempt
'user-login-errors (attempt 3).png'
// screenshot filename on 3rd failed attempt
'user-login-errors (failed) (attempt 3).png'
```

## Videos

You can use Cypress's [`after:spec`](/api/plugins/after-spec-api) event listener
that fires after each spec file is run to delete the recorded video for specs
that had no retry attempts or failures. Deleting passing and non-retried videos
after the run can save resource space on the machine as well as skip the time
used to process, compress, and upload the video to [Cypress Cloud](/guides/cloud/introduction).

### Only upload videos for specs with failing or retried tests

The example below shows how to delete the recorded video for specs that had no
retry attempts or failures when using Cypress test retries.

:::cypress-plugin-example

```js
// need to install these dependencies
// npm i lodash del --save-dev
const _ = require('lodash')
const del = require('del')
```

```js
on('after:spec', (spec, results) => {
  if (results && results.video) {
    // Do we have failures for any retry attempts?
    const failures = _.some(results.tests, (test) => {
      return _.some(test.attempts, { state: 'failed' })
    })
    if (!failures) {
      // delete the video if the spec passed and no tests retried
      return del(results.video)
    }
  }
})
```

:::

## Cypress Cloud

If you are using [Cypress Cloud](/guides/cloud/introduction),
information related to test retries is displayed on the Test Results tab for a
run. Selecting the Flaky filter will show tests that retried and then passed
during the run.

These tests are also indicated with a "Flaky" badge on the Latest Runs page and
Test Results tab on the Run Details page.

<DocsVideo src="/img/guides/test-retries/flaky-test-filter.mp4" title="Flaky test filter"></DocsVideo>

Clicking on a Test Result will open the Test Case History screen. This
demonstrates the number of failed attempts, the screenshots and/or videos of
failed attempts, and the error for failed attempts.

<DocsImage src="/img/guides/test-retries/flake-artifacts-and-errors.png" alt="Flake artifacts and errors"></DocsImage>

You can also see the Flaky Rate for a given test.

<DocsImage src="/img/guides/test-retries/flaky-rate.png" alt="Flaky rate"></DocsImage>

For a comprehensive view of how flake is affecting your overall test suite, you
can review the
[Flake Detection](/guides/cloud/flaky-test-management#Flake-Detection) and
[Flake Alerting](/guides/cloud/flaky-test-management#Flake-Alerting)
features highlighted in the Test Flake Management Guide.

## Frequently Asked Questions (FAQs)

### Will retried tests be counted as more than one test result in my billing?

No. Tests recorded during `cypress run` with the `--record` flag will be counted
the same with or without test retries.

We consider each time the `it()` function is called to be a single test for
billing purposes. The test retrying will not count as extra test results in your
billing.

You can always see how many tests you've recorded from your organization's
Billing & Usage page within [Cypress Cloud](https://on.cypress.io/cloud).

### Can I access the current attempt counter from the test?

Yes, although ordinarily you would not have to, since this is a low-level
detail. But if you want to use the current attempt number and the total allowed
attempts you could do the following:

```javascript
it('does something differently on retry', { retries: 3 }, () => {
  // cy.state('runnable') returns the current test object
  // we can grab the current attempt and
  // the total allowed attempts from its properties
  const attempt = cy.state('runnable')._currentRetry
  const retries = cy.state('runnable')._retries
  // use the "attempt" and "retries" values somehow
})
```

The above `attempt` variable will have values 0 through 3 (the first default
test execution plus three allowed retries). The `retries` constant in this case
is always 3.

**Tip:** Cypress [bundles Lodash](/api/utilities/_) library. Use its helper
methods to safely access a property of an object. Let's make sure the function
supports different Cypress versions by falling back to the default values.

```javascript
it('does something differently on retry', { retries: 3 }, () => {
  // _.get: if the object or property is missing use the provided default value
  const attempt = Cypress._.get(cy.state('runnable'), '_currentRetry', 0)
  const retries = Cypress._.get(cy.state('runnable'), '_retries', 0)
  // use the "attempt" and "retries" values somehow
})
```
