---
title: Dashboard Service
---

{% note info %}
# {% fa fa-graduation-cap %} What you'll learn

- How to set up a project to have its tests recorded.
- What you see in the Dashboard Service for recorded tests.
- How to manage organizations, projects, and users in the Dashboard Service.
{% endnote %}

The {% url 'Cypress Dashboard' https://on.cypress.io/dashboard %} is a service that gives you access to recorded tests - typically when running Cypress tests from your {% url 'CI provider' continuous-integration %}. The Dashboard provides you insight into what happened when your tests ran.

# Overview

***The Dashboard allows you to:***

- See the number of failed, passing, pending and skipped tests.
- Get the entire stack trace of failed tests.
- View screenshots taken when tests fail or when using {% url `cy.screenshot()` screenshot %}.
- Watch a video of your entire test run or a video clip at the point of test failure.
- See how fast your spec files ran within CI including whether they were run in parallel.
- See related groupings of tests.
- Manage who has access to your recorded test data.
- See usage details for each organization.
- Pay for your selected billing plan.

{% imgTag /img/dashboard/dashboard-runs-list.png "Dashboard Screenshot" %}

***See tests runs in the Test Runner***

Additionally we've integrated the tests run into the Cypress {% url 'Test Runner' test-runner %}. This means you can see the tests run in the *Runs* tab from within every project.

{% imgTag /img/dashboard/runs-list-in-desktop-gui.png "Runs List" %}

{% note info "Have a question you don't see answered here?"%}
{% url "We have answered some common questions about the Dashboard Service in our FAQ." dashboard-faq %}.
{% endnote %}

## Example projects

Once you log in to the {% url 'Dashboard Service' https://on.cypress.io/dashboard %} you can view any {% urlHash "public project" Public-vs-Private %}.

**Here are some of our own public projects you can view:**

- [{% fa fa-folder-open-o %} cypress-example-recipes](https://dashboard.cypress.io/#/projects/6p53jw)
- [{% fa fa-folder-open-o %} cypress-example-kitchensink](https://dashboard.cypress.io/#/projects/4b7344)
- [{% fa fa-folder-open-o %} cypress-example-todomvc](https://dashboard.cypress.io/#/projects/245obj)
- [{% fa fa-folder-open-o %} cypress-example-piechopper](https://dashboard.cypress.io/#/projects/fuduzp)

# Projects

With Cypress, you have the ability to record your project's tests.

You typically want to record when running tests in {% url 'Continuous Integration' continuous-integration %}, but you can also record your tests when running locally.

## Setup

{% note info %}
To set up your project to record, you must use the {% url "Test Runner" test-runner %}.

Make sure you {% url "install" installing-cypress %} and {% url "open" installing-cypress#Opening-Cypress %} it first!
{% endnote %}

### To set up a project to record:

{% imgTag /img/dashboard/setup-to-record.gif "Setup Project Screen" %}

1. Click on the **Runs** tab of your project within the {% url "Test Runner" test-runner %}.
2. Click **Set up Project to Record**.
3. You will need to log in to record your tests, so you will need to log in to the Cypress Dashboard here.
4. Fill in the name of your project (this is only for display purposes and can be changed later).
5. Choose who owns the project. You can personally own it or select an organization you've created. If you do not have any organizations, click **Create organization**. Organizations work just like they do in GitHub. They enable you to separate your personal and work projects. {% urlHash 'Read more about organizations' Organizations %}.
6. Choose whether this project is Public or Private.
  - **A public project** can have its recordings and runs seen by *anyone*. Typically these are open source projects.
  - **A private project** restricts its access to *{% urlHash "only users you invite" Users %}*.
7. Click **Setup Project**.
8. Now you should see a view explaining how to record your first run.
9. After setting up your project, Cypress inserted a unique {% urlHash "projectId" Identification %} into your `cypress.json`. If you're using source control, we recommend that you check your `cypress.json` including the `projectId` into source control.
10. Within {% url 'Continuous Integration' continuous-integration %}, or from your local computer's terminal, pass the displayed {% urlHash "Record Key" Identification %} while running the {% url '`cypress run`' command-line#cypress-run %} command.
  - Provide record key directly:
    ```shell
    cypress run --record --key &lt;record key&gt;
    ```

  - Or set record key as environment variable
    ```shell
    export CYPRESS_RECORD_KEY=&lt;record key&gt;
    ```
    ```shell
    cypress run --record
  ```

🎉 Your tests are now recording! As soon as tests finish running, you will see them in the {% url "Dashboard" https://on.cypress.io/dashboard %} and in the Runs tab of the {% url "Test Runner" test-runner %}.

{% imgTag /img/dashboard/dashboard-runs-list.png "Dashboard Screenshot" %}

{% imgTag /img/dashboard/runs-list-in-desktop-gui.png "Runs List" %}

## Identification

***Project ID***

Once you set up your project to record, we generate a unique `projectId` for your project and automatically insert it into your `cypress.json` file.

***The `projectId` is a 6 character string in your `cypress.json`:***

```json
{
  "projectId": "a7bq2k"
}
```

This helps us uniquely identify your project. If you manually alter this, **Cypress will no longer be able to identify your project or find the recorded builds for it**.

If you're using source control, we recommend that you check your `cypress.json` including the `projectId` into source control. If you don't want your `projectId` visible in your source code you can set it as an environment variable from your CI provider using the name `CYPRESS_PROJECT_ID`. The exact mechanism for doing so depends on your CI provider but could be as simple as:

```shell
export CYPRESS_PROJECT_ID={projectId}
```

### Record key {% fa fa-key %}

Once you're set up to record test runs, we automatically generate a *Record Key* for the project.

***A record key is a GUID that looks like this:***

```text
f4466038-70c2-4688-9ed9-106bf013cd73
```

You can create multiple Record Keys for a project, or delete existing ones from our {% url 'Dashboard' https://on.cypress.io/dashboard %}. You can also find your Record Key inside of the *Settings* tab in the Test Runner.

{% imgTag /img/dashboard/record-key-shown-in-desktop-gui-configuration.png "Record Key in Configuration Tab" %}

## Authentication

Cypress uses your `projectId` and *Record Key* together to uniquely identify projects.

{% imgTag /img/dashboard/project-id-and-record-key-shown-in-dashboard.png "ProjectID and Record Keys in Dashboard" %}

The record key is used to authenticate that your project is *allowed* to record. As long as your record key stays *private*, nobody will be able to record test runs for your project - even if they have your `projectId`.

If you have a public project you should *still* keep your record key secret. If someone knows both your record key and your `projectId`, they could record test runs for your project - which would mix up all of your results!

Think of your record key as the key that enables you to *write and create* runs. However, it has nothing to do with being able to *read or see* runs once they are recorded.

{% note warning  %}
If your Record Key is accidentally exposed, you should remove it and generate a new one from the {% url 'Dashboard Service' https://on.cypress.io/dashboard %}.
{% endnote %}

## Public vs Private

- **Public** means that anyone can see the recorded test runs for the project. It is similar to how public projects on Github, Travis CI, or CircleCI are handled. Anyone who knows your `projectId` will be able to see the recorded runs for public projects.

- **Private** means that only {% urlHash 'users' Users %} you invite to your {% urlHash 'organization' Organizations %} can see its recorded runs. Even if someone knows your `projectId`, they will not have access to your runs unless you have invited them.

### To change project access

Click into the project you'd like to change access to, then click **Settings** in the top right corner.

{% imgTag /img/dashboard/project-settings.png "project-settings" %}

Here you will see a section displaying **Access to Runs**. Choose the appropriate access you'd like to assign for the project here.

{% imgTag /img/dashboard/access-to-runs.png "access-to-runs" %}

## Transfer ownership

### Transfer project to other user or organization

You can transfer projects that you own to another {% urlHash "organization" Organizations %} you are a part of or to another user in the organization. Projects can only be transferred from the {% url 'Dashboard Service' https://on.cypress.io/dashboard %}.

1. Choose the {% url "organization" https://on.cypress.io/dashboard/organizations %} with the project you want to transfer.
2. Click into the project and click on **Settings**.
  {% imgTag /img/dashboard/project-settings.png "project-settings" %}
3. Scroll down to the **Transfer Ownership** section and click **Transfer Ownership**.
4. Select the user or organization, then click **Transfer**.
  {% imgTag /img/dashboard/transfer-ownership-of-project-dialog.png "Transfer Project dialog" %}

### Cancel project transfer

Upon transferring, you can cancel the transfer at any time by visiting the organization's projects and clicking **Cancel Transfer**.

{% imgTag /img/dashboard/cancel-transfer-of-project.png "Cancel pending transfer of project" %}

### Accept or reject transferred project

When a project is transferred to you, you will receive an email notifying you. You will be able to accept or reject the transferred project by visiting your organization's projects and clicking 'Accept' or 'Reject'.

{% imgTag /img/dashboard/accept-or-reject-transfer-of-project.png "Accept or reject a transferred project" %}

## Delete

You can delete projects you own. This will also delete all of their recorded test runs. Deleting projects can only be done from the {% url 'Dashboard Service' https://on.cypress.io/dashboard %}.

1. Click into 'Runs' in the Dashboard.
2. Click on the project you want to delete from the lefthand sidebar.
3. On this page, to the far right, click on 'Settings'.
4. At the very bottom of the Settings page click the 'Remove Project' button.

{% imgTag /img/dashboard/remove-project-dialog.png "Delete project dialog" %}

# Recorded runs

Recorded runs capture the results from your test runs.

{% note info %}
If you haven't set up your project to record {% urlHash "read here" Setup %}.
{% endnote %}

## What is recorded?

### Run details

Details of each run are displayed including:

- The number of skipped, pending, passing, and failing tests.
- The GitHub branch, pull request, author, commit sha and commit message associated with the run (if any)
- The times the run, each spec file, and test started and ended.
- What Continuous Integration the run ran in (if any) and its CI id and url.
- The operating system and version
- The browser and version
- The Cypress version

{% imgTag /img/dashboard/run-details.png "run-details" %}

### {% fa fa-file-code-o fa-fw %} Spec files

You can see the result of each spec file that ran within **Specs**. There is also the option to switch between **Timeline View** and **Bar Chart View**.

***Timeline View***

The Timeline View charts your spec files as they ran relative to each other. This is especially helpful when you want to visualize how your tests ran in {% url "parallel" parallelization %}.

{% imgTag /img/dashboard/specs-timeline-view.jpg "Specs tab with timeline view" %}

***Bar Chart View***

The Bar Chart View charts the lengths of each spec file. This view is helpful to determine which spec files or tests are running longer than others.

{% imgTag /img/dashboard/specs-barchart-view.jpg "Specs tab with bar chart view" %}

***Jump to failed tests***

If you had any failed tests, you can hover over the spec chart and click on the link to the failed test to go directly to its error message and stack trace.

{% imgTag /img/dashboard/specs-failures-popup.png "Failures popup on spec hover %}

### {% fa fa-code fa-fw %} Standard output

Standard output includes details and summaries of your tests for each spec file based on the {% url 'reporter' reporters %} you have set. By default it is the `spec` reporter.

You will also see a summary at the bottom indicating the screenshots, or videos that were uploaded during the recording.

{% imgTag /img/dashboard/standard-output-of-recorded-test-run.png "standard output" %}

***{% fa fa-picture-o fa-fw %} Screenshots***

All screenshots taken during the test run can be found in the **Screenshots** of the spec. Both screenshots taken during failures and screenshots taken using the {% url `cy.screenshot()` screenshot %} command will show up here.

***{% fa fa-video-camera fa-fw %} Videos***

The video recorded during the test run can be found under the **Video** of the spec. You can also download the video.

{% imgTag /img/dashboard/videos-of-recorded-test-run.png "Video of test runs" %}

### {% fa fa-exclamation-triangle fa-fw %} Test failures

Any tests that fail during a test run can be found under the **Failures** tab. Each failure is listed under its test title.

### Each failure displays:

- **Test title:** The title of the failed test.
- **Error:** The stack trace of the error.
- **Screenshot:** Any screenshots taken during the test.
- **Video:** The recorded video scrubbed to the point of failure in the test.

{% imgTag /img/dashboard/failures-of-recorded-run.png "failure tab" %}

# Organizations

Organizations are used to group projects and manage access to those projects.

{% imgTag /img/dashboard/organizations-listed-in-dashboard.png "Organizations" %}

***With organizations you can:***

- Create projects
- Invite users
- Transfer projects
- Pay for all of your projects usage.

## Create Org

You can create an organization from within the {% url "Dashboard Service" https://on.cypress.io/dashboard %} by going to the **Organizations** tab and clicking **{% fa fa-plus %} Add Organization**.

{% imgTag /img/dashboard/add-organization-dialog.png "Add Organization dialog" %}

## Personal Orgs

By default, every user of Cypress is given a personal organization - named after you. You cannot delete or edit the name of this default organization.

## Delete Org

You can delete organizations that you own as long as they do not have any projects in the organization. You must first transfer ownership of your projects to another organization before you can delete the organization.

{% imgTag /img/dashboard/remove-organization-dialog.png "Delete Organization" %}

# Users

## Inviting users

A user is anyone who logs in to the Dashboard Service. You can invite users to Cypress from the {% url 'Dashboard Service' https://on.cypress.io/dashboard %}. Invited users will see all projects and tests run for the organization.

### To invite a user to an organization:

1. Go the {% url "Organizations page" https://on.cypress.io/dashboard/organizations %} to select the organization you want to invite a user to.
2. Click **Users**, then **Invite User**. *Note: you must have the {% urlHash "role of 'owner' or 'admin'" User-roles %} to invite users.*
3. Fill in their email and select their {% urlHash "role" User-roles %} then click **Invite User** *Note: only 'owners can give other user's 'owner' access.*
4. The user will receive an invitation email with a link to accept the invitation.

{% imgTag /img/dashboard/invite-user-dialog.png "Invite User dialog" %}

## User roles

Users can be assigned roles that affect their access to certain features of the {% url 'Dashboard Service' https://on.cypress.io/dashboard %}.

- **Member:** Can see the projects, runs, and keys.
- **Admin:** Can also invite, edit and delete users.
- **Owner:** Can also transfer or delete projects. Can delete and edit the organization.

The permissions for each user role for the Dashboard Service.

| Permission                                         |  |  | |
| ---------------------------------------------------|--------|-------|------|
| See test recordings of private projects            | ✅ **Member**    | ✅ **Admin**    | ✅ **Owner** |
| See record keys of projects                           | ✅ **Member**    | ✅ **Admin**    | ✅ **Owner** |
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
| Add, edit, remove user in default organization |        |        | ✅ **Owner** |
| Edit organization name                             |        |        | ✅ **Owner** |
| Delete organization                                |        |        | ✅ **Owner** |
| Transfer project to another organization           |        |        | ✅ **Owner** |
| Delete project                                     |        |        | ✅ **Owner** |

## User requests

Users can "request" access to a given organization. If a developer on your team has access to Cypress and your project's source code - they can request to be given access to your organization. This means instead of you having to invite team members up front, they can request access and you can choose to accept or deny them access.

# Open Source Plan

To support the community, we provide the Open Source (OSS) plan for public projects to take advantage of our Dashboard Service with unlimited test runs. To qualify, your project needs just two things:
- Your project is a non-commercial entity
- Source code for your project is available in a public location with an {% url "OSI-approved license" https://opensource.org/licenses %}

## Requesting OSS Plan for an Org

Follow the following process to request an OSS plan for your project:

1. {% url "Login" https://on.cypress.io/dashboard %} to the Cypress Dashboard, or {% url "create an account" https://on.cypress.io/dashboard %} if you are a new user.
  {% imgTag /img/dashboard/oss-plan-1-login.png "Login or Create Account" "no-border" %}
2. Go the {% url "Organizations page" https://on.cypress.io/dashboard/organizations %} to select the organization you want to associate with an OSS plan. If you have no organizations, you can create one by clicking the **+ Add Organization** button.
> **Note**: Personal organizations cannot be used with an OSS plan.
  {% imgTag /img/dashboard/oss-plan-2-select-org.png "Select or add organization" "no-border" %}
3. Go to the **Billing & Usage** page, and then click on the **Apply for an open source plan** link at the bottom of the page.
  {% imgTag /img/dashboard/oss-plan-3-billing.png "Click Apply for an open source plan" "no-border" %}
4. Fill in and submit the OSS plan request form.
  {% imgTag /img/dashboard/oss-plan-4-apply.png "OSS plan request form" "no-border" %}
5. You'll receive an email confirming your request. The Cypress Team will review your request and, if approved, an OSS plan subscription will be applied to your organization.

If you have any questions regarding the OSS plan, please feel free [contact us](mailto:hello@cypress.io).
