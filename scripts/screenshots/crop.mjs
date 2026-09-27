#!/usr/bin/env node
// @ts-check
//
// Crop Command Log rows from a runner that `cypress run --headed --no-exit`
// left open. Widens the Command Log so no row wraps, then clips a screenshot to
// the rows matching `--rows`.
//
//   node scripts/screenshots/crop.mjs --port 39121 \
//     --rows '.command-name-focused, .command-name-assert' \
//     --out make-assertion-about-focused-element.png

import { parseArgs } from 'node:util'
import { connect, frameWith, must, runnerPage } from './runner.mjs'

const { values: args } = parseArgs({
  options: {
    port: { type: 'string' },
    rows: { type: 'string' },
    out: { type: 'string' },
    width: { type: 'string', default: '470' }, // CSS px; 940 px in the PNG
    panel: { type: 'string', default: '700' }, // x to drag the panel edge to
  },
})
const port = must(args.port, '--port is required')
const rows = must(args.rows, '--rows is required')
const out = must(args.out, '--out is required')

const browser = await connect(port)
const page = must(await runnerPage(browser), 'No runner page (URL with /__/)')

// Widen the Command Log once. On an already wide panel, a drag selects text.
const handle = must(
  await (await page.$('[data-cy=panel2ResizeHandle]'))?.boundingBox(),
  'No Command Log resize handle'
)
if (handle.x < Number(args.panel) - 100) {
  const y = handle.y + handle.height / 2
  await page.mouse.move(handle.x + handle.width / 2, y)
  await page.mouse.down()
  await page.mouse.move(Number(args.panel), y, { steps: 10 })
  await page.mouse.up()
}

const frame = must(await frameWith(page, rows), `No rows match ${rows}`)
for (const target of [page, frame]) {
  await target.evaluate(() => getSelection()?.removeAllRanges())
}
await page.mouse.move(1200, 900) // no hover styles

const offset = must(
  await (await frame.frameElement())?.boundingBox(),
  'No Command Log frame element'
)
const boxes = await frame.$$eval(rows, (els) =>
  els.map((el) => el.getBoundingClientRect().toJSON())
)
const top = Math.min(...boxes.map((b) => b.top))
const bottom = Math.max(...boxes.map((b) => b.bottom))
const left = Math.min(...boxes.map((b) => b.left))

await page.screenshot({
  path: /** @type {`${string}.png`} */ (out),
  clip: {
    x: offset.x + left,
    y: offset.y + top - 4,
    width: Number(args.width),
    height: bottom - top + 8,
  },
})
await browser.disconnect()
