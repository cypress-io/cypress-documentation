---
title: Dashboard
---

The [Cypress Dashboard](https://on.cypress.io/dashboard) is a service that gives
you access to recorded test results - typically when running Cypress tests from
your [CI provider](/guides/continuous-integration/introduction). The Dashboard
provides you insight into what happened when your tests ran.

<!-- textlint-disable -->

<DocsVideo src="https://youtube.com/embed/ezp60FUnjGg"></DocsVideo>

<!-- textlint-enable -->

<Alert type="info">

##### <Icon name="graduation-cap"></Icon> Real World Example <Badge type="success">New</Badge>

The Cypress
[Real World App (RWA)](https://github.com/cypress-io/cypress-realworld-app)
leverages the
[Cypress Dashboard in CI](https://dashboard.cypress.io/projects/7s5okt) to test
over 300 test cases in parallel across 25 machines, multiple browsers, multiple
device sizes, and multiple operating systems.

Check out the <Icon name="github"></Icon>
[Real World App Dashboard](https://dashboard.cypress.io/projects/7s5okt).

</Alert>

## Features

### Organize projects

From the Dashboard you can:

- Set up a project to record in the Dashboard
- Reset or add more record keys
- Change who can access your Cypress project
- Transfer ownership of projects
- Delete projects

### See test run results

From the Dashboard you can:

- See the number of failed, passing, pending and skipped tests.
- Get the entire stack trace of failed tests.
- View screenshots taken when tests fail or when using
  [`cy.screenshot()`](/api/commands/screenshot).
- Watch a video of your entire test run or a video clip at the point of test
  failure.
- See how fast your spec files ran within CI including whether they were run in
  parallel.
- See related groupings of tests.

<DocsImage src="/img/dashboard/dashboard-runs-list.png" alt="Dashboard Screenshot" ></DocsImage>

### Manage runs

From the Dashboard you can:

- [Cancel runs](/guides/dashboard/runs#Cancel-run) currently in progress
- [Archive runs](/guides/dashboard/runs#Archive-run) in a canceled or errored
  state

### Manage organizations

From the Dashboard you can:

- Create, edit and delete organizations
- See usage details for each organization.
- Pay for your selected billing plan.

### Manage users

From the Dashboard you can:

- Invite and edit user's roles for organizations
- Accept or reject requests to join your organization.

### Integrate with GitHub

From the Dashboard you can:

- Integrate your Cypress tests with your GitHub workflow via commit
  [status checks](/guides/dashboard/github-integration#Status-checks)
- Integrate Cypress into GitHub via
  [pull requests](/guides/dashboard/github-integration#Pull-request-comments)

### Integrate with Slack

From the Dashboard you can:

- Integrate Cypress into Slack on every recorded test run.

#### See test runs in the Cypress App

Additionally we've integrated the latest test run info into the
[Cypress app](/guides/core-concepts/cypress-app). This means you can see the
status of your tests in the _Runs_ tab from within each project.

<DocsImage src="/img/dashboard/v10/runs-list-in-cypress-app.png" alt="Runs List" ></DocsImage>

<Alert type="info">

<strong class="alert-header">Have a question you don't see answered
here?</strong>

[We have answered some common questions about the Dashboard Service in our FAQ](/faq/questions/dashboard-faq).

</Alert>

## Example projects

Once you log in to the [Dashboard Service](https://on.cypress.io/dashboard) you
can view any [public project](/guides/dashboard/projects#Public-vs-Private).

**Here are some of our own public projects you can view:**

- [<Icon name="folder-open"></Icon> cypress-realworld-app](https://dashboard.cypress.io/projects/7s5okt)
- [<Icon name="folder-open"></Icon> cypress-example-recipes](https://dashboard.cypress.io/#/projects/6p53jw)
- [<Icon name="folder-open"></Icon> cypress-example-kitchensink](https://dashboard.cypress.io/#/projects/4b7344)
- [<Icon name="folder-open"></Icon> cypress-example-todomvc](https://dashboard.cypress.io/#/projects/245obj)
