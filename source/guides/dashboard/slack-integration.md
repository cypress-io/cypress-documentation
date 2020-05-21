---
title: Slack Integration
---

Slack Integration allows you to see your Cypress test results directly in your teams' Slack channels.


# Installation

{% note info Ownership Requirements %}

In order to install the Slack Integration, you must be an admin of both your Cypress Dashboard organization and your Slack workspace.
{% endnote %}

To install the Slack Integration, visit your organization’s **Integrations** page and click **Install Slack Integration**. You'll see a popup window that allows you to choose your Slack workspace and channel to associate with the installation. Once you've selected a channel, the installation is complete! The Cypress Dashboard will post run results for all projects in your organization to the specified Slack channel.

# Setting notification preferences

By default, the Cypress Dashboard will post a Slack message only for failing runs. If you'd like to see all runs (including passed), you can change your **Notifications** to **All runs**.

# Muting a channel

If you want the Cypress Dashboard to temporarily stop posting Slack messages to a certain channel, you can **Mute** that channel. This allows you to easily pause and resume notifications for a specific channel without losing the configuration you’ve put in place.

# Adding additional Slack channels

You can have the Cypress Dashboard post run results to an additional channel by clicking **Add Slack Channel**. You'll see a popup window that allows you to choose the channel to associate with the organization. The Cypress Dashboard will post run results for all projects in your organization to the new Slack channel.

# Removing a Slack channel

You can have the Cypress Dashboard stop posting notifications to a channel by clicking **Delete** on that channel. You can remove all Slack channels if you’d prefer to disable global notifications altogether in favor of per-project notifications.

# Per-project configuration

If your organization has multiple teams working on separate projects, you can tailor the Slack notifications of each project to match your teams' needs.

## Adding a new Slack channel

Visit the **Project Settings** page of the project you'd like to configure. You can have the Cypress Dashboard post run results for this project to an additional channel by clicking **Add Slack Channel**. You'll see a popup window that allows you to choose the channel to associate with the project.

## Setting notification preferences

By default, the Cypress Dashboard will post a Slack message only for failing runs. If you'd like to see all runs (including passed), you can change your **Notifications** to **All runs**. You cannot override the notification preferences for the global organization channels.

## Muting a channel

If you want the Cypress Dashboard to stop posting Slack messages for this project to a certain channel, you can **Mute** that channel from the **Project Settings**. You can even mute the messages for the global organization channels!

## Removing a channel

You can have the Cypress Dashboard stop posting notifications to a channel by clicking **Delete** on that channel. You cannot delete the global notification channels from a project.

# Removing the integration

You can completely remove the Slack integration from your workspace by visiting your organization’s **Integrations** page. **Configure** your Slack integration, then click **Remove Slack integration** to uninstall the Slack integration. This will remove the @cypress bot from your workspace and will delete all of the Slack configurations you’ve set in the Cypress Dashboard. You cannot undo this, but you will be able to install the Slack integration again in the future.

