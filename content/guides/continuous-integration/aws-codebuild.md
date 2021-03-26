---
title: AWS CodeBuild
---

{% note info %}

# {% fa fa-graduation-cap %} What you'll learn

- How to run Cypress tests with AWS CodeBuild as part of CI/CD pipeline
- How to parallelize Cypress test runs within AWS CodeBuild

{% endnote %}

With {% url "AWS CodeBuild" https://aws.amazon.com/codebuild/ %} Amazon Web Services (AWS) offers developers "...a fully managed build service that compiles your source code, runs unit tests, and produces artifacts that are ready to deploy" allowing teams to "pay only for the build time you use".

Detailed documentation is available in the {% url "AWS CodeBuild Documentation" https://docs.aws.amazon.com/codebuild/ %}.

# Basic Setup

The example below is basic CI setup and job using the {% url "AWS CodeBuild" https://aws.amazon.com/codebuild/ %} to run Cypress tests within the Electron browser. This AWS CodeBuild configuration is placed within `buildspec.yml`.

```yaml
# buildspec.yml
version: 0.2

phases:
  install:
    runtime-versions:
      nodejs: latest
    commands:
      - npm ci
  pre_build:
    commands:
      - npm run cy:verify
      - npm run cy:info
  build:
    commands:
      - npm run start:ci &
      - npx cypress run --record
```

{% note success Try it out %}
To try out the example above yourself, fork the {% url "Cypress Kitchen Sink" https://github.com/cypress-io/cypress-example-kitchensink %} example project and place the above {% url "AWS CodeBuild" https://aws.amazon.com/codebuild/ %} configuration in `buildspec.yml`.
{% endnote %}

**How this buildspec works:**

- On _push_ to this repository, this job will provision and start AWS-hosted Amazon Linux instance with Node.js for running the outlined `pre_build` and `build` for the declared commands within the `commands` section of the configuration.
- {% url "AWS CodeBuild" https://aws.amazon.com/codebuild/ %} will checkout our code from our GitHub repository.
- Finally, our `buildspec.yml` configuration will:
  - Install npm dependencies
  - Start the project web server (`npm start:ci`)
  - Run the Cypress tests within our GitHub repository within Electron.

# Testing in Chrome and Firefox with Cypress Docker Images

{% note info %}
As of version 0.2, CodeBuild does not provide a way to specify a custom image for single build configurations. One way to solve this is using an {% url "AWS CodeBuild build-list strategy" https://docs.aws.amazon.com/codebuild/latest/userguide/batch-build-buildspec.html#build-spec.batch.build-list %}.
{% endnote %}

AWS CodeBuild offers a {% url "build-list strategy" https://docs.aws.amazon.com/codebuild/latest/userguide/batch-build-buildspec.html#build-spec.batch.build-list %} of different job configurations for a single job definition.

The {% url "build-list strategy" https://docs.aws.amazon.com/codebuild/latest/userguide/batch-build-buildspec.html#build-spec.batch.build-list %} offers a way to specify an image hosted on DockerHub or the {% url "Amazon Elastic Container Registry (ECR)" https://aws.amazon.com/ecr/ %}.

The Cypress team maintains the official {% url "Docker Images" https://github.com/cypress-io/cypress-docker-images %} for running Cypress locally and in CI, which are built with Google Chrome and Firefox. For example, this allows us to run the tests in Firefox by passing the `--browser firefox` attribute to `cypress run`.

{% note success Cypress Amazon Public ECR %}
The Cypress team has published it's {% url "Docker Images" https://github.com/cypress-io/cypress-docker-images %} for running Cypress locally and in CI in the {% url "Amazon ECR Public Gallery" https://gallery.ecr.aws %}.

The images are available in the following {% url "Amazon ECR Public Galleries" https://gallery.ecr.aws %}:

- {% url "Cypress 'base' Amazon ECR Public Gallery" https://gallery.ecr.aws/cypress-io/cypress/base %}
- {% url "Cypress 'browsers' Amazon ECR Public Gallery" https://gallery.ecr.aws/cypress-io/cypress/browsers %}
- {% url "Cypress 'included' Amazon ECR Public Gallery" https://gallery.ecr.aws/cypress-io/cypress/included %}

{% endnote %}

{% note info "Choosing the right Docker Image" %}

For end-to-end tests on a CI provider like AWS CodeBuild, the {% url "Cypress 'browsers' Amazon ECR Public Gallery" https://gallery.ecr.aws/cypress-io/cypress/browsers %} contains the images to use.

What's the difference in the images?

The `base` Docker images are used by the `browsers` and `included` images for the base operating system and set of initial dependencies, but does not install Cypress or additional browsers.

The `browsers` images extend a `base` image and installs one or more browsers such as Chrome or Firefox.

The `included` images extend a `browsers` image and installs a specific version of Cypress and adds a Docker entrypoint for the `cypress run` command. These images are for testing a containerized version of Cypress in a project during local development and are not used in CI environments.
{% endnote %}

```yaml
# buildspec.yml
version: 0.2

# AWS CodeBuild Batch configuration
# https://docs.aws.amazon.com/codebuild/latest/userguide/batch-build-buildspec.html
# Define build to run using the "cypress/browsers:node12.14.1-chrome85-ff81" image from the Cypress Amazon ECR Public Gallery
batch:
  fast-fail: false
  build-list:
    - identifier: cypress-e2e-tests
      env:
        variables:
          IMAGE: public.ecr.aws/cypress-io/cypress/browsers:node12.14.1-chrome85-ff81

phases:
  install:
    runtime-versions:
      nodejs: latest
    commands:
      - npm ci
  pre_build:
    commands:
      - npm run cy:verify
      - npm run cy:info
  build:
    commands:
      - npm run start:ci &
      - npx cypress run --record --browser firefox
```

# Caching Dependencies and Build Artifacts

Caching with {% url "AWS CodeBuild" https://aws.amazon.com/codebuild/ %} directly can be challenging.

The {% url "Build caching in AWS CodeBuild" https://docs.aws.amazon.com/codebuild/latest/userguide/build-caching.html %} document offers details on local or Amazon S3 caching.

Per the documentation, "Local caching stores a cache locally on a build host that is available to that build host only". This will not be useful during parallel test runs.

The "Amazon S3 caching stores the cache in an Amazon S3 bucket that is available across multiple build hosts". While this may sound useful, in practice the upload of cached dependencies can take some time. Furthermore, each worker will attempt to save it's dependency cache to Amazon S3, which increases build time significantly.

Beyond the scope of this guide, but {% url "AWS CodePipeline" https://aws.amazon.com/codepipeline %} may be of use to cache the initial source, dependencies and build output for use in AWS CodeBuild jobs using {% url "AWS CodePipeline Input and Output Artifacts" https://docs.aws.amazon.com/codepipeline/latest/userguide/welcome-introducing-artifacts.html %}.

Reference the {% url "AWS CodePipeline integration with CodeBuild and multiple input sources and output artifacts sample" https://docs.aws.amazon.com/codebuild/latest/userguide/sample-pipeline-multi-input-output.html" %} example for details on how to configure a CodePipeline with an output artifact.

# Parallelization

The {% url "Cypress Dashboard" 'dashboard' %} offers the ability to {% url 'parallelize and group test runs' parallelization %} along with additional insights and {% url "analytics" analytics %} for Cypress tests.

AWS CodeBuild offers a {% url "build-matrix strategy" https://docs.aws.amazon.com/codebuild/latest/userguide/batch-build-buildspec.html#build-spec.batch.build-matrix  %} for declaring different job configurations for a single job definition. The {% url "build-matrix strategy" https://docs.aws.amazon.com/codebuild/latest/userguide/batch-build-buildspec.html#build-spec.batch.build-matrix  %} provides an option to specify a container image for the job. Jobs declared within a build-matrix strategy can run in parallel which enables us run multiples instances of Cypress at same time as we will see later in this section.

The Cypress team maintains the official {% url "Docker Images" https://github.com/cypress-io/cypress-docker-images %} for running Cypress locally and in CI, which are built with Google Chrome and Firefox. This allows us to run the tests in Firefox by passing the `--browser firefox` attribute to `cypress run`.

{% note bolt %}
The following configuration with `--parallel` and `--record` options to Cypress requires a subscription to the {% url "Cypress Dashboard" https://on.cypress.io/dashboard %}.
{% endnote %}

## Parallelizing the build

To setup multiple containers to run in parallel, the `build-matrix` configuration uses a set of variables (`CY_GROUP_SPEC` and `WORKERS`) with a list of items specific to each group for the build.

The fields are delimited by a pipe (`|`) character as follows:

```yaml
# Group Name | Browser | Specs | Cypress Configuration options (optional)

'UI - Chrome - Mobile|chrome|cypress/tests/ui/*|viewportWidth=375,viewportHeight=667'
```

The `build-matrix` will run all permutations delimited items.

```yaml
batch:
  fast-fail: false
  build-matrix:
    # ...
    dynamic:
      env:
        # ...
        variables:
          CY_GROUP_SPEC:
            - 'UI - Chrome|chrome|cypress/tests/ui/*'
            - 'UI - Chrome - Mobile|chrome|cypress/tests/ui/*|viewportWidth=375,viewportHeight=667'
            - 'API|chrome|cypress/tests/api/*'
            - 'UI - Firefox|firefox|cypress/tests/ui/*'
            - 'UI - Firefox - Mobile|firefox|cypress/tests/ui/*|viewportWidth=375,viewportHeight=667'
```

During the install phase, we utilize shell scripting with the {% url "cut command" https://en.wikipedia.org/wiki/Cut_(Unix) %} to assign values from the delimited `CY_GROUP_SPEC` passed to the worker into shell variables that will be used in the `build` phase when running `cypress run`.

```yaml
batch:
  # ...

phases:
  install:
    commands:
      - CY_GROUP=$(echo $CY_GROUP_SPEC | cut -d'|' -f1)
      - CY_BROWSER=$(echo $CY_GROUP_SPEC | cut -d'|' -f2)
      - CY_SPEC=$(echo $CY_GROUP_SPEC | cut -d'|' -f3)
      - CY_CONFIG=$(echo $CY_GROUP_SPEC | cut -d'|' -f4)
      - npm ci
# ...
```

To parallelize the runs, we need to add an additional variable to the {% url "build-matrix strategy" https://docs.aws.amazon.com/codebuild/latest/userguide/batch-build-buildspec.html#build-spec.batch.build-matrix %}, `WORKERS`.

```yaml
batch:
  fast-fail: false
  build-matrix:
    # ...
    dynamic:
      env:
        # ...
        variables:
          CY_GROUP_SPEC:
            # ...
          WORKERS:
            - 1
            - 2
            - 3
            - 4
            - 5
```

{% note info Note %}
The `WORKERS` array is filled with filler (or _dummy_) items to provision the desired number of CI machine instances within the {% url "build-matrix strategy" https://docs.aws.amazon.com/codebuild/latest/userguide/batch-build-buildspec.html#build-spec.batch.build-matrix %} and will provide 5 workers to each group defined in the `CY_GROUP_SPEC`.
{% endnote %}

Finally, the script variables are passed to the call to `cypress run`.

```yaml
phases:
  install:
    # ...
  build:
    commands:
      - npm start:ci &
      - npx cypress run --record --parallel --browser $CY_BROWSER --ci-build-id $CODEBUILD_INITIATOR --group "$CY_GROUP" --spec "$CY_SPEC" --config "$CY_CONFIG"
```

# Using the Cypress Dashboard with AWS CodeBuild

In the AWS CodeBuild configuration we have defined in the previous section, we are leveraging three useful features of the {% url "Cypress Dashboard" https://on.cypress.io/dashboard %}:

1. {% url "Recording test results with the `--record` flag" https://on.cypress.io/how-do-i-record-runs %} to the {% url "Cypress Dashboard" https://on.cypress.io/dashboard %}:


    - In-depth and shareable {% url "test reports" runs %}.
    - Visibility into test failures via quick access to error messages, stack traces, screenshots, videos, and contextual details.
    - {% url "Integrating testing with the pull-request (PR) process" github-integration %} via {% url "commit status check guards" github-integration#Status-checks %} and convenient {% url "test report comments" github-integration#Pull-request-comments %}.
    - {% url "Detecting flaky tests" flaky-test-management %} and surfacing them via {% url "Slack alerts" flaky-test-management#Slack %} or {% url "GitHub PR status checks" flaky-test-management#GitHub %}.

2. {% url "Parallelizing test runs" parallelization %} and optimizing their execution via {% url "intelligent load-balancing" parallelization#Balance-strategy %} of test specs across CI machines with the `--parallel` flag.

3. Organizing and consolidating multiple `cypress run` calls by labeled groups into a single report within the. {% url "Cypress Dashboard" https://on.cypress.io/dashboard %}. In the example above we use the `--group "UI - Chrome"` flag (for the first group) to organize all UI tests for the Chrome browser into a group labeled "UI - Chrome" inside the {% url "Cypress Dashboard" https://on.cypress.io/dashboard %} report.

# Cypress Real World Example with AWS CodeBuild

A complete CI workflow against multiple browsers, viewports and operating systems is available in the {% url "Real World App (RWA)" https://github.com/cypress-io/cypress-realworld-app %}.

Clone the {% fa fa-github %} {% url "Real World App (RWA)" https://github.com/cypress-io/cypress-realworld-app %} and refer to the {% url "buildspec.yml" https://github.com/cypress-io/cypress-realworld-app/blob/develop/buildspec.yml %} file.
