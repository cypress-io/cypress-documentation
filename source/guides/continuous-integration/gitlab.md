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

The addition of the `parallel` attribute will start 5 instances of the defined `image`, which enables us run multiples instances of Cypress at same time.

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
  parallel: 5
  script:
    # install dependencies
    - npm ci
    # start the server in the background
    - npm run start:ci &
    # run Cypress tests in parallel
    - npx cypress run --record --parallel --browser firefox --group "UI - Firefox"
  artifacts:
    when: always
    paths:
      - cypress/videos/**/*.mp4
      - cypress/screenshots/**/*.png
    expire_in: 1 day
```

{% note bolt %}
The above configuration using the `--parallel` and `--record` flags to {% url '`cypress run`' command-line#cypress-run %} requires setting up recording to the {% url "Cypress Dashboard" https://on.cypress.io/dashboard %}.
{% endnote %}

# Using the Cypress Dashboard with GitLab CI/CD
Finally, we tell the to record results to the {% url "Cypress Dashboard" https://on.cypress.io/dashboard %} (using the `CYPRESS_RECORD_KEY` environment variable) in parallel.

Jobs can be organized by groups and in this job we specify a `group: "UI - Firefox"` to consolidate all runs for these workers in a central location in the {% url "Cypress Dashboard" https://on.cypress.io/dashboard %}.

# Cypress Real World Example with GitLab CI/CD

A complete CI workflow against multiple browsers, viewports and operating systems is available in the {% url "Real World App (RWA)" https://github.com/cypress-io/cypress-realworld-app %}.

Clone the {% fa fa-github %} {% url "Real World App (RWA)" https://github.com/cypress-io/cypress-realworld-app %} and refer to the {% url ".gitlab-ci.yml" https://github.com/cypress-io/cypress-realworld-app/blob/develop/.gitlab-ci.yml %} file.
