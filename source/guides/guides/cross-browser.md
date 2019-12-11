---
title: Cross-Browser
---

Cypress has the capability to run tests across multiple browsers. Currently, Cypress supports Firefox and Chrome-family browsers (including Electron).

{% note warning 'Web Security' %}
Tests that require {% url "`chromeWebSecurity` configuration option to be disabled" web-security#Disabling-Web-Security %} will not run in non-Chrome family browsers.
{% endnote %}


Excluding Electron, the desired browsers for testing need to be installed on your local system or CI environment to be detected and utilized by Cypress. A full list of detected browsers will be displayed within the browser selection menu of the Test Runner.

{% imgTag /img/guides/cross-browser/cypress-browser-selector.png "Cypress Test Runner with Firefox selected as the browser" "no-border" %}

The desired browser can also specified via the {% url `--browser` command-line#Options %} flag when using {% url `open` command-line#cypress-open %} or {% url `run` command-line#cypress-run %} commands to launch Cypress. For example, to launch Cypress with Firefox as the default selection:

```shell
cypress open --browser firefox
```

To make launching of Cypress with a specific browser even more convenient, npm scripts can be used as a shortcut:

```json
"scripts": {
  "cy:open:chrome": "cypress open --browser chrome",
  "cy:open:firefox": "cypress open --browser firefox",
  "cy:run:chrome": "cypress run --browser chrome",
  "cy:run:firefox": "cypress run --browser firefox"
}
```

# Continuous Integration Strategies

When incorporating testing of multiple browsers within your QA process, you must implement a CI strategy that provides an optimal level of confidence while taking into consideration test duration and infrastructure costs. The optimal strategy will vary by the type and needs of a particular of project, and in this guide we present several strategies to consider when crafting the right strategy for your project.

CI strategies will be demonstrated with the [Circle CI Cypress Orb](https://circleci.com/orbs/registry/orb/cypress-io/cypress) for its concise and readable configuration, but the same concepts apply for most modern CI providers.

{% note info 'Docker Images for Testing' %}
The CI configuration examples within this guide utilize [Cypress maintained Docker images](https://github.com/cypress-io/cypress-docker-images/tree/master/browsers) to provision testing environments with desired versions of Node, Chrome, and Firefox.
{% endnote %}

## Periodic Basis

Generally, it is desired to run tests with each pushed commit, but it may not be necessary to do so for all browsers. For example, we can choose to run tests within Chrome for each commit, but only run Firefox on a reasonable periodic basis (i.e. nightly). The periodic frequency will depend on the scheduling of your project releases, so consider a test run frequency that is viable for the release velocity of your project.

The following example demonstrates a nightly CI schedule against production (`master` branch) for Firefox:

```yaml
version: 2.1
orbs:
  cypress: cypress-io/cypress@1
workflows:
  nightly:
    triggers:
      - schedule:
          cron: "0 0 * * *"
          filters:
            branches:
              only:
                - master
    jobs:
      - cypress/run:
          executor: cypress/browsers-chrome73-ff68
          browser: firefox
          start: npm start
          wait-on: http://localhost:3000
```

## Production Deployment

For projects that exhibit consistently stable behavior across browsers, it can be potentially more efficient to run tests against additional browsers only before merging changes in the production deployment branch.

The following example demonstrates only running Firefox tests once changes have merged into a staging environment (`develop` branch in this case) so any potential Firefox issues can be caught before a production release:

```yaml
version: 2.1
orbs:
  cypress: cypress-io/cypress@1
workflows:
  test_develop:
    jobs:
      - filters:
        branches:
          only:
            - develop
      - cypress/run:
          executor: cypress/browsers-chrome73-ff68
          browser: firefox
          start: npm start
          wait-on: http://localhost:3000
```

## Subset of Tests

We can choose to only run a subset of tests against a given browser. For example, we can execute only the happy or critical path related test files, or a directory of specific "smoke" test files. It is not always necessary to have both browsers always running *all* tests.

In the example below, the Chrome `cypress/run` job runs *all* tests against Chrome and reports results to the [Cypress Dashboard](https://on.cypress.io/dashboard) using a ({% url "group" parallelization.html#grouping-test-runs %}) named `chrome`.

The Firefox `cypress/run` job runs a subset of tests, defined in the `spec` parameter, against the Firefox browser, and reports the results to the [Cypress Dashboard](https://on.cypress.io/dashboard) under the group `firefox-critical-path`.

{% note info %}
**Note:** The `name` under each `cypress/run` job which will be shown in the Circle CI workflow UI to distinguish the jobs.
{% endnote %}

```yaml
version: 2.1
orbs:
  cypress: cypress-io/cypress@1
workflows:
  build:
    jobs:
      - cypress/install
      - cypress/run:
          name: Chrome
          requires:
            - cypress/install
          executor: cypress/browsers-chrome73-ff68
          start: npm start
          wait-on: http://localhost:3000
          record: true
          group: chrome
          browser: chrome
      - cypress/run:
          name: Firefox
          requires:
            - cypress/install
          executor: cypress/browsers-chrome73-ff68
          start: npm start
          wait-on: http://localhost:3000
          record: true
          group: firefox-critical-path
          browser: firefox
          spec: "cypress/integration/signup.spec.js,cypress/integration/login.spec.js"
```

## Parallelize Per Browser (Group) Basis

Execution of test files can be parallelized on a per {% url "group" parallelization.html#grouping-test-runs %} basis, where test files can be grouped by the browser under test. This versatility enables the ability to allocate the desired amount of CI resources towards a browser to either improve test duration or to minimize CI costs. 

**You do not have to run all browsers at the same parallelization level.** In the example below, the Chrome dedicated `cypress/run` job runs *all* tests in parallel, across **4 machines**, against Chrome and reports results to the [Cypress Dashboard](https://on.cypress.io/dashboard) under the group name `chrome`. The Firefox dedicated `cypress/run` job runs a *subset* of tests in parallel, across **2 machines**, defined by the `spec` parameter, against the Firefox browser and reports results to the [Cypress Dashboard](https://on.cypress.io/dashboard) under the group named `firefox`.

```yaml
version: 2.1
orbs:
  cypress: cypress-io/cypress@1
workflows:
  build:
    jobs:
      - cypress/install
      - cypress/run:
          name: Chrome
          requires:
            - cypress/install
          executor: cypress/browsers-chrome73-ff68
          record: true
          start: npm start
          wait-on: http://localhost:3000
          parallel: true
          parallelism: 4
          group: chrome
          browser: chrome
      - cypress/run:
          name: Firefox
          requires:
            - cypress/install
          executor: cypress/browsers-chrome73-ff68
          record: true
          start: npm start
          wait-on: http://localhost:3000
          parallel: true
          parallelism: 2
          group: firefox
          browser: firefox
          spec: "cypress/integration/app.spec.js,cypress/integration/login.spec.js,cypress/integration/about.spec.js"
```

## Running Specific Tests by Browser

There may be instances where it can be useful to run or ignore one or more tests. For example, test run duration can be reduced by only running smoke-tests against Chrome and not Firefox. This type of granular selection of test execution depends on the type of tests and the level of confidence those specific tests provide to the overall project. 

{% note success 'Tip' %}
When considering to ignore or only run a particular test within a given browser, assess the true need for the test to run on multiple browsers.
{% endnote %}

In the example below we've implemented two helper functions that utilize {% url "`Cypress.isBrowser()`" /api/cypress-api/isbrowser.html %}, accepting a browser string (e.g. 'chrome', 'firefox') and a callback function of tests:

- `runOn` can be used to *only* run a test or suite of tests for a given browser.
- `ignoreOn` can be used to completely ignore the execution of a test or test suite for a given browser.

```js
const runOn = (browser, fn) => {
  if (Cypress.isBrowser(browser) {
    fn()
  }
}

const ignoreOn = (browser, fn) => {
  if (!Cypress.isBrowser(browser) {
    fn()
  }
}

// Run happy path tests if Cypress is run via Firefox
runOn('firefox', () => {
  describe('happy path suite', () => {
    it('...')
    it('...')
    it('...')
  })
})

// Ignore test if Cypress is running via Firefox
// This test is not recorded to the Cypress Dashboard
ignoreOn('firefox', () => {
  it('a test', function() {
    // ... test body
  })
}
```

It is important to note that *ignoring* tests is different from *skipping* tests. When a test is skipped, it is still displayed within test result reports, but when a test is ignored it will never be displayed within reports. If you need to skip a test by browser, but still include it in a custom reports or record it to the Cypress Dashboard, you can utilize the following practice: 

```js
// Skip the test, but still record it to the Cypress Dashboard
it('a test', function() {
  if (!Cypress.isBrowser('firefox') {
    this.skip()
  }
  // ... test body
})
```
