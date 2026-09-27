#!/usr/bin/env node
// @ts-check
//
// Drive the Launchpad of a `cypress open` session to run one spec in Electron,
// and wait until the command you'll click exists in the Command Log.
//
//   node scripts/screenshots/open-spec.mjs --spec focused.cy.js \
//     --command .command-name-focused

import { parseArgs } from 'node:util'
import { connect, frameWith, must, runnerPage, sleep } from './runner.mjs'

const { values: args } = parseArgs({
  options: {
    port: { type: 'string', default: '9333' },
    spec: { type: 'string' },
    command: { type: 'string' },
  },
})
const spec = must(args.spec, '--spec is required')
const command = must(args.command, '--command is required')

const browser = await connect(args.port)

if (!(await runnerPage(browser))) {
  const launchpad = must(
    (await browser.pages()).find((p) => p.url().includes('__launchpad')),
    'No Launchpad page'
  )
  const whatsNew = await launchpad
    .waitForSelector('::-p-aria(Continue[role="button"])', {
      visible: true,
      timeout: 5000,
    })
    .catch(() => null)
  if (whatsNew) await whatsNew.click()
  await launchpad.locator('::-p-text(Start E2E Testing in Electron)').click()
}

// The runner opens in its own window, before its URL reaches /__/
let page
for (let i = 0; i < 60 && !page; i++) {
  page = await runnerPage(browser)
  if (!page) await sleep(1000)
}
page = must(page, 'The runner window never opened')

// Click the spec. Changing the URL hash instead closes the runner window.
await page.locator(`::-p-text(${spec})`).setTimeout(60000).click()

// Wait for the test to finish, not only for the row to appear: the Command Log
// can still re-render while the test runs.
const done = async () => {
  const frame = await frameWith(page, command)
  return Boolean(frame && (await frame.$('.runnable-passed, .runnable-failed')))
}
for (let i = 0; i < 60 && !(await done()); i++) {
  await sleep(1000)
}
must((await done()) || null, `${command} never appeared in a finished test`)
await browser.disconnect()
