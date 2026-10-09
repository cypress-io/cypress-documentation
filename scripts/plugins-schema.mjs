// @ts-check
/**
 * Validate src/data/plugins.json against src/data/plugins.schema.json.
 *
 * `npm run lint:plugins` (every pull request, via `npm run lint`) and the
 * plugin review's entry check both call it, so they report the same rules.
 */

import { readFileSync } from 'node:fs'
import { Ajv } from 'ajv'

const schema = JSON.parse(
  readFileSync(
    new URL('../src/data/plugins.schema.json', import.meta.url),
    'utf8'
  )
)
const ajv = new Ajv({ allErrors: true })
ajv.addSchema(schema, 'plugins')
const validateFile = ajv.getSchema('plugins')
const validateEntry = ajv.getSchema('plugins#/definitions/plugin')

/** Ajv's message, prefixed with the field and suffixed with the offending
 *  property or the allowed values, which Ajv keeps out of the message. */
function message(error, path = error.instancePath) {
  const field = path.split('/').filter(Boolean).join('.')
  const p = /** @type {Record<string, any>} */ (error.params)
  const extra = p.additionalProperty ?? p.allowedValues?.join(', ')
  return `${field ? `${field} ` : ''}${error.message}${extra ? `: ${extra}` : ''}`
}

/** Errors for a single plugin entry. Empty when it's valid. */
export function pluginEntryErrors(entry) {
  return validateEntry(entry) ? [] : validateEntry.errors.map((e) => message(e))
}

/**
 * Errors for the whole file, each prefixed with the category and plugin it's
 * in, plus any plugin listed twice (same name or link), which a schema alone
 * can't express.
 */
export function pluginsFileErrors(data) {
  const errors = validateFile(data)
    ? []
    : validateFile.errors.map((e) => {
        const m = /^\/plugins\/(\d+)(?:\/plugins\/(\d+))?/.exec(e.instancePath)
        const category = m && data.plugins[m[1]]
        const plugin = m && m[2] && category?.plugins?.[m[2]]
        const where =
          [category?.name, plugin?.name].filter(Boolean).join(' › ') ||
          'plugins.json'
        return `${where}: ${message(e, e.instancePath.slice(m ? m[0].length : 0))}`
      })

  const seen = new Map()
  for (const category of Array.isArray(data?.plugins) ? data.plugins : []) {
    for (const plugin of Array.isArray(category?.plugins)
      ? category.plugins
      : []) {
      for (const [field, value] of [
        ['name', plugin.name],
        ['link', plugin.link],
      ]) {
        if (typeof value !== 'string') continue
        const key = `${field}:${value.toLowerCase().replace(/\/+$/, '')}`
        if (seen.has(key)) {
          errors.push(
            `${category.name} › ${plugin.name}: same ${field} "${value}" as an entry in ${seen.get(key)}`
          )
        } else {
          seen.set(key, category.name)
        }
      }
    }
  }
  return errors
}
