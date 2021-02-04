---
title: Bitbucket Integration
---

{% note info %}
Bitbucket integration is currently in private beta.
{% endnote %}

The {% url "Cypress Dashboard" https://on.cypress.io/dashboard %} can integrate your Cypress tests with your Bitbucket workflow via {% urlHash 'status checks' Status-checks %} and {% urlHash 'pull request comments' Pull-Request-comments %}. A project first needs to be {% url "setup to record" projects %} to the Cypress Dashboard to use Bitbucket integration.

{% note warning %}
Bitbucket Integration is dependent on your CI environment reliably providing commit SHA data (typically via an environment variable). This is not a problem for most users, but if you are facing Bitbucket integration issues with your CI setup, please make sure the git information is being sent properly by following {% url "these guidelines" continuous-integration#Git-information %}. If you are still facing issues after this, please [contact us](mailto:hello@cypress.io).
{% endnote %}

## Installing the Bitbucket integration

{% note warning %}
Bitbucket OAuth2 applications will allow the Cypress Dashboard to authenticate as the user that registered the application. That means the Cypress will have visibility to every Bitbucket repo you can access. If you want tighter control on the repos that the Cypress will see, consider creating a service account with more limited access in Bitbucket.
{% endnote %}

1. Visit **Integrations** in the Cypress Dashboard.
1. Click **Install Bitbucket Integration**.
1. (For beta only) You need to enable Bitbucket's [development mode](https://support.atlassian.com/bitbucket-cloud/docs/enable-bitbucket-cloud-development-mode/) for your user account to continue.
1. Continue through the Bitbucket OAuth installation flow in the popup window.
1. Once installed, connect your projects to a Bitbucket repo.
1. (Optional) Configure the behavior for each project.

## Configuring the Bitbucket integration

### Status checks

By default, Cypress will post a **cypress/run** commit status containing the results of the Cypress run. This will prevent your team from merging any PRs with failing Cypress tests.

Additionally, Cypress can post a **cypress/flake** commit status indicating whether the Cypress run contained any flaky tests. This will prevent your team from merging any PRs with flaky tests.

You can manage this behavior in your project's **Project Settings** page.

### Pull Request comments

By default, Cypress will post a PR comment summarizing the run when the run completes. It will include test counts, run info, and a summary of tests that failed or were flaky.

You can manage this behavior in your project's **Project Settings** page.

## Uninstalling the Bitbucket integration

You can remove this integration by visiting the **Integrations → Bitbucket** page of your organization. This will stop all status checks and PR comments from Cypress.

## Feedback

Have ideas for how we can improve our Bitbucket Integration? [Let us know!](https://portal.productboard.com/cypress-io/1-cypress-dashboard/c/49-bitbucket-integration?utm_medium=social&utm_source=portal_share)