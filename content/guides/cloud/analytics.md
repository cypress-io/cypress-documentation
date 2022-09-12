---
title: Analytics
---

Cypress Cloud provides Analytics to offer insight into metrics like runs
over time, run duration and visibility into tests suite size over time.

<DocsImage src="/img/dashboard/analytics/dashboard-analytics-overview.png" alt="Cloud Analytics Screenshot" ></DocsImage>

## Run status

<DocsImage src="/img/dashboard/analytics/dashboard-analytics-runs-over-time.png" alt="Cloud Analytics Runs Over Time Screenshot" ></DocsImage>

This report shows the number of runs your organization has recorded to Cypress Cloud, broken down by the final status of the run. Each run
represents a single invocation of `cypress run --record` for this project,
whether in CI or on a local machine.

### Filters

<DocsImage src="/img/dashboard/analytics/dashboard-analytics-runs-over-time-filters.png" alt="Cloud Analytics Runs Over Time Filters Screenshot" ></DocsImage>

Results may be filtered by:

- Branch
- Time Range
- Time Interval (Hourly, Daily, Weekly, Monthly, Quarterly)

### Results

<DocsImage src="/img/dashboard/analytics/dashboard-analytics-runs-over-time-graph.png" alt="Cloud Analytics Runs Over Time Graph Screenshot" ></DocsImage>

The total runs over time are displayed for passed, failed, running, timed out
and errored tests, respective of the filters selected.

The results may be downloaded as a comma-separated values (CSV) file for further
analysis.

This can be done via the download icon to the right of the filters.

### Key Performance Indicators

<DocsImage src="/img/dashboard/analytics/dashboard-analytics-runs-over-time-kpi.png" alt="Cloud Analytics Runs Over Time KPI Screenshot" ></DocsImage>

Total runs, average per day, passed runs and failed runs are the computed
respective of the filters selected.

<DocsImage src="/img/dashboard/analytics/dashboard-analytics-runs-over-time-table.png" alt="Cloud Analytics Runs Over Time Table Screenshot" ></DocsImage>

A table of results grouped by date for the time range filter is displayed with
passed, failed, running, timed out and errored columns.

## Run duration

<DocsImage src="/img/dashboard/analytics/dashboard-analytics-run-duration.png" alt="Cloud Analytics Run Duration Screenshot" ></DocsImage>

This report shows the average duration of a Cypress run for your project,
including how test parallelization is impacting your total run time. Note that
we only include passing runs here — failing or errored runs can sway the average
away from its typical duration.

### Filters

<DocsImage src="/img/dashboard/analytics/dashboard-analytics-run-duration-filters.png" alt="Cloud Analytics Run Duration Filters Screenshot" ></DocsImage>

Results may be filtered by:

- Branch
- Tag
- Time Range
- Time Interval (Hourly, Daily, Weekly, Monthly, Quarterly)

### Results

<DocsImage src="/img/dashboard/analytics/dashboard-analytics-run-duration-graph.png" alt="Cloud Analytics Run Duration Graph Screenshot" ></DocsImage>

The average run duration over time is displayed respective of the filters
selected.

The results may be downloaded as a comma-separated values (CSV) file for further
analysis. This can be done via the download icon to the right of the filters.

### Key Performance Indicators

<DocsImage src="/img/dashboard/analytics/dashboard-analytics-run-duration-kpi.png" alt="Cloud Analytics Run Duration KPI Screenshot" ></DocsImage>

Average parallelization, average run duration and time saved from
parallelization are computed respective of the filters selected.

<DocsImage src="/img/dashboard/analytics/dashboard-analytics-run-duration-table.png" alt="Cloud Analytics Run Duration Table Screenshot" ></DocsImage>

A table of results grouped by date for the time range filter is displayed with
average runtime, concurrency and time saved from parallelization columns.

## Test suite size

<DocsImage src="/img/dashboard/analytics/dashboard-analytics-test-suite-size.png" alt="Cloud Analytics Test Suite Size Screenshot" ></DocsImage>

This report shows how your test suite is growing over time. It calculates the
average number of test cases executed per run for each day in the given time
period. It excludes runs that errored or timed out since they don't accurately
represent the size of your test suite.

### Filters

<DocsImage src="/img/dashboard/analytics/dashboard-analytics-test-suite-size-filters.png" alt="Cloud Analytics Test Suite Size Filters Screenshot" ></DocsImage>

