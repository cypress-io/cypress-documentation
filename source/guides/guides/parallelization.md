---
title: Parallelization
---

{% note info %}
# {% fa fa-graduation-cap %} What You'll Learn
{% endnote %}

# Overview

If your project has a large number of tests, it can take a large amount of time for tests to complete running when run on one machine serially. Spreading your tests across machines and running multiple tests in parallel can save your team time and money when continuously running tests in CI.

Cypress can run recorded tests in parallel across multiple machines.

This guide assumes you already have your project running and recording within Continuous Integration. If you haven't set up your project yet, check out our Continuous Integration guide.

# Splitting up your test suite

Cypress allocation strategy for parallelism is file-based, so in order to utilize parallelization, you will need to have your tests split across separate files.

# Turning on parallelization

You'll want to refer to your CI provider's documentation on how to set up multiple machines to run in your CI environment first.

Once multiple machines are available within your CI environment, you can pass the {% url "`--parallel`" command-line#cypress-run-parallel %} key to {% url "`cypress run`" command-line#cypress-run %} to have your recorded tests parallelized.

```shell
cypress run --record --parallel
```

Running tests in parallel requires the `--record` flag be passed. This ensures Cypress can properly collect the data needed to parallelize the run. This also gives you the full benefit of seeing the results of the parallelization in our Dashboard Service. If you have not set up your project to record, check out our Set up guide.

# Balance strategy

Cypress will automatically balance your spec files across the available machines in your CI provider. Cypress calculates which spec file to run based on from data collected from previous runs. This ensures that your spec files run as fast as possible, with no need for manual configuration or tweaking.