---
title: GitLab CI
---

<Alert type="info">

## <Icon name="graduation-cap"></Icon> What you'll learn

- How to run Cypress tests with GitLab as part of CI/CD pipeline
- How to parallelize Cypress test runs within GitLab CI/CD

</Alert>

With its hosted
[CI/CD Service](https://about.gitlab.com/stages-devops-lifecycle/continuous-integration/),
[GitLab](https://gitlab.com) offers developers "a tool built into GitLab for
software development through the
[continuous methodologies](https://docs.gitlab.com/ee/ci/introduction/index.html#introduction-to-cicd-methodologies)".

Detailed documentation is available in the
[GitLab CI/CD Documentation](https://docs.gitlab.com/ee/ci/introduction/).

## Basic Setup

The example below is basic CI setup and job using
[GitLab CI/CD](https://about.gitlab.com/stages-devops-lifecycle/continuous-integration/)
to run Cypress tests within the Electron browser. This GitLab CI configuration
is placed within `.gitlab-ci.yml`.

```yaml
stages:
  - test

test:
  image: node:latest
  stage: test
  script:
    # install dependencies
    - npm ci
    # start the server in the background
    - npm run start:ci &
    # run Cypress tests
    - npm run e2e
```

<Alert type="info">

<strong class="alert-header">Try it out</strong>

To try out the example above yourself, fork the
[Cypress Kitchen Sink](https://github.com/cypress-io/cypress-example-kitchensink)
example project and place the above GitHub Action configuration in
`.gitlab-ci.yml`.

</Alert>

**How this configuration works:**

- On _push_ to this repository, this job will provision and start GitLab-hosted
  Linux instance for running the outlined `stages` declared in `script` with in
  the `test` job section of the configuration.
- The code is checked out from our GitHub/GitLab repository.
- Finally, our scripts will:
  - Install npm dependencies
  - Start the project web server (`npm start`)
  - Run the Cypress tests within our GitHub repository within Electron.

## Testing in Chrome and Firefox with Cypress Docker Images

The Cypress team maintains the official
[Docker Images](https://github.com/cypress-io/cypress-docker-images) for running
Cypress tests locally and in CI, which are built with Google Chrome and Firefox.
For example, this allows us to run the tests in Firefox by passing the
`--browser firefox` attribute to `cypress run`.

```yaml
stages:
  - test

test:
  image: cypress/browsers:node12.14.1-chrome85-ff81
  stage: test
  script:
    # install dependencies
    - npm ci
    # start the server in the background
    - npm run start:ci &
    # run Cypress tests
    - npx cypress run --browser firefox
```

## Caching Dependencies and Build Artifacts

Caching of dependencies and build artifacts can be accomplished with the `cache`
configuration. The
[caching documentation](https://docs.gitlab.com/ee/ci/caching/) contains all
options for caching dependencies and build artifacts across many different
workflows. Artifacts from a job can be defined by providing paths and an
optional expiry time.

```yaml
stages:
  - test

cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/
    - .npm/

test:
  image: cypress/browsers:node12.14.1-chrome85-ff81
  stage: test
  script:
    # install dependencies
    - npm ci
    # start the server in the background
    - npm run start:ci &
    # run Cypress tests
    - npx cypress run --browser firefox
  artifacts:
    when: always
    paths:
      - cypress/videos/**/*.mp4
      - cypress/screenshots/**/*.png
    expire_in: 1 day
```

## Parallelization

[Cypress Cloud](/guides/cloud/introduction) offers the ability to
[parallelize and group test runs](/guides/guides/parallelization) along with
additional insights and [analytics](/guides/cloud/analytics) for Cypress
tests.

The addition of the
[`parallel` attribute](https://docs.gitlab.com/ee/ci/yaml/#parallel) to the
configuration of a job will allow us to run multiples instances of Cypress at
same time as we will see later in this section.

Before diving into an example of a parallelization setup, it is important to
understand the two different types of jobs that we will declare:

- **Install Job**: A job that installs and caches dependencies that will be used
  by subsequent jobs later in the GitLab CI workflow.
- **Worker Job**: A job that handles execution of Cypress tests and depends on
  the _install job_.

### Install Job

The separation of installation from test running is necessary when running
parallel jobs. It allows for reuse of various build steps aided by caching.

First, we will define the `build` stage along with `cache` and variables related
to the cache.

Then we define the `install` step that will be used by the worker jobs and
assign it to the `build` stage.

```yaml
stages:
  - build

## Set environment variables for folders in "cache" job settings for npm modules and Cypress binary
variables:
  npm_config_cache: '$CI_PROJECT_DIR/.npm'
  CYPRESS_CACHE_FOLDER: '$CI_PROJECT_DIR/cache/Cypress'

cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - cache/Cypress
    - node_modules
    - build

## Install NPM dependencies and Cypress
install:
  image: cypress/browsers:node12.14.1-chrome85-ff81
  stage: build
  script:
    - npm ci
```

### Worker Jobs

Next, we add a `test` stage and define the worker job named `ui-chrome-tests`
that will run Cypress tests with Chrome in parallel during the `test` stage.

The addition of the
[`parallel` attribute](https://docs.gitlab.com/ee/ci/yaml/#parallel) to the
configuration of a job will allow us to run multiples instances of Cypress at
same time.

```yaml
stages:
  - build
  - test

## Set environment variables for folders in "cache" job settings for npm modules and Cypress binary
variables:
  npm_config_cache: '$CI_PROJECT_DIR/.npm'
  CYPRESS_CACHE_FOLDER: '$CI_PROJECT_DIR/cache/Cypress'

cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - .cache/*
    - cache/Cypress
    - node_modules
    - build

## Install NPM dependencies and Cypress
install:
  image: cypress/browsers:node12.14.1-chrome85-ff81
  stage: build
  script:
    - npm ci

ui-chrome-tests:
  image: cypress/browsers:node12.14.1-chrome85-ff81
  stage: test
  parallel: 5
  script:
    # install dependencies
    - npm ci
    # start the server in the background
    - npm run start:ci &
    # run Cypress tests in parallel
    - npx cypress run --record --parallel --browser chrome --group "UI - Chrome"
```

<Alert type="bolt">

The above configuration using the `--parallel` and `--record` flags to
[cypress run](/guides/guides/command-line#cypress-run) requires setting up
recording test results to [Cypress Cloud](https://on.cypress.io/cloud).

</Alert>

## Using Cypress Cloud with GitLab CI/CD

In the GitLab CI configuration we have defined in the previous section, we are
leveraging three useful features of [Cypress Cloud](https://on.cypress.io/cloud):

1. [Recording test results with the `--record` flag](https://on.cypress.io/how-do-i-record-runs)
   to [Cypress Cloud](https://on.cypress.io/cloud):

   - In-depth and shareable [test reports](/guides/cloud/runs).
   - Visibility into test failures via quick access to error messages, stack
     traces, screenshots, videos, and contextual details.
   - [Integrating testing with the merge-request process](/guides/cloud/gitlab-integration)
     via
     [commit status guards](/guides/cloud/gitlab-integration#Commit-statuses)
     and convenient
     [test report comments](/guides/cloud/gitlab-integration#Merge-Request-comments).
   - [Detecting flaky tests](/guides/cloud/flaky-test-management) and
     surfacing them via
     [Slack alerts](/guides/cloud/flaky-test-management#Slack) or
     [GitLab PR status checks](/guides/cloud/gitlab-integration).

2. [Parallelizing test runs](/guides/guides/parallelization) and optimizing
   their execution via
   [intelligent load-balancing](/guides/guides/parallelization#Balance-strategy)
   of test specs across CI machines with the `--parallel` flag.

3. Organizing and consolidating multiple `cypress run` calls by labeled groups
   into a single report within [Cypress Cloud](https://on.cypress.io/cloud). In the example above we
   use the `--group "UI - Chrome"` flag to organize all UI tests for the Chrome
   browser into a group labeled "UI - Chrome" in the
   [Cypress Cloud](https://on.cypress.io/cloud) report.

## Cypress Real World Example with GitLab CI/CD

A complete CI workflow against multiple browsers, viewports and operating
systems is available in the
[Real World App (RWA)](https://github.com/cypress-io/cypress-realworld-app).

Clone the <Icon name="github"></Icon>
[Real World App (RWA)](https://github.com/cypress-io/cypress-realworld-app) and
refer to the
[.gitlab-ci.yml](https://github.com/cypress-io/cypress-realworld-app/blob/develop/.gitlab-ci.yml)
file.
