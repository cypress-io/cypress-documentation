---
title: Test Retries
---

{% note info %}
# {% fa fa-graduation-cap %} What you'll learn

- What are test retries?
- Why is test retries important?
- How to configure test retries
{% endnote %}

## Introduction

A scenario that often comes up when running end-to-end (E2E) tests is that tests may be unintentionally flaky (i.e., unreliable) and fail intermittently. For example, because E2E tests often involves multiple integrations, it is not uncommon to have services that have intermittent outages. Some other common race conditions that could result in unreliable tests include:

- Animations
- API calls
- Test server / database availability
- Resource dependencies availability
- Network issues

Just like an average user, if they run into an error when loading your application, you would want them to refresh and try again before submitting a bug report. However, without test retries, this often resulted in random failed tests and broken continuous integration (CI) build fails which are a waste of resources. As a result, rather than fail the entire test run, Cypress 5.0 introduces native test retries.

## How It Works

By default, tests being run in `cypress run` mode will automatically be retried up to two additional times (for a total of three attempts) before being marked as a failed test. When each test is run again, the following lifecycle hooks will be re-run on each attempt:

- `before`
- `beforeEach`
- `afterEach`
- `after`

The following is a detailed step-by-step example of how test retries will work by default:

1. A test runs for the first time. If it passes, Cypress will move forward with any remaining tests as expected.

    🖼 Insert screenshot

2. If the test fails, it will inform users that the first attempt failed and it will attempt to run the test a second time.

    🖼 Insert screenshot

3. If the test succeed after the second try, Cypress will continue with any remaining tests.

    🖼 Insert screenshot

4. If it fails a second time, it will make the final third attempt to re-run the test

    🖼 Insert screenshot

5. If it fails a third time, Cypress will make the test as failed and then proceed with any remaining tests.

    🖼 Insert screenshot

The following is a screen capture of what test retries looks like on a failed test.

    🖼 Insert screenshot

In addition, you will be able to see the number of attempts made in the Command Log and expand each attempt for further inspection and debugging if desired.

    🖼 Insert screenshot

## Configuring Test Retries

Starting with Cypress 5.0, if any tests fail, they will be automatically:

- Retried up to two times (for a total of three attempts) in `cypress run` mode
- Run normally with no retries in `cypress open` mode

The reason for this distinction is to avoid adding unnecessary 

 retried up to two times (for a total of three attempts) in  with no additional configuration needed. When developing locally with Cypress' Open Mode, test retries is disabled by default to prevent blocking developers with unnecessary retries.

If you need more information on how to migrate to 5.x, please see our official migration guide here.

### Global Configuration

If you need to change the number of attempts being made across your entire test suite for both `cypress run` and `cypress open`, you can configure this in your `cypress.json` by defining the `retries` property and giving it the desired number.

```jsx
{
  "retries": 1
}
```

However, in the event you need to define unique retry attempts for the different modes of Cypress, you can pass the `retries` option an object with the following options:

- `runMode` allows you to define the number of test retries when running `cypress run`
- `openMode` allows you to define the number of test retries when running `cypress open`

```jsx
{
  "retries": {
    // Configure retries for `cypress run` 
    // Default is 2
    "runMode": 1,
    // Configure retries for `cypress open`
    // Default is 0
    "openMode": 3
  }
}
```

### Custom Configurations

#### Individual Test(s)

In the event a specific test requires a custom number of test retries configured, this can be achieved by using the test's local configuration option.

```jsx
// Customizing retries for an individual test
describe('User sign-up and login', () => {
  // `it` test block with no custom configuration
  it('should redirect unauthenticated user to sign-in page', () => {
    ...
  })

  // `it` test block with custom configuration
  it('allows user to login', { 
    retries: {
      runMode: 3,
      openMode: 2
    }
  }, () => {
    ...
  })
})

```

#### Test Suite(s)

If you want a suite of tests to re-run in requires a custom number of test retries configured, this can be achieved by using the test's local configuration option

```jsx
// Customizing retries for a suite of tests
describe('User bank accounts', {
  retries: {
    runMode: 3,
    openMode: 1,
  }
}, () => {
  // Individual tests will be run normally
  it('allows a user to view their transactions, () => {
    ...
  }

  it('allows a user to edit their transactions, () => {
    ...
  }
})

```

You can find more information about custom configurations here: {% url "Test Configuration" configuration#Test-Configuration %}

## Assets

With test retries, Cypress will now generate any assets (i.e., screenshots, video recordings, etc.) per each test attempt. The assets will be properly labeled with the attempt number appended at the end of each asset.

    🖼 Insert screenshot

## Tips and Strategies

While test retries are great for helping to avoid false negatives from failing an entire test run, it is not a good replacement for writing good tests. As a result, here are some tips and strategies to keep in mind in order to maximize the effectiveness of your tests with test retries:

- If you are noticing that you need to increase the number of retries, this cause is more likely due to how the tests are written and is worth spending the time to investigate
- If you use `Run all specs` a lot in `cypress open` mode, make sure to configure your Cypress instance to have a global `retries` of `2` so you can simulate what is being run in `cypress run` mode.

## Frequently Asked Questions (FAQs)

#### Will runs with test retries be counted as more than one run?

No. When recording to the Cypress Dashboard, runs with test retries will be counted as a single run.


{% note warning 'Firefox Garbage Collection' %}
Cypress triggers Firefox's internal garbage collection (GC) to better manage the browser's memory consumption. {% url "Learn more here" configuration#firefoxGcInterval %}.
{% endnote %}

Excluding {% url "Electron" launching-browsers#Electron-Browser %}, any browser you want to run Cypress tests in needs to be installed on your local system or CI environment. A full list of detected browsers is displayed within the browser selection menu of the {% url "Test Runner" test-runner %}.

{% imgTag /img/guides/cross-browser-testing/cypress-browser-selector.png "Cypress Test Runner with Firefox selected as the browser" "no-border" %}

