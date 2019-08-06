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

{% imgTag /img/dashboard/specs-timeline-view.jpg "Specs tab with timeline view" %}

## Bar Chart View

The Bar Chart View charts the lengths of each spec file. This view is helpful to determine which spec files or tests are running longer than others.

{% imgTag /img/dashboard/specs-barchart-view.jpg "Specs tab with bar chart view" %}

## Jump to failed tests

If you had any failed tests, you can hover over the spec chart and click on the link to the failed test to go directly to its error message and stack trace.

{% imgTag /img/dashboard/specs-failures-popup.png "Failures popup on spec hover %}

# {% fa fa-code fa-fw %} Standard output

Standard output includes details and summaries of your tests for each spec file based on the {% url 'reporter' reporters %} you have set. By default it is the `spec` reporter.

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
- **Error:** The stack trace of the error.
- **Screenshot:** Any screenshots taken during the test.
- **Video:** The recorded video scrubbed to the point of failure in the test.

{% imgTag /img/dashboard/failures-of-recorded-run.png "failure tab" %}
