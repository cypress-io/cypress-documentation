// @ts-check
//
// Shared helpers for the Cypress App screenshot scripts in this directory.
// They attach to a browser that Cypress launched, so they never close it: see
// AGENTS.md in this directory. README.md covers how to capture.

import puppeteer from 'puppeteer-core'

/** @param {number} ms */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Return `value`, or exit with `message` when it is missing.
 *
 * @template T
 * @param {T | null | undefined} value
 * @param {string} message
 * @returns {T}
 */
export function must(value, message) {
  if (value === null || value === undefined) {
    console.error(message)
    process.exit(1)
  }
  return value
}

/**
 * Attach to the browser Cypress launched. `defaultViewport: null` keeps each
 * page's real window size; Puppeteer's default resizes pages to 800×600.
 * End with `browser.disconnect()`: on a connected browser, `close()` quits it.
 *
 * @param {string} port
 */
export function connect(port) {
  return puppeteer.connect({
    browserURL: `http://127.0.0.1:${port}`,
    defaultViewport: null,
  })
}

/**
 * The runner page, the one whose URL contains `/__/`.
 *
 * @param {import('puppeteer-core').Browser} browser
 */
export async function runnerPage(browser) {
  return (await browser.pages()).find((p) => p.url().includes('/__/'))
}

/**
 * The frame that holds an element matching `selector`. The Command Log lives
 * in an about:blank iframe inside the runner page.
 *
 * @param {import('puppeteer-core').Page} page
 * @param {string} selector
 */
export async function frameWith(page, selector) {
  for (const frame of page.frames()) {
    if (await frame.$(selector)) return frame
  }
}
