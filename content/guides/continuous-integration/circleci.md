---
title: CircleCI
---

<Alert type="info">

## <Icon name="graduation-cap"></Icon> What you'll learn

- How to run Cypress tests with CircleCI as part of CI/CD pipeline
- How to parallelize Cypress test runs within CircleCI

</Alert>

<!-- textlint-disable -->

<DocsVideo src="https://youtube.com/embed/J-xbNtKgXfY"></DocsVideo>

<DocsVideo src="/img/snippets/running-in-ci.mp4" title="Cypress in CircleCI"></DocsVideo>

<!-- textlint-enable -->

## Basic Setup

The [Cypress CircleCI Orb](https://github.com/cypress-io/circleci-orb) is a
piece of configuration set in your `.circleci/config.yml` file to correctly
install, cache and run Cypress with very little effort.

Full documentation can be found at the
[`cypress-io/circleci-orb`](https://github.com/cypress-io/circleci-orb) repo.
For the Orb Quick Start Guide and usage cases, view the CircleCI
[Cypress orb documentation](https://circleci.com/developer/orbs/orb/cypress-io/cypress).

A typical project can have:

```yaml
version: 2.1
orbs:
  # "cypress-io/cypress@1" installs the latest published
  # version "1.x.y" of the orb. We recommend you then use
  # the strict explicit version "cypress-io/cypress@1.x.y"
  # to lock the version and prevent unexpected CI changes
  cypress: cypress-io/cypress@1
workflows:
  build:
    jobs:
      - cypress/run # "run" job comes from "cypress" orb
```

## Parallelization

A more complex project that needs to install dependencies, build an application
and run tests across 4 CI machines [in parallel](/guides/guides/parallelization)
may have:

```yaml
version: 2.1
orbs:
  cypress: cypress-io/cypress@1
workflows:
  build:
    jobs:
      - cypress/install:
          build: 'npm run build' # run a custom app build step
      - cypress/run:
          requires:
            - cypress/install
          record: true # record results with Cypress Cloud
          parallel: true # split all specs across machines
          parallelism: 4 # use 4 CircleCI machines to finish quickly
          group: 'all tests' # name this group "all tests" on the dashboard
          start: 'npm start' # start server before running tests
```

In all cases, you are using `run` and `install` job definitions that Cypress
provides inside the orb. Using the orb brings simplicity and static checks of
parameters to CircleCI configuration.

You can find multiple examples at
[our orb examples page](https://github.com/cypress-io/circleci-orb/blob/master/docs/examples.md)
and in the
[cypress-example-circleci-orb](https://github.com/cypress-io/cypress-example-circleci-orb)
project.

<Alert type="info">

##### <Icon name="graduation-cap"></Icon> Real World Example <Badge type="success">New</Badge>

The Cypress
[Real World App (RWA)](https://github.com/cypress-io/cypress-realworld-app) uses
the Circle CI [Cypress Orb](https://github.com/cypress-io/circleci-orb), Codecov
Orb, and Windows Orb to test over 300 test cases in parallel across 25 machines,
multiple browsers, multiple device sizes, and multiple operating systems with
full code-coverage reporting and
[Cypress Cloud recording](https://cloud.cypress.io/projects/7s5okt).

Check out the full <Icon name="github"></Icon>
[RWA Circle CI configuration](https://github.com/cypress-io/cypress-realworld-app/blob/develop/.circleci/config.yml).

</Alert>

## Additional Examples

#### Example `.circleci/config.yml` v2 config file

```yaml
version: 2
jobs:
  build:
    docker:
      - image: cypress/base:14.16.0
        environment:
          ## this enables colors in the output
          TERM: xterm
    working_directory: ~/app
    steps:
      - checkout
      - restore_cache:
          keys:
            - v1-deps-{{ .Branch }}-{{ checksum "package.json" }}
            - v1-deps-{{ .Branch }}
            - v1-deps
      - run:
          name: Install Dependencies
          command: npm ci
      - save_cache:
          key: v1-deps-{{ .Branch }}-{{ checksum "package.json" }}
          # cache NPM modules and the folder with the Cypress binary
          paths:
            - ~/.npm
            - ~/.cache
      - run: $(npm bin)/cypress run --record --key <record_key>
```

#### Example `.circleci/config.yml` v2 config file with `yarn`

```yaml
version: 2
jobs:
  build:
    docker:
      - image: cypress/base:14.16.0
        environment:
          ## this enables colors in the output
          TERM: xterm
    working_directory: ~/app
    steps:
      - checkout
      - restore_cache:
          keys:
            - v1-deps-{{ .Branch }}-{{ checksum "package.json" }}
            - v1-deps-{{ .Branch }}
            - v1-deps
      - run:
          name: Install Dependencies
          command: yarn install --frozen-lockfile
      - save_cache:
          key: v1-deps-{{ .Branch }}-{{ checksum "package.json" }}
          paths:
            - ~/.cache ## cache both yarn and Cypress!
      - run: $(yarn bin)/cypress run --record --key <record_key>
```

Find the complete CircleCI v2 example with caching and artifact upload in the
[cypress-example-docker-circle](https://github.com/cypress-io/cypress-example-docker-circle)
repo.

#### RAM Disk

You can speed up Cypress test jobs by using CircleCI RAM disk, read
[Start CircleCI Machines Faster by Using RAM Disk](https://glebbahmutov.com/blog/circle-ram-disk/)
blog post.
