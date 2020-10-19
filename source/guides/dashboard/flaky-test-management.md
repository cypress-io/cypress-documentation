---
title: Flaky Test Management
---

By enabling {% url "test retries" test-retries %}, the Cypress Dashboard can detect, flag, and track flaky tests from your recorded Cypress test runs in your CI/CD pipeline.

{% note info "What is a flaky test?"%}
A test is considered to be **flaky** when it can pass and fail across multiple runs without any code changes.

For example, a test is executed and fails, then the test is executed again, without any change to the code, but this time it passes.
{% endnote %}

{% note info "What are test retries?"%}
Cypress has the ability to automatically retry failed tests to mitigate flaky tests from failing entire test runs or CI builds.

Test retries is **disabled by default**, and you can {% url "enable it within your Cypress configuration" test-retries#Configure-Test-Retries %}.
{% endnote %}

## Flake Detection

One way to battle flaky tests is to detect and monitor them as they occur in an organized and methodical manner such that you can assess their severity to assist with prioritizing their fix.

{% note warning "Test Retries & Flak Detection"%}
Test retries is the *fundamental mechanism* that enables the detection of flaky tests by the Cypress Dashboard. Therefore, **enabling {% url "test retries" test-retries#Configure-Test-Retries %} is required** to take advantage of any flaky test management feature provided by the Cypress Dashboard.
{% endnote %}

### Flagging Flaky Tests

Test runs with flaky tests will be flagged with the number of flaky of tests within the Dashboard "Latest runs" page. Flaky tests runs can also be filtered in and out via the "Flaky" filter within this page.

{% imgTag /img/dashboard/flaky-test-management/flaky-runs-view.png "Flagging flaky tests runs in Cypress Dashboard" %}

Any failure across multiple test run attempts triggered by test retrying will result in a given test case to be flagged as flaky.

### Flaky Test Analytics

The flaky tests analytics page provides a birds-eye-view on the state of flake within your project by showing:

- Plot of the **number of flaky tests over time**.
- Overall **flakiness level** of the entire project.
- **Number of flake tests** grouped by their severity.
- Filterable **log of all flaky test** cases ordered by severity.

{% note info "Flake Severity" %}
Test flake **severity** is determined by the frequency of flake or the **flake rate** of a given test. Flake severity level can be used to prioritize the work needed to resolve flake issues.
{% endnote %}

{% imgTag /img/dashboard/flaky-test-management/flake-analytics.png "Flaky tests analytics" %}

Selecting any of the flaky test cases in the analytics page will reveal a test case details panel that shows:

- Historical log of latest flaky runs
- Most common errors across the runs of the test case
- Related test case changelog
- Plot of failure rate and flaky rate over time.

All these test case level details provide deeper context around the occurrences of flake over time to assist with debugging the root cause.

{% imgTag /img/dashboard/flaky-test-management/flake-panel.png "Flaky tests analytics details panel" %}

### Failure Rate vs Flake Rate

It is important to understand the distinction between failure rate and flake rate when test retries is enabled. These two metrics are tracked over time for each flaky test case within the flaky tests analytics page:

{% imgTag /img/dashboard/flaky-test-management/flake-v-fail-2.png "flake rate vs fail rate" %}

A test case flagged as flaky could have still passed after multiple test retry attempts. The test result status of individual test retry attempts is separate and distinct from the final test status.

For example, a project is configured to retry failing tests up to 3 times. The first two attempts fail, but the last and third attempt passes, resulting in a final status of passing.

With this concept in mind, it is possible to always have zero final failure rate while exhibiting flake as demonstrated below:

{% imgTag /img/dashboard/flaky-test-management/flake-v-fail-1.png "flake rate vs fail rate" %}

{% note success "Provide Feedback" %}
Flake detection is new feature of the Cypress Dashboard and is part of our larger effort to minimize flake. {% url "Please provide any feedback within our public roadmap." https://portal.productboard.com/cypress-io/1-cypress-dashboard/c/19-see-the-flakiest-tests-in-your-test-suite %}
{% endnote %}
