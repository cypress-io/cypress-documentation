---
title: Parallelization
---

{% note warning %}
This documentation is still a work in progress.
{% endnote %}

# Overview

If your project has a large number of tests, it can take a long time for tests to complete running when run serially on one machine. Spreading your tests across many virtual machines and running tests in parallel can save your team time and money when running tests in Continuous Integration.

Cypress can run recorded tests in parallel across multiple, available, virtual machines.

This guide assumes you already have your project running and recording within Continuous Integration. If you have not set up your project yet, check out our {% url "Continuous Integration guide" continuous-integration %}.

# Splitting up your test suite

Cypress' parallelization strategy is file-based, so in order to utilize parallelization, your tests will need to be split across separate files.

Cypress will assign each spec file to an available machine based on our balance strategy. So you can not determine ahead of time the order spec files will run when parallelized.

# Turning on parallelization

You will have to refer to your CI provider's documentation on how to set up multiple machines to run in your CI environment first.

Once multiple machines are available within your CI environment, you can pass the {% url "`--parallel`" command-line#cypress-run-parallel %} key to {% url "`cypress run`" command-line#cypress-run %} to have your recorded tests parallelized.

```shell
cypress run --record --key=abc123 --parallel
```

Running tests in parallel requires the {% url "`--record` flag" command-line#cypress-run %} be passed. This ensures Cypress can properly collect the data needed to parallelize future run. This also gives you the full benefit of seeing the results of the parallelization in our {% url "Dashboard Service" dashboard-service %}. If you have not set up your project to record, check out our {% url "setup guide" dashboard-service#Setup %}.

If you have passed the `--parallel` flag, Cypress is now responsible for a few things:

- We automatically look for available machines.
- We calculate the order in which the spec files should run in order to get the fastest run time.
- We assign the spec files in our determined order to run on any available machines.

# Balance strategy

Cypress will automatically balance your spec files across the available machines in your CI provider. Cypress calculates which spec file to run based from data collected from previous runs. This ensures that your spec files run as fast as possible, with no need for manual configuration or tweaking.

**Example of tests run without parallelization**

Without running your Cypress tests in parallel, your spec files run alphabetically, one right after another. Below shows an example of how our {% url "`example-kitchen-sink`" https://github.com/cypress-io/cypress-example-kitchensink %} tests may run without parallelization - taking 2 minutes and 38 seconds to complete all of our tests.

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

**Example of tests run with parallelization**

When we run these same tests with parallelization, Cypress decides the best order to run your specs in based on the spec's previous run history. If we have 2 machines available, below represents how our {% url "`example-kitchen-sink`" https://github.com/cypress-io/cypress-example-kitchensink %} tests may run with parallelization - taking 39 seconds to complete all of our tests.

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

# Visualizing parallelization in the Dashboard

You can see the result of each spec file that ran within the {% url "Dashboard Service" dashboard-service %} in the run's **Specs** tab. 

There is the option to see the specs in **Timeline View**. The Timeline View charts your spec files as they ran relative to each other. This is especially helpful when you want to visualize how your tests ran in on each machine.

{% img /img/dashboard/specs-timeline-view.jpg "Specs tab with timeline view" %}