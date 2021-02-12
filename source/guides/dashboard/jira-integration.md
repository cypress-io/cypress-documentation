---
title: Jira Integration
---

The {% url "Cypress Dashboard" https://on.cypress.io/dashboard %} can integrate your Cypress tests with your Jira workflow by enabling the creation of Jira issues from a test failure.

## Installing the Jira integration

1. Visit **Integrations → Jira** in the Cypress Dashboard

## Creating a Jira issue from a test failure

1. Click on a failing test in the {% url "Cypress Dashboard" https://on.cypress.io/dashboard %} 
   {% imgTag /img/dashboard/jira-integration/dashboard-jira-integration-create-issue.png "Create Jira Issue Button" %}

2. Complete the resulting modal assigning to the Jira project, issue type, assignee and additional fields.
   {% imgTag /img/dashboard/jira-integration/dashboard-jira-integration-modal.png "Create Jira Issue Modal" %}

3. Once created, the issue appears in context of the failure and contains a link to the Jira issue created.
   {% imgTag /img/dashboard/jira-integration/dashboard-jira-integration-inline-issue.png "Jira Issue in Cypress Failure Context" %}
   {% imgTag /img/dashboard/jira-integration/dashboard-jira-integration-jira-issue.png "Jira Issue of Cypress Failure" %}

## Uninstalling the Jira integration

You can remove this integration by visiting the **Integrations → Jira** page of your organization. This will disable the ability to create Jira issues from a test failure.