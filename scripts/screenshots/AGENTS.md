# Agent rules: screenshot scripts

The root [`AGENTS.md`](../../AGENTS.md) still applies; this file adds the rules
for `scripts/screenshots/`. How to capture, and which script each approach
uses, is in [`README.md`](./README.md).

## Editing the screenshot scripts

The scripts are JavaScript checked with `// @ts-check` against puppeteer-core's
types: run `npm run typecheck` after a change. Shared helpers live in
`runner.mjs`. Puppeteer behaviors to keep in mind:

- Pass `defaultViewport: null` to `puppeteer.connect()`, or Puppeteer resizes
  every page it touches, runner included, to 800×600.
- End with `browser.disconnect()`. On a connected browser, `close()` quits it,
  and Cypress with it.
- A browser Puppeteer launches itself (the DevTools viewer in `console.mjs`)
  needs `--no-sandbox` when running as root, as in a cloud container.
- `console.mjs` takes Chromium from `$PLAYWRIGHT_BROWSERS_PATH`, so
  puppeteer-core never downloads a browser.
