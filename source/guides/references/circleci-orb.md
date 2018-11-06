---
title: CircleCI Cypress Orb
---

{% note info %}
To use CircleCI Orbs in your projects, you might have to enable beta features per-project. See official CircleCI documentation.
{% endnote %}

{% fa fa-github %} {% url https://github.com/cypress-io/circleci-orb %}

Cypress CircleCI orb is a piece of configuration that can be used from your `circle.yml` file to correctly install, cache and run Cypress end-to-end Test Runner with very little effort. A typical project that just needs to install npm dependencies and run Cypress tests can simply have

```yaml
version: 2.1
orbs:
  cypress: cypress-io/cypress@1.0.0
workflows:
  build:
    jobs:
      - cypress/run # "run" job comes from "cypress" orb
```

and a more complicated project that needs to install dependencies, build application and run tests across 10 CI machines {% url "in parallel" parallelization %} can be

```yaml
version: 2.1
orbs:
  cypress: cypress-io/cypress@1.0.0
workflows:
  build:
    jobs:
      - cypress/install:
          build: 'npm run build'  # run a custom app build step
      - cypress/run:
          requires:
            - cypress/install
          record: true        # record results on Cypress Dashboard
          parallel: true      # split all specs across machines
          parallelism: 10     # use 10 CircleCI machines to finish quickly
          group: 'all tests'  # name this group "all tests" on the dashboard
          start: 'npm start'  # start server before running tests
```

In all cases, you are using `run` and `install` Jobs definitions that the Cypress team has written, tested and published inside the orb. Using the orb brings simplicity and static checks of parameters to CircleCI configuration.

You can find multiple examples on {% url "our examples page" https://github.com/cypress-io/circleci-orb/blob/master/examples.md %}.

## Jobs

The Orb exports the following job definitions to be used by the user projects

### `run`

This job allows you to run Cypress end-to-end tests on a single or on multiple machines, record test artifacts, use custom Docker image, etc. Typical use example:

```yaml
version: 2.1
orbs:
  cypress: cypress-io/cypress@1.0.0
workflows:
  build:
    jobs:
      # checks out code, installs npm dependencies
      # and runs all Cypress tests and records results on Cypress Dashboard
      - cypress/run:
          record: true
```

See all its parameters at {% url "cypress/run Job" https://github.com/cypress-io/circleci-orb/blob/master/jobs.md#run %} page.

### `install`

{% note warning %}
This job is only necessary if you plan to execute the `run` job later. If you only want to run all tests on a single machine, then you do not need a separate `install` job.
{% endnote %}

Sometimes you need to install the project's npm dependencies and build the application _once_ before running end-to-end tests, especially if you run the tests on multiple machines in parallel. For example

```yaml
version: 2.1
orbs:
  cypress: cypress-io/cypress@1.0.0
workflows:
  build:
    jobs:
      # install dependencies first
      - cypress/install
      # now run tests
      - cypress/run:
          requires:
            - cypress/install
          record: true      # record results on Cypress Dashboard
          parallel: true    # split all specs across machines
          parallelism: 2    # use 2 CircleCI machines
          group: 2 machines # name this group "2 machines"
```

See available parameters at {% url "cypress/install Job" https://github.com/cypress-io/circleci-orb/blob/master/jobs.md#install %} page.

## Versions

Cypress orb is _versioned_. Thus you can be sure that the configuration will NOT suddenly change as we change orb's commands. You can find all changes and published orb versions at {% url "cypress-io/circleci-orb/releases" https://github.com/cypress-io/circleci-orb/releases %}. We follow semantic versioning to make sure you can upgrade project configuration to newer minor and patch versions without breaking the project. Only when upgrading the orb's major version you might typically need to take extra precautions, as the job and command parameters might have changed.

## Effective config

You can see the final _effective_ configuration your project will have after resolving the jobs and commands with the provided parameters by running `circleci config process <config filename>` command from the terminal. For example, if your current Circle configuration file is `.circleci/config.yml` and it contains the following

```yaml
version: 2.1
orbs:
  cypress: cypress-io/cypress@1.0.0
workflows:
  build:
    jobs:
      - cypress/run
```

then the fully resolved configuration will show

```term
$ circleci config process .circleci/config.yml
# Orb 'cypress-io/cypress@1.0.0' resolved to 'cypress-io/cypress@1.0.0'
version: 2
jobs:
  cypress/run:
    docker:
    - image: cypress/base:10
    parallelism: 1
    steps:
    - checkout
    - restore_cache:
        keys:
        - cache-{{ .Branch }}-{{ checksum "package.json" }}
    - run:
        name: Npm CI
        command: npm ci
    - run:
        command: npx cypress verify
    - save_cache:
        key: cache-{{ .Branch }}-{{ checksum "package.json" }}
        paths:
        - ~/.npm
        - ~/.cache
    - persist_to_workspace:
        root: ~/
        paths:
        - project
        - .cache/Cypress
    - attach_workspace:
        at: ~/
    - run:
        name: Run Cypress tests
        command: 'npx cypress run'
workflows:
  build:
    jobs:
    - cypress/run
  version: 2
```

### Ejecting

If you decide that the orb does not fully capture the project configuration, you might want to save the output of the `circleci config process ...` as the new config and tweak it to suit your needs.

{% note warning %}
There is no automated way to go from the "ejected" configuration back to using the orb.
{% endnote %}

## Examples

You can find the full list of examples in {% url "cypress-io/circleci-orb examples.md" https://github.com/cypress-io/circleci-orb/blob/master/examples.md %} document.
