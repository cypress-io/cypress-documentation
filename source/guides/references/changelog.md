---
title: Changelog
---

# 3.1.0

*Released 8/13/2018*

**Summary:**

- Cypress can now run tests in parallel across multiple virtual machines, or can be parallelized on a single machine. Cypress will automatically figure out, detect, and load balance all of your specs in the fastest and most efficient way possible. There is no configuration other than passing a `--parallel` flag and spinning up multiple machines on your CI provider. From our experiments you can expect to see approximately 40% reduction in overall run time **per machine** you add. However, attempting to run in parallel on a single machine requires server grade hardware with dozens (or even hundreds) of CPU's and GB of RAM to run efficiently. A much better and simpler approach is to use a cluster of docker containers that are all isolated from each other. Any standard CI service (CircleCI, TravisCI, etc) comes with the ability to do this. We automatically tap into their environment variables to make parallelization possible without you having to configure anything.
- Beyond parallelization, you now have the ability to group multiple runs with each other so that they show up together (grouped) in the Dashboard. This enables you to test different applications, groups of specs, or different environments (like development, staging, production) and see all of the results together. We know how important cross browser testing is to everyone, so we built this to lead directly into aggregating the results of multiple browsers into a single run.
- The Dashboard Service has been updated to show you more visual information about what happened during a run. You can see how specs were parallelized and you can calculate the effect of adding or removing machines to help reduce the overall run time.

**Features:**

