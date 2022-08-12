---
title: Slack Integration
---

Slack Integration allows you to see your Cypress test results directly in your
teams' Slack channels.

<DocsImage src="/img/dashboard/cypress-slack-integration-channel-feed.png" alt="Cypress notification feed in Slack channel" ></DocsImage>

## Install the Cypress Slack app

<Alert type="warning">

<strong class="alert-header">Ownership Requirements</strong>

In order to install the Slack Integration, you must be an admin or owner of both
your Cypress Dashboard organization and your Slack workspace.

</Alert>

**To install the Slack Integration:**

1. Go to the Dashboard
   [Organizations page](https://dashboard.cypress.io/organizations) or open the
   organization switcher.
1. Select the organization you wish to integrate with Slack.
   <DocsImage src="/img/dashboard/select-cypress-organization.png" alt="Select an organization" width-600 ></DocsImage>
1. Visit the selected organization's **Integrations** page via the side
   navigation.
   <DocsImage src="/img/dashboard/navigate-to-organization-integrations.png" alt="Install Cypress Slack from Integrations" ></DocsImage>
1. Click the **Install Slack Integration** button.
1. You'll see a popup window that requests permission for Cypress to access the
   workspace and allows you to choose your Slack workspace and channel to
   associate with the installation. Once you've selected a channel and allowed
   access, the installation is complete! The Cypress Dashboard will post run
   results for all projects in your organization to the specified Slack channel.

## Per-organization configuration

### Add additional Slack channels

You can have the Cypress Dashboard post run results to an additional channels.
To add a channel:

1. Navigate to the **Integrations** page for the organization with the installed
   Slack integration.
1. Within the Slack integration, click **Configure**.
1. Click **Add Slack Channel**.
1. You'll see a popup window that allows you to choose the channel to associate
   with the organization. The Cypress Dashboard will post run results for all
   projects in your organization to the new Slack channel.

### Set notification preferences

By default, the Cypress Dashboard will post a Slack message to each configured
channel only for failing runs. If you'd like to change these preferences:

1. Navigate to the **Integrations** page for the organization with the installed
   Slack integration.
1. Within the Slack integration, click **Configure**.
1. Under **Notifications**, select your preference for each Slack channel:

- **All runs**: will notify on all runs (including passed)
- **Failed runs only**: will only notify on runs with a fail status.

### Mute a channel

If you want the Cypress Dashboard to temporarily stop posting Slack messages to
a certain channel, you can **Mute** that channel. This allows you to easily
pause and resume notifications for a specific channel without losing the
configuration you’ve put in place.

1. Navigate to the **Integrations** page for the organization with the installed
   Slack integration.
1. Within the Slack integration, click **Configure**.
1. Under **Actions**, select your **Mute** for each Slack channel you want
   muted.

### Remove a Slack channel

You can have the Cypress Dashboard stop posting notifications to a channel. You
can remove all Slack channels if you’d prefer to disable global notifications
altogether in favor of per-project notifications.

1. Navigate to the **Integrations** page for the organization with the installed
   Slack integration.
1. Within the Slack integration, click **Configure**.
1. Under **Actions**, select your **Delete** for each Slack channel you want
   deleted.

## Per-project configuration

If your organization has multiple teams working on separate projects, you can
tailor the Slack notifications of each project to match your teams' needs.

### Add a new Slack channel

You can have the Cypress Dashboard post run results for a specific project to an
additional channel.

1. Select your organization in the organization switcher.
   <DocsImage src="/img/dashboard/select-cypress-organization.png" alt="Select an organization" width-600 ></DocsImage>
1. Select the project you wish to integrate with Slack.
   <DocsImage src="/img/dashboard/select-cypress-project.png" alt="Select a project" ></DocsImage>
1. Go to the project's settings page.
   <DocsImage src="/img/dashboard/visit-project-settings.png" alt="Visit project settings" ></DocsImage>
1. Scroll down to the **Slack Integration** section.
1. Click **Add Slack Channel**.
1. You'll see a popup window that allows you to choose the channel to associate
   with the project.

### Set notification preferences

By default, the Cypress Dashboard will post a Slack message to each configured
channel only for failing runs. You cannot override the notification preferences
for the global organization channels. If you'd like to change these preferences:

1. Navigate to the **Integrations** page for the project with the installed
   Slack integration.
1. Scroll down to the **Slack Integration** section.
1. Under **Notifications**, select your preference for each Slack channel:

- **All runs**: will notify on all runs (including passed)
- **Failed runs only**: will only notify on runs with a fail status.

### Mute a channel

If you want the Cypress Dashboard to temporarily stop posting Slack messages to
a certain channel, you can **Mute** that channel. This allows you to easily
pause and resume notifications for a specific channel without losing the
configuration you’ve put in place. You can even mute the messages for the global
organization channels!

1. Navigate to the **Integrations** page for the project with the installed
   Slack integration.
1. Scroll down to the **Slack Integration** section.
1. Under **Actions**, select your **Mute** for each Slack channel you want
   muted.

### Remove a channel

You can have the Cypress Dashboard stop posting notifications to a channel. You
cannot delete the global notification channels from a project.

1. Navigate to the **Integrations** page for the project with the installed
   Slack integration.
1. Scroll down to the **Slack Integration** section.
1. Under **Actions**, select your **Delete** for each Slack channel you want
   deleted.

## Remove the integration

You can completely remove the Slack Integration from your workspace. This will
remove the @cypress bot from your workspace and will delete all of the Slack
configurations you’ve set in the Cypress Dashboard. You cannot undo this, but
you will be able to install the Slack Integration again in the future.

1. Navigate to the **Integrations** page for the organization with the installed
   Slack Integration.
1. Within the Slack Integration, click **Configure**.
1. Click **Uninstall Slack Integration** to uninstall the Slack Integration.
