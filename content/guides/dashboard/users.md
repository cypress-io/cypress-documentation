---
title: Users
---

A user is anyone who logs in to the Dashboard Service.

## Invite users

You can invite users to Cypress from the
[Dashboard Service](https://on.cypress.io/dashboard). Invited users will see all
projects and tests run for the organization.

### Invite a user to an organization:

1. Go the [Organizations page](https://on.cypress.io/dashboard/organizations) to
   select the organization you want to invite a user to.
2. Click **Users**, then **Invite User**. _Note: you must have the
   [role of 'owner' or 'admin'](#User-roles) to invite users._
3. Fill in their email and select their [role](#User-roles) then click **Invite
   User** _Note: only owners can give other users 'owner' access._
4. The user will receive an invitation email with a link to accept the
   invitation.

<DocsImage src="/img/dashboard/invite-user-dialog.png" alt="Invite User dialog" ></DocsImage>

## User roles

Users can be assigned roles that affect their access to certain features of the
[Dashboard Service](https://on.cypress.io/dashboard).

- **Member:** Can see the projects, runs, and keys.
- **Admin:** Can also invite, edit and delete users.
- **Owner:** Can also transfer or delete projects. Can delete and edit the
  organization.

The permissions for each user role for the Dashboard Service.

| Permission                                      |               |              |              |
| ----------------------------------------------- | ------------- | ------------ | ------------ |
| See test results of private projects            | ✅ **Member** | ✅ **Admin** | ✅ **Owner** |
| See record keys of projects                     | ✅ **Member** | ✅ **Admin** | ✅ **Owner** |
| See billing and usage information               |               | ✅ **Admin** | ✅ **Owner** |
| Edit billing information                        |               | ✅ **Admin** | ✅ **Owner** |
| See users invited to organization               |               | ✅ **Admin** | ✅ **Owner** |
| Resend invitation to invited user               |               | ✅ **Admin** | ✅ **Owner** |
| Invite 'member' to organization                 |               | ✅ **Admin** | ✅ **Owner** |
| Invite 'admin' to organization                  |               | ✅ **Admin** | ✅ **Owner** |
| See user requests to join organization          |               | ✅ **Admin** | ✅ **Owner** |
| Accept user requests to join organization       |               | ✅ **Admin** | ✅ **Owner** |
| Remove 'member' from organization               |               | ✅ **Admin** | ✅ **Owner** |
| Remove 'admin' from organization                |               | ✅ **Admin** | ✅ **Owner** |
| Edit 'member' in organization                   |               | ✅ **Admin** | ✅ **Owner** |
| Edit 'admin' in organization                    |               | ✅ **Admin** | ✅ **Owner** |
| Edit project name                               |               | ✅ **Admin** | ✅ **Owner** |
| Edit project status (private/public}            |               | ✅ **Admin** | ✅ **Owner** |
| Add or delete record keys                       |               | ✅ **Admin** | ✅ **Owner** |
| Set up GitHub Integration                       |               | ✅ **Admin** | ✅ **Owner** |
| Set up Slack Integration                        |               | ✅ **Admin** | ✅ **Owner** |
| Invite 'owner' to organization                  |               |              | ✅ **Owner** |
| Edit 'owner' in organization                    |               |              | ✅ **Owner** |
| Remove 'owner' from organization                |               |              | ✅ **Owner** |
| Add, edit, remove user in personal organization |               |              | ✅ **Owner** |
| Edit organization name                          |               |              | ✅ **Owner** |
| Delete organization                             |               |              | ✅ **Owner** |
| Transfer project to another organization        |               |              | ✅ **Owner** |
| Delete project                                  |               |              | ✅ **Owner** |
| Set up SSO                                      |               |              | ✅ **Owner** |

## User requests

Users can "request" access to a given organization. If a developer on your team
has access to Cypress and your project's source code - they can request to be
given access to your organization. This means instead of you having to invite
team members up front, they can request access and you can choose to accept or
deny them access.

<DocsImage src="/img/dashboard/request-access-to-organization.png" alt="Request access to project" ></DocsImage>

## User updates

Changes can be made to both the primary email address associated with your
Dashboard account and the email address for billing notifications.

For updating the primary email address associated with your Dashboard, click
your Profile picture in the upper left corner of the Organizations page. Select
**Manage Profile**. Go to the **Email** field and select your preferred email
address. _Note: The email list is limited to emails provided by login provider._

If you would like to update the billing email address, that can be done via the
**Billing & Usage** page within the [Dashboard](https://on.cypress.io/dashboard)
or you contact them directly at [billing@cypress.io](mailto:billing@cypress.io).
