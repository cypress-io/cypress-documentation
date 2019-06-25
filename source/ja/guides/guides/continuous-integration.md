---
title: 継続的インテグレーション
---

{% note info %}
# {% fa fa-graduation-cap %} What you'll learn

- How to run Cypress tests in Continuous Integration
- How to configure Cypress in various CI Providers
- How to record tests to the Cypress Dashboard
- How to run tests in parallel on CI
{% endnote %}

{% video local /img/snippets/running-in-ci.mp4 %}

# Setting up CI

## Basics

Running Cypress in Continuous Integration is almost the same as running it locally in your terminal. You generally only need to do two things:

  1. **Install Cypress**

  ```shell
  npm install cypress --save-dev
  ```

  2. **Run Cypress**

  ```shell
  cypress run
  ```

Depending on which CI provider you use, you may need a config file. You'll want to refer to your CI provider's documentation to know where to add the commands to install and run Cypress. For more configuration examples check out our {% urlHash "examples" Examples %}.

## Boot your server

### Challenges

Typically you will need to boot a local server prior to running Cypress.  When you boot your web server, it runs as a **long running process** that will never exit. Because of this, you'll need it to run in the **background** - else your CI provider will never move onto the next command.

Backgrounding your server process means that your CI provider will continue to execute the next command after executing the signal to start your server.

Many people approach this situation by running a command like the following:

```shell
npm start & cypress run // Do not do this
```

The problem is - what happens if your server takes time to boot? There is no guarantee that when the next command runs (`cypress run`) that your web server is up and available. So your Cypress test may start and try to visit your local server before it is ready to be visited.

### Solutions

Luckily, there are some solutions for this. Instead of introducing arbitrary waits (like `sleep 20`) you can use a better option.

***`wait-on` module***

