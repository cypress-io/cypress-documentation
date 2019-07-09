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

{% imgTag /img/guides/parallelization/parallelization-diagram.png "Parallelization Diagram" "no-border" %}

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

In short: each Test Runner sends a list of the spec files to the Dashboard Service, and the service sends back one spec at a time to each Test Runner to run.

## Parallelization process

{% imgTag /img/guides/parallelization/parallelization-overview.png "Parallelization Overview" "no-border" %}

# Balance strategy

Cypress will automatically balance your spec files across the available machines in your CI provider. Cypress calculates which spec file to run based on the data collected from previous runs. This ensures that your spec files run as fast as possible, with no need for manual configuration.

As more and more tests are recorded to the Cypress Dashboard, Cypress can better predict how long a given spec file will take to run. To prevent irrelevant data from affecting the duration prediction, Cypress doesn't use old historical run data regarding the spec file.

## Spec duration history analysis

{% imgTag /img/guides/parallelization/load-balancing.png "Spec duration forecasting" "no-border" %}

With a duration estimation for each spec file of a test run, Cypress can distribute spec files to available CI resources in descending order of spec run duration. In this manner, the most time-consuming specs start first which minimizes the overall test run duration.

{% note info %}
Duration estimation is done separately for every browser the spec file was tested against. This is helpful since performance characteristics vary by browser, and therefore it is perfectly acceptable to see different duration estimates for each browser a spec file was tested against.
{% endnote %}

# Example

