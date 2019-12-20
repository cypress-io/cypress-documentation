---
title: Users
---

A user is anyone who logs in to the Dashboard Service.

# Invite users

You can invite users to Cypress from the {% url 'Dashboard Service' https://on.cypress.io/dashboard %}. Invited users will see all projects and tests run for the organization.

## Invite a user to an organization:

1. Go the {% url "Organizations page" https://on.cypress.io/dashboard/organizations %} to select the organization you want to invite a user to.
2. Click **Users**, then **Invite User**. *Note: you must have the {% urlHash "role of 'owner' or 'admin'" User-roles %} to invite users.*
3. Fill in their email and select their {% urlHash "role" User-roles %} then click **Invite User** *Note: only owners can give other users 'owner' access.*
4. The user will receive an invitation email with a link to accept the invitation.

{% imgTag /img/dashboard/invite-user-dialog.png "Invite User dialog" %}

# User roles

Users can be assigned roles that affect their access to certain features of the {% url 'Dashboard Service' https://on.cypress.io/dashboard %}.

- **Member:** Can see the projects, runs, and keys.
- **Admin:** Can also invite, edit and delete users.
- **Owner:** Can also transfer or delete projects. Can delete and edit the organization.

The permissions for each user role for the Dashboard Service.

| Permission                                         |  |  | |
| ---------------------------------------------------|--------|-------|------|
| See test recordings of private projects            | ✅ **Member**    | ✅ **Admin**    | ✅ **Owner** |
| See record keys of projects                        | ✅ **Member**    | ✅ **Admin**    | ✅ **Owner** |
| See billing and usage information                  |        | ✅ **Admin**    | ✅ **Owner** |
| Edit billing information                           |        | ✅ **Admin**    | ✅ **Owner** |
| See users invited to organization                  |        | ✅ **Admin**    | ✅ **Owner** |
| Resend invitation to invited user                  |        | ✅ **Admin**    | ✅ **Owner** |
| Invite 'member' to organization                    |        | ✅ **Admin**    | ✅ **Owner** |
| Invite 'admin' to organization                     |        | ✅ **Admin**    | ✅ **Owner** |
| See user requests to join organization             |        | ✅ **Admin**    | ✅ **Owner** |
| Accept user requests to join organization          |        | ✅ **Admin**    | ✅ **Owner** |
| Remove 'member' from organization                  |        | ✅ **Admin**    | ✅ **Owner** |
| Remove 'admin' from organization                   |        | ✅ **Admin**    | ✅ **Owner** |
| Edit 'member' in organization                      |        | ✅ **Admin**    | ✅ **Owner** |
| Edit 'admin' in organization                       |        | ✅ **Admin**    | ✅ **Owner** |
| Edit project name                                  |        | ✅ **Admin**    | ✅ **Owner** |
| Edit project status (private/public}               |        | ✅ **Admin**    | ✅ **Owner** |
| Add or delete record keys                          |        | ✅ **Admin**    | ✅ **Owner** |
| Invite 'owner' to organization                     |        |        | ✅ **Owner** |
| Edit 'owner' in organization                       |        |        | ✅ **Owner** |
| Remove 'owner' from organization                   |        |        | ✅ **Owner** |
| Add, edit, remove user in personal organization    |        |        | ✅ **Owner** |
| Edit organization name                             |        |        | ✅ **Owner** |
| Delete organization                                |        |        | ✅ **Owner** |
| Transfer project to another organization           |        |        | ✅ **Owner** |
| Delete project                                     |        |        | ✅ **Owner** |

# User requests

Users can "request" access to a given organization. If a developer on your team has access to Cypress and your project's source code - they can request to be given access to your organization. This means instead of you having to invite team members up front, they can request access and you can choose to accept or deny them access.

{% imgTag /img/dashboard/request-access-to-organization.png "Request access to project" %}
