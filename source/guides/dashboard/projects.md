---
title: Projects
---

With Cypress, you have the ability to record your project's tests.

You typically want to record when running tests in {% url 'Continuous Integration' continuous-integration %}, but you can also record your tests when running locally.

# Setup

{% note info %}
To set up your project to record, you must use the {% url "Test Runner" test-runner %}.

Make sure you {% url "install" installing-cypress %} and {% url "open" installing-cypress#Opening-Cypress %} it first!
{% endnote %}

## Set up a project to record:

{% imgTag /img/dashboard/setup-to-record.gif "Setup Project Screen" %}

1. Click on the **Runs** tab of your project within the {% url "Test Runner" test-runner %}.
2. Click **Set up Project to Record**.
3. You will need to log in to record your tests, so you will need to log in to the Cypress Dashboard here.
4. Fill in the name of your project (this is only for display purposes and can be changed later).
5. Choose who owns the project. You can personally own it or select an organization you've created. If you do not have any organizations, click **Create organization**. Organizations work just like they do in GitHub. They enable you to separate your personal and work projects. {% url 'Read more about organizations' organizations %}.
6. Choose whether this project is Public or Private.
  - **A public project** can have its recordings and runs seen by *anyone*. Typically these are open source projects.
  - **A private project** restricts its access to *{% url "only users you invite" users %}*.
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

# Identification

Cypress uses your {% urlHash "`projectId`" Project-ID %} and {% urlHash "Record Key" Record-key %} together to uniquely identify projects.

## Project ID

Once you set up your project to record, we generate a unique `projectId` for your project and automatically insert it into your `cypress.json` file.

### The `projectId` is a 6 character string in your `cypress.json`

```json
{
  "projectId": "a7bq2k"
}
```

This helps us uniquely identify your project. If you manually alter this, **Cypress will no longer be able to identify your project or find the recorded builds for it**.

If you're using source control, we recommend that you check your `cypress.json`, including the `projectId`, into source control. If you don't want your `projectId` visible in your source code you can set it as an environment variable using the name `CYPRESS_PROJECT_ID`. The exact mechanism for doing so depends on your system but could be something like:

```shell
export CYPRESS_PROJECT_ID={projectId}
```

## Record key

The record key is used to authenticate that your project is *allowed* to record tests to the Dashboard Service. As long as your record key stays *private*, nobody will be able to record test runs for your project - even if they have your `projectId`.

Think of your record key as the key that enables you to *write and create* runs. However, it has nothing to do with being able to *read or see* runs once they are recorded.

{% note warning "Exposing a record key" %}
Anyone that has access to both the `projectId` and the record key of a project can record runs to that organization's project in the Dashboard.

**You would not want people outside of your team running tests because:**

1. **This could drive up the number of tests you've run.** Since Cypress bills based on the number of recorded tests - this means they can use up all allotted tests and there would be consequences to that.
2. **They can write any data they want to your Cypress Dashboard.** They could edit the test suite so that recorded tests record different things than the project's original intent. This could including visiting different websites and generating videos of visiting those websites, for example.

If a record key is exposed you should {% urlHash "delete it" Delete-record-key %} and {% urlHash "create a new record key" Create-new-record-key %}. Deleted keys will be invalid; If a project is run with a deleted key it will not be able to record.

You can set your record key as an environment variable to help protect it. Learn more {% url "here" continuous-integration#Environment-variables %}.

{% endnote %}

Once you're set up to record test runs, we automatically generate a *Record Key* for the project.

### A record key is a GUID that looks like this

```text
f4466038-70c2-4688-9ed9-106bf013cd73
```

You can create multiple Record Keys for a project, or delete existing ones from our {% url 'Dashboard' https://on.cypress.io/dashboard %}.

{% imgTag /img/dashboard/record-keys-in-project-settings-dashboard.png "Record key in project settings" %}

You can also find your Record Key inside of the *Settings* tab in the Test Runner.

{% imgTag /img/dashboard/record-key-shown-in-desktop-gui-configuration.jpg "Record Key in Configuration Tab" %}

# Record keys

See {% urlHash "Record key" Record-key %} for a full description of how the record keys are used.

## Create new record key

1. Go to your organization's projects page.
2. Select the project you want to change access to.
  {% imgTag /img/dashboard/select-cypress-project.png "Select a project" %}
3. Go to the project's **Settings** page.
  {% imgTag /img/dashboard/visit-project-settings.png "Visit project settings" %}
4. Here you will see a **Record Keys** section
  {% imgTag /img/dashboard/record-keys-in-project-settings-dashboard.png "Record keys in Dashboard" %}
5. Click **Create New Key**. A new key will be automatically generated for your project.

## Delete record key

1. Go to your organization's projects page.
2. Select the project you want to change access to.
  {% imgTag /img/dashboard/select-cypress-project.png "Select a project" %}
3. Go to the project's **Settings** page.
  {% imgTag /img/dashboard/visit-project-settings.png "Visit project settings" %}
4. Here you will see a **Record Keys** section
  {% imgTag /img/dashboard/record-keys-in-project-settings-dashboard.png "Record keys in Dashboard" %}
5. Click **Delete** beside the record key you want to delete.

# Parallelization settings

## Run completion delay

You can edit the number of seconds that a run will wait for new groups to join before transitioning to 'completed'. See our {% url "parallelization guide" parallelization#Run-completion-delay %} to learn more.

{% imgTag /img/dashboard/run-completion-delay.jpg "Run completion delay settings" %}

# GitHub Integration

You can integrate your project with GitHub and edit its settings from within the project settings page.

{% imgTag /img/dashboard/visit-project-settings.png "Visit project settings" %}

See our {% url "GitHub Integration guide" github-integration %} to learn more.

# Slack Integration

You can integrate your project with Slack and edit its settings from within the project settings page.

{% imgTag /img/dashboard/visit-project-settings.png "Visit project settings" %}

See our {% url "Slack Integration guide" slack-integration %} to learn more.

# Access to Runs

Visit your project settings to see who has access to your project's runs.

{% imgTag /img/dashboard/visit-project-settings.png "Visit project settings" %}

## Public vs Private

- **Public** means that anyone can see the recorded test runs for the project. It is similar to how public projects on GitHub, Travis CI, or CircleCI are handled. Anyone who knows your `projectId` will be able to see the recorded runs for public projects.

- **Private** means that only {% url 'users' users %} you invite to your {% url 'organization' organizations %} can see its recorded runs. Even if someone knows your `projectId`, they will not have access to your runs unless you have invited them.

## Change project access

1. Go to your organization's projects page.
2. Select the project you want to change access to.
  {% imgTag /img/dashboard/select-cypress-project.png "Select a project" %}
3. Go to the project's **Settings** page.
  {% imgTag /img/dashboard/visit-project-settings.png "Visit project settings" %}
4. Here you will see a section displaying **Access to Runs**. Choose the appropriate access you'd like to assign for the project here.
  {% imgTag /img/dashboard/access-to-runs.png "access-to-runs" %}

# Transfer ownership

## Transfer project to other user or organization

You can transfer projects that you own to another {% url "organization" organizations %} you are a part of or to another user in the organization. Projects can only be transferred from the {% url 'Dashboard Service' https://on.cypress.io/dashboard %}.

1. Select your organization in the organization switcher.
2. Select the project you wish to transfer.
  {% imgTag /img/dashboard/select-cypress-project.png "Select a project" %}
3. Go to the project's **Settings** page.
  {% imgTag /img/dashboard/visit-project-settings.png "Visit project settings" %}
4. Scroll down to the **Transfer Ownership** section and click **Transfer Ownership**.
  {% imgTag /img/dashboard/transfer-ownership-button.png "Transfer ownership button" %}
5. Select the user or organization, then click **Transfer**.
  {% imgTag /img/dashboard/transfer-ownership-of-project-dialog.png "Transfer Project dialog" %}

## Cancel project transfer

Upon transferring, you can cancel the transfer at any time by visiting the organization's projects and clicking **Cancel Transfer**.

{% imgTag /img/dashboard/cancel-transfer-of-project.png "Cancel pending transfer of project" %}

## Accept or reject transferred project

When a project is transferred to you, you will receive an email notifying you. You will be able to accept or reject the transferred project by clicking the notification in the sidebar and clicking 'Accept' or 'Reject'.

{% imgTag /img/dashboard/see-pending-transfer.png "See pending transfer" %}

{% imgTag /img/dashboard/accept-or-reject-transfer-of-project.png "Accept or reject a transferred project" %}

# Delete Project

You can delete projects you own. This will also delete all of their recorded test runs. Deleting projects can only be done from the {% url 'Dashboard Service' https://on.cypress.io/dashboard %}.

1. Select your organization in the organization switcher.
2. Select the project you want to remove.
  {% imgTag /img/dashboard/select-cypress-project.png "Select a project" %}
3. Go to the project's **Settings** page.
  {% imgTag /img/dashboard/visit-project-settings.png "Visit project settings" %}
4. At the very bottom of the Settings page click the **Remove Project** button.
  {% imgTag /img/dashboard/remove-project-dialog.png "Delete project dialog" %}
5. Confirm that you want to delete the project by clicking **Yes, Remove Project**.
