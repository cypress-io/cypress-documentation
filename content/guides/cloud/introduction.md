---
title: Cypress Cloud
---

<Alert type="success">

<strong class="alert-header"><Icon name="star"></Icon> Get Started</strong>

To get started with Cypress Cloud,
[sign up here](https://cloud.cypress.io/signup) for our
[free plan](https://www.cypress.io/pricing) which comes with 3 users and 500
monthly test results.

</Alert>

[Cypress Cloud](https://on.cypress.io/cloud) is our enterprise-ready, web-based
companion to the Cypress app. It gives you online access to your recorded test
results, orchestrates test runs across multiple machines, provides rich
analytics and diagnostics, and integrates those insights with your favorite
tools.

<!-- textlint-disable -->

<DocsVideo src="https://vimeo.com/736212167"></DocsVideo>

<!-- textlint-enable -->

<Alert type="info">

##### <Icon name="graduation-cap"></Icon> Real World Example <Badge type="success">New</Badge>

The Cypress
[Real World App (RWA)](https://github.com/cypress-io/cypress-realworld-app)
leverages [Cypress Cloud in CI](https://cloud.cypress.io/projects/7s5okt) to
test over 300 test cases in parallel across 25 machines, multiple browsers,
multiple device sizes, and multiple operating systems.

Check out the <Icon name="github"></Icon>
[Real World App in Cypress Cloud](https://cloud.cypress.io/projects/7s5okt).

</Alert>

## Benefits

### Analyze and diagnose

Store the full history of your test results, with
[video clips, screenshots, and full stack traces](/guides/cloud/runs#Test-failures).
Quickly see the current state of your app on the
[Latest Runs](/guides/cloud/runs) page, identify problematic trends with rich
[Analytics](/guides/cloud/analytics), and diagnose unreliable tests with
[Flaky Test Management](/guides/cloud/flaky-test-management). Associate related
tests with [grouping](/guides/guides/parallelization#Grouping-by-browser) to see
results broken down by browser and OS.

<DocsImage src="/img/dashboard/dashboard-runs-list.png" alt="Cloud Screenshot" ></DocsImage>

For users of the open-source [Cypress app](/guides/core-concepts/cypress-app),
we've integrated test run information from Cypress Cloud so developers can see
the latest results across the team, and identify areas of concern.

<DocsImage src="/img/dashboard/v10/runs-list-in-cypress-app.png" alt="Runs List" ></DocsImage>

### Run tests in parallel, in priority order, or not at all

With our [Smart Orchestration](/guides/cloud/smart-orchestration) features, you
can run tests across a swarm of machines simultaneously while Cypress Cloud
coordinates runners and
[balances test loads](/guides/guides/parallelization#Balance-strategy) - no
setup required! You can prioritize recently failed specs with
[Spec Prioritization](/guides/cloud/smart-orchestration#Spec-Prioritization) to
surface problems earlier, and cancel whole test runs on failure with
[Auto Cancellation](/guides/cloud/smart-orchestration#Auto-Cancellation) to save
on resource usage. You can also
[cancel in-progress runs](/guides/cloud/runs#Cancel-run) manually from Cypress
Cloud if you need to.

<DocsImage src="/img/dashboard/introduction/orchestration-diagram.png" alt="Diagram comparing serial and parallel test configurations" ></DocsImage>

### Integrate with source control providers

Ensure rock-solid reliability by keeping failing code out of your
[GitHub](https://github.com), [GitLab](https://gitlab.com) and
[Bitbucket](https://bitbucket.org) repositories, with
[status checks](/guides/cloud/github-integration#Status-checks) that block
commits from being merged until your Cypress tests are green. Surface test
results directly in your PRs with
[pull request comments](/guides/cloud/github-integration#Pull-request-comments)
that include test run statistics, specific failure details, and deep links to
results in Cypress Cloud for fast debugging. Users with
[Business or Enterprise plans](https://www.cypress.io/pricing/) can integrate
securely with
[Self-managed GitLab](https://docs.gitlab.com/ee/subscriptions/self_managed/)
instances too.

<DocsImage src="/img/dashboard/github-integration/status-checks-per-spec.png" alt="Status checks per spec"></DocsImage>

### Collaborate and organize

We also integrate with two of the world's most popular collaboration tools:
[Slack](https://slack.com/) and [Jira](https://www.atlassian.com/software/jira).
Deliver test results with valuable additional context, directly into a dedicated
Slack channel. Or for those on the
[Team, Business or Enterprise plans](https://www.cypress.io/pricing/),
[create bidirectionally linked Jira tickets](/guides/cloud/jira-integration#Creating-a-Jira-issue-for-a-test-case)
directly from specific test failures.

<DocsImage src="/img/dashboard/cypress-slack-integration-channel-feed.png" alt="Cypress notification feed in Slack channel" ></DocsImage>

Lastly you can use our flexible adminstrative functions to configure Cypress
Cloud however you want, grouping [projects](/guides/cloud/projects) into
multiple [organizations](/guides/cloud/organizations) if you have a lot,
checking [usage](/guides/cloud/organizations#Billing-Usage), and administering
[users and permissions](/guides/cloud/users#User-roles). We also provide
[SSO integration](/guides/cloud/organizations#Enterprise-SSO) for teams on our
[Enterprise plan](https://www.cypress.io/pricing/).

<Alert type="info">

<strong class="alert-header">Have a question you don't see answered
here?</strong>

[We have answered some common questions about Cypress Cloud in our FAQ](/faq/questions/cloud-faq).

</Alert>

## Example projects

Once you log in to [Cypress Cloud](https://on.cypress.io/cloud) you can view any
[public project](/guides/cloud/projects#Public-vs-Private).

**Here are some of our own public projects you can view:**

- [<Icon name="folder-open"></Icon> cypress-realworld-app](https://cloud.cypress.io/projects/7s5okt)
- [<Icon name="folder-open"></Icon> cypress-example-recipes](https://cloud.cypress.io/#/projects/6p53jw)
- [<Icon name="folder-open"></Icon> cypress-example-kitchensink](https://cloud.cypress.io/#/projects/4b7344)
- [<Icon name="folder-open"></Icon> cypress-example-todomvc](https://cloud.cypress.io/#/projects/245obj)
