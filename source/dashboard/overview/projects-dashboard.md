---
title: Projects
comments: false
---

With Cypress, you have the ability to record the tests for each project you work in.

You typically want to record when running tests in {% url 'Continuous Integration' continuous-integration %}, but you can also record your tests when running locally.

{% note info %}
To set up your project to record, you must use the Test Runner.

Make sure you {% url "install" installing-cypress %} and {% url "open" installing-cypress#Opening-Cypress %} it first!
{% endnote %}

# Setup

***To set up a project to record:***

![Setup Project Screen](/img/dashboard/setup-to-record.gif)

1. Click on the "Runs" tab of your project within the Test Runner.
2. You will need to log in to record your tests, so you may need to log in with GitHub here.
3. Click "Setup Project to Record".
4. Fill in the name of your project (this is only for display purposes and can be changed later).
5. Choose who owns the project. You can personally own it or select an organization you've created. Organizations work just like they do in Github. They enable you to separate your personal and work projects. {% url 'Read more about organizations' organizations-dashboard %}.
6. Choose whether this project is Public or Private.
  - **A public project** can have its recordings and runs seen by *anyone*. Typically these are open source projects.
  - **A private project** restricts its access to *{% url "only users you invite" organizations-dashboard#Inviting-Users %}*.
7. Click "Setup Project".
8. Now you should see a view explaining how to record your first run.
9. After setting up your project, Cypress inserted a unique {% urlHash "projectId" Project-ID %} into your `cypress.json`. You will want to check your `cypress.json` into source control.
10. Within {% url 'Continuous Integration' continuous-integration %}, or from your local computer's terminal, pass the displayed {% urlHash "Record Key" Record-Key %} while running the {% url '`cypress run`' command-line#cypress-run %} command.
  - Provide record key directly:
    ```shell
    cypress run --record --key abc-key-123
    ```

  - Or set record key as environment variable
    ```shell
    export CYPRESS_RECORD_KEY=abc-key-123
    ```
    ```shell
    cypress run --record
  ```

🎉 Your tests are now recording! As soon as tests finish running, you will see them in the {% url 'Dashboard' https://on.cypress.io/dashboard %} and in the Runs tab of the Test Runner.

![Dashboard Screenshot](/img/dashboard/dashboard-runs-list.png)

![Runs List](/img/dashboard/runs-list-in-desktop-gui.png)

# Project ID

Once you set up your project to record, we generate a unique `projectId` for your project and automatically insert it into your `cypress.json` file.

***The `projectId` is a 6 character string in your `cypress.json`:***

```json
{
  "projectId": "a7bq2k"
}
```

This helps us uniquely identify your project. If you manually alter this, **Cypress will no longer be able to identify your project or find the recorded builds for it**. We recommend that you check your `cypress.json` including the `projectId` into source control.

# Record Key {% fa fa-key %}

Once you're set up to record test runs, we automatically generate a *Record Key* for the project.

***A record key is a GUID that looks like this:***

```text
f4466038-70c2-4688-9ed9-106bf013cd73
```

You can create multiple Record Keys for a project, or delete existing ones from our {% url 'Dashboard' https://on.cypress.io/dashboard %}. You can also find your Record Key inside of the *Settings* tab on the Desktop App.

![Record Key in Configuration Tab](/img/dashboard/record-key-shown-in-desktop-gui-configuration.png)

# Authentication

Cypress uses your `projectId` and *Record Key* together to uniquely identify projects.

![ProjectID and Record Keys in Dashboard](/img/dashboard/project-id-and-record-key-shown-in-dashboard.png)

The record key is used to authenticate that your project is *allowed* to record. As long as your record key stays *private*, nobody will be able to record test runs for your project - even if they have your `projectId`.

If you have a public project you should *still* keep your record key secret. If someone knows both your record key and your `projectId`, they could record test runs for your project - which would mix up all of your results!

Think of your record key as the key that enables you to *write and create* runs. However, it has nothing to do with being able to *read or see* runs once they are recorded.

{% note warning  %}
If your Record Key is accidentally exposed, you should remove it and generate a new one from our {% url 'Dashboard' https://on.cypress.io/dashboard %}.
{% endnote %}

# Public vs Private

- **Public** means that anyone can see the recorded test runs for it. It is similar to how public projects on Github, Travis CI, or CircleCI are handled. Anyone who knows your `projectId` will be able to see the recorded runs for public projects.

- **Private** means that only {% url 'users' organizations-dashboard#Inviting-Users %} you invite to your {% url 'organization' organizations-dashboard %} can see its recorded runs. Even if someone knows your `projectId`, they will not have access to your runs unless you have invited them.

# Transfer Ownership

You can transfer projects that you own to another organization you are a part of or to another user in the organization. Projects can only be transferred from our {% url 'Dashboard' https://on.cypress.io/dashboard %}.

![Transfer Project dialog](/img/dashboard/transfer-ownership-of-project-dialog.png)

# Delete a project

You can delete projects you own. This will also delete all of their recorded test runs. Deleting projects can only be done from our {% url 'Dashboard' https://on.cypress.io/dashboard %}.

![Delete project dialog](/img/dashboard/remove-project-dialog.png)
