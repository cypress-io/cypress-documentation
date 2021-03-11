---
title: Runs
---

Recorded runs capture the results from your test runs.

{% note info %}
If you haven't set up your project to record {% url "read here" projects#Setup %}.
{% endnote %}

# Run details

Details of each run are displayed including:

- The number of skipped, pending, passing, and failing tests.
- The GitHub branch, pull request, author, commit sha and commit message associated with the run (if any)
- The times the run, each spec file, and test started and ended.
- What Continuous Integration the run ran in (if any) and its CI id and url.
- The operating system and version
- The browser and version
- The Cypress version

{% imgTag /img/dashboard/run-details.png "run-details" %}

# {% fa fa-file-code-o fa-fw %} Spec files

You can see the result of each spec file that ran within **Specs**. There is also the option to switch between **Timeline View** and **Bar Chart View**.

## Timeline View

The Timeline View charts your spec files as they ran relative to each other. This is especially helpful when you want to visualize how your tests ran in {% url "parallel" parallelization %}.

{% imgTag /img/dashboard/specs-timeline-view.png "Specs tab with timeline view" %}

## Bar Chart View

The Bar Chart View charts the lengths of each spec file. This view is helpful to determine which spec files or tests are running longer than others.

{% imgTag /img/dashboard/specs-barchart-view.png "Specs tab with bar chart view" %}

## Jump to failed tests

If you had any failed tests, you can hover over the spec chart and click on the link to the failed test to go directly to its error message and stack trace.

{% imgTag /img/dashboard/specs-failures-popup.png "Failures popup on spec hover" %}

## {% fa fa-code fa-fw %} CI logs

CI logs from the Cypress standard output include details and summaries of your tests for each spec file based on the {% url 'reporter' reporters %} you have set. By default it is the `spec` reporter.

You will also see a summary at the bottom indicating the screenshots, or videos that were uploaded during the recording.

{% imgTag /img/dashboard/standard-output-of-recorded-test-run.png "standard output" %}

## {% fa fa-picture-o fa-fw %} Screenshots

All screenshots taken during the test run can be found in the **Screenshots** of the spec. Both screenshots taken during failures and screenshots taken using the {% url `cy.screenshot()` screenshot %} command will show up here.

## {% fa fa-video-camera fa-fw %} Videos

The video recorded during the test run can be found under the **Video** of the spec. You can also download the video.

{% imgTag /img/dashboard/videos-of-recorded-test-run.png "Video of test runs" %}

# {% fa fa-exclamation-triangle fa-fw %} Test failures

Any tests that fail during a test run can be found under the **Failures** tab. Each failure is listed under its test title.

## Each failure displays:

- **Test title:** The title of the failed test.
- **Error:** The stack trace, error message, and point-of-failure code frame for each attempt of a test..
- **Screenshot:** Any screenshots taken during the test.
- **Video:** The recorded video scrubbed to the point of failure in the test.

{% imgTag /img/dashboard/runs/test-attempts-and-errors.png "failure tab" %}

# Cancel run

You can cancel a run currently in progress from the Dashboard. Runs can only be canceled by members of the project.

## To cancel a run

- Click on a run in progress from the run list
- Click on **{% fa fa-ban %} Cancel run** in the upper-right corner of the run details page
- Click **Yes, cancel this run** to confirm. **Note: this cannot be undone**

{% video local /img/snippets/cancelling-run.mp4 %}

## What happens when a run is canceled?

- The run status will update to canceled.
- A message will appear on the run details page showing the time of cancellation and the user that canceled the run.
- The run will display as **Canceled** in the associated GitHub pull request if {% url "GitHub Integration" github-integration %} is enabled.
- Any tests recorded to completion will be available to view in the run details page.
- Any tests recorded to completion will still count towards your monthly test results limit.
- If you have Analytics enabled, canceled runs will appear in the {% url "Runs over time" analytics#Run-status %} chart.
- Any incomplete calls to {% url "`cypress run --record`" command-line#cypress-run %} for the run will be marked as canceled and not run.
- Any existing calls to {% url "`cypress run --record`" command-line#cypress-run %} for the run will exit with an error like below.

  {% imgTag /img/dashboard/cancel-run-error.png "cancel-run-error" width-600 %}

# Archive run

Runs that have been canceled or are in an errored state can be archived from the Dashboard.

## To archive a run

- In the cancellation or error message, click **Archive this run**.
  {% imgTag /img/dashboard/archive-run-within-cancelation-msg.png "cancel-run-error" %}

## What happens when a run is archived?

- The archived run will no longer display in the runs list or {% url "Analytics" analytics %} reporting.
- Archived runs can be accessed by the URL to that run. The format is:
  `https://dashboard.cypress.io/projects/{project ID}/runs/{run number}`
- Any tests recorded to the Dashboard will still count towards your monthly test results limit, even when it has been archived.

## To restore an archived run

- Visit the archived run. The archived run can be accessed by the URL of the run. The format is:
  `https://dashboard.cypress.io/projects/{project ID}/runs/{run number}`
- Click **{% fa fa-history %} Restore from archive**
  {% imgTag /img/dashboard/restore-from-archive.png "restore-from-archive" %}

# Test Code History

{% imgTag /img/dashboard/runs/test-code-history.png "Screenshot of the Test Code History panel" %}

When looking further into a test runs information, there is a new Test Case History panel. It matches test cases by spec and title and combines it with commit information to provide users insight to:

1. See the history of a test over its lifespan
1. View the diff of a single test case*
1. Jump directly to the commit
1. See the time span between each point in its history

\*_Note: This currently shows the diff of the transpiled code since we are not collecting source maps._
