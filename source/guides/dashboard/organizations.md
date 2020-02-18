---
title: Organizations
---

Organizations are used to group projects and manage access to those projects.

{% imgTag /img/dashboard/organizations-listed-in-dashboard.png "Organizations"  width-600 %}

# Features

- Create projects
- Invite users
- Transfer projects
- Pay for all of your projects usage.

## Organization ID

An Organization's ID is a unique identifier in [UUID](https://tools.ietf.org/html/rfc4122) format that can be found under the "Organization settings" section of the Dashboard. This ID is used frequently by the Support, Success, and Sales teams to reference an Organization.

To locate your organization's UUID, go to "Organization settings" then Organization ID. Click on the clipboard icon to copy the ID for easy sharing with Cypress teams.

{% imgTag /img/dashboard/organizations/OrganizationUUID.gif "Locate UUID gif" %}

# Managing Organizations

## Create Org

You can create an organization from within the {% url "Dashboard Service" https://on.cypress.io/dashboard %} by opening the organization switcher and clicking **{% fa fa-plus %} Create new organization**.

{% imgTag /img/dashboard/create-org.png "Create new organization" width-600 %}

{% imgTag /img/dashboard/add-organization-dialog.png "Add Organization dialog" width-600 %}

## Personal Org

By default, every user of Cypress is given a personal organization - named after you. You cannot delete or edit the name of this personal organization.

### Convert to professional org

If you’ve already set up your projects, users, and billing on your personal organization, you can convert it to a professional organization via the **Organization settings** page.

{% imgTag /img/dashboard/convert-to-professional-org-button.jpg "Convert org for billing" %}

Click the **Convert organization** button, provide a name for the organization, and hit **Convert organization**. This will do two things:

1. It will upgrade your personal organization to a new named organization. All of your projects, users, and billing information will carry over to this new organization.
2. We’ll create a new, empty personal organization so you always have a place to keep your side projects and experiments!

{% imgTag /img/dashboard/convert-to-professional-org-modal.jpg "Convert org to new org" width-600 %}

## Delete Org

You can delete organizations that you own as long as they do not have any projects in the organization. You must first transfer ownership of your projects to another organization before you can delete the organization.

{% imgTag /img/dashboard/remove-organization-dialog.png "Delete Organization" %}

# Billing & Usage

## Open Source Plan

To support the community, we provide the Open Source (OSS) plan for public projects to take advantage of our Dashboard Service with unlimited test runs. To qualify, your project needs two things:

- Your project is a non-commercial entity
- Source code for your project is available in a public location with an {% url "OSI-approved license" https://opensource.org/licenses %}

## Requesting OSS plan for an org

Follow the following process to request an OSS plan for your project:

1. {% url "Login" https://on.cypress.io/dashboard %} to the Cypress Dashboard, or {% url "create an account" https://on.cypress.io/dashboard %} if you are a new user.
  {% imgTag /img/dashboard/oss-plan-1-login.png "Login or Create Account" "no-border" %}
2. Go the {% url "Organizations page" https://on.cypress.io/dashboard/organizations %} to select the organization you want to associate with an OSS plan. If you have no organizations, you can create one by clicking the **+ Add Organization** button.
> **Note**: Personal organizations cannot be used with an OSS plan.

  {% imgTag /img/dashboard/oss-plan-2-select-org.png "Select or add organization" "no-border width-600" %}
3. Go to the **Billing & Usage** page, and then click on the **Apply for an open source plan** link at the bottom of the page.
  {% imgTag /img/dashboard/oss-plan-3-billing.png "Click Apply for an open source plan" "no-border" %}
4. Fill in and submit the OSS plan request form.
  {% imgTag /img/dashboard/oss-plan-4-apply.png "OSS plan request form" "no-border width-600" %}
5. You'll receive an email confirming your request. The Cypress Team will review your request and, if approved, an OSS plan subscription will be applied to your organization.

If you have any questions regarding the OSS plan, please feel free [contact us](mailto:hello@cypress.io).


