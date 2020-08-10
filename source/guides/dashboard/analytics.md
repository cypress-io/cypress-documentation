---
title: Analytics
---
The Cypress Dashboard provides Analytics to offer insight into metrics like runs over time, run duration and visibility into tests suite size over time.

{% imgTag /img/dashboard/analytics/dashboard-analytics-overview.png "Dashboard Analytics Screenshot" %}

{% note info %}
Dashboard Analytics is currently in Beta.
{% endnote %}

To enabled Dashboard Analytics, visit **Organization Settings** and enabled the "Project Analytics" setting under **Cypress Labs**.

{% imgTag /img/dashboard/analytics/dashboard-analytics-cypress-labs-project-analytics.png "Organization Settings Project Analytics Screenshot" %}

# Usage

## Runs over time

{% imgTag /img/dashboard/analytics/dashboard-analytics-runs-over-time.png "Dashboard Analytics Runs Over Time Screenshot" %}

This report shows the number of runs your organization has recorded to the Cypress Dashboard, broken down by the final status of the run. Each run represents a single invocation of `cypress run --record` for this project, whether in CI or on a local machine.

### Filters

{% imgTag /img/dashboard/analytics/dashboard-analytics-runs-over-time-filters.png "Dashboard Analytics Runs Over Time Filters Screenshot" %}

Results may be filtered by:

- Branch
- Time Range
- Time Interval (Hourly, Daily, Weekly, Monthly, Quarterly)

### Results

{% imgTag /img/dashboard/analytics/dashboard-analytics-runs-over-time-graph.png "Dashboard Analytics Runs Over Time Graph Screenshot" %}

The total runs over time are displayed for passed, failed, running, timed out and errored tests, respective of the filters selected.

The results may be downloaded as a comma-separated values (CSV) file for further analysis.
This can be done via the download icon to the right of the filters.

### Key Performance Indicators

{% imgTag /img/dashboard/analytics/dashboard-analytics-runs-over-time-kpi.png "Dashboard Analytics Runs Over Time KPI Screenshot" %}

Total runs, average per day, passed runs and failed runs are the computed respective of the filters selected.

{% imgTag /img/dashboard/analytics/dashboard-analytics-runs-over-time-table.png "Dashboard Analytics Runs Over Time Table Screenshot" %}

A table of results grouped by date for the time range filter is displayed with passed, failed, running, timed out and errored columns.

# Performance

## Run duration

{% imgTag /img/dashboard/analytics/dashboard-analytics-run-duration.png "Dashboard Analytics Run Duration Screenshot" %}

This report shows the average duration of a Cypress run for your project, including how test parallelization is impacting your total run time. Note that we only include passing runs here — failing or errored runs can sway the average away from its typical duration.

### Filters

{% imgTag /img/dashboard/analytics/dashboard-analytics-run-duration-filters.png "Dashboard Analytics Run Duration Filters Screenshot" %}

Results may be filtered by:

- Branch
- Run Group
- Time Range
- Time Interval (Hourly, Daily, Weekly, Monthly, Quarterly)

### Results

{% imgTag /img/dashboard/analytics/dashboard-analytics-run-duration-graph.png "Dashboard Analytics Run Duration Graph Screenshot" %}

The average run duration over time is displayed respective of the filters selected.

The results may be downloaded as a comma-separated values (CSV) file for further analysis.
This can be done via the download icon to the right of the filters.

### Key Performance Indicators

{% imgTag /img/dashboard/analytics/dashboard-analytics-run-duration-kpi.png "Dashboard Analytics Run Duration KPI Screenshot" %}

Average parallelization, average run duration and time saved from parallelization are computed respective of the filters selected.

{% imgTag /img/dashboard/analytics/dashboard-analytics-run-duration-table.png "Dashboard Analytics Run Duration Table Screenshot" %}

A table of results grouped by date for the time range filter is displayed with average runtime, concurrency and time saved from parallelization columns.

# Process

## Test suite size

{% imgTag /img/dashboard/analytics/dashboard-analytics-test-suite-size.png "Dashboard Analytics Test Suite Size Screenshot" %}

