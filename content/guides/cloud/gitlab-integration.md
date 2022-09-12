---
title: GitLab Integration
---

[Cypress Cloud](https://on.cypress.io/cloud) can integrate your
Cypress tests with your GitLab workflow via [commit statuses](#Commit-statuses)
and [merge request comments](#Merge-Request-comments). A project first needs to
be [setup to record](/guides/cloud/projects) to Cypress Cloud to use
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

<Alert type="warning">

<strong class="alert-header"><Icon name="exclamation-triangle"></Icon> GitLab
Self-managed</strong>

GitLab Self-managed Integration is dependent on your GitLab instance being able
to reach our Cypress Cloud API on the open internet. If your instance is running
behind a firewall, you may need to reconfigure your security infrastructure to
allow communication with our servers.

</Alert>

## Installing the GitLab integration

<Alert type="warning">

GitLab OAuth2 applications will allow Cypress Cloud to authenticate as
the user that registered the application. That means that Cypress will have
visibility into every GitLab repo the registered user can access. If you want
tighter control of the repos that Cypress will see, consider creating a service
account in GitLab with more limited access permissions.

</Alert>

1. In your organization, visit **Integrations → GitLab** (if you are using
   [GitLab SaaS](https://docs.gitlab.com/ee/subscriptions/gitlab_com/)) or
   **GitLab Self-managed** (if you are running
   [your own GitLab instance](https://docs.gitlab.com/ee/subscriptions/self_managed/))
   in Cypress Cloud.
2. Follow the instructions to create a new OAuth2 application in GitLab. See the
   [GitLab docs](https://docs.gitlab.com/ee/integration/oauth_provider.html#adding-an-application-through-the-profile)
   for more details.
3. Copy the Application ID and Secret back to Cypress Cloud.
4. (GitLab Self-managed only) Copy the base URL of your GitLab instance to the
   GitLab URL field in Cypress Cloud.
5. Connect your projects to a GitLab repo in **Project Settings → GitLab
   Integration** or **GitLab Self-managed**.
6. (Optional) Configure the behavior for each project.

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

You can remove this integration by visiting the **Integrations → GitLab** or
**GitLab Self-managed** page of your organization. This will stop all commit
checks and MR comments from Cypress.
