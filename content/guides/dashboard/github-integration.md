---
title: GitHub Integration
---

[Cypress Cloud](https://on.cypress.io/cloud) can integrate your
Cypress tests with your GitHub workflow via commit
[status checks](#Status-checks) and
[pull request comments](#Pull-request-comments). A project first needs to be
[setup to record](/guides/cloud/projects) to Cypress Cloud to use
GitHub integration.

<DocsImage src="/img/dashboard/github-integration/pull-request-cypress-integration-comments-github-checks.jpg" alt="Cypress GitHub App PR" ></DocsImage>

<Alert type="warning">

GitHub Integration is dependent on your CI environment reliably providing commit
SHA data (typically via an environment variable). This is not a problem for most
users, but if you are facing GitHub integration issues with your CI setup,
please make sure the git information is being sent properly by following
[these guidelines](/guides/continuous-integration/introduction#Git-information).
If you are still facing issues after this, please
[contact us](mailto:hello@cypress.io).

</Alert>

## GitHub Enterprise

<Alert type="success">

<strong class="alert-header"><Icon name="star"></Icon> Premium Cypress Cloud Feature</strong>

GitHub Enterprise integration is included in our
[Business and Enterprise paid pricing plans](https://www.cypress.io/pricing).

</Alert>

To configure Cypress Cloud integration for your GitHub Enterprise site, first
follow the instructions to
[install via organization integration settings](#Install-via-organization-integration-settings)
below, then skip to
[Cypress GitHub Enterprise app installation](#Cypress-GitHub-Enterprise-app-installation-process),
and finally
[enable integration for a project](#Enabling-GitHub-integration-for-a-project).

## Install the Cypress GitHub app

Before you can enable GitHub integration for your Cypress projects, you must
first install the Cypress GitHub App. You can start the GitHub App installation
process via your organization's settings page or a project's settings page in
[Cypress Cloud](https://on.cypress.io/cloud).

### Install via organization integration settings

1. Go to Cypress Cloud
   [Organizations page](https://cloud.cypress.io/organizations) or open the
   organization switcher.
2. Select the organization you wish to integrate with a GitHub account or GitHub
   organization.
   <DocsImage src="/img/dashboard/select-cypress-organization.png" alt="Select an organization" width-600 ></DocsImage>
3. Visit the selected organization's **Integrations** page via the side
   navigation.
   <DocsImage src="/img/dashboard/navigate-to-organization-integrations.png" alt="Install Cypress GitHub from Integrations" ></DocsImage>
4. Click the **Install GitHub Integration** or **Install GitHub Enterprise
   Integration** button.

### Install via project settings

<Alert type="warning">
This installation method is not applicable to GitHub Enterprise.
</Alert>

1. Select your organization in the organization switcher.
   <DocsImage src="/img/dashboard/select-cypress-organization.png" alt="Select an organization" width-600 ></DocsImage>
2. Select the project you wish to integrate with a GitHub repository.
   <DocsImage src="/img/dashboard/select-cypress-project.png" alt="Select a project" ></DocsImage>
3. Go to the project's settings page.
   <DocsImage src="/img/dashboard/visit-project-settings.png" alt="Visit project settings" ></DocsImage>
4. Scroll down to the **GitHub Integration** section.
5. Click the **Install the Cypress GitHub App** button.
   <DocsImage src="/img/dashboard/github-integration/install-github-cypress-app-project-settings.png" alt="Install GitHub Cypress App" ></DocsImage>

### Cypress GitHub app installation process

Once you've started the GitHub App installation process
[via a Cypress organization's settings](#Install-via-organization-integration-settings)
or [a project's settings](#Install-via-project-settings), you will be directed
to GitHub.com to complete the installation:

1. Select the desired GitHub organization or account to integrate with your
   Cypress Cloud organization.
   <DocsImage src="/img/dashboard/github-integration/select-gh-org.jpg" alt="Select a GitHub organization"  ></DocsImage>

2. Choose to associate **All repositories** or only select GitHub repositories
   with your Cypress GitHub App installation.
   <DocsImage src="/img/dashboard/github-integration/select-all-gh-repos.jpg" alt="Select All GitHub repositories" ></DocsImage>

<Alert type="info">
All current and <em>future</em> repositories will be included with this installation if
you choose <strong>All repositories</strong>.
</Alert>

<DocsImage src="/img/dashboard/github-integration/select-gh-repos.jpg" alt="Select specific GitHub repositories" ></DocsImage>

3. Click the **Install** button to complete the installation.

### Cypress GitHub Enterprise app installation process

To integrate Cypress Cloud with GitHub Enterprise, you need to create a new
GitHub App, copy the necessary settings and credentials from the new app, paste
them into Cypress Cloud, and complete the activation process.

1. With your Cypress Cloud organization's GitHub Enterprise page open, open a new
   tab or browser window and browse to your GitHub Enterprise site. Navigate to
   your GitHub organization → **Settings** → **Developer settings** → **GitHub
   Apps**. Do **NOT** go to **OAuth Apps**. Click the **New GitHub App** button.

<DocsImage src="/img/dashboard/github-integration/ghe/ghe-01.png" alt="Create new GitHub App" id="cypress-github-enterprise-app-installation-process-1"></DocsImage>

2. Complete the **Register new GitHub app** section.
   - Enter a **GitHub App name**. Name may contain only dashes, letters and
     numbers, **no spaces**.
   - Enter Cypress Cloud **Homepage URL**, https://cloud.cypress.io
   - Enter the **Callback URL** and **Setup URL**,
     https://cloud.cypress.io/apps/github/callback

<DocsImage src="/img/dashboard/github-integration/ghe/ghe-02.png" alt="Configure new GitHub App" id="cypress-github-enterprise-app-installation-process-2"></DocsImage>

3. Complete the **Webhook** section.
   - Enter the **Webhook URL**, https://cloud.cypress.io/webhooks/github-app
   - Copy and paste the provided **Webhook secret** from Cypress Cloud
     to **Webhook secret (optional)**.

<DocsImage src="/img/dashboard/github-integration/ghe/ghe-03.png" alt="Configure app webhook" id="cypress-github-enterprise-app-installation-process-3"></DocsImage>

4. Set the **Repository Permissions**. Below are the minimum permissions
   required for the new GitHub App.
   - **Pull requests**: read & write
   - **Commit statuses**: read & write

<DocsImage src="/img/dashboard/github-integration/ghe/ghe-04.png" alt="Configure app permissions" id="cypress-github-enterprise-app-installation-process-4"></DocsImage>

5. Skip to the bottom of the form and click the **Create GitHub App** button.
   Your new GitHub App is now created, and you'll be taken to the settings page.

6. Returning to Cypress Cloud GitHub Enterprise Integration
   configuration screen, populate the following values from your new GitHub App.
   - Copy the root URL of your GitHub Enterprise site to the Cypress **GitHub
     Enterprise Server URL** field.
   - Copy the **App ID** to the Cypress **GitHub Enterprise App ID** field.
   - Copy the **Client ID** to the Cypress **GitHub Enterprise Client ID**
     field.
   - Copy the **GitHub App name** to the Cypress **GitHub Enterprise App name**
     field.
   - Generate a new Client secret in GitHub by clicking on the **Generate a new
     client secret** button. Copy the new secret into the Cypress **GitHub
     Enterprise Client secret** field.
   - Generate a new private key in GitHub by clicking on the **Generate a
     private key** button. Open in a text editor and copy all of the content
     into the Cypress **GitHub Enterprise Private key** field.

<DocsImage src="/img/dashboard/github-integration/ghe/ghe-05.png" alt="Collect new app info" id="cypress-github-enterprise-app-installation-process-5"></DocsImage>

<DocsImage src="/img/dashboard/github-integration/ghe/ghe-06.png" alt="Generate client secret" id="cypress-github-enterprise-app-installation-process-6"></DocsImage>

<DocsImage src="/img/dashboard/github-integration/ghe/ghe-07.png" alt="Generate private key" id="cypress-github-enterprise-app-installation-process-7"></DocsImage>

7. In Cypress Cloud, click the **Next Step** button and you will be
   taken to the GitHub Enterprise app authorization page. Click the **Authorize
   \[your app name\]** button.

<DocsImage src="/img/dashboard/github-integration/ghe/ghe-08.png" alt="Authorize GitHub App" id="cypress-github-enterprise-app-installation-process-8"></DocsImage>

8. On your newly-authorized GitHub App, click the **Install** button.

<DocsImage src="/img/dashboard/github-integration/ghe/ghe-09.png" alt="Install GitHub App" id="cypress-github-enterprise-app-installation-process-9"></DocsImage>

9. Nearly there! On the GitHub App installation page, choose whether you want to
   install the app against all repos or select specific ones, then click the
   **Install** button.

<DocsImage src="/img/dashboard/github-integration/ghe/ghe-10.png" alt="Confirm installation of GitHub App" id="cypress-github-enterprise-app-installation-process-10"></DocsImage>

10. Finally you will be returned to Cypress Cloud. Congratulations, you have
    installed Cypress Cloud GitHub Enterprise integration! You are now
    ready to configure a GitHub Integration for a project.

## Enabling GitHub integration for a project

After completing the Cypress GitHub App installation for your organization you
can now enable GitHub Integration for _any_ Cypress project.

1. Go to the project's settings page.
   <DocsImage src="/img/dashboard/visit-project-settings.png" alt="Visit project settings" ></DocsImage>

2. Scroll down to the GitHub Integration or GitHub Enterprise Integration
   section.

<Alert type="info">
   You can quickly get to a project's GitHub Integrations settings, by clicking
   on the <strong>Configure</strong> link of the desired project within an organization's
   Integrations page:
</Alert>

<DocsImage src="/img/dashboard/github-integration/org-settings-with-no-enabled-projects.png" alt="Org GitHub Integration settings"></DocsImage>

3. Select a GitHub repository to associate with the project.

<DocsImage src="/img/dashboard/github-integration/project-settings-repo-selection.png" alt="Associate GitHub repo with Cypress project"></DocsImage>

Once a GitHub repository is associated with a Cypress project, the GitHub
integration will be immediately enabled:
<DocsImage src="/img/dashboard/github-integration/project-settings-selected-repo.png" alt="GitHub integration enabled for Cypress project"></DocsImage>

You can also see all GitHub Integration enabled Cypress projects within your
organizations **Integrations** page:
<DocsImage src="/img/dashboard/github-integration/org-settings-with-projects.png" alt="Integrations page"></DocsImage>

## Status checks

If status checks are enabled within a project's GitHub integration settings, Cypress Cloud will report Cypress test statuses to GitHub for related
commits.
[Status checks](https://help.github.com/en/articles/about-status-checks) help
prevent merging a commit or pull-request into the rest of your codebase until
all your Cypress tests have passed.

The Cypress GitHub App reports commit status checks in two separate styles:

- **One check per
  [run group](/guides/guides/parallelization#Grouping-test-runs).**
  <DocsImage src="/img/dashboard/github-integration/status-checks-per-group-failed.png" alt="Status checks per group"></DocsImage>

- **Or one check per spec file.**
  <DocsImage src="/img/dashboard/github-integration/status-checks-per-spec.png" alt="Status checks per spec"></DocsImage>

Each status check will report the number of test failures or passes, and the
associated **Details** link will direct you to the test run's page within Cypress Cloud to help you dig deeper into the problem via error messages,
stack traces, screenshots, and video recordings:
<DocsImage src="/img/dashboard/dashboard-fail-tab.png" alt="Cypress Cloud failure tab" ></DocsImage>

### Disable status checks

GitHub status checks are optional, and can be disabled within a project's GitHub
integration settings:
<DocsImage src="/img/dashboard/github-integration/status-check-settings.png" alt="Status checks settings" ></DocsImage>

## Pull request comments

The Cypress GitHub App can provide detailed test information within pull
requests via comments that include:

- **Run statistics, such as tests passed, failed, skipped, and over-limit.**
- **Run context details:**
  - The associated Cypress project
  - Final run status (passed, failed, etc)
  - Commit SHA linking to the GitHub commit
  - The time the run started and finished as well as the duration.
  - Operating system version and browser version.
- **Run failures:**
  - The first 10 failures are displayed with a link to more.
  - Each failed test links back to the associated failure within Cypress Cloud.
  - Screenshot thumbnails are also provided with each failure to conveniently
    provide context.

An example of a Cypress pull-request comment can be seen below:

<DocsImage src="/img/dashboard/github-integration/pr-comment-fail.jpg" alt="Cypress GitHub App PR comment" ></DocsImage>

### Disable PR comments

PR comments and failure screenshot thumbnails are optional, and can be disabled
if not needed within a project's GitHub Integration settings:
<DocsImage src="/img/dashboard/github-integration/pr-comments-settings.png" alt="Status checks settings" ></DocsImage>

## Uninstall the Cypress GitHub app

You can uninstall the Cypress GitHub app from GitHub by performing the following
steps:

1. Go into your organization's **Settings** from within GitHub.
2. Click on **Installed GitHub Apps**.
3. Click **Configure** beside the Cypress app.
4. Click **Uninstall** below the "Uninstall Cypress" section.

## Troubleshooting

See
[Common GitHub Actions Problems and Solutions](/guides/continuous-integration/github-actions#Common-Problems-and-Solutions).

## See also

- [Cypress GitHub Action + Examples](https://github.com/cypress-io/github-action)
- [Example project that uses both Cypress GitHub Action and Cypress GitHub Integration](https://github.com/cypress-io/gh-action-and-gh-integration)
