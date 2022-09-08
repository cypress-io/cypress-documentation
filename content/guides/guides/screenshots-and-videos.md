---
title: Screenshots and Videos
---

<Alert type="info">

## <Icon name="graduation-cap"></Icon> What you'll learn

- How Cypress captures screenshots of test failures automatically
- How to manually capture your own screenshot
- How Cypress can record a video of the entire run
- Some options of what to do with screenshot and video artifacts

</Alert>

## Screenshots

Cypress comes with the ability to take screenshots, whether you are running via
`cypress open` or `cypress run`, even in CI.

To take a manual screenshot you can use the
[`cy.screenshot()`](/api/commands/screenshot) command.

Additionally, Cypress will automatically capture screenshots when a failure
happens during `cypress run`. Screenshots on failure are _not_ automatically
taken during `cypress open`.

Capturing of screenshots when a test fails can be turned off entirely by setting
[`screenshotOnRunFailure`](/guides/references/configuration#Screenshots) to
`false` from within the
[Cypress configuration](/guides/references/configuration) or by setting
`screenshotOnRunFailure` to `false` in the
[Cypress.Screenshot.defaults()](/api/cypress-api/screenshot-api).

Screenshots are stored in the
[`screenshotsFolder`](/guides/references/configuration#Screenshots) which is set
to `cypress/screenshots` by default.

Cypress clears any existing screenshots before `cypress run`. If you do not want
to clear your screenshots folder before a run, you can set
[`trashAssetsBeforeRuns`](/guides/references/configuration#Screenshots) to
`false`.

## Videos

Cypress records a video for each spec file when running tests during
`cypress run`. Videos are _not_ automatically recorded during `cypress open`.

Video recording can be turned off entirely by setting
[`video`](/guides/references/configuration#Videos) to `false` from within your
configuration.

Videos are stored in the
[`videosFolder`](/guides/references/configuration#Videos) which is set to
`cypress/videos` by default.

After `cypress run` completes, Cypress automatically compresses the video in
order to save on file size. By default it compresses to a `32 CRF`, but this is
configurable with the
[`videoCompression`](/guides/references/configuration#Videos) property.

When using the `--record` flag while running your tests, videos are processed,
compressed, and uploaded to [Cypress Cloud](/guides/cloud/introduction) after every spec file runs,
successful or not. To change this behavior to only process videos in the case
that tests fail, set the
[`videoUploadOnPasses`](/guides/references/configuration#Videos) configuration
option to `false`.

Cypress clears any existing videos before a `cypress run`. If you do not want to
clear your videos folder before a run, you can set
[`trashAssetsBeforeRuns`](/guides/references/configuration#Videos) to `false`.

### Video encoding

If your spec files have a long run duration, you might notice a time gap between
a finished spec and a new spec starting during `cypress run`. During this time,
Cypress is encoding the captured video and possibly uploading it to Cypress Cloud.

If the machine is encoding the video slowly (which is often the case for virtual
machines that use less CPU cores), the encoding might take a long time. In this
case, you can modify the
[`videoCompression`](/guides/references/configuration#Videos) configuration to
make the encoding a little bit faster. Here are some common scenarios:

**Change compression value**

:::cypress-config-example

```js
{
  videoCompression: 15
}
```

:::

A lower `videoCompression` value will spend less time compressing and result in
a bigger video file size.

**Disable compression**

:::cypress-config-example

```js
{
  videoCompression: false
}
```

:::

The compression step will be skipped completely, so the video will be large, but
the processing should be faster.

<Alert type="info">

If you are an FFmpeg pro and want to see all the settings and debug messages
during the encoding, run Cypress with the following environment variable:
`DEBUG=cypress:server:video cypress run`

</Alert>

### Control which videos to keep and upload to Cypress Cloud

You may want to have more control over which videos you want to keep and upload
to Cypress Cloud. Deleting videos after the run can save resource space on the
machine as well as skip the time used to process, compress, and upload the video
to [Cypress Cloud](/guides/cloud/introduction).

To only process videos in the case that a test fails, you can set the
[`videoUploadOnPasses`](/guides/references/configuration#Videos) configuration
option to `false`.

For more fine grained control, you can use Cypress's
[`after:spec`](/api/plugins/after-spec-api) event listener that fires after each
spec file is run and delete the video when certain conditions are met.

#### Only upload videos for specs with failing or retried tests

The example below shows how to delete the recorded video for specs that had no
retry attempts or failures when using Cypress
[test retries](/guides/guides/test-retries).

:::cypress-plugin-example

```js
// need to install these dependencies
// npm i lodash del --save-dev
const _ = require('lodash')
const del = require('del')
```

```js
on('after:spec', (spec, results) => {
  if (results && results.video) {
    // Do we have failures for any retry attempts?
    const failures = _.some(results.tests, (test) => {
      return _.some(test.attempts, { state: 'failed' })
    })
    if (!failures) {
      // delete the video if the spec passed and no tests retried
      return del(results.video)
    }
  }
})
```

:::

## Now What?

So you are capturing screenshots and recording videos of your test runs, now
what?

### Share Them With Your Team

<!-- Line breaks removed to prevent random br elements -->

Something you can take advantage of today is [Cypress Cloud](/guides/cloud/introduction): our companion
enterprise service that stores your artifacts for you and lets you view them
from any web browser, as well as share them with your team.

### Visual Regression Test / Screenshot Diffing

Another possibility is visual regression testing: comparing screenshots of past
runs with the current run to ensure that nothing changed.
[Read about how to implement visual testing.](/guides/tooling/visual-testing)

## See also

- [After Screenshot API](/api/plugins/after-screenshot-api)
- [Cypress.Screenshot](/api/cypress-api/screenshot-api)
- [Cypress Cloud](/guides/cloud/introduction)
- [`cy.screenshot()`](/api/commands/screenshot)
- [Visual Testing](/guides/tooling/visual-testing)
