// @ts-check
/**
 * Validate src/data/plugins.json against src/data/plugins.schema.json, with
 * errors phrased for a contributor rather than in Ajv's own wording.
 *
 * `npm run lint:plugins` (every pull request, via `npm run lint`) and the
 * plugin review's entry check both call it, so they report the same rules.
 */

import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Ajv } from 'ajv'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
export const SCHEMA_PATH = resolve(ROOT, 'src/data/plugins.schema.json')

const schema = JSON.parse(readFileSync(SCHEMA_PATH, 'utf8'))
const ajv = new Ajv({ allErrors: true })
ajv.addSchema(schema, 'plugins')

const validateFile = ajv.getSchema('plugins')
const validateEntry = ajv.getSchema('plugins#/definitions/plugin')

const code = (value) => '`' + String(value).replace(/`/g, '') + '`'

// Field-specific wording for the rules a bare keyword can't explain.
const PATTERN_MESSAGES = {
  link: 'must be an https URL or a path on this site',
}

/** Turn one Ajv error into a sentence about the field it concerns. */
function describe(error) {
  const parts = error.instancePath.split('/').filter(Boolean)
  // For `/keywords/0`, name the list rather than the index.
  const field = parts.find((p) => !/^\d+$/.test(p)) || ''
  const subject = field ? code(field) : 'The entry'
  const p = /** @type {Record<string, any>} */ (error.params)

  switch (error.keyword) {
    case 'required':
      return `${code(p.missingProperty)} is missing`
    case 'additionalProperties':
      return `unknown field ${code(p.additionalProperty)}`
    case 'enum':
      return `${subject} must be ${p.allowedValues.map(code).join(' or ')}`
    case 'minLength':
      return `${subject} is empty`
    case 'pattern':
      return `${subject} ${PATTERN_MESSAGES[field] || 'has an unexpected format'}`
    case 'type':
      if (parts.length > 1) return `${subject} must contain only ${p.type}s`
      return `${subject} must be ${p.type === 'array' ? 'a list' : `a ${p.type}`}`
    default:
      return `${subject} ${error.message}`
  }
}

/** Errors for a single plugin entry, as sentences. Empty when it's valid. */
export function pluginEntryErrors(entry) {
  if (validateEntry(entry)) return []
  return [...new Set((validateEntry.errors || []).map(describe))]
}

/**
 * Errors for the whole file, each prefixed with where it is, plus any plugin
 * listed twice (same name or link), which a schema alone can't express.
 */
export function pluginsFileErrors(data) {
  const errors = []
  if (!validateFile(data)) {
    for (const error of validateFile.errors || []) {
      errors.push(
        `${locate(data, error.instancePath)}: ${describe(locateRelative(error))}`
      )
    }
  }

  const seen = new Map()
  for (const category of (data &&
    Array.isArray(data.plugins) &&
    data.plugins) ||
    []) {
    for (const plugin of (category &&
      Array.isArray(category.plugins) &&
      category.plugins) ||
      []) {
      const keys = [
        typeof plugin.name === 'string' && `name ${code(plugin.name)}`,
        typeof plugin.link === 'string' && `link ${code(plugin.link)}`,
      ]
      for (const key of keys) {
        if (!key) continue
        const id = key.toLowerCase().replace(/\/+`$/, '`')
        if (seen.has(id)) {
          errors.push(
            `${category.name} › ${plugin.name}: same ${key} as an entry in ${seen.get(id)}`
          )
        } else {
          seen.set(id, category.name)
        }
      }
    }
  }
  return [...new Set(errors)]
}

/** "Category › plugin" for an error path like /plugins/2/plugins/5/link. */
function locate(data, instancePath) {
  const m = /^\/plugins\/(\d+)(?:\/plugins\/(\d+))?/.exec(instancePath)
  if (!m) return 'plugins.json'
  const category = data.plugins[Number(m[1])] || {}
  const where = [category.name || `category ${Number(m[1]) + 1}`]
  if (m[2] !== undefined) {
    const plugin = (category.plugins || [])[Number(m[2])] || {}
    where.push(plugin.name || `entry ${Number(m[2]) + 1}`)
  }
  return where.join(' › ')
}

/** Strip the category and entry prefix so `describe` sees the field path. */
function locateRelative(error) {
  return {
    ...error,
    instancePath: error.instancePath.replace(
      /^\/plugins\/\d+(\/plugins\/\d+)?/,
      ''
    ),
  }
}
