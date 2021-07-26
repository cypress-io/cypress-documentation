---
title: GitLab Integration
---

The [Cypress Dashboard](https://on.cypress.io/dashboard) can integrate your
Cypress tests with your GitLab workflow via [commit statuses](#Commit-statuses)
and [merge request comments](#Merge-Request-comments). A project first needs to
be [setup to record](/guides/dashboard/projects) to the Cypress Dashboard to use
GitLab integration.

<Alert type="warning">

GitLab Integration is dependent on your CI environment reliably providing commit
SHA data (typically via an environment variable). This is not a problem for most
users, but if you are facing GitLab integration issues with your CI setup,
please make sure the git information is being sent properly by following
[these guidelines](/guides/continuous-integration/introduction#Git-information).
If you are still facing issues after this, please
[contact us](mailto:hello@cypress.io).

</Alert>

## Installing the GitLab integration

<Alert type="warning">

GitLab OAuth2 applications will allow the Cypress Dashboard to authenticate as
the user that registered the application. That means the Cypress will have
visibility to every GitLab repo you can access. If you want tighter control on
the repos that the Cypress will see, consider creating a service account with
more limited access in GitLab.

</Alert>

1. Visit **Integrations → GitLab** in the Cypress Dashboard.
2. Follow the instructions to create a new OAuth2 application in GitLab. See the
   [GitLab docs](https://docs.gitlab.com/ee/integration/oauth_provider.html#adding-an-application-through-the-profile)
   for more details.
3. Copy the Application ID and Secret back to the Cypress Dashboard.
4. Connect your projects to a GitLab repo.
5. (Optional) Configure the behavior for each project.

## Configuring the GitLab integration

### Commit statuses

By default, Cypress will post a **cypress/run** commit status containing the
results of the Cypress run. This will prevent your team from merging any MRs
with failing Cypress tests.

Additionally, Cypress can post a **cypress/flake** commit status indicating
whether the Cypress run contained any flaky tests. This will prevent your team
from merging any MRs with flaky tests.

You can manage this behavior in your project's **Project Settings** page.

### Merge Request comments

By default, Cypress will post a MR comment summarizing the run when the run
completes. It will include test counts, run info, and a summary of tests that
failed or were flaky.

You can manage this behavior in your project's **Project Settings** page.

## Uninstalling the GitLab integration

You can remove this integration by visiting the **Integrations → GitLab** page
of your organization. This will stop all commit checks and MR comments from
Cypress.
