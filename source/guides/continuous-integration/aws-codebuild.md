---
title: AWS CodeBuild
---

{% note info %}
# {% fa fa-graduation-cap %} What you'll learn

- How to use AWS CodeBuild for Cypress Tests

{% endnote %}

With {% url "AWS CodeBuild" https://aws.amazon.com/codebuild/ %} Amazon Web Services (AWS) offers developers "...a fully managed build service that compiles your source code, runs unit tests, and produces artifacts that are ready to deploy" allowing teams to "pay only for the build time you use".

Detailed documentation is available in the {% url "AWS CodeBuild Documentation" https://docs.aws.amazon.com/codebuild/ %}.

# Basic Setup

The example below shows a basic setup and job to use {% url "AWS CodeBuild" https://aws.amazon.com/codebuild/ %} to run end-to-end tests with Cypress and Electron.

{% note info %}
Clone the {% url "Cypress Kitchen Sink" https://github.com/cypress-io/cypress-example-kitchensink %} example and place the following config in `buildspec.yml` in the root of the project.
{% endnote %}

How this buildspec works:

- On push to this repository, this job will run an Amazon Linux container.
- Our code from our GitHub repository.
- Our action runs as follows:
  - Install dependencies (npm/yarn)
  - Start the web server (`npm start:ci`)
  - Run the tests against Electron

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

# Chrome and Firefox with Cypress Docker Images

{% note info %}
As of version 0.2, CodeBuild does not provide a way to specify a custom image for single build configurations.  One way to solve this is using an {% url "AWS CodeBuild build-list strategy" https://docs.aws.amazon.com/codebuild/latest/userguide/batch-build-buildspec.html#build-spec.batch.build-list %}.
{% endnote %}

AWS CodeBuild offers a {% url "build-list strategy" https://docs.aws.amazon.com/codebuild/latest/userguide/batch-build-buildspec.html#build-spec.batch.build-list %} of different job configurations for a single job definition.

The {% url "build-list strategy" https://docs.aws.amazon.com/codebuild/latest/userguide/batch-build-buildspec.html#build-spec.batch.build-list %} offers a way to specify an image hosted on DockerHub or the {% url "Amazon Elastic Container Registry (ECR)" https://aws.amazon.com/ecr/ %}.

Cypress offers various {% url "Docker Images" https://github.com/cypress-io/cypress-docker-images %} for running Cypress locally and in CI, which are built with Google Chrome and Firefox. This allows us to run the tests in Firefox by passing the `--browser firefox` attribute to `cypress run`.

```yaml
# buildspec.yml
version: 0.2

# AWS CodeBuild Batch configuration
# https://docs.aws.amazon.com/codebuild/latest/userguide/batch-build-buildspec.html
# Define build to run using the "cypress/browsers:node12.14.1-chrome85-ff81" image on DockerHub
batch:
  fast-fail: false
  build-list:
    - identifier: cypress-e2e-tests
      env:
        variables:
          IMAGE: cypress/browsers:node12.14.1-chrome85-ff81

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

The {% url "Build caching in AWS CodeBuild" https://docs.aws.amazon.com/codebuild/latest/userguide/build-caching.html %} offers a Local cache and caching on Amazon S3.

Per the documentation, "Local caching stores a cache locally on a build host that is available to that build host only".  This will not be useful during parallel test runs.

The "Amazon S3 caching stores the cache in an Amazon S3 bucket that is available across multiple build hosts".  While this may sound useful, in practice the upload of cached dependencies can take some time.  Furthermore, each worker will attempt to save it's dependency cache to Amazon S3, which increases build time significantly.

Beyond the scope of this guide, but {% url "AWS CodePipeline" https://aws.amazon.com/codepipeline %} may be of use to cache the initial source, dependencies and build output.

 {% url "AWS CodePipeline" https://docs.aws.amazon.com/codepipeline/latest/userguide/welcome.html %}



# Parallelization

The {% url "Cypress Dashboard" 'dashboard' %} offers the ability to {% url 'parallelize and group test runs' parallelization %} along with additional insights and {% url "analytics" analytics %} for Cypress tests.

AWS CodeBuild offers a {% url "build-matrix strategy" https://docs.aws.amazon.com/codebuild/latest/userguide/batch-build-buildspec.html#build-spec.batch.build-matrix  %} of different job configurations for a single job definition.  The {% url "build-matrix strategy" https://docs.aws.amazon.com/codebuild/latest/userguide/batch-build-buildspec.html#build-spec.batch.build-matrix  %} provides an option to specify a container image for the job.

Cypress offers various {% url "Docker Images" https://github.com/cypress-io/cypress-docker-images %} for running Cypress locally and in CI, which are built with Google Chrome and Firefox. This allows us to run the tests in Firefox by passing the `browser: firefox` attribute to `cypress run`.

{% note info %}
The following configuration with `--parallel` and `--record` options to Cypress requires a subscription to the {% url "Cypress Dashboard" https://on.cypress.io/dashboard %}.
{% endnote %}

Below we define a job for "UI Chrome Tests" that will run tests under the `cypress/tests/ui/` path against Google Chrome.


Our command records results to the {% url "Cypress Dashboard" https://on.cypress.io/dashboard %} in parallel, using the `CYPRESS_RECORD_KEY` environment variable.

Jobs can be organized by groups by passing a `--group` attribute and value to `cypress run`.

The results from each worker will be consolidated into the group name in the {% url "Cypress Dashboard" https://on.cypress.io/dashboard %}.

## Parallelizing the build

The matrix configuration uses a variable `CY_GROUP_SPEC` with a list of items specific to each group for the build.

The fields are delimited by a pipe (`|`) character as follows:

```yaml
# Group Name | Browser | Specs | Cypress Configuration options (optional)

"UI - Chrome - Mobile|chrome|cypress/tests/ui/*|viewportWidth=375,viewportHeight=667"
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
            - "UI - Chrome|chrome|cypress/tests/ui/*"
            - "UI - Chrome - Mobile|chrome|cypress/tests/ui/*|viewportWidth=375,viewportHeight=667"
            - "API|chrome|cypress/tests/api/*"
            - "UI - Firefox|firefox|cypress/tests/ui/*"
            - "UI - Firefox - Mobile|firefox|cypress/tests/ui/*|viewportWidth=375,viewportHeight=667"

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

To parallelize the runs, we need to add an additional variable to the {% url "build-matrix strategy" https://docs.aws.amazon.com/codebuild/latest/userguide/batch-build-buildspec.html#build-spec.batch.build-matrix %} .

In the code below, the number of workers have been defined by the `WORKERS` variable. When run in the {% url "build-matrix strategy" https://docs.aws.amazon.com/codebuild/latest/userguide/batch-build-buildspec.html#build-spec.batch.build-matrix  %}, this will provide 5 workers to each group defined in the `CY_GROUP_SPEC`.

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

{% note info %}
#### {% fa fa-graduation-cap %} Real World Example

A complete CI workflow against multiple browsers, viewports and operating systems is available in the {% url "Real World App (RWA)" https://github.com/cypress-io/cypress-realworld-app %}.

Clone the {% fa fa-github %} {% url "Real World App (RWA)" https://github.com/cypress-io/cypress-realworld-app %} and refer to the {% url ".buildspec.yml" https://github.com/cypress-io/cypress-realworld-app/blob/develop/buildspec.yml %} file.
{% endnote %}

# Debugging with the Cypress Dashboard

Talk about debugging failures with the Cypress Dashboard in a general way.