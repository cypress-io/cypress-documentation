# Capturing Cypress App screenshots

Command Log and DevTools console screenshots go stale as the Cypress App UI
changes. Recapture them from a real run. Cypress Cloud UI is out of scope (needs
a signed-in account). Rules for editing these scripts: [`AGENTS.md`](./AGENTS.md).

## Screenshot principles

- **Match the docs' Cypress version.** `npm run api:source` prints it
  (`cypress-io/cypress @ vX.Y.Z`). Install exactly that.
- **Run the page's snippet word for word** against a minimal fixture page with
  only the elements it needs (matching ids, names, text). Never hand-edit or
  mock up an image.
- **Recapturing: overwrite the existing file** under `static/img/` so the path
  doesn't change. Update the `<DocsImage>` `alt` if it no longer fits
  ([alt text](../../AGENTS_REFERENCE.md#accessible-image-alt-text)).
- **Check the image against the page text.** Anything the page quotes, such as
  `Yielded:` or `Elements:`, must appear in it.
- **Work in the session scratchpad, never the repo:**
  `npm init -y && npm i cypress@<version>`. If the binary fails its size check,
  reinstall.
- **Scripts:** the CDP and DevTools approaches load `puppeteer-core` from this
  repo, so run `npm i` here first. Call them as
  `node "$REPO/scripts/screenshots/<script>.mjs"` (`REPO` = repo root) from the
  scratch project. Each writes its PNG to the current directory.

## Adding a new screenshot

- **Add one only when it shows what text can't**, such as a stubbed route in
  the Routes panel. A command that doesn't log has no Command Log image to add.
- **Path:** `static/img/<section>/<page>/<what-it-shows>.png`, kebab-case, such
  as `static/img/api/fixture/command-log-fixture-stubbed-route.png`. Create the
  page's folder if it has none. Reference it as `/img/...`.
- **Placement:** on an `/api` page, the command's own Command Log image goes in
  `## Command Log` ([skeleton](../../docs/api/AGENTS.md#page-skeleton)); anything
  else goes next to the text it illustrates. Lead in with a sentence naming what to look at.
- **Markup:** `<DocsImage src="/img/..." alt="..." />`, with `alt` that states
  what the image shows
  ([alt text](../../AGENTS_REFERENCE.md#accessible-image-alt-text)).

Then capture it with the approach below that fits.

## Pick the approach

| Capturing                                               | Approach                                                                      |
| ------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Command Log rows that fit at the default width          | [`cy.screenshot()`](#command-log-with-cyscreenshot)                           |
| Rows that wrap at the default width                     | [`cy.screenshot()`, widening the panel first](#widening-the-command-log)      |
| A finished, passing test (title check mark, pass count) | [`cy.screenshot()` from a following test](#capturing-a-finished-passing-test) |
| DevTools console output from clicking a command         | [`cypress open` plus a DevTools frontend](#devtools-console-output)           |
| A pinned snapshot highlighting an element in the app    | [`cypress open`, then pin the command](#pinned-snapshot-with-highlights)      |

`cy.screenshot()` limits:

- Captures the page only, never DevTools.
- Runs mid-test: the title shows a spinner and the counts read `--`. Pass
  `log: false` so it adds no spinner row of its own. For a finished test,
  capture from the next test.

The Command Log runs in the spec's browser tab, so the spec can widen it, expand
sections, and pin tests with ordinary DOM events (sections below).
[CDP](#command-log-over-cdp) drives the same UI from outside and is the
fallback.

One config serves every approach. `--force-device-scale-factor=2` gives 2x
output; CDP also needs `--remote-allow-origins=*`. The hook skips Electron,
which the DevTools approach configures by environment variable.

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

Put fixture pages at the project root, next to the config, so `cy.visit()`
finds them by name.

## Command Log with cy.screenshot

Prefer this whenever rows fit. Headless: no Xvfb, `--no-exit`, or CDP.

1. End the spec with `cy.screenshot('<name>', { capture: 'runner', log: false })`
   after the snippet. The log then ends at the snippet's last row and its
   border, so nothing below needs cropping around.
2. Run it:

   ```shell
   npx cypress run --browser "$PLAYWRIGHT_BROWSERS_PATH/chromium" \
     --config-file cypress.config.js --spec cypress/e2e/focus.cy.js
   ```

   Output: `cypress/screenshots/<spec>/<name>.png`, 2560×1266 (1280×633 at 2x).

3. Find the target rows in the full capture and halve the pixel positions to
   get CSS px. To show a collapsed panel such as **Routes**, expand it first and
   measure after the click
   ([Expanding a collapsed Command Log panel](#expanding-a-collapsed-command-log-panel)).
4. Add a `clip` in **CSS px**; Cypress scales it, so 414×57 saves as 828×114.
   Keep the snippet's rows, not the running-test header. Row numbers shifted by
   earlier rows (`visit` as row 1) are fine. Default rows are about 414 CSS px
   wide; to match a wider neighbor, such as a 940 px CDP crop,
   [widen the panel](#widening-the-command-log).
5. Rerun and copy the PNG over the docs image at once. The next `cypress run`
   clears `cypress/screenshots/`.

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

Panels above the test body, such as **Routes** for `cy.intercept()`, start
collapsed. To show one (the Routes **Stubbed** column, say), click it open in
the runner. This supporting code stays in the capture spec, never the docs
snippet.

The Command Log is an `about:blank` iframe of the top window. Click the panel's
`.collapsible-header` from a `cy.then()` (which logs no row) and wait for it to
render. Match by the start of the header text, since headers hold more than
their label:

```javascript title="cypress/e2e/fixture-intercept.cy.js"
// Finds a Command Log header, such as the Routes panel or a test title
const findCommandLogHeader = (pattern) => {
  const top = window.top
  for (let i = 0; i < top.frames.length; i++) {
    try {
      const header = [
        ...top.frames[i].document.querySelectorAll('.collapsible-header'),
      ].find((h) => pattern.test(h.textContent.trim()))
      if (header) return header
    } catch (e) {}
  }
  throw new Error(`no Command Log header matches ${pattern}`)
}

const clickCommandLogHeader = (pattern) => findCommandLogHeader(pattern).click()

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

Expanding pushes later rows down, so measure after the click. Use a separate
probe spec that expands the panel and writes each element's bounding rect, plus
the iframe offset (`0, 0` by default), with `cy.writeFile()`. Rows are
`.command`; a panel is the `.collapsible` around its header. Never report
measurements with `Cypress.log()`: it adds a row that lands in the image.

## Widening the Command Log

For wrapping rows, widen the panel from the spec. The resize handle,
`[data-cy=panel2ResizeHandle]`, is in the top window and takes plain mouse
events, so dispatch a drag. `toX` sets the panel's right edge in CSS px:

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

At `toX` 700, rows are 663 CSS px wide; clip that full width so row ends aren't
cut. The width carries over to later tests in the spec; each new `cypress run`
starts at the default.

## Capturing a finished, passing test

A screenshot inside a test shows it running, and `after()` doesn't help: the
reporter marks a test finished only after its hooks. Capture from the **next**
test, when the first shows its check mark and a pass count of 1.

In `cypress run`, the reporter clears a finished test's rows unless you pinned
it open. Clicking a test's title pins it to the opposite of what it shows, and a
running test can show open or closed depending on timing, so a fixed number of
clicks leaves it closed some of the time. Pin it at the end of the test with
`pinCommandLogTestOpen()`, which clicks once, lets the reporter render, and
clicks again only if the test now shows closed. If the image shows the page
under test, add `testIsolation: false` to the suite, or the page resets to
`about:blank` before the next test:

```javascript title="cypress/e2e/shows-the-user.cy.js"
// Pins a test open so the reporter keeps its rows after it passes
const pinCommandLogTestOpen = (pattern) => {
  const render = () =>
    new Cypress.Promise((resolve) => setTimeout(resolve, 100))
  const isOpen = () =>
    findCommandLogHeader(pattern).getAttribute('aria-expanded') === 'true'
  clickCommandLogHeader(pattern)
  return render()
    .then(() => {
      if (!isOpen()) clickCommandLogHeader(pattern)
      return render()
    })
    .then(() => {
      if (!isOpen()) throw new Error(`could not pin ${pattern} open`)
    })
}

describe('user list', { testIsolation: false }, () => {
  it('shows the user', () => {
    cy.visit('list.html')
    cy.contains('Alan Turing') // the page's snippet
    cy.then(() => pinCommandLogTestOpen(/^shows the user/))
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

Clip above the capturing test, which shows its own spinner below. Define
`findCommandLogHeader()` and `clickCommandLogHeader()` as in
[Expanding a collapsed Command Log panel](#expanding-a-collapsed-command-log-panel).

## Command Log over CDP

Fallback: drives the runner from outside the browser and leaves it open after
the run. Prefer the `cy.screenshot()` techniques above; use this when a capture
can't be driven from inside the spec.

1. Run under an Xvfb screen large enough for 2x; `--no-exit` keeps the runner
   open:

   ```shell
   xvfb-run -a -s "-screen 0 3200x2000x24" npx cypress run --headed --no-exit \
     --config-file cypress.config.js \
     --browser "$PLAYWRIGHT_BROWSERS_PATH/chromium" \
     --spec cypress/e2e/focused.cy.js > run.log 2>&1 &
   timeout 180 bash -c 'until grep -q "not exiting due to options.exit being false" run.log; do sleep 2; done'
   ```

2. Read the CDP port:

   ```shell
   PORT=$(pgrep -a chrome | grep -o 'remote-debugging-port=[0-9]\+' | head -1 | cut -d= -f2)
   ```

3. Crop, naming the rows and output file:

   ```shell
   node "$REPO/scripts/screenshots/crop.mjs" --port "$PORT" \
     --rows '.command-name-focused, .command-name-assert' \
     --out make-assertion-about-focused-element.png
   ```

   Rows are `.command.command-name-<command>`. The script widens the panel to
   x=700 (`--panel`) and clips 470 CSS px wide (`--width`, 940 px in the PNG);
   its comments cover the rest.

Get 2x from the launch flag. CDP's `Emulation.setDeviceMetricsOverride` didn't
change the scale in testing.

## DevTools console output

Clicking a command prints its details (`Command:`, `Yielded:`, `Elements:`,
and so on) only in interactive mode, so this needs `cypress open`. In
`cypress run`, the click only clears the console.

`cy.screenshot()` can't do this. `--auto-open-devtools-for-tabs` opens DevTools
in a headed run, but it docks beside the page, so the capture omits it and the
runner is squeezed. And `cypress run` has no console details: the driver keeps
them only when `isInteractive` is true and tests are kept in memory.

1. Start `cypress open` with a CDP port on Electron and wait for the Launchpad:

   ```shell
   ELECTRON_EXTRA_LAUNCH_ARGS="--remote-debugging-port=9333 --remote-allow-origins=*" \
     xvfb-run -a -s "-screen 0 3200x2000x24" \
     npx cypress open --e2e --config-file cypress.config.js > open.log 2>&1 &
   timeout 120 bash -c 'until curl -s 127.0.0.1:9333/json/list | grep -q __launchpad; do sleep 2; done'
   ```

2. Open the spec, naming the command to click so the script waits for the test:

   ```shell
   node "$REPO/scripts/screenshots/open-spec.mjs" --spec focused.cy.js \
     --command .command-name-focused
   ```

   It uses Electron, the only browser the Launchpad offers with a custom
   `--browser` path; it's Chromium, so that's fine.

3. Capture the console:

   ```shell
   node "$REPO/scripts/screenshots/console.mjs" --command .command-name-focused \
     --out currently-focused-element-in-an-input.png
   ```

   DevTools can't dock headlessly, so the script renders Electron's DevTools
   frontend in a separate headless Chromium and captures 820×200 CSS px at 2x
   (1640×400). Its comments explain each step.

Leave in the `runner-*.js` source links; the existing console screenshots show
them too. The "Console was cleared" line is optional: keep it when the capture
includes it, and don't recapture to add it when it doesn't. What matters is
that every field the page quotes, such as `Yielded:` or `Elements:`, is in the
image.

## Pinned snapshot with highlights

Clicking a command pins its DOM snapshot and highlights the element it yielded
in the app preview, with a **Pinned** / **Highlights** banner. Use this when the
highlight is the point, such as showing where focus landed.

This needs `cypress open`, like [DevTools console output](#devtools-console-output).
In `cypress run`, clicking or hovering a row draws no highlight.

1. Shrink the viewport so the app preview isn't scaled down to unreadable text.
   Size it to the fixture, for example `viewportWidth: 400` and
   `viewportHeight: 200` in the config's `e2e` block. Leave
   `numTestsKeptInMemory` above `0`, or there are no snapshots to pin.
2. Start `cypress open` at 2x. The config's `before:browser:launch` hook skips
   Electron, so pass the scale factor with the CDP flags:

   ```shell
   ELECTRON_EXTRA_LAUNCH_ARGS="--remote-debugging-port=9333 --remote-allow-origins=* --force-device-scale-factor=2" \
     xvfb-run -a -s "-screen 0 3200x2000x24" \
     npx cypress open --e2e --config-file cypress.config.js > open.log 2>&1 &
   timeout 120 bash -c 'until curl -s 127.0.0.1:9333/json/list | grep -q __launchpad; do sleep 2; done'
   ```

3. Open the spec with `open-spec.mjs`, as in step 2 of
   [DevTools console output](#devtools-console-output).
4. Pin the command and capture:

   ```shell
   node "$REPO/scripts/screenshots/pin.mjs" --command .command-name-focused \
     --out command-log-focused-tab-snapshot.png
   ```

   It pins the last matching row (`--nth 2` picks the second), moves the mouse
   off the rows, and clips from the sidebar's right edge down to the lower of
   the Command Log and the banner. It moves the pin from any other row, such as
   one you pinned by hand, and leaves it in place when that row is already
   pinned.

Check the image before copying it into `static/img/`: the pinned row shows a
pin icon, and the highlighted element is the one the page text names.

## Shell gotchas

- `pkill -f <pattern>` can kill the agent's own shell (exit 144). Match names:
  `pkill -x Cypress`, `pkill -x chrome`, `pkill -x Xvfb`, `pkill -x xvfb-run`.
- Never leave a bare `cat` or other stdin reader in a command; it hangs until
  timeout.
- Wait with `timeout N bash -c 'until <check>; do sleep 2; done'`, not chained
  sleeps.
- Stop every Cypress, Chrome, and Xvfb process when done; confirm with
  `pgrep -l 'Cypress|chrome|Xvfb'`. They take a few seconds to exit.
