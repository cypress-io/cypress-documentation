---
title: CI Provider Examples
---

Cypress should run on **all** Continuous Integration (CI) providers. We have provided some example projects and configuration for some CI providers to help you get started.

<!--
| CI Provider                                                      | Example Project                                                                                  | Example Config                                                                                                             |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| [Azure / VSTS CI / TeamFoundation](https://azure.microsoft.com/) | [cypress-example-kitchensink](https://github.com/bahmutov/cypress-example-kitchensink)           | [azure-ci.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/azure-ci.yml)                         |
| [BitBucket](https://bitbucket.org/product/features/pipelines)    | [cypress-example-kitchensink](https://bitbucket.org/cypress-io/cypress-example-kitchensink)      | [bitbucket-pipelines.yml](https://bitbucket.org/cypress-io/cypress-example-kitchensink/src/master/bitbucket-pipelines.yml) |
| [Buildkite](https://buildkite.com)                               | [cypress-example-kitchensink](https://github.com/cypress-io/cypress-example-kitchensink)         | [.buildkite/pipeline.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/.buildkite/pipeline.yml)   |
-->

# Table of Contents

- [AppVeyor](#AppVeyor)
- [AWS Amplify Console](#AWS-Amplify-Console)
- [AWS CodeBuild](#AWS-CodeBuild)
- [CircleCI](#CircleCI)
- [CodeShip](#CodeShip)
- [GitLab CI](#GitLab-CI)
- [Jenkins](#Jenkins)
- [Netlify](#Netlify)
- [Semaphore](#Semaphore)
- [Shippable](#Shippable)
- [TravisCI](#TravisCI)

## [AppVeyor](https://appveyor.com)

- [Basic appveyor.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/appveyor.yml)

## [AWS Amplify Console](https://aws.amazon.com/amplify/console)

- [Basic amplify.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/amplify.yml)

## [AWS CodeBuild](https://aws.amazon.com/codebuild)

- [AWS CodeBuild Guide](aws-codebuild)
- [Basic buildspec.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/basic/buildspec.yml)
- [Parallel buildspec.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/buildspec.yml)

<Alert type="info">

##### <Icon name="graduation-cap"></Icon> Real World Example <Badge type="success">New</Badge>

The Cypress [Real World App (RWA)](https://github.com/cypress-io/cypress-realworld-app) uses [AWS CodeBuild](https://aws.amazon.com/codebuild) to test over 300 test cases in parallel across 25 machines, multiple browsers and multiple device sizes with full code-coverage reporting and [Cypress Dashboard recording](https://dashboard.cypress.io/projects/zx15dm).

Check out the full <Icon name="github"></Icon> [RWA AWS CodeBuild configuration](https://github.com/cypress-io/cypress-realworld-app/blob/develop/buildspec.yml).

</Alert>

## [CircleCI](https://circleci.com)

- [CircleCI Guide](circleci)
- [.circleci/config.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/.circleci/config.yml) |

## [CodeShip Pro](https://codeship.com/features/pro)

- [cypress-example-docker-codeship](https://github.com/cypress-io/cypress-example-docker-codeship)

## [GitLab CI](https://gitlab.com/)

- [GitLab CI Guide](gitlab-ci)
- [Basic .gitlab-ci.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/basic/.gitlab-ci.yml) |
- [Parallel .gitlab-ci.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/.gitlab-ci.yml) |

## [Jenkins](https://jenkins.io/)

- [Basic Jenkinsfile](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/basic/Jenkinsfile) |
- [Parallel Jenkinsfile](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/Jenkinsfile) |

## [Netlify](https://www.netlify.com/)

We recommend using our official [netlify-plugin-cypress](https://github.com/cypress-io/netlify-plugin-cypress) to execute end-to-end tests before and after deployment to Netlify platform. Read our tutorials [Test Sites Deployed To Netlify Using netlify-plugin-cypress](https://glebbahmutov.com/blog/test-netlify/) and [Run Cypress Tests on Netlify Using a Single Line](https://cypress.io/blog/2020/03/30/run-cypress-tests-on-netlify-using-a-single-line/).

## [Semaphore](semaphoreci.com)

- [Basic .semaphore.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/basic/.semaphore.yml)
- [Parallel .semaphore.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/.semaphore/semaphore.yml)

## [Shippable](https://app.shippable.com/)

- [shippable.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/shippable.yml)

## [TravisCI](https://travis-ci.org/)

- [Basic .travis.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/.travis.yml)
