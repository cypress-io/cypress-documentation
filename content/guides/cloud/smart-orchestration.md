---
title: Smart Orchestration
---

Cypress Cloud provides four distinct Smart Orchestration features for use in CI
to speed up test runs, accelerate debugging workflows, and reduce costs:

- [Parallelization](/guides/guides/parallelization): Reduce test duration by
  running multiple test spec files simultaneously across available CI machines.
- [Load Balancing](/guides/guides/parallelization#Balance-strategy): Optimize CI
  resources and minimize test duration by intelligently prioritizing running of
  test spec files during parallelization.
- [Spec Prioritization](#Spec-Prioritization): Quickly verify that your latest
  changes fixed a build by prioritizing the specs that failed in the previous
  Cypress run.
- [Auto Cancellation](#Auto-Cancellation): Save on CI resources by automatically
  canceling a Cypress run upon the first test failure.

## Spec Prioritization

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

### Activate Spec Prioritization in Cypress Cloud

<Alert type="success">

<strong class="alert-header"><Icon name="star"></Icon> Premium Cypress Cloud
Feature</strong>

**Spec Prioritization** is a _Smart Orchestration_ feature available to users
with a
[Business or Enterprise tier Cypress Cloud plan](https://cypress.io/pricing).
Wondering if upgrading your Team tier subscription is worth it? Check out the
[recommendations](/guides/cloud/runs#Recommendations) on the run overview page
to see how much time we predict these features would save you.

</Alert>

Spec Prioritization is a _Smart Orchestration_ feature that is managed within a
project's settings.

To enable or disable this feature at the Project level (must be an admin user):

1. Select the desired project within Projects view to visit Cypress Cloud.
2. Click "Project Settings" with the right-hand sidebar.
3. Scroll to the Smart Orchestration section within Project Settings page.
4. Toggle "Spec Prioritization".

<DocsImage src="/img/guides/cloud/smart-orchestration/spec-prioritization-active.png" alt="Enable Spec Prioritization"></DocsImage>

<Alert type="bolt">

<strong class="alert-header">CI Tip: Reduce Costs</strong>

Note that Spec Prioritization **alone** will not save time as it purely alters
the order in which specs are run. However, when used in tandem with
[Auto Cancellation](#Auto-Cancellation) it can result in shorter test runs due
to cancellation being triggered earlier, leading to significantly reduced CI
costs.

</Alert>

## Auto Cancellation

Continuous Integration (CI) pipelines are typically costly processes that can
demand significant compute time. **When a test failure occurs in CI, it often
does not make sense to continue running the remainder of a test suite** since
the process has to start again upon merging of subsequent fixes and other code
changes.

<Alert type="success">

<strong class="alert-header"><Icon name="check"></Icon> Benefits</strong>

Canceling an **entire** test run, even if parallelized, upon the first test
failure will:

1. **Save time**. Resolve test outcomes faster.
2. **Reduce CI costs**. These cost savings can be significant for large test
   suites.
3. **Free-up CI resources** for validating fixes, and helping other users.

</Alert>

### Activate Auto Cancellation in Cypress Cloud

<Alert type="success">

<strong class="alert-header"><Icon name="star"></Icon> Premium Cypress Cloud
Feature</strong>

**Auto Cancellation** is a _Smart Orchestration_ feature available to users with
a [Business or Enterprise tier Cypress Cloud plan](https://cypress.io/pricing).
Wondering if upgrading your Team tier subscription is worth it? Check out the
[recommendations](/guides/cloud/runs#Recommendations) on the run overview page
to see how much time we predict these features would save you.

</Alert>

Auto Cancellation is a _Smart Orchestration_ feature that is managed within a
project's settings. Coming soon, you will also have the option to enable the
feature on a per-run basis with the Cypress CLI.

<Alert type="info">

<strong class="alert-header">Consideration for Teams</strong>

If your development, testing, or QA teams operate in a highly collaborative
workflow where multiple people are working on various test failures at the same
time, it may be helpful to increase the failures threshold or even disable Auto
Cancellation altogether, so multiple failing tests can be surfaced for each test
run.

</Alert>

To enable or disable this feature at the Project level (must be an admin user):

1. Select the desired project within Projects view to visit Cypress Cloud.
2. Click "Project Settings" with the right-hand sidebar.
3. Scroll to the Smart Orchestration section within Project Settings page.
4. Toggle "Auto Cancellation".
5. Set the "failures before auto canceling" threshold (or just leave it at the
   default value of 1).

<DocsImage src="/img/guides/cloud/smart-orchestration/auto-cancellation-active.png" alt="Enable Auto Cancellation"></DocsImage>

<Alert type="bolt">

<strong class="alert-header">CI Tip: Save Time</strong>

In addition to Auto Cancellation, consider reducing CI costs further by enabling
[Spec Prioritization](#Spec-Prioritization) to surface test failures earlier in
the run, and reduce the time it takes to fix issues and deploy changes.

</Alert>
