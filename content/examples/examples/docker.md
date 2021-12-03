---
title: Docker
containerClass: examples
---

## Images

<Icon name="github"/>
[https://github.com/cypress-io/cypress-docker-images](https://github.com/cypress-io/cypress-docker-images)

This repo holds various Docker images for running Cypress locally and in CI.

There are Docker images:

- `cypress/base:<Node version>` has the operating system dependencies required
  to run Cypress.
- `cypress/browsers:<tag>` extends the base images with pre-installed browsers.
- `cypress/included:<Cypress version>` extends the base images with
  pre-installed Cypress versions.

## Examples

| Name                                                                                                                                   | Description                                                                                              |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| <Icon name="github"/> [GitLab](https://gitlab.com/cypress-io/cypress-example-docker-gitlab)                                            | Run Cypress tests in Docker on [GitLab](https://gitlab.com/)                                             |
| <Icon name="github"/> [CircleCI 2.0](https://github.com/cypress-io/cypress-example-docker-circle)                                      | Run Cypress tests in Docker on [Circle 2.0](https://circleci.com)                                        |
| <Icon name="github"/> [CircleCI Workflows](https://github.com/cypress-io/cypress-example-docker-circle-workflows)                      | Run Multiple Cypress tests in parallel with [Circle Workflows](https://circleci.com/docs/2.0/workflows/) |
| <Icon name="github"/> [Codeship Pro](https://github.com/cypress-io/cypress-example-docker-codeship)                                    | Run Cypress tests in Docker on [Codeship Pro](https://codeship.com/)                                     |
| <Icon name="github"/> [demo-docker-cypress-included](https://github.com/bahmutov/demo-docker-cypress-included)                         | Demo running the complete Docker image `cypress/included`                                                |
| <Icon name="github"/> [cypress-example-docker-compose](https://github.com/cypress-io/cypress-example-docker-compose)                   | Run Cypress tests using docker-compose on [CircleCI](https://circleci.com/)                              |
| <Icon name="github"/> [cypress-open-from-docker-compose](https://github.com/bahmutov/cypress-open-from-docker-compose)                 | Demo running application and Cypress tests using docker-compose                                          |
| <Icon name="github"/> [cypress-tests-apache-in-docker](https://github.com/bahmutov/cypress-tests-apache-in-docker)                     | Run local Cypress tests against Apache running inside a Docker container                                 |
| <Icon name="github"/> [cypress-example-docker-compose-included](https://github.com/cypress-io/cypress-example-docker-compose-included) | Cypress example with docker-compose and `cypress/included` image                                         |
| <Icon name="github"/> [cypress-desktop](https://github.com/piopi/cypress-desktop)                                                      | Run Cypress with a desktop environment and noVNC in Docker                                               |

## See also

- ["Run Cypress with a single Docker command"](https://www.cypress.io/blog/2019/05/02/run-cypress-with-a-single-docker-command/)
