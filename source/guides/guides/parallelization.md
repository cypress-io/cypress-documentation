---
title: Parallelization
---

{% note info %}
# {% fa fa-graduation-cap %} What you'll learn

- How to parallelize test runs
- How to group test runs
- Strategies for grouping test runs
- How load-balancing of tests works
- What test insights are available on the Dashboard

{% endnote %}

# Overview

If your project has a large number of tests, it can take a long time for tests to complete running serially on one machine. Running tests in parallel across many virtual machines can save your team time and money when running tests in Continuous Integration (CI).

Cypress can run recorded tests in parallel across multiple machines since version {% url "3.1.0" changelog#3-1-0 %}. While parallel tests can also technically run on a single machine, we do not recommend it since this machine would require significant resources to run your tests efficiently.

This guide assumes you already have your project running and {% url "recording" dashboard-service#Setup %} within Continuous Integration. If you have not set up your project yet, check out our {% url "Continuous Integration guide" continuous-integration %}.

# Splitting up your test suite

Cypress' parallelization strategy is file-based, so in order to utilize parallelization, your tests will need to be split across separate files.

Cypress will assign each spec file to an available machine based on our {% urlHash 'balance strategy' Balance-strategy %}. Due to this balance strategy, the run order of the spec files is not guaranteed when parallelized.

# Turning on parallelization

1. Refer to your CI provider's documentation on how to set up multiple machines to run in your CI environment.

2. Once multiple machines are available within your CI environment, you can pass the {% url "`--parallel`" command-line#cypress-run-parallel %} key to {% url "`cypress run`" command-line#cypress-run %} to have your recorded tests parallelized.

  ```shell
  cypress run --record --key=abc123 --parallel
  ```

    {% note info %}
    Running tests in parallel requires the {% url "`--record` flag" command-line#cypress-run %} be passed. This ensures Cypress can properly collect the data needed to parallelize future runs. This also gives you the full benefit of seeing the results of your parallelized tests in our {% url "Dashboard Service" dashboard-service %}. If you have not set up your project to record, check out our {% url "setup guide" dashboard-service#Setup %}.
    {% endnote %}

# CI parallelization interactions

During parallelization mode, the Cypress {% url "Dashboard Service" dashboard-service %} interacts with your CI machines to orchestrate the parallelization of a test run via {% urlHash 'load-balancing' Balance-strategy %} of specs across available CI machines by the following process:

1. CI machines contact the Cypress {% url "Dashboard Service" dashboard-service %} to indicate which spec files to run in the project.
2. A machine opts in to receiving a spec file to run by contacting Cypress.
3. Upon receiving requests from a CI machines, Cypress calculates the estimated duration to test each spec file.
4. Based on these estimations, Cypress distributes ({% urlHash 'load-balances' Balance-strategy %}) spec files one-by-one to each available machine in a way that minimizes overall test run time.
5. As each CI machine finishes running its assigned spec file, more spec files are distributed to it. This process repeats until all spec files are complete.
6. Upon completion of all spec files, Cypress {% urlHash 'waits for a configurable amount of time' Run-completion-delay %} before considering the test run as fully complete. This is done to better support {% urlHash 'grouping of runs' Grouping-test-runs %}.

### Parallelization process

{% img 'no-border' /img/guides/parallelization/parallelization-overview.png "Parallelization Overview" %}

# Balance strategy

Cypress will automatically balance your spec files across the available machines in your CI provider. Cypress calculates which spec file to run based on the data collected from previous runs. This ensures that your spec files run as fast as possible, with no need for manual configuration.

As more and more tests are recorded to the Cypress Dashboard, Cypress can better predict how long a given spec file will take to run. To prevent irrelevant data from affecting the duration prediction, Cypress doesn't use old historical run data regarding the spec file.

### Spec duration history analysis

{% img 'no-border' /img/guides/parallelization/spec-forecast.png "Spec duration forecasting" %}

With a duration estimation for each spec file of a test run, Cypress can distribute spec files to available CI resources in descending order of spec run duration. In this manner, the most time-consuming specs start first which minimizes the overall test run duration.

{% note info %}
Duration estimation is done separately for every browser the spec file was tested against. This is helpful since performance characteristics vary by browser, and therefore it is perfectly acceptable to see different duration estimates for each browser a spec file was tested against.
{% endnote %}

### Example of tests run without parallelization

Without running your Cypress tests in parallel, your spec files run alphabetically, one right after another. Below shows an example of how our {% url "`example-kitchen-sink`" https://github.com/cypress-io/cypress-example-kitchensink %} tests may run without parallelization - taking **2 mins and 38 secs** to complete all of our tests.

```text
Machine 1 (Total of 2m 38s)
--------------------------
-- actions.spec.js (16s)
-- aliasing.spec.js (2s)
-- assertions.spec.js (2s)
-- connectors.spec.js (3s)
-- cookies.spec.js (3s)
-- cypress_api.spec.js (4s)
-- files.spec.js (3s)
-- local_storage.spec.js (2s)
-- location.spec.js (2s)
-- misc.spec.js (6s)
-- navigation.spec.js (3s)
-- network_requests.spec.js (4s)
-- querying.spec.js (2s)
-- spies_stubs_clocks.spec.js (2s)
-- traversal.spec.js (6s)
-- utilities.spec.js (4s)
-- viewport.spec.js (5s)
-- waiting.spec.js (6s)
-- window.spec.js (2s)
```

### Example of tests run with parallelization

When we run these same tests with parallelization, Cypress decides the best order to run the specs in based on the spec's previous run history. If we have 2 machines available, below represents how our {% url "`example-kitchen-sink`" https://github.com/cypress-io/cypress-example-kitchensink %} tests may run with parallelization - taking **39 secs** to complete all of our tests.

```text
Machine 1 (Total of 39s)                  Machine 2 (Total of 38s)
--------------------------------          -----------------------------------
-- actions.spec.js (16s)                  -- waiting.spec.js (6s)
-- viewport.spec.js (5s)                  -- traversal.spec.js (6s)
-- network_requests.spec.js (4s)          -- misc.spec.js (6s)
-- navigation.spec.js (3s)                -- cypress_api.spec.js (4s)
-- cookies.spec.js (3s)                   -- utilities.spec.js (4s)
-- connectors.spec.js (3s)                -- files.spec.js (3s)
-- assertions.spec.js (2s)                -- aliasing.spec.js (2s)
-- location.spec.js (2s)                  -- local_storage.spec.js (2s)
                                          -- spies_stubs_clocks.spec.js (2s)
                                          -- querying.spec.js (2s)
                                          -- window.spec.js (2s)
```

Parallelizing our tests across only 1 extra machine saved us about 2 minutes of our already small runtime. This time saved adds up on test runs that could be up to 30 minutes in length.

# Grouping test runs

Multiple {% url "`cypress run`" command-line#cypress-run %} calls can be labeled and associated to a **single** run by passing in the {% url "`--group <name>` flag" command-line#cypress-run-group-lt-name-gt %}, where `name` is an arbitrary reference label. The group name must be unique within the associated test run.

{% note info %}
For multiple runs to be grouped into a single run, it is required for CI machines to share a common CI build ID environment variable. Typically these CI machines will run in parallel or within the same build workflow or pipeline, but **it is not required to use Cypress parallelization to group runs**. Grouping of runs can be utilized independently of Cypress parallelization.
{% endnote %}

{% img 'no-border' /img/guides/parallelization/machines-view-grouping-expanded.png "Parallelization with Grouping" %}

## Grouping by browser

You can test your application against different browsers and view the results under a single run within the Dashboard. Below, we simple name our groups the same name as the browser being tested:

- The first group can be called `electron`. *Electron is the default browser used in Cypress runs*.

  ```shell
  cypress run --record --group electron
  ```

- The second group can be called `chrome`.

  ```shell
  cypress run --record --group chrome --browser chrome
  ```

## Grouping to label parallelization

We also have the power of Cypress parallelization with our groups. For the sake of demonstration, let's run a group to test against Chrome with 2 machines, a group to test against Electron with 4 machines, and another group to test against Electron again, but only with one machine:

```shell
cypress run --record --group 1x-electron
```

```shell
cypress run --record --group 2x-chrome --browser chrome --parallel
```

```shell
cypress run --record --group 4x-electron --parallel
```

The `1x`, `2x`, `4x` group prefix used here is simply an adopted convention to indicate the level of parallelism for each run, and *is not required or essential*.

{% note info %}
The number of machines dedicated for each `cypress run` call is based on your CI configuration for the project.
{% endnote %}

Labeling these groups in this manner helps up later when we review our test runs in the Cypress Dashboard, as shown below:

{% img /img/guides/parallelization/timeline-collapsed.png "Timeline view with grouping and parallelization" %}

## Grouping by spec context

Let's say you have an application that has a *customer facing portal* and an *administration facing portal*. You could organize and test these two parts of your application within the same run:

- One group can be called `customer-portal`:

  ```shell
  cypress run --record --group customer-portal --spec 'cypress/integration/portals/customer/**/*'
  ```

- The other group can be called `admin-portal`:

  ```shell
  cypress run --record --group admin-portal --spec 'cypress/integration/portals/admin/**/*'
  ```

This pattern is especially useful for projects in a monorepo. Each segment of the monorepo can be assigned its own group, and larger segments can be parallelized to speed up their testing.

# Linking CI machines for parallelization or grouping

A CI build ID is used to associate multiple CI machines to one test run. This identifier is based on environment variables that are unique to each CI build, and vary based on CI provider. Cypress has out-of-the-box support for most of the commonly-used CI providers, so you would typically not need to directly set the CI build ID via the {% url "`--ci-build-id` flag" command-line#cypress-run-ci-build-id-lt-id-gt %}.

{% img 'no-border' /img/guides/parallelization/ci-build-id.png "CI Machines linked by ci-build-id" %}

## CI Build ID environment variables by provider

Cypress currently uses the following CI environment variables to determine a CI build ID for a test run:

| Provider  | Environment Variable  |
|--|--|
| Appveyor  | `APPVEYOR_BUILD_NUMBER`  |
| Bamboo  | `BAMBOO_BUILD_NUMBER`  |
| Circle  |  `CIRCLE_WORKFLOW_ID`, `CIRCLE_BUILD_NUMBER` |
| Codeship  | `CI_BUILD_NUMBER`  |
| Codeship Basic  | `CI_BUILD_NUMBER`  |
| Codeship Pro  | `CI_BUILD_ID`  |
| Drone  | `DRONE_BUILD_NUMBER`  |
| Gitlab  | `CI_PIPELINE_ID`, `CI_JOB_ID`, `CI_BUILD_ID`  |
| Jenkins  | `BUILD_NUMBER`  |
| Travis  | `TRAVIS_BUILD_ID`  |

# Run completion delay

During parallelization mode or when grouping runs, Cypress will wait for a specified amount of time before completing the test run in case any more relevant work remains. This is to compensate for various scenarios where CI machines could be backed-up in a queue.

This waiting period is called the **run completion delay** and it begins after the last known CI machine has completed as shown in the diagram below:

{% img 'no-border' /img/guides/parallelization/run-completion-delay.png "Test run completion delay" %}

This **delay is 60 seconds by default**, but is configurable within the {% url "Dashboard" dashboard-service %} project settings page:

{% img /img/guides/parallelization/project-run-delay-setting.png "Dashboard project run completion delay setting" %}

# Visualizing parallelization and groups in the Dashboard

You can see the result of each spec file that ran within the {% url "Dashboard Service" dashboard-service %} in the run's **Specs** tab. Specs are visualized within a **Timeline**, **Bar Chart**, and **Machines** view.

## Timeline View

The Timeline View charts your spec files as they ran relative to each other. This is especially helpful when you want to visualize how your tests ran chronologically across all available machines.

{% img /img/guides/parallelization/timeline-view-small.png "Timeline view with parallelization" %}

## Bar Chart View

The Bar Chart View visualizes the **duration** of your spec files relative to each other.

{% img /img/guides/parallelization/bar-chart-view.png "Bar Chart view with parallelization" %}

## Machines View

The Machines View charts spec files by the machines that executed them. This view makes it easy to evaluate the contribution of each machine to the overall test run.

{% img /img/guides/parallelization/machines-view.png "Machines view with parallelization" %}
