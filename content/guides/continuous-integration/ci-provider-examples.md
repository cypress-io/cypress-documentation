---
title: CI Provider Examples
---

<Alert type="success">
<b>Cypress should run on all Continuous Integration (CI) providers.</b> We have provided some example projects and configuration for some CI providers to help you get started.

</Alert>

## Guides

For the following CI Providers we have in depth guides.

### [AWS CodeBuild](https://aws.amazon.com/codebuild)

<Icon name="book" color="gray"></Icon> [AWS CodeBuild Guide](aws-codebuild)
<br />
<Icon name="external-link-alt" color="gray"></Icon> [See AWS CodeBuild + Cypress Dashboard in action](https://dashboard.cypress.io/projects/zx15dm)
<br />
<br />

<Alert type="info">

##### <Icon name="graduation-cap"></Icon> Real World Example <Badge type="success">New</Badge>

The Cypress [Real World App (RWA)](https://github.com/cypress-io/cypress-realworld-app) uses [AWS CodeBuild](https://aws.amazon.com/codebuild) to test over 300 test cases in parallel across 25 machines, multiple browsers and multiple device sizes with full code-coverage reporting and [Cypress Dashboard recording](https://dashboard.cypress.io/projects/zx15dm).

Check out the full <Icon name="github"></Icon> [RWA AWS CodeBuild configuration](https://github.com/cypress-io/cypress-realworld-app/blob/develop/buildspec.yml).

</Alert>

### [BitBucket](https://bitbucket.org/product/features/pipelines)

<Icon name="book" color="gray"></Icon> [BitBucket Pipelines Guide](bitbucket-pipelines)
<br />
<Icon name="external-link-alt" color="gray"></Icon> [See BitBucket Pipelines + Cypress Dashboard in action](https://dashboard.cypress.io/projects/q1ovwz).
<br />
<br />

<Alert type="info">

##### <Icon name="graduation-cap"></Icon> Real World Example <Badge type="success">New</Badge>

The Cypress [Real World App (RWA)](https://github.com/cypress-io/cypress-realworld-app) uses [BitBucket Pipelines](https://bitbucket.org/product/features/pipelines) to test over 300 test cases in parallel across 25 machines, multiple browsers and multiple device sizes with full code-coverage reporting and [Cypress Dashboard recording](https://dashboard.cypress.io/projects/zx15dm).

Check out the full <Icon name="github"></Icon> [RWA BitBucket Pipelines configuration](https://github.com/cypress-io/cypress-realworld-app/blob/develop/bitbucket-pipelines.yml).

</Alert>

## Examples

### [AppVeyor](https://appveyor.com)

- [Basic Example (appveyor.yml)](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/appveyor.yml)

### [AWS Amplify Console](https://aws.amazon.com/amplify/console)

- [Basic Example (amplify.yml)](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/amplify.yml)

### [Azure Pipelines](https://azure.microsoft.com/)

<Alert type="info">
<strong class="alert-header">Note</strong>

Azure Pipelines was formerly called Visual Studio Team Services(VSTS) CI or TeamFoundation

</Alert>

- [Basic Example (azure-ci.yml)](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/basic/azure-ci.yml)
- [Parallelized Example (azure-ci.yml)](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/azure-ci.yml)

### [BitBucket](https://bitbucket.org/product/features/pipelines)

- [BitBucket Pipelines Guide](bitbucket-pipelines)
- [Parallel Example (bitbucket-pipelines.yml)](https://bitbucket.org/cypress-io/cypress-example-kitchensink/src/master/bitbucket-pipelines.yml)

### [Buildkite](https://buildkite.com)

- [Parallel Example (.buildkite/pipeline.yml)](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/.buildkite/pipeline.yml)

### [CircleCI](https://circleci.com)

- [CircleCI Guide](circleci)
- [Basic .circleci/config.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/basic/.circleci/config.yml)
- [Parallel .circleci/config.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/.circleci/config.yml)

### [CodeShip Pro](https://codeship.com/features/pro)

- [cypress-example-docker-codeship](https://github.com/cypress-io/cypress-example-docker-codeship)
- [Basic](https://github.com/cypress-io/cypress-example-kitchensink/tree/master/basic/codeship-pro)
- [Parallel codeship-steps.yml](https://github.com/cypress-io/cypress-example-kitchensink/tree/master/codeship-steps.yml)
- [Parallel codeship-services.yml](https://github.com/cypress-io/cypress-example-kitchensink/tree/master/codeship-services.yml)

### [GitLab CI](https://gitlab.com/)

- [GitLab CI Guide](gitlab-ci)
- [Basic .gitlab-ci.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/basic/.gitlab-ci.yml)
- [Parallel .gitlab-ci.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/.gitlab-ci.yml)

### [Jenkins](https://jenkins.io/)

- [Basic Jenkinsfile](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/basic/Jenkinsfile)
- [Parallel Jenkinsfile](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/Jenkinsfile)

### [Netlify](https://www.netlify.com/)

We recommend using our official [netlify-plugin-cypress](https://github.com/cypress-io/netlify-plugin-cypress) to execute end-to-end tests before and after deployment to Netlify platform. Read our tutorials [Test Sites Deployed To Netlify Using netlify-plugin-cypress](https://glebbahmutov.com/blog/test-netlify/) and [Run Cypress Tests on Netlify Using a Single Line](https://cypress.io/blog/2020/03/30/run-cypress-tests-on-netlify-using-a-single-line/).

### [Semaphore](semaphoreci.com)

- [Basic .semaphore.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/basic/.semaphore.yml)
- [Parallel .semaphore.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/.semaphore/semaphore.yml)

### [Shippable](https://app.shippable.com/)

- [shippable.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/shippable.yml)

### [TravisCI](https://travis-ci.org/)

- [Basic .travis.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/basic/.travis.yml)
- [Parallel .travis.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/.travis.yml)
