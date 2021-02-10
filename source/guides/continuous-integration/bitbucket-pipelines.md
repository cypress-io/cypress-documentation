---
title: Bitbucket Pipelines
---

{% note info %}
# {% fa fa-graduation-cap %} What you'll learn

- How to use Bitbucket Pipelines for Cypress Tests

{% endnote %}

With it's integrated {% url "integrated CI/CD, Pipelines" https://bitbucket.org/product/features/pipelines %}, {% url "Bitbucket" https://bitbucket.com %} offers developers "CI/CD where it belongs, right next to your code. No servers to manage, repositories to synchronize, or user management to configure."

Detailed documentation is available in the {% url "Bitbucket Pipelines Documentation" https://support.atlassian.com/bitbucket-cloud/docs/get-started-with-bitbucket-pipelines/ %}.

# Basic Setup

The example below shows a basic setup and job to use {% url "Bitbucket Pipelines" https://bitbucket.org/product/features/pipelines %} to run end-to-end tests with Cypress and Electron.

{% note info %}
Clone the {% url "Cypress Kitchen Sink" https://github.com/cypress-io/cypress-example-kitchensink %} example and place the following config in `bitbucket-pipelines.yml` in the root of the project.
{% endnote %}

How this `bitbucket-pipelines.yml` works:

- On push to this repository, this job will run a {% url "Bitbucket Pipelines" https://bitbucket.org/product/features/pipelines %} container.
- Our code is cloned from the Bitbucket repository.
- Our action runs as follows:
  - Install dependencies (npm/yarn)
  - Start the web server (`npm start:ci`)
  - Run the tests against Electron

```yaml
image: node:latest

pipelines:
  default:
    - step:
        script:
          # install dependencies
          - npm ci
          # start the server in the background
          - npm run start:ci &
          # run Cypress tests
          - npm run e2e
```
# Chrome and Firefox with Cypress Docker Images

Cypress offers various {% url "Docker Images" https://github.com/cypress-io/cypress-docker-images %} for running Cypress locally and in CI, which are built with Google Chrome and Firefox. This allows us to run the tests in Firefox by passing the `--browser firefox` attribute to `cypress run`.

```yaml
image: cypress/browsers:node12.14.1-chrome85-ff81

pipelines:
  default:
    - step:
        script:
          # install dependencies
          - npm ci
          # start the server in the background
          - npm run start:ci &
          # run Cypress tests in Firefox
          - npx cypress run --browser firefox 
```

# Caching Dependencies and Build Artifacts

Per the {% url "Caches documentation" https://support.atlassian.com/bitbucket-cloud/docs/cache-dependencies/ %}, {% url "Bitbucket" https://bitbucket.com %} offers options for caching dependencies and build artifacts across many different workflows.

To cache `node_modules`, the npm cache across builds, the `cache` attribute and configuration has been added below.

Artifacts from a job can be defined by providing paths to the `artifacts` attribute.

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
          - npm run start:ci &
          # run Cypress tests in Firefox
          - npx cypress run --browser firefox
        artifacts:
          # store any generates images and videos as artifacts
          - cypress/screenshots/**
          - cypress/videos/**
```

Using the {% url "definitions" https://support.atlassian.com/bitbucket-cloud/docs/configure-bitbucket-pipelinesyml/#Global-configuration-options %} block we can define additional caches for npm and Cypress.

```yaml
definitions:
  caches:
    npm: $HOME/.npm
    cypress: $HOME/.cache/Cypress
```
# Parallelization

The {% url "Cypress Dashboard" 'dashboard' %} offers the ability to {% url 'parallelize and group test runs' parallelization %} along with additional insights and {% url "analytics" analytics %} for Cypress tests.

{% note info %}
The following configuration with `--parallel` and `--record` options to Cypress requires a subscription to the {% url "Cypress Dashboard" https://on.cypress.io/dashboard %}.
{% endnote %}

Our command records results to the {% url "Cypress Dashboard" https://on.cypress.io/dashboard %} in parallel, using the `CYPRESS_RECORD_KEY` environment variable.

Jobs can be organized by groups by passing a `--group` attribute and value to `cypress run`.

Below we pass the `parallel` attribute with a numerical value for the number of workers.

The results from each worker will be consolidated into the group name in the {% url "Cypress Dashboard" https://on.cypress.io/dashboard %}.

Here we break the pipeline up into reusable chunks of configuration using a {% url "YAML anchor" https://support.atlassian.com/bitbucket-cloud/docs/yaml-anchors/ %}, `&e2e`.

```yaml
image: cypress/base:10

# job definition for running E2E tests in parallel
e2e: &e2e
  name: E2E tests
  caches:
    - node
    - cypress
  script:
    - npm run start:ci &
    - npm run e2e:record -- --parallel --ci-build-id $BITBUCKET_BUILD_NUMBER
  artifacts:
    # store any generates images and videos as artifacts
    - cypress/screenshots/**
    - cypress/videos/**
```

We can use the `e2e` {% url "YAML anchor" https://support.atlassian.com/bitbucket-cloud/docs/yaml-anchors/ %} in our definition of the pipeline to execute parallel jobs using the `parallel` attribute.

```yaml
# job definition for running E2E tests in parallel
# ...

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

The full `bitbucket-pipelines.yml` is below:

```yaml
image: cypress/base:10

# job definition for running E2E tests in parallel
e2e: &e2e
  name: E2E tests
  caches:
    - node
    - cypress
  script:
    - npm run start:ci &
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

{% note info %}
#### {% fa fa-graduation-cap %} Real World Example

A complete CI workflow against multiple browsers, viewports and operating systems is available in the {% url "Real World App (RWA)" https://github.com/cypress-io/cypress-realworld-app %}.

Clone the {% fa fa-github %} {% url "Real World App (RWA)" https://github.com/cypress-io/cypress-realworld-app %} and refer to the {% url "bitbucket-pipelines.yml" https://github.com/cypress-io/cypress-realworld-app/blob/develop/bitbucket-pipelines.yml %} file.
{% endnote %}

# Debugging with the Cypress Dashboard