Results may be filtered by:

- Branch
- Tag
- Time Range
- Time Interval (Hourly, Daily, Weekly, Monthly, Quarterly)

### Results

<DocsImage src="/img/dashboard/analytics/dashboard-analytics-test-suite-size-graph.png" alt="Cloud Analytics Test Suite Size Graph Screenshot" ></DocsImage>

The average test suite size over time is displayed respective of the filters
selected.

The results may be downloaded as a comma-separated values (CSV) file for further
analysis. This can be done via the download icon to the right of the filters.

### Key Performance Indicators

<DocsImage src="/img/dashboard/analytics/dashboard-analytics-test-suite-size-kpi.png" alt="Cloud Analytics Test Suite Size KPI Screenshot" ></DocsImage>

Unique tests and number of spec files are computed respective of the filters
selected.

<DocsImage src="/img/dashboard/analytics/dashboard-analytics-test-suite-size-table.png" alt="Cloud Analytics Test Suite Size Table Screenshot" ></DocsImage>

A table of results grouped by date for the time range filter is displayed with
unique tests and spec files.

## Top failures

<DocsImage src="/img/dashboard/analytics/dashboard-analytics-top-failures.png" alt="Cloud Analytics Top Failures Screenshot" ></DocsImage>

This report shows the top failures in your test suite.

### Filters and Views

<DocsImage src="/img/dashboard/analytics/dashboard-analytics-top-failures-filters.png" alt="Cloud Analytics Top Failures Filters Screenshot" ></DocsImage>

Results can be seen through custom grouping by using the "View By" dropdown. It
can be grouped by:

- Test Case
- Spec File
- Tag
- Branch

Results may also be filtered by:

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

<DocsImage src="/img/dashboard/analytics/dashboard-analytics-top-failures-graph.png" alt="Cloud Analytics Top Failures Graph Screenshot" ></DocsImage>

The number of tests by failure rate is displayed respective of the filters
selected.

The results may be downloaded as a comma-separated values (CSV) file for further
analysis.

This can be done via the download icon to the right of the filters.

### Key Performance Indicators

<DocsImage src="/img/dashboard/analytics/dashboard-analytics-top-failures-kpi.png" alt="Cloud Analytics Top Failures KPI Screenshot" ></DocsImage>

The main key performance indicators tracked are:

- Median failure rate
- Number of failures (measured by test cases)

<DocsImage src="/img/dashboard/analytics/dashboard-analytics-top-failures-table.png" alt="Cloud Analytics Top Failures Table Screenshot" ></DocsImage>

A table of results grouped by failure rate is displayed with spec files and
total runs.

## Slowest tests

<DocsImage src="/img/dashboard/analytics/dashboard-analytics-slowest-tests.png" alt="Cloud Analytics Slowest Tests Screenshot" ></DocsImage>

This report shows the slowest tests in a test suite.

### Filters and Views

<DocsImage src="/img/dashboard/analytics/dashboard-analytics-slowest-tests-filters.png" alt="Cloud Analytics Slowest Tests Filters Screenshot" ></DocsImage>

Results can be seen through custom grouping by using the "View By" dropdown. It
can be grouped by:

- Test Case
- Spec File
- Tag
- Branch

Results may also be filtered by:

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

<DocsImage src="/img/dashboard/analytics/dashboard-analytics-slowest-tests-graph.png" alt="Cloud Analytics Slowest Tests Graph Screenshot" ></DocsImage>

The slowest tests are displayed by duration of time.

The results may be downloaded as a comma-separated values (CSV) file for further
analysis. This can be done via the download icon to the right of the filters.

### Key Performance Indicators

<DocsImage src="/img/dashboard/analytics/dashboard-analytics-slowest-tests-kpi.png" alt="Cloud Analytics Slowest Tests KPI Screenshot" ></DocsImage>

The main key performance indicators tracked are:

- Median duration
- Total number of test cases

<DocsImage src="/img/dashboard/analytics/dashboard-analytics-slowest-tests-table.png" alt="Cloud Analytics Slowest Tests Table Screenshot" ></DocsImage>

A table of results grouped by median duration and total runs.

## Most common errors

This report shows the impact of the most common types of errors across the test
suite.

<DocsImage src="/img/dashboard/analytics/dashboard-analytics-common-errors.png" alt="Cloud Analytics Slowest Tests Table Screenshot" ></DocsImage>
