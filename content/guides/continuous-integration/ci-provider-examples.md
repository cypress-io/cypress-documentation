---
title: CI Provider Examples
---

<Alert type="success">

<b>Cypress is compatible with all Continuous Integration (CI) providers and systems.</b> On this page
you’ll find extensive guides for using Cypress with some of the most popular CI providers, and assorted
quick start examples for many other providers.

</Alert>

## Guides

For the following CI Providers we have in depth guides.

### CircleCI

<Icon name="book" color="gray"></Icon> [CircleCI Guide](circleci) <br />
<Icon name="external-link-alt" color="gray"></Icon>
[See CircleCI + Cypress Dashboard in action](https://dashboard.cypress.io/projects/7s5okt)
<br /> <br />

<Alert type="info">

##### <Icon name="graduation-cap"></Icon> Real World Example <Badge type="success">New</Badge>

The Cypress
[Real World App (RWA)](https://github.com/cypress-io/cypress-realworld-app) uses
[CircleCI](https://circleci.com) to test over 300 test cases in parallel across
25 machines, multiple browsers, multiple device sizes, and multiple operating
systems with full code-coverage reporting and
[Cypress Dashboard recording](https://dashboard.cypress.io/projects/7s5okt).

Check out the full <Icon name="github"></Icon>
[RWA CircleCI configuration](https://github.com/cypress-io/cypress-realworld-app/blob/develop/.circleci/config.yml).

</Alert>

### GitHub Actions

<Icon name="book" color="gray"></Icon> [GitHub Actions Guide](github-actions)
<br /> <Icon name="external-link-alt" color="gray"></Icon>
[See GitHub Actions + Cypress Dashboard in action](https://dashboard.cypress.io/projects/tpys4j)
<br /> <br />

<Alert type="info">

##### <Icon name="graduation-cap"></Icon> Real World Example <Badge type="success">New</Badge>

The Cypress
[Real World App (RWA)](https://github.com/cypress-io/cypress-realworld-app) uses
[GitHub Actions](https://github.com) to test over 300 test cases in parallel
across 25 machines, multiple browsers, multiple device sizes, and multiple
operating systems with
[Cypress Dashboard recording](https://dashboard.cypress.io/projects/tpys4j).

Check out the full <Icon name="github"></Icon>
[RWA GitHub Actions configuration](https://github.com/cypress-io/cypress-realworld-app/blob/develop/.github/workflows/main.yml).

</Alert>

### BitBucket

<Icon name="book" color="gray"></Icon>
[BitBucket Pipelines Guide](bitbucket-pipelines) <br />
<Icon name="external-link-alt" color="gray"></Icon>
[See BitBucket Pipelines + Cypress Dashboard in action](https://dashboard.cypress.io/projects/q1ovwz)
<br /> <br />

<Alert type="info">

##### <Icon name="graduation-cap"></Icon> Real World Example <Badge type="success">New</Badge>

The Cypress
[Real World App (RWA)](https://github.com/cypress-io/cypress-realworld-app) uses
[BitBucket Pipelines](https://bitbucket.org/product/features/pipelines) to test
over 300 test cases in parallel across 25 machines, multiple browsers and
multiple device sizes with
[Cypress Dashboard recording](https://dashboard.cypress.io/projects/q1ovwz).

Check out the full <Icon name="github"></Icon>
[RWA BitBucket Pipelines configuration](https://github.com/cypress-io/cypress-realworld-app/blob/develop/bitbucket-pipelines.yml).

</Alert>

### GitLab CI

<Icon name="book" color="gray"></Icon> [GitLab CI Guide](gitlab-ci) <br />
<Icon name="external-link-alt" color="gray"></Icon>
[See GitLab CI + Cypress Dashboard in action](https://dashboard.cypress.io/projects/woih1m)
<br /> <br />

<Alert type="info">

##### <Icon name="graduation-cap"></Icon> Real World Example <Badge type="success">New</Badge>

The Cypress
[Real World App (RWA)](https://github.com/cypress-io/cypress-realworld-app) uses
[GitLab CI](https://gitlab.com) to test over 300 test cases in parallel across
25 machines, multiple browsers and multiple device sizes with
[Cypress Dashboard recording](https://dashboard.cypress.io/projects/woih1m).

Check out the full <Icon name="github"></Icon>
[RWA GitLab CI configuration](https://github.com/cypress-io/cypress-realworld-app/blob/develop/gitlab-ci.yml).

</Alert>

### AWS CodeBuild

<Icon name="book" color="gray"></Icon> [AWS CodeBuild Guide](aws-codebuild)
<br /> <Icon name="external-link-alt" color="gray"></Icon>
[See AWS CodeBuild + Cypress Dashboard in action](https://dashboard.cypress.io/projects/zx15dm)
<br /> <br />

<Alert type="info">

##### <Icon name="graduation-cap"></Icon> Real World Example <Badge type="success">New</Badge>

The Cypress
[Real World App (RWA)](https://github.com/cypress-io/cypress-realworld-app) uses
[AWS CodeBuild](https://aws.amazon.com/codebuild) to test over 300 test cases in
parallel across 25 machines, multiple browsers and multiple device sizes with
[Cypress Dashboard recording](https://dashboard.cypress.io/projects/zx15dm).

Check out the full <Icon name="github"></Icon>
[RWA AWS CodeBuild configuration](https://github.com/cypress-io/cypress-realworld-app/blob/develop/buildspec.yml).

</Alert>

## Examples

### TravisCI

- [Basic .travis.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/basic/.travis.yml)
- [Parallel .travis.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/.travis.yml)

### Azure Pipelines

<Alert type="info">
<strong class="alert-header">Note</strong>

Azure Pipelines was formerly called Visual Studio Team Services(VSTS) CI or
TeamFoundation

</Alert>

- [Basic Example (azure-ci.yml)](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/basic/azure-ci.yml)
- [Parallelized Example (azure-ci.yml)](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/azure-ci.yml)

### Jenkins

- [Basic Jenkinsfile](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/basic/Jenkinsfile)
- [Parallel Jenkinsfile](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/Jenkinsfile)

### Netlify

We recommend using our official
[netlify-plugin-cypress](https://github.com/cypress-io/netlify-plugin-cypress)
to execute end-to-end tests before and after deployment to Netlify platform.
Read our tutorials
[Test Sites Deployed To Netlify Using netlify-plugin-cypress](https://glebbahmutov.com/blog/test-netlify/)
and
[Run Cypress Tests on Netlify Using a Single Line](https://cypress.io/blog/2020/03/30/run-cypress-tests-on-netlify-using-a-single-line/).

### Buildkite

- [Parallel Example (.buildkite/pipeline.yml)](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/.buildkite/pipeline.yml)

### CodeShip Pro

- [cypress-example-docker-codeship](https://github.com/cypress-io/cypress-example-docker-codeship)
- [Basic](https://github.com/cypress-io/cypress-example-kitchensink/tree/master/basic/codeship-pro)
- [Parallel codeship-steps.yml](https://github.com/cypress-io/cypress-example-kitchensink/tree/master/codeship-steps.yml)
- [Parallel codeship-services.yml](https://github.com/cypress-io/cypress-example-kitchensink/tree/master/codeship-services.yml)

### Semaphore

- [Basic .semaphore.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/basic/.semaphore.yml)
- [Parallel .semaphore.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/.semaphore/semaphore.yml)

### Shippable

- [shippable.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/shippable.yml)

### AppVeyor

- [Basic Example (appveyor.yml)](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/appveyor.yml)

### AWS Amplify Console

- [Basic Example (amplify.yml)](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/amplify.yml)

### LayerCI

- [cypress-example-layerci](https://github.com/bahmutov/cypress-example-layerci)
