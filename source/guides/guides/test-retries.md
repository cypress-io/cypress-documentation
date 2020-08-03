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

End-to-end (E2E) tests excel at testing complex systems. However, there are still behaviors that are difficult to verify and make tests unintentionally flaky (i.e., unreliable) and fail intermittently due to unpredictable conditions (eg., temporary outages in external dependencies, random network errors, etc.)  Some other common race conditions that could result in unreliable tests include:

- Animations
- API calls
- Test server / database availability
- Resource dependencies availability
- Network issues

With the new test retries feature, Cypress will be able to retry failed tests to help reduce test flakiness and continuous integration (CI) build failures. By doing so, this will save your team valuable time and resources so you can focus on what matters most to you.

## How It Works

By default, tests will have test retries disabled. 

However, when test retries is configured, tests will automatically be retried up to X additional times based on the desired configuration. For example, if test retries are enabled with a value of `2`, it will retry tests up to 2 additional times (for a total of 3 attempts) before being marked as a failed test.


When each test is run again, the following {% url "hooks" writing-and-organizing-tests#Hooks %} will be re-run on each attempt:

- `beforeEach`
- `afterEach`

{% note warning %}
However, `before` and `after` hooks will not be re-run in retries.
{% endnote %}

The following is a detailed step-by-step example of how test retries will work:

1. A test runs for the first time. If the test passes, Cypress will move forward with any remaining tests as expected.

2. If the test fails, Cypress will inform you that the first attempt failed and will attempt to run the test a second time.

{% img /img/guides/test-retries/attempt-2-start.png %}

3. If the test passes after the second try, Cypress will continue with any remaining tests.

4. If it fails a second time, it will make the final third attempt to re-run the test.

{% img /img/guides/test-retries/attempt-3-start.png %}

5. If the test fails a third time, Cypress will mark the test as failed and then proceed with any remaining tests.

{% img /img/guides/test-retries/attempt-3-fail.png %}

The following is a screen capture of what test retries looks like on the same failed test when running `cypress run`.

{% img /img/guides/test-retries/cli-error-message.png %}

In addition, you will be able to see the number of attempts made in the Command Log and expand each attempt for further inspection and debugging if desired.

{% video local /img/guides/test-retries/attempt-expand-collapse-time-travel.mp4 %}

## Configuring Test Retries

### Global Configuration

If you want to change the number of attempts being made across your entire test suite for both `cypress run` and `cypress open`, you can configure this in your {% url "configuration file" command-line#cypress-open-config-file-lt-config-file-gt %} (`cypress.json` by default) by defining the `retries` property and giving it the desired number.

```jsx
{
  "retries": 1
}
```

#### Disable Test Retries

If you would like to disable test retries, you can use the global configuration to do so by setting it to 0.

```jsx
{
  "retries": 0
}
```

#### Configuring Specific Retries for Different Modes

However, in the event you need to define unique retry attempts for the different modes of Cypress, you can pass the `retries` option an object with the following options:

- `runMode` allows you to define the number of test retries when running `cypress run`
- `openMode` allows you to define the number of test retries when running `cypress open`

```jsx
{
  "retries": {
    // Configure retries for `cypress run` 
    // Default is 0
    "runMode": 2,
    // Configure retries for `cypress open`
    // Default is 0
    "openMode": 1
  }
}
```

### Custom Configurations

#### Individual Test(s)

In the event a specific test requires a custom number of test retries configured, this can be achieved by using the test's configuration option.

```jsx
// Customizing retries for an individual test
describe('User sign-up and login', () => {
  // `it` test block with no custom configuration
  it('should redirect unauthenticated user to sign-in page', () => {
    // ...
  })

  // `it` test block with custom configuration
  it('allows user to login', {
    retries: {
      runMode: 2,
      openMode: 1
    }
  }, () => {
    // ...
  })
})
```

#### Test Suite(s)

If you want a suite of tests to re-run a custom number of times, this can be achieved by using the suite's configuration option.

```jsx
// Customizing retries for a suite of tests
describe('User bank accounts', {
  retries: {
    runMode: 2,
    openMode: 1,
  }
}, () => {
  // Individual tests will be run normally
  it('allows a user to view their transactions, () => {
    // ...
  }

  it('allows a user to edit their transactions, () => {
    // ...
  }
})

```

You can find more information about custom configurations here: {% url "Test Configuration" configuration#Test-Configuration %}

## Screenshots and Videos

With test retries, Cypress will now generate any screenshots and videos per each test attempt. These will be properly labeled with the attempt number appended at the end of each filename.

```js
// Example file names
'User Sign-up and Login -- should display login errors.png'
'User Sign-up and Login -- should display login errors (failed).png'
'User Sign-up and Login -- should display login errors (attempt 2).png'
'User Sign-up and Login -- should display login errors (failed) (attempt 2).png'
'User Sign-up and Login -- should display login errors (attempt 3).png'
'User Sign-up and Login -- should display login errors (failed) (attempt 3).png'
```

## Dashboard

If you are using {% url "Cypress Dashboard" dashboard %}, test retries will not change your current experience at this time. However, if you are interested in future enhancements coming to the Dashboard experience, be sure to check out our {% url "product roadmap" https://cypress-io.productboard.com/roadmap/1238172-product-roadmap %}.

## Tips and Strategies

While test retries are great for helping to avoid false negatives from failing an entire test run, it is not a good replacement for writing good tests. As a result, here are some tips and strategies to keep in mind in order to maximize the effectiveness of your tests with test retries:

- If you are noticing that you need to increase the number of retries, the cause is more likely due to how the tests are written and is worth spending the time to investigate.

## Frequently Asked Questions (FAQs)

### Will retried tests be counted as more than one test recording in my billing?

No. Tests recorded during `cypress run` with the `--record` flag will be counted the same with or without test retries.

We consider each time the `it()` function is called to be a single test for billing purposes. The test retrying will not count as extra test recordings in your billing.

You can always see how many tests you’ve recorded from your organization’s Billing & Usage page within the {% url "Dashboard" https://on.cypress.io/dashboard %}.
