---
title: Introduction
---
The {% url 'Cypress Dashboard' https://on.cypress.io/dashboard %} is a service that gives you access to recorded tests - typically when running Cypress tests from your {% url 'CI provider' continuous-integration %}. The Dashboard provides you insight into what happened when your tests ran.

# Features

## Organize projects

From the Dashboard you can:

- Set up a project to record in the Dashboard
- Reset or add more record keys
- Change who can access your Cypress project
- Transfer ownership of projects
- Delete projects

## See test run results

From the Dashboard you can:

- See the number of failed, passing, pending and skipped tests.
- Get the entire stack trace of failed tests.
- View screenshots taken when tests fail or when using {% url `cy.screenshot()` screenshot %}.
- Watch a video of your entire test run or a video clip at the point of test failure.
- See how fast your spec files ran within CI including whether they were run in parallel.
- See related groupings of tests.

{% imgTag /img/dashboard/dashboard-runs-list.png "Dashboard Screenshot" %}

## Manage runs

From the Dashboard you can:

- {% url "Cancel runs" runs#Cancel-run %} currently in progress
- {% url "Archive runs" runs#Archive-run %} in a canceled or errored state

## Manage organizations

From the Dashboard you can:

- Create, edit and delete organizations
- See usage details for each organization.
- Pay for your selected billing plan.

## Manage users

From the Dashboard you can:

- Invite and edit user's roles for organizations
- Accept or reject requests to join your organization.

## Integrate with GitHub

From the Dashboard you can:

- Integrate your Cypress tests with your GitHub workflow via commit {% url 'status checks' github-integration#Status-checks %}
- Integrate Cypress into GitHub via {% url 'pull requests' github-integration#Pull-request-comments %}

## Integrate with Slack

From the Dashboard you can:

- Integrate Cypress into Slack on every recorded test run.

### See tests runs in the Test Runner

Additionally we've integrated the tests run into the Cypress {% url 'Test Runner' test-runner %}. This means you can see the tests run in the *Runs* tab from within every project.

{% imgTag /img/dashboard/runs-list-in-desktop-gui.png "Runs List" %}

{% note info "Have a question you don't see answered here?"%}
{% url "We have answered some common questions about the Dashboard Service in our FAQ." dashboard-faq %}.
{% endnote %}

# Example projects

Once you log in to the {% url 'Dashboard Service' https://on.cypress.io/dashboard %} you can view any {% url "public project" projects#Public-vs-Private %}.

**Here are some of our own public projects you can view:**

- [{% fa fa-folder-open-o %} cypress-example-recipes](https://dashboard.cypress.io/#/projects/6p53jw)
- [{% fa fa-folder-open-o %} cypress-example-kitchensink](https://dashboard.cypress.io/#/projects/4b7344)
- [{% fa fa-folder-open-o %} cypress-example-todomvc](https://dashboard.cypress.io/#/projects/245obj)
- [{% fa fa-folder-open-o %} cypress-example-piechopper](https://dashboard.cypress.io/#/projects/fuduzp)
