---
title: Cross Browser Testing
---

Cypress has the capability to run tests across multiple browsers. Currently, Cypress has support for {% url "Chrome-family browsers" launching-browsers#Chrome-Browsers %} (including Electron) and {% url "beta support for Firefox browsers and Microsoft Edge" https://www.cypress.io/blog/2020/02/06/introducing-firefox-and-edge-support-in-cypress-4-0/ %}.

{% note warning 'Web Security' %}
Tests that require the {% url "`chromeWebSecurity` configuration option to be disabled" web-security#Disabling-Web-Security %} may experience issues in non-Chromium based browsers.
{% endnote %}

{% note warning 'Firefox Garbage Collection' %}
Cypress triggers Firefox's internal garbage collection (GC) to better manage the browser's memory consumption. {% url "Learn more here" configuration#firefoxGcInterval %}.
{% endnote %}

Excluding {% url "Electron" launching-browsers#Electron-Browser %}, any browser you want to run Cypress tests in needs to be installed on your local system or CI environment. A full list of detected browsers is displayed within the browser selection menu of the {% url "Test Runner" test-runner %}.

{% imgTag /img/guides/cross-browser-testing/cypress-browser-selector.png "Cypress Test Runner with Firefox selected as the browser" "no-border" %}

The desired browser can also specified via the {% url `--browser` command-line#Options %} flag when using {% url `run` command-line#cypress-run %} command to launch Cypress. For example, to run Cypress tests in Firefox:

```shell
cypress run --browser firefox
```

To make launching of Cypress with a specific browser even more convenient, npm scripts can be used as a shortcut:

```json
"scripts": {
  "cy:run:chrome": "cypress run --browser chrome",
  "cy:run:firefox": "cypress run --browser firefox"
}
```

# Continuous Integration Strategies

When incorporating testing of multiple browsers within your QA process, you must implement a CI strategy that provides an optimal level of confidence while taking into consideration test duration and infrastructure costs. This optimal strategy will vary by the type and needs of a particular project. This guide we present several strategies to consider when crafting the strategy for your project.

CI strategies will be demonstrated using the {% url "Circle CI Cypress Orb" https://circleci.com/orbs/registry/orb/cypress-io/cypress %} for its concise and readable configuration, but the same concepts apply for most CI providers.

{% note info 'Docker Images for Testing' %}
The CI configuration examples within this guide use {% url "Cypress's Docker images" https://github.com/cypress-io/cypress-docker-images/tree/master/browsers %} to provision testing environments with desired versions of Node, Chrome, and Firefox.
{% endnote %}

## Periodic Basis

Generally, it is desired to run tests with each pushed commit, but it may not be necessary to do so for all browsers. For example, we can choose to run tests within Chrome for each commit, but only run Firefox on a periodic basis (i.e. nightly). The periodic frequency will depend on the scheduling of your project releases, so consider a test run frequency that is appropriate for the release schedule of your project.

{% note info 'Cron Scheduling' %}
Typically CI providers allow for the scheduling of CI jobs via {% url "cron expressions" https://en.wikipedia.org/wiki/Cron %}. For example, the expression `0 0 * * *` translates to "everyday at midnight" or nightly. Helpful {% url "online utilities" https://crontab.guru/ %} are available to assist with creation and translation of cron expressions.
{% endnote %}

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

For projects that exhibit consistently stable behavior across browsers, it may be better to run tests against additional browsers only before merging changes in the production deployment branch.

The following example demonstrates only running Firefox tests when commits are merged into a specific branch (`develop` branch in this case) so any potential Firefox issues can be caught before a production release:

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

In the example below, the Chrome `cypress/run` job runs *all* tests against Chrome and reports results to the {% url "Cypress Dashboard" https://on.cypress.io/dashboard %} using a ({% url "group" parallelization#Grouping-test-runs %}) named `chrome`.

The Firefox `cypress/run` job runs a subset of tests, defined in the `spec` parameter, against the Firefox browser, and reports the results to the {% url "Cypress Dashboard" https://on.cypress.io/dashboard %} under the group `firefox-critical-path`.

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

## Parallelize per browser

Execution of test files can be parallelized on a per {% url "group" parallelization#Grouping-test-runs %} basis, where test files can be grouped by the browser under test. This versatility enables the ability to allocate the desired amount of CI resources towards a browser to either improve test duration or to minimize CI costs.

**You do not have to run all browsers at the same parallelization level.** In the example below, the Chrome dedicated `cypress/run` job runs *all* tests in parallel, across **4 machines**, against Chrome and reports results to the {% url "Cypress Dashboard" https://on.cypress.io/dashboard %} under the group name `chrome`. The Firefox dedicated `cypress/run` job runs a *subset* of tests in parallel, across **2 machines**, defined by the `spec` parameter, against the Firefox browser and reports results to the {% url "Cypress Dashboard" https://on.cypress.io/dashboard %} under the group named `firefox`.

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

There may be instances where it can be useful to run or ignore one or more tests when in specific browsers. For example, test run duration can be reduced by only running smoke-tests against Chrome and not Firefox. This type of granular selection of test execution depends on the type of tests and the level of confidence those specific tests provide to the overall project.

{% note success 'Tip' %}
When considering to ignore or only run a particular test within a given browser, assess the true need for the test to run on multiple browsers.
{% endnote %}

You can specify a browser to run or exclude by passing a matcher to the suite or test within the {% url "test configuration" configuration#Test-Configuration %}. The `browser` option accepts the same arguments as {% url "`Cypress.isBrowser()`" isbrowser#Arguments %}.

```js
// Run the test if Cypress is run via Firefox
it('Download extension in Firefox', { browser: 'firefox' }, () => {
  cy.get('#dl-extension')
    .should('contain', 'Download Firefox Extension')
})

// Run happy path tests if Cypress is run via Firefox
describe('happy path suite', { browser: 'firefox' }, () => {
  it('...')
  it('...')
  it('...')
})

// Ignore test if Cypress is running via Chrome
// This test is not recorded to the Cypress Dashboard
it('Show warning outside Chrome', {  browser: '!chrome' }, () => {
  cy.get('.browser-warning')
    .should('contain', 'For optimal viewing, use Chrome browser')
})
```

# See also

- {% url "Browser Launch API" browser-launch-api %}
- {% url "`Cypress.browser`" browser %}
- {% url "`Cypress.isBrowser`" isbrowser %}
- {% url "Launching Browsers" launching-browsers %}
- {% url "Test Configuration" configuration#Test-Configuration %}
