---
title: Dashboard
---

The [Cypress Dashboard](https://on.cypress.io/dashboard) is our
enterprise-ready, web-based companion to the Cypress app. It gives you online
access to your recorded test results, orchestrates test runs across multiple
machines, provides rich analytics and diagnostics, and integrates those insights
with your favorite tools.

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

## Benefits

### Analyze and diagnose

Store the full history of your test results, with
[video clips, screenshots, and full stack traces](/guides/dashboard/runs#Test-failures).
Quickly see the current state of your app on the
[Latest Runs](/guides/dashboard/runs) page, identify problematic trends with
rich [Analytics](/guides/dashboard/analytics), and diagnose unreliable tests
with [Flaky Test Management](/guides/dashboard/flaky-test-management). Associate
related tests with
[grouping](/guides/guides/parallelization#Grouping-by-browser) to see results
broken down by browser and OS.

<DocsImage src="/img/dashboard/dashboard-runs-list.png" alt="Dashboard Screenshot" ></DocsImage>

For users of the [Cypress app](/guides/core-concepts/cypress-app), we've
integrated test run information from the Dashboard with our interactive
test-runner so developers can see the latest results across the team, and
identify areas of concern.

<DocsImage src="/img/dashboard/v10/runs-list-in-cypress-app.png" alt="Runs List" ></DocsImage>

### Run tests in parallel, in priority order, or not at all

With our [Smart Orchestration](/guides/dashboard/smart-orchestration) features,
you can run tests across a swarm of machines simultaneously while the Dashboard
coordinates runners and
[balances test loads](/guides/guides/parallelization#Balance-strategy) - no
setup required! You can
[prioritize recently failed specs](/guides/dashboard/smart-orchestration#Run-failed-specs-first)
to surface problems earlier, and
[cancel whole test runs on failure](/guides/dashboard/smart-orchestration#Cancel-test-run-when-a-test-fails)
to save on resource usage. You can also
[Cancel in-progress runs](/guides/dashboard/runs#Cancel-run) manually from the
Dashboard if you need to.

<DocsImage src="/img/dashboard/introduction/orchestration-diagram.png" alt="Diagram comparing serial and parallel test configurations" ></DocsImage>

### Integrate with source control providers

Ensure rock-solid reliability by keeping failing code out of your
[GitHub](https://github.com), [GitLab](https://gitlab.com) and
[Bitbucket](https://bitbucket.org) repositories, with
[status checks](/guides/dashboard/github-integration#Status-checks) that block
commits from being merged until your Cypress tests are green. Surface test
results directly in your PRs with
[pull request comments](/guides/dashboard/github-integration#Pull-request-comments)
that include test run statistics, specific failure details, and deep links to
results in Dashboard for fast debugging. Dashboard users with
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
[create bidirectionally linked Jira tickets](/guides/dashboard/jira-integration#Creating-a-Jira-issue-for-a-test-case)
directly from specific test failures.

<DocsImage src="/img/dashboard/cypress-slack-integration-channel-feed.png" alt="Cypress notification feed in Slack channel" ></DocsImage>

Lastly you can use our flexible adminstrative functions to configure the
Dashboard however you want, grouping [projects](/guides/dashboard/projects) into
multiple [organizations](/guides/dashboard/organizations) if you have a lot,
checking [usage](/guides/dashboard/organizations#Billing-Usage), and
administering [users and permissions](/guides/dashboard/users#User-roles). We
also provide [SSO integration](/guides/dashboard/organizations#Enterprise-SSO)
for teams on our [Enterprise plan](https://www.cypress.io/pricing/).

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
