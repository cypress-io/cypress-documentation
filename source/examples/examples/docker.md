---
title: Docker
containerClass: examples
---

# Images

{% fa fa-github %} {% url https://github.com/cypress-io/cypress-docker-images %}

This repo holds various Docker images for running Cypress locally and in CI.

There are Docker images:

- `cypress/base:<Node version>` has the operating system dependencies required to run Cypress.
- `cypress/browsers:<tag>` extends the base images with pre-installed browsers.
- `cypress/included:<Cypress version>` extends the base images with pre-installed Cypress versions.

# Examples

Name | Description
--- | ---
{% fa fa-github %} {% url 'GitLab' https://gitlab.com/cypress-io/cypress-example-docker-gitlab %} | Run Cypress tests in Docker on {% url 'GitLab' https://gitlab.com/ %}
{% fa fa-github %} {% url 'CircleCI 2.0' https://github.com/cypress-io/cypress-example-docker-circle %} | Run Cypress tests in Docker on {% url 'Circle 2.0' https://circleci.com %}
{% fa fa-github %} {% url 'CircleCI Workflows' https://github.com/cypress-io/cypress-example-docker-circle-workflows %} | Run Multiple Cypress tests in parallel with {% url 'Circle Workflows' https://circleci.com/docs/2.0/workflows/ %}
{% fa fa-github %} {% url 'Codeship Pro' https://github.com/cypress-io/cypress-example-docker-codeship %} | Run Cypress tests in Docker on {% url 'Codeship Pro' https://codeship.com/ %}
{% fa fa-github %} {% url 'demo-docker-cypress-included' https://github.com/bahmutov/demo-docker-cypress-included %} | Demo running the complete Docker image `cypress/included`
{% fa fa-github %} {% url 'cypress-example-docker-compose' https://github.com/cypress-io/cypress-example-docker-compose %} | Run Cypress tests using docker-compose on {% url 'CircleCI' https://circleci.com/ %}
{% fa fa-github %} {% url 'cypress-open-from-docker-compose' https://github.com/bahmutov/cypress-open-from-docker-compose %} | Demo running application and Cypress tests using docker-compose
{% fa fa-github %} {% url 'cypress-tests-apache-in-docker' https://github.com/bahmutov/cypress-tests-apache-in-docker %} | Run local Cypress tests against Apache running inside a Docker container
{% fa fa-github %} {% url 'cypress-example-docker-compose-included' https://github.com/cypress-io/cypress-example-docker-compose-included %} | Cypress example with docker-compose and `cypress/included` image
{% fa fa-github %} {% url 'cypress-desktop' https://github.com/piopi/cypress-desktop %} | Run Cypress with a desktop environment and noVNC in Docker

# See also

- ["Run Cypress with a single Docker command"](https://www.cypress.io/blog/2019/05/02/run-cypress-with-a-single-docker-command/)
