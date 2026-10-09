#!/usr/bin/env node
// @ts-check
/**
 * Check src/data/plugins.json against src/data/plugins.schema.json, and that no
 * plugin is listed twice. Runs as part of `npm run lint`, so every pull request
 * gets it, forks included, with no secrets needed.
 *
 *   npm run lint:plugins
 */

import { readFile } from 'node:fs/promises'
import { pluginsFileErrors } from './plugins-schema.mjs'

const FILE = new URL('../src/data/plugins.json', import.meta.url)

let data
try {
  data = JSON.parse(await readFile(FILE, 'utf8'))
} catch (error) {
  console.error(`src/data/plugins.json isn't valid JSON: ${error.message}`)
  process.exit(1)
}

const errors = pluginsFileErrors(data)
if (errors.length) {
  console.error(`src/data/plugins.json has ${errors.length} problem(s):`)
  for (const error of errors) console.error(`  - ${error}`)
  console.error(
    'See CONTRIBUTING.md, "Adding Plugins", for the fields an entry takes.'
  )
  process.exit(1)
}
const count = data.plugins.reduce((n, c) => n + c.plugins.length, 0)
console.log(
  `plugins.json OK: ${count} plugins in ${data.plugins.length} categories.`
)