This report shows how your test suite is growing over time. It calculates the average number of test cases executed per run for each day in the given time period. It excludes runs that errored or timed out since they don't accurately represent the size of your test suite.

### Filters

{% imgTag /img/dashboard/analytics/dashboard-analytics-test-suite-size-filters.png "Dashboard Analytics Test Suite Size Filters Screenshot" %}

Results may be filtered by:

- Branch
- Run Group
- Time Range

### Results

{% imgTag /img/dashboard/analytics/dashboard-analytics-test-suite-size-graph.png "Dashboard Analytics Test Suite Size Graph Screenshot" %}

The average test suite size over time is displayed respective of the filters selected.

The results may be downloaded as a comma-separated values (CSV) file for further analysis.
This can be done via the download icon to the right of the filters.

### Key Performance Indicators

{% imgTag /img/dashboard/analytics/dashboard-analytics-test-suite-size-kpi.png "Dashboard Analytics Test Suite Size KPI Screenshot" %}

Unique tests and number of spec files are computed respective of the filters selected.

{% imgTag /img/dashboard/analytics/dashboard-analytics-test-suite-size-table.png "Dashboard Analytics Test Suite Size Table Screenshot" %}

A table of results grouped by date for the time range filter is displayed with unique tests and spec files.

## Top Failures

{% imgTag /img/dashboard/analytics/dashboard-analytics-top-failures.png "Dashboard Analytics Top Failures Screenshot" %}

This report shows the top failures in your test suite.

### Filters

{% imgTag /img/dashboard/analytics/dashboard-analytics-top-failures-filters.png "Dashboard Analytics Top Failures Filters Screenshot" %}

Results may be filtered by:

- Branch
- Tag
- Time Range
- Run Group
- Committer
- Spec File
- Browser
- Cypress Version
- Operating System

### Results

{% imgTag /img/dashboard/analytics/dashboard-analytics-top-failures-graph.png "Dashboard Analytics Top Failures Graph Screenshot" %}

The average test suite size over time is displayed respective of the filters selected.

The results may be downloaded as a comma-separated values (CSV) file for further analysis.
This can be done via the download icon to the right of the filters.

### Key Performance Indicators

{% imgTag /img/dashboard/analytics/dashboard-analytics-top-failures-kpi.png "Dashboard Analytics Top Failures KPI Screenshot" %}

The main key performance indicators tracked are:

- Median failure rate
- Number of failures (measured by test cases)

{% imgTag /img/dashboard/analytics/dashboard-analytics-top-failures-table.png "Dashboard Analytics Top Failures Table Screenshot" %}

A table of results grouped failure rate is displayed with spec files and total runs.

## Slowest Tests

{% imgTag /img/dashboard/analytics/dashboard-analytics-slowest-tests.png "Dashboard Analytics Slowest Tests Screenshot" %}

This report shows the slowest tests in a test suite.

### Filters

{% imgTag /img/dashboard/analytics/dashboard-analytics-slowest-tests-filters.png "Dashboard Analytics Slowest Tests Filters Screenshot" %}

Results may be filtered by:

- Branch
- Tag
- Time Range
- Status
- Run Group
- Committer
- Spec File
- Browser
- Cypress Version
- Operating System

### Results

{% imgTag /img/dashboard/analytics/dashboard-analytics-slowest-tests-graph.png "Dashboard Analytics Slowest Tests Graph Screenshot" %}

The slowest tests are displayed by duration of time.

The results may be downloaded as a comma-separated values (CSV) file for further analysis.
This can be done via the download icon to the right of the filters.

### Key Performance Indicators

{% imgTag /img/dashboard/analytics/dashboard-analytics-slowest-tests-kpi.png "Dashboard Analytics Slowest Tests KPI Screenshot" %}

The main key performance indicators tracked are:

- Median duration
- Total number of test cases

{% imgTag /img/dashboard/analytics/dashboard-analytics-slowest-tests-table.png "Dashboard Analytics Slowest Tests Table Screenshot" %}

A table of results grouped by median duration and provides total runs.

