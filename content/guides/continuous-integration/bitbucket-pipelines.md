---
title: Bitbucket Pipelines
---

<Alert type="info">

## <Icon name="graduation-cap"></Icon> What you'll learn

- How to run Cypress tests with Bitbucket Pipelines as part of CI/CD pipeline
- How to parallelize Cypress test runs withins Bitbucket Pipelines

</Alert>

With its integrated
[integrated CI/CD, Pipelines](https://bitbucket.org/product/features/pipelines),
[Bitbucket](https://bitbucket.com) offers developers "CI/CD where it belongs,
right next to your code. No servers to manage, repositories to synchronize, or
user management to configure."

Detailed documentation is available in the
[Bitbucket Pipelines Documentation](https://support.atlassian.com/bitbucket-cloud/docs/get-started-with-bitbucket-pipelines/).

## Basic Setup

The example below shows a basic setup and job to use
[Bitbucket Pipelines](https://bitbucket.org/product/features/pipelines) to run
end-to-end tests with Cypress and Electron.

```yaml
image: node:latest

pipelines:
  default:
    - step:
        script:
          # install dependencies
          - npm ci
          # start the server in the background
          - npm run start &
          # run Cypress tests
          - npm run e2e
```

<Alert type="info">

<strong class="alert-header">Try it out</strong>

To try out the example above yourself, fork the
[Cypress Kitchen Sink](https://github.com/cypress-io/cypress-example-kitchensink)
example project and place the above Bitbucket Pipelines configuration in
`bitbucket-pipelines.yml`.

</Alert>

**How this `bitbucket-pipelines.yml` works:**

- On _push_ to this repository, this job will provision and start Bitbucket
  Pipelines-hosted Linux instance for running the pipelines defined in the
  `pipelines` section of the configuration.
- The code is checked out from our GitHub/Bitbucket repository.
- Finally, our scripts will:
  - Install npm dependencies
  - Start the project web server (`npm start`)
  - Run the Cypress tests within our GitHub/Bitbucket repository within Electron

## Testing in Chrome and Firefox with Cypress Docker Images

The Cypress team maintains the official
[Docker Images](https://github.com/cypress-io/cypress-docker-images) for running
Cypress locally and in CI, which are built with Google Chrome and Firefox. For
example, this allows us to run the tests in Firefox by passing the
`--browser firefox` attribute to `cypress run`.

```yaml
image: cypress/browsers:node12.14.1-chrome85-ff81

pipelines:
  default:
    - step:
        script:
          # install dependencies
          - npm ci
          # start the server in the background
          - npm run start &
          # run Cypress tests in Firefox
          - npx cypress run --browser firefox
```

## Caching Dependencies and Build Artifacts

Per the
[Caches documentation](https://support.atlassian.com/bitbucket-cloud/docs/cache-dependencies/),
[Bitbucket](https://bitbucket.com) offers options for caching dependencies and
build artifacts across many different workflows.

To cache `node_modules`, the npm cache across builds, the `cache` attribute and
configuration has been added below.

Artifacts from a job can be defined by providing paths to the `artifacts`
attribute.

```yaml
image: cypress/browsers:node12.14.1-chrome85-ff81

pipelines:
  default:
    - step:
        caches:
          - node
        script:
          # install dependencies
          - npm ci
          # start the server in the background
          - npm run start &
          # run Cypress tests in Firefox
          - npx cypress run --browser firefox
        artifacts:
          # store any generates images and videos as artifacts
          - cypress/screenshots/**
          - cypress/videos/**
```

Using the
[definitions](https://support.atlassian.com/bitbucket-cloud/docs/configure-bitbucket-pipelinesyml/#Global-configuration-options)
block we can define additional caches for npm and Cypress.

```yaml
definitions:
  caches:
    npm: $HOME/.npm
    cypress: $HOME/.cache/Cypress
```

## Parallelization

The [Cypress Dashboard](/guides/dashboard/introduction) offers the ability to
[parallelize and group test runs](/guides/guides/parallelization) along with
additional insights and [analytics](/guides/dashboard/analytics) for Cypress
tests.

Before diving into an example of a parallelization setup, it is important to
understand the two different types of jobs that we will declare:

- **Install Job**: A job that installs and caches dependencies that will be used
  by subsequent jobs later in the Bitbucket Pipelines workflow.
- **Worker Job**: A job that handles execution of Cypress tests and depends on
  the _install job_.

### Install Job

The separation of installation from test running is necessary when running
parallel jobs. It allows for reuse of various build steps aided by caching.

First, we break the pipeline up into reusable chunks of configuration using a
[YAML anchor](https://support.atlassian.com/bitbucket-cloud/docs/yaml-anchors/),
`&e2e`. This will be used by the worker jobs.

```yaml
image: cypress/base:14.16.0

## job definition for running E2E tests in parallel
e2e: &e2e
  name: E2E tests
  caches:
    - node
    - cypress
  script:
    - npm run start &
    - npm run e2e:record -- --parallel --ci-build-id $BITBUCKET_BUILD_NUMBER
  artifacts:
    # store any generates images and videos as artifacts
    - cypress/screenshots/**
    - cypress/videos/**
```

### Worker Jobs

Next, the worker jobs under `pipelines` that will run Cypress tests with Chrome
in parallel.

We can use the `e2e`
[YAML anchor](https://support.atlassian.com/bitbucket-cloud/docs/yaml-anchors/)
in our definition of the pipeline to execute parallel jobs using the `parallel`
attribute. This will allow us to run multiples instances of Cypress at same
time.

```yaml
## job definition for running E2E tests in parallel
## ...

pipelines:
  default:
    - step:
        name: Install dependencies
        caches:
          - npm
          - cypress
          - node
        script:
          - npm ci
    - parallel:
      # run N steps in parallel
      - step:
          <<: *e2e
      - step:
          <<: *e2e
      - step:
          <<: *e2e
definitions:
  caches:
    npm: $HOME/.npm
    cypress: $HOME/.cache/Cypress
```

The complete `bitbucket-pipelines.yml` is below:

```yaml
image: cypress/base:14.16.0

## job definition for running E2E tests in parallel
e2e: &e2e
  name: E2E tests
  caches:
    - node
    - cypress
  script:
    - npm run start &
    - npm run e2e:record -- --parallel --ci-build-id $BITBUCKET_BUILD_NUMBER
  artifacts:
    # store any generates images and videos as artifacts
    - cypress/screenshots/**
    - cypress/videos/**

pipelines:
  default:
    - step:
        name: Install dependencies
        caches:
          - npm
          - cypress
          - node
        script:
          - npm ci
    - parallel:
        # run N steps in parallel
        - step:
            <<: *e2e
        - step:
            <<: *e2e
        - step:
            <<: *e2e
definitions:
  caches:
    npm: $HOME/.npm
    cypress: $HOME/.cache/Cypress
```

<Alert type="bolt">

The above configuration using the `--parallel` and `--record` flags to
[cypress run](/guides/guides/command-line#cypress-run) requires setting up
recording test results to the
[Cypress Dashboard](https://on.cypress.io/dashboard).

</Alert>

## Using the Cypress Dashboard with Bitbucket Pipelines

In the Bitbucket Pipelines configuration we have defined in the previous
section, we are leveraging three useful features of the
[Cypress Dashboard](https://on.cypress.io/dashboard):

1. [Recording test results with the `--record` flag](https://on.cypress.io/how-do-i-record-runs)
   to the [Cypress Dashboard](https://on.cypress.io/dashboard):

   - In-depth and shareable [test reports](/guides/dashboard/runs).
   - Visibility into test failures via quick access to error messages, stack
     traces, screenshots, videos, and contextual details.
   - [Integrating testing with the pull-request process](/guides/dashboard/bitbucket-integration)
     via
     [commit status check guards](/guides/dashboard/bitbucket-integration#Status-checks)
     and convenient
     [pull request comments](/guides/dashboard/bitbucket-integration#Pull-Request-comments).
   - [Detecting flaky tests](/guides/dashboard/flaky-test-management) and
     surfacing them via
     [Slack alerts](/guides/dashboard/flaky-test-management#Slack) or
     [Bitbucket PR status checks](/guides/dashboard/bitbucket-integration).

2. [Parallelizing test runs](/guides/guides/parallelization) and optimizing
   their execution via
   [intelligent load-balancing](/guides/guides/parallelization#Balance-strategy)
   of test specs across CI machines with the `--parallel` flag.

3. Organizing and consolidating multiple `cypress run` calls by labeled groups
   into a single report within the.
   [Cypress Dashboard](https://on.cypress.io/dashboard). In the example above we
   use the `--group "UI - Chrome"` flag to organize all UI tests for the Chrome
   browser into a group labeled "UI - Chrome" in the
   [Cypress Dashboard](https://on.cypress.io/dashboard) report.

## Cypress Real World Example with Bitbucket Pipelines

A complete CI workflow against multiple browsers, viewports and operating
systems is available in the
[Real World App (RWA)](https://github.com/cypress-io/cypress-realworld-app).

Clone the <Icon name="github"></Icon>
[Real World App (RWA)](https://github.com/cypress-io/cypress-realworld-app) and
refer to the
[bitbucket-pipelines.yml](https://github.com/cypress-io/cypress-realworld-app/blob/develop/bitbucket-pipelines.yml)
file.
