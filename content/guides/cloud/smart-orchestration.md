---
title: Smart Orchestration
---

Cypress Cloud provides four distinct Smart Orchestration features for
use in CI to speed up test runs, accelerate debugging workflows, and reduce
costs:

- [Parallelization](/guides/guides/parallelization): Reduce test duration by
  running multiple test spec files simultaneously across available CI machines.
- [Load Balancing](/guides/guides/parallelization#Balance-strategy): Optimize CI
  resources and minimize test duration by intelligently prioritizing running of
  test spec files during parallelization.
- [Run failed specs first](#Run-failed-specs-first): Quickly verify that your
  latest changes fixed a build by prioritizing the specs that failed in the
  previous Cypress run.
- [Cancel test run when a test fails](#Cancel-test-run-when-a-test-fails): Save
  on CI resources by automatically canceling a Cypress run upon the first test
  failure.

## Run failed specs first

It is often helpful to be **aware of test failures earlier within a CI test run
so that debugging and iterations can resume and progress much faster**. Being
able to catch issues sooner within the CI process can save valuable time in
troubleshooting failures and deploying fixes.

<Alert type="info">

<strong class="alert-header"><Icon name="graduation-cap"></Icon> Consider the
Scenario</strong>

For example, you have a test suite consisting of several spec files that take 30
minutes to execute, but failures start to occur within one spec at the 20 minute
marker. A subsequent code change aimed at resolving the issue will have to be
validated after running the CI build and waiting 20 minutes. This process and
waiting continues until the issue is fixed.

By running failed specs first, the issues can be surfaced earlier and reduce
that 20 minute wait to potentially a few minutes. **Considering that a test
suite has multiple spec files, this orchestration strategy will always save
time.**

</Alert>

### Toggle running of failed specs first

<Alert type="success">

<strong class="alert-header"><Icon name="star"></Icon> Premium Cypress Cloud Feature</strong>

**Running failed specs first** is a _Smart Orchestration_ feature available to
users with a [Business Cypress Cloud plan](https://cypress.io/pricing).

</Alert>

Controlling running of failed specs first is a _Smart Orchestration_ feature
that is managed within a project's settings.

To enable or disable this feature:

1. Select the desired project within Projects view to visit Cypress Cloud.
2. Click "Project Settings" with the right-hand sidebar.
3. Scroll to the Smart Orchestration section within Project Settings page.
4. Toggle "Run failed specs first."

<DocsImage src="/img/guides/smart-orchestration/enable-run-failed-specs-first.png" alt="Enable running of failed specs first"></DocsImage>

<Alert type="bolt">

<strong class="alert-header">CI Tip: Reduce Costs</strong>

In addition to saving time by running failed specs first, also consider
[canceling test runs on first failure](#Cancel-test-run-when-a-test-fails) to
also save on CI costs.

</Alert>

## Cancel test run when a test fails

Continuous Integration (CI) pipelines are typically costly processes that can
demand significant compute time. **When a test failure occurs in CI, it often
does not make sense to continue running the remainder of a test suite** since
the process has to start again upon merging of subsequent fixes and other code
changes.

<Alert type="success">

<strong class="alert-header"><Icon name="check"></Icon> Benefits</strong>

Canceling an **entire** test run, even if parallelized, upon the first test
failure will:

1. **Reduce CI costs**. These cost savings can be significant for large test
   suites.
2. **Quickly free-up CI resources** for use by other members of a team.
3. **Ensure availability of CI resources** for quick validation of the failure's
   fix.

</Alert>

### Toggle cancellation of test runs upon first failure

<Alert type="success">

<strong class="alert-header"><Icon name="star"></Icon> Premium Cypress Cloud Feature</strong>

**Canceling test runs when a test fails** is a _Smart Orchestration_ feature
available to users with a [Business Cypress Cloud plan](https://cypress.io/pricing).

</Alert>

Controlling cancellation of test runs upon the first failed test is a _Smart
Orchestration_ feature that is managed within a project's settings.

<Alert type="info">

<strong class="alert-header">Consideration for Teams</strong>

If your development, testing, or QA teams operate in a highly collaborative
workflow where multiple people are working on various test failures at the same
time, it may be helpful to disable run cancellation upon first failure, so **all
failing tests can be surfaced for each test run**.

</Alert>

To enable or disable this feature:

1. Select the desired project within Projects view to visit Cypress Cloud.
2. Click "Project Settings" with the right-hand sidebar.
3. Scroll to the Smart Orchestration section within Project Settings page
4. Toggle "Cancel run when a test fails."

<DocsImage src="/img/guides/smart-orchestration/enable-cancel-run.png" alt="Enable cancellation of test runs upon first failure"></DocsImage>

<Alert type="bolt">

<strong class="alert-header">CI Tip: Save Time</strong>

In addition to reducing CI costs by canceling test runs on first failure, also
consider [running failed specs first](#Run-failed-specs-first) to reduce the
time it takes to fix issues and deploy changes.

</Alert>
