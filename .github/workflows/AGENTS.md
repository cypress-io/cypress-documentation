# Agent rules: GitHub Actions workflows

The root [`AGENTS.md`](../../AGENTS.md) still applies; this file adds the rules
specific to `.github/workflows/`. What each job in `ci.yml` runs, and why the
branch protection set looks the way it does, is in
[`AGENTS_REFERENCE.md`](../../AGENTS_REFERENCE.md#continuous-integration).

## Pinning actions

- Look up the current major version of every action you use, on that action's
  own GitHub repository, at the time you write the workflow. Do not carry a
  version over from another file.
- Pin to the latest major tag (`uses: <owner>/<action>@v<major>`), matching the
  style already in these files. A commit SHA is not required here.
- After a new or changed workflow runs, read its logs and bump any action the
  runner flags with a deprecation warning.

## Forks copy these files

This repository is frequently forked, and every workflow here, scheduled `cron`
jobs included, is copied into each fork and runs there with reduced permissions.
GitHub Actions cannot create or approve pull requests in a fork by default, so
an unguarded job fails with a fatal error in somebody else's repository.

Guard any job that pushes commits, opens pull requests, or reads repo secrets so
it runs only on the default branch of the parent repository:

```yml
jobs:
  my-job:
    if: (github.ref == 'refs/heads/main') &&
      (github.repository == 'cypress-io/cypress-documentation')
```

The same split is why `ci.yml` carries two E2E jobs. The recorded one needs
`CYPRESS_RECORD_KEY` to split the suite through Cypress Cloud, and GitHub
withholds secrets from a pull request opened from a fork, so those runs get
`E2E (fork, not recorded)` instead: the whole suite in one container, reporting
nothing to the Cloud.

## Required checks and skipped jobs

Exactly one of those two E2E jobs runs and the other is skipped, so **neither
can be a required status check**. GitHub reports a skipped job as Success, so
requiring the eight containers would go green on a fork pull request that ran no
tests at all.

`e2e-status` exists for that. It runs `always()`, reads both results, and fails
unless one of them actually succeeded, including when both were skipped because
the build failed. Require it rather than the jobs feeding it, and keep
`fail-fast: false` on the matrix so all eight containers report and its
aggregate result is true.

Apply the same reasoning to any new job you add behind a condition: if it can
skip, the thing branch protection requires has to be an aggregator that reads
its result, not the job itself.

## Workflows that trigger no CI

GitHub raises no workflow run for an event caused by `GITHUB_TOKEN`. The nightly
pull request that `update-plugins-data.yml` opens therefore triggers `ci.yml`
not at all, on the `automation/update-plugins-data` branch or anywhere else.

That workflow typechecks, builds, and runs `plugins_list.cy.ts` itself before
opening the pull request. Anything that would newly break on a change to
`src/data/plugins-generated.json` belongs there, not only in `ci.yml`.
