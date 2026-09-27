#!/usr/bin/env node
// @ts-check
//
// Pin a Command Log command's snapshot in a `cypress open` session and capture
// the runner, so the app preview shows the element the command highlighted.
// Clips off the left sidebar and the empty space below the Command Log.
//
//   node scripts/screenshots/pin.mjs --command .command-name-focused \
//     --out command-log-focused-tab-snapshot.png

import { parseArgs } from 'node:util'
import { connect, frameWith, must, runnerPage, sleep } from './runner.mjs'

const { values: args } = parseArgs({
  options: {
    port: { type: 'string', default: '9333' },
    command: { type: 'string' },
    // Which matching row to pin, from 1; the default is the last one
    nth: { type: 'string' },
    out: { type: 'string' },
  },
})
const command = must(args.command, '--command is required')
const out = must(args.out, '--out is required')

const browser = await connect(args.port)
const page = must(await runnerPage(browser), 'No runner page (URL with /__/)')
const frame = must(await frameWith(page, command), `No rows match ${command}`)

const rows = await frame.$$(`${command} .command-wrapper`)
const row = must(
  rows[args.nth ? Number(args.nth) - 1 : rows.length - 1],
  `No row ${args.nth} of ${rows.length} matching ${command}`
)

// A click toggles the pin, so only click when nothing is pinned yet
const banner = () =>
  page.evaluate(() => {
    const el = [...document.querySelectorAll('[data-cy=aut-panel] *')]
      .filter((e) => /^Pinned/.test(e.textContent?.trim() ?? ''))
      .find((e) => e.textContent?.includes('Highlights'))
    return el ? el.getBoundingClientRect().toJSON() : null
  })
if (!(await banner())) await row.click()
await sleep(1000)
const pinned = must(await banner(), 'The snapshot never pinned')
await page.mouse.move(0, 0) // no hover styles or tooltips on the rows
await sleep(300)

// From the sidebar's right edge down to the lower of the banner and the log
const sidebar = must(
  await (await page.$('[data-cy=sidebar]'))?.boundingBox(),
  'No sidebar'
)
const offset = must(
  await (await frame.frameElement())?.boundingBox(),
  'No Command Log frame element'
)
const logBottom = await frame.$$eval('.runnable', (els) =>
  Math.max(...els.map((el) => el.getBoundingClientRect().bottom))
)
const { width } = await page.evaluate(() => ({ width: innerWidth }))
const bottom = Math.max(pinned.bottom, offset.y + logBottom) + 16

await page.screenshot({
  path: /** @type {`${string}.png`} */ (out),
  clip: {
    x: sidebar.x + sidebar.width,
    y: 0,
    width: width - sidebar.x - sidebar.width,
    height: bottom,
  },
})
await browser.disconnect()
