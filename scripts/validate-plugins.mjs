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
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { pluginsFileErrors } from './plugins-schema.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const FILE = resolve(ROOT, 'src/data/plugins.json')

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
  for (const error of errors) console.error(`  - ${error.replace(/`/g, '')}`)
  console.error(
    'See CONTRIBUTING.md, "Adding Plugins", for the fields an entry takes.'
  )
  process.exit(1)
}
const count = data.plugins.reduce((n, c) => n + c.plugins.length, 0)
console.log(
  `plugins.json OK: ${count} plugins in ${data.plugins.length} categories.`
)
