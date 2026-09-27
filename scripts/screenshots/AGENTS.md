# Agent rules: screenshot scripts

The root [`AGENTS.md`](../../AGENTS.md) still applies; this file adds the rules
specific to `scripts/screenshots/`. How to capture a screenshot, and which of
these scripts each approach uses, is in [`README.md`](./README.md).

## Editing the screenshot scripts

The scripts in `scripts/screenshots/` are JavaScript checked with `// @ts-check`
against puppeteer-core's types, so run `npm run typecheck` after changing one.
Shared helpers live in `runner.mjs`. Keep these Puppeteer behaviors in mind:

- Pass `defaultViewport: null` to `puppeteer.connect()`. Otherwise Puppeteer
  resizes every page it touches to 800×600, runner included.
- End with `browser.disconnect()`, not `browser.close()`. On a connected
  browser, `close()` quits it, and Cypress with it.
- A browser Puppeteer launches itself, like the DevTools viewer in
  `console.mjs`, needs `--no-sandbox` when the session runs as root, as it does
  in a cloud container.
- `console.mjs` reads the viewer's Chromium from `$PLAYWRIGHT_BROWSERS_PATH`,
  so puppeteer-core never downloads a browser.