- `cypress run` accepts a new {% url "`--parallel`" command-line#cypress-run-parallel %} flag to run specs in parallel. Fixes {% issue 1690 %} and {% issue 64 %} and {% issue 2297 %}.
- `cypress run` accepts a new {% url "`--group`" command-line#cypress-run-group-lt-name-gt %} flag to group multiple spec files within a single run. Fixes {% issue 2169 %}
- `cypress run` accepts a new {% url `--ci-build-id` command-line#cypress-run-ci-build-id-lt-id-gt %} flag. Fixes {% issue 2153 %}.

**Bugfixes:**

- We've finally tracked down the source of specs "hanging" and failing to start when running Electron. We finally tracked it down to a bug in Electron itself with setting `menu` when using offscreen rendering. Fixes {% issue 2322 %} and {% issue 2294 %} and {% issue 1235 %} and {% issue 1333 %}.
- Clicking on svg elements is now working. 3.0.2 introduced a bug that would throw an 'illegal invocation' error. Fixes {% issue 2245 %} and {% issue 2252 %} and {% issue 2258 %} and {% issue 2277 %} and {% issue 2288 %}.
- Fixed a regression in `3.0.2` that caused typing `{enter}` not to submit a form when there were `<button>` elements other than `type='submit'`. Fixes {% issue 2261 %} and {% issue 2326 %}.
- Fixed a small visual bug where failed commands were not aligned to other commands. Fixes {% issue 2314 %}.
- Fixes a race condition where async electron browser commands came in after the renderer had been destroyed, causing failures. Fixes {% issue 2321 %}.

**Misc**

- When recording to the Dashboard Service, we now provide estimated durations per spec directly within the standard output, as long as the spec has had enough run history for this to be determined. Fixes {% issue 2276 %}.
- When using the new {% url "`--parallel`" command-line#cypress-run-parallel %} or {% url "`--group`" command-line#cypress-run-group-lt-name-gt %} feature, we now visually indicate that to you in the standard output when recording. Fixes {% issue 2275 %}.
- We have added support for more CI providers to automatically detect and show more relevant information in the Dashboard, instead of showing 'Unknown'. Fixes {% issue 2146 %}.
- We have added better checks and reliability for detecting runs in Jenkins. Fixes {% issue 1990 %}.
- The built in {% url "`cypress-browserify-preprocessor`" https://github.com/cypress-io/cypress-browserify-preprocessor %} was bumped to `1.1.0`. This supports more JavaScript features by default, including async/await, object rest spread, and class properties. Fixes {% issue 2254 %}.
- {% url "`cypress run`" command-line#cypress-run %} now creates a new browser profile per run per browser, but keeps the same browser profile for interactive mode with {% url "`cypress open`" command-line#cypress-open %}. This means you can run Cypress locally over multiple processes and the browser profiles will not conflict with each other. Fixes {% issue 1566 %}.
- The Desktop-GUI has been updated to get the new routes provided by the Cypress API for runs. Fixes {% issue 2189 %}.
- Cypress now retries multiple times (with a backoff strategy) when communicating with our API fails while recording runs. This will provide better feedback in situations when the API is temporarily unavailable. Fixes {% issue 1590 %}.
- When Cypress retries due to an API timeout or failure it now displays a very nice message indicating to you the delay and number of retries left. Fixes {% issue 2280 %}.
- We've added parallelization to our own internal tests for the driver and the desktop-gui. We've been able to reduce the number of concurrent instances our tests use by 4, and shaved about 6 minutes off of each build. Faster with less resources. Fixes {% issue 2325 %}.

**Documentation Changes:**

- {% url 'Added `Parallelization` doc.' parallelization %}
- {% url 'Update `Dashboard Service` doc with new screenshots and run sections.' dashboard-service %}
- {% url 'Update `Command Line` doc with new flags and alphabetized flags.' command-line %}

# 3.0.3

*Released 7/30/2018*

**Bugfixes:**

- Reverted the Chrome argument that disabled `RootLayerScrolling` which was used to prevent the application under test from "shaking" due to a bug in versions 66 and 67. This workaround inadvertently created a different and much more severe bug in Chrome 68 that would miscalculate pointer coordinates. This led to Cypress giving confusing errors about elements being covered up on action. This is still a bug in Chrome, and is fixed in Canary but has not yet been released to the stable Chrome 68 channel. Nevertheless, removing the `RootLayerScrolling` flag does fix it. We did several experiments to try to ensure that the "shaking" behavior does not exhibit itself in Chrome 68. We have limited the `--disable-blink-features=RootLayerScrolling` flag to Chrome 66 and Chrome 67. Fixes {% issue 2223 %} and {% issue 2215 %} and {% issue 2037 %}.
- Fixed another bug with Chrome that caused the `chromeWebSecurity: false` option to not be respected. This was due to Chrome progressively rolling out trials of a new option that attempts to isolate sites (and iframes) in their own child process if their origins are different. Fixes {% issue 1951 %} and {% issue 2001 %} and {% issue 715 %}.
- Fixed Cypress hanging in CI due to excessive and unnecessary globbing. We finally tracked down this issue which made it appear as if Cypress was "hanging" after closing a spec file and then attempting to open the next one. Fixes {% issue 2183 %} and {% issue 1905 %} and {% issue 1912 %}.
- We are now properly serializing nested object arguments when using the {% url "Module API" module-api %} via `cypress.open()` or `cypress.run()`. Passing nested objects in `reporterOptions` now works correctly. This is especially useful when using `mocha-multi-reporters`. In addition to fixing the {% url "Module API" module-api %}, we are now also properly handling nested arguments from the {% url "Command Line" command-line %}. In order to pass nested objects within CLI params you must pass stringified JSON. This is useful for properties such as `blacklistHosts`. Fixes {% issue 1348 %} and {% issue 1357 %} and {% issue 2221 %}.
- Fixed a bug causing screenshots saved via {% url "`cy.screenshot()`" screenshot %} to be in different folders when you ran using {% url "`cypress open`" command-line#cypress-open %}  vs {% url "`cypress run`" command-line#cypress-run %} . Fixes {% issue 2091 %}.
- Fixed bugs with Electron losing focus when running headlessly via {% url "`cypress run`" command-line#cypress-run %} after navigation. Now the browser will always act as if it is focused no matter what and in all situations when running headlessly. If you were seeing focus related problems when running headlessly, this should fix them. Fixes issue {% issue 2190 %}.
- Fixed using when using {% url "`cy.click()`" click %} on an element that bound to the `focus` event while the browser was currently *out of focus*. We have now normalized **all focus and blur events** to behave the same as if the browser is always in focus. This should fix the other batch of `blur` and `focus` issues that users have been experiencing. Fixes {% issue 549 %} and {% issue 2198 %}.
- Fixed the vast majority of known issues with {% url "`.type()`" type %}. Fixes {% issue 1241 %}.
- Using {% url "`.type()`" type %} on an input of type `email` or `number` will no longer fire unnecessary additional `blur` and `focus` events. Fixes {% issue 2210 %}.
- Fixed {% url "`.type()`" type %} breaking on chains when passing the same `options` references. Fixes {% issue 365 %}.
- Fixed an issue with {% url "`.clear()`" clear %} not behaving the same as `cy.type('{selectall}{backspace}')`. Fixes {% issue 420 %}.
- Fixed a bug with issuing an additional `blur` and `click` event when chaining `.clear().type(...)`. Fixes {% issue 593 %}.
- Fixed many issues with typing into `[contenteditable]` elements. WYSIWYG, {% url "Draft.js" https://draftjs.org/ %} based, and other HTML editors now work correctly. Fixes {% issue 596 %} and {% issue 1686 %} and {% issue 2096 %}.
- The caret now correctly moves on `[contenteditable]` elements. Fixes {% issue 1108 %}.
- Fixed {% url "`.type()`" type %} inserting a rogue `<br>` tag after the first letter in `[contenteditable]` elements. Fixes {% issue 1926 %}.
- Fixed issue where change events with {% url "`.type()`" type %} would not fire correctly for many more situations and edge cases. Fixes {% issue 651 %}.
- Fixed issues with typing into JS based text-mask plugins. Basically anything that would alter the `.value` in response to certain events now works correctly. Fixes {% issue 940 %} and {% issue 1684 %}.
- Using {% url "`.clear()`" clear %} on an input with a `maxlength` attribute now works. Fixes {% issue 1002 %} and {% issue 2056 %}.
- Fixed issues with {% url "`.type()`" type %} not firing the `change` event on `input[type=number]`. Fixes {% issue 1171 %}.
- Fixed other event related issues with {% url "`.type()`" type %} that were not firing correctly. Fixes {% issue 1209 %}.
- Fixed even more issues with {% url "`.type()`" type %} not inserting characters on `input[type=number]`. Fixes {% issue 1381 %}.
- Fixed not being able to type negative numbers into `input[type=number]` elements. Fixes {% issue 2173 %}.
- Fixed `selectionStart` and `selectionEnd` with {% url "`.type()`" type %} when using `{leftarrow}` or `{rightarrow}`. Fixes {% issue 1234 %}.
- Fixed not being able to type into a `datetime-local` input. Fixes {% issue 1366 %}.
- Calling {% url "`.focus()`" focus %} or {% url "`.blur()`" blur %} on {% url "`cy.window()`" window %} no longer fires blur events on the `activeElement` or causes it to become `body`. Fixes {% issue 2234 %}.
- Using `cy.get('body').click()` now correctly changes the `activeElement` back to `body` and causes the existing `activeElement` to receive `blur`. Fixes {% issue 2236 %}.

**Misc:**

- We've loosened up the restrictions surrounding what we consider a typeable element. You can now type into inputs with invalid `type` attributes because the browser does still consider them regular `text` inputs and allows you to type into them. Fixes {% issue 586 %}.
- Using `{uparrow}` or `{downarrow}` with {% url "`.type()`" type %} on an `input[type=number]` element now increments or decrements the number configured via the `step` attribute. Fixes {% issue 2110 %}.
- Using `{uparrow}` or `{downarrow}` with {% url "`.type()`" type %} now correctly moves the cursor on `textarea` or `[contenteditable]` elements. Fixes {% issue 2187 %}.
- You can now use {% url "`.focus()`" focus %} or {% url "`.blur()`" blur %} on `cy.get('body')`. Fixes {% issue 2235 %}.
- Bumped the version in `junit` reporter dep from `1.12.1` to `1.17.0` which adds a few new features. Fixes {% issue 2238 %}.
- Bumped deps that `npm audit` was yelling about. Fixes {% issue 1701 %}.
- Runs showing up in the `Runs` tab now more closely match how they display in the Dashboard. Fixes {% issue 2060 %}.
- Added more debug logs. Fixes {% issue 2108 %}.
- When recording to the Dashboard we now more accurately collect commit details when it is missing from the local `git` data. Fixes {% issue 2129 %} and {% issue 2073 %}.
- Updated build in example kitchen sink to `1.0.2`. Fixes {% issue 2139 %}.
- Updated the json-schema describing `videoCompression`. Allowing it to be a boolean. Fixes {% issue 2140 %}.

**Documentation Changes:**

- {% url 'New "Module API" doc' module-api %}

# 3.0.2

*Released 6/28/2018*

**Bugfixes:**

- Screenshots taken with {% url "`cy.screenshot()`" screenshot %} on 2x DPI are now taken at the correct full size. Fixes {% issue 1857 %} and {% issue 2018 %}.
- Windows users no longer exit with `EPIPE` errors when running `cypress run` in newer versions of node. Fixes {% issue 1841 %} and {% issue 2044 %}.
- Fixed issue where applications programmatically stealing focus would lead to slow runs in Electron when running via `cypress run`. {% issue 1909 %} and {% issue 1892 %}.
- Electron no longer reports the browser as out of focus when running via `cypress run`. Fixes {% issue 1939 %}.
- Modified the `document.hasFocus()` method to return `true` if the top window (Cypress window) is in focus. This should now correctly match how your application behaves outside of Cypress. Fixes {% issue 1940 %}.
- Fixed issue where Cypress would unnecessarily scroll when attempting to locate elements with `position: sticky`. Fixes {% issue 1475 %}.
- Fixed a bug where changing the {% url "`integrationFolder`" configuration#Folders-Files %} in Windows would lead to errors with plugins. Fixes {% issue 1704 %}.
- Cypress no longer crashes when a 3rd party server sends invalid `gzip` content. Also fixed issues with incorrectly gunzipping multibyte characters which would potentially lead to serving invalid HTML or JS. Fixes {% issue 1396 %} and {% issue 1756 %}.
- The `--silent` flag should now be respected during `npm install cypress` on all OSes. Fixes {% issue 817 %}.
- Corrected a typo in the CLI for a warning message. Fixes {% issue 2038 %}.
- Fixed some areas of the Desktop GUI that did not display path names correctly in Windows. Fixes {% issue 1830 %}.
- The `pluginsFile` now supports an absolute path instead of just a relative one. Fixes {% issue 1837 %}.
- Fixed a regression introduced in `3.x.x` where application code that used `setTimeout` with a string argument would see the error `fn.apply is not a function`. Fixes {% issue 1854 %}.
- Fixed issue where preprocessor errors were being swallowed. Fixes {% issue 1877 %}.
- Fixed issue where Cypress would hang indefinitely when starting a new spec when in `cypress run` mode. Additionally we have optimized the code path to not read in the local `state.json` unnecessarily. Fixes {% issue 2013 %} and {% issue 1912 %} and {% issue 1905 %} and {% issue 1890 %}.
- Fixed a couple regressions in the Dashboard where timed out runs stayed "Pending" forever. Fixes {% issue 1891 %} and {% issue 1952 %}.
- Fixed another Dashboard regression where an error would throw when recording tests and sending a large list of specs. Fixes {% issue 1901 %}.
- Fixed issue where videos would not be recorded when an object was returned from `before:browser:launch` when in the Electron browser. Fixes {% issue 1992 %}.
- Fixed an issue where Cypress would inject content into the `<header>` tag instead of the `<head>` tag. Fixes {% issue 2026 %}.
- Fixed an oversight where a specific framebusting check was not being properly stripped and removed by the default config option {% url "`modifyObstructiveCode`" configuration#Browser %}. Fixes {% issue 2030 %} and {% issue 2059 %}.
- Fixed icons visually shifting when tests were running in the Test Runner. Fixes {% issue 1983 %}.
- Server sent events now *finally* work correctly in Cypress. Fixes {% issue 1440 %} and {% issue 1111 %}.
- Time traveling snapshots now preserve the styles of empty `<style>` tags with programmatically inserted CSS rules. Fixes {% issue 1226 %}.

**Misc:**

- There are now several new CLI commands for interacting with the binary cache: {% url "`cypress cache path`" command-line#cypress-cache-path %}, {% url "`cypress cache list`" command-line#cypress-cache-list %}, and {% url "`cypress cache clear`" command-line#cypress-cache-clear %}. Fixes {% issue 1856 %}.
- We've added a new CLI flag: `--no-exit` for {% url "`cypress run`" command-line#cypress-run %} to keep the browser open after the tests finish running. Fixes {% issue 1871 %}.
- The {% url "CLI" command-line %} now respects config values and environment variables put in your `.npmrc` file. Fixes {% issue 1399 %} and {% issue 1853 %}.
- Significantly improved the performance of taking screenshots. {% issue 1863 %}.
- Node module dependencies updated. Fixes {% issue 1674 %} and {% issue 1942 %}.
- The bundled version of `ffmpeg` has now been bumped from `3.x.x` to `4.x.x`. This may help with some issues users were experiencing when recording videos. Fixes {% issue 1972 %}.
- Added more debug logs to `ffmpeg` to determine why `ffmpeg` compression sometimes causes Cypress to crash (mostly while running in Travis CI). Fixes {% issue 1971 %}.
- Several improvements to TypeScript typings. Fixes {% issue 1881 %} and {% issue 2007 %} and {% issue 1899 %} and {% issue 1902 %} and {% issue 1897 %} and {% issue 1907 %}.
- We improved error logging and the user experience around {% url "`cypress verify`" command-line#cypress-verify %}. Fixes {% issue 1984 %}.
- We no longer log the `skipping install` message if the Cypress binary is already installed locally. Fixes {% issue 1985 %}.
- Now, by default, screenshots are nested within a folder with the name of **the spec file** that is currently running. Example - the spec named `cypress/integration/foo/bar_spec.js` will save screenshots inside of this directory: `cypress/screenshots/foo/bar_spec.js/*`. Fixes {% issue 1826 %}.
- Passing `foo/bar/baz` as the fileName arg to {% url "`cy.screenshot()`" screenshot#Take-a-screenshot-and-save-in-a-specific-directory %} inside a spec, `app.spec.js`, will now result in the screenshot being saved to a nested folder path such as: `cypress/screenshots/app.spec.js/foo/bar/baz.png`. Fixes {% issue 1771 %} and {% issue 668 %}.
- We now append `(failed)` to the screenshot filename of screenshots taken automatically during test failure. Fixes {% issue 1923 %}.
- If multiple screenshots are taken during a test that will result in the same filename, their file paths are now appended with a number, i.e. `test name (1).png`. This prevents screenshot files with the same name from being overwritten. Fixes {% issue 1766 %}.
- Screenshot `onAfterScreenshot` and `onBeforeScreenshot` callbacks ar enow invoked for failed tests. They include a `testFailure` property to distinguish between automatic ones and your own use of `cy.screenshot()`. Fixes {% issue 2040 %}.
- There's now an {% url "`after:screenshot` plugin event" after-screenshot-api %} you can use in your `pluginsFile` to work with screenshots after they are taken. This enables you to rename them, move their location, resize them, send them to a service, etc. Fixes {% issue 2039 %}.
- Added `Cypress.browser` object which contains information about the currently running browser. Fixes {% issue 1919 %} and {% issue 1961 %}.
- Added `Cypress.spec` object which contains information about the currently running spec. Fixes {% issue 1918 %}.
- Urls displayed in the Command Log during {% url "`cy.visit()`" visit %} are no longer arbitrarily truncated at a set width. Fixes {% issue 1995 %}.

**Documentation Changes:**

- {% url 'Update `cy.screenshot()` doc to include new file naming behavior' screenshot %}
- {% url 'Updated "Command Line" doc to include new cache commands' command-line %}
- {% url 'Added `Cypress.browser` doc.' browser %}
- {% url 'Added `Cypress.spec` doc.' spec %}
- {% url 'Added `after:screenshot` plugin event doc.' after-screenshot-api %}

# 3.0.1

*Released 5/30/2018*

**Bugfixes:**

- Seeded KitchenSink tests no longer fail. Fixes {% issue 1812 %}.
- The binary cache now correctly works and will not reinstall Cypress if an existing version is already installed. Fixes {% issue 1813 %}.
- Closing the `Electron` browser and then opening `Chrome` no longer causes `cy.screenshot()` to fail. Fixes {% issue 1820 %}.
- Fixed a bug with Windows users seeing crashes with `tty.getWindowSize is not a function`. Fixes {% issue 1815 %} and {% issue 1817 %}.

# 3.0.0

*Released 5/29/2018*

**Summary:**

- There is a new {% url `cy.task()` task %} command that enables you to go outside the browser to perform tasks directly in `node`. This will make it easy to setup, scaffold, seed, talk to your database, or anything else useful on a backend.
- {% url `cy.screenshot()` screenshot %} has been rewritten from the ground up. It now takes a screenshot of **only** the application under test by default. It also can take full page screenshots or element only screenshots. This is the first step of Cypress Dashboard support for screenshot diffing.
- When running with `cypress run` we now run each spec file in isolation from others. We have rewritten our reporter to provide more details and provide a summary of the run at the bottom.
- The Dashboard has been upgraded to make it easier to understand the results of each spec run. This was done in anticipation of providing you the ability to parallelize and load balance your spec files automatically in CI.
- We are now capturing the performance and timings data of every test when using `--record` mode and are beginning to offer the first analytics and insights into the health of your tests on our Dashboard service.
- Cypress now caches globally per version which prevents it from being installed multiple times across projects.

**Breaking Changes:**

- We now run each spec file in isolation from one another. This *shouldn't* technically break anything, but if you have set up your tests in a way that requires the state of a previous spec file, this could potentially break your tests. This will go a long ways towards reducing problems we were seeing with long runs in CI. Fixes {% issue 431 %}, {% issue 681 %}, {% issue 1589 %}, {% issue 1539 %}, and {% issue 1692 %}.
- The environment variable `CYPRESS_BINARY_VERSION` has been removed. You should use the equivalent environment variable `CYPRESS_INSTALL_BINARY` instead.
- The environment variable `CYPRESS_SKIP_BINARY_INSTALL` has been removed. To skip the binary install, set `CYPRESS_INSTALL_BINARY=0`.
- `screenshotOnHeadlessFailure` has been removed as an option in `cypress.json`. Instead you can now control this behavior directly with code by setting `screenshotOnRunFailure` to `false` within the new {% url "Screenshot API" screenshot-api %}. Fixes {% issue 1140 %} and {% issue 1754 %}.
- `trashAssetsBeforeHeadlessRuns` has been renamed to `trashAssetsBeforeRuns` in our configuration. Fixes {% issue 1754 %}.
- `videoRecording` has been renamed to `video` in our configuration to be clearer and prevent confusion about recording to our Dashboard. Fixes {% issue 562 %}.
- Cypress no longer copies screenshots and videos to artifacts for CircleCI. Copying artifacts should be left up to the user to {% url "handle themselves in their `circle.yml` file" https://circleci.com/docs/2.0/artifacts/ %}. Fixes {% issue 1592 %}.
- The standard output has been redesigned to better visualize spec files running in isolation and to be more visually appealing. This may break any specialized logic written that expected the standard output to be structured in a specific way or contain specific words. Fixes {% issue 1588 %}.
- {% url `cy.screenshot()` screenshot %} no longer takes a screenshot of the runner by default. Instead it will hide the runner, remove application scaling and then scroll to take a full page picture of your application.
- `before` and `after` hooks within a {% url "support file" writing-and-organizing-tests#Support-file %} now run before/after every spec file, instead of only once before/after the entire run. {% issue 681 %}

**Features:**

- There is a new {% url `cy.task()` task %} command for executing any arbitrary `node` code.
- You can now run multiple specs by passing a glob to the `--spec` argument of `cypress run`. Fixes {% issue 263 %}, {% issue 416 %} and {% issue 681 %}.
- There is a new {% url "Screenshot API" screenshot-api %} and new {% url `cy.screenshot()` screenshot %} options that allow you set defaults for how screenshots are captured, whether to scale your app, disable timers and animations, or which elements to black out in the screenshot. You can also set defaults for whether to automatically take screenshots when there are test failures or whether to wait for the Command Log to synchronize before taking the screenshot. Fixes {% issue 1424 %}.
- {% url `cy.screenshot()` screenshot %} can now be chained off of commands that yield a DOM element and will only take a screenshot that element.
- During install of cypress, the Cypress binary is now downloaded to a global cache. This prevents multiple projects from downloading the same Cypress version. Fixes {% issue 1300 %}.
- The seeded `example_spec.js` file has been replaced by an `examples` folder with several spec files. This more closely reflects the recommended use of Cypress - as smaller groups of tests split among many files that will now be run in isolation. The tests were also updated from ES5 to ES6. You can see all changes in the {% url "`cypress-example-kitchensink` repo" https://github.com/cypress-io/cypress-example-kitchensink %} Fixes {% issue 1460 %}.
- Cypress now watches all the `plugins file`'s entire dependency tree to make iterating on plugins easier. Fixes {% issue 1407 %}.
- Videos will now be saved locally with a filename named after the associated `spec` file that it represents. Fixes {% issue 980 %}.
- The Test Runner now displays `skipped` tests differently than `pending` tests. {% issue 244 %}.
- Standard output now displays the number of `skipped` tests within the summary output during `cypress run`. {% issue 1559 %}.
- The url to view the run in the Dashboard is now printed to output during `cypress run`. {% issue 494 %}.
- We now print the browser and browser version run in the output during `cypress run`. {% issue 833 %}.
- The build number and url to CI for tests run within {% url "Drone" https://drone.io/ %} are now captured and displayed on the run within the Dashboard. {% issue 1709 %}.

**Bugfixes:**

- Cypress no longer crashes when attempting to proxy a websocket connection that fails. Fixes {% issue 556 %}.
- Asserting that an attribute equals a falsy value no longer fails when the value was falsy. Fixes {% issue 831 %} and {% issue 1491 %}.
- Snapshots now ignore stylesheets with `media="print"`. Fixes {% issue 1568 %}.
- Fixed issue where the Cypress `window` was being returned instead of AUT's `window`. Fixes {% issue 1436 %}.
- The `close` event now properly fires on `file` when manually closing the browser. Fixes {% issue 1560 %}.
- `cypress.env.json` is now being watched for changes. Fixes {% issue 1464 %}.
- Fixed issue when using TypeScript that caused namespace errors to be thrown. Fixes {% issue 1627 %}.
- Fixed error message on {% url "`.type()`" type %} and {% url "`.clear()`" clear %} when typing into non-typeable elements or clearing non-clearable elements to accurately list the elements allowed. Fixes {% issue 1650 %}.
- Added Chrome flag `--disable-blink-features=RootLayerScrolling` to prevent the application under test from "shaking" in recent versions of Chrome. Fixes {% issue 1620 %}.
- Fixed issue where some TTY characters were not properly formatted in the terminal for Windows during `cypress run`. Fixes {% issue 1143 %} and {% issue 1550 %}.
- Removed an extraneous error display from Electron during `cypress run` about a "transparent titlebar" setting. Fixes {% issue 1745 %}.

**Misc:**

- We are now aggressively turning on colors when running in CI. If you're using Jenkins and **do not** have an ANSI color plugin installed, you can turn off colors with the `NO_COLOR=1` environment variable. Fixes {% issue 1747 %} and {% issue 1748 %}.
- When running `cypress run --record` on forked PR's, we now detect that the Record Key is missing and do not fail the build. We will display a warning, but continue running the tests. Fixes {% issue 1193 %}.
- Searching in the Test Runner now filters out any non-matching folders. Fixes {% issue 1706 %}.
- Duplicate, subsequent logs in the Command Log are now collapsed and can be expanded to view all logs. Fixes {% issue 1580 %}.
- We now throw a descriptive error if an alias using {% url "`.as()`" as %} was defined starting with the `@` character. {% issue 1643 %}.
- We now pass the `--disable-device-discovery-notifications` flag automatically. This should prevent Chromium browser from automatically trying to communicate with devices in your network, such as printers, while running tests. Fixes {% issue 1600 %}.
- We now pass any reporter errors along and provide a stack if a custom reporter you've provided does not exist. Fixes {% issue 1192 %}.
- You can now pass a normal object to `cypress.open()` or `cypress.run()` through the {% url "Module API" module-api %}, just as you would from the command line. {% issue 1442 %}.
- Added type definitions for `Cypress.off` and `Cypress.log`. Fixes {% issue 1110 %} and {% issue 1591 %}.
- Update type definitions for {% url `cy.screenshot()` screenshot %} to reflect new changes to command's options. Fixes {% issue 1753 %}.
- The type definition for {% url `.filter()` filter %} now correctly supports a function argument.
- The type definition for {% url `.scrollIntoView()` scrollintoview %} no longer errors when passed a `duration` option. Fixes {% issue 1606 %}.
- `NODE_OPTIONS` environment variables now print within the `cypress:cli` logs when running in `DEBUG` mode. Although using `NODE_OPTIONS` themselves should not be used due to {% issue 1676 %}. Fixes {% issue 1673 %}.
- Cypress will error and exit with status 1 if no specs were found during `cypress run`. Fixes {% issue 1585 %}.
- We are now counting and aggregating the stats at the end of test runs separately from Mocha. Cypress considers a test to be the `it` and any accompanying `hooks` that run before or after a test. Cypress will correctly associate failures in those hooks to the test itself. We believe this more accurately models and just "makes sense". Fixes {% issue 1163 %}.
- The minimum viewport size has been lowered from `200` pixels to `20` pixels. Fixes {% issue 1169 %} and {% issue 1444 %}.
- Internal changes to our API structure and communication. Fixes {% issue 1170 %}, {% issue 1413 %}, {% issue 1415 %}.
- We output a much more complete test results object when using cypress as a module. Fixes {% issue 1248 %}.
- Added keywords to Cypress NPM package. Fixes {% issue 1508 %}.
- Centered the animating icon in the Test runner when 'running'. Fixes {% issue 1695 %}.
- We made some changes to internal references of `headed` and `headless` to be more specific and instead reference `run mode` and `interactive mode`. Fixes {% issue 1140 %}.
- The test name text is now selectable inside the Command Log. Fixes {% issue 1476 %}.
- Minor improvements to contributing docs and scripts. Fixes {% issue 1665 %}.
- We now collect Semaphore CI params and provide URL's to click into the builds from the Dashboard. Fixes {% issue 1785 %}.
- Config overrides coming from the CLI or environment variables are now validated the same way as if they've been set in `cypress.json`. Fixes {% issue 1783 %}.
- There is a better / more helpful experience around passing unknown options to the CLI. Fixes {% issue 837 %}.
- Display an empty message when there is no commit information on recorded runs. Fixes {% issue 1809 %}.

**Documentation Changes:**

- {% url 'New `cy.task()` doc' task %}
- {% url 'New `Screenshot API` doc' screenshot-api %}
- {% url 'Update `cy.screenshot()` doc to include new accepted usage and options' screenshot %}
- {% url 'Update `Installing Cypress` doc to include new options for Cypress binary caching' installing-cypress %}
- {% url 'Updated `Writing and Organizing Tests` to include newly seeded `examples` folder' writing-and-organizing-tests %}
- {% url 'Updated `cypress run` spec args' command-line#cypress-run %}
- {% url 'Updated `Dashboard Service`' dashboard-service %}
- {% url 'Updated `Launching Browsers` to include our disabling of device discovery notifications' launching-browsers %}
- {% url 'Updated `Preprocessors` to reflect all ways `close` event could be triggered' dashboard-service %}
- Updated use of "running headlessly" to more accurate "during `cypress run`"

# 2.1.0

*Released 3/1/2018*

**Bugfixes:**

- Prevent a bug with `node-sass` on OSX + Windows when local `node` version does not match bundled `node` when importing components directly in spec files. The underlying issue was because we forgot to update `Buildkite` and `Appveyor` when we upgraded `Electron` in `2.0.0`. Fixes {% issue 1387 %} and {% issue 1390 %}.

**Features:**

- The {% url 'Selector Playground' test-runner#Selector-Playground %} has been updated to automatically prefer `data-cy`, `data-test` or `data-testid` attributes when providing the unique selector for an element. Additionally it now exposes a {% url 'public API' selector-playground-api %} that you can use to control how it determines which selector to use. Fixes {% issue 1135 %}.

**Documentation Changes:**

- {% url 'Added `Selector Playground Guide`' test-runner#Selector-Playground %}
- {% url 'Added `Selector Playground API`' selector-playground-api %}
- {% url 'Updated `Best Practices`' best-practices %}
- {% url 'Updated `FAQ`' using-cypress-faq %}
- {% url 'Updated `Introduction to Cypress`' introduction-to-cypress %}

# 2.0.4

*Released 2/25/2018*

**Bugfixes:**

- The `cypress` npm package now has the correct `engines` set in `package.json`. This was accidentally getting overwritten and caused errors when `engineStrict` was set in environments using `node` older than `8.2.1`. Fixes {% issue 1373 %}.

# 2.0.3

*Released 2/21/2018*

**Bugfixes:**

- The runner no longer appears to "hang" if a `before` hook fails in a test with siblings. Previously the test would never generate a `status` and look pending forever. This was a visual bug only. Fixes {% issue 1343 %}.
- The Desktop GUI properly renders folders that contain specs in Windows now. Fixes {% issue 1335 %}.

**Misc:**

- The viewport dropdown helper in the Runner now displays string quoted JSON instead of an object literal. This better matches how you should write those options in `cypress.json`. Fixes {% issue 1350 %}.

# 2.0.2

*Released 2/17/2018*

**Bugfixes:**

- Fixed more edge cases where legitimate JavaScript code was being modified unexpectedly by the {% url "`modifyObstructiveCode`" configuration#Browser %} configuration. We've tightened up the regexp even more and added 40 popular JS libraries to test against to ensure they are not modified. Fixes {% issue 1334 %}.
- Fixed an edge case when hooks such as `beforeEach` or `afterEach` threw an **identical** error message, Cypress would hang indefinitely and never finish running the tests. Fixes {% issue 674 %}.
- Fixed bug when `Errors` that threw with no arguments: `throw new Error()` and had their messages appended would duplicate the message over and over again. Fixes {% issue 1338 %}.

# 2.0.1

*Released 2/16/2018*

**Bugfixes:**

- Using {% url "`cy.contains()`" contains %} with a regexp argument is now properly escaped. Fixes {% issue 1322 %}.
- Fixed a runaway regexp causing large `.js` files to take dozens of seconds to process. This was a regression caused by `2.0.0` with the new {% url "`modifyObstructiveCode`" configuration#Browser %} option. We've optimized the regexp and the performance is back to being almost identical to transparently passing responses through. Fixes {% issue 1330 %}.

# 2.0.0

*Released 2/15/2018*

**Breaking Changes:**

- The built in default `Electron` browser has been bumped from version `53` to `59`. This version represents the version of `Chromium` that Electron is using. In other words, running `cypress run` (or via `Electron`) will be like running your tests in `Chrome 59` now. Although it is unlikely this would actually *break* any of your tests - it is technically possible they could behave differently. Fixes {% issue 895 %} and {% issue 891 %} and {% issue 823 %} and {% issue 860 %} and {% issue 1011 %} and {% issue 1252 %} and {% issue 1276 %}.
- We are now detecting and automatically stripping code that obstructs Cypress from being able to test your application. Specifically, we are removing JavaScript code that tries to prevent **clickjacking** and **framebusting**. We have written very conservative rules that do their best to **only** strip these specific JS snippets, but it is technically possible that it may unintentionally rewrite valid JS if they match the regexp patterns. There is a new configuration option called {% url "`modifyObstructiveCode`" configuration#Browser %} that is `true` by default. If you are experiencing problems after upgrading, you can turn this off and this will disable modifying your JS code. If you were using Cypress and upon visiting your website you would experience seemingly "random" redirects - these problems should now be eliminated. Fixes {% issue 886 %} and {% issue 1245 %} and {% issue 1064 %} and {% issue 992 %} and {% issue 692 %} and {% issue 352 %}.
- We are now clearing the browser's disk cache each time it opens (before any tests run). This means that any files that have been cached from `Cache-Control` headers will be cleaned and removed. In the future, we will expose a new `cy.clearCache()` method to provide finer grained control of clearing the cache on a per test basis. But for now, this is an improvement. Fixes {% issue 1124 %}.
- The `--spec` option is now normalized against the current working directory `cwd` instead of the project that you are running Cypress in. That means passing a path from the command line to a spec file will now work even when the project path is not `cwd`. Fixes {% issue 1159 %}.

**Bugfixes:**

- {% url "`blacklistHosts`" configuration#Browser %} would occasionally not work if you were blacklisting a host that had previously cached a file. In this case, the browser would serve it from disk and not make an actual HTTP request. This issue has been solved by clearing the cache when the browser opens. Fixes {% issue 1154 %}.
- {% url "`blacklistHosts`" configuration#Browser %} is now correctly accepted via the `--config` CLI flag.
- Spies and Stubs created with {% url "`cy.stub()`" stub %} and {% url "`cy.spy()`" spy %} will now retry their assertions when utilized from an {% url "alias" as %}. Fixes {% issue 1156 %}.
- Basic auth is working again in Chrome 63 and Chrome 64. We "for real" fixed it this time by adding auth headers automatically at the network proxy layer and bypassed the browser altogether. We automatically apply auth headers if you provide a username/password in the URL of a `cy.visit(url)`. We also added a new `auth` option to specify the `username/password` using `cy.visit(url, options)`. All of the requests that match the origin of the `url` will have the `Authorization: Basic <...>` headers added. Fixes {% issue 1288 %}.
- Fixed domain parsing failures when `local` or `localhost` was not used as a `tld`. Fixes {% issue 1292 %} and {% issue 1278 %}.
- Removed the flag `--disable-background-networking` from the Chrome launch args to fix problems in CI that would throttle XHR callbacks by up to 20-30 seconds. Fixes {% issue 1320 %}.

**Misc:**

- We now properly display nested objects and arrays that come from `cypress.json` in the Settings tab in the Desktop Application.
- There's now a proper "empty view" when you go to setup your project to record on our Dashboard and you have not created any Organizations. Fixes {% issue 1306 %}.
- Removed the message about private projects requiring a paid account in the future. There will be a free tier including private projects. Fixes {% issue 827 %}.
- We moved the location of the browser's disk cache. That means that if you've been using Cypress for a really long time - you may have built up quite a large existing cache (in the hundreds of `mb`). Before upgrading, you should open the browser and then manually clear the Cache. Or - if you have already upgraded to `2.0.0` delete the following folders:
  - OSX: `~/Library/Caches/Cypress`
  - Linux: `~/.cache/Cypress`
  - Windows: `%APPDATA%\Cypress\cy\production\browsers`

# 1.4.2

*Released 2/4/2018*

**Bugfixes:**

- Fixed not being able to visit subdomains when using 2nd level sub domains. Fixes {% issue 1175 %} and {% issue 600 %}.
- Fixed not being able to visit private TLD's from the public suffix such as `github.io`, `gitlab.io` or `herokuapp.com`. These now all work correctly. Fixes {% issue 380 %} and {% issue 402 %} and {% issue 802 %} and {% issue 493 %} and {% issue 1161 %}.
- Fixed not being able to visit URLs that used `*localhost` such as `http://app.localhost:8080`. Fixes {% issue 451 %}.
- Mochawesome now works correctly and outputs files in all versions. Fixes {% issue 551 %}.
- Mochawesome will exit correctly with code `1` when a hook fails. {% issue 1063 %}.
- Fixed some incorrect typings with TypeScript. Fixes {% issue 1219 %} and {% issue 1219 %}.
- Fixed bug with custom 3rd party mocha reporters relying on `test.titlePath` being a function. Fixes {% issue 1142 %}.
- Fixed typo in `cypress.schema.json`. Fixes {% issue 1167 %}.
- Fixed typo in CLI deps error about Docker. Fixes {% issue 1136 %}.
- Prevent `NODE_ENV` from being set to `undefined` when parent process did not have it defined. Fixes {% issue 1223 %}.

**Misc:**

- We have begun to aggregate failures and other stats ourselves instead of relying on Mocha reporters. Fixes {% issue 1141 %}.
- Added TypeScript `should/and` autocomplete and typings for Cypress events. Fixes {% issue 1187 %} and {% issue 1132 %}.
- Upgrade deps. Fixes {% issue 1174 %}.

# 1.4.1

*Released 12/26/2017*

**Bugfixes:**

- Using `DEBUG=cypress:*` now correctly outputs all debugging information on OSX and Linux. Previously output other then `cypress:cli` was ignored due to the CLI ignoring `stderr` from the binary. Fixes {% issue 921 %}.
- `stdout` is now captured correctly in Windows when recording to the Dashboard. Fixes {% issue 977 %} and issue {% issue 711 %}.
- Windows now forcibly displays colors correctly to the terminal. Fixes {% issue 1127 %}.

**Misc:**

- `TTY` is now handled correctly for Linux and OSX. This means that CI providers which turned off colors due to `TTY` being false will now display colors again such as TravisCI. Fixes {% issue 1126 %}.
- We now handle `xvfb` exiting with a non zero status code and display that error to you. This should help with situations where `xvfb` is misconfigured on the system. Fixes {% issue 1113 %}.
- We've added debug output for `xvfb` when `DEBUG=cypress:xvfb` is enabled. Helpful when diagnosing problems with `xvfb`. Fixes {% issue 1128 %}.
- We've added more TypeScript documentation for `cy.*` methods. Fixes {% issue 1117 %}.
- When developing on Cypress, we now start the process through the CLI to bring it into parity with how it works when used in production. Fixes {% issue 838 %}.
- Upgraded various CLI dependencies that were flagged for security warnings. There wasn't an actual security problem - just static analyzers complaining. Fixes {% issue 1103 %}.

# 1.4.0

*Released 12/19/2017*

**Features:**

- There is now a Search Bar in the Desktop GUI that enables you to filter the list of specs. Helpful for projects with a ton of spec files. Fixes {% issue 1098 %}.

**Bugfixes:**

- The seeded `example_spec.js` file no longer fails in Windows on the {% url "`cy.exec()`" exec %} test. It now conditionally runs a command appropriate for Windows. Fixes {% issue 1097 %}.
- Trying to log in to Cypress no longer causes the app to crash. This area has had many more tests added. Fixes {% issue 1093 %}.
- Some minor improvements to TypeScript definitions around {% url "`.then()`" then %}. Fixes {% issue 1084 %}.
- The Selector Playground now works correctly in the Electron browser. Fixes {% issue 1086 %}.

# 1.3.0

*Released 12/17/2017*

**Features:**

- Plugins now emit a {% url "`before:browser:launch`" plugins-guide#Browser-Launching %} event exposing you the browser that will be launched and its launch arguments. This enables you to modify the arguments prior to launching the browser. You can also use these arguments to modify how Chrome runs and to also test Chrome extensions. Fixes {% issue 691 %} and {% issue 298 %}.
- We have launched a "CSS Selector Playground", a new UI button in the Test Runner that enables you to highlight elements in your application and receive a unique selector. You can also find elements by their text content. These mimics {% url "`cy.get()`" get %} and {% url "`cy.contains()`" contains %} behavior. Additionally you can copy the generated Cypress command to your clipboard or output the generated selector to your console. This feature is in beta. It only works in Chrome (not in Electron). We are aware of some bugs in it, but it is good enough for use and feedback. Please check out issue {% issue 917 %}, watch an animated gif demonstration, and leave any feedback you have there. Fixes {% issue 917 %}.

Documentation Changes:

- {% url 'Added `Browser Launch API`' browser-launch-api %}
- {% url 'Updated `Plugins Guide`' plugins-guide %}
- {% url 'Updated `Writing a Plugin API`' writing-a-plugin %}

# 1.2.0

*Released 12/14/2017*

**Features:**

- Plugins can now return a `Promise` and modify the yielded `config` to set new configuration values and environment variables. Fixes {% issue 1042 %} and {% issue 909 %} and {% issue 576 %}.
- There is a new {% url "`userAgent`" configuration#Browser %} option in `cypress.json`. This enables you to change the `userAgent` of the browser for the entire browsing session. Fixes {% issue 364 %}.
- There is a new {% url "`blacklistHosts`" configuration#Browser %} option in `cypress.json` that allows you to block requests made to those hosts. Blocked requests will respond with a `503` status code. This is useful for blocking 3rd party domains like Google Analytics. We have added a {% url "new recipe" recipes#Stubbing-Google-Analytics %} demonstrating this. Fixes {% issue 442 %}.
- Added chai assertions in TypeScript to generate autocompletion. Fixes {% issue 1073 %}.

**Bugfixes:**

- Updated TypeScript definitions to more accurately match the current Cypress API. Fixes {% issue 1050 %}. Also note that if you were extending Cypress in TypeScript the `Chainer` interface changed. Please read {% issue '1048#issuecomment-351891910' %} to understand what you will need to update.

**Misc:**

- Renamed `environmentVariables` to `env` in the Desktop GUI. Fixes {% issue 1052 %}.
- {% url "`Cypress.config()`" configuration#Cypress-config %} now returns a complete set of configuration values. Fixes {% issue 509 %}.
- Added TypeScript typings for bundled Cypress tools like `$`, `_`, etc. Fixes {% issue 1046 %}.
- Some error messages were made more passive. Fixes {% issue 1025 %}.

**Documentation Changes:**

- {% url 'Added `Configuration API`' configuration-api %}
- {% url 'Added `Recipes`' recipes %}
- {% url 'Updated `Configuration`' configuration %}
- {% url 'Updated `Environment Variables`' environment-variables %}
- {% url 'Updated `Using Cypress FAQ`' using-cypress-faq %}
- {% url 'Updated `Plugins Guide`' plugins-guide %}
- {% url 'Updated `Writing a Plugin API`' writing-a-plugin %}

# 1.1.4

*Released 12/6/2017*

**Bugfixes:**

- Fixed an issue causing `Chrome` to timeout when attempted to be run through our docker containers. Fixes {% issue 1031 %}.
- Several TypeScript typings were added, updated and fixed. Fixes {% issue 1006 %}.
- Using a regular `http://` URL now works when using the `CYPRESS_BINARY_VERSION` flag to point the binary at an external location. Fixes {% issue 1001 %}.
- File watching is fixed (again) when changing between specs. Fixes {% issue 1018 %}.

**Misc:**

- There is now a new {% url `CYPRESS_SKIP_BINARY_INSTALL` installing-cypress#Skipping-Installation %} flag you can pass during `npm install` which skips the binary installation after the `cypress` npm module completes its installation. Fixes {% issue 1005 %}.
- We now launch Chrome with `--no-sandbox` and `--disable-gpu` options in Linux. We will soon release a new plugin event that enables you to modify the browser arguments we use by default. This *shouldn't* cause issues with existing Linux users, and instead it should fix many CI setups that were using our Docker containers or your own home grown installed Chrome setup. Fixes {% issue 1021 %} and {% issue 1020 %}.
- Removed several aliases from our browser detector. These were not implemented properly and not needed - and thus only caused indirection. Fixes {% issue 1023 %}.

# 1.1.3

*Released 12/3/2017*

**Bugfixes:**

- JSON fixtures with unicode escape sequences are now parsed correctly. Fixes {% issue 964 %}.
- The default `browserify` plugin no longer fires `watched:file:changed` twice leading to an uncaught exception that was popping up in the console. Also fixed a minor state bug in the `browserify` package. Fixes {% issue 968 %}.
- Cypress no longer reports `Electron` as the browser that ran in the Dashboard Service when a different browser was run. Fixes {% issue 854 %}.
- Invalid cookie values no longer crash Cypress. Fixes {% issue 962 %}.

**Misc:**

- We are now bundling our own `TypeScript` definitions with the `cypress` npm module. You no longer have to install `@types/cypress` anymore. We'll continue to keep these updated with API changes. Fixes {% issue 856 %}.
- Uncaught exceptions originating from **your** application code and/or test code are now **distinctly** and **clearly** indicated in the error message. We included a link to our docs to educate you on how you can optionally disable Cypress from catching these. Fixes {% issue 825 %}.
- {% url "`cy.visit()`" visit %} now accepts `{ failOnStatusCode: false }` which enables you to visit pages that respond with a non `2xx` status code. This brings it into parity with {% url "`cy.request()`" request %}. Fixes {% issue 421 %} and {% issue 574 %}.
- The contributing Readme's have been updated and improved for each package. Fixes {% issue 995 %}.
- Added utility methods {% url "`Cypress.platform`" platform %} and {% url "`Cypress.arch`" arch %} for returning the underlying OS information. Uses node's `os` module under the hood. Fixes {% issue 824 %} and {% issue 675 %}.

**Documentation Changes:**

- {% url 'Added `Cypress.version`' version %}
- {% url 'Added `Cypress.arch`' arch %}
- {% url 'Added `Cypress.platform`' platform %}

# 1.1.2

*Released 11/26/2017*

**Bugfixes:**

- Fixed a regression caused by {% url "`.type()`" type %} adhering to `maxlength` incorrectly. Special character sequences were not respected. Now {% url "`.type()`" type %} works with special characters and implements a complete fix for `maxlength`. In addition to it working, it now fires all applicable browser events without modifying the actual input value. Fixes {% issue 955 %}.
- Errors coming from plugins now display correctly in the Test Runner. Fixes {% issue 945 %}.

**Documentation Changes:**

- {% url 'Added ESLint, Docker, and Typescript to Plugins' plugins %}
- {% url 'Added recipe for Typescript with Browserify' recipes %}
- {% url 'Added recipe for Typescript with Webpack' recipes %}
- {% url 'Added recipe for Direct Controlling AngularJS' recipes %}
- {% url 'Added recipe for E2E API Testing' recipes %}
- {% url 'Added more video tutorials' tutorials %}
- {% url 'Improved displaying list of Tutorials, Recipes, Applications, and Docker examples' recipes %}

# 1.1.1

*Released 11/20/2017*

**Bugfixes:**

- Fixed a bug swallowing plugin errors due to undefined `reject` function. Fixes {% issue 934 %}.
- {% url "`.type()`" type %} now respects the `maxlength` attribute and will not type beyond it. Fixes {% issue 928 %}.

# 1.1.0

*Released 11/19/2017*

**Summary:**

- We have officially launched the new **Plugins API** interface. This adds a `cypress/plugins/index.js` file to new and existing projects. Using this file will enable you to modify the internals of Cypress running in the background `node` process. This means you will be able to use `node` APIs that are executed outside of the browser.
- We have currently added only {% url "one event" writing-a-plugin#List-of-events %} for modifying the test file preprocessor, but this paves the way for adding many more event types. You can now modify every aspect of how files are sent to the browser.
- We have extracted the default `browserify` preprocessor into its own package - {% url `@cypress/browserify-preprocessor` https://github.com/cypress-io/cypress-browserify-preprocessor %}. This is bundled with Cypress, but it is extracted so it can be used / modified by you to change the default options we pass to `browserify`. Additionally, you can swap out this preprocessor for something else entirely.

**Features:**
- There is now a {% url "Plugins API interface" plugins-guide %}. Partially addresses {% issue 684 %}.
- We have added the first Plugin API event called: {% url "`file:preprocessor`" writing-a-plugin#List-of-events %}. Fixes {% issue 580 %} and {% issue 581 %}.
- You can now customize the default babel configuration options for the `browserify` preprocessor. Fixes {% issue 343 %} and {% issue 905 %}.
- CoffeeScript 2 is supported via modifying the default options for the `browserify` preprocessor. Fixes {% issue 663 %}.
- You can swap out or extend the default preprocessor to do exotic things like compile ClojureScript into JavaScript. Fixes {% issue 533 %}.
- We have created a {% url `@cypress/webpack-preprocessor` https://github.com/cypress-io/cypress-webpack-preprocessor %} preprocessor NPM package for you webpack users (because we are nice ￰ﾟﾘﾉ). Fixes {% issue 676 %}.

**Bugfixes:**

- {% url "`cy.contains(selector, regexp)`" contains %} now works as intended. Fixes {% issue 801 %}.
- We no longer format fixtures in any capacity. This fixes a bug with improperly formatting fixtures in Windows. You should handle formatting fixtures yourself. Fixes {% issue 884 %} and {% issue 902 %}.
- {% url "`cy.viewport()`" viewport %} resolves if only width or only height changes. Fixes {% issue 873 %}.
- Cypress now auto reloads when spec files are modified in Windows. Fixes {% issue 712 %}.

**Misc:**

- There is a new `--global` option useful with {% url "`cypress open`" command-line#cypress-open %} to force Cypress to open in global mode. This is helpful when you have multiple nested Cypress projects but only want to install Cypress once in the root project. Fixes {% issue 889 %}.
- The {% url "module API" module-api %} accepts `reporterOptions` as an object literal like it does for the `env` and `config` properties. Fixes {% issue 899 %}.

**Documentation Changes:**

- {% url 'Created "Testing React TodoMVC" tutorials' tutorials %}
- {% url 'Created "Variables and Aliases" core concept' variables-and-aliases %}
- {% url 'Created "Conditional Testing" core concept' conditional-testing %}
- {% url 'Created "Plugins" guide' plugins-guide %}
- {% url 'Created "List of Plugins"' plugins %}
- {% url 'Created "Writing a Plugin" API' writing-a-plugin %}
- {% url 'Created "Preprocessors API"' preprocessors-api %}
- {% url 'Updated "Using Cypress FAQ"' using-cypress-faq %}
- {% url 'Updated "Best Practices"' best-practices %}

# 1.0.3

*Released 10/29/2017*

**Features:**

- The Test Runner now enables you to collapse folders when displaying a list of specs. Fixes {% issue 760 %}. Contributed by {% user metcorne %}.

**Bugfixes**

- The `onChange` event callback for React now works (again) on `input` type `number` or `email`. Fixes {% issue 816 %} and {% issue 770 %}.
- Fixed error when recording and failing to parse the git commit message. Fixes {% issue 847 %} and {% issue 841 %}.
- Using a single space on: `cy.type(' ')` now works. Fixes {% issue 807 %}. Contributed by {% user tejasbubane %}.
- `cy.spread()` can now be used on a collection of DOM elements. Fixes {% issue 735 %}. Contributed by {% user verheyenkoen %}.
- CLI shows help message when it is invoked with an unknown command like `$(npm bin)/cypress foo`. Fixes {% issue 641 %}.

**Misc:**

- Enable passing `CYPRESS_RECORD_KEY` without using the CLI by invoking the binary directly. Fixes {% issue 820 %}.
- Cypress binaries can now be pointed to a staging environment with `CYPRESS_ENV=staging`. Fixes {% issue 813 %}.
- The Test Runner displays the scrollbar correctly when the update banner is displayed. Fixes {% issue 803 %}.
- The branch name is now properly collected when recording in Buildkite CI. Fixes {% issue 777 %}.
- You can install the Cypress binary from any URL or file path using the {% url "`CYPRESS_BINARY_VERSION` environment variable" installing-cypress#Advanced %}. Closes {% issue 701 %}.

**Documentation Changes:**

- {% url 'Created "Conditional Testing" core concept' conditional-testing %}
- {% url 'Created "Key Differences" core concept' key-differences %}
- {% url 'Updated "Best Practices"' best-practices %}
- {% url 'Updated "FAQ Usage"' using-cypress-faq %}

# 1.0.2

*Released 10/13/2017*

**Bugfixes:**

- `cy.type` now correctly fires change events on React 16. Fixes {% issue 647 %}.
- Fixed some problems serializing objects during domain change caused by circular references. In this case `zone.js` was the culprit. Fixes {% issue 741 %}. Contributed by {% user MariMax %}.

**Misc:**

- `cy.scrollTo` now logs its coordinates when options are used. Fixes {% issue 725 %}. Contributed by {% user sirugh %}.
- You can now use environment variables that have a `=` character as values. Fixes {% issue 620 %}. Contributed by {% user HugoGiraudel %}.
- There is now a new `videoUploadOnPasses` configuration option in `cypress.json`. Turning this off will only compress and upload videos on failures. This only affects projects which are setup to record to the Dashboard. Fixes {% issue 460 %}. Contributed by {% user carlos-granados %}.

**Documentation Changes:**

- {% url 'Added examples for "Catalog of Events"' catalog-of-events %}
- {% url 'Added / Updated FAQ for "Using Cypress"' using-cypress-faq %}

# 1.0.1

*Released 10/10/2017*

**Bugfixes:**

- Prevent error during verification in the CLI on Linux / OSX. Also makes terminal colors work again. Fixes {% issue 717 %} and {% issue 718 %}.

# 1.0.0

*Released 10/09/2017*

**Summary:**

- `1.0.0` marks our transition out of a **private** beta and into a **public** beta. We've lifted all the restrictions for using Cypress. It is now accessible to everyone. Until we are out of beta, the {% url "Dashboard Service" dashboard-service %} will continue to be free.
- We will continue to follow `semver` from this point on (and also a bit more rigorously).
- Cypress is now {% url "open source" https://github.com/cypress-io/cypress %}! This project is licensed under the terms of the {% url "MIT License" https://github.com/cypress-io/cypress/blob/develop/LICENSE.md %}.
- We have a {% url "Contributing Guideline" https://on.cypress.io/contributing %} to help contributors get started as well as {% url "issues labeled `first-timers-only`" https://github.com/cypress-io/cypress/labels/first-timers-only %} for those wanting to contribute right away.
- You can now use the Test Runner application without logging in. Some areas of the application still require logging in through GitHub, like the 'Runs' tab and viewing the project's 'Record Key'. The only places where login is required is when it interacts with our external servers. Naturally these places are optional and will not affect the local test writing + running experience.
- We've removed the requirement of filling out an early adopter form and approval for logging in with GitHub to Cypress.
- {% url "www.cypress.io" https://www.cypress.io %} has an all new design to help new visitors get started quickly and understand our future pricing more clearly.
- We are still updating the docs to reflect the `1.0.0` release.

**Features:**

- Windows is now supported. We have been running it successfully on EC2 and all of our example projects are also running in CI with Appveyor. It is still super beta (we're aware of a couple issues already) and we're still updating our own infrastructure to manage and test it as comprehensively as we do OSX and Linux. We are only building a 32bit version of Windows, but will soon be building a 64bit as well. As of today the Windows binary is about 2x the size of what it will be. Unzipping takes a long time, we are sorry. Fixes {% issue 74 %} and {% issue 444 %}.

**Misc:**

- Added the `Beta` flag everywhere (since we are still technically in beta).
- Reduced the frequency the app checked for updates. Fixes {% issue 713 %}.
- The CLI now sends `arch` parameter to the download server so we can build and serve multiple binaries for Windows + Linux.

**Documentation Changes:**

- {% url 'Updated "Installing Cypress"' installing-cypress %}
- {% url 'Updated "Writing your First Test"' writing-your-first-test %}
- Added a 10 minute Getting Started video that {% url 'Andrew Van Slaars' https://github.com/avanslaars %} created.

# 0.20.3

*Released 10/06/2017*

- Improved verifying the binary for the first time after an `npm install`. Fixes {% issue 709 %}.

# 0.20.2

*Released 10/06/2017*

**Possibly Breaking Changes:**

- {% url "`cy.exec()`" exec %} now trims output by default. That means if you were using an `eq` assertion the output will no longer have a trailing newline character `\n`. It's unlikely you are doing this, but it is possible you may need to update your assertions to remove this character. Fixes {% issue 697 %}.

**Bugfixes:**

- Handle errors gracefully when Electron window has been closed before paint events happen. Fixes {% issue 705 %}.
- Basic auth now works *again*. Fixes {% issue 573 %}.
- {% url "`cy.exec()`" exec %} now properly sources each time it is invoked instead of only once. Fixes {% issue 694 %}.

**Misc:**

- `cypress open` now accepts the `--project` flag which enables you to use a root level Cypress installation and point to multiple sub projects. Fixes {% issue 661 %}.
- Prevent newer versions of Chrome from prompting you to save passwords and suppressed other extension related popups for Windows. Fixes {% issue 704 %}.

# 0.20.1

*Released 09/17/2017*

**Features:**

- `cypress run` now supports a `--headed` option so the Electron browser will display instead of running headlessly. This matches what you can already do in the GUI. Fixes {% issue 657 %}.

**Bugfixes:**

- Using Cypress on nested projects now correctly works. Fixes {% issue 635 %}.
- Using `cy.type` on Angular 2 apps now works. We're now firing the `key` property when typing. We've properly mapped all the special keys too.
- `onBeforeLoad` now gets invoked when overriding `cy.visit`. Fixes {% issue 656 %} and {% issue 640 %}.
- Using multiple `cy.visit` back to back which only change the `hash` now properly wait for the `hashchange` event to occur before moving on. Fixes {% issue 652 %}.
- CLI now displays the correct overridden `CYPRESS_BINARY_VERSION` on first open. Fixes {% issue 659 %}.
- Fixed the incorrectly spelled chainer `descendents`. It is now correctly spelled as `descendants`. Fixes {% issue 642 %}.
- The visibility algorithm has been considerably improved. Should fix most if not all visibility problems. We accounted for CSS transforms, translations, and added a new branch of logic for `position: fixed` elements which should be much more accurate. Fixes {% issue 631 %}.
- The CLI now treats `-h` and `--help` and `help` as valid commands. Fixes {% issue 645 %}.

**Misc:**

- You can now pass an object literal as `config` when using Cypress as a node module. Fixes {% issue 639 %}.
- Passing `--reporter` can now reference an absolute path instead of just relative. Fixes {% issue 658 %}.
- The algorithm that ensures an element is not covered now calculates this at the center coordinates instead of the top left. This should yield more accurate results, be closer to the default expectations of users, and bypass fractional pixel problems we were having. Fixes {% issue 655 %}.
- Improved crash reporting when the binary throws an uncaught error.

**Documentation Changes:**

- {% url 'Updated "Command Line"' command-line %}
- {% url 'Updated "Interacting with Elements"' interacting-with-elements %}

# 0.20.0

*Released 09/10/2017*

**Summary:**

- `0.20.0` is our biggest technical release ever. It accounts for more than 2,000 commits. It's full of breaking changes we wanted to land prior to having our public `1.0.0` release.
- You can now {% url "install Cypress as a real `npm` module" installing-cypress %}, and even `require` it in your node files.
- We rewrote the entire driver (we've all been there) and converted all 2,500+ tests to be run within Cypress itself.

**CLI Changes:**

- You now use `npm` to manage Cypress versions like every other dev dependency.
- Running `npm install --save-dev cypress` will automatically download the CLI + binary.
- There is no longer a separate `cypress install` step, but this command still exists if you want to **reinstall** the binary for whatever reason.
- No need to use `cypress-cli` anymore to manage Cypress versions. **You will need to uninstall the `cypress-cli` by running `npm uninstall -g cypress-cli`**.
- The {% url "`cypress` module can be `required`" module-api %} in your own node projects to programmatically control Cypress the same way you would from the command line.
- We've updated the installation experience to account for running locally and in CI so it doesn't generate a ton of logs in `stdout`.
- The `CYPRESS_VERSION` environment variable is gone because now the version of the binary is controlled by the npm module version. If for some reason you want to download the binary of a different version you can use the new `CYPRESS_BINARY_VERSION` environment variable - but you'll get a warning message when the versions don't match.
- If you install cypress globally using `npm install -g cypress` we will warn you that you should check this in as a `devDependency` but Cypress will continue to work in "global mode".
- Cypress now verifies it can run on your system prior to actually running. It'll do this for each new version the first time you try to use it. Errors it receives from attempting to run will bubble up nicely, so you'll get output for things like {% url "missing linux dependencies" continuous-integration#Dependencies %} instead of absolutely *nothing* like before.
- We have better error handling and messaging around `Xvfb` failures.
- There is a new {% url "`--browser` option" command-line#cypress-run %} that lets you change the browser that runs from the command line. This works the same way as changing the browser in the GUI, with the exception that any browser other than the default `electron` browser will **not** record a video. This is solvable but requires more work.
- Whenever you encounter errors in the CLI we'll output helpful debugging information at the bottom of each error.
- You can use the new environment variable {% url "`DEBUG=cypress:cli`" command-line#Debugging-Commands %} to see debugging output from the CLI.

**Breaking Changes:**

- We've removed the undocumented `cy.chain()` command. You should be able to safely remove this from your code. Fixes {% issue 456 %}.
- Updated {% url "`Cypress._`" _ %} to use {% url "lodash" https://lodash.com %} instead of {% url "Underscore" http://underscorejs.org %}. Fixes {% issue 548 %}.
- If any of an element's parent's overflow is 'hidden', we now calculate if the element is outside of the boundaries of that parent element and validate visibility assertions accordingly. This may cause some tests that were previously passing to now accurately fail. Fixes {% issue 410 %}.
- {% url `.select()` select %} should now look for the trimmed value inside of an `<option></option>`. This may change the content argument required to select the option you intended in your {% url `.select()` select %} command. Fixes {% issue 175 %}.
- When passing the option `{ force: true }` to {% url `.click()` click %} and {% url `.type()` type %}, we no longer attempt to scroll the element into view. We've also disabled the check that the element is in view before clicking or typing. Fixes {% issue 553 %} and {% issue 537 %}.
- `Cypress.Dom` has been renamed to `Cypress.dom`.
- `Cypress.Log.command` has been renamed to {% url "`Cypress.log`" cypress-log %}.
- {% url "`chai-jQuery` assertions" assertions#Chai-jQuery %} no longer change the subject when using `prop`, `attr`, and `css` with the **3rd** argument (which acts as equality check). Fixes {% issue 605 %}.
- We now throw when a value other than `cy` is returned from a test or command function. Fixes {% issue 463 %}.
- Returning a promise in a custom command while also invoking cy commands now throws. Fixes {% issue 435 %}.
- {% url "`cy.then()`" then %} will now only pass its subject through when its callback function returns `undefined`. Previous it would pass the subject on `null` values as well.
- {% url "`cy.contains()`" contains %} can no longer be chained on subjects which aren't `window`, `document` or `element`. This brings it into parity with the new custom command rules and makes it much less "magical". It enforces you to use it in a much clearer way when querying the entire document.
- Removed `Cypress.addParentCommand()`, `Cypress.addChildCommand()`, and `Cypress.addDualCommand()` in favor of the {% url "new custom command interface" custom-commands %}.

**Features:**

- {% url "`chai-jQuery` assertions" assertions#Chai-jQuery %} have improved error messaging, and have had their internal double assertions removed, and can now be made on raw DOM objects. Fixes {% issue 605 %}.
- {% url "`chai-jQuery` assertions" assertions#Chai-jQuery %} now throw a nice error message when you're asserting on a non DOM object. Fixes {% issue 604 %}.
- New {% url "`.trigger()`" trigger %} command. Useful for triggering arbitrary events. Fixes {% issue 406 %}.
- New {% url "`cy.scrollTo()`" scrollto %} command. Useful for having a container scroll to a specific position. Fixes {% issue 497 %} & {% issue 313 %}.
- New {% url "`.scrollIntoView()`" scrollintoview %} command. Useful for scrolling an element into view. Fixes {% issue 498 %} & {% issue 313 %} & {% issue 519 %}.
- Input ranges are now more easily testable using the new {% url "`.trigger()`" trigger %} command. See our {% url "new recipe" recipes#Form-Interactions %} for details on how. Fixes {% issue 287 %}.
- Testing drag and drop is now possible using the new {% url "`.trigger()`" trigger %} command. See our {% url "new recipe" recipes#Form-Interactions %} for details on how. Fixes {% issue 386 %}.
- Updated {% url "`.click()`" click %} command to accept more position arguments. Fixes {% issue 499 %}.
- Added support to {% url `.type()` type %} for inputs of type `date`, `time`, `month`, and `week`. Fixes {% issue 27 %}.
- You can now pass a browser option to {% url "`cypress run`" command-line#cypress-run %} as `--browser <browser name>`. This enables you to run the same set of browsers when running from the CLI as when you're running from the GUI. Fixes {% issue 462 %} and {% issue 531 %}.
- {% url "`cypress open`" command-line#cypress-open %} no longer opens a detached process by default. Instead `cypress open` now accepts a new flag `--detached`, which replicates this behavior. Fixes {% issue 531 %}.
- We have all new {% url "docker examples" docker %} you can check out.
- The {% url "`cypress` npm package" https://www.npmjs.com/package/cypress %} now checks the currently installed version on `install` and {% url "`run`" command-line#cypress-run %} and does not re-install Cypress if it is already installed. Fixes {% issue 396 %}.
- We've added a new {% url "`Cypress.Commands`" custom-commands %} interface to handle adding your own custom commands. Fixes {% issue 436 %}.
- You can now overwrite existing commands with {% url "`Cypress.Commands.overwrite`" custom-commands %}. <OPEN A NEW ISSUE>
- We removed an artificial delay that was being set in between commands. This means test commands now run faster.
- You can now {% url "disable Cypress global exception handlers" catalog-of-events %} for your application. Fixes {% issue 254 %}
- Uncaught errors appearing in your spec files or support files are now properly caught, have the right exit code, and display correctly. Fixes {% issue 345 %}
- Cypress will now scroll past multiple elements that cover up an element to be interacted with. It also now factors in elements with `position: sticky`. Fixes {% issue 571 %} and {% issue 565 %}.
- Cypress now scrolls all parent containers (not just `window`) when attempting to {% url "check an element's actionability" interacting-with-elements#Actionability %}. Fixes {% issue 569 %}.
- Using {% url "Chai.js's `assert` interface" assertions#TDD-Assertions %}  now works correctly in your specs. <OPEN AN ISSUE>
- Screenshots are now taken during each runnable that fails. Errors in tests will happen there. Errors in hooks will also happen there. Previously a screenshot would only happen after everything (including hooks) ran. Fixes {% issue 394 %}
- {% url "`cy.screenshot()`" screenshot %} now synchronizes its state with the reporter. This means you should see error messages (on the left side) on automatic screenshot errors.
- Using mocha's async `done` callback now works properly.
- You can now programmatically {% url "intercept and potentially turn off uncaught application errors" catalog-of-events %} from failing your tests.
- You can now programmatically control whether you accept or cancel {% url "`window.confirm()`" catalog-of-events %} calls from your application.

**Dependencies:**

- Updated {% url "`Cypress.Promise`" promise %} (which is Bluebird) from version `2.9.25` to `3.5.0`
- Updated {% url "`chai`" bundled-tools#Chai %} from version `1.9.2` to `3.5.0`
- Updated {% url "`sinon`" bundled-tools#Sinon %} from version `1.x` to `3.2.0`
- Updated {% url "`jQuery`" $ %} from version `2.1.4` to `2.2.4`.
- Removed {% url "`chai-jQuery`" bundled-tools#Chai-jQuery %} and rewrote it from scratch.

**Deprecations:**

- The {% url "`cypress-cli` npm package" https://www.npmjs.com/package/cypress-cli %} has been deprecated. Fixes {% issue 316 %}.
- The interface for writing custom commands has been deprecated. {% url "Please read our docs on the new custom commands interface" custom-commands %}. Fixes {% issue 436 %} and {% issue 465 %}.
- There are no more global, in-app updates. Versioning should be primarily {% url "controlled via `npm`" installing-cypress %} like every other package / dependency in your project. For users not using `npm` you can manually download new versions of Cypress when they're released. <OPEN A NEW ISSUE>

**Bugfixes:**

- Fixed busted internal timers that caused random timeouts, proxy errors, incorrect delays, and long pauses when loading the GUI. Fixes {% issue 572 %}.
- {% url "`cy.route()`" route %} now matches requests opened with lowercase methods. Fixes {% issue 607 %}.
- Fixed regression where multiple uses of {% url `cy.server()` server %} in a `before` hook was throwing an error. Fixes {% issue 80 %} and {% issue 510 %} and {% issue 595 %}.
- When editing `cypress.json` file, the dead browser page no longer appears. Fixes {% issue 492 %}.
- {% url `.type()` type %} should now work on inputs regardless of capitalization of `type` attribute. Fixes {% issue 550 %}.
- Fixed issues where {% url `.type()` type %} was not appending text properly. Fixes {% issue 503 %} and {% issue 568 %}.
- Fixed issue where {% url `.type()` type %} with `type="email"` inputs were throwing an error. Fixes {% issue 504 %}.
- Fixed issue where using {% url `.type()` type %} on an input with a `type` defined in uppercase (`input type="TEXT"`) would throw an error and not type. Fixes {% issue 550 %}.
- Fixed issue with {% url "`.clear()`" clear %} and `type="number"` inputs. Fixes {% issue 490 %}.
- Fixed issue where {% url `cy.exec()` exec %} was failing when running Cypress in docker. Fixes {% issue 517 %}.
- Cypress CLI no longer requires `git` to install. Fixes {% issue 124 %}
- Improved the reporter's responsive design so controls still show at narrower widths. Fixes {% issue 544 %}.
- Commands text will no long cut off into ellipses when the Command Log is set to a wider width. Fixes {% issue 528 %}.
- Fixed issue where setting `fixturesFolder` to `false` would throw an error. Fixes {% issue 450 %}.
- Fixed issue where Cypress hanged due to `Xvfb` permissions. More intuitive output is given during install failures. Fixes {% issue 330 %}.
- {% url "The checks used to determine an element's actionability" interacting-with-elements#Actionability %} are now run synchronously. This solves some circumstances where the element could have moved or otherwise change between the checks. Fixes {% issue 570 %}.
- Fixed issue where clipped elements with `overflow-y: hidden` were falsely passing as "visible". Fixes {% issue 563 %}.
- When using {% url `.select()` select %} on a select with multiple options with the same value, we now properly set `selectedIndex` and `selectedOptions` on the `select`. Fixes {% issue 554 %}.
- Fixed issue where changing any spec file (renaming, adding, deleting) would remove the highlighted styling of the currently active spec file in the Test Runner. Fixes {% issue 547 %}.
- We now get the absolute paths of styles to use when displaying snapshots. This will fix situations where some stylesheets were improperly referenced during the snapshot, so did not display styles correctly. Fixes {% issue 525 %}.
- Fixed issue where commands would retry and potentially exceed their timeout values during page transitions. Fixes {% issue 594 %}
- Fixed issue where server routes were lost after page load if not initiated by a {% url `cy.visit()` visit %} command. Fixes {% issue 177 %}
- Using mocha's `done` callback now works correctly. We've improved mocha's handling of uncaught exceptions and properly associate them to test failures. <OPEN AN ISSUE>
- {% url "`cy.viewport()`" viewport %} is now synchronized with the UI so that it does not resolve until the DOM has re-rendered using the dimensions.
- "outer assertions" now are correctly retried by previous commands. Fixes {% issue 543 %}.
- The example_spec from the {% url "kitchen-sink" https://github.com/cypress-io/cypress-example-kitchensink %} will never accidentally be seeded when running {% url "`cypress run`" command-line#cypress-run %} on a brand new project.

**Misc:**

- We now display a warning in the console when returning a promise from a test and also invoking a Promise or cy commands. Fixes {% issue 464 %}.
- Reduced the number of internal Cypress network requests in the "Network Panel" of Dev Tools. Fixes {% issue 606 %}.
- We've moved our entire codebase into one into a private "Monorepo". This is in anticipation for going open source (making the GitHub repo public) and should make it easier for everyone to contribute to our code. Fixes {% issue 256 %}.
- When element's are not visible due to being covered by another element, the error message now says what element is covering what element. {% issue 611 %}
- Improved the calculations to calculate an elements visibility. Additionally updated error messages to be clearer whenever an element isn't considered visible. Fixes {% issue 613 %}
- The "Can't start server" error displayed in the Desktop-GUI no longer prevents you from interacting in the Desktop App. It now displays as a warning. Fixes {% issue 407 %}.
- {% url `cy.focused()` focused %} now automatically retries until the element exists in the DOM. This makes it behave the same as {% url "`cy.get()`" get %} Fixes {% issue 564 %} and {% issue 409 %}.
- We now support per-project `state.json`. Fixes {% issue 512 %}.
- We can now handle multiple projects per server. Fixes {% issue 512 %}.
- The Test Runner can now have projects added by being 'dragged' in. Fixes <OPEN A NEW ISSUE>.
- The Test Runner update window now has messaging about `package.json` versioning. Fixes {% issue 513 %}.
- The Test Runner now accounts for cypress being installed per project as npm module. Fixes {% issue 500 %} and {% issue 514 %}.
- {% url "`cypress install`" command-line %} `-d` option. Fixes {% issue 389 %}.
- Exposing Cypress Binary should no longer be necessary when cypress is locally installed. Fixes {% issue 379 %}.
- Added an 'App Data' option in the Desktop App that displays app data. Fixes {% issue 475 %}.
- When {% url `cy.spy()` spy %} or {% url `cy.stub()` stub %} are never called, the error now displays a clearer, grammatically correct error. Fixes {% issue 520 %}.
- Detection of installed browsers has been improved. Fixes {% issue 511 %}.
- When commands are clicked on and logged into the console from the Command Log, they now display their 'yield' instead of 'return', since they really yield instead of return. {% issue 612 %}
- The build process of the driver has been modernized. Fixes {% issue 429 %}.
- XHR's from your application are no longer forcefully aborted between tests. <OPEN A NEW ISSUE>
- Better error handling when running commands outside of a test. <OPEN A NEW ISSUE>
- URL changes from navigation events or hashchanges now display more accurately. <OPEN A NEW ISSUE>
- {% url "`cy.go()`" go %} now snapshots before and after the navigation event. <OPEN A NEW ISSUE>
- Page load events no longer forcibly `null` out the current subject. This was very unexpected and difficult to debug. Now stale elements or other objects from previous pages are yielded to you.
- Using an array of the same alias in a {% url "`cy.wait()`" wait %} now yields you those XHR's in the order they were requested. Previously it was based on when the responses were returned.
- Returning `null` from a {% url "`.then()`" then %} will now change the subject to that. Previously returning `null` would not cause subject changes.
- We now no longer remove spies, stubs, or routes at the end of the very last test. This enables you to continue to manually use your app and have Cypress continue to instrument it.
- Updated a few things to more aggressively cause GC.
- Onboarding dialogs will never show up again once they are dismissed. Fixes {% issue 522 %}.
- `window.alert()` and `window.confirm()` now generate a page event in the Command Log (including the message).
- {% url `cy.spy()` spy %} and {% url `cy.stub()` stub %} now have a `.log(bool)` method to disable their calls from generating a Command Log. Useful when your spies or stubs are called an excessive number of times.
- Improved command subject validation error messages.
- Improved the element detachment error messages (when you try to interact with an element that's become stale / detached from the document).
- We finally have *partial* iframe support. You can at least now {% url "`cy.wrap()`" wrap %} iframe elements and interact with them using Cypress commands. More work needs to be done to "switch into" and back "out of" iframes. But we're getting there.
- Scaffolding new projects no longer generates a `default.js` file.
- Scaffolded `index.js` and `commands.js` have had their content updated to point to the custom commands API.
- You can now call {% url "`.focus()`" focus %} and {% url "`.blur()`" blur %} on {% url "`cy.window()`" window %}.
- The `CYPRESS_DEBUG` env option has been removed in favor of the `debug` module and {% url "`DEBUG=cypress:*`" command-line#Debugging-Commands %} usage.
- Attempting to run {% url "`cypress run`" command-line#cypress-run %} on a project without a `cypress.json` now errors instead of scaffolding and running the kitchen sink.

**Documentation Changes:**

Note: we are still updating all of the docs to reflect all the 0.20.0 changes.

- {% url 'New "Catalog of Events"' catalog-of-events %}
- {% url 'New "Cypress.Commands"' custom-commands %}
- {% url 'New "Cypress.log"' cypress-log %}
- {% url 'New ".trigger()"' trigger %}
- {% url 'New "cy.scrollTo()"' scrollto %}
- {% url 'New ".scrollIntoView()"' scrollintoview %}
- {% url 'Updated "Installing Cypress"' installing-cypress %}
- {% url 'Updated "Writing Your First Test"' writing-your-first-test %}
- {% url 'Updated "Testing Your App"' testing-your-app %}
- {% url 'Updated "Command Line"' command-line %}
- {% url 'Updated "Debugging"' debugging %}
- {% url 'Updated "Assertions"' assertions %}
- {% url 'Updated "Interacting with Elements"' interacting-with-elements %}

# 0.19.4

*Released 06/18/2017*

**Bugfixes:**

Fixed {% url "`.type()`" type %} not firing `input` event for {% url "React" https://reactjs.org/ %} on versions 15.6.x. Fixes {% issue 536 '#536' %}.


# 0.19.3

*Released 06/14/2017*

**Bugfixes:**

- Server's that send `Content-Encoding: br` no longer cause Cypress to fail due to incorrect decoding. Cypress now strips encodings it cannot accept. Fixes {% issue 535 '#535' %}.

# 0.19.2

*Released 04/16/2017*

**Features:**

- You can now run your tests in the {% url 'Electron browser' launching-browsers#Electron-Browser %} that comes built with Cypress. You will see it as an option in the browser dropdown. This is the same browser that Cypress uses when running `cypress run`. This is useful for debugging issues that only occur during headless runs. Addresses {% issue 452 '#452' %}.
- New traversal commands {% url `.nextAll()` nextall %}, {% url `.nextUntil()` nextuntil %}, {% url `.parentsUntil()` parentsuntil %}, {% url `.prevAll()` prevall %}, and {% url `.prevUntil()` prevuntil %} have been added. Addresses {% issue 432 '#432' %}.

**Bugfixes:**

- An error is now thrown if an `undefined` value is mistakenly passed into {% url `cy.wait()` wait %}. Previously, it would set the command timeout to an unimaginably large number of ms. Fixes {% issue 332 '#332' %}
- Fixed issue where the contents of `state.json` were emptied, which would cause a crash and loss of state information. Fixes {% issue 473 '#473' %} and {% issue 474 '#474' %}.
- We no longer write the chrome extension within `node_modules`, and instead write this to the proper OS specific `appData` folder. Fixes {% issue 245 '#245' %} and {% issue 290 '#290' %}.

**Misc:**

- Error handling for invalid arguments passed to {% url `cy.wait()` wait %} have been improved and will now suggest valid arguments that are acceptable.
- Browsers in the browser dropdown now have colored icons, which help visually distinguish the variants of Chrome.
- Increased timeout for browser to make a connection when running during `cypress run` from 10 seconds to 30 seconds.
- Internally refactored how browsers are added and spawned in preparation of us adding cross browser support.
- Switching specs in the GUI now closes the browser and respawns it and refocuses it.

# 0.19.1

*Released 03/09/2017*

**Features:**

- Added `Cypress.version` property. Fixes {% issue 404 '#404' %}.
- Selecting `<option>` inside `<optgroup>` now works with {% url `.select()` select %}. Fixes {% issue 367 '#367' %}.

**Bugfixes:**

- `EMFILE` errors have been fixed. These were being caused due to `ulimit` being too low on your OS. This should fix the file watching problems people were having. Essentially we just replaced `fs` with `graceful-fs` and crossed our fingers this works. (It did on our machines). Fixes {% issue 369 '#369' %}.
- Now you can select the error text in the GUI. Fixes {% issue 344 '#344' %}.
- Cypress now correctly re-bundles files even when `watchForFileChanges` is set to `false`. Fixes {% issue 446 '#446' %} and {% issue 347 '#347' %}.
- Fixed file watching when changing the `integrationFolder` to something other than the default value. Fixes {% issue 438 '#438' %}.
- {% url `.select()` select %} now works on options that have the same value. Fixes {% issue 441 '#441' %}.
- Cypress no longer crashes when you click links in the on-boarding screen called "To help you get started...". Fixes {% issue 227 '#227' %}.
- The `example_spec.js` file that gets seeded on a new project no longer fails on {% url `cy.readFile()` readfile %}. Fixes {% issue 414 '#414' %}.

**Misc:**

- We now preserve the Test Runner's position and sizing after it's closed + reopened. Fixes {% issue 443 '#443' %}.
- We now ignore watching `node_modules`, `bower_components` and a few other folders to reduce the number of watched files. Fixes {% issue 437 '#437' %}.

# 0.19.0

*Released 02/11/2017*

**Notes:**

- We have updated all of the docs related to these changes. The {% url 'CI Docs' continuous-integration %} got a much needed facelift.
- There is a new docs section related to the {% url 'Dashboard' dashboard-service %} and the new features.

**Overview:**

- We have officially released our {% url 'Dashboard' https://on.cypress.io/dashboard %} which is our service that will display recorded runs.
- This service has now been fully integrated into the Desktop Application. There is a new on-boarding process that helps you setup projects for recording.

**Breaking Changes:**

- We have done our very best to create as little breaking changes as possible.
- You will need to download a new {% url 'cypress-cli' command-line %} - version `0.13.1`.
- Older CLI versions will continue to work on `0.19.0` except for the {% url '`cypress open`' command-line#cypress-open %} command - and will we print a warning to nudge you to upgrade.
- Newer CLI versions will not work on versions of Cypress < `0.19.0` (but we don't know why this would ever even happen).

**Features:**

- There is a new {% url 'Dashboard' https://on.cypress.io/dashboard %} service that displays your recorded runs.
- The {% url 'Dashboard' https://on.cypress.io/dashboard %} enables you to view your recorded runs, manage projects, create organizations, invite users and set permissions.
- Projects are either **public** with their runs being publicly viewable by anyone, or **private** which restricts their access to only users you've invited. All **existing** projects were set to **private** by default.
- When you invite users (from the Dashboard) we will **automatically** whitelist them. This means you can invite all of your teammates (or anyone else). They can start using Cypress without talking to us.
- We now list all of the recorded runs directly in the Test Runner under a new `Runs` tab. Fixes {% issue 236 '#236' %}.
- Your list of projects in the Test Runner now displays their last recorded run status - passing, failing, pending, running, etc.
- We've changed the "Config" tab to now be called "Settings". We added two new sections to the "Settings" tab which displays your `projectId` and your Record Key. These sections do a much better job explaining what these are and how you use them.
- You no longer have to use `cypress get:key` to get your Record Key. We now display this in your "Settings" tab and also in the {% url 'Dashboard' https://on.cypress.io/dashboard %}.
- Projects will no longer automatically acquire a `projectId` when being added. There is now a very explicit **opt-in** process where you setup your project to record. This should make it much clearer what's going on behind the scenes.
- {% url '`cypress run`' command-line#cypress-run %} now behaves likes `cypress ci` previously did and downloads + installs Cypress if it's not already installed.
- `cypress ci` now works in OSX, and also works in Linux in Desktop flavors (like Ubuntu).

**Misc:**

- {% url '`cypress run`' command-line#cypress-run %} will now download and install Cypress if its not already installed.
- We renamed `CYPRESS_CI_KEY` TO `CYPRESS_RECORD_KEY`. This makes it clearer what this key actually does - and the fact that it can be run anywhere irrespective of CI. We still look for the old named key but will print a warning if we detect it.
- We print a warning when using an older CLI tool version. Fixes {% issue 424 '#424' %}.
- We've improved many of the error messages related to recording runs. Fixes {% issue 423 '#423' %}.
- `cypress ci` has been deprecated. You now use {% url '`cypress run --record --key <record_key>`' command-line#cypress-run %}. The key you used to pass to `cypress ci` is the same key. We've simply consolidated these commands into just {% url '`cypress run`' command-line#cypress-run %} which makes it simpler and clearer. Their only difference is that passing `--record` to {% url '`cypress run`' command-line#cypress-run %} will **record** the build to our Dashboard. Fixes {% issue 417 '#417' %}.

# 0.18.8

*Released 02/05/2017*

**Overview:**

- We have officially implemented our [Sinon.JS](http://sinonjs.org/) integration: adding {% url `cy.stub()` stub %}, {% url `cy.spy()` spy %}, {% url `cy.clock()` clock %}, and {% url `cy.tick()` tick %}. We've matched Sinon's APIs and added `sinon-as-promised` and `chai-sinon`. In addition we've fixed Sinon performance issues, and improved the display of assertion passes and failures.
- These new APIs will work well in both `unit` tests and `integration` tests.

**Features:**

- You can now use {% url `cy.stub()` stub %} and {% url `cy.spy()` spy %} synchronously. These both match the Sinon API identically. We will display `stub/spy` calls in the command log and provide the call count, arguments, context, and return values when you click on the log. Stubs are automatically reset between tests.  Fixes {% issue 377 '#377' %}.
- We've added our own special aliasing flavor to {% url `cy.stub()` stub %} and {% url `cy.spy()` spy %}. You can use the {% url `.as()` as %} command and we will associate spy and stub invocations (the same way we do with XHR aliasing and route matching).
- We've added {% url `cy.clock()` clock %} and {% url `cy.tick()` tick %} which are both asynchronous methods to modify timers in your application under test. We automatically apply clock (even if you invoke it before your first {% url `cy.visit()` visit %}) and will automatically reapply it after page load. {% url `cy.tick()` tick %} will enable you to control the amount of time you want passed in your application. This is great for controlling *throttled* or *debounced* functions.
- `sinon-as-promised` is automatically applied under the hood which extends Sinon and provides the `.resolves(...)` and `.rejects(...)` APIs which makes it easy to stub promise returning functions.
- We support and display multiple sub spies when using Sinon's `.withArgs(...)` function.

**Misc:**

- We've enhanced `chai-sinon` by improving the output during passes or failures. Fixes {% issue 31 '#31' %}.
- We've ripped out Sinon's argument serialization in favor of our own.
- We no longer send Sinon to the remote application under test. In other words, you'll no longer see `sinon.js` being sent as a network request.
- Deprecated the undocumented `cy.agents` function, but it will continue to work and will be officially removed later.

# 0.18.7

*Released 01/30/2017*

**Bugfixes:**

- Fixed regression in `0.18.6` that caused Cypress to fail when switching spec files when `baseUrl` was set in `cypress.json`. Fixes {% issue 403 '#403' %}.

# 0.18.6

*Released 01/29/2017*

**Features:**

- We now launch Cypress tests directly to the `baseUrl` to avoid an initial page refresh when encountering the first {% url `cy.visit()` visit %} command. This should help tests run faster. Fixes {% issue 382 '#382' %}.

**Bugfixes:**

- Uninstalling the last used browser no longer causes the Test Runner to error and hang. Fixes {% issue 371 '#371' %}.
- Fixed issue where `stdout` would not be displayed on a completed `cypress ci` run. Fixes {% issue 398 '#398' %}.
- Fixed a longstanding issue in Cypress where logging in from another computer would kill the session on all other computers, and prevent you from accessing `cypress get:key` (amongst other things). Fixes {% issue 400 '#400' %}.

**Misc:**

- We now validate all of the configuration options set in `cypress.json` to ensure it has valid types. Fixes {% issue 399 '#399' %}.
- We now validate that `baseUrl` is accessible **prior** to running tests. This prevents a common situation where you may forget to boot your web server and have instantly failing tests. Fixes {% issue 383 '#383' %}.
- We now show the entire scaffolded tree of files when adding a brand new project. Fixes {% issue 401 '#401' %}.
- We display errors coming from `babel` with more helpful information now.
- Changed the [Test Runner](https://github.com/cypress-io/cypress/tree/develop/packages/desktop-gui) to use `JWT` for authorization. **You will have to log in again**.

# 0.18.5

*Released 01/08/2017*

**Features:**

- You can now disable `videoCompression` by passing `false` in `cypress.json` or env variables. In very long runs and on CPU throttled instances compression can take a considerable amount of time, possibly as much as 50% of the time spent running actual tests. Fixes {% issue 372 '#372' %}.

**Misc:**

- Improved performance when running `cypress run` by caching the last bundled spec. This prevents having the same spec file rebundled each time {% url `cy.visit()` visit %} caused a full page navigation. You should see a moderate improvement in test run time. Fixes {% issue 370 '#370' %}.
- We are now capturing `stdout` and several other properties for use + display in our Dashboard on `cypress ci` runs.
- Enable {% url `cy.fixture()` fixture %} to send an encoding for images other than forcing the default encoding of `base64`. Fixes {% issue 373 '#373' %}.
- Enable {% url `cy.route()` route %} to pass an `encoding` parameter when using `fx:fixture` syntax. Fixes {% issue 374 '#374' %}.

# 0.18.4

*Released 12/28/2016*

**Bugfixes:**

- Prevent {% url `cy.url()` url %} from accessing the URL during transition phase and throwing an error. Fixes {% issue 356 '#356' %}.
- Stubbed functions now serialize correctly when switching domains on a {% url `cy.visit()` visit %}. Fixes {% issue 354 '#354' %}.
- Fixed a handful of scenarios and edge cases where cookies were not properly synchronized between external requests and the browser. This led to situations where cookies were either duplicated on requests, or were not sent. Fixes {% issue 357 '#357' %} and {% issue 361 '#361' %} and {% issue 362 '#362' %}.

**Misc:**

- {% url `cy.request()` request %} now favors `baseUrl` config over remote origin when you do not pass a fully qualified URL. Fixes {% issue 360 '#360' %}.

# 0.18.3

*Released 12/18/2016*

**Features:**

- There is now a {% url `cy.log()` log %} command for displaying an arbitrary message and args. Useful for providing context while testing and debugging long tests. Fixes {% issue 342 '#342' %}.

**Bugfixes:**

- {% url `cy.title()` title %} now uses the `document.title` property as opposed to querying for `<title>` elements in the `<head>`. Fixes {% issue 351 '#351' %} and {% issue 331 '#331' %}.
- We now exit correctly (with status of 1) in the case of headless renderer crashes. Additionally we capture these errors properly, explain what happened, and link to external error document to suggest fixes. Fixes {% issue 270 '#270' %} and {% issue 348 '#348' %}.

**Misc:**

- Improved headless performance, and added optimizations for early and often GC.

# 0.18.2

*Released 12/15/2016*

**Bugfixes:**

- Under the hood {% url `cy.visit()` visit %} now sets an `Accept: text/html,*/*` request header to prevent some web servers from sending back `404` in the case where they required this header. Only a small % of servers would ever do this, but `webpack-dev-server` was one of them. Fixes {% issue 309 '#309' %}.
- {% url `cy.request()` request %} now sends an `Accept: */*` request header by default too. Fixes {% issue 338 '#338' %}.

**Misc:**

- {% url `cy.request()` request %} now includes more debugging information (related to headers) in the error output. Fixes {% issue 341 '#341' %}.
- When {% url `cy.request()` request %} times out, we now output much better error messages including information about the request sent. Fixes {% issue 340 '#340' %}.

# 0.18.1

*Released 12/11/2016*

**Notes:**

- There is a new {% url "recipe showcasing these new features" https://github.com/cypress-io/cypress-example-recipes %}.
- We are adding several other recipes to show examples of all the ways you can use {% url `cy.request()` request %} to improve your tests.

**Features:**

- {% url `cy.request()` request %} can now have its automatic redirect following turned off by passing `{followRedirect: false}`. Fixes {% issue 308 '#308' %}.
- {% url `cy.request()` request %} now has a `qs` option that automatically appends query params to the `url` property. Fixes {% issue 321 '#321' %}.
- {% url `cy.request()` request %} now follows redirects exactly like a real browser. Previously if you `POST`ed to an endpoint and it redirected to a `GET` then {% url `cy.request()` request %} would not follow it due to the `method` changing. It now follows method changing redirects by default. Fixes {% issue 322 '#322' %}.
- {% url `cy.request()` request %} now accepts the `form` option which will convert the `body` values to urlencoded content and automatically set the `x-www-form-urlencoded` header. This means you can now use {% url `cy.request()` request %} to bypass your UI and login with standard form values. Fixes {% issue 319 '#319' %}.
- When {% url `cy.request()` request %} fails, it now outputs the full request / response information. This behaves more similar to {% url `cy.visit()` visit %} failures. Fixes {% issue 324 '#324' %}.
- {% url `cy.request()` request %} now prints **all** of the underlying HTTP request / response information into the Dev Tools' console (when clicking on the Command Log). This means that you will see everything you would normally see from the `Network` tab as if the request were made from the browser. We even print redirect information. Fixes {% issue 325 '#325' %}.

**Bugfixes:**

- Cypress' internal `babel` will no longer attempt to load your project's `.babelrc`. This helps avoid potential version conflicts. Fixes {% issue 312 '#312' %}.
- We no longer watch the `supportFile` while running `cypress run`. Fixes {% issue 329 '#329' %}.
- `watchForFileChanges` is now correctly respected in regards to watching all files, including the `supportFile`. Fixes {% issue 336 '#336' %}.
- There is no longer an error when scaffolding a new Cypress project. Fixes {% issue 326 '#326' %}.
- The Runner UI no longer appears to be "running" when there is a spec bundle error in the `supportFile`.
- Cypress now correctly exits during `cypress run` in `linux` when the browser fails to connect. Fixes {% issue 333 '#333' %}.
- Cypress now correctly exits during `cypress run` in `linux` when there is a spec bundle error. Fixes {% issue 337 '#337' %}.
- Cypress now retries up to 3 times for the browser to connect during `cypress run`. The warning / error messages were also updated to be clearer. Partially addresses {% issue 334 '#334' %}.

**Misc:**

- Deprecated `failOnStatus` property for {% url `cy.request()` request %} and renamed to `failOnStatusCode`. Fixes {% issue 323 '#323' %}.
- Removed the `cookies` option from {% url `cy.request()` request %} because cookies are now *always* get/set on requests. This option really never made any sense to have. Fixes {% issue 320 '#320' %}.
- Better data reporting when recording builds in CI.
- We now collect "global" errors that may prevent any tests from running. We will be displaying these in our future CI platform.

# 0.18.0

*Released 11/27/2016*

**Notes:**

- We've created a new {% url "example recipes repo" https://github.com/cypress-io/cypress-example-recipes %} to show you common testing scenarios including how to use the new module support.

**Summary:**

- We've added automatic ES2015+, module, JSX, and CJSX support to all test files. This means you can use `require`, `import`, or `export` declarations to load other files. You can also use this to import your own application specific JavaScript modules and write unit tests for them. More of these details are yet to come. {% issue 318 'See this issue' %}.
- You can now use your regularly installed `node_modules` in your project to do things like utilizing {% url "`lodash`" https://lodash.com/ %} for utility functions or extending {% url "`chai`" http://www.chaijs.com/ %} with assertion plugins.
- Because we're now processing the spec files prior to handing them off to the browser, this means we will display problems like syntax errors when something in the processing goes wrong. Additionally, we print these out during `cypress run`, so you're not stuck wondering what went wrong.

**Breaking Changes:**

- Previously, we auto-magically included all files within {% url '`cypress/support`' writing-and-organizing-tests#Folder-Structure %}. This has now {% url 'gone away' error-messages %} and we've simplified this to automatically including a single `cypress/support/index.js` file. That single file acts as the entry point meaning you should `import` or `require` the other support files you'd like to include. Although this is still "automatic" it's much less magical and we'll be updating all of our docs to reflect this. The purpose of `cypress/support` hasn't really changed, just the implementation of it has. We will automatically seed a `cypress/support/index.js` file for you (even on existing projects). The file location of `cypress/support/index.js` can be changed with the new {% url `supportFile` configuration#Folders-Files %} option in your `cypress.json`. This feature can also be turned off by specifying `supportFile: false`.

**Features:**

- We now support ES2015+, modules, and JSX in all spec files. Fixes {% issue 246 '#246' %}.
- Spec files may now be written as `.js`, `.jsx`, `.coffee`, or `cjsx` files.
- Test files with JS syntax errors are now {% url 'handled' error-messages %} and we provide a GUI that points to the exact line/column number. Additionally we print these out during `cypress run` and exit the process with `code 1`. Fixes {% issue 293 '#293' %}.

**Misc:**

- We improved the logic around when and if we scaffold files on a new project. We're much smarter about this and not generating these forcibly every time. Fixes {% issue 285 '#285' %}.
- Simplified handling of support files and made them less "magical". Fixes {% issue 286 '#286' %}.
- Renamed `supportFolder` to {% url `supportFile` configuration#Folders-Files %} in `cypress.json`. We will automatically rename your `cypress.json` if this property was present on update.

# 0.17.12

*Released 11/21/2016*

**Bugfixes:**

- You no longer have to log in again after updating. Fixes {% issue 305 '#305' %}.
- Updating in app now works again. Sorry about that. Fixes {% issue 304 '#304' %}.
- Headless frame rate is now correctly set to `20` instead of resetting back to `60`. Fixes {% issue 303 '#303' %}.
- We now automatically drop frames that the CPU cannot keep up with while video recording during `cypress run`. Previously we would buffer all frames in memory and it was possible to exhaust all memory due to the way that streaming backpressure works. Fixes {% issue 302 '#302' %}.
- Fixed an edge case in the `driver` that could lead to memory leaks. This happened when Command Logs updated from previously run tests. Normally, in headless mode, we automatically remove references to purge memory after each test, but when logs were updated after this, their references were merged back in again and held onto forever. If you were seeing long Cypress runs die or eventually halt, this was likely the cause. We did extensive memory regression analysis on Cypress and could not find any more memory leaks. Fixes {% issue 301 '#301' %}.

**Misc:**

- Improved {% url '`cypress run`' command-line#cypress-run %} and `cypress ci` headless output. Fixes {% issue 306 '#306' %}.
- Improved performance by preventing `snapshots` from being taken during headless runs.

# 0.17.11

*Released 11/16/2016*

**Roadmap:**

- The changes in version [`0.17.11`](#01711-11162016) below are in preparation for Cypress￢ﾀﾙ platform service: a portal where screenshots, videos, config, and logs of your builds are accessible.

**Overview:**

- `cypress ci` now uploads build assets to our servers after a test run completes. Additionally, it tracks the `config` settings used during the build and tracks each individual test failure.
- If you do *not* want these assets to be tracked by Cypress, you need to switch to using {% url "`cypress run`" command-line#cypress-run %}. We will happily remove any build assets that are accidentally uploaded to us during the update transition.

**Features:**

- We now record videos during a headless run with both `cypress ci` and {% url '`cypress run`' command-line#cypress-run %}. Fixes {% issue 229 '#229' %}.
- After completing `cypress ci`, we now upload build assets (such as `screenshots` and `videos`) to be used in our upcoming admin interface. This will enable you to review assets without having to touch your CI server. Fixes {% issue 292 '#292' %}.

**Misc:**

- We've redesigned the headless run `stdout` to give you more details of the run, the stats after the run, what screenshots were taken, the video that was recorded, compression settings for the video, uploading asset progress, etc.
- Screenshot names now include their parent titles, and invalid file system characters are scrubbed. Fixes {% issue 297 '#297' %}.
- We no longer artificially restrict the environment `cypress ci` can run in. It can now run *anywhere*. Fixes {% issue 296 '#296' %}.
- We removed scaffolding any directories on a new project (during `cypress run`). Fixes {% issue 295 '#295' %}.
- {% url '`cypress run`' command-line#cypress-run %} no longer prompts the user for any kind of interaction, thus enabling you to use this in CI if you choose to do so. Fixes {% issue 294 '#294' %}.
- There is a new {% url 'configuration' configuration %} property called: ~~`trashAssetsBeforeHeadlessRuns`~~ (This was changed to `trashAssetsBeforeRuns` in [`3.0.0`](#3.0.0)) that is set to `true` by default and will automatically clear out screenshots + videos folders before each run. These files are not deleted, they are just moved to your trash.
- There are several new {% url 'configuration' configuration %} properties for video recording: `videoRecording`, `videoCompression`, and `videosFolder`.

# 0.17.10

*Released 11/07/2016*

**Bugfixes:**

- Fixed switching between two different spec files from the desktop app causing `document.domain` to be wrong. Fixes {% issue 276 '#276' %}.
- Fixed inserting the string `null` into {% url `cy.request()` request %} urls when providing a `baseUrl` in `cypress.json` while origin could not be determined. Fixes {% issue 274 '#274' %}.
- Fixed incorrect error message on reverse visibility assertions. Fixes {% issue 275 '#275' %}.

**Misc:**

- We've improved the way we inject content into `<html>` responses by filtering the underlying HTTP request headers. We no longer inject content into templates which were loaded via XHR. Fixes {% issue 257 '#257' %} and {% issue 288 '#288' %}.

# 0.17.9

*Released 10/22/2016*

**Bugfixes:**

- Cypress now applies cookies to the browser which were cleared between redirects. Fixes {% issue 224 '#224' %}.
- Snapshots now work even when `<html>` tag has invalid attributes. Fixes {% issue 271 '#271' %}.
- Cypress no longer crashes on initial {% url `cy.visit()` visit %} when the 3rd party web server never ends the response. Fixes {% issue 272 '#272' %}.

**Misc:**

- Changed default {% url `responseTimeout` configuration#Timeouts %} from `20000` to `30000`.
- Changed default {% url `pageLoadTimeout` configuration#Timeouts %} from `30000` to `60000`.
- The internal Cypress proxy now forcibly responds to requests taking longer than `responseTimeout`. Currently this sends back `text/html` with the `ETIMEDOUT` error, but this likely needs to be configurable. The reason we are now forcibly applying timeouts is to prevent `socket pooling exhaustion` where tests are running and a 3rd party server never responds to the request.

# 0.17.8

*Released 10/13/2016*

**Bugfixes:**

- Fixed `opener of undefined` errors due to `page load` events causing snapshots prior to the `load` event of the remote application. Thanks to everyone who helped pitched in on this one! Fixes {% issue 258 '#258' %}.
- Cypress now correctly sets cookies with `expirationDate` in the past. Chrome did not handle these cookies as documented and our code did not take this into account. We also added a lot more `e2e` tests around this behavior. Fixes {% issue 266 '#266' %}.
- We are now taking additional precautions to prevent Cypress from trashing the wrong folder during an upgrade (with an open project). This was actually fixed in `0.17.7` but the problem was is that during an update, the new version (which was fixed) was still being passed the wrong arguments from the older (broken) application. We've now upgraded `0.17.8` to detect this, and just use the expected default install location of Cypress. If you're concerned, just *close* your currently open project before updating. Fixes {% issue 265 '#265' %}.

**Misc:**

- When an in app update fails in `linux` we now provide instructions on how to manually update Cypress.
- We now properly take the `maxAge` cookie flag into account and give it preference over the `expires` flag as per the cookie spec.

# 0.17.7

*Released 10/12/2016*

**Features:**

- There is now a new {% url `chromeWebSecurity` configuration#Browser %} option you can set in `cypress.json` to turn off Chrome's Web Security features. We've written a brand new reference that details why and how you could use this. {% url 'Cypress Web Security' web-security %}. This option can be used for accessing `cross origin` `<iframes>` or if your application needs to test navigation across super domains. Fixes {% issue 262 '#262' %}.

**Bugfixes:**

- We now capture `cross origin` errors correctly instead of these showing as `Uncaught DOMExceptions` in the console. Fixes {% issue 261 '#261' %}.
- We no longer trash the wrong folder on OSX in-app updates (when a project is open). Sorry about this! Fixes {% issue 260 '#260' %}.
- {% url `cy.visit()` visit %} urls with domain-like segments (which weren't actually the domain) no longer cause Cypress to think you're trying to navigate to a different superdomain. Fixes {% issue 255 '#255' %}.

# 0.17.6

*Released 10/04/2016*

**Features:**

- Snapshots will now be *pinned* when clicking on a command in the Command Log. This enables you to inspect the state of the DOM when the snapshot was taken. We've given you a new series of controls for turning off the element highlighting and hitboxes. Additionally we've given you the ability to manually click through each named snapshot when there are multiple states (like before and after). Fixes {% issue 247 '#247' %}.

**Bugfixes:**

- Fixed a regression where tests that failed outside of a hook would incorrectly indicate themselves as a `before each` hook. In addition, in the default `spec`, reporter will now display the test name when a hook was the source of failure. Fixes {% issue 253 '#253' %}.
- Fixed a deployment bug in the `core-desktop-gui`.
- We now prevent {% url `cy.visit()` visit %} from accidentally snapshotting twice.

**Misc:**

- {% url `cy.request()` request %} and {% url `cy.visit()` visit %} now correctly send `User-Agent` headers based on the current open browsing session. Fixes {% issue 230 '#230' %}.

# 0.17.5

*Released 10/02/2016*

**Features:**

- We've added `JUnit` as a valid {% url 'built-in reporters' reporters %}. Fixes {% issue 178 '#178' %}.
- You can now {% url 'add or write your own custom reporters' reporters %}. This means you can `npm install xyz-mocha-reporter` and we'll automatically correctly `require` that package. Alternatively you can write your own `xyz-custom_reporter.js` file. Fixes {% issue 231 '#231' %}.
- The `reporter` can now be resized. We persist this state locally so it should "stick" between browser launches / app restarts. Fixes {% issue 204 '#204' %}.
- Cypress now "remembers" the last browser you had open and will suggest opening that whenever a project is opened. Addresses {% issue 193 '#193' %}.
- Instead of seeing `Script error.` - cross origins script errors are now handled specially and we throw a very long and exciting error explaining what just happened. Fixes {% issue 241 '#241' %}.
- When uncaught errors are thrown in hooks we now indicate Mocha's behavior as part of the error - that it is skipping the remaining tests in the current suite. Fixes {% issue 240 '#240' %}.

**Bugfixes:**

- The reporter now more intelligently scrolls to prevent commands from being cut off. Useful in screenshots / video recording. Fixes {% issue 228 '#228' %}.
- We've improved the logic of how snapshots are restored so that it does not break the CSS when there were full page navigations in the test and the CSS changed. Fixes {% issue 223 '#223' %}.
- Iframes are now correctly handled when we restore snapshots. Previously, we removed iframes which would change the page layout and the hitboxes' coordinates we drew were wrong. Now we insert iframe placeholders that prevent the page layout from changing. Fixes {% issue 234 '#234' %}.
- Snapshot hitboxes no longer incorrectly draw for elements that are hidden. Fixes {% issue 251 '#251' %}.
- Fixed a bug that caused commands to time out on subsequent tests whenever there was an uncaught error + an assertion conflict. Fixes {% issue 238 '#238' %}.
- Fixed an edge case where assertions would incorrectly associate to a previously run assertion. Fixes {% issue 252 '#252' %}.
- Cypress commands now correctly execute in `after` and `afterEach` hooks on a failed test. Previously they would only run on passing tests. Fixes {% issue 203 '#203' %}.

**Misc:**

- We've bypassed Mocha's default uncaught error handling and replaced it with something much better - actually using the thrown error instances instead of creating a new arbitrary one. This means you'll see better stack traces on uncaught errors. Fixes {% issue 193 '#193' %}.
- We've bypassed Mocha's default uncaught error handling in a `hook`. Normally this immediately ends the run. Instead we are skipping the remaining tests in the current suite. This prevents skipping potentially dozens or hundreds of tests downstream that are typically unrelated to the hook failure.
- We've updated `cypress-cli` package to `0.12.0`. You will need to download this new CLI version if you want to pass `--reporter-options`.
- Bumped the internal version of `mocha` from `2.2.1` to `2.4.5`.

# 0.17.4

*Released 09/12/2016*

**Breaking Changes:**

- Using subsequent {% url `cy.visit()` visit %}'s *in the same test* will not necessarily force a full page refresh. If all that changed was the hash of a url, then the hash changes will take affect **without** a full page refresh. This matches the behavior of a real browser. Previously {% url `cy.visit()` visit %} always forced a full page refresh and this was not correct.

**Features:**

- Using {% url `cy.visit()` visit %} now acts *exactly* how modifying the URL in a real browser works. This means that if you visit a url with a hash in it, instead of forcing a full page refresh, it will now simply modify the hash route as if you had manually changed it. This more accurately reflects real user behavior. Previously this was impossible to do with Cypress other than manually altering `window.location.hash`.

**Bugfixes:**

- Fixed a regression in `0.17.2` which caused **separate** tests that were visiting the same URL not to actually visit the new URL and eventually time out. We've updated some of our internal QA processes around this because we rarely have regressions and they are a pretty big deal. Fixes {% issue 225 '#225' %}.
- Fixed displaying `(null)` contentType when a {% url `cy.visit()` visit %} returned a `404` status code. We now only display `contentType` when one exists.

# 0.17.3

*Released 09/11/2016*

**Features:**

- When `visible` assertions such as `should('be.visible')` fail we now print the reason Cypress thought the element was invisible. Matches what Cypress prints out when attempting to interact with invisible elements. Fixes {% issue 221 '#221' %}.

**Bugfixes:**

- Prevent `Host` header from having its port appended when request was for port `80` or `443` which lead to 3rd party reverse proxy problems such as with `zeit.co` hosting. Fixes {% issue 222 '#222' %}.
- Send valid http response errors, and display new lines correctly. Fixes {% issue 218 '#218' %}.
- Correctly inject on `5xx` http response codes. Fixes {% issue 217 '#217' %}.
- Correctly inject on `4xx` and other bad http response codes when using Cypress as the file server. Fixes {% issue 219 '#219' %}.
- Correctly inject on `gzip` errors from 3rd party servers doing dumb things. Fixes {% issue 220 '#220' %}.

# 0.17.2

*Released 09/06/2016*

**Notes:**

- After this update if you are seeing `<iframe>` origin errors *please let us know* by {% url "opening an issue" https://github.com/cypress-io/cypress/issues/new %}. We will screen-share with you to diagnose the issue. We're no longer aware of any situation where this should happen, so if you're experiencing these bugs, please help us track them down.

**Features:**

- Attempting to {% url `cy.visit()` visit %} a non `text/html` resource will now throw a specific error message instead of bombing on page injection with an `<iframe`> origin error. You have to visit actual `html`, you cannot visit something like a `.json` or `.png`. If you're wanting to visit an API route on your backend that does something like set cookies (thus avoiding loading your UI) you can just use {% url `cy.request()` request %} for this since it will now automatically get and set cookies under the hood. Fixes {% issue 211 '#211' %}.

**Bugfixes:**

- Fixed a regression in `0.17.1` that was incorrectly setting `Cache` headers. This *could* cause a situation where you received an `<iframe>` origin error. Additionally we now set `No-Cache` headers whenever we inject content, but otherwise respect the headers coming from web servers. When using Cypress as the file server, we set `etags` but prevent caching.
- Most likely fixed a bug that was crashing Cypress due to `Cannot set headers after they've been sent`. We were unable to write a test for this since we could not recreate the error, but analyzed how it *may* happen and fixed the code there. {% open_an_issue %} if you see this error, it will be obvious since Cypress will literally crash.
- We stopped minifying `vendor.js` (for real this time). More optimizations to come around this.
- Prevented accidentally setting `domain` cookies when they were really `hostOnly` cookies, thus duplicating the number of cookies sent on requests. Kudos to {% url "@bahmutov" https://github.com/bahmutov %} for finding this one. Fixes {% issue 207 '#207' %}.
- Fixed some edge cases in `cypress-core-extension` where it threw errors when attempting to `executeScript` on a tab with `about:blank` or `chrome://` urls.
- We've fixed some underlying issues with {% url `cy.go()` go %} during `cypress run`. It always worked fine in real Chrome. Previously there were some situations where it would not navigate forward / back correctly.

**Misc:**

- No longer force {% url `cy.visit()` visit %} to navigate to `about:blank` prior to navigating to the real url. Fixes {% issue 208 '#208' %}.
- {% url `cy.writeFile()` writefile %} can now accept an empty string. Fixes {% issue 206 '#206' %}.
- Improved error messages for {% url `cy.readFile()` readfile %} and {% url `cy.writeFile()` writefile %}.
- The full file path is now included in console output for {% url `cy.readFile()` readfile %} and {% url `cy.writeFile()` writefile %}.
- The {% url "Kitchen Sink" https://github.com/cypress-io/cypress-example-kitchensink %} and `example_spec.js` have been updated to reflect the newest changes and features of `0.17.1`.

# 0.17.1

*Released 08/31/2016*

**Features:**

- You can now pass keyboard modifiers such as `ctrl`, `cmd`, `shift`, and `alt` to {% url `.type()` type %}. In addition we've added support for not "releasing" these keys so they can affect other actions such as {% url `.click()` click %}. Addresses {% issue 196 '#196' %}.
- You can now type into the `<body>` or `document` as opposed to previously *having* to target a valid focusable element. This is useful in situations where you're testing keyboard shortcuts and do not want to target a specific element. Addresses {% issue 150 '#150' %}.
- There is a new command {% url `cy.readFile()` readfile %} that reads files on your file system and changes the subject to the contents. Addresses {% issue 179 '#179' %}.
- There is a new command {% url `cy.writeFile()` writefile %} that creates and/or writes contents to files on your file system. Addresses {% issue 179 '#179' %}.

**Bugfixes:**

- {% url `defaultCommandTimeout` configuration#Timeouts %} now works correctly. The driver was still referencing the old `commandTimeout` value.
- The `__cypress.initial` cookie should now be removed during any {% url `cy.visit()` visit %}, which should fix some edge cases with the proxy accidentally injecting content when it shouldn't. We also added a ton more e2e tests covering these edge cases and other behavior.
- The proxy now restricts its injection to only `Content-Type: text/html` headers so it will not accidentally inject into the wrong responses.

**Misc:**

- All {% url `cy.fixture()` fixture %} extensions are now supported and Cypress will no longer throw on extensions it doesn't recognize. For known fixture extensions we'll continue to apply a default `encoding` and for everything else it will default to `utf8`. Fixes {% issue 200 '#200' %}.
- {% url `cy.fixture()` fixture %} now accepts `encoding` as a 2nd optional argument.
- We now display a keyboard 'modifiers' column when clicking on a {% url `.type()` type %} in the Command Log.

# 0.17.0

*Released 08/30/2016*

**Overview:**

- The desktop application has been completely redesigned. We have moved from a tray application to a standard dock application. The list of projects is now in the same window as the list of tests in a project. As each test runs, the application highlights the currently running spec and displays the browser version running. The configuration of a project is now displayed in its own tab. There is now a Desktop Menu where you can logout, check for updates, or view help links.
- The test {% url "runner" https://github.com/cypress-io/cypress/tree/develop/packages/runner %} has been rebuilt from the ground up in {% url "React.js" https://reactjs.org/ %}. The left side of the runner called the {% url "reporter" https://github.com/cypress-io/cypress/tree/develop/packages/reporter %} is now a separate application. This, as well as other changes, markedly improved the performance of running tests. *Your tests will now run faster.* This will also enable you to test your application in full screen. Additionally this paves the way for being able to spawn multiple browsers at once and synchronize testing across them. This also means we'll be able to support mobile browsers. The UI for doing this hasn't been implemented but the vast majority of the work to accomplish this is done now.
- We have rewritten the entire proxy layer of the Cypress server to finally fix all the problems with CORS.

**Breaking Changes:**

- You cannot {% url `cy.visit()` visit %} two different super domains within a single test. Example: `cy.visit('https://google.com').visit('https://apple.com')`. There shouldn't be any reason you ever need to do this in a single test, if you do, you should make these two separate tests.

**Features:**

- *All CORS related issues should finally be fixed now.* Cypress now internally switches to the domain that you used in your {% url `cy.visit()` visit %}. This means that the correct domain will display in the URL based on the application currently under test. Your application's code will run under the current domain at all times. Previously we implemented an endless amount of hacks and internal translations to figure out the domain you were *supposed* to be on without actually being on the domain. This caused code to behave different and caused subtle issues. Those issues should now be resolved. The entire proxy layer has been rewritten to handle all `https` certificates flawlessly, continue to inject (even on `https` pages), and still know when to automatically bypass injection so you can open other tabs while testing in Cypress. These new proxy changes also unlock the ability to do things like whitelisting or blacklisting specific 3rd party domains, or even be able to stub not just XHR's but any kind of `HTTP` request.
- `window.fetch` now works correctly. Stubbing these does not yet work but it is now possible for us to implement stubbing in a future version. Addresses {% issue 95 '#95' %}.
- The list of tests now automatically refresh when test files are renamed, deleted, or added. In addition, because the list of tests is now displayed in the desktop application, we now synchronize the state of the current running spec.
- {% url `cy.visit()` visit %} has better error messages. Cypress now programmatically determines why a {% url `cy.visit()` visit %} failed and gives you a ridiculously accurate error message. Addresses {% issue 138 '#138' %}.
- {% url `cy.visit()` visit %} now displays redirects and any cookies set.
- The currently running test is now scrolled into view. This behavior can be turned off by scrolling in the command log or selecting to disable auto-scroll at the top of the command log. Addresses {% issue 194 '#194' %}
- Tests in the Command Log now automatically expand when specific commands take longer than `1000ms` to run. Previously when running more than 1 test we did not expand commands until a test failed. Now they will be expanded and automatically collapsed whenever a single command is taking a long time to finish.
- We now have full blown subdomain support. This means you can now navigate to a subdomain either directly via a {% url `cy.visit()` visit %} or by navigating in your application naturally (such as clicking an `<a>`).
- {% url `cy.request()` request %} now attaches and sets cookies transparently on the browser. Even though the browser will not physically make the request, we automatically apply outgoing cookies *as if* the browser had made the request. Additionally we will automatically *set* cookies on the browser based on the response. This means you can use {% url `cy.request()` request %} to bypass not just CORS but handle things like automatically logging in without having to manually perform these actions in the UI.
- We now handle `HTTP` request errors much better. Previously if your web server sent us back a `4xx` or `5xx` response we would automatically send back a `500`. Now we transparently pass these through.
- Improved dozens of error messages.
- {% url `.debug()` debug %} output has been improved, and you can now easily inspect the current command's subject.
- Clicking the URL in the header of the runner now opens that URL in a new tab.

**Bugfixes:**

- Fixed URL proxy issue with subdomains. Fixes {% issue 183 '#183' %}.
- Viewport size maximum has been decreased from `3001px` to `3000px` and minimum has been increased from `199px` to `200px` to match error messages. Fixes {% issue 189 '#189' %}
- Websockets are now correctly proxied through `https` and through subdomains different than the current domain under test.
- Stopped {% url `.debug()` debug %} from accidentally mutating subjects.
- Cypress now correctly injects and handles pages which are missing a `<head>`, a `<body`>, or even an `<html>` tag. Previously it would bomb on pages missing these tags.
- All commands with a long message (such as assertions) are automatically scaled down in font size and truncated properly. In addition, assertions will correctly bold the `expected` and `actual` values.

**Misc:**

- {% url '`cypress run`' command-line#cypress-run %} no longer requires being logged in.
- Renamed configuration option `commandTimeout` to {% url `defaultCommandTimeout` configuration %}. Cypress will transparently rewrite this if you have it in your `cypress.json`, so you don't have to do anything.
- Renamed `onConsole` and `onRender` Command Log options to `consoleProps` and `renderProps`. We still support the older property names for backwards compatibility.
- Added support for a command's `message` or `renderProps.message` to use markdown.
- The default value of `port` within a project's global {% url 'configuration' configuration %} has changed from `2020` to now being a random open port. You can still configure a specific `port` if needed within the {% url 'configuration' configuration %}.
- We have upgraded the `Chromium` that runs headlessly on {% url '`cypress run`' command-line#cypress-run %} to version `51`.
- The internal version of `node` which is built into Cypress is now `6.1.0`.
- Cypress `.js` files are no longer minified to make them easier to debug.
- We are cleaning up internal `__cypress` cookies more so they won't get in the way of testing your application.
- We now opt into `gzip` handling instead of forcing requests to omit it.
- The runner is now responsive. It will correctly scale down URLs on smaller screen sizes instead of looking completely broken in CSS. We also designed a much better loading indicator.
- Added button to the reporter that focuses the Test Runner and shows the list of tests.
- The reporter now updates the duration every `100ms` instead of only when a test changes.
- In the reporter, suites that are pending or contain only pending tests have the blue "pending" indicator on the left instead of the white "processing" indicator.

# 0.16.5

*Released 07/31/2016*

**Bugfixes:**

- Force exit codes that are `null` to `0`. Fixes {% issue 184 '#184' %}.

# 0.16.4

*Released 06/17/2016*

**Bugfixes:**

- Fixed regression caused by `0.16.2` where a failed {% url `cy.contains()` contains %} would not be cancelled and would continue to run and display failed assertions in between test runs (without a full page refresh). Fixes {% issue 174 '#174' %}.

# 0.16.3

*Released 06/17/2016*

**Features:**

- {% url `cy.route()` route %} now accepts string glob patterns using {% url "minimatch" https://github.com/isaacs/minimatch %} under the hood. This means you can more easily route dynamic urls without using `regex`. Example: `cy.route('POST', '/users/*/comments', {})`.
- {% url `Cypress.minimatch` minimatch %}  is now exposed so you can easily test globbing patterns.
- {% url `.type()` type %} can now be used on non-input elements that have a `tabindex` attribute. Key events will fire but no text content will change and no input based events fire. Fixes {% issue 172 '#172' %}.
- There is now an {% url `ignoreTestFiles` configuration %} configuration option that accepts an array of `glob` patterns. This enables you to ignore extraneous spec files that may be created during a build process. The default pattern is `*.hot-update.js` which will ignore dynamically generated webpack hot module swapping files. Fixes {% issue 159 '#159' %}.

**Bugfixes:**

- Fixed a bug where Cypress could get into a weird state and continuously error due to the `before:log` event not being properly disposed. Fixes {% issue 173 '#173' %}.
- Fixed a bug where invalid UTF-8 characters were being set in XHR headers which caused XHR's to fail. We now properly encode and decode all values. Fixes {% issue 168 '#168' %}.
- Nested directories under `cypress/support` no longer cause a `500` when tests run. This was due to Cypress not ignoring directories and trying to serve them as regular files. Fixes {% issue 163 '#163' %}.
- Fixed situations where 3rd party libraries (such as {% url "New Relic" https://newrelic.com/ %} were instrumenting XHR's identical to Cypress' implementation. This caused an infinite loop which would crash the browser. We've updated how we instrument XHR's to take this into account and deployed multiple fallbacks and strategies to prevent this kind of thing from happening in the future. Fixes {% issue 166 '#166' %}.

**Misc:**

- {% url `Cypress.Server.defaults()` cypress-server %} now accepts a `urlMatchingOptions` option for passing options to {% url "minimatch" https://github.com/isaacs/minimatch %}.
- {% url '`cypress run`' command-line#cypress-run %} now exits with the number of test failures instead of always exiting with 0. This matches the same way `cypress ci` works. Fixes {% issue 167 '#167' %}.
- In the {% url 'Cypress CLI tool' command-line %} package version `0.11.1`, you can now pass the `--spec` option to `cypress ci`. This enables you to run a specific spec file as opposed to all tests. Fixes {% issue 161 '#161' %}.

# 0.16.2

*Released 06/11/2016*

**Features:**

- Added new {% url `cy.screenshot()` screenshot %} command which can take screenshots on demand.
- When running `cypress run` or in CI, Cypress will now automatically take a screenshot when a test fails. You can optionally turn this off by setting {% url `screenshotOnHeadlessFailure` configuration#Screenshots %} to `false` in your configuration.
- Added new {% url `screenshotsFolder` configuration#Screenshots %} configuration option with default of `cypress/screenshots`.
- When running in {% url "Circle CI" https://circleci.com/ %}, we automatically export screenshots as artifacts which makes them available directly in their web UI. If you're using Circle CI, you'll be able to see screenshots without doing anything. If you're using {% url "Travis CI" https://travis-ci.org/ %}, you'll need to upload artifacts to an `s3 bucket`. This is a small slice of what is coming to help diagnose and understand errors in CI. Also in `0.17.0` we will automatically scroll the tests and more intelligently and open / close test commands so you can visually see what happened. Currently you may not see the test command's failure in the Command Log due to the view not scrolling.
- Added new {% url `.each()` each %} command which iterates serially on a collection yielding the iteratee, the index, and the collection. Addresses {% issue 156 '#156' %}.
- {% url `cy.route()` route %} can now accept a single function and/or you can pass a function to the `response` property. This allows you to lazily evaluate routing responses. Great for referencing fixtures. Addresses {% issue 152 '#152' %}.
- {% url `cy.contains()` contains %} now accepts a regular expression. Addresses {% issue 158 '#158' %}.
- {% url `.type()` type %} now accepts `{downarrow}` and `{uparrow}`. We do not move the caret but do fire all the proper events. Addresses {% issue 157 '#157' %}.

**Bugfixes:**

- {% url `cy.exec()` exec %} now outputs additional `stderr` and `stdout` information. It additionally will automatically `source` your `$SHELL` which makes GUI apps behave as if they've been launched from your terminal. Fixes {% issue 153 '#153' %} and {% issue 154 '#154' %}.
- {% url `.then()` then %} yielding nested subjects.
- {% url `cy.contains()` contains %} no longer returns the last element found when siblings both contain the same content. Fixes {% issue 158 '#158' %}.
- Cypress no longer errors when you return a raw DOM element. It now correctly wraps this as the new subject.

**Misc:**

- {% url `cy.contains()` contains %} now provides an even more specific error message when it was scoped to a particular DOM element and contained a selector. Fixes {% issue 160 '#160' %}.
- You will now see a very specific error message when we detect that you've mixed up `async` and `sync` code in a {% url `.then()` then %} callback function. An example would be queuing up a new cypress command but then synchronously returning a different value.

# 0.16.1

*Released 05/22/2016*

**Features:**

- {% url `Cypress.Cookies.debug()` cookies#Debug %} now works again. Additionally it provides much more feedback than it used to.
- {% url '`Cypress.Cookies.debug(true, {verbose: false})`' cookies#Debug %} option has been added to remove verbose cookie object logging.

**Bugfixes:**

- Copy / Paste now works when logging in on OSX. Fixes {% issue 145 '#145' %}.
- Grammar: 'Login -> Log in'. Fixes {% issue 146 '#146' %}.
- Cypress now uses the body instead of headers to send external requests. Fixes {% issue 148 '#148' %}.
- When {% url `.then()` then %} throws this no longer prevents the next test from issuing any commands. Fixes {% issue 149 '#149' %}.

**Misc:**

- Passing multiple arguments to {% url `.its()` its %} now throws and suggests you use {% url `.invoke()` invoke %}. Fixes {% issue 147 '#147' %}.

# 0.16.0

*Released 05/17/2016*

**Notes:**

- Updating through the Desktop App in **Linux** does not work. To update please run {% url '`cypress install`' command-line %} from the command line.
- We are still updating the docs to reflect all of these changes.
- All users must *LOG IN AGAIN* and re-add their projects. Sorry, we've changed the way we store local data.

**Overview:**

- `0.16.0` marks a significant change for Cypress. Before this we only issued commands using regular JavaScript and coordinated these with the backend server which is running. As of `0.16.0` we are now tapping into the underlying browser automation libraries which enable us to exceed the limitations of the JavaScript sandbox. This means we have total control over the browser for more powerful automation tooling. The downside is that we have only implemented these APIs for Chrome, and therefore running on multiple browsers will no longer work. This is a temporary setback as we'll be adding driver support for all of the other browsers over a period of time. You can read more about our browser management {% url 'here' launching-browsers %}.

**Breaking Changes:**

- Running tests in Cypress now requires either Chrome, Chromium, or Canary to be installed on your OS environment. We intend to expand support for more browsers in the future, but for now, only these 3 are supported.
- Removed support for `Cypress.Cookies.get`, `Cypress.Cookies.set` and `Cypress.Cookies.remove`.
- Changed return of {% url `cy.getCookies()` getcookies %} to return an array of cookies, each with properties include name, value, etc.
- Changed return of {% url `cy.clearCookies()` clearcookies %} to return null (previously was returning Cookie that was cleared).
- {% url `Cypress.Cookies.debug()` cookies#Debug %} has been temporarily disabled and will be re-enabled later.
- Browsers are spawned in a Cypress specific profile so that we can maintain a clean state apart of your regular browsing usage. You will notice that your extensions are no longer installed. This is on purpose. 3rd party extensions can often get in the way of Cypress and cause failures. However, developer specific extensions for Angular, Ember, and React do not cause any issues but you'll want to reinstall them. You only have to install them once and they will persist.
- The `whitelist` callback function of {% url `Cypress.Cookies.defaults()` cookies#Defaults %} now receives a `cookie object` instead of just the `cookies name` as a string.

**Features:**

- When a project is initially run from the desktop app, you can now choose to run Cypress in a select number of browsers including: Chrome, Chromium, or Canary (depending on what's installed on your OS).
- Browser sessions are spawned independently of your existing profiles and we've disabled things like password saving / prompting, JavaScript popup blocking, and other features which get in the way of testing. Read more {% url 'here' launching-browsers %}
- We automatically spawn Chrome in a **custom theme** so you can visually distinguish the difference between browser sessions spawned with Cypress vs your normal sessions. We know this may feel a little jarring because you're used to running Cypress alongside your other tabs. You will now see 2 chrome icons in your dock and you'll need to switch between them. We know this is problematic and confusing and we're looking into **changing the icon** of the Chrome running Cypress so it's easier to tell the Chrome sessions apart.
- Added new commands to handle getting, setting, and clearing cookies: {% url `cy.clearCookie()` clearcookie %}, {% url `cy.getCookie()` getcookie %}, and {% url `cy.setCookie()` setcookie %}.
- All the `cy.cookie` commands have been upgraded to take new options and can do much more powerful things outside of the JavaScript sandbox.
- Upgraded the Chromium version running headlessly and in CI from `47` to `49`.
- There is a new {% url `cy.exec()` exec %} command that can execute any arbitrary system command. Additionally there is a new {% url `execTimeout` configuration#Timeouts %} configuration option which is set to `60s` by default. Fixes {% issue 126 '#126' %}.
- There is a new {% url `numTestsKeptInMemory` configuration#Global %} configuration option that controls how many test's snapshots and command data is kept in memory while tests are running. Reducing this number will reduce the memory used in the browser while tests are running. Whatever this number is - is how many tests you can walk back in time when inspecting their snapshots and return values.  Addresses {% issue 142 '#142' %}.

**Bugfixes:**

- Cypress taskbar icon now displays correctly in OS X dark theme. Fixes {% issue 132 '#132' %}.
- Fixed issue where server error's stack traces were being truncated in the Desktop app rendering them impossible to debug. Fixes {% issue 133 '#133' %}.
- woff Fonts are now properly served from a local file system when using Cypress' web server. Fixes {% issue 135 '#135' %}.
- When an element's center is not visible the error message now includes the stringified element in question, and not `undefined`.
- Typing into an `input[type=tel]` now works. Fixes {% issue 141 '#141' %}.
- XHR's which have their `onload` handler replaced after `XHR#send` is called is now properly accounted for. Fixes {% issue 143 '#143' %}.

**Misc:**

- XHR requests for `.svg` files are no longer shown in the Command Log by default. Addresses {% issue 131 '#131' %}.
- Improved error when {% url `cy.request()` request %} fails. The request parameters are now included in the error. Addresses {% issue 134 '#134' %}.
- When running a project in the new Cypress browser environment, if a new tab is opened, a message now displays discouraging the use of multiple tabs while testing. Addresses {% issue 9 '#9' %}.
- When navigating directly to `localhost:2020` outside of the new Cypress browser environment, a message now displays discouraging running tests outside of the new Cypress browser environment.
- If, for whatever reason, Cypress cannot communicate with the automation servers, your testing session will immediately end and you'll have the ability to re-spawn the browser.
- {% url `cy.fixture()` fixture %} now has a default timeout of `responseTimeout` which is `20s`.
- {% url `cy.fixture()` fixture %} can now properly time out and accepts an `options` argument that can override its default timeout.
- Improved initial Desktop Application startup performance by about `1.5s`.
- We now correctly store local data in each operating system's correct `Application Data` area. This will be more resilient to upgrades in the future.
- Running Cypress in a linux VM on VirtualBox no longer displays "black screens".
- Our internal proxy no longer strips `HttpOnly` cookie flags.
- Improved command errors and normalized many of them. Fixes {% issue 137 '#137' %}.
- JavaScript popup blocking is now disabled and will not interfere with running tests. Fixes {% issue 125 '#125' %}.
- We now capture synchronous errors from XHR `onreadystatechange` handlers.

# 0.15.4

*Released 04/22/2016*

**Notes:**

- The docs have not yet been updated to reflect the changes to {% url `.its()` its %} and {% url `.invoke()` invoke %}.

**Breaking Changes:**

- You can no longer improperly use {% url `.its()` its %} and {% url `.invoke()` invoke %}. Using {% url `.invoke()` invoke %} on a non function property will result in an error that tells you how to write it properly using {% url `.its()` its %}.

**Features:**

- Our {% url "chat" https://gitter.im/cypress-io/cypress %} has now been directly integrated into Cypress's nav. Clicking on the `chat` icon will immediately display the current gitter chat log.
- Added a new link to Options dropdown in Desktop app for "Chat" that goes to our {% url "chat" https://gitter.im/cypress-io/cypress %}.
- {% url `.its()` its %} and {% url `.invoke()` invoke %} now support **dot separated** nested properties.
- Using {% url `.its()` its %} on a function will now allow you to access its properties instead of automatically calling a function. Fixes {% issue 122 '#122' %}.
- Error messages and command messages for {% url `.its()` its %} and {% url `.invoke()` invoke %} have been improved.
- Adding an attribute called `data-cypress-ignore` to an element will prevent the internal Cypress proxy from rewriting any of its content or attributes.

**Bugfixes:**

- During `cypress run`, windows created with `window.open` will no longer physically display. They are now correctly headless. Fixes {% issue 123 '#123' %}.
- The auto generated `example_spec.js` no longer errors on `cy.visit('app/index.html')` since that file would likely not locally exist.

**Misc:**

- Better error handling of unauthorized users attempting to login to Cypress with improved {% url 'Login documentation' installing-cypress %}.

# 0.15.3

*Released 04/10/2016*

**Features:**

- Cypress will now {% url 'display the **resolved** configuration values when you open a project' configuration#Resolved-Configuration %}. This tells you the source of all config values.
- The latest version of the {% url 'Cypress CLI' command-line %} now accepts passing arguments to {% url '`cypress open`' command-line#cypress-open %}. Example: `cypress open --config waitForAnimations=false --env foo=bar,baz=quux`. This enables you to set and override local `cypress.json` configuration and additionally set environment variables.
- {% url 'Environment Variables' environment-variables %} that match any configuration keys (such as `pageLoadTimeout` or `watchForFileChanges`) now override their values. So, if you `export CYPRESS_WATCH_FOR_FILE_CHANGES=false` it will turn off this configuration option. Also note that we'll automatically normalize environment keys so: `CYPRESS_pageLoadTimeout=100000` and `CYPRESS_PAGE_LOAD_TIMEOUT=100000` will both be correctly handled. We'll also coerce values into `Boolean` or `Number` correctly.
- Cypress now correctly proxies `Websockets` that are pointed at the local Cypress server (typically `localhost:2020`). Because most users use {% url "Socket.io" http://socket.io/ %}, when Socket.io could not correctly connect over Websockets it would fall back to XHR polling. You may notice many less XHR requests in your command log (which is the intended behavior).
- The tray icon in OSX will now change colors. It will turn blue when you're running a Cypress project and red on any kind of failures such as syntax errors in `cypress.json`. It will turn back black when nothing is actively running.
- The title of your project is now the title of the browser tab (so you can easily tell Cypress tabs from one another).
- There is now a link to our {% url "chat" https://gitter.im/cypress-io/cypress %} in the navigation of the web app.

**Bugfixes:**

- The `-s` or `--spec` option now works correctly. You now must pass a relative or absolute path to your spec file. This is much less confusing, allows you to easily autocomplete entries from bash, and will support `unitFolder` later when it's added. Assuming you want to run a spec file that is located in `cypress/integration/foo_spec.js` you would pass: `cypress run --spec 'cypress/integration/foo_spec.js'`. Previously you could just pass `--spec foo_spec.js` which now no longer works (and was broken anyway). Fixes {% issue 120 '#120' %}.

**Misc:**

- Open sourced another core repo: [Cypress Core Test Runner](https://github.com/cypress-io/cypress/tree/develop/packages/desktop-gui) which makes up the Cypress Desktop Application.
- Improved the {% issue 74#issuecomment-208422453 'error message' %} displayed to users on Windows attempting to download the Cypress Desktop app.

# 0.15.2

*Released 04/03/2016*

**Features:**

- The {% url 'error message when Cypress detects that a test has ended early' error-messages %} (there are still commands left in the queue) now displays a list of these commands with a much improved explanation.
- There is now a new {% url 'configuration option' configuration %}: `watchForFileChanges` that, when set to `false` in the `cypress.json`, will prevent Cypress from attempting to watch for file changes and restart your tests.
- You can now set the default {% url `reporter` configuration %} in `cypress.json` for use during `cypress run` or in CI.

**Bugfixes:**

- The {% url '`--reporter`' command-line#cypress-run %} CLI option is now working again.
- the `teamcity` reporter is now also working again.

**Misc:**

- Updated favicon + logo mark

# 0.15.1

*Released 04/01/2016*

**Features:**

- {% url `cy.go()` go %} and {% url `cy.reload()` reload %} now accept a timeout option. Also, these commands would previously time out after the default `commandTimeout` of `4000ms`, but now they will timeout after `pageLoadTimeout` of `30000ms`.

**Bugfixes:**

- When an integration test file is unable to run and the `integrationFolder` is not the default path, the UI error now properly prints the integration test file's path by stripping off `integration` in the path. Fixes {% issue 117 '#117' %}.
- `Cypress.Dom.isHidden()` will now throw error when it isn't passed a DOM element.

**Misc:**

- Renamed {% url 'configuration' configuration %} option `visitTimeout` to `pageLoadTimeout`. You don't need to change anything. If you were specifically setting `visitTimeout` in your `cypress.json` file it will be transparently rewritten `pageLoadTimeout` on the next server boot. This option was renamed because now multiple commands `cy.visit()`, `cy.go()`, and `cy.reload()` all depend on this timeout option.
- The Cypress tray icon has been updated. It's much better now.

# 0.15.0

*Released 03/28/2016*

**Overview:**

- As we get closer to a public release we've decided to focus on onboarding new users and new projects. We've made several breaking changes to help with this process.

**Features:**

- There is now an `example_spec.js` file that is scaffolded on new projects. This allows new users to instantly see Cypress successfully running on an example project and will answer many questions on writing your first tests. This `example_spec.js` file contains every single Cypress command and has approximately 70 tests.
- Added a welcome dialog for new projects that explains how Cypress scaffolds out its folder structure. This dialog will only display if Cypress detects that you haven't written any tests or changed the initial `example_spec.js` file. The welcome dialog will no longer display after you've changed or added any tests.
- Added the ability to click on file/folder links from within the Cypress webapp that will spawn your OS file/folder finder and show you where the files are located in your project.
- There is now a default `cypress` folder that contains your test files, a `fixtures` folder with an example fixture, and a `support` folder with example support files. Inside `cypress` there is an `integration` folder that will contain your integration tests.
- You can now turn off `supportFolder` and `fixturesFolder` by passing `false` in `cypress.json`. This will automatically remove the folders the next time you open your project in Cypress. Fixes {% issue 102 '#102' %}.
- Restyled the tests list.

**Breaking Changes:**

- Cypress no longer looks at your `tests` directory for test files. Now, by default, it looks in the `cypress/integration` directory.
- We've removed the configuration option `testFolder` and renamed it to {% url `integrationFolder` configuration#Folders-Files %} inside of the `cypress.json`.
- We've renamed the `cypress` npm package to be `cypress-cli`. You'll see a giant deprecation warning until your scripts have been updated to reference `cypress-cli`.. You can also uninstall the `cypress` npm package.
- Added new {% url `fileServerFolder` configuration#Folders-Files %} configuration option that can mount a directory other than your project root when using Cypress as a web server.

**Misc:**

- Using {% url `.hover()` hover %} will provide a detailed error message with a link for working around hover constraints. Addresses {% issue 10 '#10' %}
- Internal routing errors in Cypress are now gracefully handled with `x-cypress-error` and `x-cypress-stack` set on response headers.
- Updated all of the repo names to be modular.

**What you need to do**:
- We did not write an automatic migration from `tests` -> `cypress`
- You need to manually move your existing test files from `tests` into `cypress/integration`.
- [Come into the chat](https://gitter.im/cypress-io/cypress) if you have any problems or need help.

More Info:
- Why did you change the default test folder to be `cypress/integration`.
- We are adding support for unit testing in the near future and decided that there needs to be a separation between `unit` and `integration` tests. The actual runner will handle these two sets of specs very differently. It's important to make the change now so when we do add support for unit tests, you only have to create a `unit` folder inside of your `cypress` folder.

# 0.14.3

*Released 03/20/2016*

**Features:**

- Added {% url `cy.getCookies()` getcookies %} command for easy chain-ability. Fixes {% issue 103 '#103' %}.
- Cypress now outputs its version when passed the `--version` argument
- If you are not logged in on OSX, Cypress now issues a native system notification indicating to you that Cypress is running in your tray (many users often complained they could not tell Cypress was actually running)

**Bugfixes:**

- Handle clearing cookies better when they are created on a path other than `/`. Fixes {% issue 104 '#104' %}.
- Issuing Cypress Commands inside of a Promise now works. Fixes {% issue 111 '#111' %}.
- 'Add Project' dialog is no longer lost on blur. Fixes {% issue 115 '#115' %}.
- Desktop windows that are transparent no longer lose their box shadow.

**Misc:**

- `cy.visit()` callback functions: `onBeforeLoad` and `onLoad` are now invoked with the current runnables context instead of with `cy`. This makes accessing properties in your tests much easier.

# 0.14.2

*Released 03/14/2016*

**Bugfixes:**

- Chaining more cy commands after using {% url `cy.wrap()` wrap %} now works. Fixes {% issue 114 '#114' %}.
- Cypress now handles events property when a DOM element is removed during a `.click()` event. As per the spec, if `mousedown` causes element removal then `mouseup` and `click` and `focus` events will not be fired. Additionally if removal happens during `mouseup` then `click` event will not be fired. Also updated the `onConsole` groups to only display and indicate the events which actually fired. Fixes {% issue 109 '#109' %}.

**Misc:**

- Removed `fa-refresh` icons next to suites and tests until this behavior has been reimplemented due to ID removal.
- Removed resetting the runnable timeout when a `page load` event resolves. This prevents an edge case where the next test may show as timed out during `cypress run`.

# 0.14.1

*Released 03/13/2016*

**Features:**

- Project ID's and `cypress.json` are now only generated once you start your Cypress server. Previously they were created initially when you choose the project folder. This now means you won't have to cleanup excess files if you accidentally select the wrong folder. Additionally you can now use Cypress 100% offline. Previously the GUI would block until the project had an ID but this restriction has been lifted.

**Bugfixes:**

- The proxy server can now correctly proxy content on a `ipv6` host only. We had to patch node core to get this in, as by default node prefers `ipv4`. We now concurrently test all hosts via `dns.lookup` to find the first one that responds. This updated behavior now matches how other clients, like `curl`, and browsers resolve hosts. Fixes {% issue 112 '#112' %}.
- Simplified how Cypress stores projects and fixed some edge cases where Cypress would send an outdated Project ID.
- Prevent server from opening and immediately closing + re-opening when project is missing a Project ID and one is generated.
- Using Cypress as a file server and serving a file that's part of a folder that has a name containing a space now works. Fixes {% issue 113 '#113' %}.
- The existing `.cy` cache and settings are now correctly copied again after an app update.

**Misc:**

- Projects without an ID now error correctly when running in CI.
- When Cypress cannot proxy http content due to a software error it will attach a `x-cypress-error` and `x-cypress-stack` to the HTTP request for easy inspection and debugging.
- Cypress will now output its internal logger directly to the console when `CYPRESS_DEBUG` env var is set.
- Replaced Ruby / Compass with `node saas`.

# 0.14.0

*Released 03/08/2016*

**Summary:**

- This update represents mostly a lot of internal structure changes. We swapped out the underlying Desktop architecture and refactored all of the backend code to prepare for an open-source release.
- If you choose to install Cypress from the {% url 'CLI Tool' command-line %} you must update to the latest version `0.9.1`. Just run `npm install -g cypress` and then you can run {% url '`cypress install`' command-line %}. You don't need to do anything if you update from within the Test Runner itself.

**Features:**

- The Desktop App has been re-skinned with misc GUI enhancements such as help text, popovers, clearer errors, better loading indicators, etc.
- The Desktop App's file size is now much smaller and unzips much faster. In the next release there will be a special `CI` build which removes the need to run `XVFB`.
- Test IDs have been removed. You will no longer see Cypress insert IDs into your test files. This was a feature we implemented on day 1 - the idea being we could track test performance and do regression analysis. Unfortunately, it will be a long time before we actually implement the data science to make this happen. For the time being, IDs presented unnecessary technical complexity and challenges with no real upside. We recommend you remove all of your existing IDs. We've added a new command to the CLI tool that can do this in one shot. `cypress remove:ids` You may see IDs be reintroduced at a later time when we provide analytics.
- {% url `.then()` then %} now supports a `timeout` option. Fixes {% issue 110 '#110' %}.
- All error messages from using the CLI have been rewritten and improved.
- Cypress will now automatically prompt you to add a project when using {% url '`cypress run`' command-line#cypress-run %} on a project that has not yet been added.
- Domain cookies are now proxied better. There's still more work to do before they are 100% fixed but now most typical domain cookie scenarios should 'just work'.
- We've put together a new example repo called {% url "The Kitchen Sink" https://github.com/cypress-io/examples-kitchen-sink %}. It demonstrates usage of every single Cypress command.

**Bugfixes:**

- Using {% url '`cypress run`' command-line#cypress-run %} in OSX now works again.
- Added fs polling support to fix issues where Cypress would not detect file changes.
- Tests should reload inside of Cypress faster when they are changed.
- Better error messages when a command times out waiting for a promise to resolve. Fixes {% issue 108 '#108' %}.
- {% url `cy.viewport('ipad-2')` viewport %} now displays by default in portrait. Landscape orientation is now properly landscape. Fixes {% issue 100 '#100' %}.
- {% url `.click()` click %} will now properly click within an element's bounding box when a `position` option is passed and the calculated coordinates are a fraction. This previously forced the click to happen outside of the element. Fixes {% issue 99 '#99' %}.
- `clientX` and `clientY` event properties are now correctly calculated for elements when the page is scrolled. Fixes {% issue 98 '#98' %}.
- {% url `.check()` check %} and {% url `.uncheck()` uncheck %} now correctly filter down the subject when a value is passed as an option. Fixes {% issue 94 '#94' %}.
- The Test Runner will now display your email address when you have not set a name in GitHub.

**Misc:**

- Improved element display in Command Log when multiple elements are part of an assertion. Fixes {% issue 96 '#96' %}.
- {% url `cy.reload()` reload %} now returns the window object of the newly reloaded page. Fixes {% issue 105 '#105' %}.

Known Issues:
- Clicking the 'reload' icon next to a test that does not have an ID will not work anymore. We're reworking this feature to work without the presence of IDs.

# 0.13.9

*Released 01/28/2016*

**Bugfixes:**

- Prevent regression with not automatically scaling the viewport to fit into the window size

**Misc:**

- Update links to match new {% url "documentation" https://docs.cypress.io %}
- {% url `.debug()` debug %} has been zipped up - it no longer logs confusing debugging information and now logs information about the previously run command.
- {% url `Cypress._` _ %}, {% url `Cypress.$` $ %}, {% url `Cypress.Promise` promise %}, {% url `Cypress.Blob` blob %}, {% url `Cypress.moment` moment %} utilities have been moved off of `cy` and are now attached to `Cypress`. This is much more consistent with how the `cy` and `Cypress` APIs work. You can continue to use these objects off of `cy` but this has been deprecated and you will see a warning message.

# 0.13.8

*Released 01/24/2016*

**Features:**

- Added {% url `cy.reload()` reload %} command which does a full page refresh. This is the same as the user hitting the 'Reload' button. Additionally it matches the same argument signature as `window.location.reload`.

**Bugfixes:**

- Fixed situation where {% url `cy.viewport()` viewport %} would not restore correctly between tests. Previously this would cause subsequent tests to be issued at the modified `cy.viewport()`. Now viewport is automatically restored to the settings in your `cypress.json` file.

**Misc:**

- Using {% url `.its()` its %} on a function or {% url `.invoke()` invoke %} on a property now logs a deprecation warning. In the next major release this will become a full error. It is valuable to make a distinction whether you're operating on a property vs a function, and this change improves overall readability with less confusion.
- Cypress deprecations and warnings are now prefixed with: `Cypress Warning:` to indicate this message is coming from Cypress

# 0.13.7

*Released 01/17/2016*

**Bugfixes:**

- Prevent error during element stringification on `<svg>`. Fixes {% issue 93 '#93' %}.
- Clarified on errors related to not being able to run in CI. Previously there was a "catch all" error indicating your Cypress API Key was invalid. This was oftentimes incorrect. More specific errors have been added.
- {% url `.type()` type %} has been upgraded to handle current selection ranges. Previously if an `<input>` had a selection range as Cypress began to type, this would be ignored. Cypress now takes this into account and will type over any selected text (as native typing would do).

**Misc:**

- All Cypress related services have been updated to use `https`. We are forcing `https` redirects for everything except for `api.cypress.io`, which would be a breaking change. By the next minor release we will force that as well. Once we make this change we will remove all versions below `0.13.7`. So make sure you **are not** locking the Cypress version when running in CI. We periodically remove old Cypress versions which have security flaws and this is an example of one.

# 0.13.6

*Released 01/09/2016*

**Features:**

- All commands now retry if the associated element is disabled until the element is no longer disabled. If the command times out a specific error message is now thrown.
- {% url `cy.server()` server %} and {% url `cy.route()` route %} now take an optional `onAbort` callback which fires anytime an XHR is aborted.

**Bugfixes:**

- Fixed edge case where XHR's which were already aborted were aborted a 2nd time when tests end. Cypress now only aborts currently running XHR's which have not already been aborted.
- When passing an array of aliases to {% url `cy.wait()` wait %} there was an edge case where an incorrect error message was being thrown. The incorrect values were a combination of the wrong alias, the wrong timeout value, or the wrong request or response. Now Cypress correctly provides all 3 of these values.

# 0.13.5

*Released 01/03/2016*

**Features:**

- Added new command: {% url `cy.go()` go %} which accepts `back`, `forward`, or an arbitrary Number.
- {% url `cy.go()` go %} enables you to navigate back or forward in your history. Cypress intelligently handles situations where moving forward or back causing a full page refresh, and will wait for the new page to load before resolving and moving onto new commands. It additionally handles situations where a page load was not caused (such as hash routing) and will resolve immediately.

**Misc:**

- Using `{force404: false}` will now output a warning explaining this is now the default option and can be removed safely.

# 0.13.4

*Released 12/31/2015*

**Features:**

- Added `waitForAnimations` and `animationDistanceThreshold` {% url 'configuration options' configuration#Animations %}.
- Cypress now automatically detects and waits for an element which is animating to stop animating. The threshold that Cypress considers *animating* is set to a distance of `5px` per `60fps`. In other words, if your element is moving too fast for a user to interact with, then Cypress considers the element animating and will wait until it finishes before attempting to interact with it. When we say 'interact' we mean apply command actions like {% url `.click()` click %}, {% url `.select()` select %}, {% url `.type()` type %}, {% url `.check()` check %}, etc. Waiting for animations prevents a series of edge cases and weird bugs where Cypress was interacting with elements **too** quickly which might cause undesired side effects in your application which are hard to track down. The downside to this implementation is that for every action Cypress must wait at least 2 run loops before applying actions. This slows down every action command by about `32ms`. If your app does not use animations you may wish to turn off this behavior in your `cypress.json` file.

**Bugfixes:**

- Prevent `undefined` error when attempting to {% url `.click()` click %} an element which is fixed position when it is covered by another element. Cypress now correctly provides why it cannot click the element in question. Fixes {% issue 90 '#90' %}.
- Prevent infinite loop in edge cases when checking whether an element was hidden.

**Misc:**

- The default behavior of {% url `cy.server()` server %} has changed from `force404: true` to become `force404: false`. In other words, Cypress will no longer forcibly send XHR's to 404 status when these XHR's do not match any existing {% url `cy.route()` route %}. This change better aligns with predictable usage for most Cypress users.

# 0.13.3

*Released 12/25/2015*

**Notes:**

- Merry Christmas everyone ;-)

**Features:**

- Overhauled the entire subsystem dealing with an element's visibility state. Previously we were simply using jQuery's `.is(":visible")` selector which was ineffective at truly determining when an element is "visible". Our changes now differ significantly from jQuery, but they match what a real user would consider visible, and the rules are fairly easy to explain. In other words these rules should just "make sense".
- An element is considered visible if it can be "interactive" with a user. In other words, if the user is able to click, type, drag, or otherwise physically interact with the element it is considered visible.
- Because of the additional complexities of how Cypress considers an element `visible`, we now have added the **exact** reason why an element is not visible when throwing an error. This means you'll see errors detailing whether an element or its parents have `display: none`, `visibility: hidden`, or whether an element is considered hidden because its effective `width` or `height` is zero. Whatever the reason, Cypress will indicate why your element is considered hidden.
- Exposed `Cypress.Dom.isHidden` which holds the logic for determining an element's visibility. Modify this to change the rules.
- Upgraded {% url `.select()` select %} to automatically retry when the `<select>` is disabled, its matching `<option>` is disabled, or when Cypress cannot find a matching `<option>`. This more correctly aligns with the behavior of other actions like {% url `.click()` click %}, which automatically retry until the element is ready to receive the action.

**Bugfixes:**

- Throw on {% url `.select()` select %} when it cannot find a matching `<option>`. Also throw when `<select>` or a matching `<option>` is disabled. Fixes {% issue 91 '#91' %}.
- "Hidden" elements which actually displace height or width are now highlighted when restoring the DOM when a command is hovered.
- Margin on zero client width / client height is now displayed correctly on command hover and more accurately mimics the way Chrome Dev Tools highlights elements.
- Using `history.back`, `history.forward`, or `history.go` in CI or in headless mode now works again.

**Misc:**

- The updated hidden rules apply to all assertions like `should("be.hidden")`, and how Cypress indicates an element is hidden displays in the Command Log.
- Updated many error messages to be more explanatory and precise.
- Elements which are stringified during errors now indicate their text content (truncated to 10 characters) `<button>Save</button>` or whether they contain children elements by indicating an ellipsis `<div>...</div>`.
- The {% url 'Routes instrument panel' route %} now displays the column: `Stubbed` instead of `Status`, which indicates whether a route is stubbing matching XHR's.

# 0.13.2

*Released 12/20/2015*

**Notes:**

- Docs have been updated for {% url `cy.wait()` wait %}, {% url `cy.route()` route %} and {% url `cy.server()` server %} to reflect these changes.

**Features:**

- Added `responseTimeout` {% url 'configuration' configuration %} value.
- {% url `cy.wait()` wait %} has been upgraded to now use two separate `timeout` values. In previous versions {% url `cy.wait()` wait %} used the `commandTimeout` and would automatically time out if the XHR did not achieve a response in that time frame. Now {% url `cy.wait()` wait %} will go through two independent timeout phases. At first {% url `cy.wait()` wait %} will wait for an XHR to be requested which matches its route. It will wait up to the value configured with `requestTimeout` (default 5000ms). After it sees a matching request it will then go into `response` waiting mode. It will wait up to the value configured with `responseTimeout` (default 20000ms). When {% url `cy.wait()` wait %} fails you now receive a much better error message indicating exactly which phase failed. Whether a request was never sent out, or whether it timed out waiting for a response. This gives you the best of both worlds and prevents situations where Cypress was timing out on slow servers. By creating new configuration values: `requestTimeout` and `responseTimeout` you can now directly control this behavior without affecting other regular commands.

**Bugfixes:**

- Prevent removing trailing new lines on fixtures after formatting.
- Added cache buster to test files which forces them to be reloaded in the `Sources` panel after making modifications. In previous versions when test files were live reloaded Chrome would not display their new contents due to a bug in Dev Tools. We've now worked around this issue.

**Misc:**

- Removed `{stub: false}` option from {% url `cy.server()` server %} and {% url `cy.route()` route %}. Cypress will now log a deprecation warning when you use the this option. Removing this option helps simplify the API because now Cypress can figure out whether you really want to stub the route based on whether you've provided a response or not. If you have not provided a response, the default behavior will be to not stub. If you do provide a response, Cypress will stub the route.
- Repurposed `requestTimeout` to now mean the time we wait for an XHR to be requested. Changed {% url `cy.request()` request %} to now use `responseTimeout` configuration value.
- Updated many error messages to be more consistent.
- Added special error messages when elements can not have actions applied to them with a suggestion to use `{force: true}`.

# 0.13.1

*Released 12/11/2015*

**Notes:**

- We are aware of issues running in CI with Linux builds, and are working through those issues.

**Bugfixes:**

- Prevent headless / CI from throwing errors on `history.pushState` and `history.replaceState`.
- Prevent edge case where `aliasing` in the command log was aliasing the wrong command
- Prevent XHR's from throwing errors on `arraybuffer` content. Properly set `xhr.responseBody` for `XML`, `blob`, and `arraybuffer`.
- Headless running is now fixed in OSX. This was due to a bug with app signing + unzipping via the CLI.

# 0.13.0

*Released 12/9/2015*

**Summary:**

- Though it may not look like much, this upgrade was a long time in the making. There were limitations in the way we were currently handling headless / CI builds which restricted our ability to make updates or fix bugs. Additionally CI runs would randomly crash for no good reason. We decided to split out the headless / CI process into its own independent Chromium application which is now independently controlled, and is much more reliable. This upgrade enables us to handle CI features coming down the pipe and was necessary for moving forward.

**Features:**

- Upgraded `Chromium` for headless and CI runs from `41` to `45`.
- You will now see better stack traces and errors during `cypress run` / in CI. No more `undefined is not a function` errors.
- Ported all links to use the new Cypress CDN.
- {% url 'Documentation to CLI' command-line %}.

**Bugfixes:**

- New chromium upgrade prevents synchronous XHR freezes.
- New chromium upgrade fixes situation where extremely long CI runs would sometimes randomly crash.
- Fixed problem with rewriting content on elements which contained `<svg>` elements.

**Breaking Changes:**

- Temporarily ignoring the `--reporter` option for headless / CI runs. Currently it is locked to the `spec` reporter, which is the default. This will be fixed in the next few patch releases.
- ~~Accessing `window.history.go()`, `window.history.back()`, `window.history.forward()` will throw an error during `cypress run` / CI. This is a regression that will be fixed - hopefully very soon.~~ This is fixed in [`0.13.3`](#0-13-3)
- While this new Chromium application passes our internal tests, it may crop up other regressions we aren't aware of. If you're experiencing different behavior in CI vs running locally in Chrome, this may be an indication of these.

# 0.12.8

*Released 12/2/2015*

**Features:**

- There is now a new {% url 'Error Messages Page' error-messages %} which will provide additional explanation when you are getting errors from Cypress. These errors will be directly linked to (like how Angular provides errors).
- Instead of hard coding external documentation, we now link everything through a redirection portal. This will prevent any links / documentation from ever breaking due to reorganization or renaming.
- Cypress now throws a specific error message (with a link to further explanation) if you attempt to run commands outside of a test. Usually this happens accidentally when you write `cy.commands` inside of a `describe` or `context` block instead of the `it`. I've wasted too much time and almost bombed entire presentations / demos so I've finally stopped this from ever happening again. If you ever see this error message, trust me, you will forever thank me.
- The error message: `Cannot call cy.method() because the current subject has been removed or detached from the DOM.` has been rewritten to provide much clearer information on why this is happening, including a string representation of your DOM element. Additionally it will have its own error page dedicated to explaining how this happens and what you can do to prevent it.

**Misc:**

- Rewrote error message which is displayed when Cypress cannot parse your test / spec file. Now a list of suggestions are given and an external link is provided which further explains how this may happen.
- Clarified the "Default Message" page when you have not {% url `cy.visit()` visit %} your application yet.
- Whitelisted `.coffee`, `.scss`, `.less` XHR's from displaying in the Command Log.

# 0.12.7

*Released 11/30/2015*

**Bugfixes:**

- Prevent passing `{multiple: true}` incorrectly showing up in Command Log. Fixes {% issue 88 '#88' %}.
- Properly whitelist resource like XHR's which have query params such as jquery's `{cache: false}` option.
- Correctly take into account `<base>` tag on XHR's. Fixes {% issue 89 '#89' %}.

# 0.12.6

*Released 11/29/2015*

**Features:**

- There are now {% url 'Getting Started' installing-cypress %} docs including {% url 'configuration' configuration %} for `cypress.json`
- Cypress now silently restarts the server whenever it detects a change to `cypress.json` - meaning you no longer have to manually reboot the server for changes to be picked up.
- There is a new {% url `Cypress.config` config %} interface - akin to {% url `Cypress.env` env %} which provides access to configuration values.

**Bugfixes:**

- Setup/Teardown code was not properly running on nested mocha `before`hooks which caused the error: `The XHR server is unavailable or missing...`. Fixes {% issue 80 '#80' %} and {% issue 86 '#86' %}.
- Prevent accidental mutation of {% url `cy.server()` server %} options when {% url `cy.route()` route %} was provided options. Fixes {% issue 84 '#84' %} and {% issue 85 '#85' %}.
- Using {% url `cy.title()` title %} would incorrectly search the `<body>` for title elements, and is now restricted to only searching in the `<head>`
- Cross-Origin requests are now proxied by Cypress. In other words their URL's are transparently rewritten which bypasses CORS problems. This is a quick fix which should satisfy most of the problems users were having with CORS requests. However there is a much bigger change coming in `0.14.0` where the entire proxy layer will be rewritten to accommodate CORS, `window.fetch` and `domain cookies` flawlessly. As it stands Cypress is prone to errors in complex setups.

**Misc:**

- Exposed `visitTimeout` and `requestTimeout` {% url 'configuration' configuration %}.
- Increased `visitTimeout` from `20s` to `30s`.
- {% url `.click()` click %} will now throw if you are attempting to click more than 1 element. Pass `{multiple: true}` to enable this behavior again. Each element will be clicked serially and inserted into the Command Log.

# 0.12.5

*Released 11/22/2015*

**Features:**

- Errors reading / writing `cypress.json` on project add are now displayed inline.

**Bugfixes:**

- Prevent app crashing when `cypress.json` could not be read or written to when adding a project.

**Misc:**

- App crashes now send a full stack trace (instead of 10 line truncation).
- Better error handling + error messages when trying to read / write from `cypress.json`.

# 0.12.4

*Released 11/19/2015*

**Features:**

- There is a new {% url `Cypress.Cookies` cookies %} interface which enables you to `get`, `set`, and even `preserve` cookies throughout your test. Useful to preserve cookie-based sessions between your tests. {% url 'Documentation is written here' cookies %}.

**Bugfixes:**

- Removed problematic `content-security-policy` headers
- Fixed situation where Cypress was not injected correctly when `<head>` tag had attributes
- Prevent fixtures from being accidentally overwritten and having their content blanked out. There was a very subtle chance due to node's async file writing that as a file was being written with a formatted fixture, that another call to the same fixture would read in at that exact moment. If this happened the 2nd read would resolve with zero bytes, which would then end up rewriting the file back with zero bytes.

**Misc:**

- `alerts` are automatically accepted now and a message logs to the console.
- Added retina favicon. Fixes {% issue 83 '#83' %}.
- Removed nested `cypress` object in the `cypress.json`. Existing `cypress.json` files are transparently rewritten on the next server boot, so you can check in the modified `cypress.json` and all will be well. Fixes {% issue 82 '#82' %}.
- Improved performance of formatting fixtures.

# 0.12.3

*Released 11/04/2015*

**Bugfixes:**

- Prevent {% url `.pause()` pause %} from actually pausing during `cypress run`.
- Fix for {% url `cy.request()` request %} SSL issues when host certificates were self signed.

# 0.12.2

*Released 11/01/2015*

**Features:**

- There is now a `cy.cmd` and `cy.command` method which enables you to invoke commands by their string name. This is most useful when using *namespaced* custom commands. So `Cypress.addParentCommand("dashboard.setSlider", ...)` can be accessed by `cy.cmd("dashboard.setSlider", arg1, arg2)`. (Docs have not been written yet).
- `Environment Variable` support has been added and can be accessed in your tests with {% url `Cypress.env` env %}. The docs have been written {% url 'Environment Variable' environment-variables %} and {% url 'here' env %}.

**Misc:**

- The `URL` property on all XHR's is now completely decoded, even on URL's which were originally encoded. The reason is for easier assertions and debugging. This `URL` property is specific to Cypress and does not actually affect the underlying XHR.

# 0.12.1

*Released 10/28/2015*

**Bugfixes:**

- {% url `cy.route()` route %} will no longer throw that a response is needed when using {% url '`cy.server({stub: false})`' server %}.
- Applying server defaults to `Cypress.Server.defaults({})` now {% url 'works as documented' cypress-server %}.
- `onRequest` and `onResponse` can now be correctly set as permanent server defaults.
- XHR `URL` is now decoded to make assertions easier. Fixes {% issue 75 '#75' %}.

# 0.12.0

*Released 10/23/2015*

**Summary:**

- XHR handling has been rewritten to be much more flexible, extensible, and future-proof.

**Breaking Changes:**

- The object you receive after waiting on an XHR alias is now different. Previously this was a `FakeXMLHttpRequest` object which came from `sinon`. Now it is a special `XMLHttpRequest` object which comes from Cypress. You may need to rewrite some of your assertions but we've tried to keep the signatures as close as possible.
- The XHR's `url` property will now always return you a `Fully Qualified Domain Name` including the origin, port, host, etc. Previously the `url` property represented whatever the `XHR` was opened with. We've worked around this difference by when checking whether an XHR should be stubbed, the origin is tested both as present and omitted.

Deprecations:
- Accessing `requestJSON` or `responseJSON` on XHR objects is deprecated, and will be removed in the next version. Accessing those properties will throw a warning which explains how to rewrite these.
- `cy.respond` is *temporarily* deprecated because the semantics of how this works is completely different and will require more work (mentioned later on) before this can be re-enabled again.

**Features:**

- All XHR's (regardless of whether they are stubbed or not) are now logged in the Command Log. Stubbed XHR's display as "XHR Stub" vs vanilla "XHR".
- Stubbed XHR's will now show up in the `Network Tab` in Dev Tools. In other words they will *really* go out and you'll be able to inspect them just like regular XHRs.
- Regular XHR's can now be aliased and waited on without actually being stubbed by passing `{stub: false}` to the {% url `cy.route()` route %}.
- XHR's will continue to work correctly even *after* a test ends. In previous versions, due to replacing the entire XHR object, your application would not work correctly after a test ended. This prevented you from "navigating around" and working with your app after the tests end.
- Servers can now be disabled in the middle of a test. Previously once a server was started all XHR's would be stubbed.
- You can now disable the force sending of `404` to all XHR's which are not stubbed. This allows you to mix and match, enabling some requests to be stubbed and others to hit your server and respond normally.
- The default XHR configuration can now be overwritten in a single area.
- Many new configuration options are available for controlling how XHR's are stubbed.
- XHR's now include an `Initiator` stack regardless of whether they're stubbed. The `Initiator` stack includes the stack which caused the XHR to be created and sent.
- The `onConsole` information related to an XHR has been updated to make it easier to understand why a route was or was not stubbed, and its associated request and response headers.
- Response headers on XHR stubs will now automatically set their `Content-Type` based on the stub response. Previously this would always set to the `Content-Type` to `application/json`. Now if you force a response to be text or html, the `Content-Type` response header will be set appropriately.
- You can now force other additional response headers to be sent on stubbed XHRs.
- XHR's now snapshot twice - when the request is made and when the response is returned.
- Removed sending `sinon` on every {% url `cy.visit()` visit %}.
- The XHR object which is returned to you to via {% url `cy.wait()` wait %} is now more consistent with other return values such as {% url `cy.request()` request %}. It should be much easier to work with `request body`, `request headers`, `response body` and `response headers`.

**Bugfixes:**

- Routes no longer display as duplicated in between test runs when {% url `cy.server()` server %} is started prior to a {% url `cy.visit()` visit %} and you cause a full page refresh, which caused all routes to be re-bound.
- Any issues related to `requestJSON` or `responseJSON` being duplicated are now fixed. Fixes {% issue 65 '#65' %}.
- Fully Qualified XHR's which should be proxied are now correctly transparently rewritten to prevent CORS problems.
- {% url `cy.route()` route %} - `onRequest` and `onResponse` callbacks are now called with `cy` as the context.
- Whitelisting assets which should never be stubbed has been improved. Now `.jsx` templates pass-through correctly.
- CORS Network Errors are now correctly caught.

**Misc:**

- All `ng` based commands now display in the Command Log.
- The built in XHR response delay has been removed since now all requests really go over the HTTP stack, which inherently has its own delay. You can still optionally force responses to be delayed by a set amount.

Almost there:
- Support for the native `fetch` object.
- Configuration to automatically force Cypress to wait for outstanding XHR's (like it does for other Page Events). This would mean when testing more traditional apps without XHR stubbing, commands would automatically wait until all outstanding XHR's complete. The internal retry loop needs to be rewritten to make this possible, but the XHR architecture is now there.

# 0.11.13

*Released 10/08/2015*

**Bugfixes:**

- Prevent rejected promise from causing error about invalid API key during a CI run.

**Misc:**

- Better error handling of rejected promises.

# 0.11.12

*Released 10/07/2015*

**Features:**

- Snapshots can now be named and a command can have multiple snapshots.
- Multiple snapshots are now cycled automatically on hover, and the name of the snapshot is displayed.
- Most of the action commands now take multiple snapshots (giving you a precise look at an action prior to it happening, and then afterwards).

**Bugfixes:**

- Fixed situation where an `Uncaught Error` was not being properly handled. Cypress would incorrectly continue to retry commands instead of anceling them, which lead to incorrect errors downstream in other tests.
- Fixed situation where an error being thrown from an XHR was being improperly handled (in a slightly different way than the problem above).
- Stopped sending CI data when {% url '`cypress run`' command-line#cypress-run %} was issued.

**Misc:**

- CSS Improvements

# 0.11.11

*Released 10/04/2015*

**Bugfixes:**

- Snapshots of {% url `.type()` type %} and {% url `.select()` select %} are no longer incorrect due to aking snapshot too early. Fixes {% issue 22 '#22' %}.
- Passing `{force: true}` to {% url `.blur()` blur %} now logs correctly in the Command Log.

**Misc:**

- Added delays on some tooltips.
- The URL will now highlight in a yellow background during a revert DOM snapshot.
- Moved snapshot message to be affixed to the bottom of the remote app in preparation for cycling through multiple snapshots.
- Cleaned up the URL by removing some unused content.

# 0.11.10

*Released 10/04/2015*

**Features:**

- {% url `.blur()` blur %} now accepts `{force: true}` which removes error checking such as validating the element is urrently in focus.

**Bugfixes:**

- {% url `.pause()` pause %} is now noop during {% url '`cypress run`' command-line#cypress-run %} or `cypress ci`.

**Misc:**

- Removed `cy.inspect` command.
- Added Cypress logo to nav.
- CSS changes.

# 0.11.9

*Released 10/03/2015*

**Features:**

- Added `.zip` as acceptable fixture extension. Content is sent back as `base64`.
- Added docs to nav, consolidated `organize` into `tests`.
- Added favicon.
- Added tooltips everywhere.
- Created new debugging command: {% url `.pause()` pause %} which will pause executing commands and allow you to resume or tep into the next command one at a time.
- You can now stop and restart tests from the UI.
- Added `cy.Blob` utilities for `blob` / `string` / `base64` conversion. Useful for manually handling uploads.

**Bugfixes:**

- "Cannot revert DOM while tests are running" now removes itself correctly.
- Aliased DOM objects are now correctly stored on the test's `ctx` as instances of **your** jQuery (if one exists).

**Misc:**

- Updated UI styles / tests list / run all.
- Fixed alt tray icon so it shows up correctly on click.

# 0.11.8

*Released 09/25/2015*

**Features:**

- Added {% url `cy.request()` request %} command which can issue XHR requests. The request is generated outside of the rowser, and bypasses all CORS restrictions. Great for talking to an API for seeding, querying, building, etc.

**Bugfixes:**

- Prevented edge case with {% url `cy.fixture()` fixture %} where it would not be able to be cancelled without throwing an nhandled rejection error.

# 0.11.7

*Released 09/25/2015*

**Bugfixes:**

- The debug window now works again.
- Changed `Linux` build strategy which fixes not saving the internal `.cy cache`. Also fixes not being able to update from the GUI. Fixes {% issue 66 '#66' %}.

# 0.11.6

*Released 09/25/2015*

**Bugfixes:**

- Viewport is now properly restored to the default width / height after on subsequent runs. Previously it would retain the last viewport sized sed until there was a new viewport command.
- {% url "`cy.should('contain', '...')`" should %} now correctly escapes quotes and single quotes.
- Assertion messages are no longer truncated, and instead will scale down by reducing the `font-size` and `line-height` after they exceed 110 characters. So you'll now always see the full assertion message.
- Fixed some scenarios where assertions would not be logged as a child command.
- Assertions based around the `window` or `document` object no longer cause `chai` to bomb on formatting their object structures (due to yclic references) and instead now will show up as `<window>` and `<document>`.

**Misc:**

- {% url `cy.window()` window %} now logs out to the `Command Log` and additionally verifies upcoming assertions.
- {% url `cy.document()` document %} now logs out to the `Command Log` and additionally verifies upcoming assertions.
- Removed `numElements` label on assertions which indicated the number of elements found if > 1. This was annoying and redundant since the inked command already had this number.

# 0.11.5

*Released 09/20/2015*

**Features:**

- The `Linux` version of Cypress now works correctly for GUI Desktop versions (tested on Ubuntu Desktop). Previously it would only worked during `cypress run` in server versions. The `tray` used in OSX does not work with the `Linux`, so in `Linux` we just use a standard window + menu.
- Added Desktop Icon.

**Bugfixes:**

- Cypress now forces the initial {% url `cy.visit()` visit %} not to be cached by the browser. This was incorrectly being ached which meant when you changed the {% url `cy.visit()` visit %} it would not actually go out and fetch the new contents. reviously you had to check `Disable Cache` in the `Network Tab` inside of Chrome to prevent this bug. Unfortunately this has a significant erformance drawback. If you use a {% url `cy.visit()` visit %} before each test you will notice a degrade in performance ecause this request is no longer cached. This is a temporary problem until Cypress implements a more sophisticated caching strategy which ptimizes these concerns. There is a lot to improve in this arena but it will take more time before it's implemented.
- {% url `.should()` should %} will no longer throw an error when it is used as a `parent command` and has a callback unction signature, and that callback function throws outside of an assertion. Instead now it logs correctly, handles the error, and displays his error for you.

**Misc:**

- Many additional tests added to the multi-os deployment process.
- When Cypress opens other windows they are now auto-focused.

# 0.11.4

*Released 09/17/2015*

**Features:**

- {% url `.should()` should %} now accepts a callback function which will be retried until it does not throw. The callback unction will be retried in the exact same way as passing regular string-based chainers to {% url `.should()` should %}. aving a callback function gives you an opportunity to *massage* the expected subject such as comparing multiple elements, creating an array of ext or classes, etc.

Deprecations:
- `cy.wait(function)` has been deprecated and you can safely rename this command to {% url `.should()` should %}.

**Misc:**

- All of the docs surrounding {% url 'assertions' introduction-to-cypress#Assertions %}, {% url `.should()` should %}, and {% url `.and()` and %} have been updated to reflect the new API.

# 0.11.3

*Released 09/16/2015*

**Features:**

- When XHR's are aborted Cypress will display the stack trace indicating where in your app the XHR was aborted. Additionally it will display s `(aborted)` in the command log.

**Bugfixes:**

- XHR's will no longer be ended early and display no status as if there was no response. Fixes {% issue 63 '#63' %}.
- XHR's which are aborted no longer cause an `INVALID_STATE_ERR` to be thrown. Fixes {% issue 62 '#62' %} and {% issue 34 '#34' %}.
- Cypress will no longer incorrectly revert to a previous test run's snapshot when tests are re-run.

# 0.11.2

*Released 09/14/2015*

**Bugfixes:**

- Prevented bug where the assertion message: `expected <x> element to exist` would log over and over again when Cypress retried querying for a OM element.

**Misc:**

- {% url `.root()` root %} now outputs its subject when clicking on its command log. Fixes {% issue 55 '#55' %}.

# 0.11.1

*Released 09/14/2015*

**Bugfixes:**

- Utilizing {% url `cy.server()` server %} across multiple tests before a {% url `cy.visit()` visit %} now orks correctly. As a side effect now Cypress will rebind both the `server` and all `routes` **whenever** the remote window is reloaded (for hatever reason) - even during a test itself. This means you can navigate between pages without ever having to restart the server or routes (hey will automatically rebind) when the window loads. Fixes {% issue 59 '#59' %}.

**Misc:**

- Providing a "number-string" as in: `should("have.length", "1")` will no longer throw an error.
- Internal API changes for `$Commands`.

# 0.11.0

*Released 09/13/2015*

**Summary:**

- This release marks a major change in the underlying algorithms used to prevent testing flake. It is a major goal of Cypress to combat and revent **all** test flake. These algorithm changes go a long way towards making this a reality, and have been months in the making.
- Cypress can now predict upcoming assertions and modifies its behavior until the intended state has been reached.
- Command options `exist` / `visible` / `length` have been deprecated, these were confusing and limiting, and the same result can now be chieved using normal assertions. The end result is much more robust and much easier to understand.

**Features:**

- Commands which precede assertions will now look downstream at those assertions and not resolve until their subject's state passes all ssertions. Previously this was **sort of** implemented using *Command Options* and the `eventually` flag, but now this is the default ehavior. *Command Options* only worked on DOM-based subjects, and now the new assertion verification works on everything else (including RL-based commands, etc). What this means is that Cypress can predict what you are requesting and automatically modifies its behavior until his state is reached. This prevents test brittleness / random test flake. Additionally this removes ever having to use {% url `cy.wait(Number)` wait %} or `cy.wait(Function)` (though this is still a valid command). As a side effect, you will now see commands + heir assertions in the spinning pending blue state. When assertions fail their associated command also fails at the same time. This visually represents the coupling between these two concepts. Another side effect is that `timeout` options do not need to be provided on the succeeding assertions, and can instead just be provided on the proceeding command. All of the coupled assertions will automatically be retried to the maximum `timeout` setting. Fixes {% issue 43 '#43' %}.
- Action commands will now insert an artificial delay after resolving to enable modern JavaScript frameworks time to *flush* their run loops. snapshots are delayed until after the action, resulting in more accurate snapshots because JavaScript frameworks would not process these DOM vents until `N` milliseconds after they occurred. This has the unfortunate side effect of *decreasing* performance by about *5-10%* but the and result is that it is much easier to debug and Cypress is less prone to flake caused by modern JavaScript frameworks. This change comes after collecting many data points and this was one of the easiest changes that help reduce flake. For users that don't use the latest and greatest JavaScript frameworks, this action delay can be reduced through `cypress.json` which may speed up large test suites.
- Aliasing custom commands now intelligently figures out where to apply the alias without being specified inside of the actual custom command.
- The algorithm for replaying aliased commands is now much more accurate, handles stale element references better, and will not replay commands which have a side effect (like action commands). The end result is Cypress will now almost always find the desired element by determining the minimum number of re-queries and is not susceptible to stale element references. Additionally using assertions on aliased elements now works (where previously using a *Command Option* on an alias would just be ignored. This was crazy difficult to implement but should be 100% solid. Fixes {% issue 36 '#36' %}.
- Assertions which actually produced 2 assertions (under the hood) such as `should('have.attr', 'href', '/users/1')` will now only log the 2nd assertion, unless the first fails.
- Previously using `eventually.have.length` was impossible (and this would throw an error), but now this works as you'd expect with the default `should('have.length')`.

**Bugfixes:**

- Aliased commands now correctly output a command log again when they are replayed.
- Assertions that involved an `{exp}` property are no longer incorrectly substituted with the `#{this}` subject.
- Removed special logic for *Angular* which tapped into its digest cycle for queueing commands. This had unpredictable results when there was n `interval` set, and is now superseded by the new queueing system anyway (which is more performant).
- `Sinon's` formatting of failed `spy` or `stub` calls is horrendously non-performant and would sometimes choke the CPU for several seconds. his formatting has been completely removed and will be replaced by something less insane later on. At the moment you can still use the built n Cypress debugging (clicking on a command log, etc) to see what the actual values were. Fixes {% issue 18 '#18' %}.

**Misc:**

- The internal retry loop of Cypress now runs at `60fps`, instead of `20fps`.
- Cypress overrides chai's default inspection function for DOM elements meaning instead of seeing `{ Object (0, length, ...) }` you will now ee the nicely formatted Cypress DOM element like: `<button#primary.btn-large>`.
- Cypress now overrides chai's `match` chainer and provides a specific error message when a non `regex` value is provided. Fixes {% issue 58 '#58' %}.
- Cypress now handles `length` and `exist` assertion chainers in a very specific way, providing a detailed message on failure, and utomatically slices out any stale element references.
- The `contain` assertion chainer from `chai-jquery` has been extended to match the same selector logic as {% url `cy.contains()` contains %} - meaning it now checks the `value` of `input[type=submit]`.
- Tweaked the label for displaying the number of elements a command resolved with (now displays 0 differently than > 1).
- Removed the `eventually` flag in assertions as now this is the default behavior on normal assertions.
- Deprecated all *Command Options*. You will see a very nice and simple error message explaining how to convert these to assertions.
- {% url `.within()` within %} can now be silenced with `{log: false}`.
- Many error messages have been rewritten to be much more fluent and easier to understand.

**Other News:**

- Cypress is currently seeking to raise a Series A. This will enable us to grow the team and speed up development but seeking it has come at a ost for current development speed. If you have any VC connections [please send them our way](mailto:support@cypress.io).

# 0.10.8

*Released 08/21/2015*

**Features:**

- Reporters in CI can now be specified.
- Added `teamcity` reporter.

# 0.10.7

*Released 08/16/2015*

**Features:**

- Port can now be specified as a CLI argument and will override any values stored in `cypress.json`.

**Misc:**

- When running through the CLI, Cypress will now display an error if the server's port is currently in use. Previously this would not output an rror and the process would just hang.

# 0.10.6

*Released 08/15/2015*

**Bugfixes:**

- Fixed edge case where Cypress would not correctly handle `POST` or `PUT` requests with a `JSON body`. These requests would just hang and ventually time out.

**Misc:**

- Project ID's can be programmatically set now.

# 0.10.5

*Released 08/13/2015*

**Bugfixes:**

- Running a specific test won't open/close immediately when starting up (fixes weird flickering effect).
- {% url `.check()` check %} and {% url `.uncheck()` uncheck %} commands will now correctly "end" even if they were `noop` due to the element already being in a checked or unchecked state.

**Misc:**

- Currently running tests now display a spinner to indicate they are currently running.
- Optimized performance of command lists.
- Commands which were silenced with `{log: false}` will now always display in the Command Log if they were part of a replayed chain of commands ue to an alias reference becoming stale. Previously they would not display which was very confusing.
- `sinon.js` is no longer minified.

# 0.10.4

*Released 08/11/2015*

**Bugfixes:**

- The OSX Cypress App was not being properly signed (since 0.10.0) due to an oversight in our deployment process. This has been fixed now and dditional checks have been added to ensure the deploy'd version is properly signed. Updating within the app was unaffected. This bug only ffected fresh downloads from the internet.
- Errors / crashes encountered when updating to newer versions through the app should be fixed now.

# 0.10.3

*Released 08/10/2015*

**Bugfixes:**

- Cypress Errors in `hooks` (beforeEach, etc) will no longer cause Mocha to fire its `end` event thus ending the entire run. In CI, this would ause the test suite to end early. Uncaught Mocha errors will however continue this behavior. Cypress does not yet have a "skipped" visual state or tests which were skipped, so at the moment it may look a little strange and unpredictable.

**Misc:**

- Tweaked clicking algorithm to re-verify an elements visibility anytime the click retries its `retry` logic. Previously this check only appened once at the beginning of the click.
- In CI, the window size (not the viewport) has been changed from `1024x768` to `1280x720`. This will only affect `screenshot` artifacts which re taken automatically with {% url `cy.screenshot()` screenshot %} (coming soon) or whenever a test fails (also coming soon).

# 0.10.2

*Released 08/10/2015*

**Bugfixes:**

- Memory Optimizations in CI.
- Reduce noise in logs.
- Prevented external NODE_ENV mutations causing problems in CI.

**Misc:**

- Better error tracing.

# 0.10.1

*Released 08/07/2015*

**Bugfixes:**

- Fixed missing dependency for CI.

**Misc:**

- Cypress now logs out your project's API key on a failed CI run.

# 0.10.0

*Released 08/06/2015*

**Summary:**

- Cypress is now able to run all the tests, run in the terminal, and includes support for Linux and CI. Additionally, most of the functionality of he GUI Desktop App can now be accessed through command line arguments.
- Because each operating system requires a specific build of Cypress - a new CLI tool has been created which abstracts away these differences and orchestrates the Desktop App regardless of which OS you are running.
- This {% url "CLI tool is now published on NPM" https://www.npmjs.com/package/cypress %}, though the documentation still needs to be written.
- There is now a download service to access the latest version of Cypress and previous versions.
- Cypress aims not only to make it easier to write tests, but after you build a test harness, it will make it easier to dive into failed tests (hat run in CI). This release paves the way for providing after-run results and allowing you to dive into those failures.

**Breaking Changes:**

- Due to security upgrades, adding projects in previous versions will no longer work. Upgrade and everything should be okay.

**Features:**

- The latest version of Cypress can be downloaded here: {% url "http://download.cypress.io/latest" http://download.cypress.io/latest %}.
- Cypress can alternatively be downloaded / installed / managed through the CLI utility.
- Cypress can now be run through the terminal.
- You can now run all of your tests inside of the GUI App.
- You can use the CLI tool to run Cypress in CI. The documentation for this needs to be written, but it will be very simple to do. You will robably only have to write 2 lines in your CI scripts to run Cypress.
- You can configure CI to use any reporter built into Mocha, and additionally we are adding JUnit XML output (for Jenkins) as a built in default.
- You can write your own custom reporter which Cypress can use in CI.
- Console output from your apps is suppressed while running in the terminal.

**Bugfixes:**

- Several security problems with projects have been closed in preparation for running in CI.
- Extensive memory profiling has been done and Cypress has implemented several strategies for aggressively causing garbage collection. The ebugging tools (which allow you to walk back in time through DOM snapshots, or access objects from previous tests) could exhaust all available emory in previous versions. This likely never affected most users, but if a user ran 1000's of tests (which have been written in Cypress) it ould bomb. Now Cypress only stores data for up to 50 tests, and will begin purging data past that. When run in the terminal, Cypress doesn't apply any of its debugging tools, so CI will be unaffected.
- Several instances of memory leaks were plugged up.

**Misc:**

- Everything except for the `cypress driver` is now minified.
- Some users have reported problems upgrading previous versions. This is because we changed the name from "cypress" to "Cypress" including some inaries. If your upgrade does not finish you can simply redownload the latest version of Cypress or use the CLI tool to reinstall it.
- Our build and testing processes have been upgraded to accommodate Linux builds.
- Sinon object formatting during errors has been suppressed (when using spies/stubs) due to its horrendous performance when comparing deeply nested objects. This means you won't see the (mostly) useless error output from Sinon, but given Cypress debugging tools you can still inspect objects and figure out what went wrong.

# 0.9.6

*Released 07/27/2015*

**Bugfixes:**

- Fixed server crash on improperly handled proxy error.
- Upgraded logic to redirect back to the Cypress client app on manual URL changes.

# 0.9.5

*Released 07/14/2015*

**Features:**

- {% url `.click()` click %}, {% url `.type()` type %}, {% url `.clear()` clear %}, {% url `.select()` select %}, {% url `.check()` check %}, {% url `.uncheck()` uncheck %} now will wait for the subject to automatically become visible instead of throwing immediately if the element is not in a visible state.

**Misc:**

- Swapped out ugly nonsense `refresh` icon to `square-o` to represent a test which has not run yet.

# 0.9.4

*Released 07/06/2015*

**Features:**

- {% url `cy.contains()` contains %}, {% url `cy.get()` get %}, and `traversal commands` will now all log out heir last known `$el` on failure. This means the `$el` will be highlight during Command Log hovering, and will display in the console on click. his should make debugging failed DOM based commands much easier. Fixes {% issue 52 '#52' %}.

**Bugfixes:**

- Fixed edge case with {% url `cy.contains()` contains %} and command options `visible` and `exist` where it would always fail ven though the matched element was in the correct state.

**Misc:**

- {% url `cy.contains()` contains %} now throws when provided the command option: `length` because it will only ever return 1 element.

# 0.9.3

*Released 07/06/2015*

**Features:**

- Proxied jQuery: `$` onto `cy` as `cy.$` and specific class methods: `Event`, `Deferred`, `ajax`, `get`, `getJSON`, `getScript`, `post`.
- Proxied `moment` onto `cy` as `cy.moment`.
- The `url` will now automatically be restored when hovering over the Command Log to indicate the state of the URL at the time the command ran.
- {% url `.click()` click %} now accepts an optional: `position` argument (`center`, `topLeft`, `topRight`, `bottomLeft`, `bottomRight`). Center is still the default.
- {% url `.click()` click %} now accepts an optional `x` and `y` coordinate argument, which is relative to the top left corner of the element. Fixes {% issue 50 '#50' %}.
- {% url 'Click docs have been updated' click %} to reflect these changes.

**Bugfixes:**

- `onBeforeLoad` and `onLoad` callbacks to {% url `cy.visit()` visit %} are now invoked with `cy` as the context.
- Cypress logo now displays in `About Page`.

**Misc:**

- Internal refactoring to `Cypress.Mouse`.

# 0.9.2

*Released 07/04/2015*

**Features:**

- Added `About` page in desktop application annotating the current version.
- {% url `cy.fixture()` fixture %} now supports these additional extensions: `.html`, `.txt`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.tif`, `.tiff`.
- Image fixtures will be sent back as a `base64` string.
- Html fixtures will be prettified and saved back over the original.

**Misc:**

- Added more tests around various areas of the desktop application and ID generator.

# 0.9.1

*Released 07/03/2015*

**Features:**

- {% url `cy.viewport()` viewport %} can now accept an `orientation` when providing a `preset`. Valid orientations are `landscape` and `portrait`.

**Bugfixes:**

- The scaffolded `spec_helper.js` now correctly returns its object literal in the `onConsole` callback.
- {% url `.type()` type %} now correctly logs its message to the Command Log when provided options.
- {% url `.type()` type %} has been upgraded to handle situations where as it's typing, 3rd party code mutates the value either synchronously or asynchronously. The caret is automatically moved to the end position matching browser behavior.

**Misc:**

- Deprecated `Cypress.command`, instead use `Cypress.Log.command` to output a Command Log. Updated scaffolding on new projects to reflect this change.
- {% url `cy.contains()` contains %} now outputs much more explicit error messages when given command options. Fixes {% issue 49 '#49' %}.
- {% url `cy.route()` route %} no longer validates `response` value when `{respond: false}` is passed in as options. Fixes {% issue 48 '#48' %}.
- {% url `.invoke()` invoke %} and {% url `.its()` its %} will now log out the $el if it's a DOM object, which will now correctly highlight the $el during a command revert. Additionally if these commands have been called on a DOM object, their `onConsole` message will include the DOM objects.

# 0.9.0

*Released 07/02/2015*

**Summary:**

- {% url `cy.viewport()` viewport %} is a new command which will resize the viewport to a specified width and height. There is ow a default `viewport` size of `1000x660`.

**Features:**

- Your application's viewport dimensions will now automatically scale to fit regardless of your screen's size. This enables you to test resolutions larger than what your screen is capable of displaying. Additionally this fixes edge cases caused when there was a difference in viewports between users.
- The viewport's dimensions will now dynamically display accurately as they are changed in the header area.
- The viewport's scale will now dynamically display accurately as it is changed.
- Each command will automatically restore the viewport to the dimensions at the time the command was issued. In other words, scrolling over each command will restore exactly what Cypress "saw" when it issued the command.
- Several common viewport presets have been added for convenience

**Misc:**

- Cypress now requires a viewport to be issued at all times. By default it is `1000x660` but can be changed in your `cypress.json` file with he keys: `viewportWidth` and `viewportHeight`.

**Bugfixes:**

- Scrollbar styling is no longer hijacked by Cypress.

**Misc:**

- Updated remote application iframe styles.

# 0.8.1

*Released 06/30/2015*

**Bugfixes:**

- {% url `.select()` select %} will now fire a `focus` event on the `<select>` even if the window isn't in focus.
- {% url `.click()` click %} has been upgraded to be more intelligent about firing `focus` events, and now takes into account the previously focused element.
- {% url `.type()` type %} and {% url `.clear()` clear %} will not issue `change` events or `focus` events unnecessary when chaining together multiple actions which do not change the element or cause it to lose focus. Fixes {% issue 47 '#47' %}.

# 0.8.0

*Released 06/26/2015*

**Summary:**

- {% url `.type()` type %} now implements all DOM events to simulate every aspect of typing on a real keyboard.
- All of the [type docs have been updated](/api/commands/type.html) to reflect these changes.

**Features:**

- {% url `.type()` type %} now outputs "Key Events Table" which is a `console.table` of every key typed, the `charCode`, all vents that fired, and whether any were `preventedDefault`.
- {% url `.type()` type %} now accepts the following special character sequences: `{selectall}`, `{del}`, `{backspace}`, `{esc}`, `{% raw %}{{{% endraw %}}`, `{enter}`, `{leftarrow}`, `{rightarrow}`.
- {% url `.type()` type %} implements `cursor` and `selection` and `range` accurately like a real keyboard.
- {% url `.type()` type %} now fires change events exactly like real browsers when `{enter}` is used.
- {% url `.type()` type %} will fire `textInput` and `input` events exactly like a real browser. Fixes {% issue 7 '#7' %}.
- {% url `.type()` type %} now follows all of the spec in regards to `preventingDefault` on any event that would insert a character such as `keydown`, `keypress`, `textInput`.
- {% url `.type()` type %} events should be `100%` identical to real browser `KeyboardEvents` including `charCode`, `which`, `keyCode`, `data`, etc.
- {% url `.type()` type %} now inserts a small delay `10ms` between each keystroke to simulate a real user typing.
- `input` events are now correctly fired when {% url `.select()` select %} chooses an `<option>`.
- `change` events are now fired exactly how a browser does (when an input loses focus and its value has changed since its last focus event). You'll see these fire after you use {% url `.blur()` blur %} directly, or use another `action command` on another element.

**Bugfixes:**

- Using {% url `.type()` type %} in an `input[type=number]` will no longer prepend the value. Fixes {% issue 26 '#26' %}.
- `[contenteditable]` elements can now be focused and blurred.
- `aborting` during {% url `.click()` click %} / {% url `.dblclick()` dblclick %} now correctly cancels remaining queued click/dblclick events.

**Misc:**

- `console.groups` are now collapsed by default.
- {% url `.type()` type %} now validates the chars and will throw on anything other than a string or finite number.
- {% url `.type()` type %} now throws on empty strings.
- Removed several libs that used to handle typing simulation and rewrote typing from scratch.

# 0.7.6

*Released 06/23/2015*

**Bugfixes:**

- Prevent infinite loop due to a trifecta of rare circumstances with {% url `.click()` click %}. Clicking will now retry sync after it attempts to scroll past the element covering up the desired clickable element. Fixes {% issue 46 '#46' %}.

# 0.7.5

*Released 06/19/2015*

**Bugfixes:**

- {% url `.click()` click %} now takes into account being covered by a fixed positioned element and will increase the window's scroll offset to account for this. There are still more improvements to be made before this is bulletproof though.
- {% url `cy.contains()` contains %} could potentially resolve to a null subject if the matching content was split across multiple nested children elements. This has been fixed and contains will now return the first, deepest element which contains text potentially spread over multiple text nodes and/or children elements.

# 0.7.4

*Released 06/18/2015*

**Misc:**

- Attempting to {% url `.click()` click %} a select element will now throw an error. The error guides you to using the {% url `.select()` select %} command, as that is the command you should use to change a `<select>` value.
- {% url `cy.route()` route %} responses are now validated. If responses are `null` or `undefined` Cypress will throw a very specific error message.
- Cypress will now display `cypress.json` parse errors when attempting to boot a project when there is a syntax error in `cypress.json`.

# 0.7.3

*Released 06/17/2015*

**Features:**

- {% url `.select()` select %} will now output a command log.
- {% url `.select()` select %} will now have `click` / `focus` events fired on itself and the selected options (as per the pec).
- {% url `.select()` select %} is now inline with the other `Action` commands and will retry until the element naturally becomes selectable.

**Bugfixes:**

- `Action` command options are now properly formatted, instead of saying `Object{4}` they will display the overridden default options - ie: `force`, `timeout`, `interval`.
- Sending `{force: true}` to `Action` commands will no longer error out if the element is not visible. Forcing the action to take place now correctly removes all error checking prior to issuing the action and events.

**Misc:**

- Removed stack traces on `AssertionErrors` in the console since those come from `chai` and are basically useless.

# 0.7.2

*Released 06/17/2015*

**Bugfixes:**

- Removed factoring in the total time a test has been running when determining when its command timeout. This fixes a bug where commands down he chain would timeout earlier than their specified `{timeout: num}` option.

# 0.7.1

*Released 06/16/2015*

**Bugfixes:**

- DOM commands which can retry now correctly support `{timeout: num}` options which will raise the timeout beyond the standard `commandTimeout` rom `cypress.json`.
- `<script>`, `<img>`, `<video>` commands or any other element which supports `crossorigin` attribute now are proxied correctly. The `crossorigin` attribute removes sending cookies with the HTTP request and now there is a fallback to figure out the `remoteHost` even in this situation.

**Misc:**

- Support for redirects with status code `303`.

# 0.7.0

*Released 06/15/2015*

**Features:**

- Cypress now has first class support for `fixtures` (official docs coming soon).
- Introduced new {% url `cy.fixture()` fixture %} command.
- Fixtures support `json`, `js`, and `coffee` files with image support coming soon.
- Fixtures are automatically validated, with error messages propagating up to the client.
- Fixtures are automatically formatted / indented for easy debugging.
- Example fixture is automatically created with every project.
- Example support files are now automatically created with every project.
- {% url `cy.route()` route %} now accepts an **alias** as its response.
- {% url `cy.route()` route %} additionally accepts a special `fixture:` or `fx:` keyword which automatically loads the fixture as the response.

**Bugfixes:**

- Clicking giant yellow CypressError now displays associated XHR error in the console.

**Misc:**

- RegExp arguments are now properly formatted in the command log.
- Update `bluebird` to `2.9.27`.
- Update `glob` to `5.0.10`.

# 0.6.14

*Released 06/11/2015*

**Features:**

- Command logging has been upgraded to support "page events", which are different than commands. Now events which happen (XHR/page load/url change/spies/stubs/mocks) log out visually differently and do not use a command number. This should be easier to parse what was a real command and what was a page event.
- When the url changes this is now logged as a page event, and its `onConsole` logs what caused it to change.

**Misc:**

- Internal refactor / improvements to support long lived runnable objects to work with page events.
- Request Commands (now page events) have now been renamed to 'XHR'.
- {% url `cy.document()` document %} now returns the raw document object instead of a jQuery wrapped document object.
- When {% url `.its()` its %} or {% url `.invoke()` invoke %} fails it will include the current subject n the `onConsole` log.
- {% url `cy.wait()` wait %} now logs out when its referenced aliases, and its `onConsole` output displays the XHR return values.
- {% url `cy.hash()` hash %} and {% url `cy.url()` url %} no longer pass the return value as the command log's `message`, which made no sense and was unlike every other command.

# 0.6.13

*Released 06/09/2015*

**Bugfixes:**

- Traversal methods now correctly return their `$el` even when `{log: false}` option is passed.

**Misc:**

- {% url `.type()` type %} now works with `contenteditable` attributes.

# 0.6.12

*Released 06/09/2015*

**Bugfixes:**

- When Cypress detects a `page loading` event it will now clear out the subject so the next commands cannot reference previous page DOM elements.
- {% url `.check()` check %} and {% url `.uncheck()` uncheck %} will no longer output additional error'd commands when their associated `click` fails.

**Misc:**

- {% url `.type()` type %}, {% url `.clear()` clear %}, {% url `.check()` check %}, {% url `.uncheck()` uncheck %} now all take `{force: true}` options to force the click to happen and skip additional clickable checks.
- Now when you click the giant yellow failure messages if the error is a `CypressError` instead of logging nothing it will now find the command associated to that error and display the same message as if you clicked the failed command.

# 0.6.11

*Released 06/08/2015*

**Bugfixes:**

- {% url `.clear()` clear %} and {% url `.type()` type %} no longer output additional error'd commands hen their associated `click` fails.
- Changed scrolling elements into view to use top strategy instead of bottom which fixes times where the middle of an element was not yet in he viewport. Fixes {% issue 42 '#42' %}.

**Misc:**

- {% url `.submit()` submit %} now errors if it's been called on >1 form element. Fixes {% issue 41 '#41' %}.
- Coordinates and hitboxes are now logged and displayed on {% url `.clear()` clear %} and {% url `.type()` type %}.

# 0.6.10

*Released 06/06/2015*

**Bugfixes:**

- Improved clicking algorithm to reduce edge cases where element could not be clicked but should have been able to be clicked.

**Misc:**

- {% url `.click()` click %} accepts `{force: true}` which will force it to issue the click event and bypass checking to ensure element is physically clickable.
- Elements which are children of a container with `overflow` are automatically scrolled prior to a click (which is an abstraction around real user behavior).
- Elements that are covering up an element you targeted for {% url `.click()` click %} are now logged out in the command console.
- All elements are now logged out as real DOM elements instead of jQuery wrapped elements. This has several upsides. Chrome will allow you to immediately interact with these elements, drilling into their contents, displaying the element box model on hover, etc. This prevents you from having to expand the jQuery elements and click "Reveal in Elements Panel".

# 0.6.9

*Released 06/06/2015*

**Bugfixes:**

- Custom commands no longer error out if they are the very first `cy` command.

# 0.6.8

*Released 06/05/2015*

**Features:**

- {% url `cy.clearCookie()` clearcookie %} and {% url `cy.clearCookies()` clearcookies %} have been added as new commands.
- Cypress will automatically clear all cookies **before** each test run.
- Named the spec + app iframe so that inside of Chrome Dev Tools the iframe selector will clearly distinguish which iframe is your application versus Cypress.

**Bugfixes:**

- Hitbox is no longer covered up by element layers on DOM revert.
- Finally tracked down and fixed edge case causing empty view to display when tests were not empty. Fixes {% issue 13 '#13' %}

**Misc:**

- {% url `cy.visit()` visit %} now accepts `{log: false}` to prevent logging out (useful in custom commands).
- {% url `cy.contains()` contains %} is now scoped by default to the `<body>` instead of `document` which prevents it from returning elements in the `head` like `title`.

# 0.6.7

*Released 06/04/2015*

**Features:**

- When reverting the DOM, associated command elements are now automatically scrolled into view.
- Hitboxes are now displayed on the screen based on the actual coordinates where an `action command` event took place.
- Click events now display event information about the `mousedown` / `mouseup` / `click` default action + propagation in the command console.
- Preventing default action on `mousedown` will no longer give focus as per the spec.
- Click events are now issued in the exact center of an element (taking into account 2d transforms) and provide the coordinates in the command console and in the actual event
- Click events now take into account whether the associated element is being covered up by another element, and will retry or fail with an exact error message if the click was unable to be issued due to this reason.
- Click events will now intelligently provide `focus` to the first focusable element on the stack at the click coordinates, or will give `focus` to the window.
- Click events will issue the click to the topmost element based on the click coordinates and not necessarily to the element you requested to e clicked (which simulates exactly how a real click works). If this happens it is noted in the command console and provides the `Actual Element Clicked`.

**Bugfixes:**

- When hover over commands element layers (2d transforms like rotation) are now taken into account and displayed correctly.
- There was a bug when checking / unchecking `:checkbox` where it did not properly receive focus.

**Misc:**

- Click events are now replicated *almost* identically to the W3C click spec. They should behave for all intents and purposes, identically to real clicks in the browser.

# 0.6.6

*Released 05/31/2015*

**Bugfixes:**

- Fixed regression related to {% url `cy.visit()` visit %} not re-visiting when current match matches remote url.

# 0.6.5

*Released 05/23/2015*

**Features:**

- When Cypress detects a regular HTTP page loading event (where we're leaving the current page and requesting a new one) it will now insert a `loading` command which indicates to the user Cypress has stopped running commands until the new page loads.
- If for some reason this new page errors Cypress will display the initial 500 error messages just like {% url `cy.visit()` visit %}.
- Cypress now waits `20s` (which matches {% url `cy.visit()` visit %}) for the new page to load instead of `4s` previously.

**Bugfixes:**

- {% url `.submit()` submit %} will actually submit the form for real now, instead of just firing the submit event. Now it's been upgraded to be able to be cancelled or have its returnValue set to false and will not submit the form. Don't ask how I missed this one. I as once a young naive programmer who trusted the DOM not to be the abomination it actually is.

**Misc:**

- No longer send back a 500 message when initial response status code is 4xx.

# 0.6.4

*Released 05/21/2015*

**Bugfixes:**

- Host header `https` protocol handling fixed.
- Incorrectly handling query params on redirects fixed.
- Other header edge cases fixed.

# 0.6.3

*Released 05/20/2015*

**Misc:**

- Cypress should work with self signed SSL certificates now.

# 0.6.2

*Released 05/20/2015*

**Bugfixes:**

- Using the `length` option in `querying` or `traversal` commands now logs out in the command log. Fixes {% issue 40 '#40' %}.
- Other scenarios are fixed where command options would show incorrect number of object keys due to a bug in underscore's `reduce` with an object that has a `length` key. Fixes {% issue 35 '#35' %}.

# 0.6.1

*Released 05/15/2015*

**Bugfixes:**

- Using the `length` option in traversal commands works properly now. Fixes {% issue 38 '#38' %}.
- Command logging now works even if no `cy` commands have been issued. Fixes {% issue 37 '#37' %}.

**Misc:**

- Removed cy proxy commands: `each`, `map`. These didn't really "fit" into the concept of a command, and with {% url `.invoke()` invoke %} or {% url `.its()` its %} they're accessible anyway, so nothing is really lost.

# 0.6.0

*Released 05/14/2015*

**Features:**

- Pushstate application routing now works 100% reliably with NO hacky overrides in all browsers.
- All incompatible `a` / `link` / `form` elements are transparently rewritten to be compatible including FQDN and protocol-less `href` / `src`.
- Cookies are automatically cleared between page refreshes, during app startup, and leaving the test page.
- 3rd Party cookies are now additionally cleared.  All cookies are now accessible to the client in preparation for {% url `cy.clearCookies()` clearcookies %}.
- Manual navigation after tests run now works reliably.
- Navigating between full page refreshes during tests now works reliably.

**Bugfixes:**

- Server-side redirects are now completely transparently handled and supported.
- URLs are no longer altered in any weird way.
- Problematic `headers` are now automatically stripped from remote responses.
- 3rd party `headers` are now properly proxied onto all responses.
- Custom headers and other headers "of interest" are rewritten for transparent compatibility.
- `gzip` compression now handled and proxied correctly.

**Misc:**

- Completely overhauled the URL and proxy system used to serve remote applications.
- Drastically simplified the architecture required for proxying.
- Improved reliability for displaying the remote url.
- Namespaced all cypress internal routes.
- Many internal development / debugging processes improved.
- Added 100+ new tests surrounding serving remote content and processing requests.
- Renamed all remaining old references to `eclectus`.
- All responses are now streamed using `content-encoding: chunked`.

# 0.5.15

*Released 05/07/2015*

**Bugfixes:**

- Reverted `window.location` overrides. This broke things in unexpected ways and after further testing would not have worked on `Firefox` and `IE`. It's back to the drawing board (but I have some ideas).  Apps using `pushState` routing are broken again.

# 0.5.14

*Released 05/06/2015*

**Features:**

- Cypress now works with JS applications that use `pushState` and `replaceState` routing (commonly known as `HTML5 History`) without having to change any application code.
- Cypress now always updates the remote URL whenever your application changes its URL through the vast variety of ways it can do this.

**Bugfixes:**

- Removed `iframe` and `link[rel=stylesheet]` elements during DOM revert.
- Server instrument now correctly displays the number of responses their corresponding routes have had.
- Spies/Stubs/Mocks instrument now correctly displays the number of calls their corresponding methods have had.
- When users navigate between pages with commands, like {% url `.click()` click %}, Cypress now correctly waits until the age has finished loading before running more commands. Previously this waited for the `unload` event, which did not fire synchronously, and ow we bind to `beforeunload` which does.  Additionally Cypress checks to ensure `beforeunload` did not return a non-undefined value.

**Misc:**

- More changes to prepare for server adapters,

# 0.5.13

*Released 05/04/2015*

**Features:**

- New `cy.message` and `cy.msg` commands in preparation for `cypress-ruby`, `cypress-node`, `cypress-*` packages/gem to talk directly to your backend.

**Bugfixes:**

- Using `querying` or `traversal` commands will no longer throw a 2nd command error when using improper sizzle selectors.
- Argument formatting display for command messages is fixed. There were instances of leading commas, or no commas on some commands.

**Misc:**

- Changed default port from `3000` to `2020` to avoid standard port conflicts with commonly used backends. Afterall, using Cypress is testing with 2020 vision. ;-)
- Updated `bluebird` to `2.9.25`.
- Began implementation in preparation for **cross browser testing** coming sometime relatively soon.

# 0.5.12

*Released 04/30/2015*

**Features:**

- Introduced new **command option** `length` which cues Cypress into not resolving matched elements until their length matches the option provided.

**Bugfixes:**

- `cy.respond` will not resolve until all of the queue'd XHR's have resolved.

**Misc:**

- Cypress now throws on {% url `.should()` should %} if any DOM member isn't in the DOM, except for `exist` assertions.
- Cypress now throws on `eventually.have.length` assertions. Use implicit `{length: n}` command options instead.
- Cypress overrides chai `exist` assertion to really mean: "does this subject exist in the document?"

# 0.5.11

*Released 04/29/2015*

**Bugfixes:**

- Fixed missing `aliasType` from primitives and some DOM aliases, which prevent the background color from displaying in the UI.

**Misc:**

- Optimized performance for hovering / exiting commands. Heavily reduced the CPU on revert / restore the DOM.

# 0.5.10

*Released 04/28/2015*

**Features:**

- {% url `cy.server()` server %} now accepts a `delay` option which will delay all responses to requests (including 404) based on the value in ms
- {% url `cy.server()` server %} now accepts a `respond` option which can turn off automatic responding to requests.
- {% url `cy.route()` route %} now accepts a `delay` option which overrides the delay option set in {% url `cy.server()` server %} to just matched requests.
- {% url `cy.route()` route %} now accepts a `respond` option which will turn off automatic responding to just matched requests.
- Fixes {% issue 14 '#14' %}.
- {% url `cy.wait()` wait %} now accepts an alias property called `request`. Example: `cy.wait('@getUsers.request')` which ill resolve once the XHR is initially requested, before it is responded to.  This allows you to test things when a request is in flight.
- Added `cy.respond` command which will respond to all pending requests when `{respond: false}` is set in the `server` or `route`.
- {% url `.debug()` debug %} now displays pending requests and completed requests.
- The command UI now displays pending requests as a `pending command`.

**Misc:**

- Updated `sinon` to `1.14.1`.

# 0.5.9

*Released 04/26/2015*

**Features:**
- Added {% url `.spread()` spread %} method which spreads an array as individual arguments to a callback function,like {% url `.then()` then %}.
- During an update Cypress will now display the updating message in the same coordinates as when the app was open by clicking the tray icon.
- After an update Cypress will now open back up and show itself in these same coordinates.
- {% url `cy.wait()` wait %} can now accept an array of route aliases which will wait until all have completed.  This array of resolved XHRs will become the next subject.
- Each time an alias in used with a {% url `cy.wait()` wait %}, Cypress will not resolve until the Nth request matching the outing alias responds.  Fixes {% issue 4 '#4' %}.
- {% url `cy.get()` get %} has been upgraded to accept a routing alias.  By default it will yield the last matched request, but also supports special alias properties which return a different request or potentially an array of requests.

# 0.5.8

*Released 04/24/2015*

**Features:**

- {% url `.as()` as %} can now alias primitives and objects other than routes or DOM.
- {% url `.as()` as %} automatically assigns this alias to `runnable.ctx` which makes it available synchronously.
- {% url `.as()` as %} blacklists several reserved words and will throw if you attempt to alias as one of them.
- {% url `cy.get()` get %} can now accept all alias types and will display the labels in the UI differently based on the alias type.
- Cypress now displays a message when the Desktop App update is actually being applied instead of doing nothing and looking like it's crashed.

**Bugfixes:**

- {% url `.as()` as %} now throws on empty strings or non string arguments.
- Desktop App debug logs no longer sort in the wrong direction.
- Permissions are now restored during a cypress update for the `logs` and `cache`.
- Prevent 3rd party windows from gaining focus over main window.

**Misc:**

- Removed `cy.assign`, this has been folded into {% url `.as()` as %}.
- Updated `chokidar` to `1.0.1`.

# 0.5.7

*Released 04/23/2015*

**Features:**

- The insanity that is URL parsing to figure out absolute, relative, absolute-path-relative, http, sub domains, and local files should work in most cases. In other words, Cypress has implemented the vast majority of url parsing based on the {% url 'w3c URL spec' 'https://url.spec.whatwg.org' %}.

**Bugfixes:**

- Prevent reverting the DOM while tests are running. Fixes {% issue 28 '#28' %}.
- Fix edge case with forced focusing / blurring an element when document is not in focus and the element is no longer in the DOM.
- Visiting relative paths which are served from your file system works again.
- Visiting absolute paths in the iframe now displays the correct URL in the address bar again.

# 0.5.6

*Released 04/22/2015*

**Features:**

- Cypress now detects the difference between a forced async `done` test timeout vs a regular command timeout, and will throw the appropriate message indicating whether the user forgot to simply invoke `done` or whether the timeout happened due to a command.

**Bugfixes:**

- {% url `cy.visit()` visit %} now properly times out when the `load` event does not occur within the time out window.
- If a page loads after a {% url `cy.visit()` visit %} times out it will no longer cause an exception in the `onBeforeLoad` handler.

**Misc:**

- Increased {% url `cy.visit()` visit %} timeout from **15s** to **20s**.
- {% url `cy.visit()` visit %} now throws a custom error message when it times out (instead of an incorrect / confusing default mocha timeout message).
- Using a `debugger` while running a test will no longer always cause the test to time out (yay!).
- Override default mocha timeout handling, replaced with custom logic. Removes many bizarre edge cases.

# 0.5.5

*Released 04/20/2015*

**Features:**

- When main app window comes into focus, it will automatically focus other peripheral windows.
- Added explicit error message when using child commands on a subject which has been detached or removed from the DOM.
- Cypress now detects when an async test is passed and not all commands have finished running. It will throw an explicit error message in this situation.

**Misc:**

- Error messages no longer break within words.

# 0.5.4

*Released 04/20/2015*

**Features:**

- Enhanced {% url `.should()` should %} to accept `eventually` flag to automatically retry assertions until timeout is reached.

**Misc:**

- Repurposed {% url `.and()` and %} to be an alias of {% url `.should()` should %} for chainability.
- Removed `cy.to`.

# 0.5.3

*Released 04/19/2015*

**Bugfixes:**

- Handle relative path segments which walk up past the remote host `../../assets/app.css`.
- Throw explicit error for `null`, `undefined`, and `""` arguments to {% url `cy.contains()` contains %}. Fixes {% issue 24 '#24' %}.

Misc
- Improved `onConsole` message for {% url `cy.focused()` focused %} when no element was returned. Fixes {% issue 23 '#23' %}.

# 0.5.2

*Released 04/17/2015*

**Bugfixes:**

- Fixed missing files from deployment. Added tests around this.

# 0.5.1

*Released 04/16/2015*

**Misc:**

- Updated dependencies: `bluebird`, `fs-extra`, `sinon-as-promised`.
- Updated `nw` to `0.12.1`.

# 0.5.0

*Released 04/15/2015*

**Misc:**

- Snapshot source code.

# 0.4.7

*Released 04/15/2015*

**Misc:**

- Added automated functional NW tests during deployment in preparation for `0.5.0` release.

# 0.4.6

*Released 04/11/2015*

**Features:**

- Added "invisible" icon to a command when its matched element(s) are invisible.
- Running a single test will now automatically expand to display its commands.
- Any failing test will now automatically expand to display its commands.
- Failing tests which become passing will automatically collapse again.

# 0.4.5

*Released 04/10/2015*

**Features:**

- Added {% url `cy.wrap()` wrap %} command.

**Bugfixes:**

- Improved options logging and argument logging for all commands.  Fixes {% issue 8 '#8' %}.

# 0.4.4

*Released 04/09/2015*

**Features:**

- Added {% url `.not()` not %} traversal filtering method. Suggested in {% issue 16 '#16' %}.

**Misc:**

- Improved error messages for traversal failures. Errors now include the parent context DOM element. Fixes {% issue 11 '#11' %}.
- Improved error messages for invalid {% url `cy.route()` route %} arguments. Fixes {% issue 20 '#20' %}.

# 0.4.3

*Released 04/09/2015*

**Features:**

- Added functionality which enables {% url `cy.server()` server %} and {% url `cy.route()` route %} to be created prior to {% url `cy.visit()` visit %}. The server and routes will apply to the next page which is visited. This allows you to stub requests which happen on page load. Suggested in {% issue 17 '#17' %}.
- {% url `cy.visit()` visit %} now takes an optional `onBeforeLoad` callback option which is invoked when your page begins to ender but prior to its load event.

**Misc:**

- Improved error message when attempting to use `cy.agents` or anything else which requires a remote sandbox.  Fixes {% issue 12 '#12' %}.

# 0.4.2

*Released 04/09/2015*

**Bugfixes:**

- Remove accidental `debugger` left in `uncaught` overloads (used only in Dev).
- Prevent memory leak with Cypress helper listeners on every re-run of the tests.
- Prevent memory leak with custom 3rd party Cypress listeners in spec windows on every re-run of the tests.
- Prevent error from being thrown when `.only`'s are switched in between active test runs.

# 0.4.1

*Released 04/08/2015*

**Features:**

- `javascripts` files can now utilize `snockets`, `browserify`, or `requirejs`.

**Bugfixes:**

- Handle `javascripts` and preprocess them as we do regular specs. Fixes: {% issue 15 '#15' %}.
- Fixed an edge case when writing a test with a `done` callback alongside `cy` commands.  This situation would always cause a timeout after 30 seconds even though the test would pass.

**Misc:**

- Internally refactored Cypress for easier testability / debuggability.
- Organized files around in preparation for OS release.
- Added lightweight module system / optimized Cypress listeners to prevent duplicated events.
- Changed url strategy for sending down `spec` files.

# 0.4.0

*Released 04/02/2015*

**Features:**

- `sinon-as-promised` is now a bundled extension.
- tests without an `id` now run (with a random temporarily assigned id).
- tests with a duplicate `id` to another test will now run (with a random temporarily assigned id).
- tests or suites which are manually re-run from the UI now hide all of the other tests / suites.

**Bugfixes:**

- Fixed hook failure associated to wrong failed current test when `grep` was set.
- Async tests which used a `cy` command and had a `done` callback was always undefined.  Now it's back to real mocha `function done(err)`.
- Fixed bug in mocha where it incorrectly associates `hook.ctx.currentTest` to the wrong `test`. {% url "Mocha Issue" https://github.com/mochajs/mocha/issues/1638 %}.
- {% url `cy.title()` title %} no longer logs twice on a failure.
- Fixed putting an `.only` on a large list of tests that would sometimes not clear the previous runnables in the UI.

**Misc:**

- Optimized first test run after hard refresh.
- Performance improvements on successive runnable iterations.
- Aborting currently running tests performance improvement.
- Live reload performance improvements when tests are changed.
- Added 100+ tests covering Runner + Reporter behavior.
- Aggressively cleaned up listeners after each test completion + run.
- Added additional `Cypress` events for 3rd party custom handling.

# 0.3.15

*Released 03/28/2015*

**Misc:**

- Drastically improved file watching on large projects with many tests.  Instead of choking the CPU at nearly 100% indefinitely we now optimally watch the current working files for changes.

# 0.3.14

*Released 03/27/2015*

**Bugfixes:**

- `Socket.io` and `chokidar` are now being cleaned up when a project is closed.  Previously `chokidar` file watchers would stick around indefinitely causing a memory leak each time any project is closed and reopened.

# 0.3.13

*Released 03/27/2015*

**Features:**

- {% url `cy.visit()` visit %} now detects a local url.  `localhost`, `0.0.0.0`, `127.0.0.1` can omit the `http://` protocol.

**Bugfixes:**

- {% url `cy.contains()` contains %} now properly escape quotes in the text.
- {% url `cy.visit()` visit %} now inserts a trailing slash intelligently into the correct `path` position (not after query params or hashes).
- {% url `cy.visit()` visit %} will no longer log 2 failed commands on error.
- Hovering on commands which delay resolving their $el will now properly highlight again.

**Misc:**

- {% url `.debug()` debug %} returns the current subject now.
- upgraded jsUri to `1.3.0`.
- {% url `cy.visit()` visit %} now throws when url argument isn't a string.
- `Cypress.Log` instances now fire `attrs:changed` event. Removed `state:change` event.

# 0.3.12

*Released 03/26/2015*

**Bugfixes:**

- Aliases which replay their commands will no longer break the current chain and therefore not unintentionally null our their subject for the ext command.
- Highlighting $el's on DOM restore now works again.
- Asserting against {% url `cy.focused()` focused %} will indent command logs now.
- Prevent failed {% url `.should()` should %} and `cy.to` from outputting a second error'd command log.
- Removed memory leaks surrounding mocha runner.
- Captured remote page uncaught errors again which fail corresponding tests.
- Captured spec iframe errors again and preserve their stack trace.

**Misc:**

- {% url `cy.focused()` focused %} is now a parent command.
- Memory usage improvements.

# 0.3.11

*Released 03/25/2015*

**Bugfixes:**

- Automatic command errors now properly show as errored commands.
- {% url `.invoke()` invoke %} now correctly checks for a subject before running.

**Misc:**

- `cy.Promise` (Bluebird) is now publicly available.

# 0.3.10

*Released 03/24/2015*

**Bugfixes:**

- Test duration is now correct and only updates when tests finish.
- Failing a hook will no longer continue to count the duration forever.

**Misc:**

- Bumped Mocha to 2.2.1
- Users now see a specialized error message when Cypress could not serve static files from the file system.

# 0.3.9

*Released 03/24/2015*

**Features:**

- Instead of waiting until commands resolve, commands are immediately inserted with a `pending` status.
- Pending commands are now visually distinguishable.
- Created new `Cypress.Log` interface for greater control over the display of commands.
- Available aliases are now logged in the console on {% url `.debug()` debug %}.

**Bugfixes:**

- Allow projects to be scrolled when >4 are added.
- {% url `.type()` type %} accepts remaining `input[type=*]` that users can type into.
- Cause + Effect commands are now logged in the correct order.  IE, clicking something which causes another command to insert will be inserted correctly in the order they arrived
- `numRetries` is no longer shown in commands.
- {% url `.clear()` clear %} now logs a command.
- `Promise.reduce` bugs are now fixed, causing events on a collection of elements in the synchronous wrong order.
- `cy.chain` is now coercively returned instead of `cy` which prevents losing access to the subject in custom commands.
- Trailing slashes are removed when serving initial files from the file system directly.

# 0.3.8

*Released 03/22/2015*

**Features:**

- Added icons + tray icons.

**Bugfixes:**

- Prevent cypress.app from showing in taskbar.
- Clicking on tray twice will toggle hide/show of app.

# 0.3.7

*Released 03/21/2015*

**Features:**

 - Code Signed Mac App to prevent "Unidentified Developer" message on open.

# 0.3.6

*Released 03/20/2015*

**Features:**

 - Added external link to changelog when checking for updates :-)

**Bugfixes:**

 - Force trailing slash on all {% url `cy.visit()` visit %} to fix relative links `href="assets/app.js"`.
 - Fix sourceMappingURL browser bug `http:/localhost:4200/app.css.map`.
 - Fix test titles not being escaped due to refactoring.

# 0.3.5

*Released 03/20/2015*

**Bugfixes:**

 - Fix missing `moment.js` from `bower.json`.
 - Fix missing trailing slash from initial {% url `cy.visit()` visit %} requests.
 - Fix missing `__initial=true` query param on initial redirects.

**Misc:**

 - Updated $.simulate to 1.0.1.

# 0.3.4

*Released 03/19/2015*

**Features:**
 - {% url `.type()` type %} now causes the subject to receive `focus` event.
 - {% url `.type()` type %} now causes previously `focused` elements to receive `blur` event/
 - Typing `{enter}` now handles form submit logic as per the HTML spec.
   - Form with 1 input, no defaultButton.
   - Form with 2 inputs, no defaultButton.
   - Form with disabled defaultButton.
   - Form with multiple defaultButtons.
   - Correctly processes defaultButton click event, form submit event.
   - Intelligently handle defaultPrevented events from descendants.

**Bugfixes:**

 - {% url `.clear()` clear %} now returns a promise.

**Misc:**

 - Updated `bluebird` to `2.9.14`.

# 0.3.3

*Released 03/18/2015*

**Features:**

 - Filtered out AJAX requests for `.js`, `.html`, `.css` files by default.
 - {% url `cy.server()` server %} can configure whether this is turned on or off.

**Bugfixes:**

 - Prevent {% url `cy.server()` server %} from slurping up Angular async template GETs.

**Misc:**

 - Inlined Google Fonts into `vendor.css`.
