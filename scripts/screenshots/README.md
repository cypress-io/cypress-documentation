# Capturing Cypress App screenshots

Screenshots of the Command Log and the DevTools console go stale as the Cypress
App's UI changes. Recapture them from a real run so the image shows what a reader
sees today. This guide covers the Cypress App UI only. Cypress Cloud
screenshots need a signed-in account and are out of scope. Rules for changing
the scripts in this directory are in [`AGENTS.md`](./AGENTS.md).

## Screenshot principles

- **Capture from the Cypress version the docs describe.** `npm run api:source`
  prints the pinned version (`cypress-io/cypress @ vX.Y.Z`). Install that exact
  version.
- **Run the page's own snippet word for word**, against a minimal fixture HTML
  page with only the elements the snippet needs (matching ids, names, and text).
  Never hand-edit or mock up a screenshot.
- **Overwrite the existing file** under `static/img/` so the image path in the
  page doesn't change. Then update the `<DocsImage>` `alt` if it no longer
  describes the image (see [alt text](../../AGENTS_REFERENCE.md#accessible-image-alt-text)).
- **Check the image against the page text before committing.** Open it and
  confirm that anything the page quotes appears in it, such as the console
  labels (`Yielded:`, `Elements:`).
- **Work in the session scratchpad, never inside the repo:**
  `npm init -y && npm i cypress@<version>`. If the Cypress binary download
  fails its size check, run the install again.
- **Run the scripts from the scratch project.** The CDP and DevTools approaches
  use the scripts in `scripts/screenshots/`, which load `puppeteer-core` from
  this repository, so run `npm i` here first. The commands below call them as
  `node "$REPO/scripts/screenshots/<script>.mjs"`, with `REPO` set to this
  repository's root. Each writes its PNG to the current directory.

## Pick the approach

| What you're capturing                                                      | Approach                                                                      |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Command Log rows that fit on one line at the default panel width           | [`cy.screenshot()`](#command-log-with-cyscreenshot)                           |
| Command Log rows that wrap at the default width                            | [`cy.screenshot()`, widening the panel first](#widening-the-command-log)      |
| The runner showing a finished, passing test (title check mark, pass count) | [`cy.screenshot()` from a following test](#capturing-a-finished-passing-test) |
| DevTools console output from clicking a command                            | [`cypress open` plus a DevTools frontend](#devtools-console-output)           |

Each approach has limits:

- `cy.screenshot()` captures only the page, and DevTools isn't part of the page.
- `cy.screenshot()` runs mid-test, so the test title shows a spinner and the
  pass/fail counts are empty (`--`). Pass `log: false` so the command doesn't
  add its own row, with a spinner, below the rows you're capturing. To show a
  finished test, take the screenshot from the test after it.

The Command Log and its resize handle run in the same browser tab as the spec,
so the spec can widen the panel, expand a collapsed section, and pin a test open
with ordinary DOM events. The subsections below show how. The
[CDP approach](#command-log-over-cdp) drives the same UI from outside the
browser and stays available as a fallback.

All three approaches share one config. `--force-device-scale-factor=2` gives 2x
output for the first two approaches; the CDP approach also needs
`--remote-allow-origins=*`. The hook skips Electron, which the DevTools approach
configures through an environment variable instead.

```javascript title="cypress.config.js"
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    supportFile: false,
    setupNodeEvents(on) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium' && browser.name !== 'electron') {
          launchOptions.args.push('--force-device-scale-factor=2')
          launchOptions.args.push('--remote-allow-origins=*') // CDP approach
        }
        return launchOptions
      })
    },
  },
})
```

Put fixture pages at the project root, next to the config, so `cy.visit()` finds
them by file name.

## Command Log with cy.screenshot

Prefer this approach whenever the rows fit. It runs headlessly, with no Xvfb,
`--no-exit`, or CDP.

1. Add `cy.screenshot('<name>', { capture: 'runner', log: false })` as the last
   line of the spec, after the page's snippet. With `log: false`, the Command
   Log ends at the snippet's last row and its bottom border, so nothing below
   the target rows needs cropping around.
2. Run it:

   ```shell
   npx cypress run --browser "$PLAYWRIGHT_BROWSERS_PATH/chromium" \
     --config-file cypress.config.js --spec cypress/e2e/focus.cy.js
   ```

   The file lands in `cypress/screenshots/<spec>/<name>.png`. With the config
   above it's 2560×1266, a 1280×633 capture at 2x.

3. Open that full capture and find the target rows. Divide the pixel positions
   by 2 to get CSS pixels. If the image needs a collapsed panel open, such as
   **Routes**, expand it first and measure after the click (see
   [Expanding a collapsed Command Log panel](#expanding-a-collapsed-command-log-panel)).
4. Add a `clip` in **CSS pixels**. Cypress scales the saved PNG by the device
   factor, so a 414×57 clip saves as 828×114. Crop to the rows the page's
   snippet produces, leaving out the running-test header. Earlier rows, such
   as `visit` as row 1, push the row numbers up. That's fine. At the default
   panel width the rows are about 414
   CSS px wide. To match a wider neighbor on the same page, such as a 940 px
   CDP crop, [widen the panel](#widening-the-command-log) first.
5. Run the spec again and copy the PNG over the docs image right away. The
   next `cypress run` clears `cypress/screenshots/`.

```javascript title="cypress/e2e/focus.cy.js"
it('focus', () => {
  cy.visit('focus.html')
  cy.get('[name="comment"]').focus() // the page's snippet, word for word
  cy.screenshot('get-input-then-focus', {
    capture: 'runner',
    log: false,
    clip: { x: 19, y: 239, width: 414, height: 57 }, // CSS px: rows 2 and 3
  })
})
```

## Expanding a collapsed Command Log panel

The panels above the test body, such as **Routes** for `cy.intercept()`, start
collapsed. When the image needs a panel's contents, like the Routes table's
**Stubbed** column, expand it with a real click in the runner before the
screenshot. Supporting code like this stays in the capture spec, never in the
docs snippet.

The Command Log renders in an `about:blank` iframe of the top window. Click the
panel's `.collapsible-header` from a `cy.then()`, which adds no Command Log row,
then give the panel a moment to render. Match the header by the start of its
text, since a header holds more than its label:

```javascript title="cypress/e2e/fixture-intercept.cy.js"
// Clicks a Command Log header, such as the Routes panel or a test title
const clickCommandLogHeader = (pattern) => {
  const top = window.top
  for (let i = 0; i < top.frames.length; i++) {
    try {
      const header = [
        ...top.frames[i].document.querySelectorAll('.collapsible-header'),
      ].find((h) => pattern.test(h.textContent.trim()))
      if (header) return header.click()
    } catch (e) {}
  }
  throw new Error(`no Command Log header matches ${pattern}`)
}

it('fixture intercept', () => {
  cy.intercept('GET', '/users/**', { fixture: 'users' }) // the page's snippet
  cy.visit('users.html')
  cy.contains('Alan Turing')
  cy.then(() => clickCommandLogHeader(/^Routes/))
  cy.then(() => new Cypress.Promise((resolve) => setTimeout(resolve, 300)))
  cy.screenshot('command-log-fixture-stubbed-route', {
    capture: 'runner',
    log: false,
    clip: { x: 10, y: 172, width: 431, height: 236 }, // CSS px: Routes through the fetch row
  })
})
```

Expanding a panel pushes every row below it down, so measure the crop after
the click. To find the positions, run a separate probe spec that expands the
panel and writes each element's bounding rect (plus the iframe's offset, which
is `0, 0` at the default layout) to a file with `cy.writeFile()`. Command Log
rows are `.command` elements, and a panel is the `.collapsible` around its
header. Keep that measuring out of the capture spec, and never report it with
`Cypress.log()`: that adds a row to the Command Log, and it lands in the image.

## Widening the Command Log

When a row wraps at the default width, widen the panel from the spec before the
screenshot. The resize handle, `[data-cy=panel2ResizeHandle]`, lives in the top
window and responds to plain mouse events, so dispatch a drag on it. The drag
sets the panel's right edge to `toX`, in CSS px from the left of the window:

```javascript title="cypress/e2e/get-then-assert.cy.js"
// Drags the Command Log's resize handle so long rows don't wrap
const widenCommandLog = (toX = 700) => {
  const handle = window.top.document.querySelector(
    '[data-cy=panel2ResizeHandle]'
  )
  const { x, y, height } = handle.getBoundingClientRect()
  const at = (clientX) => ({
    bubbles: true,
    clientX,
    clientY: y + height / 2,
    button: 0,
  })
  handle.dispatchEvent(new MouseEvent('mousedown', at(x + 2)))
  handle.dispatchEvent(new MouseEvent('mousemove', at(toX)))
  handle.dispatchEvent(new MouseEvent('mouseup', at(toX)))
}

it('get then assert', () => {
  cy.visit('list.html')
  cy.get('li').should('have.length', 3) // the page's snippet
  cy.then(() => widenCommandLog())
  cy.then(() => new Cypress.Promise((resolve) => setTimeout(resolve, 300)))
  cy.screenshot('get-then-assert-length', {
    capture: 'runner',
    log: false,
    clip: { x: 19, y: 241, width: 663, height: 56 }, // CSS px: rows 2 and 3
  })
})
```

At `toX` 700 the rows are 663 CSS px wide, so clip to that width rather than a
narrower one that cuts off the row's end. The wider panel carries over to
later tests in the same spec, and each new `cypress run` starts at the default
width.

## Capturing a finished, passing test

A screenshot inside a test always shows that test running, and an `after()`
hook doesn't help, because the reporter marks the test finished only after its
hooks. Take the screenshot from the **next** test instead. By then the first
test shows its check mark and the pass count reads 1.

In `cypress run`, the reporter clears a finished test's rows unless the test is
open when it finishes. A running test only looks open, so pin it: click its
title twice at the end of the test, once to close it and once to open it again.
The same `clickCommandLogHeader()` helper does this. When the image also shows
the page under test, add `testIsolation: false` to the suite, or Cypress clears
the page to `about:blank` before the next test starts:

```javascript title="cypress/e2e/shows-the-user.cy.js"
describe('user list', { testIsolation: false }, () => {
  it('shows the user', () => {
    cy.visit('list.html')
    cy.contains('Alan Turing') // the page's snippet
    // Pin the test open so the reporter keeps its rows after it passes
    cy.then(() => clickCommandLogHeader(/^shows the user/))
    cy.then(() => clickCommandLogHeader(/^shows the user/))
  })

  it('capture', () => {
    cy.screenshot('shows-the-user-passed', {
      capture: 'runner',
      log: false,
      clip: { x: 5, y: 75, width: 440, height: 241 }, // CSS px: pass count through the test
    })
  })
})
```

Clip above the capturing test, which sits below the finished one with its own
spinner. Define `clickCommandLogHeader()` in the spec as shown in
[Expanding a collapsed Command Log panel](#expanding-a-collapsed-command-log-panel).

## Command Log over CDP

This approach drives the runner from outside the browser, leaving it open
after the run. The `cy.screenshot()` techniques above now cover wrapped rows and
finished tests, so prefer them. Keep this one as a fallback, for instance when a
capture can't be driven from inside the spec.

1. Start the run under an Xvfb screen large enough for 2x. `--no-exit` keeps the
   runner open after the test finishes:

   ```shell
   xvfb-run -a -s "-screen 0 3200x2000x24" npx cypress run --headed --no-exit \
     --config-file cypress.config.js \
     --browser "$PLAYWRIGHT_BROWSERS_PATH/chromium" \
     --spec cypress/e2e/focused.cy.js > run.log 2>&1 &
   timeout 180 bash -c 'until grep -q "not exiting due to options.exit being false" run.log; do sleep 2; done'
   ```

2. Read the browser's CDP port from its command line:

   ```shell
   PORT=$(pgrep -a chrome | grep -o 'remote-debugging-port=[0-9]\+' | head -1 | cut -d= -f2)
   ```

3. Run the crop script, naming the rows to keep and the output file:

   ```shell
   node "$REPO/scripts/screenshots/crop.mjs" --port "$PORT" \
     --rows '.command-name-focused, .command-name-assert' \
     --out make-assertion-about-focused-element.png
   ```

   Rows are `.command.command-name-<command>`, such as `.command-name-focused`
   or `.command-name-assert`. The script:
   - attaches to the browser and picks the runner page, the one whose URL
     contains `/__/`
   - widens the Command Log by dragging its resize handle
     (`[data-cy=panel2ResizeHandle]`, at about x=451 by default) out to x=700
     (`--panel`). It drags only once: on an already wide panel, the drag
     selects text instead.
   - clears any selection in the page and the frame, and moves the mouse away
     so no hover styles show
   - finds the about:blank iframe that holds the Command Log rows
   - clips a screenshot of the runner page to the union of the rows' bounding
     rects, offset by the frame's position: 470 CSS px wide (`--width`, 940 px
     in the PNG), with 4 px of padding above and below

Get 2x from the launch flag, not from CDP's `Emulation.setDeviceMetricsOverride`,
which didn't change the screenshot scale in testing.

## DevTools console output

Clicking a command prints its details (`Command:`, `Yielded:`, `Elements:`, and
so on) only in interactive mode. In a `cypress run --no-exit` run, the click only
clears the console, so this approach needs `cypress open`.

`cy.screenshot()` can't stand in here, even with DevTools open. The Chromium
flag `--auto-open-devtools-for-tabs` does open DevTools in a headed run, but it
docks beside the page rather than inside it, so the capture leaves it out and
the runner gets squeezed into the remaining width. The console details are also
missing in `cypress run`: the driver keeps a command's console output only when
`isInteractive` is true and tests are kept in memory.

1. Start `cypress open` with a CDP port on Electron, and wait for the Launchpad:

   ```shell
   ELECTRON_EXTRA_LAUNCH_ARGS="--remote-debugging-port=9333 --remote-allow-origins=*" \
     xvfb-run -a -s "-screen 0 3200x2000x24" \
     npx cypress open --e2e --config-file cypress.config.js > open.log 2>&1 &
   timeout 120 bash -c 'until curl -s 127.0.0.1:9333/json/list | grep -q __launchpad; do sleep 2; done'
   ```

2. Open the spec, naming the command you'll click so the script waits until
   the test has run:

   ```shell
   node "$REPO/scripts/screenshots/open-spec.mjs" --spec focused.cy.js \
     --command .command-name-focused
   ```

   It dismisses the "What's New" dialog (its "Continue" button), clicks "Start
   E2E Testing in Electron", and clicks the spec in the specs list. The runner opens in its own window, a separate page
   from the Launchpad. Electron is the only browser offered with a custom
   `--browser` path, and it's fine because it's Chromium. Click the spec rather
   than changing the URL hash, which closes the runner window.

3. Capture the console:

   ```shell
   node "$REPO/scripts/screenshots/console.mjs" --command .command-name-focused \
     --out currently-focused-element-in-an-input.png
   ```

   DevTools can't be docked in a headless session, so the script opens the
   DevTools frontend that Electron itself serves, in a separate headless
   Chromium:
   - It builds the inspector URL from the runner's target id in
     `http://127.0.0.1:9333/json/list`. Don't use the `devtoolsFrontendUrl` that
     list returns, because it points to appspot.
   - It turns off the screencast panel first: it loads `inspector.html` once and
     sets `screencast-enabled` to `false` in localStorage. Older DevTools read
     `screencastEnabled`, so it sets both.
   - It attaches the frontend before clicking the command, because the frontend
     only shows messages logged after it connects.
   - Clicking a command toggles its pinned state (`command-is-pinned` on
     `.command-wrapper`). If it was already pinned, the first click unpins it,
     so the script clicks again.
   - It captures an 820×200 CSS px viewport at deviceScaleFactor 2 (a 1640×400
     PNG), tall enough that the first console line stays in view.

The capture includes the "Console was cleared" line and the `runner-*.js` source
links. The existing console screenshots show them too, so leave them in.

## Shell gotchas when capturing screenshots

- `pkill -f <pattern>` can match the agent's own shell command and kill it (exit
  144). Match the process name instead: `pkill -x Cypress`, `pkill -x chrome`,
  `pkill -x Xvfb`, `pkill -x xvfb-run`.
- Never leave a bare `cat`, or anything else that reads stdin, in a command. It
  hangs until the tool times out.
- Wait for conditions with `timeout N bash -c 'until <check>; do sleep 2; done'`,
  not chained sleeps.
- Stop every Cypress, Chrome, and Xvfb process when you're done, then confirm
  with `pgrep -l 'Cypress|chrome|Xvfb'`. They can take a few seconds to exit.