The examples below are from a run of our {% url "Kitchen Sink Example" https://github.com/cypress-io/cypress-example-kitchensink %} project. You can see the results of this run on the {% url "Cypress Dashboard" https://dashboard.cypress.io/#/projects/4b7344/runs/2929/specs %}.

## Without parallelization

In this example, a single machine runs a job named `1x-electron`, defined in the project's {%url "circle.yml" https://github.com/cypress-io/cypress-example-kitchensink/blob/master/circle.yml %} file. Cypress runs all 19 spec files one by one alphabetically in this job. It takes **1:51** to complete all of the tests.

```text
1x-electron, Machine #1
--------------------------
-- actions.spec.js (14s)
-- aliasing.spec.js (1s)
-- assertions.spec.js (1s)
-- connectors.spec.js (2s)
-- cookies.spec.js (2s)
-- cypress_api.spec.js (3s)
-- files.spec.js (2s)
-- local_storage.spec.js (1s)
-- location.spec.js (1s)
-- misc.spec.js (4s)
-- navigation.spec.js (3s)
-- network_requests.spec.js (3s)
-- querying.spec.js (1s)
-- spies_stubs_clocks.spec.js (1s)
-- traversal.spec.js (4s)
-- utilities.spec.js (3s)
-- viewport.spec.js (3s)
-- waiting.spec.js (5s)
-- window.spec.js (1s)
```

{% note info %}
Notice that when adding up the spec's run times (**0:55**), they add up to less than the total time for the run to complete (**1:51**) . There is extra time in the run for each spec: starting the browser, encoding and uploading the video to the dashboard, requesting the next spec to run.
{% endnote %}

## With parallelization

When we run the same tests with parallelization, Cypress uses its {% urlHash "balance strategy" Balance-strategy %} to order to specs to run based on the spec's previous run history. During the same CI run as above, we ran _all_ tests again, but this time with parallelization across 2 machines. This job was named `2x-electron` in the project's {%url "circle.yml" https://github.com/cypress-io/cypress-example-kitchensink/blob/master/circle.yml %} file and it finished in **59 seconds**.

```text
2x-electron, Machine #1, 9 specs          2x-electron, Machine #2, 10 specs
--------------------------------          -----------------------------------
-- actions.spec.js (14s)                  -- waiting.spec.js (6s)
-- traversal.spec.js (4s)                 -- navigation.spec.js (3s)
-- misc.spec.js (4s)                      -- utilities.spec.js (3s)
-- cypress_api.spec.js (4s)               -- viewport.spec.js (4s)
-- cookies.spec.js (3s)                   -- network_requests.spec.js (3s)
-- files.spec.js (3s)                     -- connectors.spec.js (2s)
-- location.spec.js (2s)                  -- assertions.spec.js (1s)
-- querying.spec.js (2s)                  -- aliasing.spec.js (1s)
-- location.spec.js (1s)                  -- spies_stubs_clocks.spec.js (1s)
                                          -- window.spec.js (1s)
```

The difference in running times and machines used is very clear when looking at the {% urlHash "Machines View" Machines-View %} on the Dashboard. Notice how the run parallelized across 2 machines automatically ran all specs based on their duration, while the run without parallelization did not.

{% imgTag /img/guides/parallelization/1-vs-2-machines.png "Without parallelization vs parallelizing across 2 machines" %}

Parallelizing our tests across 2 machines saved us almost 50% of the total run time, and we can further decrease the build time by adding more machines.

# Grouping test runs

Multiple {% url "`cypress run`" command-line#cypress-run %} calls can be labeled and associated to a **single** run by passing in the {% url "`--group <name>` flag" command-line#cypress-run-group-lt-name-gt %}, where `name` is an arbitrary reference label. The group name must be unique within the associated test run.

{% note info %}
For multiple runs to be grouped into a single run, it is required for CI machines to share a common CI build ID environment variable. Typically these CI machines will run in parallel or within the same build workflow or pipeline, but **it is not required to use Cypress parallelization to group runs**. Grouping of runs can be utilized independently of Cypress parallelization.
{% endnote %}

{% imgTag /img/guides/parallelization/machines-view-grouping-expanded.png "Machines view grouping expanded" "no-border" %}

## Grouping by browser

You can test your application against different browsers and view the results under a single run within the Dashboard. Below, we simple name our groups the same name as the browser being tested:

- The first group can be called `Windows/Chrome 69`.

  ```shell
  cypress run --record --group Windows/Chrome-69 --browser chrome
  ```

- The second group can be called `Mac/Chrome 70`.

  ```shell
  cypress run --record --group Mac/Chrome-70 --browser chrome
  ```

- The third group can be called `Linux/Electron`. *Electron is the default browser used in Cypress runs*.

  ```shell
  cypress run --record --group Linux/Electron
  ```

{% imgTag /img/guides/parallelization/browser.png "browser" "no-border" %}

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

The `1x`, `2x`, `4x` group prefix used here is an adopted convention to indicate the level of parallelism for each run, and *is not required or essential*.

{% note info %}
The number of machines dedicated for each `cypress run` call is based on your CI configuration for the project.
{% endnote %}

Labeling these groups in this manner helps up later when we review our test runs in the Cypress Dashboard, as shown below:

{% imgTag /img/guides/parallelization/timeline-collapsed.png "Timeline view with grouping and parallelization" %}

## Grouping by spec context

Let's say you have an application that has a *customer facing portal*, *guest facing portal* and an *administration facing portal*. You could organize and test these three parts of your application within the same run:

- One group can be called `package/admin`:

```shell
cypress run --record --group package/admin --spec 'cypress/integration/packages/admin/**/*'
```

- Another can be called `package/customer`:

```shell
cypress run --record --group package/customer --spec 'cypress/integration/packages/customer/**/*'
```

- The last group can be called `package/guest`:

```shell
cypress run --record --group package/guest --spec 'cypress/integration/packages/guest/**/*'
```

{% imgTag /img/guides/parallelization/monorepo.png "monorepo" "no-border" %}

This pattern is especially useful for projects in a monorepo. Each segment of the monorepo can be assigned its own group, and larger segments can be parallelized to speed up their testing.


# Linking CI machines for parallelization or grouping

A CI build ID is used to associate multiple CI machines to one test run. This identifier is based on environment variables that are unique to each CI build, and vary based on CI provider. Cypress has out-of-the-box support for most of the commonly-used CI providers, so you would typically not need to directly set the CI build ID via the {% url "`--ci-build-id` flag" command-line#cypress-run-ci-build-id-lt-id-gt %}.

{% imgTag /img/guides/parallelization/ci-build-id.png "CI Machines linked by ci-build-id" "no-border" %}

## CI Build ID environment variables by provider

Cypress currently uses the following CI environment variables to determine a CI build ID for a test run:

Provider  | Environment Variable
--|--
AppVeyor  | `APPVEYOR_BUILD_NUMBER`
Bamboo  | `BAMBOO_BUILD_NUMBER`
Circle  |  `CIRCLE_WORKFLOW_ID`, `CIRCLE_BUILD_NUMBER`
Codeship  | `CI_BUILD_NUMBER`
Codeship Basic  | `CI_BUILD_NUMBER`
Codeship Pro  | `CI_BUILD_ID`
Drone  | `DRONE_BUILD_NUMBER`
Gitlab  | `CI_PIPELINE_ID`, `CI_JOB_ID`, `CI_BUILD_ID`
Jenkins  | `BUILD_NUMBER`
Semaphore | `SEMAPHORE_EXECUTABLE_UUID`
Travis  | `TRAVIS_BUILD_ID`

You can pass a different value to link agents to the same run. For example, if you are using Jenkins and think the environment variable `BUILD_TAG` is more unique than the environment variable `BUILD_NUMBER`, pass the `BUILD_TAG` value via CLI {% url "`--ci-build-id` flag" command-line#cypress-run-ci-build-id-lt-id-gt %}.

```shell
cypress run --record --parallel --ci-build-id $BUILD_TAG
```

# Run completion delay

During parallelization mode or when grouping runs, Cypress will wait for a specified amount of time before completing the test run in case any more relevant work remains. This is to compensate for various scenarios where CI machines could be backed-up in a queue.

This waiting period is called the **run completion delay** and it begins after the last known CI machine has completed as shown in the diagram below:

{% imgTag /img/guides/parallelization/run-completion-delay.png "Test run completion delay" "no-border" %}

This **delay is 60 seconds by default**, but is configurable within the {% url "Dashboard" dashboard-service %} project settings page:

{% imgTag /img/guides/parallelization/project-run-delay-setting.png "Dashboard project run completion delay setting" %}

# Visualizing parallelization and groups in the Dashboard

You can see the result of each spec file that ran within the {% url "Dashboard Service" dashboard-service %} in the run's **Specs** tab. Specs are visualized within a **Timeline**, **Bar Chart**, and **Machines** view.

## Timeline View

The Timeline View charts your spec files as they ran relative to each other. This is especially helpful when you want to visualize how your tests ran chronologically across all available machines.

{% imgTag /img/guides/parallelization/timeline-view-small.png "Timeline view with parallelization" %}

## Bar Chart View

The Bar Chart View visualizes the **duration** of your spec files relative to each other.

{% imgTag /img/guides/parallelization/bar-chart-view.png "Bar Chart view with parallelization" %}

## Machines View

The Machines View charts spec files by the machines that executed them. This view makes it easy to evaluate the contribution of each machine to the overall test run.

{% imgTag /img/guides/parallelization/machines-view.png "Machines view with parallelization" %}

# See also

- {% url "Blog: Run Your End-to-end Tests 10 Times Faster with Automatic Test Parallelization" https://www.cypress.io/blog/2018/09/05/run-end-to-end-tests-on-ci-faster/ %}
- {% url "Blog: Run and group tests the way you want to" https://glebbahmutov.com/blog/run-and-group-tests/ %}
- {% url "CI Configurations in Kitchen Sink Example" https://github.com/cypress-io/cypress-example-kitchensink#ci-status %}
- Slides {% url "Cypress Test Parallelization and Grouping" https://slides.com/bahmutov/cy-parallelization %} and {% url "Webinar video" https://www.youtube.com/watch?v=FfqD1ExUGlw %}
