---
title: Jira Integration
---

<Alert type="success">

<strong class="alert-header">
  <Icon name="star"></Icon> Premium Dashboard Feature
</strong>

**Jira integration** is available to users with a
[Team Dashboard plan](https://cypress.io/pricing).

</Alert>

The [Cypress Dashboard](https://on.cypress.io/dashboard) can integrate with your
Jira workflow to enable:

- Creating one or more Jira issues for a given a test case directly from the
  Cypress Dashboard.
- Viewing of historical log of Jira issues created for or associated for a given
  test case across test runs.

## Installing the Jira integration

1. Visit **Integrations → Jira** in the Cypress Dashboard and click "Install
   Jira"
   <DocsImage
   src="/img/dashboard/jira-integration/dashboard-jira-integration-install.png"
   alt="Cypress Dashboard Integrations"
   />
2. Click the "Get it Now" button on the
   [Atlassian Marketplace Cypress for Jira page](https://marketplace.atlassian.com/apps/1224341/cypress-for-jira?hosting=cloud&tab=overview)
   <DocsImage
   src="/img/dashboard/jira-integration/dashboard-jira-atlassian-get-it-now.png"
   alt="Atlassian Marketplace Cypress for Jira"
   />
3. Login to Jira, Choose a site to install your app and click "Install app".
   <DocsImage
   src="/img/dashboard/jira-integration/dashboard-jira-atlassian-choose-site.png"
   alt="Atlassian Marketplace Cypress for Jira Choose Site"
   />
4. On the "Add to Jira" screen, confirm installation by clicking "Get it now"
   <DocsImage
   src="/img/dashboard/jira-integration/dashboard-jira-atlassian-confirm-install.png"
   alt="Atlassian Marketplace Cypress for Jira Installation Confirmation"
   />
5. Once installed, click the `Get Started` link in the notification.
   <DocsImage
   src="/img/dashboard/jira-integration/dashboard-jira-atlassian-success.png"
   alt="Atlassian Marketplace Cypress for Jira Installation Success"
   />
6. On the next page, click the `Click to Finish Installation` button to be
   redirected to the [Cypress Dashboard](https://www.cypress.io/dashboard/) and
   choose the Cypress Organization for integration.
   <DocsImage
   src="/img/dashboard/jira-integration/dashboard-jira-atlassian-finish-install-step.png"
   alt="Atlassian Marketplace Cypress for Jira Installation Finish Installation"
   />
7. Once redirected to the
   [Cypress Dashboard](https://www.cypress.io/dashboard/), select the
   organization to integrate with
   [Atlassian Marketplace Cypress for Jira](https://marketplace.atlassian.com/apps/1224341/cypress-for-jira?hosting=cloud&tab=overview).
   <DocsImage
   src="/img/dashboard/jira-integration/dashboard-jira-integration-choose-cypress-org.png"
   alt="Cypress Dashboard Select Organization for Jira Integration"
   />
8. The Jira Integration is complete. A list of projects permitted is provided on
   the Jira Integration page.
   <DocsImage
   src="/img/dashboard/jira-integration/dashboard-jira-integration-completed.png"
   alt="Cypress Dashboard Jira Integration"
   />

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

   <DocsImage
   src="/img/dashboard/jira-integration/dashboard-jira-integration-create-issue.png"
   alt="Create Jira Issue Button"

   />

3. Complete and submit the Jira issue creation form by selecting the Jira
   project, issue type, assignee, and additional fields.

   <DocsImage
   src="/img/dashboard/jira-integration/dashboard-jira-integration-modal.png"
   alt="Create Jira Issue Modal"

   />

4. Once the issue is created, a log and reference of the issue will appear
   within results panel of test.

   <DocsImage
   src="/img/dashboard/jira-integration/dashboard-jira-integration-inline-issue.png"
   alt="Jira Issue in Cypress Failure Context"

   />

   <Alert type="info">

<strong class="alert-header">Note</strong>

The create issue within Jira will include a link back the Cypress Dashboard for
the associated test.

<DocsImage
src="/img/dashboard/jira-integration/dashboard-jira-integration-jira-issue.png"
alt="Jira Issue of Cypress Failure"
/>

</Alert>

## Uninstalling the Jira integration

You can remove this integration by visiting the **Integrations → Jira** page of
your organization. This will disable the ability to create Jira issues from a
test failure.
