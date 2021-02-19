---
title: GitLab CI/CD
---

{% note info %}
# {% fa fa-graduation-cap %} What you'll learn

- How to run Cypress tests with GitLab as part of CI/CD pipeline
- How to parallelize Cypress test runs within GitLab CI/CD

{% endnote %}

With it's hosted {% url "CI/CD Service" https://about.gitlab.com/stages-devops-lifecycle/continuous-integration/ %}, {% url "GitLab" https://gitlab.com %} offers developers "a tool built into GitLab for software development through the {% url "continuous methodologies" https://docs.gitlab.com/ee/ci/introduction/index.html#introduction-to-cicd-methodologies %}".

Detailed documentation is available in the {% url "GitLab CI/CD Documentation" https://docs.gitlab.com/ee/ci/introduction/ %}.

# Basic Setup

The example below is basic CI setup and job using {% url "GitLab CI/CD" https://about.gitlab.com/stages-devops-lifecycle/continuous-integration/ %} to run Cypress tests within the Electron browser. This GitLab CI configuration is placed within `.gitlab-ci.yml`.

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

{% note info Try it out %}
To try out the example above yourself, fork the {% url "Cypress Kitchen Sink" https://github.com/cypress-io/cypress-example-kitchensink %} example project and place the above GitHub Action configuration in `.gitlab-ci.yml`.
{% endnote %}

**How this configuration works:**

- On *push* to this repository, this job will provision and start GitLab-hosted Linux instance for running the outlined `stages` declared in `script` with in the `test` job section of the configuration.
- The code is checked out from our GitHub/GitLab repository.
- Finally, our scripts will:
  - Install npm dependencies
  - Start the project web server (`npm start`)
  - Run the Cypress tests within our GitHub repository within Electron.

# Testing in Chrome and Firefox with Cypress Docker Images

The Cypress team maintains the official {% url "Docker Images" https://github.com/cypress-io/cypress-docker-images %} for running Cypress tests locally and in CI, which are built with Google Chrome and Firefox. For example, this allows us to run the tests in Firefox by passing the `--browser firefox` attribute to `cypress run`.

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

# Caching Dependencies and Build Artifacts

Caching of dependencies and build artifacts can be accomplished with the `cache` configuration. The {% url "caching documentation" https://docs.gitlab.com/ee/ci/caching/ %} contains all options for caching dependencies and build artifacts across many different workflows. Artifacts from a job can be defined by providing paths and an optional expiry time.

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

# Parallelization

The {% url "Cypress Dashboard" dashboard %} offers the ability to {% url "parallelize and group test runs" parallelization %} along with additional insights and {% url "analytics" analytics %} for Cypress tests.

The addition of the {% url '`parallel` attribute' https://docs.gitlab.com/ee/ci/yaml/#parallel %} to the configuration of a job will allow us to run multiples instances of Cypress at same time as we will see later in this section.

Before diving into an example of a parallelization setup, it is important to understand the two different types of jobs that we will declare:

- **Install Job**: A job that installs and caches dependencies that will used by subsequent jobs later in the GitLab CI workflow.
- **Worker Job**: A job that handles execution of Cypress tests and depends on the *install job*.

## Install Job

The separation of installation from test running is necessary when running parallel jobs. It allows for reuse of various build steps aided by caching.

First, we will define the `build` stage along with `cache` and variables related to the cache.

Then we define the `install` step that will be used by the worker jobs and assign it to the `build` stage.

```yaml
stages:
  - build

# Set environment variables for folders in "cache" job settings for npm modules and Cypress binary
variables:
  npm_config_cache: "$CI_PROJECT_DIR/.npm"
  CYPRESS_CACHE_FOLDER: "$CI_PROJECT_DIR/cache/Cypress"

cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - .cache/*
    - cache/Cypress
    - node_modules
    - build

# Install NPM dependencies and Cypress
install:
  image: cypress/browsers:node12.14.1-chrome85-ff81
  stage: build
  script:
    - npm ci
```

## Worker Jobs

Next, we add a `test` stage and define the worker job named `ui-chrome-tests` that will run Cypress tests with Chrome in parallel during the `test` stage.

The addition of the {% url "`parallel` attribute" https://docs.gitlab.com/ee/ci/yaml/#parallel %} to the configuration of a job will allow us to run multiples instances of Cypress at same time.

```yaml
stages:
  - build
  - test

# Set environment variables for folders in "cache" job settings for npm modules and Cypress binary
variables:
  npm_config_cache: "$CI_PROJECT_DIR/.npm"
  CYPRESS_CACHE_FOLDER: "$CI_PROJECT_DIR/cache/Cypress"

cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - .cache/*
    - cache/Cypress
    - node_modules
    - build

# Install NPM dependencies and Cypress
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

{% note bolt %}
The above configuration using the `--parallel` and `--record` flags to {% url "`cypress run`" command-line#cypress-run %} requires setting up recording to the {% url "Cypress Dashboard" https://on.cypress.io/dashboard %}.
{% endnote %}

# Using the Cypress Dashboard with GitLab CI/CD

Finally, we tell the to record results to the {% url "Cypress Dashboard" https://on.cypress.io/dashboard %} (using the `CYPRESS_RECORD_KEY` environment variable) in parallel.

Jobs can be organized by groups and in this job we specify a `group: "UI - Chrome"` to consolidate all runs for these workers in a central location in the {% url "Cypress Dashboard" https://on.cypress.io/dashboard %}.

# Cypress Real World Example with GitLab CI/CD

A complete CI workflow against multiple browsers, viewports and operating systems is available in the {% url "Real World App (RWA)" https://github.com/cypress-io/cypress-realworld-app %}.

Clone the {% fa fa-github %} {% url "Real World App (RWA)" https://github.com/cypress-io/cypress-realworld-app %} and refer to the {% url ".gitlab-ci.yml" https://github.com/cypress-io/cypress-realworld-app/blob/develop/.gitlab-ci.yml %} file.
