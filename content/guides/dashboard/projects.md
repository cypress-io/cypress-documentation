---
title: Projects
---

With Cypress, you have the ability to record your project's tests.

You typically want to record when running tests in
[Continuous Integration](/guides/continuous-integration/introduction), but you
can also record your tests when running locally.

## Setup

<Alert type="info">

To set up your project to record, you must use
[Cypress](/guides/core-concepts/cypress-app).

Make sure you [install](/guides/getting-started/installing-cypress) and
[open](/guides/getting-started/opening-the-app) it first!

</Alert>

### Set up a project to record

1. Click on the **Runs** tab of your project within
   [Cypress](/guides/core-concepts/cypress-app).
2. Click **Connect to Dashboard**.
3. You will need to log in to record your tests, so you'll be prompted to log in
   to the Cypress Dashboard here if you haven't already done so.
   <DocsImage src="/img/dashboard/projects/setup-a-project-1.png" alt="Connect to Dashboard" no-border></DocsImage>
4. Choose who owns the project. You can personally own it or select an
   organization you're a member of. If you don't have any organizations, click
   **Create organization**. Organizations work just like they do in GitHub and
   enable you to separate your personal and work projects.
   [Read more about organizations](/guides/dashboard/organizations).
   <DocsImage src="/img/dashboard/projects/setup-a-project-2.png" alt="Choose an Organization" no-border></DocsImage>
5. If you don't have any existing projects, you'll have the opportunity to
   create a new one here. If you have existing projects and want to create a new
   one, you can click "Create a new project" to make a new one.

- Fill in the name of your project (this is only for display purposes and can be
  changed later).
- Choose whether this project is Public or Private.
  - **A public project** can have its recordings and runs seen by _anyone_.
    Typically these are open source projects.
  - **A private project** restricts its access to
    _[only users you invite](/guides/dashboard/users)_.

<DocsImage src="/img/dashboard/projects/setup-a-project-3.png" alt="Create a New Project" no-border></DocsImage>

6. Alternatively, if you've already created a project in the Dashboard, you can
   link your project by selecting it from the dropdown. Make sure to select a
   clean project that has not previously been linked to an existing project.
   <DocsImage src="/img/dashboard/projects/setup-a-project-4.png" alt="Choose a Project" no-border></DocsImage>
7. Click **Setup Project**.
8. Now you should see a view explaining how to record your first run with your
   record key.
   <DocsImage src="/img/dashboard/projects/setup-a-project-5.png" alt="Record Instructions" no-border></DocsImage>
