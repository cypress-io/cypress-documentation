---
title: Jira Integration
---

<Alert type="success">

<strong class="alert-header"><Icon name="star"></Icon> Premium Cypress Cloud Feature</strong>

**Jira integration** is available to users with a
[Team Cypress Cloud plan](https://cypress.io/pricing).

</Alert>

[Cypress Cloud](https://on.cypress.io/cloud) can integrate with your
Jira workflow to enable:

- Creating one or more Jira issues for a given a test case directly from the
  Cypress Cloud.
- Viewing of historical log of Jira issues created for or associated for a given
  test case across test runs.

## Installing the Jira integration

1. Visit **Integrations → Jira** in Cypress Cloud and click "Install
   Jira"
   <DocsImage src="/img/dashboard/jira-integration/dashboard-jira-integration-install.png" alt="Cypress Cloud Integrations" ></DocsImage>
2. Click the "Get it Now" button on the
   [Atlassian Marketplace Cypress for Jira page](https://marketplace.atlassian.com/apps/1224341/cypress-for-jira?hosting=cloud&tab=overview)
   <DocsImage src="/img/dashboard/jira-integration/dashboard-jira-atlassian-get-it-now.png" alt="Atlassian Marketplace Cypress for Jira" ></DocsImage>
3. Login to Jira, Choose a site to install your app and click "Install app".
   <DocsImage src="/img/dashboard/jira-integration/dashboard-jira-atlassian-choose-site.png" alt="Atlassian Marketplace Cypress for Jira Choose Site" ></DocsImage>
4. On the "Add to Jira" screen, confirm installation by clicking "Get it now"
   <DocsImage src="/img/dashboard/jira-integration/dashboard-jira-atlassian-confirm-install.png" alt="Atlassian Marketplace Cypress for Jira Installation Confirmation" ></DocsImage>
5. Once installed, click the `Get Started` link in the notification.
   <DocsImage src="/img/dashboard/jira-integration/dashboard-jira-atlassian-success.png" alt="Atlassian Marketplace Cypress for Jira Installation Success" ></DocsImage>
6. On the next page, click the `Click to Finish Installation` button to be
   redirected to [Cypress Cloud](https://cloud.cypress.io/) and
   choose the Cypress Organization for integration.
   <DocsImage src="/img/dashboard/jira-integration/dashboard-jira-atlassian-finish-install-step.png" alt="Atlassian Marketplace Cypress for Jira Installation Finish Installation" ></DocsImage>
7. Once redirected to [Cypress Cloud](https://cloud.cypress.io/), select the
   organization to integrate with
   [Atlassian Marketplace Cypress for Jira](https://marketplace.atlassian.com/apps/1224341/cypress-for-jira?hosting=cloud&tab=overview).
   <DocsImage src="/img/dashboard/jira-integration/dashboard-jira-integration-choose-cypress-org.png" alt="Cypress Cloud Select Organization for Jira Integration" ></DocsImage>
8. The Jira Integration is complete. A list of projects permitted is provided on
   the Jira Integration page.
   <DocsImage src="/img/dashboard/jira-integration/dashboard-jira-integration-completed.png" alt="Cypress Cloud Jira Integration" ></DocsImage>

## Creating a Jira issue for a test case

<Alert type="info">

<strong class="alert-header">When to create issues for tests?</strong>

Jira issues can be created for both passing and failing tests. The most common
use case would be to create Jira issues for failing tests to better track and
prioritize fixing of pipeline failures within projects managed by Jira
workflows.

</Alert>

Let's walk through creating a Jira issue for a failing test:

1. Click on a failed test within the "Test Results" view of a test run to open
   its results panel.

2. Click on the "Create Issue" button within the results panel, which will
   present the form for creating a Jira issue for the test.
   <DocsImage src="/img/dashboard/jira-integration/dashboard-jira-integration-create-issue.png" alt="Create Jira Issue Button" ></DocsImage>

3. Complete and submit the Jira issue creation form by selecting the Jira
   project, issue type, assignee, and additional fields.
   <DocsImage src="/img/dashboard/jira-integration/dashboard-jira-integration-modal.png" alt="Create Jira Issue Modal" ></DocsImage>

4. Once the issue is created, a log and reference of the issue will appear
   within results panel of test.
   <DocsImage src="/img/dashboard/jira-integration/dashboard-jira-integration-inline-issue.png" alt="Jira Issue in Cypress Failure Context" ></DocsImage>

   <Alert type="info">

<strong class="alert-header">Note</strong>

The create issue within Jira will include a link back Cypress Cloud for
the associated test.
<DocsImage src="/img/dashboard/jira-integration/dashboard-jira-integration-jira-issue.png" alt="Jira Issue of Cypress Failure" ></DocsImage>

</Alert>

## Uninstalling the Jira integration

You can remove this integration by visiting the **Integrations → Jira** page of
your organization. This will disable the ability to create Jira issues from a
test failure.
