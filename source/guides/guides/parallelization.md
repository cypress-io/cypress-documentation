---
title: Parallelization
---

{% note info %}
# {% fa fa-graduation-cap %} What You'll Learn

- 
{% endnote %}

# Overview

If your project has a large number of tests, it can take a large amount of time for tests to complete running when run on one machine serially. Spreading your tests across many virtual machines and running tests in parallel can save your team time and money when running tests in Continuous Integration.

Cypress can run recorded tests in parallel across multiple, available, virtual machines.

This guide assumes you already have your project running and recording within Continuous Integration. If you have not set up your project yet, check out our {% url "Continuous Integration guide" continuous-integration %}.

# Splitting up your test suite

Cypress' parallelization strategy is file-based, so in order to utilize parallelization, your tests will have to be split across separate files.

Cypress will assign each spec file to an available machine based on our balance strategy. So while you can not determine the order spec files will run when parallelized, tests within each spec file will always run in the order they appear in the spec file.

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