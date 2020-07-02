---
title: GitHub Integration
---

The {% url "Cypress Dashboard" https://on.cypress.io/dashboard %} can integrate your Cypress tests with your GitHub workflow via commit {% urlHash 'status checks' Status-checks %} and {% urlHash 'pull request comments' Pull-request-comments %}. A project first needs to be {% url "setup to record" projects %} to the Cypress Dashboard to use GitHub integration.

{% imgTag /img/dashboard/github-integration/pull-request-cypress-integration-comments-github-checks.jpg "Cypress GitHub App PR" %}

{% note info %}
GitHub Enterprise's On-premise platform is currently not supported. If you're interested in an integration with GitHub Enterprise's On-premise platform, please add your interest to our {% url "Dashboard Product Board" https://portal.productboard.com/cypress-io/1-cypress-dashboard %}.
{% endnote %}

{% note warning %}
GitHub Integration is dependent on your CI environment reliably providing commit SHA data (typically via an environment variable). This is not a problem for most users, but if you are facing GitHub integration issues with your CI setup, please make sure the git information is being sent properly by following {% url "these guidelines" continuous-integration#Git-information %}. If you are still facing issues after this, please [contact us](mailto:hello@cypress.io).
{% endnote %}

# Install the Cypress GitHub app

Before you can enable GitHub integration for your Cypress projects, you must first install the Cypress GitHub App. You can start the GitHub App installation process via your organization's settings page or a project's settings page in the {% url "Cypress Dashboard" https://on.cypress.io/dashboard %}.

## Install via organization integration settings

1. Go to the Dashboard {% url "Organizations page" https://dashboard.cypress.io/organizations %} or open the organization switcher.
2. Select the organization you wish to integrate with a GitHub account or GitHub organization.
  {% imgTag /img/dashboard/select-cypress-organization.png "Select an organization" width-600 %}
3. Visit the selected organization's **Integrations** page via the side navigation.
  {% imgTag /img/dashboard/navigate-to-organization-integrations.png "Install Cypress GitHub from Integrations" %}
4. Click the **Install GitHub Integration** button.

## Install via project settings

1. Select your organization in the organization switcher.
  {% imgTag /img/dashboard/select-cypress-organization.png "Select an organization" width-600 %}
2. Select the project you wish to integrate with a GitHub repository.
  {% imgTag /img/dashboard/select-cypress-project.png "Select a project" %}
3. Go to the project's settings page.
  {% imgTag /img/dashboard/visit-project-settings.png "Visit project settings" %}
4. Scroll down to the **GitHub Integration** section.
5. Click the **Install the Cypress GitHub App** button.
  {% imgTag /img/dashboard/github-integration/install-github-cypress-app-project-settings.png "Install GitHub Cypress App" %}

## Cypress GitHub app installation process

Once you've started the GitHub App installation process {% urlHash "via a Cypress organization's settings" Install-via-organization-integration-settings %} or {% urlHash "a project's settings" Install-via-project-settings %}, you will be directed to GitHub.com to complete the installation:

1. Select the desired GitHub organization or account to integrate with your Cypress Dashboard organization.
{% imgTag /img/dashboard/github-integration/select-gh-org.jpg "Select a GitHub organization"  %}

2. Choose to associate **All repositories** or only select GitHub repositories with your Cypress GitHub App installation.

  {% imgTag /img/dashboard/github-integration/select-all-gh-repos.jpg "Select All GitHub repositories" %}

  {% note info %}
  All current and *future* repositories will be included with this installation if you choose **All repositories**.
  {% endnote %}

  {% imgTag /img/dashboard/github-integration/select-gh-repos.jpg "Select specific GitHub repositories" %}

3. Click the **Install** button to complete the installation.

# Enabling GitHub integration for a project

After completing the Cypress GitHub App installation for your organization you can now enable GitHub Integration for *any* Cypress project.

1. Go to the project's settings page.
  {% imgTag /img/dashboard/visit-project-settings.png "Visit project settings" %}

2. Scroll down to the GitHub Integration section.
    {% note info %}
    You can quickly get to a project's GitHub Integrations settings, by clicking on the **Configure** link of the desired project within an organization's Integrations page:
    {% endnote %}

    {% imgTag /img/dashboard/github-integration/org-settings-with-no-enabled-projects.png "Org GitHub Integration settings" "no-border" %}

3. Select a GitHub repository to associate with the project.

  {% imgTag /img/dashboard/github-integration/project-settings-repo-selection.png "Associate GitHub repo with Cypress project" "no-border" %}

Once a GitHub repository is associated with a Cypress project, the GitHub integration will be immediately enabled:
{% imgTag /img/dashboard/github-integration/project-settings-selected-repo.png "GitHub integration enabled for Cypress project" "no-border" %}

You can also see all GitHub Integration enabled Cypress projects within your organizations **Integrations** page:
{% imgTag /img/dashboard/github-integration/org-settings-with-projects.png "Integrations page" "no-border" %}

# Status checks

If status checks are enabled within a project's GitHub integration settings, the Cypress Dashboard will report Cypress test statuses to GitHub for related commits. {% url "Status checks" https://help.github.com/en/articles/about-status-checks %} help prevent merging a commit or pull-request into the rest of your codebase until all your Cypress tests have passed.

The Cypress GitHub App reports commit status checks in two separate styles:

- **One check per {% url "run group" parallelization#Grouping-test-runs %}.**
    {% imgTag /img/dashboard/github-integration/status-checks-per-group-failed.png "Status checks per group" "no-border" %}

- **Or one check per spec file.**
    {% imgTag /img/dashboard/github-integration/status-checks-per-spec.png "Status checks per spec" "no-border" %}

Each status check will report the number of test failures or passes, and the associated **Details** link will direct you to the test run's page within the Cypress Dashboard to help you dig deeper into the problem via error messages, stack traces, screenshots, and video recordings:
{% imgTag /img/dashboard/dashboard-fail-tab.png "Cypress Dashboard failure tab" %}

## Disable status checks

GitHub status checks are optional, and can be disabled within a project's GitHub integration settings:
{% imgTag /img/dashboard/github-integration/status-check-settings.png "Status checks settings" %}

# Pull request comments

The Cypress GitHub App can provide detailed test information within pull requests via comments that include:

- **Run statistics, such as tests passed, failed, skipped, and over-limit.**
- **Run context details:**
  - The associated Cypress project
  - Final run status (passed, failed, etc)
  - Commit SHA linking to the GitHub commit
  - The time the run started and finished as well as the duration.
  - Operating system version and browser version.
- **Run failures:**
  - The first 10 failures are displayed with a link to more.
  - Each failed test links back to the associated failure within the Cypress Dashboard.
  - Screenshot thumbnails are also provided with each failure to conveniently provide context.

An example of a Cypress pull-request comment can be seen below:

{% imgTag /img/dashboard/github-integration/pr-comment-fail.jpg "Cypress GitHub App PR comment" %}

## Disable PR comments

PR comments and failure screenshot thumbnails are optional, and can be disabled if not needed within a project's GitHub Integration settings:
{% imgTag /img/dashboard/github-integration/pr-comments-settings.png "Status checks settings" %}

# Uninstall the Cypress GitHub app

You can uninstall the Cypress GitHub app from GitHub by performing the following steps:

1. Go into your organization's **Settings** from within GitHub.
2. Click on **Installed GitHub Apps**.
3. Click **Configure** beside the Cypress app.
4. Click **Uninstall** below the "Uninstall Cypress" section.

# Got Feedback?

If you have any insights or feedback on how to improve Cypress GitHub Integration, please reach out via our official {% url "Dashboard Product Board" https://portal.productboard.com/cypress-io/1-cypress-dashboard/c/9-github-status-checks-and-pull-request-comments %}.

# See also

- {% url "Cypress GitHub Action + Examples" https://github.com/cypress-io/github-action %}
- {% url "Example project that uses both Cypress GitHub Action and Cypress GitHub Integration" https://github.com/cypress-io/gh-action-and-gh-integration %}
