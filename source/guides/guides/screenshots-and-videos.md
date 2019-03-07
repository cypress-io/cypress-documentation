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

Cypress comes with the ability to take screenshots, whether you are running in interactive mode using `cypress open` or run mode using `cypress run`, possibly in CI.

To take a manual screenshot just use the {% url `cy.screenshot()` screenshot %} command.

Additionally, Cypress will automatically capture screenshots when a failure happens during runs outside of interactive mode.

This behavior can be turned off by setting `screenshotOnRunFailure` to `false` with {% url 'Cypress.Screenshot.defaults()' screenshot-api %}.

Screenshots are stored in the {% url `screenshotsFolder` configuration#Screenshots %} which is set to `cypress/screenshots` by default.

By default, Cypress clears any existing screenshots before `cypress run`. If you do not want to clear your screenshots folder before a run, you can set {% url `trashAssetsBeforeRuns` configuration#Screenshots %} to `false`.

# Videos

Cypress also records videos when running from the CLI.

This behavior can be turned off by setting {% url `video` configuration#Videos %} to `false`.

Videos are stored in the {% url `videosFolder` configuration#Videos %} which is set to `cypress/videos` by default.

After `cypress run` completes, Cypress will automatically compress the video in order to save on file size. By default it compresses to a `32 CRF` but this is configurable with the {% url `videoCompression` configuration#Videos %} property.

By default, videos are processed + compressed after every run, successful or not. To change this behavior to only process videos in the case that tests fail, set the {% url `videoUploadOnPasses` configuration#Videos %} configuration option to `false`.

By default, Cypress clears any existing videos before a `cypress run`. If do not want to clear your videos folder before a run, you can set {% url `trashAssetsBeforeRuns` configuration#Videos %} to `false`.

# Now What?

So you are capturing screenshots and recording videos of your test runs, now what?

## Share Them With Your Team

Something you can take advantage of today is the {% url 'Cypress Dashboard Service' dashboard-service %}: our companion enterprise service that stores your artifacts for you and lets you view them from any web browser, as well as share them with your team.

## Visual Regression Test / Screenshot Diffing

Another possibility is visual regression testing: comparing screenshots of past runs with the current run to ensure that nothing changed. Cypress does not currently have this built-in, but it is on our radar. {% issue 495 'Follow this issue' %} if you are interested in being updated about this feature, leave comments if you would like to influence what gets built, and open a pull request if you would like to work on it yourself!
