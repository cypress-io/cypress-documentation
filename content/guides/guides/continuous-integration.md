---
title: Continuous Integration
---

<Alert type="info">


## <Icon name="graduation-cap"></Icon> What you'll learn

- How to run Cypress tests in Continuous Integration
- How to configure Cypress in various CI Providers
- How to record tests to the Cypress Dashboard
- How to run tests in parallel on CI

</Alert>

<DocsVideo src="/img/snippets/running-in-ci.mp4"></DocsVideo>

## Setting up CI

<!-- textlint-disable -->
<DocsVideo src="https://youtube.com/embed/saYovXS9Llk"></DocsVideo>
<!-- textlint-enable -->

### Basics

Running Cypress in Continuous Integration is almost the same as running it locally in your terminal. You generally only need to do two things:

  1. **Install Cypress**

  ```shell
  npm install cypress --save-dev
  ```

  2. **Run Cypress**

  ```shell
  cypress run
  ```

Depending on which CI provider you use, you may need a config file. You'll want to refer to your CI provider's documentation to know where to add the commands to install and run Cypress. For more configuration examples check out our [examples](#Examples).

### Boot your server

#### Challenges

Typically you will need to boot a local server prior to running Cypress.  When you boot your web server, it runs as a **long running process** that will never exit. Because of this, you'll need it to run in the **background** - else your CI provider will never move onto the next command.

Backgrounding your server process means that your CI provider will continue to execute the next command after executing the signal to start your server.

Many people approach this situation by running a command like the following:

```shell
npm start & cypress run // Do not do this
```

The problem is - what happens if your server takes time to boot? There is no guarantee that when the next command runs (`cypress run`) that your web server is up and available. So your Cypress test may start and try to visit your local server before it is ready to be visited.

#### Solutions

Luckily, there are some solutions for this. Instead of introducing arbitrary waits (like `sleep 20`) you can use a better option.

***`wait-on` module***

Using the [wait-on](https://github.com/jeffbski/wait-on) module, you can block the `cypress run` command from executing until your server has booted.

```shell
npm start & wait-on http://localhost:8080
```

```shell
cypress run
```

<Alert type="info">


Most CI providers will automatically kill background processes so you don't have to worry about cleaning up your server process once Cypress finishes.

However, if you're running this script locally you'll have to do a bit more work to collect the backgrounded PID and then kill it after `cypress run`.

</Alert>

***`start-server-and-test` module***

If the server takes a very long time to start, we recommend trying the [start-server-and-test](https://github.com/bahmutov/start-server-and-test) module.

```shell
npm install --save-dev start-server-and-test
```

In your `package.json` scripts, pass the command to boot your server, the url your server is hosted on and your Cypress test command.

```json
{
  ...
  "scripts": {
    "start": "my-server -p 3030",
    "cy:run": "cypress run",
    "test": "start-server-and-test start http://localhost:3030 cy:run"
  }
}
```

In the example above, the `cy:run` command will only be executed when the URL `http://localhost:3030` responds with an HTTP status code of 200. The server will also shut down when the tests complete.

*Gotchas*

When [working with `webpack-dev-server`](https://github.com/bahmutov/start-server-and-test#note-for-webpack-dev-server-users) that does not respond to `HEAD` requests, use an explicit `GET` method to ping the server like this:

```json
{
  "scripts": {
    "test": "start-server-and-test start http-get://localhost:3030 cy:run"
  }
}
```

When working with local `https` in webpack, set an environment variable to allow local certificate:

```json
{
  "scripts": {
    "start": "my-server -p 3030 --https",
    "cy:run": "cypress run",
    "cy:ci": "START_SERVER_AND_TEST_INSECURE=1 start-server-and-test start https-get://localhost:3030 cy:run"
  }
}
```

### Record tests

Cypress can record your tests and make the results available in the [Cypress Dashboard](/guides/dashboard/dashboard-introduction), which is a service that gives you access to recorded tests - typically when running Cypress tests from your [CI provider](/guides/guides/continuous-integration). The Dashboard provides you insight into what happened when your tests ran.

#### Recording tests allow you to:

- See the number of failed, pending and passing tests.
- Get the entire stack trace of failed tests.
- View screenshots taken when tests fail and when using [`cy.screenshot()`](/api/commands/screenshot).
- Watch a video of your entire test run or a clip at the point of test failure.
- See which machines ran each test when [parallelized](/guides/guides/parallelization).

#### To record tests:

1. [Set up your project to record](/guides/dashboard/projects#Setup)
2. [Pass the `--record` flag to `cypress run`](/guides/guides/command-line#cypress-run) within CI.

```shell
cypress run --record --key=abc123
```

[Read the full guide on the Dashboard Service.](/guides/dashboard/dashboard-introduction)

### Run tests in parallel

Cypress can run tests in parallel across multiple machines.

You'll want to refer to your CI provider's documentation on how to set up multiple machines to run in your CI environment.

Once multiple machines are available within your CI environment, you can pass the [--parallel](/guides/guides/command-line#cypress-run-parallel) flag to have your tests run in parallel.

```shell
cypress run --record --key=abc123 --parallel
```

[Read the full guide on parallelization.](/guides/guides/parallelization)

## Examples

Cypress should run on **all** CI providers. We have provided some example projects and configuration for some CI providers to help you get started.

CI Provider | Example Project | Example Config
----------- | --------------- | --------------
[AWS Amplify Console](https://aws.amazon.com/amplify/console) | [cypress-example-kitchensink](https://github.com/cypress-io/cypress-example-kitchensink) | [amplify.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/amplify.yml)
[AppVeyor](https://appveyor.com) | [cypress-example-kitchensink](https://github.com/cypress-io/cypress-example-kitchensink) | [appveyor.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/appveyor.yml)
[Azure / VSTS CI / TeamFoundation](https://azure.microsoft.com/) | [cypress-example-kitchensink](https://github.com/bahmutov/cypress-example-kitchensink) | [azure-ci.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/azure-ci.yml)
[BitBucket](https://bitbucket.org/product/features/pipelines) | [cypress-example-kitchensink](https://bitbucket.org/cypress-io/cypress-example-kitchensink) | [bitbucket-pipelines.yml](https://bitbucket.org/cypress-io/cypress-example-kitchensink/src/master/bitbucket-pipelines.yml)
[Buildkite](https://buildkite.com) | [cypress-example-kitchensink](https://github.com/cypress-io/cypress-example-kitchensink) | [.buildkite/pipeline.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/.buildkite/pipeline.yml)
[CircleCI](https://circleci.com) | [cypress-example-kitchensink](https://github.com/cypress-io/cypress-example-kitchensink) | [.circleci/config.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/.circleci/config.yml)
[CodeShip Basic](https://codeship.com/features/basic) (has [cy.exec() issue](https://github.com/cypress-io/cypress/issues/328)) | |
[CodeShip Pro](https://codeship.com/features/pro) | [cypress-example-docker-codeship](https://github.com/cypress-io/cypress-example-docker-codeship) |
[Concourse](https://concourse-ci.org/) | |
[Docker](https://www.docker.com/) | [cypress-docker-images](https://github.com/cypress-io/cypress-docker-images) |
[GitLab](https://gitlab.com/) | [cypress-example-kitchensink](https://github.com/cypress-io/cypress-example-kitchensink) | [.gitlab-ci.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/.gitlab-ci.yml)
[Jenkins](https://jenkins.io/) | [cypress-example-kitchensink](https://github.com/cypress-io/cypress-example-kitchensink) | [Jenkinsfile](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/Jenkinsfile)
[Semaphore](https://semaphoreci.com/) | |
[Shippable](https://app.shippable.com/) | [cypress-example-kitchensink](https://github.com/cypress-io/cypress-example-kitchensink) | [shippable.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/shippable.yml)
[TravisCI](https://travis-ci.org/) | [cypress-example-kitchensink](https://github.com/cypress-io/cypress-example-kitchensink) | [.travis.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/.travis.yml)

### Travis

#### Example `.travis.yml` config file

```yaml
language: node_js
node_js:
  - 10
addons:
  apt:
    packages:
      # Ubuntu 16+ does not install this dependency by default, so we need to install it ourselves
      - libgconf-2-4
cache:
  # Caches $HOME/.npm when npm ci is default script command
  # Caches node_modules in all other cases
  npm: true
  directories:
    # we also need to cache folder with Cypress binary
    - ~/.cache
install:
  - npm ci
script:
  - $(npm bin)/cypress run --record
```

Caching folders with npm modules saves a lot of time after the first build.

### CircleCI

<!-- textlint-disable -->
<DocsVideo src="https://youtube.com/embed/J-xbNtKgXfY"></DocsVideo>
<!-- textlint-enable -->

<Alert type="info">


##### <Icon name="graduation-cap"></Icon> Real World Example <Badge type="success">New</Badge>

The Cypress [Real World App (RWA)](https://github.com/cypress-io/cypress-realworld-app) uses the Circle CI [Cypress Orb](https://github.com/cypress-io/circleci-orb), Codecov Orb, and Windows Orb to test over 300 test cases in parallel across 25 machines, multiple browsers, multiple device sizes, and multiple operating systems with full code-coverage reporting and [Cypress Dashboard recording](https://dashboard.cypress.io/projects/7s5okt).

Check out the full <Icon name="github"></Icon> [RWA Circle CI configuration](https://github.com/cypress-io/cypress-realworld-app/blob/develop/.circleci/config.yml).


</Alert>

#### Example CircleCI Orb

The Cypress CircleCI Orb is a piece of configuration set in your `.circleci/config.yml` file to correctly install, cache and run Cypress with very little effort.

Full documentation can be found at the [`cypress-io/circleci-orb`](https://github.com/cypress-io/circleci-orb) repo.

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

A more complex project that needs to install dependencies, build an application and run tests across 4 CI machines [in parallel](/guides/guides/parallelization) may have:

```yaml
version: 2.1
orbs:
  cypress: cypress-io/cypress@1
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
          parallelism: 4      # use 4 CircleCI machines to finish quickly
          group: 'all tests'  # name this group "all tests" on the dashboard
          start: 'npm start'  # start server before running tests
```

In all cases, you are using `run` and `install` job definitions that Cypress provides inside the orb. Using the orb brings simplicity and static checks of parameters to CircleCI configuration.

You can find multiple examples at [our orb examples page](https://github.com/cypress-io/circleci-orb/blob/master/docs/examples.md) and in the [cypress-example-circleci-orb](https://github.com/cypress-io/cypress-example-circleci-orb) project.

#### Example `.circleci/config.yml` v2 config file

```yaml
version: 2
jobs:
  build:
    docker:
      - image: cypress/base:10
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
      - image: cypress/base:10
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
            - ~/.cache  ## cache both yarn and Cypress!
      - run: $(yarn bin)/cypress run --record --key <record_key>
```

Find the complete CircleCI v2 example with caching and artifact upload in the [cypress-example-docker-circle](https://github.com/cypress-io/cypress-example-docker-circle) repo.

#### RAM Disk

You can speed up Cypress test jobs by using CircleCI RAM disk, read [Start CircleCI Machines Faster by Using RAM Disk](https://glebbahmutov.com/blog/circle-ram-disk/) blog post.

### AWS Amplify

#### Example `amplify.yml`

```yaml
version: 0.1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: app
    files:
      - "**/*"
  cache:
    paths:
      - node_modules/**/*
test:
  artifacts:
    baseDirectory: cypress
    configFilePath: "**/mochawesome.json"
    files:
      - "**/*.png"
      - "**/*.mp4"
  phases:
    preTest:
      commands:
        - npm install
        - npm install wait-on
        - npm install mocha mochawesome mochawesome-merge mochawesome-report-generator
        - "npm start & npx wait-on http://127.0.0.1:8080"
    test:
      commands:
        - 'npx cypress run --reporter mochawesome --reporter-options "reportDir=cypress/report/mochawesome-report,overwrite=false,html=false,json=true,timestamp=mmddyyyy_HHMMss"'
    postTest:
      commands:
        - npx mochawesome-merge --reportDir cypress/report/mochawesome-report > cypress/report/mochawesome.json
```

#### Example `amplify.yml` v2 with --record for Cypress Dashboard

Add `CYPRESS_RECORD_KEY` Enviroment Variable in [Amplify Console](https://aws.amazon.com/amplify/console/).

```yaml
version: 0.1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: app
    files:
      - "**/*"
  cache:
    paths:
      - node_modules/**/*
test:
  artifacts:
    baseDirectory: cypress
    configFilePath: "**/mochawesome.json"
    files:
      - "**/*.png"
      - "**/*.mp4"
  phases:
    preTest:
      commands:
        - npm install
        - npm install wait-on
        - npm install mocha mochawesome mochawesome-merge mochawesome-report-generator
        - "npm start & npx wait-on http://127.0.0.1:8080"
    test:
      commands:
        - 'npx cypress run --record --reporter mochawesome --reporter-options "reportDir=cypress/report/mochawesome-report,overwrite=false,html=false,json=true,timestamp=mmddyyyy_HHMMss"'
    postTest:
      commands:
        - npx mochawesome-merge --reportDir cypress/report/mochawesome-report > cypress/report/mochawesome.json
```

#### Example `amplify.yml` for Create React App and Amplify Console

```yaml
version: 0.1
backend:
  phases:
    build:
      commands:
        - "# Execute Amplify CLI with the helper script"
        - amplifyPush --simple
frontend:
  phases:
    preBuild:
      commands:
        - yarn install
    build:
      commands:
        - yarn run build
  artifacts:
    baseDirectory: build
    files:
      - "**/*"
  cache:
    paths:
      - node_modules/**/*
test:
  artifacts:
    baseDirectory: cypress
    configFilePath: "**/mochawesome.json"
    files:
      - "**/*.png"
      - "**/*.mp4"
  phases:
    preTest:
      commands:
        - npm install
        - npm install wait-on
        - npm install mocha mochawesome mochawesome-merge mochawesome-report-generator
        - "npm start & npx wait-on http://localhost:3000"
    test:
      commands:
        - 'npx cypress run --reporter mochawesome --reporter-options "reportDir=cypress/report/mochawesome-report,overwrite=false,html=false,json=true,timestamp=mmddyyyy_HHMMss"'
    postTest:
      commands:
        - npx mochawesome-merge --reportDir cypress/report/mochawesome-report > cypress/report/mochawesome.json
```

#### Example `amplify.yml` for Create React App and Amplify Console with --record for Cypress Dashboard

Add `CYPRESS_RECORD_KEY` Enviroment Variable in [Amplify Console](https://aws.amazon.com/amplify/console/).

```yaml
version: 0.1
backend:
  phases:
    build:
      commands:
        - "# Execute Amplify CLI with the helper script"
        - amplifyPush --simple
frontend:
  phases:
    preBuild:
      commands:
        - yarn install
    build:
      commands:
        - yarn run build
  artifacts:
    baseDirectory: build
    files:
      - "**/*"
  cache:
    paths:
      - node_modules/**/*
test:
  artifacts:
    baseDirectory: cypress
    configFilePath: "**/mochawesome.json"
    files:
      - "**/*.png"
      - "**/*.mp4"
  phases:
    preTest:
      commands:
        - npm install
        - npm install wait-on
        - npm install mocha mochawesome mochawesome-merge mochawesome-report-generator
        - "npm start & npx wait-on http://localhost:3000"
    test:
      commands:
        - 'npx cypress run --record --reporter mochawesome --reporter-options "reportDir=cypress/report/mochawesome-report,overwrite=false,html=false,json=true,timestamp=mmddyyyy_HHMMss"'
    postTest:
      commands:
        - npx mochawesome-merge --reportDir cypress/report/mochawesome-report > cypress/report/mochawesome.json
```

### GitHub Actions

We recommend using our official [cypress-io/github-action](https://github.com/cypress-io/github-action) to install, cache, and execute Cypress tests.

<!-- textlint-disable -->
<DocsVideo src="https://youtube.com/embed/gokM_zEmWLA"></DocsVideo>
<!-- textlint-enable -->

Read our tutorials [Triple Tested Static Site Deployed to GitHub Pages Using GitHub Actions](https://glebbahmutov.com/blog/triple-tested/) and [Drastically Simplify Testing on CI with Cypress GitHub Action](https://www.cypress.io/blog/2019/11/20/drastically-simplify-your-testing-with-cypress-github-action/).

### Netlify

We recommend using our official [netlify-plugin-cypress](https://github.com/cypress-io/netlify-plugin-cypress) to execute end-to-end tests before and after deployment to Netlify platform. Read our tutorials [Test Sites Deployed To Netlify Using netlify-plugin-cypress](https://glebbahmutov.com/blog/test-netlify/) and [Run Cypress Tests on Netlify Using a Single Line](https://cypress.io/blog/2020/03/30/run-cypress-tests-on-netlify-using-a-single-line/).

### Docker

We have [created](https://github.com/cypress-io/cypress-docker-images) an official [cypress/base](https://hub.docker.com/r/cypress/base/) container with all of the required dependencies installed. You can add Cypress and go! We are also adding images with browsers pre-installed under [cypress/browsers](https://hub.docker.com/r/cypress/browsers/) name. A typical Dockerfile would look like this:

```text
FROM cypress/base
RUN npm install
RUN $(npm bin)/cypress run
```

<Alert type="warning">


Mounting a project directory with an existing `node_modules` into a `cypress/base` docker image **will not work**:

```shell
docker run -it -v /app:/app cypress/base:10 bash -c 'cypress run'
Error: the cypress binary is not installed
```

Instead, you should build a docker container for your project's version of cypress.


</Alert>

#### Docker images & CI examples

See our [examples](/examples/examples/docker) for additional information on our maintained images and configurations on several CI providers.

## Advanced setup

### Machine requirements

Hardware requirements to run Cypress depend how much memory the browser, the application under test, and the server (if running it locally) need to run the tests without crashing.

**Some signs that your machine may not have enough CPU or memory to run Cypress:**

- The recorded video artifacts have random pauses or dropped frames.
- [Debug logs of the CPU and memory](/guides/references/troubleshooting#Log-memory-and-CPU-usage) frequently show CPU percent above 100%.
- The browser crashes.

You can see the total available machine memory and the current free memory by running the [`cypress info`](https://on.cypress.io/command-line#cypress-info) command.

```shell
npx cypress info
...
Cypress Version: 6.3.0
System Platform: linux (Debian - 10.5)
System Memory: 73.8 GB free 25 GB
```

You can see the CPU parameters on the CI machines by executing the command below.

```shell
node -p 'os.cpus()'
[
  {
    model: 'Intel(R) Xeon(R) Platinum 8124M CPU @ 3.00GHz',
    speed: 3399,
    times: { user: 760580, nice: 1010, sys: 158130, idle: 1638340, irq: 0 }
  }
  ...
]
```

**Example projects and the machine configurations used to run them on CI:**

- [Cypress Documentation](https://github.com/cypress-io/cypress-documentation) and [Real World App](https://github.com/cypress-io/cypress-realworld-app) projects run tests on the default CircleCI machine using the [Docker executor](https://circleci.com/docs/2.0/executor-types/) on the [default medium size machine](https://circleci.com/docs/2.0/configuration-reference/#resource_class) with 2 vCPUs and 4GB of RAM. `cypress info` reports `System Memory: 73.8 GB free 25 GB` with CPUs reported as `Intel(R) Xeon(R) Platinum 8124M CPU @ 3.00GHz`. Note that the free memory varies on CircleCI, typically we see values anywhere from 6GB to 30GB.
- [Real World App](https://github.com/cypress-io/cypress-realworld-app) also executes its tests using [GitHub Actions](https://github.com/cypress-io/github-action) with the [default hosted runner](https://docs.github.com/en/actions/reference/specifications-for-github-hosted-runners) with 2 vCPUs and 7GB of RAM. `cypress info` reports `System Memory: 7.29 GB free 632 MB` with CPUs reported as `Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz`.

**Tip:** if there are problems with longer specs, try splitting them into shorter ones, following [this example](https://glebbahmutov.com/blog/split-spec/).

### Dependencies

If you are not using one of the above CI providers then make sure your system has these dependencies installed.

#### Linux

#### Ubuntu/Debian

```shell
apt-get install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb
```

#### CentOS

```shell
yum install -y xorg-x11-server-Xvfb gtk2-devel gtk3-devel libnotify-devel GConf2 nss libXScrnSaver alsa-lib
```

### Caching

As of [Cypress version 3.0](/guides/references/changelog#3-0-0), Cypress downloads its binary to the global system cache - on linux that is `~/.cache/Cypress`. By ensuring this cache persists across builds you can save minutes off install time by preventing a large binary download.

#### We recommend users:

- Cache the `~/.cache` folder after running `npm install`, `yarn`, [`npm ci`](https://docs.npmjs.com/cli/ci) or equivalents as demonstrated in the configs below.

- **Do not** cache `node_modules` across builds. This bypasses more intelligent caching packaged with `npm` or `yarn`, and can cause issues with Cypress not downloading the Cypress binary on `npm install`.

- If you are using `npm install` in your build process, consider [switching to `npm ci`](https://blog.npmjs.org/post/171556855892/introducing-npm-ci-for-faster-more-reliable) and caching the `~/.npm` directory for a faster and more reliable build.

- If you are using `yarn`, caching `~/.cache` will include both the `yarn` and Cypress caches. Consider using `yarn install --frozen-lockfile` as an [`npm ci`](https://docs.npmjs.com/cli/ci) equivalent.

- If you need to override the binary location for some reason, use [CYPRESS_CACHE_FOLDER](/guides/getting-started/installing-cypress#Binary-cache) environment variable.

- Make sure you are not restoring the previous cache using lax keys; then the Cypress binaries can "snowball", read [Do Not Let Cypress Cache Snowball on CI](https://glebbahmutov.com/blog/do-not-let-cypress-cache-snowball/).

**Tip:** you can find lots of CI examples with configured caching in our [cypress-example-kitchensink](https://github.com/cypress-io/cypress-example-kitchensink#ci-status) repository.

### Environment variables

You can set various environment variables to modify how Cypress runs.

#### Configuration Values

You can set any configuration value as an environment variable. This overrides values in your configuration file (`cypress.json` by default).

***Typical use cases would be modifying things like:***

- `CYPRESS_BASE_URL`
- `CYPRESS_VIDEO_COMPRESSION`
- `CYPRESS_REPORTER`
- `CYPRESS_INSTALL_BINARY`

Refer to the [Environment Variables recipe](/guides/references/configuration#Environment-Variables) for more examples.

***Record Key***

If you are [recording your runs](#Record-tests) on a public project, you'll want to protect your Record Key. [Learn why.](/guides/dashboard/projects#Identification)

Instead of hard coding it into your run command like this:

```shell
cypress run --record --key abc-key-123
```

You can set the record key as the environment variable, `CYPRESS_RECORD_KEY`, and we'll automatically use that value. You can now omit the `--key` flag when recording.

```shell
cypress run --record
```

Typically you'd set this inside of your CI provider.

***CircleCI Environment Variable***

<DocsImage src="/img/guides/cypress-record-key-as-environment-variable.png" alt="Record key environment variable" ></DocsImage>

***TravisCI Environment Variable***

<DocsImage src="/img/guides/cypress-record-key-as-env-var-travis.png" alt="Travis key environment variable" ></DocsImage>

#### Git information

Cypress uses the [@cypress/commit-info](https://github.com/cypress-io/commit-info) package to extract git information to associate with the run (e.g. branch, commit message, author).

It assumes there is a `.git` folder and uses Git commands to get each property, like `git show -s --pretty=%B` to get commit message, see [src/git-api.js](https://github.com/cypress-io/commit-info/blob/master/src/git-api.js).

Under some environment setups (e.g. `docker`/`docker-compose`) if the `.git` directory is not available or mounted, you can pass all git related information under custom environment variables.

- Branch: `COMMIT_INFO_BRANCH`
- Message: `COMMIT_INFO_MESSAGE`
- Author email: `COMMIT_INFO_EMAIL`
- Author: `COMMIT_INFO_AUTHOR`
- SHA: `COMMIT_INFO_SHA`
- Remote: `COMMIT_INFO_REMOTE`

If the commit information is missing in the Dashboard run then [GitHub Integration](/guides/dashboard/github-integration) or other tasks might not work correctly. To see the relevant Cypress debug logs, set the environment variable `DEBUG` on your CI machine and inspect the terminal output to see why the commit information is unavailable.

```shell
DEBUG=commit-info,cypress:server:record
```

#### Custom Environment Variables

You can also set custom environment variables for use in your tests. These enable your code to reference dynamic values.

```shell
export "EXTERNAL_API_SERVER=https://corp.acme.co"
```

And then in your tests:

```javascript
cy.request({
  method: 'POST',
  url: Cypress.env('EXTERNAL_API_SERVER') + '/users/1',
  body: {
    foo: 'bar',
    baz: 'quux'
  }
})
```

Refer to the dedicated [Environment Variables Guide](/guides/guides/environment-variables) for more examples.

### Module API

Oftentimes it can be less complex to programmatically control and boot your servers with a Node script.

If you're using our [Module API](/guides/guides/module-api) then you can write a script that boots and then shuts down the server later. As a bonus, you can work with the results and do other things.

```js
// scripts/run-cypress-tests.js

const cypress = require('cypress')
const server = require('./lib/my-server')

// start your server
return server.start()
.then(() => {
  // kick off a cypress run
  return cypress.run()
  .then((results) => {
    // stop your server when it's complete
    return server.stop()
  })
})
```

```shell
node scripts/run-cypress-tests.js
```

## Common problems and solutions

### Missing binary

When npm or yarn install the `cypress` package, a `postinstall` hook is executed that downloads the platform-specific Cypress binary. If the hook is skipped for any reason the Cypress binary will be missing (unless it was already cached).

To better diagnose the error, add [commands to get information about the Cypress cache](/guides/guides/command-line#cypress-cache-command) to your CI setup. This will print where the binary is located and what versions are already present.

```shell
npx cypress cache path
npx cypress cache list
```

If the required binary version is not found in the cache, you can try the following:

1. Clean your CI's cache using your CI's settings to force a clean `npm install` on the next build.
2. Run the binary install yourself by adding the command `npx cypress install` to your CI script. If there is a binary already present, it should finish quickly.

See [bahmutov/yarn-cypress-cache](https://github.com/bahmutov/yarn-cypress-cache) for an example that runs the `npx cypress install` command to ensure the Cypress binary is always present before the tests begin.

### In Docker

If you are running long runs on Docker, you need to set the `ipc` to `host` mode. [This issue](https://github.com/cypress-io/cypress/issues/350) describes exactly what to do.

### Xvfb

When running on Linux, Cypress needs an X11 server; otherwise it spawns its own X11 server during the test run. When running several Cypress instances in parallel, the spawning of multiple X11 servers at once can cause problems for some of them. In this case, you can separately start a single X11 server and pass the server's address to each Cypress instance using `DISPLAY` variable.

First, spawn the X11 server in the background at some port, for example `:99`. If you have installed `xvfb` on Linux or if you are using one of our Docker images from [cypress-docker-images](https://github.com/cypress-io/cypress-docker-images), the tools below should be available.

```shell
Xvfb :99 &
```

Second, set the X11 address in an environment variable

```shell
export DISPLAY=:99
```

Start Cypress as usual

```shell
npx cypress run
```

After all tests across all Cypress instances finish, kill the Xvfb background process using `pkill`

```shell
pkill Xvfb
```

<Alert type="warning">


In certain Linux environments, you may experience connection errors with your X11 server. In this case, you may need to start Xvfb with the following command:

```shell
Xvfb -screen 0 1024x768x24 :99 &
```
Cypress internally passes these Xvfb arguments, but if you are spawning your own Xvfb, you would need to pass these arguments. This is necessary to avoid using 8-bit color depth with Xvfb, which will prevent Chrome or Electron from crashing.


</Alert>

### Colors

If you want colors to be disabled, you can pass the `NO_COLOR` environment variable to disable colors. You may want to do this if ASCII characters or colors are not properly formatted in your CI.

```shell
NO_COLOR=1 cypress run
```

## See also
- [Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app) runs parallelized CI jobs across multiple operating systems, browsers, and viewport sizes.
- [cypress-example-kitchensink](https://github.com/cypress-io/cypress-example-kitchensink#ci-status) is set up to run on multiple CI providers.
- [Cross Browser Testing Guide](/guides/guides/cross-browser-testing)
- [Blog: Setting up Bitbucket Pipelines with proper caching of npm and Cypress](https://www.cypress.io/blog/2018/08/30/setting-up-bitbucket-pipelines-with-proper-caching-of-npm-and-cypress/)
- [Blog: Record Test Artifacts from any Docker CI](https://www.cypress.io/blog/2018/08/28/record-test-artifacts-from-any-ci/)
- [Continuous Integration with Cypress](https://www.cypress.io/blog/2019/10/04/webcast-recording-continuous-integration-with-cypress/) webinar covering TeamCity, Travis and CircleCI setups, [slides](https://cypress.slides.com/cypress-io/cypress-on-ci).