Using the {% url 'wait-on' https://github.com/jeffbski/wait-on %} module, you can block the `cypress run` command from executing until your server has booted.

```shell
npm start & wait-on http://localhost:8080
```

```shell
cypress run
```

{% note info %}
Most CI providers will automatically kill background processes so you don't have to worry about cleaning up your server process once Cypress finishes.

However, if you're running this script locally you'll have to do a bit more work to collect the backgrounded PID and then kill it after `cypress run`.
{% endnote %}

***`start-server-and-test` module***

If the server takes a very long time to start, we recommend trying the {% url start-server-and-test https://github.com/bahmutov/start-server-and-test %} module.

```shell
npm install --save-dev start-server-and-test
```

Pass the command to boot your server, the url your server is hosted on and your Cypress test command.

```json
{
  "scripts": {
    "start": "my-server -p 3030",
    "cy:run": "cypress run",
    "test": "start-server-and-test start http://localhost:3030 cy:run"
  }
}
```

In the example above, the `cy:run` command will only be executed when the URL `http://localhost:3030` responds with an HTTP status code of 200. The server will also shut down when the tests complete.

## Record tests

Cypress can record your tests and make the results available in the {% url 'Cypress Dashboard' https://on.cypress.io/dashboard %}.

### Recording tests allow you to:

- See the number of failed, pending and passing tests.
- Get the entire stack trace of failed tests.
- View screenshots taken when tests fail and when using {% url `cy.screenshot()` screenshot %}.
- Watch a video of your entire test run or a clip at the point of test failure.
- See which machines ran each test when {% url "parallelized" parallelization %}.

### To record tests:

1. {% url 'Set up your project to record' dashboard-service#Setup %}
2. {% url 'Pass the `--record` flag to `cypress run`' command-line#cypress-run %} within CI.

```shell
cypress run --record --key=abc123
```

{% url 'Read the full guide on the Dashboard Service.' dashboard-service %}

## Run tests in parallel

Cypress can run tests in parallel across multiple machines.

You'll want to refer to your CI provider's documentation on how to set up multiple machines to run in your CI environment.

Once multiple machines are available within your CI environment, you can pass the {% url "`--parallel`" command-line#cypress-run-parallel %} flag to have your tests run in parallel.

```shell
cypress run --record --key=abc123 --parallel
```

{% url 'Read the full guide on parallelization.' parallelization %}

# Examples

Cypress should run on **all** CI providers. We have provided some example projects and configuration for some CI providers to help you get started.

CI Provider | Example Project | Example Config
----------- | --------------- | --------------
{% url "AppVeyor" https://appveyor.com %} | {% url "cypress-example-kitchensink" https://github.com/cypress-io/cypress-example-kitchensink %} | {% url "appveyor.yml" https://github.com/cypress-io/cypress-example-kitchensink/blob/master/appveyor.yml %}
{% url "Azure DevOps / VSTS CI / TeamFoundation" https://dev.azure.com/ %} | {% url "cypress-example-kitchensink" https://github.com/bahmutov/cypress-example-kitchensink %} | {% url "vsts-ci.yml" https://github.com/bahmutov/cypress-example-kitchensink/blob/master/vsts-ci.yml %}
{% url "BitBucket" https://bitbucket.org/product/features/pipelines %} | {% url "cypress-example-kitchensink" https://bitbucket.org/cypress-io/cypress-example-kitchensink %} | {% url "bitbucket-pipelines.yml" https://bitbucket.org/cypress-io/cypress-example-kitchensink/src/master/bitbucket-pipelines.yml %}
{% url "BuildKite" https://buildkite.com %} | {% url "cypress-example-kitchensink" https://github.com/cypress-io/cypress-example-kitchensink %} | {% url ".buildkite/pipeline.yml" https://github.com/cypress-io/cypress-example-kitchensink/blob/master/.buildkite/pipeline.yml %}
{% url "CircleCI" https://circleci.com %} | {% url "cypress-example-kitchensink" https://github.com/cypress-io/cypress-example-kitchensink %} | {% url "circle.yml" https://github.com/cypress-io/cypress-example-kitchensink/blob/master/circle.yml %}
{% url "CodeShip Basic" https://codeship.com/features/basic %} (has {% issue 328 "cy.exec() issue" %}) | |
{% url "CodeShip Pro" https://codeship.com/features/pro %} | {% url "cypress-example-docker-codeship" https://github.com/cypress-io/cypress-example-docker-codeship %} |
{% url "Concourse" https://concourse-ci.org/ %} | |
{% url "Docker" https://www.docker.com/ %} | {% url "cypress-docker-images" https://github.com/cypress-io/cypress-docker-images %} |
{% url "GitLab" https://gitlab.com/ %} | {% url "cypress-example-kitchensink" https://github.com/cypress-io/cypress-example-kitchensink %} | {% url ".gitlab-ci.yml" https://github.com/cypress-io/cypress-example-kitchensink/blob/master/.gitlab-ci.yml %}
{% url "Jenkins" https://jenkins.io/ %} | {% url "cypress-example-kitchensink" https://github.com/cypress-io/cypress-example-kitchensink %} | {% url "Jenkinsfile" https://github.com/cypress-io/cypress-example-kitchensink/blob/master/Jenkinsfile %}
{% url "Semaphore" https://semaphoreci.com/ %} | |
{% url "Shippable" https://app.shippable.com/ %} | {% url "cypress-example-kitchensink" https://github.com/cypress-io/cypress-example-kitchensink %} | {% url "shippable.yml" https://github.com/cypress-io/cypress-example-kitchensink/blob/master/shippable.yml %}
{% url "Solano" https://www.solanolabs.com/ %} | |
{% url "TravisCI" https://travis-ci.org/ %} | {% url "cypress-example-kitchensink" https://github.com/cypress-io/cypress-example-kitchensink %} | {% url ".travis.yml" https://github.com/cypress-io/cypress-example-kitchensink/blob/master/.travis.yml %}



## Travis

### Example `.travis.yml` config file

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

## CircleCI

### {% badge success New %} Example CircleCI Orb

The Cypress CircleCI Orb is a piece of configuration set in your `circle.yml` file to correctly install, cache and run Cypress with very little effort.

Full documentation can be found at the {% url "`cypress-io/circleci-orb`" https://github.com/cypress-io/circleci-orb %} repo.

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

A more complex project that needs to install dependencies, build an application and run tests across 4 CI machines {% url "in parallel" parallelization %} may have:

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

You can find multiple examples at {% url "our orb examples page" https://github.com/cypress-io/circleci-orb/blob/master/docs/examples.md %} and in the {% url cypress-example-circleci-orb https://github.com/cypress-io/cypress-example-circleci-orb %} project.

### Example `circle.yml` v2 config file

```yaml
version: 2
jobs:
  build:
    docker:
      - image: cypress/base:8
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

### Example `circle.yml` v2 config file with `yarn`

```yaml
version: 2
jobs:
  build:
    docker:
      - image: cypress/base:8
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

Find the complete CircleCI v2 example with caching and artifact upload in the {% url "cypress-example-docker-circle" https://github.com/cypress-io/cypress-example-docker-circle %} repo.

## Docker

We have {% url 'created' https://github.com/cypress-io/cypress-docker-images %} an official {% url 'cypress/base' 'https://hub.docker.com/r/cypress/base/' %} container with all of the required dependencies installed. Just add Cypress and go! We are also adding images with browsers pre-installed under {% url 'cypress/browsers' 'https://hub.docker.com/r/cypress/browsers/' %} name. A typical Dockerfile would look like this:

```text
FROM cypress/base
RUN npm install
RUN $(npm bin)/cypress run
```

{% note warning %}
Mounting a project directory with an existing `node_modules` into a `cypress/base` docker image **will not work**:

```shell
docker run -it -v /app:/app cypress/base:8 bash -c 'cypress run'
Error: the cypress binary is not installed
```

Instead, you should build a docker container for your project's version of cypress.

{% endnote %}

### Docker images & CI examples

See our {% url 'examples' docker %} for additional information on our maintained images and configurations on several CI providers.

# Advanced setup

## Dependencies

If you are not using one of the above CI providers then make sure your system has these dependencies installed.

```shell
apt-get install xvfb libgtk2.0-0 libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2
```

## Caching

As of {% url "Cypress version 3.0" changelog#3-0-0 %}, Cypress downloads its binary to the global system cache - on linux that is `~/.cache/Cypress`. By ensuring this cache persists across builds you can shave minutes off install time by preventing a large binary download.

### We recommend users:

- Cache the `~/.cache` folder after running `npm install`, `yarn`, {% url "`npm ci`" https://docs.npmjs.com/cli/ci %} or equivalents as demonstrated in the configs below.

- **Do not** cache `node_modules` across builds. This bypasses more intelligent caching packaged with `npm` or `yarn`, and can cause issues with Cypress not downloading the Cypress binary on `npm install`.

- If you are using `npm install` in your build process, consider {% url "switching to `npm ci`" https://blog.npmjs.org/post/171556855892/introducing-npm-ci-for-faster-more-reliable %} and caching the `~/.npm` directory for a faster and more reliable build.

- If you are using `yarn`, caching `~/.cache` will include both the `yarn` and Cypress caches. Consider using `yarn install --frozen-lockfile` as an {% url "`npm ci`" https://docs.npmjs.com/cli/ci %} equivalent.

If you need to override the binary location for some reason, use {% url '`CYPRESS_CACHE_FOLDER`' installing-cypress#Binary-cache %} environment variable.

## Environment variables

You can set various environment variables to modify how Cypress runs.

### Configuration Values

You can set any configuration value as an environment variable. This overrides values in your `cypress.json`.

***Typical use cases would be modifying things like:***

- `CYPRESS_BASE_URL`
- `CYPRESS_VIDEO_COMPRESSION`
- `CYPRESS_REPORTER`
- `CYPRESS_INSTALL_BINARY`

Refer to the {% url 'Environment Variables recipe' configuration#Environment-Variables %} for more examples.

***Record Key***

If you are {% urlHash 'recording your runs' Record-tests %} on a public project, you'll want to protect your Record Key. {% url 'Learn why.' dashboard-service#Identification %}

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

{% imgTag /img/guides/cypress-record-key-as-environment-variable.png "Record key environment variable" %}

***TravisCI Environment Variable***

{% imgTag /img/guides/cypress-record-key-as-env-var-travis.png "Travis key environment variable" %}

### Git information
Cypress uses the {% url 'commit-info' https://github.com/cypress-io/commit-info %} package to extract git information to associate with the run (e.g. branch, commit message, author).

It assumes there is a `.git` folder and uses Git commands to get each property, like `git show -s --pretty=%B` to get commit message, see {% url 'src/git-api.js' https://github.com/cypress-io/commit-info/blob/master/src/git-api.js %}.

Under some environment setups (e.g. `docker`/`docker-compose`) if the `.git` directory is not available or mounted, you can pass all git related information under custom environment variables.

- Branch: `COMMIT_INFO_BRANCH`
- Message: `COMMIT_INFO_MESSAGE`
- Author email: `COMMIT_INFO_EMAIL`
- Author: `COMMIT_INFO_AUTHOR`
- SHA: `COMMIT_INFO_SHA`
- Remote: `COMMIT_INFO_REMOTE`

### Custom Environment Variables

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

Refer to the dedicated {% url 'Environment Variables Guide' environment-variables %} for more examples.

## Module API

Oftentimes it can be much easier to programmatically control and boot your servers with a Node script.

If you're using our {% url 'Module API' module-api %} then you can write a script that boots and then shuts down the server later. As a bonus you can easily work with the results and do other things.

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

# Known Issues

## Docker

If you are running long runs on Docker, you need to set the `ipc` to `host` mode. {% issue 350 'This issue' %} describes exactly what to do.

# See also

- {% url cypress-example-kitchensink https://github.com/cypress-io/cypress-example-kitchensink#ci-status %} is set up to run on multiple CI providers.
- {% url "Blog: Setting up Bitbucket Pipelines with proper caching of npm and Cypress" https://www.cypress.io/blog/2018/08/30/setting-up-bitbucket-pipelines-with-proper-caching-of-npm-and-cypress/ %}
- {% url "Blog: Record Test Artifacts from any Docker CI" https://www.cypress.io/blog/2018/08/28/record-test-artifacts-from-any-ci/ %}
