#!/usr/bin/env node
// @ts-check
//
// Capture the DevTools console output of clicking a Command Log command in a
// `cypress open` session. DevTools can't be docked headlessly, so this renders
// the DevTools frontend that Electron serves in a separate headless Chromium.
//
//   node scripts/screenshots/console.mjs --command .command-name-focused \
//     --out currently-focused-element-in-an-input.png

import { parseArgs } from 'node:util'
import puppeteer from 'puppeteer-core'
import { connect, frameWith, must, runnerPage, sleep } from './runner.mjs'

const { values: args } = parseArgs({
  options: {
    port: { type: 'string', default: '9333' },
    command: { type: 'string' },
    out: { type: 'string' },
    // CSS px; raise it when the command logs more lines than fit
    height: { type: 'string', default: '200' },
  },
})
const port = args.port
const command = must(args.command, '--command is required')
const out = must(args.out, '--out is required')
const height = Number(args.height)
const chromium = must(
  process.env.PLAYWRIGHT_BROWSERS_PATH,
  'Set PLAYWRIGHT_BROWSERS_PATH to the directory holding chromium'
)

// Build the inspector URL from the target id. The `devtoolsFrontendUrl` in the
// same list points to appspot, so don't use it.
/** @type {{ id: string, url: string }[]} */
const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()
const target = must(
  targets.find((t) => t.url.includes('/__/')),
  'No runner target in /json/list'
)
const inspector =
  `http://127.0.0.1:${port}/devtools/inspector.html` +
  `?ws=127.0.0.1:${port}/devtools/page/${target.id}&panel=console`

const viewer = await puppeteer.launch({
  executablePath: `${chromium}/chromium`,
  args: ['--no-sandbox'], // required when running as root
})
const devtools = await viewer.newPage()
// 820×200 CSS px at 2x by default: a 1640×400 PNG, tall enough to keep the
// first line
await devtools.setViewport({ width: 820, height, deviceScaleFactor: 2 })

// Turn off the screencast panel before the frontend attaches
await devtools.goto(`http://127.0.0.1:${port}/devtools/inspector.html`)
await devtools.evaluate(() => {
  localStorage.setItem('screencast-enabled', 'false') // current DevTools
  localStorage.setItem('screencastEnabled', 'false') // older DevTools
})
// Attach first: the frontend only shows messages logged after it connects
await devtools.goto(inspector)
await sleep(3000)

const app = await connect(port)
const page = must(await runnerPage(app), 'No runner page (URL with /__/)')
// Look the command up again each time: a re-render replaces the element
const button = async () =>
  must(
    await (await frameWith(page, command))?.$(`${command} .command-wrapper`),
    `No .command-wrapper in ${command}`
  )
// Clicking toggles the pin. If it was already pinned, the first click unpinned it.
await (await button()).click()
await sleep(500)
const pinned = await (
  await button()
).evaluate((el) => el.classList.contains('command-is-pinned'))
if (!pinned) await (await button()).click()

await sleep(1000)
await devtools.screenshot({ path: /** @type {`${string}.png`} */ (out) })
await app.disconnect()
await viewer.close()
