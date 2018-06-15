---
title: Continuous Integration
---

Running Cypress in Continuous Integration is the same as running it locally. You generally only need to do two things:

  1. **Install Cypress**

  ```shell
  npm install cypress --save-dev
  ```

  2. **Run Cypress**

  ```shell
  cypress run
  ```

That's it!

For more examples please read the {% url 'Command Line' command-line#cypress-run %} documentation.

{% video local /img/snippets/running-in-ci.mp4 %}

# What's Supported?

Cypress should run on **all** CI providers. We currently have seen Cypress working on the following services:

- {% url "Jenkins" https://jenkins.io/ %} (Linux)
- {% url "TravisCI" https://travis-ci.org/ %}
- {% url "CircleCI" https://circleci.com %}
- {% url "CodeShip" https://codeship.com/ %} {% issue 328 "Issue with cy.exec()" %}
- {% url "GitLab" https://gitlab.com/ %}
- {% url "BuildKite" https://buildkite.com %}
- {% url "AppVeyor" https://appveyor.com %}
- {% url "Semaphore" https://semaphoreci.com/ %}
- {% url "Concourse" https://concourse.ci/ %}
- {% url "Solano" https://www.solanolabs.com/ %}
- {% url "Docker" https://www.docker.com/ %}

# Setting Up CI

Depending on which CI provider you use, you may need a config file. You'll want to refer to your CI provider's documentation to know where to add the commands to install and run Cypress. For more example config files check out any of our {% url "example apps" applications#Kitchen-Sink %}.

## Caching the Cypress Binary

As of Cypress version 3.0, Cypress downloads its binary to the global system cache - on linux that's `~/.cache/Cypress`. Ensuring this cache persists across builds, you can shave minutes off install time by preventing a large binary download. 

### We recommend users: 

- Cache the `~/.cache` folder after running `npm install`, `yarn`, [`npm ci`](https://docs.npmjs.com/cli/ci) or equivalents as demonstrated in the configs below.

- **Don't** cache `node_modules` across builds. This bypasses more intelligent caching packaged with `npm` or `yarn`, and can cause issues with Cypress not downloading the Cypress binary on `npm install`.

- If you are using `npm install` in your build process, consider [switching to `npm ci`](https://blog.npmjs.org/post/171556855892/introducing-npm-ci-for-faster-more-reliable) and caching the `~/.npm` directory for a faster and more reliable build.

- If you are using `yarn`, caching `~/.cache` will include both the `yarn` and Cypress caches. Consider using `yarn install --frozen-lockfile` as an [`npm ci`](https://docs.npmjs.com/cli/ci) equivalent.

## Travis

### Example `.travis.yml` config file

```yaml
language: node_js
node_js:
  - 10
cache:
  directories:
    - ~/.npm
    - ~/.cache
install:
  - npm ci
script:
  - $(npm bin)/cypress run --record
```

Caching folders with NPM modules saves a lot of time after the first build.

## CircleCI

### Example `circle.yml` v1 config file

```yaml
machine:
  node:
    version: 10
dependencies:
  override:
    - npm ci
  cache_directories:
    - ~/.npm
    - ~/.cache
test:
  override:
    - $(npm bin)/cypress run --record --key <record_key>
```

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
          key: v1-deps-{{ .Branch }}-{{ checksum "package.json" }}
          key: v1-deps-{{ .Branch }}
          key: v1-deps
      - run:
          name: Install Dependencies
          command: npm ci
      - save_cache:
          key: v1-deps-{{ .Branch }}-{{ checksum "package.json" }}
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
          key: v1-deps-{{ .Branch }}-{{ checksum "package.json" }}
          key: v1-deps-{{ .Branch }}
          key: v1-deps
      - run:
          name: Install Dependencies
          command: yarn install --frozen-lockfile
      - save_cache:
          key: v1-deps-{{ .Branch }}-{{ checksum "package.json" }}
          paths:
            - ~/.cache  ## cache both yarn and Cypress!
      - run: $(yarn bin)/cypress run --record --key <record_key>
```

Find the complete CircleCI v2 example with caching and artifact upload in [cypress-example-docker-circle](https://github.com/cypress-io/cypress-example-docker-circle) repo.

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
# Error: the cypress binary is not installed
```

Instead, you should build a docker container for your project's version of cypress.

{% endnote %}

### Docker Images & CI examples

See our {% url 'examples' docker %} for additional information on our maintained images and configurations on several CI providers.

# Dependencies

If you are not using one of the above CI providers then make sure your system has these dependencies installed.

```shell
apt-get install xvfb libgtk2.0-0 libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2
```

# Recording Tests in CI

Cypress can record your tests running and make them available in our {% url 'Dashboard' https://on.cypress.io/dashboard %}.

### Recorded tests allow you to:

- See the number of failed, pending and passing tests.
- Get the entire stack trace of failed tests.
- View screenshots taken when tests fail and when using {% url `cy.screenshot()` screenshot %}.
- Watch a video of your entire test run or a clip at the point of test failure.

### To record tests running:

1. {% url 'Set up your project to record' dashboard-service#Setup %}
2. {% url 'Pass the `--record` flag to `cypress run`' command-line#cypress-run %}

You can {% url 'read more about the Dashboard Service here' dashboard-service %}.

# Environment Variables

You can set various environment variables to modify how Cypress runs.

## Record Key

If you are {% url 'recording your runs' continuous-integration#Recording-Tests-in-CI %} on a public project, you'll want to protect your Record Key. {% url 'Learn why.' dashboard-service#Identification %}

Instead of hard coding it into your run command like this:

```shell
cypress run --record --key abc-key-123
```

You can set the record key as the environment variable, `CYPRESS_RECORD_KEY`, and we'll automatically use that value. You can now omit the `--key` flag when recording.

```shell
cypress run --record
```

Typically you'd set this inside of your CI provider.

### CircleCI Environment Variable

![Record key environment variable](/img/guides/cypress-record-key-as-environment-variable.png)

### TravisCI Environment Variable

![Travis key environment variable](/img/guides/cypress-record-key-as-env-var-travis.png)

## Other Configuration Values

You can set any configuration value as an environment variable. This overrides values in your `cypress.json`.

### Typical use cases would be modifying things like:

- `CYPRESS_BASE_URL`
- `CYPRESS_VIDEO_COMPRESSION`
- `CYPRESS_REPORTER`
- `CYPRESS_INSTALL_BINARY`

{% note info %}
Refer to the {% url 'configuration' configuration#Environment-Variables %} for more examples.
{% endnote %}

## Custom Environment Variables

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

{% note info %}
Refer to the dedicated {% url 'Environment Variables Guide' environment-variables %} for more examples.
{% endnote %}

# Booting Your Server

Typically you'll need to boot a local server prior to running Cypress. Here are some typical recipes for users who are new to CI.

## Command Line

Booting your web server means that it is a **long running process** that will never exit. Because of this, you'll need to **background it** - else your CI provider will never move onto the next command.

Backgrounding your server process means that your CI provider will simply "skip" over it and immediately execute the next command.

The problem is - what happens if your server takes seconds to boot? There is no guarantee that when Cypress starts running your web server is available.

This is a naive scenario assuming your web server boots fast:

{% note danger %}
Don't write the following - it will fail on slow booting servers.
{% endnote %}

```shell
## background your server
npm start &

## oops... cypress runs before your server is ready
cypress run
```

There are easy solutions to this. Instead of introducing arbitrary waits like `sleep 20` you can use a much better option like the {% url 'wait-on module' https://github.com/jeffbski/wait-on %}.

Now, we can simply block the `cypress run` command from executing until your server has booted.

```shell
## background your server
npm start &

## poll the server over and over again
## until it's been booted
wait-on http://localhost:8080

## and now run cypress
cypress run
```

{% note info %}
Most CI providers will automatically kill background processes so you don't have to worry about cleaning up your server process once Cypress finishes.

However, if you're running this script locally you'll have to do a bit more work to collect the backgrounded PID and then kill it after `cypress run`.
{% endnote %}

### Helpers

If the server takes a very long time to start, and Cypress times out while loading the page, we recommend using {% url start-server-and-test https://github.com/bahmutov/start-server-and-test %} utility.

```shell
npm install --save-dev start-server-and-test
```

Pass the boot server command, url to check when server is ready, and the Cypress test command.

```json
{
  "scripts": {
    "start": "my-server -p 3030",
    "cy:run": "cypress run",
    "test": "start-server-and-test start http://localhost:3030 cy:run"
  }
}
```

The `cy:run` command will only be executed when the URL `http://localhost:3030` responds with HTTP status code 200. The server will be shut down when the tests complete.

## Module API

Oftentimes it can be much easier to simply programmatically control and boot your servers with a Node script.

If you're using our {% url 'Module API' command-line#Cypress-Module-API %} then it would be trivial to write a script which boots and then shuts down the server later. As a bonus you can easily work with the results and do other things.

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
## kick off the script
node scripts/run-cypress-tests.js
```

# Known Issues

## Docker

If you are running long runs on Docker, you need to set the `ipc` to `host` mode. {% issue 350 'This issue' %} describes exactly what to do.
