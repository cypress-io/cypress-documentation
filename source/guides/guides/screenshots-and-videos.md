---
title: Screenshots and Videos
---

{% note info %}
# {% fa fa-graduation-cap %} What you'll learn

- How Cypress captures screenshots of test failures automatically
- How to manually capture your own screenshot
- How Cypress can record a video of the entire run
- Some options of what to do with screenshot and video artifacts
{% endnote %}

# Screenshots

Cypress comes with the ability to take screenshots, whether you are running via `cypress open` or `cypress run`, even in CI.

To take a manual screenshot you can use the {% url `cy.screenshot()` screenshot %} command.

Additionally, Cypress will automatically capture screenshots when a failure happens during `cypress run`. Screenshots on failure are *not* automatically taken during `cypress open`.

This behavior can be turned off by setting `screenshotOnRunFailure` to `false` in the {% url 'Cypress.Screenshot.defaults()' screenshot-api %}.

Screenshots are stored in the {% url `screenshotsFolder` configuration#Screenshots %} which is set to `cypress/screenshots` by default.

Cypress clears any existing screenshots before `cypress run`. If you do not want to clear your screenshots folder before a run, you can set {% url `trashAssetsBeforeRuns` configuration#Screenshots %} to `false`.

# Videos

Cypress records a video for each spec file when running tests during `cypress run`. Videos are *not* automatically recorded during `cypress open`.

Video recording can be turned off entirely by setting {% url `video` configuration#Videos %} to `false` from within your configuration.

Videos are stored in the {% url `videosFolder` configuration#Videos %} which is set to `cypress/videos` by default.

After `cypress run` completes, Cypress automatically compresses the video in order to save on file size. By default it compresses to a `32 CRF`, but this is configurable with the {% url `videoCompression` configuration#Videos %} property.

When using the `--record` flag while running your tests, videos are processed, compressed, and uploaded to the {% url 'Dashboard Service' dashboard-introduction%} after every spec file runs, successful or not. To change this behavior to only process videos in the case that tests fail, set the {% url `videoUploadOnPasses` configuration#Videos %} configuration option to `false`.

Cypress clears any existing videos before a `cypress run`. If you do not want to clear your videos folder before a run, you can set {% url `trashAssetsBeforeRuns` configuration#Videos %} to `false`.

## Video encoding

If your spec files have a long run duration, you might notice a time gap between a finished spec and a new spec starting during `cypress run`. During this time, Cypress is encoding the captured video and possibly uploading it to the Dashboard.

If the machine is encoding the video slowly (which is often the case for virtual machines that use a single core), the encoding might take a long time. In this case, you can modify the {% url `videoCompression` configuration#Videos %} configuration to make the encoding a little bit faster. Here are some common scenarios:

**Use minimal compression**

```json
{
  "videoCompression": 0
}
```

The compression step will be skipped completely, so the video will be large, but the processing should be faster.

**Disable compression**

```json
{
  "videoCompression": false
}
```

{% note info %}
If you are an FFmpeg pro and want to see all the settings and debug messages during the encoding, run Cypress with the following environment variable: `DEBUG=cypress:server:video cypress run`
{% endnote %}

# Now What?

So you are capturing screenshots and recording videos of your test runs, now what?

## Share Them With Your Team

Something you can take advantage of today is the {% url 'Cypress Dashboard Service' dashboard-introduction%}: our companion enterprise service that stores your artifacts for you and lets you view them from any web browser, as well as share them with your team.

## Visual Regression Test / Screenshot Diffing

Another possibility is visual regression testing: comparing screenshots of past runs with the current run to ensure that nothing changed. {% url "Read about how to implement visual testing." visual-testing %}

# See also

- {% url 'After Screenshot API' after-screenshot-api %}
- {% url 'Cypress.Screenshot' screenshot-api %}
- {% url 'Dashboard Service' dashboard-introduction%}
- {% url `cy.screenshot()` screenshot %}
- {% url 'Visual Testing' visual-testing %}