9. After setting up your project, Cypress inserts a unique
   [projectId](#Identification) into your Cypress configuration file. If you're
   using source control, we recommend that you check your configuration file,
   including the `projectId`, into source control.
10. Within [Continuous Integration](/guides/continuous-integration/introduction)
    or from your local computer's terminal pass the displayed
    [Record Key](#Identification) while running the
    [cypress run](/guides/guides/command-line#cypress-run) command.

- Provide record key directly:

  ```shell
  cypress run --record --key <record key>
  ```

- Or set record key as environment variable
  ```shell
  export CYPRESS_RECORD_KEY=<record key>
  ```
  ```shell
  cypress run --record
  ```

🎉 Your tests are now recording! As soon as tests finish running, you will see
them in the [Dashboard](https://on.cypress.io/dashboard) and in the Runs tab of
[Cypress](/guides/core-concepts/cypress-app).

<DocsImage src="/img/dashboard/dashboard-runs-list.png" alt="Dashboard Screenshot" ></DocsImage>

<DocsImage src="/img/dashboard/runs-list-in-desktop-gui.png" alt="Runs List" ></DocsImage>

## Identification

Cypress uses your [projectId](#Project-ID) and [Record Key](#Record-key)
together to uniquely identify projects.

### Project ID

Once you set up your project to record, we generate a unique `projectId` for
your project and automatically insert it into your Cypress configuration file.

#### The `projectId` is a 6 character string in your Cypress configuration

:::cypress-config-example

```js
{
  projectId: 'a7bq2k'
}
```

:::

This helps us uniquely identify your project. If you manually alter this,
**Cypress will no longer be able to identify your project or find the recorded
builds for it**.

If you're using source control, we recommend that you check your Cypress
configuration file, including the `projectId`, into source control. If you don't
want your `projectId` visible in your source code you can set it as an
environment variable using the name `CYPRESS_PROJECT_ID`. The exact mechanism
for doing so depends on your system but could be something like:

```shell
export CYPRESS_PROJECT_ID={projectId}
```

### Record key

The record key is used to authenticate that your project is _allowed_ to record
tests to the Dashboard Service. As long as your record key stays _private_,
nobody will be able to record test runs for your project - even if they have
your `projectId`.

Think of your record key as the key that enables you to _write and create_ runs.
However, it has nothing to do with being able to _read or see_ runs once they
are recorded.

<Alert type="warning">

<strong class="alert-header">Exposing a record key</strong>

Anyone that has access to both the `projectId` and the record key of a project
can record runs to that organization's project in the Dashboard.

**You would not want people outside of your team running tests because:**

1. **This could drive up the number of tests you've run.** Since Cypress bills
   based on the number of recorded tests - this means they can use up all
   allotted tests and there would be consequences to that.
2. **They can write any data they want to your Cypress Dashboard.** They could
   edit the test suite so that recorded tests record different things than the
   project's original intent. This could including visiting different websites
   and generating videos of visiting those websites, for example.

If a record key is exposed you should [delete it](#Delete-record-key) and
[create a new record key](#Create-new-record-key). Deleted keys will be invalid;
If a project is run with a deleted key it will not be able to record.

You can set your record key as an environment variable to help protect it. Learn
more [here](/guides/continuous-integration/introduction#Environment-variables).

</Alert>

Once you're set up to record test runs, we automatically generate a _Record Key_
for the project.

#### A record key is a GUID that looks like this

```text
f4466038-70c2-4688-9ed9-106bf013cd73
```

You can create multiple Record Keys for a project, or delete existing ones from
our [Dashboard](https://on.cypress.io/dashboard).

<DocsImage src="/img/dashboard/record-keys-in-project-settings-dashboard.png" alt="Record key in project settings" ></DocsImage>

You can also find your Record Key inside of the _Settings_ tab in the Cypress
App.

<DocsImage src="/img/dashboard/record-key-shown-in-desktop-gui-configuration.jpg" alt="Record Key in Configuration Tab" ></DocsImage>

## Record keys

See [Record key](#Record-key) for a full description of how the record keys are
used.

### Create new record key

1. Go to your organization's projects page.
2. Select the project you want to change access to.
   <DocsImage src="/img/dashboard/select-cypress-project.png" alt="Select a project" ></DocsImage>
3. Go to the project's **Settings** page.
   <DocsImage src="/img/dashboard/visit-project-settings.png" alt="Visit project settings" ></DocsImage>
4. Here you will see a **Record Keys** section
   <DocsImage src="/img/dashboard/record-keys-in-project-settings-dashboard.png" alt="Record keys in Dashboard" ></DocsImage>
5. Click **Create New Key**. A new key will be automatically generated for your
   project.

### Delete record key

1. Go to your organization's projects page.
2. Select the project you want to change access to.
   <DocsImage src="/img/dashboard/select-cypress-project.png" alt="Select a project" ></DocsImage>
3. Go to the project's **Settings** page.
   <DocsImage src="/img/dashboard/visit-project-settings.png" alt="Visit project settings" ></DocsImage>
4. Here you will see a **Record Keys** section
   <DocsImage src="/img/dashboard/record-keys-in-project-settings-dashboard.png" alt="Record keys in Dashboard" ></DocsImage>
5. Click **Delete** beside the record key you want to delete.

## Parallelization settings

### Run completion delay

You can edit the number of seconds that a run will wait for new groups to join
before transitioning to 'completed'. See our
[parallelization guide](/guides/guides/parallelization#Run-completion-delay) to
learn more.

<DocsImage src="/img/dashboard/run-completion-delay.jpg" alt="Run completion delay settings" ></DocsImage>

## GitHub Integration

You can integrate your project with GitHub and edit its settings from within the
project settings page.

<DocsImage src="/img/dashboard/visit-project-settings.png" alt="Visit project settings" ></DocsImage>

See our [GitHub Integration guide](/guides/dashboard/github-integration) to
learn more.

## Slack Integration

You can integrate your project with Slack and edit its settings from within the
project settings page.

<DocsImage src="/img/dashboard/visit-project-settings.png" alt="Visit project settings" ></DocsImage>

See our [Slack Integration guide](/guides/dashboard/slack-integration) to learn
more.

## README Badges

README badges allow you to increase visibility of your project's test status and
test count to other developers viewing your project's README file.

### Create a README badge

1. In your Cypress Dashboard account, select the project for which you’d like to
   create a README badge.
1. On the Project Settings page, scroll down to the README Badges section and
   click “Configure Badge”.
   <DocsImage src="/img/dashboard/badges/dashboard-badge-configure-button.png" alt="README Badge configure button" ></DocsImage>

- **Note**: README badges are currently only available for public projects.

1. A configuration modal will appear. The Project ID will be pre-filled with the
   ID associated with the project you selected. You can choose to designate a
   specific branch, or leave this field blank to always use the latest build in
   the project.
1. Next, style your badge. Flat is the default styling and is most commonly
   used, but 5 style options are available.
1. Select the badge type to change the amount and type of information that’s
   displayed. Simple status will show only whether tests are passing or failing.
   Detailed status will show the number of tests that were passed, failed, or
   skipped. Test count will show how many tests are included in your project.
1. Once you’ve selected all your settings, check out the preview and make sure
   everything looks just the way you like it.
1. 🎉 Your badge is ready to be embedded. Copy the markdown at the bottom of the
   Configure Badge modal, and embed it in your project’s README file for
   everyone to see!

<DocsImage src="/img/dashboard/badges/dashboard-badge-configuration.png" alt="README Badge configuration form" ></DocsImage>

See also
[Highlight your project’s test status with Cypress README badges](https://www.cypress.io/blog/2020/09/02/highlight-your-projects-test-status-with-cypress-readme-badges/)
announcement.

## Access to Runs

Visit your project settings to see who has access to your project's runs.

<DocsImage src="/img/dashboard/visit-project-settings.png" alt="Visit project settings" ></DocsImage>

### Public vs Private

- **Public** means that anyone can see the recorded test runs for the project.
  It is similar to how public projects on GitHub, Travis CI, or CircleCI are
  handled. Anyone who knows your `projectId` will be able to see the recorded
  runs for public projects.

- **Private** means that only [users](/guides/dashboard/users) you invite to
  your [organization](/guides/dashboard/organizations) can see its recorded
  runs. Even if someone knows your `projectId`, they will not have access to
  your runs unless you have invited them.

### Change project access

1. Go to your organization's projects page.
2. Select the project you want to change access to.
   <DocsImage src="/img/dashboard/select-cypress-project.png" alt="Select a project" ></DocsImage>
3. Go to the project's **Settings** page.
   <DocsImage src="/img/dashboard/visit-project-settings.png" alt="Visit project settings" ></DocsImage>
4. Here you will see a section displaying **Access to Runs**. Choose the
   appropriate access you'd like to assign for the project here.
   <DocsImage src="/img/dashboard/access-to-runs.png" alt="access-to-runs" ></DocsImage>

## Transfer ownership

### Transfer project to other user or organization

You can transfer projects that you own to another
[organization](/guides/dashboard/organizations) you are a part of or to another
user in the organization. Projects can only be transferred from the
[Dashboard Service](https://on.cypress.io/dashboard).

1. Select your organization in the organization switcher.
2. Select the project you wish to transfer.
   <DocsImage src="/img/dashboard/select-cypress-project.png" alt="Select a project" ></DocsImage>
3. Go to the project's **Settings** page.
   <DocsImage src="/img/dashboard/visit-project-settings.png" alt="Visit project settings" ></DocsImage>
4. Scroll down to the **Transfer Ownership** section and click **Transfer
   Ownership**.
   <DocsImage src="/img/dashboard/transfer-ownership-button.png" alt="Transfer ownership button" ></DocsImage>
5. Select the user or organization, then click **Transfer**.
   <DocsImage src="/img/dashboard/transfer-ownership-of-project-dialog.png" alt="Transfer Project dialog" ></DocsImage>

### Cancel project transfer

Upon transferring, you can cancel the transfer at any time by visiting the
organization's projects and clicking **Cancel Transfer**.

<DocsImage src="/img/dashboard/cancel-transfer-of-project.png" alt="Cancel pending transfer of project" ></DocsImage>

### Accept or reject transferred project

When a project is transferred to you, you will receive an email notifying you.
You will be able to accept or reject the transferred project by clicking the
notification in the sidebar and clicking 'Accept' or 'Reject'.

<DocsImage src="/img/dashboard/see-pending-transfer.png" alt="See pending transfer" ></DocsImage>

<DocsImage src="/img/dashboard/accept-or-reject-transfer-of-project.png" alt="Accept or reject a transferred project" ></DocsImage>

## Delete Project

You can delete projects you own. This will also delete all of their recorded
test runs. Deleting projects can only be done from the
[Dashboard Service](https://on.cypress.io/dashboard).

1. Select your organization in the organization switcher.
2. Select the project you want to remove.
   <DocsImage src="/img/dashboard/select-cypress-project.png" alt="Select a project" ></DocsImage>
3. Go to the project's **Settings** page.
   <DocsImage src="/img/dashboard/visit-project-settings.png" alt="Visit project settings" ></DocsImage>
4. At the very bottom of the Settings page click the **Remove Project** button.
   <DocsImage src="/img/dashboard/remove-project-dialog.png" alt="Delete project dialog" ></DocsImage>
5. Confirm that you want to delete the project by clicking **Yes, Remove
   Project**.
