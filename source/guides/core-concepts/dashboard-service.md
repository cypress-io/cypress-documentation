---
title: Dashboard Service

---

{% note info %}
# {% fa fa-graduation-cap %} What You'll Learn

- How to set up a project to have its tests recorded.
- What you see in the Dashboard Service for recorded tests.
- How to manage organizations, projects, and users in the Dashboard Service.
{% endnote %}

The {% url 'Cypress Dashboard' https://on.cypress.io/dashboard %} is a service that gives you access to recorded tests - typically when running Cypress tests from your {% url 'CI provider' continuous-integration %}. The Dashboard provides you insight into what happened when your tests ran.

# Overview

***The Dashboard allows you to:***

- See the number of failed, pending and passing tests.
- Get the entire stack trace of failed tests.
- View screenshots taken when tests fail or when using {% url `cy.screenshot()` screenshot %}.
- Watch a video of your entire test run or a video clip at the point of test failure.
- Manage who has access to your recorded test data.

{% img /img/dashboard/dashboard-runs-list.png "Dashboard Screenshot" %}

***See Tests Runs in the Test Runner***

Additionally we've integrated the tests run into the Cypress {% url 'Test Runner' test-runner %}. This means you can see the tests run in the *Runs* tab from within every project.

![Runs List](/img/dashboard/runs-list-in-desktop-gui.png)

{% note info "Have a question you don't see answered here?"%}
{% url "We have answered some common questions about the Dashboard Service in our FAQ." dashboard-faq %}.
{% endnote %}

## Example Projects

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

***To set up a project to record:***

![Setup Project Screen](/img/dashboard/setup-to-record.gif)

1. Click on the **Runs** tab of your project within the {% url "Test Runner" test-runner %}.
2. You will need to log in to record your tests, so you may need to log in with GitHub here.
3. Click **Setup Project to Record**.
4. Fill in the name of your project (this is only for display purposes and can be changed later).
5. Choose who owns the project. You can personally own it or select an organization you've created. Organizations work just like they do in Github. They enable you to separate your personal and work projects. {% urlHash 'Read more about organizations' Organizations %}.
6. Choose whether this project is Public or Private.
  - **A public project** can have its recordings and runs seen by *anyone*. Typically these are open source projects.
  - **A private project** restricts its access to *{% urlHash "only users you invite" Manage-users %}*.
7. Click **Setup Project**.
8. Now you should see a view explaining how to record your first run.
9. After setting up your project, Cypress inserted a unique {% urlHash "projectId" Identification %} into your `cypress.json`. You will want to check your `cypress.json` into source control.
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

🎉 Your tests are now recording! As soon as tests finish running, you will see them in the {% url 'Dashboard' https://on.cypress.io/dashboard %} and in the Runs tab of the {% url "Test Runner" test-runner %}.

{% img /img/dashboard/dashboard-runs-list.png "Dashboard Screenshot" %}

{% img /img/dashboard/runs-list-in-desktop-gui.png "Runs List" %}

## Identification

***Project ID***

Once you set up your project to record, we generate a unique `projectId` for your project and automatically insert it into your `cypress.json` file.

***The `projectId` is a 6 character string in your `cypress.json`:***

```json
{
  "projectId": "a7bq2k"
}
```

This helps us uniquely identify your project. If you manually alter this, **Cypress will no longer be able to identify your project or find the recorded builds for it**. We recommend that you check your `cypress.json` including the `projectId` into source control.

***Record Key {% fa fa-key %}***

Once you're set up to record test runs, we automatically generate a *Record Key* for the project.

***A record key is a GUID that looks like this:***

```text
f4466038-70c2-4688-9ed9-106bf013cd73
```

You can create multiple Record Keys for a project, or delete existing ones from our {% url 'Dashboard' https://on.cypress.io/dashboard %}. You can also find your Record Key inside of the *Settings* tab in the Test Runner.

{% img /img/dashboard/record-key-shown-in-desktop-gui-configuration.png "Record Key in Configuration Tab" %}

***Authentication***

Cypress uses your `projectId` and *Record Key* together to uniquely identify projects.

{% img /img/dashboard/project-id-and-record-key-shown-in-dashboard.png "ProjectID and Record Keys in Dashboard" %}

The record key is used to authenticate that your project is *allowed* to record. As long as your record key stays *private*, nobody will be able to record test runs for your project - even if they have your `projectId`.

If you have a public project you should *still* keep your record key secret. If someone knows both your record key and your `projectId`, they could record test runs for your project - which would mix up all of your results!

Think of your record key as the key that enables you to *write and create* runs. However, it has nothing to do with being able to *read or see* runs once they are recorded.

{% note warning  %}
If your Record Key is accidentally exposed, you should remove it and generate a new one from the {% url 'Dashboard Service' https://on.cypress.io/dashboard %}.
{% endnote %}

## Public vs Private

- **Public** means that anyone can see the recorded test runs for the project. It is similar to how public projects on Github, Travis CI, or CircleCI are handled. Anyone who knows your `projectId` will be able to see the recorded runs for public projects.

- **Private** means that only {% urlHash 'users' Manage-users %} you invite to your {% urlHash 'organization' Organizations %} can see its recorded runs. Even if someone knows your `projectId`, they will not have access to your runs unless you have invited them.

## Transfer ownership

You can transfer projects that you own to another {% urlHash "organization" Organizations %} you are a part of or to another user in the organization. Projects can only be transferred from the {% url 'Dashboard Service' https://on.cypress.io/dashboard %}.

![Transfer Project dialog](/img/dashboard/transfer-ownership-of-project-dialog.png)

## Delete

You can delete projects you own. This will also delete all of their recorded test runs. Deleting projects can only be done from the {% url 'Dashboard Service' https://on.cypress.io/dashboard %}.

![Delete project dialog](/img/dashboard/remove-project-dialog.png)

# Recorded runs

Recorded runs capture the results from your test runs.

{% note info %}
If you haven't set up your project to record {% urlHash "read here" Setup %}.
{% endnote %}

## What is recorded?

***{% fa fa-code fa-fw %} Standard Output***

Standard output includes details and summaries of your tests based on the {% url 'reporter' reporters %} you have set. By default it is the `spec` reporter.

You will also see a summary at the bottom indicating the files, screenshots, or videos that were uploaded during the recording.

![output](/img/dashboard/standard-output-of-recorded-test-run.png)

***{% fa fa-exclamation-triangle fa-fw %} Test Failures***

Any tests that fail during a test run can be found under the **Failures** tab. Each failure is listed under its test title.

***Each failure displays:***

- **Test title:** The title of the failed test.
- **Error:** The stack trace of the error.
- **Screenshot:** Any screenshots taken during the test.
- **Video:** The recorded video scrubbed to the point of failure in the test.

![failures](/img/dashboard/failures-of-recorded-run.png)

***{% fa fa-picture-o fa-fw %} Screenshots***

All screenshots taken during the test run can be found in **Screenshots** of the spec. Both screenshots taken during failures and screenshots taken using the {% url `cy.screenshot()` screenshot %} command will show up here. Each screenshot includes the application under test as well as the Cypress Command Log.

***{% fa fa-video-camera fa-fw %}  Videos***

Any videos recorded during the test run can be found under in **Videos** of the spec. You can also download the video.

![Video of tests](/img/dashboard/videos-of-recorded-test-run.png)

# Organizations

Organizations are used to group projects and manage access to those projects.

![Organizations](/img/dashboard/organizations-listed-in-dashboard.png)

***With organizations you can:***

- Create projects
- Invite users
- Transfer projects

Once out of beta, organizations will also display usage and allow you to handle billing.

## Create

You can create an organization from within the {% url "Dashboard Service" https://on.cypress.io/dashboard %} by going to the **Organizations** tab and clicking **{% fa fa-plus %} Add Organization**.

![Add Organization dialog](/img/dashboard/add-organization-dialog.png)

## Personal orgs

By default, every user of Cypress is given a personal organization - named after you. You cannot delete or edit the name of this default organization.

## Manage users

***Inviting users***

You can invite users to Cypress from the {% url 'Dashboard Service' https://on.cypress.io/dashboard %}. Invited users will see all projects and tests run for the organization.

**To invite a user to an organization:**

1. Click into the organization you want the user to access.
2. Click **Users**, then **Invite User**. *Note: you must have the role of 'owner' or 'admin' to invite users.*
3. Fill in their email and select their role then click 'Invite User' *Note: only 'owners can give other user's 'owner' access.*
4. The user will receive an invite email with a link to accept the invitation.

![Invite User dialog](/img/dashboard/invite-user-dialog.png)

***User roles***

Users can be assigned roles that affect their access to certain features of the {% url 'Dashboard Service' https://on.cypress.io/dashboard %}.

- **Member:** Can see the projects, runs, and keys.
- **Admin:** Can also invite, edit and delete users.
- **Owner:** Can also transfer or delete projects. Can delete and edit the organization.

***User requests***

Users can "request" access to a given organization. If a developer on your team has access to Cypress and your project's source code - they can request to be given access to your organization. This means instead of you having to invite team members up front, they can simply request access and you can choose to accept or deny them access.

## Delete Org

You can delete organizations that you own as long as they do not have any projects in the organization. You must first transfer ownership of your projects to another organization before you can delete the organization.

![Delete Organization](/img/dashboard/remove-organization-dialog.png)
