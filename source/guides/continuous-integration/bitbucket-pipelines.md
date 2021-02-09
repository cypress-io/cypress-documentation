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

# Parallelization

The {% url "Cypress Dashboard" 'dashboard' %} offers the ability to {% url 'parallelize and group test runs' parallelization %} along with additional insights and {% url "analytics" analytics %} for Cypress tests.

{% note info %}
The following configuration with `--parallel` and `--record` options to Cypress requires a subscription to the {% url "Cypress Dashboard" https://on.cypress.io/dashboard %}.
{% endnote %}

Our command records results to the {% url "Cypress Dashboard" https://on.cypress.io/dashboard %} in parallel, using the `CYPRESS_RECORD_KEY` environment variable.

Jobs can be organized by groups by passing a `--group` attribute and value to `cypress run`.

Below we pass the `parallel` attribute with a numerical value for the number of workers.

The results from each worker will be consolidated into the group name in the {% url "Cypress Dashboard" https://on.cypress.io/dashboard %}.

```yaml
```

{% note info %}
#### {% fa fa-graduation-cap %} Real World Example

A complete CI workflow against multiple browsers, viewports and operating systems is available in the {% url "Real World App (RWA)" https://github.com/cypress-io/cypress-realworld-app %}.

Clone the {% fa fa-github %} {% url "Real World App (RWA)" https://github.com/cypress-io/cypress-realworld-app %} and refer to the {% url "bitbucket-pipelines.yml" https://github.com/cypress-io/cypress-realworld-app/blob/develop/bitbucket-pipelines.yml %} file.
{% endnote %}

# Debugging with the Cypress Dashboard