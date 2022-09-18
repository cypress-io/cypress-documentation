---
title: Parallelization
---

<Alert type="info">

## <Icon name="graduation-cap"></Icon> What you'll learn

- How to parallelize test runs
- How to group test runs
- Strategies for grouping test runs
- How load-balancing of tests works
- What test insights are available on the Dashboard

</Alert>

## Overview

If your project has a large number of tests, it can take a long time for tests
to complete running serially on one machine. Running tests in parallel across
many virtual machines can save your team time and money when running tests in
Continuous Integration (CI).

Cypress can run recorded tests in parallel across multiple machines since
version [3.1.0](/guides/references/changelog#3-1-0). While parallel tests can
also technically run on a single machine, we do not recommend it since this
machine would require significant resources to run your tests efficiently.

This guide assumes you already have your project running and
[recording](/guides/dashboard/projects#Setup) within Continuous Integration. If
you have not set up your project yet, check out our
[Continuous Integration guide](/guides/continuous-integration/introduction). If
you are running or planning to run tests across multiple browsers (Firefox,
Chrome, or Edge), we also recommend checking out our
[Cross Browser Testing guide](/guides/guides/cross-browser-testing) for helpful
CI strategies when using parallelization.

<DocsImage src="/img/guides/parallelization/parallelization-diagram.png" alt="Parallelization Diagram"></DocsImage>

## Splitting up your test suite

Cypress' parallelization strategy is file-based, so in order to utilize
parallelization, your tests will need to be split across separate files.

Cypress will assign each spec file to an available machine based on our
[balance strategy](#Balance-strategy). Due to this balance strategy, the run
order of the spec files is not guaranteed when parallelized.

## Turning on parallelization

1. Refer to your CI provider's documentation on how to set up multiple machines
   to run in your CI environment.

2. Once multiple machines are available within your CI environment, you can pass
   the [--parallel](/guides/guides/command-line#cypress-run-parallel) key to
   [cypress run](/guides/guides/command-line#cypress-run) to have your recorded
   tests parallelized.

```shell
cypress run --record --key=abc123 --parallel
```

<Alert type="info">

Running tests in parallel requires the
[`--record` flag](/guides/guides/command-line#cypress-run) be passed. This
ensures Cypress can properly collect the data needed to parallelize future runs.
This also gives you the full benefit of seeing the results of your parallelized
tests in our [Dashboard Service](/guides/dashboard/introduction). If you have
not set up your project to record, check out our
[setup guide](/guides/dashboard/projects#Setup).

</Alert>

## CI parallelization interactions

During parallelization mode, the Cypress
[Dashboard Service](/guides/dashboard/introduction) interacts with your CI
machines to orchestrate the parallelization of a test run via
[load-balancing](#Balance-strategy) of specs across available CI machines by the
following process:

1. CI machines contact the Cypress
   [Dashboard Service](/guides/dashboard/introduction) to indicate which spec
   files to run in the project.
2. A machine opts in to receiving a spec file to run by contacting Cypress.
3. Upon receiving requests from a CI machine, Cypress calculates the estimated
   duration to test each spec file.
4. Based on these estimations, Cypress distributes
   ([load-balances](#Balance-strategy)) spec files one-by-one to each available
   machine in a way that minimizes overall test run time.
5. As each CI machine finishes running its assigned spec file, more spec files
   are distributed to it. This process repeats until all spec files are
   complete.
6. Upon completion of all spec files, Cypress
   [waits for a configurable amount of time](#Run-completion-delay) before
   considering the test run as fully complete. This is done to better support
   [grouping of runs](#Grouping-test-runs).

In short: each Cypress instance sends a list of the spec files to the Dashboard
Service, and the service sends back one spec at a time to each application to
run.

### Parallelization process

<DocsImage src="/img/guides/parallelization/parallelization-overview.png" alt="Parallelization Overview"></DocsImage>

## Balance strategy

Cypress will automatically balance your spec files across the available machines
in your CI provider. Cypress calculates which spec file to run based on the data
collected from previous runs. This ensures that your spec files run as fast as
possible, with no need for manual configuration.

As more and more tests are recorded to the Cypress Dashboard, Cypress can better
predict how long a given spec file will take to run. To prevent irrelevant data
from affecting the duration prediction, Cypress doesn't use old historical run
data regarding the spec file.

### Spec duration history analysis

<DocsImage src="/img/guides/parallelization/load-balancing.png" alt="Spec duration forecasting"></DocsImage>

With a duration estimation for each spec file of a test run, Cypress can
distribute spec files to available CI resources in descending order of spec run
duration. In this manner, the most time-consuming specs start first which
minimizes the overall test run duration.

<Alert type="info">

Duration estimation is done separately for every browser the spec file was
tested against. This is helpful since performance characteristics vary by
browser, and therefore it is perfectly acceptable to see different duration
estimates for each browser a spec file was tested against.

</Alert>

## Example

The examples below are from a run of our
[Kitchen Sink Example](https://github.com/cypress-io/cypress-example-kitchensink)
project. You can see the results of this run on the
[Cypress Dashboard](https://dashboard.cypress.io/projects/4b7344/runs/2929/specs).

### Without parallelization

In this example, a single machine runs a job named `1x-electron`, defined in the
project's
[circle.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/aabb10cc1bb9dee88e1bf28e0af5e9661427ee7a/circle.yml#L41)
file. Cypress runs all 19 spec files one by one alphabetically in this job. It
takes **1:51** to complete all of the tests.

```text
1x-electron, Machine #1
--------------------------
-- actions.cy.js (14s)
-- aliasing.cy.js (1s)
-- assertions.cy.js (1s)
-- connectors.cy.js (2s)
-- cookies.cy.js (2s)
-- cypress_api.cy.js (3s)
-- files.cy.js (2s)
-- local_storage.cy.js (1s)
-- location.cy.js (1s)
-- misc.cy.js (4s)
-- navigation.cy.js (3s)
-- network_requests.cy.js (3s)
-- querying.cy.js (1s)
-- spies_stubs_clocks.cy.js (1s)
-- traversal.cy.js (4s)
-- utilities.cy.js (3s)
-- viewport.cy.js (3s)
-- waiting.cy.js (5s)
-- window.cy.js (1s)
```

<Alert type="info">

Notice that when adding up the spec's run times (**0:55**), they add up to less
than the total time for the run to complete (**1:51**) . There is extra time in
the run for each spec: starting the browser, encoding and uploading the video to
the dashboard, requesting the next spec to run.

</Alert>

### With parallelization

When we run the same tests with parallelization, Cypress uses its
[balance strategy](#Balance-strategy) to order to specs to run based on the
spec's previous run history. During the same CI run as above, we ran _all_ tests
again, but this time with parallelization across 2 machines. This job was named
`2x-electron` in the project's
[circle.yml](https://github.com/cypress-io/cypress-example-kitchensink/blob/aabb10cc1bb9dee88e1bf28e0af5e9661427ee7a/circle.yml#L53)
file and it finished in **59 seconds**.

```text
2x-electron, Machine #1, 9 specs          2x-electron, Machine #2, 10 specs
--------------------------------          -----------------------------------
-- actions.cy.js (14s)                    -- waiting.cy.js (6s)
-- traversal.cy.js (4s)                   -- navigation.cy.js (3s)
-- misc.cy.js (4s)                        -- utilities.cy.js (3s)
-- cypress_api.cy.js (4s)                 -- viewport.cy.js (4s)
-- cookies.cy.js (3s)                     -- network_requests.cy.js (3s)
-- files.cy.js (3s)                       -- connectors.cy.js (2s)
-- location.cy.js (2s)                    -- assertions.cy.js (1s)
-- querying.cy.js (2s)                    -- aliasing.cy.js (1s)
-- location.cy.js (1s)                    -- spies_stubs_clocks.cy.js (1s)
                                          -- window.cy.js (1s)
```

The difference in running times and machines used is very clear when looking at
the [Machines View](#Machines-View) on the Dashboard. Notice how the run
parallelized across 2 machines automatically ran all specs based on their
duration, while the run without parallelization did not.

<DocsImage src="/img/guides/parallelization/1-vs-2-machines.png" alt="Without parallelization vs parallelizing across 2 machines" ></DocsImage>

Parallelizing our tests across 2 machines saved us almost 50% of the total run
time, and we can further decrease the build time by adding more machines.

## Grouping test runs

Multiple [cypress run](/guides/guides/command-line#cypress-run) calls can be
labeled and associated to a **single** run by passing in the
[`--group <name>` flag](/guides/guides/command-line#cypress-run-group-lt-name-gt),
where `name` is an arbitrary reference label. The group name must be unique
within the associated test run.

<Alert type="info">

For multiple runs to be grouped into a single run, it is required for CI
machines to share a common CI build ID environment variable. Typically these CI
machines will run in parallel or within the same build workflow or pipeline, but
**it is not required to use Cypress parallelization to group runs**. Grouping of
runs can be utilized independently of Cypress parallelization.

</Alert>

<DocsImage src="/img/guides/parallelization/machines-view-grouping-expanded.png" alt="Machines view grouping expanded"></DocsImage>

<Alert type="info">

## Cross Browser Testing

Grouping test runs with or without parallelization is a useful mechanism when
implementing a CI strategy for cross browser testing. Check out the
[Cross Browser Testing guide](/guides/guides/cross-browser-testing) to learn
more.

</Alert>

### Grouping by browser

You can test your application against different browsers and view the results
under a single run within the Dashboard. Below, we name our groups the same name
as the browser being tested:

- The first group can be called `Windows/Chrome 69`.

  ```shell
  cypress run --record --group Windows/Chrome-69 --browser chrome
  ```

- The second group can be called `Mac/Chrome 70`.

  ```shell
  cypress run --record --group Mac/Chrome-70 --browser chrome
  ```

- The third group can be called `Linux/Electron`. _Electron is the default
  browser used in Cypress runs_.

  ```shell
  cypress run --record --group Linux/Electron
  ```

<DocsImage src="/img/guides/parallelization/browser.png" alt="browser"></DocsImage>

### Grouping to label parallelization

We also have the power of Cypress parallelization with our groups. For the sake
of demonstration, let's run a group to test against Chrome with 2 machines, a
group to test against Electron with 4 machines, and another group to test
against Electron again, but only with one machine:

```shell
cypress run --record --group 1x-electron
```

```shell
cypress run --record --group 2x-chrome --browser chrome --parallel
```

```shell
cypress run --record --group 4x-electron --parallel
```

The `1x`, `2x`, `4x` group prefix used here is an adopted convention to indicate
the level of parallelism for each run, and _is not required or essential_.

<Alert type="info">

The number of machines dedicated for each `cypress run` call is based on your CI
configuration for the project.

</Alert>

Labeling these groups in this manner helps up later when we review our test runs
in the Cypress Dashboard, as shown below:

<DocsImage src="/img/guides/parallelization/timeline-collapsed.png" alt="Timeline view with grouping and parallelization" ></DocsImage>

### Grouping by spec context

Let's say you have an application that has a _customer facing portal_, _guest
facing portal_ and an _administration facing portal_. You could organize and
test these three parts of your application within the same run:

- One group can be called `package/admin`:

```shell
cypress run --record --group package/admin --spec 'cypress/e2e/packages/admin/**/*'
```

- Another can be called `package/customer`:

```shell
cypress run --record --group package/customer --spec 'cypress/e2e/packages/customer/**/*'
```

- The last group can be called `package/guest`:

```shell
cypress run --record --group package/guest --spec 'cypress/e2e/packages/guest/**/*'
```

<DocsImage src="/img/guides/parallelization/monorepo.png" alt="monorepo"></DocsImage>

This pattern is especially useful for projects in a monorepo. Each segment of
the monorepo can be assigned its own group, and larger segments can be
parallelized to speed up their testing.

## Linking CI machines for parallelization or grouping

A CI build ID is used to associate multiple CI machines to one test run. This
identifier is based on environment variables that are unique to each CI build,
and vary based on CI provider. Cypress has out-of-the-box support for most of
the commonly-used CI providers, so you would typically not need to directly set
the CI build ID via the
[`--ci-build-id` flag](/guides/guides/command-line#cypress-run-ci-build-id-lt-id-gt).

<DocsImage src="/img/guides/parallelization/ci-build-id.png" alt="CI Machines linked by ci-build-id"></DocsImage>

### CI Build ID environment variables by provider

Cypress currently uses the following CI environment variables to determine a CI
build ID for a test run:

| Provider        | Environment Variable                     |
| --------------- | ---------------------------------------- |
| AppVeyor        | `APPVEYOR_BUILD_NUMBER`                  |
| AWS CodeBuild   | `CODEBUILD_INITIATOR`                    |
| Azure Pipelines | `BUILD_BUILDNUMBER`                      |
| Bamboo          | `bamboo_buildNumber`                     |
| Bitbucket       | `BITBUCKET_BUILD_NUMBER`                 |
| Circle          | `CIRCLE_WORKFLOW_ID`, `CIRCLE_BUILD_NUM` |
| Codeship        | `CI_BUILD_NUMBER`                        |
| Codeship Basic  | `CI_BUILD_NUMBER`                        |
| Codeship Pro    | `CI_BUILD_ID`                            |
| Drone           | `DRONE_BUILD_NUMBER`                     |
| GitLab          | `CI_PIPELINE_ID`                         |
| Jenkins         | `BUILD_NUMBER`                           |
| Semaphore       | `SEMAPHORE_EXECUTABLE_UUID`              |
| Travis          | `TRAVIS_BUILD_ID`                        |

You can pass a different value to link agents to the same run. For example, if
you are using Jenkins and think the environment variable `BUILD_TAG` is more
unique than the environment variable `BUILD_NUMBER`, pass the `BUILD_TAG` value
via CLI
[`--ci-build-id` flag](/guides/guides/command-line#cypress-run-ci-build-id-lt-id-gt).

```shell
cypress run --record --parallel --ci-build-id $BUILD_TAG
```

## Run completion delay

During parallelization mode or when grouping runs, Cypress will wait for a
specified amount of time before completing the test run in case any more
relevant work remains. This is to compensate for various scenarios where CI
machines could be backed-up in a queue.

This waiting period is called the **run completion delay** and it begins after
the last known CI machine has completed as shown in the diagram below:

<DocsImage src="/img/guides/parallelization/run-completion-delay.png" alt="Test run completion delay"></DocsImage>

This **delay is 60 seconds by default**, but is
[configurable within the Dashboard project settings page](/guides/dashboard/projects#Run-completion-delay).

## Visualizing parallelization and groups in the Dashboard

You can see the result of each spec file that ran within the
[Dashboard Service](/guides/dashboard/introduction) in the run's **Specs** tab.
Specs are visualized within a **Timeline**, **Bar Chart**, and **Machines**
view.

### Timeline View

The Timeline View charts your spec files as they ran relative to each other.
This is especially helpful when you want to visualize how your tests ran
chronologically across all available machines.

<DocsImage src="/img/guides/parallelization/timeline-view-small.png" alt="Timeline view with parallelization" ></DocsImage>

### Bar Chart View

The Bar Chart View visualizes the **duration** of your spec files relative to
each other.

<DocsImage src="/img/guides/parallelization/bar-chart-view.png" alt="Bar Chart view with parallelization" ></DocsImage>

### Machines View

The Machines View charts spec files by the machines that executed them. This
view enables you to evaluate the contribution of each machine to the overall
test run.

<DocsImage src="/img/guides/parallelization/machines-view.png" alt="Machines view with parallelization" ></DocsImage>

## Next Steps

- [Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app)
  runs parallelized CI jobs across multiple operating systems, browsers, and
  viewport sizes.
- [Continuous Integration Guide](/guides/continuous-integration/introduction)
- [Cross Browser Testing Guide](/guides/guides/cross-browser-testing)
- [Blog: Run Your End-to-end Tests 10 Times Faster with Automatic Test Parallelization](https://www.cypress.io/blog/2018/09/05/run-end-to-end-tests-on-ci-faster/)
- [Blog: Run and group tests the way you want to](https://glebbahmutov.com/blog/run-and-group-tests/)
- [CI Configurations in Kitchen Sink Example](https://github.com/cypress-io/cypress-example-kitchensink#ci-status)
- Slides
  [Cypress Test Parallelization and Grouping](https://slides.com/bahmutov/cy-parallelization)
  and [Webinar video](https://www.youtube.com/watch?v=FfqD1ExUGlw)
